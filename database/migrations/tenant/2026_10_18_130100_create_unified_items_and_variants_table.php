<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('items')) {
            Schema::create('items', function (Blueprint $table) {
                $table->id();
                $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
                $table->string('item_type')->default('physical'); // physical, service, food, listing, digital, portfolio
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('sku')->nullable();
                $table->string('barcode')->nullable();
                $table->longText('description')->nullable();
                $table->decimal('price', 12, 2)->default(0);
                $table->decimal('sale_price', 12, 2)->nullable();
                $table->integer('stock_quantity')->default(0);
                $table->json('images')->nullable();
                $table->string('video_url')->nullable();
                $table->string('video_title')->nullable();
                $table->json('item_attributes')->nullable(); // প্রিসেটের বিশেষ ফিল্ডসমূহ (RAM, ক্যারেট, BMDC, ইত্যাদি)
                $table->json('custom_fields')->nullable(); // মার্চেন্টের নিজস্ব কাস্টম ফিল্ড
                $table->integer('completeness_score')->default(0); // পূর্ণতা মিটার (০-১০০%)
                $table->boolean('is_active')->default(true);
                $table->boolean('is_featured')->default(false);
                $table->integer('sort_order')->default(0);
                $table->json('seo_metadata')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('item_variants')) {
            Schema::create('item_variants', function (Blueprint $table) {
                $table->id();
                $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
                $table->string('title');
                $table->decimal('price', 12, 2)->nullable();
                $table->integer('stock_quantity')->default(0);
                $table->string('sku')->nullable();
                $table->json('attributes')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('category_item')) {
            Schema::create('category_item', function (Blueprint $table) {
                $table->id();
                $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
                $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
                $table->timestamps();
            });
        }

        // বিদ্যমান products টেবিল থাকলে তা থেকে ডেটা মাইগ্রেশন
        if (Schema::hasTable('products') && DB::table('items')->count() === 0) {
            $archetype = tenant('archetype') ?? 'commerce';
            $itemType = match ($archetype) {
                'service' => 'service',
                'lead_gen', 'lead' => 'listing',
                default => 'physical',
            };

            $existingProducts = DB::table('products')->get();
            foreach ($existingProducts as $prod) {
                $itemId = DB::table('items')->insertGetId([
                    'id'                 => $prod->id,
                    'category_id'        => $prod->category_id ?? null,
                    'item_type'          => $itemType,
                    'name'               => $prod->name,
                    'slug'               => $prod->slug,
                    'sku'                => $prod->sku ?? null,
                    'barcode'            => $prod->barcode ?? null,
                    'description'        => $prod->description ?? null,
                    'price'              => $prod->price ?? 0,
                    'sale_price'         => $prod->sale_price ?? null,
                    'stock_quantity'     => $prod->stock_quantity ?? 0,
                    'images'             => $prod->images ?? null,
                    'video_url'          => $prod->video_url ?? null,
                    'video_title'        => $prod->video_title ?? null,
                    'item_attributes'    => $prod->specs ?? null,
                    'custom_fields'      => null,
                    'completeness_score' => 80,
                    'is_active'          => $prod->is_active ?? true,
                    'is_featured'        => false,
                    'sort_order'         => 0,
                    'seo_metadata'       => null,
                    'created_at'         => $prod->created_at ?? now(),
                    'updated_at'         => $prod->updated_at ?? now(),
                ]);

                // ক্যাটাগরি পিভট ডেটা কপি
                if (Schema::hasTable('category_product')) {
                    $catProducts = DB::table('category_product')->where('product_id', $prod->id)->get();
                    foreach ($catProducts as $cp) {
                        DB::table('category_item')->insertOrIgnore([
                            'category_id' => $cp->category_id,
                            'item_id'     => $itemId,
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                    }
                }
            }

            // বিদ্যমান product_variants থাকলে তা item_variants এ কপি
            if (Schema::hasTable('product_variants')) {
                $existingVariants = DB::table('product_variants')->get();
                foreach ($existingVariants as $var) {
                    DB::table('item_variants')->insertOrIgnore([
                        'id'             => $var->id,
                        'item_id'        => $var->product_id,
                        'title'          => $var->title ?? 'Default',
                        'price'          => $var->price ?? null,
                        'stock_quantity' => $var->stock_quantity ?? 0,
                        'sku'            => $var->sku ?? null,
                        'attributes'     => $var->attributes ?? null,
                        'is_active'      => $var->is_active ?? true,
                        'created_at'     => $var->created_at ?? now(),
                        'updated_at'     => $var->updated_at ?? now(),
                    ]);
                }
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('category_item');
        Schema::dropIfExists('item_variants');
        Schema::dropIfExists('items');
    }
};
