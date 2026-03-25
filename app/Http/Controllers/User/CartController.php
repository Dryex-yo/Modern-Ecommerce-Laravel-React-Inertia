<?php

namespace App\Http\Controllers\User;


use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\Order;      
use App\Models\OrderItem;  
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $defaultAddress = $user->addresses()->where('is_default', true)->first() ?? $user->addresses()->first();
        $formattedAddress = '';
        if ($defaultAddress) {
            $parts = [];
            if ($defaultAddress->receiver_name) {
                $namePhone = $defaultAddress->receiver_name;
                if ($defaultAddress->phone_number) {
                    $namePhone .= ' (' . $defaultAddress->phone_number . ')';
                }
                $parts[] = $namePhone;
            }
            if ($defaultAddress->full_address) $parts[] = $defaultAddress->full_address;
            
            $area = [];
            if ($defaultAddress->district) $area[] = 'Kec. ' . $defaultAddress->district;
            if ($defaultAddress->city) $area[] = $defaultAddress->city;
            if ($defaultAddress->province) $area[] = 'Prov. ' . $defaultAddress->province;
            if ($defaultAddress->postal_code) $area[] = $defaultAddress->postal_code;
            
            if (count($area) > 0) {
                $parts[] = implode(', ', $area);
            }
            
            $formattedAddress = implode(' - ', $parts);
        }

        $cartItems = \App\Models\Cart::where('user_id', $user->id)
            ->with(['product.category']) // TARIK RELASI CATEGORY JUGA
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        // PERBAIKAN GAMBAR:
                        'image_url' => $item->product->image 
                            ? asset('storage/' . $item->product->image) 
                            : null,
                        // TARIK NAMA KATEGORI:
                        'category_name' => $item->product->category ? $item->product->category->name : 'Uncategorized',
                    ]
                ];
            });

        $bankName = \App\Models\Setting::get('bank_name');

        // ==== LOGIC ONGKIR DINAMIS J&T ====
        $origin = strtolower(trim(\App\Models\Setting::get('shipping_origin', 'Jakarta')));
        $destination = strtolower(trim($defaultAddress?->city ?? ''));

        $baseRate = 10000; // Harga dasar dalam kota
        if ($origin !== $destination && $destination !== '') {
            $hash = crc32($destination);
            $factor = abs($hash % 6) + 1; // 1 sampai 6
            $baseRate = 10000 + ($factor * 5000); // 15.000 - 40.000 Luar kota
        }

        $shippingOptions = [
            ['id' => 'jnt_ez', 'name' => 'J&T EZ (Reguler)', 'price' => $baseRate, 'est' => '2-3 Hari'],
            ['id' => 'jnt_eco', 'name' => 'J&T ECO (Ekonomi)', 'price' => round($baseRate * 0.7), 'est' => '4-7 Hari'],
            ['id' => 'jnt_super', 'name' => 'J&T Super (Next Day)', 'price' => round($baseRate * 1.5), 'est' => '1 Hari'],
        ];

        return Inertia::render('User/Cart', [
            'cartItems' => $cartItems,
            'defaultAddress' => $formattedAddress,
            'bankName' => $bankName ? 'Transfer Bank ' . strtoupper($bankName) : 'Transfer Bank',
            'shippingOptions' => $shippingOptions,
        ]);
    }

    public function store(Request $request): RedirectResponse
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

    public function checkout(Request $request): RedirectResponse
    {
        // Validasi shipping address dan method
        $request->validate([
            'shipping_address' => 'required|string|min:10|max:500',
            'shipping_method' => 'required|in:jnt_ez,jnt_eco,jnt_super',
            'payment_method' => 'required|in:transfer,cod',
        ], [
            'shipping_address.required' => 'Alamat pengiriman harus diisi',
            'shipping_address.min' => 'Alamat pengiriman minimal 10 karakter',
            'shipping_address.max' => 'Alamat pengiriman maksimal 500 karakter',
            'shipping_method.required' => 'Metode pengiriman harus dipilih',
            'shipping_method.in' => 'Metode pengiriman tidak valid',
            'payment_method.required' => 'Metode pembayaran harus dipilih',
            'payment_method.in' => 'Metode pembayaran tidak valid',
        ]);

        // ==== LOGIC ONGKIR DINAMIS J&T (Sama dengan Index) ====
        // Ambil kota user saat ini dari relasi address mereka (anggap alamat pengiriman selalu dari default address)
        $userObj = Auth::user();
        $defaultAddressObj = $userObj->addresses()->where('is_default', true)->first() 
            ?? $userObj->addresses()->first();

        $origin = strtolower(trim(\App\Models\Setting::get('shipping_origin', 'Jakarta')));
        $destination = strtolower(trim($defaultAddressObj?->city ?? ''));
        
        $baseRate = 10000;
        if ($origin !== $destination && $destination !== '') {
            $hash = crc32($destination);
            $factor = abs($hash % 6) + 1; 
            $baseRate = 10000 + ($factor * 5000); 
        }

        $shippingCosts = [
            'jnt_ez' => $baseRate,
            'jnt_eco' => round($baseRate * 0.7),
            'jnt_super' => round($baseRate * 1.5),
        ];
        $shippingCost = $shippingCosts[$request->shipping_method];
        $codFee = ($request->payment_method === 'cod') ? 5000 : 0;

        // 1. Ambil data keranjang dengan relasi produk
        $cartItems = Cart::where('user_id', Auth::id())->with('product')->get();
        
        if ($cartItems->isEmpty()) {
            return redirect()->back()->with('error', 'Keranjang kosong!');
        }

        // 2. Hitung Total Harga (Perhatikan variabel $item)
        $subTotal = $cartItems->reduce(function ($acc, $item) {
            return $acc + ($item->product->price * $item->quantity);
        }, 0);
        $totalPrice = $subTotal + $shippingCost + $codFee;

        try {
            // Kita deklarasi variabel untuk menyimpan objek order nantinya
            $newOrder = null;

            DB::transaction(function () use ($cartItems, $totalPrice, $request, $shippingCost, &$newOrder) {
                $trackingNumber = 'RESI-' . strtoupper(Str::random(12));

                // 3. Buat Header Order dengan shipping address dari user
                $newOrder = Order::create([
                    'user_id' => Auth::id(),
                    'order_number' => 'INV-' . strtoupper(Str::random(10)),
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                    'shipping_address' => $request->shipping_address,
                    'shipping_method' => $request->shipping_method,
                    'shipping_cost' => $shippingCost,
                    'payment_method' => $request->payment_method,
                    'tracking_number' => $trackingNumber,
                ]);

                // 4. Masukkan ke Detail Order (OrderItem)
                foreach ($cartItems as $item) {
                    OrderItem::create([
                        'order_id' => $newOrder->id,
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

            return redirect()->route('orders.show', $newOrder->id)->with('message', 'Checkout Berhasil!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    // Fungsi untuk Update Jumlah (Plus/Minus)
    public function update(Request $request, int $id): RedirectResponse
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
    public function destroy(int $id): RedirectResponse
    {
        $cart = Cart::where('user_id', Auth::id())->findOrFail($id);
        $cart->delete();

        return redirect()->back()->with('message', 'Item berhasil dihapus dari keranjang.');
    }
}