<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;

$t = Tenant::find('gadgethub');
if ($t) {
    $t->business_category = 'mobile_gadgets';
    $t->archetype = 'physical_store';

    $defaults = config('business_presets.category_defaults.mobile_gadgets', []);
    $t->branding = array_merge($defaults, [
        'store_name' => 'Gadget Hub Bangladesh',
        'hotline_number' => '01899112233',
        'whatsapp_number' => '01899112233',
        'primary_color' => '#3b82f6',
    ]);
    $t->save();
    echo "Updated gadgethub to mobile_gadgets.\n";

    // Seed sample phone in gadgethub
    $t->run(function () {
        $cat = Category::firstOrCreate(
            ['slug' => 'smartphones'],
            ['name' => 'Smartphones & Flagships', 'is_active' => true, 'sort_order' => 1]
        );

        $prod = Product::updateOrCreate(
            ['slug' => 'iphone-15-pro-max'],
            [
                'name' => 'Apple iPhone 15 Pro Max (256GB / Natural Titanium)',
                'category_id' => $cat->id,
                'price' => 155000,
                'sale_price' => 148000,
                'stock_quantity' => 10,
                'sku' => 'IPHONE-15PM-256',
                'is_active' => true,
                'is_featured' => true,
                'description' => '<p>Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.</p>',
                'specs' => [
                    'brand' => 'Apple',
                    'ram' => '8GB RAM',
                    'storage' => '256GB NVMe',
                    'battery' => '4441 mAh',
                    'warranty' => '1 Year Official Apple Warranty',
                    'official_status' => 'Official BTRC Approved',
                ],
                'item_attributes' => [
                    'brand' => 'Apple',
                    'ram' => '8GB RAM',
                    'storage' => '256GB NVMe',
                    'battery' => '4441 mAh',
                    'warranty' => '1 Year Official Apple Warranty',
                    'official_status' => 'Official BTRC Approved',
                ],
            ]
        );
        $prod->categories()->sync([$cat->id]);

        ProductVariant::updateOrCreate(
            ['item_id' => $prod->id, 'sku' => 'IPHONE-15PM-256-NAT'],
            ['title' => '256GB / Natural Titanium', 'price' => 148000, 'stock_quantity' => 5, 'is_active' => true]
        );
        ProductVariant::updateOrCreate(
            ['item_id' => $prod->id, 'sku' => 'IPHONE-15PM-512-NAT'],
            ['title' => '512GB / Natural Titanium', 'price' => 168000, 'stock_quantity' => 3, 'is_active' => true]
        );

        echo "Seeded iPhone 15 Pro Max in gadgethub tenant.\n";
    });
}
