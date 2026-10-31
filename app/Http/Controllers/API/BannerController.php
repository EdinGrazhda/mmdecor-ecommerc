<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreBannerRequest;
use App\Http\Requests\API\UpdateBannerRequest;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $banners = Cache::remember('banners_all', 600, function () {
                return Banner::with([
                    'media',
                    'product.category',
                    'product.campaigns',
                    'product.media',
                    'selectedProducts.category',
                    'selectedProducts.campaigns',
                    'selectedProducts.media',
                ])->get();
            });

            return BannerResource::collection($banners);
        } catch (\Exception $e) {
            Log::error('Error fetching banners: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve banners',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBannerRequest $request)
    {
        try {
            $validated = $request->validated();
            $selectedProductIds = $this->selectedProductIds($validated);

            $banner = Banner::create([
                ...collect($validated)->except(['image', 'selected_product_ids', 'product_id'])->all(),
                'product_id' => $selectedProductIds[0] ?? ($validated['product_id'] ?? null),
                'image' => '',
            ]);
            $banner->selectedProducts()->sync($this->orderedProductIds($selectedProductIds));

            $this->attachImage($banner, $request->file('image'));

            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => 'Banner created successfully',
                'data' => new BannerResource($banner->load(['media', 'product', 'selectedProducts'])),
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating banner: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to create banner',
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
            $banner = Banner::with(['media', 'product', 'selectedProducts'])->findOrFail($id);

            return new BannerResource($banner);
        } catch (\Exception $e) {
            Log::error('Error fetching banner: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Banner not found',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBannerRequest $request, string $id)
    {
        try {
            $banner = Banner::findOrFail($id);
            $validated = $request->validated();
            $selectedProductIds = $this->selectedProductIds($validated, $banner);

            $banner->update([
                ...collect($validated)->except(['image', 'selected_product_ids', 'product_id'])->all(),
                'product_id' => $selectedProductIds[0] ?? ($validated['product_id'] ?? null),
            ]);
            if (array_key_exists('selected_product_ids', $validated) || array_key_exists('product_id', $validated)) {
                $banner->selectedProducts()->sync($this->orderedProductIds($selectedProductIds));
            }

            $this->attachImage($banner, $request->file('image'));

            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => 'Banner updated successfully',
                'data' => new BannerResource($banner->load(['media', 'product', 'selectedProducts'])),
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating banner: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to update banner',
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
            $banner = Banner::findOrFail($id);
            $banner->delete();

            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => 'Banner deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting banner: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete banner',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
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
