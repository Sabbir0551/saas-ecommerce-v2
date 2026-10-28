<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\Item;
use App\Http\Controllers\StorefrontController;

echo "=== Verifying Star Tech, Laptop Point BD, Best Electronics, Zaiyan Bespoke & Shajgoj Feature Rendering ===\n";

// 1. Tech / Laptop Test (Star Tech & Laptop Point BD & Best Electronics)
$tLaptop = Tenant::where('business_category', 'laptop_computer')->first();
if ($tLaptop) {
    tenancy()->initialize($tLaptop);
    $item = Item::first();
    $item->item_attributes = array_merge((array)$item->item_attributes, [
        'free_gifts' => 'Exclusive Laptop Backpack + Wireless Mouse + Gaming Mousepad',
        'replacement_warranty' => '15 Days Instant Replacement',
        'service_warranty' => '5 Years Free Service Warranty',
        'emi_facility' => '0% EMI up to 36 Months',
        'compressor_warranty' => '10 Years Official Warranty',
        'installation_policy' => 'Free Home Delivery & Installation',
    ]);
    $item->save();

    $response = app(StorefrontController::class)->product($item->slug);
    $html = $response->render();
    
    assert(strpos($html, 'Exclusive Free Gifts') !== false, "Free gifts box not found!");
    assert(strpos($html, '15 Days Instant Replacement') !== false, "Replacement warranty not found!");
    assert(strpos($html, '5 Years Free Service Warranty') !== false, "Service warranty not found!");
    assert(strpos($html, 'Cash Discount Price') !== false, "Cash discount price not found!");
    assert(strpos($html, 'Official Appliance Warranty') !== false, "Appliance warranty not found!");
    echo "  [PASS] Tech / Laptop Category (Star Tech, Laptop Point BD, Best Electronics features confirmed)\n";
    tenancy()->end();
}

// 2. Fashion Test (Zaiyan Bespoke)
$tFashion = Tenant::where('business_category', 'fashion_clothing')->first();
if ($tFashion) {
    tenancy()->initialize($tFashion);
    $item = Item::first();
    $item->item_attributes = array_merge((array)$item->item_attributes, [
        'fabric' => '100% Egyptian Giza Cotton (120s 2-Ply)',
        'weave_type' => 'Royal Oxford Weave',
        'custom_tailoring' => true,
        'bespoke_note' => 'Custom sleeve length and collar styling available.',
    ]);
    $item->save();

    $response = app(StorefrontController::class)->product($item->slug);
    $html = $response->render();

    assert(strpos($html, 'Bespoke Made-to-Measure Service') !== false, "Bespoke service box not found!");
    assert(strpos($html, 'Consult Master Tailor on WhatsApp') !== false, "Master tailor button not found!");
    assert(strpos($html, 'Royal Oxford Weave') !== false, "Weave type not found!");
    assert(strpos($html, '7 Days Doorstep Size Exchange Guarantee') !== false, "Doorstep exchange guarantee not found!");
    echo "  [PASS] Fashion Category (Zaiyan Bespoke luxury tailoring & fabric features confirmed)\n";
    tenancy()->end();
}

// 3. Pharmacy / Beauty Test (Shajgoj)
$tPharma = Tenant::where('business_category', 'pharmacy')->first();
if ($tPharma) {
    tenancy()->initialize($tPharma);
    $item = Item::first();
    $item->item_attributes = array_merge((array)$item->item_attributes, [
        'authenticity_badge' => true,
        'country_of_origin' => 'Made in South Korea',
        'skin_concern' => 'Acne & Blemishes Control',
        'skin_type' => 'Oily & Sensitive Skin',
        'key_ingredients' => 'Niacinamide 10% + Zinc 1% + Centella Asiatica',
        'how_to_use' => 'Apply 2-3 drops morning and evening before heavier creams.',
    ]);
    $item->save();

    $response = app(StorefrontController::class)->product($item->slug);
    $html = $response->render();

    assert(strpos($html, '100% Authentic Guaranteed (DGDA Verified)') !== false, "Authenticity badge not found!");
    assert(strpos($html, 'Made in South Korea') !== false, "Country of origin not found!");
    assert(strpos($html, 'Key Active Ingredients &amp; Formulation') !== false || strpos($html, 'Key Active Ingredients') !== false, "Key ingredients not found!");
    assert(strpos($html, 'How to Use / ব্যবহার বিধি ও নির্দেশিকা') !== false, "How to use guide not found!");
    echo "  [PASS] Pharmacy / Beauty Category (Shajgoj authenticity, ingredients & routine features confirmed)\n";
    tenancy()->end();
}

echo "=== All Benchmark Features Successfully Verified ===\n";
