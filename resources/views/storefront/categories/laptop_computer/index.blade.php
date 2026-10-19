@extends('layouts.storefront')

@section('content')
@php
    $archetype = tenant('archetype') ?? 'physical_store';
    $creds = tenant('gateway_credentials') ?? [];
    $branding = tenant('branding') ?? $creds['branding'] ?? [];

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    $heroBadge = $branding['hero_badge'] ?? '✨ Premium Certified Quality';
    $heroTitle = $branding['hero_title'] ?? 'High-Performance & Certified Business Laptops';
    $heroSubtitle = $branding['hero_subtitle'] ?? 'Buy original brand-new and certified laptops directly with up to 2 years official service warranty and 15 days replacement guarantee.';
    $heroBtnText = $branding['hero_btn_text'] ?? 'Explore Laptops';
    $heroBtnUrl = $branding['hero_btn_url'] ?? '#products';

    $perk1Title = $branding['perk_1_title'] ?? 'Nationwide Cash on Delivery';
    $perk1Desc = $branding['perk_1_desc'] ?? 'Fast delivery within 24 hours in Dhaka and 48 hours nationwide.';
    $perk2Title = $branding['perk_2_title'] ?? '15 Days Replacement Guarantee';
    $perk2Desc = $branding['perk_2_desc'] ?? 'Hassle-free replacement for any hardware defects within 15 days.';
    $perk3Title = $branding['perk_3_title'] ?? '2 Years Official Warranty';
    $perk3Desc = $branding['perk_3_desc'] ?? 'Free servicing and dedicated lifetime technical software support.';
    $perk4Title = $branding['perk_4_title'] ?? '100% Genuine & Authentic';
    $perk4Desc = $branding['perk_4_desc'] ?? 'Certified authentic laptops with genuine OEM fast chargers.';

    $consultTitle = $branding['consultation_title'] ?? 'Confused which laptop fits your needs?';
    $consultSub = $branding['consultation_subtitle'] ?? 'Talk directly to our hardware specialists for personalized recommendations and budget guidance.';
    $consultPhone = $branding['consultation_phone'] ?? ($branding['hotline_number'] ?? '+880 1700-000000');
    $waDigits = preg_replace('/[^0-9]/', '', $branding['whatsapp_number'] ?? '+880 1700-000000');

    $why1Title = $branding['why_1_title'] ?? 'Certified Grade-A Quality';
    $why1Desc = $branding['why_1_desc'] ?? 'Every machine is tested across 30+ diagnostic hardware checkpoints.';
    $why2Title = $branding['why_2_title'] ?? 'Live Video Call Inspection';
    $why2Desc = $branding['why_2_desc'] ?? 'Inspect your selected laptop via WhatsApp video call before dispatch.';
    $why3Title = $branding['why_3_title'] ?? '0% EMI & Flexible Payment';
    $why3Desc = $branding['why_3_desc'] ?? 'Easy 3 to 12-month EMI plans across 31 leading bank credit cards.';
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">

    <!-- 1. Hero Showcase Banner -->
    <div class="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 lg:p-12 text-white overflow-hidden shadow-2xl">
        <!-- Ambient Glow -->
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <!-- Left Text Content -->
            <div class="lg:col-span-7 space-y-5">
                <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-amber-400/30">
                    {{ $heroBadge }}
                </span>

                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
                    {{ $heroTitle }}
                </h1>

                <p class="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                    {{ $heroSubtitle }}
                </p>

                <!-- Value Props Checks -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-zinc-300 font-semibold">
                    <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
                        <span>100% Genuine & Authentic</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
                        <span>15 Days Replacement</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</span>
                        <span>2 Years Warranty</span>
                    </div>
                </div>

                <!-- Call to Action Buttons -->
                <div class="flex flex-wrap items-center gap-3 pt-3">
                    <a href="{{ $heroBtnUrl }}" class="px-6 py-3.5 bg-theme-primary text-white font-black rounded-xl text-sm transition shadow-lg hover:opacity-90 hover:scale-[1.02] flex items-center gap-2">
                        <span>{{ $heroBtnText }}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    </a>
                    <a href="tel:{{ $consultPhone }}" class="px-5 py-3.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl text-sm transition flex items-center gap-2">
                        <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <span>Call for Consultation</span>
                    </a>
                </div>
            </div>

            <!-- Right Showcase Visual with Floating Specs Badges -->
            <div class="lg:col-span-5 relative flex items-center justify-center">
                <div class="relative w-full max-w-md aspect-video sm:aspect-square flex items-center justify-center">
                    <div class="w-full h-full bg-gradient-to-b from-zinc-800/50 to-zinc-900/80 border border-zinc-700/50 rounded-2xl p-6 flex flex-col items-center justify-center shadow-2xl relative backdrop-blur-sm">
                        <img src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80" 
                             alt="Featured Laptop" 
                             class="w-full h-auto max-h-56 object-contain drop-shadow-2xl rounded-xl transition hover:scale-105 duration-300">

                        <div class="mt-4 text-center">
                            <span class="text-xs font-bold text-amber-400 uppercase tracking-widest block">Certified Business Laptops</span>
                            <span class="text-base font-extrabold text-white block mt-0.5">Lenovo ThinkPad & Dell Latitude</span>
                        </div>
                    </div>

                    <!-- Floating Badge Top Left -->
                    <div class="absolute -top-3 -left-3 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 animate-bounce" style="animation-duration: 3s;">
                        <span>⚡</span>
                        <span>13th Gen & Ryzen 7</span>
                    </div>

                    <!-- Floating Badge Bottom Right -->
                    <div class="absolute -bottom-3 -right-3 bg-emerald-950/90 backdrop-blur-md border border-emerald-700/60 text-emerald-300 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5">
                        <span>🛡️</span>
                        <span>2-Year Service Warranty</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Trust Service Guarantee Badges (4 Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Perk 1 -->
        <div class="bg-white border border-zinc-200/80 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-xs hover:border-theme-primary transition group">
            <div class="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xl transition">
                🚚
            </div>
            <div>
                <h3 class="text-sm font-bold text-zinc-900">{{ $perk1Title }}</h3>
                <p class="text-xs text-zinc-500 mt-0.5 leading-snug">{{ $perk1Desc }}</p>
            </div>
        </div>

        <!-- Perk 2 -->
        <div class="bg-white border border-zinc-200/80 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-xs hover:border-theme-primary transition group">
            <div class="w-11 h-11 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xl transition">
                🔄
            </div>
            <div>
                <h3 class="text-sm font-bold text-zinc-900">{{ $perk2Title }}</h3>
                <p class="text-xs text-zinc-500 mt-0.5 leading-snug">{{ $perk2Desc }}</p>
            </div>
        </div>

        <!-- Perk 3 -->
        <div class="bg-white border border-zinc-200/80 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-xs hover:border-theme-primary transition group">
            <div class="w-11 h-11 rounded-xl bg-purple-50 group-hover:bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 text-xl transition">
                🛡️
            </div>
            <div>
                <h3 class="text-sm font-bold text-zinc-900">{{ $perk3Title }}</h3>
                <p class="text-xs text-zinc-500 mt-0.5 leading-snug">{{ $perk3Desc }}</p>
            </div>
        </div>

        <!-- Perk 4 -->
        <div class="bg-white border border-zinc-200/80 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-xs hover:border-theme-primary transition group">
            <div class="w-11 h-11 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-xl transition">
                💎
            </div>
            <div>
                <h3 class="text-sm font-bold text-zinc-900">{{ $perk4Title }}</h3>
                <p class="text-xs text-zinc-500 mt-0.5 leading-snug">{{ $perk4Desc }}</p>
            </div>
        </div>
    </div>

    <!-- 3. Brand Filter Quick Chips -->
    <div>
        <div class="flex items-center justify-between mb-3">
            <h2 class="text-xs sm:text-sm font-extrabold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <span>🏷️</span>
                <span>Filter by Popular Brand</span>
            </h2>
            @if(request('search') || request('category'))
                <a href="{{ route('storefront.home') }}" class="text-xs text-theme-primary hover:underline font-bold">
                    ✕ Reset Filter
                </a>
            @endif
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <a href="{{ route('storefront.home') }}" 
               class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition {{ (!request('search') && !request('category')) ? 'bg-theme-primary text-white shadow-md' : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100' }}">
                All Laptops
            </a>
            @php
                $topBrands = [
                    'Lenovo' => 'Lenovo ThinkPad',
                    'Dell'   => 'Dell Latitude',
                    'HP'     => 'HP EliteBook',
                    'Apple'  => 'Apple MacBook',
                    'Asus'   => 'Asus ZenBook',
                    'Acer'   => 'Acer Swift',
                    'MSI'    => 'MSI Gaming',
                ];
            @endphp
            @foreach($topBrands as $bKey => $bLabel)
                <a href="{{ route('storefront.home', ['search' => $bKey]) }}" 
                   class="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition {{ request('search') === $bKey ? 'bg-theme-primary text-white shadow-md' : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100' }}">
                    {{ $bLabel }}
                </a>
            @endforeach
        </div>
    </div>

    <!-- 4. Laptop Product Grid -->
    <div id="products" class="scroll-mt-24">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h2 class="text-xl sm:text-2xl font-black text-zinc-950">
                    {{ request('search') ? 'Search Results for "' . request('search') . '"' : (request('category') ? 'Category: ' . ucfirst(request('category')) : 'Featured Laptop Deals & Inventory') }}
                </h2>
                <span class="text-xs text-zinc-500 font-medium">Showing {{ $products->total() }} laptops in catalog</span>
            </div>
        </div>

        @if($products->isEmpty())
            <div class="bg-white rounded-2xl p-12 text-center border border-zinc-200 my-4 shadow-xs">
                <div class="w-16 h-16 mx-auto mb-3 text-4xl">💻</div>
                <h3 class="text-base font-bold text-zinc-900">No Laptops Found</h3>
                <p class="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                    We could not find any models matching your search criteria. Please browse our full laptop catalog.
                </p>
                <a href="{{ route('storefront.home') }}" class="inline-block mt-4 px-5 py-2 bg-theme-primary text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-90 transition">
                    View All Laptops
                </a>
            </div>
        @else
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                @foreach($products as $product)
                    @php
                        $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
                        $firstImage = !empty($images) && is_array($images) ? asset('storage/' . $images[0]) : null;
                        if (!$firstImage) {
                            $firstImage = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80';
                        }
                        $displayPrice = $product->sale_price ?: $product->price;
                        $regularPrice = $product->price;
                        $discount = ($product->sale_price && $product->sale_price < $product->price) ? ($product->price - $product->sale_price) : 0;

                        $attrs = $product->item_attributes ?? $product->specs ?? [];
                        if (is_string($attrs)) $attrs = json_decode($attrs, true) ?? [];

                        $chipProcessor = $attrs['highlight_processor'] ?? $attrs['processor_model'] ?? null;
                        $chipRam = $attrs['highlight_ram'] ?? $attrs['ram_installed'] ?? null;
                        $chipStorage = $attrs['highlight_storage'] ?? $attrs['storage_installed'] ?? null;
                        $chipDisplay = $attrs['highlight_display'] ?? $attrs['display_size'] ?? null;
                    @endphp

                    <!-- Product Card -->
                    <div class="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden hover:shadow-xl hover:border-theme-primary transition-all duration-300 flex flex-col group">
                        
                        <!-- Image Container with Badges -->
                        <div class="relative aspect-4/3 bg-zinc-50 p-4 overflow-hidden border-b border-zinc-100 flex items-center justify-center">
                            <a href="{{ route('storefront.product', $product->slug) }}" class="w-full h-full flex items-center justify-center">
                                <img src="{{ $firstImage }}" 
                                     alt="{{ $product->name }}" 
                                     class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300">
                            </a>

                            <!-- Badges -->
                            <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                                @if($discount > 0)
                                    <span class="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
                                        Save {{ $currPrefix }}{{ number_format($discount, 0) }}
                                    </span>
                                @endif
                                <span class="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                                    In Stock
                                </span>
                            </div>

                            @if(!empty($attrs['brand']))
                                <span class="absolute top-2.5 right-2.5 bg-zinc-900/80 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase">
                                    {{ $attrs['brand'] }}
                                </span>
                            @endif
                        </div>

                        <!-- Card Body -->
                        <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                                <a href="{{ route('storefront.product', $product->slug) }}" class="text-sm font-bold text-zinc-900 hover:text-theme-primary line-clamp-2 transition leading-snug">
                                    {{ $product->name }}
                                </a>

                                <!-- Specs Chips -->
                                <div class="mt-2.5 grid grid-cols-2 gap-1 text-[11px] text-zinc-600 font-medium">
                                    @if($chipProcessor)
                                        <div class="bg-zinc-100 px-2 py-1 rounded truncate" title="{{ $chipProcessor }}">
                                            ⚡ {{ Str::limit($chipProcessor, 16) }}
                                        </div>
                                    @endif
                                    @if($chipRam)
                                        <div class="bg-zinc-100 px-2 py-1 rounded truncate" title="{{ $chipRam }}">
                                            🧠 {{ Str::limit($chipRam, 14) }}
                                        </div>
                                    @endif
                                    @if($chipStorage)
                                        <div class="bg-zinc-100 px-2 py-1 rounded truncate" title="{{ $chipStorage }}">
                                            💾 {{ Str::limit($chipStorage, 14) }}
                                        </div>
                                    @endif
                                    @if($chipDisplay)
                                        <div class="bg-zinc-100 px-2 py-1 rounded truncate" title="{{ $chipDisplay }}">
                                            🖥️ {{ Str::limit($chipDisplay, 14) }}
                                        </div>
                                    @endif
                                </div>
                            </div>

                            <!-- Pricing & Action Buttons -->
                            <div class="pt-3 border-t border-zinc-100">
                                <div class="flex items-baseline justify-between mb-2.5">
                                    <div>
                                        <span class="text-lg font-black text-zinc-950">{{ $currPrefix }}{{ number_format($displayPrice, 0) }}</span>
                                        @if($discount > 0)
                                            <span class="text-xs text-zinc-400 line-through ml-1 font-semibold">{{ $currPrefix }}{{ number_format($regularPrice, 0) }}</span>
                                        @endif
                                    </div>
                                    <span class="text-[10px] text-zinc-400 font-semibold">Cash on Delivery</span>
                                </div>

                                <div class="grid grid-cols-2 gap-2">
                                    <a href="{{ route('storefront.product', $product->slug) }}" class="bg-theme-primary text-white font-bold text-xs py-2 px-3 rounded-xl text-center transition shadow-xs hover:opacity-90">
                                        Order Now
                                    </a>
                                    <a href="{{ route('storefront.product', $product->slug) }}" class="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs py-2 px-3 rounded-xl text-center border border-zinc-300 transition">
                                        Quick View
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <!-- Pagination -->
            <div class="mt-8">
                {{ $products->links() }}
            </div>
        @endif
    </div>

    <!-- 5. Why Choose Us Section -->
    <div class="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-10 shadow-xs">
        <div class="text-center max-w-xl mx-auto mb-8">
            <span class="text-xs font-black text-theme-primary uppercase tracking-widest block mb-1">Our Value Proposition</span>
            <h2 class="text-2xl sm:text-3xl font-black text-zinc-950">Why Buy Laptops From Us?</h2>
            <p class="text-xs sm:text-sm text-zinc-500 mt-2">Every machine is verified, inspected, and guaranteed with enterprise warranty standards.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-zinc-50 rounded-2xl p-6 border border-zinc-200/60 text-center space-y-3">
                <div class="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
                    🔬
                </div>
                <h3 class="text-base font-bold text-zinc-900">{{ $why1Title }}</h3>
                <p class="text-xs text-zinc-500 leading-relaxed">{{ $why1Desc }}</p>
            </div>

            <div class="bg-zinc-50 rounded-2xl p-6 border border-zinc-200/60 text-center space-y-3">
                <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                    📹
                </div>
                <h3 class="text-base font-bold text-zinc-900">{{ $why2Title }}</h3>
                <p class="text-xs text-zinc-500 leading-relaxed">{{ $why2Desc }}</p>
            </div>

            <div class="bg-zinc-50 rounded-2xl p-6 border border-zinc-200/60 text-center space-y-3">
                <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
                    💳
                </div>
                <h3 class="text-base font-bold text-zinc-900">{{ $why3Title }}</h3>
                <p class="text-xs text-zinc-500 leading-relaxed">{{ $why3Desc }}</p>
            </div>
        </div>
    </div>

    <!-- 6. Verified Customer Testimonials -->
    <div class="bg-zinc-900 rounded-3xl p-6 sm:p-10 text-white">
        <div class="text-center max-w-xl mx-auto mb-8">
            <span class="text-xs font-black text-amber-400 uppercase tracking-widest block mb-1">Customer Stories</span>
            <h2 class="text-2xl sm:text-3xl font-black text-white">Verified Buyer Testimonials</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <!-- Review 1 -->
            <div class="bg-zinc-800/80 border border-zinc-700/60 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div class="space-y-2">
                    <div class="text-amber-400 text-sm">★★★★★</div>
                    <p class="text-zinc-300 leading-relaxed italic">
                        "Purchased the Lenovo ThinkPad T14 Gen 4. Condition is pristine, battery easily lasts 7+ hours, and delivery was completed within 24 hours in Dhaka."
                    </p>
                </div>
                <div class="pt-3 border-t border-zinc-700/50 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-500 font-bold text-white flex items-center justify-center text-xs">
                        K
                    </div>
                    <div>
                        <span class="font-bold text-white block">Kamrul Hasan</span>
                        <span class="text-[10px] text-zinc-400">Dhaka, Bangladesh | ThinkPad T14</span>
                    </div>
                </div>
            </div>

            <!-- Review 2 -->
            <div class="bg-zinc-800/80 border border-zinc-700/60 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div class="space-y-2">
                    <div class="text-amber-400 text-sm">★★★★★</div>
                    <p class="text-zinc-300 leading-relaxed italic">
                        "They provided a live WhatsApp video inspection before dispatching. Laptop arrived in sealed packaging with official 2-year warranty card."
                    </p>
                </div>
                <div class="pt-3 border-t border-zinc-700/50 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-emerald-500 font-bold text-white flex items-center justify-center text-xs">
                        R
                    </div>
                    <div>
                        <span class="font-bold text-white block">Rafiq Ahmed</span>
                        <span class="text-[10px] text-zinc-400">Chittagong, Bangladesh | Dell Latitude 7420</span>
                    </div>
                </div>
            </div>

            <!-- Review 3 -->
            <div class="bg-zinc-800/80 border border-zinc-700/60 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div class="space-y-2">
                    <div class="text-amber-400 text-sm">★★★★★</div>
                    <p class="text-zinc-300 leading-relaxed italic">
                        "Great performance for software development. The cash on delivery feature allowed me to thoroughly test before payment. Excellent service!"
                    </p>
                </div>
                <div class="pt-3 border-t border-zinc-700/50 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-purple-500 font-bold text-white flex items-center justify-center text-xs">
                        S
                    </div>
                    <div>
                        <span class="font-bold text-white block">Sumaiya Akter</span>
                        <span class="text-[10px] text-zinc-400">Sylhet, Bangladesh | HP EliteBook 840</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 7. Consultation Call-To-Action Banner -->
    <div class="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left">
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {{ $consultTitle }}
            </h2>
            <p class="text-sm text-zinc-300 max-w-xl">
                {{ $consultSub }}
            </p>
        </div>

        <div class="flex flex-wrap items-center gap-3 flex-shrink-0">
            <a href="tel:{{ $consultPhone }}" class="px-6 py-3.5 bg-theme-primary text-white font-black rounded-xl text-sm transition shadow-lg flex items-center gap-2 hover:opacity-90">
                <svg class="w-4 h-4 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>Call Hotline: {{ $consultPhone }}</span>
            </a>
            <a href="https://wa.me/88{{ $waDigits }}" target="_blank" class="px-5 py-3.5 bg-white text-zinc-950 font-black rounded-xl text-sm transition shadow-md flex items-center gap-2 hover:bg-zinc-100">
                <span>💬 WhatsApp Chat</span>
            </a>
        </div>
    </div>

</div>
@endsection