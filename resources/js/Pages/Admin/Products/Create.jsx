import AdminLayout from '@/Layouts/AdminLayout';
import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, categories }) {
    // Menggunakan helper useForm dari Inertia untuk handle input
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category_id: '',
        category_name: '',
        price: '',
        stock: '',
        description: '',
        image: null,
        gallery: new Array(10).fill(null),
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [submitError, setSubmitError] = useState('');
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleGalleryChange = (e) => {
        const pickedFiles = Array.from(e.target.files);
        const newGallery = [...data.gallery];
        let fileIndex = 0;
        for (let i = 0; i < newGallery.length; i++) {
            if (newGallery[i] === null && fileIndex < pickedFiles.length) {
                newGallery[i] = pickedFiles[fileIndex];
                fileIndex++;
            }
        }
        setData('gallery', newGallery);
    };

    // Fungsi Drag & Drop
    const handleDragStart = (index) => setDraggedIndex(index);
    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (targetIndex) => {
        if (draggedIndex === null) return;
        const newGallery = [...data.gallery];
        const temp = newGallery[draggedIndex];
        newGallery[draggedIndex] = newGallery[targetIndex];
        newGallery[targetIndex] = temp;
        setData('gallery', newGallery);
        setDraggedIndex(null);
    };

    // Fungsi Hapus (Tombol X)
    const removeImage = (index) => {
        const newGallery = [...data.gallery];
        newGallery[index] = null; // Kembali ke status Empty
        setData('gallery', newGallery);
    };    

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitError('');
        
        // Validate image is selected
        if (!data.image) {
            setSubmitError('Gambar produk wajib diunggah');
            return;
        }

        // Filter out null values from gallery before submitting
        const cleanedGallery = data.gallery.filter(file => file !== null);
        
        post(route('admin.products.store'), {
            ...data,
            gallery: cleanedGallery,
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (response) => {
                window.location.href = route('admin.products.index');
            },
            onError: (errors) => {
                console.error('Form submission error:', errors);
                const errorMessages = Object.values(errors).flat().join('\n');
                setSubmitError(errorMessages || 'Terjadi kesalahan saat membuat produk. Silakan lihat console untuk detail.');
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
                    {submitError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-700 font-semibold text-sm">Error:</p>
                            <p className="text-red-600 text-sm whitespace-pre-wrap">{submitError}</p>
                        </div>
                    )}
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
                            <label className="block mb-2">Kategori</label>
                                <input
                                    type="text"
                                    list="categoryOptions"
                                    value={data.category_name}
                                    onChange={e => setData('category_name', e.target.value)}
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Ketik kategori baru atau pilih yang ada..."
                                />
                                <datalist id="categoryOptions">
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name} />
                                    ))}
                                </datalist>
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
                        <div className="mt-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Foto Galeri (Maksimal 10)</label>
                            <input 
                                type="file" multiple accept="image/*"
                                onChange={handleGalleryChange}
                                className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
                            />

                            {/* Grid 10 Slot */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {data.gallery.map((file, index) => (
                                    <div 
                                        key={index}
                                        draggable={file !== null}
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(index)}
                                        className={`relative aspect-square border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center overflow-hidden transition-all duration-300
                                            ${file ? 'border-transparent shadow-md cursor-grab active:cursor-grabbing' : 'border-slate-200 bg-slate-50'}
                                            ${draggedIndex === index ? 'opacity-40 scale-90' : 'opacity-100'}
                                        `}
                                    >
                                        {file ? (
                                            <>
                                                <img 
                                                    src={URL.createObjectURL(file)} 
                                                    className="w-full h-full object-cover pointer-events-none" 
                                                />
                                                
                                                {/* Nomor Urut */}
                                                <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                                    {index + 1}
                                                </div>

                                                {/* Tombol X (Hapus) */}
                                                <button 
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white text-slate-600 w-6 h-6 flex items-center justify-center rounded-full shadow-sm transition-all z-10"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            /* Tampilan Slot Kosong */
                                            <div className="text-center group">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block">Slot {index + 1}</span>
                                                <span className="text-[8px] font-bold text-slate-300 uppercase block mt-1">Empty</span>
                                                <input 
                                                    type="file" 
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const newGal = [...data.gallery];
                                                        newGal[index] = e.target.files[0];
                                                        setData('gallery', newGal);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
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