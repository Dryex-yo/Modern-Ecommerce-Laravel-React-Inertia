# 🛍️ DryShop — Modern E-Commerce Platform

> **DryShop** adalah aplikasi e-commerce fullstack modern yang dibangun dengan **Laravel + React + Inertia.js**, dilengkapi sistem logistik J&T, pembayaran COD & Transfer, dan dashboard admin yang interaktif.

---

## 📸 Demo

https://github.com/user-attachments/assets/709ac4fd-ade6-4873-8133-17301f39d21d

---

## ✨ Key Features

### 🛍️ Customer Side
- **Katalog Produk** — Listing produk dengan detail, gambar, harga, dan stok
- **Wishlist** — Simpan produk favorit untuk dibeli kemudian
- **Keranjang Belanja** — Add to cart, edit quantity, hapus item
- **Checkout Pintar** — Kalkulasi ongkir otomatis (J&T EZ / ECO / Super)
- **Pembayaran COD & Transfer Bank** — Pilih metode bayar saat checkout; biaya COD Rp 5.000 otomatis dihitung
- **Resi Otomatis** — Nomor tracking `RESI-XXXXXX` dibuat saat order berhasil
- **Detail Pesanan** — Struk digital lengkap dengan info bank, metode pengiriman, dan resi
- **Profil Pengguna** — Edit avatar, data diri, dan password
- **Alamat Pengiriman Detail** — Input nama penerima, no. telp, provinsi, kecamatan, kota, kode pos

### 👨‍💼 Admin Dashboard
- **Overview Dashboard** — Statistik penjualan, pendapatan, produk, dan user
- **Manajemen Produk** — CRUD produk dengan upload gambar, harga, stok
- **Manajemen Kategori** — Kelompokkan produk berdasarkan kategori
- **Manajemen Pesanan** — Lihat semua pesanan, detail struk, update status
- **Manajemen User** — Pantau akun customer dan admin
- **Laporan Keuangan** — Transaksi & laporan bisnis
- **Analytics** — Grafik performa penjualan
- **Global Search** — Cari produk, order, user dari navbar dalam sekejap
- **Notifikasi Real-Time** — Bell icon otomatis polling pesanan pending setiap 10 detik, dengan push notification browser
- **System Settings** — Konfigurasi toko (nama, logo, alamat, email, bank rekening, asal pengiriman, preferensi notifikasi)

---

## 🚚 Logistik J&T Express

| Layanan | Keterangan |
|---|---|
| **JNT EZ** | Reguler — tarif dasar |
| **JNT ECO** | Ekonomi — 70% dari tarif dasar |
| **JNT Super** | Express — 150% dari tarif dasar |

> Tarif ongkir **dihitung dinamis** berdasarkan perbedaan kota asal pengiriman (dari Admin Settings) dengan kota tujuan pelanggan.

---

## 💳 Metode Pembayaran

| Metode | Keterangan |
|---|---|
| **Transfer Bank** | Ditampilkan nomor rekening & nama bank dari Admin Settings secara otomatis |
| **COD (Cash on Delivery)** | Ditambahkan biaya penanganan Rp 5.000 secara otomatis |

---

## 🎨 UI / UX Highlights

- **Dark Mode (Dark Blue Theme)** 🌙 — Tema gelap bernuansa navy biru yang elegan, tersedia di semua halaman
- **Tombol Home** 🏠 — Tersedia di semua layout untuk navigasi cepat ke toko
- **Animasi & Micro-interactions** — Hover scale, fade-in slide, animated pill tab switcher
- **Glassmorphism Cards** — Kartu mengambang dengan deep drop shadow
- **Admin Settings Premium** — Neon glow save button, animated tab switcher bergaya iOS
- **Fully Responsive** — Mobile-first design

---

## 🧠 Tech Stack

| Layer | Teknologi |
|---|---|
| **Backend** | Laravel 11 |
| **Frontend** | React 18 |
| **SPA Bridge** | Inertia.js |
| **CSS Framework** | Tailwind CSS 3 |
| **Database** | MySQL (via XAMPP) |
| **Auth** | Laravel Breeze |
| **Icons** | Lucide React |
| **File Storage** | Laravel Storage (local) |
| **HTTP Client** | Axios |

---

## ⚙️ Installation

```bash
# 1. Clone repository
git clone https://github.com/Dryex-yo/Modern-Ecommerce-Laravel-React-Inertia.git
cd Modern-Ecommerce-Laravel-React-Inertia

# 2. Install dependencies
composer install
npm install

# 3. Environment setup
cp .env.example .env
php artisan key:generate

# 4. Database
# Pastikan MySQL berjalan, lalu sesuaikan .env:
# DB_DATABASE=dryshop
php artisan migrate --seed

# 5. Storage link
php artisan storage:link

# 6. Run development server
php artisan serve
npm run dev
```

Buka `http://localhost:8000` dan login dengan akun admin yang sudah di-seed.

---

## 📁 Struktur Penting

```
dryshop/
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/          # OrderController, ProductController, dll
│   │   └── User/           # CartController, AddressController, dll
│   ├── Models/             # Order, Product, Cart, Address, Setting
│   └── Http/Middleware/    # HandleInertiaRequests (shared props)
├── resources/js/
│   ├── Layouts/            # AdminLayout, UserLayout, GuestLayout
│   ├── Pages/
│   │   ├── Admin/          # Dashboard, Orders, Products, Settings
│   │   └── User/           # Cart, Orders, Wishlist
│   ├── Components/         # ThemeToggle, SidebarItem, dll
│   └── Contexts/           # ThemeContext (dark mode state)
├── database/migrations/    # Semua skema database
└── routes/web.php          # Semua routing
```

---

## 🚀 Why Choose This Project?

- ⚡ **SPA Experience** — Navigasi tanpa reload halaman (Inertia.js)
- 🔒 **Secure** — CSRF protection, validasi ketat, role-based access
- 📦 **Logistik Terintegrasi** — Kalkulasi ongkir otomatis ala J&T
- 🌙 **Dark Blue Mode** — Tema gelap navy premium yang elegan
- 🔔 **Real-time Notifikasi** — Admin langsung tahu ada pesanan baru
- 📱 **Fully Responsive** — Optimal di semua ukuran layar

---

## 💼 Available for Freelance Work

Saya tersedia untuk:
- Pengembangan website e-commerce
- Custom Laravel + React apps
- Admin dashboard systems

📩 **Hubungi saya:**
- Email: derysupriyadi1@gmail.com

---

## ⭐ Support

Jika kamu suka project ini:

- ⭐ **Star** repository ini
- 🍴 **Fork** dan gunakan
- 💬 **Hubungi** saya untuk kerja sama

> This project is for portfolio purposes.  
> For commercial use or full source code access, please contact me.

---

**© 2026 DryShop — Engineered for Excellence**
