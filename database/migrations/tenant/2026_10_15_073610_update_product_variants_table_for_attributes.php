<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ফরেন কি সংক্রান্ত কনফ্লিক্ট এড়াতে সাময়িক ডিসেবল
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('product_variants');
        Schema::enableForeignKeyConstraints();

        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('title'); // e.g. "Black / M" or "Red / XL"
            $table->json('attributes_combination')->nullable(); // e.g. {"Size": "M", "Color": "Black"}
            $table->string('sku')->nullable()->index();
            $table->decimal('price', 10, 2)->nullable(); // Selling price
            $table->decimal('compare_at_price', 10, 2)->nullable(); // Regular/Crossed price
            $table->integer('stock_quantity')->default(0);
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('product_variants');
        Schema::enableForeignKeyConstraints();
    }
};