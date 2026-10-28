@php
    $category = tenant('business_category') ?? 'default';
    $categoryDefaults = config("business_presets.category_defaults.{$category}") 
        ?? config("business_presets.category_defaults.mobile_gadgets", []);

    $creds = tenant('gateway_credentials') ?? [];
    $tenantBranding = tenant('branding') ?? $creds['branding'] ?? [];
    $branding = array_merge($categoryDefaults, array_filter((array)$tenantBranding, fn($v) => !is_null($v) && $v !== ''));

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    // Hero Section
    $heroBadge = $branding['hero_badge'] ?? ($categoryDefaults['hero_badge'] ?? '🔥 HOT TECH ACCESSORIES');
    $heroTitle = $branding['hero_title'] ?? ($categoryDefaults['hero_title'] ?? 'Mobile Accessories & Electronic');
    $heroSubtitle = $branding['hero_subtitle'] ?? ($categoryDefaults['hero_subtitle'] ?? 'Discover premium fast chargers, wireless earbuds, smartwatches, and flagship gadgets with official brand warranty and lightning fast delivery.');
    $heroImage = $branding['hero_image'] ?? null;
    $heroBtnText = $branding['hero_btn_text'] ?? ($categoryDefaults['hero_btn_text'] ?? 'Shop Now');
    $heroBtnUrl = $branding['hero_btn_url'] ?? '#featured-gadgets';
    $heroBtn2Text = $branding['hero_btn2_text'] ?? ($categoryDefaults['hero_btn2_text'] ?? 'Discover More');
    $heroBtn2Url = $branding['hero_btn2_url'] ?? '#categories';

    $heroPills = $branding['hero_pills'] ?? ($categoryDefaults['hero_pills'] ?? [
        ['icon' => '⚡', 'label' => 'Fast Charger'],
        ['icon' => '📶', 'label' => 'Wireless'],
        ['icon' => '🎧', 'label' => 'Hi-Fi Audio'],
        ['icon' => '🔋', 'label' => 'Power Bank'],
        ['icon' => '⌚', 'label' => 'Smartwatch'],
        ['icon' => '🛡️', 'label' => 'Case & Glass'],
    ]);

    // 4 Trust Perks
    $perk1Title = $branding['perk_1_title'] ?? ($categoryDefaults['perk_1_title'] ?? '100% Satisfaction');
    $perk1Desc = $branding['perk_1_desc'] ?? ($categoryDefaults['perk_1_desc'] ?? 'Authentic & guaranteed genuine quality.');
    $perk2Title = $branding['perk_2_title'] ?? ($categoryDefaults['perk_2_title'] ?? 'Fast Nationwide Delivery');
    $perk2Desc = $branding['perk_2_desc'] ?? ($categoryDefaults['perk_2_desc'] ?? 'Express 24-48h dispatch across 64 districts.');
    $perk3Title = $branding['perk_3_title'] ?? ($categoryDefaults['perk_3_title'] ?? '7 Days Replacement');
    $perk3Desc = $branding['perk_3_desc'] ?? ($categoryDefaults['perk_3_desc'] ?? 'Hassle-free replacement for any defects.');
    $perk4Title = $branding['perk_4_title'] ?? ($categoryDefaults['perk_4_title'] ?? 'Secure Payment');
    $perk4Desc = $branding['perk_4_desc'] ?? ($categoryDefaults['perk_4_desc'] ?? 'Cash on delivery, bKash & verified cards.');

    // Category Grid
    $catSectionEnabled = $branding['cat_section_enabled'] ?? true;
    $catSectionBadge = $branding['cat_section_badge'] ?? ($categoryDefaults['cat_section_badge'] ?? 'EXPLORE COLLECTION');
    $catSectionTitle = $branding['cat_section_title'] ?? ($categoryDefaults['cat_section_title'] ?? 'Smart Gadget Categories');
    $catSectionSubtitle = $branding['cat_section_subtitle'] ?? ($categoryDefaults['cat_section_subtitle'] ?? 'Curated collection of authentic gear for daily productivity, fitness, travel and high-end audio.');

    // Featured Products
    $featSectionEnabled = $branding['featured_section_enabled'] ?? true;
    $featSectionBadge = $branding['featured_section_badge'] ?? ($categoryDefaults['featured_section_badge'] ?? 'HOT PRODUCTS OF THE WEEK');
    $featSectionTitle = $branding['featured_section_title'] ?? ($categoryDefaults['featured_section_title'] ?? 'Featured Gadgets');
    $featSectionLinkText = $branding['featured_section_link_text'] ?? ($categoryDefaults['featured_section_link_text'] ?? 'View All Products →');

    // Mid-Page Promo Banner
    $promoEnabled = $branding['promo_banner_enabled'] ?? true;
    $promoBadge = $branding['promo_badge'] ?? ($categoryDefaults['promo_badge'] ?? 'NEXT-GEN GAMING 2026');
    $promoTitle = $branding['promo_title'] ?? ($categoryDefaults['promo_title'] ?? 'The Ultimate Mobile Gaming Setup 2026');
    $promoDesc = $branding['promo_desc'] ?? ($categoryDefaults['promo_desc'] ?? 'Transform your smartphone into a powerhouse console with ultra-low latency wireless controllers, cooling fans, and Hi-Res trigger audio.');
    $promoImage = $branding['promo_image'] ?? null;
    $promoBtnText = $branding['promo_btn_text'] ?? ($categoryDefaults['promo_btn_text'] ?? 'Explore Setup Now →');
    $promoBtnUrl = $branding['promo_btn_url'] ?? '#products';

    // New Arrivals Drops
    $newDropsEnabled = $branding['new_drops_enabled'] ?? true;
    $newDropsBadge = $branding['new_drops_badge'] ?? ($categoryDefaults['new_drops_badge'] ?? 'FRESH IN STORE');
    $newDropsTitle = $branding['new_drops_title'] ?? ($categoryDefaults['new_drops_title'] ?? 'New Gadget Drops');
    $newDropsSubtitle = $branding['new_drops_subtitle'] ?? ($categoryDefaults['new_drops_subtitle'] ?? 'Upgrade your routine with brand-new releases fresh off the production line.');
    $newDropsLinkText = $branding['new_drops_link_text'] ?? ($categoryDefaults['new_drops_link_text'] ?? 'Explore All Drops →');

    // VIP Coupon Banner
    $couponEnabled = $branding['coupon_banner_enabled'] ?? true;
    $couponBadge = $branding['coupon_badge'] ?? ($categoryDefaults['coupon_badge'] ?? 'EXCLUSIVE MEMBER PRIVILEGE');
    $couponTitle = $branding['coupon_title'] ?? ($categoryDefaults['coupon_title'] ?? 'Save 10% On Your First Order');
    $couponDesc = $branding['coupon_desc'] ?? ($categoryDefaults['coupon_desc'] ?? 'Join over 50,000 satisfied tech lovers across Bangladesh. Use voucher code FIRST10 at checkout.');
    $couponCode = $branding['coupon_code'] ?? ($categoryDefaults['coupon_code'] ?? 'FIRST10');
    $couponBtnText = $branding['coupon_btn_text'] ?? ($categoryDefaults['coupon_btn_text'] ?? 'GET YOUR COUPON');

    // Service Strip
    $serviceStripEnabled = $branding['service_strip_enabled'] ?? true;
    $service1Title = $branding['service_1_title'] ?? ($categoryDefaults['service_1_title'] ?? 'Fast Dispatch');
    $service1Desc = $branding['service_1_desc'] ?? ($categoryDefaults['service_1_desc'] ?? 'Same-day processing across 64 districts');
    $service2Title = $branding['service_2_title'] ?? ($categoryDefaults['service_2_title'] ?? 'Genuine Warranty');
    $service2Desc = $branding['service_2_desc'] ?? ($categoryDefaults['service_2_desc'] ?? 'Authorized dealer replacement & warranty');
    $service3Title = $branding['service_3_title'] ?? ($categoryDefaults['service_3_title'] ?? '24/7 Expert Support');
    $service3Desc = $branding['service_3_desc'] ?? ($categoryDefaults['service_3_desc'] ?? 'Reach out anytime via phone or WhatsApp');
    $service4Title = $branding['service_4_title'] ?? ($categoryDefaults['service_4_title'] ?? '0% Bank EMI');
    $service4Desc = $branding['service_4_desc'] ?? ($categoryDefaults['service_4_desc'] ?? 'Flexible 3 to 12 months installment plans');

    $isFiltering = request()->filled('search') || request()->filled('category') || request()->filled('brand');

    // Curated high-res category visuals for gadget categories
    $categoryVisuals = [
        'audio-earphones' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        'chargers-power' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
        'mobile-smartphone-accessories' => 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80',
        'power-bank-portable-power' => 'https://images.unsplash.com/photo-1609592807664-84511c572b22?w=800&auto=format&fit=crop&q=80',
        'storage-memory' => 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
        'smart-wearables' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    ];

    $fallbackCategoryImages = [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1609592807664-84511c572b22?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    ];
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-12 sm:space-y-16">

    <!-- Active Filter Notice Banner (when user searches or filters) -->
    @if($isFiltering)
        <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-950">
                <span class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">🔍</span>
                <span>ফিল্টার চালু রয়েছে:</span>
                @if(request('search'))
                    <span class="bg-white px-2.5 py-1 rounded-lg border border-blue-300 font-extrabold text-blue-700">"{{ request('search') }}"</span>
                @endif
                @if(request('category'))
                    <span class="bg-white px-2.5 py-1 rounded-lg border border-blue-300 font-extrabold text-blue-700">ক্যাটাগরি: {{ request('category') }}</span>
                @endif
                @if(request('brand'))
                    <span class="bg-white px-2.5 py-1 rounded-lg border border-blue-300 font-extrabold text-blue-700">ব্র্যান্ড: {{ request('brand') }}</span>
                @endif
            </div>
            <a href="{{ route('storefront.home') }}" class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-xs flex items-center gap-1.5">
                <span>✕ সব ফিল্টার মুছুন</span>
            </a>
        </div>
    @endif

    <!-- 1. Hero Showcase Card (Curved 3xl Card with Tech Feature Pills & High-Res Visual) -->
    <section class="relative bg-gradient-to-br from-blue-50/90 via-slate-50 to-indigo-50/60 border border-blue-100/90 rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl shadow-blue-500/5">
        <!-- Ambient Decorative Glows -->
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <!-- Left Text & Features Column -->
            <div class="lg:col-span-7 space-y-6">
                <!-- Highlight Badge -->
                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-blue-600/10 text-blue-600 border border-blue-600/20 tracking-wider uppercase shadow-2xs">
                    {{ $heroBadge }}
                </div>

                <!-- Main Hero Headline -->
                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 leading-[1.15]">
                    @php
                        $words = explode(' ', $heroTitle);
                        $lastWord = array_pop($words);
                        $firstPart = implode(' ', $words);
                    @endphp
                    <span>{{ $firstPart }}</span>
                    @if($lastWord)
                        <span class="text-blue-600 underline decoration-blue-300/60 underline-offset-8">{{ $lastWord }}</span>
                    @endif
                </h1>

                <!-- Subtitle / Bio -->
                <p class="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                    {{ $heroSubtitle }}
                </p>

                <!-- Feature Icons / Pills Grid -->
                @if(!empty($heroPills) && is_array($heroPills))
                    <div class="flex flex-wrap items-center gap-2.5 pt-1">
                        @foreach($heroPills as $pill)
                            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-zinc-200/90 text-zinc-800 text-xs font-bold shadow-2xs hover:border-blue-400 transition">
                                <span class="text-sm">{{ $pill['icon'] ?? '⚡' }}</span>
                                <span>{{ $pill['label'] ?? '' }}</span>
                            </div>
                        @endforeach
                    </div>
                @endif

                <!-- CTA Action Buttons -->
                <div class="flex flex-wrap items-center gap-3.5 pt-2">
                    <a href="{{ $heroBtnUrl }}" class="px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-sm transition-all duration-200 shadow-lg shadow-blue-600/25 hover:scale-[1.02] flex items-center gap-2 group">
                        <span>{{ $heroBtnText }}</span>
                        <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </a>
                    <a href="{{ $heroBtn2Url }}" class="px-6 py-3.5 bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200/90 font-bold rounded-2xl text-sm transition shadow-2xs hover:border-zinc-300 flex items-center gap-2">
                        <span>{{ $heroBtn2Text }}</span>
                        <svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </a>
                </div>
            </div>

            <!-- Right Showcase Visual -->
            <div class="lg:col-span-5 relative flex items-center justify-center">
                <div class="relative w-full max-w-lg aspect-4/3 sm:aspect-square flex items-center justify-center">
                    @if(!empty($heroImage))
                        <img src="{{ asset('storage/' . $heroImage) }}" 
                             alt="{{ $heroTitle }}" 
                             class="max-w-full max-h-full object-contain drop-shadow-2xl transition duration-500 hover:scale-105">
                    @else
                        <!-- Sleek Gadget Collage matching uploaded mockup -->
                        <div class="relative w-full h-full flex items-center justify-center">
                            <!-- Background Circular Ambient Frame -->
                            <div class="w-72 sm:w-88 h-72 sm:h-88 rounded-full bg-gradient-to-tr from-blue-200/50 via-sky-100/40 to-white border border-blue-200/60 shadow-inner flex items-center justify-center relative">
                                <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80" 
                                     alt="Smartwatch & Audio Devices" 
                                     class="w-4/5 h-4/5 object-contain drop-shadow-2xl rounded-2xl transition duration-500 hover:scale-105">
                            </div>

                            <!-- Floating Spec Tag Left -->
                            <div class="absolute top-4 -left-2 sm:left-2 bg-white/95 backdrop-blur-md border border-zinc-200/90 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold text-zinc-900 animate-pulse" style="animation-duration: 4s;">
                                <span class="text-blue-600 font-extrabold text-sm">⚡</span>
                                <div>
                                    <span class="block text-[10px] text-zinc-400 font-medium leading-none">Fast Protocol</span>
                                    <span class="block text-xs font-black">65W GaN Charger</span>
                                </div>
                            </div>

                            <!-- Floating Spec Tag Right -->
                            <div class="absolute bottom-6 -right-2 sm:right-2 bg-white/95 backdrop-blur-md border border-zinc-200/90 px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold text-zinc-900">
                                <span class="text-emerald-500 font-extrabold text-sm">🎧</span>
                                <div>
                                    <span class="block text-[10px] text-zinc-400 font-medium leading-none">Hi-Res ANC</span>
                                    <span class="block text-xs font-black">Active Cancellation</span>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </section>

    <!-- 2. 4 Floating Trust Cards Strip -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Perk 1 -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex items-center gap-4 group">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition">
                🛡️
            </div>
            <div>
                <h4 class="text-xs sm:text-sm font-black text-zinc-900">{{ $perk1Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5 leading-snug">{{ $perk1Desc }}</p>
            </div>
        </div>

        <!-- Perk 2 -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex items-center gap-4 group">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition">
                🚚
            </div>
            <div>
                <h4 class="text-xs sm:text-sm font-black text-zinc-900">{{ $perk2Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5 leading-snug">{{ $perk2Desc }}</p>
            </div>
        </div>

        <!-- Perk 3 -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex items-center gap-4 group">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition">
                🔄
            </div>
            <div>
                <h4 class="text-xs sm:text-sm font-black text-zinc-900">{{ $perk3Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5 leading-snug">{{ $perk3Desc }}</p>
            </div>
        </div>

        <!-- Perk 4 -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex items-center gap-4 group">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition">
                💳
            </div>
            <div>
                <h4 class="text-xs sm:text-sm font-black text-zinc-900">{{ $perk4Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5 leading-snug">{{ $perk4Desc }}</p>
            </div>
        </div>
    </section>

    <!-- 3. Category Showcase Grid ("Smart Gadget Categories") -->
    @if($catSectionEnabled)
        <section id="categories" class="scroll-mt-24 space-y-6">
            <!-- Centered Header -->
            <div class="text-center max-w-2xl mx-auto space-y-1.5">
                <span class="text-xs font-black uppercase tracking-widest text-blue-600 block">
                    {{ $catSectionBadge }}
                </span>
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight">
                    {{ $catSectionTitle }}
                </h2>
                <p class="text-xs sm:text-sm text-zinc-500 font-medium">
                    {{ $catSectionSubtitle }}
                </p>
            </div>

            <!-- Categories Grid (6 Cards) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                @php
                    $displayCats = $categories->take(6);
                    // Default fallback categories if database categories are fewer than 6
                    $fallbackCats = [
                        ['name' => 'Audio & Earphones', 'slug' => 'audio-earphones', 'desc' => 'High-fidelity wireless sound, earbuds & noise-cancelling headphones.', 'badge' => 'POPULAR'],
                        ['name' => 'Chargers & Power', 'slug' => 'chargers-power', 'desc' => '65W GaN fast chargers, magnetic wireless docks & certified cables.', 'badge' => '50W FAST'],
                        ['name' => 'Mobile & Accessories', 'slug' => 'mobile-smartphone-accessories', 'desc' => 'Shockproof cases, tempered glass & magnetic car mounts.', 'badge' => 'NEW'],
                        ['name' => 'Power Bank & Battery', 'slug' => 'power-bank-portable-power', 'desc' => 'High-capacity 20,000mAh PD fast charging power banks.', 'badge' => 'GENUINE'],
                        ['name' => 'Storage & Memory', 'slug' => 'storage-memory', 'desc' => 'High-speed UHS-I micro SD cards & USB 3.2 flash drives.', 'badge' => 'FAST'],
                        ['name' => 'Smart Wearables', 'slug' => 'smart-wearables', 'desc' => 'AMOLED smartwatches, fitness bands & replacement straps.', 'badge' => 'HOT'],
                    ];
                @endphp

                @if($displayCats->count() > 0)
                    @foreach($displayCats as $idx => $cItem)
                        @php
                            $cImg = $cItem->image ? asset('storage/' . $cItem->image) : ($categoryVisuals[$cItem->slug] ?? $fallbackCategoryImages[$idx % count($fallbackCategoryImages)]);
                            $badgeTag = match($idx % 4) {
                                0 => 'POPULAR',
                                1 => '50W FAST',
                                2 => 'GENUINE',
                                default => 'HOT',
                            };
                        @endphp
                        <a href="{{ route('storefront.home', ['category' => $cItem->slug]) }}" 
                           class="relative h-64 rounded-3xl overflow-hidden group shadow-xs hover:shadow-xl transition-all duration-300 border border-zinc-200/80 flex flex-col justify-end p-6">
                            <!-- Background Image with Zoom on Hover -->
                            <img src="{{ $cImg }}" 
                                 alt="{{ $cItem->name }}" 
                                 class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                            <!-- Dark Gradient Overlay -->
                            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>

                            <!-- Top Tag Badge -->
                            <div class="absolute top-4 left-4">
                                <span class="px-2.5 py-1 rounded-lg bg-blue-600/90 text-white font-black text-[10px] uppercase tracking-wider shadow-sm">
                                    {{ $badgeTag }}
                                </span>
                            </div>

                            <!-- Content at Bottom -->
                            <div class="relative space-y-1.5 text-white">
                                <h3 class="text-lg font-black tracking-tight text-white group-hover:text-blue-300 transition leading-snug">
                                    {{ $cItem->name }}
                                </h3>
                                <p class="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                                    {{ $cItem->description ?: 'Explore genuine accessories & gear curated for this category.' }}
                                </p>
                                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300 pt-1">
                                    <span>Explore Now</span>
                                    <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </span>
                            </div>
                        </a>
                    @endforeach
                @else
                    @foreach($fallbackCats as $idx => $fCat)
                        <a href="{{ route('storefront.home') }}" 
                           class="relative h-64 rounded-3xl overflow-hidden group shadow-xs hover:shadow-xl transition-all duration-300 border border-zinc-200/80 flex flex-col justify-end p-6">
                            <img src="{{ $fallbackCategoryImages[$idx] }}" 
                                 alt="{{ $fCat['name'] }}" 
                                 class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
                            <div class="absolute top-4 left-4">
                                <span class="px-2.5 py-1 rounded-lg bg-blue-600/90 text-white font-black text-[10px] uppercase tracking-wider shadow-sm">
                                    {{ $fCat['badge'] }}
                                </span>
                            </div>
                            <div class="relative space-y-1.5 text-white">
                                <h3 class="text-lg font-black tracking-tight text-white group-hover:text-blue-300 transition leading-snug">
                                    {{ $fCat['name'] }}
                                </h3>
                                <p class="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                                    {{ $fCat['desc'] }}
                                </p>
                                <span class="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300 pt-1">
                                    <span>Explore Now</span>
                                    <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </span>
                            </div>
                        </a>
                    @endforeach
                @endif
            </div>
        </section>
    @endif

    <!-- 4. Featured Gadgets Section ("Featured Products") -->
    @if($featSectionEnabled)
        <section id="featured-gadgets" class="scroll-mt-24 space-y-5">
            <!-- Header with Title & Action Link -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200/90 pb-4">
                <div>
                    <span class="text-xs font-black uppercase tracking-wider text-blue-600 block">
                        {{ $featSectionBadge }}
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-0.5">
                        {{ $featSectionTitle }}
                    </h2>
                </div>
                <a href="#all-products" class="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
                    <span>{{ $featSectionLinkText }}</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
            </div>

            <!-- 4-Column Product Grid -->
            @php
                $fList = $featuredProducts ?? collect();
            @endphp

            @if($fList->count() > 0)
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    @foreach($fList as $pItem)
                        @include('storefront.partials.product_card', ['product' => $pItem, 'currPrefix' => $currPrefix, 'badgeText' => 'HOT'])
                    @endforeach
                </div>
            @else
                <div class="bg-white rounded-2xl p-8 text-center border border-zinc-200 text-zinc-500 text-xs">
                    No featured products added yet.
                </div>
            @endif
        </section>
    @endif

    <!-- 5. Mid-Page High-Impact Promo Banner ("The Ultimate Mobile Gaming Setup 2026") -->
    @if($promoEnabled)
        <section class="relative bg-white border border-zinc-200/90 rounded-[32px] overflow-hidden shadow-xl shadow-zinc-200/50">
            <div class="grid grid-cols-1 lg:grid-cols-12 items-center">
                <!-- Left Visual (Gaming Controller in Hands / Promo Image) -->
                <div class="lg:col-span-5 h-72 sm:h-96 lg:h-full relative overflow-hidden bg-zinc-100 flex items-center justify-center">
                    @if(!empty($promoImage))
                        <img src="{{ asset('storage/' . $promoImage) }}" 
                             alt="{{ $promoTitle }}" 
                             class="w-full h-full object-cover">
                    @else
                        <img src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80" 
                             alt="Mobile Gaming Controller Setup" 
                             class="w-full h-full object-cover">
                    @endif
                    <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-transparent to-white/40"></div>
                </div>

                <!-- Right Copy & Action CTA -->
                <div class="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4">
                    <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wider">
                        {{ $promoBadge }}
                    </span>

                    <h2 class="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight leading-tight">
                        {{ $promoTitle }}
                    </h2>

                    <p class="text-zinc-600 text-xs sm:text-sm leading-relaxed max-w-xl font-medium">
                        {{ $promoDesc }}
                    </p>

                    <div class="pt-3">
                        <a href="{{ $promoBtnUrl }}" class="inline-flex items-center gap-2 px-6 py-3.5 bg-zinc-950 hover:bg-zinc-800 text-white font-black text-xs sm:text-sm rounded-xl transition shadow-lg hover:scale-[1.02]">
                            <span>{{ $promoBtnText }}</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    @endif

    <!-- 6. New Arrivals Section ("New Gadget Drops") -->
    @if($newDropsEnabled)
        <section id="new-drops" class="scroll-mt-24 space-y-5">
            <!-- Header with Title & Action Link -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200/90 pb-4">
                <div>
                    <span class="text-xs font-black uppercase tracking-wider text-blue-600 block">
                        {{ $newDropsBadge }}
                    </span>
                    <h2 class="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-0.5">
                        {{ $newDropsTitle }}
                    </h2>
                    <p class="text-xs text-zinc-500 font-medium mt-1">
                        {{ $newDropsSubtitle }}
                    </p>
                </div>
                <a href="#all-products" class="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
                    <span>{{ $newDropsLinkText }}</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
            </div>

            <!-- 4-Column New Drops Grid -->
            @php
                $nList = $newArrivals ?? collect();
            @endphp

            @if($nList->count() > 0)
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    @foreach($nList as $nItem)
                        @include('storefront.partials.product_card', ['product' => $nItem, 'currPrefix' => $currPrefix, 'badgeText' => 'NEW'])
                    @endforeach
                </div>
            @endif
        </section>
    @endif

    <!-- 7. VIP / First-Order Discount Coupon Banner ("Save 10% On Your First Order") -->
    @if($couponEnabled)
        <section class="relative bg-gradient-to-r from-zinc-950 via-slate-950 to-blue-950 text-white rounded-[32px] p-8 sm:p-12 text-center overflow-hidden shadow-2xl border border-blue-900/40">
            <!-- Ambient Glow -->
            <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative max-w-2xl mx-auto space-y-4" x-data="{ copied: false }">
                <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 tracking-wider uppercase">
                    {{ $couponBadge }}
                </span>

                <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-white">
                    {{ $couponTitle }}
                </h2>

                <p class="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                    {{ $couponDesc }}
                </p>

                <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button type="button" 
                            x-on:click="navigator.clipboard.writeText('{{ $couponCode }}'); copied = true; setTimeout(() => copied = false, 3000)"
                            class="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-sm transition-transform shadow-lg hover:scale-105 flex items-center gap-2 cursor-pointer">
                        <span x-text="copied ? '✓ COUPON COPIED: {{ $couponCode }}' : '{{ $couponBtnText }} ({{ $couponCode }})'"></span>
                    </button>
                </div>
            </div>
        </section>
    @endif

    <!-- 8. Service Highlights Strip & Official Payment Badges -->
    @if($serviceStripEnabled)
        <section class="space-y-8 pt-4">
            <!-- 4 Service Highlight Pillars -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                        ⚡
                    </div>
                    <div>
                        <h4 class="text-xs sm:text-sm font-black text-zinc-900">{{ $service1Title }}</h4>
                        <p class="text-[11px] text-zinc-500 mt-0.5 leading-snug">{{ $service1Desc }}</p>
                    </div>
                </div>

                <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                        🛡️
                    </div>
                    <div>
                        <h4 class="text-xs sm:text-sm font-black text-zinc-900">{{ $service2Title }}</h4>
                        <p class="text-[11px] text-zinc-500 mt-0.5 leading-snug">{{ $service2Desc }}</p>
                    </div>
                </div>

                <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                        💬
                    </div>
                    <div>
                        <h4 class="text-xs sm:text-sm font-black text-zinc-900">{{ $service3Title }}</h4>
                        <p class="text-[11px] text-zinc-500 mt-0.5 leading-snug">{{ $service3Desc }}</p>
                    </div>
                </div>

                <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0">
                        💳
                    </div>
                    <div>
                        <h4 class="text-xs sm:text-sm font-black text-zinc-900">{{ $service4Title }}</h4>
                        <p class="text-[11px] text-zinc-500 mt-0.5 leading-snug">{{ $service4Desc }}</p>
                    </div>
                </div>
            </div>

            <!-- Official Bangladesh Payment Gateway Partners Bar -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                <span class="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 flex-shrink-0">
                    <span>🔒</span>
                    <span>100% Secure Payment Partners</span>
                </span>

                <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold">
                    <span class="px-3 py-1.5 rounded-lg bg-pink-50 border border-pink-200 text-pink-700 font-extrabold flex items-center gap-1">
                        bKash
                    </span>
                    <span class="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 font-extrabold flex items-center gap-1">
                        Nagad
                    </span>
                    <span class="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-extrabold flex items-center gap-1">
                        Rocket
                    </span>
                    <span class="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-extrabold flex items-center gap-1">
                        Upay
                    </span>
                    <span class="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-extrabold flex items-center gap-1">
                        VISA / Mastercard
                    </span>
                    <span class="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold flex items-center gap-1">
                        💵 Cash on Delivery
                    </span>
                </div>
            </div>
        </section>
    @endif

    <!-- 9. Full Storefront Catalog & Filtered Results Section -->
    <section id="all-products" class="scroll-mt-24 space-y-6 pt-4">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-200/90 pb-4">
            <div>
                <h2 class="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                    {{ request('search') ? 'Search: "' . request('search') . '"' : (request('category') ? 'Category: ' . ucfirst(request('category')) : (request('brand') ? 'Brand: ' . ucfirst(request('brand')) : 'All Store Products')) }}
                </h2>
                <span class="text-xs text-zinc-500 font-medium">Showing {{ $products->total() }} total items</span>
            </div>
            @if($isFiltering)
                <a href="{{ route('storefront.home') }}" class="text-xs font-bold text-rose-600 hover:underline">
                    ✕ Reset All Filters
                </a>
            @endif
        </div>

        @if($products->isEmpty())
            <div class="bg-white rounded-3xl p-12 text-center border border-zinc-200 my-4 shadow-xs">
                <div class="w-16 h-16 mx-auto mb-3 text-4xl">🛍️</div>
                <h3 class="text-base font-bold text-zinc-900">No Products Found</h3>
                <p class="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                    We could not find any items matching your selected criteria.
                </p>
                <a href="{{ route('storefront.home') }}" class="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition">
                    View All Products
                </a>
            </div>
        @else
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                @foreach($products as $product)
                    @include('storefront.partials.product_card', ['product' => $product, 'currPrefix' => $currPrefix, 'badgeText' => 'POPULAR'])
                @endforeach
            </div>

            <!-- Pagination Links -->
            <div class="mt-8 flex justify-center">
                {{ $products->links() }}
            </div>
        @endif
    </section>

</div>
