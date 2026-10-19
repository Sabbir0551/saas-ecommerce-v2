@extends('layouts.storefront')

@section('content')
@php
    $category = tenant('business_category') ?? 'real_estate';
    $rawImages = $product->images;
    $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
    $firstImage = !empty($images) ? asset('storage/' . $images[0]) : null;

    $rawSpecs = $product->item_attributes ?? $product->specs;
    $specs = is_array($rawSpecs) ? $rawSpecs : (is_string($rawSpecs) ? (json_decode($rawSpecs, true) ?? []) : []);

    $hasVideo = $product->has_video ?? (!empty($product->video_path) || !empty($product->video_url) || !empty($product->embed_video_url));
    $videoType = $product->video_type ?? (!empty($product->video_path) ? 'file' : 'embed');
    $videoSourceUrl = $product->video_source_url ?? (!empty($product->video_path) ? asset('storage/' . $product->video_path) : ($product->embed_video_url ?? $product->video_url));
    $videoTitle = $product->video_title ?? 'প্রপার্টি ভার্চুয়াল ভিডিও ট্যুর';

    $ownerPhone = tenant('owner_phone') ?? '01700000000';
    $cleanPhone = preg_replace('/[^0-9]/', '', $ownerPhone);
    $waNumber = str_starts_with($cleanPhone, '88') ? $cleanPhone : ('88' . ltrim($cleanPhone, '0'));
    $productTitle = ($product->name === 'Price Upon Request') ? 'Huntleigh Luxury Country Estate & Villa' : $product->name;
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" 
     x-data="{
        activeImage: '{{ $firstImage }}'
     }">

    @if(session('success'))
        <div class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-3">
            <span class="text-xl">✓</span>
            <span>{{ session('success') }}</span>
        </div>
    @endif

    <div class="space-y-8">
        <!-- Header Summary -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 text-xs font-bold border border-indigo-200/80 mb-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    এক্সক্লুসিভ প্রপার্টি শোকেস
                </span>
                <h1 class="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">{{ $productTitle }}</h1>
                @if(!empty($specs['location']) || !empty($specs['address']))
                    <p class="text-xs sm:text-sm text-zinc-500 mt-1 flex items-center gap-1.5 font-medium">
                        <svg class="w-4 h-4 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
                        {{ $specs['location'] ?? $specs['address'] }}
                    </p>
                @endif
            </div>

            <div class="bg-zinc-900 text-white p-4 sm:px-6 sm:py-3 rounded-2xl shadow-sm text-right">
                <span class="text-[11px] uppercase tracking-widest text-zinc-400 block font-bold">শুরু মূল্য / আনুমানিক দাম</span>
                <span class="text-2xl sm:text-3xl font-black text-indigo-400">
                    @if($product->price > 0)
                        ৳{{ number_format($product->price, 0) }}
                    @else
                        <span class="text-lg">আলোচনা সাপেক্ষে</span>
                    @endif
                </span>
            </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- Left: Gallery, Specs & Dedicated Video Section -->
            <div class="lg:col-span-8 space-y-6">
                <!-- Pure Image Gallery (No Video Mixed In) -->
                <div class="bg-white rounded-3xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-4">
                    <div class="aspect-[16/10] bg-zinc-100 rounded-2xl overflow-hidden relative border border-zinc-200 flex items-center justify-center">
                        @if(!empty($firstImage))
                            <img :src="activeImage" 
                                 src="{{ $firstImage }}" 
                                 alt="{{ $productTitle }}" 
                                 class="w-full h-full object-cover transition-all duration-300">
                        @else
                            <div class="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                                <span class="text-6xl">🏢</span>
                                <span class="text-xs text-zinc-400 mt-2">কোনো ছবি সংযুক্ত করা হয়নি</span>
                            </div>
                        @endif
                    </div>

                    @if(count($images) > 1)
                        <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                            @foreach($images as $img)
                                @php $imgUrl = asset('storage/' . $img); @endphp
                                <button type="button" 
                                        x-on:click="activeImage = '{{ $imgUrl }}'"
                                        :class="(activeImage === '{{ $imgUrl }}') ? 'border-indigo-600 ring-4 ring-indigo-600/20' : 'border-zinc-200 opacity-75 hover:opacity-100'"
                                        class="w-20 h-16 rounded-xl border-2 p-0.5 overflow-hidden flex-shrink-0 transition-all focus:outline-none cursor-pointer">
                                    <img src="{{ $imgUrl }}" class="w-full h-full object-cover rounded-lg" alt="Thumbnail">
                                </button>
                            @endforeach
                        </div>
                    @endif
                </div>

                <!-- Dedicated Video Section (Outside Gallery) -->
                @if($hasVideo && !empty($videoSourceUrl))
                    <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-7 shadow-sm space-y-4">
                        <div class="flex items-center justify-between border-b border-zinc-100 pb-3.5">
                            <div class="flex items-center gap-2.5">
                                <span class="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                                <h3 class="text-sm sm:text-base font-black text-zinc-900 tracking-tight uppercase">
                                    {{ $videoTitle }}
                                </h3>
                            </div>
                            <span class="text-xs bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded-full border border-rose-100 flex items-center gap-1.5">
                                <span>🎥</span>
                                <span>ভিডিও ট্যুর</span>
                            </span>
                        </div>

                        <div class="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-inner">
                            @if($videoType === 'file')
                                <video src="{{ $videoSourceUrl }}" controls class="w-full h-full" playsinline preload="metadata"></video>
                            @else
                                <iframe src="{{ $videoSourceUrl }}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            @endif
                        </div>
                    </div>
                @endif

                <!-- Property Specs -->
                @if(!empty($specs))
                    <div class="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
                        <h3 class="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span class="w-2 h-4 bg-indigo-600 rounded-full"></span>
                            প্রপার্টির মূল বৈশিষ্ট্য ও সুযোগ-সুবিধা
                        </h3>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            @foreach($specs as $key => $val)
                                @if(!blank($val))
                                    <div class="p-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col justify-between">
                                        <span class="text-[11px] font-semibold text-zinc-400 capitalize mb-1">{{ ucfirst(str_replace('_', ' ', $key)) }}</span>
                                        <span class="text-base font-black text-zinc-900">{{ is_bool($val) ? ($val ? 'হ্যাঁ' : 'না') : $val }}</span>
                                    </div>
                                @endif
                            @endforeach
                        </div>
                    </div>
                @endif

                @if($product->description)
                    <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-4">
                        <h3 class="text-base font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-3">বিস্তারিত বিবরণ</h3>
                        <div class="text-sm text-zinc-600 leading-relaxed prose prose-zinc max-w-none">
                            {!! $product->description !!}
                        </div>
                    </div>
                @endif
            </div>

            <!-- Right: Inquiry Form -->
            <div class="lg:col-span-4 sticky top-24 space-y-4">
                <div class="bg-white rounded-3xl border-2 border-indigo-600/30 p-6 shadow-xl relative overflow-hidden">
                    <div class="border-b border-zinc-100 pb-4 mb-5">
                        <span class="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                            <span class="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                            সরাসরি ইনকোয়ারি ও সাইট ভিজিট
                        </span>
                        <h2 class="text-lg font-black text-zinc-900">এই প্রপার্টি সম্পর্কে কথা বলুন</h2>
                        <p class="text-xs text-zinc-500 mt-0.5">সাইট ভিজিট শিডিউল বা ব্রোশিওরের জন্য আবেদন করুন।</p>
                    </div>

                    <div class="grid grid-cols-2 gap-2.5 mb-5">
                        <a href="https://wa.me/{{ $waNumber }}?text={{ urlencode('আসসালামু আলাইকুম, আমি ' . $productTitle . ' প্রপার্টি সম্পর্কে বিস্তারিত জানতে আগ্রহী।') }}" 
                           target="_blank" 
                           class="flex items-center justify-center gap-2 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs transition shadow-sm">
                            <span>WhatsApp</span>
                        </a>
                        <a href="tel:{{ $ownerPhone }}" 
                           class="flex items-center justify-center gap-2 py-3 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition shadow-sm">
                            <span>কল করুন</span>
                        </a>
                    </div>

                    <form action="{{ route('storefront.order.place') }}" method="POST" class="space-y-3.5 pt-2 border-t border-zinc-100">
                        @csrf
                        <input type="hidden" name="product_id" value="{{ $product->id }}">
                        <input type="hidden" name="district" value="Lead Inquiry">
                        <input type="hidden" name="payment_method" value="inquiry">

                        <div>
                            <label class="block text-xs font-bold text-zinc-700 mb-1">আপনার নাম <span class="text-rose-500">*</span></label>
                            <input type="text" name="customer_name" required value="{{ old('customer_name') }}" placeholder="যেমন: ইঞ্জিনিয়ার তানভীর" class="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-700 mb-1">মোবাইল নম্বর <span class="text-rose-500">*</span></label>
                            <input type="tel" name="customer_phone" required value="{{ old('customer_phone') }}" placeholder="০১xxxxxxxxx (১১ ডিজিট)" class="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-700 mb-1">আপনার ইনকোয়ারি বা বার্তা</label>
                            <textarea name="shipping_address" rows="3" placeholder="দাম আলোচনা বা ভিজিট করার সম্ভাব্য সময় লিখুন..." class="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition">{{ old('shipping_address') }}</textarea>
                        </div>

                        <button type="submit" class="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                            <span>ইনকোয়ারি পাঠান</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection