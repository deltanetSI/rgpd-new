<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


Route::get('/{any}', function (Request $request) {
    // Proxy a SSR de Angular (ajusta el puerto si es necesario)
    $ssrUrl = 'http://localhost:4000' . $request->getRequestUri();

    // Pasa los headers del request original
    $response = Http::withHeaders($request->headers->all())->get($ssrUrl);

    // Devuelve la respuesta del SSR de Angular
    return response($response->body(), $response->status())
        ->header('Content-Type', $response->header('Content-Type'));
})->where('any', '.*');
