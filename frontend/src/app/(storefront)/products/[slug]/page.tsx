'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { useCart } from '@/lib/cart-context';
import { SpecificationsTable } from '@/components/DynamicFieldRenderer';
import {
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Star,
  Clock,
  CheckCircle2,
  Sparkles,
  Calendar,
  Tag,
  ShieldCheck,
  Play,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Film,
  ExternalLink,
  Eye,
  Phone,
} from 'lucide-react';

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com/embed/')) return url;
  if (url.includes('youtube.com/watch?v=')) {
    const v = url.split('v=')[1]?.split('&')[0];
    return v ? `https://www.youtube.com/embed/${v}` : url;
  }
  if (url.includes('youtu.be/')) {
    const v = url.split('youtu.be/')[1]?.split('?')[0];
    return v ? `https://www.youtube.com/embed/${v}` : url;
  }
  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=734`;
  }
  return url;
}

function ProductDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const itemSlug = params.slug as string;
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  const [tenant, setTenant] = useState<any>(null);
  const [item, setItem] = useState<any>(null);
  const [categorySchema, setCategorySchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      setActiveImageIndex(0);
      try {
        const [tenantRes, itemRes, mediaRes, allItemsRes] = await Promise.all([
          api.getTenant(tenantSlug),
          api.getItemBySlug(itemSlug, tenantSlug),
          api.getMedia({}, tenantSlug),
          api.getItems({}, tenantSlug),
        ]);

        if (tenantRes?.success) setTenant(tenantRes.data);

        let targetItem = itemRes?.data;
        if (!targetItem && allItemsRes?.success && Array.isArray(allItemsRes.data)) {
          targetItem = allItemsRes.data.find(
            (p: any) => p.slug === itemSlug || p.id === itemSlug || p.sku === itemSlug
          );
        }

        if (targetItem) {
          setItem(targetItem);
          if (targetItem.variants) {
            let vList: string[] = [];
            if (Array.isArray(targetItem.variants)) {
              vList = targetItem.variants;
            } else if (typeof targetItem.variants === 'string') {
              vList = targetItem.variants.split(',').map((v: string) => v.trim()).filter(Boolean);
            }
            if (vList.length > 0) setSelectedVariant(vList[0]);
          }

          // Fetch category schema for dynamic custom attributes
          const catKey = targetItem.category?.slug || targetItem.categoryId || tenantRes?.data?.businessType || 'general';
          try {
            const schemaRes = await api.getCategorySchema(catKey);
            if (schemaRes?.success && schemaRes.data) {
              setCategorySchema(schemaRes.data);
            }
          } catch {}
        }

        if (mediaRes?.success && Array.isArray(mediaRes.data)) {
          setMediaList(mediaRes.data);
        }

        if (allItemsRes?.success && Array.isArray(allItemsRes.data)) {
          setRelatedProducts(allItemsRes.data.filter((p: any) => p.slug !== itemSlug && p.id !== itemSlug));
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [itemSlug, tenantSlug]);

  const handleAddToCart = () => {
    if (!item) return;
    const cartItemId = selectedVariant
      ? `${item.id}-${selectedVariant.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      : item.id;
    const cartItemTitle = selectedVariant ? `${item.title} (${selectedVariant})` : item.title;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: cartItemId,
        title: cartItemTitle,
        price: item.price,
        quantity: 1,
        image: item.images?.[0] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
      });
    }
    setAddedItemNotice(cartItemTitle);
    setTimeout(() => setAddedItemNotice(null), 3500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar tenantSlug={tenantSlug} storeName={tenant?.name} />
        <div className="flex-1 flex items-center justify-center text-xs font-bold text-slate-500 py-32">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-bold text-slate-700">প্রোডাক্ট লোড হচ্ছে...</p>
          </div>
        </div>
        <Footer tenantSlug={tenantSlug} storeName={tenant?.name} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar tenantSlug={tenantSlug} storeName={tenant?.name} />
        <div className="max-w-xl mx-auto py-24 text-center px-4 space-y-4">
          <h2 className="text-2xl font-black text-slate-900">প্রোডাক্ট পাওয়া যায়নি (Product Not Found)</h2>
          <p className="text-xs text-slate-500">আপনার কাঙ্ক্ষিত প্রোডাক্টটি সরানো হয়ে থাকতে পারে।</p>
          <Link
            href={`/?tenant=${tenantSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>স্টোরের মূল ক্যাটালগে ফিরে যান</span>
          </Link>
        </div>
        <Footer tenantSlug={tenantSlug} storeName={tenant?.name} />
      </div>
    );
  }

  let variantList: string[] = [];
  if (Array.isArray(item.variants)) {
    variantList = item.variants;
  } else if (typeof item.variants === 'string' && item.variants.trim()) {
    variantList = item.variants.split(',').map((v: string) => v.trim()).filter(Boolean);
  }

  const specsEntries = Array.isArray(item.specifications)
    ? item.specifications.filter((s: any) => s && s.key && s.value)
    : (item.specifications && typeof item.specifications === 'object')
    ? Object.entries(item.specifications).map(([key, value]) => ({ key, value }))
    : [];

  const imageList: string[] = (Array.isArray(item.images) && item.images.length > 0)
    ? item.images
    : (item.images ? [item.images] : ['https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80']);

  const currentDisplayImg = imageList[activeImageIndex] || imageList[0];

  const videoToShow = (() => {
    if (item.videoUrl) {
      return {
        title: item.title + ' - Official Product Review',
        type: item.videoUrl.includes('facebook') ? 'FACEBOOK' : 'YOUTUBE',
        embedUrl: getEmbedUrl(item.videoUrl),
        url: item.videoUrl,
        description: 'অফিসিয়াল প্রোডাক্ট ভিডিও আনবক্সিং, ফিচার রিভিউ ও ব্যবহারবিধি।',
      };
    }
    const related = mediaList.find((m) =>
      (m.type === 'YOUTUBE' || m.type === 'FACEBOOK') &&
      (m.categoryId === item.categoryId || m.categoryName?.toLowerCase() === item.category?.name?.toLowerCase() || m.categoryId === 'all')
    );
    if (related) {
      return {
        ...related,
        embedUrl: getEmbedUrl(related.embedUrl || related.url),
      };
    }
    return null;
  })();

  // Separate Sidebar Related Products (Same category first) & Bottom More Products
  const sameCategoryProducts = relatedProducts.filter((p: any) => {
    const itemCat = (item.category?.name || item.categoryId || '').toLowerCase();
    const pCat = (p.category?.name || p.categoryId || '').toLowerCase();
    return itemCat && pCat && (itemCat.includes(pCat) || pCat.includes(itemCat));
  });

  const sidebarProducts = sameCategoryProducts.length > 0
    ? sameCategoryProducts.slice(0, 5)
    : relatedProducts.slice(0, 5);

  const bottomProducts = relatedProducts.filter(
    (p: any) => !sidebarProducts.some((sp) => sp.id === p.id)
  );
  const displayBottomProducts = bottomProducts.length > 0 ? bottomProducts.slice(0, 8) : relatedProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col justify-between font-sans">
      <Navbar tenantSlug={tenantSlug} storeName={tenant?.name} />

      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">ব্যাগে যুক্ত হয়েছে: {addedItemNotice.slice(0, 24)}...</span>
          <Link
            href={`/checkout?tenant=${tenantSlug}`}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-1.5 rounded-xl ml-2 shrink-0 transition"
          >
            অর্ডার করুন
          </Link>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12 flex-1">
        {/* Top Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <Link href={`/?tenant=${tenantSlug}`} className="hover:text-slate-900 font-bold flex items-center gap-1.5 transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>স্টোর হোম</span>
            </Link>
            <span>/</span>
            <span className="text-slate-500 font-semibold">{item.category?.name || 'ক্যাটালগ'}</span>
            <span>/</span>
            <span className="font-extrabold text-slate-900 truncate max-w-xs">{item.title}</span>
          </div>

          <Link
            href={`/admin/dashboard?tenant=${tenantSlug}`}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition"
          >
            <span>মার্চেন্ট প্যানেল</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* ============================================================== */}
        {/* 2-COLUMN MAIN CONTENT: FULL PAGE VIEW (LEFT) + RELATED SIDEBAR (RIGHT) */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Main Full Product Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Main Product Hero & Buy Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Visual Gallery with Multi-Image Switcher */}
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shadow-sm group">
                    <img
                      src={currentDisplayImg}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {item.badge && (
                      <div className="absolute top-3 left-3 bg-slate-900 text-amber-400 text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10 border border-slate-800">
                        <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{item.badge}</span>
                      </div>
                    )}

                    {item.comparePrice && item.comparePrice > item.price && (
                      <div className="absolute bottom-3 left-3 bg-rose-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)}% ছাড়</span>
                      </div>
                    )}

                    {imageList.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
                          }}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition opacity-80 hover:opacity-100 z-10"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveImageIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition opacity-80 hover:opacity-100 z-10"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow z-10">
                          {activeImageIndex + 1} / {imageList.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {imageList.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                      {imageList.map((imgUrl, idx) => {
                        const isActive = idx === activeImageIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 transition-all ${
                              isActive
                                ? 'ring-2 ring-slate-900 ring-offset-2 scale-105 shadow-md border-transparent'
                                : 'opacity-70 hover:opacity-100 border border-slate-200'
                            }`}
                          >
                            <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Main Product Info & Purchase Controls */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {item.category?.name || 'অফিসিয়াল প্রোডাক্ট'}
                      </span>
                      {item.brand && (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          ব্র্যান্ড: {typeof item.brand === 'object' ? item.brand.name : item.brand}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold ml-auto">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>4.9</span>
                        <span className="text-slate-400 font-normal">(ভেরিফাইড)</span>
                      </div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
                      {item.title}
                    </h1>

                    {item.sku && (
                      <p className="text-xs text-slate-400 font-mono">
                        SKU: {item.sku}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      {item.shortDescription || '১০০% অরিজিনাল ও অথোরাইজড প্রোডাক্ট। অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি এবং দ্রুততম হোম ডেলিভারি সুবিধা।'}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-slate-950">
                        ৳ {item.price?.toLocaleString()}
                      </span>
                      {item.comparePrice && item.comparePrice > item.price && (
                        <span className="text-sm text-slate-400 line-through">
                          ৳ {item.comparePrice?.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80 text-xs">
                      <span className="text-slate-600 font-medium">
                        ০% কিস্তি (EMI): <strong className="text-slate-900 font-bold">৳ {Math.round(item.price / 12).toLocaleString()}/মাস</strong> (১২ মাস)
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        স্টকে প্রস্তুত ({item.stockQuantity !== undefined ? item.stockQuantity : 25} ইউনিট)
                      </span>
                    </div>
                  </div>

                  {/* Variant Selector */}
                  {variantList.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                        অপশন বেছে নিন: {selectedVariant && <span className="text-slate-950 font-black">({selectedVariant})</span>}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {variantList.map((vName) => {
                          const isSelected = (selectedVariant || variantList[0]) === vName;
                          return (
                            <button
                              key={vName}
                              type="button"
                              onClick={() => setSelectedVariant(vName)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
                                isSelected
                                  ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-slate-900/20'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {vName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity & Buy Actions */}
                  <div className="pt-2 space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-700">পরিমাণ:</span>
                      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-white transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-xs font-black text-slate-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-white transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs sm:text-sm border-2 border-slate-900 shadow-sm transition flex items-center justify-center gap-2 active:scale-95"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>কার্ট এ যোগ করুন</span>
                      </button>

                      <Link
                        href={`/checkout?tenant=${tenantSlug}`}
                        onClick={handleAddToCart}
                        className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 active:scale-95"
                      >
                        <span>সরাসরি অর্ডার করুন</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="pt-3 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 border-t border-slate-100">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ক্যাশ অন ডেলিভারি (COD)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ১০০% জেনুইন নিশ্চয়তা
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ৭২ ঘণ্টার রিটার্ন পলিসি
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Full Technical Specifications Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                  TECHNICAL SPECIFICATIONS
                </span>
                <h3 className="text-lg font-black text-slate-950 mt-0.5">
                  প্রোডাক্টের বিস্তারিত স্পেসিফিকেশন ও তথ্য
                </h3>
              </div>

              {item.customAttributes && Object.keys(item.customAttributes).length > 0 ? (
                <SpecificationsTable
                  customAttributes={item.customAttributes}
                  fields={categorySchema?.fields}
                  lang="bn"
                />
              ) : specsEntries.length > 0 ? (
                <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                  {specsEntries.map((spec: any, i: number) => (
                    <div key={i} className="flex justify-between px-4 py-3 bg-slate-50/50">
                      <span className="text-slate-500 font-semibold">{spec.key}</span>
                      <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">ওয়ারেন্টি কভারেজ:</span>
                    <span className="font-bold text-slate-900">{item.warranty || 'অফিসিয়াল ম্যানুফ্যাকচারার ওয়ারেন্টি'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-500">ব্র্যান্ড পার্টনার:</span>
                    <span className="font-bold text-slate-900">{typeof item.brand === 'object' ? item.brand.name : (item.brand || 'অথোরাইজড ডিলার')}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-slate-500">ডেলিভারি এরিয়া:</span>
                    <span className="font-bold text-slate-900">সমগ্র বাংলাদেশ জুড়ে এক্সপ্রেস কুরিয়ার সার্ভিস</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Dedicated Video Walkthrough if Available */}
            {videoToShow && (
              <section id="product-video-section" className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Play className="w-3 h-3 fill-amber-400" />
                      <span>ভিডিও রিভিউ ও ডেমোনস্ট্রেশন</span>
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      {videoToShow.title}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
                    {videoToShow.type || 'HD VIDEO'}
                  </span>
                </div>

                <div className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
                  {videoToShow.embedUrl ? (
                    <iframe
                      src={videoToShow.embedUrl}
                      title={videoToShow.title || 'Product Video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video src={videoToShow.url} controls className="w-full h-full object-cover" />
                  )}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: SIDEBAR (Related Products & Customer Support) (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Related Products Sidebar Box */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">
                      সম্পর্কিত প্রোডাক্ট
                    </h3>
                    <p className="text-[11px] text-slate-400">একই ক্যাটাগরির সেরা পণ্য</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  {sidebarProducts.length} টি
                </span>
              </div>

              {/* Related Item Cards Stack */}
              <div className="space-y-3">
                {sidebarProducts.map((relItem: any) => {
                  const relImg = (relItem.images && relItem.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
                  return (
                    <div
                      key={relItem.id}
                      className="group p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/70 transition flex items-center gap-3.5"
                    >
                      <Link
                        href={`/products/${relItem.slug || relItem.id}?tenant=${tenantSlug}`}
                        className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 block"
                      >
                        <img
                          src={relImg}
                          alt={relItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">
                          {relItem.category?.name || 'ক্যাটাগরি'}
                        </span>
                        <Link
                          href={`/products/${relItem.slug || relItem.id}?tenant=${tenantSlug}`}
                          className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition block"
                          title={relItem.title}
                        >
                          {relItem.title}
                        </Link>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xs font-black text-slate-950">
                            ৳ {relItem.price?.toLocaleString()}
                          </span>
                          {relItem.comparePrice && relItem.comparePrice > relItem.price && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ৳ {relItem.comparePrice?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/products/${relItem.slug || relItem.id}?tenant=${tenantSlug}`}
                        className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center shrink-0 transition shadow-sm"
                        title="বিস্তারিত দেখুন"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Helpline Box */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    ২৪/৭ সরাসরি সহায়তা
                  </span>
                  <div className="text-base font-black text-white">
                    09606 111 777
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                পণ্য নির্বাচন, কিস্তির নিয়মাবলি বা সরাসরি হোম ডেলিভারির জন্য আমাদের কাস্টমার কেয়ারে কল করুন।
              </p>
              <a
                href="tel:09606111777"
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center block transition border border-slate-700"
              >
                সরাসরি কল দিন
              </a>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM SECTION: MORE RECOMMENDED PRODUCTS FROM STORE (FULL GRID) */}
        {/* ============================================================== */}
        {displayBottomProducts.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>এক্সক্লুসিভ কালেকশন</span>
                </span>
                <h2 className="text-2xl font-black text-slate-950 mt-0.5">
                  ওয়েবসাইটের আরও বেশ কিছু প্রোডাক্ট (More Products from this Store)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  আমাদের স্টোরের অন্যান্য আকর্ষণীয় কালেকশন ও ট্রেন্ডিং প্রোডাক্টসমূহ।
                </p>
              </div>

              <Link
                href={`/?tenant=${tenantSlug}`}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 w-fit shadow-sm"
              >
                <span>সব প্রোডাক্ট দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayBottomProducts.map((pItem: any) => {
                const pImg = (pItem.images && pItem.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
                return (
                  <div
                    key={pItem.id}
                    className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <Link
                      href={`/products/${pItem.slug || pItem.id}?tenant=${tenantSlug}`}
                      className="block"
                    >
                      <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={pImg}
                          alt={pItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {pItem.badge && (
                          <span className="absolute top-3 left-3 bg-slate-900 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full shadow-md z-10">
                            {pItem.badge}
                          </span>
                        )}
                        {pItem.comparePrice && pItem.comparePrice > pItem.price && (
                          <span className="absolute bottom-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md z-10">
                            {Math.round(((pItem.comparePrice - pItem.price) / pItem.comparePrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                          {pItem.category?.name || 'কালেকশন'}
                        </span>
                        <Link
                          href={`/products/${pItem.slug || pItem.id}?tenant=${tenantSlug}`}
                          className="block font-bold text-slate-900 text-sm mt-2 hover:text-amber-600 transition line-clamp-2"
                        >
                          {pItem.title}
                        </Link>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-base font-black text-slate-950 block">
                            ৳ {pItem.price?.toLocaleString()}
                          </span>
                          {pItem.comparePrice && pItem.comparePrice > pItem.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ৳ {pItem.comparePrice?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/products/${pItem.slug || pItem.id}?tenant=${tenantSlug}`}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 shadow"
                        >
                          <span>বিস্তারিত</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer tenantSlug={tenantSlug} storeName={tenant?.name} />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading Product...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
