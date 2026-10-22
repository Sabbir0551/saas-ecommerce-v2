'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  Phone,
  Truck,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Search,
  ChevronRight,
  ChevronDown,
  Star,
  CheckCircle2,
  Wind,
  Volume2,
  Cpu,
  Flame,
  Droplets,
  Layers,
  MapPin,
  Clock,
  ArrowRight,
  Eye,
  X,
  Plus,
  Minus,
  Sparkles,
  Percent,
  Check,
  Smartphone,
  Tv,
  Refrigerator,
  WashingMachine,
  Bike,
  Sun,
  Award,
  SlidersHorizontal,
} from 'lucide-react';

interface ElectronicsStorefrontProps {
  tenant: any;
  tenantSlug: string;
  items: any[];
  categories: any[];
}

export function ElectronicsStorefront({
  tenant,
  tenantSlug,
  items,
  categories,
}: ElectronicsStorefrontProps) {
  const { addToCart } = useCart();
  const [activeMegaCategory, setActiveMegaCategory] = useState<string>('ac');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(true);
  const [selectedApplianceFilter, setSelectedApplianceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Selected product modal state
  const [detailModalProduct, setDetailModalProduct] = useState<any | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [modalQuantity, setModalQuantity] = useState(1);

  // Showroom filter state
  const [selectedShowroomCity, setSelectedShowroomCity] = useState('Dhaka');

  // Hero carousel slides in 100% English
  const slides = [
    {
      title: 'Year-End Electronics Discount Festival 2026!',
      subtitle: 'Up to 45% OFF on Smart Inverter ACs & Major Appliances + Free Nationwide Delivery & Installation',
      badge: 'MEGA SALE • 0% EMI AVAILABLE',
      primaryBtnText: 'Explore Offers',
      bgGradient: 'from-blue-900 via-indigo-900 to-slate-950',
      tag: 'Limited Stock',
      emiText: 'Up to 12 Months 0% Interest EMI with 28 Major Banks',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Hisense & Gree Dual Inverter Series',
      subtitle: '19dB Ultra-Quiet Sleep Mode & 12 Years Official Compressor Replacement Warranty',
      badge: 'Smart WiFi IoT App Control',
      primaryBtnText: 'Inverter AC Collection',
      bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
      tag: 'T3 Tropical',
      emiText: '100% Super Cooling Capacity even in 58°C Extreme Heat',
      image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Whirlpool & Haier Frost-Free Refrigerators',
      subtitle: '6th Sense Deep Cooling Technology & MicroBlock Anti-Bacterial Fresh Preservation',
      badge: '10 Years Inverter Compressor Warranty',
      primaryBtnText: 'Refrigerator Collection',
      bgGradient: 'from-amber-950 via-orange-950 to-slate-950',
      tag: 'Energy Star 5-Star',
      emiText: 'Save up to 70% on Monthly Electricity Bills',
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  // Auto-advance hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Mega menu definition in 100% English
  const megaCategories = [
    {
      id: 'ev',
      name: 'Electric Vehicles (EV)',
      sub: 'Smart Electric Scooters & Bikes',
      icon: Bike,
      filters: {
        motorPower: ['800W Eco', '1000W Dynamic', '1200W High Torque', '1500W Super'],
        range: ['40-60 km/charge', '60-80 km/charge', '80-100+ km/charge'],
        batteryType: ['Graphene Fast Charge', 'Lithium Ion Smart', 'Lead Acid Heavy Duty'],
        brands: ['Yadea', 'Akij Motors', 'Runner EV', 'SmartVolt'],
      },
    },
    {
      id: 'ac',
      name: 'Air Conditioners (AC)',
      sub: 'Inverter & Non-Inverter AC',
      icon: Wind,
      filters: {
        capacity: ['1.0 Ton (12000 BTU)', '1.5 Ton (18000 BTU)', '2.0 Ton (24000 BTU)', '2.5 Ton+ (30000 BTU)'],
        tech: ['Dual Inverter Compressor', 'Smart Inverter (T3 Tropical)', 'Non-Inverter Turbo', 'Multi-Split AC'],
        features: ['3D 4-Way Airflow', 'Golden Fin Anti-Rust', '19dB Ultra Quiet Sleep', '56°C High-Temp Self Clean', 'WiFi IoT App Control'],
        brands: ['Hisense', 'Gree', 'Haier', 'Panasonic', 'General', 'Whirlpool'],
      },
    },
    {
      id: 'fridge',
      name: 'Refrigerators & Freezers',
      sub: 'Frost-Free & Side-by-Side',
      icon: Refrigerator,
      filters: {
        capacity: ['Under 200 Liters', '200 - 320 Liters', '350 - 450 Liters', '500+ Liters Multi-Door'],
        type: ['Frost-Free Dual Inverter', 'Direct Cool Economy', 'Side-by-Side Luxury', 'Deep Chest Freezer'],
        features: ['6th Sense Quick Freeze', 'Toughened Glass Shelves', 'Smart Inverter Compressor', 'Deodorizing Carbon Filter'],
        brands: ['Whirlpool', 'Haier', 'Hisense', 'Hitachi', 'Singer'],
      },
    },
    {
      id: 'tv',
      name: 'Smart TVs & Soundbars',
      sub: '4K Google TV, OLED & QLED',
      icon: Tv,
      filters: {
        screenSize: ['32 Inch HD Smart', '43 Inch 4K Frameless', '50-55 Inch Google TV', '65-75 Inch Cinema QLED'],
        panel: ['OLED Pure Black', 'Quantum Dot QLED', 'IPS 4K HDR10+', 'Frameless Bezel-less'],
        audio: ['Dolby Atmos Audio', 'DTS Virtual:X Soundbar', 'Subwoofer Wireless', '60W Acoustic Speakers'],
        brands: ['Hisense', 'Sony', 'Samsung', 'Haier', 'Toshiba'],
      },
    },
    {
      id: 'washer',
      name: 'Washing Machines & Dryers',
      sub: 'Front & Top Load Inverter',
      icon: WashingMachine,
      filters: {
        capacity: ['6.5 kg - 7.5 kg (Small Family)', '8.0 kg - 9.5 kg (Standard)', '10.5 kg+ (Washer Dryer Combo)'],
        mechanism: ['Front Loading Direct Drive', 'Top Loading Pulsator', 'Washer & 100% Heat Dryer'],
        features: ['90°C Steam Anti-Allergy', 'Smart Inverter BLDC Motor', 'Quick 15 Min Wash', 'Child Lock Protection'],
        brands: ['Toshiba', 'Haier', 'Whirlpool', 'Panasonic'],
      },
    },
    {
      id: 'kitchen',
      name: 'Kitchen & Microwave',
      sub: 'Air Fryers, Grills & Ovens',
      icon: Flame,
      filters: {
        appliance: ['Convection Microwave Oven', 'Grill Microwave', 'Rapid Air Fryer XXL', 'Induction & Infrared Cooker'],
        capacity: ['20 - 25 Liters Solo/Grill', '28 - 34 Liters Convection', '5.5L - 7L Air Fryer'],
        brands: ['Philips', 'Panasonic', 'Miyako', 'Whirlpool'],
      },
    },
    {
      id: 'small',
      name: 'Small Appliances & Geysers',
      sub: 'Blenders, Water Purifiers & Geysers',
      icon: Droplets,
      filters: {
        itemType: ['Heavy Duty Blender & Grinder', 'Instant Geyser Water Heater', 'RO Mineral Water Purifier', 'Stand & Ceiling Smart Fans'],
        brands: ['Philips', 'Panasonic', 'BRB', 'Miyako'],
      },
    },
    {
      id: 'power',
      name: 'Inverter IPS & Solar',
      sub: 'Solar Hybrid & Online UPS',
      icon: Zap,
      filters: {
        capacity: ['800VA - 1000VA (Home IPS)', '1500VA - 2500VA (Pure Sine Wave)', '3.5kVA+ Solar Hybrid Inverter'],
        brands: ['Luminous', 'Schneider Electric', 'Microtek'],
      },
    },
  ];

  // Showrooms nationwide in 100% English
  const showrooms = [
    {
      city: 'Dhaka',
      name: 'Dhanmondi Flagship Experience Center',
      address: 'Plot 42, Road 27 (Old), Dhanmondi R/A, Dhaka-1209',
      phone: '09606 111 777 (Ext 101)',
      hours: '10:00 AM - 09:00 PM (Open Daily)',
      manager: 'Engr. Tanvir Ahmed',
    },
    {
      city: 'Dhaka',
      name: 'Uttara Smart Appliance Mega Store',
      address: 'Sector 3, Jasimuddin Avenue (Near North Tower), Uttara, Dhaka',
      phone: '09606 111 777 (Ext 102)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Mahfuzur Rahman',
    },
    {
      city: 'Dhaka',
      name: 'Mirpur 10 Outlet & Service Hub',
      address: 'Main Road Roundabout, Mirpur 10, Dhaka-1216',
      phone: '09606 111 777 (Ext 103)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Kamrul Hasan',
    },
    {
      city: 'Chittagong',
      name: 'Agrabad Commercial Showroom',
      address: 'Agrabad Commercial Area, CDA Avenue, Chattogram',
      phone: '09606 111 777 (Ext 201)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Nasir Uddin',
    },
    {
      city: 'Chittagong',
      name: 'GEC Circle Electronics Hub',
      address: 'Sanmar Ocean City Ground Floor, GEC, Chattogram',
      phone: '09606 111 777 (Ext 202)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Shahed Chowdhury',
    },
    {
      city: 'Sylhet',
      name: 'Zindabazar Premier Outlet',
      address: 'East Zindabazar, Baruthkhana Point, Sylhet',
      phone: '09606 111 777 (Ext 301)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Foyez Ahmed',
    },
    {
      city: 'Khulna',
      name: 'KDA Avenue Experience Zone',
      address: 'Shibbari More, KDA Avenue, Khulna',
      phone: '09606 111 777 (Ext 401)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Rezaul Karim',
    },
  ];

  // Helper for adding to cart
  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: 1,
      image: item.images?.[0] || 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    });
    setAddedItemNotice(item.title);
    setTimeout(() => setAddedItemNotice(null), 3500);
  };

  // Helper for modal add to cart
  const handleModalAddToCart = () => {
    if (!detailModalProduct) return;
    addToCart({
      id: detailModalProduct.id,
      title: detailModalProduct.title,
      price: detailModalProduct.price,
      quantity: modalQuantity,
      image: detailModalProduct.images?.[modalImageIndex] || detailModalProduct.images?.[0] || 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
    });
    setAddedItemNotice(`${detailModalProduct.title} (${modalQuantity} units)`);
    setDetailModalProduct(null);
    setTimeout(() => setAddedItemNotice(null), 3500);
  };

  // Active mega category object
  const currentMegaCat = megaCategories.find((c) => c.id === activeMegaCategory) || megaCategories[1];

  // Filtered items
  const filteredProducts = items.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchBrand = (item.brand?.name || '').toLowerCase().includes(q);
      const matchCat = (item.category?.name || '').toLowerCase().includes(q);
      return matchTitle || matchBrand || matchCat;
    }
    if (selectedApplianceFilter !== 'all') {
      const catName = (item.category?.name || '').toLowerCase();
      const title = (item.title || '').toLowerCase();
      if (selectedApplianceFilter === 'ac') return catName.includes('ac') || catName.includes('air') || title.includes('ac') || title.includes('conditioner');
      if (selectedApplianceFilter === 'fridge') return catName.includes('fridge') || catName.includes('refrigerat') || title.includes('fridge');
      if (selectedApplianceFilter === 'tv') return catName.includes('tv') || catName.includes('television') || title.includes('tv');
      if (selectedApplianceFilter === 'washer') return catName.includes('wash') || title.includes('washer') || title.includes('washing');
      if (selectedApplianceFilter === 'kitchen') return catName.includes('kitchen') || catName.includes('micro') || catName.includes('oven') || title.includes('oven') || title.includes('fryer');
      if (selectedApplianceFilter === 'ev') return catName.includes('ev') || catName.includes('scooter') || title.includes('scooter') || title.includes('bike');
      if (selectedApplianceFilter === 'power') return catName.includes('power') || catName.includes('ips') || catName.includes('switch') || catName.includes('breaker') || title.includes('switch') || title.includes('breaker');
    }
    return true;
  });

  // Calculate parsed specs for a product
  const getProductParsedSpecs = (item: any) => {
    if (!item?.shortDescription && !item?.description) return [];
    const text = (item.shortDescription || '') + '\n' + (item.description || '');
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const lines = cleanText.split('\n').filter((l) => l.trim().length > 0);
    const specs: Array<{ label: string; value: string }> = [];

    lines.forEach((line) => {
      if (line.includes('\t')) {
        const parts = line.split('\t').filter((p) => p.trim());
        if (parts.length >= 2) {
          specs.push({ label: parts[0].trim(), value: parts.slice(1).join(' ').trim() });
        }
      } else if (line.includes(':')) {
        const [k, ...v] = line.split(':');
        if (k && v.length) {
          specs.push({ label: k.trim(), value: v.join(':').trim() });
        }
      }
    });

    return specs.slice(0, 15);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 1. TOP ANNOUNCEMENT & HELPLINE BAR */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Drooto Helpline Number */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold px-3 py-1 rounded-full text-xs shadow-sm cursor-pointer transition">
              <Phone className="w-3.5 h-3.5" />
              <span>09606 111 777</span>
            </div>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              Drooto 24/7 Helpline & Certified Technical Support
            </span>
          </div>

          {/* Delivery & Warranty Badges */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <Truck className="w-3.5 h-3.5" />
              Free Nationwide Express Delivery & Installation
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Genuine Official Brand Warranty
            </span>
            <span className="flex items-center gap-1 text-blue-400 hidden md:flex">
              <Percent className="w-3.5 h-3.5" />
              0% Interest EMI Facility
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & BRAND SEARCH BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Store Brand / Logo */}
            <Link href={`/?tenant=${tenantSlug}`} className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    {tenant?.name || 'SmartVolt'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                    Electronics
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Authorised Multi-Brand Home Appliance Engine
                </p>
              </div>
            </Link>

            {/* Smart Search Bar with Category Dropdown */}
            <div className="flex-1 max-w-2xl hidden md:flex items-center">
              <div className="w-full relative flex items-center rounded-xl border-2 border-orange-500/80 bg-white overflow-hidden shadow-sm focus-within:border-orange-600 focus-within:ring-2 focus-within:ring-orange-500/20 transition">
                <div className="hidden lg:flex items-center px-3 py-2 bg-slate-100 border-r border-slate-200 text-xs font-semibold text-slate-700">
                  <span>All Items</span>
                  <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search for AC, Refrigerator, TV, Washing Machine or model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center gap-1.5 transition flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Quick Actions (Showrooms, Orders, Cart) */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <a
                href="#showrooms"
                className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 px-3 py-2 rounded-xl hover:bg-orange-50 transition"
              >
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Showrooms</span>
              </a>

              <Link
                href={`/track?tenant=${tenantSlug}`}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 px-3 py-2 rounded-xl hover:bg-orange-50 transition"
              >
                <Truck className="w-4 h-4 text-orange-600" />
                <span>Track Order</span>
              </Link>

              {/* Cart Button */}
              <Link
                href={`/checkout?tenant=${tenantSlug}`}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-slate-900/10 transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-orange-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                  Checkout
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Search input */}
          <div className="mt-3 md:hidden">
            <div className="relative flex items-center rounded-xl border border-slate-300 bg-white overflow-hidden">
              <input
                type="text"
                placeholder="Search AC, Refrigerator, TV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button type="button" className="px-3.5 py-2 bg-orange-600 text-white text-xs font-bold">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Brand Marquee Strip */}
        <div className="bg-slate-100 border-t border-slate-200 py-1.5 px-4 overflow-x-auto text-[11px] font-semibold text-slate-600 flex items-center gap-6 justify-center">
          <span className="text-orange-700 font-extrabold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Authorised Multi-Brand Partners:
          </span>
          <span className="hover:text-orange-600 cursor-pointer">Hisense</span>
          <span>•</span>
          <span className="hover:text-orange-600 cursor-pointer">Gree Inverter</span>
          <span>•</span>
          <span className="hover:text-orange-600 cursor-pointer">Haier</span>
          <span>•</span>
          <span className="hover:text-orange-600 cursor-pointer">Panasonic</span>
          <span>•</span>
          <span className="hover:text-orange-600 cursor-pointer">General Japan</span>
          <span>•</span>
          <span className="hover:text-orange-600 cursor-pointer">Whirlpool 6th Sense</span>
          <span>•</span>
          <span className="hover:text-orange-600 cursor-pointer">Toshiba</span>
          <span>•</span>
          <span className="hover:text-orange-600 cursor-pointer">Philips</span>
          <span>•</span>
          <span className="hover:text-orange-600 cursor-pointer">Schneider Electric</span>
        </div>
      </header>

      {/* Floating Notice when adding item */}
      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-orange-500/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-white">Added to Cart!</div>
            <div className="text-slate-300">{addedItemNotice}</div>
          </div>
          <Link
            href={`/checkout?tenant=${tenantSlug}`}
            className="text-xs bg-orange-600 hover:bg-orange-500 font-bold px-3 py-1.5 rounded-xl ml-2 text-white transition"
          >
            Checkout Now
          </Link>
        </div>
      )}

      {/* 3. HERO & MEGA MENU SECTION */}
      <section className="bg-slate-900 border-b border-slate-800 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: All Categories Vertical Mega Menu */}
            <div className="lg:col-span-3 relative z-30">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-800">
                {/* Mega Menu Header */}
                <div
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  className="bg-orange-600 hover:bg-orange-700 px-4 py-3.5 flex items-center justify-between cursor-pointer transition select-none"
                >
                  <div className="flex items-center gap-2.5 font-extrabold text-sm sm:text-base tracking-wide">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>All Categories</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                  />
                </div>

                {/* Vertical Category Items */}
                {isMegaMenuOpen && (
                  <div className="py-1 divide-y divide-slate-700/50 bg-slate-800/95 backdrop-blur-md">
                    {megaCategories.map((cat) => {
                      const IconComponent = cat.icon;
                      const isActive = activeMegaCategory === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onMouseEnter={() => setActiveMegaCategory(cat.id)}
                          onClick={() => {
                            setActiveMegaCategory(cat.id);
                            setSelectedApplianceFilter(cat.id);
                          }}
                          className={`px-4 py-3 flex items-center justify-between cursor-pointer transition group ${
                            isActive
                              ? 'bg-orange-600 text-white font-bold'
                              : 'text-slate-200 hover:bg-slate-700/80 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent
                              className={`w-4 h-4 ${isActive ? 'text-white' : 'text-orange-400 group-hover:text-white'}`}
                            />
                            <div>
                              <div className="text-xs sm:text-sm font-semibold">{cat.name}</div>
                              <div
                                className={`text-[10px] ${isActive ? 'text-orange-100' : 'text-slate-400'}`}
                              >
                                {cat.sub}
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform ${
                              isActive ? 'text-white' : ''
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* CENTER COLUMN: Main Hero Slider Carousel */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl relative h-80 sm:h-96 border border-slate-700 bg-slate-950 flex flex-col justify-end p-6 sm:p-8">
                {/* Background Image with Dark Vignette */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform hover:scale-105"
                  style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                <div className="absolute inset-0 bg-slate-950/30" />

                {/* Slide Text Content */}
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{slides[currentSlide].badge}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug text-white">
                    {slides[currentSlide].title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                    {slides[currentSlide].subtitle}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href="#products"
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-600/30 flex items-center gap-2 transition active:scale-95"
                    >
                      <span>{slides[currentSlide].primaryBtnText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <div className="text-[11px] text-amber-300 font-semibold bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                      ⚡ {slides[currentSlide].emiText}
                    </div>
                  </div>
                </div>

                {/* Carousel Dots */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === idx ? 'w-6 bg-orange-500' : 'w-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Flyout Sub-filter drawer when hover/active */}
              {isMegaMenuOpen && currentMegaCat && (
                <div className="hidden xl:block absolute -top-0 left-full ml-4 z-40 w-80 bg-slate-800/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl p-5 text-white">
                  <div className="text-xs uppercase font-extrabold tracking-wider text-orange-400 mb-2 flex items-center gap-1.5 pb-2 border-b border-slate-700">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{currentMegaCat.name} Quick Filter</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    {Object.entries(currentMegaCat.filters).map(([key, options]) => (
                      <div key={key}>
                        <div className="font-bold text-slate-300 capitalize mb-1.5">
                          {key === 'capacity' ? 'Capacity / Size' : key === 'brands' ? 'Featured Brands' : key === 'features' ? 'Key Technology' : key}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {options.map((opt: string) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setSearchQuery(opt.split(' ')[0]);
                              }}
                              className="px-2 py-1 rounded-md bg-slate-700 hover:bg-orange-600 text-slate-200 text-[11px] font-medium transition"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: 3 Promotional Highlight Cards */}
            <div className="lg:col-span-3 space-y-3">
              {/* Promo Card 1: Whirlpool */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700 shadow-md flex items-center justify-between gap-3 group hover:border-orange-500/50 transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 uppercase">
                    Cashback BDT 5,000
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition">
                    Whirlpool 6th Sense Inverter Frost-Free
                  </h4>
                  <p className="text-[11px] text-slate-400">10 Years Official Compressor Warranty</p>
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=200&q=80"
                    alt="Whirlpool Refrigerator"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
              </div>

              {/* Promo Card 2: Toshiba Washer */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700 shadow-md flex items-center justify-between gap-3 group hover:border-orange-500/50 transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                    Free Installation
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition">
                    Toshiba Direct Drive Inverter Washer
                  </h4>
                  <p className="text-[11px] text-slate-400">BLDC Motor & 90°C Steam Anti-Allergy</p>
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=200&q=80"
                    alt="Toshiba Washer"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
              </div>

              {/* Promo Card 3: Philips Air Fryer */}
              <div className="rounded-2xl p-4 bg-gradient-to-br from-slate-800 to-slate-850 border border-slate-700 shadow-md flex items-center justify-between gap-3 group hover:border-orange-500/50 transition">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase">
                    Flash Deal 35% OFF
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition">
                    Philips Rapid Air Fryer & Kitchen Combo
                  </h4>
                  <p className="text-[11px] text-slate-400">90% Less Oil Healthy Frying</p>
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1589793463308-658ed42e52c2?auto=format&fit=crop&w=200&q=80"
                    alt="Philips Air Fryer"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. APPLIANCE CATEGORY BADGES STRIP */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center sm:text-left mb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                Major Appliance Hub
              </span>
              <h3 className="text-xl font-extrabold text-slate-900">
                Popular Appliance Categories
              </h3>
            </div>
            <div className="text-xs font-semibold text-slate-500 hidden sm:block">
              Click any category icon to filter items
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
            {[
              { id: 'ac', name: 'Air Conditioners', sub: 'Inverter AC', icon: Wind },
              { id: 'fridge', name: 'Refrigerators', sub: 'Frost Free', icon: Refrigerator },
              { id: 'tv', name: 'Smart TVs', sub: '4K Google TV', icon: Tv },
              { id: 'washer', name: 'Washing Machines', sub: 'Direct Drive', icon: WashingMachine },
              { id: 'kitchen', name: 'Microwaves & Ovens', sub: 'Air Fryer', icon: Flame },
              { id: 'ev', name: 'Electric Scooters', sub: 'EV Scooter', icon: Bike },
              { id: 'power', name: 'IPS & Power', sub: 'Solar Hybrid', icon: Zap },
            ].map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedApplianceFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedApplianceFilter(isSelected ? 'all' : cat.id)}
                  className={`p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-2 ${
                    isSelected
                      ? 'border-orange-600 bg-orange-50/80 shadow-md ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-orange-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-slate-900">{cat.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{cat.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. FEATURED APPLIANCE SHOWCASE & PRODUCT GRID */}
      <section id="products" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                Official Warranty Store
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                100% Genuine Authorized
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Smart Inverter Electronics & Home Appliances
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredProducts.length} verified products
            </span>
            {selectedApplianceFilter !== 'all' && (
              <button
                onClick={() => setSelectedApplianceFilter('all')}
                className="text-xs font-bold text-orange-600 hover:underline ml-2"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <Wind className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Please try searching with a different model or reset active filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedApplianceFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => {
              const discount =
                item.comparePrice && item.comparePrice > item.price
                  ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
                  : null;

              // Compute monthly EMI approx (12 months)
              const emiPerMonth = Math.round(item.price / 12);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-orange-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* Top Image & Badges Container */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={
                        item.images?.[0] ||
                        'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Discount & Energy Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {discount && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-600 text-white shadow-md">
                          {discount}% OFF
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> 5-Star Saver
                      </span>
                    </div>

                    {/* Brand Pill */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
                        {item.brand?.name || 'Authorized'}
                      </span>
                    </div>

                    {/* Quick Specs Overlay on Hover */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex items-center justify-between text-white text-xs opacity-90 group-hover:opacity-100 transition">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                        <Award className="w-3.5 h-3.5" />
                        <span>10-12 Years Compressor Warranty</span>
                      </div>
                      <button
                        onClick={() => setDetailModalProduct(item)}
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-orange-600 text-white transition backdrop-blur-sm"
                        title="View Detailed Spec Sheet"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Category & Rating */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                        <span className="font-semibold text-orange-600">
                          {item.category?.name || 'Home Appliance'}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>4.9</span>
                        </div>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => setDetailModalProduct(item)}
                        className="text-base font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition cursor-pointer"
                        title={item.title}
                      >
                        {item.title}
                      </h3>

                      {/* Key Tech Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          Dual Inverter
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          R32 Eco Gas
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          19dB Silent
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          Golden Fin
                        </span>
                      </div>
                    </div>

                    {/* Price, EMI & Action Buttons */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-2">
                        <div>
                          <div className="text-xl font-black text-slate-950">
                            BDT {item.price.toLocaleString()}
                          </div>
                          {item.comparePrice && item.comparePrice > item.price && (
                            <div className="text-xs text-slate-400 line-through">
                              BDT {item.comparePrice.toLocaleString()}
                            </div>
                          )}
                        </div>

                        {/* EMI Badge */}
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-500 block">0% EMI</span>
                          <span className="text-xs font-extrabold text-emerald-600">
                            BDT {emiPerMonth.toLocaleString()}/mo
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Add to Cart & View Specs */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button
                          onClick={() => setDetailModalProduct(item)}
                          className="w-full py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-800 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Spec Sheet</span>
                        </button>

                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md shadow-orange-600/20 flex items-center justify-center gap-1 transition active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Order Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. VISUAL STORYTELLING FEATURE BLOCKS */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 bg-orange-950/60 border border-orange-800/80 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Next-Gen Engineering Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Internal Engineering Behind Smart Inverter Appliances
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
              Advanced compressor technology, patented Golden Fin anti-corrosive coating, and energy-efficient components built for extreme climate durability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: 3D Airflow */}
            <div className="rounded-3xl p-6 bg-slate-800/80 border border-slate-700/80 hover:border-orange-500/60 shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                3D 4-Way Airflow (18m Air Throw)
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Horizontal and vertical motorized swing louvers distribute cool airflow evenly to every corner. The 18-meter long air delivery is ideal for spacious halls and living rooms.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> 4-Way Multi-Directional Air Delivery
              </div>
            </div>

            {/* Feature 2: 19dB Quiet Sleep */}
            <div className="rounded-3xl p-6 bg-slate-800/80 border border-slate-700/80 hover:border-orange-500/60 shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                19dB Ultra-Quiet Sleep Mode
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Smooth aerodynamic fan blades and dual-rotation rotary compressors suppress vibration to a whisper-silent 19dB acoustic level for peaceful sleep.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Whisper-Quiet Operation & Dimmer Display
              </div>
            </div>

            {/* Feature 3: Dual Inverter T3 Compressor */}
            <div className="rounded-3xl p-6 bg-slate-800/80 border border-slate-700/80 hover:border-orange-500/60 shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                Dual Inverter T3 Tropical Compressor
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Maintains continuous heavy-duty cooling even in scorching 58°C extreme heatwave conditions while conserving up to 70% electricity.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs font-semibold text-orange-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> 12 Years Compressor Official Replacement Warranty
              </div>
            </div>

            {/* Feature 4: Golden Fin Coating */}
            <div className="rounded-3xl p-6 bg-slate-800/80 border border-slate-700/80 hover:border-orange-500/60 shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                Golden Fin Hydrophilic Coating
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                100% pure copper condenser tubes with golden hydrophilic anti-corrosive coating protect against salty coastal humidity, rain, and acidic air.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> 100% Anti-Corrosive Copper Condenser
              </div>
            </div>

            {/* Feature 5: Eco Refrigerant R32 */}
            <div className="rounded-3xl p-6 bg-slate-800/80 border border-slate-700/80 hover:border-orange-500/60 shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                Eco-Friendly R32 Refrigerant Gas
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Zero Ozone Depletion Potential (Zero ODP) and 68% lower global warming impact for superior cooling capacity and maximum energy conservation.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Zero ODP Green Refrigerant Technology
              </div>
            </div>

            {/* Feature 6: 56°C Self-Cleaning */}
            <div className="rounded-3xl p-6 bg-slate-800/80 border border-slate-700/80 hover:border-orange-500/60 shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                56°C High-Temperature Self-Clean
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                One-touch automated sterilization heats the evaporator coil to 56°C to eliminate 99.9% of bacteria and viruses, ensuring fresh, sanitized airflow.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> 99.9% Sterilization Health Protection
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMPREHENSIVE ENGINEERING TECHNICAL SPECIFICATION SHEET (Table View) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                Official Engineering Data
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Technical Specification Chart & Engineering Standards
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tested and verified under ISO & international laboratory standards.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-bold border border-slate-200">
                Model: Hisense AS18TW4RGSKB02DU Inverter
              </span>
            </div>
          </div>

          {/* Technical Spec Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-900 border-y border-slate-200 text-xs uppercase font-extrabold">
                  <th className="py-3.5 px-4">Parameter / Feature</th>
                  <th className="py-3.5 px-4">Technical Rating / Value</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Engineering Advantage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Air Conditioner Type</td>
                  <td className="py-3 px-4 font-medium text-slate-700">Smart Inverter (Cooling Only)</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">Saves up to 70% electrical power consumption</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Cooling Capacity (BTU/h)</td>
                  <td className="py-3 px-4 font-bold text-orange-600">18,000 BTU/h (1.5 Ton) / 5275 Watts</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">Optimal for 120 - 180 sq. ft room spaces</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Voltage & Frequency</td>
                  <td className="py-3 px-4 font-medium text-slate-700">220-240V, 50 Hz (1700W / 7.6A)</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">Integrated low-voltage operation stabilizer</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Energy Efficiency Ratio (EER)</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">3.10 W/W (Star Rating Certified)</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">High thermodynamic efficiency standard</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Refrigerant Gas Type</td>
                  <td className="py-3 px-4 font-medium text-slate-700">R32 Eco-Friendly (0.660 kg)</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">Zero ODP green refrigerant with faster heat transfer</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Evaporator & Condenser Fin</td>
                  <td className="py-3 px-4 font-medium text-slate-700">100% Copper Tube + Golden Hydrophilic Fin</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">Lifetime anti-rust protection against moisture & salts</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Noise Level (Indoor / Outdoor)</td>
                  <td className="py-3 px-4 font-medium text-slate-700">39 dB (Mid Fan) / 54 dB (Outdoor)</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">Whisper-quiet acoustic dampening</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Indoor Unit Dimensions & Weight</td>
                  <td className="py-3 px-4 font-medium text-slate-700">930 × 300 × 220 mm (11.0 kg Net)</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">Ultra-compact modern architectural wall-mount profile</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Outdoor Unit Dimensions & Weight</td>
                  <td className="py-3 px-4 font-medium text-slate-700">715 × 240 × 540 mm (25.0 kg Net)</td>
                  <td className="py-3 px-4 text-slate-500 text-xs hidden md:table-cell">Heavy-duty powder-coated weatherproof metallic chassis</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-orange-50/40">
                  <td className="py-3 px-4 font-extrabold text-slate-950">Official Warranty Package</td>
                  <td className="py-3 px-4 font-extrabold text-orange-700">
                    Compressor: 12 Years • PCB Board: 5 Years • Spare Parts: 5 Years • Service: 2 Years Free (2x Free Hydro Wash)
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs font-semibold hidden md:table-cell">
                    Comprehensive nationwide doorstep technician coverage
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. NATIONWIDE SHOWROOM & SERVICE CENTER LOCATOR */}
      <section id="showrooms" className="bg-slate-100 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                Direct Brand Outlets
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Authorized Showrooms & Official Service Centers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Experience products in person with certified engineers or book official warranty services.
              </p>
            </div>

            {/* City Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['Dhaka', 'Chittagong', 'Sylhet', 'Khulna'].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedShowroomCity(city)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap shadow-sm ${
                    selectedShowroomCity === city
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Showroom Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showrooms
              .filter((s) => s.city === selectedShowroomCity)
              .map((showroom, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
                      {showroom.city}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      {showroom.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{showroom.address}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-orange-600" />
                        <span>Hotline:</span>
                      </span>
                      <span className="font-bold text-slate-900">{showroom.phone}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hours:</span>
                      </span>
                      <span className="font-medium text-slate-700">{showroom.hours}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:09606111777`}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Hotline / Get Directions</span>
                  </a>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 9. TECHNICAL SPECIFICATION & PRODUCT DETAIL MODAL */}
      {detailModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded bg-orange-600 text-white font-extrabold text-xs">
                  {detailModalProduct.brand?.name || 'Electronics'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                  {detailModalProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images */}
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                    <img
                      src={
                        detailModalProduct.images?.[modalImageIndex] ||
                        detailModalProduct.images?.[0] ||
                        'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={detailModalProduct.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnails if multiple images */}
                  {detailModalProduct.images && detailModalProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {detailModalProduct.images.map((img: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setModalImageIndex(i)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                            modalImageIndex === i ? 'border-orange-600 ring-2 ring-orange-500/20' : 'border-slate-200'
                          }`}
                        >
                          <img src={img} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Trust Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Free Delivery & Installation</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-orange-600" />
                      <span>12 Years Compressor Warranty</span>
                    </div>
                  </div>
                </div>

                {/* Details & Pricing */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                      {detailModalProduct.category?.name || 'Air Conditioner'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 leading-snug">
                      {detailModalProduct.title}
                    </h2>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-slate-950">
                        BDT {detailModalProduct.price.toLocaleString()}
                      </div>
                      {detailModalProduct.comparePrice && (
                        <div className="text-xs text-slate-400 line-through">
                          BDT {detailModalProduct.comparePrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-orange-800 uppercase block">
                        12 Months 0% EMI
                      </span>
                      <span className="text-sm font-extrabold text-orange-700">
                        BDT {Math.round(detailModalProduct.price / 12).toLocaleString()}/mo
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Order action */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-700">Quantity:</span>
                      <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                          className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 py-1.5 text-xs font-black text-slate-900">
                          {modalQuantity}
                        </span>
                        <button
                          onClick={() => setModalQuantity(modalQuantity + 1)}
                          className="px-3 py-1.5 hover:bg-slate-100 text-slate-700 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleModalAddToCart}
                      className="w-full py-3.5 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart & Proceed to Checkout</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Parsed Technical Specifications Sheet in Modal */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-orange-600" />
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Comprehensive Technical Specifications Chart
                  </h4>
                </div>

                <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                  <div className="divide-y divide-slate-100">
                    {getProductParsedSpecs(detailModalProduct).map((spec, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-3 p-2.5 ${i % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}`}
                      >
                        <div className="font-bold text-slate-800">{spec.label}</div>
                        <div className="col-span-2 text-slate-700 font-medium">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. FOOTER WITH DROOTO HELPLINE */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="text-lg font-black text-white">{tenant?.name || 'SmartVolt'}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bangladesh&apos;s leading authorized retail platform for smart inverter air conditioners, refrigerators, and major home appliances.
              </p>
              <div className="text-xs text-orange-400 font-bold flex items-center gap-1.5 pt-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Helpline: 09606 111 777</span>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3">
                Appliance Categories
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-orange-400 cursor-pointer">Smart Inverter ACs</li>
                <li className="hover:text-orange-400 cursor-pointer">Frost-Free Refrigerators</li>
                <li className="hover:text-orange-400 cursor-pointer">4K Google Smart TVs</li>
                <li className="hover:text-orange-400 cursor-pointer">Direct Drive Washers</li>
                <li className="hover:text-orange-400 cursor-pointer">Electric Vehicles (EV)</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3">
                Warranty & Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="hover:text-orange-400 cursor-pointer">12 Years Official Compressor Warranty</li>
                <li className="hover:text-orange-400 cursor-pointer">Free Doorstep Installation Booking</li>
                <li className="hover:text-orange-400 cursor-pointer">0% Bank EMI Facility</li>
                <li className="hover:text-orange-400 cursor-pointer">Official Service Points & Spare Parts</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3">
                Corporate Office & Hours
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nawabpur Road Electrical Market, Dhaka-1100, Bangladesh.
              </p>
              <div className="mt-3 text-xs text-slate-400 space-y-1">
                <div>Email: support@smartvoltbd.com</div>
                <div>Hours: 10:00 AM - 09:00 PM (Daily)</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>© 2026 {tenant?.name || 'SmartVolt'}. All rights reserved. Powered by SaaS Multi-Tenant Engine.</div>
            <div className="flex items-center gap-4">
              <span>Security Guaranteed</span>
              <span>100% Genuine Official Seal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
