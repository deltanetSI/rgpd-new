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
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['public', 'private']);
            $table->string('name');
            $table->string('legal_name');
            $table->string('registered_address');
            $table->string('country');
            $table->string('postal_code');
            $table->string('tax_id');
            $table->string('city');
            $table->string('address');
            $table->string('province');
            $table->string('phone');
            $table->string('email');
            $table->string('activity');
            $table->string('website')->nullable();
            $table->integer('number_of_employees')->nullable();
            $table->string('exercise_rights_email')->nullable();
            $table->boolean('external_hosting')->default(false);
            $table->boolean('data_sharing')->default(false);
            $table->boolean('international_transfers')->default(false);
            $table->boolean('mass_mailing')->default(false);
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('dpd_id')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('dpd_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
