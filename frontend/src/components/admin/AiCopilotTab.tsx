'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Copy,
  CheckCircle2,
  Send,
  RefreshCw,
  FileText,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
} from 'lucide-react';

interface AiCopilotProps {
  tenantSlug: string;
  tenantInfo: any;
  isMedical?: boolean;
  isRealEstate?: boolean;
  isElectronics?: boolean;
}

export default function AiCopilotTab({
  tenantSlug,
  tenantInfo,
  isMedical,
  isRealEstate,
  isElectronics,
}: AiCopilotProps) {
  const storeName = tenantInfo?.name || tenantSlug.toUpperCase();

  // Generator states
  const [productPrompt, setProductPrompt] = useState(
    isMedical
      ? 'Comprehensive Dental Scaling & Polishing Package with Digital X-Ray'
      : isRealEstate
      ? 'Gulshan Avenue 3200 Sq Ft 4-Bed Luxury Duplex with Sky Terrace'
      : isElectronics
      ? 'SmartVolt Zigbee 3.0 Touch Switch 4-Gang with Energy Monitoring'
      : 'Handwoven Pure Mulberry Silk Jamdani Saree (Traditional Floral Motifs)'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generated content state
  const [generatedResult, setGeneratedResult] = useState<{
    seoTitle: string;
    seoDesc: string;
    highlightBullets: string[];
    description: string;
    specifications: Record<string, string>;
  }>({
    seoTitle: isMedical
      ? 'Dental Scaling & Polishing in Dhaka | Advanced Cavity Prevention'
      : isRealEstate
      ? 'Luxury 4-Bed Duplex Apartment for Sale in Gulshan-2, Dhaka'
      : isElectronics
      ? 'SmartVolt Zigbee 4-Gang Smart Touch Wall Switch (Smart Life & Tuya Compatible)'
      : 'Authentic Handwoven Pure Mulberry Silk Jamdani Saree | Dhaka Weavers',
    seoDesc: isMedical
      ? 'Book your pain-free ultrasonic dental scaling and polishing with certified BDS specialists. Includes digital intraoral x-ray.'
      : isRealEstate
      ? 'Exclusive 3200 sqft corner duplex penthouse in Gulshan. 3 parking spaces, private terrace, German elevator & 100% generator backup.'
      : isElectronics
      ? 'Control lights from smartphone or voice with Google Assistant & Alexa. Tempered glass capacitive touch, surge protection and real-time kWh tracker.'
      : 'Exquisite 100-count handloomed Jamdani saree woven by master artisans in Narayanganj. High quality gold zari thread work.',
    highlightBullets: isMedical
      ? [
          'জার্মান আল্ট্রাসনিক স্কেলার প্রযুক্তি (সম্পূর্ণ ব্যথাহীন অভিজ্ঞতা)',
          'ফ্রি ডিজিটাল ইন্ট্রাওরাল ক্যামেরা ডেন্টাল স্ক্রীনিং',
          'বিএমডিসি অনুমোদিত অভিজ্ঞ ডেন্টাল সার্জনের সরাসরি সেবা',
          '১০০% অটোক্লেভড স্টেরিলাইজড ইন্সট্রুমেন্টস ও সংক্রমণ মুক্ত পরিবেশ',
        ]
      : isRealEstate
      ? [
          '৩২-০০ বর্গফুটের সুবিশাল খোলামেলা লেকভিউ ট্রিপ্লেক্স পেন্টহাউস',
          '৪টি মাস্টার বেডরুম ও সুবিশাল রুফটপ স্কাই টেরেস গার্ডেন',
          '৩টি কার পার্কিং স্পেস ও রাজউক অনুমোদিত ড্রয়িং প্ল্যান',
          'সুইজারল্যান্ডের শিন্ডলার লিফট ও ফুল লোড সাইলেন্ট জেনারেটর ব্যাকআপ',
        ]
      : isElectronics
      ? [
          'স্মার্ট লাইফ / Tuya অ্যাপ ও ভয়েস কমান্ড (Google Home ও Alexa) সাপোর্ট',
          'রিয়েল-টাইম বিদ্যুৎ খরচ পরিমাপ (kWh Energy Metering)',
          'স্ক্র্যাচ-প্রুফ টেম্পার্ড গ্লাস ক্যাপাসিটিভ টাচ প্যানেল',
          '৪০০০ ভোল্ট পর্যন্ত ইন্ডাক্টিভ সার্জ ও শর্ট-সার্কিট প্রোটেকশন',
        ]
      : [
          '১০০ কাউন্ট খাঁটি মালবেরি রেশম সুতায় হাতে বোনা প্রিমিয়াম শাড়ি',
          'সোনারুপা রিয়্যাল জরি সুতোর ঐতিহ্যবাহী পদ্ম ও কলকা নকশা',
          'সারাদিন স্বাচ্ছন্দ্যে পরার মতো অত্যন্ত হালকা ও মোলায়েম ফেব্রিক',
          'আভিজাত্যময় বিয়ে, উৎসব বা বিশেষ অনুষ্ঠানের জন্য নিখুঁত কালেকশন',
        ],
    description: `আমাদের ফ্ল্যাগশিপ কালেকশন "${productPrompt}" আধুনিক জীবনের সুবিধা ও প্রিমিয়াম আভিজাত্যকে একত্রিত করে তৈরি করা হয়েছে। প্রতিটি পণ্য সর্বোচ্চ মান নিয়ন্ত্রণ ও অফিসিয়াল ওয়ারেন্টির নিশ্চয়তা প্রদান করে।`,
    specifications: isMedical
      ? {
          'সেবার ধরন': 'ইন-চেম্বার প্রসিডিউর',
          'আনুমানিক সময়': '৪৫ থেকে ৬০ মিনিট',
          'সার্জন লেভেল': 'কনসালট্যান্ট ডেন্টাল সার্জন (BDS, FCPS)',
          'ফলো-আপ': '১৫ দিন পর বিনামূল্যে চেক-আপ',
        }
      : isRealEstate
      ? {
          'আয়তন': '৩২-০০ স্কয়ার ফিট',
          'বেড / বাথ': '৪ বেড, ৫ বাথ, ৩ বারান্দা',
          'ফ্লোর লেভেল': '১১ ও ১২ তলা (ডুপ্লেক্স ইউনিট)',
          'হস্তান্তর সময়': 'ডিসেম্বর ২০২৬ (প্রাইম রেডি)',
        }
      : isElectronics
      ? {
          'ভোল্টেজ রেঞ্জ': 'AC 100V - 250V (50/60Hz)',
          'ম্যাক্সিমাম লোড': '৮০০W প্রতি গ্যাং (ইন্ডাক্টিভ ও ক্যাপাসিটিভ)',
          'ওয়্যারলেস প্রোটোকল': 'Zigbee 3.0 / 2.4GHz Wi-Fi',
          'ওয়ারেন্টি': '২ বছর রিপ্লেসমেন্ট গ্যারান্টি',
        }
      : {
          'ফেব্রিক': '১০০% পিওর মালবেরি সিল্ক',
          'দৈর্ঘ্য': '১২ হাত (ব্লাউজ পিস সহ)',
          'সুতার কাউন্ট': '১০০ কাউন্ট',
          'উৎপত্তি': 'রূপগঞ্জ, নারায়ণগঞ্জ',
        },
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedResult({
        ...generatedResult,
        description: `"${productPrompt}" এখন আপনার স্টোরের জন্য অপ্টিমাইজড। এই প্রোডাক্ট ডেসক্রিপশনটি এসইও র‍্যাঙ্কিং বৃদ্ধিতে সাহায্য করবে এবং গ্রাহকদের মধ্যে দ্রুত সিদ্ধান্ত নিতে আস্থা তৈরি করবে।`,
      });
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-[#0B132B]/80 to-indigo-950/70 border border-purple-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Update 10 • Gemini AI Copilot
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-300 font-mono">
                <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> Smart Catalog & SEO Generator
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              AI মার্চেন্ট কো-পাইলট ও স্মার্ট ক্যাটালগ জেনারেটর
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              এক ক্লিকে হাই-কনভার্টিং প্রোডাক্ট টাইটেল, বাংলা ডেসক্রিপশন, স্পেসিফিকেশন টেবিল এবং সকালের বিজনেস ইনসাইট জেনারেশন।
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0E1528] p-2 rounded-xl border border-purple-500/30 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-purple-200">Gemini 1.5 Pro Flash Live</span>
          </div>
        </div>
      </div>

      {/* AI Daily Executive Morning Briefing */}
      <div className="bg-gradient-to-r from-[#121028] via-[#0E1528] to-[#141B33] border border-purple-500/30 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">দৈনিক AI বিজনেস সামারি ও পরামর্শ</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">আজকের আপডেট • ৮:০০ AM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#191539]/60 border border-purple-500/20 space-y-1">
            <p className="font-bold text-purple-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> রেভিনিউ প্রজেকশন
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              গতকালকের চেয়ে আজ ৮% বেশি অর্ডারের সম্ভাবনা রয়েছে। বিশেষ করে ঢাকা ধানমন্ডি ও মিরপুর এলাকায় কনভার্সন রেট বেশি।
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#191539]/60 border border-purple-500/20 space-y-1">
            <p className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> স্টক শেষ হওয়ার ঝুঁকি
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              টপ-সেলিং ৩টি প্রোডাক্টের স্টক আগামী ৩ দিনের মধ্যে শেষ হয়ে যেতে পারে। সাপ্লায়ারকে এখনই রিস্টক রিকোয়েস্ট পাঠান।
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#191539]/60 border border-purple-500/20 space-y-1">
            <p className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-cyan-400" /> কাস্টমার ফ্রড সতর্কতা
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              আজকের ১টি অর্ডারে পূর্ববর্তী কুরিয়ার রিটার্ন রেকর্ড পাওয়া গেছে। ডেলিভারির পূর্বে ৫০% অগ্রিম বিকাশ গ্রহণ করার সুপারিশ।
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Prompt Input (Left) + Generated Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Generator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>১. যেকোনো প্রোডাক্টের নাম বা কি-ওয়ার্ড লিখুন</span>
            </h3>

            <textarea
              rows={4}
              value={productPrompt}
              onChange={(e) => setProductPrompt(e.target.value)}
              placeholder="প্রোডাক্ট নাম, প্রধান ফিচার বা কি-ওয়ার্ড লিখুন..."
              className="w-full bg-[#11172A] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition font-sans resize-y"
            />

            <div className="space-y-1.5">
              <p className="text-[11px] text-slate-400 font-bold">দ্রুত প্রম্পট আইডিয়া:</p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  onClick={() =>
                    setProductPrompt('SmartVolt Wi-Fi 6 Mesh Router 3000Mbps with Parental Control')
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#12192C] text-slate-300 hover:text-white border border-slate-800"
                >
                  ⚡ Wi-Fi 6 Router
                </button>
                <button
                  onClick={() =>
                    setProductPrompt('Doctor Consultation for Cardiology & 12-Lead ECG Report')
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#12192C] text-slate-300 hover:text-white border border-slate-800"
                >
                  🩺 Heart Specialist
                </button>
                <button
                  onClick={() =>
                    setProductPrompt('Exclusive 2400 sqft Ready Flat in Banani with Rooftop Pool')
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#12192C] text-slate-300 hover:text-white border border-slate-800"
                >
                  🏢 Luxury Flat
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black text-xs shadow-xl shadow-purple-950/40 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 fill-white" />
              )}
              <span>✨ Gemini AI দিয়ে তৈরি করুন</span>
            </button>
          </div>
        </div>

        {/* Right Column: Generated AI Content (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>২. স্বয়ংক্রিয় এআই ক্যাটালগ আউটপুট</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">100% SEO Ready</span>
            </div>

            {/* SEO Title */}
            <div className="space-y-1 bg-[#11172A] p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                <span>SEO অপ্টিমাইজড টাইটেল</span>
                <button
                  onClick={() => handleCopy(generatedResult.seoTitle, 'title')}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>কপি</span>
                </button>
              </div>
              <p className="text-xs font-bold text-white">{generatedResult.seoTitle}</p>
            </div>

            {/* SEO Meta Description */}
            <div className="space-y-1 bg-[#11172A] p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                <span>সার্চ ইঞ্জিন মেটা ডেসক্রিপশন</span>
                <button
                  onClick={() => handleCopy(generatedResult.seoDesc, 'desc')}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>কপি</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{generatedResult.seoDesc}</p>
            </div>

            {/* Key Bullets */}
            <div className="space-y-2 bg-[#11172A] p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                <span>প্রধান বৈশিষ্ট্যসমূহ (Key Highlights)</span>
                <button
                  onClick={() => handleCopy(generatedResult.highlightBullets.join('\n'), 'bullets')}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'bullets' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>কপি</span>
                </button>
              </div>
              <ul className="space-y-1 text-xs text-slate-200">
                {generatedResult.highlightBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Table */}
            <div className="space-y-2 bg-[#11172A] p-3 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-bold">টেকনিক্যাল স্পেসিফিকেশন</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(generatedResult.specifications).map(([k, v]) => (
                  <div key={k} className="p-2 rounded-lg bg-[#0B101E] border border-slate-800/80">
                    <p className="text-[10px] text-slate-400 font-medium">{k}</p>
                    <p className="font-bold text-white mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
