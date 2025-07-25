<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', '/'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:4200','http://localhost:4000', 'http://127.0.0.1:4200', 'https://pre.regpdnet.com', 'http://127.0.0.1:8000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],
    //'allowed_headers' => ['Accept', 'X-Requested-With', 'X-xsrf-token', 'Referer'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
