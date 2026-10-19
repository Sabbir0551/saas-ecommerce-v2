@php
    $creds = tenant('gateway_credentials') ?? [];
    $branding = tenant('branding') ?? $creds['branding'] ?? [];
    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
    $waDigits = preg_replace('/[^0-9]/', '', $whatsapp);
    if (str_starts_with($waDigits, '01')) {
        $waDigits = '88' . $waDigits;
    }

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    $displayPrice = $product->sale_price ?: $product->price;
    $regularPrice = $product->price;
    $discount = ($product->sale_price && $product->sale_price < $product->price) ? ($product->price - $product->sale_price) : 0;

    $hasVideo = $product->has_video ?? (!empty($product->video_path) || !empty($product->video_url) || !empty($product->embed_video_url) || !empty($videoEmbedUrl));
    $videoType = $product->video_type ?? (!empty($product->video_path) ? 'file' : 'embed');
    $videoSourceUrl = $product->video_source_url ?? (!empty($product->video_path) ? asset('storage/' . $product->video_path) : ($product->embed_video_url ?? $product->video_url ?? $videoEmbedUrl));
    $videoTitle = $product->video_title ?? 'Official Video Review & Unboxing';

    $isTechCategory = in_array($category ?? '', ['laptop_computer', 'electronics', 'mobile_gadgets']) || !empty($specs['processor_model']);

    $brand = $specs['brand'] ?? $product->brand ?? null;
    $model = $specs['model'] ?? ($product->name);
    $condition = $specs['condition'] ?? 'Brand New (100% Genuine)';

    // Quick Bullet Highlights
    $hProcessor = $specs['highlight_processor'] ?? $specs['processor_model'] ?? null;
    $hRam = $specs['highlight_ram'] ?? $specs['ram_installed'] ?? null;
    $hStorage = $specs['highlight_storage'] ?? $specs['storage_installed'] ?? null;
    $hDisplay = $specs['highlight_display'] ?? $specs['display_size'] ?? null;
    $hGraphics = $specs['highlight_graphics'] ?? $specs['graphics_chipset'] ?? null;
    $hBattery = $specs['highlight_battery'] ?? $specs['battery'] ?? null;
    $hWarranty = $specs['highlight_warranty'] ?? $specs['warranty'] ?? 'Official Brand Warranty';

    // Grouped Specifications for Table
    $specGroups = [];
    if ($isTechCategory && (!empty($specs['processor_model']) || !empty($specs['ram_installed']) || !empty($specs['display_size']))) {
        $specGroups = array_filter([
            'Basic Information' => array_filter([
                'Brand / Manufacturer' => $brand,
                'Model & Series'       => $model,
                'Condition'            => $condition,
                'Color Finish'         => $specs['color'] ?? null,
            ]),
            'Processor Specifications' => array_filter([
                'Processor Model'      => $specs['processor_model'] ?? null,
                'Generation'           => $specs['processor_gen'] ?? null,
                'Clock Speed'          => $specs['processor_speed'] ?? null,
                'Cache Memory'         => $specs['processor_cache'] ?? null,
            ]),
            'Display & Visuals' => array_filter([
                'Display Size & Res'   => $specs['display_size'] ?? null,
                'Display Features'     => $specs['display_features'] ?? null,
            ]),
            'Memory & RAM' => array_filter([
                'Installed RAM'        => $specs['ram_installed'] ?? null,
                'RAM Upgrade Capacity' => $specs['ram_upgrade'] ?? null,
            ]),
            'Storage Drive' => array_filter([
                'Primary Storage'      => $specs['storage_installed'] ?? null,
                'Storage Upgrade'      => $specs['storage_upgrade'] ?? null,
            ]),
            'Graphics & Audio' => array_filter([
                'Graphics Chipset'     => $specs['graphics_chipset'] ?? null,
                'Camera & Audio'       => $specs['camera_audio'] ?? null,
            ]),
            'Ports & Connectivity' => array_filter([
                'I/O Ports'            => $specs['ports'] ?? null,
                'Wireless Network'     => $specs['wireless'] ?? null,
            ]),
            'Power & Battery' => array_filter([
                'Battery Capacity'     => $specs['battery'] ?? null,
            ]),
            'Operating System & Warranty' => array_filter([
                'Operating System'     => $specs['os'] ?? null,
                'Warranty Terms'       => $specs['warranty'] ?? null,
            ]),
        ], fn($grp) => !empty($grp));
    } elseif (!empty($specs)) {
        $generalFields = [];
        foreach ($specs as $k => $v) {
            if (!blank($v) && !is_array($v)) {
                $generalFields[ucfirst(str_replace('_', ' ', $k))] = is_bool($v) ? ($v ? 'Yes' : 'No') : $v;
            }
        }
        if (!empty($generalFields)) {
            $specGroups = ['Product Specifications' => $generalFields];
        }
    }
