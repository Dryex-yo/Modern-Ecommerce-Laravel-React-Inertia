<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        // Ambil order hanya milik user yang login + gambar produknya
        $orders = $request->user()->orders()
            ->with(['items.product'])
            ->latest()
            ->get();

        return Inertia::render('Order/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Request $request, $id)
    {
        // Pastikan user tidak bisa ngintip order orang lain via URL
        $order = $request->user()->orders()
            ->with(['items.product'])
            ->findOrFail($id);

        return Inertia::render('Order/Show', [
            'order' => $order
        ]);
    }
}