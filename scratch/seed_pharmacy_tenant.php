<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Hash;

$subdomain = 'medicare';
$domain = "{$subdomain}.localhost";

$categoryKey = 'pharmacy';
$categoryConfig = config("business_presets.categories.{$categoryKey}", []);
$archetype = $categoryConfig['archetype'] ?? 'physical_store';

$categoryDefaults = config("business_presets.category_defaults.{$categoryKey}", []);

$initialBranding = array_merge($categoryDefaults, [
    'store_name'      => 'MediCare Pharma & Health',
    'hotline_number'  => '01711223344',
    'whatsapp_number' => '01711223344',
    'primary_color'   => '#16a34a',
]);

$tenant = Tenant::find($subdomain);
if (!$tenant) {
    $tenant = new Tenant();
    $tenant->id = $subdomain;
    $tenant->name = 'MediCare Pharma & Health';
    $tenant->business_category = $categoryKey;
    $tenant->archetype = $archetype;
    $tenant->branding = $initialBranding;
    $tenant->owner_email = 'pharma@medicare.com';
    $tenant->owner_phone = '01711223344';
    $tenant->plan = 'free_trial';
    $tenant->drug_license_no = 'DL-DHK-98421';
    $tenant->terms_accepted = true;
    $tenant->trial_ends_at = now()->addDays(14)->toDateTimeString();
    $tenant->save();

    $tenant->domains()->create([
        'domain' => $domain,
    ]);
    echo "Created tenant: {$subdomain}\n";
} else {
    $tenant->business_category = $categoryKey;
    $tenant->archetype = $archetype;
    $tenant->branding = $initialBranding;
    $tenant->save();
    echo "Updated existing tenant: {$subdomain}\n";
}

// Seed sample medicines in tenant DB
$tenant->run(function () {
    User::updateOrCreate(
        ['email' => 'admin@medicare.com'],
        [
            'name'     => 'Dr. Pharmacist Admin',
            'password' => Hash::make('password'),
        ]
    );

    $catFever = Category::firstOrCreate(
        ['slug' => 'fever-pain'],
        ['name' => 'Fever & Pain Relief', 'is_active' => true, 'sort_order' => 1]
    );

    $catGastric = Category::firstOrCreate(
        ['slug' => 'gastric-digestion'],
        ['name' => 'Gastric & Digestion', 'is_active' => true, 'sort_order' => 2]
    );

    // Product 1: Napa Extra
    $napa = Product::updateOrCreate(
        ['slug' => 'napa-extra-tablet'],
        [
            'name' => 'Napa Extra 500mg/65mg Tablet',
            'category_id' => $catFever->id,
            'price' => 35,
            'sale_price' => 30,
            'stock_quantity' => 200,
            'sku' => 'MED-NAPA-01',
            'is_active' => true,
            'is_featured' => true,
            'description' => '<p>Fast relief from fever, migraine, headache, back pain, and dental pain. Gentle on stomach with rapid absorption.</p>',
            'specs' => [
                'generic_name' => 'Paracetamol 500mg + Caffeine 65mg',
                'dosage_form' => 'Tablet',
                'strength' => '500mg / 65mg',
                'manufacturer' => 'Beximco Pharmaceuticals Ltd.',
                'requires_prescription' => false,
                'dar_number' => 'DAR-024-0012',
            ],
            'item_attributes' => [
                'generic_name' => 'Paracetamol 500mg + Caffeine 65mg',
                'dosage_form' => 'Tablet',
                'strength' => '500mg / 65mg',
                'manufacturer' => 'Beximco Pharmaceuticals Ltd.',
                'requires_prescription' => false,
                'dar_number' => 'DAR-024-0012',
            ],
        ]
    );
    $napa->categories()->sync([$catFever->id]);

    ProductVariant::updateOrCreate(
        ['item_id' => $napa->id, 'sku' => 'NAPA-1-STRIP'],
        ['title' => '1 Strip (12 Tablets)', 'price' => 30, 'stock_quantity' => 100, 'is_active' => true]
    );
    ProductVariant::updateOrCreate(
        ['item_id' => $napa->id, 'sku' => 'NAPA-BOX'],
        ['title' => '1 Full Box (20 Strips)', 'price' => 580, 'stock_quantity' => 20, 'is_active' => true]
    );

    // Product 2: Seclo 20mg Capsule (Rx required)
    $seclo = Product::updateOrCreate(
        ['slug' => 'seclo-20mg-capsule'],
        [
            'name' => 'Seclo 20mg Capsule (Omeprazole)',
            'category_id' => $catGastric->id,
            'price' => 70,
            'sale_price' => 65,
            'stock_quantity' => 150,
            'sku' => 'MED-SECLO-20',
            'is_active' => true,
            'is_featured' => true,
            'description' => '<p>Effective proton pump inhibitor for gastric acidity, GERD, and peptic ulcer relief.</p>',
            'specs' => [
                'generic_name' => 'Omeprazole BP 20mg',
                'dosage_form' => 'Capsule',
                'strength' => '20mg',
                'manufacturer' => 'Square Pharmaceuticals Ltd.',
                'requires_prescription' => true,
                'dar_number' => 'DAR-012-0450',
            ],
            'item_attributes' => [
                'generic_name' => 'Omeprazole BP 20mg',
                'dosage_form' => 'Capsule',
                'strength' => '20mg',
                'manufacturer' => 'Square Pharmaceuticals Ltd.',
                'requires_prescription' => true,
                'dar_number' => 'DAR-012-0450',
            ],
        ]
    );
    $seclo->categories()->sync([$catGastric->id]);

    ProductVariant::updateOrCreate(
        ['item_id' => $seclo->id, 'sku' => 'SECLO-STRIP'],
        ['title' => '1 Strip (10 Capsules)', 'price' => 65, 'stock_quantity' => 50, 'is_active' => true]
    );
    ProductVariant::updateOrCreate(
        ['item_id' => $seclo->id, 'sku' => 'SECLO-BOX'],
        ['title' => '1 Full Box (10 Strips)', 'price' => 620, 'stock_quantity' => 15, 'is_active' => true]
    );

    echo "Seeded 2 sample medicines with variants in medicare tenant.\n";
});
