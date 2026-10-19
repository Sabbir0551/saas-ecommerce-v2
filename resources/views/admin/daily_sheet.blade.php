<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>Daily Patient Appointment Sheet - {{ $date }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @page { size: A4 portrait; margin: 10mm; }
        @media print {
            .no-print { display: none !important; }
        }
    </style>
</head>
<body class="bg-zinc-100 text-zinc-900 p-6 print:p-0 print:bg-white text-xs">

    <div class="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 print:border-0 print:shadow-none print:p-0">
        
        <!-- Header -->
        <div class="border-b-2 border-zinc-800 pb-4 mb-6 flex justify-between items-center">
            <div>
                <h1 class="text-xl font-black text-zinc-900 uppercase tracking-tight">{{ tenant('business_name') ?? 'মেরি ডেন্টাল কেয়ার' }}</h1>
                <p class="text-zinc-600 font-semibold mt-0.5">দৈনিক রোগী সিরিয়াল ও অ্যাপয়েন্টমেন্ট শিট</p>
                <p class="text-zinc-500 text-[11px]">তারিখ: <strong>{{ date('d F, Y (l)', strtotime($date)) }}</strong></p>
            </div>
            <div class="text-right no-print">
                <button onclick="window.print()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer">
                    🖨️ শিট প্রিন্ট / PDF সংরক্ষণ
                </button>
            </div>
        </div>

        <!-- Appointment Table -->
        <table class="w-full text-left border-collapse border border-zinc-300">
            <thead>
                <tr class="bg-zinc-100 text-zinc-700 uppercase text-[10px] font-bold">
                    <th class="border border-zinc-300 px-3 py-2 text-center w-12">নং</th>
                    <th class="border border-zinc-300 px-3 py-2">টোকেন</th>
                    <th class="border border-zinc-300 px-3 py-2">সময় স্লট</th>
                    <th class="border border-zinc-300 px-3 py-2">রোগীর নাম</th>
                    <th class="border border-zinc-300 px-3 py-2">মোবাইল</th>
                    <th class="border border-zinc-300 px-3 py-2">সমস্যা/নোট</th>
                    <th class="border border-zinc-300 px-3 py-2 text-right">ফি</th>
                    <th class="border border-zinc-300 px-3 py-2 text-center">উপস্থিতি</th>
                </tr>
            </thead>
            <tbody>
                @forelse($appointments as $index => $item)
                    <tr class="hover:bg-zinc-50">
                        <td class="border border-zinc-300 px-3 py-2.5 text-center font-bold text-zinc-600">{{ $index + 1 }}</td>
                        <td class="border border-zinc-300 px-3 py-2.5 font-mono font-bold text-emerald-700">{{ $item->order_number }}</td>
                        <td class="border border-zinc-300 px-3 py-2.5 font-semibold text-zinc-800">{{ $item->booking_time }}</td>
                        <td class="border border-zinc-300 px-3 py-2.5 font-bold text-zinc-900">{{ $item->customer_name }}</td>
                        <td class="border border-zinc-300 px-3 py-2.5 font-mono text-zinc-700">{{ $item->customer_phone }}</td>
                        <td class="border border-zinc-300 px-3 py-2.5 text-zinc-500 max-w-xs truncate">{{ $item->shipping_address }}</td>
                        <td class="border border-zinc-300 px-3 py-2.5 text-right font-bold text-zinc-800">৳{{ number_format($item->total / 100, 0) }}</td>
                        <td class="border border-zinc-300 px-3 py-2.5 text-center">
                            <span class="inline-block w-4 h-4 border border-zinc-400 rounded"></span>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="border border-zinc-300 px-4 py-8 text-center text-zinc-500 font-semibold">
                            আজকের জন্য কোনো অ্যাপয়েন্টমেন্ট নির্ধারিত নেই।
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <!-- Footer / Signature -->
        <div class="mt-12 flex justify-between items-center text-zinc-500 text-[10px] border-t border-zinc-200 pt-4">
            <span>মুদ্রণের সময়: {{ now()->format('d M, Y - h:i A') }}</span>
            <div class="text-right space-y-4">
                <div class="border-b border-zinc-400 w-40"></div>
                <span class="block">চেম্বার রিসেপশনিস্ট / অথোরাইজড স্বাক্ষর</span>
            </div>
        </div>

    </div>

</body>
</html>