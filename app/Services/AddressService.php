<?php

namespace App\Services;

use App\Models\Address;
use App\Models\User;

class AddressService
{
    /**
     * Create a new address for user
     */
    public function createAddress(User $user, array $data): Address
    {
        // Jika ini akan menjadi default, set yang lain menjadi non-default
        if (!empty($data['is_default']) && $data['is_default']) {
            $user->addresses()->update(['is_default' => false]);
        }

        // Jika user belum punya address dengan is_default = true, set yang baru jadi default
        if (!$user->addresses()->where('is_default', true)->exists()) {
            $data['is_default'] = true;
        }

        return $user->addresses()->create($data);
    }

    /**
     * Update existing address
     */
    public function updateAddress(Address $address, array $data): Address
    {
        // Jika ini akan menjadi default, set yang lain menjadi non-default
        if (!empty($data['is_default']) && $data['is_default']) {
            $address->user->addresses()
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($data);
        return $address;
    }

    /**
     * Delete address and set another as default if needed
     */
    public function deleteAddress(Address $address): bool
    {
        $wasDefault = $address->is_default;
        $userId = $address->user_id;

        // Delete the address
        $deleted = $address->delete();

        // If deleted address was default, set another as default
        if ($deleted && $wasDefault) {
            $nextAddress = Address::where('user_id', $userId)->first();
            if ($nextAddress) {
                $nextAddress->update(['is_default' => true]);
            }
        }

        return $deleted;
    }

    /**
     * Get all addresses for user
     */
    public function getUserAddresses(User $user)
    {
        return $user->addresses()->get();
    }

    /**
     * Get default address for user
     */
    public function getDefaultAddress(User $user): ?Address
    {
        return $user->addresses()->where('is_default', true)->first();
    }
}
