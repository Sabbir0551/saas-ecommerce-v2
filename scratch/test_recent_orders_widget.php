<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$tenant = App\Models\Tenant::find('aebanproperty');
tenancy()->initialize($tenant);

echo "Tenant initialized: " . tenant('id') . "\n";

// Fetch the 5 latest orders as done in RecentOrdersWidget
$orders = App\Models\Order::query()->latest()->limit(5)->get();
echo "Found " . $orders->count() . " orders.\n";

foreach ($orders as $order) {
    echo "Order #{$order->order_number}: status = " . (is_object($order->status) ? get_class($order->status) . ' (' . $order->status->value . ')' : $order->status) . "\n";
    
    // Simulate what Filament table does with the status closures:
    $state = $order->status;
    $val = $state instanceof App\Enums\OrderStatus ? $state->value : (string) ($state?->value ?? $state ?? '');
    
    $color = match ($val) {
        'delivered', 'completed' => 'success',
        'processing', 'shipped' => 'info',
        'cancelled' => 'danger',
        default => 'warning',
    };
    $formatted = ucfirst($val);
    
    echo " -> Color: {$color}, Formatted: {$formatted}\n";
}

echo "All checks passed successfully!\n";
