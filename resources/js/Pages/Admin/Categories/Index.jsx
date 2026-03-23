import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, FolderTree, Package, X, Check } from 'lucide-react';

export default function Index({ auth, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const categoryData = Array.isArray(categories) ? categories : categories.data;

    // Inertia Form Helper
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
    });

    // Fungsi buka modal Tambah
    const openAddModal = () => {
        setEditData(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    // Fungsi buka modal Edit
    const openEditModal = (category) => {
        setEditData(category);
        setData({
            name: category.name,
            description: category.description || '',
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
        
        if (editData) {
            // Jalankan fungsi UPDATE di Controller
            put(route('admin.categories.update', editData.id), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            // Jalankan fungsi STORE di Controller
            post(route('admin.categories.store'), {
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (!id) return;
        
        if (confirm('Yakin ingin menghapus kategori ini?')) {
            router.delete(route('admin.categories.destroy', id), {
            preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Kategori Produk" />

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Kategori</h2>
                    <p className="text-slate-500 font-medium">Kelola kelompok produk Anda.</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                    <Plus size={20} /> Tambah Baru
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Info Kategori</th>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">Produk Terkait</th>
                            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50/50 transition-all group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                                            <FolderTree size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{cat.name}</p>
                                            <p className="text-xs text-slate-400 font-medium italic">/{cat.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black inline-flex items-center gap-2">
                                        <Package size={14} /> {cat.products_count} Item
                                    </span>
                                </td>
                                <td className="p-6 text-right space-x-1">
                                    <button onClick={() => openEditModal(cat)} className="p-3 text-amber-500 hover:bg-amber-50 rounded-xl transition-colors"><Pencil size={18}/></button>
                                    <button onClick={() => handleDelete(cat.id)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Create & Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button onClick={closeModal} className="absolute top-8 right-8 text-slate-300 hover:text-slate-600 transition-colors"><X size={24}/></button>
                        
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-800">{editData ? 'Perbarui Kategori' : 'Kategori Baru'}</h3>
                            <p className="text-slate-500 text-sm font-medium">Isi detail kategori produk di bawah ini.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Nama Kategori</label>
                                <input 
                                    type="text" 
                                    autoFocus
                                    className={`w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-2 transition-all ${errors.name ? 'ring-2 ring-rose-500 focus:ring-rose-500' : 'focus:ring-indigo-500'}`}
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Contoh: Sepatu Lari"
                                />
                                {errors.name && <p className="text-rose-500 text-xs mt-2 font-bold">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Deskripsi (Opsional)</label>
                                <textarea 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Penjelasan singkat kategori..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 bg-slate-100 text-slate-600 p-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    disabled={processing}
                                    className="flex-[2] bg-indigo-600 text-white p-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Menyimpan...' : (
                                        <>
                                            <Check size={20} /> {editData ? 'Update' : 'Simpan'}
                                        </>
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