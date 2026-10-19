<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // বুকিং স্লট শিডিউল টেবিল
        if (!Schema::hasTable('booking_slots')) {
            Schema::create('booking_slots', function (Blueprint $table) {
                $table->id();
                $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
                $table->unsignedTinyInteger('day_of_week')->default(0); // 0 = Sunday, 1 = Monday ... 6 = Saturday
                $table->time('start_time');
                $table->time('end_time');
                $table->unsignedInteger('capacity')->default(1);
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // গ্রাহক বুকিং ও অ্যাপয়েন্টমেন্ট টেবিল
        if (!Schema::hasTable('bookings')) {
            Schema::create('bookings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
                $table->string('customer_name');
                $table->string('customer_phone');
                $table->string('customer_email')->nullable();
                $table->date('booking_date');
                $table->time('slot_start');
                $table->time('slot_end')->nullable();
                $table->decimal('fee', 10, 2)->default(0);
                $table->string('status')->default('pending'); // pending, confirmed, completed, cancelled
                $table->string('payment_status')->default('unpaid'); // unpaid, paid, refunded
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }

        // লিস্টিং ও পোর্টফোলিও থেকে আসা গ্রাহক ইনকোয়ারি টেবিল
        if (!Schema::hasTable('inquiries')) {
            Schema::create('inquiries', function (Blueprint $table) {
                $table->id();
                $table->foreignId('item_id')->nullable()->constrained('items')->nullOnDelete();
                $table->string('name');
                $table->string('phone');
                $table->string('email')->nullable();
                $table->text('message');
                $table->string('status')->default('new'); // new, contacted, closed
                $table->text('notes')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('booking_slots');
    }
};
