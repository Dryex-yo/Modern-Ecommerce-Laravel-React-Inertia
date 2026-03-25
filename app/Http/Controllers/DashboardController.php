<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Wishlist;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response|RedirectResponse
    {
        /** @var User $user */ // Penting: Biar VS Code gak merah di method update()
        $user = Auth::user();

        // 1. Protection & Redirection
        if (!$user) {
            return redirect()->route('login');
        }

        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        // 2. Update Last Login (Silently)
        try {
            $user->update(['last_login_at' => now()]);
        } catch (\Exception $e) {
            Log::warning('Failed to update last login: ' . $e->getMessage());
        }

        // 3. Data Aggregation
        $totalSpent = (int) Order::where('user_id', $user->id)
            ->where('status', 'completed')
            ->sum('total_price');

        $loyaltyPoints = $this->calculateLoyaltyPoints($totalSpent);

        // Update loyalty points jika berubah
        if ($user->loyalty_points != $loyaltyPoints) {
            $user->update(['loyalty_points' => $loyaltyPoints]);
        }

        return Inertia::render('Dashboard', [
            'myOrdersCount' => Order::where('user_id', $user->id)->count(),
            'wishlistCount' => Wishlist::where('user_id', $user->id)->count(),
            'loyaltyPoints' => $loyaltyPoints,
            'userTier'      => $this->getUserTier($totalSpent), // Tambahan info tier
            'lastLogin'     => $user->last_login_at ?? now(),
            'totalSpent'    => $totalSpent,
            'accountHealth' => $this->calculateAccountHealth($user),
            
            'recentActivity'  => $this->getRecentActivity($user),
            'recentOrders'    => $this->getRecentOrders($user),
            'recommendations' => $this->getRecommendations(),

            'settings' => [
                'shop_name'  => config('app.shop_name', 'ELECTRICAL STYLES'),
                'shop_email' => config('app.shop_email', 'contact@dryshop.local'),
            ],
        ]);
    }

    private function getRecentActivity(User $user): array
    {
        try {
            return Order::where('user_id', $user->id)
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($order) => [
                    'description' => "Order #" . ($order->order_number ?? $order->id) . " - " . ucfirst($order->status),
                    'time'        => $order->created_at ? $order->created_at->diffForHumans() : 'Recently',
                ])->toArray();
        } catch (\Exception $e) {
            Log::error('Activity Error: ' . $e->getMessage());
            return [];
        }
    }

    private function getRecentOrders(User $user): array
    {
        try {
            return Order::where('user_id', $user->id)
                ->withCount('items') // Lebih efisien daripada load semua items
                ->latest()
                ->limit(3)
                ->get()
                ->map(fn($order) => [
                    'id'           => $order->id,
                    'order_number' => $order->order_number ?? '#' . $order->id,
                    'total_price'  => (int) $order->total_price,
                    'status'       => $order->status,
                    'created_at'   => $order->created_at,
                    'items_count'  => $order->items_count,
                ])->toArray();
        } catch (\Exception $e) {
            Log::error('Orders Error: ' . $e->getMessage());
            return [];
        }
    }

    private function getRecommendations(): array
    {
        return Product::where('stock', '>', 0)
            ->inRandomOrder()
            ->limit(3)
            ->get(['id', 'name', 'price', 'image', 'stock']) // Ambil kolom perlu saja
            ->toArray();
    }

    private function calculateAccountHealth(User $user): int
    {
        $score = 0;
        $criteria = [
            !empty($user->avatar),
            !empty($user->display_name),
            !empty($user->phone),
            DB::table('addresses')->where('user_id', $user->id)->exists(),
            DB::table('payment_methods')->where('user_id', $user->id)->exists(),
        ];

        foreach ($criteria as $met) {
            if ($met) $score += 20;
        }

        return $score;
    }

    private function getUserTier($totalSpent): string
    {
        if ($totalSpent >= 5000000) return 'Platinum';
        if ($totalSpent >= 2000000) return 'Gold';
        if ($totalSpent >= 1000000) return 'Silver';
        return 'Bronze';
    }

    private function calculateLoyaltyPoints($totalSpent): int
    {
        return (int) floor($totalSpent / 1000);
    }
}