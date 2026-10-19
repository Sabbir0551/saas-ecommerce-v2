<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('slot_start')->change();
            $table->string('slot_end')->nullable()->change();
        });

        Schema::table('booking_slots', function (Blueprint $table) {
            $table->string('start_time')->change();
            $table->string('end_time')->change();
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->time('slot_start')->change();
            $table->time('slot_end')->nullable()->change();
        });

        Schema::table('booking_slots', function (Blueprint $table) {
            $table->time('start_time')->change();
            $table->time('end_time')->change();
        });
    }
};
