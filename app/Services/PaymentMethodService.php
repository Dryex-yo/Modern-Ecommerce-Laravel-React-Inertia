<?php

namespace App\Services;

use App\Models\PaymentMethod;
use App\Models\User;

class PaymentMethodService
{
    /**
     * Create a new payment method for user
     */
    public function createPaymentMethod(User $user, array $data): PaymentMethod
    {
        // Jika ini akan menjadi default, set yang lain menjadi non-default
        if (!empty($data['is_default']) && $data['is_default']) {
            $user->paymentMethods()->update(['is_default' => false]);
        }

        // Jika user belum punya payment method dengan is_default = true, set yang baru jadi default
        if (!$user->paymentMethods()->where('is_default', true)->exists()) {
            $data['is_default'] = true;
        }

        return $user->paymentMethods()->create($data);
    }

    /**
     * Update existing payment method
     */
    public function updatePaymentMethod(PaymentMethod $paymentMethod, array $data): PaymentMethod
    {
        // Jika ini akan menjadi default, set yang lain menjadi non-default
        if (!empty($data['is_default']) && $data['is_default']) {
            $paymentMethod->user->paymentMethods()
                ->where('id', '!=', $paymentMethod->id)
                ->update(['is_default' => false]);
        }

        $paymentMethod->update($data);
        return $paymentMethod;
    }

    /**
     * Delete payment method and set another as default if needed
     */
    public function deletePaymentMethod(PaymentMethod $paymentMethod): bool
    {
        $wasDefault = $paymentMethod->is_default;
        $userId = $paymentMethod->user_id;

        // Delete the payment method
        $deleted = $paymentMethod->delete();

        // If deleted method was default, set another as default
        if ($deleted && $wasDefault) {
            $nextMethod = PaymentMethod::where('user_id', $userId)->first();
            if ($nextMethod) {
                $nextMethod->update(['is_default' => true]);
            }
        }

        return $deleted;
    }

    /**
     * Get all payment methods for user
     */
    public function getUserPaymentMethods(User $user)
    {
        return $user->paymentMethods()->get();
    }

    /**
     * Get default payment method for user
     */
    public function getDefaultPaymentMethod(User $user): ?PaymentMethod
    {
        return $user->paymentMethods()->where('is_default', true)->first();
    }
}
