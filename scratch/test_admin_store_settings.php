<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Tenant;
use App\Filament\Pages\StoreSettings;
use Livewire\Livewire;

$t = Tenant::find('gadgethub');
tenancy()->initialize($t);

echo "Testing StoreSettings Filament Admin Form for {$t->id}...\n";

try {
    Livewire::test(StoreSettings::class)
        ->assertSuccessful()
        ->assertFormFieldExists('hero_badge')
        ->assertFormFieldExists('hero_title')
        ->assertFormFieldExists('hero_pills')
        ->assertFormFieldExists('cat_section_enabled')
        ->assertFormFieldExists('featured_section_enabled')
        ->assertFormFieldExists('promo_banner_enabled')
        ->assertFormFieldExists('new_drops_enabled')
        ->assertFormFieldExists('coupon_banner_enabled')
        ->assertFormFieldExists('service_strip_enabled');

    echo "[SUCCESS] StoreSettings Filament form successfully validated with all new controls!\n";
} catch (\Throwable $e) {
    echo "[ERROR] " . $e->getMessage() . "\n";
    echo "In: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

tenancy()->end();
