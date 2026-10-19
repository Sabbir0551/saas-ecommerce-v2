<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('items') && !Schema::hasColumn('items', 'video_path')) {
            Schema::table('items', function (Blueprint $table) {
                $table->string('video_path')->nullable()->after('video_url');
            });
        }

        if (Schema::hasTable('products') && !Schema::hasColumn('products', 'video_path')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('video_path')->nullable();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('items') && Schema::hasColumn('items', 'video_path')) {
            Schema::table('items', function (Blueprint $table) {
                $table->dropColumn('video_path');
            });
        }

        if (Schema::hasTable('products') && Schema::hasColumn('products', 'video_path')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('video_path');
            });
        }
    }
};
