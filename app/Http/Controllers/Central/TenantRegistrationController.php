<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TenantRegistrationController extends Controller
{
    public function showRegistrationForm()
    {
        $categories = config('business_presets.categories', []);
        return view('central.register', compact('categories'));
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'store_name'        => 'required|string|max:100',
            'business_category' => 'required|string',
            'subdomain'         => [
                'required',
                'string',
                'min:3',
                'max:30',
                'alpha_dash',
                Rule::notIn(['admin', 'api', 'central', 'www', 'mail', 'billing', 'localhost']),
                'unique:tenants,id',
            ],
            'admin_name'        => 'required|string|max:150',
            'email'             => 'required|email|max:150',
            'password'          => 'required|string|min:8|confirmed',
            'customer_phone'    => 'required|string|regex:/^(?:\+?88)?01[3-9]\d{8}$/',
            'drug_license_no'   => 'nullable|string|max:100',
        ], [
            'business_category.required' => 'আপনার ব্যবসার ধরন নির্বাচন করুন।',
            'subdomain.unique'           => 'এই সাবডোমেইনটি ইতোমধ্যে ব্যবহৃত হয়েছে। অন্য একটি নাম দিন।',
            'subdomain.not_in'           => 'এই সাবডোমেইন নামটি সিস্টেম সংরক্ষিত।',
            'customer_phone.regex'       => 'একটি সঠিক ১১ ডিজিটের ফোন নম্বর দিন (যেমন: 017xxxxxxxx)',
        ]);

        $subdomain = Str::lower($validated['subdomain']);
        $centralHost = 'localhost';
        $domain = "{$subdomain}.{$centralHost}";

        // ব্যবসার আর্কিটাইপ নির্ধারণ
        $categoryKey = $validated['business_category'];
        $categoryConfig = config("business_presets.categories.{$categoryKey}", []);
        $archetype = $categoryConfig['archetype'] ?? 'physical_store';

        // ১. টেন্যান্ট ইনস্ট্যান্স তৈরি ও সেভ
        $categoryDefaults = config("business_presets.category_defaults.{$categoryKey}")
            ?? config("business_presets.category_defaults.default", []);

        $initialBranding = array_merge($categoryDefaults, [
            'store_name'      => $validated['store_name'],
            'hotline_number'  => $validated['customer_phone'],
            'whatsapp_number' => $validated['customer_phone'],
            'primary_color'   => $categoryDefaults['theme_color'] ?? '#2563eb',
        ]);

        $tenant = new Tenant();
        $tenant->id = $subdomain;
        $tenant->name = $validated['store_name'];
        $tenant->business_category = $categoryKey;
        $tenant->archetype = $archetype;
        $tenant->branding = $initialBranding;
        $tenant->owner_email = $validated['email'];
        $tenant->owner_phone = $validated['customer_phone'];
        $tenant->plan = 'free_trial';
        $tenant->drug_license_no = $validated['drug_license_no'] ?? null;
        $tenant->terms_accepted = true;
        $tenant->trial_ends_at = now()->addDays(14)->toDateTimeString();
        $tenant->save();

        // ২. সাবডোমেইন ম্যাপিং
        $tenant->domains()->create([
            'domain' => $domain,
        ]);

        // ৩. টেন্যান্টের ডাটাবেজে ইউজার ও ডিফল্ট মডিউল কনফিগারেশন
        $tenant->run(function () use ($validated, $archetype) {
            User::updateOrCreate(
                ['email' => $validated['email']],
                [
                    'name'     => $validated['admin_name'],
                    'password' => Hash::make($validated['password']),
                ]
            );

            // টেন্যান্ট আর্কিটাইপের জন্য প্রাসঙ্গিক মডিউল সক্রিয় করা
            if (\Illuminate\Support\Facades\Schema::hasTable('store_modules')) {
                \App\Models\StoreModule::updateOrCreate(
                    ['module_key' => $archetype],
                    ['is_enabled' => true]
                );
            }
        });

        return redirect()->away("http://{$domain}:8000/admin");
    }
}