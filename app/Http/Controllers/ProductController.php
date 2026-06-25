<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Redirect index to home.
     */
    public function index()
    {
        return redirect()->route('home');
    }

    /**
     * Display the product detail page.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'campaigns']);

        return Inertia::render('store/ProductShow', [
            'product' => new ProductResource($product),
            'whatsappPhone' => config('services.whatsapp.phone'),
        ]);
    }

    public function create()
    {
        return redirect()->route('home');
    }

    public function store(Request $request)
    {
        return redirect()->route('home');
    }

    public function edit(string $id)
    {
        return redirect()->route('home');
    }

    public function update(Request $request, string $id)
    {
        return redirect()->route('home');
    }

    public function destroy(string $id)
    {
        return redirect()->route('home');
    }
}
