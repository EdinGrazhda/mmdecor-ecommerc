<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

test('admin can select multiple existing products for a banner', function () {
    $admin = User::factory()->admin()->create();
    $category = Category::create([
        'name' => 'Carousel Category',
        'description' => 'Products for carousel testing',
    ]);
    $firstProduct = Product::create([
        'product_id' => 'CAROUSEL-001',
        'name' => 'First Carousel Product',
        'image' => '/images/first.jpg',
        'price' => 25,
        'stock' => 10,
        'category_id' => $category->id,
    ]);
    $secondProduct = Product::create([
        'product_id' => 'CAROUSEL-002',
        'name' => 'Second Carousel Product',
        'image' => '/images/second.jpg',
        'price' => 30,
        'stock' => 8,
        'category_id' => $category->id,
    ]);

    $this->actingAs($admin)
        ->post('/admin/banners', [
            'title' => 'Carousel banner',
            'subtitle' => 'Selected products',
            'selected_product_ids' => [$secondProduct->id, $firstProduct->id],
        ])
        ->assertRedirect(route('admin.banners.index'));

    $bannerId = DB::table('banner')->where('title', 'Carousel banner')->value('id');

    expect(DB::table('banner_product')->where('banner_id', $bannerId)->orderBy('sort_order')->pluck('product_id')->all())
        ->toBe([$secondProduct->id, $firstProduct->id]);
});
