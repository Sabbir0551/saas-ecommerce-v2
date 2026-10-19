<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // মাল্টি-টেন্যান্ট লোকালহোস্টে CSRF টোকেন মিসম্যাচ রোধে /register রাউট সুরক্ষিতভাবে এক্সেম্পট করা হলো
        $middleware->validateCsrfTokens(except: [
            'register',
        ]);

        // লোকালহোস্ট ও সাবডোমেইনে কুকি এনক্রিপশন অনুমতি দেওয়া
        $middleware->encryptCookies(except: []);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // tempnam নোটিশ আসলে তাকে এরর হিসেবে ট্রিগার না করার হ্যান্ডলার
        $exceptions->stopIgnoring(\ErrorException::class);
    })->booted(function () {
        // রিকোয়েস্ট শুরু হওয়ার পর Laravel হ্যান্ডলারকে মিউট করা
        set_error_handler(function ($severity, $message, $file, $line) {
            if (!(error_reporting() & $severity)) {
                return false;
            }
            if (str_contains($message, 'tempnam()')) {
                return true;
            }
            throw new \ErrorException($message, 0, $severity, $file, $line);
        });
    })->create();