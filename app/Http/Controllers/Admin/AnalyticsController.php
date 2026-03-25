<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        // Validasi input range untuk mencegah injection - WHITELIST approach
        $validRanges = ['7days', '30days', '90days', '6months', 'thisyear', 'all'];
        $range = in_array($request->input('range'), $validRanges) ? $request->input('range') : '30days';

        $query = Order::where('status', 'completed');

        // Tentukan filter waktu berdasarkan pilihan
        $startDate = match ($range) {
            '7days'   => now()->subDays(7),
            '30days'  => now()->subDays(30),
            '90days'  => now()->subDays(90),
            '6months' => now()->subMonths(6),
            'thisyear'=> now()->startOfYear(),
            'all'     => null, // Tidak ada filter tanggal
            default   => now()->subDays(30),
        };

        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }

        // --- HITUNG STATS ---
        $totalOrders = (clone $query)->count();
        $totalVisitors = DB::table('visitors')->distinct('ip_address')->count('ip_address');
        $totalRevenue = (float) (clone $query)->sum('total_price');
        

        $stats = [
            'total_revenue'   => $totalRevenue,
            'avg_order_value' => $totalOrders > 0 ? $totalRevenue / $totalOrders : 0,
            'conversion_rate' => $totalVisitors > 0 ? round(($totalOrders / $totalVisitors) * 100, 1) : 0,
            'gross_profit'    => $totalRevenue * 0.2,
            'total_visitors'  => $totalVisitors
        ];

        // --- DATA CHART ---
        // Atur format tanggal di sumbu X agar sesuai dengan range yang dipilih
        // SAFE: Menggunakan whitelist yang ketat untuk mencegah SQL injection
        $dateFormatMap = [
            '7days'   => '%d %b',      // Contoh: 23 Mar
            '30days'  => '%d %b',      // Contoh: 23 Mar
            '90days'  => '%b %y',      // Contoh: Mar 26
            '6months' => '%b %y',      // Contoh: Mar 26
            'thisyear'=> '%b',         // Contoh: Jan, Feb
            'all'     => '%b',         // Contoh: Jan, Feb
        ];
        
        $dateFormat = $dateFormatMap[$range] ?? '%d %b';

        $salesChartData = (clone $query)
            ->select(
                DB::raw("DATE_FORMAT(created_at, '$dateFormat') as name"),
                DB::raw('CAST(SUM(total_price) AS UNSIGNED) as revenue'),
                DB::raw('MIN(created_at) as sort_date') // Untuk sorting yang akurat
            )
            ->groupBy('name')
            ->orderBy('sort_date')
            ->get();

        return Inertia::render('Admin/Analytics/Index', [
            'salesChartData' => $salesChartData,
            'stats' => $stats,
            'filters' => ['range' => $range]
        ]);
    }
}