<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class AdminOrderController extends Controller
{
    /**
     * Menampilkan daftar semua pesanan untuk Admin.
     */
    public function index(): Response
    {
        // Mengambil semua order dengan relasi user (pembeli)
        $orders = Order::with('user')
            ->latest()
            ->get();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function userIndex(): Response
    {
        $orders = Order::where('user_id', Auth::id())
                    ->latest()
                    ->get();
        return Inertia::render('User/Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Menampilkan detail pesanan spesifik.
     */
    public function show(int $id): Response
    {
        // Kita gunakan findOrFail agar jika ID tidak ada langsung muncul 404
        // Load relasi user, items, dan produk di dalamnya
        $order = Order::with(['user', 'items.product'])->findOrFail($id);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update status pesanan (Pending, Processing, Completed, Cancelled).
     */
    public function update(Request $request, Order $order): RedirectResponse
    {
        $request->validate([
            'status' => 'required|string|in:Pending,Processing,Completed,Cancelled',
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    /**
     * Approve/Setujui pesanan (ubah status menjadi Processing).
     */
    public function approve(Order $order): RedirectResponse
    {
        $order->update([
            'status' => 'Processing'
        ]);

        return redirect()->back()->with('success', 'Pesanan berhasil disetujui dan sedang diproses.');
    }

    /**
     * Reject/Tolak pesanan (ubah status menjadi Cancelled).
     */
    public function reject(Order $order): RedirectResponse
    {
        $order->update([
            'status' => 'Cancelled'
        ]);

        return redirect()->back()->with('success', 'Pesanan berhasil ditolak.');
    }

    /**
     * Opsional: Jika ingin admin bisa menghapus data pesanan
     */
    public function destroy(Order $order): RedirectResponse
    {
        $order->delete();
        return redirect()->route('admin.orders.index')->with('success', 'Pesanan berhasil dihapus.');
    }
}