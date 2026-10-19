<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            if (!Schema::hasColumn('tenants', 'drug_license_no')) {
                $table->string('drug_license_no')->nullable()->after('plan');
            }
            if (!Schema::hasColumn('tenants', 'drug_license_file')) {
                $table->string('drug_license_file')->nullable()->after('drug_license_no');
            }
            if (!Schema::hasColumn('tenants', 'drug_license_verified_at')) {
                $table->timestamp('drug_license_verified_at')->nullable()->after('drug_license_file');
            }
            if (!Schema::hasColumn('tenants', 'gateway_credentials')) {
                $table->json('gateway_credentials')->nullable()->after('drug_license_verified_at');
            }
            if (!Schema::hasColumn('tenants', 'terms_accepted')) {
                $table->boolean('terms_accepted')->default(true)->after('gateway_credentials');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'drug_license_no',
                'drug_license_file',
                'drug_license_verified_at',
                'gateway_credentials',
                'terms_accepted',
            ]);
        });
    }
};
