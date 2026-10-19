@extends('layouts.storefront')

@section('content')
@php
    $category = tenant('business_category') ?? 'doctor';
    $categoryDefaults = config("business_presets.category_defaults.{$category}") 
        ?? config("business_presets.category_defaults.doctor", []);

    $creds = tenant('gateway_credentials') ?? [];
    $tenantBranding = tenant('branding') ?? $creds['branding'] ?? [];
    $branding = array_merge($categoryDefaults, array_filter((array)$tenantBranding, fn($v) => !is_null($v) && $v !== ''));

    $currency = $branding['currency_symbol'] ?? 'BDT';
    $currPrefix = ($currency === 'BDT' ? 'BDT ' : ($currency === 'USD' ? '$' : '৳'));

    $heroBadge = $branding['hero_badge'] ?? '🩺 BMDC Certified Specialists';
    $heroTitle = $branding['hero_title'] ?? 'Trusted Specialist Doctor Appointments & Chamber Care';
    $heroSubtitle = $branding['hero_subtitle'] ?? 'Book doctor appointment serials online with zero waiting time. Verified BMDC doctors, professional chambers, and dedicated care.';
    $heroBtnText = $branding['hero_btn_text'] ?? 'Book Appointment Serial';
    $heroBtnUrl = $branding['hero_btn_url'] ?? '#products';

    $perk1Title = $branding['perk_1_title'] ?? 'BMDC Verified Doctors';
    $perk1Desc = $branding['perk_1_desc'] ?? 'Consult with verified specialist physicians and consultants.';
    $perk2Title = $branding['perk_2_title'] ?? 'Zero Waiting Serial';
    $perk2Desc = $branding['perk_2_desc'] ?? 'Pre-booked time slots ensure minimal waiting time at chamber.';
    $perk3Title = $branding['perk_3_title'] ?? 'Chamber & Video Consult';
    $perk3Desc = $branding['perk_3_desc'] ?? 'In-person chamber visits and online follow-up consultations.';
    $perk4Title = $branding['perk_4_title'] ?? 'Patient Care Support';
    $perk4Desc = $branding['perk_4_desc'] ?? 'Instant serial confirmation and SMS appointment reminders.';

    $hotline = $branding['hotline_number'] ?? '+880 1700-000000';
    $whatsapp = $branding['whatsapp_number'] ?? '+880 1700-000000';
