import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, product }) {
    // 1. Inisialisasi useForm dengan data produk yang ada dari database
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        stock: product.stock || '',
        description: product.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Menggunakan put karena kita melakukan Update data
        put(route('products.update', product.id));
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Edit Product" />

            <div className="mb-8 text-center lg:text-left">
                <Link href="/products" className="text-sm text-blue-600 font-bold hover:underline">
                    ← Back to Inventory
                </Link>
                <h2 className="text-3xl font-black text-slate-800 mt-2">Update Product</h2>
                <p className="text-slate-400 font-medium">Modifying: {product.name}</p>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-white max-w-3xl mx-auto lg:mx-0">
                <form onSubmit={submit} className="space-y-6">
                    
                    {/* INPUT: NAMA PRODUK */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Product Name</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-700"
                            placeholder="e.g. Nike Air Jordan"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* INPUT: KATEGORI */}
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
                            {errors.category && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.category}</p>}
                        </div>

                        {/* INPUT: HARGA */}
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Price (Rp)</label>
                            <input 
                                type="number" 
                                value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.price}</p>}
                        </div>
                    </div>

                    {/* INPUT: STOK */}
                    <div className="w-1/2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Stock Quantity</label>
                        <input 
                            type="number" 
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 font-bold text-slate-700"
                        />
                        {errors.stock && <p className="text-red-500 text-xs mt-2 ml-1 font-bold">{errors.stock}</p>}
                    </div>

                    <hr className="border-slate-100 my-4" />

                    <div className="flex gap-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all disabled:opacity-50 block"
                        >
                            {processing ? 'Processing...' : 'SAVE CHANGES'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}