@extends('layouts.storefront')

@section('content')
@php
    $category = tenant('business_category') ?? 'pharmacy';
    $categoryDefaults = config("business_presets.category_defaults.{$category}") 
        ?? config("business_presets.category_defaults.pharmacy", []);

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

    $genericName = $specs['generic_name'] ?? 'Generic Pharmaceutical Compound';
    $dosageForm = $specs['dosage_form'] ?? 'Tablet / Medicine';
    $strength = $specs['strength'] ?? 'Standard Strength';
    $manufacturer = $specs['manufacturer'] ?? 'Verified Pharmaceutical Manufacturer';
    $requiresRx = !empty($specs['requires_prescription']);
    $darNumber = $specs['dar_number'] ?? 'DAR-BD-VERIFIED';

    // Shajgoj & Healthcare Benchmark Features
    $authenticityBadge = !empty($specs['authenticity_badge']) || !isset($specs['authenticity_badge']);
    $skinConcern = $specs['skin_concern'] ?? $specs['target_concern'] ?? null;
    $skinType = $specs['skin_type'] ?? null;
    $keyIngredients = $specs['key_ingredients'] ?? null;
    $howToUse = $specs['how_to_use'] ?? null;
    $countryOfOrigin = $specs['country_of_origin'] ?? 'Official DGDA Registered';

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
        deliveryFee: 60,
        quantity: 1,
        get totalAmount() {
            return (this.basePrice * this.quantity) + this.deliveryFee;
        },
        updateZone(zone) {
            this.deliveryZone = zone;
            this.deliveryFee = (zone === 'inside_dhaka') ? 60 : 120;
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
        
        <!-- Left Column: Gallery, Specs & Clinical Safety (7 cols) -->
        <div class="lg:col-span-7 space-y-8">
            
            <!-- Main Photo Presentation -->
            <div class="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-4">
                <div class="w-full aspect-[4/3] bg-zinc-50 rounded-2xl overflow-hidden relative border border-zinc-100 flex items-center justify-center p-6">
                    @if($firstImage)
                        <img x-show="activeImage" :src="activeImage" src="{{ $firstImage }}" alt="{{ $product->name }}" class="w-full h-full object-contain transition-all duration-300">
                        <div x-show="!activeImage" style="display: none;" class="w-full h-full flex items-center justify-center text-6xl text-emerald-300">
                            💊
                        </div>
                    @else
                        <div class="w-full h-full flex items-center justify-center text-6xl text-emerald-300">
                            💊
                        </div>
                    @endif

                    <!-- Rx Tag on Image -->
                    <div class="absolute top-4 left-4">
                        @if($requiresRx)
                            <span class="px-3 py-1.5 rounded-lg text-xs font-black bg-rose-600 text-white shadow-sm tracking-wider uppercase flex items-center gap-1.5">
                                <span>⚠️</span>
                                <span>Prescription Required</span>
                            </span>
                        @else
                            <span class="px-3 py-1.5 rounded-lg text-xs font-black bg-emerald-600 text-white shadow-sm tracking-wider uppercase flex items-center gap-1.5">
                                <span>✓</span>
                                <span>OTC Product (No Rx Required)</span>
                            </span>
                        @endif
                    </div>
                </div>

                @if(count($images) > 1)
                    <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        @foreach($images as $img)
                            @php $imgUrl = asset('storage/' . $img); @endphp
                            <button type="button" 
                                    x-on:click="activeImage = '{{ $imgUrl }}'"
                                    :class="(activeImage === '{{ $imgUrl }}') ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-zinc-200 hover:border-zinc-300'"
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
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            <span class="text-xs font-bold uppercase tracking-wider text-zinc-800">
                                {{ $product->video_title ?? 'ওষুধ / হেলথকেয়ার পণ্য সংক্রান্ত ভিডিও ও নির্দেশিকা' }}
                            </span>
                        </div>
                        <span class="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                            <span>🎥</span>
                            <span>ভিডিও নির্দেশিকা</span>
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

            <!-- Clinical & Pharmaceutical Specs Table -->
            <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div class="border-b border-zinc-100 pb-4 space-y-2">
                    <div class="flex flex-wrap items-center gap-2">
                        @if($authenticityBadge)
                            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <span>🛡️</span>
                                <span>100% Authentic Guaranteed (DGDA Verified)</span>
                            </span>
                        @endif
                        @if(!empty($countryOfOrigin))
                            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                                <span>🌍</span>
                                <span>{{ $countryOfOrigin }}</span>
                            </span>
                        @endif
                    </div>

                    <h1 class="text-2xl sm:text-3xl font-black text-zinc-950">{{ $product->name }}</h1>

                    <div class="flex flex-wrap items-center gap-3 pt-1">
                        <p class="text-xs sm:text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
                            <span>🧪 Generic Formulation:</span>
                            <span class="italic underline font-black">{{ $genericName }}</span>
                        </p>
                        @if(!empty($skinConcern))
                            <span class="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                                Target Concern: {{ $skinConcern }}
                            </span>
                        @endif
                        @if(!empty($skinType))
                            <span class="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                                Type: {{ $skinType }}
                            </span>
                        @endif
                    </div>
                </div>

                <!-- Specs Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <span class="block text-[11px] text-emerald-800 font-bold uppercase">Dosage Form</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $dosageForm }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <span class="block text-[11px] text-emerald-800 font-bold uppercase">Strength</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $strength }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <span class="block text-[11px] text-emerald-800 font-bold uppercase">Manufacturer</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1 truncate">{{ $manufacturer }}</span>
                    </div>
                    <div class="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                        <span class="block text-[11px] text-emerald-800 font-bold uppercase">DGDA Registration</span>
                        <span class="block text-xs font-black text-zinc-900 mt-1">{{ $darNumber }}</span>
                    </div>
                </div>

                <!-- Shajgoj Inspired: Key Active Ingredients (If Present) -->
                @if(!empty($keyIngredients))
                    <div class="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-2">
                        <span class="text-xs font-black uppercase tracking-wider text-teal-950 flex items-center gap-1.5">
                            <span>🌿</span>
                            <span>Key Active Ingredients & Formulation</span>
                        </span>
                        <p class="text-xs text-teal-900 font-semibold leading-relaxed">
                            {{ $keyIngredients }}
                        </p>
                    </div>
                @endif

                <!-- Shajgoj Inspired: How To Use / Routine Instructions (If Present) -->
                @if(!empty($howToUse))
                    <div class="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
                        <span class="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                            <span>📋</span>
                            <span>How to Use / ব্যবহার বিধি ও নির্দেশিকা</span>
                        </span>
                        <p class="text-xs text-blue-900 leading-relaxed font-medium">
                            {{ $howToUse }}
                        </p>
                    </div>
                @endif

                @if(!empty($product->description))
                    <div class="pt-2 text-xs sm:text-sm text-zinc-700 leading-relaxed prose prose-zinc max-w-none">
                        {!! $product->description !!}
                    </div>
                @endif

                <!-- Medicine Safety & Storage Guidelines Alert -->
                <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                    <div class="font-bold flex items-center gap-2 text-amber-900">
                        <span>🛡️ Medicine Storage & Safety Guidelines</span>
                    </div>
                    <p class="text-amber-800 leading-relaxed">
                        Store in a cool, dry place below 30°C. Protect from direct heat, sunlight and moisture. Keep all medicines strictly out of reach of children. Use only as directed by a registered medical practitioner.
                    </p>
                </div>
            </div>

            <!-- Pharmacy Trust Guarantees -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="p-4 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-xs">
                    <div class="text-2xl">💊</div>
                    <h4 class="text-xs font-bold text-zinc-900">100% Genuine Medicine</h4>
                    <p class="text-[11px] text-zinc-500">Directly procured from licensed pharma houses</p>
                </div>
                <div class="p-4 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-xs">
                    <div class="text-2xl">⚡</div>
                    <h4 class="text-xs font-bold text-zinc-900">2-Hour Express Delivery</h4>
                    <p class="text-[11px] text-zinc-500">Fast temperature-controlled dispatch</p>
                </div>
                <div class="p-4 rounded-2xl bg-white border border-zinc-200 text-center space-y-1 shadow-xs">
                    <div class="text-2xl">🩺</div>
                    <h4 class="text-xs font-bold text-zinc-900">Pharmacist Supervision</h4>
                    <p class="text-[11px] text-zinc-500">Prescription verified before delivery</p>
                </div>
            </div>

        </div>

        <!-- Right Column: Express Checkout Box (5 cols) -->
        <div class="lg:col-span-5 sticky top-6">
            <div class="bg-white rounded-3xl border-2 border-emerald-600/40 p-6 sm:p-8 shadow-xl space-y-6">
                
                <!-- Price Banner -->
                <div class="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between">
                    <div>
                        <span class="text-xs font-bold text-emerald-800 uppercase block">Maximum Retail Price</span>
                        <div class="flex items-baseline gap-2 mt-0.5">
                            <span class="text-2xl sm:text-3xl font-black text-emerald-950" x-text="'{{ $currPrefix }}' + basePrice">
                                {{ $currPrefix }}{{ number_format($displayPrice) }}
                            </span>
                            @if($discount > 0)
                                <span class="text-xs text-zinc-400 line-through">{{ $currPrefix }}{{ number_format($regularPrice) }}</span>
                            @endif
                        </div>
                    </div>
                    <span class="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-lg">
                        In Stock
                    </span>
                </div>

                <!-- Select Pack Size / Strip (if variants exist) -->
                @if($variants->count() > 0)
                    <div class="space-y-2">
                        <label class="block text-xs font-black text-zinc-800 uppercase tracking-wide">
                            Select Packaging / Strip Option:
                        </label>
                        <div class="grid grid-cols-2 gap-2">
                            @foreach($variants as $idx => $v)
                                <button type="button" 
                                        x-on:click="updateVariant('{{ $v->id }}', '{{ $v->price ?: $displayPrice }}')"
                                        :class="(selectedVariantId == '{{ $v->id }}') ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 text-emerald-900 font-bold' : 'border-zinc-200 bg-white text-zinc-700'"
                                        class="p-3 rounded-xl border text-left text-xs transition cursor-pointer">
                                    <span class="block font-bold">{{ $v->title }}</span>
                                    <span class="block text-[11px] text-emerald-700 mt-0.5">{{ $currPrefix }}{{ number_format($v->price ?: $displayPrice) }}</span>
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
                        <span class="text-xs font-bold text-zinc-800">Quantity (Strips / Boxes):</span>
                        <div class="flex items-center gap-2">
                            <button type="button" x-on:click="if (quantity > 1) quantity--" class="w-8 h-8 rounded-lg bg-white border border-zinc-300 font-black text-zinc-800 hover:bg-zinc-100 flex items-center justify-center">-</button>
                            <input type="number" name="quantity" x-model="quantity" min="1" max="50" class="w-12 text-center text-xs font-black border-none bg-transparent">
                            <button type="button" x-on:click="if (quantity < 50) quantity++" class="w-8 h-8 rounded-lg bg-white border border-zinc-300 font-black text-zinc-800 hover:bg-zinc-100 flex items-center justify-center">+</button>
                        </div>
                    </div>

                    <!-- Customer Full Name -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Patient / Customer Name <span class="text-rose-500">*</span></label>
                        <input type="text" name="customer_name" required placeholder="e.g. Mohammad Rahim" 
                               value="{{ old('customer_name') }}"
                               class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs text-zinc-900">
                        @error('customer_name')
                            <p class="text-rose-600 text-[11px] mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Customer Mobile Phone -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Mobile Phone (11 Digits) <span class="text-rose-500">*</span></label>
                        <input type="tel" name="customer_phone" required placeholder="017XXXXXXXX" 
                               value="{{ old('customer_phone') }}"
                               class="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs text-zinc-900">
                        @error('customer_phone')
                            <p class="text-rose-600 text-[11px] mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Delivery Zone Selection -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Delivery City / Zone <span class="text-rose-500">*</span></label>
                        <div class="grid grid-cols-2 gap-2">
                            <label class="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 cursor-pointer"
                                   :class="deliveryZone === 'inside_dhaka' ? 'border-emerald-600 bg-emerald-50/50' : 'bg-white'">
                                <input type="radio" name="district" value="Dhaka" checked x-on:change="updateZone('inside_dhaka')" class="text-emerald-600 focus:ring-emerald-600">
                                <span class="text-xs font-semibold text-zinc-800">Inside Dhaka (৳60)</span>
                            </label>
                            <label class="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 cursor-pointer"
                                   :class="deliveryZone === 'outside_dhaka' ? 'border-emerald-600 bg-emerald-50/50' : 'bg-white'">
                                <input type="radio" name="district" value="Outside Dhaka" x-on:change="updateZone('outside_dhaka')" class="text-emerald-600 focus:ring-emerald-600">
                                <span class="text-xs font-semibold text-zinc-800">Outside (৳120)</span>
                            </label>
                        </div>
                    </div>

                    <!-- Shipping Address -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Full Delivery Address <span class="text-rose-500">*</span></label>
                        <textarea name="shipping_address" required rows="2" placeholder="House no, Road no, Area, City" 
                                  class="w-full px-3.5 py-2 rounded-xl border border-zinc-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs text-zinc-900">{{ old('shipping_address') }}</textarea>
                        @error('shipping_address')
                            <p class="text-rose-600 text-[11px] mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Order Note / Prescription Note -->
                    <div>
                        <label class="block text-xs font-bold text-zinc-800 mb-1">Prescription Note / Special Instructions (Optional)</label>
                        <input type="text" name="customer_note" placeholder="e.g. Doctor's name, or 'Will show prescription upon delivery'" 
                               value="{{ old('customer_note') }}"
                               class="w-full px-3.5 py-2 rounded-xl border border-zinc-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-xs text-zinc-900">
                    </div>

                    <!-- Price Summary Box -->
                    <div class="bg-zinc-50 rounded-xl p-3 space-y-1.5 text-xs text-zinc-600 border border-zinc-200">
                        <div class="flex justify-between">
                            <span>Subtotal:</span>
                            <span class="font-bold text-zinc-900" x-text="'{{ $currPrefix }}' + (basePrice * quantity)"></span>
                        </div>
                        <div class="flex justify-between">
                            <span>Delivery Fee:</span>
                            <span class="font-bold text-zinc-900" x-text="'{{ $currPrefix }}' + deliveryFee"></span>
                        </div>
                        <div class="flex justify-between border-t border-zinc-200 pt-1.5 font-black text-sm text-zinc-950">
                            <span>Total Payable (COD):</span>
                            <span class="text-emerald-700" x-text="'{{ $currPrefix }}' + totalAmount"></span>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" 
                            class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span>Confirm Medicine Order (Cash on Delivery)</span>
                    </button>

                    <p class="text-[11px] text-center text-zinc-400">
                        🔒 Safe & Secure. Inspect genuine packaging upon delivery before payment.
                    </p>
                </form>

            </div>
        </div>

    </div>

</div>
@endsection
