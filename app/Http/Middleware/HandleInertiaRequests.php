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
            
            // Data Auth User
            'auth' => [
                'user' => $request->user(),
            ],

            // Data Settings Global (diambil dari Table Settings)
            'settings' => function () {
                $dbSettings = Setting::pluck('value', 'key')->toArray();

                // Generate URL lengkap untuk logo jika ada
                $logoPath = $dbSettings['shop_logo'] ?? null;
                $logoUrl = $logoPath ? asset('storage/' . $logoPath) : null;

                return array_merge([
                    'shop_name' => 'DRYEX SHOP',
                    'shop_email' => 'admin@dryex.com',
                    'shop_logo' => $logoUrl,
                    'currency_symbol' => 'Rp',
                ], $dbSettings, ['shop_logo_url' => $logoUrl]);
            },

            // Alias untuk app_name (agar tidak error jika ada komponen lama yang pakai)
            'app_name' => function () {
                return Setting::where('key', 'shop_name')->value('value') ?? 'DRYEX SHOP';
            },

            // Data Real-time Notification untuk Sidebar/Header Admin
            'notifications' => [
                'pending_orders_count' => Order::where('status', 'pending')->count(),
                'low_stock_count' => Product::where('stock', '<=', 5)->count(),
            ],

            // Flash Message untuk Toast/Alert
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}