<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Exports\OrdersExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Default: Ambil data bulan ini jika tidak ada filter
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : now()->startOfMonth();
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : now()->endOfMonth();

        $query = Order::with('user')
            ->whereBetween('created_at', [$startDate, $endDate->endOfDay()])
            ->where('status', 'completed');

        return Inertia::render('Admin/Reports/Index', [
            'reports' => $query->latest()->get(),
            'summary' => [
                'total_revenue' => $query->sum('total_price'),
                'total_orders' => $query->count(),
                'period' => $startDate->format('d M Y') . ' - ' . $endDate->format('d M Y')
            ],
            'filters' => $request->only(['start_date', 'end_date'])
        ]);
    }

    public function exportExcel(Request $request)
    {
        // Validasi dan parse tanggal dengan aman
        try {
            $start = $request->start_date ? Carbon::parse($request->start_date) : now()->startOfMonth();
            $end = $request->end_date ? Carbon::parse($request->end_date) : now()->endOfMonth();
        } catch (\Exception $e) {
            return back()->with('error', 'Format tanggal tidak valid');
        }
        
        return Excel::download(new OrdersExport($start, $end), 'laporan-penjualan.xlsx');
    }

    public function exportPdf(Request $request)
    {
        // Validasi dan parse tanggal dengan aman
        try {
            $start = $request->start_date ? Carbon::parse($request->start_date) : now()->startOfMonth();
            $end = $request->end_date ? Carbon::parse($request->end_date) : now()->endOfMonth();
        } catch (\Exception $e) {
            return back()->with('error', 'Format tanggal tidak valid');
        }
        
        // Ambil data dengan relasi user agar tidak error
        $reports = Order::with('user')
            ->whereBetween('created_at', [$start, $end->endOfDay()])
            ->where('status', 'completed')
            ->get();

        $data = [
            'reports' => $reports,
            'period'  => $start->format('d M Y') . ' - ' . $end->format('d M Y'),
        ];

        // Memanggil file resources/views/pdf/report.blade.php
        $pdf = Pdf::loadView('pdf.report', $data);
        
        return $pdf->download('laporan-penjualan-'.now()->format('Y-m-d').'.pdf');
    }
}