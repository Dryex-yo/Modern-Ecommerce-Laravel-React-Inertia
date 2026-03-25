# 🚀 DryShop Developer Quick Start Guide

## Struktur Aplikasi DryShop (Perbaikan Terbaru)

### ✅ One-Way Data Flow Architecture

```
    Frontend (React)
         ↓
  React Components
  - Pages/
  - Components/
         ↓
   Inertia Props
  (Data dari Backend)
         ↓
  User Interactions
  (POST/PATCH/DELETE)
         ↓
   Laravel Routes
         ↓
   Controllers
  (Receive & Process)
         ↓
  Form Requests
  (Validation & Auth)
         ↓
  Service Layer
  (Business Logic)
         ↓
   Eloquent Models
   (Database Access)
         ↓
    Database
```

---

## 🔐 Langkah-Langkah Membuat Feature AMAN

### Contoh: Membuat Feature "Discount Code"

#### 1️⃣ Create Form Request Class

**File:** `app/Http/Requests/StoreDiscountRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDiscountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:50|unique:discounts,code',
            'discount_percent' => 'required|numeric|min:0|max:100',
            'expires_at' => 'required|date|after:today',
            'max_usage' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'code.unique' => 'Kode diskon sudah terdaftar',
            'discount_percent.max' => 'Diskon tidak boleh lebih dari 100%',
        ];
    }
}
```

#### 2️⃣ Create Service Class

**File:** `app/Services/DiscountService.php`

```php
<?php

namespace App\Services;

use App\Models\Discount;
use Illuminate\Support\Str;

class DiscountService
{
    /**
     * Create new discount
     */
    public function createDiscount(array $data): Discount
    {
        return Discount::create([
            'code' => strtoupper($data['code']),
            'discount_percent' => $data['discount_percent'],
            'expires_at' => $data['expires_at'],
            'max_usage' => $data['max_usage'],
            'is_active' => true,
        ]);
    }

    /**
     * Apply discount to order
     * Returns: discount_amount or false if invalid
     */
    public function applyDiscount(string $code, float $totalPrice): float|false
    {
        $discount = Discount::where('code', strtoupper($code))
            ->where('is_active', true)
            ->where('expires_at', '>', now())
            ->first();

        if (!$discount || $discount->usage >= $discount->max_usage) {
            return false;
        }

        $discountAmount = ($totalPrice * $discount->discount_percent) / 100;
        $discount->increment('usage');

        return $discountAmount;
    }
}
```

#### 3️⃣ Create Controller

