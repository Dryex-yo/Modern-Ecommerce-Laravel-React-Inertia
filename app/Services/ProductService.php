<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    /**
     * Create a new product with category and images
     */
    public function createProduct(array $data): Product
    {
        // Auto-create or find category by name (SAFE: Validated input from FormRequest)
        $category = Category::firstOrCreate(
            ['name' => $data['category_name']],
            ['slug' => Str::slug($data['category_name'])]
        );

        // Store main image
        $imageFile = $data['image'] ?? null;
        $mainImagePath = $imageFile ? $imageFile->store('products/thumbnails', 'public') : null;

        // Create product
        $product = Product::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']) . '-' . rand(1000, 9999),
            'category_id' => $category->id,
            'price' => $data['price'],
            'stock' => $data['stock'],
            'description' => $data['description'] ?? null,
            'image' => $mainImagePath,
        ]);

        // Store gallery images (max 10)
        if (!empty($data['gallery']) && is_array($data['gallery'])) {
            foreach (array_slice($data['gallery'], 0, 10) as $file) {
                $path = $file->store('products/gallery', 'public');
                $product->images()->create(['image_path' => $path]);
            }
        }

        return $product;
    }

    /**
     * Update an existing product with category and images
     */
    public function updateProduct(Product $product, array $data): Product
    {
        // Auto-create or find category by name
        $category = Category::firstOrCreate(
            ['name' => $data['category_name']],
            ['slug' => Str::slug($data['category_name'])]
        );

        $updateData = [
            'name' => $data['name'],
            'category_id' => $category->id,
            'price' => $data['price'],
            'stock' => $data['stock'],
            'description' => $data['description'] ?? null,
        ];

        // Update slug if name changed
        if ($data['name'] !== $product->name) {
            $updateData['slug'] = Str::slug($data['name']) . '-' . rand(1000, 9999);
        }

        // Handle main image upload
        if (!empty($data['image'])) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $updateData['image'] = $data['image']->store('products/thumbnails', 'public');
        }

        $product->update($updateData);

        // Handle gallery images
        if (!empty($data['gallery']) && is_array($data['gallery'])) {
            foreach (array_slice($data['gallery'], 0, 10) as $file) {
                $path = $file->store('products/gallery', 'public');
                $product->images()->create(['image_path' => $path]);
            }
        }

        return $product;
    }

    /**
     * Delete product and clean up files
     */
    public function deleteProduct(Product $product): bool
    {
        // Delete gallery images
        foreach ($product->images as $img) {
            Storage::disk('public')->delete($img->image_path);
            $img->delete();
        }

        // Delete main image
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        return $product->delete();
    }

    /**
     * Delete a single product image from gallery
     */
    public function deleteProductImage($imageId): bool
    {
        $image = ProductImage::findOrFail($imageId);
        Storage::disk('public')->delete($image->image_path);
        return $image->delete();
    }
}