@endphp

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">

    <!-- 1. Healthcare & Clinic Hero Showcase -->
    <div class="relative bg-gradient-to-br from-teal-950 via-zinc-900 to-zinc-950 border border-teal-900/40 rounded-3xl p-6 sm:p-10 lg:p-12 text-white overflow-hidden shadow-2xl">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-5">
                <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 uppercase tracking-wide">
                    {{ $heroBadge }}
                </span>

                <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
                    {{ $heroTitle }}
                </h1>

                <p class="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
                    {{ $heroSubtitle }}
                </p>

                <!-- Value Props Checks -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-zinc-300 font-semibold">
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">✓</span>
                        <span>BMDC Verified</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">✓</span>
                        <span>Zero Wait Time</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-xs">✓</span>
                        <span>Chamber & Serial Care</span>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-3 pt-3">
                    <a href="{{ $heroBtnUrl }}" class="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl text-sm transition shadow-lg flex items-center gap-2">
                        <span>{{ $heroBtnText }}</span>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    </a>
                    <a href="tel:{{ $hotline }}" class="px-5 py-3.5 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-white font-bold rounded-xl text-sm transition flex items-center gap-2">
                        <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <span>Emergency Helpline</span>
                    </a>
                </div>
            </div>

            <div class="lg:col-span-5 relative flex items-center justify-center">
                <div class="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-teal-500/30 group">
                    <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80" 
                         alt="Specialist Doctor Consultation" 
                         class="w-full h-full object-cover transition duration-500 group-hover:scale-105">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                        <p class="text-xs font-semibold text-teal-300">🩺 Certified Chamber Care</p>
                        <p class="text-sm font-bold">Specialist Doctors & Pre-Booked Chamber Serials</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 2. Value Perks Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl flex-shrink-0">
                👨‍⚕️
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk1Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk1Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl flex-shrink-0">
                ⚡
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk2Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk2Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl flex-shrink-0">
                🏥
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk3Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk3Desc }}</p>
            </div>
        </div>
        <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl flex-shrink-0">
                📞
            </div>
            <div>
                <h4 class="text-xs font-bold text-zinc-900">{{ $perk4Title }}</h4>
                <p class="text-[11px] text-zinc-500 mt-0.5">{{ $perk4Desc }}</p>
            </div>
        </div>
    </div>

    <!-- 3. Medical Department Filter -->
    @if($categories->count() > 0)
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-black text-zinc-900 tracking-tight flex items-center gap-2">
                    <span>🩺 Departments & Specialties</span>
                </h3>
            </div>
            <div class="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                <a href="{{ route('storefront.home') }}" 
                   class="px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0 {{ !request('category') ? 'bg-zinc-950 text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50' }}">
                    All Specialists
                </a>
                @foreach($categories as $cat)
                    <a href="{{ route('storefront.home', ['category' => $cat->slug]) }}" 
                       class="px-4 py-2 rounded-full text-xs font-bold transition flex-shrink-0 {{ request('category') === $cat->slug ? 'bg-teal-600 text-white' : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50' }}">
                        {{ $cat->name }}
                    </a>
                @endforeach
            </div>
        </div>
    @endif

    <!-- 4. Doctors & Specialist List -->
    <div id="products" class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-4">
            <div>
                <h2 class="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                    {{ request('search') ? 'Specialists matching: "' . request('search') . '"' : 'Specialist Doctors & Consultants' }}
                </h2>
                <p class="text-xs text-zinc-500 mt-1">
                    Showing {{ $products->total() }} BMDC registered doctors with chamber timings
                </p>
            </div>
        </div>

        @if($products->isEmpty())
            <div class="text-center py-16 bg-white rounded-3xl border border-dashed border-zinc-300 p-8">
                <div class="w-16 h-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto text-3xl mb-4">
                    🩺
                </div>
                <h3 class="text-base font-bold text-zinc-900">No Doctors Found</h3>
                <p class="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                    No doctors found matching your current filter. Please browse other departments.
                </p>
                <a href="{{ route('storefront.home') }}" class="mt-4 inline-block px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl transition hover:bg-zinc-800">
                    View All Doctors
                </a>
            </div>
        @else
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($products as $product)
                    @php
                        $rawImages = $product->images;
                        $images = is_array($rawImages) ? $rawImages : (is_string($rawImages) ? (json_decode($rawImages, true) ?? []) : []);
                        $mainImage = !empty($images) ? asset('storage/' . $images[0]) : null;

                        $rawSpecs = $product->item_attributes ?? $product->specs;
                        $specs = is_array($rawSpecs) ? $rawSpecs : (is_string($rawSpecs) ? (json_decode($rawSpecs, true) ?? []) : []);

                        $degrees = $specs['degrees'] ?? 'MBBS, FCPS';
                        $specialization = $specs['specialization'] ?? ($product->category->name ?? 'Consultant');
                        $visitingHours = $specs['visiting_hours'] ?? 'Sat - Thu: 05:00 PM - 09:00 PM';
                        $experience = $specs['experience_years'] ?? '10+ Years';
                        $chamber = $specs['chamber_location'] ?? 'Chamber #204, Dhaka';
                        $fee = $product->price;
                    @endphp

                    <div class="group bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-300 transition-all duration-300 p-6 flex flex-col justify-between">
                        <div class="space-y-4">
                            <div class="flex items-start gap-4">
                                <div class="w-20 h-20 rounded-2xl bg-teal-50 border border-teal-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    @if($mainImage)
                                        <img src="{{ $mainImage }}" alt="{{ $product->name }}" class="w-full h-full object-cover">
                                    @else
                                        <span class="text-3xl">👨‍⚕️</span>
                                    @endif
                                </div>
                                <div class="space-y-1">
                                    <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                                        {{ $specialization }}
                                    </span>
                                    <h3 class="text-base font-black text-zinc-950 group-hover:text-teal-600 transition">
                                        <a href="{{ route('storefront.product', $product->slug) }}">
                                            {{ $product->name }}
                                        </a>
                                    </h3>
                                    <p class="text-xs text-zinc-500 font-medium">
                                        {{ $degrees }}
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-2 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                                <div class="flex items-center gap-2">
                                    <span class="text-teal-600 font-bold">🕒 চেম্বার সময়:</span>
                                    <span>{{ $visitingHours }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-teal-600 font-bold">🏥 চেম্বার:</span>
                                    <span class="line-clamp-1">{{ $chamber }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-teal-600 font-bold">🎖️ অভিজ্ঞতা:</span>
                                    <span>{{ $experience }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between gap-4">
                            <div>
                                <span class="block text-[10px] text-zinc-400 font-bold uppercase">কনসালটেশন ফি</span>
                                <span class="text-lg font-black text-zinc-950">
                                    {{ $currPrefix }}{{ number_format($fee) }}
                                </span>
                            </div>

                            <a href="{{ route('storefront.product', $product->slug) }}" 
                               class="py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-xs">
                                <span>সিরিয়াল বুক করুন</span>
                            </a>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="pt-8">
                {{ $products->links() }}
            </div>
        @endif
    </div>

</div>
@endsection
