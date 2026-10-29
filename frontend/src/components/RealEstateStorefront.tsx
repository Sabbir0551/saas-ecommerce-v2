'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  Phone,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  Award,
  Search,
  ChevronRight,
  Download,
  Clock,
  Sparkles,
  X,
  Check,
  Car,
  Compass,
  FileCheck,
  Layers
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface RealEstateStorefrontProps {
  tenant: any;
  tenantSlug: string;
  items: any[];
  categories: any[];
  brands?: any[];
}

export function RealEstateStorefront({
  tenant,
  tenantSlug,
  items,
  categories,
}: RealEstateStorefrontProps) {
  const { addToCart } = useCart();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [tourModalProperty, setTourModalProperty] = useState<any | null>(null);
  const [tourDate, setTourDate] = useState<string>('');
  const [tourSlot, setTourSlot] = useState<string>('Morning (10:00 AM - 12:00 PM)');
  const [tourName, setTourName] = useState<string>('');
  const [tourPhone, setTourPhone] = useState<string>('');
  const [tourTransportNeeded, setTourTransportNeeded] = useState<boolean>(false);
  const [tourSuccessNotice, setTourSuccessNotice] = useState<any | null>(null);

  const brandName = tenant?.name || 'Aeban Luxury Real Estate & Country Estates';
  const currency = tenant?.currency || 'BDT';

  const LOCATIONS = ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Bashundhara R/A', 'Purbachal'];

  // Filter properties
  const filteredProperties = items.filter((prop) => {
    const titleMatch = !searchKeyword || prop.title?.toLowerCase().includes(searchKeyword.toLowerCase()) || prop.shortDescription?.toLowerCase().includes(searchKeyword.toLowerCase());
    const locMatch = selectedLocation === 'all' || prop.title?.includes(selectedLocation) || prop.shortDescription?.includes(selectedLocation) || prop.category === selectedLocation;
    return titleMatch && locMatch;
  });

  const handleOpenTourModal = (prop: any) => {
    setTourModalProperty(prop);
    const thisWeekend = new Date();
    thisWeekend.setDate(thisWeekend.getDate() + 2);
    setTourDate(thisWeekend.toISOString().split('T')[0]);
  };

  const handleConfirmTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourName || !tourPhone) {
      alert('অনুগ্রহ করে আপনার নাম এবং মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    // Add token booking to cart
    addToCart({
      id: `tour-${tourModalProperty.id}-${Date.now()}`,
      title: `Site Tour: ${tourModalProperty.title} (${tourSlot})`,
      price: 0,
      quantity: 1,
      image: tourModalProperty.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    });

    setTourSuccessNotice({
      property: tourModalProperty.title,
      date: tourDate,
      slot: tourSlot,
      name: tourName,
      code: `TOUR-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setTourModalProperty(null);
    setTourName('');
    setTourPhone('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B12] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      <Navbar tenantSlug={tenantSlug} storeName={brandName} />

      {/* Top Real Estate Concierge Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-900/30 py-2.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>RAJUK ও CDA অনুমোদিত প্রিমিয়াম লাক্সারি অ্যাপার্টমেন্ট ও কান্ট্রি এস্টেট</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:+8801700000000" className="flex items-center gap-1.5 hover:text-white transition">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>প্রাইভেট কনসিয়ার্জ: +880 1700-000000</span>
            </a>
            <span className="text-amber-500 font-bold hidden sm:inline">০% ব্রোকারেজ ফি</span>
          </div>
        </div>
      </div>

      {/* Floating Tour Booking Alert */}
      {tourSuccessNotice && (
        <div className="fixed top-20 right-6 z-50 bg-amber-950 border border-amber-500/40 text-white p-5 rounded-2xl shadow-2xl max-w-sm backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-300">সাইট ট্যুর বুকিং কনফার্মড!</h4>
              <p className="text-xs text-slate-300">
                ট্যুর কোড: <strong className="text-white">{tourSuccessNotice.code}</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                {tourSuccessNotice.property} • {tourSuccessNotice.date} ({tourSuccessNotice.slot})
              </p>
              <p className="text-[10px] text-amber-400/90 pt-1">
                আমাদের সিনিয়র রিলেশনশিপ ম্যানেজার খুব শীঘ্রই কল করে গাড়ির শিডিউল নিশ্চিত করবেন।
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setTourSuccessNotice(null)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold transition"
                >
                  ঠিক আছে
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Grand Architectural Hero */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-amber-950/40">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-amber-500/30 bg-amber-950/40 text-amber-300">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Premier Luxury Living & Architect-Designed Residences</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-white tracking-tight leading-tight">
                অভিজাত জীবনের ঠিকানা <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 italic">
                  লাক্সারি ভিলা ও প্রিমিয়াম অ্যাপার্টমেন্ট
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                গুলশান, বনানী ও ধানমন্ডির আন্তর্জাতিক মানের সুদৃশ্য কনডমিনিয়াম। শতভাগ বৈধ কাগজপত্র, নিজস্ব পার্কিং, রুফটপ ইনফিনিটি পুল এবং ব্যক্তিগত সাইট পরিদর্শনের সুব্যবস্থা।
              </p>

              {/* Property Search Filter Card */}
              <div className="bg-slate-900/90 border border-amber-500/30 p-4 sm:p-5 rounded-3xl shadow-2xl space-y-3 max-w-2xl mx-auto lg:mx-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">লোকেশন</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="all">সকল লোকেশন</option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">বেডরুম সাইজ</label>
                    <select
                      value={selectedBedrooms}
                      onChange={(e) => setSelectedBedrooms(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="all">যেকোনো সাইজ</option>
                      <option value="3">৩ বেডরুম</option>
                      <option value="4">৪ বেডরুম</option>
                      <option value="duplex">ডুপ্লেক্স পেন্টহাউস</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">প্রকল্পের নাম</label>
                    <input
                      type="text"
                      placeholder="উদাঃ ভিলা, হাইটস..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 placeholder-slate-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>সকল প্রজেক্টের রাজউক ও লিগ্যাল ক্লিয়ারেন্স ভেরিফাইড</span>
                  </span>
                  <a
                    href="#properties"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>প্রপার্টি খুঁজুন</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 group">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury Architectural Estate"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ready Handover Masterpiece</span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold font-serif">লেকভিউ পেন্টহাউস (৩,৮৫০ বর্গফুট)</p>
                      <p className="text-[11px] text-amber-400">গুলশান-২ ডিপ্লোম্যাটিক জোন • ৪ বেড • রুফটপ পুল</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                    <span className="font-bold text-white">প্রাইস: কল করুন</span>
                    <button
                      onClick={() => handleOpenTourModal(items[0] || { title: 'Gulshan Diplomatic Penthouse' })}
                      className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition"
                    >
                      ট্যুর বুক করুন
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Real Estate Trust Pillars */}
      <section className="py-8 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">১০০% লিগ্যাল টাইটেল ক্লিয়ার</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">মালিকানা যাচাইকৃত ও রাজউক অনুমোদিত বৈধ নকশা।</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">০% ব্রোকারেজ কমিশন</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">সরাসরি ডেভেলপার মূল্য ও কোনো গোপন অতিরিক্ত চার্জ নেই।</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">ব্যাংক লোন প্রসেসিং সাপোর্ট</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">শীর্ষস্থানীয় ব্যাংকের মাধ্যমে দ্রুত হোম লোন অনুমোদন।</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">প্রাইভেট সাইট পরিদর্শনের গাড়ি</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">সরাসরি প্রজেক্ট স্পটে নিয়ে যাওয়ার ফ্রি কনভেন্স সুবিধা।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Property Grid */}
      <section id="properties" className="py-14 sm:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-serif">Featured Developments</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                প্রিমিয়াম অ্যাপার্টমেন্ট ও ভিলা প্রজেক্ট
              </h2>
            </div>

            <div className="text-xs text-slate-400">
              মোট <strong className="text-white">{filteredProperties.length}</strong>টি এক্সক্লুসিভ প্রজেক্ট পাওয়া গেছে
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProperties.map((prop) => {
              const image = prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
              const price = Number(prop.price || 0);

              return (
                <div
                  key={prop.id}
                  className="bg-slate-900/60 rounded-3xl border border-slate-800/80 hover:border-amber-500/40 p-5 transition flex flex-col justify-between group shadow-xl hover:shadow-amber-950/20"
                >
                  <div className="space-y-4">
                    {/* Image Area with Handover status */}
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-950">
                      <img
                        src={image}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 text-[10px] font-bold text-amber-300">
                        {prop.category || 'Ready for Handover'}
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>গুলশান / বনানী</span>
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-1">
                      <h3 className="text-base font-bold font-serif text-white group-hover:text-amber-300 transition">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {prop.shortDescription || 'আধুনিক সুযোগ-সুবিধা সম্বলিত লাক্সারি কনডমিনিয়াম। সাউথ ফেসিং ও পর্যাপ্ত প্রাকৃতিক আলো-বাতাস।'}
                      </p>
                    </div>

                    {/* Specs Pills (Beds, Baths, Sqft) */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px]">
                          <Bed className="w-3.5 h-3.5 text-amber-400" />
                          <span>বেডরুম</span>
                        </div>
                        <span className="font-bold text-white text-xs mt-0.5 block">৪ বেড</span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px]">
                          <Bath className="w-3.5 h-3.5 text-amber-400" />
                          <span>বাথ</span>
                        </div>
                        <span className="font-bold text-white text-xs mt-0.5 block">৪ বাথ</span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px]">
                          <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>স্পেস</span>
                        </div>
                        <span className="font-bold text-white text-xs mt-0.5 block">২,৮৫০ স্কয়ারফুট</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Schedule CTA */}
                  <div className="pt-4 mt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">প্রকল্প মূল্য</span>
                      <span className="text-base font-black text-white font-serif">
                        {price > 0 ? `৳${price.toLocaleString()}` : 'কল করুন'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenTourModal(prop)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>ট্যুর বুক করুন</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">কোনো প্রপার্টি পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500">অন্যান্য লোকেশন বা ফিল্টার পরিবর্তন করে চেষ্টা করুন।</p>
            </div>
          )}

        </div>
      </section>

      {/* Schedule Private Site Tour Modal */}
      {tourModalProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">প্রাইভেট সাইট ভিজিট ফর্ম</span>
                <h3 className="text-lg font-bold font-serif text-white">{tourModalProperty.title}</h3>
                <p className="text-xs text-slate-400">ব্যক্তিগত গাড়ি সুবিধা সহ সাইট পরিদর্শনের আবেদন</p>
              </div>
              <button
                onClick={() => setTourModalProperty(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmTour} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">পরিদর্শনের পছন্দের তারিখ</label>
                <input
                  type="date"
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">পছন্দের সময়</label>
                <select
                  value={tourSlot}
                  onChange={(e) => setTourSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Morning (10:00 AM - 12:00 PM)">সকাল (১০:০০ টা - ১২:০০ টা)</option>
                  <option value="Afternoon (02:00 PM - 04:00 PM)">দুপুর (০২:০০ টা - ০৪:০০ টা)</option>
                  <option value="Evening (04:30 PM - 06:30 PM)">বিকাল (০৪:৩০ টা - ০৬:৩০ টা)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">আপনার পূর্ণ নাম *</label>
                <input
                  type="text"
                  placeholder="উদাঃ ইঞ্জিনিয়ার তানভীর আহমেদ"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">মোবাইল নাম্বার *</label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={tourPhone}
                  onChange={(e) => setTourPhone(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-xs">কনভেন্স ও গাড়ি সুবিধা চান?</p>
                  <p className="text-[10px] text-slate-400">আমাদের গাড়ি আপনাকে বাসা থেকে নিয়ে যাবে।</p>
                </div>
                <input
                  type="checkbox"
                  checked={tourTransportNeeded}
                  onChange={(e) => setTourTransportNeeded(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTourModalProperty(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>ট্যুর শিডিউল নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
