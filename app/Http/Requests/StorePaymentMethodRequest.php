<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class StorePaymentMethodRequest extends FormRequest
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
        $rules = [
            'type' => 'required|in:card,ewallet,bank_transfer',
            'brand' => 'required|string|max:100',
            'is_default' => 'nullable|boolean',
        ];

        // Conditional rules based on payment method type
        if ($this->input('type') === 'card') {
            $rules = array_merge($rules, [
                'last4' => 'required|string|size:4',
                'exp_month' => 'required|string|size:2|numeric',
                'exp_year' => 'required|string|size:4|numeric',
            ]);
        } elseif ($this->input('type') === 'ewallet') {
            $rules = array_merge($rules, [
                'phone_number' => 'required|string|max:20',
            ]);
        } elseif ($this->input('type') === 'bank_transfer') {
            // Bank transfer might have different fields
            // Add as needed
        }

        return $rules;
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Tipe pembayaran wajib dipilih',
            'type.in' => 'Tipe pembayaran tidak valid',
            'brand.required' => 'Brand pembayaran wajib diisi',
            'brand.max' => 'Brand pembayaran maksimal 100 karakter',
            'last4.required' => '4 digit terakhir kartu wajib diisi',
            'last4.size' => '4 digit terakhir harus 4 karakter',
            'last4.string' => '4 digit terakhir harus berupa teks',
            'exp_month.required' => 'Bulan berlaku wajib diisi',
            'exp_month.size' => 'Bulan harus 2 digit (01-12)',
            'exp_month.numeric' => 'Bulan harus berupa angka',
            'exp_year.required' => 'Tahun berlaku wajib diisi',
            'exp_year.size' => 'Tahun harus 4 digit',
            'exp_year.numeric' => 'Tahun harus berupa angka',
            'phone_number.required' => 'Nomor telepon wajib diisi untuk e-wallet',
            'phone_number.max' => 'Nomor telepon maksimal 20 karakter',
            'is_default.boolean' => 'Status default harus boolean',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure type is lowercase
        if ($this->has('type')) {
            $this->merge([
                'type' => strtolower($this->input('type')),
            ]);
        }

        // Clean up phone number - remove spaces and special chars
        if ($this->has('phone_number')) {
            $this->merge([
                'phone_number' => preg_replace('/[^0-9+]/', '', $this->input('phone_number')),
            ]);
        }

        // Ensure last4 is numeric only
        if ($this->has('last4')) {
            $this->merge([
                'last4' => preg_replace('/[^0-9]/', '', $this->input('last4')),
            ]);
        }
    }

    /**
     * Check if payment method is valid based on type.
     */
    public function isValidPaymentMethod(): bool
    {
        $type = $this->input('type');

        switch ($type) {
            case 'card':
                // Validate card format
                return $this->hasCardFields();
            case 'ewallet':
                // Validate e-wallet format
                return $this->hasEwalletFields();
            case 'bank_transfer':
                // Validate bank transfer format
                return true; // Customize as needed
            default:
                return false;
        }
    }

    /**
     * Check if card fields are complete.
     */
    private function hasCardFields(): bool
    {
        return $this->has('last4') && 
               $this->has('exp_month') && 
               $this->has('exp_year') &&
               strlen($this->input('last4', '')) === 4;
    }

    /**
     * Check if e-wallet fields are complete.
     */
    private function hasEwalletFields(): bool
    {
        return $this->has('phone_number') && 
               !empty($this->input('phone_number'));
    }
}

