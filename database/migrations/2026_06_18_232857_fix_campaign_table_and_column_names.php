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
        // Rename the misspelled column while still on the old table
        Schema::table('capmaigns', function (Blueprint $table) {
            $table->renameColumn('campaing_name', 'campaign_name');
        });

        // Then rename the misspelled table
        Schema::rename('capmaigns', 'campaigns');
    }

    public function down(): void
    {
        Schema::rename('campaigns', 'capmaigns');

        Schema::table('capmaigns', function (Blueprint $table) {
            $table->renameColumn('campaign_name', 'campaing_name');
        });
    }
};
