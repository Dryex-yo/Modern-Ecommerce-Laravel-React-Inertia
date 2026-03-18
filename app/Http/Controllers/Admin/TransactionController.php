<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order; // Atau model Transaction jika dipisah
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        // Kita ambil data Order yang sudah memiliki status pembayaran
        $transactions = Order::with('user')
            ->select('id', 'user_id', 'total_price', 'status', 'created_at', 'payment_method')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions
        ]);
    }
}
