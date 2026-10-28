<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\Item;

$tenants = Tenant::all();
foreach ($tenants as $t) {
    echo "========================================================\n";
    echo "Testing Tenant: {$t->id} | Category: {$t->business_category} | Archetype: {$t->archetype}\n";
    tenancy()->initialize($t);
    $item = Item::where('is_active', true)->first() ?? Item::first();
    if (!$item) {
        echo "  [INFO] No items found in database for {$t->id}. Creating test item...\n";
        $item = Item::create([
            'name' => "Sample {$t->name} Product",
            'slug' => "sample-{$t->id}-item",
            'price' => 2500,
            'is_active' => true,
            'stock_quantity' => 10,
        ]);
    }
    
    echo "  Testing Item: ID {$item->id} | Name: {$item->name} | Slug: {$item->slug}\n";
    try {
        $controller = app(\App\Http\Controllers\StorefrontController::class);
        $response = $controller->product($item->slug);
        $html = $response->render();
        echo "  [SUCCESS] Rendered successfully! Size: " . strlen($html) . " bytes\n";
        
        // Quality checks
        if (strpos($html, '<template x-if="activeImage') !== false || strpos($html, '<template x-if="activeMediaType') !== false) {
            echo "  [FAIL] Contains broken unrendered <template x-if>\n";
        } else {
            echo "  [OK] Clean SSR image rendering without template blockage.\n";
        }
        if (strpos($html, 'wa.me/8888') !== false) {
            echo "  [FAIL] Double 88 country code in WhatsApp link!\n";
        } else {
            echo "  [OK] WhatsApp links properly formatted.\n";
        }
    } catch (\Throwable $e) {
        echo "  [ERROR] " . $e->getMessage() . "\n";
        echo "  In file: " . $e->getFile() . ":" . $e->getLine() . "\n";
    }
    tenancy()->end();
}
echo "========================================================\n";
echo "All live tenant storefront product tests complete.\n";
