<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
{
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Gunakan pengecekan kolom 'role' langsung jika fungsi isAdmin() belum ada di Model
        if ($user->role === 'admin') {
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'totalProducts'  => Product::count(),
                    'totalCustomers' => User::where('role', 'user')->count(),
                    'totalRevenue'   => (int) Order::where('status', 'completed')->sum('total_price'),
                    'totalOrders'    => Order::count(),
                    'lowStockCount'  => Product::where('stock', '<=', 5)->count(),
                ],

                // Pakai query manual untuk ambil data terbaru
                'latestProducts' => Product::latest()
                    ->limit(5)
                    ->get(),

                'recentOrders' => Order::with('user')
                    ->latest()
                    ->limit(5)
                    ->get(),

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

        // ================================
        // USER VIEW (Dashboard Biasa)
        // ================================
        return Inertia::render('Dashboard', [
            'myOrdersCount' => Order::where('user_id', $user->id)->count(),
            'recentActivity' => Order::where('user_id', $user->id)
                ->latest()
                ->limit(3)
                ->get(),
        ]);
    }
}