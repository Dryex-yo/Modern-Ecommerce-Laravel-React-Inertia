<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreAddressRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check() && Auth::user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'label' => 'required|string|max:100',
            'receiver_name' => 'required|string|max:100',
            'phone_number' => 'required|string|max:20|regex:/^[0-9\s\-\+]+$/',
            'full_address' => 'required|string|max:500|min:10',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'district' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20|regex:/^[0-9\s\-]+$/',
            'is_default' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'label.required' => 'Label alamat wajib diisi',
            'label.max' => 'Label alamat maksimal 100 karakter',
            'receiver_name.required' => 'Nama penerima wajib diisi',
            'receiver_name.max' => 'Nama penerima maksimal 100 karakter',
            'phone_number.required' => 'Nomor telepon wajib diisi',
            'phone_number.max' => 'Nomor telepon maksimal 20 karakter',
            'phone_number.regex' => 'Format nomor telepon tidak valid',
            'full_address.required' => 'Alamat lengkap wajib diisi',
            'full_address.min' => 'Alamat lengkap minimal 10 karakter',
            'full_address.max' => 'Alamat lengkap maksimal 500 karakter',
            'province.required' => 'Provinsi wajib diisi',
            'province.max' => 'Nama provinsi maksimal 100 karakter',
            'city.required' => 'Kota wajib diisi',
            'city.max' => 'Nama kota maksimal 100 karakter',
            'district.required' => 'Kecamatan/Kabupaten wajib diisi',
            'district.max' => 'Nama kecamatan/kabupaten maksimal 100 karakter',
            'postal_code.required' => 'Kode pos wajib diisi',
            'postal_code.max' => 'Kode pos maksimal 20 karakter',
            'postal_code.regex' => 'Kode pos hanya boleh berisi angka, spasi, dan tanda hubung',
            'is_default.boolean' => 'Status default harus boolean',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean up postal code - remove extra spaces
        if ($this->has('postal_code')) {
            $this->merge([
                'postal_code' => trim(preg_replace('/\s+/', ' ', $this->input('postal_code'))),
            ]);
        }

        // Clean up full address
        if ($this->has('full_address')) {
            $this->merge([
                'full_address' => trim($this->input('full_address')),
            ]);
        }

        // Clean up city
        if ($this->has('city')) {
            $this->merge([
                'city' => trim($this->input('city')),
            ]);
        }

        // Clean up label
        if ($this->has('label')) {
            $this->merge([
                'label' => trim($this->input('label')),
            ]);
        }
    }

    /**
     * Check if address data is valid.
     */
    public function isValidAddress(): bool
    {
        return $this->isValidLabel() && 
               $this->isValidFullAddress() && 
               $this->isValidCity() && 
               $this->isValidPostalCode();
    }

    /**
     * Check if label is valid.
     */
    private function isValidLabel(): bool
    {
        $label = trim($this->input('label', ''));
        return !empty($label) && strlen($label) <= 100;
    }

    /**
     * Check if full address is valid.
     */
    private function isValidFullAddress(): bool
    {
        $address = trim($this->input('full_address', ''));
        return !empty($address) && strlen($address) >= 10 && strlen($address) <= 500;
    }

    /**
     * Check if city is valid.
     */
    private function isValidCity(): bool
    {
        $city = trim($this->input('city', ''));
        return !empty($city) && strlen($city) <= 100 && ctype_alpha($city . ' ') ;
    }

    /**
     * Check if postal code is valid.
     */
    private function isValidPostalCode(): bool
    {
        $postalCode = trim($this->input('postal_code', ''));
        return !empty($postalCode) && preg_match('/^[0-9\s\-]+$/', $postalCode);
    }
}

