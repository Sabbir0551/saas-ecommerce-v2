<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\Item;
use App\Models\Brand;
use App\Http\Controllers\StorefrontController;
use Illuminate\Http\Request;

echo "=== Testing Brand Creation, Product Identification & Hamburger Drawer ===\n";

$tenant = Tenant::where('business_category', 'laptop_computer')->first() ?? Tenant::first();
echo "Testing on Tenant: {$tenant->id}\n";
tenancy()->initialize($tenant);

// 1. Test Brand Creation
$brand = Brand::firstOrCreate(
    ['slug' => 'lenovo'],
    [
        'name' => 'Lenovo',
        'is_featured' => true,
        'is_active' => true,
        'sort_order' => 1,
        'description' => 'Global technology leader in laptops and workstations',
    ]
);

$brand2 = Brand::firstOrCreate(
    ['slug' => 'apple'],
    [
        'name' => 'Apple',
        'is_featured' => true,
        'is_active' => true,
        'sort_order' => 2,
    ]
);

echo "  [PASS] Brands created: {$brand->name} (ID: {$brand->id}) & {$brand2->name} (ID: {$brand2->id})\n";

// 2. Assign Brand to Product
$item = Item::first();
$item->brand_id = $brand->id;
$item->save();

echo "  [PASS] Item '{$item->name}' linked to Brand '{$item->brand->name}'\n";
assert($item->brand->name === 'Lenovo', "Brand relationship failed!");
assert($item->brand_name === 'Lenovo', "brand_name accessor failed!");

// 3. Render Product Detail Page
$controller = app(StorefrontController::class);
$response = $controller->product($item->slug);
$html = $response->render();

assert(strpos($html, 'mobileMenuOpen') !== false, "Hamburger drawer Alpine state not found!");
assert(strpos($html, 'মেনু') !== false || strpos($html, 'সব ক্যাটাগরি ও ব্র্যান্ড') !== false, "Hamburger menu button not found!");
assert(strpos($html, 'Lenovo') !== false, "Brand Lenovo not found in product view!");
echo "  [PASS] Product detail page rendered with Brand 'Lenovo' and Hamburger Drawer!\n";

// 4. Render Storefront Home Page with Brand Filter
$request = Request::create('/', 'GET', ['brand' => 'lenovo']);
$homeResponse = $controller->index($request);
$homeHtml = $homeResponse->render();

assert(strpos($homeHtml, 'Slide-Over Hamburger Drawer') !== false, "Slide-Over Hamburger Drawer not found in layout!");
assert(strpos($homeHtml, 'সব ক্যাটাগরি') !== false, "Categories section in drawer not found!");
echo "  [PASS] Storefront home rendered with Brand filter and Hamburger Drawer!\n";

tenancy()->end();

echo "=== All Tests Passed Successfully! ===\n";
