import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Users, 
    Pencil, 
    Trash2, 
    ShieldCheck, 
    User as UserIcon, 
    X, 
    Check,
    Mail
} from 'lucide-react';

export default function Index({ auth, users }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Inertia Form untuk Update User
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        role: '',
    });

    // Fungsi buka modal Edit
    const openEditModal = (user) => {
        setEditData(user);
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirimkan ID user yang sedang diedit (editData.id)
        put(route('admin.users.update', editData.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            // Mengirimkan ID ke destroy function di controller
            router.delete(route('admin.users.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="User Management" />

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Users</h2>
                    <p className="text-slate-500 font-medium">Kelola hak akses dan data pengguna sistem.</p>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">User Info</th>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Role</th>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.data.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                            <UserIcon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{user.name}</p>
                                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                                <Mail size={12} /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-2 ${
                                        user.role === 'admin' 
                                        ? 'bg-indigo-100 text-indigo-600' 
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        <ShieldCheck size={14} /> {user.role}
                                    </span>
                                </td>
                                <td className="p-6 text-right space-x-1">
                                    <button onClick={() => openEditModal(user)} className="p-3 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors"><Pencil size={18}/></button>
                                    
                                    {/* Tombol Delete mengirimkan user.id */}
                                    <button 
                                        onClick={() => handleDelete(user.id)} 
                                        className={`p-3 rounded-xl transition-colors ${user.id === auth.user.id ? 'text-slate-300 cursor-not-allowed' : 'text-rose-500 hover:bg-rose-50'}`}
                                        disabled={user.id === auth.user.id}
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Manual atau Sederhana */}
            <div className="mt-6 flex justify-center gap-2">
                {users.links.map((link, i) => (
                    <button
                        key={i}
                        disabled={!link.url || link.active}
                        onClick={() => router.get(link.url)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            link.active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>

            {/* Modal Edit User */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl relative">
                        <button onClick={closeModal} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600">
                            <X size={24}/>
                        </button>
                        
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-800">Edit User</h3>
                            <p className="text-slate-500 text-sm font-medium">Perbarui detail akun dan hak akses user.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nama */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Masukkan nama..."
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <span className="text-red-500 text-xs mt-1 ml-1">{errors.name}</span>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Alamat Email</label>
                                <input 
                                    type="email" 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="email@contoh.com"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <span className="text-red-500 text-xs mt-1 ml-1">{errors.email}</span>}
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Hak Akses</label>
                                <select 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                >
                                    <option value="user">User Standar</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            {/* Password (Opsional) */}
                            <div className="pt-2 border-t border-slate-50 mt-4">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ganti Password (Kosongkan jika tidak diubah)</label>
                                <input 
                                    type="password" 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Minimal 8 karakter..."
                                    value={data.password || ''}
                                    onChange={e => setData('password', e.target.value)}
                                />
                                {errors.password && <span className="text-red-500 text-xs mt-1 ml-1">{errors.password}</span>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-6">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-2xl font-black hover:bg-slate-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    disabled={processing}
                                    className="flex-[2] bg-indigo-600 text-white p-4 rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    {processing ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <><Check size={20} /> Simpan Perubahan</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}