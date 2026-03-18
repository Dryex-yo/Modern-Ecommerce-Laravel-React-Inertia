<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // WAJIB ADA
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Gunakan Auth::check() untuk mengecek login
        // Dan Auth::user()->role untuk mengecek peran
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            
            // Jika bukan admin, tendang ke halaman home dengan pesan error
            return redirect('/')->with('error', 'Maaf, halaman ini khusus untuk Admin.');
        }

        return $next($request);
    }
}