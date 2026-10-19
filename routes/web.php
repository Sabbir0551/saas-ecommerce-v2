<?php

use App\Http\Controllers\Central\TenantRegistrationController;
use Illuminate\Support\Facades\Route;

foreach (config('tenancy.central_domains') as $domain) {
    Route::domain($domain)->group(function () {
        // সেন্ট্রাল ল্যান্ডিং পেজ
        Route::get('/', function () {
            return view()->exists('central.welcome') 
                ? view('central.welcome') 
                : '<h1>Welcome to SaaS Central Landing Page</h1>';
        })->name('central.landing');

        // টেন্যান্ট রেজিস্ট্রেশন ফর্ম
        Route::get('/register', [TenantRegistrationController::class, 'showRegistrationForm'])
            ->name('central.register');

        // টেন্যান্ট রেজিস্ট্রেশন সাবমিশন ও অটো-প্রভিশনিং
        Route::post('/register', [TenantRegistrationController::class, 'register'])
            ->name('central.register.post');
    });
}