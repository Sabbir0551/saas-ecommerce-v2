@extends('layouts.storefront')

@section('content')
@php
    $category = tenant('business_category') ?? 'real_estate';
    $categoryDefaults = config("business_presets.category_defaults.{$category}") 
        ?? config("business_presets.category_defaults.real_estate", []);

    $creds = tenant('gateway_credentials') ?? [];
    $tenantBranding = tenant('branding') ?? $creds['branding'] ?? [];
    $branding = array_merge($categoryDefaults, array_filter((array)$tenantBranding, fn($v) => !is_null($v) && $v !== ''));

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    $heroBadge = $branding['hero_badge'] ?? '🏢 100% Verified Legal Titles';
    $heroTitle = $branding['hero_title'] ?? 'Discover Ready Apartments & Premium Commercial Spaces';
    $heroSubtitle = $branding['hero_subtitle'] ?? 'Explore luxury ready flats, commercial floors, and residential plots in prime locations with clear titles and dedicated bank loan assistance.';
    $heroBtnText = $branding['hero_btn_text'] ?? 'Explore Properties';
    $heroBtnUrl = $branding['hero_btn_url'] ?? '#products';

    $perk1Title = $branding['perk_1_title'] ?? '100% Verified Titles';
    $perk1Desc = $branding['perk_1_desc'] ?? 'All properties undergo thorough legal and title verification.';
    $perk2Title = $branding['perk_2_title'] ?? 'Bank Loan Assistance';
    $perk2Desc = $branding['perk_2_desc'] ?? 'Easy mortgage loan approval with leading commercial banks.';
    $perk3Title = $branding['perk_3_title'] ?? 'Prime Dhaka Locations';
    $perk3Desc = $branding['perk_3_desc'] ?? 'Apartments in Gulshan, Banani, Dhanmondi, Uttara & Bashundhara.';
    $perk4Title = $branding['perk_4_title'] ?? 'Free Site Visit Guide';
    $perk4Desc = $branding['perk_4_desc'] ?? 'Dedicated property specialist assists during on-site property tour.';

    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">

    <!-- 1. Real Estate & Property Hero Showcase -->
    <div class="relative bg-gradient-to-br from-slate-950 via-zinc-900 to-zinc-950 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 text-white overflow-hidden shadow-2xl">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-5">
                <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 uppercase tracking-wide">
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
                        <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">✓</span>
                        <span>Clear Titles</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">✓</span>
                        <span>Bank Loan Support</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">✓</span>
                        <span>Free Site Visit</span>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-3 pt-3">
                    <a href="{{ $heroBtnUrl }}" class="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black rounded-xl text-sm transition shadow-lg flex items-center gap-2">
                        <span>{{ $heroBtnText }}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    </a>
                    <a href="tel:{{ $hotline }}" class="px-5 py-3.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl text-sm transition flex items-center gap-2">
                        <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <span>Schedule Site Tour</span>
                    </a>
                </div>
            </div>

            <div class="lg:col-span-5 relative flex items-center justify-center">
                <div class="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-700 group">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80" 
                         alt="Luxury Real Estate" 
                         class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                        <p class="text-xs font-semibold text-amber-300">🏢 Ready for Handover</p>
                        <p class="text-sm font-bold">Luxury Ready Apartments & Commercial Floors</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Value Perks Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                📜
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk1Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk1Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                🏦
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk2Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk2Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                📍
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk3Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk3Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center text-xl flex-shrink-0">
                🚗
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk4Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk4Desc }}</p>
            </div>
        </div>
    </div>

    <!-- 3. Property Category Filter -->
    @if($categories->count() > 0)
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
                    <span>🏢 Property Types & Listings</span>
                </h3>
            </div>
            <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                <a href="{{ route('storefront.home') }}" 
                   class="px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0 {{ !request('category') ? 'bg-zinc-950 text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50' }}">
                    All Properties
                </a>
                @foreach($categories as $cat)
                    <a href="{{ route('storefront.home', ['category' => $cat->slug]) }}" 
                       class="px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0 {{ request('category') === $cat->slug ? 'bg-slate-900 text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50' }}">
                        {{ $cat->name }}
                    </a>
                @endforeach
            </div>
        </div>
    @endif

    <!-- 4. Real Estate Listings Catalog -->
    <div id="products" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
            <div>
                <h2 class="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                    {{ request('search') ? 'Properties matching: "' . request('search') . '"' : 'Available Ready Flats & Commercial Spaces' }}
                </h2>
                <p class="text-xs text-zinc-500 mt-1">
                    Showing {{ $products->total() }} verified properties ready for site visit
                </p>
            </div>
        </div>

        @if($products->isEmpty())
            <div class="text-center py-16 bg-white rounded-3xl border border-dashed border-zinc-300 p-8">
                <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center mx-auto text-3xl mb-4">
                    🏢
                </div>
                <h3 class="text-base font-bold text-zinc-900">No Properties Found</h3>
                <p class="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    No listings found matching your current filter. Please browse other property types.
                </p>
                <a href="{{ route('storefront.home') }}" class="mt-4 inline-block px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl transition hover:bg-zinc-800">
                    View All Properties
                </a>
            </div>
        @else
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($products as $product)
                    @php
                        $rawImages = $product->images;
                        $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
                        $mainImage = !empty($images) ? asset('storage/' . $images[0]) : null;

                        $rawSpecs = $product->item_attributes ?? $product->specs;
                        $specs = is_array($rawSpecs) ? $rawSpecs : (is_string($rawSpecs) ? (json_decode($rawSpecs, true) ?? []) : []);

                        $propType = $specs['property_type'] ?? 'Apartment';
                        $sizeSqft = $specs['size_sqft'] ?? '1450';
                        $beds = $specs['bedrooms'] ?? '3';
                        $baths = $specs['bathrooms'] ?? '3';
                        $floor = $specs['floor_number'] ?? '5th Floor';
                        $location = $specs['location'] ?? 'Dhaka';
                        $price = $product->price;
                    @endphp

                    <div class="group bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-400 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div class="relative w-full aspect-[16/10] bg-zinc-100 overflow-hidden flex items-center justify-center">
                                @if($mainImage)
                                    <img src="{{ $mainImage }}" alt="{{ $product->name }}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                @else
                                    <span class="text-5xl text-zinc-300">🏢</span>
                                @endif

                                <span class="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                                    {{ $propType }}
                                </span>

                                <span class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                                    📍 {{ $location }}
                                </span>
                            </div>

                            <div class="p-5 space-y-3">
                                <h3 class="text-base font-black text-zinc-950 line-clamp-1 group-hover:text-amber-600 transition">
                                    <a href="{{ route('storefront.product', $product->slug) }}">
                                        {{ $product->name }}
                                    </a>
                                </h3>

                                <div class="grid grid-cols-3 gap-2 py-2 border-y border-zinc-100 text-xs text-zinc-600">
                                    <div class="text-center">
                                        <span class="block text-[10px] text-zinc-400 font-bold uppercase">Size</span>
                                        <span class="font-black text-zinc-900">{{ $sizeSqft }} sqft</span>
                                    </div>
                                    <div class="text-center border-x border-zinc-100">
                                        <span class="block text-[10px] text-zinc-400 font-bold uppercase">Bed / Bath</span>
                                        <span class="font-black text-zinc-900">{{ $beds }}B / {{ $baths }}B</span>
                                    </div>
                                    <div class="text-center">
                                        <span class="block text-[10px] text-zinc-400 font-bold uppercase">Floor</span>
                                        <span class="font-black text-zinc-900">{{ $floor }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="p-5 pt-0 border-t border-zinc-100 mt-2 flex items-center justify-between gap-4">
                            <div>
                                <span class="block text-[10px] text-zinc-400 font-bold uppercase">মূল্য / ভাড়া</span>
                                <span class="text-base font-black text-zinc-950">
                                    {{ $currPrefix }}{{ number_format($price) }}
                                </span>
                            </div>

                            <a href="{{ route('storefront.product', $product->slug) }}" 
                               class="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs">
                                <span>সাইট ভিজিট বুক করুন</span>
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
