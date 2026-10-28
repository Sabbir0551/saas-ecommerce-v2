@php
    $images = is_string($product->images) ? json_decode($product->images, true) : $product->images;
    $firstImage = !empty($images) && is_array($images) ? asset('storage/' . $images[0]) : null;
    if (!$firstImage) {
        $firstImage = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80';
    }

    $displayPrice = $product->sale_price ?: $product->price;
    $regularPrice = $product->price;
    $discount = ($product->sale_price && $product->sale_price < $product->price) ? ($product->price - $product->sale_price) : 0;

    $brandName = $product->brand_name ?? ($product->brand?->name ?? null);
    $categoryName = $product->categories->first()?->name ?? null;

    $rating = method_exists($product, 'getAverageRatingAttribute') ? $product->average_rating : 5.0;
@endphp

<div class="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col group h-full">
    
    <!-- Top Image Container with Badges -->
    <div class="relative aspect-square p-4 bg-white flex items-center justify-center overflow-hidden border-b border-zinc-100">
        <a href="{{ route('storefront.product', $product->slug) }}" class="w-full h-full flex items-center justify-center">
            <img src="{{ $firstImage }}" 
                 alt="{{ $product->name }}" 
                 loading="lazy"
                 class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300">
        </a>

        <!-- Top-Left Badges (HOT / NEW / Discount) -->
        <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
            @if(!empty($badgeText))
                <span class="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shadow-2xs {{ $badgeText === 'HOT' ? 'bg-amber-500 text-white' : ($badgeText === 'NEW' ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-white') }}">
                    {{ $badgeText }}
                </span>
            @endif
            @if($discount > 0)
                <span class="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-2xs uppercase">
                    -{{ round(($discount / $regularPrice) * 100) }}%
                </span>
            @endif
        </div>

        <!-- Top-Right Stock Status -->
        <div class="absolute top-2.5 right-2.5">
            <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[9px] font-extrabold uppercase shadow-2xs">
                In Stock
            </span>
        </div>
    </div>

    <!-- Product Card Body -->
    <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
            <!-- Brand / Category Subtitle -->
            <div class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate mb-1">
                {{ $brandName ?: ($categoryName ?: 'Gadgets & Gear') }}
            </div>

            <!-- Product Title -->
            <a href="{{ route('storefront.product', $product->slug) }}" 
               class="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-blue-600 line-clamp-2 transition leading-snug">
                {{ $product->name }}
            </a>

            <!-- Rating Stars -->
            <div class="flex items-center gap-1 mt-1 text-[11px]">
                <div class="text-amber-400 font-bold">★★★★★</div>
                <span class="text-zinc-400 font-semibold text-[10px]">{{ number_format($rating, 1) }}</span>
            </div>
        </div>

        <!-- Pricing & Quick-Add Button Row -->
        <div class="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
            <div>
                <div class="text-sm sm:text-base font-black text-zinc-950 leading-none">
                    {{ $currPrefix }}{{ number_format($displayPrice, 0) }}
                </div>
                @if($discount > 0)
                    <div class="text-[10px] text-zinc-400 line-through font-semibold mt-0.5">
                        {{ $currPrefix }}{{ number_format($regularPrice, 0) }}
                    </div>
                @endif
            </div>

            <!-- Floating Quick Add / View Button -->
            <a href="{{ route('storefront.product', $product->slug) }}" 
               class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition shadow-2xs hover:scale-110 flex-shrink-0"
               title="View & Buy">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                </svg>
            </a>
        </div>
    </div>
</div>
