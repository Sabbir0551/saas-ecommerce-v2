@extends('layouts.storefront')

@section('content')
@php
    $archetype = tenant('archetype') ?? 'commerce';
    $firstItem = $order->items->first();
    $product = $firstItem?->product;
    $specs = is_array($product?->specs) ? $product->specs : (json_decode($product?->specs, true) ?? []);
    $chamberLocation = $specs['chamber_location'] ?? 'প্রধান চেম্বার';
    $degrees = $specs['degrees'] ?? '';
    $specialization = $specs['specialization'] ?? '';
    $phone = tenant('owner_phone') ?? '01700000000';
@endphp

<style>
    @media print {
        @page {
            size: A4 portrait;
            margin: 10mm;
        }
        body {
            background-color: #ffffff !important;
            color: #000000 !important;
        }
        header, footer, nav, .print\:hidden {
            display: none !important;
        }
        .print-container {
            border: 1px solid #d1d5db !important;
            box-shadow: none !important;
            padding: 20px !important;
            border-radius: 12px !important;
            page-break-inside: avoid !important;
        }
    }
</style>

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-6">

    {{-- CASE 1: DOCTOR & SERVICE ARCHETYPE (APPOINTMENT SLIP) --}}
    @if($archetype === 'service')
        
        <div class="flex items-center justify-between mb-5 print:hidden">
            <a href="{{ route('storefront.home') }}" class="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-emerald-700 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                হোমপেজে ফিরে যান
            </a>
            <button type="button" onclick="window.print()" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                স্লিপ প্রিন্ট / PDF সংরক্ষণ
            </button>
        </div>

        <div class="print-container bg-white rounded-3xl border-2 border-emerald-500/40 p-6 sm:p-8 shadow-md">
            
            <div class="border-b-2 border-dashed border-zinc-200 pb-5 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                        কনফার্মড অ্যাপয়েন্টমেন্ট স্লিপ
                    </span>
                    <h1 class="text-2xl font-black text-zinc-900 tracking-tight">{{ tenant('business_name') ?? 'মেরি ডেন্টাল কেয়ার' }}</h1>
                    <p class="text-xs text-zinc-600 mt-0.5">চেম্বার হেল্পলাইন: <strong>{{ $phone }}</strong></p>
                </div>
                <div class="text-left sm:text-right bg-emerald-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl w-full sm:w-auto border border-emerald-100 sm:border-0">
                    <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">টোকেন / সিরিয়াল নম্বর</span>
                    <span class="text-xl sm:text-2xl font-black text-emerald-700 tracking-wider font-mono">{{ $order->order_number }}</span>
                    <span class="block text-[11px] text-zinc-500 mt-0.5">বুকিং সময়: {{ $order->created_at->format('d M, Y - h:i A') }}</span>
                </div>
            </div>

            <div class="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 mb-5">
                <div class="flex items-start gap-3.5">
                    <div class="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">
                        {{ mb_substr($firstItem?->product_name ?? 'ড', 0, 1) }}
                    </div>
                    <div class="space-y-0.5">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">কনসালটেন্ট পরিচিতি</span>
                        <h2 class="text-base font-bold text-zinc-900 pt-0.5">{{ $firstItem?->product_name ?? 'নির্দিষ্ট ডাক্তার' }}</h2>
                        @if($specialization || $degrees)
                            <p class="text-xs font-medium text-zinc-600">
                                {{ $specialization }} @if($degrees) <span class="text-zinc-500 font-normal">({{ $degrees }})</span> @endif
                            </p>
                        @endif
                        <p class="text-xs text-zinc-600 pt-0.5">
                            📍 <strong>চেম্বার:</strong> {{ $chamberLocation }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div class="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-900">অ্যাপয়েন্টমেন্টের নির্ধারিত সময়</span>
                    <div class="space-y-1 text-xs">
                        <div class="font-bold text-zinc-900">
                            তারিখ: <span class="text-emerald-800">{{ $order->booking_date ? date('d F, Y (l)', strtotime($order->booking_date)) : 'N/A' }}</span>
                        </div>
                        <div class="font-bold text-zinc-900">
                            নির্দিষ্ট স্লট: <span class="text-emerald-800">{{ $order->booking_time ?? 'N/A' }}</span>
                        </div>
                    </div>
                    <div class="text-[11px] text-emerald-900 font-medium bg-emerald-100/70 p-2 rounded-lg border border-emerald-200/50">
                        ⚠️ অনুগ্রহ করে নির্ধারিত স্লটের অন্তত <strong>১ ঘন্টা  পূর্বে</strong> চেম্বার ডেস্কে উপস্থিত হোন।
                    </div>
                </div>

                <div class="p-4 rounded-2xl border border-zinc-200 bg-white space-y-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400">রোগীর বিবরণ</span>
                    <div class="space-y-1 text-xs text-zinc-700">
                        <div>রোগীর নাম: <strong class="text-zinc-900">{{ $order->customer_name }}</strong></div>
                        <div>মোবাইল নম্বর: <strong class="text-zinc-900">{{ $order->customer_phone }}</strong></div>
                        @if($order->shipping_address && !str_starts_with($order->shipping_address, 'Date:'))
                            <div class="text-zinc-500">নোট/সমস্যা: {{ $order->shipping_address }}</div>
                        @endif
                    </div>
                </div>
            </div>

            <div class="border border-zinc-200 rounded-xl overflow-hidden mb-5">
                <table class="w-full text-left text-xs">
                    <thead class="bg-zinc-100 border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[11px]">
                        <tr>
                            <th class="py-2.5 px-4">বিবরণ</th>
                            <th class="py-2.5 px-4 text-center">স্ট্যাটাস</th>
                            <th class="py-2.5 px-4 text-right">পরিমাণ</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-zinc-200 text-zinc-700">
                        <tr>
                            <td class="py-3 px-4 font-semibold text-zinc-900">ডাক্তার কনসালটেশন ফি</td>
                            <td class="py-3 px-4 text-center">
                                <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
                                    চেম্বারে পরিশোধযোগ্য
                                </span>
                            </td>
                            <td class="py-3 px-4 text-right font-bold text-zinc-900 text-sm">
                                ৳{{ number_format($order->total / 100, 2) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="border-t border-zinc-200 pt-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-600">
                <div class="space-y-1 text-center sm:text-left text-[11px]">
                    <p>• চেম্বারে এসে রিসেপশনে এই টোকেন নম্বরটি প্রদর্শন করুন।</p>
                    <p>• কোনো জরুরি প্রয়োজনে সরাসরি চেম্বারে যোগাযোগ করুন।</p>
                </div>
                <div class="flex items-center gap-2 border border-dashed border-zinc-300 px-3 py-1.5 rounded-xl bg-zinc-50">
                    <span class="text-[10px] text-zinc-400 font-bold uppercase">টোকেন ভেরিফিকেশন:</span>
                    <span class="text-xs font-mono font-bold text-emerald-700">{{ $order->order_number }}</span>
                </div>
            </div>

        </div>

    {{-- CASE 2: LEAD ARCHETYPE (INQUIRY CONFIRMATION) --}}
    @elseif($archetype === 'lead')
        <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-sm text-center">
            <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            
            <span class="inline-block px-3 py-1 bg-indigo-100 text-indigo-900 text-xs font-bold rounded-full mb-2">ইনকোয়ারি গৃহীত হয়েছে</span>
            <h1 class="text-2xl font-bold text-zinc-900">ধন্যবাদ! আপনার ইনকোয়ারিটি গ্রহণ করা হয়েছে</h1>
            <p class="text-xs sm:text-sm text-zinc-500 mt-1">রেফারেন্স নম্বর: <strong>{{ $order->order_number }}</strong></p>

            <div class="border-t border-zinc-100 my-6"></div>

            <div class="max-w-md mx-auto bg-zinc-50 rounded-2xl p-4 border border-zinc-200 text-left space-y-2 text-xs">
                <div class="flex justify-between">
                    <span class="text-zinc-500">প্রপার্টি:</span>
                    <span class="font-bold text-zinc-800">{{ $firstItem?->product_name ?? 'প্রপার্টি' }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-zinc-500">আপনার নাম:</span>
                    <span class="font-bold text-zinc-800">{{ $order->customer_name }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-zinc-500">ফোন নম্বর:</span>
                    <span class="font-bold text-zinc-800">{{ $order->customer_phone }}</span>
                </div>
            </div>

            <p class="text-xs text-zinc-500 mt-4">আমাদের প্রতিনিধি খুব শীঘ্রই আপনার প্রদত্ত মোবাইল নম্বরে যোগাযোগ করবেন।</p>

            <div class="mt-8 flex justify-center gap-3">
                <a href="{{ route('storefront.home') }}" class="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition">
                    অন্যান্য প্রপার্টি দেখুন
                </a>
            </div>
        </div>

    {{-- CASE 3: COMMERCE ARCHETYPE (STANDARD ORDER CONFIRMATION) --}}
    @else
        <div class="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-sm text-center">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            
            <span class="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full mb-2">অর্ডার সফল হয়েছে</span>
            <h1 class="text-2xl font-bold text-zinc-900">ধন্যবাদ! আপনার অর্ডারটি নিশ্চিত করা হয়েছে</h1>
            <p class="text-xs sm:text-sm text-zinc-500 mt-1">অর্ডার নম্বর: <strong>{{ $order->order_number }}</strong></p>

            <div class="border-t border-zinc-100 my-6"></div>

            <div class="max-w-md mx-auto bg-zinc-50 rounded-2xl p-4 border border-zinc-200 text-left space-y-2 text-xs">
                <div class="flex justify-between">
                    <span class="text-zinc-500">গ্রাহকের নাম:</span>
                    <span class="font-bold text-zinc-800">{{ $order->customer_name }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-zinc-500">ফোন নম্বর:</span>
                    <span class="font-bold text-zinc-800">{{ $order->customer_phone }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-zinc-500">মোট বিল:</span>
                    <span class="font-extrabold text-amber-600 text-sm">৳{{ number_format($order->total / 100, 2) }}</span>
                </div>
            </div>

            <div class="mt-8 flex justify-center gap-3">
                <a href="{{ route('storefront.home') }}" class="px-5 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl transition">
                    আরও কেনাকাটা করুন
                </a>
            </div>
        </div>
    @endif

</div>
@endsection