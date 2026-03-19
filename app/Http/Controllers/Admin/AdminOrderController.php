<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminOrderController extends Controller
{
    /**
     * Menampilkan daftar semua pesanan untuk Admin.
     */
    public function index()
    {
        // Mengambil semua order dengan relasi user (pembeli)
        $orders = Order::with('user')
            ->latest()
            ->get();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Menampilkan detail pesanan spesifik.
     */
    public function show(Order $order)
    {
        // Load relasi items dan produk di dalamnya agar tidak error saat render
        $order->load(['user', 'items.product']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update status pesanan (Pending, Processing, Completed, Cancelled).
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:Pending,Processing,Completed,Cancelled',
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }
}