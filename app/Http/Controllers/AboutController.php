<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        return Inertia::render('About/Index', [
            'companyInfo' => [
                'name' => 'DryShop',
                'established' => '2020',
                'description' => 'Toko online terpercaya yang menyediakan berbagai produk berkualitas dengan harga terjangkau.',
                'mission' => 'Memberikan pengalaman berbelanja online yang terbaik dengan produk berkualitas dan layanan pelanggan yang responsif.',
                'vision' => 'Menjadi toko online terdepan di Indonesia yang dipercaya oleh jutaan pelanggan.',
            ]
        ]);
    }
}
