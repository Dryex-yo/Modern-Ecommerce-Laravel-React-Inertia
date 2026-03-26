<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

// --- CONTROLLERS ---
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\CartController;
use App\Http\Controllers\User\MessageController as UserMessageController;
use App\Http\Controllers\Shop\ProductController as ShopProductController;
use App\Http\Controllers\Admin\{
    DashboardController as AdminDashboardController,
    CategoryController as AdminCategoryController,
    ProductController as AdminProductController,
    UserController as AdminUserController,
    AnalyticsController,
    AdminOrderController,
    SettingController,
    TransactionController,
    ReportController,
    GlobalSearchController,
    MessageController as AdminMessageController
};

// --------------------------------------------------------------------------
// GUEST ROUTES
// --------------------------------------------------------------------------
Route::get('/', function (Request $request) {
    // Tracking visitor sederhana
    DB::table('visitors')->updateOrInsert(
        [
            'ip_address' => $request->ip(),
            'created_at' => now()->startOfDay()
        ],
        [
            'user_agent' => $request->userAgent(),
            'updated_at' => now()
        ]
    );

    return Inertia::render('Welcome', [
        'products' => Product::with('category')->latest()->take(10)->get(),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('welcome');

Route::get('/shop', [ShopProductController::class, 'index'])->name('shop.index');
Route::get('/shop/product/{id}', [ShopProductController::class, 'show'])->name('shop.product.show');

// FAQ, About, and Contact
Route::get('/faq', [FaqController::class, 'index'])->name('faq.index');
Route::get('/about', [AboutController::class, 'index'])->name('about.index');
Route::get('/contact', [ContactController::class, 'create'])->name('contact.create');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Messages Widget (Public)
Route::post('/api/messages/create-from-widget', [AdminMessageController::class, 'createFromWidget'])->name('messages.create-from-widget');
Route::get('/api/messages/latest', [AdminMessageController::class, 'getLatest'])->name('messages.get-latest');
Route::get('/api/messages/history', [AdminMessageController::class, 'getHistory'])->name('messages.history');
Route::get('/api/messages/check-replies', [AdminMessageController::class, 'checkReplies'])->name('messages.check-replies');

// Email Verification
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return response()->json(['message' => 'Email verified']);
})->middleware(['auth', 'signed'])->name('verification.verify');

// --------------------------------------------------------------------------   
// AUTHENTICATED ROUTES (User)
// --------------------------------------------------------------------------
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboard dengan Auto Redirect
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // ===== PROFILE & ACCOUNT =====
    Route::controller(ProfileController::class)->prefix('profile')->name('profile.')->group(function () {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::post('/password', 'updatePassword')->name('password.update');
        Route::post('/two-factor', 'toggle2FA')->name('two-factor.toggle');
        Route::delete('/', 'destroy')->name('destroy');
    });
    
    // ===== ADDRESSES =====
    Route::resource('addresses', AddressController::class)->except(['show']);
    
    // ===== PAYMENT METHODS =====
    Route::prefix('payment-methods')->name('payment-methods.')->group(function () {
        Route::post('/', [PaymentMethodController::class, 'store'])->name('store');
        Route::delete('/{id}', [PaymentMethodController::class, 'destroy'])->name('destroy');
    });
    
    // ===== CART =====
    Route::controller(CartController::class)->prefix('cart')->name('cart.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::patch('/{id}', 'update')->name('update');
        Route::delete('/{id}', 'destroy')->name('destroy');
        Route::post('/checkout', 'checkout')->name('checkout');
    });

    // ===== WISHLIST =====
    Route::controller(WishlistController::class)->prefix('wishlist')->name('wishlist.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/{productId}', 'toggle')->name('toggle');
    });

    // ===== ORDERS =====
    Route::controller(OrderController::class)->prefix('my-orders')->name('orders.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/{id}', 'show')->name('show');
    });

    // ===== MESSAGES =====
    Route::controller(UserMessageController::class)->prefix('messages')->name('user.messages.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/{id}', 'store')->name('store');
        Route::post('/{id}/mark-as-read', 'markAsRead')->name('mark-as-read');
        Route::get('/get-latest', 'getLatest')->name('get-latest');
        Route::get('/unread-count', 'getUnreadCount')->name('unread-count');
    });
});

// --------------------------------------------------------------------------
// ADMIN ONLY ROUTES
// --------------------------------------------------------------------------
Route::middleware(['auth', 'can:access-admin-panel'])->prefix('admin')->name('admin.')->group(function () {
    
    // Check if user is admin
    Route::middleware('is.admin')->group(function () {
        
        // ===== DASHBOARD =====
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // ===== PRODUCTS =====
        Route::resource('products', AdminProductController::class);
        Route::delete('/products/images/{id}', [AdminProductController::class, 'destroyImage'])->name('product-images.destroy');

        // ===== CATEGORIES =====
        Route::resource('categories', AdminCategoryController::class)->except(['show']);

        // ===== USERS =====
        Route::resource('users', AdminUserController::class)->except(['create', 'store']);

        // ===== ORDERS =====
        Route::controller(AdminOrderController::class)->prefix('orders')->name('orders.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/{id}', 'show')->name('show');
            Route::patch('/{order}', 'update')->name('update');
            Route::post('/{order}/approve', 'approve')->name('approve');
            Route::post('/{order}/reject', 'reject')->name('reject');
            Route::delete('/{order}', 'destroy')->name('destroy');
        });

        // ===== ANALYTICS & REPORTS =====
        Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
        Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');

        // ===== MESSAGES & SUPPORT =====
        Route::controller(AdminMessageController::class)->prefix('messages')->name('messages.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/{id}', 'store')->name('store');
            Route::patch('/{id}/close', 'close')->name('close');
            Route::post('/{id}/mark-as-read', 'markAsRead')->name('mark-as-read');
        });

        // ===== SETTINGS =====
        Route::controller(SettingController::class)->prefix('settings')->name('settings.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::post('/reset', 'reset')->name('reset');
        });

        // ===== REPORTS & EXPORT =====
        Route::controller(ReportController::class)->prefix('reports')->name('reports.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/export/excel', 'exportExcel')->name('export.excel');
            Route::get('/export/pdf', 'exportPdf')->name('export.pdf');
        });

        // ===== API SEARCH =====
        Route::get('/api/search', [GlobalSearchController::class, 'search'])->name('api.search');
    });
});

// --------------------------------------------------------------------------
// AUTH ROUTES
// --------------------------------------------------------------------------
require __DIR__.'/auth.php';