<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Order;      
use App\Models\OrderItem;  
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        // Menggunakan Auth::id() lebih aman
        return Inertia::render('Cart/Index', [
            'cartItems' => Cart::with('product')
                ->where('user_id', Auth::id())
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Cari apakah produk sudah ada di keranjang user ini
        $cart = Cart::where('user_id', Auth::id())
                    ->where('product_id', $request->product_id)
                    ->first();

        if ($cart) {
            // Jika ada, tambah jumlahnya
            $cart->increment('quantity');
        } else {
            // Jika belum ada, buat baru
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => 1
            ]);
        }

        return redirect()->back()->with('message', 'Item added to cart!');
    }

    public function checkout(Request $request)
    {
        // 1. Ambil data keranjang dengan relasi produk
        $cartItems = Cart::where('user_id', Auth::id())->with('product')->get();
        
        if ($cartItems->isEmpty()) {
            return redirect()->back()->with('error', 'Keranjang kosong!');
        }

        // 2. Hitung Total Harga (Perhatikan variabel $item)
        $totalPrice = $cartItems->reduce(function ($acc, $item) {
            return $acc + ($item->product->price * $item->quantity);
        }, 0);

        try {
            DB::transaction(function () use ($cartItems, $totalPrice) {
                // 3. Buat Header Order
                $order = Order::create([
                    'user_id' => Auth::id(),
                    'order_number' => 'INV-' . strtoupper(Str::random(10)),
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                    'shipping_address' => 'Alamat Pengiriman Belum Diisi',
                ]);

                // 4. Masukkan ke Detail Order (OrderItem)
                foreach ($cartItems as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'price' => $item->product->price,
                    ]);

                    // 5. Potong Stok Produk
                    $item->product->decrement('stock', $item->quantity);
                }

                // 6. Hapus Keranjang setelah Checkout
                Cart::where('user_id', Auth::id())->delete();
            });

            return redirect()->route('dashboard')->with('message', 'Checkout Berhasil!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}