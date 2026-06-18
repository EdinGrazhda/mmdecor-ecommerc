<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\StoreBannerRequest;
use App\Http\Requests\API\UpdateBannerRequest;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
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
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $banners = $query->latest()->paginate(10)->withQueryString();

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
        return Inertia::render('Admin/banners/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBannerRequest $request)
    {
        $validated = $request->validated();

        $banner = Banner::create([
            ...collect($validated)->except('image')->all(),
            'image' => '',
        ]);

        $this->attachImage($banner, $request->file('image'));

        return redirect()->route('admin.banners.index')->with('success', 'Banner created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        return Inertia::render('Admin/banners/show', [
            'banner' => $banner,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Banner $banner)
    {
        return Inertia::render('Admin/banners/edit', [
            'banner' => $banner,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBannerRequest $request, Banner $banner)
    {
        $validated = $request->validated();

        $banner->update(collect($validated)->except('image')->all());

        $this->attachImage($banner, $request->file('image'));

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
}
