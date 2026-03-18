<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Data dummy untuk produk
        $products = [
            [
                'name' => 'Premium Sneakers White',
                'price' => 1250000,
                'category' => 'Shoes',
                'stock' => 10
            ],
            [
                'name' => 'Mechanical Keyboard G-Pro',
                'price' => 890000,
                'category' => 'Electronics',
                'stock' => 5
            ],
            [
                'name' => 'Minimalist T-Shirt Grey',
                'price' => 150000,
                'category' => 'Apparel',
                'stock' => 20
            ],
        ];

        foreach ($products as $p) {
            Product::create([
                'name' => $p['name'],
                'slug' => Str::slug($p['name']),
                'description' => 'Produk kualitas tinggi ' . $p['name'],
                'price' => $p['price'],
                'stock' => $p['stock'],
                'category' => $p['category'],
            ]);
        }
    }
}