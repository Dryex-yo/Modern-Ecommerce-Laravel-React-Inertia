<?php

namespace App\Http\Controllers\User;


use App\Http\Controllers\Controller;
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

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // 1. Cek apakah stok cukup untuk jumlah yang diminta
        if ($product->stock < $request->quantity) {
            return redirect()->back()->with('error', 'Maaf, stok tidak mencukupi.');
        }

        $cart = Cart::where('user_id', Auth::id())
                    ->where('product_id', $request->product_id)
                    ->first();

        if ($cart) {
            // 2. Cek lagi jika ditambah apakah melampaui stok?
            if (($cart->quantity + $request->quantity) > $product->stock) {
                return redirect()->back()->with('error', 'Total di keranjang melampaui stok tersedia.');
            }
            $cart->increment('quantity', $request->quantity);
        } else {
            Cart::create([
                'user_id' => Auth::id(),
                'product_id' => $request->product_id,
                'quantity' => $request->quantity // Menggunakan quantity dari input form
            ]);
        }

        return redirect()->back()->with('message', 'Berhasil ditambahkan ke keranjang!');
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

    // Fungsi untuk Update Jumlah (Plus/Minus)
    public function update(Request $request, $id)
    {
        $cart = Cart::where('user_id', Auth::id())->findOrFail($id);
        $product = Product::findOrFail($cart->product_id);

        // Validasi input   
        $request->validate([
            'type' => 'required|in:plus,minus'
        ]);

        if ($request->type === 'plus') {
            // Cek apakah stok masih mencukupi
            if ($cart->quantity + 1 > $product->stock) {
                return redirect()->back()->with('error', 'Stok tidak mencukupi.');
            }
            $cart->increment('quantity');
        } else {
            // Jika minus dan jumlah sudah 1, jangan biarkan jadi 0
            if ($cart->quantity > 1) {
                $cart->decrement('quantity');
            }
        }

        return redirect()->back();
    }

    // Fungsi untuk Hapus Item (Trash)
    public function destroy($id)
    {
        $cart = Cart::where('user_id', Auth::id())->findOrFail($id);
        $cart->delete();

        return redirect()->back()->with('message', 'Item berhasil dihapus dari keranjang.');
    }
}