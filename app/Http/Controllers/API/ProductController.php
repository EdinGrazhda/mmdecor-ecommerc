<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreProductRequest;
use App\Http\Requests\API\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $categoryId = $request->input('category_id');
            $sortBy = $request->input('sort', 'featured');

            // Unique cache key based on query filters
            $cacheKey = 'products_all_cat_'.($categoryId ?? 'all').'_sort_'.$sortBy;

            $products = Cache::remember($cacheKey, 600, function () use ($categoryId, $sortBy) {
                $query = Product::query()->with(['category', 'campaigns']);

                if ($categoryId) {
                    $query->where('category_id', $categoryId);
                }

                if ($sortBy === 'price-asc') {
                    $query->orderBy('price', 'asc');
                } elseif ($sortBy === 'price-desc') {
                    $query->orderBy('price', 'desc');
                } elseif ($sortBy === 'name-asc') {
                    $query->orderBy('name', 'asc');
                }

                return $query->get();
            });

            return ProductResource::collection($products);
        } catch (\Exception $e) {
            Log::error('Error fetching products: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve products',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        try {
            $validated = $request->validated();

            $product = Product::create([
                ...collect($validated)->except('image')->all(),
                'image' => '',
            ]);

            $this->attachImage($product, $request->file('image'));

            $this->clearProductCache();

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => new ProductResource($product->load(['category', 'campaigns'])),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating product: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $product = Product::with(['category', 'campaigns'])->findOrFail($id);

            return new ProductResource($product);
        } catch (\Exception $e) {
            Log::error('Error fetching product: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, string $id)
    {
        try {
            $product = Product::findOrFail($id);
            $validated = $request->validated();

            $product->update(collect($validated)->except('image')->all());

            $this->attachImage($product, $request->file('image'));

            $this->clearProductCache();

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => new ProductResource($product->load(['category', 'campaigns'])),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating product: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();

            $this->clearProductCache();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting product: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Clear all cached product and category queries
     */
    private function clearProductCache(): void
    {
        Cache::flush();
    }

    private function attachImage(Product $product, ?UploadedFile $image): void
    {
        if (! $image) {
            return;
        }

        $product
            ->addMedia($image)
            ->usingName(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME))
            ->toMediaCollection('images');

        $product->syncImageColumnFromMedia();
    }
}
