<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;



Route::get('/{any}', function (Request $request) {
    // URL del servidor SSR de Angular
    $ssrUrl = 'http://localhost:4000' . $request->getRequestUri();

    try {
        // Intentar hacer proxy al SSR de Angular (timeout corto)
        $response = Http::timeout(1)->withHeaders($request->headers->all())->get($ssrUrl);

        // Si responde, devolvemos el HTML SSR
        return response($response->body(), $response->status())
            ->header('Content-Type', $response->header('Content-Type'));
    } catch (\Exception $e) {
        // Si falla (SSR no disponible), servimos el build estático (SPA)
        return file_get_contents(public_path('build/browser/index.html'));
    }
})->where('any', '.*');
