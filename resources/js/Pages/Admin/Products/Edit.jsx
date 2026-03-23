import AdminLayout from '@/Layouts/AdminLayout';
import React, { useState, useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Trash2, Plus, Move } from 'lucide-react';

export default function Edit({ auth, product }) {
    // 1. Inisialisasi useForm
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        stock: product.stock || '',
        description: product.description || '',
        image: null,
        gallery: [], // Untuk file baru yang akan diupload
    });

    const [imagePreview, setImagePreview] = useState(product.image ? `/storage/${product.image}` : null);
    
    // State untuk mengelola tampilan 10 slot galeri
    const [displayGallery, setDisplayGallery] = useState([]);

    // Mengatur 10 slot (isi foto yang ada + slot kosong)
    useEffect(() => {
        const existingImages = product.images || [];
        const emptySlots = Array(10 - existingImages.length).fill(null);
        setDisplayGallery([...existingImages, ...emptySlots]);
    }, [product.images]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Handler untuk menambah foto ke slot kosong
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        // Hitung sisa slot kosong yang tersedia
        const currentImagesCount = product.images.length;
        const availableSlots = 10 - currentImagesCount;
        
        const newFiles = files.slice(0, availableSlots);
        setData('gallery', [...data.gallery, ...newFiles]);
        
        // Update preview sementara untuk UI
        const tempPreviews = newFiles.map(file => ({
            id: 'temp-' + Math.random(),
            image_path: URL.createObjectURL(file),
            isTemp: true
        }));
        
        const currentDisplay = [...displayGallery];
        let fileIdx = 0;
        const updatedDisplay = currentDisplay.map(slot => {
            if (slot === null && fileIdx < tempPreviews.length) {
                return tempPreviews[fileIdx++];
            }
            return slot;
        });
        setDisplayGallery(updatedDisplay);
    };

    const handleDeleteExisting = (id) => {
        if (confirm('Hapus foto ini dari galeri?')) {
            router.delete(route('product-images.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // --- LOGIKA DRAG & DROP POSISI ---
    const handleDragStart = (e, index) => {
        if (displayGallery[index] === null) return;
        e.dataTransfer.setData('dragIndex', index);
    };

    const handleDrop = (e, dropIndex) => {
        const dragIndex = e.dataTransfer.getData('dragIndex');
        if (dragIndex === undefined || dragIndex === "") return;

        const newGallery = [...displayGallery];
        const draggedItem = newGallery[dragIndex];
        
        // Tukar posisi
        newGallery[dragIndex] = newGallery[dropIndex];
        newGallery[dropIndex] = draggedItem;
        
        setDisplayGallery(newGallery);
        // Note: Untuk simpan posisi permanen, butuh endpoint sort di controller
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.update', product.id));
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Edit Product" />

            <div className="mb-8 text-center lg:text-left">
                <Link href={route('admin.products.index')} className="text-sm text-blue-600 font-bold hover:underline">
                    ← Back to Inventory
                </Link>
                <h2 className="text-3xl font-black text-slate-800 mt-2">Update Product</h2>
                <p className="text-slate-400 font-medium">Modifying: {product.name}</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-slate-100 max-w-4xl mx-auto lg:mx-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* INPUT: NAMA PRODUK */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Product Name</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Category</label>
                            <select 
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700"
                            >
                                <option value="">Select Category</option>
                                <option value="Shoes">Shoes</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Apparel">Apparel</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Price (Rp)</label>
                            <input 
                                type="number" 
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Description</label>
                        <textarea 
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700 min-h-[120px]"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        ></textarea>
                    </div>

                    <hr className="border-slate-100" />

                    {/* FOTO UTAMA */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Main Thumbnail</label>
                        <div className="flex items-center gap-6">
                            <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-300 italic text-xs">No Image</div>
                                )}
                            </div>
                            <input type="file" onChange={handleImageChange} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                    </div>

                    {/* GALERI 10 SLOT DENGAN DRAG & DROP */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Product Gallery (Max 10 Slots)</label>
                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase">Hold & Drag to reorder</span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                            {displayGallery.map((img, index) => (
                                <div 
                                    key={img?.id || `slot-${index}`}
                                    draggable={img !== null}
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDrop(e, index)}
                                    className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 group hover:border-blue-400 transition-all cursor-move"
                                >
                                    {img ? (
                                        <>
                                            <img 
                                                src={img.isTemp ? img.image_path : `/storage/${img.image_path}`} 
                                                className="w-full h-full object-cover" 
                                            />
                                            {/* Tombol Hapus hanya untuk yang sudah ada di DB (bukan temp preview) */}
                                            {!img.isTemp && (
                                                <button 
                                                    type="button"
                                                    onClick={() => handleDeleteExisting(img.id)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                            <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                                                {index + 1}
                                            </div>
                                        </>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center w-full h-full justify-center hover:bg-white transition-colors">
                                            <Plus size={20} className="text-slate-300 group-hover:text-blue-500" />
                                            <span className="text-[9px] text-slate-400 font-black mt-2">EMPTY</span>
                                            <input 
                                                type="file" 
                                                multiple
                                                className="hidden" 
                                                onChange={handleGalleryChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.gallery && <p className="text-red-500 text-xs mt-2 font-bold">{errors.gallery}</p>}
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-600 hover:-translate-y-1 transition-all disabled:opacity-50 uppercase tracking-widest text-sm"
                        >
                            {processing ? 'Saving Changes...' : 'Update Inventory'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}