<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:products,name',
            'category_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:999999.99',
            'stock' => 'required|integer|min:0|max:999999',
            'description' => 'nullable|string|max:2000',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:5120',
            'gallery' => 'nullable|array|max:10',
            'gallery.*' => 'image|mimes:jpg,jpeg,png|max:5120',
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi',
            'name.unique' => 'Nama produk sudah terdaftar',
            'category_name.required' => 'Kategori wajib dipilih',
            'price.required' => 'Harga wajib diisi',
            'price.min' => 'Harga tidak boleh negatif',
            'stock.required' => 'Stok wajib diisi',
            'image.required' => 'Gambar produk wajib diunggah',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus JPG, JPEG, atau PNG',
            'image.max' => 'Ukuran gambar maksimal 5MB',
        ];
    }
}
