<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tenants = App\Models\Tenant::all();

foreach ($tenants as $tenant) {
    echo "=== Tenant: {$tenant->id} ({$tenant->business_category}) ===\n";
    tenancy()->initialize($tenant);
    if (Illuminate\Support\Facades\Schema::hasTable('items')) {
        $items = App\Models\Item::limit(5)->get();
        foreach ($items as $item) {
            echo " - Item #{$item->id}: Name='{$item->name}', Price={$item->price}, Images=" . json_encode($item->images) . "\n";
        }
    }
    tenancy()->end();
}
