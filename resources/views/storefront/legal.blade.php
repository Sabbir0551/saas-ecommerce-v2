@extends('layouts.storefront')

@section('content')
<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="bg-white rounded-2xl border border-zinc-200 p-8 sm:p-12 shadow-sm">
        <h1 class="text-3xl font-bold text-zinc-900 mb-2">{{ $title }}</h1>
        <p class="text-xs text-zinc-400 mb-8 pb-4 border-b border-zinc-100">সর্বশেষ সংস্করণ: অক্টোবর ২০২৬ | ডিজিটাল কমার্স নির্দেশিকা ২০২১ অনুসারে প্রযোজ্য</p>

        @if($type === 'terms')
            <div class="prose prose-zinc text-sm text-zinc-700 space-y-6">
                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">১. সাধারণ তথ্যাবলী</h2>
                    <p>এই ওয়েবসাইটটি <strong>{{ tenant('name') ?? tenant('id') }}</strong> দ্বারা পরিচালিত। সাইটটি ব্যবহার বা অর্ডার প্লেস করার মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মতি প্রদান করছেন।</p>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">২. অর্ডার ও পেমেন্ট নীতিমালা</h2>
                    <p>ক্যাশ অন ডেলিভারি (COD), বিকাশ অথবা অনুমোদিত গেটওয়ের মাধ্যমে পরিশোধ করা যাবে। প্রতিটি অর্ডারের সত্যতা নিশ্চিত করার জন্য আমাদের প্রতিনিধি ফোন বা এসএমএসের মাধ্যমে যোগাযোগ করতে পারেন। ভুয়া বা ভুল অর্ডার বাতিল করার অধিকার সংরক্ষণ করি।</p>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">৩. ডেলিভারি ও সময়সীমা</h2>
                    <p>ডিজিটাল কমার্স নির্দেশিকা অনুযায়ী ঢাকা সিটির মধ্যে সাধারণ পণ্য ২-৩ কার্যদিবস এবং ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে নির্ভরযোগ্য কুরিয়ারের মাধ্যমে ডেলিভারি করা হয়। অনিবার্য কারণে বিলম্ব হলে ক্রেতাকে অবহিত করা হবে।</p>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">৪. বুদ্ধিবৃত্তিক সম্পদ</h2>
                    <p>এই ওয়েবসাইটে ব্যবহৃত সকল ছবি, লোগো ও বর্ণনা স্বত্বাধিকারী মার্চেন্টের মালিকানাধীন। অনুমতি ছাড়া পুনরুৎপাদন আইনত দণ্ডনীয়।</p>
                </div>
            </div>

        @elseif($type === 'privacy')
            <div class="prose prose-zinc text-sm text-zinc-700 space-y-6">
                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">১. ব্যক্তিগত তথ্য সুরক্ষা (ব্যক্তিগত তথ্য সুরক্ষা অধ্যাদেশ ২০২৫)</h2>
                    <p>আমরা আপনার গোপনীয়তাকে সম্মান করি। অর্ডার প্রসেসিং ও যোগাযোগ ছাড়া গ্রাহকের নাম, মোবাইল নম্বর বা ঠিকানা অন্য কোনো তৃতীয় পক্ষের সাথে বাণিজ্যিক উদ্দেশ্যে শেয়ার বা বিক্রি করা হয় না।</p>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">২. সংরক্ষিত তথ্যের ব্যবহার</h2>
                    <p>গ্রাহকের ফোন নম্বর ও ডেলিভারি ঠিকানা শুধুমাত্র পার্সেল শিপমেন্ট, ট্র্যাকিং ও কাস্টমার সাপোর্টের জন্য সংশ্লিষ্ট কুরিয়ারের সাথে শেয়ার করা হয়।</p>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">৩. ডেটা মুছে ফেলার অধিকার</h2>
                    <p>গ্রাহক চাইলে যেকোনো সময় আমাদের সাথে যোগাযোগ করে তার পূর্ববর্তী তথ্য মুছে ফেলার বা পরিবর্তনের আবেদন করতে পারবেন।</p>
                </div>
            </div>

        @elseif($type === 'refund')
            <div class="prose prose-zinc text-sm text-zinc-700 space-y-6">
                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">১. রিটার্ন ও এক্সচেঞ্জ সময়সীমা</h2>
                    <p>পণ্য গ্রহণের সময় ডেলিভারিম্যানের সামনে চেক করে গ্রহণ করুন। ত্রুটিপূর্ণ, ভুল বা ক্ষতিগ্রস্ত পণ্য পেলে সর্বোচ্চ ৩ দিনের মধ্যে আমাদের কাস্টমার সার্ভিসে অবহিত করতে হবে।</p>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">২. রিফান্ডের শর্তাবলী</h2>
                    <p>পণ্য অপরিবর্তিত ও ইনট্যাক্ট অবস্থায় রিটার্ন গৃহীত হলে ৩-৭ কার্যদিবসের মধ্যে মূল পেমেন্ট মেথড (যেমন: বিকাশ/ব্যাংক) অথবা সমমূল্যের ভাউচারের মাধ্যমে অর্থ ফেরত দেওয়া হবে।</p>
                </div>

                <div>
                    <h2 class="text-lg font-bold text-zinc-900 mb-2">৩. অ-ফেরতযোগ্য পণ্য</h2>
                    <p>ফার্মেসির ওষুধ, স্বাস্থ্যবিধি পণ্য এবং কাস্টমাইজড তৈরিকৃত সামগ্রীর ক্ষেত্রে বিশেষ শর্ত প্রযোজ্য হতে পারে।</p>
                </div>
            </div>
        @endif

        <div class="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
            <a href="{{ route('storefront.home') }}" class="text-xs font-semibold text-zinc-600 hover:text-zinc-950 flex items-center gap-1">
                ← হোমপেজে ফিরে যান
            </a>
            <span class="text-xs text-zinc-400">হেল্পলাইন: {{ tenant('owner_phone') ?? '01700000000' }}</span>
        </div>
    </div>
</div>
@endsection
