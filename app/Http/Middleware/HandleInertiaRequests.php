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
            
            $dbSettings = [];
            try {
                $dbSettings = \App\Models\Setting::pluck('value', 'key')->toArray();
            } catch (\Exception $e) {
                // Jika tabel belum ada atau error, biarkan kosong
            }

            return [
                ...parent::share($request),
                
                'auth' => [
                    'user' => $request->user(),
                ],

                'settings' => [
                    'shop_name' => $dbSettings['shop_name'] ?? 'DRYEX SHOP',
                    'shop_logo' => isset($dbSettings['shop_logo']) ? asset('storage/' . $dbSettings['shop_logo']) : null,
                    'shop_email' => $dbSettings['shop_email'] ?? null,
                ],

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

                'cart_count' => function () use ($request) {
                    if (!$request->user()) return 0;
                    // Asumsi Anda punya tabel/model Cart
                    return \App\Models\Cart::where('user_id', $request->user()->id)->sum('quantity');
                },
            ];
        }
    }