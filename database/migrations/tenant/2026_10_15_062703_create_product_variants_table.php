<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('type')->default('Size'); // e.g., Size, Color
            $table->string('value'); // e.g., S, M, L, XL, Red, Blue
            $table->string('sku')->nullable()->unique();
            $table->decimal('price', 10, 2)->nullable(); // ভ্যারিয়েন্টের আলাদা প্রাইস থাকলে
            $table->integer('stock_quantity')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};