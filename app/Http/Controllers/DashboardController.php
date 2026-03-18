<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use App\Models\Order; // Pastikan model Order sudah ada
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user(); 

        // --- LOGIKA UNTUK ADMIN ---
        if ($user->role === 'admin') {
            return Inertia::render('Dashboard', [
                // Statistik Utama
                'stats' => [
                    'totalProducts'  => Product::count(),
                    'totalCustomers' => User::where('role', 'user')->count(),
                    'totalRevenue'   => Order::where('status', 'completed')->sum('total_price'),
                    'totalOrders'    => Order::count(),
                    'lowStockCount'  => Product::where('stock', '<=', 5)->count(),
                ],
                
                // Data untuk Tabel & List
                'latestProducts' => Product::latest()->take(5)->get(),
                'recentOrders'   => Order::with('user')->latest()->take(5)->get(),
                
                // Data Grafik (Opsional: Penjualan 7 hari terakhir)
                'salesChart' => Order::where('status', 'completed')
                    ->where('created_at', '>=', now()->subDays(6))
                    ->select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('SUM(total_price) as total')
                    )
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get(),
            ]);
        }

        // --- LOGIKA UNTUK USER BIASA ---
        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user
            ],
            'myOrdersCount' => Order::where('user_id', $user->id)->count(),
            'recentActivity' => Order::where('user_id', $user->id)->latest()->take(3)->get(),
        ]);
    }
}