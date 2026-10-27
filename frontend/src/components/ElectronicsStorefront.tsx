'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { api } from '@/lib/api';
import {
  Phone,
  Truck,
  ShieldCheck,
  Zap,
  ShoppingCart,
  Search,
  ChevronDown,
  ChevronRight,
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
  Filter,
  Wrench,
  Info,
  PhoneCall,
  PackageCheck,
  Mail,
  Building,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText,
} from 'lucide-react';

function getCategoryIcon(name: string = '') {
  const n = name.toLowerCase();
  if (n.includes('ac') || n.includes('air condition')) return Wind;
  if (n.includes('fridge') || n.includes('refrigerat')) return Refrigerator;
  if (n.includes('tv') || n.includes('audio') || n.includes('sound')) return Tv;
  if (n.includes('wash') || n.includes('laundry')) return WashingMachine;
  if (n.includes('kitchen') || n.includes('cook') || n.includes('microwave') || n.includes('oven')) return Flame;
  if (n.includes('ev') || n.includes('vehicle') || n.includes('scooter') || n.includes('bike')) return Bike;
  if (n.includes('fan')) return Fan;
  if (n.includes('personal') || n.includes('care') || n.includes('trimmer') || n.includes('razor')) return Scissors;
  if (n.includes('light') || n.includes('lamp') || n.includes('bulb')) return Lightbulb;
  if (n.includes('laptop') || n.includes('computer')) return Laptop;
  if (n.includes('smart') || n.includes('automation') || n.includes('bell')) return Bell;
  if (n.includes('cable') || n.includes('wire') || n.includes('breaker') || n.includes('panel') || n.includes('switch')) return Sliders;
  if (n.includes('power') || n.includes('ips') || n.includes('battery')) return BatteryCharging;
  return Zap;
}

interface ElectronicsStorefrontProps {
  tenant: any;
  tenantSlug: string;
  items: any[];
  categories: any[];
  brands?: any[];
}

