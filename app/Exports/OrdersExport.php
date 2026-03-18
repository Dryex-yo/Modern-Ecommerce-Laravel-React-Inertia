<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class OrdersExport implements FromCollection, WithHeadings, WithMapping
{
    protected $startDate, $endDate;

    public function __construct($start, $end) {
        $this->startDate = $start;
        $this->endDate = $end;
    }

    public function collection() {
        return Order::with('user')
            ->whereBetween('created_at', [$this->startDate, $this->endDate])
            ->where('status', 'completed')->get();
    }

    public function headings(): array {
        return ["ID Order", "Nama Pelanggan", "Total Harga", "Metode Bayar", "Tanggal"];
    }

    public function map($order): array {
        return [
            $order->id,
            $order->user->name,
            $order->total_price,
            $order->payment_method,
            $order->created_at->format('d-m-Y'),
        ];
    }
}