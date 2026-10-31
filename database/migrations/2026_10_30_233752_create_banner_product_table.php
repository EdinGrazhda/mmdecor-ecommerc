<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('banner_product', function (Blueprint $table) {
            $table->foreignId('banner_id')->constrained('banner')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('product')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->unique(['banner_id', 'product_id']);
            $table->index(['banner_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banner_product');
    }
};
