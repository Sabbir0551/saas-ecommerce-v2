<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        try {
            if (Schema::hasTable('bookings')) {
                $type = Schema::getColumnType('bookings', 'slot_start');
                if (!in_array($type, ['string', 'varchar', 'text'], true)) {
                    Schema::table('bookings', function (Blueprint $table) {
                        $table->string('slot_start')->change();
                        $table->string('slot_end')->nullable()->change();
                    });
                }
            }

            if (Schema::hasTable('booking_slots')) {
                $type = Schema::getColumnType('booking_slots', 'start_time');
                if (!in_array($type, ['string', 'varchar', 'text'], true)) {
                    Schema::table('booking_slots', function (Blueprint $table) {
                        $table->string('start_time')->change();
                        $table->string('end_time')->change();
                    });
                }
            }
        } finally {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }

    public function down(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        try {
            if (Schema::hasTable('bookings')) {
                Schema::table('bookings', function (Blueprint $table) {
                    $table->time('slot_start')->change();
                    $table->time('slot_end')->nullable()->change();
                });
            }

            if (Schema::hasTable('booking_slots')) {
                Schema::table('booking_slots', function (Blueprint $table) {
                    $table->time('start_time')->change();
                    $table->time('end_time')->change();
                });
            }
        } finally {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }
};
