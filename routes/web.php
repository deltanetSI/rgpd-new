<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;



/* Route::get('/{any}', function (Request $request) {
    $path = public_path($request->path());

    // Si el archivo existe físicamente (JS, CSS, imágenes), lo servimos directamente
    if (file_exists($path) && !is_dir($path)) {
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
 */
Route::get('/{any}', function (Request $request) {
    $angularBaseFolder = 'build/browser/';
    $requestedFilePath = $request->path();
    $fullAssetPath = public_path($angularBaseFolder . $requestedFilePath);

    if (file_exists($fullAssetPath) && !is_dir($fullAssetPath)) {
        $extension = pathinfo($requestedFilePath, PATHINFO_EXTENSION);

        // Forzar el tipo MIME para archivos JavaScript
        if ($extension === 'js') {
            return response(file_get_contents($fullAssetPath))
                     ->header('Content-Type', 'application/javascript');
        }
        
       // Forzar el tipo MIME para archivos css
        if ($extension === 'css') {
            return response(file_get_contents($fullAssetPath))
                     ->header('Content-Type', 'text/css')
                     ->header('Cache-Control', 'public, max-age=31536000');
        }

        // Para otros tipos de archivos (imágenes, etc.)
        return response()->file($fullAssetPath);
    }

    $indexPath = public_path($angularBaseFolder . 'index.html');

    if (file_exists($indexPath)) {
        return response(file_get_contents($indexPath))->header('Content-Type', 'text/html');
    }

    return response('Application entry point (index.html) not found.', 404);

})->where('any', '.*');