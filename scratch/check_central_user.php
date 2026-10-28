<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$users = User::all();
echo "Total users in central DB: " . $users->count() . "\n";
foreach ($users as $u) {
    echo "ID: {$u->id} | Name: {$u->name} | Email: {$u->email}\n";
}

// Ensure a dedicated superadmin account exists
$adminEmail = 'superadmin@saas.com';
$adminPass = 'password';

$superadmin = User::updateOrCreate(
    ['email' => $adminEmail],
    [
        'name'     => 'Super Admin',
        'password' => Hash::make($adminPass),
    ]
);

echo "\n--- Superadmin Credentials ---\n";
echo "URL: http://localhost:8000/superadmin (or http://saas-ecommerce.test/superadmin)\n";
echo "Email: {$adminEmail}\n";
echo "Password: {$adminPass}\n";
