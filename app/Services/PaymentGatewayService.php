<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;
use Midtrans\Transaction as MidtransTransaction;

class PaymentGatewayService
{
    private string $serverKey;
    private string $clientKey;
    private bool $isProduction;

    public function __construct()
    {
        $this->serverKey = config('midtrans.server_key');
        $this->clientKey = config('midtrans.client_key');
        $this->isProduction = config('midtrans.is_production', false);

        // Initialize Midtrans Config
        Config::$serverKey = $this->serverKey;
        Config::$clientKey = $this->clientKey;
        Config::$isProduction = $this->isProduction;
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    /**
     * Create a payment transaction
     *
     * @param Order $order
     * @param User $user
     * @return Transaction
     * @throws \Exception
     */
    public function createPaymentTransaction(Order $order, User $user): Transaction
    {
        try {
            // Generate transaction ID
            $transactionId = 'TRX-' . $order->id . '-' . time();

            // Prepare transaction items for Midtrans
            $items = [];
            
            // Add order items
            foreach ($order->items as $item) {
                $items[] = [
                    'id' => 'ITEM-' . $item->id,
                    'price' => (int) $item->price,
                    'quantity' => (int) $item->quantity,
                    'name' => $item->product->name,
                ];
            }

            // Add shipping cost
            if ($order->shipping_cost > 0) {
                $items[] = [
                    'id' => 'SHIPPING',
                    'price' => (int) $order->shipping_cost,
                    'quantity' => 1,
                    'name' => 'Biaya Pengiriman (' . ucfirst(str_replace('_', ' ', $order->shipping_method)) . ')',
                ];
            }

            // Add COD fee if applicable
            // Check if order has COD payment method and if there's an additional fee
            if ($order->payment_method === 'cod') {
                $codFee = 5000; // Rp 5.000 COD fee
                $items[] = [
                    'id' => 'COD_FEE',
                    'price' => $codFee,
                    'quantity' => 1,
                    'name' => 'Biaya Penanganan COD',
                ];
            }

            // Calculate total from items to verify
            $itemTotal = array_reduce($items, function ($carry, $item) {
                return $carry + ($item['price'] * $item['quantity']);
            }, 0);

            // Prepare Midtrans payload
            $payload = [
                'transaction_details' => [
                    'order_id' => $transactionId,
                    'gross_amount' => (int) $order->total_price,
                ],
                'item_details' => $items,
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '-',
                ],
                'expiry' => [
                    'unit' => 'hours',
                    'length' => 24, // 24 hours expiration
                ],
            ];

            // Create Snap token
            $snapToken = Snap::getSnapToken($payload);

            // Build snap URL
            $snapUrl = 'https://app.sandbox.midtrans.com/snap/v2/vtweb/' . $snapToken;
            if ($this->isProduction) {
                $snapUrl = 'https://app.midtrans.com/snap/v2/vtweb/' . $snapToken;
            }

            // Create transaction record in database
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'order_id' => $order->id,
                'transaction_id' => $transactionId,
                'order_ref' => $order->order_number,
                'amount' => $order->total_price,
                'status' => 'pending',
                'snap_url' => $snapUrl,
                'expired_at' => Carbon::now()->addHours(24),
                'midtrans_response' => [
                    'snap_token' => $snapToken,
                    'payload' => $payload,
                ],
            ]);

            return $transaction;
        } catch (\Exception $e) {
            Log::error('Midtrans Payment Creation Error: ' . $e->getMessage());
            throw new \Exception('Gagal membuat transaksi pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Handle Midtrans webhook notification
     *
     * @param array $notification
     * @return bool
     * @throws \Exception
     */
    public function handleNotification(array $notification): bool
    {
        try {
            // Verify notification
            $notif = new Notification();
            
            // Extract transaction data from notification
            $transactionStatus = $notif->transaction_status;
            $fraudStatus = $notif->fraud_status ?? null;
            $orderId = $notif->order_id;
            $paymentType = $notif->payment_type ?? null;

            // Find transaction record
            $transaction = Transaction::where('transaction_id', $orderId)->first();

            if (!$transaction) {
                Log::warning('Transaction not found for order_id: ' . $orderId);
                return false;
            }

            // Update transaction based on status
            switch ($transactionStatus) {
                case 'capture':
                    // Handle capture status (credit card specific)
                    if ($fraudStatus === 'challenge') {
                        $transaction->status = 'pending';
                    } elseif ($fraudStatus === 'accept') {
                        $transaction->status = 'settlement';
                        $transaction->settled_at = Carbon::now();
                        $transaction->order->update(['status' => 'processing']);
                    }
                    break;

                case 'settlement':
                    // Payment successful
                    $transaction->status = 'settlement';
                    $transaction->settled_at = Carbon::now();
                    $transaction->payment_method = $paymentType;
                    $transaction->order->update(['status' => 'processing']);
                    break;

                case 'pending':
                    // Payment pending
                    $transaction->status = 'pending';
                    $transaction->payment_method = $paymentType;
                    break;

                case 'deny':
                    // Payment denied
                    $transaction->status = 'deny';
                    $transaction->order->update(['status' => 'canceled']);
                    // Restore product stock
                    $this->restoreProductStock($transaction->order);
                    break;

                case 'cancel':
                    // Payment canceled
                    $transaction->status = 'cancel';
                    $transaction->order->update(['status' => 'canceled']);
                    // Restore product stock
                    $this->restoreProductStock($transaction->order);
                    break;

                case 'expire':
                    // Payment expired
                    $transaction->status = 'expire';
                    // Don't update order status immediately for expire
                    break;

                case 'failure':
                    // Payment failure
                    $transaction->status = 'failure';
                    $transaction->order->update(['status' => 'failed']);
                    // Restore product stock
                    $this->restoreProductStock($transaction->order);
                    break;
            }

            $transaction->midtrans_response = $notif;
            $transaction->save();

            return true;
        } catch (\Exception $e) {
            Log::error('Midtrans Notification Handler Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Check transaction status with Midtrans
     *
     * @param string $transactionId
     * @return array
     */
    public function checkStatus(string $transactionId): array
    {
        try {
            $status = MidtransTransaction::status($transactionId);
            return (array) $status;
        } catch (\Exception $e) {
            Log::error('Midtrans Status Check Error: ' . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Cancel transaction
     *
     * @param string $transactionId
     * @return bool
     */
    public function cancelTransaction(string $transactionId): bool
    {
        try {
            MidtransTransaction::cancel($transactionId);
            return true;
        } catch (\Exception $e) {
            Log::error('Midtrans Cancel Error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Restore product stock when payment fails
     *
     * @param Order $order
     * @return void
     */
    private function restoreProductStock(Order $order): void
    {
        foreach ($order->items as $item) {
            $item->product->increment('stock', $item->quantity);
        }
    }

    /**
     * Get Snap token for payment
     *
     * @param Transaction $transaction
     * @return string|null
     */
    public function getSnapToken(Transaction $transaction): ?string
    {
        return $transaction->midtrans_response['snap_token'] ?? null;
    }
}