export function ElectronicsStorefront({
  tenant,
  tenantSlug,
  items = [],
  categories = [],
  brands = [],
}: ElectronicsStorefrontProps) {
  const { addToCart, totalItems } = useCart();
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<number>(12);
  const [selectedShowroomCity, setSelectedShowroomCity] = useState<string>('Dhaka');
  const [activeEngineeringFeature, setActiveEngineeringFeature] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Brand-First Dropdown & Cascading Mega-Menu state
  const [activeMenuType, setActiveMenuType] = useState<'brands' | 'accessories' | null>(null);
  const [activeBrandInMenu, setActiveBrandInMenu] = useState<string>('Samsung');
  const [activeAccessoryId, setActiveAccessoryId] = useState<string>('acc_tv_audio');
  const [activeDropdownBrand, setActiveDropdownBrand] = useState<any | null>(null);
  const [activeHoverCategory, setActiveHoverCategory] = useState<string | null>(null);
  const dropdownCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Navigation Links Modals State (About, Contact Us, Track Your Order)
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    subject: 'General Product Inquiry',
    message: '',
  });

  const [trackOrderModalOpen, setTrackOrderModalOpen] = useState(false);
  const [trackOrderInput, setTrackOrderInput] = useState('');
  const [trackOrderLoading, setTrackOrderLoading] = useState(false);
  const [trackOrderResult, setTrackOrderResult] = useState<any | null>(null);
  const [trackOrderError, setTrackOrderError] = useState<string | null>(null);

  // Selected product modal state
  const [selectedDirectionShowroom, setSelectedDirectionShowroom] = useState<any | null>(null);

  // 13 Hub Categories with product counts & descriptions matching PDF Page 1
  const applianceHubCategories = [
    {
      id: 'ac',
      name: 'Air Conditioners',
      sub: 'Inverter AC, Split & Cassette',
      count: '3 products',
      matchKeys: ['air', 'ac', 'inverter ac'],
      icon: Wind,
    },
    {
      id: 'fridge',
      name: 'Refrigerators',
      sub: 'Inverter Frost-Free & Deep Freezers',
      count: '1 product',
      matchKeys: ['refrigerator', 'fridge', 'freezer'],
      icon: Refrigerator,
    },
    {
      id: 'tv',
      name: 'Smart TVs & Audio',
      sub: 'Google TV, 4K UHD, Soundbars',
      count: '1 product',
      matchKeys: ['tv', 'audio', 'sound', 'speaker'],
      icon: Tv,
    },
    {
      id: 'washer',
      name: 'Washing Machines',
      sub: 'Real Inverter Direct Drive & Dryers',
      count: '1 product',
      matchKeys: ['washer', 'washing', 'laundry'],
      icon: WashingMachine,
    },
    {
      id: 'kitchen',
      name: 'Kitchen & Microwave',
      sub: 'Convection Microwave & Induction',
      count: '1 product',
      matchKeys: ['kitchen', 'oven', 'microwave', 'induction'],
      icon: Flame,
    },
    {
      id: 'smarthome',
      name: 'Smart Home Automation',
      sub: 'WiFi Touch Switches & Sensors',
      count: '4 products',
      matchKeys: ['smart', 'automation', 'tuya', 'sonoff', 'curtain'],
      icon: Bell,
    },
    {
      id: 'tools',
      name: 'Circuit Breakers & Panels',
      sub: 'MCB, MCCB & Industrial Distribution',
      count: '3 products',
      matchKeys: ['switch', 'breaker', 'tools', 'panel', 'mcb'],
      icon: Sliders,
    },
    {
      id: 'lighting',
      name: 'Architectural LED Lighting',
      sub: 'Smart High-Bay & Magnetic Tracks',
      count: '2 products',
      matchKeys: ['lighting', 'bulb', 'led', 'lamp'],
      icon: Lightbulb,
    },
    {
      id: 'ev',
      name: 'Electric Vehicles (EV)',
      sub: 'Smart Graphene Scooters & E-Bikes',
      count: '1 product',
      matchKeys: ['electric', 'ev', 'scooter', 'bike'],
      icon: Bike,
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

  // Dynamic categories derived from backend or fallback
  const liveCategories = useMemo(() => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      return categories.map((cat: any) => {
        const count = items.filter(
          (it) =>
            it.categoryId === cat.id ||
            it.category?.slug === cat.slug ||
            it.category?.id === cat.id ||
            it.category?.name?.toLowerCase() === cat.name?.toLowerCase()
        ).length;
        return {
          id: cat.slug || cat.id,
          rawId: cat.id,
          parentId: cat.parentId,
          name: cat.name,
          sub: cat.promoSlogan || `${count} products in catalog`,
          count: `${count} ${count === 1 ? 'product' : 'products'}`,
          matchKeys: [cat.slug, cat.name.toLowerCase()],
          icon: getCategoryIcon(cat.name),
        };
      });
    }
    return applianceHubCategories;
  }, [categories, items]);

  // Uncluttered 8-9 root categories (without parentId) with recursive child category counts
  const rootCategories = useMemo(() => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const roots = categories.filter((c: any) => !c.parentId);
      if (roots.length > 0) {
        return roots.map((cat: any) => {
          // Include this root category ID plus any subcategories belonging to this root category
          const descendantIds = [
            cat.id,
            cat.slug,
            ...categories.filter((c: any) => c.parentId === cat.id).map((c: any) => c.id),
            ...categories.filter((c: any) => c.parentId === cat.id).map((c: any) => c.slug),
          ].filter(Boolean);

          const count = items.filter((it) => {
            const itCatId = it.categoryId || it.category?.id || it.category?.slug;
            return (
              descendantIds.includes(itCatId) ||
              it.category?.name?.toLowerCase() === cat.name?.toLowerCase()
            );
          }).length;

          return {
            id: cat.slug || cat.id,
            rawId: cat.id,
            descendantIds,
            name: cat.name,
            sub: cat.promoSlogan || `${count} products in catalog`,
            count: `${count} ${count === 1 ? 'product' : 'products'}`,
            matchKeys: [cat.slug, cat.name.toLowerCase()],
            icon: getCategoryIcon(cat.name),
          };
        });
      }
    }
    return applianceHubCategories;
  }, [categories, items]);

  // Dynamic showrooms derived from backend settings
  const liveShowrooms = useMemo(() => {
    const backendShowrooms = tenant?.settings?.showrooms;
    if (backendShowrooms && Array.isArray(backendShowrooms) && backendShowrooms.length > 0) {
      return backendShowrooms.map((s: any) => ({
        id: s.id,
        city: s.city || 'Dhaka',
        name: s.name,
        address: s.address,
        hotline: s.phone || s.hotline || '09606 111 777',
        hours: s.hours || '10:00 AM - 09:00 PM',
        manager: s.manager || 'Engr. Tanvir Ahmed',
        badge: s.badge || (s.isActive !== false ? 'Open daily' : 'Closed'),
      }));
    }
    return showroomsList;
  }, [tenant?.settings?.showrooms]);

  // Available cities from showrooms
  const availableCities = useMemo(() => {
    const cities = Array.from(new Set(liveShowrooms.map((s: any) => s.city).filter(Boolean)));
    return cities.length > 0 ? (cities as string[]) : ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna'];
  }, [liveShowrooms]);

  // Dynamic brand partners derived from backend or fallback (respecting visibility control)
  const partnerBrands = useMemo(() => {
    const list =
      brands && Array.isArray(brands) && brands.length > 0
        ? brands
        : [
            { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', isVisible: true },
            { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg', isVisible: true },
            { name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/LG_logo_%282015%29.svg', isVisible: true },
            { name: 'Walton', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walton_logo.svg', isVisible: true },
            { name: 'Gree', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Gree_Electric_logo.svg', isVisible: true },
            { name: 'General', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Fujitsu_General_logo.svg', isVisible: true },
            { name: 'Panasonic', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Panasonic_logo_%28Blue%29.svg', isVisible: true },
            { name: 'Schneider Electric', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Schneider_Electric_2007.svg', isVisible: true },
            { name: 'ABB', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/00/ABB_logo.svg', isVisible: true },
            { name: 'Siemens', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Siemens_AG_logo.svg', isVisible: true },
            { name: 'Philips', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Philips_logo_new.svg', isVisible: true },
            { name: 'Tuya Smart', logo: 'https://images.seeklogo.com/logo-png/43/1/tuya-smart-logo-png_seeklogo-431872.png', isVisible: true },
          ];
    return list.filter((b: any) => b.isVisible !== false && b.isActive !== false);
  }, [brands]);

  // Helper to resolve brand logo (supports user-uploaded data URLs, valid URLs, and local SVGs)
  const resolveBrandLogo = (brand: any) => {
    if (!brand) return '';
    // If admin uploaded a base64 Data URL, prioritize it
    if (brand.logo && brand.logo.startsWith('data:')) {
      return brand.logo;
    }

    const key = (brand.slug || brand.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const localBrandMap: Record<string, string> = {
      samsung: '/brands/samsung.svg',
      sony: '/brands/sony.svg',
      lg: '/brands/lg.svg',
      walton: '/brands/walton.svg',
      gree: '/brands/gree.svg',
      haier: '/brands/haier.svg',
      singer: '/brands/singer.svg',
      panasonic: '/brands/panasonic.svg',
      general: '/brands/general.svg',
      generalfujitsu: '/brands/general.svg',
      hitachi: '/brands/hitachi.svg',
      hisense: '/brands/hisense.svg',
      whirlpool: '/brands/whirlpool.svg',
      toshiba: '/brands/toshiba.svg',
      philips: '/brands/philips.svg',
      electrolux: '/brands/electrolux.svg',
      tuya: '/brands/tuya.svg',
      tuyasmart: '/brands/tuya.svg',
      sonoff: '/brands/sonoff.svg',
      schneider: '/brands/schneider.svg',
      schneiderelectric: '/brands/schneider.svg',
      abb: '/brands/abb.svg',
      siemens: '/brands/siemens.svg',
      havells: '/brands/havells.svg',
      chint: '/brands/chint.svg',
      chintelectric: '/brands/chint.svg',
      superstar: '/brands/superstar.svg',
      superstarssg: '/brands/superstar.svg',
      vision: '/brands/vision.svg',
      visionelectronics: '/brands/vision.svg',
      yadea: '/brands/yadea.svg',
      yadeaev: '/brands/yadea.svg',
      jbe: '/brands/jbe.svg',
    };

    if (localBrandMap[key]) {
      return localBrandMap[key];
    }

    return brand.logo || '';
  };

  // Curated top flagship brands for navigation line (user requested keeping only a few brands)
  const featuredNavBrands = useMemo(() => {
    return partnerBrands.slice(0, 5);
  }, [partnerBrands]);

  // Comprehensive Brand ➔ Category ➔ Subcategory Taxonomy Map
  const brandTaxonomy = useMemo(() => {
    const standardTaxonomy: Record<string, Array<{
      id: string;
      name: string;
      icon: any;
      subcategories: Array<{ id: string; name: string; tag?: string }>;
    }>> = {
      samsung: [
        {
          id: 'cat_tv_audio',
          name: 'Smart TVs & Audio',
          icon: Tv,
          subcategories: [
            { id: 'sub_tv_4k', name: '4K Ultra HD Frameless Google TV', tag: 'Flagship' },
            { id: 'sub_audio_soundbar', name: 'Dolby Atmos Soundbars & Subwoofer Systems', tag: 'Surround' },
            { id: 'sub_tv_oled', name: 'Neo QLED & OLED Display Panels' },
            { id: 'sub_tv_crystal', name: '65-Inch Crystal UHD Series' },
          ],
        },
        {
          id: 'cat_refrigerators',
          name: 'Refrigerators & Freezers',
          icon: Refrigerator,
          subcategories: [
            { id: 'sub_ref_sidebyside', name: 'SpaceMax™ Side-by-Side Inverter Refrigerator', tag: 'Popular' },
            { id: 'sub_ref_doubledoor', name: 'Digital Inverter Frost-Free Refrigerators' },
            { id: 'sub_ref_deepfreezers', name: 'Deep Freezers & Coolers' },
          ],
        },
        {
          id: 'cat_ac',
          name: 'Air Conditioners (AC)',
          icon: Wind,
          subcategories: [
            { id: 'sub_ac_1_5ton', name: '1.5 Ton WindFree™ Dual Inverter AC', tag: 'Eco Star' },
            { id: 'sub_ac_2ton', name: '2.0 Ton Fast Cooling Inverter AC' },
          ],
        },
        {
          id: 'cat_washers',
          name: 'Washing Machines',
          icon: WashingMachine,
          subcategories: [
            { id: 'sub_washer_frontload', name: 'AI EcoBubble™ Front Load Direct Drive' },
            { id: 'sub_washer_topload', name: 'Wobble Technology Top Load Automatic Washers' },
          ],
        },
      ],
      sony: [
        {
          id: 'cat_tv_audio',
          name: 'Smart TVs & Audio',
          icon: Tv,
          subcategories: [
            { id: 'sub_tv_4k', name: 'BRAVIA XR 4K Ultra HD OLED Google TVs', tag: 'Cognitive XR' },
            { id: 'sub_audio_soundbar', name: 'Dolby Atmos 5.1ch Soundbars & Home Theaters (HT-S40R)', tag: 'Surround' },
            { id: 'sub_tv_oled', name: '55-inch & 65-inch 4K HDR High Frame-Rate Displays' },
          ],
        },
      ],
      lg: [
        {
          id: 'cat_washers',
          name: 'Washing Machines',
          icon: WashingMachine,
          subcategories: [
            { id: 'sub_washer_frontload', name: 'AI Direct Drive™ 9kg Front Load Washer with Steam', tag: 'Best Seller' },
            { id: 'sub_washer_topload', name: 'Smart Inverter TurboDrum Washers' },
          ],
        },
        {
          id: 'cat_tv_audio',
          name: 'Smart TVs & Audio',
          icon: Tv,
          subcategories: [
            { id: 'sub_tv_4k', name: 'OLED evo Gallery Edition 4K TVs', tag: 'OLED' },
            { id: 'sub_tv_oled', name: 'NanoCell 4K Smart Cinema Displays' },
          ],
        },
        {
          id: 'cat_refrigerators',
          name: 'Refrigerators & Freezers',
          icon: Refrigerator,
          subcategories: [
            { id: 'sub_ref_sidebyside', name: 'InstaView™ Door-in-Door Refrigerators' },
            { id: 'sub_ref_doubledoor', name: 'Linear Inverter Frost-Free Refrigerators' },
          ],
        },
        {
          id: 'cat_ac',
          name: 'Air Conditioners (AC)',
          icon: Wind,
          subcategories: [
            { id: 'sub_ac_1_5ton', name: 'Dual Inverter Energy Saving AC with Dual Vane' },
          ],
        },
      ],
      walton: [
        {
          id: 'cat_refrigerators',
          name: 'Refrigerators & Freezers',
          icon: Refrigerator,
          subcategories: [
            { id: 'sub_ref_doubledoor', name: 'Non-Frost Inverter Double Door Refrigerator (380L)', tag: 'Inverter' },
            { id: 'sub_ref_sidebyside', name: 'Side-by-Side Inverter Refrigerator Series' },
            { id: 'sub_ref_deepfreezers', name: 'Direct Cool Deep Freezers & Beverage Coolers' },
          ],
        },
        {
          id: 'cat_washers',
          name: 'Washing Machines',
          icon: WashingMachine,
          subcategories: [
            { id: 'sub_washer_topload', name: '8.0kg Fully Automatic Top Load Washer (WWM-AQ80)', tag: 'Popular' },
            { id: 'sub_washer_frontload', name: 'Inverter Direct Drive Front Load Washers' },
          ],
        },
        {
          id: 'cat_ac',
          name: 'Air Conditioners (AC)',
          icon: Wind,
          subcategories: [
            { id: 'sub_ac_1_5ton', name: 'Diamond & Riverine 1.5 Ton Smart Inverter AC' },
            { id: 'sub_ac_1ton', name: '1.0 Ton Fast Cooling Inverter AC' },
          ],
        },
        {
          id: 'cat_tv_audio',
          name: 'Smart TVs & Audio',
          icon: Tv,
          subcategories: [
            { id: 'sub_tv_4k', name: '4K Ultra HD Frameless Android Google TV' },
          ],
        },
      ],
      gree: [
        {
          id: 'cat_ac',
          name: 'Air Conditioners (AC)',
          icon: Wind,
          subcategories: [
            { id: 'sub_ac_1_5ton', name: 'Lomo-Eco 1.5 Ton Dual Inverter Smart AC (GP-18LM)', tag: 'Bestseller' },
            { id: 'sub_ac_2ton', name: '2.0 Ton Heavy Duty Tropical Dual Inverter AC' },
            { id: 'sub_ac_1ton', name: '1.0 Ton Dual Inverter Energy Star AC' },
            { id: 'sub_ac_cassette', name: 'Commercial Ceiling Cassette Type Inverter AC' },
          ],
        },
      ],
      panasonic: [
        {
          id: 'cat_ac',
          name: 'Air Conditioners (AC)',
          icon: Wind,
          subcategories: [
            { id: 'sub_ac_1ton', name: '1.0 Ton nanoe-X Clean Air Smart Inverter AC', tag: 'Health Air' },
            { id: 'sub_ac_1_5ton', name: '1.5 Ton EcoNavi Dual Inverter Fast Cooling AC' },
          ],
        },
        {
          id: 'cat_kitchen',
          name: 'Kitchen & Microwave',
          icon: Flame,
          subcategories: [
            { id: 'sub_microwave', name: 'Convection Microwave & Steam Grill Ovens' },
            { id: 'sub_cookers', name: 'Induction Cookers & Automatic Rice Cookers' },
          ],
        },
      ],
      general: [
        {
          id: 'cat_ac',
          name: 'Air Conditioners (AC)',
          icon: Wind,
          subcategories: [
            { id: 'sub_ac_2ton', name: '2.0 Ton Extreme Heavy Tropical Inverter AC (ASGG24CLCA)', tag: 'Heavy Duty' },
            { id: 'sub_ac_1_5ton', name: '1.5 Ton Japanese Twin Rotary Tropical Inverter AC' },
            { id: 'sub_ac_cassette', name: 'Commercial Ceiling Cassette Heavy Inverter AC' },
          ],
        },
      ],
      haier: [
        {
          id: 'cat_ac',
          name: 'Air Conditioners (AC)',
          icon: Wind,
          subcategories: [
            { id: 'sub_ac_1_5ton', name: '1.5 Ton Self-Clean Triple Inverter AC', tag: 'Self-Clean' },
            { id: 'sub_ac_2ton', name: '2.0 Ton Heavy Inverter Smart AC' },
          ],
        },
        {
          id: 'cat_refrigerators',
          name: 'Refrigerators & Freezers',
          icon: Refrigerator,
          subcategories: [
            { id: 'sub_ref_sidebyside', name: 'Triple Door Inverter Refrigerator' },
            { id: 'sub_ref_doubledoor', name: 'Bottom Mount Frost-Free Refrigerators' },
          ],
        },
        {
          id: 'cat_washers',
          name: 'Washing Machines',
          icon: WashingMachine,
          subcategories: [
            { id: 'sub_washer_frontload', name: 'Direct Motion Front Load Washers' },
          ],
        },
      ],
      singer: [
        {
          id: 'cat_refrigerators',
          name: 'Refrigerators & Freezers',
          icon: Refrigerator,
          subcategories: [
            { id: 'sub_ref_doubledoor', name: 'Frost-Free Inverter Double Door Refrigerators' },
            { id: 'sub_ref_deepfreezers', name: 'Deep Freezers & Chest Coolers' },
          ],
        },
        {
          id: 'cat_kitchen',
          name: 'Kitchen & Microwave',
          icon: Flame,
          subcategories: [
            { id: 'sub_microwave', name: 'Convection Microwave & Air Fryer Ovens' },
          ],
        },
        {
          id: 'cat_washers',
          name: 'Washing Machines',
          icon: WashingMachine,
          subcategories: [
            { id: 'sub_washer_topload', name: 'Automatic Top Load Washers' },
          ],
        },
      ],
      tuya: [
        {
          id: 'cat_smart_home',
          name: 'Smart Home Automation',
          icon: Bell,
          subcategories: [
            { id: 'sub_wifi_switches', name: 'WiFi + RF Premium Smart Touch Switch (1, 2, 3, 4 Gang)', tag: 'Top Rated' },
            { id: 'sub_curtain_motors', name: 'Smart WiFi Motorized Electric Curtain Track System (3.2m - 5.2m)' },
            { id: 'sub_doorbells_locks', name: '3D Face Recognition & Video Intercom Smart Digital Door Lock', tag: 'Max Security' },
          ],
        },
      ],
      sonoff: [
        {
          id: 'cat_smart_home',
          name: 'Smart Home Automation',
          icon: Bell,
          subcategories: [
            { id: 'sub_wifi_switches', name: 'Sonoff Zigbee 3.0 Smart Home Hub & Gateway (ZBBridge-P)', tag: 'New Arrival' },
            { id: 'sub_curtain_motors', name: 'Smart Power Monitoring Relays & Temperature Sensors' },
          ],
        },
      ],
      schneider: [
        {
          id: 'cat_breakers_switchgear',
          name: 'Circuit Breakers & Panels',
          icon: Zap,
          subcategories: [
            { id: 'sub_mcb', name: 'Schneider Electric Acti9 iC60N 32A Double Pole MCB (6kA)', tag: 'Safety' },
            { id: 'sub_mccb', name: 'Compact NSX Molded Case Circuit Breakers (MCCB)' },
            { id: 'sub_distribution_boards', name: 'Industrial Distribution Enclosures & Switchboards' },
          ],
        },
      ],
      abb: [
        {
          id: 'cat_breakers_switchgear',
          name: 'Circuit Breakers & Panels',
          icon: Zap,
          subcategories: [
            { id: 'sub_mccb', name: 'ABB Formula A1 125A 3-Pole Industrial MCCB (18kA)', tag: 'Industrial' },
            { id: 'sub_mcb', name: 'System Pro M Compact MCB & Isolators' },
            { id: 'sub_distribution_boards', name: 'Heavy Industrial Distribution Switchboards' },
          ],
        },
      ],
      philips: [
        {
          id: 'cat_lighting',
          name: 'Architectural LED Lighting',
          icon: Lightbulb,
          subcategories: [
            { id: 'sub_track_lights', name: 'Philips Hue Compatible Magnetic Track Light System (1M + 3 Lights)', tag: 'Architectural' },
            { id: 'sub_strip_lights', name: 'Architectural High-CRI Recessed COB Spotlights' },
          ],
        },
      ],
      yadea: [
        {
          id: 'cat_ev',
          name: 'Electric Vehicles (EV)',
          icon: Bike,
          subcategories: [
            { id: 'cat_ev', name: 'Yadea G6 Smart High-Speed Electric Scooter (1200W TTFAR 72V)', tag: 'Eco Mobility' },
            { id: 'cat_ev', name: '72V 38Ah TTFAR 3rd Gen Graphene Battery Pack' },
          ],
        },
      ],
    };

    return {
      getForBrand: (brandName: string) => {
        const key = (brandName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        for (const [k, cats] of Object.entries(standardTaxonomy)) {
          if (key.includes(k) || k.includes(key)) {
            return cats;
          }
        }

        // Dynamic category discovery from live items
        const brandItems = items.filter(
          (it) => it.brand?.name?.toLowerCase() === brandName.toLowerCase()
        );
        if (brandItems.length > 0) {
          const catMap = new Map<string, { id: string; name: string; icon: any; subcategories: any[] }>();
          brandItems.forEach((it) => {
            const cat = it.category || { id: 'general', name: 'Home Appliances' };
            const parentCat = categories.find((c: any) => c.id === cat.parentId) || cat;
            if (!catMap.has(parentCat.name)) {
              catMap.set(parentCat.name, {
                id: parentCat.id || parentCat.slug,
                name: parentCat.name,
                icon: getCategoryIcon(parentCat.name),
                subcategories: [],
              });
            }
            if (cat.parentId && !catMap.get(parentCat.name)!.subcategories.some((s) => s.name === cat.name)) {
              catMap.get(parentCat.name)!.subcategories.push({
                id: cat.id || cat.slug,
                name: cat.name,
              });
            }
          });
          const res = Array.from(catMap.values());
          if (res.length > 0) return res;
        }

        // Generic fallback for any other brand
        return [
          {
            id: 'cat_ac',
            name: 'Air Conditioners & Cooling',
            icon: Wind,
            subcategories: [
              { id: 'sub_ac_1_5ton', name: 'Inverter Split AC Series' },
              { id: 'sub_ac_cassette', name: 'Commercial AC Units' },
            ],
          },
          {
            id: 'cat_refrigerators',
            name: 'Refrigerators & Freezers',
            icon: Refrigerator,
            subcategories: [
              { id: 'sub_ref_doubledoor', name: 'Frost-Free Inverter Refrigerators' },
              { id: 'sub_ref_deepfreezers', name: 'Deep Freezers' },
            ],
          },
        ];
      },
    };
  }, [items, categories]);

  const resolveAccessoryIcon = (iconName: string = '') => {
    const map: Record<string, any> = {
      tv: Tv,
      wind: Wind,
      ac: Wind,
      refrigerator: Refrigerator,
      fridge: Refrigerator,
      washingmachine: WashingMachine,
      washer: WashingMachine,
      zap: Zap,
      power: Zap,
      cpu: Cpu,
      smarthome: Cpu,
      flame: Flame,
      kitchen: Flame,
      wrench: Wrench,
      tools: Wrench,
      shield: ShieldCheck,
      shieldcheck: ShieldCheck,
      bike: Bike,
      laptop: Laptop,
      lightbulb: Lightbulb,
    };
    const key = (iconName || '').toLowerCase().replace(/[^a-z]/g, '');
    return map[key] || Wrench;
  };

  // Comprehensive Accessories Taxonomy (Loads from tenant settings or defaults)
  const accessoriesTaxonomy = useMemo(() => {
    const rawList =
      tenant?.settings?.accessories && Array.isArray(tenant.settings.accessories) && tenant.settings.accessories.length > 0
        ? tenant.settings.accessories
        : [
            {
              id: 'acc_tv_audio',
              name: 'TV & Audio Accessories',
              iconName: 'Tv',
              badge: 'Certified',
              description: 'Heavy duty swivel wall mounts, high-speed HDMI 2.1 cables, magic voice remotes and sound gear',
              subcategories: [
                { id: 'sub_acc_wall_mount', name: 'Heavy Duty 32"-75" Swivel & Tilt TV Wall Mounts', brand: 'Sony', price: 2450, comparePrice: 3200, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80', stock: 45, tag: 'Best Seller', query: 'mount' },
                { id: 'sub_acc_hdmi', name: 'Ultra High-Speed 4K/8K HDMI 2.1 & Optical Audio Cables', brand: 'Baseus', price: 1250, comparePrice: 1600, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80', stock: 80, tag: 'Gold Plated', query: 'hdmi cable' },
                { id: 'sub_acc_remote', name: 'OEM & Universal Smart Magic Voice Remotes', brand: 'Samsung', price: 1850, comparePrice: 2400, image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=400&q=80', stock: 30, tag: 'Original', query: 'remote' },
                { id: 'sub_acc_surge_tv', name: 'TV Micro-Controller Surge Protector & Spike Guard', brand: 'SmartVolt', price: 1650, comparePrice: 2100, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', stock: 60, query: 'surge protector' },
                { id: 'sub_acc_soundbar_stand', name: 'Soundbar Heavy Metal Wall Brackets & Speaker Stands', brand: 'Sony', price: 2200, comparePrice: 2800, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80', stock: 25, query: 'soundbar' },
              ],
            },
            {
              id: 'acc_ac',
              name: 'AC Installation & Protection',
              iconName: 'Wind',
              badge: 'Essential',
              description: 'Digital voltage stabilizers, pure insulated copper tubing, outdoor brackets and smart WiFi modules',
              subcategories: [
                { id: 'sub_acc_ac_stabilizer', name: 'AC Digital Servo Voltage Stabilizers (1.0 - 2.0 Ton)', brand: 'Walton', price: 7800, comparePrice: 9500, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80', stock: 35, tag: 'Recommended', query: 'voltage stabilizer' },
                { id: 'sub_acc_copper_pipes', name: '100% Pure Insulated Copper Piping Kits (10ft/15ft)', brand: 'General', price: 3500, comparePrice: 4200, image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80', stock: 50, tag: 'Pure Copper', query: 'copper' },
                { id: 'sub_acc_outdoor_bracket', name: 'Heavy Duty Powder-Coated Outdoor Compressor Brackets', brand: 'SmartVolt', price: 1750, comparePrice: 2300, image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80', stock: 40, tag: 'Anti-Rust', query: 'bracket' },
                { id: 'sub_acc_ac_wifi', name: 'Smart WiFi AC Universal Controller & Room Sensors', brand: 'Tuya Smart', price: 2900, comparePrice: 3600, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80', stock: 20, tag: 'IoT Smart', query: 'smart controller' },
                { id: 'sub_acc_rubber_pads', name: 'Heavy Duty Anti-Vibration Compressor Rubber Base Pads', brand: 'SmartVolt', price: 850, comparePrice: 1100, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80', stock: 90, query: 'rubber pad' },
              ],
            },
            {
              id: 'acc_refrigerator',
              name: 'Refrigerator Stands & Guards',
              iconName: 'Refrigerator',
              badge: 'Heavy Duty',
              description: 'Movable anti-rust trolley stands, digital voltage guards and odor freshness kits',
              subcategories: [
                { id: 'sub_acc_fridge_trolley', name: 'Adjustable Heavy-Duty Refrigerator Trolley Stands', brand: 'Walton', price: 2100, comparePrice: 2800, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', stock: 50, tag: 'Rust Proof', query: 'stand' },
                { id: 'sub_acc_fridge_guard', name: 'Refrigerator Digital Micro-Controller Surge Guard', brand: 'SmartVolt', price: 1450, comparePrice: 1900, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', stock: 65, tag: 'Safety', query: 'surge protector' },
                { id: 'sub_acc_water_filter', name: 'Refrigerator Inline Water Filters & Ice Maker Hose Kits', brand: 'Samsung', price: 1750, comparePrice: 2200, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', stock: 30, query: 'water filter' },
                { id: 'sub_acc_deodorizer', name: 'Activated Carbon Refrigerator Deodorizers & Fresh Packs', brand: 'SmartVolt', price: 650, comparePrice: 900, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', stock: 120, query: 'deodorizer' },
              ],
            },
            {
              id: 'acc_washing',
              name: 'Washing Machine Care & Stands',
              iconName: 'WashingMachine',
              badge: 'Care',
              description: 'Shock-absorbing anti-vibration feet, braided inlet hoses and all-weather covers',
              subcategories: [
                { id: 'sub_acc_wm_stand', name: 'Adjustable Front/Top Load Movable Washer Trolley', brand: 'Whirlpool', price: 2600, comparePrice: 3400, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80', stock: 40, tag: 'Heavy Duty', query: 'washer stand' },
                { id: 'sub_acc_wm_inlet', name: 'High-Pressure Braided Water Inlet & Drain Hose Kits', brand: 'LG', price: 950, comparePrice: 1300, image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80', stock: 75, query: 'hose' },
                { id: 'sub_acc_wm_cover', name: 'Waterproof Dust-Proof Heavy Oxford Fabric Covers', brand: 'SmartVolt', price: 1200, comparePrice: 1600, image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80', stock: 55, tag: 'Waterproof', query: 'cover' },
                { id: 'sub_acc_anti_vibration', name: 'Shock Absorbing Anti-Walking Rubber Feet Cups (Set of 4)', brand: 'SmartVolt', price: 750, comparePrice: 1050, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80', stock: 110, query: 'rubber feet' },
              ],
            },
            {
              id: 'acc_power_surge',
              name: 'Voltage Stabilizers & Power Gear',
              iconName: 'Zap',
              badge: 'Crucial',
              description: 'Automatic servo regulators, heavy multi-plug power strips and circuit breakers',
              subcategories: [
                { id: 'sub_acc_servo_avr', name: 'Automatic Servo Voltage Regulators (AVR 3kVA - 10kVA)', brand: 'Walton', price: 12500, comparePrice: 15000, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80', stock: 18, tag: 'Industrial', query: 'stabilizer' },
                { id: 'sub_acc_multi_plug', name: 'Surge Protected Heavy Multi-Plug Power Strips with Type-C', brand: 'Schneider Electric', price: 2150, comparePrice: 2700, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', stock: 85, tag: 'Surge Proof', query: 'power strip' },
                { id: 'sub_acc_mcb_breaker', name: 'MCB & RCBO Miniature Circuit Breakers & Isolators', brand: 'Schneider Electric', price: 1850, comparePrice: 2300, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', stock: 140, query: 'circuit breaker' },
                { id: 'sub_acc_inverter_cable', name: 'Pure Copper Heavy Gauge Battery & Inverter Cables', brand: 'SmartVolt', price: 1950, comparePrice: 2500, image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80', stock: 60, query: 'cable' },
              ],
            },
            {
              id: 'acc_smart_home',
              name: 'Smart Home Hubs & IoT Plugs',
              iconName: 'Cpu',
              badge: 'Smart Living',
              description: 'WiFi smart plugs with energy meters, universal IR blasters and sensors',
              subcategories: [
                { id: 'sub_acc_smart_plug', name: '16A Smart WiFi Power Plugs with Energy Monitoring', brand: 'Tuya Smart', price: 1350, comparePrice: 1800, image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80', stock: 70, tag: 'Tuya/Sonoff', query: 'smart plug' },
                { id: 'sub_acc_smart_hub', name: 'Universal Smart IR/RF Remote Control Blaster Hub', brand: 'Tuya Smart', price: 1950, comparePrice: 2500, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', stock: 45, tag: 'All-in-One', query: 'remote hub' },
                { id: 'sub_acc_smart_breaker', name: 'WiFi DIN-Rail Smart Energy Metering Breakers', brand: 'Tuya Smart', price: 2850, comparePrice: 3500, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', stock: 35, query: 'smart breaker' },
                { id: 'sub_acc_smart_sensor', name: 'Zigbee Door/Window & Motion Sensor Starter Kits', brand: 'Tuya Smart', price: 1650, comparePrice: 2200, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', stock: 50, query: 'sensor' },
              ],
            },
          ];

    return rawList.map((div: any) => ({
      ...div,
      icon: typeof div.icon === 'function' ? div.icon : resolveAccessoryIcon(div.iconName || div.icon || div.name),
    }));
  }, [tenant]);

  // Dynamic products mapped directly from backend items + accessories taxonomy
  const liveProducts = useMemo(() => {
    const baseItems = items.map((realItem) => {
      const price = Number(realItem.price || 0);
      const comparePrice = realItem.comparePrice ? Number(realItem.comparePrice) : undefined;
      const discount =
        realItem.badge ||
        (comparePrice && comparePrice > price
          ? `${Math.round(((comparePrice - price) / comparePrice) * 100)}% OFF`
          : 'Special Offer');

      const catName = realItem.category?.name || 'General';
      const brandName = realItem.brand?.name || 'Authorised';
      const warrantySpec = Array.isArray(realItem.specifications)
        ? realItem.specifications.find(
            (s: any) =>
              s &&
              s.key &&
              (s.key.toLowerCase().includes('warranty') || s.key.toLowerCase().includes('guarantee'))
          )?.value
        : undefined;
      const isCompressor = warrantySpec ? warrantySpec.toLowerCase().includes('compressor') : false;

      const tags =
        realItem.specifications &&
        Array.isArray(realItem.specifications) &&
        realItem.specifications.length > 0
          ? realItem.specifications.slice(0, 3).map((s: any) => `${s.value || s.key}`)
          : [catName, brandName];

      const catId = realItem.categoryId || realItem.category?.slug || 'general';

      return {
        id: realItem.id,
        slug: realItem.slug || realItem.id,
        title: realItem.title,
        price,
        comparePrice,
        discount,
        warranty: warrantySpec || 'Official Brand Warranty',
        warrantyType: isCompressor ? 'compressor' : 'brand',
        category: catName,
        catId,
        brand: brandName,
        rating: '4.9 / 5',
        tags,
        stockQuantity: Number(realItem.stockQuantity ?? 20),
        sku: realItem.sku || `SKU-${realItem.id.slice(-6).toUpperCase()}`,
        shortDescription: realItem.shortDescription || realItem.title,
        description: realItem.description,
        images:
          Array.isArray(realItem.images) && realItem.images.length > 0
            ? realItem.images
            : ['https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'],
        icon: getCategoryIcon(catName),
        isFeatured: Boolean(realItem.isFeatured),
        isAccessory: realItem.categoryId?.startsWith('acc_') || catName.toLowerCase().includes('accessori'),
      };
    });

    // Also ensure all accessory items from accessoriesTaxonomy are seamlessly merged if not already in baseItems
    const existingTitles = new Set(baseItems.map((b) => b.title.toLowerCase().trim()));
    const existingIds = new Set(baseItems.map((b) => b.id));

    const extraAccessories: any[] = [];
    accessoriesTaxonomy.forEach((div: any) => {
      (div.subcategories || []).forEach((sub: any) => {
        const subTitle = (sub.name || '').toLowerCase().trim();
        const subId = sub.id;
        if (!existingTitles.has(subTitle) && !existingIds.has(subId) && !existingIds.has(`item_${subId}`)) {
          const price = Number(sub.price || 1500);
          const comparePrice = sub.comparePrice ? Number(sub.comparePrice) : undefined;
          const discount =
            sub.tag ||
            (comparePrice && comparePrice > price
              ? `${Math.round(((comparePrice - price) / comparePrice) * 100)}% OFF`
              : 'Special Offer');

          extraAccessories.push({
            id: `item_${sub.id}`,
            slug: (sub.name || '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, ''),
            title: sub.name,
            price,
            comparePrice,
            discount,
            warranty: 'Official Brand Warranty',
            warrantyType: 'brand',
            category: div.name,
            catId: div.id,
            brand: sub.brand || 'SmartVolt',
            rating: '4.9 / 5',
            tags: [div.name, sub.brand || 'SmartVolt', sub.tag || 'Certified Accessory', sub.query || 'accessory'],
            stockQuantity: Number(sub.stock ?? 30),
            sku: `ACC-${sub.id.slice(-6).toUpperCase()}`,
            shortDescription: sub.description || `${sub.name} by ${sub.brand || 'SmartVolt'}. OEM certified electrical appliance hardware and accessory.`,
            description: `<p>Official <strong>${sub.name}</strong> manufactured by <strong>${sub.brand || 'SmartVolt'}</strong>. Designed for heavy duty usage, high thermal stability and certified durability with factory warranty.</p>`,
            images: [sub.image || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80'],
            icon: div.icon || Wrench,
            isFeatured: false,
            isAccessory: true,
          });
        }
      });
    });

    return [...baseItems, ...extraAccessories];
  }, [items, accessoriesTaxonomy]);

  // Featured product for hero block (Gree Dual Inverter or first item)
  const featuredHeroProduct = useMemo(() => {
    return (
      liveProducts.find(
        (p) =>
          p.isFeatured ||
          p.title.toLowerCase().includes('gree') ||
          p.title.toLowerCase().includes('inverter ac')
      ) ||
      liveProducts[0] || {
        id: 'hero_featured_ac',
        slug: 'gree-lomo-eco-1-5-ton-dual-inverter-smart-ac-gp-18lm',
        title: 'Gree Lomo-Eco 1.5 Ton Dual Inverter Smart AC (GP-18LM)',
        brand: 'Gree',
        price: 68500,
        comparePrice: 72000,
        discount: '5% OFF',
        warranty: '10-12 Years Compressor Warranty',
        warrantyType: 'compressor',
        tags: ['1.5 Ton', 'Dual Inverter', 'R32 Eco Gas'],
        images: [
          'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=800&q=80',
        ],
      }
    );
  }, [liveProducts]);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return liveProducts.filter((p) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchTags = Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q) || q.includes(t.toLowerCase()));
        const matchQuery = q.split(' ').some((word) => word.length > 2 && p.title.toLowerCase().includes(word));
        if (!matchTitle && !matchBrand && !matchCat && !matchTags && !matchQuery) return false;
      }

      // 2. Active Category filter
      if (activeCategoryFilter !== 'all') {
        const rootMatch = (rootCategories as any[]).find(
          (r) => r.id === activeCategoryFilter || r.rawId === activeCategoryFilter
        );
        const allowedIds = rootMatch?.descendantIds || [activeCategoryFilter];
        const target = activeCategoryFilter.toLowerCase();
        const match =
          allowedIds.includes(p.catId) ||
          p.catId === activeCategoryFilter ||
          p.category.toLowerCase().includes(target) ||
          p.title.toLowerCase().includes(target) ||
          target.includes(p.category.toLowerCase()) ||
          (activeCategoryFilter === 'accessories' && p.isAccessory) ||
          liveCategories.find((c) => c.id === activeCategoryFilter)?.name.toLowerCase() ===
            p.category.toLowerCase();
        if (!match) return false;
      }

      return true;
    });
  }, [liveProducts, searchQuery, activeCategoryFilter, liveCategories, rootCategories]);

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

  // Top 5 live search suggestions for instant dropdown preview
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return liveProducts
      .filter((p) => {
        return (
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
        );
      })
      .slice(0, 5);
  }, [liveProducts, searchQuery]);

  // Execute search and smooth scroll to catalog
  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearchFocused(false);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Brand-First & Accessories Cascading Menu Handlers
  const handleOpenBrandsMenu = (pinned: boolean = false) => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
    setActiveMenuType('brands');
    setActiveDropdownBrand({ id: 'all_brands', name: 'All Brands', isAll: true, _pinned: pinned });
    setActiveBrandInMenu((prev) => prev || partnerBrands[0]?.name || 'Samsung');
  };

  const handleToggleBrandsMenu = () => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
    if (activeMenuType === 'brands' && activeDropdownBrand?._pinned) {
      closeDropdown();
    } else {
      handleOpenBrandsMenu(true);
    }
  };

  const handleOpenAccessoriesMenu = (pinned: boolean = false) => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
    setActiveMenuType('accessories');
    setActiveDropdownBrand({ id: 'accessories', name: 'Accessories', _pinned: pinned });
    setActiveAccessoryId((prev) => prev || 'acc_tv_audio');
  };

  const handleToggleAccessoriesMenu = () => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
    if (activeMenuType === 'accessories' && activeDropdownBrand?._pinned) {
      closeDropdown();
    } else {
      handleOpenAccessoriesMenu(true);
    }
  };

  const handleOpenBrandDirect = (brand: any, pinned: boolean = false) => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
    setActiveMenuType('brands');
    setActiveBrandInMenu(brand.name);
    setActiveDropdownBrand({ ...brand, _pinned: pinned });
    const cats = brandTaxonomy.getForBrand(brand.name);
    setActiveHoverCategory(cats[0]?.name || null);
  };

  const handleToggleBrandDirect = (brand: any) => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
    const isCurrentlyActive =
      activeMenuType === 'brands' &&
      activeBrandInMenu.toLowerCase() === brand.name.toLowerCase();

    if (isCurrentlyActive && activeDropdownBrand?._pinned) {
      closeDropdown();
    } else {
      handleOpenBrandDirect(brand, true);
    }
  };

  const handleMouseEnterDropdown = () => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
  };

  const handleMouseLeaveDropdown = () => {
    if (activeDropdownBrand?._pinned) {
      return;
    }
    dropdownCloseTimerRef.current = setTimeout(() => {
      closeDropdown();
    }, 280);
  };

  const closeDropdown = () => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }
    setActiveMenuType(null);
    setActiveDropdownBrand(null);
    setActiveHoverCategory(null);
  };

  const handleSelectBrandInMenu = (brand: any) => {
    setActiveBrandInMenu(brand.name);
    const cats = brandTaxonomy.getForBrand(brand.name);
    setActiveHoverCategory(cats[0]?.name || null);
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategoryFilter(categoryId);
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterByBrandAndCategory = (brandName: string, categoryName: string) => {
    setSearchQuery(brandName);
    const matched = (rootCategories as any[]).find(
      (r) =>
        r.name.toLowerCase() === categoryName.toLowerCase() ||
        categoryName.toLowerCase().includes(r.name.toLowerCase()) ||
        r.name.toLowerCase().includes(categoryName.toLowerCase())
    );
    setActiveCategoryFilter(matched?.id || 'all');
    closeDropdown();
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterByBrandAndSubcategory = (
    brandName: string,
    categoryName: string,
    subcategoryName: string
  ) => {
    setSearchQuery(`${brandName} ${subcategoryName}`);
    setActiveCategoryFilter('all');
    closeDropdown();
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFilterByAccessorySubcategory = (
    accName: string,
    subName: string,
    query: string
  ) => {
    setSearchQuery(query || subName);
    setActiveCategoryFilter('all');
    closeDropdown();
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Order Tracking Submission Handler (Searches live database / partition)
  const handleTrackOrderSubmit = async (queryInput?: string) => {
    const q = (queryInput !== undefined ? queryInput : trackOrderInput).trim();
    if (!q) {
      setTrackOrderError('Please enter an order number (e.g. ORD-134229-9958 or ORD-SV-301)');
      return;
    }
    setTrackOrderLoading(true);
    setTrackOrderError(null);
    setTrackOrderResult(null);

    try {
      const res = await api.trackOrder(q, tenantSlug);
      if (res?.success && res.data) {
        setTrackOrderResult(res.data);
      } else {
        setTrackOrderError(
          res?.message || `No order found with number "${q}". Please check the order number or contact support.`
        );
      }
    } catch (err: any) {
      setTrackOrderError('Could not connect to tracking server. Please check your network or contact support.');
    } finally {
      setTrackOrderLoading(false);
    }
  };

  // Contact Us Message Submission Handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.phone.trim()) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        phone: '',
        subject: 'General Product Inquiry',
        message: '',
      });
    }, 4000);
  };

  // Selected Brand Object (defaults to activeBrandInMenu or first partner brand)
  const selectedBrandObj = useMemo(() => {
    const bName =
      activeBrandInMenu ||
      (activeDropdownBrand && !activeDropdownBrand.isAll && activeDropdownBrand.name) ||
      partnerBrands[0]?.name ||
      'Samsung';
    return (
      partnerBrands.find((b: any) => b.name.toLowerCase() === bName.toLowerCase()) || {
        name: bName,
        logo: resolveBrandLogo({ name: bName }),
      }
    );
  }, [activeBrandInMenu, activeDropdownBrand, partnerBrands]);

  // Categories for the currently active brand in mega menu
  const currentBrandCategories = useMemo(() => {
    if (!selectedBrandObj) return [];
    return brandTaxonomy.getForBrand(selectedBrandObj.name);
  }, [selectedBrandObj, brandTaxonomy]);

  const activeCategoryObj = useMemo(() => {
    if (!currentBrandCategories || currentBrandCategories.length === 0) return null;
    return (
      currentBrandCategories.find((c: any) => c.name === activeHoverCategory) ||
      currentBrandCategories[0]
    );
  }, [currentBrandCategories, activeHoverCategory]);

  // Live in-stock products matching open brand & category in dropdown
  const matchingDropdownProducts = useMemo(() => {
    if (!selectedBrandObj) return [];
    const bName = selectedBrandObj.name.toLowerCase();
    const cName = activeCategoryObj?.name?.toLowerCase() || '';
    return liveProducts
      .filter((p) => {
        const matchBrand = p.brand.toLowerCase() === bName || p.title.toLowerCase().includes(bName);
        if (!cName) return matchBrand;
        const matchCat =
          p.category.toLowerCase().includes(cName) ||
          cName.includes(p.category.toLowerCase()) ||
          p.title.toLowerCase().includes(cName);
        return matchBrand && matchCat;
      })
      .slice(0, 3);
  }, [liveProducts, selectedBrandObj, activeCategoryObj]);

  // Active Accessory Category Object
  const currentAccessoryObj = useMemo(() => {
    return (
      accessoriesTaxonomy.find((a: any) => a.id === activeAccessoryId) || accessoriesTaxonomy[0]
    );
  }, [activeAccessoryId, accessoriesTaxonomy]);

  // Live products matching active accessory category
  const matchingAccessoryProducts = useMemo(() => {
    if (!currentAccessoryObj) return [];
    const keyw = currentAccessoryObj.name.toLowerCase();
    return liveProducts
      .filter((p) => {
        const titleLower = p.title.toLowerCase();
        const catLower = p.category.toLowerCase();
        return (
          titleLower.includes(keyw) ||
          catLower.includes(keyw) ||
          keyw.includes(catLower) ||
          titleLower.includes('accessory') ||
          titleLower.includes('cable') ||
          titleLower.includes('remote') ||
          titleLower.includes('stabilizer') ||
          titleLower.includes('stand') ||
          titleLower.includes('bracket') ||
          titleLower.includes('filter') ||
          titleLower.includes('plug')
        );
      })
      .slice(0, 3);
  }, [liveProducts, currentAccessoryObj]);

  const activeEng = engineeringFeatures[activeEngineeringFeature] || engineeringFeatures[0];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT & FOCUSED PERK BAR */}
      <div className="bg-[#0b0f19] text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-semibold text-slate-300">24/7 Helpline:</span>
            <span className="font-bold text-white tracking-wide">
              {tenant?.settings?.phone || '09606 111 777'}
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">
              {tenant?.settings?.announcementText ||
                'Authorized Industrial & Smart Home Electrical Solutions'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Year-End Mega Festival: 0% EMI across 28 Banks & Free AC Installation</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & BRAND NAVIGATION */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            {/* Brand Logo */}
            <Link href={`/?tenant=${tenantSlug}`} className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-sm shadow-orange-600/30">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 block leading-tight">
                  {tenant?.name || tenant?.settings?.name || 'SmartVolt'}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block">
                  Electrical & Automation
                </span>
              </div>
            </Link>

            {/* 🔍 Responsive Search Box with Live Results Dropdown */}
            <div className="flex-1 max-w-xl hidden sm:block relative">
              <form onSubmit={handleExecuteSearch} className="relative w-full">
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 pointer-events-none text-slate-400">
                    <Search className="w-4 h-4 text-orange-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by product, brand, or model (e.g. Inverter AC, MCB, TV)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm rounded-full border border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-600 focus:bg-white focus:ring-2 focus:ring-orange-600/20 transition shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className="absolute right-20 text-slate-400 hover:text-slate-600 p-1"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-xs font-bold transition shadow-sm flex items-center gap-1 active:scale-95"
                  >
                    <span>Search</span>
                  </button>
                </div>
              </form>

              {/* Instant Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSearchFocused(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden divide-y divide-slate-100">
                    <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>Search suggestions for &ldquo;{searchQuery}&rdquo;</span>
                      <span className="text-orange-600 font-bold">{searchSuggestions.length} found</span>
                    </div>

                    {searchSuggestions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        No products found matching &ldquo;{searchQuery}&rdquo;. Try another search term.
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {searchSuggestions.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}?tenant=${tenantSlug}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex items-center gap-3 p-3 hover:bg-orange-50/70 transition group"
                          >
                            <img
                              src={
                                product.images?.[0] ||
                                'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-contain bg-white border border-slate-200 shrink-0 group-hover:scale-105 transition"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-orange-600 transition">
                                {product.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-medium">
                                  {product.category}
                                </span>
                                <span>•</span>
                                <span>{product.brand}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-black text-slate-900">
                                BDT {product.price.toLocaleString()}
                              </div>
                              {product.discount && (
                                <div className="text-[10px] text-orange-600 font-bold">
                                  {product.discount}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="p-2.5 bg-slate-50 text-center">
                      <button
                        type="button"
                        onClick={handleExecuteSearch}
                        className="w-full py-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-100/60 rounded-xl transition"
                      >
                        View All in Catalog &darr;
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions: Showrooms & Cart */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              <a
                href="#showrooms"
                className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-orange-600 transition flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="hidden xs:inline">Showrooms</span>
              </a>

              <Link
                href={`/checkout?tenant=${tenantSlug}`}
                className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm shadow-orange-600/30 transition active:scale-95"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                <span>Cart</span>
                <span className="bg-white text-orange-600 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {totalItems}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-3 sm:hidden relative">
            <form onSubmit={handleExecuteSearch} className="relative w-full">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-orange-600 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products or models (AC, TV, MCB)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-10 pr-20 py-2 rounded-full border border-slate-300 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-600 focus:bg-white focus:ring-2 focus:ring-orange-600/20 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-16 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-full text-xs font-bold transition shadow-sm active:scale-95"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Brand-First Cascading Dropdown Navigation Bar */}
        <div
          className="border-t border-slate-100 bg-white relative z-50"
          onMouseLeave={handleMouseLeaveDropdown}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-700 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* All Products button */}
            <button
              id="brand-btn-reset-all"
              onClick={() => {
                setSearchQuery('');
                setActiveCategoryFilter('all');
                closeDropdown();
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer shrink-0 ${
                activeCategoryFilter === 'all' && !searchQuery && !activeMenuType
                  ? 'bg-orange-600 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              All Products
            </button>

            {/* All Brands (26) Mega Dropdown Trigger */}
            <button
              id="brand-btn-all"
              type="button"
              onMouseEnter={() => handleOpenBrandsMenu()}
              onClick={() => handleToggleBrandsMenu()}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                activeMenuType === 'brands'
                  ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold shadow-xs'
                  : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-orange-600" />
              <span>All Brands ({partnerBrands.length})</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeMenuType === 'brands' ? 'rotate-180 text-orange-600' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Accessories Trigger (Right after All Brands as requested) */}
            <button
              id="brand-btn-accessories"
              type="button"
              onMouseEnter={() => handleOpenAccessoriesMenu()}
              onClick={() => handleToggleAccessoriesMenu()}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                activeMenuType === 'accessories'
                  ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold shadow-xs'
                  : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-orange-600" />
              <span>Accessories ({accessoriesTaxonomy.length})</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  activeMenuType === 'accessories' ? 'rotate-180 text-orange-600' : 'text-slate-400'
                }`}
              />
            </button>

            <div className="h-4 w-px bg-slate-200 shrink-0 mx-1" />

            {/* About Us Navigation Link */}
            <button
              id="nav-btn-about"
              type="button"
              onClick={() => {
                closeDropdown();
                setAboutModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer shrink-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>About</span>
            </button>

            {/* Contact Us Navigation Link */}
            <button
              id="nav-btn-contact"
              type="button"
              onClick={() => {
                closeDropdown();
                setContactModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer shrink-0 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-semibold flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
              <span>Contact Us</span>
            </button>

            {/* Track Your Order Navigation Link */}
            <button
              id="nav-btn-track-order"
              type="button"
              onClick={() => {
                closeDropdown();
                setTrackOrderModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1.5 text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200/90 font-bold shadow-2xs group"
            >
              <Truck className="w-3.5 h-3.5 text-orange-600 group-hover:scale-110 transition-transform" />
              <span>Track Your Order</span>
            </button>

            <div className="ml-auto shrink-0 flex items-center gap-4 pl-4 border-l border-slate-100">
              <a
                href="#showrooms"
                className="text-slate-500 hover:text-slate-900 transition flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Showrooms</span>
              </a>
            </div>
          </div>

          {/* Subtle Backdrop Dim Overlay when Dropdown is open */}
          {activeMenuType && (
            <div
              className="fixed inset-0 top-[110px] bg-slate-950/30 backdrop-blur-[1px] z-40 transition-opacity animate-in fade-in duration-150"
              onClick={closeDropdown}
            />
          )}

          {/* ============================================================== */}
          {/* 1. ALL BRANDS CASCADING MEGA DROPDOWN (VERTICAL LIST + SUBCATEGORIES) */}
          {/* ============================================================== */}
          {activeMenuType === 'brands' && (
            <div
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveDropdown}
              className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-b border-slate-200/90 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex flex-col lg:flex-row gap-5">
                  {/* Left Column: Vertical Brand List directly beneath "All Brands" */}
                  <div className="w-full lg:w-64 bg-slate-50/90 rounded-2xl p-2.5 border border-slate-200/80 shrink-0 flex flex-col">
                    <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 border-b border-slate-200/70">
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-orange-600" />
                        <span>All Brands ({partnerBrands.length})</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Scroll ▾</span>
                    </div>

                    {/* Scrollable vertical list of all 26 partner brands */}
                    <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                      {partnerBrands.map((b: any) => {
                        const isBrandActive =
                          selectedBrandObj?.name?.toLowerCase() === b.name.toLowerCase();
                        const logoSrc = resolveBrandLogo(b);
                        return (
                          <button
                            key={b.id || b.name}
                            type="button"
                            onMouseEnter={() => handleSelectBrandInMenu(b)}
                            onClick={() => handleSelectBrandInMenu(b)}
                            className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-left text-xs font-semibold cursor-pointer transition-all duration-150 ${
                              isBrandActive
                                ? 'bg-white text-orange-600 font-bold shadow-xs border border-slate-200/90 ring-1 ring-orange-500/20 translate-x-0.5'
                                : 'text-slate-700 hover:bg-white/80 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {logoSrc ? (
                                <img
                                  src={logoSrc}
                                  alt={b.name}
                                  className="h-4.5 max-w-[42px] object-contain filter shrink-0"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-md bg-orange-100 text-orange-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {b.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <span className="truncate">{b.name}</span>
                            </div>
                            <ChevronRight
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isBrandActive ? 'text-orange-600 translate-x-0.5' : 'text-slate-300'
                              } transition`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Side: Cascading Category & Subcategory panel for the active brand */}
                  {/* Exactly matches Screenshot 2 */}
                  <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Header bar matching Screenshot 2 */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          {resolveBrandLogo(selectedBrandObj) ? (
                            <img
                              src={resolveBrandLogo(selectedBrandObj)}
                              alt={selectedBrandObj.name}
                              className="h-7 max-w-[110px] object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 font-black text-xs flex items-center justify-center">
                              {selectedBrandObj.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 flex-wrap">
                              <span>{selectedBrandObj.name} Authorized Product Catalog</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                100% Genuine Direct Warranty
                              </span>
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              Select a category on the left, then hover or click subcategories on the right
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery(selectedBrandObj.name);
                              setActiveCategoryFilter('all');
                              closeDropdown();
                              const el = document.getElementById('products');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>View All {selectedBrandObj.name} Products</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={closeDropdown}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                            title="Close"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 2-Column Drilldown Body matching Screenshot 2 */}
                      <div className="flex flex-col md:flex-row gap-5">
                        {/* Sub-column 1: PRODUCT CATEGORIES */}
                        <div className="w-full md:w-60 bg-slate-50/70 rounded-2xl p-2.5 border border-slate-200/70 shrink-0 space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
                            Product Categories
                          </span>
                          {currentBrandCategories.map((cat: any) => {
                            const isCatActive = activeCategoryObj?.name === cat.name;
                            const IconComp = cat.icon || Zap;
                            return (
                              <button
                                key={cat.id || cat.name}
                                type="button"
                                onMouseEnter={() => setActiveHoverCategory(cat.name)}
                                onClick={() => setActiveHoverCategory(cat.name)}
                                className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-left text-xs font-semibold cursor-pointer transition ${
                                  isCatActive
                                    ? 'bg-white text-orange-600 font-bold shadow-xs border border-slate-200/90 ring-1 ring-orange-500/20'
                                    : 'text-slate-700 hover:bg-white/80 hover:text-slate-900'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <IconComp
                                    className={`w-4 h-4 shrink-0 ${
                                      isCatActive ? 'text-orange-600' : 'text-slate-400'
                                    }`}
                                  />
                                  <span className="truncate">{cat.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-md">
                                    {cat.subcategories?.length || 0}
                                  </span>
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 ${
                                      isCatActive ? 'text-orange-600 translate-x-0.5' : 'text-slate-300'
                                    } transition`}
                                  />
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Sub-column 2: Subcategories under activeCategoryObj.name */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-orange-500" />
                              <h4 className="text-sm font-bold text-slate-900">
                                Subcategories under {activeCategoryObj?.name}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleFilterByBrandAndCategory(
                                  selectedBrandObj.name,
                                  activeCategoryObj?.name || ''
                                )
                              }
                              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
                            >
                              <span>Explore all {activeCategoryObj?.name}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Subcategories Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {activeCategoryObj?.subcategories?.map((sub: any) => (
                              <button
                                key={sub.id || sub.name}
                                type="button"
                                onClick={() =>
                                  handleFilterByBrandAndSubcategory(
                                    selectedBrandObj.name,
                                    activeCategoryObj.name,
                                    sub.name
                                  )
                                }
                                className="p-3 rounded-xl border border-slate-200/80 hover:border-orange-500 hover:bg-orange-50/40 text-left transition group flex items-start justify-between gap-2"
                              >
                                <div>
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition block">
                                    {sub.name}
                                  </span>
                                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                                    Official {selectedBrandObj.name} factory authorized
                                  </span>
                                </div>
                                {sub.tag && (
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 shrink-0">
                                    {sub.tag}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>

                          {/* Matching Live In-Stock Products Preview */}
                          {matchingDropdownProducts.length > 0 && (
                            <div className="pt-3 border-t border-slate-100">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 block">
                                Matching In-Stock Appliances ({matchingDropdownProducts.length})
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {matchingDropdownProducts.map((prod: any) => (
                                  <Link
                                    key={prod.id}
                                    href={`/products/${prod.slug}?tenant=${tenantSlug}`}
                                    onClick={closeDropdown}
                                    className="p-2 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-orange-300 hover:shadow-xs transition flex items-center gap-2 group"
                                  >
                                    <img
                                      src={
                                        prod.images?.[0] ||
                                        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80'
                                      }
                                      alt={prod.title}
                                      className="w-9 h-9 object-contain rounded-lg bg-white p-0.5 border border-slate-200 shrink-0 group-hover:scale-105 transition"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[10.5px] font-bold text-slate-900 truncate group-hover:text-orange-600 transition">
                                        {prod.title}
                                      </div>
                                      <div className="text-[10px] font-black text-slate-800">
                                        BDT {prod.price.toLocaleString()}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. ACCESSORIES CASCADING MEGA DROPDOWN (VERTICAL LIST + SUBCATEGORIES) */}
          {/* ============================================================== */}
          {activeMenuType === 'accessories' && (
            <div
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveDropdown}
              className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-b border-slate-200/90 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex flex-col lg:flex-row gap-5">
                  {/* Left Column: Vertical List of Accessories Categories directly beneath "Accessories" */}
                  <div className="w-full lg:w-64 bg-slate-50/90 rounded-2xl p-2.5 border border-slate-200/80 shrink-0 flex flex-col">
                    <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 border-b border-slate-200/70">
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-orange-600" />
                        <span>Accessories ({accessoriesTaxonomy.length})</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Select ▾</span>
                    </div>

                    <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                      {accessoriesTaxonomy.map((acc: any) => {
                        const isAccActive = currentAccessoryObj?.id === acc.id;
                        const IconComp = acc.icon || Sliders;
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onMouseEnter={() => setActiveAccessoryId(acc.id)}
                            onClick={() => setActiveAccessoryId(acc.id)}
                            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold cursor-pointer transition-all duration-150 ${
                              isAccActive
                                ? 'bg-white text-orange-600 font-bold shadow-xs border border-slate-200/90 ring-1 ring-orange-500/20 translate-x-0.5'
                                : 'text-slate-700 hover:bg-white/80 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                  isAccActive
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'bg-slate-200/60 text-slate-500'
                                }`}
                              >
                                <IconComp className="w-3.5 h-3.5" />
                              </div>
                              <span className="truncate">{acc.name}</span>
                            </div>
                            <ChevronRight
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isAccActive ? 'text-orange-600 translate-x-0.5' : 'text-slate-300'
                              } transition`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Side: Cascading Accessory Items & Details */}
                  <div className="flex-1 bg-white rounded-2xl p-5 border border-slate-200/80 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Header bar */}
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                            <Wrench className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 flex-wrap">
                              <span>{currentAccessoryObj?.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                                {currentAccessoryObj?.badge || 'Original Genuine'}
                              </span>
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              {currentAccessoryObj?.description ||
                                'Certified OEM installation parts, stabilizers, stands & hardware accessories'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery(currentAccessoryObj?.name || 'Accessories');
                              setActiveCategoryFilter('all');
                              closeDropdown();
                              const el = document.getElementById('products');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <span>View All {currentAccessoryObj?.name}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={closeDropdown}
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                            title="Close"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories & Items Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {currentAccessoryObj?.subcategories?.map((sub: any) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() =>
                              handleFilterByAccessorySubcategory(
                                currentAccessoryObj.name,
                                sub.name,
                                sub.query
                              )
                            }
                            className="p-3 rounded-2xl border border-slate-200/80 hover:border-orange-500 hover:bg-orange-50/50 text-left transition group flex items-center gap-3 bg-white hover:shadow-md relative overflow-hidden"
                          >
                            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition">
                              {sub.image ? (
                                <img
                                  src={sub.image}
                                  alt={sub.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <Wrench className="w-6 h-6 text-slate-300" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {sub.brand && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                                    {sub.brand}
                                  </span>
                                )}
                                {sub.tag && (
                                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                    {sub.tag}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition line-clamp-2 leading-snug">
                                {sub.name}
                              </span>
                              <div className="flex items-center gap-2 pt-0.5 text-[11px]">
                                {sub.price ? (
                                  <span className="font-black text-orange-600">
                                    BDT {Number(sub.price).toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">In Stock</span>
                                )}
                                {sub.comparePrice && sub.comparePrice > sub.price && (
                                  <span className="text-[10px] text-slate-400 line-through">
                                    BDT {Number(sub.comparePrice).toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Bottom Live Products Preview */}
                      {matchingAccessoryProducts.length > 0 && (
                        <div className="pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 block">
                            Related In-Stock Appliances & Hardware ({matchingAccessoryProducts.length})
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {matchingAccessoryProducts.map((prod: any) => (
                              <Link
                                key={prod.id}
                                href={`/products/${prod.slug}?tenant=${tenantSlug}`}
                                onClick={closeDropdown}
                                className="p-2 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-orange-300 hover:shadow-xs transition flex items-center gap-2 group"
                              >
                                <img
                                  src={
                                    prod.images?.[0] ||
                                    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=200&q=80'
                                  }
                                  alt={prod.title}
                                  className="w-9 h-9 object-contain rounded-lg bg-white p-0.5 border border-slate-200 shrink-0 group-hover:scale-105 transition"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-[10.5px] font-bold text-slate-900 truncate group-hover:text-orange-600 transition">
                                    {prod.title}
                                  </div>
                                  <div className="text-[10px] font-black text-slate-800">
                                    BDT {prod.price.toLocaleString()}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            className="text-xs bg-orange-600 hover:bg-orange-700 font-bold px-3 py-1.5 rounded-xl ml-2 text-white transition shadow-sm"
          >
            Checkout Now
          </Link>
        </div>
      )}

      {/* 3. HERO SECTION - REDESIGNED VISUAL HIERARCHY WITH LARGE FLAGSHIP PRODUCT */}
      <section className="bg-[#0a1120] text-white border-y border-slate-800 relative overflow-hidden py-14 lg:py-20">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* LEFT COLUMN: HERO CONTENT & SINGLE SOLID ORANGE PRIMARY CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span>YEAR-END FESTIVAL · 0% EMI ACROSS 28 BANKS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
                {tenant?.settings?.heroTitle || 'Year-End Electronics Discount Festival 2026'}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                {tenant?.settings?.heroSubtitle ||
                  'Authorized direct factory-grade Inverter ACs, Smart Home Automation, and heavy industrial switchgear with 10-12 years official brand warranty.'}
              </p>

              {/* Action Buttons: 1 Solid Orange Primary CTA + 1 Subtle Text Link */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <a
                  href="#products"
                  className="px-8 py-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-black text-sm flex items-center gap-2.5 shadow-lg shadow-orange-600/30 transition duration-150"
                >
                  <span>Explore offers</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#engineering"
                  className="text-slate-400 hover:text-white font-semibold text-sm transition flex items-center gap-1.5 underline-offset-4 hover:underline"
                >
                  <span>See the engineering</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Trust highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 font-medium border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>10-12 Yrs Compressor Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free Installation & 10ft Pipe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>0% EMI on 28 Major Banks</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LARGE FLAGSHIP PRODUCT HERO SHOWCASE */}
            <div className="lg:col-span-5">
              <div className="bg-[#11192e]/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden backdrop-blur-md group">
                {/* Background Ambient Glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Top header row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    FLAGSHIP INVERTER AC
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {featuredHeroProduct.brand}
                  </span>
                </div>

                {/* Large Product Cutout Image */}
                <Link
                  href={`/products/${featuredHeroProduct.slug}?tenant=${tenantSlug}`}
                  className="block relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl bg-gradient-to-b from-slate-800/40 to-slate-900/60 p-4 border border-slate-700/50 overflow-hidden cursor-pointer my-2 flex items-center justify-center group-hover:border-orange-500/40 transition"
                >
                  <img
                    src={
                      featuredHeroProduct.images?.[0] ||
                      'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={featuredHeroProduct.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Product Title */}
                <Link
                  href={`/products/${featuredHeroProduct.slug}?tenant=${tenantSlug}`}
                  className="block text-base sm:text-lg font-bold text-white hover:text-orange-400 transition mt-3 line-clamp-1"
                >
                  {featuredHeroProduct.title}
                </Link>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-800 text-center">
                  <div>
                    <div className="text-base sm:text-lg font-black text-white">18,000</div>
                    <div className="text-[10px] text-slate-400 font-medium">BTU/h (1.5 Ton)</div>
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-white">3.45</div>
                    <div className="text-[10px] text-slate-400 font-medium">EER Energy Star</div>
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-black text-white">21 dB</div>
                    <div className="text-[10px] text-slate-400 font-medium">Silent Sleep</div>
                  </div>
                </div>

                {/* Price and CTA Button */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white">
                      BDT {featuredHeroProduct.price.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      12 × BDT {Math.round(featuredHeroProduct.price / 12).toLocaleString()}/mo (0% EMI)
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(featuredHeroProduct)}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-orange-600/30 flex items-center gap-1.5 shrink-0"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST & VALUE PILLARS STRIP (RIGHT BELOW HERO) */}
      <section className="bg-white border-b border-slate-200/90 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3 Core Trust Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                0%
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide">0% Interest EMI Facility</h5>
                <p className="text-xs text-slate-500 mt-0.5">Up to 12 months installment across 28 major banks in Bangladesh.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Truck className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide">Free AC Installation & Pipes</h5>
                <p className="text-xs text-slate-500 mt-0.5">Complimentary certified technician installation + 10ft pure copper tubing.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wide">Official Brand Warranty</h5>
                <p className="text-xs text-slate-500 mt-0.5">10-12 years compressor & official replacement guarantee across 64 districts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 5. PRODUCT CATALOG GRID (CLEAN WHITE BACKGROUND, 7-POINT STREAMLINED CARD) */}
      <section id="products" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wider">
                  OFFICIAL WARRANTY STORE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  100% Genuine Direct Factory
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
                <select className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 appearance-none pr-7 focus:outline-none cursor-pointer">
                  <option>Sort: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 0% EMI Tenure Filter Pills */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-slate-600 mr-2 whitespace-nowrap">0% EMI tenure</span>
            {[3, 6, 9, 12].map((tenure) => (
              <button
                key={tenure}
                onClick={() => setSelectedEmiTenure(tenure)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedEmiTenure === tenure
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tenure} months
              </button>
            ))}

            {activeCategoryFilter !== 'all' && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Filtered by:</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-600 text-white flex items-center gap-1.5">
                  <span>
                    {liveCategories.find((c) => c.id === activeCategoryFilter)?.name ||
                      activeCategoryFilter}
                  </span>
                  <X
                    onClick={() => setActiveCategoryFilter('all')}
                    className="w-3 h-3 cursor-pointer hover:opacity-80"
                  />
                </span>
              </div>
            )}
          </div>

          {/* Product Cards Grid: Exactly 7 elements per card */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 p-8">
              <p className="text-sm font-bold text-slate-600">
                No products found matching your current filter.
              </p>
              <button
                onClick={() => {
                  setActiveCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition"
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
                      {/* 1. Image Container with unified badges */}
                      <div className="relative aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 mb-4 overflow-hidden">
                        {/* Top-right unified energetic orange discount badge */}
                        {p.discount && (
                          <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-xs">
                            {p.discount}
                          </span>
                        )}

                        {/* Top-left subtle warranty badge */}
                        <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 backdrop-blur-sm text-slate-600 border border-slate-200/70 shadow-2xs">
                          {p.warrantyType === 'compressor' ? '12Y Compressor' : 'Official Warranty'}
                        </span>

                        <Link
                          href={`/products/${p.slug}?tenant=${tenantSlug}`}
                          className="w-full h-full flex items-center justify-center cursor-pointer"
                        >
                          {p.images && p.images.length > 0 && p.images[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <IconComponent className="w-16 h-16 stroke-[1.2] text-slate-600" />
                          )}
                        </Link>
                      </div>

                      {/* 2. Brand name (subtle uppercase text) */}
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        {p.brand}
                      </span>

                      {/* 3. Product title (max 2 lines clamped) */}
                      <Link
                        href={`/products/${p.slug}?tenant=${tenantSlug}`}
                        className="block text-sm font-bold text-slate-900 group-hover:text-orange-600 transition leading-snug line-clamp-2 min-h-[2.5rem]"
                        title={p.title}
                      >
                        {p.title}
                      </Link>

                      {/* 4. Exactly 2 key specs tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {p.tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 5, 6, 7. Pricing, Solid Orange Add to Cart CTA & Spec link */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-950">
                          BDT {p.price.toLocaleString()}
                        </span>
                        {p.comparePrice && p.comparePrice > p.price && (
                          <span className="text-xs text-slate-400 line-through">
                            BDT {p.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 font-medium mt-0.5 mb-3">
                        0% EMI · BDT {emiMonthly.toLocaleString()}/mo × {selectedEmiTenure}
                      </div>

                      {/* 6. Single Solid Orange Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(p)}
                        className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs sm:text-sm text-center transition shadow-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>

                      {/* 6b. Subtle secondary Spec sheet text link */}
                      <div className="text-center mt-2.5">
                        <Link
                          href={`/products/${p.slug}?tenant=${tenantSlug}`}
                          className="text-xs font-semibold text-slate-500 hover:text-orange-600 transition inline-flex items-center gap-1"
                        >
                          <span>View full spec sheet</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 6.5 AUTHORISED BRAND PARTNERS (DIRECTLY BELOW PRODUCTS SECTION) */}
      <section className="bg-slate-50/80 border-t border-slate-200/90 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-orange-600">
                  AUTHORISED BRAND PARTNERS ({partnerBrands.length})
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Official OEM Brand Network
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                100% genuine factory warranty, spare parts, and direct manufacturer service across Bangladesh.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-xl shadow-2xs">
              Click any brand logo to filter products above
            </span>
          </div>

          {/* All Brand Logos Displayed Together in a Clean Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
            {partnerBrands.map((b: any, idx: number) => {
              const logoSrc = resolveBrandLogo(b);
              return (
                <button
                  key={b.id || idx}
                  type="button"
                  onClick={() => {
                    setSearchQuery(b.name);
                    setActiveCategoryFilter('all');
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="h-16 px-4 py-2.5 flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white hover:border-orange-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  title={`Filter by ${b.name}`}
                  aria-label={b.name}
                >
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={b.name}
                      className="h-8 max-w-[95px] object-contain transition-all duration-300 filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                      onError={(e) => {
                        const key = (b.slug || b.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                        if (!e.currentTarget.src.includes(`/brands/${key}.svg`)) {
                          e.currentTarget.src = `/brands/${key}.svg`;
                        }
                      }}
                    />
                  ) : (
                    <div className="px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 font-black text-xs tracking-wide">
                      {b.name}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE ENGINEERING SHOWCASE (HIGH-TECH DARK BACKGROUND) */}
      <section id="engineering" className="bg-[#0a1120] text-white py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 block mb-2">
            INTERNAL ENGINEERING
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What is inside a smart inverter appliance
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
            Advanced compressor technology, patented Golden Fin anti-corrosive coating, and energy-efficient components built for extreme climate durability.
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
                      ? 'bg-slate-800 border-orange-500 text-white shadow-lg shadow-orange-500/10'
                      : 'bg-[#11192e]/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold">{feat.title}</span>
                  <span className="text-xs font-mono font-bold text-orange-400 ml-4 shrink-0">
                    {feat.metric}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Dynamic Feature Card */}
            <div className="lg:col-span-6 bg-[#11192e] rounded-3xl p-8 border border-slate-800 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

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
                <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
                  {activeEng.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800">
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80">
                  {activeEng.pill}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. AUTHORISED SHOWROOMS & SERVICE CENTERS (CLEAN WHITE BACKGROUND) */}
      <section id="showrooms" className="bg-white py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

            {/* City Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {availableCities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedShowroomCity(city)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    selectedShowroomCity.toLowerCase() === city.toLowerCase()
                      ? 'bg-slate-900 text-white shadow-sm'
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
            {liveShowrooms
              .filter(
                (s) =>
                  s.city.toLowerCase() === selectedShowroomCity.toLowerCase() ||
                  availableCities.length === 1
              )
              .map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition"
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
                      href={`tel:${(s.hotline || '09606111777').replace(/[^0-9+]/g, '')}`}
                      className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition"
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
                className="py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs text-center shadow-sm"
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

      {/* 10. FOOTER (DARK BACKGROUND & PAYMENT METHODS) */}
      <footer className="bg-[#0b0f19] text-slate-400 text-xs py-16 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                  <Zap className="w-4 h-4 fill-white text-white" />
                </div>
                <span className="text-base font-black text-white">
                  {tenant?.name || tenant?.settings?.name || 'SmartVolt Electrical & Automation'}
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {tenant?.settings?.slogan ||
                  tenant?.settings?.announcementText ||
                  "Bangladesh's trusted authorised retail platform for smart inverter air conditioners, refrigerators and major home appliances."}
              </p>
              <div className="font-bold text-white pt-1">
                Helpline: {tenant?.settings?.phone || '09606 111 777'}
              </div>
              {(tenant?.settings?.dbidRegistrationNo || tenant?.settings?.tradeLicenseNo) && (
                <div className="text-[11px] text-slate-400 space-y-0.5 font-mono pt-1">
                  {tenant?.settings?.dbidRegistrationNo && (
                    <div>
                      DBID Reg:{' '}
                      <span className="text-emerald-400 font-bold">
                        {tenant.settings.dbidRegistrationNo}
                      </span>
                    </div>
                  )}
                  {tenant?.settings?.tradeLicenseNo && (
                    <div>
                      Trade License:{' '}
                      <span className="text-slate-300">{tenant.settings.tradeLicenseNo}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-black uppercase tracking-wider text-white mb-3">
                CATEGORIES
              </h4>
              <ul className="space-y-2 text-slate-400">
                {rootCategories.slice(0, 6).map((cat: any) => (
                  <li
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className="hover:text-white cursor-pointer"
                  >
                    {cat.name}
                  </li>
                ))}
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
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-black uppercase tracking-wider text-white mb-3">
                CORPORATE OFFICE
              </h4>
              <p className="text-slate-400 leading-relaxed">
                {tenant?.settings?.address || 'Nawabpur Road Electrical Market, Dhaka-1100, Bangladesh'}
              </p>
              <div className="mt-3 space-y-1">
                <div>{tenant?.settings?.email || 'support@smartvoltbd.com'}</div>
                <div>Open daily, 10:00 AM to 09:00 PM</div>
              </div>
            </div>
          </div>

          {/* Payment Methods Strip */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-slate-400">Accepted Payment Methods:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md bg-[#e2136e] text-white font-black text-[11px] shadow-xs">
                  bKash
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#f7941d] text-white font-black text-[11px] shadow-xs">
                  Nagad
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1a1f71] text-white font-black text-[11px] shadow-xs">
                  VISA
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#eb001b] text-white font-black text-[11px] shadow-xs">
                  Mastercard
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-bold text-[11px] border border-slate-700">
                  0% EMI (28 Banks)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-bold text-[11px] border border-slate-700">
                  Cash on Delivery
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              Official Helpline: <span className="font-bold text-white">09606 111 777</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-3">
            <div>
              © {new Date().getFullYear()}{' '}
              {tenant?.name || tenant?.settings?.name || 'SmartVolt Electrical & Automation'}. All rights
              reserved.
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link href={`/policies/terms?tenant=${tenantSlug}`} className="hover:text-slate-300 underline">
                Terms of Service
              </Link>
              <span>•</span>
              <Link href={`/policies/privacy?tenant=${tenantSlug}`} className="hover:text-slate-300 underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                href={`/policies/refund-policy?tenant=${tenantSlug}`}
                className="hover:text-slate-300 underline"
              >
                Refund Policy
              </Link>
              <span>•</span>
              <Link href={`/admin/dashboard?tenant=${tenantSlug}`} className="hover:text-slate-300 underline">
                Merchant Portal
              </Link>
              <span>•</span>
              <span>100% Genuine Seal</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE MODAL 1: TRACK YOUR ORDER (Live Fulfillment & Courier Waybill)
          ========================================================================= */}
      {trackOrderModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Truck className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                    Track Your Order
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">
                      Live Courier
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Real-time fulfillment and parcel tracking across Bangladesh
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrackOrderModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Search Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTrackOrderSubmit();
                }}
                className="space-y-3"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="track-order-modal-input"
                      type="text"
                      placeholder="Enter Order Number (e.g. ORD-134229-9958 or ORD-SV-301)"
                      value={trackOrderInput}
                      onChange={(e) => setTrackOrderInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    id="track-order-submit-btn"
                    type="submit"
                    disabled={trackOrderLoading}
                    className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shrink-0 shadow-sm shadow-orange-600/30 cursor-pointer"
                  >
                    {trackOrderLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Tracking...</span>
                      </>
                    ) : (
                      <>
                        <PackageCheck className="w-4 h-4" />
                        <span>Track Order</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Demo Order Chips for Instant Verification */}
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 pt-1">
                  <span className="font-semibold text-slate-600">Quick Test:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackOrderInput('ORD-134229-9958');
                      handleTrackOrderSubmit('ORD-134229-9958');
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 font-mono transition text-slate-700 cursor-pointer"
                  >
                    ORD-134229-9958 (Shipped)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackOrderInput('ORD-SV-301');
                      handleTrackOrderSubmit('ORD-SV-301');
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-slate-200 font-mono transition text-slate-700 cursor-pointer"
                  >
                    ORD-SV-301 (Delivered)
                  </button>
                </div>
              </form>

              {/* Error Notice */}
              {trackOrderError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Order Tracking Notice</span>
                  </div>
                  <p>{trackOrderError}</p>
                  <div className="pt-2 flex items-center gap-3 text-[11px]">
                    <a
                      href="tel:09606111777"
                      className="font-bold underline text-rose-900 hover:text-rose-700"
                    >
                      Call Support: 09606 111 777
                    </a>
                    <span>•</span>
                    <a
                      href="https://wa.me/8801812778899?text=Hello%20SmartVolt,%20I%20need%20help%20tracking%20my%20order"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline text-rose-900 hover:text-rose-700"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {/* Order Result Card */}
              {trackOrderResult && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Top Status Banner */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                        Order Number
                      </div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        {trackOrderResult.orderNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Placed on{' '}
                        {new Date(trackOrderResult.createdAt || Date.now()).toLocaleDateString(
                          'en-GB',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-start sm:items-end justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                          (trackOrderResult.orderStatus || '').toUpperCase() === 'DELIVERED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : (trackOrderResult.orderStatus || '').toUpperCase() === 'SHIPPED'
                            ? 'bg-blue-50 text-blue-700 border-blue-300'
                            : (trackOrderResult.orderStatus || '').toUpperCase() === 'CONFIRMED'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {trackOrderResult.orderStatus || 'PENDING'}
                      </span>
                      <span className="text-xs font-bold text-slate-900 mt-1">
                        BDT {(trackOrderResult.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Timeline Stepper */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-4 flex items-center justify-between">
                      <span>Fulfillment & Delivery Progress</span>
                      {trackOrderResult.trackingCode && (
                        <span className="text-[11px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          Tracking: {trackOrderResult.trackingCode}
                        </span>
                      )}
                    </h4>

                    {/* Timeline steps */}
                    {(() => {
                      const st = (trackOrderResult.orderStatus || '').toUpperCase();
                      const stepIndex =
                        st === 'DELIVERED'
                          ? 4
                          : st === 'SHIPPED'
                          ? 3
                          : st === 'CONFIRMED'
                          ? 2
                          : 1;

                      const steps = [
                        { label: 'Order Placed', desc: 'Received & Logged' },
                        { label: 'Confirmed', desc: 'Quality Check & Packing' },
                        {
                          label: 'Handed to Courier',
                          desc:
                            trackOrderResult.courier && trackOrderResult.courier !== 'Pending Assignment'
                              ? trackOrderResult.courier
                              : 'Steadfast Courier',
                        },
                        { label: 'Delivered', desc: 'Doorstep Received' },
                      ];

                      return (
                        <div className="grid grid-cols-4 gap-2 relative">
                          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
                          <div
                            className="absolute top-4 left-6 h-0.5 bg-orange-500 transition-all duration-500 -z-0"
                            style={{
                              width: `${((stepIndex - 1) / (steps.length - 1)) * 100}%`,
                            }}
                          />
                          {steps.map((step, idx) => {
                            const isDone = idx + 1 <= stepIndex;
                            const isCurrent = idx + 1 === stepIndex;
                            return (
                              <div key={idx} className="flex flex-col items-center text-center z-10">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                    isDone
                                      ? 'bg-orange-600 text-white shadow-sm ring-4 ring-orange-100'
                                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                                  }`}
                                >
                                  {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span
                                  className={`mt-2 text-xs font-bold leading-tight ${
                                    isCurrent ? 'text-orange-600' : isDone ? 'text-slate-800' : 'text-slate-400'
                                  }`}
                                >
                                  {step.label}
                                </span>
                                <span className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                                  {step.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Customer & Shipping Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                        <span>Shipping Destination</span>
                      </div>
                      <div className="text-slate-700 font-semibold">{trackOrderResult.customerName}</div>
                      <div className="text-slate-500 text-[11px]">{trackOrderResult.shippingAddress || 'Dhaka, Bangladesh'}</div>
                      <div className="text-slate-600 font-mono text-[11px]">{trackOrderResult.customerPhone}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-orange-600" />
                        <span>Logistics & Courier</span>
                      </div>
                      <div className="text-slate-700 font-semibold">
                        {trackOrderResult.courier && trackOrderResult.courier !== 'Pending Assignment'
                          ? trackOrderResult.courier
                          : 'Steadfast Courier (Express Parcel)'}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Payment: {trackOrderResult.paymentMethod || 'Cash on Delivery (COD)'}
                      </div>
                      {trackOrderResult.trackingCode && (
                        <div className="text-slate-800 font-mono text-[11px]">
                          Waybill: <span className="font-bold text-orange-700">{trackOrderResult.trackingCode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  {trackOrderResult.items && trackOrderResult.items.length > 0 && (
                    <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Order Items ({trackOrderResult.items.length})
                      </h4>
                      <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                        {trackOrderResult.items.map((it: any, idx: number) => (
                          <div key={idx} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              <span className="w-5 h-5 rounded bg-orange-100 text-orange-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                {it.quantity || 1}x
                              </span>
                              <span className="font-medium text-slate-800 truncate">
                                {it.itemTitle || it.title || 'Electronics Product'}
                              </span>
                            </div>
                            <span className="font-bold text-slate-900 shrink-0 font-mono">
                              BDT {(it.subtotal || it.price || 0).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full Invoice Button */}
                  <div className="pt-2 text-center">
                    <Link
                      href={`/order-success/${trackOrderResult.orderNumber}?tenant=${tenantSlug}`}
                      onClick={() => setTrackOrderModalOpen(false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-orange-400" />
                      <span>View Printable Invoice & Warranty Slip</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 2: ABOUT US (Company Credentials, OEM Deals, DBID)
          ========================================================================= */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-sm shadow-orange-600/30">
                  <Zap className="w-5 h-5 fill-white text-white" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                    About {tenant?.name || 'SmartVolt'}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      OEM Authorized
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Direct OEM Electrical & Smart Living Powerhouse in Bangladesh
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAboutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-slate-700">
              {/* Mission Statement */}
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 text-xs sm:text-sm leading-relaxed text-slate-800">
                <p>
                  <strong>SmartVolt Electrical & Automation</strong> is Bangladesh’s authorized multi-brand electronics powerhouse. Partnered directly with global brands including Samsung, Sony, LG, Gree, Walton, Schneider Electric, ABB, and Siemens, we supply 100% genuine consumer appliances, inverter HVAC solutions, and industrial-grade automation with full official warranty.
                </p>
              </div>

              {/* 4 Trust Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Genuine Certified</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Every product is directly sourced from official manufacturers, bearing authentic serials and guaranteed manufacturer warranty.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-orange-600" />
                    <span>Free Doorstep Installation</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Nationwide prompt delivery across all 64 districts with factory-certified installation technicians for ACs, TVs, and heavy appliances.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>0% EMI Across 28 Banks</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Enjoy up to 36 months 0% interest EMI payment facilities with all major credit cards including City AMEX, SCB, EBL, and BRAC Bank.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span>DBID & Govt. Verified</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Fully compliant with Ministry of Commerce Digital Business ID (DBID) and Municipal Electrical Trade Licensing standards.
                  </p>
                </div>
              </div>

              {/* Company Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-slate-900 text-white">
                  <div className="text-lg font-black text-orange-400">45+</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Showrooms</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 text-white">
                  <div className="text-lg font-black text-orange-400">250k+</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Customers</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 text-white">
                  <div className="text-lg font-black text-orange-400">100%</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">OEM Authentic</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-900 text-white">
                  <div className="text-lg font-black text-orange-400">24/7</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Helpline</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  Corporate HQ: <span className="font-bold text-slate-700">Nawabpur Electrical Market, Dhaka</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setAboutModalOpen(false);
                      const el = document.getElementById('showrooms');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition cursor-pointer"
                  >
                    View Showrooms
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAboutModalOpen(false);
                      setContactModalOpen(true);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
                  >
                    Contact Sales Desk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 3: CONTACT US (Hotline, WhatsApp, Email, Direct Form)
          ========================================================================= */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <PhoneCall className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                    Contact Us
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      24/7 Available
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Talk to our certified sales engineers or warranty support team
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Quick Contact Action Channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* 24/7 Hotline */}
                <a
                  href="tel:09606111777"
                  className="p-4 rounded-2xl bg-orange-50 border border-orange-200 hover:border-orange-400 transition group flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-orange-700 uppercase tracking-wider">
                      Official Hotline
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      09606 111 777
                    </div>
                    <div className="text-[11px] text-slate-500">Toll-free across Bangladesh</div>
                  </div>
                </a>

                {/* WhatsApp Chat */}
                <a
                  href="https://wa.me/8801812778899?text=Hello%20SmartVolt,%20I%20have%20an%20inquiry%20about%20your%20products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 transition group flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      WhatsApp Live Chat
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5">
                      +880 1812-778899
                    </div>
                    <div className="text-[11px] text-slate-500">Instant quotation & support</div>
                  </div>
                </a>

                {/* Corporate Email */}
                <a
                  href="mailto:support@smartvoltbd.com"
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition group flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Support Email
                    </div>
                    <div className="text-xs font-black text-slate-900 mt-0.5 break-all">
                      support@smartvoltbd.com
                    </div>
                    <div className="text-[11px] text-slate-500">Response within 2 hours</div>
                  </div>
                </a>

                {/* Corporate HQ */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Corporate Office
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      Nawabpur Electrical Market
                    </div>
                    <div className="text-[11px] text-slate-500">Dhaka-1100, Open daily 10AM-9PM</div>
                  </div>
                </div>
              </div>

              {/* Direct Message / Inquiry Form */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Send Quick Inquiry or Project Quotation Request
                </h4>

                {contactSubmitted ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold">Thank you! Your message has been received.</div>
                      <div className="text-[11px] text-emerald-700">
                        Our sales engineer will call you shortly on {contactForm.phone || 'your phone'}.
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          id="contact-form-name"
                          type="text"
                          required
                          placeholder="e.g. Tanvir Ahmed"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          id="contact-form-phone"
                          type="tel"
                          required
                          placeholder="e.g. 017XXXXXXXX"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Inquiry Subject
                      </label>
                      <select
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 bg-white"
                      >
                        <option value="General Product Inquiry">General Product Inquiry</option>
                        <option value="Inverter AC Free Installation Request">Inverter AC Free Installation Request</option>
                        <option value="Bulk Corporate / Project Purchase">Bulk Corporate / Project Purchase</option>
                        <option value="0% EMI Verification">0% EMI Verification</option>
                        <option value="Warranty & Service Support">Warranty & Service Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Message / Model Inquiry
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Please describe what product, model or service you need assistance with..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <button
                      id="contact-form-submit-btn"
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-sm shadow-orange-600/30 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
