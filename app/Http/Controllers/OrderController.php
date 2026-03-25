<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with('items.product')
            ->latest()
            ->get();
        
        Log::info('Orders with items:', $orders->toArray());

        return Inertia::render('User/Orders', [
            'orders' => $orders,
        ]);
    }

    public function show($id)
    {
        $order = Order::with('items.product')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('User/Orders/Show', [
            'order' => $order,
        ]);
    }
}