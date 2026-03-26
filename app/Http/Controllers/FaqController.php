<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = [
            [
                'id' => 1,
                'question' => 'Bagaimana cara melakukan pembayaran?',
                'answer' => 'Anda dapat melakukan pembayaran melalui berbagai metode termasuk transfer bank, kartu kredit, dan e-wallet. Pilih metode pembayaran yang diinginkan saat checkout.'
            ],
            [
                'id' => 2,
                'question' => 'Berapa lama pengiriman barang?',
                'answer' => 'Waktu pengiriman tergantung lokasi Anda. Umumnya pengiriman membutuhkan 2-5 hari kerja untuk area Jabodetabek dan 3-7 hari kerja untuk area lainnya.'
            ],
            [
                'id' => 3,
                'question' => 'Apakah ada garansi untuk produk?',
                'answer' => 'Ya, semua produk kami dilengkapi dengan garansi sesuai dengan kebijakan masing-masing produk. Detail garansi dapat dilihat di halaman detail produk.'
            ],
            [
                'id' => 4,
                'question' => 'Bagaimana cara melakukan pengembalian barang?',
                'answer' => 'Jika ada ketidakpuasan dengan produk, Anda dapat mengajukan pengembalian dalam waktu 14 hari setelah menerima barang. Hubungi customer service kami untuk informasi lebih lanjut.'
            ],
            [
                'id' => 5,
                'question' => 'Apakah ada biaya ongkir?',
                'answer' => 'Ya, biaya ongkir dihitung berdasarkan berat barang dan lokasi tujuan pengiriman. Biaya ongkir akan ditampilkan sebelum Anda menyelesaikan pesanan.'
            ],
            [
                'id' => 6,
                'question' => 'Bagaimana cara melacak pesanan saya?',
                'answer' => 'Anda dapat melacak pesanan melalui dashboard Anda atau email notifikasi yang kami kirim. Klik menu "Pesanan" untuk melihat status pesanan terbaru.'
            ]
        ];

        return Inertia::render('Faq/Index', [
            'faqs' => $faqs
        ]);
    }
}
