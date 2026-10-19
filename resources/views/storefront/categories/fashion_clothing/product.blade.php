@extends('layouts.storefront')

@section('content')
@php
    $category = tenant('business_category') ?? 'fashion_clothing';
    $categoryDefaults = config("business_presets.category_defaults.{$category}") 
        ?? config("business_presets.category_defaults.fashion_clothing", []);

    $creds = tenant('gateway_credentials') ?? [];
    $tenantBranding = tenant('branding') ?? $creds['branding'] ?? [];
    $branding = array_merge($categoryDefaults, array_filter((array)$tenantBranding, fn($v) => !is_null($v) && $v !== ''));

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
    $waDigits = preg_replace('/[^0-9]/', '', $whatsapp);
    if (str_starts_with($waDigits, '01')) {
        $waDigits = '88' . $waDigits;
    }

    $rawImages = $product->images;
    $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
    $firstImage = !empty($images) ? asset('storage/' . $images[0]) : null;

    $rawSpecs = $product->item_attributes ?? $product->specs;
    $specs = is_array($rawSpecs) ? $rawSpecs : (is_string($rawSpecs) ? (json_decode($rawSpecs, true) ?? []) : []);

    $fabric = $specs['fabric'] ?? '100% Pure Cotton';
    $fit = $specs['fit'] ?? 'Regular Fit';
    $gender = $specs['gender'] ?? 'Unisex';
    $washCare = $specs['wash_care'] ?? 'Cold water machine wash or hand wash with gentle detergent.';

    $displayPrice = $product->sale_price ?: $product->price;
    $regularPrice = $product->price;
    $discount = ($product->sale_price && $product->sale_price < $product->price) ? ($product->price - $product->sale_price) : 0;

    $variants = $product->variants()->where('is_active', true)->get();

    $hasVideo = $product->has_video ?? (!empty($product->video_path) || !empty($product->embed_video_url));
    $videoType = $product->video_type ?? (!empty($product->video_path) ? 'file' : 'embed');
    $videoSourceUrl = $product->video_source_url ?? $product->embed_video_url;
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" 
     x-data="{
        activeImage: '{{ $firstImage }}',
        selectedSize: 'M',
        selectedVariantId: '{{ $variants->first()->id ?? '' }}',
        deliveryZone: 'inside_dhaka',
        deliveryFee: 80,
        basePrice: {{ $displayPrice }},
        quantity: 1,
        get totalAmount() {
            return (this.basePrice * this.quantity) + this.deliveryFee;
        },
        updateZone(zone) {
            this.deliveryZone = zone;
            this.deliveryFee = (zone === 'inside_dhaka') ? 80 : 130;
        }
     }">

    @if(session('success'))
        <div class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-3">
            <span class="text-xl">✓</span>
            <span>{{ session('success') }}</span>
        </div>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left Column: Gallery & Details (7 cols) -->
        <div class="lg:col-span-7 space-y-8">
            
            <!-- Main Photo Gallery -->
            <div class="bg-white rounded-3xl border border-zinc-200 p-4 sm:p-6 shadow-xs space-y-4">
                <div class="w-full aspect-[4/5] bg-zinc-100 rounded-2xl overflow-hidden relative border border-zinc-100 flex items-center justify-center">
                    @if($firstImage)
                        <img x-show="activeImage" :src="activeImage" src="{{ $firstImage }}" alt="{{ $product->name }}" class="w-full h-full object-cover transition-all duration-300">
                        <div x-show="!activeImage" style="display: none;" class="w-full h-full flex items-center justify-center text-5xl text-zinc-300">
                            👗
                        </div>
                    @else
                        <div class="w-full h-full flex items-center justify-center text-5xl text-zinc-300">
                            👗
                        </div>
                    @endif
                </div>

                @if(count($images) > 1)
                    <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        @foreach($images as $img)
                            @php $imgUrl = asset('storage/' . $img); @endphp
                            <button type="button" 
                                    x-on:click="activeImage = '{{ $imgUrl }}'"
                                    :class="(activeImage === '{{ $imgUrl }}') ? 'border-theme-primary ring-2 ring-theme-primary/20' : 'border-zinc-200 hover:border-zinc-300'"
                                    class="w-16 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 transition bg-white p-0.5 cursor-pointer">
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
                            <span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                            <span class="text-xs font-bold uppercase tracking-wider text-zinc-800">
                                {{ $product->video_title ?? 'পণ্যের রিভিউ / ফ্যাশন ভিডিও' }}
                            </span>
                        </div>
                        <span class="text-[10px] bg-red-50 text-red-600 font-semibold px-2.5 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
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

            <!-- Fabric & Care Specifications -->
            <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
                <h3 class="text-base font-black text-zinc-950 uppercase tracking-wide flex items-center gap-2 border-b border-zinc-100 pb-3">
                    <span>🧵 Fabric & Garment Specifications</span>
                </h3>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                        <span class="block text-[11px] text-zinc-500 font-bold uppercase">Fabric</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $fabric }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                        <span class="block text-[11px] text-zinc-500 font-bold uppercase">Fitting</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $fit }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                        <span class="block text-[11px] text-zinc-500 font-bold uppercase">Gender</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $gender }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                        <span class="block text-[11px] text-zinc-500 font-bold uppercase">Delivery</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">24-48 Hours</span>
                    </div>
                </div>

                @if(!empty($product->description))
                    <div class="pt-2 text-xs sm:text-sm text-zinc-700 leading-relaxed prose prose-zinc max-w-none">
                        {!! $product->description !!}
                    </div>
                @endif

                <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-1">
                    <span class="font-bold flex items-center gap-1.5 text-amber-950">
                        <span>🧼 Wash & Maintenance Care</span>
                    </span>
                    <p class="text-amber-800 leading-relaxed">{{ $washCare }}</p>
                </div>
            </div>

            <!-- Trust & Exchange Promise -->
            <div class="p-6 rounded-3xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="space-y-1 text-center sm:text-left">
                    <h4 class="text-sm font-bold text-rose-300">7 Days Easy Size Exchange Guarantee</h4>
                    <p class="text-xs text-zinc-400">If the size does not fit comfortably, we exchange it at your doorstep within 7 days.</p>
                </div>
                <a href="https://wa.me/{{ $waDigits }}?text={{ urlencode('Hello, I have a question about ' . $product->name) }}" target="_blank"
                   class="px-5 py-2.5 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-100 transition flex-shrink-0 flex items-center gap-2">
                    <span>Ask on WhatsApp</span>
                </a>
            </div>

        </div>

        <!-- Right Column: Express Checkout Order Form (5 cols) -->
        <div class="lg:col-span-5 sticky top-24">
            <div class="bg-white rounded-3xl border-2 border-zinc-900 p-6 sm:p-8 shadow-xl space-y-6">
                
                <!-- Product Title & Price Header -->
                <div class="space-y-2 border-b border-zinc-100 pb-5">
                    <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200">
                        {{ $product->category->name ?? 'Fashion Apparel' }}
                    </span>

                    <h1 class="text-xl sm:text-2xl font-black text-zinc-950 leading-tight">
                        {{ $product->name }}
                    </h1>

                    <div class="flex items-baseline gap-3 pt-1">
                        <span class="text-2xl sm:text-3xl font-black text-zinc-950">
                            {{ $currPrefix }}{{ number_format($displayPrice) }}
                        </span>
                        @if($discount > 0)
                            <span class="text-sm text-zinc-400 line-through">
                                {{ $currPrefix }}{{ number_format($regularPrice) }}
                            </span>
                            <span class="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                                Save {{ $currPrefix }}{{ number_format($discount) }}
                            </span>
                        @endif
                    </div>
                </div>

                <!-- Fast Order Form -->
                <form action="{{ route('storefront.order.place') }}" method="POST" class="space-y-5">
                    @csrf
                    <input type="hidden" name="product_id" value="{{ $product->id }}">
                    <input type="hidden" name="quantity" :value="quantity">
                    <input type="hidden" name="delivery_zone" :value="deliveryZone">
                    <input type="hidden" name="district" :value="(deliveryZone === 'inside_dhaka') ? 'Dhaka' : 'Outside Dhaka'">
                    <input type="hidden" name="selected_size" :value="selectedSize">
                    <input type="hidden" name="product_variant_id" :value="selectedVariantId">
                    <input type="hidden" name="payment_method" value="cod">

                    <!-- Size Selector -->
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-zinc-900 uppercase tracking-wide">
                            Select Size: <span class="text-theme-primary font-black" x-text="selectedSize"></span>
                        </label>
                        <div class="grid grid-cols-5 gap-2">
                            @foreach(['S', 'M', 'L', 'XL', 'XXL'] as $sizeOption)
                                <button type="button" 
                                        x-on:click="selectedSize = '{{ $sizeOption }}'"
                                        :class="(selectedSize === '{{ $sizeOption }}') ? 'bg-zinc-950 text-white border-zinc-950 ring-2 ring-zinc-400' : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'"
                                        class="py-2.5 text-xs font-black rounded-xl border transition cursor-pointer text-center">
                                    {{ $sizeOption }}
                                </button>
                            @endforeach
                        </div>
                    </div>

                    <!-- Color / Variants Selector if any -->
                    @if($variants->count() > 0)
                        <div class="space-y-2 pt-1">
                            <label class="block text-xs font-bold text-zinc-900 uppercase tracking-wide">
                                Available Color / Option:
                            </label>
                            <div class="flex flex-wrap gap-2">
                                @foreach($variants as $variant)
                                    <button type="button" 
                                            x-on:click="selectedVariantId = '{{ $variant->id }}'"
                                            :class="(selectedVariantId == '{{ $variant->id }}') ? 'bg-theme-primary text-white border-theme-primary' : 'bg-zinc-100 text-zinc-800 border-zinc-200'"
                                            class="px-3 py-1.5 text-xs font-bold rounded-lg border transition">
                                        {{ $variant->title ?? $variant->name }}
                                    </button>
                                @endforeach
                            </div>
                        </div>
                    @endif

                    <!-- Customer Information -->
                    <div class="space-y-3 pt-2">
                        <div>
                            <label class="block text-xs font-bold text-zinc-800 mb-1">আপনার নাম (Full Name) *</label>
                            <input type="text" name="customer_name" required placeholder="যেমন: ফারহানা আহমেদ"
                                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-800 mb-1">মোবাইল নম্বর (Phone Number) *</label>
                            <input type="text" name="customer_phone" required placeholder="017xxxxxxxx"
                                   class="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-800 mb-1">ডেলিভারি ঠিকানা (Full Address) *</label>
                            <textarea name="shipping_address" required rows="2" placeholder="বাড়ি নং, রোড নং, এলাকা ও জেলার নাম লিখুন..."
                                      class="w-full px-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950"></textarea>
                        </div>
                    </div>

                    <!-- Delivery Location Radios -->
                    <div class="space-y-2 pt-1">
                        <label class="block text-xs font-bold text-zinc-800">ডেলিভারি এরিয়া বেছে নিন *</label>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <label x-on:click="updateZone('inside_dhaka')"
                                   :class="(deliveryZone === 'inside_dhaka') ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950' : 'border-zinc-200'"
                                   class="p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition">
                                <span class="font-bold text-zinc-900">ঢাকার ভিতরে</span>
                                <span class="text-zinc-500 font-semibold mt-1">৳৮০ (২৪ ঘন্টা)</span>
                            </label>

                            <label x-on:click="updateZone('outside_dhaka')"
                                   :class="(deliveryZone === 'outside_dhaka') ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950' : 'border-zinc-200'"
                                   class="p-3 rounded-xl border cursor-pointer flex flex-col justify-between transition">
                                <span class="font-bold text-zinc-900">ঢাকার বাইরে</span>
                                <span class="text-zinc-500 font-semibold mt-1">৳১৩০ (৪৮ ঘন্টা)</span>
                            </label>
                        </div>
                    </div>

                    <!-- Payment Method: Cash on Delivery -->
                    <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                        <span class="font-bold">পেমেন্ট পদ্ধতি: ক্যাশ অন ডেলিভারি (COD)</span>
                        <span class="text-emerald-700 font-semibold">পণ্য দেখে মূল্য পরিশোধ</span>
                    </div>

                    <!-- Order Total Summary -->
                    <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs">
                        <div class="flex justify-between text-zinc-600">
                            <span>পণ্যের দাম:</span>
                            <span class="font-bold text-zinc-900">{{ $currPrefix }}{{ number_format($displayPrice) }}</span>
                        </div>
                        <div class="flex justify-between text-zinc-600">
                            <span>ডেলিভারি চার্জ:</span>
                            <span class="font-bold text-zinc-900" x-text="'{{ $currPrefix }}' + deliveryFee"></span>
                        </div>
                        <div class="flex justify-between text-sm font-black text-zinc-950 pt-2 border-t border-zinc-200">
                            <span>সর্বমোট পরিশোধযোগ্য:</span>
                            <span class="text-theme-primary text-base" x-text="'{{ $currPrefix }}' + totalAmount.toLocaleString()"></span>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" 
                            class="w-full py-4 bg-theme-primary hover:opacity-95 text-white font-black text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                        <span>অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)</span>
                    </button>

                    <p class="text-[11px] text-center text-zinc-500 font-medium">
                        🔒 আপনার তথ্য সম্পূর্ণ নিরাপদ। ডেলিভারিম্যান পৌঁছালে টাকা পরিশোধ করবেন।
                    </p>
                </form>

            </div>
        </div>

    </div>

</div>
@endsection
