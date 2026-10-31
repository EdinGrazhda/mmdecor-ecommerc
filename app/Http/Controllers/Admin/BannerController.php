<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreBannerRequest;
use App\Http\Requests\API\UpdateBannerRequest;
use App\Models\Banner;
use App\Models\Product;
use App\Support\ResolvesMediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Banner::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', '%'.$request->search.'%');
        }

        $banners = $query
            ->with(['media', 'product.media'])
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function (Banner $banner): Banner {
                $banner->setAttribute('image', $this->resolveBannerImage($banner));

                return $banner;
            });

        return Inertia::render('Admin/banners/index', [
            'banners' => $banners,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/banners/create', [
            'products' => $this->getProducts(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBannerRequest $request)
    {
        $validated = $request->validated();
        $selectedProductIds = $this->selectedProductIds($validated);

        $banner = Banner::create([
            ...collect($validated)->except(['image', 'selected_product_ids', 'product_id'])->all(),
            'product_id' => $selectedProductIds[0] ?? ($validated['product_id'] ?? null),
            'image' => '',
        ]);
        $banner->selectedProducts()->sync($this->orderedProductIds($selectedProductIds));

        if ($request->hasFile('image')) {
            $this->attachImage($banner, $request->file('image'));
        } elseif ($banner->product_id) {
            $product = $banner->product;
            if ($product?->image) {
                $banner->forceFill(['image' => $product->image])->saveQuietly();
            }
        }

        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        return Inertia::render('Admin/banners/show', [
            'banner' => $banner->load(['media', 'product.media']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Banner $banner)
    {
        return Inertia::render('Admin/banners/edit', [
            'banner' => tap($banner->load(['media', 'product.media', 'selectedProducts']), function (Banner $loadedBanner): void {
                $loadedBanner->setAttribute('image', $this->resolveBannerImage($loadedBanner));
            }),
            'products' => $this->getProducts(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBannerRequest $request, Banner $banner)
    {
        $validated = $request->validated();
        $selectedProductIds = $this->selectedProductIds($validated, $banner);

        $banner->update([
            ...collect($validated)->except(['image', 'selected_product_ids', 'product_id'])->all(),
            'product_id' => $selectedProductIds[0] ?? ($validated['product_id'] ?? null),
        ]);
        if (array_key_exists('selected_product_ids', $validated) || array_key_exists('product_id', $validated)) {
            $banner->selectedProducts()->sync($this->orderedProductIds($selectedProductIds));
        }

        if ($request->hasFile('image')) {
            $this->attachImage($banner, $request->file('image'));
        } elseif ($banner->product_id && ! $banner->getFirstMedia('images')) {
            $product = $banner->product;
            if ($product?->image) {
                $banner->forceFill(['image' => $product->image])->saveQuietly();
            }
        } elseif (array_key_exists('product_id', $validated) && ! $validated['product_id']) {
            // product cleared — keep existing image as-is
        } elseif ($banner->fresh()->product_id && ! $request->hasFile('image')) {
            $product = $banner->fresh()->product;
            if ($product?->image && ! $banner->getFirstMedia('images')) {
                $banner->forceFill(['image' => $product->image])->saveQuietly();
            }
        }

        return redirect()->route('admin.banners.index')->with('success', 'Banner updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
        $banner->delete();

        return redirect()->route('admin.banners.index')->with('success', 'Banner deleted successfully.');
    }

    private function attachImage(Banner $banner, ?UploadedFile $image): void
    {
        if (! $image) {
            return;
        }

        $banner
            ->addMedia($image)
            ->usingName(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME))
            ->toMediaCollection('images');

        $banner->syncImageColumnFromMedia();
    }

    private function getProducts(): Collection
    {
        return Product::query()
            ->select(['id', 'name', 'image', 'price', 'stock'])
            ->with('media')
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'image' => ResolvesMediaUrl::primary($product, 'images', $product->image),
                'price' => (float) $product->price,
                'stock' => (int) $product->stock,
            ]);
    }

    private function resolveBannerImage(Banner $banner): ?string
    {
        if ($banner->getFirstMedia('images')) {
            return ResolvesMediaUrl::primary($banner, 'images');
        }

        if ($banner->relationLoaded('product') && $banner->product) {
            return ResolvesMediaUrl::primary($banner->product, 'images', $banner->product->image);
        }

        return $banner->image ?: null;
    }

    /** @return array<int, int> */
    private function selectedProductIds(array $validated, ?Banner $banner = null): array
    {
        if (array_key_exists('selected_product_ids', $validated)) {
            return array_values(array_map('intval', $validated['selected_product_ids'] ?? []));
        }

        if (array_key_exists('product_id', $validated) && $validated['product_id']) {
            return [(int) $validated['product_id']];
        }

        return $banner?->selectedProducts->pluck('id')->map(fn ($id): int => (int) $id)->all() ?? [];
    }

    /** @return array<int, array{sort_order: int}> */
    private function orderedProductIds(array $productIds): array
    {
        return collect($productIds)
            ->values()
            ->mapWithKeys(fn (int $productId, int $index): array => [$productId => ['sort_order' => $index]])
            ->all();
    }
}
