<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tenant = \App\Models\Tenant::find('aebanproperty');
if ($tenant) {
    tenancy()->initialize($tenant);
    $items = \App\Models\Item::all(['id', 'name', 'slug', 'price']);
    echo "ITEMS FOR aebanproperty:\n";
    foreach ($items as $item) {
        echo "ID: {$item->id} | Name: {$item->name} | Slug: {$item->slug} | Price: {$item->price}\n";
    }
} else {
    echo "Tenant aebanproperty not found.\n";
}
