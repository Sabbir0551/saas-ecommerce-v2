@php
    $creds = tenant('gateway_credentials') ?? [];
    $branding = tenant('branding') ?? $creds['branding'] ?? [];
    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
    $waDigits = preg_replace('/[^0-9]/', '', $whatsapp);

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    $displayPrice = $product->sale_price ?: $product->price;
    $regularPrice = $product->price;
    $discount = ($product->sale_price && $product->sale_price < $product->price) ? ($product->price - $product->sale_price) : 0;

    $brand = $specs['brand'] ?? 'Lenovo';
    $model = $specs['model'] ?? ($product->name);
    $condition = $specs['condition'] ?? 'Brand New (Factory Sealed)';

    // Quick Bullet Highlights
    $hProcessor = $specs['highlight_processor'] ?? $specs['processor_model'] ?? 'Intel Core i5-1335U (13th Gen, up to 4.60GHz, 10 Cores)';
    $hRam = $specs['highlight_ram'] ?? $specs['ram_installed'] ?? '16GB DDR5 5200MHz High Speed RAM';
    $hStorage = $specs['highlight_storage'] ?? $specs['storage_installed'] ?? '512GB PCIe Gen4 NVMe M.2 SSD';
    $hDisplay = $specs['highlight_display'] ?? $specs['display_size'] ?? '14.0" WUXGA (1920x1200) IPS Anti-glare Display';
    $hGraphics = $specs['highlight_graphics'] ?? $specs['graphics_chipset'] ?? 'Intel Iris Xe Graphics';
    $hBattery = $specs['highlight_battery'] ?? $specs['battery'] ?? '52.5Wh Battery with 65W Rapid Charge (Up to 7-8h)';
    $hWarranty = $specs['highlight_warranty'] ?? $specs['warranty'] ?? '15 Days Replacement + 2 Years Free Service Warranty';

    // Grouped Specifications for Table
    $specGroups = [
        'Basic Information' => [
            'Brand / Manufacturer' => $brand,
            'Model & Series'       => $model,
            'Condition'            => $condition,
            'Color Finish'         => $specs['color'] ?? 'Thunder Black / Mineral Grey',
        ],
        'Processor Specifications' => [
            'Processor Model'      => $specs['processor_model'] ?? 'Intel Core i5-1335U',
            'Generation'           => $specs['processor_gen'] ?? '13th Generation Raptor Lake',
            'Clock Speed'          => $specs['processor_speed'] ?? '1.30 GHz up to 4.60 GHz (10 Cores, 12 Threads)',
            'Cache Memory'         => $specs['processor_cache'] ?? '12MB Intel Smart Cache',
        ],
        'Display & Visuals' => [
            'Display Size & Res'   => $specs['display_size'] ?? '14.0" WUXGA (1920 x 1200) IPS Anti-glare',
            'Display Features'     => $specs['display_features'] ?? '300 nits Brightness, 45% NTSC, Anti-glare, Narrow Bezel',
        ],
        'Memory & RAM' => [
            'Installed RAM'        => $specs['ram_installed'] ?? '16GB DDR5 5200MHz',
            'RAM Upgrade Capacity' => $specs['ram_upgrade'] ?? 'Up to 32GB (1x Extra Slot Supported)',
        ],
        'Storage Drive' => [
            'Primary Storage'      => $specs['storage_installed'] ?? '512GB PCIe Gen4 NVMe M.2 SSD',
            'Storage Upgrade'      => $specs['storage_upgrade'] ?? 'Extra M.2 NVMe Slot Supported',
        ],
        'Graphics & Audio' => [
            'Graphics Chipset'     => $specs['graphics_chipset'] ?? 'Intel Iris Xe Graphics',
            'Camera & Audio'       => $specs['camera_audio'] ?? '1080p FHD Webcam with Privacy Shutter + Dolby Audio Stereo Speakers',
        ],
        'Keyboard & Security' => [
            'Keyboard & Input'     => $specs['keyboard'] ?? 'Backlit Keyboard, Spill-resistant, Precision TrackPoint Touchpad',
            'Security & Sensors'   => $specs['security'] ?? 'Fingerprint Reader, Discrete TPM 2.0 Security Chip, Privacy Shutter',
        ],
        'Ports & Connectivity' => [
            'I/O Ports'            => $specs['ports'] ?? '2x Thunderbolt 4 / Type-C, 2x USB 3.2, 1x HDMI 2.1, 1x Audio combo jack',
            'Wireless Network'     => $specs['wireless'] ?? 'Intel Wi-Fi 6E AX211 + Bluetooth 5.1',
        ],
        'Power & Battery' => [
            'Battery Capacity'     => $specs['battery'] ?? '52.5Wh Li-Polymer Battery, 65W USB-C Rapid Charger',
        ],
        'Operating System & Warranty' => [
            'Operating System'     => $specs['os'] ?? 'Genuine Windows 11 Pro 64-bit Licensed',
            'Warranty Terms'       => $specs['warranty'] ?? '15 Days Replacement Guarantee + 2 Years Free Service Warranty',
        ],
    ];
