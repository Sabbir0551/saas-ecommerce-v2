@extends('layouts.storefront')

@section('content')
@php
    $category = tenant('business_category') ?? 'mobile_gadgets';
    $categoryDefaults = config("business_presets.category_defaults.{$category}") 
        ?? config("business_presets.category_defaults.mobile_gadgets", []);

    $creds = tenant('gateway_credentials') ?? [];
    $tenantBranding = tenant('branding') ?? $creds['branding'] ?? [];
    $branding = array_merge($categoryDefaults, array_filter((array)$tenantBranding, fn($v) => !is_null($v) && $v !== ''));

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
    $waDigits = preg_replace('/[^0-9]/', '', $whatsapp);

    $rawImages = $product->images;
    $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
    $firstImage = !empty($images) ? asset('storage/' . $images[0]) : null;

    $rawSpecs = $product->item_attributes ?? $product->specs;
    $specs = is_array($rawSpecs) ? $rawSpecs : (is_string($rawSpecs) ? (json_decode($rawSpecs, true) ?? []) : []);

    $brandModel = $product->brand ?? null;
    $brand = is_object($brandModel) ? $brandModel->name : ($specs['brand'] ?? ($product->brand_name ?? 'Smartphone Brand'));
    $brandSlug = is_object($brandModel) ? $brandModel->slug : null;
    $ram = $specs['ram'] ?? '8GB RAM';
    $storage = $specs['storage'] ?? '128GB ROM';
    $battery = $specs['battery'] ?? '5000 mAh';
    $warranty = $specs['warranty'] ?? '1 Year Official Warranty';
    $status = $specs['official_status'] ?? 'Official BTRC Approved';
    $freeGifts = $specs['free_gifts'] ?? $specs['gifts'] ?? null;
    $emiMonthly = ($product->price > 0) ? round(($product->sale_price ?: $product->price) / 12) : 0;

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
        selectedVariantId: '{{ $variants->first()->id ?? '' }}',
        basePrice: {{ $displayPrice }},
        deliveryZone: 'inside_dhaka',
        deliveryFee: 80,
        quantity: 1,
        get totalAmount() {
            return (this.basePrice * this.quantity) + this.deliveryFee;
        },
        updateZone(zone) {
            this.deliveryZone = zone;
            this.deliveryFee = (zone === 'inside_dhaka') ? 80 : 150;
        },
        updateVariant(id, price) {
            this.selectedVariantId = id;
            if (price) this.basePrice = parseFloat(price);
        }
     }">

    @if(session('success'))
        <div class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-3">
            <span class="text-xl">✓</span>
            <span>{{ session('success') }}</span>
        </div>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <!-- Left Column: Gallery, Specs & Highlights (7 cols) -->
        <div class="lg:col-span-7 space-y-8">
            
            <!-- Main Photo Presentation -->
            <div class="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-4">
                <div class="w-full aspect-[4/3] bg-zinc-50 rounded-2xl overflow-hidden relative border border-zinc-100 flex items-center justify-center p-6">
                    @if($firstImage)
                        <img x-show="activeImage" :src="activeImage" src="{{ $firstImage }}" alt="{{ $product->name }}" class="w-full h-full object-contain transition-all duration-300">
                        <div x-show="!activeImage" style="display: none;" class="w-full h-full flex items-center justify-center text-6xl text-blue-300">
                            📱
                        </div>
                    @else
                        <div class="w-full h-full flex items-center justify-center text-6xl text-blue-300">
                            📱
                        </div>
                    @endif

                    <div class="absolute top-4 left-4">
                        <span class="px-3 py-1.5 rounded-lg text-xs font-black bg-blue-600 text-white shadow-sm tracking-wider uppercase flex items-center gap-1.5">
                            <span>🛡️</span>
                            <span>{{ $status }}</span>
                        </span>
                    </div>
                </div>

                @if(count($images) > 1)
                    <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        @foreach($images as $img)
                            @php $imgUrl = asset('storage/' . $img); @endphp
                            <button type="button" 
                                    x-on:click="activeImage = '{{ $imgUrl }}'"
                                    :class="(activeImage === '{{ $imgUrl }}') ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-zinc-200 hover:border-zinc-300'"
                                    class="w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition bg-white p-1 cursor-pointer">
                                <img src="{{ $imgUrl }}" class="w-full h-full object-contain rounded-lg" alt="Thumbnail">
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
                            <span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                            <span class="text-xs font-bold uppercase tracking-wider text-zinc-800">
                                {{ $product->video_title ?? 'স্মার্টফোন আনবক্সিং ও রিভিউ ভিডিও' }}
                            </span>
                        </div>
                        <span class="text-[10px] bg-blue-50 text-blue-600 font-semibold px-2.5 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                            <span>🎥</span>
                            <span>ভিডিও রিভিউ</span>
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

            <!-- Hardware Specifications Table -->
            <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div class="border-b border-zinc-100 pb-4">
                    <h1 class="text-2xl sm:text-3xl font-black text-zinc-950">{{ $product->name }}</h1>
                    <p class="text-sm font-semibold text-blue-600 mt-1 flex items-center gap-2">
                        <span>🏷️ Brand:</span>
                        <a href="{{ route('storefront.home', ['brand' => $brandSlug ?: $brand]) }}" class="font-bold underline hover:text-blue-800 transition">{{ $brand }}</a>
                    </p>
                </div>

                <!-- Specs Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                        <span class="block text-[11px] text-blue-700 font-bold uppercase">Memory (RAM)</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $ram }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                        <span class="block text-[11px] text-blue-700 font-bold uppercase">Storage (ROM)</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $storage }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                        <span class="block text-[11px] text-blue-700 font-bold uppercase">Battery</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $battery }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                        <span class="block text-[11px] text-blue-700 font-bold uppercase">Warranty</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $warranty }}</span>
                    </div>
                </div>

                @if(!empty($product->description))
                    <div class="pt-2 text-xs sm:text-sm text-zinc-700 leading-relaxed prose prose-zinc max-w-none">
                        {!! $product->description !!}
                    </div>
                @endif
            </div>

            <!-- Trust Badges -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="p-4 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-xs">
                    <div class="text-2xl">📱</div>
                    <h4 class="text-xs font-bold text-zinc-900">100% Original IMEI</h4>
                    <p class="text-[11px] text-zinc-500">Official BTRC database registered</p>
                </div>
                <div class="p-4 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-xs">
                    <div class="text-2xl">🔄</div>
                    <h4 class="text-xs font-bold text-zinc-900">7 Days Replacement</h4>
                    <p class="text-[11px] text-zinc-500">Instant replacement for factory defects</p>
                </div>
                <div class="p-4 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-xs">
                    <div class="text-2xl">📦</div>
                    <h4 class="text-xs font-bold text-zinc-900">Open Box Inspection</h4>
                    <p class="text-[11px] text-zinc-500">Inspect parcel before cash payment</p>
                </div>
            </div>

        </div>

        <!-- Right Column: Express Checkout Box (5 cols) -->
        <div class="lg:col-span-5 sticky top-6">
            <div class="bg-white rounded-3xl border-2 border-blue-600/40 p-6 sm:p-8 shadow-xl space-y-6">
                
                <!-- Price Banner with Cash Discount & EMI -->
                <div class="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 sm:p-5 border-2 border-blue-200/90 shadow-xs space-y-2">
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-[11px] font-black text-blue-900 uppercase tracking-wider block">Special Cash Price</span>
                            <div class="flex items-baseline gap-2 mt-0.5">
                                <span class="text-2xl sm:text-3xl font-black text-blue-950" x-text="'{{ $currPrefix }}' + basePrice">
                                    {{ $currPrefix }}{{ number_format($displayPrice) }}
                                </span>
                                @if($discount > 0)
                                    <span class="text-xs text-zinc-400 line-through">{{ $currPrefix }}{{ number_format($regularPrice) }}</span>
                                @endif
                            </div>
                        </div>
                        <span class="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-lg">
                            In Stock
                        </span>
                    </div>

                    @if($emiMonthly > 0)
                        <div class="pt-2 border-t border-blue-100 flex items-center justify-between text-[11px] text-blue-800 font-bold">
                            <span>💳 0% EMI Facility</span>
                            <span>Starts from <strong>{{ $currPrefix }}{{ number_format($emiMonthly) }}</strong>/mo</span>
                        </div>
                    @endif
                </div>

                <!-- Laptop Point BD Inspired: Free Gifts Bundle (If Present) -->
                @if(!empty($freeGifts))
                    <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-400/80 shadow-xs space-y-1">
                        <div class="flex items-center gap-2">
                            <span class="text-base">🎁</span>
                            <span class="text-xs font-black uppercase text-emerald-900">Free Gifts Bundle Included</span>
                        </div>
                        <p class="text-xs font-bold text-zinc-900 leading-snug">
                            {{ $freeGifts }}
                        </p>
                    </div>
                @endif

                <!-- Select Storage / Color Variants -->
                @if($variants->count() > 0)
                    <div class="space-y-2">
                        <label class="block text-xs font-black text-zinc-800 uppercase tracking-wide">
                            Select Storage / Color Variant:
                        </label>
                        <div class="grid grid-cols-2 gap-2">
                            @foreach($variants as $idx => $v)
                                <button type="button" 
                                        x-on:click="updateVariant('{{ $v->id }}', '{{ $v->price ?: $displayPrice }}')"
                                        :class="(selectedVariantId == '{{ $v->id }}') ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20 text-blue-900 font-bold' : 'border-zinc-200 bg-white text-zinc-700'"
                                        class="p-3 rounded-xl border text-left text-xs transition cursor-pointer">
                                    <span class="block font-bold">{{ $v->title }}</span>
                                    <span class="block text-[11px] text-blue-700 mt-0.5">{{ $currPrefix }}{{ number_format($v->price ?: $displayPrice) }}</span>
                                </button>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- Direct Cash on Delivery Form -->
                <form action="{{ route('storefront.order.place') }}" method="POST" class="space-y-4">
                    @csrf
                    <input type="hidden" name="product_id" value="{{ $product->id }}">
                    <input type="hidden" name="product_variant_id" :value="selectedVariantId">
                    <input type="hidden" name="payment_method" value="cod">

                    <!-- Quantity Control -->
                    <div class="flex items-center justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                        <span class="text-xs font-bold text-zinc-800">Quantity:</span>
                        <div class="flex items-center gap-2">
                            <button type="button" x-on:click="if (quantity > 1) quantity--" class="w-8 h-8 rounded-lg bg-white border border-zinc-300 font-black text-zinc-800 hover:bg-zinc-100 flex items-center justify-center">-</button>
                            <input type="number" name="quantity" x-model="quantity" min="1" max="10" class="w-12 text-center text-xs font-black border-none bg-transparent">
                            <button type="button" x-on:click="if (quantity < 10) quantity++" class="w-8 h-8 rounded-lg bg-white border border-zinc-300 font-black text-zinc-800 hover:bg-zinc-100 flex items-center justify-center">+</button>
                        </div>
                    </div>

                    <!-- Customer Full Name -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Your Full Name <span class="text-rose-500">*</span></label>
                        <input type="text" name="customer_name" required placeholder="e.g. Tanvir Ahmed" 
                               value="{{ old('customer_name') }}"
                               class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs text-zinc-900">
                        @error('customer_name')
                            <p class="text-rose-600 text-[11px] mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Customer Mobile Phone -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Mobile Phone (11 Digits) <span class="text-rose-500">*</span></label>
                        <input type="tel" name="customer_phone" required placeholder="017XXXXXXXX" 
                               value="{{ old('customer_phone') }}"
                               class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs text-zinc-900">
                        @error('customer_phone')
                            <p class="text-rose-600 text-[11px] mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Delivery Zone Selection -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Delivery City / Zone <span class="text-rose-500">*</span></label>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 cursor-pointer"
                                   :class="deliveryZone === 'inside_dhaka' ? 'border-blue-600 bg-blue-50/50' : 'bg-white'">
                                <input type="radio" name="district" value="Dhaka" checked x-on:change="updateZone('inside_dhaka')" class="text-blue-600 focus:ring-blue-600">
                                <span class="text-xs font-semibold text-zinc-800">Inside Dhaka (৳80)</span>
                            </label>
                            <label class="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 cursor-pointer"
                                   :class="deliveryZone === 'outside_dhaka' ? 'border-blue-600 bg-blue-50/50' : 'bg-white'">
                                <input type="radio" name="district" value="Outside Dhaka" x-on:change="updateZone('outside_dhaka')" class="text-blue-600 focus:ring-blue-600">
                                <span class="text-xs font-semibold text-zinc-800">Outside (৳150)</span>
                            </label>
                        </div>
                    </div>

                    <!-- Shipping Address -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Full Delivery Address <span class="text-rose-500">*</span></label>
                        <textarea name="shipping_address" required rows="2" placeholder="House no, Road no, Area, City" 
                                  class="w-full px-3.5 py-2 rounded-xl border border-zinc-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs text-zinc-900">{{ old('shipping_address') }}</textarea>
                        @error('shipping_address')
                            <p class="text-rose-600 text-[11px] mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Order Note -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Color Preference / Delivery Note (Optional)</label>
                        <input type="text" name="customer_note" placeholder="e.g. Space Black color preferred, call before delivery" 
                               value="{{ old('customer_note') }}"
                               class="w-full px-3.5 py-2 rounded-xl border border-zinc-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs text-zinc-900">
                    </div>

                    <!-- Price Summary Box -->
                    <div class="bg-zinc-50 rounded-xl p-3 space-y-1.5 text-xs text-zinc-600 border border-zinc-200">
                        <div class="flex justify-between">
                            <span>Device Price:</span>
                            <span class="font-bold text-zinc-900" x-text="'{{ $currPrefix }}' + (basePrice * quantity)"></span>
                        </div>
                        <div class="flex justify-between">
                            <span>Delivery Fee:</span>
                            <span class="font-bold text-zinc-900" x-text="'{{ $currPrefix }}' + deliveryFee"></span>
                        </div>
                        <div class="flex justify-between border-t border-zinc-200 pt-1.5 font-black text-sm text-zinc-950">
                            <span>Total Payable (COD):</span>
                            <span class="text-blue-700" x-text="'{{ $currPrefix }}' + totalAmount"></span>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" 
                            class="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span>Confirm Order (Cash on Delivery)</span>
                    </button>

                    <p class="text-[11px] text-center text-zinc-400">
                        🔒 Safe & Secure. Inspect IMEI & seals upon delivery before payment.
                    </p>
                </form>

            </div>
        </div>

    </div>

</div>
@endsection
