<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('order_status_histories');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('blacklists');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::enableForeignKeyConstraints();

        // 1. Orders Table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('idempotency_key')->nullable()->unique();
            $table->foreignId('customer_id')->nullable()->constrained('users')->nullOnDelete();

            // কাস্টমার স্ন্যাপশট
            $table->string('customer_name');
            $table->string('customer_phone', 20)->index();
            $table->string('shipping_address');
            $table->string('district')->nullable()->index();
            $table->string('area')->nullable();

            $table->string('status', 20)->default('pending')->index();
            $table->string('payment_status', 20)->default('unpaid')->index();
            $table->string('payment_method', 20)->default('cod');

            // ফিনটেক স্ট্যান্ডার্ড: পয়েন্ট বা সেন্ট/পয়সায় ইন্টিজার হিসেবে সংরক্ষণ
            $table->unsignedBigInteger('subtotal');
            $table->unsignedBigInteger('discount')->default(0);
            $table->unsignedBigInteger('shipping_fee')->default(0);
            $table->unsignedBigInteger('total');
            $table->unsignedBigInteger('paid_amount')->default(0);

            $table->string('courier')->nullable();
            $table->string('tracking_id')->nullable()->index();
            $table->text('customer_note')->nullable();
            $table->text('internal_note')->nullable();
            $table->string('ip_address', 45)->nullable();

            $table->timestamps();
            $table->softDeletes();
            $table->index('created_at');
        });

        // 2. Order Items Table (Product + Variant Snapshot সহ)
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('product_variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->string('product_name');
            $table->string('variant')->nullable(); // e.g. Black / XL
            $table->unsignedBigInteger('unit_price');
            $table->unsignedInteger('quantity');
            $table->unsignedBigInteger('line_total');
            $table->timestamps();
        });

        // 3. Order Status Histories Table (অডিট ও টাইমলাইন)
        Schema::create('order_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('from_status', 20)->nullable();
            $table->string('to_status', 20);
            $table->text('reason')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 4. Payments Table
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('method', 20); // bkash, nagad, cod
            $table->string('transaction_id')->nullable()->unique();
            $table->unsignedBigInteger('amount');
            $table->string('status', 20)->default('pending');
            $table->json('gateway_response')->nullable();
            $table->timestamps();
        });

        // 5. Blacklists Table (ফ্রড ও ফেক অর্ডার প্রতিরোধ)
        Schema::create('blacklists', function (Blueprint $table) {
            $table->id();
            $table->string('type', 10); // phone, ip, address
            $table->string('value')->index();
            $table->string('reason')->nullable();
            $table->timestamps();
            $table->unique(['type', 'value']);
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('blacklists');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_status_histories');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::enableForeignKeyConstraints();
    }
};