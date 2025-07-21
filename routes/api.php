<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DocumentationController;
use App\Models\Organization;

// Endpoints de usuario autenticado
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        // Agrega los roles y permisos
        'roles' => $user->getRoleNames(), // Devuelve un array de nombres de roles
        'permissions' => $user->getAllPermissions()->pluck('name'), // Devuelve un array de nombres de permisos
    ]);
});

// Ejemplo de rutas protegidas por roles y permisos
Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin', function () {
    return response()->json(['message' => 'Solo para admins']);
});

Route::middleware(['auth:sanctum', 'permission:edit articles'])->post('/articles', function () {
    return response()->json(['message' => 'Solo para usuarios con permiso de editar artículos']);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('company', OrganizationController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('dpds', \App\Http\Controllers\DpdController::class);


    // Legal
    Route::get('documentation/legal', [DocumentationController::class, 'listLegalDocuments']);
    Route::post('documentation/legal', [DocumentationController::class, 'uploadLegalDocument']);
    Route::delete('documentation/legal/{filename}', [DocumentationController::class, 'deleteLegalDocument']);
    Route::get('documentation/legal/download/{filename}', [DocumentationController::class, 'downloadLegalDocument'])->name('documentation.download.legal');

    // AEPD
    Route::get('documentation/aepd', [DocumentationController::class, 'listAepdDocuments']);
    Route::post('documentation/aepd', [DocumentationController::class, 'uploadAepdDocument']);
    Route::delete('documentation/aepd/{filename}', [DocumentationController::class, 'deleteAepdDocument']);
    Route::get('documentation/aepd/download/{filename}', [DocumentationController::class, 'downloadAepdDocument'])->name('documentation.download.aepd');

    // Organizations
    Route::get('companies/all', [OrganizationController::class, 'index']);

});