<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index(): Response
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

    public function show(int $id): Response
    {
        $order = Order::with('items.product')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return Inertia::render('User/Orders/Show', [
            'order' => $order,
            'bankDetails' => [
                'name' => \App\Models\Setting::get('bank_name', 'Bank Default'),
                'account' => \App\Models\Setting::get('bank_account', '1234567890'),
                'holder' => \App\Models\Setting::get('bank_holder', 'Pemilik Rekening'),
            ],
        ]);
    }
}