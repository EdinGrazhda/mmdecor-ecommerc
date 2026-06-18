<?php

namespace App\Http\Controllers;

use App\Http\Resources\BannerResource;
use App\Http\Resources\CampaignResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Banner;
use App\Models\Campaign;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    /**
     * Display the public storefront.
     */
    public function index(): Response
    {
        $products = Product::query()
            ->with(['category', 'campaigns'])
            ->latest()
            ->get();

        $categories = Category::query()
            ->withCount('products')
            ->orderBy('name')
            ->get();

        $banners = Banner::query()
            ->latest()
            ->get();

        $campaigns = Campaign::query()
            ->with(['product.category', 'product.campaigns'])
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->latest()
            ->get();

        return Inertia::render('welcome', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'banners' => BannerResource::collection($banners),
            'campaigns' => CampaignResource::collection($campaigns),
        ]);
    }

    /**
     * Redirect create to home.
     */
    public function create()
    {
        return redirect()->route('home');
    }

    /**
     * Redirect store to home.
     */
    public function store(Request $request)
    {
        return redirect()->route('home');
    }

    /**
     * Redirect show to home.
     */
    public function show(string $id)
    {
        return redirect()->route('home');
    }

    /**
     * Redirect edit to home.
     */
    public function edit(string $id)
    {
        return redirect()->route('home');
    }

    /**
     * Redirect update to home.
     */
    public function update(Request $request, string $id)
    {
        return redirect()->route('home');
    }

    /**
     * Redirect destroy to home.
     */
    public function destroy(string $id)
    {
        return redirect()->route('home');
    }
}
