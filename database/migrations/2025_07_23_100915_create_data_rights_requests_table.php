<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Table name in English and plural
        Schema::create('data_rights_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->onDelete('cascade');
            $table->string('template_type');

            // Model fields (can remain descriptive in Spanish as they map to document fields)
            $table->string('full_name')->nullable();
            $table->text('full_address')->nullable();
            $table->string('nif')->nullable();
            $table->string('city')->nullable();
            $table->date('date')->nullable();
            $table->text('information_provided')->nullable();
            $table->text('denial_reasons')->nullable();
            $table->text('data_to_rectify')->nullable();
            $table->text('rectified_data')->nullable();
            $table->text('data_to_delete')->nullable();
            $table->text('deleted_data')->nullable();
            $table->text('reasons_for_opposition')->nullable();
            $table->text('limitation_details')->nullable();
            $table->text('limitation_applied')->nullable();
            $table->string('right_exercised')->nullable();
            $table->date('request_date')->nullable();
            $table->text('required_documentation')->nullable();
            $table->string('filepath')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_rights_requests');
    }
};