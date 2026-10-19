<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('store_modules')) {
            Schema::create('store_modules', function (Blueprint $table) {
                $table->id();
                $table->string('module_key')->unique();
                $table->string('name_bn')->nullable();
                $table->boolean('is_enabled')->default(true);
                $table->json('settings')->nullable();
                $table->timestamps();
            });

            // ডিফল্ট মডিউলসমূহ ইনসার্ট
            $modules = [
                ['module_key' => 'physical_store', 'name_bn' => 'পণ্য দোকান (Physical Store)', 'is_enabled' => true],
                ['module_key' => 'food_menu', 'name_bn' => 'মেনু ও খাবার (Food & Menu)', 'is_enabled' => false],
                ['module_key' => 'service_booking', 'name_bn' => 'সার্ভিস ও বুকিং (Service & Booking)', 'is_enabled' => false],
                ['module_key' => 'listing_inquiry', 'name_bn' => 'তালিকা ও ইনকোয়ারি (Listing & Inquiry)', 'is_enabled' => false],
                ['module_key' => 'digital_course', 'name_bn' => 'ডিজিটাল ও কোর্স (Digital & Courses)', 'is_enabled' => false],
                ['module_key' => 'portfolio_content', 'name_bn' => 'পোর্টফোলিও ও কনটেন্ট (Portfolio & Content)', 'is_enabled' => false],
            ];

            // টেন্যান্টের মূল আর্কিটাইপ অনুযায়ী সংশ্লিষ্ট মডিউল সক্রিয় করা
            $currentArchetype = tenant('archetype') ?? 'physical_store';
            foreach ($modules as &$mod) {
                if ($mod['module_key'] === $currentArchetype || 
                   ($currentArchetype === 'commerce' && $mod['module_key'] === 'physical_store') ||
                   ($currentArchetype === 'service' && $mod['module_key'] === 'service_booking') ||
                   (($currentArchetype === 'lead_gen' || $currentArchetype === 'lead') && $mod['module_key'] === 'listing_inquiry')) {
                    $mod['is_enabled'] = true;
                }
                $mod['created_at'] = now();
                $mod['updated_at'] = now();
            }

            DB::table('store_modules')->insert($modules);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('store_modules');
    }
};
