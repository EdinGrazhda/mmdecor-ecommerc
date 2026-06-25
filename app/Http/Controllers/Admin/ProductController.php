<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreProductRequest;
use App\Http\Requests\API\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::query()->with('category');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('product_id', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/products/index', [
            'products' => $products,
            'categories' => Category::all(),
            'filters' => $request->only(['search', 'category_id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/products/create', [
            'categories' => Category::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        $product = Product::create([
            ...collect($validated)->except(['image', 'images'])->all(),
            'image' => '',
        ]);

        $this->attachImages($product, $this->uploadedImages($request));

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('Admin/products/show', [
            'product' => new ProductResource($product->load(['category', 'campaigns'])),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Admin/products/edit', [
            'product' => new ProductResource($product->load(['category', 'campaigns'])),
            'categories' => Category::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        $product->update(collect($validated)->except(['image', 'images'])->all());

        if ($request->hasFile('images') || $request->hasFile('image')) {
            $product->clearMediaCollection('images');
            $this->attachImages($product, $this->uploadedImages($request));
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }

    /**
     * @return array<int, UploadedFile>
     */
    private function uploadedImages(Request $request): array
    {
        if ($request->hasFile('images')) {
            return array_slice($request->file('images'), 0, 4);
        }

        $image = $request->file('image');

        return $image ? [$image] : [];
    }

    /**
     * @param array<int, UploadedFile> $images
     */
    private function attachImages(Product $product, array $images): void
    {
        if ($images === []) {
            return;
        }

        foreach ($images as $image) {
            $product
                ->addMedia($image)
                ->usingName(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME))
                ->toMediaCollection('images');
        }

        $product->syncImageColumnFromMedia();
    }
}
