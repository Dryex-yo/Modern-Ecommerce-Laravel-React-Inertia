<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
    {
        /**
         * The root template that is loaded on the first page visit.
         *
         * @var string
         */
        protected $rootView = 'app';

        /**
         * Determine the current asset version.
         */
        public function version(Request $request): ?string
        {
            return parent::version($request);
        }

        /**
         * Define the props that are shared by default.
         *
         * @return array<string, mixed>
         */
        public function share(Request $request): array
        {
            return [
                ...parent::share($request),
                
                'auth' => [
                    'user' => $request->user(),
                ],

                'settings' => function () {
                    // 1. Ambil semua data dari database
                    $dbSettings = \App\Models\Setting::pluck('value', 'key')->toArray();
                    
                    // 2. Olah URL logo secara terpisah
                    $logoPath = $dbSettings['shop_logo'] ?? null;
                    $finalLogo = $logoPath ? asset('storage/' . $logoPath) : null;

                    // 3. Gabungkan semua, tapi pastikan shop_logo menggunakan $finalLogo (URL lengkap)
                    return array_merge([
                        'shop_name' => 'DRYEX SHOP',
                        'shop_email' => 'admin@dryex.com',
                    ], $dbSettings, [
                        'shop_logo' => $finalLogo // Ini akan menimpa data mentah di $dbSettings
                    ]);
                },

                // Ambil dari hasil closure settings di atas agar sinkron
                'app_name' => function () {
                    return Setting::where('key', 'shop_name')->value('value') ?? 'DRYEX SHOP';
                },

                'notifications' => [
                    'pending_orders_count' => Order::where('status', 'pending')->count(),
                    'low_stock_count' => Product::where('stock', '<=', 5)->count(),
                ],

                'flash' => [
                    'success' => fn () => $request->session()->get('success'),
                    'error' => fn () => $request->session()->get('error'),
                ],
            ];
        }
    }