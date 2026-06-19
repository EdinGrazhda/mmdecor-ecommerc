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
                return Banner::with(['product', 'product.campaigns'])->get();
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

            $banner = Banner::create([
                ...collect($validated)->except('image')->all(),
                'image' => '',
            ]);

            $this->attachImage($banner, $request->file('image'));

            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => 'Banner created successfully',
                'data' => new BannerResource($banner),
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
            $banner = Banner::findOrFail($id);

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

            $banner->update(collect($validated)->except('image')->all());

            $this->attachImage($banner, $request->file('image'));

            Cache::flush();

            return response()->json([
                'success' => true,
                'message' => 'Banner updated successfully',
                'data' => new BannerResource($banner),
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
}
