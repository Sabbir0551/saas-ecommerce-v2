<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\Item;
use App\Models\Product;
use Illuminate\Support\Facades\Route;

echo "=== TESTING ALL PRODUCT VIEWS ===\n\n";

$tenants = Tenant::all();
echo "Found " . $tenants->count() . " tenants in system:\n";
foreach ($tenants as $t) {
    echo "Tenant: {$t->id} | Category: {$t->business_category} | Archetype: {$t->archetype}\n";
}
echo "\n";

$categoriesToTest = [
    'real_estate',
    'fashion_clothing',
    'doctor',
    'restaurant',
    'pharmacy',
    'mobile_gadgets',
    'laptop_computer',
    'default',
];

// 1. Test live tenant aebanproperty
$aeTenant = Tenant::find('aebanproperty');
if ($aeTenant) {
    tenancy()->initialize($aeTenant);
    $item = Item::first();
    if ($item) {
        try {
            $view = app(\App\Http\Controllers\StorefrontController::class)->product($item->slug);
            $html = $view->render();
            echo "[SUCCESS] aebanproperty (real_estate) rendered product '{$item->slug}' (" . strlen($html) . " bytes)\n";
            // Check that no template tags remain unrendered
            if (strpos($html, '<template x-if="activeMediaType') !== false || strpos($html, '<template x-if="activeImage') !== false) {
                echo "[WARNING] Found raw <template x-if> in aebanproperty product view\n";
            } else {
                echo "          No broken <template x-if> detected.\n";
            }
            if (strpos($html, 'Huntleigh Luxury Country Estate & Villa') !== false) {
                echo "          Title correctly displayed: 'Huntleigh Luxury Country Estate & Villa'\n";
            }
            if (strpos($html, 'wa.me/88') !== false) {
                echo "          WhatsApp number properly internationalized with 88\n";
            }
        } catch (\Throwable $e) {
            echo "[ERROR] aebanproperty product render failed: " . $e->getMessage() . "\n" . $e->getFile() . ':' . $e->getLine() . "\n";
        }
    }
    tenancy()->end();
}

// 2. Test view compilation directly for all categories with a dummy Product/Item object
echo "\n--- TESTING DIRECT VIEW RESOLUTION FOR ALL CATEGORIES ---\n";
foreach ($categoriesToTest as $cat) {
    // Create an in-memory product model
    $dummyProduct = new Product([
        'name' => "Sample Premium {$cat} Item",
        'slug' => "sample-premium-{$cat}-item",
        'price' => 1500,
        'sale_price' => 1200,
        'images' => ['products/sample.jpg'],
        'specs' => [
            'brand' => 'Apex Test Brand',
            'fabric' => '100% Pure Cotton',
            'cuisine' => 'Bengali Traditional',
            'generic_name' => 'Paracetamol BP',
            'dosage_form' => '500mg Tablet',
            'visiting_hours' => '6:00 PM - 9:00 PM',
            'location' => 'Gulshan-2, Dhaka',
            'processor_model' => 'Intel Core i7 13th Gen',
        ],
        'description' => '<p>This is a test description for verifying storefront stability.</p>',
    ]);
    $dummyProduct->id = 999;
    $dummyProduct->setRelation('variants', collect());

    // Resolve view path as StorefrontController does
    $viewName = null;
    if (view()->exists("storefront.categories.{$cat}.product")) {
        $viewName = "storefront.categories.{$cat}.product";
    } elseif (view()->exists("storefront.categories.default.product")) {
        $viewName = "storefront.categories.default.product";
    } else {
        $viewName = "storefront.product";
    }

    try {
        $rendered = view($viewName, [
            'product' => $dummyProduct,
            'images' => ['products/sample.jpg'],
            'firstImage' => 'http://localhost:8000/storage/products/sample.jpg',
            'videoEmbedUrl' => null,
            'specs' => $dummyProduct->specs,
            'category' => $cat,
            'archetype' => 'physical_store',
            'relatedProducts' => collect(),
        ])->render();

        $hasRawTemplate = (strpos($rendered, '<template x-if="activeMediaType') !== false || strpos($rendered, '<template x-if="activeImage') !== false);
        $status = $hasRawTemplate ? "[FAILED TEMPLATE CHECK]" : "[PASSED]";
        echo "{$status} Category: {$cat} (View: {$viewName}) - Rendered " . strlen($rendered) . " bytes\n";
    } catch (\Throwable $e) {
        echo "[ERROR] Category: {$cat} (View: {$viewName}) - " . $e->getMessage() . " at " . $e->getFile() . ":" . $e->getLine() . "\n";
    }
}

echo "\n=== ALL TESTS COMPLETE ===\n";
