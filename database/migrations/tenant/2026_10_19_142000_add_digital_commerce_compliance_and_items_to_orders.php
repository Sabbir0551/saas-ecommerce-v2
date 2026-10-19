<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Order Items to Items Connection
        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                if (!Schema::hasColumn('order_items', 'item_id')) {
                    $table->foreignId('item_id')->nullable()->after('order_id')->constrained('items')->nullOnDelete();
                }
                if (!Schema::hasColumn('order_items', 'item_variant_id')) {
                    $table->foreignId('item_variant_id')->nullable()->after('item_id')->constrained('item_variants')->nullOnDelete();
                }
            });

            // Backfill existing order items if items table has matching IDs
            if (Schema::hasTable('items')) {
                DB::statement("UPDATE order_items SET item_id = product_id WHERE item_id IS NULL AND product_id IS NOT NULL AND product_id IN (SELECT id FROM items)");
                if (Schema::hasTable('item_variants')) {
                    DB::statement("UPDATE order_items SET item_variant_id = product_variant_id WHERE item_variant_id IS NULL AND product_variant_id IS NOT NULL AND product_variant_id IN (SELECT id FROM item_variants)");
                }
            }
        }

        // 2. Orders Table Digital Commerce Guidelines Fields
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (!Schema::hasColumn('orders', 'paid_at')) {
                    $table->timestamp('paid_at')->nullable()->after('payment_status');
                }
                if (!Schema::hasColumn('orders', 'courier_handed_over_at')) {
                    $table->timestamp('courier_handed_over_at')->nullable()->after('paid_at');
                }
                if (!Schema::hasColumn('orders', 'handover_deadline_at')) {
                    $table->timestamp('handover_deadline_at')->nullable()->after('courier_handed_over_at');
                }
                if (!Schema::hasColumn('orders', 'is_ready_to_ship')) {
                    $table->boolean('is_ready_to_ship')->default(true)->after('handover_deadline_at');
                }
                if (!Schema::hasColumn('orders', 'advance_percent_allowed')) {
                    $table->unsignedTinyInteger('advance_percent_allowed')->default(100)->after('is_ready_to_ship');
                }
                if (!Schema::hasColumn('orders', 'cannot_supply_at')) {
                    $table->timestamp('cannot_supply_at')->nullable()->after('advance_percent_allowed');
                }
                if (!Schema::hasColumn('orders', 'refund_deadline_at')) {
                    $table->timestamp('refund_deadline_at')->nullable()->after('cannot_supply_at');
                }
                if (!Schema::hasColumn('orders', 'refunded_at')) {
                    $table->timestamp('refunded_at')->nullable()->after('refund_deadline_at');
                }
                if (!Schema::hasColumn('orders', 'dispute_status')) {
                    $table->string('dispute_status', 30)->nullable()->after('refunded_at');
                }
            });
        }

        // 3. Customer Disputes & Complaints Table (72h Timer)
        if (!Schema::hasTable('disputes')) {
            Schema::create('disputes', function (Blueprint $table) {
                $table->id();
                $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
                $table->string('ticket_number', 50)->unique();
                $table->string('customer_name');
                $table->string('customer_phone', 25)->index();
                $table->string('customer_email')->nullable();
                $table->string('subject');
                $table->text('description');
                $table->string('status', 30)->default('open')->index(); // open, in_progress, resolved, escalated
                $table->text('resolution_notes')->nullable();
                $table->timestamp('deadline_at'); // 72h countdown
                $table->timestamp('resolved_at')->nullable();
                $table->timestamp('escalated_to_superadmin_at')->nullable();
                $table->timestamps();
            });
        }

        // 4. Product / Item Reviews Table (Legal Anti-Delete Guard)
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
                $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
                $table->string('customer_name');
                $table->string('customer_phone', 25)->nullable();
                $table->unsignedTinyInteger('rating')->default(5); // 1-5 stars
                $table->text('comment')->nullable();
                $table->boolean('is_hidden')->default(false)->index();
                $table->string('hide_reason')->nullable();
                $table->timestamp('hidden_at')->nullable();
                $table->foreignId('hidden_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('disputes');

        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn([
                    'paid_at',
                    'courier_handed_over_at',
                    'handover_deadline_at',
                    'is_ready_to_ship',
                    'advance_percent_allowed',
                    'cannot_supply_at',
                    'refund_deadline_at',
                    'refunded_at',
                    'dispute_status',
                ]);
            });
        }

        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                $table->dropForeign(['item_id']);
                $table->dropForeign(['item_variant_id']);
                $table->dropColumn(['item_id', 'item_variant_id']);
            });
        }
    }
};
