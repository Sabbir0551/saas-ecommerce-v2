'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  Phone,
  Truck,
  ShieldCheck,
  Zap,
  ShoppingCart,
  Search,
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
  Check,
  Bike,
  Tv,
  Refrigerator,
  WashingMachine,
  Lightbulb,
  Laptop,
  Bell,
  BatteryCharging,
  Sliders,
  Scissors,
  Fan,
  Award,
  ExternalLink,
  LayoutDashboard,
  Filter,
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
  items = [],
  categories = [],
}: ElectronicsStorefrontProps) {
  const { addToCart, totalItems } = useCart();
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<number>(12);
  const [selectedShowroomCity, setSelectedShowroomCity] = useState<string>('Dhaka');
  const [activeEngineeringFeature, setActiveEngineeringFeature] = useState<number>(0);
  const [activeSpecTab, setActiveSpecTab] = useState<'specs' | 'warranty'>('specs');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // Selected product modal state
  const [detailModalProduct, setDetailModalProduct] = useState<any | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [selectedDirectionShowroom, setSelectedDirectionShowroom] = useState<any | null>(null);

  // 13 Hub Categories with product counts & descriptions matching PDF Page 1
  const applianceHubCategories = [
    {
      id: 'ev',
      name: 'Electric Vehicles',
      sub: 'EV scooter and bikes',
      count: '1 product',
      matchKeys: ['electric', 'ev', 'scooter', 'bike'],
      icon: Bike,
    },
    {
      id: 'ac',
      name: 'Air Conditioners',
      sub: 'Inverter AC',
      count: '2 products',
      matchKeys: ['air', 'ac', 'inverter ac'],
      icon: Wind,
    },
    {
      id: 'fridge',
      name: 'Refrigerators',
      sub: 'Frost-free',
      count: '1 product',
      matchKeys: ['refrigerator', 'fridge', 'freezer'],
      icon: Refrigerator,
    },
    {
      id: 'tv',
      name: 'TVs & Audio',
      sub: 'Google TV, speakers, headsets',
      count: '6 products',
      matchKeys: ['tv', 'audio', 'sound', 'speaker'],
      icon: Tv,
    },
    {
      id: 'washer',
      name: 'Washers & Laundry',
      sub: 'Direct drive, dryers, irons',
      count: '3 products',
      matchKeys: ['washer', 'washing', 'laundry'],
      icon: WashingMachine,
    },
    {
      id: 'kitchen',
      name: 'Kitchen Appliances',
      sub: 'Blenders, kettles, stoves',
      count: '10 products',
      matchKeys: ['kitchen', 'oven', 'air fryer', 'cooker', 'blender'],
      icon: Flame,
    },
    {
      id: 'fans',
      name: 'Fans & Air Care',
      sub: 'Fans, air purifier',
      count: '4 products',
      matchKeys: ['fan', 'purifier', 'air care'],
      icon: Fan,
    },
    {
      id: 'personal',
      name: 'Personal Care',
      sub: 'Razors, hair dryers',
      count: '4 products',
      matchKeys: ['personal', 'razor', 'trimmer', 'dryer'],
      icon: Scissors,
    },
    {
      id: 'lighting',
      name: 'Lighting',
      sub: 'Bulbs and lamps',
      count: '3 products',
      matchKeys: ['lighting', 'bulb', 'led', 'lamp'],
      icon: Lightbulb,
    },
    {
      id: 'computers',
      name: 'Computers & Office',
      sub: 'Laptops, printers',
      count: '8 products',
      matchKeys: ['laptop', 'computer', 'printer'],
      icon: Laptop,
    },
    {
      id: 'smarthome',
      name: 'Smart Home & Clocks',
      sub: 'Doorbell camera, clocks',
      count: '3 products',
      matchKeys: ['smart home', 'camera', 'automation', 'clock'],
      icon: Bell,
    },
    {
      id: 'power',
      name: 'IPS & Power',
      sub: 'Solar hybrid, backup',
      count: '1 product',
      matchKeys: ['ips', 'power', 'solar', 'battery'],
      icon: BatteryCharging,
    },
    {
      id: 'tools',
      name: 'Electricals & Tools',
      sub: 'Switches, breakers, drills',
      count: '3 products',
      matchKeys: ['switch', 'breaker', 'tools', 'panel', 'mcb'],
      icon: Sliders,
    },
  ];

  // Engineering internal features matching PDF Page 3
  const engineeringFeatures = [
    {
      id: 0,
      title: '3D 4-Way Airflow (18m Air Throw)',
      metric: '18 m',
      label: 'Air throw distance',
      statValue: '18m',
      desc: 'Horizontal and vertical motorized swing louvers distribute cool airflow evenly to every corner. The 18-meter air throw is ideal for spacious halls and living rooms.',
      pill: '4-way multi-directional air delivery',
    },
    {
      id: 1,
      title: '19dB Ultra-Quiet Sleep Mode',
      metric: '19 dB',
      label: 'Whisper-quiet acoustic level',
      statValue: '19dB',
      desc: 'Smooth aerodynamic fan blades and dual-rotation rotary compressor suppress vibration to a whisper-silent 19dB acoustic level for peaceful, undisturbed sleep.',
      pill: 'Whisper-quiet acoustic dampening',
    },
    {
      id: 2,
      title: 'Dual Inverter T3 Tropical Compressor',
      metric: '58°C',
      label: 'Extreme ambient heat endurance',
      statValue: '58°C',
      desc: 'Maintains continuous heavy-duty cooling even in scorching 58°C extreme summer heatwave conditions while conserving up to 70% electrical energy consumption.',
      pill: '12 Years Compressor Official Replacement Warranty',
    },
    {
      id: 3,
      title: 'Golden Fin Hydrophilic Coating',
      metric: '100% Cu',
      label: 'Pure copper anti-corrosion rating',
      statValue: '100% Cu',
      desc: '100% pure copper condenser tubes with golden hydrophilic anti-corrosive coating protect against salty coastal humidity, rain, and acidic air oxidation.',
      pill: 'Lifetime anti-corrosion protection',
    },
    {
      id: 4,
      title: 'Eco-Friendly R32 Refrigerant Gas',
      metric: 'Zero ODP',
      label: 'Ozone depletion potential',
      statValue: 'Zero ODP',
      desc: 'Zero Ozone Depletion Potential and 68% lower global warming impact for superior thermodynamic cooling capacity and maximum eco energy conservation.',
      pill: 'Zero ODP Green Refrigerant Technology',
    },
    {
      id: 5,
      title: '56°C High-Temperature Self-Clean',
      metric: '99.9%',
      label: 'Sterilization efficacy rate',
      statValue: '99.9%',
      desc: 'One-touch automated sterilization heats the internal evaporator coil to 56°C to eliminate 99.9% of airborne bacteria and viruses, ensuring pure, sanitized airflow.',
      pill: 'Automated thermal coil sterilization',
    },
  ];

  // 7 Showrooms nationwide matching Admin Dashboard & PDF Page 4
  const showroomsList = [
    {
      id: 'shw_1',
      city: 'Dhaka',
      name: 'Dhanmondi Flagship Experience Center',
      address: 'Plot 42, Road 27 (Old), Dhanmondi R/A, Dhaka-1209',
      hotline: '09606 111 777 (Ext 101)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Engr. Tanvir Ahmed',
      badge: 'Open daily',
    },
    {
      id: 'shw_2',
      city: 'Dhaka',
      name: 'Uttara Smart Appliance Mega Store',
      address: 'Sector 3, Jasimuddin Avenue (Near North Tower), Uttara, Dhaka',
      hotline: '09606 111 777 (Ext 102)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Mahfuzur Rahman',
      badge: 'Open daily',
    },
    {
      id: 'shw_3',
      city: 'Dhaka',
      name: 'Mirpur 10 Outlet & Service Hub',
      address: 'Main Road Roundabout, Mirpur 10, Dhaka-1216',
      hotline: '09606 111 777 (Ext 103)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Kamrul Hasan',
      badge: 'Open daily',
    },
    {
      id: 'shw_4',
      city: 'Chittagong',
      name: 'Agrabad Commercial Showroom',
      address: 'Agrabad Commercial Area, CDA Avenue, Chattogram',
      hotline: '09606 111 777 (Ext 201)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Nasir Uddin',
      badge: 'Open daily',
    },
    {
      id: 'shw_5',
      city: 'Chittagong',
      name: 'GEC Circle Electronics Hub',
      address: 'Sanmar Ocean City Ground Floor, GEC, Chattogram',
      hotline: '09606 111 777 (Ext 202)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Shahed Chowdhury',
      badge: 'Open daily',
    },
    {
      id: 'shw_6',
      city: 'Sylhet',
      name: 'Zindabazar Premier Outlet',
      address: 'East Zindabazar, Baruthkhana Point, Sylhet',
      hotline: '09606 111 777 (Ext 301)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Foyez Ahmed',
      badge: 'Open daily',
    },
    {
      id: 'shw_7',
      city: 'Khulna',
      name: 'KDA Avenue Experience Zone',
      address: 'Shibbari More, KDA Avenue, Khulna',
      hotline: '09606 111 777 (Ext 401)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Rezaul Karim',
      badge: 'Open daily',
    },
  ];

  // Dynamic products mapped with real database/partition inventory
  const defaultProducts = [
    {
      id: 'item_smartvolt_1792654065930',
      brand: 'Hisense',
      discount: '1% OFF',
      warranty: '10-12 Years Compressor Warranty',
      warrantyType: 'compressor',
      category: 'Air Conditioners (AC)',
      catId: 'ac',
      rating: '4.9 / 5',
      title: 'Hisense Smart Compact AC AS18TW4RGSKB02DU',
      tags: ['1.5 Ton', 'Dual Inverter', 'R32 Eco Gas', '19dB Silent', 'Golden Fin'],
      price: 73900,
      comparePrice: 75000,
      stockQuantity: 20,
      sku: 'SKU-XRR3RB',
      icon: Wind,
    },
    {
      id: 'item_volt_1',
      brand: 'Authorised',
      discount: '16% OFF',
      warranty: 'Official brand warranty',
      warrantyType: 'brand',
      category: 'Home Appliance',
      catId: 'tools',
      rating: '4.9 / 5',
      title: 'Smart Voltage Touch Switch Panel (4 Gang Glass)',
      tags: ['4 Gang', 'Touch panel', 'Glass finish'],
      price: 3200,
      comparePrice: 3800,
      stockQuantity: 50,
      sku: 'SVT-SW-4G-BLK',
      icon: Sliders,
    },
    {
      id: 'item_volt_2',
      brand: 'Authorised',
      discount: '16% OFF',
      warranty: 'Official brand warranty',
      warrantyType: 'brand',
      category: 'Home Appliance',
      catId: 'tools',
      rating: '4.9 / 5',
      title: 'Schneider Acti9 32A Double Pole MCB Breaker',
      tags: ['32A', 'Double pole', 'Acti9'],
      price: 1850,
      comparePrice: 2200,
      stockQuantity: 80,
      sku: 'SCH-MCB-32A-DP',
      icon: BatteryCharging,
    },
    {
      id: 'item_smartvolt_gree_2ton',
      brand: 'Gree',
      discount: '5% OFF',
      warranty: '10-12 Years Compressor Warranty',
      warrantyType: 'compressor',
      category: 'Air Conditioners (AC)',
      catId: 'ac',
      rating: '4.9 / 5',
      title: 'Gree Lomo-S 2.0 Ton Dual Inverter AC (GP-24LM)',
      tags: ['2.0 Ton', 'Dual Inverter', 'R32 Eco Gas'],
      price: 84500,
      comparePrice: 89000,
      stockQuantity: 15,
      sku: 'AL-GREE-2TON',
      icon: Wind,
    },
    {
      id: 'item_smartvolt_whirlpool_fridge',
      brand: 'Whirlpool',
      discount: '7% OFF',
      warranty: '10-12 Years Compressor Warranty',
      warrantyType: 'compressor',
      category: 'Refrigerators & Freezers',
      catId: 'fridge',
      rating: '4.9 / 5',
      title: 'Whirlpool 6th Sense Inverter Frost-Free Refrigerator 350L',
      tags: ['350L', 'Inverter', 'Frost-Free'],
      price: 64500,
      comparePrice: 69500,
      stockQuantity: 18,
      sku: 'AL-WHIR-IDGE',
      icon: Refrigerator,
    },
    {
      id: 'item_smartvolt_hisense_tv',
      brand: 'Hisense',
      discount: '5% OFF',
      warranty: 'Official brand warranty',
      warrantyType: 'brand',
      category: 'Smart TVs & Audio',
      catId: 'tv',
      rating: '4.9 / 5',
      title: 'Hisense 55-Inch Frameless 4K UHD Google Smart TV',
      tags: ['55-inch', '4K UHD', 'Google TV', 'Frameless'],
      price: 54900,
      comparePrice: 58000,
      stockQuantity: 22,
      sku: 'AL-HISE-SETV',
      icon: Tv,
    },
    {
      id: 'item_smartvolt_toshiba_washer',
      brand: 'Toshiba',
      discount: '6% OFF',
      warranty: '10-12 Years Compressor Warranty',
      warrantyType: 'compressor',
      category: 'Washing Machines',
      catId: 'washer',
      rating: '4.9 / 5',
      title: 'Toshiba Real Inverter Direct Drive Washer 8.5kg',
      tags: ['8.5kg', 'Direct Drive', 'Real Inverter'],
      price: 48900,
      comparePrice: 52000,
      stockQuantity: 12,
      sku: 'AL-TOSH-SHER',
      icon: WashingMachine,
    },
    {
      id: 'item_smartvolt_yadea_ev',
      brand: 'Yadea EV',
      discount: '8% OFF',
      warranty: 'Official brand warranty',
      warrantyType: 'brand',
      category: 'Electric Vehicles (EV)',
      catId: 'ev',
      rating: '4.9 / 5',
      title: 'Yadea Graphene Battery Smart Electric Scooter 1200W',
      tags: ['1200W', 'Graphene battery', 'Smart'],
      price: 115000,
      comparePrice: 125000,
      stockQuantity: 8,
      sku: 'AL-YADE-EAEV',
      icon: Bike,
    },
  ];

  // Merge real items from backend with UI display metadata
  const liveProducts = useMemo(() => {
    return defaultProducts.map((defProd) => {
      const realItem = items.find(
        (i) => i.id === defProd.id || i.slug === defProd.id || i.title === defProd.title
      );
      if (realItem) {
        return {
          ...defProd,
          id: realItem.id,
          title: realItem.title,
          price: Number(realItem.price || defProd.price),
          comparePrice: Number(realItem.comparePrice || defProd.comparePrice),
          stockQuantity: Number(realItem.stockQuantity ?? defProd.stockQuantity),
          sku: realItem.sku || defProd.sku,
          brand: realItem.brand?.name || defProd.brand,
          category: realItem.category?.name || defProd.category,
          shortDescription: realItem.shortDescription,
          description: realItem.description,
          images: realItem.images || [],
        };
      }
      return defProd;
    });
  }, [items]);

  // Featured Hisense Inverter AC for hero block
  const featuredHeroProduct = liveProducts[0];

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return liveProducts.filter((p) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchCat) return false;
      }

      // 2. Active Category filter
      if (activeCategoryFilter !== 'all') {
        const hubCat = applianceHubCategories.find((c) => c.id === activeCategoryFilter);
        if (hubCat) {
          const catLower = p.category.toLowerCase();
          const titleLower = p.title.toLowerCase();
          const match = hubCat.matchKeys.some(
            (k) => catLower.includes(k) || titleLower.includes(k)
          );
          if (!match && p.catId !== activeCategoryFilter) return false;
        }
      }

      return true;
    });
  }, [liveProducts, searchQuery, activeCategoryFilter]);

  // Handle adding product to cart
  const handleAddToCart = (product: any, qty = 1) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: qty,
      image:
        product.images?.[0] ||
        'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
    });
    setAddedItemNotice(`${product.title} (${qty}x)`);
    setTimeout(() => setAddedItemNotice(null), 3500);
  };

  // Handle category click to filter and smooth-scroll
  const handleSelectCategory = (catId: string) => {
    setActiveCategoryFilter(catId);
    setSearchQuery('');
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeEng = engineeringFeatures[activeEngineeringFeature] || engineeringFeatures[0];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* 1. TOP HELPLINE & PERKS BAR (Matching PDF Page 1) */}
      <div className="bg-[#0b0f19] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: 24/7 Helpline */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-wide">09606 111 777</span>
            <span className="text-slate-400">24/7 helpline and certified technical support</span>
          </div>

          {/* Right: Key Perks + Quick Admin Dashboard Link */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300">
            <span>Free nationwide express delivery and installation</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span>100% genuine official brand warranty</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span>0% interest EMI</span>

            {/* Direct Link to Admin Dashboard */}
            <Link
              href={`/admin/dashboard?tenant=${tenantSlug}`}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
              title="Open Merchant Inventory & Orders Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & BRAND NAVIGATION (Matching PDF Page 1) */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href={`/?tenant=${tenantSlug}`} className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-amber-400 shadow-sm">
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 block leading-tight">
                  SmartVolt
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Electrical & Automation
                </span>
              </div>
            </Link>

            {/* Rounded Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search AC, refrigerator, TV, MCB"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50/70 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Actions: Showrooms, Admin & Cart */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <a
                href="#showrooms"
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-black transition"
              >
                Showrooms
              </a>

              <Link
                href={`/admin/dashboard?tenant=${tenantSlug}`}
                className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-orange-600 transition"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>Inventory & Orders</span>
              </Link>

              <Link
                href={`/checkout?tenant=${tenantSlug}`}
                className="bg-black hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                <span>Cart</span>
                <span className="bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {totalItems}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile search input */}
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search AC, refrigerator, TV, MCB"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition"
              />
            </div>
          </div>
        </div>

        {/* Category Sub-navigation Pills Strip (Matching PDF Page 1) */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto flex items-center gap-6 text-xs font-semibold text-slate-600 justify-start lg:justify-between scrollbar-none">
            <button
              onClick={() => handleSelectCategory('all')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'all' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => handleSelectCategory('ev')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'ev' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              Electric Vehicles
            </button>
            <button
              onClick={() => handleSelectCategory('ac')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'ac' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              Air Conditioners
            </button>
            <button
              onClick={() => handleSelectCategory('fridge')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'fridge' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              Refrigerators
            </button>
            <button
              onClick={() => handleSelectCategory('tv')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'tv' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              TVs & Audio
            </button>
            <button
              onClick={() => handleSelectCategory('washer')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'washer' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              Washers & Laundry
            </button>
            <button
              onClick={() => handleSelectCategory('kitchen')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'kitchen' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              Kitchen Appliances
            </button>
            <button
              onClick={() => handleSelectCategory('fans')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'fans' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              Fans & Air Care
            </button>
            <button
              onClick={() => handleSelectCategory('personal')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'personal' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              Personal Care
            </button>
            <button
              onClick={() => handleSelectCategory('lighting')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'lighting' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              Lighting
            </button>
            <button
              onClick={() => handleSelectCategory('computers')}
              className={`whitespace-nowrap transition cursor-pointer ${
                activeCategoryFilter === 'computers' ? 'font-black text-black border-b-2 border-black pb-0.5' : 'hover:text-black'
              }`}
            >
              Computers & Office
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notice when adding item */}
      {addedItemNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <div className="font-bold">Added to Cart!</div>
            <div className="text-slate-300">{addedItemNotice}</div>
          </div>
          <Link
            href={`/checkout?tenant=${tenantSlug}`}
            className="text-xs bg-amber-500 hover:bg-amber-400 font-bold px-3 py-1.5 rounded-xl ml-2 text-black transition"
          >
            Checkout Now
          </Link>
        </div>
      )}

      {/* 3. HERO SECTION - BENTO GRID LAYOUT (Matching PDF Page 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT LARGE CARD: YEAR-END FESTIVAL & FEATURED INVERTER AC */}
          <div className="lg:col-span-8 bg-[#0a1120] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between">
            {/* Subtle background lightning vector graphic */}
            <div className="absolute right-6 top-8 opacity-15 pointer-events-none text-blue-400">
              <svg width="220" height="340" viewBox="0 0 100 150" fill="currentColor">
                <polygon points="50,0 20,80 50,80 30,150 90,60 60,60" />
              </svg>
            </div>

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-block border border-amber-500/40 text-amber-400 text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                MEGA SALE · 0% EMI AVAILABLE
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mt-5">
                Year-End<br />
                Electronics<br />
                Discount<br />
                Festival<br />
                2026
              </h1>

              {/* Subtitle */}
              <p className="text-slate-400 text-xs sm:text-sm mt-4 max-w-md leading-relaxed">
                Up to 45% off on smart inverter ACs and major appliances, with free nationwide delivery and installation.
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="#products"
                  className="px-6 py-3 rounded-xl bg-[#ea580c] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-600/30 transition active:scale-95"
                >
                  <span>Explore offers</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#engineering"
                  className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-bold text-xs sm:text-sm border border-slate-700 transition"
                >
                  See the engineering
                </a>
              </div>
            </div>

            {/* Inset Featured Inverter AC Box */}
            <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80">
              <div className="bg-[#11192e] border border-slate-700/80 rounded-2xl p-4 sm:p-5 max-w-xl">
                <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  FEATURED INVERTER AC
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  {featuredHeroProduct.title}
                </h3>

                <div className="grid grid-cols-3 gap-3 my-3 py-2.5 border-y border-slate-800 text-center">
                  <div>
                    <div className="text-lg sm:text-xl font-black text-white">18,000</div>
                    <div className="text-[10px] text-slate-400 font-medium">BTU/h</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-black text-white">3.10</div>
                    <div className="text-[10px] text-slate-400 font-medium">EER W/W</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-black text-white">39</div>
                    <div className="text-[10px] text-slate-400 font-medium">dB mid fan</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-black text-white">
                      BDT {featuredHeroProduct.price.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md">
                      12 × BDT {Math.round(featuredHeroProduct.price / 12).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(featuredHeroProduct)}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition shadow-sm active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>

              {/* Bottom Perks Strip */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-medium">
                <span>Up to 12 months 0% interest EMI</span>
                <span>•</span>
                <span>28 major banks</span>
                <span>•</span>
                <span>Free installation</span>
              </div>
            </div>
          </div>

          {/* RIGHT 3 STACKED CARDS (Matching PDF Page 1) */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* Promo Card 1: Whirlpool Refrigerator */}
            <div
              onClick={() => handleSelectCategory('fridge')}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-1.5">
                <span className="inline-block text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  Cashback BDT 1,000
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  Whirlpool 6th Sense Inverter Frost-Free
                </h4>
                <p className="text-xs text-slate-500">10 years official warranty</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-50/60 flex items-center justify-center text-amber-600 shrink-0 border border-amber-100">
                <Refrigerator className="w-8 h-8" />
              </div>
            </div>

            {/* Promo Card 2: Toshiba Washer */}
            <div
              onClick={() => handleSelectCategory('washer')}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-1.5">
                <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  Free installation
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  Toshiba Direct Drive Inverter Washer
                </h4>
                <p className="text-xs text-slate-500">BLDC motor and 90°C steam anti-allergy</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-50/60 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                <WashingMachine className="w-8 h-8" />
              </div>
            </div>

            {/* Promo Card 3: Philips Air Fryer */}
            <div
              onClick={() => handleSelectCategory('kitchen')}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="space-y-1.5">
                <span className="inline-block text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                  Flash deal · 35% off
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  Philips Rapid Air Fryer and Kitchen Combo
                </h4>
                <p className="text-xs text-slate-500">90% less oil, healthy frying</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-orange-50/60 flex items-center justify-center text-orange-600 shrink-0 border border-orange-100">
                <Flame className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AUTHORISED PARTNERS ROW (Matching PDF Page 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 shrink-0">
            AUTHORISED PARTNERS
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-bold text-slate-700">
            <span onClick={() => setSearchQuery('Hisense')} className="hover:text-black cursor-pointer">Hisense</span>
            <span onClick={() => setSearchQuery('Gree')} className="hover:text-black cursor-pointer">Gree Inverter</span>
            <span onClick={() => setSearchQuery('Haier')} className="hover:text-black cursor-pointer">Haier</span>
            <span onClick={() => setSearchQuery('Panasonic')} className="hover:text-black cursor-pointer">Panasonic</span>
            <span onClick={() => setSearchQuery('General')} className="hover:text-black cursor-pointer">General Japan</span>
            <span onClick={() => setSearchQuery('Whirlpool')} className="hover:text-black cursor-pointer">Whirlpool 6th Sense</span>
            <span onClick={() => setSearchQuery('Toshiba')} className="hover:text-black cursor-pointer">Toshiba</span>
            <span onClick={() => setSearchQuery('Philips')} className="hover:text-black cursor-pointer">Philips</span>
            <span onClick={() => setSearchQuery('Schneider')} className="hover:text-black cursor-pointer">Schneider Electric</span>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY CATEGORY - MAJOR APPLIANCE HUB (Matching PDF Page 1, Red Callouts 3 & 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 block">
              MAJOR APPLIANCE HUB
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Shop by category
            </h2>
          </div>
          {activeCategoryFilter !== 'all' && (
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Show All Categories</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {applianceHubCategories.map((cat) => {
            const IconComp = cat.icon;
            const isSelected = activeCategoryFilter === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`bg-white rounded-2xl p-4 border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-black ring-2 ring-black/10 shadow-md'
                    : 'border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-400'
                }`}
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      isSelected ? 'bg-black text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                    {cat.sub}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-semibold">
                  {cat.count}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. PRODUCT CATALOG GRID (Matching PDF Page 2, Red Callouts 5 & 6) */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
                OFFICIAL WARRANTY STORE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% genuine, authorised
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Smart inverter electronics and home appliances
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredProducts.length} of {liveProducts.length} products
            </span>
            <div className="relative">
              <select className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-1.5 appearance-none pr-7 focus:outline-none cursor-pointer">
                <option>Sort: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 0% EMI Tenure Filter Pills (Matching PDF Page 2) */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-600 mr-2">0% EMI tenure</span>
          {[3, 6, 9, 12].map((tenure) => (
            <button
              key={tenure}
              onClick={() => setSelectedEmiTenure(tenure)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                selectedEmiTenure === tenure
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tenure} months
            </button>
          ))}

          {activeCategoryFilter !== 'all' && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Filtered by:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white flex items-center gap-1.5">
                <span>{applianceHubCategories.find((c) => c.id === activeCategoryFilter)?.name}</span>
                <X
                  onClick={() => setActiveCategoryFilter('all')}
                  className="w-3 h-3 cursor-pointer hover:text-red-400"
                />
              </span>
            </div>
          )}
        </div>

        {/* 8 Product Cards in 4 columns (Matching PDF Page 2) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-sm font-bold text-slate-600">No products found matching your current filter.</p>
            <button
              onClick={() => {
                setActiveCategoryFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 bg-black text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const IconComponent = p.icon || Wind;
              const emiMonthly = Math.round(p.price / selectedEmiTenure);

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Bar: Discount pill & Brand */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold text-orange-600 bg-orange-50 border border-orange-100">
                        {p.discount}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{p.brand}</span>
                    </div>

                    {/* Warranty pill */}
                    <div
                      className={`text-center py-1 px-2 rounded-lg text-[11px] font-bold mb-4 ${
                        p.warrantyType === 'compressor'
                          ? 'bg-sky-50 text-sky-700 border border-sky-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      {p.warranty}
                    </div>

                    {/* Product Visual Illustration / Image */}
                    <Link
                      href={`/products/${p.slug || p.id}?tenant=${tenantSlug}`}
                      className="block aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 mb-4 group-hover:scale-105 transition-transform duration-300 overflow-hidden cursor-pointer"
                    >
                      <IconComponent className="w-16 h-16 stroke-[1.2] text-slate-600" />
                    </Link>

                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                      <span className="font-semibold text-slate-600">{p.category}</span>
                      <span className="font-bold text-slate-800">{p.rating}</span>
                    </div>

                    {/* Product Title (Direct Link to Full Page) */}
                    <Link
                      href={`/products/${p.slug || p.id}?tenant=${tenantSlug}`}
                      className="block text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 cursor-pointer group-hover:text-orange-600 transition"
                      title={p.title}
                    >
                      {p.title}
                    </Link>

                    {/* Feature Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price, EMI & Action Buttons */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-lg font-black text-slate-950">
                        BDT {p.price.toLocaleString()}
                      </span>
                      {p.comparePrice && p.comparePrice > p.price && (
                        <span className="text-xs text-slate-400 line-through">
                          BDT {p.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-600 font-semibold mb-4">
                      0% EMI · BDT {emiMonthly.toLocaleString()}/mo × {selectedEmiTenure}
                    </div>

                    {/* Buttons: Full Spec Page & Add to cart */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/products/${p.slug || p.id}?tenant=${tenantSlug}`}
                        className="py-2 px-3 rounded-xl border border-slate-300 hover:border-slate-800 text-slate-800 font-bold text-xs text-center transition flex items-center justify-center gap-1"
                      >
                        <span>Spec sheet</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="py-2 px-3 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs text-center transition active:scale-95 shadow-sm"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Show More Products Button */}
        <div className="text-center mt-10">
          <button
            onClick={() => setActiveCategoryFilter('all')}
            className="px-8 py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition"
          >
            Show 12 more products
          </button>
        </div>
      </section>

      {/* 7. INTERACTIVE ENGINEERING SHOWCASE (Matching PDF Page 3, Red Callout 7) */}
      <section id="engineering" className="bg-[#0c1322] text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-2">
            ENGINEERING
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What is inside a smart inverter appliance
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
            Advanced compressor technology, patented Golden Fin anti-corrosive coating and energy-efficient components, built for extreme climate durability.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
            {/* Left 6 Interactive Selectors */}
            <div className="lg:col-span-6 space-y-3">
              {engineeringFeatures.map((feat, idx) => (
                <div
                  key={feat.id}
                  onClick={() => setActiveEngineeringFeature(idx)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                    activeEngineeringFeature === idx
                      ? 'bg-slate-800 border-slate-600 text-white shadow-md'
                      : 'bg-[#11192e]/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold">{feat.title}</span>
                  <span className="text-xs font-mono font-bold text-slate-400 ml-4 shrink-0">
                    {feat.metric}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Dynamic Feature Card */}
            <div className="lg:col-span-6 bg-[#11192e] rounded-3xl p-8 border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  {activeEng.label}
                </span>
                <div className="text-6xl sm:text-7xl font-black text-orange-500 tracking-tight my-2">
                  {activeEng.statValue}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-4">
                  {activeEng.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                  {activeEng.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80">
                  {activeEng.pill}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. OFFICIAL ENGINEERING DATA - TECHNICAL SPECIFICATION CHART (Matching PDF Page 3 & 4, Red Callouts 8 & 9) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-orange-600 block">
                OFFICIAL ENGINEERING DATA
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Technical specification chart
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tested and verified under ISO and international laboratory standards.
              </p>
            </div>
            <div className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200 shrink-0">
              Model: Hisense AS18TW4RGSKB02DU Inverter
            </div>
          </div>

          {/* 4 Highlight Metric Cards (Matching PDF Page 3) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-center">
              <div className="text-xl sm:text-2xl font-black text-slate-900">18,000</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">BTU/h cooling (1.5 Ton)</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-center">
              <div className="text-xl sm:text-2xl font-black text-slate-900">3.10</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">EER W/W, star certified</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-center">
              <div className="text-xl sm:text-2xl font-black text-slate-900">39 / 54</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">dB indoor / outdoor</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-center">
              <div className="text-xl sm:text-2xl font-black text-slate-900">12 yrs</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">compressor warranty</div>
            </div>
          </div>

          {/* Table Tab Selector */}
          <div className="flex gap-4 border-b border-slate-200 mb-6 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveSpecTab('specs')}
              className={`pb-2.5 transition border-b-2 ${
                activeSpecTab === 'specs'
                  ? 'border-black text-black'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveSpecTab('warranty')}
              className={`pb-2.5 transition border-b-2 ${
                activeSpecTab === 'warranty'
                  ? 'border-black text-black'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Warranty package
            </button>
          </div>

          {/* Technical Spec / Warranty Table Rows */}
          <div className="overflow-x-auto">
            {activeSpecTab === 'specs' ? (
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 font-bold text-slate-800 w-1/3">Air conditioner type</td>
                    <td className="py-3 px-2 text-slate-600">Smart Inverter (Cooling Only)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 bg-slate-50/40">
                    <td className="py-3 px-2 font-bold text-slate-800">Cooling capacity (BTU/h)</td>
                    <td className="py-3 px-2 text-slate-900 font-semibold">18,000 BTU/h (1.5 Ton) / 5275 Watts</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 font-bold text-slate-800">Voltage and frequency</td>
                    <td className="py-3 px-2 text-slate-600">220-240V, 50 Hz (1700W / 7.6A)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 bg-slate-50/40">
                    <td className="py-3 px-2 font-bold text-slate-800">Energy efficiency ratio (EER)</td>
                    <td className="py-3 px-2 text-slate-900 font-semibold">3.10 W/W (Star Rating Certified)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 font-bold text-slate-800">Refrigerant gas type</td>
                    <td className="py-3 px-2 text-slate-600">R32 Eco-Friendly (0.660 kg)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 bg-slate-50/40">
                    <td className="py-3 px-2 font-bold text-slate-800">Evaporator and condenser fin</td>
                    <td className="py-3 px-2 text-slate-600">100% Copper Tube + Golden Hydrophilic Fin</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 font-bold text-slate-800">Noise level (indoor / outdoor)</td>
                    <td className="py-3 px-2 text-slate-600">39 dB (Mid Fan) / 54 dB (Outdoor)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 bg-slate-50/40">
                    <td className="py-3 px-2 font-bold text-slate-800">Indoor dimensions and weight</td>
                    <td className="py-3 px-2 text-slate-600">930 × 300 × 220 mm (11.0 kg Net)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 font-bold text-slate-800">Outdoor dimensions and weight</td>
                    <td className="py-3 px-2 text-slate-600">715 × 240 × 540 mm (25.0 kg Net)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 bg-amber-50/50">
                    <td className="py-3 px-2 font-black text-slate-900">Official warranty package</td>
                    <td className="py-3 px-2 font-bold text-amber-800">
                      Compressor 12 Years · PCB Board 5 Years · Spare Parts 5 Years · Service 2 Years Free (2x Free Hydro Wash)
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 font-bold text-slate-800 w-1/3">Compressor Replacement Warranty</td>
                    <td className="py-3 px-2 text-emerald-700 font-bold">12 Years Official Official Brand Warranty</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 bg-slate-50/40">
                    <td className="py-3 px-2 font-bold text-slate-800">Printed Circuit Board (PCB)</td>
                    <td className="py-3 px-2 text-slate-900 font-semibold">5 Years Official Replacement Coverage</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 font-bold text-slate-800">Spare Parts & Components</td>
                    <td className="py-3 px-2 text-slate-900 font-semibold">5 Years Genuine Parts Replacement</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 bg-slate-50/40">
                    <td className="py-3 px-2 font-bold text-slate-800">Doorstep Technical Service</td>
                    <td className="py-3 px-2 text-slate-900 font-semibold">2 Years Free Doorstep Service (with 2x Free Hydro Wash)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70">
                    <td className="py-3 px-2 font-bold text-slate-800">Authorized Claim Centers</td>
                    <td className="py-3 px-2 text-slate-600">Over 24 service points across 64 districts in Bangladesh</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* 9. AUTHORISED SHOWROOMS & SERVICE CENTERS (Matching PDF Page 4, Red Callout 10) */}
      <section id="showrooms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-orange-600 block">
              DIRECT BRAND OUTLETS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Authorised showrooms and official service centers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Experience products in person with certified engineers, or book official warranty service.
            </p>
          </div>

          {/* City Filter Pills (Matching PDF Page 4) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['Dhaka', 'Chittagong', 'Sylhet', 'Khulna'].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedShowroomCity(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedShowroomCity === city
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Showroom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showroomsList
            .filter((s) => s.city === selectedShowroomCity)
            .map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      {s.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {s.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {s.address}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Hotline</span>
                      <span className="font-bold text-slate-900">{s.hotline}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Hours</span>
                      <span className="font-bold text-slate-900">{s.hours}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-5">
                  <a
                    href="tel:09606111777"
                    className="py-2.5 px-3 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs text-center transition"
                  >
                    Call hotline
                  </a>
                  <button
                    onClick={() => setSelectedDirectionShowroom(s)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-400 text-slate-700 font-bold text-xs text-center transition"
                  >
                    Directions
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Showroom Direction Modal */}
      {selectedDirectionShowroom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                {selectedDirectionShowroom.badge}
              </span>
              <button
                onClick={() => setSelectedDirectionShowroom(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                {selectedDirectionShowroom.name}
              </h3>
              <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>{selectedDirectionShowroom.address}</span>
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Showroom Manager:</span>
                <span className="font-bold text-slate-800">{selectedDirectionShowroom.manager}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hotline:</span>
                <span className="font-bold text-slate-800">{selectedDirectionShowroom.hotline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Visiting Hours:</span>
                <span className="font-bold text-slate-800">{selectedDirectionShowroom.hours}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:09606111777`}
                className="py-2.5 rounded-xl bg-black text-white font-bold text-xs text-center"
              >
                Call Outlet
              </a>
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedDirectionShowroom.address
                    )}`,
                    '_blank'
                  );
                }}
                className="py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs text-center"
              >
                Open Google Maps
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. FOOTER (Matching PDF Page 4, Red Callout 11) */}
      <footer className="bg-[#0b0f19] text-slate-400 text-xs py-14 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black border border-slate-700 flex items-center justify-center text-amber-400">
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-base font-black text-white">
                  SmartVolt Electrical & Automation
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Bangladesh&apos;s trusted authorised retail platform for smart inverter air conditioners, refrigerators and major home appliances.
              </p>
              <div className="font-bold text-white pt-1">
                Helpline: 09606 111 777
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-black uppercase tracking-wider text-white mb-3">
                CATEGORIES
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li onClick={() => handleSelectCategory('ac')} className="hover:text-white cursor-pointer">Smart inverter ACs</li>
                <li onClick={() => handleSelectCategory('fridge')} className="hover:text-white cursor-pointer">Frost-free refrigerators</li>
                <li onClick={() => handleSelectCategory('tv')} className="hover:text-white cursor-pointer">4K Google Smart TVs</li>
                <li onClick={() => handleSelectCategory('washer')} className="hover:text-white cursor-pointer">Direct drive washers</li>
                <li onClick={() => handleSelectCategory('ev')} className="hover:text-white cursor-pointer">Electric vehicles (EV)</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-black uppercase tracking-wider text-white mb-3">
                WARRANTY AND SERVICES
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white cursor-pointer">12 years official compressor warranty</li>
                <li className="hover:text-white cursor-pointer">Free doorstep installation booking</li>
                <li className="hover:text-white cursor-pointer">0% bank EMI facility</li>
                <li className="hover:text-white cursor-pointer">Official service points and spare parts</li>
                <li className="pt-2">
                  <Link
                    href={`/admin/dashboard?tenant=${tenantSlug}`}
                    className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Merchant Admin Portal</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-black uppercase tracking-wider text-white mb-3">
                CORPORATE OFFICE
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Nawabpur Road Electrical Market, Dhaka-1100, Bangladesh
              </p>
              <div className="mt-3 space-y-1">
                <div>support@smartvoltbd.com</div>
                <div>Open daily, 10:00 AM to 09:00 PM</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-3">
            <div>© 2026 SmartVolt Electrical & Automation. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/dashboard?tenant=${tenantSlug}`} className="hover:text-slate-300 underline">
                Merchant Portal
              </Link>
              <span>•</span>
              <span>Secure checkout · 100% genuine seal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
