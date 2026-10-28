<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @php
        $category = tenant('business_category') ?? 'default';
        $archetype = tenant('archetype') ?? 'physical_store';
        $categoryDefaults = config("business_presets.category_defaults.{$category}")
            ?? config("business_presets.category_defaults.default", []);

        $creds = tenant('gateway_credentials') ?? [];
        $tenantBranding = tenant('branding') ?? $creds['branding'] ?? [];
        $branding = array_merge($categoryDefaults, array_filter((array)$tenantBranding, fn($v) => !is_null($v) && $v !== ''));

        $storeName = $branding['store_name'] ?? (tenant('name') ?? 'Official Store');
        $storeTagline = $branding['store_tagline'] ?? ($categoryDefaults['store_tagline'] ?? 'Official Online Store');
        $storeLogo = $branding['store_logo'] ?? null;
        $primaryColorHex = $branding['primary_color'] ?? ($categoryDefaults['theme_color'] ?? '#2563eb');
        $currency = $branding['currency_symbol'] ?? 'BDT';

        $topAnnouncement = $branding['top_announcement'] ?? ($categoryDefaults['top_announcement'] ?? '✨ Welcome to our official online store!');
        $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
        $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
        $supportHours = $branding['support_hours'] ?? 'Mon - Sun: 9:00 AM - 10:00 PM';
        $showroomDhaka = $branding['showroom_address'] ?? ($branding['office_address'] ?? 'Dhaka, Bangladesh');
        $showroomCtg = $branding['showroom_address_branch'] ?? null;
        $waDigits = preg_replace('/[^0-9]/', '', $whatsapp);
        if (str_starts_with($waDigits, '01')) {
            $waDigits = '88' . $waDigits;
        }
        $footerAbout = $branding['footer_about'] ?? ($categoryDefaults['footer_about'] ?? 'Premier online storefront offering verified quality, secure checkout, and prompt nationwide delivery.');

        $catIcon = match($category) {
            'fashion_clothing', 'shoes_footwear' => '👗',
            'restaurant', 'bakery_pastry' => '🍽️',
            'doctor', 'barber_salon' => '🩺',
            'real_estate', 'house_rental' => '🏢',
            'pharmacy' => '💊',
            'mobile_gadgets', 'laptop_computer' => '💻',
            default => '🛍️',
        };

        $drawerCategories = \App\Models\Category::where('is_active', true)
            ->whereNull('parent_id')
            ->with(['children' => fn($q) => $q->where('is_active', true)->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        $drawerBrands = \Illuminate\Support\Facades\Schema::hasTable('brands')
            ? \App\Models\Brand::where('is_active', true)->orderBy('sort_order')->take(20)->get()
            : collect();
    @endphp
    <title>{{ $storeName }} - {{ $storeTagline }}</title>
    <!-- Tailwind Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Alpine.js Core for Storefront Reactivity -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --theme-primary: {{ $primaryColorHex }};
            --theme-primary-hover: {{ $primaryColorHex }}ee;
        }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .bg-theme-primary { background-color: var(--theme-primary) !important; }
        .text-theme-primary { color: var(--theme-primary) !important; }
        .border-theme-primary { border-color: var(--theme-primary) !important; }
        .hover\:bg-theme-primary:hover { background-color: var(--theme-primary) !important; }
        .hover\:text-theme-primary:hover { color: var(--theme-primary) !important; }
        .ring-theme-primary { --tw-ring-color: var(--theme-primary) !important; }
        [x-cloak] { display: none !important; }

        @media print {
            header, footer, .no-print {
                display: none !important;
            }
        }
    </style>
</head>
<body x-data="{ mobileMenuOpen: false }" class="bg-zinc-50 text-zinc-900 antialiased flex flex-col min-h-screen">

    <!-- Top Announcement Bar -->
    <div class="bg-zinc-950 text-zinc-300 text-xs py-2 px-4 border-b border-zinc-800 print:hidden">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div class="flex items-center gap-2 font-medium">
                <span class="text-amber-400 font-bold">{{ $topAnnouncement }}</span>
            </div>
            <div class="flex items-center gap-4 text-zinc-400 font-medium">
                <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    Hotline: <a href="tel:{{ $hotline }}" class="text-white hover:text-amber-400 font-bold transition">{{ $hotline }}</a>
                </span>
                <span class="hidden md:inline text-zinc-600">|</span>
                <span class="hidden md:flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Hours: {{ $supportHours }}
                </span>
            </div>
        </div>
    </div>

    <!-- Main Navigation Header -->
    <header class="bg-white border-b border-zinc-200 sticky top-0 z-50 print:hidden shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            
            <div class="flex items-center gap-3 flex-shrink-0">
                <!-- Hamburger Drawer Toggle Button -->
                <button type="button" 
                        x-on:click="mobileMenuOpen = true"
                        class="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-extrabold text-xs transition border border-zinc-200/90 shadow-2xs cursor-pointer group"
                        title="Open Menu & Categories">
                    <svg class="w-5 h-5 text-zinc-800 transition group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                    <span class="hidden md:inline font-black uppercase tracking-wider text-[11px]">মেনু</span>
                </button>

                <!-- Store Logo & Identity -->
                <a href="{{ route('storefront.home') }}" class="flex items-center gap-2.5 flex-shrink-0 group">
                    @if(!empty($storeLogo))
                        <img src="{{ asset('storage/' . $storeLogo) }}" alt="{{ $storeName }}" class="h-10 w-auto object-contain">
                    @else
                        <div class="w-10 h-10 rounded-xl bg-theme-primary flex items-center justify-center text-white font-black text-xl shadow-md transition group-hover:scale-105">
                            {{ $catIcon }}
                        </div>
                    @endif
                    <div>
                        <span class="text-base sm:text-xl font-black tracking-tight text-zinc-950 uppercase block leading-none">
                            {{ $storeName }}
                        </span>
                        <span class="text-[10px] text-zinc-500 font-semibold tracking-wider block mt-0.5">
                            {{ $storeTagline }}
                        </span>
                    </div>
                </a>
            </div>

            @php
                $searchPlaceholder = match($category) {
                    'real_estate', 'house_rental' => 'Search location, property, ready flat or plot...',
                    'fashion_clothing', 'shoes_footwear' => 'Search clothing, dress, panjabi, saree or collection...',
                    'restaurant', 'bakery_pastry' => 'Search food items, platters, burgers, meals or drinks...',
                    'doctor', 'barber_salon' => 'Search doctor, specialist, chamber or service...',
                    'pharmacy' => 'Search medicine, generic name, healthcare equipment...',
                    'mobile_gadgets' => 'Search smartphone, brand, smartwatch, accessories...',
                    'laptop_computer' => 'Search laptop model, processor, brand (e.g. ThinkPad, MacBook)...',
                    default => 'Search products, brands or catalog...',
                };
            @endphp
            <!-- Search Bar -->
            <form action="{{ route('storefront.home') }}" method="GET" class="hidden md:flex items-center flex-1 max-w-lg mx-6">
                <div class="relative w-full flex items-center">
                    <input type="text" name="search" value="{{ request('search') }}" 
                           placeholder="{{ $searchPlaceholder }}" 
                           class="w-full bg-zinc-100/80 border border-zinc-300 rounded-xl py-2 pl-4 pr-12 text-xs sm:text-sm focus:outline-none focus:border-theme-primary focus:bg-white transition shadow-inner">
                    <button type="submit" class="absolute right-1.5 bg-theme-primary text-white p-1.5 rounded-lg transition hover:opacity-90">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                </div>
            </form>

            <!-- Quick Contacts & Admin Link -->
            <div class="flex items-center gap-3">
                <a href="tel:{{ $hotline }}" class="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl hover:bg-zinc-100 transition">
                    <div class="w-7 h-7 rounded-lg bg-theme-primary text-white flex items-center justify-center">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </div>
                    <div class="text-left">
                        <span class="block text-[9px] text-zinc-500 uppercase font-bold leading-tight">Order Hotline</span>
                        <span class="block text-xs font-black text-zinc-900 leading-tight">{{ $hotline }}</span>
                    </div>
                </a>

                <a href="/admin" target="_blank" class="text-xs bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs">
                    <svg class="w-3.5 h-3.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span>Merchant Admin</span>
                </a>
            </div>
        </div>

        <!-- Sub-Navigation Bar -->
        <div class="bg-zinc-900 text-white text-xs border-t border-zinc-800">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-4">
                <div class="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                    <!-- Highlighted Category & Brand Quick Drawer Button -->
                    <button type="button" 
                            x-on:click="mobileMenuOpen = true"
                            class="px-3.5 py-1.5 rounded-lg bg-theme-primary font-black text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer hover:opacity-90 flex-shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
                        <span>সব ক্যাটাগরি ও ব্র্যান্ড</span>
                    </button>

                    @php
                        $navItems = $branding['nav_items'] ?? ($categoryDefaults['nav_items'] ?? []);
                        $currentUrl = request()->fullUrl();
                        $currentSearch = request('search');
                    @endphp
                    @forelse($navItems as $index => $item)
                        @php
                            $label = $item['label'] ?? '';
                            $url = $item['url'] ?? route('storefront.home');
                            $icon = $item['icon'] ?? '';
                            
                            $isActive = false;
                            if ($index === 0 && empty($currentSearch) && (request()->routeIs('storefront.home') && empty(request()->query()))) {
                                $isActive = true;
                            } elseif (!empty($currentSearch) && str_contains(strtolower($url), strtolower($currentSearch))) {
                                $isActive = true;
                            } elseif ($url === $currentUrl) {
                                $isActive = true;
                            }
                        @endphp
                        <a href="{{ $url }}" class="px-3 py-1 rounded-lg {{ $isActive ? 'bg-zinc-800 font-bold text-white shadow-xs border border-zinc-700' : 'hover:bg-zinc-800 text-zinc-300' }} transition flex items-center gap-1.5">
                            @if(!empty($icon))
                                <span>{{ $icon }}</span>
                            @endif
                            <span>{{ $label }}</span>
                        </a>
                    @empty
                        <a href="{{ route('storefront.home') }}" class="px-3 py-1 rounded-lg hover:bg-zinc-800 text-zinc-300 transition">
                            {{ $catIcon }} All Items
                        </a>
                    @endforelse
                </div>
                <div class="hidden sm:flex items-center gap-3 text-zinc-400 whitespace-nowrap text-[11px] font-semibold">
                    @php
                        $trust1 = $branding['nav_trust_tag_1'] ?? ($categoryDefaults['nav_trust_tag_1'] ?? null);
                        $trust2 = $branding['nav_trust_tag_2'] ?? ($categoryDefaults['nav_trust_tag_2'] ?? null);
                    @endphp
                    @if(!empty($trust1))
                        <span class="text-emerald-400 font-bold">{{ $trust1 }}</span>
                    @endif
                    @if(!empty($trust2))
                        <span>{{ $trust2 }}</span>
                    @endif
                </div>
            </div>
        </div>
    </header>

    <!-- Slide-Over Hamburger Drawer (Full Categories, Brands & Quick Concierge) -->
    <div x-cloak x-show="mobileMenuOpen" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="drawer-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div x-show="mobileMenuOpen" 
             x-transition:enter="ease-in-out duration-300"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             x-transition:leave="ease-in-out duration-300"
             x-transition:leave-start="opacity-100"
             x-transition:leave-end="opacity-0"
             x-on:click="mobileMenuOpen = false"
             class="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs transition-opacity"></div>

        <div class="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <!-- Drawer Panel -->
            <div x-show="mobileMenuOpen" 
                 x-transition:enter="transform transition ease-in-out duration-300"
                 x-transition:enter-start="-translate-x-full"
                 x-transition:enter-end="translate-x-0"
                 x-transition:leave="transform transition ease-in-out duration-300"
                 x-transition:leave-start="translate-x-0"
                 x-transition:leave-end="-translate-x-full"
                 class="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col h-full border-r border-zinc-200">
                
                <!-- Drawer Header -->
                <div class="p-4 sm:p-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
                    <div class="flex items-center gap-3">
                        @if(!empty($storeLogo))
                            <img src="{{ asset('storage/' . $storeLogo) }}" alt="{{ $storeName }}" class="h-9 w-auto object-contain">
                        @else
                            <div class="w-9 h-9 rounded-xl bg-theme-primary flex items-center justify-center text-white font-black text-lg shadow-sm">
                                {{ $catIcon }}
                            </div>
                        @endif
                        <div>
                            <span class="font-black text-sm uppercase tracking-wide block text-white">{{ $storeName }}</span>
                            <span class="text-[10px] text-zinc-400 block">{{ $storeTagline }}</span>
                        </div>
                    </div>
                    <button type="button" 
                            x-on:click="mobileMenuOpen = false" 
                            class="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <!-- Drawer Scrollable Body -->
                <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                    
                    <!-- Search Bar Inside Drawer -->
                    <form action="{{ route('storefront.home') }}" method="GET" class="relative">
                        <input type="text" name="search" placeholder="Search catalog, brands or products..."
                               class="w-full bg-zinc-100 border border-zinc-300 rounded-xl py-2.5 pl-4 pr-10 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-theme-primary transition shadow-inner">
                        <button type="submit" class="absolute right-2.5 top-2.5 text-zinc-400 hover:text-theme-primary transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </button>
                    </form>

                    <!-- Section 1: Shop by Categories (সব ক্যাটাগরি) -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
                            <span class="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                                <span>📂</span>
                                <span>সব ক্যাটাগরি (All Categories)</span>
                            </span>
                            <span class="text-[10px] font-bold text-zinc-400">{{ $drawerCategories->count() }} টি ক্যাটাগরি</span>
                        </div>

                        <div class="space-y-1">
                            @forelse($drawerCategories as $dCat)
                                <div x-data="{ expanded: false }" class="border border-zinc-200/70 rounded-xl overflow-hidden bg-zinc-50/60 transition">
                                    <div class="flex items-center justify-between p-2.5 hover:bg-zinc-100 transition">
                                        <a href="{{ route('storefront.home', ['category' => $dCat->slug]) }}" 
                                           class="text-xs font-bold text-zinc-900 flex items-center gap-2 hover:text-theme-primary transition truncate">
                                            @if($dCat->image)
                                                <img src="{{ asset('storage/' . $dCat->image) }}" class="w-6 h-6 rounded-md object-cover flex-shrink-0" alt="{{ $dCat->name }}">
                                            @else
                                                <span class="text-sm">📁</span>
                                            @endif
                                            <span class="truncate">{{ $dCat->name }}</span>
                                        </a>

                                        @if($dCat->children->count() > 0)
                                            <button type="button" x-on:click="expanded = !expanded" class="p-1 text-zinc-400 hover:text-zinc-800 cursor-pointer">
                                                <svg class="w-4 h-4 transition-transform duration-200" :class="expanded ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                                            </button>
                                        @endif
                                    </div>

                                    @if($dCat->children->count() > 0)
                                        <div x-show="expanded" class="p-2.5 pl-8 bg-white border-t border-zinc-100 space-y-1 text-xs text-zinc-600">
                                            @foreach($dCat->children as $cChild)
                                                <a href="{{ route('storefront.home', ['category' => $cChild->slug]) }}" 
                                                   class="block py-1 hover:text-theme-primary font-medium transition">
                                                    • {{ $cChild->name }}
                                                </a>
                                            @endforeach
                                        </div>
                                    @endif
                                </div>
                            @empty
                                <a href="{{ route('storefront.home') }}" class="block p-3 text-xs text-zinc-500 bg-zinc-50 rounded-xl">
                                    All Store Products
                                </a>
                            @endforelse
                        </div>
                    </div>

                    <!-- Section 2: Shop by Brands (ব্র্যান্ড সমূহ) -->
                    @if($drawerBrands->count() > 0)
                        <div class="space-y-3">
                            <div class="flex items-center justify-between border-b border-zinc-100 pb-2">
                                <span class="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                                    <span>🏷️</span>
                                    <span>টপ ব্র্যান্ড সমূহ (Popular Brands)</span>
                                </span>
                                <span class="text-[10px] font-bold text-zinc-400">{{ $drawerBrands->count() }} টি ব্র্যান্ড</span>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                @foreach($drawerBrands as $dBrand)
                                    <a href="{{ route('storefront.home', ['brand' => $dBrand->slug]) }}" 
                                       class="p-2 rounded-xl border border-zinc-200 hover:border-theme-primary hover:bg-zinc-50 transition flex items-center gap-2 group">
                                        @if($dBrand->logo)
                                            <img src="{{ asset('storage/' . $dBrand->logo) }}" class="w-7 h-7 rounded-lg object-contain border border-zinc-100 p-0.5 flex-shrink-0" alt="{{ $dBrand->name }}">
                                        @else
                                            <div class="w-7 h-7 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                                                {{ substr($dBrand->name, 0, 1) }}
                                            </div>
                                        @endif
                                        <div class="truncate">
                                            <span class="block text-xs font-bold text-zinc-900 truncate group-hover:text-theme-primary">{{ $dBrand->name }}</span>
                                        </div>
                                    </a>
                                @endforeach
                            </div>
                        </div>
                    @endif

                    <!-- Section 3: Perks & Policies -->
                    <div class="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-2 text-xs text-zinc-700">
                        <div class="flex items-center gap-2 font-black text-zinc-900">
                            <span>⚡</span>
                            <span>অর্ডার ও সেবা পলিসি</span>
                        </div>
                        <ul class="space-y-1 text-[11px] text-zinc-600 font-medium">
                            <li class="flex items-center gap-1.5">
                                <span class="text-emerald-600 font-bold">✓</span>
                                <span>ক্যাশ অন ডেলিভারি (পণ্য দেখে পেমেন্ট)</span>
                            </li>
                            <li class="flex items-center gap-1.5">
                                <span class="text-blue-600 font-bold">✓</span>
                                <span>২৪-৪৮ ঘণ্টায় দ্রুত দেশব্যাপী ডেলিভারি</span>
                            </li>
                            <li class="flex items-center gap-1.5">
                                <span class="text-purple-600 font-bold">✓</span>
                                <span>সহজ রিপ্লেসমেন্ট ও এক্সচেঞ্জ গ্যারান্টি</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Section 4: Hotline & WhatsApp Concierge -->
                    <div class="space-y-2 pt-2 border-t border-zinc-100">
                        <span class="text-xs font-black uppercase text-zinc-900 block">সরাসরি কথা বলতে কল বা চ্যাট করুন</span>
                        <div class="grid grid-cols-2 gap-2">
                            <a href="tel:{{ $hotline }}" class="p-2.5 bg-zinc-900 text-white rounded-xl text-center text-xs font-bold hover:bg-zinc-800 transition flex items-center justify-center gap-1.5 shadow-xs">
                                <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                <span>কল করুন</span>
                            </a>
                            <a href="https://wa.me/{{ $waDigits }}?text={{ urlencode('Hello, I want to order from ' . $storeName) }}" target="_blank"
                               class="p-2.5 bg-emerald-600 text-white rounded-xl text-center text-xs font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-xs">
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    <!-- Merchant Admin Shortcut -->
                    <div class="pt-1 pb-4">
                        <a href="/admin" target="_blank" class="block w-full text-center py-2 px-3 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-xs font-bold transition">
                            🔐 Merchant Admin Login
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1">
        @yield('content')
    </main>

    <!-- Professional 4-Column Footer -->
    <footer class="bg-zinc-950 text-zinc-400 text-sm mt-16 border-t border-zinc-800 print:hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Column 1: Store Showrooms -->
                <div class="space-y-4">
                    <div class="flex items-center gap-2.5">
                        @if(!empty($storeLogo))
                            <img src="{{ asset('storage/' . $storeLogo) }}" alt="{{ $storeName }}" class="h-8 w-auto">
                        @else
                            <div class="w-8 h-8 rounded-lg bg-theme-primary text-white flex items-center justify-center font-bold text-sm">
                                {{ $catIcon }}
                            </div>
                        @endif
                        <span class="text-lg font-black text-white uppercase">{{ $storeName }}</span>
                    </div>
                    <p class="text-xs text-zinc-400 leading-relaxed">
                        {{ $footerAbout }}
                    </p>
                    <div class="space-y-2 pt-1 text-xs">
                        <div class="flex items-start gap-2">
                            <span class="text-amber-400 font-bold">🏢 Address:</span>
                            <span class="text-zinc-300">{{ $showroomDhaka }}</span>
                        </div>
                        @if(!empty($showroomCtg))
                            <div class="flex items-start gap-2">
                                <span class="text-amber-400 font-bold">🏢 Branch:</span>
                                <span class="text-zinc-300">{{ $showroomCtg }}</span>
                            </div>
                        @endif
                    </div>
                </div>

                <!-- Column 2: Legal & Customer Policies -->
                <div class="space-y-3">
                    <h3 class="text-white font-bold text-sm tracking-wider uppercase border-b border-zinc-800 pb-2">Policies & Support</h3>
                    <ul class="space-y-2 text-xs">
                        <li><a href="{{ route('storefront.terms') }}" class="hover:text-white transition">Terms & Conditions (শর্তাবলী)</a></li>
                        <li><a href="{{ route('storefront.refund') }}" class="hover:text-white transition">Return, Replacement & Refund Policy</a></li>
                        <li><a href="{{ route('storefront.privacy') }}" class="hover:text-white transition">Privacy Policy (তথ্য সুরক্ষা নীতি)</a></li>
                        <li><a href="{{ route('storefront.disputes') }}" class="text-amber-400 font-bold hover:underline transition">🛡️ গ্রাহক অভিযোগ ও বিরোধ সেল (৭২ ঘণ্টা)</a></li>
                        <li><a href="tel:{{ $hotline }}" class="hover:text-white transition">Customer Care & Support: {{ $hotline }}</a></li>
                    </ul>
                </div>

                <!-- Column 3: Category / Custom Featured Links -->
                <div class="space-y-3">
                    <h3 class="text-white font-bold text-sm tracking-wider uppercase border-b border-zinc-800 pb-2">
                        {{ $branding['footer_featured_title'] ?? ($categoryDefaults['footer_featured_title'] ?? 'Featured Categories') }}
                    </h3>
                    <ul class="space-y-2 text-xs">
                        @php
                            $footerLinks = $branding['footer_featured_links'] ?? ($categoryDefaults['footer_featured_links'] ?? []);
                        @endphp
                        @forelse($footerLinks as $fLink)
                            <li>
                                <a href="{{ $fLink['url'] ?? '#' }}" class="hover:text-white transition">
                                    {{ $fLink['label'] ?? '' }}
                                </a>
                            </li>
                        @empty
                            <li><a href="{{ route('storefront.home') }}" class="hover:text-white transition">All Catalog Items</a></li>
                        @endforelse
                    </ul>
                </div>

                <!-- Column 4: Payment, Logistics & Business Identity -->
                <div class="space-y-4">
                    <h3 class="text-white font-bold text-sm tracking-wider uppercase border-b border-zinc-800 pb-2">Business Identity & Payment</h3>
                    
                    <!-- Digital Commerce Directive: Business Legal Identity Block -->
                    <div class="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl text-[11px] space-y-1.5">
                        <div class="flex items-center justify-between text-zinc-300 font-bold border-b border-zinc-800/80 pb-1">
                            <span>📜 ব্যবসার পরিচয় (Legal Info)</span>
                            @if(tenant('verification_status') === 'verified')
                                <span class="bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded text-[10px]">✓ প্ল্যাটফর্ম যাচাইকৃত</span>
                            @endif
                        </div>
                        @if(tenant('trade_license_no'))
                            <p class="text-zinc-400">ট্রেড লাইসেন্স নং: <strong class="text-zinc-200">{{ tenant('trade_license_no') }}</strong></p>
                        @endif
                        @if(tenant('drug_license_no'))
                            <p class="text-zinc-400">ড্রাগ লাইসেন্স নং: <strong class="text-emerald-300">{{ tenant('drug_license_no') }}</strong></p>
                        @endif
                        @if(tenant('bmdc_reg_no'))
                            <p class="text-zinc-400">BMDC রেজিস্ট্রেশন নং: <strong class="text-blue-300">{{ tenant('bmdc_reg_no') }}</strong></p>
                        @endif
                        @if(tenant('tin_no'))
                            <p class="text-zinc-400">TIN নং: <strong class="text-zinc-200">{{ tenant('tin_no') }}</strong></p>
                        @endif
                        @if(tenant('bin_no'))
                            <p class="text-zinc-400">VAT / BIN নং: <strong class="text-zinc-200">{{ tenant('bin_no') }}</strong></p>
                        @endif
                        @if(tenant('pra_no'))
                            <p class="text-zinc-400">bKash PRA মার্চেন্ট: <strong class="text-pink-300">{{ tenant('pra_no') }}</strong></p>
                        @endif
                        @if(!tenant('trade_license_no') && !tenant('drug_license_no') && !tenant('bmdc_reg_no') && !tenant('pra_no'))
                            <p class="text-zinc-500 italic">{{ $branding['footer_merchant_badge_text'] ?? ($categoryDefaults['footer_merchant_badge_text'] ?? 'ব্যক্তিগত রিটেইল মার্চেন্ট একাউন্ট') }}</p>
                        @endif
                    </div>

                    @php
                        $activePayments = (array)($branding['footer_payment_methods'] ?? ($categoryDefaults['footer_payment_methods'] ?? ['cod', 'bkash', 'nagad', 'visa_master']));
                    @endphp
                    <div class="flex flex-wrap gap-2 text-xs font-bold">
                        @if(in_array('cod', $activePayments))
                            <span class="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-emerald-400">💵 Cash on Delivery</span>
                        @endif
                        @if(in_array('bkash', $activePayments))
                            <span class="px-2.5 py-1 bg-pink-950/60 border border-pink-800/60 rounded-lg text-pink-300">bKash</span>
                        @endif
                        @if(in_array('nagad', $activePayments))
                            <span class="px-2.5 py-1 bg-orange-950/60 border border-orange-800/60 rounded-lg text-orange-300">Nagad</span>
                        @endif
                        @if(in_array('rocket', $activePayments))
                            <span class="px-2.5 py-1 bg-purple-950/60 border border-purple-800/60 rounded-lg text-purple-300">Rocket</span>
                        @endif
                        @if(in_array('upay', $activePayments))
                            <span class="px-2.5 py-1 bg-amber-950/60 border border-amber-800/60 rounded-lg text-amber-300">Upay</span>
                        @endif
                        @if(in_array('visa_master', $activePayments))
                            <span class="px-2.5 py-1 bg-blue-950/60 border border-blue-800/60 rounded-lg text-blue-300">Visa / Master</span>
                        @endif
                        @if(in_array('bank_transfer', $activePayments))
                            <span class="px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded-lg text-emerald-300">🏦 Bank Transfer</span>
                        @endif
                    </div>

                    @php
                        $logisticsText = $branding['footer_logistics_text'] ?? ($categoryDefaults['footer_logistics_text'] ?? 'Official Logistics: Steadfast Courier & Pathao Express');
                    @endphp
                    @if(!empty($logisticsText))
                        <div class="pt-1 text-xs text-zinc-500">
                            {{ $logisticsText }}
                        </div>
                    @endif
                </div>
            </div>

            <!-- Bottom Copyright Line -->
            <div class="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
                <p>© {{ date('Y') }} <strong>{{ $storeName }}</strong>. All rights reserved. Operating under Digital Commerce Directive 2021.</p>
                <p class="text-[11px] text-zinc-600">Enterprise Multi-Business SaaS Platform</p>
            </div>
        </div>
    </footer>

    <!-- Floating WhatsApp Direct Support Button -->
    <a href="https://wa.me/{{ $waDigits }}?text={{ urlencode('Hello, I would like to inquire about products from ' . $storeName . '.') }}" 
       target="_blank" 
       class="fixed bottom-6 right-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 group transition-all duration-300 hover:scale-105 print:hidden"
       title="Chat on WhatsApp">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span class="text-xs font-bold hidden sm:inline">WhatsApp Help</span>
    </a>

</body>
</html>
