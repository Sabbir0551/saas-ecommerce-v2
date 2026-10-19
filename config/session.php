<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Session Driver
    |--------------------------------------------------------------------------
    | এখানে আমরা 'file' কে ডিফল্ট রেখেছি। এর ফলে সেশন ডাটাবেসে না খুঁজে 
    | সরাসরি লোকাল ফাইলে জমা রাখবে, যার ফলে সেশন জনিত এরর বা লগইন লুপ হবে না।
    */
    'driver' => env('SESSION_DRIVER', 'file'),

    /*
    |--------------------------------------------------------------------------
    | Session Lifetime & Expiration
    |--------------------------------------------------------------------------
    | কতক্ষণ ব্রাউজার ইনঅ্যাক্টিভ থাকলে লগআউট হবে (১২০ মিনিট বা ২ ঘণ্টা)।
    */
    'lifetime' => (int) env('SESSION_LIFETIME', 120),

    'expire_on_close' => env('SESSION_EXPIRE_ON_CLOSE', false),

    /*
    |--------------------------------------------------------------------------
    | Session Encryption & File Path
    |--------------------------------------------------------------------------
    | সেশন ফাইলগুলো storage/framework/sessions ফোল্ডারে সংরক্ষিত হবে।
    */
    'encrypt' => env('SESSION_ENCRYPT', false),

    'files' => storage_path('framework/sessions'),

    'connection' => env('SESSION_CONNECTION'),

    'table' => env('SESSION_TABLE', 'sessions'),

    'store' => env('SESSION_STORE'),

    'lottery' => [2, 100],

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Configuration
    |--------------------------------------------------------------------------
    | কুকির নাম এবং পাথ।
    */
    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug((string) env('APP_NAME', 'laravel')).'_session'
    ),

    'path' => env('SESSION_PATH', '/'),

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Domain (খুবই গুরুত্বপূর্ণ লাইন)
    |--------------------------------------------------------------------------
    | এখানে env('SESSION_DOMAIN', null) ব্যবহার করা হয়েছে।
    | এর মানে হলো: যদি .env ফাইলে নির্দিষ্ট ডোমেইন না দেওয়া থাকে, তবে এটি নিজে 
    | থেকেই 'null' থাকবে। 'null' থাকার সুবিধা হলো Brave/Chrome ব্রাউজার 
    | localhost ও doelx.localhost উভয়ের জন্যই সেশন কুকি গ্রহণ করবে, আটকে রাখবে না।
    */
    'domain' => env('SESSION_DOMAIN', null),

    'secure' => env('SESSION_SECURE_COOKIE', false),

    'http_only' => env('SESSION_HTTP_ONLY', true),

    'same_site' => env('SESSION_SAME_SITE', 'lax'),

    'partitioned' => env('SESSION_PARTITIONED_COOKIE', false),

    'serialization' => 'json',

];