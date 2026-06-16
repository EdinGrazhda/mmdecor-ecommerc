<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::resource('products', ProductController::class);
Route::resource('categories', CategoryController::class);
Route::resource('campaigns', CampaignController::class);
Route::resource('banners', BannerController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('products', App\Http\Controllers\Admin\ProductController::class);
        Route::resource('categories', App\Http\Controllers\Admin\CategoryController::class);
        Route::resource('campaigns', App\Http\Controllers\Admin\CampaignController::class);
        Route::resource('banners', App\Http\Controllers\Admin\BannerController::class);
        Route::resource('orders', App\Http\Controllers\Admin\OrderController::class);
    });
});

require __DIR__.'/settings.php';
