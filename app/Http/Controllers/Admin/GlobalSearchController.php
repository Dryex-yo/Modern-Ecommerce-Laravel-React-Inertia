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

        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }

        // Escape dan sanitize input menggunakan parameter binding
        $searchTerm = "%{$query}%";

        // Cari di Produk - menggunakan parameter binding
        $products = Product::where('name', 'LIKE', $searchTerm)
            ->limit(5)
            ->get(['id', 'name as title'])
            ->map(fn($item) => [...$item->toArray(), 'type' => 'Product', 'url' => route('admin.products.edit', $item->id)]);

        // Cari di Customer - menggunakan parameter binding
        $customers = User::where('role', 'user')
            ->where('name', 'LIKE', $searchTerm)
            ->limit(5)
            ->get(['id', 'name as title'])
            ->map(fn($item) => [...$item->toArray(), 'type' => 'Customer', 'url' => route('admin.users.edit', $item->id)]);

        // Cari di Order - menggunakan CAST untuk safety
        $orders = Order::whereRaw('CAST(id AS CHAR) LIKE ?', [$searchTerm])
            ->limit(5)
            ->get(['id'])
            ->map(fn($item) => ['id' => $item->id, 'title' => "Order #ORD-{$item->id}", 'type' => 'Order', 'url' => route('admin.orders.show', $item->id)]);

        // Gabungkan semua hasil
        $results = $products->concat($customers)->concat($orders);

        return response()->json($results);
    }
}