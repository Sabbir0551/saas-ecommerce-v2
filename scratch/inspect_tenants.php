<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tenants = \App\Models\Tenant::all();
foreach ($tenants as $t) {
    echo "ID: {$t->id} | Name: {$t->name} | Category: {$t->business_category} | Archetype: {$t->archetype}\n";
    echo "  Branding: " . json_encode($t->branding) . "\n";
    echo "---------------------------------------------------------\n";
}
