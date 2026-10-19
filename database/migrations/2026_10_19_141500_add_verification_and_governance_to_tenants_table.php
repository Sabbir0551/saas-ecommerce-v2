<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            if (!Schema::hasColumn('tenants', 'status')) {
                $table->string('status')->default('active')->after('plan');
            }
            if (!Schema::hasColumn('tenants', 'suspended_reason')) {
                $table->text('suspended_reason')->nullable()->after('status');
            }
            if (!Schema::hasColumn('tenants', 'suspended_at')) {
                $table->timestamp('suspended_at')->nullable()->after('suspended_reason');
            }
            if (!Schema::hasColumn('tenants', 'trade_license_no')) {
                $table->string('trade_license_no')->nullable()->after('suspended_at');
            }
            if (!Schema::hasColumn('tenants', 'trade_license_file')) {
                $table->string('trade_license_file')->nullable()->after('trade_license_no');
            }
            if (!Schema::hasColumn('tenants', 'trade_license_verified_at')) {
                $table->timestamp('trade_license_verified_at')->nullable()->after('trade_license_file');
            }
            if (!Schema::hasColumn('tenants', 'nid_no')) {
                $table->string('nid_no')->nullable()->after('trade_license_verified_at');
            }
            if (!Schema::hasColumn('tenants', 'nid_file')) {
                $table->string('nid_file')->nullable()->after('nid_no');
            }
            if (!Schema::hasColumn('tenants', 'nid_verified_at')) {
                $table->timestamp('nid_verified_at')->nullable()->after('nid_file');
            }
            if (!Schema::hasColumn('tenants', 'bmdc_reg_no')) {
                $table->string('bmdc_reg_no')->nullable()->after('nid_verified_at');
            }
            if (!Schema::hasColumn('tenants', 'bmdc_verified_at')) {
                $table->timestamp('bmdc_verified_at')->nullable()->after('bmdc_reg_no');
            }
            if (!Schema::hasColumn('tenants', 'tin_no')) {
                $table->string('tin_no')->nullable()->after('bmdc_verified_at');
            }
            if (!Schema::hasColumn('tenants', 'bin_no')) {
                $table->string('bin_no')->nullable()->after('tin_no');
            }
            if (!Schema::hasColumn('tenants', 'pra_no')) {
                $table->string('pra_no')->nullable()->after('bin_no');
            }
            if (!Schema::hasColumn('tenants', 'verification_status')) {
                $table->string('verification_status')->default('unverified')->after('pra_no');
            }
            if (!Schema::hasColumn('tenants', 'verification_notes')) {
                $table->text('verification_notes')->nullable()->after('verification_status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'suspended_reason',
                'suspended_at',
                'trade_license_no',
                'trade_license_file',
                'trade_license_verified_at',
                'nid_no',
                'nid_file',
                'nid_verified_at',
                'bmdc_reg_no',
                'bmdc_verified_at',
                'tin_no',
                'bin_no',
                'pra_no',
                'verification_status',
                'verification_notes',
            ]);
        });
    }
};
