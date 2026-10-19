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

    $heroBadge = $branding['hero_badge'] ?? '✨ New Season Arrivals';
    $heroTitle = $branding['hero_title'] ?? 'Curated Collections Designed for Elegance & Everyday Comfort';
    $heroSubtitle = $branding['hero_subtitle'] ?? 'Explore premium hand-picked fabrics, chic silhouettes, and timeless clothing made with pure cotton, silk and georgette.';
    $heroBtnText = $branding['hero_btn_text'] ?? 'Explore Collection';
    $heroBtnUrl = $branding['hero_btn_url'] ?? '#products';

    $perk1Title = $branding['perk_1_title'] ?? '100% Quality Fabric';
    $perk1Desc = $branding['perk_1_desc'] ?? 'Finest pure cotton, silk and georgette with durable stitching.';
    $perk2Title = $branding['perk_2_title'] ?? '7 Days Easy Exchange';
    $perk2Desc = $branding['perk_2_desc'] ?? 'Hassle-free size and product exchange at your doorstep.';
    $perk3Title = $branding['perk_3_title'] ?? 'Nationwide Fast COD';
    $perk3Desc = $branding['perk_3_desc'] ?? 'Delivered in 24 hours in Dhaka and 48 hours across Bangladesh.';
    $perk4Title = $branding['perk_4_title'] ?? '100% Authentic Quality';
    $perk4Desc = $branding['perk_4_desc'] ?? 'Direct from verified fashion designers and craftsmen.';

    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
    $waDigits = preg_replace('/[^0-9]/', '', $whatsapp);
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">

    <!-- 1. Elegant Fashion Hero Showcase -->
    <div class="relative bg-gradient-to-br from-rose-950 via-zinc-900 to-zinc-950 border border-rose-900/40 rounded-3xl p-6 sm:p-10 lg:p-12 text-white overflow-hidden shadow-2xl">
        <!-- Ambient Glow -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <!-- Left Text Content -->
            <div class="lg:col-span-7 space-y-5">
                <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30 tracking-wide uppercase">
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
                        <span class="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">✓</span>
                        <span>100% Quality Fabric</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">✓</span>
                        <span>7 Days Easy Exchange</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">✓</span>
                        <span>Nationwide Fast Delivery</span>
                    </div>
                </div>

                <!-- Call to Action Buttons -->
                <div class="flex flex-wrap items-center gap-3 pt-3">
                    <a href="{{ $heroBtnUrl }}" class="px-6 py-3.5 bg-theme-primary text-white font-black rounded-xl text-sm transition shadow-lg hover:opacity-90 hover:scale-[1.02] flex items-center gap-2">
                        <span>{{ $heroBtnText }}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    </a>
                    <a href="https://wa.me/88{{ $waDigits }}?text={{ urlencode('Hello, I need styling or size assistance.') }}" target="_blank" class="px-5 py-3.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl text-sm transition flex items-center gap-2">
                        <svg class="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        <span>Size Consultation</span>
                    </a>
                </div>
            </div>

            <!-- Right Showcase Visual with Floating Tag -->
            <div class="lg:col-span-5 relative flex items-center justify-center">
                <div class="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-rose-500/30 group">
                    <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80" 
                         alt="Fashion Showcase" 
                         class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                        <p class="text-xs font-semibold text-rose-300">✨ Trendsetter Choice</p>
                        <p class="text-sm font-bold">Premium Silk & Pure Organic Cotton Wear</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Value Propositions Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-rose-50 text-theme-primary flex items-center justify-center text-xl flex-shrink-0">
                🧵
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk1Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk1Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-rose-50 text-theme-primary flex items-center justify-center text-xl flex-shrink-0">
                🔄
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk2Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk2Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-rose-50 text-theme-primary flex items-center justify-center text-xl flex-shrink-0">
                🚚
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk3Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk3Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-rose-50 text-theme-primary flex items-center justify-center text-xl flex-shrink-0">
                ✨
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk4Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk4Desc }}</p>
            </div>
        </div>
    </div>

    <!-- 3. Category Filter Navigation -->
    @if($categories->count() > 0)
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
                    <span>👗 Explore Collections</span>
                </h3>
            </div>
            <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                <a href="{{ route('storefront.home') }}" 
                   class="px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0 {{ !request('category') ? 'bg-zinc-950 text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50' }}">
                    All Outfits
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

    <!-- 4. Fashion Products Catalog -->
    <div id="products" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
            <div>
                <h2 class="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                    {{ request('search') ? 'Search Results for: "' . request('search') . '"' : 'Trending Outfits & Apparel' }}
                </h2>
                <p class="text-xs text-zinc-500 mt-1">
                    Showing {{ $products->total() }} fashion items with verified fabric and size fit
                </p>
            </div>
        </div>

        @if($products->isEmpty())
            <div class="text-center py-16 bg-white rounded-3xl border border-dashed border-zinc-300 p-8">
                <div class="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-3xl mb-4">
                    👗
                </div>
                <h3 class="text-base font-bold text-zinc-900">No Outfits Found</h3>
                <p class="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    No items found matching your current filter. Please browse other collections or view all products.
                </p>
                <a href="{{ route('storefront.home') }}" class="mt-4 inline-block px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl transition hover:bg-zinc-800">
                    View All Outfits
                </a>
            </div>
        @else
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                @foreach($products as $product)
                    @php
                        $rawImages = $product->images;
                        $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
                        $mainImage = !empty($images) ? asset('storage/' . $images[0]) : null;

                        $rawSpecs = $product->item_attributes ?? $product->specs;
                        $specs = is_array($rawSpecs) ? $rawSpecs : (is_string($rawSpecs) ? (json_decode($rawSpecs, true) ?? []) : []);

                        $fabric = $specs['fabric'] ?? '100% Cotton';
                        $fit = $specs['fit'] ?? 'Regular Fit';
                        $gender = $specs['gender'] ?? null;

                        $displayPrice = $product->sale_price ?: $product->price;
                        $regularPrice = $product->price;
                        $hasDiscount = ($product->sale_price && $product->sale_price < $product->price);
                    @endphp

                    <div class="group bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <!-- Image Frame -->
                            <div class="relative w-full aspect-[3/4] bg-zinc-100 overflow-hidden flex items-center justify-center">
                                @if($mainImage)
                                    <img src="{{ $mainImage }}" 
                                         alt="{{ $product->name }}" 
                                         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                @else
                                    <div class="w-full h-full flex flex-col items-center justify-center text-zinc-400 bg-rose-50/50">
                                        <span class="text-4xl">👗</span>
                                    </div>
                                @endif

                                <!-- Discount Badge -->
                                @if($hasDiscount)
                                    <span class="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                                        Save {{ $currPrefix }}{{ number_format($regularPrice - $displayPrice) }}
                                    </span>
                                @endif

                                <!-- Gender / Fit Pill -->
                                <span class="absolute top-3 right-3 bg-zinc-950/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    {{ $gender ?? $fit }}
                                </span>
                            </div>

                            <!-- Content -->
                            <div class="p-4 space-y-2.5">
                                <div class="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                                    <span class="text-theme-primary font-bold">●</span>
                                    <span>{{ $fabric }}</span>
                                    <span>•</span>
                                    <span>{{ $fit }}</span>
                                </div>

                                <h3 class="text-sm font-bold text-zinc-950 line-clamp-2 leading-snug group-hover:text-theme-primary transition">
                                    <a href="{{ route('storefront.product', $product->slug) }}">
                                        {{ $product->name }}
                                    </a>
                                </h3>

                                <!-- Available Sizes Preview -->
                                <div class="flex items-center gap-1 pt-1 text-[10px] font-bold text-zinc-600">
                                    <span class="text-zinc-400">Sizes:</span>
                                    <span class="px-1.5 py-0.5 bg-zinc-100 rounded">S</span>
                                    <span class="px-1.5 py-0.5 bg-zinc-100 rounded">M</span>
                                    <span class="px-1.5 py-0.5 bg-zinc-100 rounded">L</span>
                                    <span class="px-1.5 py-0.5 bg-zinc-100 rounded">XL</span>
                                </div>
                            </div>
                        </div>

                        <!-- Price and Action -->
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
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                                <span>Order Outfit (COD)</span>
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- Pagination -->
            <div class="pt-8">
                {{ $products->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
