<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tenants = \App\Models\Tenant::all();

foreach ($tenants as $t) {
    if (!empty($t->branding) && !empty($t->branding['hero_title']) && $t->id === 'bestlaptop') {
        echo "Skipping {$t->id} (already has custom branding)\n";
        continue;
    }

    $categoryKey = $t->business_category ?? 'default';
    $categoryDefaults = config("business_presets.category_defaults.{$categoryKey}")
        ?? config("business_presets.category_defaults.default", []);

    $existing = (array)($t->branding ?? []);
    
    $merged = array_merge($categoryDefaults, array_filter($existing, fn($v) => !is_null($v) && $v !== ''));
    $merged['store_name'] = $t->name ?? ($categoryDefaults['store_name'] ?? 'Official Store');
    $merged['primary_color'] = $merged['primary_color'] ?? ($categoryDefaults['theme_color'] ?? '#2563eb');
    if (!empty($t->owner_phone)) {
        $merged['hotline_number'] = $t->owner_phone;
        $merged['whatsapp_number'] = $t->owner_phone;
    }

    $t->branding = $merged;
    $t->save();

    echo "Updated branding for tenant [{$t->id}] with category [{$categoryKey}] defaults! Primary color: {$merged['primary_color']}\n";
}

echo "All tenant brandings synchronized successfully.\n";
