import AdminLayout from '@/Layouts/AdminLayout';
import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, categories }) {
    // Menggunakan helper useForm dari Inertia untuk handle input
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        price: '',
        stock: '',
        description: '',
        image: null,
        gallery: [],
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        // Batasi maksimal 10
        const limitedFiles = files.slice(0, 10);
        
        setData('gallery', limitedFiles);
        
        // Buat preview untuk semua foto yang dipilih
        const previews = limitedFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews(previews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                window.location.href = route('admin.products.index');
            },
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Add New Product" />

            <div className="mb-8">
                <Link href={route('admin.products.index')} className="text-sm text-blue-600 font-bold hover:underline">← Back to List</Link>
                <h2 className="text-2xl font-black text-slate-800 mt-2">Add New Product</h2>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-white max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
                        <input 
                            type="text" value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all"
                            placeholder="e.g. Nike Air Jordan"
                        />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                            <select 
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Price (Rp)</label>
                            <input 
                                type="number" value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50"
                            />
                        </div>
                    </div>  
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Stock</label>
                            <input 
                                type="number" value={data.stock}
                                onChange={e => setData('stock', e.target.value)}
                                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50"
                            />
                        </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Produk</label>
                                <textarea 
                                    className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                    rows="4"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    placeholder="Jelaskan detail produk Anda..."
                                ></textarea>
                                {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                            </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Foto Utama (Thumbnail)</label>
                            <input 
                                type="file" 
                                onChange={handleImageChange}
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {imagePreview && <img src={imagePreview} className="mt-2 w-32 h-32 object-cover rounded-lg" />}
                        </div>
                        {/* UNGGAH GALERI (MAKSIMAL 10 FOTO) */}
                        <div className="mt-4">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Foto Galeri (Maksimal 10)</label>
                            <input 
                                type="file" 
                                multiple 
                                onChange={handleGalleryChange}
                                accept="image/*"
                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                            />
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
                                Pilih beberapa foto sekaligus dengan menahan tombol Ctrl/Cmd
                            </p>
                            
                            {/* Preview Galeri */}
                            {galleryPreviews.length > 0 && (
                            <div className="grid grid-cols-5 gap-2 mt-4">
                                {galleryPreviews.map((url, index) => (
                                    <div key={index} className="relative aspect-square group">
                                        <img 
                                            src={url} 
                                            alt={`Preview ${index}`} 
                                            className="w-full h-full object-cover rounded-xl shadow-sm border border-white"
                                        />
                                        <span className="absolute top-1 left-1 bg-black/50 text-white text-[10px] px-1.5 rounded-md font-bold">
                                            {index + 1}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {processing ? 'SAVING...' : 'CREATE PRODUCT'}
                        </button>
                </form>
            </div>
        </AdminLayout>
    );
}