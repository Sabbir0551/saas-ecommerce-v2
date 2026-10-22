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
        if (itemRes?.success && itemRes.data) {
          setItem(itemRes.data);
          if (itemRes.data.variants) {
            let vList: string[] = [];
            if (Array.isArray(itemRes.data.variants)) {
              vList = itemRes.data.variants;
            } else if (typeof itemRes.data.variants === 'string') {
              vList = itemRes.data.variants.split(',').map((v: string) => v.trim()).filter(Boolean);
            }
            if (vList.length > 0) setSelectedVariant(vList[0]);
          }

          // Fetch category schema for dynamic custom attributes
          const catKey = itemRes.data.category?.slug || itemRes.data.categoryId || tenantRes?.data?.businessType || 'general';
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
        image: item.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
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
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
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
    : (item.images ? [item.images] : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80']);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar tenantSlug={tenantSlug} storeName={tenant?.name} />

      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">ব্যাগে যুক্ত হয়েছে: {addedItemNotice.slice(0, 24)}...</span>
          <Link
            href={`/checkout?tenant=${tenantSlug}`}
            className="text-xs bg-rose-600 hover:bg-rose-500 font-bold px-3 py-1.5 rounded-xl ml-2 shrink-0"
          >
            অর্ডার করুন
          </Link>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12 flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href={`/?tenant=${tenantSlug}`} className="hover:text-rose-600 font-medium flex items-center gap-1 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400">{item.category?.name || 'Catalog'}</span>
          <span>/</span>
          <span className="font-bold text-slate-800 truncate max-w-xs">{item.title}</span>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: FULL DISPLAY PRODUCT HERO & BUY BOX */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
          {/* Visual Gallery with Full Multi-Image Support */}
          <div className="space-y-4">
            {/* Main Active Image Box */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-md group">
              <img
                src={currentDisplayImg}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {item.badge && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{item.badge}</span>
                </div>
              )}

              {item.comparePrice && item.comparePrice > item.price && (
                <div className="absolute bottom-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)}% DISCOUNT</span>
                </div>
              )}

              {/* Prev / Next controls for multiple images */}
              {imageList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition opacity-80 hover:opacity-100 z-10"
                    title="পূর্ববর্তী ছবি"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveImageIndex((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition opacity-80 hover:opacity-100 z-10"
                    title="পরবর্তী ছবি"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow z-10">
                    {activeImageIndex + 1} / {imageList.length} Photos
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery Strip (ALL IMAGES VISIBLE & CLICKABLE) */}
            {imageList.length > 1 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  সকল ছবি দেখুন ({imageList.length}টি ফটো):
                </span>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {imageList.map((imgUrl, idx) => {
                    const isActive = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 transition-all ${
                          isActive
                            ? 'ring-2 ring-rose-600 ring-offset-2 scale-105 shadow-md border-transparent'
                            : 'opacity-70 hover:opacity-100 border border-slate-200'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-slate-900/85 text-[8px] font-black text-white text-center py-0.5">
                            COVER
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Video Thumbnail Shortcut Button if Video Exists */}
                  {videoToShow && (
                    <a
                      href="#product-video-section"
                      className="w-20 h-20 rounded-2xl bg-slate-950 text-white shrink-0 flex flex-col items-center justify-center border border-slate-800 hover:scale-105 transition shadow-sm group"
                      title="ভিডিও রিভিউ দেখুন"
                    >
                      <Play className="w-5 h-5 text-rose-500 fill-rose-500 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-300">ভিডিও</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                  {item.category?.name || 'Verified Collection'}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>5.0</span>
                  <span className="text-slate-400 font-normal">(Verified Customer Satisfaction)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                {item.title}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed pt-2">
                {item.shortDescription || 'Experience superior craftsmanship, authentic materials, and rigorous quality testing standards.'}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-4">
              <span className="text-3xl font-black text-slate-950">
                ৳ {item.price.toLocaleString()}
              </span>
              {item.comparePrice && (
                <span className="text-base text-slate-400 line-through">
                  ৳ {item.comparePrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 ml-auto bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                In Stock & Ready for Delivery
              </span>
            </div>

            {/* Variant Selector */}
            {variantList.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Select Option: {selectedVariant && <span className="text-rose-600 font-black">({selectedVariant})</span>}
                </span>
                <div className="flex flex-wrap gap-2">
                  {variantList.map((vName) => {
                    const isSelected = (selectedVariant || variantList[0]) === vName;
                    return (
                      <button
                        key={vName}
                        type="button"
                        onClick={() => setSelectedVariant(vName)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
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

            {/* Dynamic Specifications Table (Metafield-driven) */}
            {item.customAttributes && Object.keys(item.customAttributes).length > 0 ? (
              <SpecificationsTable
                customAttributes={item.customAttributes}
                fields={categorySchema?.fields}
                lang="bn"
              />
            ) : specsEntries.length > 0 ? (
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Product Specifications:
                </span>
                <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                  {specsEntries.map((spec: any, i: number) => (
                    <div key={i} className="flex justify-between px-4 py-2.5 bg-slate-50/50">
                      <span className="text-slate-500 font-medium">{spec.key}</span>
                      <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-4 space-y-4 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-white transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-900">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <Link
                  href={`/checkout?tenant=${tenantSlug}`}
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/25 transition flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Express Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Cash on Delivery Available
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  72-Hour Consumer Protection
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  100% Genuine Guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: DEDICATED FULL-WIDTH VIDEO DEMONSTRATION & REVIEW */}
        {/* ============================================================== */}
        {videoToShow && (
          <section id="product-video-section" className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-rose-500" />
                  <span>ভিডিও ডেমোনস্ট্রেশন ও রিভিউ (Live Video Walkthrough)</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {videoToShow.title || `${item.title} - Official Video Review`}
                </h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-slate-800 text-slate-300 border border-slate-700 w-fit">
                {videoToShow.type || 'HD VIDEO'}
              </span>
            </div>

            <div className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
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

            {videoToShow.description && (
              <p className="text-sm text-slate-300 max-w-3xl mx-auto text-center leading-relaxed">
                {videoToShow.description}
              </p>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* SECTION 3: OTHER PRODUCTS FROM THE WEBSITE (WELL-ARRANGED GRID) */}
        {/* ============================================================== */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>এক্সক্লুসিভ কালেকশন</span>
                </span>
                <h2 className="text-2xl font-black text-slate-950 mt-1">
                  ওয়েবসাইটের অন্যান্য জনপ্রিয় প্রোডাক্টসমূহ (More Products from this Store)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  আমাদের স্টোরের আরও আকর্ষণীয় কালেকশন থেকে আপনার পছন্দের প্রোডাক্ট বেছে নিন।
                </p>
              </div>
              <Link
                href={`/?tenant=${tenantSlug}`}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5 w-fit shadow-sm"
              >
                <span>সব প্রোডাক্ট দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 8).map((relItem: any) => {
                const relImg = (relItem.images && relItem.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
                return (
                  <div
                    key={relItem.id}
                    className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <Link
                      href={`/products/${relItem.slug || relItem.id}?tenant=${tenantSlug}`}
                      className="block"
                    >
                      <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={relImg}
                          alt={relItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {relItem.badge && (
                          <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md z-10">
                            {relItem.badge}
                          </span>
                        )}
                        {relItem.comparePrice && relItem.comparePrice > relItem.price && (
                          <span className="absolute bottom-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md z-10">
                            {Math.round(((relItem.comparePrice - relItem.price) / relItem.comparePrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                          {relItem.category?.name || 'Collection'}
                        </span>
                        <Link
                          href={`/products/${relItem.slug || relItem.id}?tenant=${tenantSlug}`}
                          className="block font-bold text-slate-900 text-sm mt-2 hover:text-rose-600 transition line-clamp-2"
                        >
                          {relItem.title}
                        </Link>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-base font-black text-slate-900 block">
                            ৳ {relItem.price?.toLocaleString()}
                          </span>
                          {relItem.comparePrice && relItem.comparePrice > relItem.price && (
                            <span className="text-xs text-slate-400 line-through">
                              ৳ {relItem.comparePrice?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/products/${relItem.slug || relItem.id}?tenant=${tenantSlug}`}
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
