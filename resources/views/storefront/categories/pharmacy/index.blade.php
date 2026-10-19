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

    $heroBadge = $branding['hero_badge'] ?? '💊 100% DGDA Approved & Licensed Pharmacy';
    $heroTitle = $branding['hero_title'] ?? '100% Genuine Medicines & Healthcare Essentials Delivered';
    $heroSubtitle = $branding['hero_subtitle'] ?? 'Order prescription medicines, baby care, surgical items, and healthcare essentials. Delivered in 2 hours with certified pharmacist support.';
    $heroBtnText = $branding['hero_btn_text'] ?? 'Browse Medicines';
    $heroBtnUrl = $branding['hero_btn_url'] ?? '#products';

    $perk1Title = $branding['perk_1_title'] ?? '100% Genuine Medicines';
    $perk1Desc = $branding['perk_1_desc'] ?? 'Sourced directly from Square, Beximco, Incepta & top manufacturers.';
    $perk2Title = $branding['perk_2_title'] ?? '2-Hour Emergency Delivery';
    $perk2Desc = $branding['perk_2_desc'] ?? 'Fast temperature-controlled delivery across the city.';
    $perk3Title = $branding['perk_3_title'] ?? 'DGDA Approved (DAR)';
    $perk3Desc = $branding['perk_3_desc'] ?? 'All products strictly comply with Directorate General of Drug Administration.';
    $perk4Title = $branding['perk_4_title'] ?? 'Prescription Verification';
    $perk4Desc = $branding['perk_4_desc'] ?? 'Certified pharmacists review each prescription before dispatch.';

    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
    $waDigits = preg_replace('/[^0-9]/', '', $whatsapp);
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">

    <!-- 1. Pharmacy Trust & Clinical Hero Showcase -->
    <div class="relative bg-gradient-to-br from-emerald-950 via-teal-950 to-zinc-950 border border-emerald-900/40 rounded-3xl p-6 sm:p-10 lg:p-12 text-white overflow-hidden shadow-2xl">
        <!-- Ambient Glow -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <!-- Left Text Content -->
            <div class="lg:col-span-7 space-y-5">
                <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 tracking-wide uppercase">
                    {{ $heroBadge }}
                </span>

                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
                    {{ $heroTitle }}
                </h1>

                <p class="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                    {{ $heroSubtitle }}
                </p>

                <!-- Value Props Checks -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-zinc-300 font-semibold">
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
                        <span>100% Authentic Pharma</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
                        <span>Cold-chain Safe Delivery</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
                        <span>Licensed Pharmacist Advice</span>
                    </div>
                </div>

                <!-- Call to Action Buttons -->
                <div class="flex flex-wrap items-center gap-3 pt-3">
                    <a href="{{ $heroBtnUrl }}" class="px-6 py-3.5 bg-theme-primary text-white font-black rounded-xl text-sm transition shadow-lg hover:opacity-90 hover:scale-[1.02] flex items-center gap-2">
                        <span>{{ $heroBtnText }}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    </a>
                    <a href="https://wa.me/88{{ $waDigits }}?text={{ urlencode('Hello Pharmacist, I want to send my prescription for medicine ordering.') }}" target="_blank" class="px-5 py-3.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl text-sm transition flex items-center gap-2">
                        <svg class="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        <span>Send Prescription Photo</span>
                    </a>
                </div>
            </div>

            <!-- Right Showcase Visual with Trust Card -->
            <div class="lg:col-span-5 relative flex items-center justify-center">
                <div class="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/30 group">
                    <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80" 
                         alt="Pharmacy Showcase" 
                         class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                        <p class="text-xs font-semibold text-emerald-300">💊 Directorate General of Drug Administration (DGDA)</p>
                        <p class="text-sm font-bold">100% Genuine Medicines Stored in Controlled Environment</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Value Propositions Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
                💊
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk1Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk1Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
                ⚡
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk2Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk2Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
                🛡️
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk3Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk3Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">
                🩺
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk4Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk4Desc }}</p>
            </div>
        </div>
    </div>

    <!-- 3. Prescription Upload Quick Helper Banner -->
    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl flex-shrink-0">
                📄
            </div>
            <div>
                <h3 class="text-sm font-black text-emerald-950">Have a Doctor's Prescription?</h3>
                <p class="text-xs text-emerald-800 mt-0.5">Don't know the exact medicine or dosage? Just take a clear photo of your prescription and WhatsApp our licensed pharmacist.</p>
            </div>
        </div>
        <a href="https://wa.me/88{{ $waDigits }}?text={{ urlencode('Hello Pharmacist, here is my prescription photo. Please prepare my order.') }}" target="_blank" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-sm flex items-center gap-2">
            <span>Send on WhatsApp</span>
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        </a>
    </div>

    <!-- 4. Category Filter Tabs -->
    @if($categories->count() > 0)
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <a href="{{ route('storefront.home') }}" 
               class="px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap {{ !request('category') ? 'bg-theme-primary text-white shadow-xs' : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200' }}">
                All Healthcare & Medicines
            </a>
            @foreach($categories as $cat)
                <a href="{{ route('storefront.home', ['category' => $cat->slug]) }}" 
                   class="px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap {{ request('category') === $cat->slug ? 'bg-theme-primary text-white shadow-xs' : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200' }}">
                    {{ $cat->name }}
                </a>
            @endforeach
        </div>
    @endif

    <!-- 5. Medicine & Product Grid -->
    <div id="products" class="space-y-6">
        <div class="flex items-center justify-between border-b border-zinc-200/80 pb-4">
            <div>
                <h2 class="text-xl font-black text-zinc-900 tracking-tight">Essential Medicines & Products</h2>
                <p class="text-xs text-zinc-500 mt-0.5">Authentic healthcare products with direct batch warranty</p>
            </div>
            <span class="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-lg">
                {{ $products->total() }} Products Listed
            </span>
        </div>

        @if($products->count() > 0)
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                @foreach($products as $prod)
                    @php
                        $rawImages = $prod->images;
                        $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
                        $firstImage = !empty($images) ? asset('storage/' . $images[0]) : null;

                        $rawSpecs = $prod->item_attributes ?? $prod->specs;
                        $specs = is_array($rawSpecs) ? $rawSpecs : (is_string($rawSpecs) ? (json_decode($rawSpecs, true) ?? []) : []);

                        $genericName = $specs['generic_name'] ?? null;
                        $dosageForm = $specs['dosage_form'] ?? 'Medicine';
                        $strength = $specs['strength'] ?? null;
                        $manufacturer = $specs['manufacturer'] ?? null;
                        $requiresRx = !empty($specs['requires_prescription']);
                        $darNumber = $specs['dar_number'] ?? null;

                        $displayPrice = $prod->sale_price ?: $prod->price;
                        $regularPrice = $prod->price;
                        $hasDiscount = ($prod->sale_price && $prod->sale_price < $prod->price);
                    @endphp

                    <div class="bg-white rounded-2xl border border-zinc-200 hover:border-emerald-500/50 shadow-xs hover:shadow-md transition duration-300 flex flex-col overflow-hidden group">
                        
                        <!-- Top Image & Prescription Badge -->
                        <div class="relative w-full aspect-square bg-zinc-50 overflow-hidden flex items-center justify-center p-4">
                            @if($firstImage)
                                <img src="{{ $firstImage }}" alt="{{ $prod->name }}" class="w-full h-full object-contain group-hover:scale-105 transition duration-500">
                            @else
                                <div class="w-full h-full flex items-center justify-center text-4xl text-emerald-300">
                                    💊
                                </div>
                            @endif

                            <!-- Prescription Pill / OTC Pill -->
                            <div class="absolute top-3 left-3 flex flex-col gap-1">
                                @if($requiresRx)
                                    <span class="px-2.5 py-1 rounded-md text-[10px] font-black bg-rose-500 text-white shadow-xs tracking-wider uppercase">
                                        Rx Required
                                    </span>
                                @else
                                    <span class="px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-600 text-white shadow-xs tracking-wider uppercase">
                                        OTC Medicine
                                    </span>
                                @endif

                                @if($strength)
                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-900/80 text-white backdrop-blur-xs">
                                        {{ $strength }}
                                    </span>
                                @endif
                            </div>

                            @if($hasDiscount)
                                <div class="absolute top-3 right-3 bg-amber-500 text-white font-black text-[10px] px-2 py-0.5 rounded-md uppercase">
                                    SAVE {{ $currPrefix }}{{ number_format($regularPrice - $displayPrice) }}
                                </div>
                            @endif
                        </div>

                        <!-- Card Body -->
                        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div class="space-y-1.5">
                                <div class="flex items-center justify-between text-[11px] text-zinc-500">
                                    <span class="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{{ $dosageForm }}</span>
                                    @if($manufacturer)
                                        <span class="truncate max-w-[120px] font-medium">{{ $manufacturer }}</span>
                                    @endif
                                </div>

                                <a href="{{ route('storefront.product', $prod->slug) }}" class="block text-sm font-bold text-zinc-900 hover:text-emerald-600 transition line-clamp-2">
                                    {{ $prod->name }}
                                </a>

                                @if($genericName)
                                    <p class="text-xs text-zinc-500 line-clamp-1 italic">
                                        <span class="font-semibold text-zinc-700">Generic:</span> {{ $genericName }}
                                    </p>
                                @endif
                            </div>

                            <!-- Pricing & Action -->
                            <div class="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                                <div>
                                    <div class="flex items-baseline gap-1.5">
                                        <span class="text-base font-black text-zinc-950">{{ $currPrefix }}{{ number_format($displayPrice) }}</span>
                                        @if($hasDiscount)
                                            <span class="text-xs text-zinc-400 line-through">{{ $currPrefix }}{{ number_format($regularPrice) }}</span>
                                        @endif
                                    </div>
                                    <span class="text-[10px] text-zinc-400 block">MRP / Unit</span>
                                </div>

                                <a href="{{ route('storefront.product', $prod->slug) }}" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                                    <span>Order</span>
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </a>
                            </div>
                        </div>

                    </div>
                @endforeach
            </div>

            <div class="pt-6">
                {{ $products->links() }}
            </div>
        @else
            <div class="bg-white rounded-3xl border border-zinc-200 p-12 text-center space-y-4">
                <div class="text-5xl">💊</div>
                <h3 class="text-lg font-bold text-zinc-900">No medicines found</h3>
                <p class="text-xs text-zinc-500 max-w-md mx-auto">There are currently no active products in this category. Contact our hotline or send your prescription via WhatsApp for manual preparation.</p>
                <a href="https://wa.me/88{{ $waDigits }}" target="_blank" class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                    WhatsApp Pharmacist
                </a>
            </div>
        @endif
    </div>

</div>
@endsection
