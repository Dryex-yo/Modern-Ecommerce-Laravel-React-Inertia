<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;


class SettingController extends Controller
{
    public function index()
    {
        // Ambil semua setting dan ubah jadi format key => value
        $dbSettings = Setting::pluck('value', 'key')->toArray();

        // Gabungkan dengan default values agar toggle di React punya nilai awal
        $settings = array_merge([
            'shop_name'        => 'DRYEX SHOP',
            'shop_email'       => 'admin@dryex.com',
            'notif_orders'     => '1', // Default ON (disimpan sebagai string '1' atau '0')
            'notif_stock'      => '1', // Default ON
            'notif_email'      => '0', // Default OFF
            'notif_sound'      => '1', // Default ON
            'currency_symbol'  => 'Rp',
        ], $dbSettings);

        return Inertia::render('Admin/Settings/Index');
    }

    public function store(Request $request)
    {
        // 1. Validasi
        $data = $request->validate([
            'shop_name'    => 'nullable|string|max:255',
            'shop_email'   => 'nullable|email',
            'shop_logo'    => 'nullable|image|mimes:jpg,jpeg,png,svg|max:2048',
            'notif_orders' => 'nullable',
            'notif_stock'  => 'nullable',
            'notif_email'  => 'nullable',
            'notif_sound'  => 'nullable',
            'shop_address' => 'nullable|string',
        ]);

        // 2. Handle Logo secara terpisah
        if ($request->hasFile('shop_logo')) {
            $path = $request->file('shop_logo')->store('settings', 'public');
            Setting::updateOrCreate(['key' => 'shop_logo'], ['value' => $path]);
        }

        // 3. Hapus shop_logo dari array $data agar tidak ikut masuk ke loop
        unset($data['shop_logo']);

        // 4. Simpan semua data lainnya
        foreach ($data as $key => $value) {
            // Konversi boolean ke string '1' atau '0'
            $finalValue = is_bool($value) ? ($value ? '1' : '0') : $value;

            Setting::updateOrCreate(
                ['key' => $key], // Gunakan variabel $key dari loop
                ['value' => $finalValue] // Gunakan nilai asli dari input
            );
        }

        return back()->with('success', 'Settings & Preferences updated successfully!');
    }

    public function update(Request $request)
    {
        $inputs = $request->except(['_token', 'shop_logo']);
        
        foreach ($inputs as $key => $value) {
        // UpdateOrCreate akan membuat record baru jika key belum ada
        \App\Models\Setting::updateOrCreate(
            ['key' => $key],
            ['value' => $value ?? ''] // Pastikan tidak null agar tidak error di DB
        );

        return redirect()->back()->with('success', 'Pengaturan pembayaran dan pengiriman diperbarui!');
        }
    }

    public function reset()
    {
        // 1. Ambil nama file logo lama
        $oldLogo = Setting::where('key', 'shop_logo')->value('value');

        // 2. Hapus file fisik dari storage jika ada
        if ($oldLogo && Storage::disk('public')->exists($oldLogo)) {
            Storage::disk('public')->delete($oldLogo);
        }

        // 3. Reset nilai ke default atau kosongkan
        Setting::where('key', 'shop_logo')->update(['value' => null]);
        Setting::where('key', 'shop_name')->update(['value' => 'DRYEX SHOP']);
        Setting::where('key', 'shop_email')->update(['value' => 'admin@dryex.com']);

        return redirect()->back()->with('success', 'Settings have been reset to default.');
    }
}