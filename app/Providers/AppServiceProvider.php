<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Livewire\Livewire;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // সেন্ট্রাল ও টেন্যান্ট ডোমেইনের জন্য ডাইনামিক Livewire ৩ রাউটিং
        Livewire::setUpdateRoute(function ($handle) {
            $host = request()->getHost();
            $centralDomains = config('tenancy.central_domains', ['localhost', '127.0.0.1']);

            // যদি বর্তমান রিকোয়েস্ট সেন্ট্রাল ডোমেইন থেকে আসে
            if (in_array($host, $centralDomains, true)) {
                return Route::post('/livewire/update', $handle)
                    ->middleware(['web']);
            }

            // টেন্যান্ট সাবডোমেইনের রিকোয়েস্ট হলে টেন্যান্সি ইনিশিয়ালাইজেশন মিডলওয়্যার চলবে
            return Route::post('/livewire/update', $handle)
                ->middleware([
                    'web',
                    \Stancl\Tenancy\Middleware\InitializeTenancyByDomain::class,
                    \Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains::class,
                ]);
        });
    }
}