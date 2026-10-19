<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>আপনার অনলাইন স্টোর ও প্ল্যাটফর্ম তৈরি করুন - Multi-Business SaaS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Hind Siliguri', sans-serif; }</style>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen flex items-center justify-center p-4 py-8">

    <div class="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div class="text-center mb-6">
            <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-zinc-950 font-black text-2xl mx-auto mb-3 shadow-lg shadow-amber-500/20">
                S
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-white">মাল্টি-বিজনেস প্ল্যাটফর্ম</h1>
            <p class="text-zinc-400 text-xs mt-1">ব্যবসার ধরন বেছে নিলেই আপনার অ্যাডমিন ও ওয়েবসাইট স্বয়ংক্রিয়ভাবে সাজানো হয়ে যাবে</p>
        </div>

        @if($errors->any())
            <div class="bg-rose-950/50 border border-rose-800 text-rose-300 p-3.5 rounded-xl mb-4 text-xs">
                <ul class="list-disc list-inside space-y-1">
                    @foreach($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="{{ route('central.register.post') }}" method="POST" class="space-y-4">
            @csrf

            <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1">দোকান বা প্রতিষ্ঠানের নাম (Store Name)</label>
                <input type="text" name="store_name" value="{{ old('store_name') }}" required placeholder="e.g. Doel Fashion / Dr. Rahim Chamber" class="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-amber-500">
            </div>

            <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1">ব্যবসার ধরন / ক্যাটাগরি নির্বাচন করুন</label>
                <select name="business_category" id="business_category" required class="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-amber-500">
                    <option value="" disabled {{ old('business_category') ? '' : 'selected' }}>-- ব্যবসার ধরন বেছে নিন --</option>
                    
                    <optgroup label="১. পণ্য দোকান (Physical Store)">
                        <option value="fashion_clothing" {{ old('business_category') === 'fashion_clothing' ? 'selected' : '' }}>ফ্যাশন ও পোশাক</option>
                        <option value="mobile_gadgets" {{ old('business_category') === 'mobile_gadgets' ? 'selected' : '' }}>মোবাইল ও গ্যাজেট</option>
                        <option value="laptop_computer" {{ old('business_category') === 'laptop_computer' ? 'selected' : '' }}>ল্যাপটপ ও কম্পিউটার</option>
                        <option value="jewelry" {{ old('business_category') === 'jewelry' ? 'selected' : '' }}>জুয়েলারি ও স্বর্ণ-রূপা</option>
                        <option value="pharmacy" {{ old('business_category') === 'pharmacy' ? 'selected' : '' }}>ফার্মেসি ও ওষুধ</option>
                        <option value="grocery_food" {{ old('business_category') === 'grocery_food' ? 'selected' : '' }}>গ্রোসারি ও সুপারশপ</option>
                        <option value="shoes_footwear" {{ old('business_category') === 'shoes_footwear' ? 'selected' : '' }}>জুতা ও ফুটওয়্যার</option>
                        <option value="pet_food" {{ old('business_category') === 'pet_food' ? 'selected' : '' }}>পোষা প্রাণীর খাবার ও এক্সেসরিজ</option>
                    </optgroup>

                    <optgroup label="২. মেনু ও খাবার (Food & Menu)">
                        <option value="restaurant" {{ old('business_category') === 'restaurant' ? 'selected' : '' }}>রেস্টুরেন্ট ও ফুড মেনু</option>
                        <option value="bakery_pastry" {{ old('business_category') === 'bakery_pastry' ? 'selected' : '' }}>বেকারি ও পেস্ট্রি শপ</option>
                    </optgroup>

                    <optgroup label="৩. সার্ভিস ও বুকিং (Service & Booking)">
                        <option value="doctor" {{ old('business_category') === 'doctor' ? 'selected' : '' }}>ডাক্তার ও চেম্বার কনসালটেশন</option>
                        <option value="barber_salon" {{ old('business_category') === 'barber_salon' ? 'selected' : '' }}>সেলুন ও বিউটি পার্লার</option>
                        <option value="coaching_service" {{ old('business_category') === 'coaching_service' ? 'selected' : '' }}>কোচিং সেন্টার ও প্রাইভেট টিউশন</option>
                    </optgroup>

                    <optgroup label="৪. তালিকা ও ইনকোয়ারি (Listing & Inquiry)">
                        <option value="real_estate" {{ old('business_category') === 'real_estate' ? 'selected' : '' }}>রিয়েল এস্টেট ও প্রপার্টি</option>
                        <option value="house_rental" {{ old('business_category') === 'house_rental' ? 'selected' : '' }}>বাড়ি ও ফ্ল্যাট ভাড়া</option>
                        <option value="vehicle_dealership" {{ old('business_category') === 'vehicle_dealership' ? 'selected' : '' }}>যানবাহন ও গাড়ি কেনাবেচা</option>
                        <option value="matchmaker" {{ old('business_category') === 'matchmaker' ? 'selected' : '' }}>ম্যারেজ মিডিয়া ও পাত্র-পাত্রী বায়োডাটা</option>
                    </optgroup>

                    <optgroup label="৫. ডিজিটাল ও কোর্স (Digital & Courses)">
                        <option value="digital_product" {{ old('business_category') === 'digital_product' ? 'selected' : '' }}>ডিজিটাল ফাইল ও ইবুক</option>
                        <option value="online_course" {{ old('business_category') === 'online_course' ? 'selected' : '' }}>অনলাইন কোর্স ও ট্রেনিং</option>
                    </optgroup>

                    <optgroup label="৬. পোর্টফোলিও ও কনটেন্ট (Portfolio & Content)">
                        <option value="portfolio_content" {{ old('business_category') === 'portfolio_content' ? 'selected' : '' }}>পোর্টফোলিও ও এজেন্সি প্রজেক্ট</option>
                    </optgroup>
                </select>
            </div>

            <!-- ফার্মেসি নির্বাচিত হলে ড্রাগ লাইসেন্স ফিল্ড -->
            <div id="drug_license_box" class="hidden bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl">
                <label class="block text-xs font-semibold text-amber-300 mb-1">ড্রাগ লাইসেন্স নম্বর (ঔষধ প্রশাসন অধিদপ্তর)</label>
                <input type="text" name="drug_license_no" value="{{ old('drug_license_no') }}" placeholder="DL-DHAKA-12345" class="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500">
                <p class="text-[11px] text-amber-400/80 mt-1">ডিজিটাল কমার্স নির্দেশিকা অনুযায়ী ফার্মেসি লাইসেন্স যাচাই সাপেক্ষে সক্রিয় হবে।</p>
            </div>

            <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1">পছন্দের সাবডোমেইন</label>
                <div class="flex items-center">
                    <input type="text" name="subdomain" value="{{ old('subdomain') }}" required placeholder="mybrand" class="w-full bg-zinc-800 border border-zinc-700 rounded-l-xl py-2 px-3.5 text-sm text-white focus:outline-none focus:border-amber-500">
                    <span class="bg-zinc-800 border border-l-0 border-zinc-700 text-zinc-400 px-3 py-2 rounded-r-xl text-xs font-mono">.localhost</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">অ্যাডমিনের নাম</label>
                    <input type="text" name="admin_name" value="{{ old('admin_name') }}" required placeholder="আপনার নাম" class="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">মোবাইল নম্বর</label>
                    <input type="tel" name="customer_phone" value="{{ old('customer_phone') }}" required placeholder="017xxxxxxxx" class="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500">
                </div>
            </div>

            <div>
                <label class="block text-xs font-semibold text-zinc-300 mb-1">ইমেইল অ্যাড্রেস</label>
                <input type="email" name="email" value="{{ old('email') }}" required placeholder="admin@domain.com" class="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-3.5 text-sm text-white focus:outline-none focus:border-amber-500">
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">পাসওয়ার্ড</label>
                    <input type="password" name="password" required placeholder="••••••••" class="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-zinc-300 mb-1">পুনরায় পাসওয়ার্ড</label>
                    <input type="password" name="password_confirmation" required placeholder="••••••••" class="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-amber-500">
                </div>
            </div>

            <div class="text-[11px] text-zinc-400 pt-1">
                নিবন্ধন করার মাধ্যমে আপনি আমাদের ব্যবহারের শর্তাবলী, রিফান্ড পলিসি এবং ডিজিটাল কমার্স নির্দেশিকা ২০২১ মেনে চলতে সম্মত হচ্ছেন।
            </div>

            <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-amber-500/20 mt-2">
                প্ল্যাটফর্ম শুরু করুন (১৪ দিনের ট্রায়াল)
            </button>
        </form>
    </div>

    <script>
        const catSelect = document.getElementById('business_category');
        const drugBox = document.getElementById('drug_license_box');
        function checkPharmacy() {
            if (catSelect.value === 'pharmacy') {
                drugBox.classList.remove('hidden');
            } else {
                drugBox.classList.add('hidden');
            }
        }
        catSelect.addEventListener('change', checkPharmacy);
        checkPharmacy();
    </script>
</body>
</html>
