<?php

namespace App\Http\Controllers\Shop;
use App\Http\Controllers\Controller;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{

    public function index()
    {
        $products = Product::with('category')->get()->map(function ($product) {
            $isWishlisted = false;
            
            // Cek wishlist hanya jika user sudah login
            if (Auth::check()) {
                $isWishlisted = DB::table('wishlists')
                    ->where('user_id', Auth::id())
                    ->where('product_id', $product->id)
                    ->exists();
            }

            return [
                'id'            => $product->id,
                'name'          => $product->name,
                'price'         => $product->price,
                'image'         => $product->image,
                'stock'         => $product->stock ?? 0,
                'category'      => $product->category,
                'is_wishlisted' => $isWishlisted,
            ];
        });

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'cart_count' => Auth::check() ? DB::table('carts')->where('user_id', Auth::id())->sum('quantity') : 0,
        ]);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return Inertia::render('Shop/ProductShow', [
            'product' => $product
        ]);
    }
}