@endphp

<!-- Breadcrumb -->
<nav class="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-medium">
    <a href="{{ route('storefront.home') }}" class="hover:text-theme-primary transition">Home</a>
    <span>/</span>
    <a href="{{ route('storefront.home', ['search' => $brand]) }}" class="hover:text-theme-primary transition">{{ $brand }}</a>
    <span>/</span>
    <span class="text-zinc-800 font-bold truncate max-w-sm">{{ $product->name }}</span>
</nav>

<!-- Top Two-Column Product Overview -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

    <!-- Left Column: Gallery & Guarantee Badges (5 Cols) -->
    <div class="lg:col-span-5 space-y-4">
        <div class="bg-white rounded-3xl border border-zinc-200/90 p-5 shadow-xs sticky top-24 space-y-4">
            
            <!-- Main Viewer -->
            <div class="aspect-square bg-zinc-50 rounded-2xl overflow-hidden relative flex items-center justify-center border border-zinc-100 group">
                <template x-if="activeMediaType === 'image'">
                    <img :src="activeImage" 
                         alt="{{ $product->name }}" 
                         class="w-full h-full object-contain p-4 transition-all duration-300 group-hover:scale-105">
                </template>
                <template x-if="activeMediaType === 'video'">
                    <iframe :src="galleryVideoUrl" class="w-full h-full rounded-2xl" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                </template>

                @if($discount > 0)
                    <span class="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-xs uppercase">
                        Save {{ $currPrefix }}{{ number_format($discount, 0) }}
                    </span>
                @endif
            </div>

            <!-- Horizontal Thumbnails Strip -->
            @php $validImages = is_array($images) ? $images : []; @endphp
            @if(count($validImages) > 1 || !empty($videoEmbedUrl))
                <div class="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                    @foreach($validImages as $img)
                        @php $imgUrl = asset('storage/' . $img); @endphp
                        <button type="button" 
                                x-on:click="showImage('{{ $imgUrl }}')"
                                :class="(activeMediaType === 'image' && activeImage === '{{ $imgUrl }}') ? 'border-theme-primary ring-2 ring-blue-200' : 'border-zinc-200 hover:border-zinc-400'"
                                class="w-16 h-16 rounded-xl border-2 p-1 bg-white overflow-hidden flex-shrink-0 transition-all focus:outline-none cursor-pointer">
                            <img src="{{ $imgUrl }}" class="w-full h-full object-contain rounded-lg" alt="Thumbnail">
                        </button>
                    @endforeach

                    @if(!empty($videoEmbedUrl))
                        <button type="button" 
                                x-on:click="showVideo('{{ $videoEmbedUrl }}')"
                                :class="activeMediaType === 'video' ? 'border-red-600 bg-red-100 ring-2 ring-red-200' : 'border-red-500 bg-red-50 hover:bg-red-100'"
                                class="w-16 h-16 rounded-xl border-2 p-1 overflow-hidden flex-shrink-0 flex flex-col items-center justify-center text-red-600 transition-all focus:outline-none cursor-pointer">
                            <svg class="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            <span class="text-[9px] font-black mt-0.5 uppercase">Video</span>
                        </button>
                    @endif
                </div>
            @endif

            <!-- 3 Trust Badges Under Gallery -->
            <div class="pt-3 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-zinc-700">
                <div class="bg-zinc-50 border border-zinc-200/80 rounded-xl p-2.5 flex flex-col items-center justify-center">
                    <span class="text-base mb-0.5">💎</span>
                    <span>100% Genuine</span>
                </div>
                <div class="bg-zinc-50 border border-zinc-200/80 rounded-xl p-2.5 flex flex-col items-center justify-center">
                    <span class="text-base mb-0.5">🔄</span>
                    <span>15 Days Return</span>
                </div>
                <div class="bg-zinc-50 border border-zinc-200/80 rounded-xl p-2.5 flex flex-col items-center justify-center">
                    <span class="text-base mb-0.5">🛡️</span>
                    <span>2-Yr Warranty</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Right Column: Details, Bullets, Variants, Actions & Hotline (7 Cols) -->
    <div class="lg:col-span-7 space-y-5">
        
        <!-- Title & Meta Row -->
        <div class="space-y-2">
            <h1 class="text-2xl sm:text-3xl font-black text-zinc-950 leading-snug">
                {{ $product->name }}
            </h1>

            <div class="flex flex-wrap items-center gap-3 text-xs text-zinc-600 font-semibold pt-1">
                <span>Brand: <strong class="text-theme-primary uppercase">{{ $brand }}</strong></span>
                <span class="text-zinc-300">•</span>
                <span>Model: <strong class="text-zinc-900">{{ $model }}</strong></span>
                <span class="text-zinc-300">•</span>
                <span>SKU: <strong class="text-zinc-900">{{ $product->sku ?? 'LPT-' . $product->id }}</strong></span>
                <span class="text-zinc-300">•</span>
                <span class="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock (Ready to Ship)
                </span>
            </div>
        </div>

        <!-- Pricing Card -->
        <div class="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 flex items-baseline justify-between">
            <div class="flex items-baseline gap-3">
                <span class="text-3xl font-black text-zinc-950">{{ $currPrefix }}<span x-text="unitPrice.toLocaleString()"></span></span>
                @if($discount > 0)
                    <span class="text-sm font-bold text-zinc-400 line-through">{{ $currPrefix }}{{ number_format($regularPrice, 0) }}</span>
                @endif
            </div>

            @if($discount > 0)
                <span class="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black px-3 py-1 rounded-full">
                    Save {{ $currPrefix }}{{ number_format($discount, 0) }}
                </span>
            @endif
        </div>

        <!-- Key Features Bullet Box -->
        <div class="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4.5 space-y-2.5 text-xs text-zinc-800">
            <h3 class="font-black text-sky-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>⚡</span>
                <span>Key Hardware Highlights</span>
            </h3>

            <ul class="space-y-1.5 font-medium leading-relaxed">
                <li class="flex items-start gap-2">
                    <span class="text-sky-600 font-bold">•</span>
                    <span><strong>Processor:</strong> {{ $hProcessor }}</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-sky-600 font-bold">•</span>
                    <span><strong>RAM:</strong> {{ $hRam }}</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-sky-600 font-bold">•</span>
                    <span><strong>Storage:</strong> {{ $hStorage }}</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-sky-600 font-bold">•</span>
                    <span><strong>Display:</strong> {{ $hDisplay }}</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-sky-600 font-bold">•</span>
                    <span><strong>Graphics:</strong> {{ $hGraphics }}</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-sky-600 font-bold">•</span>
                    <span><strong>Battery:</strong> {{ $hBattery }}</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="text-sky-600 font-bold">•</span>
                    <span><strong>Warranty:</strong> {{ $hWarranty }}</span>
                </li>
            </ul>
        </div>

        <!-- Variant Selector Buttons (RAM / SSD) -->
        @if($product->variants->isNotEmpty())
            <div class="space-y-2 pt-1">
                <label class="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider">
                    Select Hardware Configuration <span class="text-rose-500">*</span>
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

        <!-- Quantity & Direct Action Buttons -->
        <div class="space-y-3 pt-2">
            <div class="flex items-center gap-3">
                <!-- Quantity Stepper -->
                <div class="flex items-center border border-zinc-300 rounded-xl bg-white shadow-xs p-1">
                    <button type="button" x-on:click="decreaseQty()" class="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center transition">
                        -
                    </button>
                    <span class="w-10 text-center font-black text-sm" x-text="qty"></span>
                    <button type="button" x-on:click="increaseQty()" class="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold flex items-center justify-center transition">
                        +
                    </button>
                </div>

                <!-- Primary Action Button -->
                <button type="button" 
                        x-on:click="scrollToOrder()" 
                        class="flex-1 bg-theme-primary hover:opacity-90 text-white font-black py-3 px-5 rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <span>Express Order (Buy Now)</span>
                </button>
            </div>
        </div>

        <!-- Direct Phone Order & WhatsApp Hotline Card -->
        <div class="bg-zinc-900 text-white rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div class="space-y-1 text-center sm:text-left">
                <span class="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">Prefer Ordering Over Phone?</span>
                <span class="text-sm font-extrabold text-white block">Call our sales desk to place your order directly</span>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
                <a href="tel:{{ $hotline }}" class="px-4 py-2 bg-theme-primary text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm hover:opacity-90">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    <span>{{ $hotline }}</span>
                </a>
                <a href="https://wa.me/88{{ $waDigits }}?text={{ urlencode('Hello, I am interested in ordering: ' . $product->name) }}" target="_blank" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm">
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
                <span><strong>Cash on Delivery:</strong> Inspect the device upon delivery before completing payment</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-purple-500 font-bold">🔄</span>
                <span><strong>15-Day Replacement:</strong> Instant hardware replacement guarantee</span>
            </div>
        </div>
    </div>