**File:** `app/Http/Controllers/Admin/DiscountController.php`

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDiscountRequest;
use App\Services\DiscountService;
use App\Models\Discount;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function __construct(private DiscountService $discountService)
    {}

    public function index()
    {
        $discounts = Discount::latest()->paginate(15);
        
        return Inertia::render('Admin/Discounts/Index', [
            'discounts' => $discounts
        ]);
    }

    public function store(StoreDiscountRequest $request)
    {
        $discount = $this->discountService->createDiscount($request->validated());

        return redirect()->route('admin.discounts.index')
            ->with('message', 'Kode diskon berhasil ditambahkan!');
    }
}
```

#### 4️⃣ Create Routes

**File:** `routes/web.php` (di dalam admin middleware group)

```php
// --- DISCOUNTS ---
Route::controller(DiscountController::class)->prefix('discounts')->name('discounts.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::post('/', 'store')->name('store');
    Route::patch('/{discount}', 'update')->name('update');
    Route::delete('/{discount}', 'destroy')->name('destroy');
});
```

#### 5️⃣ Create React Component

**File:** `resources/js/Pages/Admin/Discounts/Index.jsx`

```jsx
import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ auth, discounts = [] }) {
    const [formData, setFormData] = useState({
        code: '',
        discount_percent: '',
        expires_at: '',
        max_usage: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // ✅ SAFE: Using Inertia router
        router.post(route('admin.discounts.store'), formData);
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Discount Codes" />
            
            {/* Form untuk create discount */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg mb-6">
                <input
                    type="text"
                    placeholder="Kode Diskon"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
                {/* ... more form fields ... */}
                <button type="submit">Tambah Diskon</button>
            </form>

            {/* List discounts */}
            <div className="bg-white rounded-lg p-6">
                {discounts.data.map(discount => (
                    <div key={discount.id} className="border-b pb-4">
                        <h3>{discount.code}</h3>
                        <p>Diskon: {discount.discount_percent}%</p>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
```

---

## ✅ Security Checklist untuk Setiap Feature

Sebelum commit, pastikan:

- [ ] **Input Validation**
  ```php
  // ✅ GUNAKAN Form Request
  class StoreXRequest extends FormRequest {
      public function rules() { ... }
  }

  // ❌ JANGAN gunakan $request->all() tanpa validasi
  $data = $request->all(); // BAHAYA!
  ```

- [ ] **Authorization Check**
  ```php
  // ✅ GUNAKAN authorize() di Form Request
  public function authorize() {
      return $this->user() && $this->user()->role === 'admin';
  }

  // Atau gunakan Policy
  if ($this->authorize('delete', $product)) { ... }
  ```

- [ ] **SQL Injection Prevention**
  ```php
  // ✅ GUNAKAN Eloquent
  $products = Product::where('name', 'LIKE', "%{$query}%")->get();

  // ✅ GUNAKAN Parameter Binding
  $users = DB::select('SELECT * FROM users WHERE id = ?', [$id]);

  // ❌ JANGAN gunakan string interpolation di raw SQL
  $users = DB::select("SELECT * FROM users WHERE id = $id");
  ```

- [ ] **No Direct Database Access di Routes**
  ```php
  // ❌ JANGAN langsung query di routes
  Route::get('/products', function () {
      return Product::all(); // TIDAK RECOMMENDED
  });

  // ✅ GUNAKAN Controller + Service
  Route::get('/products', [ProductController::class, 'index']);
  ```

- [ ] **Proper Error Handling**
  ```php
  // ✅ GUNAKAN try-catch untuk critical operations
  try {
      $product = $this->productService->createProduct($data);
  } catch (Exception $e) {
      Log::error('Product creation failed', ['error' => $e->getMessage()]);
      return back()->with('error', 'Gagal membuat produk');
  }
  ```

---

## 🧪 Testing New Features

### Unit Test Example

**File:** `tests/Unit/Services/DiscountServiceTest.php`

```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\DiscountService;
use App\Models\Discount;

class DiscountServiceTest extends TestCase
{
    public function test_apply_discount_reduces_price()
    {
        $service = new DiscountService();
        
        $discount = Discount::create([
            'code' => 'SAVE10',
            'discount_percent' => 10,
            'expires_at' => now()->addDays(30),
            'max_usage' => 100,
            'is_active' => true,
        ]);

        $originalPrice = 100000;
        $discountAmount = $service->applyDiscount('SAVE10', $originalPrice);

        $this->assertEquals(10000, $discountAmount);
    }

    public function test_apply_discount_returns_false_for_expired()
    {
        $service = new DiscountService();
        
        $discount = Discount::create([
            'code' => 'EXPIRED',
            'discount_percent' => 10,
            'expires_at' => now()->subDays(1), // Already expired
            'max_usage' => 100,
            'is_active' => true,
        ]);

        $result = $service->applyDiscount('EXPIRED', 100000);

        $this->assertFalse($result);
    }
}
```

### Feature Test Example

**File:** `tests/Feature/Admin/DiscountControllerTest.php`

```php
<?php

namespace Tests\Feature\Admin;

use Tests\TestCase;
use App\Models\User;

class DiscountControllerTest extends TestCase
{
    public function test_can_create_discount_as_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.discounts.store'), [
            'code' => 'SAVE10',
            'discount_percent' => 10,
            'expires_at' => now()->addDays(30)->format('Y-m-d'),
            'max_usage' => 100,
        ]);

        $response->assertRedirect(route('admin.discounts.index'));
        $this->assertDatabaseHas('discounts', ['code' => 'SAVE10']);
    }

    public function test_cannot_create_discount_as_user()
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->post(route('admin.discounts.store'), [
            'code' => 'SAVE10',
            'discount_percent' => 10,
            'expires_at' => now()->addDays(30)->format('Y-m-d'),
            'max_usage' => 100,
        ]);

        $response->assertForbidden();
    }
}
```

---

## 📋 File Structure Conventions

```
Feature: Customer Wishlist Management

controller:         app/Http/Controllers/WishlistController.php
form-request:       app/Http/Requests/StoreWishlistRequest.php
service:            app/Services/WishlistService.php
model:              app/Models/Wishlist.php
migration:          database/migrations/****_create_wishlists_table.php
react-page:         resources/js/Pages/User/Wishlist.jsx
react-component:    resources/js/Components/WishlistButton.jsx
routes:             routes/web.php (under authenticated group)
policy:             app/Policies/WishlistPolicy.php (jika perlu)
test-unit:          tests/Unit/Services/WishlistServiceTest.php
test-feature:       tests/Feature/WishlistControllerTest.php
```

---

## 🚨 Common Security Mistakes to AVOID

```php
// ❌ MISTAKE 1: Direct SQL without parameterization
$users = DB::select("SELECT * FROM users WHERE email = '{$email}'");

// ✅ CORRECT: Use parameterized query
$users = DB::select("SELECT * FROM users WHERE email = ?", [$email]);

// ❌ MISTAKE 2: No input validation
$product = Product::create($request->all());

// ✅ CORRECT: Use Form Request with validation
$product = $this->productService->create($request->validated());

// ❌ MISTAKE 3: No authorization check
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// ✅ CORRECT: Add middleware & authorization
Route::delete('/products/{id}', [ProductController::class, 'destroy'])
    ->middleware(['auth', 'can:delete-products']);

// ❌ MISTAKE 4: Exposing sensitive data in API
return $user->toArray(); // Contains password hash, etc!

// ✅ CORRECT: Use Resource or select specific fields
return $user->only(['id', 'name', 'email']);
// atau
return UserResource::make($user);

// ❌ MISTAKE 5: Mass assignment vulnerability
Product::create($request->all()); // All fields editable!

// ✅ CORRECT: Use fillable or guarded on model
class Product extends Model {
    protected $fillable = ['name', 'price', 'stock', ...];
}
```

---

## 📞 Support & Questions

Jika ada pertanyaan tentang keamanan atau arsitektur:

1. **Review SECURITY_ARCHITECTURE.md** - Dokumentasi lengkap
2. **Check existing services** - Pattern di ProductService.php
3. **Reference Laravel docs** - https://laravel.com/docs

---

**Version:** 1.0  
**Last Updated:** March 2025
