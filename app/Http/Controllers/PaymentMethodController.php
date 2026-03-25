<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentMethodRequest;
use App\Services\PaymentMethodService;
use Illuminate\Http\RedirectResponse;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Auth;

class PaymentMethodController extends Controller
{
    public function __construct(private PaymentMethodService $paymentMethodService)
    {}

    public function store(StorePaymentMethodRequest $request): RedirectResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return back()->with('error', 'User tidak terautentikasi.');
        }

        $this->paymentMethodService->createPaymentMethod(
            $user,
            $request->validated()
        );

        return back()->with('success', 'Metode pembayaran berhasil ditautkan!');
    }

    public function destroy(int $id): RedirectResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return back()->with('error', 'User tidak terautentikasi.');
        }

        // Get payment method with ownership check (only user's own methods)
        $paymentMethod = PaymentMethod::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $this->paymentMethodService->deletePaymentMethod($paymentMethod);
        
        return back()->with('success', 'Metode pembayaran berhasil dihapus!');
    }
}