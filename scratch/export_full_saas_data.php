<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\Item;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Order;
use Illuminate\Support\Facades\Schema;

echo "🚀 Starting Full SaaS Data Extraction from Laravel...\n";

$tenants = Tenant::with('domains')->get();
$exportData = [
    'exportedAt' => date('c'),
    'tenants' => [],
];

foreach ($tenants as $t) {
    echo "Processing Tenant: {$t->id}...\n";
    $tenantRecord = [
        'id' => $t->id,
        'name' => $t->name ?? $t->id,
        'subdomain' => $t->id,
        'businessType' => $t->business_category ?? 'fashion_clothing',
        'archetype' => $t->archetype ?? 'commerce',
        'domains' => $t->domains->pluck('domain')->toArray(),
        'theme_config' => $t->theme_config ?? null,
        'phone' => $t->phone ?? null,
        'email' => $t->email ?? null,
        'address' => $t->address ?? null,
        'categories' => [],
        'items' => [],
        'orders' => [],
    ];

    tenancy()->initialize($t);

    // Extract categories
    if (Schema::hasTable('categories')) {
        $cats = Category::all();
        foreach ($cats as $c) {
            $tenantRecord['categories'][] = [
                'id' => (string)$c->id,
                'name' => $c->name,
                'slug' => $c->slug ?? \Illuminate\Support\Str::slug($c->name),
            ];
        }
    }

    // Extract items / products
    if (Schema::hasTable('items')) {
        $items = Item::all();
        foreach ($items as $item) {
            $tenantRecord['items'][] = [
                'id' => (string)$item->id,
                'title' => $item->name ?? $item->title ?? 'Product',
                'slug' => $item->slug ?? \Illuminate\Support\Str::slug($item->name ?? 'item-' . $item->id),
                'shortDescription' => $item->short_description ?? null,
                'description' => $item->description ?? null,
                'price' => (float)($item->price ?? 0),
                'comparePrice' => isset($item->compare_price) ? (float)$item->compare_price : null,
                'stockQuantity' => (int)($item->stock_quantity ?? 20),
                'images' => is_array($item->images) ? $item->images : (is_string($item->images) ? json_decode($item->images, true) ?? [] : []),
                'itemType' => ($t->archetype === 'service' || in_array($t->business_category, ['doctor', 'barber_salon'])) ? 'SERVICE_APPOINTMENT' : 'PHYSICAL_PRODUCT',
                'category_id' => $item->category_id ? (string)$item->category_id : null,
            ];
        }
    }

    // Extract orders if any
    if (Schema::hasTable('orders')) {
        $orders = Order::with('items')->limit(20)->get();
        foreach ($orders as $o) {
            $tenantRecord['orders'][] = [
                'orderNumber' => $o->order_number ?? 'ORD-' . $o->id,
                'customerName' => $o->customer_name ?? 'Customer',
                'customerPhone' => $o->customer_phone ?? '01700000000',
                'shippingAddress' => $o->shipping_address ?? 'Dhaka',
                'totalAmount' => (float)($o->total_amount ?? 0),
                'paymentMethod' => $o->payment_method ?? 'COD',
            ];
        }
    }

    tenancy()->end();

    $exportData['tenants'][] = $tenantRecord;
}

$outputDir = 'c:/laragon/www/saas-ecommerce-v2/backend/data';
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0777, true);
}

$outputPath = $outputDir . '/laravel_exported_data.json';
file_put_contents($outputPath, json_encode($exportData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo "✅ Extraction Complete! Saved to {$outputPath}\n";
echo "Total Tenants Exported: " . count($exportData['tenants']) . "\n";
