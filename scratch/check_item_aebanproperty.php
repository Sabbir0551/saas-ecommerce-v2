<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

tenancy()->initialize(App\Models\Tenant::find('aebanproperty'));
$item = App\Models\Item::first();
echo json_encode($item->toArray(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
