<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Endpoints de usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Ejemplo de rutas protegidas por roles y permisos
Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin', function () {
    return response()->json(['message' => 'Solo para admins']);
});

Route::middleware(['auth:sanctum', 'permission:edit articles'])->post('/articles', function () {
    return response()->json(['message' => 'Solo para usuarios con permiso de editar artículos']);
});