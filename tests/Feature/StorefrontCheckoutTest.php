<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;

test('customer can add product to cart and place order', function () {
    $category = Category::query()->create([
        'name' => 'Interior',
        'description' => 'Interior decor products',
    ]);
    $product = Product::query()->create([
        'product_id' => 'DECOR-001',
        'name' => 'Premium Seat Cover',
        'image' => '/images/seat-cover.webp',
        'price' => 49.99,
        'stock' => 10,
        'category_id' => $category->id,
    ]);

    $cartResponse = $this->postJson('/cart', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $cartResponse->assertCreated()
        ->assertJsonPath('count', 2)
        ->assertJsonPath('total', 99.98);

    $cartCookie = collect($cartResponse->headers->getCookies())
        ->first(fn ($cookie) => $cookie->getName() === 'cart_session_id');

    $response = $this->withHeader('X-Cart-Session-Id', $cartCookie->getValue())->postJson('/checkout', [
        'customer_full_name' => 'Test Customer',
        'customer_email' => 'customer@example.com',
        'customer_phone' => '+355 69 000 0000',
        'customer_address' => 'Main Street 12',
        'customer_city' => 'Tirana',
        'customer_country' => 'albania',
        'notes' => 'Call before delivery.',
    ]);

    $response->assertCreated()
        ->assertJsonPath('cart.count', 0);

    $this->assertDatabaseHas('orders', [
        'customer_full_name' => 'Test Customer',
        'customer_email' => 'customer@example.com',
        'customer_phone' => '+355 69 000 0000',
        'customer_country' => 'albania',
        'product_id' => $product->id,
        'product_name' => 'Premium Seat Cover',
        'quantity' => 2,
        'payment_method' => 'cash',
        'status' => 'pending',
    ]);

    expect((float) Order::query()->first()?->total_amount)->toBe(99.98);
});

test('checkout requires cart items', function () {
    $this->postJson('/checkout', [
        'customer_full_name' => 'Test Customer',
        'customer_email' => 'customer@example.com',
        'customer_phone' => '+355 69 000 0000',
        'customer_address' => 'Main Street 12',
        'customer_city' => 'Tirana',
        'customer_country' => 'albania',
    ])->assertUnprocessable();
});
