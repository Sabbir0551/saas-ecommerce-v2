<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use Illuminate\Http\Request;

$tenants = Tenant::all();
echo "Testing Storefront Homepage across " . $tenants->count() . " Tenants...\n";
$successCount = 0;
$failCount = 0;

foreach ($tenants as $t) {
    echo "========================================================\n";
    echo "Testing Tenant: {$t->id} | Category: {$t->business_category} | Archetype: {$t->archetype}\n";
    tenancy()->initialize($t);

    try {
        $controller = app(\App\Http\Controllers\StorefrontController::class);
        $request = Request::create('/', 'GET');
        $response = $controller->index($request);
        $html = $response->render();

        $size = strlen($html);
        echo "  [SUCCESS] Rendered homepage successfully! Size: {$size} bytes\n";

        // Check key elements for ecommerce tenants
        $isEcommerce = in_array($t->business_category, ['mobile_gadgets', 'laptop_computer', 'fashion_clothing', 'default', 'pet_food'], true);
        if ($isEcommerce) {
            $hasHero = strpos($html, 'Hero Showcase Card') !== false || strpos($html, 'Shop Now') !== false || strpos($html, 'HOT TECH') !== false || strpos($html, 'hero') !== false;
            $hasTrust = strpos($html, '100% Satisfaction') !== false || strpos($html, 'Nationwide') !== false;
            $hasFeatured = strpos($html, 'Featured Gadgets') !== false || strpos($html, 'Featured') !== false;
            $hasPromo = strpos($html, 'The Ultimate Mobile Gaming Setup') !== false || strpos($html, 'NEXT-GEN GAMING') !== false;
            $hasCoupon = strpos($html, 'Save 10% On Your First Order') !== false || strpos($html, 'FIRST10') !== false;

            echo "  - Hero section present: " . ($hasHero ? "YES" : "NO") . "\n";
            echo "  - Trust cards present: " . ($hasTrust ? "YES" : "NO") . "\n";
            echo "  - Featured section present: " . ($hasFeatured ? "YES" : "NO") . "\n";
            echo "  - Promo banner present: " . ($hasPromo ? "YES" : "NO") . "\n";
            echo "  - Coupon banner present: " . ($hasCoupon ? "YES" : "NO") . "\n";
        }

        $successCount++;
    } catch (\Throwable $e) {
        echo "  [FAIL] " . $e->getMessage() . "\n";
        echo "  In file: " . $e->getFile() . ":" . $e->getLine() . "\n";
        $failCount++;
    }

    tenancy()->end();
}

echo "========================================================\n";
echo "SUMMARY: {$successCount} Passed, {$failCount} Failed.\n";
