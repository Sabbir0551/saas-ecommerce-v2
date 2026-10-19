<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tenants = \App\Models\Tenant::with('domains')->get();
foreach ($tenants as $t) {
    echo sprintf(
        "ID: %-15s | Category: %-18s | Archetype: %-16s | Domains: %s\n",
        $t->id,
        $t->business_category ?? 'none',
        $t->archetype ?? 'none',
        $t->domains->pluck('domain')->join(', ')
    );
}
