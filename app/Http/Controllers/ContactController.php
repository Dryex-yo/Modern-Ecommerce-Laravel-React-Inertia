<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function create()
    {
        return Inertia::render('Contact/Create', [
            'shopEmail' => Setting::get('shop_email', 'support@dryshop.com'),
            'shopPhone' => Setting::get('shop_phone', '+62 812-3456-7890'),
            'shopAddress' => Setting::get('shop_address', 'Jakarta Selatan, Indonesia'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|min:10'
        ]);

        // Simpan ke database atau kirim email
        // Contoh: bisa disimpan ke tabel contacts atau langsung dikirim ke email admin
        
        // Untuk sekarang, kita hanya redirect dengan message sukses
        return redirect()->route('dashboard')->with('success', 'Pesan Anda telah dikirim. Tim customer service kami akan segera menghubungi Anda.');
    }
}
