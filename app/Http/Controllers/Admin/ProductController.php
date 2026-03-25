<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ProductService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;

class ProductController extends Controller
{
    private ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }
    public function index(): Response
    {
        $products = Product::with('category')->get();
        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', [
        'categories' => Category::all()
    ]);

    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = $this->productService->createProduct($request->validated());

        return redirect()->route('admin.products.index')->with('message', 'Produk berhasil ditambahkan!');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load('images'),
            'categories' => Category::all()
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $updatedProduct = $this->productService->updateProduct($product, $request->validated());

        return redirect()->route('admin.products.index')->with('message', 'Produk diperbarui!');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->productService->deleteProduct($product);

        return redirect()->route('admin.products.index')->with('message', 'Produk berhasil dihapus!');
    }

    public function destroyImage(int $id): RedirectResponse
    {
        $this->productService->deleteProductImage($id);

        return back()->with('message', 'Foto galeri berhasil dihapus');
    }

    public function reorderImages(Request $request): RedirectResponse
{
    $request->validate([
        'images' => 'required|array',
        'images.*.id' => 'required|exists:product_images,id',
        'images.*.sort_order' => 'required|integer',
    ]);

    foreach ($request->images as $item) {
        ProductImage::where('id', $item['id'])->update([
            'sort_order' => $item['sort_order']
        ]);
    }

    return back()->with('message', 'Urutan galeri diperbarui!');
}
}