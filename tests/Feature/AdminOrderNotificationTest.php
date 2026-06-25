<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function createUnseenAdminOrder(): Order
{
    $category = Category::query()->create([
        'name' => 'Order notification category',
        'description' => 'Used by the order notification test.',
    ]);

    $product = Product::query()->create([
        'product_id' => 'ORDER-NOTIFICATION-001',
        'name' => 'Order notification product',
        'image' => '/images/order-notification.webp',
        'price' => 25,
        'stock' => 10,
        'category_id' => $category->id,
    ]);

    return Order::query()->create([
        'unique_id' => 'ORDER-NOTIFICATION-001',
        'customer_full_name' => 'Notification Customer',
        'customer_email' => 'notification@example.com',
        'customer_phone' => '+355690000001',
        'customer_address' => 'Test address',
        'customer_city' => 'Tirana',
        'customer_country' => 'albania',
        'product_id' => $product->id,
        'product_name' => $product->name,
        'product_price' => $product->price,
        'quantity' => 1,
        'total_amount' => $product->price,
        'payment_method' => 'cash',
        'status' => 'pending',
    ]);
}

test('admin sees unseen order count until opening the orders page', function () {
    $admin = User::factory()->admin()->create();
    $order = createUnseenAdminOrder();

    $this->actingAs($admin)
        ->get('/dashboard')
        ->assertInertia(fn (Assert $page) => $page
            ->where('admin.newOrdersCount', 1)
        );

    $this->actingAs($admin)
        ->get('/admin/orders')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('admin.newOrdersCount', 0)
        );

    expect($order->fresh()->admin_viewed_at)->not->toBeNull();
});
