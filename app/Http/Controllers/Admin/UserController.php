<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Menampilkan daftar semua user untuk Admin.
     */
    public function index()
    {
        // Mengambil semua user dengan pagination
        $users = User::latest()->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Menampilkan detail user tertentu (Opsional).
     */
    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Update data user (misal ganti role) oleh Admin.
     */
    public function update(Request $request, User $user)
    {
        // Validasi cukup dilakukan sekali dan masukkan ke variabel
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|in:admin,user',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        // Update menggunakan data yang sudah tervalidasi
        $user->update($validated);

        return redirect()->back()->with('message', 'User updated successfully');
    }

    /**
     * Hapus user oleh Admin.
     */
    public function destroy($id)
    {
        // Cek apakah $id ada isinya
        if (!$id) {
            return back()->with('error', 'ID User tidak valid.');
        }

        // Ambil data user secara manual tanpa Route Model Binding
        $user = User::find($id);

        // Jika user tidak ditemukan
        if (!$user) {
            return back()->with('error', 'User dengan ID ' . $id . ' tidak ditemukan di database.');
        }

        // Proteksi: Jangan hapus diri sendiri
        if ((int)$user->id === (int)Auth::id()) {
            return back()->with('error', 'Anda tidak bisa menghapus akun sendiri!');
        }

        try {
            $user->delete();
            return redirect()->route('admin.users.index')->with('success', 'User berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus: ' . $e->getMessage());
        }
    }
}