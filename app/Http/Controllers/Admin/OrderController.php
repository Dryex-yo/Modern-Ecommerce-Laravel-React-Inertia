<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Orders/Index', [
                'orders' => \App\Models\Order::with('user')->latest()->get()
        ]);
    }

    public function show($id)
    {
        // Mengambil order, user-nya, dan item-itemnya beserta info produk
        $order = \App\Models\Order::with(['user', 'items.product'])->findOrFail($id);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }
}