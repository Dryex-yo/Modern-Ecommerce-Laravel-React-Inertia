<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
        $productId = $this->route('product')?->id;

        return [
            'name' => "required|string|max:255|unique:products,name,{$productId}",
            'category_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:999999.99',
            'stock' => 'required|integer|min:0|max:999999',
            'description' => 'nullable|string|max:2000',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:6000',
            'gallery' => 'nullable|array|max:10',
            'gallery.*' => 'image|mimes:jpg,jpeg,png|max:6000',
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
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus JPG, JPEG, atau PNG',
        ];
    }
}
