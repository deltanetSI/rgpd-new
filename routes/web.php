<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;



Route::get('/{any}', function (Request $request) {
    $path = public_path($request->path());

    // Si el archivo existe físicamente (JS, CSS, imágenes), lo servimos directamente
    if (File::exists($path) && !is_dir($path)) {
        return response()->file($path);
    }

    // SSR o fallback SPA
    $ssrUrl = 'http://localhost:4000' . $request->getRequestUri();
    try {
        $response = Http::timeout(1)->withHeaders($request->headers->all())->get($ssrUrl);
        return response($response->body(), $response->status())
            ->header('Content-Type', $response->header('Content-Type'));
    } catch (\Exception $e) {
        return file_get_contents(public_path('build/browser/index.csr.html'));
    }
})->where('any', '.*');
