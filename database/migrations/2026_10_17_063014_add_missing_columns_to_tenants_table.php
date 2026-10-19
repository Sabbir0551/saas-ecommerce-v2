<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            if (!Schema::hasColumn('tenants', 'name')) {
                $table->string('name')->nullable()->after('id');
            }
            if (!Schema::hasColumn('tenants', 'business_category')) {
                $table->string('business_category')->default('fashion_clothing')->after('name');
            }
            if (!Schema::hasColumn('tenants', 'archetype')) {
                $table->string('archetype')->default('commerce')->after('business_category');
            }
            if (!Schema::hasColumn('tenants', 'owner_email')) {
                $table->string('owner_email')->nullable()->after('archetype');
            }
            if (!Schema::hasColumn('tenants', 'owner_phone')) {
                $table->string('owner_phone')->nullable()->after('owner_email');
            }
            if (!Schema::hasColumn('tenants', 'plan')) {
                $table->string('plan')->default('free_trial')->after('owner_phone');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'business_category',
                'archetype',
                'owner_email',
                'owner_phone',
                'plan',
            ]);
        });
    }
};