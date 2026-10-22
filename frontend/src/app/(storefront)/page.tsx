'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PlatformLanding } from '@/components/PlatformLanding';
import { api } from '@/lib/api';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, ArrowRight, Star, Clock, CheckCircle2, Sparkles, Calendar, Tag, ShieldCheck, Play, Video, Eye, X, Plus, Minus, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { BUSINESS_CATEGORIES } from '@/lib/categories';
import { ElectronicsStorefront } from '@/components/ElectronicsStorefront';

function StorefrontContent({ tenantSlug }: { tenantSlug: string }) {
  const router = useRouter();
  const [tenant, setTenant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<{ [itemId: string]: string }>({});

  // Media & Video Showcase state
  const [mediaList, setMediaList] = useState<any[]>([]);

  // Product Detail Modal state
  const [selectedProductForModal, setSelectedProductForModal] = useState<any | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [tenantRes, itemsRes, catRes, mediaRes] = await Promise.all([
          api.getTenant(tenantSlug),
          api.getItems({}, tenantSlug),
          api.getTenantCategories(tenantSlug),
          api.getMedia({}, tenantSlug),
        ]);

        if (tenantRes?.success) {
          setTenant(tenantRes.data);
        } else {
          setTenant({
            name: tenantSlug === 'medicare' ? 'MediCare Specialized Health Clinic' : 'Gulshan Fashion & Boutique',
            businessType: tenantSlug === 'medicare' ? 'healthcare_service' : 'fashion_clothing',
            subdomain: tenantSlug,
            currency: 'BDT',
          });
        }

        if (catRes?.success && Array.isArray(catRes.data)) {
          setCategories(catRes.data);
        }

        if (mediaRes?.success && Array.isArray(mediaRes.data)) {
          setMediaList(mediaRes.data);
        }

        if (itemsRes?.success && itemsRes.data?.length > 0) {
          setItems(itemsRes.data);
        } else {
          if (tenantSlug === 'medicare') {
            setItems([
              {
                id: 'med-1',
                title: 'Senior Dental Consultation & Full OPG Screening',
                slug: 'senior-dental-consultation',
                shortDescription: 'Comprehensive oral examination by FCPS dental surgeon with digital panoramic X-ray.',
                itemType: 'SERVICE_APPOINTMENT',
                price: 500,
                comparePrice: 800,
                durationMinutes: 60,
                images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'],
              },
              {
                id: 'med-2',
                title: 'Laser Teeth Whitening & Ultrasonic Scaling',
                slug: 'laser-teeth-whitening',
                shortDescription: 'Advanced ultrasonic plaque removal and painless dental enamel brightening.',
                itemType: 'SERVICE_APPOINTMENT',
                price: 2500,
                comparePrice: 3500,
                durationMinutes: 60,
                images: ['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'],
              },
            ]);
          } else {
            setItems([
              {
                id: 'fsh-1',
                title: 'Handcrafted Royal Dhakai Jamdani Saree (84 Count)',
                slug: 'royal-jamdani-saree',
                shortDescription: 'Pure combed cotton with gold zari handwoven by master craftsmen.',
                itemType: 'PHYSICAL_PRODUCT',
                price: 6500,
                comparePrice: 8500,
                stockQuantity: 15,
                images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
              },
              {
                id: 'fsh-2',
                title: 'Platinum Cotton Exclusive Semi-Long Panjabi',
                slug: 'platinum-cotton-panjabi',
                shortDescription: '100% fine cotton tailored with subtle minimalist embroidery.',
                itemType: 'PHYSICAL_PRODUCT',
                price: 2850,
                comparePrice: 3500,
                stockQuantity: 40,
                images: ['https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80'],
              },
            ]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [tenantSlug]);

  const matchedCategory = BUSINESS_CATEGORIES.find(
    (c) => c.id === tenant?.businessType || c.id === tenantSlug
  );

  const isMedical = tenant?.businessType === 'healthcare_service' || tenantSlug === 'medicare' || tenantSlug === 'meradenralcare' || matchedCategory?.archetype === 'APPOINTMENT_BOOKING';
  const isRealEstate = tenant?.businessType === 'real_estate' || tenantSlug === 'aebanproperty' || matchedCategory?.archetype === 'LEAD_GEN_REAL_ESTATE';
  const isElectronics = tenant?.businessType === 'electronics' || tenantSlug === 'bestlaptop' || tenantSlug === 'gadgethub' || tenant?.businessType === 'laptop_computer';
  const isPet = tenantSlug === 'petshopbd' || tenant?.businessType === 'pet_food';

  const getStoreBadge = () => {
    if (matchedCategory) return matchedCategory.badge;
    if (isMedical) return 'Specialized Healthcare & Dental Clinic';
    if (isRealEstate) return 'Luxury Real Estate & Country Estates';
    if (isElectronics) return 'Original Gadgets & Laptop Gallery';
    if (isPet) return 'Premium Pet Food & Animal Care';
    return 'Designer Fashion & Apparel Boutique';
  };

  const getHeroTitle = () => {
    if (tenant?.themeConfig?.heroTitle) return tenant.themeConfig.heroTitle;
    if (matchedCategory) return matchedCategory.heroTitle;
    if (isMedical) return <>Confirmed <span className="text-emerald-600">1-Hour Time Slots</span> with Senior Doctors</>;
    if (isRealEstate) return <>Prestigious Living at <span className="text-amber-600">Luxury Estates & Villas</span></>;
    if (isElectronics) return <>High-Performance <span className="text-indigo-600">Laptops & Authentic Gadgets</span></>;
    if (isPet) return <>Nutritious Food & Care for <span className="text-emerald-600">Your Beloved Pets</span></>;
    return <>Timeless Elegance in <span className="text-rose-600">Exclusive Designer Fashion</span> 2026</>;
  };

  const getHeroSubtitle = () => {
    if (tenant?.themeConfig?.heroSubtitle) return tenant.themeConfig.heroSubtitle;
    if (matchedCategory) return matchedCategory.heroSubtitle;
    if (isMedical) return 'Skip waiting rooms. Reserve confirmed 1-hour time slots with expert surgeons and physicians with instant digital booking.';
    if (isRealEstate) return 'Explore verified architectural masterpieces, private country estates, and luxury residences in premier locations.';
    if (isElectronics) return 'Official warranty-backed laptops, ultrabooks, and high-performance computing hardware with express delivery.';
    if (isPet) return 'Veterinarian-approved diets, vitamins, toys, and grooming essentials for healthy, happy pets.';
    return '100% authentic handwoven Jamdani sarees, tailored designer panjabis, and premium festive apparel.';
  };

  const getHeroImage = () => {
    if (items[0]?.images?.[0]) return items[0].images[0];
    if (matchedCategory?.sampleItems?.[0]?.image) return matchedCategory.sampleItems[0].image;
    if (isMedical) return 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80';
    if (isRealEstate) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    if (isElectronics) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80';
    return 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80';
  };

  const handleAddToCart = (item: any) => {
    let variantList: string[] = [];
    if (Array.isArray(item.variants)) {
      variantList = item.variants;
    } else if (typeof item.variants === 'string' && item.variants.trim()) {
      variantList = item.variants.split(',').map((v: string) => v.trim()).filter(Boolean);
    }

    const chosenVariant = selectedVariants[item.id] || (variantList.length > 0 ? variantList[0] : null);
    const cartItemId = chosenVariant ? `${item.id}-${chosenVariant.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : item.id;
    const cartItemTitle = chosenVariant ? `${item.title} (${chosenVariant})` : item.title;

    addToCart({
      id: cartItemId,
      title: cartItemTitle,
      price: item.price,
      quantity: 1,
      image: item.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    });
    setAddedItemNotice(cartItemTitle);
    setTimeout(() => setAddedItemNotice(null), 3000);
  };

  if (isElectronics) {
    return (
      <ElectronicsStorefront
        tenant={tenant}
        tenantSlug={tenantSlug}
        items={items}
        categories={categories}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar tenantSlug={tenantSlug} storeName={tenant?.name} />

      {/* Floating Notice when adding item */}
      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">Added to Bag: {addedItemNotice.slice(0, 24)}...</span>
          <Link
            href={`/checkout?tenant=${tenantSlug}`}
            className="text-xs bg-rose-600 hover:bg-rose-500 font-bold px-3 py-1.5 rounded-xl ml-2"
          >
            Checkout
          </Link>
        </div>
      )}

      {/* Dynamic Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16 sm:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border bg-white text-slate-800">
                <Sparkles className={`w-3.5 h-3.5 ${isMedical ? 'text-emerald-500' : isRealEstate ? 'text-amber-500' : isElectronics ? 'text-indigo-500' : 'text-rose-500'}`} />
                <span>{getStoreBadge()}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {getHeroTitle()}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {getHeroSubtitle()}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {isMedical ? (
                  <Link
                    href={`/booking?tenant=${tenantSlug}`}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book 1-Hour Time Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <a
                    href="#products"
                    className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl ${isRealEstate ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25' : isElectronics ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/25' : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25'} text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-95`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isRealEstate ? 'View Properties' : isElectronics ? 'Browse Laptops' : 'Explore Collection'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}

                <Link
                  href={`/checkout?tenant=${tenantSlug}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition"
                >
                  <span>Express Checkout</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {isMedical ? 'Live Slot Tracking' : isRealEstate ? 'Verified Legal Title' : isElectronics ? '100% Genuine Warranty' : 'Cash on Delivery'}
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  72-Hour Consumer Protection
                </span>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white">
                <img
                  src={getHeroImage()}
                  alt="Featured Hero"
                  className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md w-fit mb-2">
                    {isMedical ? 'Live Appointments Open' : isRealEstate ? 'Exclusive Listing' : isElectronics ? 'Official Hardware' : 'Hot Deal • 50% Off'}
                  </span>
                  <h3 className="text-xl font-bold">
                    {tenant?.name || 'Storefront'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {isRealEstate ? '10,000+ sq ft luxury mansion on 3 private manicured acres' : 'Fast, reliable home delivery nationwide'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog / Services Section */}
      <section id="products" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {(() => {
          const filteredItems = items.filter((item) => {
            if (selectedCategory === 'all') return true;
            return (
              item.categoryId === selectedCategory ||
              item.category?.id === selectedCategory ||
              item.category?.slug === selectedCategory
            );
          });

          return (
            <>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
                <div>
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${isMedical ? 'text-emerald-600' : isRealEstate ? 'text-amber-600' : isElectronics ? 'text-indigo-600' : 'text-rose-600'} block mb-1`}>
                    {isMedical ? 'Available Clinical Care' : isRealEstate ? 'Exclusive Estate Listings' : isElectronics ? 'High-Performance PC & Tech' : 'Featured Catalog'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {isMedical ? 'Specialized Treatments & Consultations' : isRealEstate ? 'Luxury Country Estates & Private Villas' : isElectronics ? 'Popular Laptops & Tech Devices' : 'Curated Collection'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing {filteredItems.length} of {items.length} {isMedical ? 'services' : isRealEstate ? 'properties' : isElectronics ? 'devices' : 'items'}
                  </span>
                </div>
              </div>

              {/* Dynamic Category Pill Filters */}
              {categories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 max-w-full">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap shadow-sm ${
                      selectedCategory === 'all'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    All Categories ({items.length})
                  </button>
                  {categories.map((cat) => {
                    const count = items.filter(
                      (i) => i.categoryId === cat.id || i.category?.id === cat.id || i.category?.slug === cat.slug
                    ).length;
                    return (
                      <button
                        key={cat.id || cat.slug}
                        onClick={() => setSelectedCategory(cat.id || cat.slug)}
                        className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap shadow-sm ${
                          selectedCategory === (cat.id || cat.slug)
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Active Category Campaign / Promo Ribbon */}
              {(() => {
                const activeCat = categories.find(
                  (c) => c.id === selectedCategory || c.slug === selectedCategory
                );
                if (!activeCat || !activeCat.promoSlogan) return null;
                return (
                  <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                        <Sparkles className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          <span>{activeCat.name} • Special Campaign</span>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                          {activeCat.promoSlogan}
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-indigo-200">
                      Live Store Offer
                    </span>
                  </div>
                );
              })()}

              {/* Item Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full py-16 px-6 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200 space-y-2">
                    <p className="font-bold text-sm text-slate-700">No items available under this category.</p>
                    <p>Switch categories or check back soon for newly added items.</p>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const isService = item.itemType === 'SERVICE_APPOINTMENT';
                    const cardImg = (item.images && item.images.length > 0 && item.images[0])
                      ? item.images[0]
                      : isElectronics
                      ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
                      : isRealEstate
                      ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                      : isMedical
                      ? 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
                      : isPet
                      ? 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'
                      : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

                    // Parse variants
                    let variantList: string[] = [];
                    if (Array.isArray(item.variants)) {
                      variantList = item.variants;
                    } else if (typeof item.variants === 'string' && item.variants.trim()) {
                      variantList = item.variants.split(',').map((v: string) => v.trim()).filter(Boolean);
                    }

                    // Parse specifications
                    const specsEntries = Array.isArray(item.specifications)
                      ? item.specifications.filter((s: any) => s && s.key && s.value)
                      : (item.specifications && typeof item.specifications === 'object')
                      ? Object.entries(item.specifications).map(([key, value]) => ({ key, value }))
                      : [];

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          router.push(`/products/${item.slug || item.id}?tenant=${tenantSlug}`);
                        }}
                        className="group rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                      >
                        {/* Image & Badges */}
                        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                          <img
                            src={cardImg}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none gap-2">
                            <div className="flex flex-col gap-1.5 items-start">
                              {item.badge && (
                                <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>{item.badge}</span>
                                </span>
                              )}
                              {item.comparePrice && item.comparePrice > item.price && (
                                <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  <span>{Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)}% OFF</span>
                                </span>
                              )}
                            </div>

                            {isService && (
                              <div className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{item.durationMinutes || 60} min slot</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                                <Star className="w-3.5 h-3.5 fill-amber-500" />
                                <span>5.0</span>
                                <span className="text-slate-400 font-normal">(Verified)</span>
                              </div>
                              {item.category?.name && (
                                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                                  {item.category.name}
                                </span>
                              )}
                            </div>

                            <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-rose-600 transition leading-snug">
                              {item.title}
                            </h3>

                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {item.shortDescription}
                            </p>

                            {/* Dynamic Variants Selection */}
                            {variantList.length > 0 && (
                              <div className="pt-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                  Select Option / Color:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {variantList.map((variantName: string) => {
                                    const isSelected = (selectedVariants[item.id] || variantList[0]) === variantName;
                                    return (
                                      <button
                                        key={variantName}
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setSelectedVariants((prev) => ({ ...prev, [item.id]: variantName }));
                                        }}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                                          isSelected
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                      >
                                        {variantName}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Dynamic Specifications */}
                            {specsEntries.length > 0 && (
                              <div className="pt-2 flex flex-wrap gap-1.5">
                                {specsEntries.slice(0, 3).map((spec: any, idx: number) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/60"
                                  >
                                    <span className="text-slate-400 font-normal">{spec.key}:</span>
                                    <span className="font-semibold text-slate-800">{spec.value}</span>
                                  </span>
                                ))}
                                {specsEntries.length > 3 && (
                                  <span className="text-[10px] text-slate-400 font-medium self-center">
                                    +{specsEntries.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                            <div>
                              <span className="text-xs text-slate-400 block font-medium">
                                {isRealEstate ? 'Property Price' : 'Price / Fee'}
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-extrabold text-slate-900">
                                  ৳ {item.price.toLocaleString()}
                                </span>
                                {item.comparePrice && (
                                  <span className="text-xs text-slate-400 line-through">
                                    ৳ {item.comparePrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                href={`/products/${item.slug || item.id}?tenant=${tenantSlug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-sm"
                                title="সম্পূর্ণ ডিসপ্লেতে বিস্তারিত দেখুন"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>বিস্তারিত</span>
                              </Link>

                              {isService ? (
                                <Link
                                  href={`/booking?tenant=${tenantSlug}&itemId=${item.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Book Slot</span>
                                </Link>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(item);
                                  }}
                                  className={`px-4 py-2.5 rounded-xl ${isRealEstate ? 'bg-amber-600 hover:bg-amber-500' : isElectronics ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-900 hover:bg-rose-600'} text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95`}
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>{isRealEstate ? 'Inquiry Booking' : 'Add to Bag'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          );
        })()}
      </section>

      {/* ============================================================== */}
      {/* SECTION: CATEGORY VIDEO & MEDIA SHOWCASE (YouTube & Facebook) */}
      {/* ============================================================== */}
      {mediaList.length > 0 && (() => {
        const filteredMedia = mediaList.filter((m) => {
          if (selectedCategory === 'all') return true;
          return m.categoryId === selectedCategory || m.categoryId === 'all';
        });

        if (filteredMedia.length === 0) return null;

        return (
          <section className="py-16 sm:py-20 bg-slate-950 text-white border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-1">
                    Video Reviews & Visual Highlights
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Category Media & Video Showcase
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Watch real unboxing, craftsmanship & quality tests
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMedia.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-indigo-500/50 transition flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-slate-950">
                      {m.type === 'YOUTUBE' && m.embedUrl ? (
                        <iframe
                          src={m.embedUrl}
                          title={m.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      ) : m.type === 'FACEBOOK' && m.embedUrl ? (
                        <iframe
                          src={m.embedUrl}
                          title={m.title}
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      ) : (
                        <img
                          src={m.thumbnail || m.url}
                          alt={m.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white shadow-md flex items-center gap-1 ${
                          m.type === 'YOUTUBE'
                            ? 'bg-red-600'
                            : m.type === 'FACEBOOK'
                            ? 'bg-blue-600'
                            : 'bg-emerald-600'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>{m.type}</span>
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-400/20">
                          {m.categoryName || 'Showcase'}
                        </span>
                        <h4 className="font-bold text-white text-base mt-2 leading-snug">
                          {m.title}
                        </h4>
                        {m.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {m.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">
                          Verified Media
                        </span>
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <span>Watch Full</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ============================================================== */}
      {/* MODAL: PRODUCT DETAILS QUICK VIEW */}
      {/* ============================================================== */}
      {selectedProductForModal && (() => {
        const modalItem = selectedProductForModal;
        const modalImages: string[] = (Array.isArray(modalItem.images) && modalItem.images.length > 0)
          ? modalItem.images
          : (modalItem.images ? [modalItem.images] : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80']);
        const modalImg = modalImages[modalImageIndex] || modalImages[0];

        let variantList: string[] = [];
        if (Array.isArray(modalItem.variants)) {
          variantList = modalItem.variants;
        } else if (typeof modalItem.variants === 'string' && modalItem.variants.trim()) {
          variantList = modalItem.variants.split(',').map((v: string) => v.trim()).filter(Boolean);
        }

        const specsEntries = Array.isArray(modalItem.specifications)
          ? modalItem.specifications.filter((s: any) => s && s.key && s.value)
          : (modalItem.specifications && typeof modalItem.specifications === 'object')
          ? Object.entries(modalItem.specifications).map(([key, value]) => ({ key, value }))
          : [];

        const chosenVariant = selectedVariants[modalItem.id] || (variantList.length > 0 ? variantList[0] : null);

        // Find any related video (YouTube/Facebook) for this product or category
        const relatedVideo = mediaList.find((m) => 
          (m.type === 'YOUTUBE' || m.type === 'FACEBOOK') &&
          (m.categoryId === modalItem.categoryId || m.categoryName?.toLowerCase() === modalItem.category?.name?.toLowerCase() || m.categoryId === 'all')
        );

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <Link
                  href={`/products/${modalItem.slug || modalItem.id}?tenant=${tenantSlug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>সম্পূর্ণ ডিসপ্লেতে বিস্তারিত ও অন্যান্য প্রোডাক্ট দেখুন</span>
                </Link>
                <button
                  onClick={() => {
                    setSelectedProductForModal(null);
                    setModalImageIndex(0);
                  }}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Visuals: Multi-image Gallery */}
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group">
                    <img
                      src={modalImg}
                      alt={modalItem.title}
                      className="w-full h-full object-cover"
                    />
                    {modalItem.badge && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{modalItem.badge}</span>
                      </div>
                    )}
                    {modalItem.comparePrice && modalItem.comparePrice > modalItem.price && (
                      <div className="absolute bottom-3 left-3 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md z-10">
                        {Math.round(((modalItem.comparePrice - modalItem.price) / modalItem.comparePrice) * 100)}% DISCOUNT
                      </div>
                    )}

                    {modalImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setModalImageIndex((prev) => (prev > 0 ? prev - 1 : modalImages.length - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition z-10"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setModalImageIndex((prev) => (prev < modalImages.length - 1 ? prev + 1 : 0))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition z-10"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                          {modalImageIndex + 1} / {modalImages.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row: ALL images visible */}
                  {modalImages.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {modalImages.map((u, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setModalImageIndex(i)}
                          className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                            i === modalImageIndex
                              ? 'border-rose-600 shadow-md ring-2 ring-rose-600/30'
                              : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={u} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details & Specifications */}
                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                        {modalItem.category?.name || 'Verified Product'}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>5.0 (Customer Verified)</span>
                      </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 leading-tight">
                      {modalItem.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      {modalItem.shortDescription || 'Crafted with premium materials and strict quality assurance standards.'}
                    </p>
                  </div>

                  {/* Pricing Section */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline gap-3">
                    <span className="text-2xl font-black text-slate-950">
                      ৳ {modalItem.price.toLocaleString()}
                    </span>
                    {modalItem.comparePrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ৳ {modalItem.comparePrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs font-bold text-emerald-600 ml-auto">In Stock & Ready to Ship</span>
                  </div>

                  {/* Variant Options Selector */}
                  {variantList.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Select Option / Color: {chosenVariant && <span className="text-rose-600 font-black">({chosenVariant})</span>}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {variantList.map((vName) => {
                          const isSelected = chosenVariant === vName;
                          return (
                            <button
                              key={vName}
                              type="button"
                              onClick={() => setSelectedVariants((prev) => ({ ...prev, [modalItem.id]: vName }))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
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

                  {/* Specifications Key-Value Table */}
                  {specsEntries.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Detailed Specifications:
                      </span>
                      <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
                        {specsEntries.map((spec: any, i: number) => (
                          <div key={i} className="flex justify-between px-3 py-2 bg-slate-50/50">
                            <span className="text-slate-500 font-medium">{spec.key}</span>
                            <span className="font-bold text-slate-900 text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector & Direct Actions */}
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-700">Quantity:</span>
                      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                        <button
                          type="button"
                          onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                          className="p-1 rounded-lg text-slate-600 hover:bg-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {modalQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setModalQuantity((q) => q + 1)}
                          className="p-1 rounded-lg text-slate-600 hover:bg-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          for (let i = 0; i < modalQuantity; i++) {
                            handleAddToCart(modalItem);
                          }
                          setSelectedProductForModal(null);
                        }}
                        className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </button>

                      <Link
                        href={`/checkout?tenant=${tenantSlug}`}
                        onClick={() => {
                          handleAddToCart(modalItem);
                          setSelectedProductForModal(null);
                        }}
                        className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition flex items-center justify-center gap-2"
                      >
                        <span>Express Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Cash on Delivery
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        72-Hour Consumer Protection
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Video Showcase (Dedicated Full-Width Section) */}
              {relatedVideo && relatedVideo.embedUrl && (
                <div className="pt-4 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-rose-600" />
                      <span>ভিডিও ডেমোনস্ট্রেশন ও রিভিউ ({relatedVideo.type})</span>
                    </span>
                    <span className="text-xs text-slate-500 font-medium truncate max-w-sm">{relatedVideo.title}</span>
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md">
                    <iframe
                      src={relatedVideo.embedUrl}
                      title={relatedVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <Footer tenantSlug={tenantSlug} storeName={tenant?.name} />
    </div>
  );
}

function MainRootContent() {
  const searchParams = useSearchParams();
  const tenantSlug = searchParams.get('tenant');

  // If visiting root with no tenant parameter -> Display Central SaaS Platform Landing
  if (!tenantSlug) {
    return <PlatformLanding />;
  }

  // Otherwise, render the requested tenant's storefront
  return <StorefrontContent tenantSlug={tenantSlug} />;
}

export default function StorefrontHomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-bold">Loading NexStore Engine...</div>}>
      <MainRootContent />
    </Suspense>
  );
}
