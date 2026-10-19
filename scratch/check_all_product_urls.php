<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tenants = \App\Models\Tenant::all();
foreach ($tenants as $t) {
    $t->run(function () use ($t) {
        $products = \App\Models\Product::where('is_active', true)->take(2)->get();
        foreach ($products as $p) {
            echo "{$t->id}.localhost:8000/product/{$p->slug}\n";
        }
    });
}