@endphp

<!-- Breadcrumb -->
<nav class="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-medium">
    <a href="{{ route('storefront.home') }}" class="hover:text-theme-primary transition">Home</a>
    <span>/</span>
    @if(!empty($brand))
        <a href="{{ route('storefront.home', ['search' => $brand]) }}" class="hover:text-theme-primary transition">{{ $brand }}</a>
        <span>/</span>
    @endif
    <span class="text-zinc-800 font-bold truncate max-w-sm">{{ $product->name }}</span>
</nav>

<!-- Top Two-Column Product Overview -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

    <!-- Left Column: Gallery & Guarantee Badges (5 Cols) -->
    <div class="lg:col-span-5 space-y-4">
        <div class="bg-white rounded-3xl border border-zinc-200/90 p-5 shadow-xs sticky top-24 space-y-4">
            
            <!-- Main Viewer -->
            <div class="aspect-square bg-zinc-50 rounded-2xl overflow-hidden relative flex items-center justify-center border border-zinc-100 group">
                @if(!empty($firstImage))
                    <img :src="activeImage" 
                         src="{{ $firstImage }}"
                         alt="{{ $product->name }}" 
                         class="w-full h-full object-contain p-4 transition-all duration-300 group-hover:scale-105">
                @else
                    <div class="w-full h-full flex items-center justify-center text-6xl text-zinc-300">
                        📦
                    </div>
                @endif

                @if($discount > 0)
                    <span class="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-xs uppercase">
                        Save {{ $currPrefix }}{{ number_format($discount, 0) }}
                    </span>
                @endif
            </div>

            <!-- Horizontal Thumbnails Strip -->
            @php $validImages = is_array($images) ? $images : []; @endphp
            @if(count($validImages) > 1)
                <div class="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                    @foreach($validImages as $img)
                        @php $imgUrl = asset('storage/' . $img); @endphp
                        <button type="button" 
                                x-on:click="activeImage = '{{ $imgUrl }}'"
                                :class="(activeImage === '{{ $imgUrl }}') ? 'border-theme-primary ring-2 ring-blue-200' : 'border-zinc-200 hover:border-zinc-400'"
                                class="w-16 h-16 rounded-xl border-2 p-1 bg-white overflow-hidden flex-shrink-0 transition-all focus:outline-none cursor-pointer">
                            <img src="{{ $imgUrl }}" class="w-full h-full object-contain rounded-lg" alt="Thumbnail">
                        </button>
                    @endforeach
                </div>
            @endif

            <!-- 3 Trust Badges Under Gallery -->
            <div class="pt-3 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-zinc-700">
                <div class="bg-zinc-50 border border-zinc-200/80 rounded-xl p-2.5 flex flex-col items-center justify-center">
                    <span class="text-base mb-0.5">💎</span>
                    <span>100% Genuine</span>
                </div>
                <div class="bg-zinc-50 border border-zinc-200/80 rounded-xl p-2.5 flex flex-col items-center justify-center">
                    <span class="text-base mb-0.5">🛡️</span>
                    <span>Brand Warranty</span>
                </div>
                <div class="bg-zinc-50 border border-zinc-200/80 rounded-xl p-2.5 flex flex-col items-center justify-center">
                    <span class="text-base mb-0.5">⚡</span>
                    <span>Fast Dispatch</span>
                </div>
            </div>

            <!-- Dedicated Video Section (Outside Gallery) -->
            @if($hasVideo && !empty($videoSourceUrl))
                <div class="mt-4 bg-white rounded-3xl border border-zinc-200/90 p-5 shadow-xs space-y-3">
                    <div class="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                        <div class="flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                            <span class="text-xs font-bold uppercase tracking-wider text-zinc-800">
                                {{ $videoTitle }}
                            </span>
                        </div>
                        <span class="text-[10px] bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full border border-red-100">ভিডিও বার্তা</span>
                    </div>
                    <div class="w-full aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-inner">
                        @if($videoType === 'file')
                            <video src="{{ $videoSourceUrl }}" controls class="w-full h-full" playsinline preload="metadata"></video>
                        @else
                            <iframe src="{{ $videoSourceUrl }}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
                        @endif
                    </div>
                </div>
            @endif

        </div>
    </div>

    <!-- Right Column: Product Core Details, Variations & Actions (7 Cols) -->
    <div class="lg:col-span-7 space-y-6">

        <!-- Header Category Badge & Product Title -->
        <div class="space-y-2">
            <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-theme-primary/10 text-theme-primary border border-theme-primary/20">
                    <span class="w-2 h-2 rounded-full bg-theme-primary animate-pulse"></span>
                    {{ $condition }}
                </span>
                @if(!empty($brand))
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {{ $brand }}
                    </span>
                @endif
            </div>

            <h1 class="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight leading-snug">
                {{ $product->name }}
            </h1>
        </div>

        <!-- Pricing Card -->
        <div class="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div class="space-y-1">
                <span class="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Special Offer Price</span>
                <div class="flex items-baseline gap-3">
                    <span class="text-3xl font-black text-theme-primary tracking-tight">
                        {{ $currPrefix }}<span x-text="unitPrice.toLocaleString()">{{ number_format($displayPrice, 0) }}</span>
                    </span>

                    @if($discount > 0)
                        <span class="text-sm font-semibold text-zinc-400 line-through">
                            {{ $currPrefix }}{{ number_format($regularPrice, 0) }}
                        </span>
                        <span class="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                            {{ round(($discount / $regularPrice) * 100) }}% OFF
                        </span>
                    @endif
                </div>
            </div>

            <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    In Stock (Ready to Ship)
                </span>
            </div>
        </div>

        <!-- Key Features Bullet Box -->
        @if($isTechCategory && !empty($hProcessor))
            <div class="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4.5 space-y-2.5 text-xs text-zinc-800">
                <h3 class="font-black text-sky-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>Key Hardware Highlights</span>
                </h3>

                <ul class="space-y-1.5 font-medium leading-relaxed">
                    @if(!empty($hProcessor))
                        <li class="flex items-start gap-2">
                            <span class="text-sky-600 font-bold">•</span>
                            <span><strong>Processor:</strong> {{ $hProcessor }}</span>
                        </li>
                    @endif
                    @if(!empty($hRam))
                        <li class="flex items-start gap-2">
                            <span class="text-sky-600 font-bold">•</span>
                            <span><strong>RAM:</strong> {{ $hRam }}</span>
                        </li>
                    @endif
                    @if(!empty($hStorage))
                        <li class="flex items-start gap-2">
                            <span class="text-sky-600 font-bold">•</span>
                            <span><strong>Storage:</strong> {{ $hStorage }}</span>
                        </li>
                    @endif
                    @if(!empty($hDisplay))
                        <li class="flex items-start gap-2">
                            <span class="text-sky-600 font-bold">•</span>
                            <span><strong>Display:</strong> {{ $hDisplay }}</span>
                        </li>
                    @endif
                    @if(!empty($hGraphics))
                        <li class="flex items-start gap-2">
                            <span class="text-sky-600 font-bold">•</span>
                            <span><strong>Graphics:</strong> {{ $hGraphics }}</span>
                        </li>
                    @endif
                    @if(!empty($hBattery))
                        <li class="flex items-start gap-2">
                            <span class="text-sky-600 font-bold">•</span>
                            <span><strong>Battery:</strong> {{ $hBattery }}</span>
                        </li>
                    @endif
                    @if(!empty($hWarranty))
                        <li class="flex items-start gap-2">
                            <span class="text-sky-600 font-bold">•</span>
                            <span><strong>Warranty:</strong> {{ $hWarranty }}</span>
                        </li>
                    @endif
                </ul>
            </div>
        @elseif(!empty($specs))
            <div class="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4.5 space-y-2.5 text-xs text-zinc-800">
                <h3 class="font-black text-zinc-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>✨</span>
                    <span>Product Highlights & Specs</span>
                </h3>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                    @foreach($specs as $sKey => $sVal)
                        @if(!blank($sVal) && !is_array($sVal))
                            <li class="p-2 rounded-lg bg-white border border-zinc-100 flex items-center justify-between">
                                <span class="text-zinc-500 font-bold capitalize">{{ ucfirst(str_replace('_', ' ', $sKey)) }}</span>
                                <span class="font-extrabold text-zinc-900">{{ is_bool($sVal) ? ($sVal ? 'Yes' : 'No') : $sVal }}</span>
                            </li>
                        @endif
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- Variant Selector Buttons -->
        @if($product->variants->isNotEmpty())
            <div class="space-y-2 pt-1">
                <label class="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                    {{ $isTechCategory ? 'Select Hardware Configuration' : 'Select Option / Variant' }} <span class="text-rose-500">*</span>
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    @foreach($product->variants as $variant)
                        <button type="button" 
                                x-on:click="selectVariant({{ $variant->id }}, {{ $variant->price ?: ($product->sale_price ?: $product->price) }})"
                                :class="selectedVariantId === {{ $variant->id }} ? 'border-theme-primary bg-blue-50/50 text-zinc-950 font-black ring-2 ring-blue-300' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'"
                                class="p-3 text-xs text-left border rounded-xl transition flex flex-col justify-between cursor-pointer shadow-xs">
                            <span class="font-bold">{{ $variant->title }}</span>
                            <span class="text-[11px] text-zinc-500 mt-1">{{ $currPrefix }}{{ number_format($variant->price ?: ($product->sale_price ?: $product->price), 0) }}</span>
                        </button>
                    @endforeach
                </div>
            </div>
        @endif

        <!-- Quantity & Order CTA Buttons -->
        <div class="space-y-3 pt-2">
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <!-- Quantity Stepper -->
                <div class="flex items-center border border-zinc-300 rounded-xl bg-white p-1 flex-shrink-0 self-start">
                    <button type="button" 
                            x-on:click="decreaseQty()" 
                            class="w-9 h-9 rounded-lg text-zinc-600 hover:bg-zinc-100 flex items-center justify-center font-bold text-lg transition">
                        -
                    </button>
                    <span class="w-12 text-center text-sm font-black text-zinc-900" x-text="qty">1</span>
                    <button type="button" 
                            x-on:click="increaseQty()" 
                            class="w-9 h-9 rounded-lg text-zinc-600 hover:bg-zinc-100 flex items-center justify-center font-bold text-lg transition">
                        +
                    </button>
                </div>

                <!-- Instant Cash on Delivery Buy Button -->
                <button type="button" 
                        x-on:click="scrollToOrder()" 
                        class="flex-1 py-4 px-6 bg-theme-primary hover:opacity-90 text-white font-black text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <span>অর্ডার করুন (ক্যাশ অন ডেলিভারি)</span>
                </button>
            </div>
        </div>

        <!-- Instant Inquiry / Call / WhatsApp Floating Strip -->
        <div class="p-4 rounded-2xl bg-zinc-100/80 border border-zinc-200/90 flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-0.5">
                <span class="text-xs font-bold text-zinc-900 block">সরাসরি কথা বলতে কল বা হোয়াটসঅ্যাপ করুন:</span>
                <span class="text-[11px] text-zinc-500">আমাদের বিশেষজ্ঞ টিম সার্বক্ষণিক সহায়তার জন্য প্রস্তুত</span>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
                <a href="tel:{{ $hotline }}" class="px-4 py-2 bg-theme-primary text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm hover:opacity-90">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    <span>{{ $hotline }}</span>
                </a>
                <a href="https://wa.me/{{ $waDigits }}?text={{ urlencode('Hello, I am interested in ordering: ' . $product->name) }}" target="_blank" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm">
                    <span>WhatsApp</span>
                </a>
            </div>
        </div>

        <!-- Delivery & Trust Perks -->
        <div class="border border-zinc-200/90 rounded-2xl p-4 bg-white space-y-2 text-xs text-zinc-600 font-medium">
            <div class="flex items-center gap-2">
                <span class="text-blue-500 font-bold">🚚</span>
                <span><strong>Fast Nationwide Delivery:</strong> Within 24 hours in Dhaka, 48 hours across Bangladesh</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">💵</span>
                <span><strong>Cash on Delivery:</strong> Inspect the product upon delivery before completing payment</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-purple-500 font-bold">🔄</span>
                <span><strong>Easy Return & Replacement:</strong> Guaranteed replacement for any defect</span>
            </div>
        </div>
    </div>
