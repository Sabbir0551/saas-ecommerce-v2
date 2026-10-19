@extends('layouts.storefront')

@section('content')
@php
    $category = tenant('business_category') ?? 'restaurant';
    $categoryDefaults = config("business_presets.category_defaults.{$category}") 
        ?? config("business_presets.category_defaults.restaurant", []);

    $creds = tenant('gateway_credentials') ?? [];
    $tenantBranding = tenant('branding') ?? $creds['branding'] ?? [];
    $branding = array_merge($categoryDefaults, array_filter((array)$tenantBranding, fn($v) => !is_null($v) && $v !== ''));

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';

    $rawImages = $product->images;
    $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
    $firstImage = !empty($images) ? asset('storage/' . $images[0]) : null;

    $rawSpecs = $product->item_attributes ?? $product->specs;
    $specs = is_array($rawSpecs) ? $rawSpecs : (is_string($rawSpecs) ? (json_decode($rawSpecs, true) ?? []) : []);

    $cuisine = $specs['cuisine'] ?? 'Specialty Food';
    $isSpicy = $specs['is_spicy'] ?? 'Medium';
    $prepTime = $specs['preparation_time'] ?? '20-30 Mins';
    $servingSize = $specs['serving_size'] ?? '1-2 Persons';
    $isVeg = !empty($specs['is_vegetarian']);
    $availableTime = $specs['available_time'] ?? 'All Day';

    $displayPrice = $product->sale_price ?: $product->price;
    $variants = $product->variants()->where('is_active', true)->get();

    $hasVideo = $product->has_video ?? (!empty($product->video_path) || !empty($product->embed_video_url));
    $videoType = $product->video_type ?? (!empty($product->video_path) ? 'file' : 'embed');
    $videoSourceUrl = $product->video_source_url ?? $product->embed_video_url;
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
     x-data="{
        activeImage: '{{ $firstImage }}',
        deliveryZone: 'inside_dhaka',
        deliveryFee: 60,
        basePrice: {{ $displayPrice }},
        quantity: 1,
        spiceChoice: '{{ $isSpicy }}',
        get totalAmount() {
            return (this.basePrice * this.quantity) + this.deliveryFee;
        },
        updateZone(zone) {
            this.deliveryZone = zone;
            this.deliveryFee = (zone === 'inside_dhaka') ? 60 : 100;
        }
     }">

    @if(session('success'))
        <div class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-3">
            <span class="text-xl">✓</span>
            <span>{{ session('success') }}</span>
        </div>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left: Food Visuals & Nutritional Info (7 cols) -->
        <div class="lg:col-span-7 space-y-8">
            <div class="bg-white rounded-3xl border border-zinc-200 p-4 sm:p-6 shadow-xs space-y-4">
                <div class="w-full aspect-[4/3] bg-zinc-100 rounded-2xl overflow-hidden relative border border-zinc-100 flex items-center justify-center">
                    @if($firstImage)
                        <img x-show="activeImage" :src="activeImage" src="{{ $firstImage }}" alt="{{ $product->name }}" class="w-full h-full object-cover transition-all duration-300">
                        <div x-show="!activeImage" style="display: none;" class="w-full h-full flex items-center justify-center text-5xl text-zinc-300">
                            🍔
                        </div>
                    @else
                        <div class="w-full h-full flex items-center justify-center text-5xl text-zinc-300">
                            🍔
                        </div>
                    @endif
                </div>

                @if(count($images) > 1)
                    <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        @foreach($images as $img)
                            @php $imgUrl = asset('storage/' . $img); @endphp
                            <button type="button" 
                                    x-on:click="activeImage = '{{ $imgUrl }}'"
                                    :class="(activeImage === '{{ $imgUrl }}') ? 'border-orange-500 ring-2 ring-orange-200' : 'border-zinc-200'"
                                    class="w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition bg-white p-0.5 cursor-pointer">
                                <img src="{{ $imgUrl }}" class="w-full h-full object-cover rounded-lg" alt="Thumbnail">
                            </button>
                        @endforeach
                    </div>
                @endif
            </div>

            <!-- Dedicated Video Showcase Section (Outside Gallery) -->
            @if($hasVideo && !empty($videoSourceUrl))
                <div class="bg-white rounded-3xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-3">
                    <div class="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse"></span>
                            <span class="text-xs font-bold uppercase tracking-wider text-zinc-800">
                                {{ $product->video_title ?? 'খাবার প্রস্তুত প্রণালী ও কিচেন রিভিউ ভিডিও' }}
                            </span>
                        </div>
                        <span class="text-[10px] bg-orange-50 text-orange-600 font-semibold px-2.5 py-0.5 rounded-full border border-orange-100 flex items-center gap-1">
                            <span>🎥</span>
                            <span>ভিডিও ডেমো</span>
                        </span>
                    </div>
                    <div class="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-inner">
                        @if($videoType === 'file')
                            <video src="{{ $videoSourceUrl }}" controls class="w-full h-full" playsinline preload="metadata"></video>
                        @else
                            <iframe src="{{ $videoSourceUrl }}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
                        @endif
                    </div>
                </div>
            @endif

            <!-- Food Specifications -->
            <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
                <h3 class="text-base font-black text-zinc-950 uppercase tracking-wide flex items-center gap-2 border-b border-zinc-100 pb-3">
                    <span>🍳 Cooking & Preparation Details</span>
                </h3>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100">
                        <span class="block text-[11px] text-zinc-500 font-bold uppercase">Cuisine</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $cuisine }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100">
                        <span class="block text-[11px] text-zinc-500 font-bold uppercase">Prep Time</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $prepTime }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100">
                        <span class="block text-[11px] text-zinc-500 font-bold uppercase">Serving</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $servingSize }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100">
                        <span class="block text-[11px] text-zinc-500 font-bold uppercase">Availability</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $availableTime }}</span>
                    </div>
                </div>

                @if(!empty($product->description))
                    <div class="pt-2 text-xs sm:text-sm text-zinc-700 leading-relaxed prose prose-zinc max-w-none">
                        {!! $product->description !!}
                    </div>
                @endif
            </div>
        </div>

        <!-- Right: Instant Food Order Form (5 cols) -->
        <div class="lg:col-span-5 sticky top-24">
            <div class="bg-white rounded-3xl border-2 border-orange-600 p-6 sm:p-8 shadow-xl space-y-6">
                <div class="space-y-2 border-b border-zinc-100 pb-4">
                    <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-200">
                        {{ $product->category->name ?? 'Fresh Menu' }}
                    </span>

                    <h1 class="text-xl sm:text-2xl font-black text-zinc-950 leading-tight">
                        {{ $product->name }}
                    </h1>

                    <div class="flex items-baseline gap-3 pt-1">
                        <span class="text-2xl sm:text-3xl font-black text-orange-600">
                            {{ $currPrefix }}{{ number_format($displayPrice) }}
                        </span>
                        <span class="text-xs text-zinc-500 font-semibold">
                            (Piping Hot Delivery)
                        </span>
                    </div>
                </div>

                <form action="{{ route('storefront.order.place') }}" method="POST" class="space-y-5">
                    @csrf
                    <input type="hidden" name="product_id" value="{{ $product->id }}">
                    <input type="hidden" name="quantity" :value="quantity">
                    <input type="hidden" name="delivery_zone" :value="deliveryZone">
                    <input type="hidden" name="district" :value="(deliveryZone === 'inside_dhaka') ? 'Dhaka' : 'Outside Dhaka'">
                    <input type="hidden" name="payment_method" value="cod">
                    <input type="hidden" name="spice_level" :value="spiceChoice">

                    <!-- Quantity Control -->
                    <div class="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                        <span class="text-xs font-bold text-zinc-800">পরিমাণ (Quantity):</span>
                        <div class="flex items-center gap-3">
                            <button type="button" x-on:click="if(quantity > 1) quantity--" class="w-8 h-8 rounded-lg bg-white border border-zinc-300 font-black text-zinc-800 hover:bg-zinc-100">-</button>
                            <span class="font-black text-sm text-zinc-950" x-text="quantity"></span>
                            <button type="button" x-on:click="quantity++" class="w-8 h-8 rounded-lg bg-white border border-zinc-300 font-black text-zinc-800 hover:bg-zinc-100">+</button>
                        </div>
                    </div>

                    <!-- Customer Information -->
                    <div class="space-y-3">
                        <div>
                            <label class="block text-xs font-bold text-zinc-800 mb-1">আপনার নাম (Full Name) *</label>
                            <input type="text" name="customer_name" required placeholder="আপনার নাম লিখুন"
                                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-800 mb-1">মোবাইল নম্বর (Phone Number) *</label>
                            <input type="text" name="customer_phone" required placeholder="017xxxxxxxx"
                                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-800 mb-1">ডেলিভারি ঠিকানা (Address) *</label>
                            <textarea name="shipping_address" required rows="2" placeholder="ফ্ল্যাট নং, বাড়ি ও রোডের নাম..."
                                      class="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"></textarea>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-800 mb-1">স্পেশাল রান্নার নির্দেশনা (Cooking Instruction / Note)</label>
                            <input type="text" name="customer_note" placeholder="যেমন: ঝাল কম দেবেন, এক্সট্রা টিস্যু"
                                   class="w-full px-4 py-2 rounded-xl border border-zinc-300 text-xs focus:outline-none focus:border-orange-500">
                        </div>
                    </div>

                    <!-- Order Total Summary -->
                    <div class="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-2 text-xs">
                        <div class="flex justify-between text-zinc-600">
                            <span>খাবারের মোট মূল্য:</span>
                            <span class="font-bold text-zinc-900" x-text="'{{ $currPrefix }}' + (basePrice * quantity).toLocaleString()"></span>
                        </div>
                        <div class="flex justify-between text-zinc-600">
                            <span>ডেলিভারি চার্জ:</span>
                            <span class="font-bold text-zinc-900" x-text="'{{ $currPrefix }}' + deliveryFee"></span>
                        </div>
                        <div class="flex justify-between text-sm font-black text-zinc-950 pt-2 border-t border-orange-200">
                            <span>মোট পরিশোধযোগ্য (ক্যাশ অন ডেলিভারি):</span>
                            <span class="text-orange-600 text-base" x-text="'{{ $currPrefix }}' + totalAmount.toLocaleString()"></span>
                        </div>
                    </div>

                    <button type="submit" 
                            class="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                        <span>খাবার অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>
                    </button>
                </form>
            </div>
        </div>

    </div>

</div>
@endsection
