import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth }) {
    // Menggunakan helper useForm dari Inertia untuk handle input
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Add New Product" />

            <div className="mb-8">
                <Link href={route('products.index')} className="text-sm text-blue-600 font-bold hover:underline">← Back to List</Link>
                <h2 className="text-2xl font-black text-slate-800 mt-2">Add New Product</h2>
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-white max-w-2xl">
                <form onSubmit={submit} className="space-y-6">
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
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50"
                            >
                                <option value="">Select Category</option>
                                <option value="Shoes">Shoes</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Apparel">Apparel</option>
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
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Product Image</label>
                            <input 
                                type="file" 
                                onChange={e => setData('image', e.target.files[0])}
                                className="w-full px-5 py-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"
                            />
                            {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Product'}
                        </button>
                </form>
            </div>
        </AdminLayout>
    );
}