</div>

<!-- Tabs Section (Specifications, Video & Express Order) -->
<div class="bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-xs mb-12">
    <!-- Tabs Header Navigation -->
    <div class="flex border-b border-zinc-200 bg-zinc-50 overflow-x-auto scrollbar-none">
        @if(!empty($specGroups))
            <button type="button" 
                    x-on:click="activeTab = 'specs'" 
                    :class="activeTab === 'specs' ? 'border-theme-primary text-zinc-950 font-black bg-white border-b-2' : 'border-transparent text-zinc-500 hover:text-zinc-800 font-bold'"
                    class="px-6 py-4 text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2">
                <span>📋</span>
                <span>Specifications</span>
            </button>
        @endif

        @if($hasVideo && !empty($videoSourceUrl))
            <button type="button" 
                    x-on:click="activeTab = 'video'" 
                    :class="activeTab === 'video' ? 'border-theme-primary text-zinc-950 font-black bg-white border-b-2' : 'border-transparent text-zinc-500 hover:text-zinc-800 font-bold'"
                    class="px-6 py-4 text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2">
                <span>🎥</span>
                <span>Video Review</span>
            </button>
        @endif

        <button type="button" 
                x-on:click="activeTab = 'description'" 
                :class="activeTab === 'description' ? 'border-theme-primary text-zinc-950 font-black bg-white border-b-2' : 'border-transparent text-zinc-500 hover:text-zinc-800 font-bold'"
                class="px-6 py-4 text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2">
            <span>📝</span>
            <span>Detailed Overview</span>
        </button>

        <button type="button" 
                x-on:click="activeTab = 'checkout'" 
                :class="activeTab === 'checkout' ? 'border-theme-primary text-zinc-950 font-black bg-white border-b-2' : 'border-transparent text-zinc-500 hover:text-zinc-800 font-bold'"
                class="px-6 py-4 text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2">
            <span>🛒</span>
            <span>Express Cash on Delivery Order</span>
        </button>
    </div>

    <!-- Tab 1: Grouped Specifications Table -->
    @if(!empty($specGroups))
        <div x-show="activeTab === 'specs'" class="p-6 sm:p-8 space-y-6">
            <h2 class="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
                <span>⚙️</span>
                <span>{{ $product->name }} — Complete Specifications</span>
            </h2>

            <div class="space-y-6">
                @foreach($specGroups as $groupTitle => $groupFields)
                    <div class="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
                        <div class="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 flex items-center gap-2">
                            <span class="text-amber-400">▶</span>
                            <span>{{ $groupTitle }}</span>
                        </div>

                        <div class="divide-y divide-zinc-100 text-xs sm:text-sm">
                            @foreach($groupFields as $fKey => $fVal)
                                <div class="grid grid-cols-1 sm:grid-cols-3 p-3 sm:px-4 hover:bg-zinc-50 transition">
                                    <span class="font-bold text-zinc-600 sm:col-span-1">{{ $fKey }}</span>
                                    <span class="font-medium text-zinc-900 sm:col-span-2 mt-1 sm:mt-0">{{ $fVal ?: '—' }}</span>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    @endif

    <!-- Tab 2: Embedded or Uploaded Video -->
    @if($hasVideo && !empty($videoSourceUrl))
        <div x-show="activeTab === 'video'" class="p-6 sm:p-8">
            <h2 class="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
                <span>🎥</span>
                <span>{{ $videoTitle }}</span>
            </h2>
            <div class="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-200 shadow-lg bg-zinc-950">
                @if($videoType === 'file')
                    <video src="{{ $videoSourceUrl }}" controls class="w-full h-full" playsinline preload="metadata"></video>
                @else
                    <iframe src="{{ $videoSourceUrl }}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
                @endif
            </div>
        </div>
    @endif

    <!-- Tab 3: Detailed Description -->
    <div x-show="activeTab === 'description'" class="p-6 sm:p-8">
        <h2 class="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>Product Overview & Details</span>
        </h2>
        @if(!empty($product->description))
            <div class="text-xs sm:text-sm text-zinc-700 leading-relaxed prose prose-zinc max-w-none">
                {!! $product->description !!}
            </div>
        @else
            <p class="text-xs text-zinc-500">No additional description provided for this product.</p>
        @endif
    </div>

    <!-- Tab 4: Fast Express Order Form -->
    <div x-show="activeTab === 'checkout'" id="express-order-section" class="p-6 sm:p-8">
        <div class="max-w-2xl mx-auto bg-zinc-50 rounded-2xl border-2 border-theme-primary p-6 sm:p-8 shadow-md">
            <div class="text-center mb-6">
                <span class="text-xs font-bold text-theme-primary uppercase tracking-widest block">Fast & Secure Checkout</span>
                <h2 class="text-xl font-black text-zinc-950 mt-1">Confirm Your Order Details</h2>
                <p class="text-xs text-zinc-500 mt-1">Pay with 100% Cash on Delivery after inspecting the product at your doorstep.</p>
            </div>

            <form action="{{ route('storefront.order.place') }}" method="POST" class="space-y-4">
                @csrf
                <input type="hidden" name="product_id" value="{{ $product->id }}">
                <input type="hidden" name="product_variant_id" :value="selectedVariantId">

                <div>
                    <label class="block text-xs font-bold text-zinc-700 mb-1">Your Full Name <span class="text-rose-500">*</span></label>
                    <input type="text" name="customer_name" required value="{{ old('customer_name') }}" placeholder="Enter your full name" class="w-full bg-white border border-zinc-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-theme-primary transition">
                </div>

                <div>
                    <label class="block text-xs font-bold text-zinc-700 mb-1">Mobile Phone Number <span class="text-rose-500">*</span></label>
                    <input type="tel" name="customer_phone" required value="{{ old('customer_phone') }}" placeholder="01XXXXXXXXX" class="w-full bg-white border border-zinc-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-theme-primary transition">
                </div>

                <div>
                    <label class="block text-xs font-bold text-zinc-700 mb-1">Delivery Region <span class="text-rose-500">*</span></label>
                    <div class="grid grid-cols-2 gap-3">
                        <label class="cursor-pointer border border-zinc-300 rounded-xl p-3 flex items-center gap-2 bg-white hover:bg-blue-50/50 transition">
                            <input type="radio" name="district" value="Dhaka" x-model="district" x-on:change="updateShipping(60)">
                            <span class="text-xs font-bold text-zinc-800">Inside Dhaka (BDT 60)</span>
                        </label>
                        <label class="cursor-pointer border border-zinc-300 rounded-xl p-3 flex items-center gap-2 bg-white hover:bg-blue-50/50 transition">
                            <input type="radio" name="district" value="Outside Dhaka" x-model="district" x-on:change="updateShipping(120)">
                            <span class="text-xs font-bold text-zinc-800">Outside Dhaka (BDT 120)</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-zinc-700 mb-1">Complete Delivery Address <span class="text-rose-500">*</span></label>
                    <textarea name="shipping_address" rows="2" required placeholder="House/Holding no, Road, Area, City..." class="w-full bg-white border border-zinc-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-theme-primary transition">{{ old('shipping_address') }}</textarea>
                </div>

                <input type="hidden" name="payment_method" value="cod">

                <div class="bg-blue-50 rounded-2xl p-4 border border-blue-200 flex justify-between items-center text-xs">
                    <div>
                        <span class="font-bold text-blue-950 block">Total Payable Amount:</span>
                        <span class="text-[11px] text-blue-800">Cash on Delivery (Inspect & Pay)</span>
                    </div>
                    <span class="text-2xl font-black text-theme-primary">{{ $currPrefix }}<span x-text="total.toLocaleString()"></span></span>
                </div>

                <button type="submit" class="w-full bg-theme-primary hover:opacity-90 text-white font-black py-3.5 rounded-xl text-sm transition shadow-lg cursor-pointer">
                    Confirm Order (Cash on Delivery)
                </button>
            </form>
        </div>
    </div>