</div>

<!-- Tabs Section (Technical Specifications, Video & Express Order) -->
<div class="bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-xs mb-12">
    <!-- Tabs Header Navigation -->
    <div class="flex border-b border-zinc-200 bg-zinc-50 overflow-x-auto scrollbar-none">
        <button type="button" 
                x-on:click="activeTab = 'specs'" 
                :class="activeTab === 'specs' ? 'border-theme-primary text-zinc-950 font-black bg-white border-b-2' : 'border-transparent text-zinc-500 hover:text-zinc-800 font-bold'"
                class="px-6 py-4 text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2">
            <span>📋</span>
            <span>Full Technical Specifications</span>
        </button>

        @if(!empty($videoEmbedUrl))
            <button type="button" 
                    x-on:click="activeTab = 'video'" 
                    :class="activeTab === 'video' ? 'border-theme-primary text-zinc-950 font-black bg-white border-b-2' : 'border-transparent text-zinc-500 hover:text-zinc-800 font-bold'"
                    class="px-6 py-4 text-xs sm:text-sm whitespace-nowrap transition cursor-pointer flex items-center gap-2">
                <span>🎥</span>
                <span>Video Review & Unboxing</span>
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

    <!-- Tab 1: Grouped Technical Specifications Table -->
    <div x-show="activeTab === 'specs'" class="p-6 sm:p-8 space-y-6">
        <h2 class="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            <span>{{ $product->name }} — Complete Technical Specifications</span>
        </h2>

        <div class="space-y-6">
            @foreach($specGroups as $groupTitle => $groupFields)
                <div class="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
                    <!-- Enterprise Group Header -->
                    <div class="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 flex items-center gap-2">
                        <span class="text-amber-400">▶</span>
                        <span>{{ $groupTitle }}</span>
                    </div>

                    <!-- Key-Value Rows -->
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

    <!-- Tab 2: Embedded YouTube Video Review -->
    @if(!empty($videoEmbedUrl))
        <div x-show="activeTab === 'video'" class="p-6 sm:p-8">
            <h2 class="text-lg font-black text-zinc-900 mb-4 flex items-center gap-2">
                <span>🎥</span>
                <span>Official Video Review & Device Unboxing</span>
            </h2>
            <div class="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-200 shadow-lg">
                <iframe src="{{ $videoEmbedUrl }}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    @endif

    <!-- Tab 3: Detailed Description -->
    <div x-show="activeTab === 'description'" class="p-6 sm:p-8">
        <h2 class="text-lg font-black text-zinc-900 mb-4">Product Overview & Features</h2>
        @if($product->description)
            <div class="text-xs sm:text-sm text-zinc-700 prose prose-zinc max-w-none leading-relaxed">
                {!! $product->description !!}
            </div>
        @else
            <p class="text-xs text-zinc-500">No additional description provided. Please refer to the Technical Specifications tab for full hardware details.</p>
        @endif
    </div>

    <!-- Tab 4: Fast Express Order Form -->
    <div x-show="activeTab === 'checkout'" id="express-order-section" class="p-6 sm:p-8">
        <div class="max-w-2xl mx-auto bg-zinc-50 rounded-2xl border-2 border-theme-primary p-6 sm:p-8 shadow-md">
            <div class="text-center mb-6">
                <span class="text-xs font-bold text-theme-primary uppercase tracking-widest block">Fast & Secure Checkout</span>
                <h2 class="text-xl font-black text-zinc-950 mt-1">Confirm Your Order Details</h2>
                <p class="text-xs text-zinc-500 mt-1">Pay with 100% Cash on Delivery after inspecting the device at your doorstep.</p>
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

<!-- Related Laptops Grid -->
@if(!empty($relatedProducts) && $relatedProducts->isNotEmpty())
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-xl font-black text-zinc-950">Related Laptop Models</h2>
            <a href="{{ route('storefront.home') }}" class="text-xs font-bold text-theme-primary hover:underline">View All Laptops →</a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @foreach($relatedProducts as $rel)
                @php
                    $relImages = is_string($rel->images) ? json_decode($rel->images, true) : $rel->images;
                    $relFirst = !empty($relImages) && is_array($relImages) ? asset('storage/' . $relImages[0]) : 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80';
                    $relPrice = $rel->sale_price ?: $rel->price;
                @endphp
                <div class="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-theme-primary transition flex flex-col group p-3">
                    <a href="{{ route('storefront.product', $rel->slug) }}" class="aspect-4/3 bg-zinc-50 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2">
                        <img src="{{ $relFirst }}" alt="{{ $rel->name }}" class="max-w-full max-h-full object-contain group-hover:scale-105 transition duration-300">
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