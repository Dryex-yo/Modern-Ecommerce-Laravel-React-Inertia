<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentGatewayService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class PaymentWebhookController extends Controller
{
    private PaymentGatewayService $paymentGateway;

    public function __construct(PaymentGatewayService $paymentGateway)
    {
        $this->paymentGateway = $paymentGateway;
    }

    /**
     * Handle Midtrans webhook notification
     *
     * This endpoint receives payment notifications from Midtrans
     * It updates the transaction status and order status accordingly
     */
    public function midtransCallback(Request $request): JsonResponse
    {
        try {
            // Get the JSON request from Midtrans
            $notification = $request->all();

            Log::info('Midtrans Webhook Notification:', $notification);

            // Handle the notification through the service
            $result = $this->paymentGateway->handleNotification($notification);

            if ($result) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Notification handled successfully',
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to handle notification',
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Midtrans Webhook Error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
