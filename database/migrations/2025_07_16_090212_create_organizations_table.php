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
            $table->enum('tipo', ['publico', 'privado']);
            $table->string('denominacion');
            $table->string('razon_social');
            $table->string('domicilio_social');
            $table->string('pais');
            $table->string('codigo_postal');
            $table->string('cif');
            $table->string('localidad');
            $table->string('direccion');
            $table->string('provincia');
            $table->string('telefono');
            $table->string('email');
            $table->string('actividad');
            $table->string('web')->nullable();
            $table->integer('numero_empleados')->nullable();
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
