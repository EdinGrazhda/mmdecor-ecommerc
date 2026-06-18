<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Campaign;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create categories
        $suspension = Category::create([
            'name' => 'Suspension',
            'description' => 'Suspension components and parts',
        ]);

        $interior = Category::create([
            'name' => 'Interior',
            'description' => 'Interior accessories and upgrades',
        ]);

        $exterior = Category::create([
            'name' => 'Exterior',
            'description' => 'Exterior protection and styling',
        ]);

        // Create products
        $product1 = Product::create([
            'product_id' => 'PROD-001',
            'name' => 'Chastity Short',
            'category_id' => $suspension->id,
            'price' => 365.00,
            'stock' => 50,
            'image' => '/images/product1.jpg',
        ]);

        $product2 = Product::create([
            'product_id' => 'PROD-002',
            'name' => 'Karen Elliott',
            'category_id' => $interior->id,
            'price' => 83.00,
            'stock' => 100,
            'image' => '/images/product2.jpg',
        ]);

        $product3 = Product::create([
            'product_id' => 'PROD-003',
            'name' => 'Exterior Panel',
            'category_id' => $exterior->id,
            'price' => 150.00,
            'stock' => 75,
            'image' => '/images/product3.jpg',
        ]);

        // Create campaigns with discounts
        Campaign::create([
            'campaing_name' => 'Summer Sale',
            'description' => 'Get 15% off on premium suspension parts',
            'price' => 15,
            'product_id' => $product1->id,
            'start_date' => now(),
            'end_date' => now()->addDays(30),
        ]);

        Campaign::create([
            'campaing_name' => 'Interior Deals',
            'description' => 'Special discount on interior accessories',
            'price' => 20,
            'product_id' => $product2->id,
            'start_date' => now(),
            'end_date' => now()->addDays(15),
        ]);

        // Create banners
        Banner::create([
            'title' => 'Exclusive Suspension Deals',
            'subtitle' => 'Transform your ride with premium components',
            'image' => '/images/banner1.jpg',
        ]);

        Banner::create([
            'title' => 'Interior Upgrades',
            'subtitle' => 'Elevate your driving experience',
            'image' => '/images/banner2.jpg',
        ]);
    }
}
