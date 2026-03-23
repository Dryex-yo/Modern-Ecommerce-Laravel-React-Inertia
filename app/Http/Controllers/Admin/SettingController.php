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

        // Gabungkan dengan default values
        $settings = array_merge([
            'shop_name'       => 'DRYEX SHOP',
            'shop_email'      => 'admin@dryex.com',
            'shop_logo'       => null,
            'notif_orders'    => '1',
            'notif_stock'     => '1',
            'notif_email'     => '0',
            'notif_sound'     => '1',
            'currency_symbol' => 'Rp',
            'shop_address'    => '',
        ], $dbSettings);

        // Penting: Ubah path logo menjadi URL yang bisa diakses browser
        if ($settings['shop_logo'] && !str_starts_with($settings['shop_logo'], 'http')) {
            $settings['shop_logo'] = asset('storage/' . $settings['shop_logo']);
        }

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
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
            'bank_name'          => 'nullable|string',
            'bank_holder'        => 'nullable|string',
            'bank_account'       => 'nullable|string',
            'shipping_origin'    => 'nullable|string',
            'shipping_flat_rate' => 'nullable|numeric',
        ]);

        // 2. Handle Logo (Hapus yang lama jika upload baru)
        if ($request->hasFile('shop_logo')) {
            $oldLogo = Setting::where('key', 'shop_logo')->value('value');
            if ($oldLogo) {
                Storage::disk('public')->delete($oldLogo);
            }

            $path = $request->file('shop_logo')->store('settings', 'public');
            Setting::updateOrCreate(['key' => 'shop_logo'], ['value' => $path]);
        }

        // Hapus shop_logo dari array agar tidak bentrok di loop bawah
        unset($data['shop_logo']);

        // 3. Simpan data lainnya secara massal
        foreach ($data as $key => $value) {
            // Inertia sering mengirim boolean, kita paksa jadi '1' atau '0' untuk DB
            if (in_array($key, ['notif_orders', 'notif_stock', 'notif_email', 'notif_sound'])) {
                $finalValue = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
            } else {
                $finalValue = $value;
            }

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $finalValue ?? '']
            );
        }

        return back()->with('success', 'Pengaturan berhasil diperbarui!');
    }

    // Fungsi reset untuk mengembalikan ke setelan pabrik
    public function reset()
    {
        $keysToReset = ['shop_logo', 'shop_name', 'shop_email', 'notif_orders', 'notif_stock'];
        
        foreach ($keysToReset as $key) {
            if ($key === 'shop_logo') {
                $oldLogo = Setting::where('key', 'shop_logo')->value('value');
                if ($oldLogo) Storage::disk('public')->delete($oldLogo);
                Setting::updateOrCreate(['key' => $key], ['value' => null]);
            } else {
                // Beri nilai default
                $default = $key === 'shop_name' ? 'DRYEX SHOP' : ($key === 'shop_email' ? 'admin@dryex.com' : '1');
                Setting::updateOrCreate(['key' => $key], ['value' => $default]);
            }
        }

        return redirect()->back()->with('success', 'Pengaturan telah direset ke default.');
    }
}