<?php

use App\Models\Category;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('storefront returns a site-relative URL for an image uploaded in the admin panel', function () {
    Storage::fake('public', ['url' => config('filesystems.disks.public.url')]);

    $category = Category::query()->create([
        'name' => 'Exterior',
        'description' => 'Exterior parts',
    ]);

    $this->actingAs(User::factory()->admin()->create())
        ->post('/admin/products', [
            'product_id' => 'IMAGE-001',
            'name' => 'Test Part',
            'images' => [UploadedFile::fake()->image('part.jpg')],
            'price' => 25,
            'stock' => 2,
            'category_id' => $category->id,
        ])
        ->assertRedirect('/admin/products');

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.image', fn (string $url) => str_starts_with($url, '/storage/'))
            ->where('products.data.0.images.0.url', fn (string $url) => str_starts_with($url, '/storage/'))
        );
});
