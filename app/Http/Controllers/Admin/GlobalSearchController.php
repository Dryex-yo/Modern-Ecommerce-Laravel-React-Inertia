<?php


namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class GlobalSearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json([]);
        }

        // Cari di Produk
        $products = Product::where('name', 'LIKE', "%{$query}%")
            ->limit(5)
            ->get(['id', 'name as title'])
            ->map(fn($item) => [...$item->toArray(), 'type' => 'Product', 'url' => route('products.edit', $item->id)]);

        // Cari di Customer
        $customers = User::where('role', 'user')
            ->where('name', 'LIKE', "%{$query}%")
            ->limit(5)
            ->get(['id', 'name as title'])
            ->map(fn($item) => [...$item->toArray(), 'type' => 'Customer', 'url' => '#']); // Sesuaikan route user jika ada

        // Cari di Order
        $orders = Order::where('id', 'LIKE', "%{$query}%")
            ->limit(5)
            ->get(['id'])
            ->map(fn($item) => ['id' => $item->id, 'title' => "Order #ORD-{$item->id}", 'type' => 'Order', 'url' => route('orders.index')]);

        // Gabungkan semua hasil
        $results = $products->concat($customers)->concat($orders);

        return response()->json($results);
    }
}