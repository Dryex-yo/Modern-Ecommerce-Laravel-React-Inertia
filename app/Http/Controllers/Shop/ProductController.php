<?php

namespace App\Http\Controllers\Shop;
use App\Http\Controllers\Controller;

use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show($id)
    {
        $product = Product::with('images')->findOrFail($id);

        return Inertia::render('Shop/ProductShow', [
            'product' => $product
        ]);
    }
}