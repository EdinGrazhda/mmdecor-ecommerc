<?php

use App\Http\Controllers\API\BannerController;
use App\Http\Controllers\API\CampaignController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider or bootstrap configuration.
| All responses from these routes return JSON by default.
|
*/

Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('campaigns', CampaignController::class)->only(['index', 'show']);
Route::apiResource('banners', BannerController::class)->only(['index', 'show']);

Route::middleware(['auth', 'admin'])->group(function () {
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
    Route::apiResource('campaigns', CampaignController::class)->except(['index', 'show']);
    Route::apiResource('banners', BannerController::class)->except(['index', 'show']);
});
