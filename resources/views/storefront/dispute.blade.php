<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>গ্রাহক অভিযোগ ও সহায়তা - {{ tenant('name') ?? 'Official Store' }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Hind Siliguri', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen py-10 px-4">

    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <!-- Header -->
        <div class="bg-blue-600 text-white p-6 sm:p-8">
            <div class="flex items-center justify-between">
                <div>
                    <span class="text-xs font-semibold uppercase tracking-wider bg-blue-500/50 px-2.5 py-1 rounded-full text-blue-100">
                        ডিজিটাল কমার্স নির্দেশিকা ২০২১ কমপ্লায়েন্ট
                    </span>
                    <h1 class="text-2xl font-bold mt-2">গ্রাহক অভিযোগ ও সমস্যা সমাধান সেল</h1>
                </div>
                <div class="text-3xl">🛡️</div>
            </div>
            <p class="text-blue-100 text-sm mt-2">
                পণ্য সরবরাহ, রিফান্ড বা সেবামূলক যেকোনো সমস্যায় আপনার অভিযোগ দাখিল করুন। আমাদের কমপ্লায়েন্স সেল আগামী ৭২ ঘণ্টার মধ্যে যথাযথ পদক্ষেপ গ্রহণ করবে।
            </p>
        </div>

        <div class="p-6 sm:p-8">
            @if(session('success'))
                <div class="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm">
                    <div class="flex items-start gap-3">
                        <span class="text-xl">✅</span>
                        <div>
                            <p class="font-bold text-base">অভিযোগ গৃহীত হয়েছে!</p>
                            <p class="mt-1">{{ session('success') }}</p>
                            <p class="mt-2 text-xs text-emerald-600">অনুগ্রহ করে টিকেট নম্বরটি সংরক্ষণ করুন।</p>
                        </div>
                    </div>
                </div>
            @endif

            @if($errors->any())
                <div class="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
                    <ul class="list-disc list-inside space-y-1">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('storefront.disputes.submit') }}" method="POST" class="space-y-5">
                @csrf

                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">অর্ডার নম্বর (প্রযোজ্য হলে)</label>
                    <input type="text" name="order_number" value="{{ old('order_number', $orderNumber ?? '') }}" placeholder="যেমন: ORD-20261019-12345" class="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500">
                    <p class="text-xs text-slate-400 mt-1">অর্ডার ডেলিভারি বা রিফান্ড সংক্রান্ত হলে অর্ডার নম্বর দিন</p>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">আপনার নাম <span class="text-rose-500">*</span></label>
                        <input type="text" name="customer_name" value="{{ old('customer_name') }}" required placeholder="আপনার পুরো নাম" class="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-semibold text-slate-700 mb-1">মোবাইল ফোন নম্বর <span class="text-rose-500">*</span></label>
                        <input type="tel" name="customer_phone" value="{{ old('customer_phone') }}" required placeholder="017xxxxxxxx" class="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                    <input type="email" name="customer_email" value="{{ old('customer_email') }}" placeholder="example@mail.com" class="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">অভিযোগের বিষয় <span class="text-rose-500">*</span></label>
                    <select name="subject" required class="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500">
                        <option value="" disabled {{ old('subject') ? '' : 'selected' }}>-- বিষয় নির্বাচন করুন --</option>
                        <option value="৪৮ ঘণ্টায় পণ্য কুরিয়ারে হস্তান্তর করা হয়নি">৪৮ ঘণ্টায় পণ্য কুরিয়ারে হস্তান্তর করা হয়নি (বিলম্বিত ডেলিভারি)</option>
                        <option value="ত্রুটিপূর্ণ বা ভুল পণ্য পেয়েছি">ত্রুটিপূর্ণ বা ভুল পণ্য পেয়েছি (রিপ্লেসমেন্ট প্রয়োজন)</option>
                        <option value="পণ্য সরবরাহ অসম্ভব ঘোষণা ও রিফান্ড দাবি">পণ্য সরবরাহ অসম্ভব ঘোষণা ও ৭২ ঘণ্টার রিফান্ড দাবি</option>
                        <option value="বুকিং বা সিরিয়াল শিডিউলে সেবা পাইনি">বুকিং বা সিরিয়াল শিডিউলে সেবা পাইনি</option>
                        <option value="পেমেন্ট বা অতিরিক্ত চার্জ সংক্রান্ত বিরোধ">পেমেন্ট বা অতিরিক্ত চার্জ সংক্রান্ত বিরোধ</option>
                        <option value="অন্যান্য অভিযোগ">অন্যান্য অভিযোগ</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-1">বিস্তারিত বিবরণ <span class="text-rose-500">*</span></label>
                    <textarea name="description" rows="4" required placeholder="আপনার সমস্যার বিস্তারিত বিবরণ লিখুন..." class="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-blue-500">{{ old('description') }}</textarea>
                </div>

                <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    <p class="font-semibold">⏱️ ৭২ ঘণ্টার রেজোলিউশন প্রতিজ্ঞা:</p>
                    <p class="mt-0.5">অভিযোগ জমা হওয়ার সাথে সাথে আপনার জন্য একটি ট্র্যাকিং টিকেট নম্বর তৈরি হবে। দোকান কর্তৃপক্ষের নির্ধারিত সময়ের মধ্যে সমাধান না হলে বিষয়টি প্ল্যাটফর্ম সুপারঅ্যাডমিনে স্বয়ংক্রিয়ভাবে এস্কেলেট হবে।</p>
                </div>

                <div class="flex items-center justify-between pt-2">
                    <a href="{{ route('storefront.home') }}" class="text-sm font-medium text-slate-500 hover:text-slate-800">← স্টোরে ফিরে যান</a>
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-6 rounded-xl transition shadow-md shadow-blue-600/20">
                        অভিযোগ দাখিল করুন
                    </button>
                </div>
            </form>
        </div>

    </div>

</body>
</html>
