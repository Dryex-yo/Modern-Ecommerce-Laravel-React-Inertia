<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'addresses' => $request->user()->addresses,
            'paymentMethods' => $request->user()->paymentMethods,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        // 1. Validasi data yang masuk
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'display_name' => 'nullable|string|max:255',
            'email'        => 'required|email|max:255|unique:users,email,' . $request->user()->id,
            'phone'        => 'nullable|string|max:20',
            'avatar'       => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $user = $request->user();

        // 2. Update data teks
        $user->name = $request->name;
        $user->display_name = $request->display_name;
        $user->email = $request->email;
        $user->phone = $request->phone;

        // 3. Handle Upload Avatar (Jika ada)
        if ($request->hasFile('avatar')) {
            // Hapus file lama (Hanya jika ada dan filenya memang eksis)
            // Gunakan Storage::disk('public')->delete agar lebih bersih dan aman daripada unlink
            if ($user->avatar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
            }

            // Simpan file baru
            // store('avatars', 'public') akan menghasilkan path seperti: avatars/namafile.jpg
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // Simpan PATH-nya saja ke database
            $user->avatar = $path; 
        }

        // 4. Update field lainnya
        $user->fill([
            'name' => $request->name,
            'display_name' => $request->display_name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        $user->save();

        // Gunakan redirect()->back() agar Inertia me-refresh props secara otomatis
        return redirect()->back()->with('success', 'Profile updated successfully!');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'current_password.current_password' => 'Password saat ini tidak sesuai',
            'password.min' => 'Password minimal 8 karakter',
            'password.confirmed' => 'Password tidak cocok dengan konfirmasi',
        ]);

        $request->user()->update([
            'password' => bcrypt($validated['password']),
        ]);

        return redirect()->back()->with('success', 'Password berhasil diperbarui!');
    }

    /**
     * Toggle Two Factor Authentication.
     */
    public function toggle2FA(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        // Toggle two_factor_enabled field (jika ada di users table)
        // Jika field belum ada, tambahkan migration terlebih dahulu
        if (!isset($user->two_factor_enabled)) {
            // Fallback: gunakan field lain atau buat logic alternatif
            return redirect()->back()->with('error', 'Two-Factor Authentication belum dikonfigurasi');
        }

        $user->update([
            'two_factor_enabled' => !$user->two_factor_enabled,
        ]);

        $status = $user->two_factor_enabled ? 'diaktifkan' : 'dinonaktifkan';
        return redirect()->back()->with('success', "Two-Factor Authentication {$status}!");
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
