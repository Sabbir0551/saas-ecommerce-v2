<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tenant = \App\Models\Tenant::find('aebanproperty');
if ($tenant) {
    tenancy()->initialize($tenant);
    $item = \App\Models\Item::find(1);
    if ($item) {
        $item->name = 'Huntleigh Luxury Country Estate & Villa';
        $item->slug = 'huntleigh-luxury-country-estate-villa';
        $item->save();
        echo "Updated Item 1: Name = {$item->name}, Slug = {$item->slug}\n";
    }
}
