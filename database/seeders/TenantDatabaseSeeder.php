<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TenantDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds for a tenant.
     */
    public function run(): void
    {
        // টেন্যান্ট স্টোরের জন্য ডিফল্ট ওনার/অ্যাডমিন তৈরি
        $email = tenant('owner_email') ?? tenant('email') ?? ('admin@' . tenant('id') . '.com');
        $name = tenant('name') ?? 'Store Admin';

        User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make('password'),
            ]
        );
    }
}