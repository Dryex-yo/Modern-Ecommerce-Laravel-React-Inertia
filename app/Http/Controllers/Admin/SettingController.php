<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
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

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function store(Request $request)
    {
        // Validasi dasar (optional tapi disarankan)
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

        if ($request->hasFile('shop_logo')) {
            
        // Simpan logo baru ke folder 'settings' di storage/public
        $path = $request->file('shop_logo')->store('settings', 'public');
        
        // Simpan path ke database
        Setting::updateOrCreate(['key' => 'shop_logo'], ['value' => $path]);
        }

        // Simpan setiap key ke database
        foreach ($data as $key => $value) {
            // Kita konversi boolean atau null ke string agar konsisten di database
            $finalValue = is_bool($value) ? ($value ? '1' : '0') : $value;
            
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $finalValue ?? '']
            );
        }

        return back()->with('success', 'Settings & Preferences updated successfully!');
    }
}