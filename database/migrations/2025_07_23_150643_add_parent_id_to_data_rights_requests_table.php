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
        Schema::table('data_rights_requests', function (Blueprint $table) {
            $table->foreignId('parent_id')->nullable()->after('id')->constrained('data_rights_requests')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_rights_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('parent_id'); // Drops the foreign key constraint and the column
        });
    }
};