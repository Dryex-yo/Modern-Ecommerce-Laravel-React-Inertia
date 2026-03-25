<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAddressRequest;
use App\Http\Requests\UpdateAddressRequest;
use App\Services\AddressService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Address;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class AddressController extends Controller
{
    public function __construct(private AddressService $addressService)
    {}

    /**
     * Show the form for creating a new address.
     */
    public function create(): Response
    {
        return Inertia::render('Profile/Partials/AddressCreate'); 
    }

    /**
     * Store a newly created address in storage.
     */
    public function store(StoreAddressRequest $request): RedirectResponse
    {
        $this->addressService->createAddress(
            Auth::user(),
            $request->validated()
        );

        return redirect()->route('profile.edit')->with('message', 'Alamat berhasil ditambah!');
    }

    /**
     * Show the form for editing the specified address.
     */
    public function edit(Address $address): Response
    {
        // Authorize: pastikan user hanya bisa edit alamat miliknya sendiri
        $this->authorizeAddress($address);

        return Inertia::render('Profile/Partials/AddressEdit', [
            'address' => $address,
        ]);
    }

    /**
     * Update the specified address in storage.
     */
    public function update(UpdateAddressRequest $request, Address $address): RedirectResponse
    {
        // Authorization check
        $this->authorizeAddress($address);

        $this->addressService->updateAddress($address, $request->validated());

        return redirect()->route('profile.edit')->with('message', 'Alamat berhasil diperbarui!');
    }

    /**
     * Remove the specified address from storage.
     */
    public function destroy(Address $address): RedirectResponse
    {
        // Authorize: pastikan user hanya bisa menghapus alamat miliknya sendiri
        $this->authorizeAddress($address);

        $this->addressService->deleteAddress($address);

        return redirect()->route('profile.edit')->with('message', 'Alamat berhasil dihapus!');
    }

    /**
     * Helper method to check if user owns the address
     */
    private function authorizeAddress(Address $address): void
    {
        if (Auth::id() !== $address->user_id) {
            abort(403, 'Anda tidak berhak mengakses alamat ini.');
        }
    }
}

