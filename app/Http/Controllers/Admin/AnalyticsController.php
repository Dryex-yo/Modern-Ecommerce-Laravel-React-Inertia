<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order; // Import Model Order
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // <--- INI YANG TADI KURANG (Solusi Debug)
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index()
    {
        // 1. Hitung Total Order Sukses
        $totalOrders = \App\Models\Order::where('status', 'completed')->count();

        // 2. Hitung Total Pengunjung Unik (Real dari Database)
        $totalVisitors = DB::table('visitors')->count();

        // 3. Hitung Conversion Rate (Orders / Visitors * 100)
        // Jika visitors 0, maka rate 0 agar tidak error division by zero
        $conversionRate = $totalVisitors > 0 
            ? number_format(($totalOrders / $totalVisitors) * 100, 1) 
            : 0;

        // 4. Hitung Statistik Lainnya (Real)
        $totalRevenue = \App\Models\Order::where('status', 'completed')->sum('total_price') ?? 0;

        $stats = [
            'total_revenue' => $totalRevenue,
            'avg_order_value' => \App\Models\Order::where('status', 'completed')->avg('total_price') ?? 0,
            'conversion_rate' => $conversionRate, // SUDAH REAL SEKARANG
            'gross_profit' => $totalRevenue * 0.2, // Asumsi margin 20%
            'total_visitors' => $totalVisitors // Kita kirim juga data visitornya
        ];

        // Data Chart (Real)
        $salesChartData = \App\Models\Order::where('status', 'completed')
            ->select(
                DB::raw('DATE_FORMAT(created_at, "%b") as name'),
                DB::raw('SUM(total_price) as revenue')
            )
            ->groupBy('name', DB::raw('MONTH(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get();

        return Inertia::render('Admin/Analytics/Index', [
            'salesChartData' => $salesChartData,
            'stats' => $stats,
        ]);
    }
}