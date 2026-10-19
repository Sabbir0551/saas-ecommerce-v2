@extends('layouts.storefront')

@section('content')
@php
    $archetype = tenant('archetype') ?? 'physical_store';
    $category = tenant('business_category') ?? 'laptop_computer';

    // ইমেজ ডিকোড নিরাপদ হ্যান্ডলিং (PHP 8.3 null-safe)
    $rawImages = $product->images;
    if (is_array($rawImages)) {
        $images = $rawImages;
    } elseif (is_string($rawImages) && !empty(trim($rawImages))) {
        $images = json_decode($rawImages, true) ?? [];
    } else {
        $images = [];
    }
    $firstImage = !empty($images) ? asset('storage/' . $images[0]) : null;
    $videoEmbedUrl = $product->embed_video_url;

    // Specs ডিকোড নিরাপদ হ্যান্ডলিং
    $rawSpecs = $product->item_attributes ?? $product->specs;
    if (is_array($rawSpecs)) {
        $specs = $rawSpecs;
    } elseif (is_string($rawSpecs) && !empty(trim($rawSpecs))) {
        $specs = json_decode($rawSpecs, true) ?? [];
    } else {
        $specs = [];
    }

    // সম্পর্কিত অন্যান্য পণ্য
    $relatedProducts = \App\Models\Product::where('id', '!=', $product->id)
        ->where('is_active', true)
        ->latest()
        ->take(4)
        ->get();
    
    // আর্কিটাইপ অনুযায়ী থিম ভিউ নির্ধারণ
    $themeView = match($archetype) {
        'service', 'service_booking' => 'storefront.themes.service.product',
        'lead', 'lead_gen', 'listing_inquiry' => 'storefront.themes.lead.product',
        default => 'storefront.themes.commerce.product',
    };
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" x-data="universalStoreApp()">

    @if(($errors ?? null)?->any())
        <div class="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl mb-6 text-sm">
            <ul class="list-disc list-inside space-y-1">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    @include($themeView, [
        'product' => $product,
        'images' => $images,
        'firstImage' => $firstImage,
        'videoEmbedUrl' => $videoEmbedUrl,
        'specs' => $specs,
        'category' => $category,
        'archetype' => $archetype,
        'relatedProducts' => $relatedProducts,
    ])

</div>

<script>
    function universalStoreApp() {
        return {
            unitPrice: {{ (float) ($product->sale_price ?: ($product->price ?: 0)) }},
            qty: 1,
            shipping: 60,
            district: 'Dhaka',
            selectedVariantId: {{ $product->variants->first()?->id ?? 'null' }},

            activeTab: '{{ !empty($specs) ? 'specs' : 'description' }}',
            activeMediaType: 'image',
            activeImage: '{{ $firstImage }}',
            galleryVideoUrl: '{{ $videoEmbedUrl }}',

            selectedDate: '{{ date('Y-m-d') }}',
            selectedTime: '',
            availableSlots: [],
            loadingSlots: false,

            init() {
                @if($product->variants->isNotEmpty())
                    this.unitPrice = {{ (float) ($product->variants->first()->price ?: ($product->sale_price ?: $product->price)) }};
                @endif
            },

            showImage(url) {
                this.activeMediaType = 'image';
                this.activeImage = url;
            },

            showVideo(url) {
                this.activeMediaType = 'video';
                this.galleryVideoUrl = url;
            },

            selectVariant(id, price) {
                this.selectedVariantId = id;
                this.unitPrice = price;
            },

            increaseQty() { this.qty++; },
            decreaseQty() { if (this.qty > 1) this.qty--; },
            updateShipping(fee) { this.shipping = fee; },
            get subtotal() { return this.unitPrice * this.qty; },
            get total() { return this.subtotal + this.shipping; },

            scrollToOrder() {
                this.activeTab = 'checkout';
                const el = document.getElementById('express-order-section');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }
</script>
@endsection