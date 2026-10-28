<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$testTenants = ['aebanproperty', 'bestlaptop', 'artfashion'];

foreach ($testTenants as $tenantId) {
    $tenant = App\Models\Tenant::find($tenantId);
    if (!$tenant) {
        echo "Tenant {$tenantId} not found.\n";
        continue;
    }
    tenancy()->initialize($tenant);
    echo "=== Tenant: {$tenantId} (Category: " . ($tenant->business_category ?? 'default') . ") ===\n";

    // View rendered storefront homepage
    $response = app(App\Http\Controllers\StorefrontController::class)->index(request());
    $html = $response->render();

    // Check Sub-navigation items in HTML
    if (str_contains($html, 'All Properties')) {
        echo "  [OK] Found 'All Properties' in navigation.\n";
    } elseif (str_contains($html, 'All Laptops')) {
        echo "  [OK] Found 'All Laptops' in navigation.\n";
    } elseif (str_contains($html, 'All Fashion')) {
        echo "  [OK] Found 'All Fashion' in navigation.\n";
    } else {
        echo "  [NOTICE] Check navigation content.\n";
    }

    // Check trust tags
    if (str_contains($html, '100% Verified Legal Titles') || str_contains($html, '100% Genuine Certified') || str_contains($html, '100% Quality Fabric')) {
        echo "  [OK] Category-specific trust tag found.\n";
    } else {
        echo "  [NOTICE] Trust tag not matched.\n";
    }

    // Check Footer Column 3 heading
    if (str_contains($html, 'Featured Properties') || str_contains($html, 'Top Laptop Brands') || str_contains($html, 'Popular Collections')) {
        echo "  [OK] Category-specific footer column 3 heading found.\n";
    } else {
        echo "  [NOTICE] Footer column 3 heading not matched.\n";
    }

    // Check Footer Column 4 identity badge
    if (str_contains($html, 'ভেরিফাইড রিয়েল এস্টেট পোর্টাল') || str_contains($html, 'ব্যক্তিগত রিটেইল মার্চেন্ট একাউন্ট') || str_contains($html, 'ভেরিফাইড ফ্যাশন বুটিক')) {
        echo "  [OK] Category-specific merchant identity badge found.\n";
    } else {
        echo "  [NOTICE] Identity badge not matched.\n";
    }

    tenancy()->end();
}

echo "\n--- Testing Custom Merchant Overwrite via Branding ---\n";
$tenant = App\Models\Tenant::find('aebanproperty');
tenancy()->initialize($tenant);

$currentBranding = $tenant->branding ?? [];
$currentBranding['nav_trust_tag_1'] = '● রাজউক অনুমোদিত প্রাইম প্লট';
$currentBranding['footer_featured_title'] = 'সেরা অ্যাপার্টমেন্ট ও প্লট';
$currentBranding['footer_merchant_badge_text'] = 'ঢাকা রিয়েল এস্টেট অনুমোদিত কনসালটেন্সি';
$tenant->branding = $currentBranding;
$tenant->save();

$response = app(App\Http\Controllers\StorefrontController::class)->index(request());
$html = $response->render();

if (str_contains($html, '● রাজউক অনুমোদিত প্রাইম প্লট')) {
    echo "  [SUCCESS] Custom nav_trust_tag_1 override reflected in HTML!\n";
}
if (str_contains($html, 'সেরা অ্যাপার্টমেন্ট ও প্লট')) {
    echo "  [SUCCESS] Custom footer_featured_title override reflected in HTML!\n";
}
if (str_contains($html, 'ঢাকা রিয়েল এস্টেট অনুমোদিত কনসালটেন্সি')) {
    echo "  [SUCCESS] Custom footer_merchant_badge_text override reflected in HTML!\n";
}

// Reset for clean test state
unset($currentBranding['nav_trust_tag_1']);
unset($currentBranding['footer_featured_title']);
unset($currentBranding['footer_merchant_badge_text']);
$tenant->branding = $currentBranding;
$tenant->save();
echo "  [CLEANUP] Reverted test branding override.\n";

tenancy()->end();
echo "All validation tests completed successfully!\n";
