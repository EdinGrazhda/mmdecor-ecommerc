<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StorefrontCartController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::resource('products', ProductController::class)->only(['index', 'show']);
Route::resource('categories', CategoryController::class)->only(['index', 'show']);
Route::resource('campaigns', CampaignController::class)->only(['index', 'show']);
Route::resource('banners', BannerController::class)->only(['index', 'show']);

Route::get('cart', [StorefrontCartController::class, 'index'])->name('cart.index');
Route::post('cart', [StorefrontCartController::class, 'store'])->name('cart.store');
Route::patch('cart/{cartItem}', [StorefrontCartController::class, 'update'])->name('cart.update');
Route::delete('cart/{cartItem}', [StorefrontCartController::class, 'destroy'])->name('cart.destroy');
Route::post('checkout', [StorefrontCartController::class, 'checkout'])->name('checkout.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        Route::resource('products', App\Http\Controllers\Admin\ProductController::class);
        Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class);
        Route::resource('campaigns', App\Http\Controllers\Admin\CampaignController::class);
        Route::resource('banners', App\Http\Controllers\Admin\BannerController::class);
        Route::resource('orders', App\Http\Controllers\Admin\OrderController::class);
    });
});

require __DIR__.'/settings.php';
