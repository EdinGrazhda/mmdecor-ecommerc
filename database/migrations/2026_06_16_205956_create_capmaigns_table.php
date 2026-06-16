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
        Schema::create('capmaigns', function (Blueprint $table) {
            $table->id();
            $table->string('campaing_name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->foreignId('product_id')->constrained('product')->onDelete('cascade');
            $table->timestamps();

            // adding indexes
            $table->index('product_id', 'campaign_product_idx');
            $table->index(['start_date', 'end_date'], 'active_campaigns_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capmaigns');
    }
};
