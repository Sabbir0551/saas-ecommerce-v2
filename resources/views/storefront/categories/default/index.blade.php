@extends('layouts.storefront')

@section('content')
@php
    $category = tenant('business_category') ?? 'default';
    $categoryDefaults = config("business_presets.category_defaults.{$category}") 
        ?? config("business_presets.category_defaults.default", []);

    $creds = tenant('gateway_credentials') ?? [];
    $tenantBranding = tenant('branding') ?? $creds['branding'] ?? [];
    $branding = array_merge($categoryDefaults, array_filter((array)$tenantBranding, fn($v) => !is_null($v) && $v !== ''));

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    $heroBadge = $branding['hero_badge'] ?? '✨ Premium Online Store';
    $heroTitle = $branding['hero_title'] ?? 'Discover Quality Products Crafted for Your Daily Needs';
    $heroSubtitle = $branding['hero_subtitle'] ?? 'Shop our curated collection with 100% authenticity guarantee, fast nationwide shipping, and dedicated customer support.';
    $heroBtnText = $branding['hero_btn_text'] ?? 'Explore Catalog';
    $heroBtnUrl = $branding['hero_btn_url'] ?? '#products';

    $perk1Title = $branding['perk_1_title'] ?? 'Nationwide Fast COD';
    $perk1Desc = $branding['perk_1_desc'] ?? 'Delivery within 24-48 hours across Bangladesh.';
    $perk2Title = $branding['perk_2_title'] ?? 'Cash on Delivery';
    $perk2Desc = $branding['perk_2_desc'] ?? 'Inspect your parcel before completing payment.';
    $perk3Title = $branding['perk_3_title'] ?? '100% Authentic Quality';
    $perk3Desc = $branding['perk_3_desc'] ?? 'Verified genuine products with quality promise.';
    $perk4Title = $branding['perk_4_title'] ?? 'Dedicated Support';
    $perk4Desc = $branding['perk_4_desc'] ?? 'Direct helpline and instant WhatsApp support.';

    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">

    <!-- 1. Universal Clean Hero Showcase -->
    <div class="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 lg:p-12 text-white overflow-hidden shadow-2xl">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-5">
                <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 text-indigo-300 border border-white/20 uppercase tracking-wide">
                    {{ $heroBadge }}
                </span>

                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
                    {{ $heroTitle }}
                </h1>

                <p class="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                    {{ $heroSubtitle }}
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-zinc-300 font-semibold">
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
                        <span>100% Genuine</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
                        <span>Cash on Delivery</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">✓</span>
                        <span>Fast Shipping</span>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-3 pt-3">
                    <a href="{{ $heroBtnUrl }}" class="px-6 py-3.5 bg-theme-primary text-white font-black rounded-xl text-sm transition shadow-lg hover:opacity-90 flex items-center gap-2">
                        <span>{{ $heroBtnText }}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    </a>
                    <a href="tel:{{ $hotline }}" class="px-5 py-3.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl text-sm transition flex items-center gap-2">
                        <svg class="w-4 h-4 text-theme-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <span>Call Support</span>
                    </a>
                </div>
            </div>

            <div class="lg:col-span-5 relative flex items-center justify-center">
                <div class="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-zinc-700 group">
                    <img src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80" 
                         alt="Store Showcase" 
                         class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Value Perks Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center text-xl flex-shrink-0">
                📦
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk1Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk1Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center text-xl flex-shrink-0">
                💵
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk2Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk2Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center text-xl flex-shrink-0">
                🛡️
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk3Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk3Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center text-xl flex-shrink-0">
                💬
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk4Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk4Desc }}</p>
            </div>
        </div>
    </div>

    <!-- 3. Category Filter -->
    @if($categories->count() > 0)
        <div class="space-y-4">
            <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                <a href="{{ route('storefront.home') }}" 
                   class="px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0 {{ !request('category') ? 'bg-zinc-950 text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50' }}">
                    All Items
                </a>
                @foreach($categories as $cat)
                    <a href="{{ route('storefront.home', ['category' => $cat->slug]) }}" 
                       class="px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0 {{ request('category') === $cat->slug ? 'bg-theme-primary text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50' }}">
                        {{ $cat->name }}
                    </a>
                @endforeach
            </div>
        </div>
    @endif

    <!-- 4. Products Catalog -->
    <div id="products" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
            <div>
                <h2 class="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                    {{ request('search') ? 'Search: "' . request('search') . '"' : 'Featured Products' }}
                </h2>
                <p class="text-xs text-zinc-500 mt-1">
                    Showing {{ $products->total() }} verified products
                </p>
            </div>
        </div>

        @if($products->isEmpty())
            <div class="text-center py-16 bg-white rounded-3xl border border-dashed border-zinc-300 p-8">
                <h3 class="text-base font-bold text-zinc-900">No Products Found</h3>
                <a href="{{ route('storefront.home') }}" class="mt-4 inline-block px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl transition hover:bg-zinc-800">
                    View All Products
                </a>
            </div>
        @else
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                @foreach($products as $product)
                    @php
                        $rawImages = $product->images;
                        $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
                        $mainImage = !empty($images) ? asset('storage/' . $images[0]) : null;
                        $displayPrice = $product->sale_price ?: $product->price;
                        $regularPrice = $product->price;
                        $hasDiscount = ($product->sale_price && $product->sale_price < $product->price);
                    @endphp

                    <div class="group bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div class="relative w-full aspect-square bg-zinc-100 overflow-hidden flex items-center justify-center">
                                @if($mainImage)
                                    <img src="{{ $mainImage }}" alt="{{ $product->name }}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                @else
                                    <span class="text-4xl text-zinc-300">🛍️</span>
                                @endif

                                @if($hasDiscount)
                                    <span class="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        Sale
                                    </span>
                                @endif
                            </div>

                            <div class="p-4 space-y-2">
                                <span class="text-[11px] text-zinc-400 font-medium block">
                                    {{ $product->category->name ?? 'General' }}
                                </span>

                                <h3 class="text-sm font-bold text-zinc-950 line-clamp-2 leading-snug group-hover:text-theme-primary transition">
                                    <a href="{{ route('storefront.product', $product->slug) }}">
                                        {{ $product->name }}
                                    </a>
                                </h3>
                            </div>
                        </div>

                        <div class="p-4 pt-0 border-t border-zinc-100 mt-2">
                            <div class="flex items-baseline gap-2 pt-2 mb-3">
                                <span class="text-base font-black text-zinc-950">
                                    {{ $currPrefix }}{{ number_format($displayPrice) }}
                                </span>
                                @if($hasDiscount)
                                    <span class="text-xs text-zinc-400 line-through">
                                        {{ $currPrefix }}{{ number_format($regularPrice) }}
                                    </span>
                                @endif
                            </div>

                            <a href="{{ route('storefront.product', $product->slug) }}" 
                               class="w-full py-2.5 px-3 bg-zinc-950 hover:bg-theme-primary text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-xs group-hover:bg-theme-primary">
                                <span>Order Now (COD)</span>
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="pt-8">
                {{ $products->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
