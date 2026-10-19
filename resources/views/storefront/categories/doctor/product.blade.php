@extends('layouts.storefront')

@section('content')
@php
    $category = tenant('business_category') ?? 'doctor';
    $rawImages = $product->images;
    $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
    $firstImage = !empty($images) ? asset('storage/' . $images[0]) : null;

    $rawSpecs = $product->item_attributes ?? $product->specs;
    $specs = is_array($rawSpecs) ? $rawSpecs : (is_string($rawSpecs) ? (json_decode($rawSpecs, true) ?? []) : []);

    $hasVideo = $product->has_video ?? (!empty($product->video_path) || !empty($product->embed_video_url));
    $videoType = $product->video_type ?? (!empty($product->video_path) ? 'file' : 'embed');
    $videoSourceUrl = $product->video_source_url ?? $product->embed_video_url;

    $visitingHoursText = $specs['visiting_hours'] ?? '05:00 PM - 09:00 PM';
    $priceLabel = match($category) {
        'doctor' => 'কনসালটেশন ফি',
        'barber_salon', 'tailors', 'coaching_service' => 'সার্ভিস চার্জ / ফি',
        default => 'ফি / চার্জ',
    };
    $validImages = $images;
    $validSpecs = $specs;
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" 
     x-data="{
        activeImage: '{{ $firstImage }}',
        selectedDate: '{{ date('Y-m-d') }}',
        selectedTime: '',
        loadingSlots: false,
        availableSlots: [],
        init() {
            this.fetchSlots();
        },
        fetchSlots() {
            if (!this.selectedDate) return;
            this.loadingSlots = true;
            this.selectedTime = '';
            fetch('{{ route('storefront.booking.slots') }}?product_id={{ $product->id }}&date=' + this.selectedDate)
                .then(r => r.json())
                .then(data => {
                    this.availableSlots = data.slots || [];
                    this.loadingSlots = false;
                })
                .catch(() => {
                    this.loadingSlots = false;
                    this.availableSlots = [
                        { time: '05:00 PM - 06:00 PM', label: '05:00 PM - 06:00 PM', is_full: false },
                        { time: '06:00 PM - 07:00 PM', label: '06:00 PM - 07:00 PM', is_full: false },
                        { time: '07:00 PM - 08:00 PM', label: '07:00 PM - 08:00 PM', is_full: false },
                        { time: '08:00 PM - 09:00 PM', label: '08:00 PM - 09:00 PM', is_full: false }
                    ];
                });
        }
     }">

    @if(session('success'))
        <div class="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-3">
            <span class="text-xl">✓</span>
            <span>{{ session('success') }}</span>
        </div>
    @endif

    <div class="space-y-8">
        <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                <!-- Media Left Frame -->
                <div class="md:col-span-5 space-y-5">
                    
                    <!-- Main Image Preview Box -->
                    <div class="w-full aspect-[4/3] bg-zinc-100 rounded-2xl overflow-hidden relative flex items-center justify-center border border-zinc-200 shadow-inner">
                        @if($firstImage)
                            <img x-show="activeImage" :src="activeImage" src="{{ $firstImage }}" alt="{{ $product->name }}" class="w-full h-full object-cover transition-all duration-300">
                            <div x-show="!activeImage" style="display: none;" class="w-full h-full flex items-center justify-center text-zinc-400">
                                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                        @else
                            <div class="w-full h-full flex items-center justify-center text-zinc-400">
                                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                        @endif
                    </div>

                    <!-- Thumbnails Gallery -->
                    @if(count($validImages) > 1)
                        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                            @foreach($validImages as $img)
                                @php $imgUrl = asset('storage/' . $img); @endphp
                                <button type="button" 
                                        x-on:click="activeImage = '{{ $imgUrl }}'"
                                        :class="(activeImage === '{{ $imgUrl }}') ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-zinc-200 hover:border-zinc-400'"
                                        class="w-14 h-14 rounded-xl border-2 p-0.5 bg-white overflow-hidden flex-shrink-0 transition-all focus:outline-none cursor-pointer">
                                    <img src="{{ $imgUrl }}" class="w-full h-full object-cover rounded-lg" alt="Thumbnail">
                                </button>
                            @endforeach
                        </div>
                    @endif
                </div>

                <!-- Doctor Profile Details (Right Frame) -->
                <div class="md:col-span-7 space-y-4">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        সরাসরি চেম্বার সিরিয়াল বুকিং
                    </div>

                    <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-900 leading-snug">{{ $product->name }}</h1>

                    @if(!empty($specs['specialization']) || !empty($specs['degrees']))
                        <p class="text-sm sm:text-base font-semibold text-emerald-800">
                            {{ $specs['specialization'] ?? '' }}
                            @if(!empty($specs['degrees']))
                                <span class="text-zinc-500 font-normal">({{ $specs['degrees'] }})</span>
                            @endif
                        </p>
                    @endif

                    <div class="flex items-center gap-3 py-2 border-y border-zinc-100">
                        <span class="text-xs font-bold text-zinc-500 uppercase tracking-wide">{{ $priceLabel }}:</span>
                        <span class="text-2xl font-black text-emerald-600">৳{{ number_format($product->sale_price ?: $product->price, 0) }}</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div class="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <span class="block text-[11px] font-bold text-zinc-400 uppercase mb-1">ভিজিটিং সময়সূচি</span>
                            <span class="text-xs font-bold text-zinc-800">{{ $visitingHoursText }}</span>
                        </div>
                        @if(!empty($specs['chamber_location']))
                            <div class="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                <span class="block text-[11px] font-bold text-zinc-400 uppercase mb-1">চেম্বার / লোকেশন</span>
                                <span class="text-xs font-bold text-zinc-800">{{ $specs['chamber_location'] }}</span>
                            </div>
                        @endif
                    </div>

                    <!-- Doctor Profile Specs Grid -->
                    @if(!empty($validSpecs))
                        <div class="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-3">
                            <div class="flex items-center gap-2">
                                <span class="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                                <h3 class="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                                    চিকিৎসকের তথ্য ও বিবরণ
                                </h3>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                @foreach($validSpecs as $key => $val)
                                    @if(!blank($val) && !in_array($key, ['specialization', 'degrees', 'visiting_hours', 'chamber_location']))
                                        <div class="flex items-center justify-between p-2.5 bg-white rounded-lg border border-zinc-100">
                                            <span class="text-zinc-500 capitalize">{{ ucfirst(str_replace('_', ' ', $key)) }}</span>
                                            <span class="font-bold text-zinc-800 text-right">{{ is_bool($val) ? ($val ? 'হ্যাঁ' : 'না') : $val }}</span>
                                        </div>
                                    @endif
                                @endforeach
                            </div>
                        </div>
                    @endif

                    @if($product->description)
                        <div class="border-t border-zinc-100 pt-3 text-xs sm:text-sm text-zinc-600 prose prose-zinc max-w-none">
                            {!! $product->description !!}
                        </div>
                    @endif
                </div>

            </div>
        </div>

        <!-- Dedicated Video Showcase Section (Outside Gallery) -->
        @if($hasVideo && !empty($videoSourceUrl))
            <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-4">
                <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div class="flex items-center gap-2.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                        <h3 class="text-sm sm:text-base font-black text-zinc-900 tracking-tight uppercase">
                            {{ $product->video_title ?? 'ডাক্তারের পরিচিতি ও ভিডিও বার্তা' }}
                        </h3>
                    </div>
                    <span class="text-xs bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full border border-red-100 flex items-center gap-1.5">
                        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        ভিডিও বার্তা
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

        <!-- Booking Form -->
        <div class="max-w-3xl mx-auto">
            <div class="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-8 shadow-md">
                <div class="border-b border-zinc-100 pb-4 mb-6">
                    <span class="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full mb-2">
                        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        সিরিয়াল বুকিং ফর্ম
                    </span>
                    <h2 class="text-xl font-bold text-zinc-900">আপনার সিরিয়াল নিশ্চিত করতে ফর্মটি পূরণ করুন</h2>
                    <p class="text-xs text-zinc-500 mt-1">ডাক্তারের নিয়মিত সময়সূচি: <strong>{{ $visitingHoursText }}</strong></p>
                </div>

                <form action="{{ route('storefront.order.place') }}" method="POST" class="space-y-4">
                    @csrf
                    <input type="hidden" name="product_id" value="{{ $product->id }}">
                    <input type="hidden" name="quantity" value="1">
                    <input type="hidden" name="district" value="Service Booking">
                    <input type="hidden" name="payment_method" value="cod">

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-zinc-700 mb-1">রোগী / ক্লায়েন্টের নাম <span class="text-rose-500">*</span></label>
                            <input type="text" name="customer_name" required value="{{ old('customer_name') }}" placeholder="যেমন: শামীম আহমেদ" class="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-700 mb-1">যোগাযোগের মোবাইল নম্বর <span class="text-rose-500">*</span></label>
                            <input type="tel" name="customer_phone" required value="{{ old('customer_phone') }}" placeholder="০১xxxxxxxxx (১১ ডিজিট)" class="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-zinc-700 mb-1">তারিখ নির্বাচন করুন <span class="text-rose-500">*</span></label>
                            <input type="date" 
                                   name="booking_date" 
                                   required 
                                   min="{{ date('Y-m-d') }}" 
                                   x-model="selectedDate" 
                                   x-on:change="fetchSlots()" 
                                   class="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-zinc-700 mb-1">
                                ভিজিটের সময় নির্বাচন করুন <span class="text-rose-500">*</span>
                                <span x-show="loadingSlots" class="text-[10px] text-emerald-600 font-normal animate-pulse">(যাচাই হচ্ছে...)</span>
                            </label>
                            <select name="booking_time" 
                                    required 
                                    x-model="selectedTime" 
                                    :disabled="loadingSlots || availableSlots.length === 0"
                                    class="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition disabled:bg-zinc-100">
                                <option value="" disabled selected>সময় স্লট বেছে নিন</option>
                                <template x-for="slot in availableSlots" :key="slot.time">
                                    <option :value="slot.time" 
                                            :disabled="slot.is_full" 
                                            :class="slot.is_full ? 'text-zinc-400 bg-zinc-100' : 'text-zinc-900 font-semibold'"
                                            x-text="slot.label">
                                    </option>
                                </template>
                            </select>
                            <span class="block text-[11px] text-zinc-500 mt-1">প্রতি ১ ঘণ্টার স্লটে সর্বোচ্চ ১০ জন রোগী দেখা হবে।</span>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-zinc-700 mb-1">সমস্যা বা সেবার সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</label>
                        <textarea name="shipping_address" rows="2" placeholder="রোগীর বয়স বা শারীরিক সমস্যা উল্লেখ করুন..." class="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition">{{ old('shipping_address') }}</textarea>
                    </div>

                    <div class="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex justify-between items-center text-xs">
                        <div>
                            <span class="font-bold text-emerald-950 block">কনসালটেশন ফি:</span>
                            <span class="text-[11px] text-emerald-700">চেম্বারে উপস্থিত হয়ে সাক্ষাৎকালে পরিশোধযোগ্য</span>
                        </div>
                        <span class="text-xl font-black text-emerald-700">৳{{ number_format($product->sale_price ?: $product->price, 0) }}</span>
                    </div>

                    <button type="submit" 
                            :disabled="!selectedTime"
                            class="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-400 text-white font-bold py-4 px-4 rounded-xl text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                        <span>সিরিয়াল / বুকিং কনফার্ম করুন</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection