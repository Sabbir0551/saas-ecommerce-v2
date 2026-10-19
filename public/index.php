<?php

set_error_handler(function ($level, $message, $file = '', $line = 0) {
    if (str_contains($message, 'tempnam()')) {
        return true; // এটি PHP কে বলে এই ওয়ার্নিংটি উপেক্ষা করতে, এরর ছুড়বে না
    }
    return false;
});

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