</div>

<!-- Related Products Grid -->
@if(!empty($relatedProducts) && $relatedProducts->isNotEmpty())
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-zinc-950">{{ $isTechCategory ? 'Related Models' : 'Related Products' }}</h2>
            <a href="{{ route('storefront.home') }}" class="text-xs font-bold text-theme-primary hover:underline">View All →</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @foreach($relatedProducts as $rel)
                @php
                    $relImages = is_string($rel->images) ? json_decode($rel->images, true) : $rel->images;
                    $relFirst = !empty($relImages) && is_array($relImages) ? asset('storage/' . $relImages[0]) : null;
                    $relPrice = $rel->sale_price ?: $rel->price;
                @endphp
                <div class="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-theme-primary transition flex flex-col group p-3">
                    <a href="{{ route('storefront.product', $rel->slug) }}" class="aspect-4/3 bg-zinc-50 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2">
                        @if($relFirst)
                            <img src="{{ $relFirst }}" alt="{{ $rel->name }}" class="max-w-full max-h-full object-contain group-hover:scale-105 transition duration-300">
                        @else
                            <div class="text-3xl text-zinc-300">📦</div>
                        @endif
                    </a>
                    <a href="{{ route('storefront.product', $rel->slug) }}" class="text-xs font-bold text-zinc-900 hover:text-theme-primary line-clamp-2 leading-snug">
                        {{ $rel->name }}
                    </a>
                    <div class="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between">
                        <span class="text-sm font-black text-zinc-950">{{ $currPrefix }}{{ number_format($relPrice, 0) }}</span>
                        <a href="{{ route('storefront.product', $rel->slug) }}" class="text-[11px] font-bold bg-theme-primary text-white px-2.5 py-1 rounded-lg transition hover:opacity-90">
                            Order
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endif