'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  Filter,
  Check,
  X,
  Plus,
  Minus,
  Award,
  Scissors,
  Layers,
  Tag,
  ArrowRight
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface FashionStorefrontProps {
  tenant: any;
  tenantSlug: string;
  items: any[];
  categories: any[];
  brands?: any[];
}

export function FashionBoutiqueStorefront({
  tenant,
  tenantSlug,
  items,
  categories,
}: FashionStorefrontProps) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [selectedItemForModal, setSelectedItemForModal] = useState<any | null>(null);
  const [modalActiveSize, setModalActiveSize] = useState<string>('M');
  const [modalActiveColor, setModalActiveColor] = useState<string>('Crimson Red');
  const [modalQuantity, setModalQuantity] = useState<number>(1);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const brandName = tenant?.name || 'Gulshan Luxury Fashion & Jamdani Boutique';
  const currency = tenant?.currency || 'BDT';

  const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
  const COLORS = [
    { name: 'Royal Crimson', class: 'bg-rose-700' },
    { name: 'Deep Gold', class: 'bg-amber-500' },
    { name: 'Midnight Navy', class: 'bg-indigo-950' },
    { name: 'Emerald Velvet', class: 'bg-emerald-800' },
    { name: 'Pearl Ivory', class: 'bg-stone-200' },
  ];

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.categoryId === selectedCategory || item.category === selectedCategory || item.slug?.includes(selectedCategory);
  });

  const handleQuickAdd = (item: any, size: string = 'M', color: string = 'Default') => {
    const cartItemId = `${item.id}-${size.toLowerCase()}`;
    const cartTitle = `${item.title} (${size} / ${color})`;

    addToCart({
      id: cartItemId,
      title: cartTitle,
      price: item.price,
      quantity: 1,
      image: item.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    });

    setAddedItemNotice(cartTitle);
    setTimeout(() => setAddedItemNotice(null), 3000);
  };

  const handleModalAddToCart = () => {
    if (!selectedItemForModal) return;
    const cartItemId = `${selectedItemForModal.id}-${modalActiveSize.toLowerCase()}`;
    const cartTitle = `${selectedItemForModal.title} (${modalActiveSize} / ${modalActiveColor})`;

    addToCart({
      id: cartItemId,
      title: cartTitle,
      price: selectedItemForModal.price,
      quantity: modalQuantity,
      image: selectedItemForModal.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    });

    setAddedItemNotice(cartTitle);
    setSelectedItemForModal(null);
    setTimeout(() => setAddedItemNotice(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0C10] text-slate-100 font-sans selection:bg-rose-600 selection:text-white">
      <Navbar tenantSlug={tenantSlug} storeName={brandName} />

      {/* Floating Notice when adding item */}
      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-rose-950 border border-rose-500/50 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold block">{addedItemNotice.slice(0, 32)}...</span>
            <span className="text-rose-300 text-[11px]">ব্যাগ এ যোগ করা হয়েছে</span>
          </div>
          <Link
            href={`/checkout?tenant=${tenantSlug}`}
            className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-xl ml-2 transition"
          >
            অর্ডার করুন
          </Link>
        </div>
      )}

      {/* Top Privilege Bar */}
      <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-rose-950 border-b border-rose-900/30 py-2 px-4 text-center text-xs font-serif tracking-wider text-rose-200">
        ✨ ঈদ ও বিশেষ উৎসব কালেকশন ২০২৬ • ঢাকাই জামদানি ও এক্সক্লুসিভ ডিজাইনার পোশাক • সারাদেশে ফ্রি হোম ডেলিভারি
      </div>

      {/* 1. High-Fashion Editorial Hero */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-rose-950/60">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-rose-500/30 bg-rose-950/50 text-rose-300">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Handcrafted Luxury Weave 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight sm:leading-tight">
                ঐতিহ্য ও আধুনিকতার মেলবন্ধন <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-200 to-rose-300 italic">
                  খাঁটি ঢাকাই জামদানি ও ডিজাইনার পোশাক
                </span>
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                বুননশিল্পীদের নিপুণ হাতে বোনা ১০০% নিখুঁত জরি সুতা, কটন ও সিল্কের মোহনীয় উৎসব কালেকশন। নিখুঁত ফিটিং, প্রিমিয়াম প্যাকেজিং ও ট্রায়াল সুবিধা।
              </p>

              {/* Value Perks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-stone-300 font-medium max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2 bg-stone-900/60 border border-stone-800 p-2.5 rounded-xl">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>খাঁটি তাঁতের বুনন</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-900/60 border border-stone-800 p-2.5 rounded-xl">
                  <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>সহজ সাইজ এক্সচেঞ্জ</span>
                </div>
                <div className="flex items-center gap-2 bg-stone-900/60 border border-stone-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>২৪-৪৮ ঘণ্টার ডেলিভারি</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#collection"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 transition active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>কালেকশন এক্সপ্লোর করুন</span>
                </a>
                <a
                  href="#categories"
                  className="px-6 py-4 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-semibold text-sm border border-stone-700 flex items-center gap-2 transition"
                >
                  <span>ক্যাটাগরি দেখুন</span>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </a>
              </div>
            </div>

            {/* Right Hero Image Gallery Banner */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border border-rose-500/30 group">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"
                  alt="Exclusive Jamdani Boutique"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Artisan Silk & Zari Weave</span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-stone-900/80 backdrop-blur-md border border-stone-700 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold font-serif">রাজকীয় জামদানি শাড়ি (৮৪ কাউন্ট)</p>
                      <p className="text-[11px] text-rose-400">খাঁটি হস্তশিল্প • সিল্ক ও জরি কাজ</p>
                    </div>
                    <span className="text-sm font-black text-amber-300">৳৬,৫০০</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Four Fashion Trust Pillars */}
      <section className="py-8 bg-stone-950/60 border-b border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">১০০% খাঁটি বুনন ও কারুকাজ</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">অভিজ্ঞ কারিগরদের বোনা আসল সুতা ও জরি নিখুঁত ডিজাইন।</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">সহজ সাইজ এক্সচেঞ্জ সুবিধা</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">সাইজ অমিল হলে কোনো চার্জ ছাড়াই সহজ পরিবর্তনের নিশ্চয়তা।</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">সারা দেশে ক্যাশ অন ডেলিভারি</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধের সুযোগ।</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">নিরাপদ ও প্রিমিয়াম প্যাকিং</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">উপহার দেওয়ার উপযোগী এক্সক্লুসিভ বক্স প্যাকেজিং।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories Strip */}
      <section id="categories" className="py-12 border-b border-stone-900 bg-stone-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 font-serif">Curated Categories</span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">এক্সক্লুসিভ ক্যাটাগরি</h2>
            </div>
            <span className="text-xs text-stone-400">{categories.length}টি স্পেশালাইজড কালেকশন</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-rose-950 border-rose-500 text-rose-200 shadow-lg shadow-rose-950/40'
                  : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-6 h-6 text-rose-400" />
              <span className="text-xs font-bold">সকল পোশাক</span>
              <span className="text-[10px] text-stone-500">{items.length} আইটেম</span>
            </button>

            {categories.map((cat, idx) => (
              <button
                key={cat.id || idx}
                onClick={() => setSelectedCategory(cat.slug || cat.name)}
                className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                  selectedCategory === (cat.slug || cat.name)
                    ? 'bg-rose-950 border-rose-500 text-rose-200 shadow-lg shadow-rose-950/40'
                    : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:bg-stone-900 hover:text-white'
                }`}
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-bold line-clamp-1">{cat.name}</span>
                <span className="text-[10px] text-stone-500">কালেকশন</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Main Collection Showcase */}
      <section id="collection" className="py-14 sm:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-800 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 font-serif">Handpicked Outfits</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                ডিজাইনার জামদানি ও ফ্যাশন আউটফিট
              </h2>
            </div>

            <div className="text-xs text-stone-400">
              প্রদর্শিত হচ্ছে <strong className="text-white">{filteredItems.length}</strong>টি এক্সক্লুসিভ পোশাক
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const image = item.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
              const price = Number(item.price || 0);
              const discount = item.comparePrice && item.comparePrice > price
                ? Math.round(((item.comparePrice - price) / item.comparePrice) * 100)
                : null;

              return (
                <div
                  key={item.id}
                  className="bg-stone-900/40 rounded-3xl border border-stone-800/80 hover:border-rose-500/40 p-4 transition flex flex-col justify-between group shadow-xl hover:shadow-rose-950/20"
                >
                  <div className="space-y-3">
                    {/* Image Area with Quick View and Badges */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-950">
                      <img
                        src={image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />

                      {discount && (
                        <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md">
                          {discount}% ছাড়
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedItemForModal(item);
                          setModalQuantity(1);
                        }}
                        className="absolute bottom-3 right-3 bg-black/70 hover:bg-rose-600 text-white p-2.5 rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition duration-300 shadow-lg"
                        title="কুইক ভিউ ও সাইজ দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-amber-400 font-serif tracking-wider uppercase">
                        {item.category || 'Handloom Festive Edition'}
                      </span>
                      <h3 className="text-sm font-bold text-white font-serif line-clamp-1 group-hover:text-rose-300 transition">
                        {item.title}
                      </h3>
                      <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                        {item.shortDescription || '১০০% আসল তাঁতের তৈরি, সফট কটন ও পিওর জরি সুতার কারুকাজ।'}
                      </p>
                    </div>

                    {/* Quick Size Switcher */}
                    <div className="pt-2 flex items-center gap-1.5">
                      <span className="text-[10px] text-stone-500 mr-1">সাইজ:</span>
                      {SIZES.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => handleQuickAdd(item, sz)}
                          className="w-6 h-6 rounded-md bg-stone-800 hover:bg-rose-600 hover:text-white text-[10px] font-bold text-stone-300 transition"
                          title={`${sz} সাইজে দ্রুত ব্যাগে নিন`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-4 mt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-white font-serif">৳{price.toLocaleString()}</span>
                        {item.comparePrice && (
                          <span className="text-xs text-stone-500 line-through">৳{item.comparePrice}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(item)}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>ব্যাগে নিন</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-stone-900/30 rounded-3xl border border-stone-800 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
              <h3 className="text-base font-bold text-stone-300">এই ক্যাটাগরিতে বর্তমানে কোনো পোশাক তালিকাভুক্ত নেই</h3>
              <p className="text-xs text-stone-500">অন্যান্য ক্যাটাগরি এক্সপ্লোর করুন।</p>
            </div>
          )}

        </div>
      </section>

      {/* 5. Special Voucher Banner */}
      <section className="py-12 bg-gradient-to-r from-rose-950 via-stone-950 to-rose-950 border-t border-rose-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900/80 rounded-3xl border border-rose-500/30 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider font-serif">
                Exclusive VIP Privilege
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                প্রথম অর্ডারে ১০% অতিরিক্ত মূল্যছাড় পান
              </h3>
              <p className="text-xs sm:text-sm text-stone-300">
                চেকআউটে কুপন কোড <strong className="text-amber-300 font-mono bg-stone-950 px-2 py-0.5 rounded">FESTIVE10</strong> ব্যবহার করুন এবং সাথে সাথে ১০% ক্যাশব্যাক পান।
              </p>
            </div>

            <Link
              href="#collection"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-90 text-white font-bold text-sm shadow-xl shadow-rose-600/30 transition shrink-0"
            >
              এখনই কেনাকাটা করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View & Size Selection Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setSelectedItemForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-950">
                <img
                  src={selectedItemForModal.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'}
                  alt={selectedItemForModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-amber-400 uppercase tracking-widest font-serif font-bold">
                    {selectedItemForModal.category || 'Handloom Jamdani'}
                  </span>
                  <h3 className="text-lg font-bold font-serif text-white">{selectedItemForModal.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold font-serif text-rose-400">৳{Number(selectedItemForModal.price).toLocaleString()}</span>
                    {selectedItemForModal.comparePrice && (
                      <span className="text-xs text-stone-500 line-through">৳{selectedItemForModal.comparePrice}</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedItemForModal.shortDescription || '১০০% খাঁটি সুতি ও আরামদায়ক ফ্যাব্রিক। দীর্ঘস্থায়ী এবং ঐতিহ্যবাহী বুনন।'}
                </p>

                {/* Size Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">সাইজ নির্বাচন করুন:</label>
                  <div className="flex items-center gap-2">
                    {SIZES.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setModalActiveSize(sz)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                          modalActiveSize === sz
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">
                    রঙ: <span className="text-rose-400 font-normal">{modalActiveColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setModalActiveColor(c.name)}
                        className={`w-7 h-7 rounded-full ${c.class} border-2 transition ${
                          modalActiveColor === c.name ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity & CTA */}
                <div className="pt-3 border-t border-stone-800 flex items-center gap-3">
                  <div className="flex items-center border border-stone-700 rounded-xl bg-stone-950 px-2 py-1">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="text-stone-400 hover:text-white p-1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="text-stone-400 hover:text-white p-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleModalAddToCart}
                    className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ব্যাগে যোগ করুন</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
