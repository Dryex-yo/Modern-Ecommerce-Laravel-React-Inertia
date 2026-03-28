<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Transaction;
use App\Services\PaymentGatewayService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    private PaymentGatewayService $paymentGateway;

    public function __construct(PaymentGatewayService $paymentGateway)
    {
        $this->paymentGateway = $paymentGateway;
    }

    /**
     * Show payment page for an order
     */
    public function show(Order $order): Response|RedirectResponse
    {
        // Verify order belongs to authenticated user
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Anda tidak berhak mengakses pesanan ini.');
        }

        // Check if order already has a payment
        $transaction = $order->transactions()->latest()->first();

        // If transaction exists and is pending, show the payment page
        if ($transaction && $transaction->isPending()) {
            return Inertia::render('User/Payment', [
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_price' => $order->total_price,
                    'status' => $order->status,
                    'payment_method' => $order->payment_method,
                    'created_at' => $order->created_at->toDateTimeString(),
                ],
                'transaction' => [
                    'id' => $transaction->id,
                    'transaction_id' => $transaction->transaction_id,
                    'snap_url' => $transaction->snap_url,
                    'status' => $transaction->status,
                    'amount' => $transaction->amount,
                ],
                'snapUrl' => $transaction->snap_url,
            ]);
        }

        // If no pending transaction, redirect to order detail
        return redirect()->route('orders.show', $order->id)
            ->with('message', 'Pesanan ini sudah memiliki pembayaran.');
    }

    /**
     * Initiate payment for an order
     */
    public function initiate(Order $order): RedirectResponse
    {
        // Verify order belongs to authenticated user
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Anda tidak berhak mengakses pesanan ini.');
        }

        // Check if order can be paid
        if ($order->status !== 'pending') {
            return back()->with('error', 'Pesanan tidak dapat dibayar pada status saat ini.');
        }

        try {
            $user = Auth::user();

            // Create payment transaction
            $transaction = $this->paymentGateway->createPaymentTransaction($order, $user);

            return redirect()->route('payment.show', $order->id)
                ->with('message', 'Silakan lanjutkan pembayaran Anda.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membuat transaksi pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Check payment status
     */
    public function checkStatus(Order $order): \Illuminate\Http\JsonResponse
    {
        if ($order->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $transaction = $order->transactions()->latest()->first();

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        // Get latest status from Midtrans
        $midtransStatus = $this->paymentGateway->checkStatus($transaction->transaction_id);

        return response()->json([
            'transaction_id' => $transaction->transaction_id,
            'status' => $transaction->status,
            'midtrans_status' => $midtransStatus,
            'order_status' => $transaction->order->status,
        ]);
    }

    /**
     * Handle payment success callback (from client-side Snap)
     */
    public function success(Order $order): Response
    {
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Anda tidak berhak mengakses pesanan ini.');
        }

        $transaction = $order->transactions()->latest()->first();

        return Inertia::render('User/PaymentSuccess', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_price' => $order->total_price,
                'status' => $order->status,
            ],
            'transaction' => $transaction ? [
                'id' => $transaction->id,
                'status' => $transaction->status,
                'settled_at' => $transaction->settled_at,
            ] : null,
        ]);
    }

    /**
     * Handle payment failure callback
     */
    public function failed(Order $order): Response
    {
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Anda tidak berhak mengakses pesanan ini.');
        }

        return Inertia::render('User/PaymentFailed', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_price' => $order->total_price,
            ],
        ]);
    }

    /**
     * Cancel payment and order
     */
    public function cancel(Order $order): RedirectResponse
    {
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Anda tidak berhak mengakses pesanan ini.');
        }

        $transaction = $order->transactions()->latest()->first();

        if ($transaction && $transaction->isPending()) {
            try {
                // Cancel transaction with Midtrans
                $this->paymentGateway->cancelTransaction($transaction->transaction_id);

                // Update transaction status
                $transaction->update(['status' => 'cancel']);

                // Update order status
                $order->update(['status' => 'canceled']);

                // Restore product stock
                foreach ($order->items as $item) {
                    $item->product->increment('stock', $item->quantity);
                }

                return back()->with('message', 'Pesanan telah dibatalkan.');
            } catch (\Exception $e) {
                return back()->with('error', 'Gagal membatalkan pesanan: ' . $e->getMessage());
            }
        }

        return back()->with('error', 'Tidak dapat membatalkan pesanan ini.');
    }
}
