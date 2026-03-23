import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Package, ShoppingBag } from 'lucide-react';

export default function Index({ auth, products = [] }) {
    
    // Fungsi untuk menghapus produk
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            router.delete(route('products.destroy', id));
        }
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Inventory Produk" />

            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Products Inventory</h2>
                    <p className="text-sm text-slate-400 font-medium">Kelola stok dan daftar item toko Anda secara real-time.</p>
                </div>

                <Link 
                    href={route('admin.products.create')} 
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all text-sm"
                >
                    <Plus size={18} /> Add New Product
                </Link>
            </div>
            
            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                                    {/* Info Produk */}
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                                {product.image ? (
                                                    <img 
                                                        src={`/storage/${product.image}`} 
                                                        className="w-full h-full object-cover" 
                                                        alt={product.name} 
                                                        onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image' }}
                                                    />
                                                ) : (
                                                    <Package size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700">{product.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Kategori */}
                                    <td className="p-6">
                                        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-[11px]">
                                            {product.category}
                                        </span>
                                    </td>

                                    {/* Harga */}
                                    <td className="p-6 font-black text-slate-700">
                                        Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                                    </td>

                                    {/* Stok */}
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-xs font-black ${product.stock < 10 ? 'text-orange-500' : 'text-blue-600'}`}>
                                                {product.stock} pcs
                                            </span>
                                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${product.stock < 10 ? 'bg-orange-500' : 'bg-blue-600'}`} 
                                                    style={{ width: `${Math.min(product.stock, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Tombol Aksi */}
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link 
                                                href={route('admin.products.edit', product.id)} 
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                title="Edit Produk"
                                            >
                                                <Edit size={18} />
                                            </Link>

                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Hapus Produk"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-20 text-center">
                                    <div className="flex flex-col items-center">
                                        <ShoppingBag size={48} className="text-slate-200 mb-3" />
                                        <h3 className="text-lg font-bold text-slate-400">Belum Ada Produk</h3>
                                        <p className="text-sm text-slate-300">Klik "Add New Product" untuk mulai mengisi etalase.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}