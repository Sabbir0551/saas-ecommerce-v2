'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BUSINESS_CATEGORIES } from '@/lib/categories';
import { InventoryManager } from '@/components/InventoryManager';
import SaaSInvoiceModal from '@/components/SaaSInvoiceModal';
import RichTextEditor from '@/components/RichTextEditor';
import {
  Boxes,
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Stethoscope,
  Building2,
  Scissors,
  DollarSign,
  TrendingUp,
  Printer,
  Clock,
  CheckCircle,
  Package,
  Store,
  ArrowLeft,
  Layers,
  Plus,
  Trash2,
  ExternalLink,
  Settings,
  AlertCircle,
  Award,
  Laptop,
  Ban,
  ShieldCheck,
  Eye,
  EyeOff,
  Database,
  Save,
  Globe,
  Sliders,
  Sparkles,
  Tag,
  Filter,
  Image as ImageIcon,
  Search,
  Video,
  Play,
  Truck,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Share2,
  Pencil,
  Upload,
  X,
  Film,
  Check,
  ShoppingCart,
  Users,
  FileText,
  Mail,
  MessageSquare,
  Folder,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  BarChart3,
  LineChart,
  PieChart,
  LogOut,
  Zap,
  Shield,
  Rocket,
  Lock,
  KeyRound,
  ArrowRight,
  CreditCard,
  Wrench,
  Tv,
  Wind,
  Refrigerator,
  WashingMachine,
  Flame,
  Cpu,
  FileSpreadsheet,
  PhoneCall,
  RefreshCw,
  Target,
  Activity,
  Percent,
  ArrowDownRight,
  Copy,
  QrCode,
} from 'lucide-react';

const DEFAULT_ACCESSORIES_ADMIN = [
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
      { id: 'sub_acc_soundbar_stand', name: 'Soundbar Heavy Metal Wall Brackets & Speaker Stands', brand: 'Sony', price: 2200, comparePrice: 2800, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80', stock: 25, query: 'soundbar' }
    ]
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
      { id: 'sub_acc_rubber_pads', name: 'Heavy Duty Anti-Vibration Compressor Rubber Base Pads', brand: 'SmartVolt', price: 850, comparePrice: 1100, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80', stock: 90, query: 'rubber pad' }
    ]
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
      { id: 'sub_acc_deodorizer', name: 'Activated Carbon Refrigerator Deodorizers & Fresh Packs', brand: 'SmartVolt', price: 650, comparePrice: 900, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80', stock: 120, query: 'deodorizer' }
    ]
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
      { id: 'sub_acc_anti_vibration', name: 'Shock Absorbing Anti-Walking Rubber Feet Cups (Set of 4)', brand: 'SmartVolt', price: 750, comparePrice: 1050, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80', stock: 110, query: 'rubber feet' }
    ]
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
      { id: 'sub_acc_inverter_cable', name: 'Pure Copper Heavy Gauge Battery & Inverter Cables', brand: 'SmartVolt', price: 1950, comparePrice: 2500, image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80', stock: 60, query: 'cable' }
    ]
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
      { id: 'sub_acc_smart_sensor', name: 'Zigbee Door/Window & Motion Sensor Starter Kits', brand: 'Tuya Smart', price: 1650, comparePrice: 2200, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80', stock: 50, query: 'sensor' }
    ]
  }
];

function getAccessoryIcon(iconName: string = '') {
  switch (iconName?.toLowerCase()) {
    case 'tv':
      return <Tv className="w-5 h-5 text-orange-600" />;
    case 'wind':
      return <Wind className="w-5 h-5 text-sky-600" />;
    case 'refrigerator':
      return <Refrigerator className="w-5 h-5 text-cyan-600" />;
    case 'washingmachine':
      return <WashingMachine className="w-5 h-5 text-blue-600" />;
    case 'zap':
      return <Zap className="w-5 h-5 text-amber-500" />;
    case 'cpu':
      return <Cpu className="w-5 h-5 text-indigo-600" />;
    case 'flame':
      return <Flame className="w-5 h-5 text-rose-500" />;
    case 'shieldcheck':
      return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    default:
      return <Wrench className="w-5 h-5 text-amber-600" />;
  }
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  // Dynamic Category Archetype Resolution
  const matchedCategory = BUSINESS_CATEGORIES.find(
    (c) =>
      c.id === tenantInfo?.businessType ||
      c.demoSlug === tenantSlug ||
      c.id === tenantSlug ||
      tenantSlug?.toLowerCase().includes(c.id) ||
      (tenantInfo?.businessType && c.id.includes(tenantInfo.businessType))
  );

  const isMedical =
    tenantInfo?.businessType === 'healthcare_service' ||
    tenantInfo?.businessType === 'pharmacy' ||
    tenantSlug === 'medicare' ||
    tenantSlug === 'meradenralcare' ||
    matchedCategory?.archetype === 'APPOINTMENT_BOOKING' ||
    matchedCategory?.group === 'services';

  const isRealEstate =
    tenantInfo?.businessType === 'real_estate' ||
    tenantSlug === 'aebanproperty' ||
    matchedCategory?.archetype === 'LEAD_GEN_REAL_ESTATE' ||
    matchedCategory?.group === 'real_estate';

  const isElectronics =
    tenantInfo?.businessType === 'electronics' ||
    tenantSlug === 'bestlaptop' ||
    tenantSlug === 'gadgethub' ||
    tenantInfo?.businessType === 'laptop_computer' ||
    tenantSlug === 'smartvolt' ||
    tenantSlug?.toLowerCase().includes('electric') ||
    matchedCategory?.group === 'tech';

  const isFashion =
    tenantInfo?.businessType === 'fashion_clothing' ||
    tenantInfo?.businessType === 'jewelry' ||
    tenantInfo?.businessType === 'luxury_watches' ||
    tenantSlug === 'fashion' ||
    tenantSlug === 'gulshanfashion' ||
    (!isMedical && !isRealEstate && !isElectronics);

  const getArchetypeBadge = () => {
    if (isMedical) return { label: '🩺 Healthcare Clinic', color: 'bg-teal-950 text-teal-300 border-teal-800/60' };
    if (isRealEstate) return { label: '🏢 Luxury Real Estate', color: 'bg-amber-950 text-amber-300 border-amber-800/60' };
    if (isElectronics) return { label: '⚡ Electronics & POS', color: 'bg-indigo-950 text-indigo-300 border-indigo-800/60' };
    return { label: '👗 Fashion & Boutique', color: 'bg-rose-950 text-rose-300 border-rose-800/60' };
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedSheetDate, setSelectedSheetDate] = useState(todayStr);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'orders' | 'invoices' | 'customers' | 'inventory' | 'media' | 'products' | 'categories' | 'brands' | 'settings' | 'modules' | 'appointments' | 'showrooms' | 'subscription' | 'accessories'>('overview');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [customerTierFilter, setCustomerTierFilter] = useState<'all' | 'vip' | 'regular' | 'new' | 'risk' | 'blocked'>('all');
  const [selectedCustomerProfile, setSelectedCustomerProfile] = useState<any | null>(null);
  const [customerNotesMap, setCustomerNotesMap] = useState<Record<string, string>>({});
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('');
  const [invoicePaymentStatus, setInvoicePaymentStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [selectedA4Invoice, setSelectedA4Invoice] = useState<any | null>(null);
  const [selectedPosReceipt, setSelectedPosReceipt] = useState<any | null>(null);
  const [analyticsDateRange, setAnalyticsDateRange] = useState<'today' | '7days' | '30days' | 'this_month' | 'all'>('30days');
  const [analyticsChartMetric, setAnalyticsChartMetric] = useState<'revenue' | 'orders'>('revenue');
  const [productSubTab, setProductSubTab] = useState<'catalog' | 'accessories' | 'media'>('catalog');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [revenueMetric, setRevenueMetric] = useState<'MRR' | 'ARR'>('MRR');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Admin Authentication State & Security
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [adminLoginEmail, setAdminLoginEmail] = useState<string>(`admin@${tenantSlug}.com`);
  const [adminLoginPassword, setAdminLoginPassword] = useState<string>('admin@123');
  const [adminLoginLoading, setAdminLoginLoading] = useState<boolean>(false);
  const [adminLoginError, setAdminLoginError] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Merchant Subscription & Plan State
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState<boolean>(false);
  const [merchantRequestText, setMerchantRequestText] = useState('');
  const [merchantRequestNotice, setMerchantRequestNotice] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);

  useEffect(() => {
    async function loadTenantSubscriptionData() {
      try {
        setLoadingSubscription(true);
        const res = await api.getTenantSubscription(tenantSlug);
        if (res?.success && res.data) {
          setSubscriptionData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSubscription(false);
      }
    }
    loadTenantSubscriptionData();
  }, [tenantSlug, refreshTrigger]);

  // Electronics Showrooms state
  const [showroomsList, setShowroomsList] = useState<any[]>([
    {
      id: 'shw_1',
      city: 'Dhaka',
      name: 'Dhanmondi Flagship Experience Center',
      address: 'Plot 42, Road 27 (Old), Dhanmondi R/A, Dhaka-1209',
      phone: '09606 111 777 (Ext 101)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Engr. Tanvir Ahmed',
      isActive: true,
    },
    {
      id: 'shw_2',
      city: 'Dhaka',
      name: 'Uttara Smart Appliance Mega Store',
      address: 'Sector 3, Jasimuddin Avenue (Near North Tower), Uttara, Dhaka',
      phone: '09606 111 777 (Ext 102)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Mahfuzur Rahman',
      isActive: true,
    },
    {
      id: 'shw_3',
      city: 'Dhaka',
      name: 'Mirpur 10 Outlet & Service Hub',
      address: 'Main Road Roundabout, Mirpur 10, Dhaka-1216',
      phone: '09606 111 777 (Ext 103)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Kamrul Hasan',
      isActive: true,
    },
    {
      id: 'shw_4',
      city: 'Chittagong',
      name: 'Agrabad Commercial Showroom',
      address: 'Agrabad Commercial Area, CDA Avenue, Chattogram',
      phone: '09606 111 777 (Ext 201)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Nasir Uddin',
      isActive: true,
    },
    {
      id: 'shw_5',
      city: 'Chittagong',
      name: 'GEC Circle Electronics Hub',
      address: 'Sanmar Ocean City Ground Floor, GEC, Chattogram',
      phone: '09606 111 777 (Ext 202)',
      hours: '10:00 AM - 09:00 PM',
      manager: 'Shahed Chowdhury',
      isActive: true,
    },
    {
      id: 'shw_6',
      city: 'Sylhet',
      name: 'Zindabazar Premier Outlet',
      address: 'East Zindabazar, Baruthkhana Point, Sylhet',
      phone: '09606 111 777 (Ext 301)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Foyez Ahmed',
      isActive: true,
    },
    {
      id: 'shw_7',
      city: 'Khulna',
      name: 'KDA Avenue Experience Zone',
      address: 'Shibbari More, KDA Avenue, Khulna',
      phone: '09606 111 777 (Ext 401)',
      hours: '10:00 AM - 08:30 PM',
      manager: 'Rezaul Karim',
      isActive: true,
    },
  ]);
  const [newShowroomCity, setNewShowroomCity] = useState('Dhaka');
  const [newShowroomName, setNewShowroomName] = useState('');
  const [newShowroomAddress, setNewShowroomAddress] = useState('');
  const [newShowroomPhone, setNewShowroomPhone] = useState('09606 111 777');
  const [newShowroomManager, setNewShowroomManager] = useState('');
  const [newShowroomHours, setNewShowroomHours] = useState('10:00 AM - 09:00 PM');
  const [showAddShowroomModal, setShowAddShowroomModal] = useState(false);
  const [editingShowroom, setEditingShowroom] = useState<any | null>(null);
  const [editShowroomCity, setEditShowroomCity] = useState('Dhaka');
  const [editShowroomName, setEditShowroomName] = useState('');
  const [editShowroomAddress, setEditShowroomAddress] = useState('');
  const [editShowroomPhone, setEditShowroomPhone] = useState('');
  const [editShowroomManager, setEditShowroomManager] = useState('');
  const [editShowroomHours, setEditShowroomHours] = useState('10:00 AM - 09:00 PM');
  const [editShowroomIsActive, setEditShowroomIsActive] = useState(true);

  // Retail Showroom POS Terminal state
  const [posViewMode, setPosViewMode] = useState<'pos' | 'directory'>('pos');
  const [posSelectedBranch, setPosSelectedBranch] = useState('shw_1');
  const [posSearchQuery, setPosSearchQuery] = useState('');
  const [posCategoryFilter, setPosCategoryFilter] = useState('all');
  const [posCart, setPosCart] = useState<any[]>([]);
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('');
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [posPaymentMethod, setPosPaymentMethod] = useState<'cash' | 'bkash' | 'card' | 'split'>('cash');
  const [posCashTendered, setPosCashTendered] = useState<string>('');
  const [posTrxId, setPosTrxId] = useState('');
  const [posOrderSuccessNotice, setPosOrderSuccessNotice] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [stats, setStats] = useState<any>({
    totalOrders: 18,
    pendingOrders: 4,
    totalBookings: 12,
    totalRevenue: 84500,
  });

  const [tenantInfo, setTenantInfo] = useState<any>(null);
  const [dbInfo, setDbInfo] = useState<any>(null);

  // Products / Items state
  const [items, setItems] = useState<any[]>([]);
  const [prodTitle, setProdTitle] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('');
  const [prodBrandId, setProdBrandId] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodComparePrice, setProdComparePrice] = useState('');
  const [prodStock, setProdStock] = useState('20');
  const [prodType, setProdType] = useState<'PHYSICAL_PRODUCT' | 'SERVICE_APPOINTMENT' | 'DIGITAL_ITEM'>('PHYSICAL_PRODUCT');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodVideoUrl, setProdVideoUrl] = useState('');
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodBadge, setProdBadge] = useState('');
  const [prodVariants, setProdVariants] = useState('');
  const [prodSpecs, setProdSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: 'Warranty', value: 'Official Brand Warranty' },
  ]);
  const [activeCategorySchema, setActiveCategorySchema] = useState<any>(null);
  const [prodCustomAttributes, setProdCustomAttributes] = useState<Record<string, any>>({});
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [addingProd, setAddingProd] = useState(false);
  const [prodNotice, setProdNotice] = useState<string | null>(null);
  const [showAddProdModal, setShowAddProdModal] = useState(false);
  const [selectedProdCatFilter, setSelectedProdCatFilter] = useState('all');
  const [prodSearchQuery, setProdSearchQuery] = useState('');

  // Edit Product Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSaving, setEditingSaving] = useState(false);
  const [editSchema, setEditSchema] = useState<any>(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editForm, setEditForm] = useState<any>({
    id: '',
    title: '',
    categoryId: '',
    brandId: '',
    price: '',
    comparePrice: '',
    stockQuantity: '20',
    itemType: 'PHYSICAL_PRODUCT',
    shortDescription: '',
    badge: '',
    variants: '',
    images: [] as string[],
    videoUrl: '',
    isFeatured: false,
    specifications: [] as Array<{ key: string; value: string }>,
    customAttributes: {} as Record<string, any>,
  });

  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPromoSlogan, setNewCatPromoSlogan] = useState('');
  const [newCatBannerImage, setNewCatBannerImage] = useState('');
  const [newCatParentId, setNewCatParentId] = useState('');
  const [addingCat, setAddingCat] = useState(false);
  const [catNotice, setCatNotice] = useState<string | null>(null);

  // Category Edit state
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatPromoSlogan, setEditCatPromoSlogan] = useState('');
  const [editCatParentId, setEditCatParentId] = useState('');
  const [savingEditCat, setSavingEditCat] = useState(false);

  // Brands state
  const [brands, setBrands] = useState<any[]>([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');
  const [newBrandIsVisible, setNewBrandIsVisible] = useState(true);
  const [addingBrand, setAddingBrand] = useState(false);
  const [brandNotice, setBrandNotice] = useState<string | null>(null);

  // Brand Edit state
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editBrandLogo, setEditBrandLogo] = useState('');
  const [editBrandIsVisible, setEditBrandIsVisible] = useState(true);
  const [savingEditBrand, setSavingEditBrand] = useState(false);

  // Settings state
  const [storeName, setStoreName] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);

  // Master Setup & Integrations state
  const [metaPixelId, setMetaPixelId] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappWelcomeMsg, setWhatsappWelcomeMsg] = useState('');
  const [steadfastApiKey, setSteadfastApiKey] = useState('');
  const [steadfastSecretKey, setSteadfastSecretKey] = useState('');
  const [pathaoStoreId, setPathaoStoreId] = useState('');
  const [pathaoClientId, setPathaoClientId] = useState('');
  const [pathaoClientSecret, setPathaoClientSecret] = useState('');
  const [dbidRegistrationNo, setDbidRegistrationNo] = useState('');
  const [tradeLicenseNo, setTradeLicenseNo] = useState('');

  // Appointment Sheet state
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [loadingSheet, setLoadingSheet] = useState(false);

  // Orders & Bookings state
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilterStatus, setOrderFilterStatus] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderNotice, setOrderNotice] = useState<string | null>(null);
  const [orderDatePreset, setOrderDatePreset] = useState<'all' | 'today' | 'yesterday' | '7days' | 'this_month' | 'custom'>('all');
  const [orderStartDate, setOrderStartDate] = useState('');
  const [orderEndDate, setOrderEndDate] = useState('');
  const [convertingOrderId, setConvertingOrderId] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [creatingManualOrder, setCreatingManualOrder] = useState(false);
  const [manualDeliveryMethod, setManualDeliveryMethod] = useState<'COURIER_DELIVERY' | 'EXPRESS_DELIVERY' | 'SHOWROOM_PICKUP'>('COURIER_DELIVERY');
  const [manualOrderSource, setManualOrderSource] = useState<'PHONE_CALL' | 'WHATSAPP' | 'FACEBOOK' | 'SHOWROOM_COUNTER'>('PHONE_CALL');
  const [manualPaymentMethod, setManualPaymentMethod] = useState('COD');
  const [manualSelectedItemId, setManualSelectedItemId] = useState('');
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState('');
  const [manualCustomerEmail, setManualCustomerEmail] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualCity, setManualCity] = useState('Dhaka Metro');
  const [manualItemTitle, setManualItemTitle] = useState('');
  const [manualVariantTitle, setManualVariantTitle] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualQuantity, setManualQuantity] = useState('1');
  const [manualDeliveryCharge, setManualDeliveryCharge] = useState('60');
  const [manualCourier, setManualCourier] = useState('Steadfast Courier');
  const [manualTracking, setManualTracking] = useState('');
  const [manualNotes, setManualNotes] = useState('');
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);
  // Fraud Prevention, Device, Geolocation & Blacklist States
  const [mapModalOrder, setMapModalOrder] = useState<any | null>(null);
  const [blockModalOrder, setBlockModalOrder] = useState<any | null>(null);
  const [blockReason, setBlockReason] = useState('Fraudulent order / Repeated cancellations and returns');
  const [isBlocking, setIsBlocking] = useState(false);
  const [fraudFilterTab, setFraudFilterTab] = useState<'all' | 'high_risk' | 'blocked' | 'trusted'>('all');
  const [customerHistoryModal, setCustomerHistoryModal] = useState<any | null>(null);
  const [customerHistoryLoading, setCustomerHistoryLoading] = useState(false);

  // Automated 1-Click Courier Logistics & Consignment States
  const [dispatchModalOrder, setDispatchModalOrder] = useState<any | null>(null);
  const [dispatchCourierName, setDispatchCourierName] = useState<string>('Steadfast Courier');
  const [dispatchCodAmount, setDispatchCodAmount] = useState<string>('');
  const [dispatchParcelWeight, setDispatchParcelWeight] = useState<string>('1.0');
  const [dispatchDeliveryType, setDispatchDeliveryType] = useState<string>('STANDARD_DELIVERY');
  const [dispatchNotes, setDispatchNotes] = useState<string>('Handle with care - Fragile electronics');
  const [dispatchingLoading, setDispatchingLoading] = useState<boolean>(false);
  const [printLabelOrder, setPrintLabelOrder] = useState<any | null>(null);
  const [trackModalOrder, setTrackModalOrder] = useState<any | null>(null);
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [trackingLoading, setTrackingLoading] = useState<boolean>(false);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  // Media & Video Gallery state
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategoryId, setMediaCategoryId] = useState('all');
  const [mediaType, setMediaType] = useState<'YOUTUBE' | 'FACEBOOK' | 'IMAGE' | 'DIRECT_VIDEO'>('YOUTUBE');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [addingMedia, setAddingMedia] = useState(false);
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);
  const [mediaFilterCategory, setMediaFilterCategory] = useState('all');

  // Accessories Catalog & Megamenu State
  const [accessoriesList, setAccessoriesList] = useState<any[]>(DEFAULT_ACCESSORIES_ADMIN);
  const [accessoriesNotice, setAccessoriesNotice] = useState<string | null>(null);
  const [savingAccessories, setSavingAccessories] = useState<boolean>(false);
  const [showAddDivisionModal, setShowAddDivisionModal] = useState<boolean>(false);
  const [editingDivision, setEditingDivision] = useState<any | null>(null);
  const [divisionForm, setDivisionForm] = useState({
    name: '',
    iconName: 'Wrench',
    badge: 'Certified',
    description: '',
  });
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [targetDivisionId, setTargetDivisionId] = useState<string>('');
  const [itemForm, setItemForm] = useState({
    name: '',
    brandId: '',
    brandName: '',
    image: '',
    price: '',
    comparePrice: '',
    stock: '25',
    tag: '',
    description: '',
    query: '',
  });
  const [showEditAccessoryModal, setShowEditAccessoryModal] = useState<boolean>(false);
  const [editAccessoryTargetDivId, setEditAccessoryTargetDivId] = useState<string>('');
  const [editAccessoryForm, setEditAccessoryForm] = useState({
    id: '',
    name: '',
    brandId: '',
    brandName: '',
    image: '',
    price: '',
    comparePrice: '',
    stock: '25',
    tag: '',
    description: '',
    query: '',
  });

  // Check Admin Authentication Session
  useEffect(() => {
    setAdminLoginEmail(`admin@${tenantSlug}.com`);
    setAdminLoginPassword('admin@123');
    setAdminLoginError('');

    if (typeof window !== 'undefined') {
      try {
        const stored = 
          localStorage.getItem(`admin_auth_${tenantSlug}`) || 
          localStorage.getItem('admin_auth') || 
          localStorage.getItem('superadmin_auth');

        if (stored) {
          const parsed = JSON.parse(stored);
          const user = parsed?.user || parsed?.data?.user || parsed;
          if (user && (user.email || user.name)) {
            setAdminUser(user);
            setIsAdminAuthenticated(true);
          } else {
            setIsAdminAuthenticated(false);
          }
        } else {
          setIsAdminAuthenticated(false);
        }
      } catch {
        setIsAdminAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    }
  }, [tenantSlug]);

  const handleDashboardAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAdminLoginLoading(true);
    setAdminLoginError('');
    try {
      const res = await api.login({
        email: adminLoginEmail,
        password: adminLoginPassword,
        tenantSlug,
        role: 'TENANT_ADMIN',
      });
      if (res?.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(`admin_auth_${tenantSlug}`, JSON.stringify(res.data));
          localStorage.setItem('admin_auth', JSON.stringify(res.data));
        }
        setAdminUser(res.data.user);
        setIsAdminAuthenticated(true);
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setAdminLoginError(res?.message || 'Invalid email or password. Default: admin@123');
      }
    } catch (err: any) {
      setAdminLoginError('Authentication service unreachable.');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleDashboardAdminLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`admin_auth_${tenantSlug}`);
      localStorage.removeItem('admin_auth');
    }
    setIsAdminAuthenticated(false);
    setAdminUser(null);
    setShowProfileMenu(false);
  };

  useEffect(() => {
    async function loadTenantData() {
      try {
        const [tenantRes, catRes, brandRes, summaryRes, dbRes, itemsRes, ordersRes, mediaRes] = await Promise.all([
          api.getTenant(tenantSlug),
          api.getTenantCategories(tenantSlug),
          api.getBrands(tenantSlug),
          api.getDashboardSummary(tenantSlug),
          api.getTenantDbStatus(tenantSlug),
          api.getItems({}, tenantSlug),
          api.getOrders({}, tenantSlug),
          api.getMedia({}, tenantSlug),
        ]);

        if (tenantRes?.success && tenantRes.data) {
          const t = tenantRes.data;
          setTenantInfo(t);
          setStoreName(t.name || t.settings?.name || '');
          setStorePhone(t.phone || t.settings?.phone || '');
          setStoreEmail(t.email || t.settings?.email || '');
          setStoreAddress(t.address || t.settings?.address || '');
          setAnnouncementText(t.announcementText || t.settings?.announcementText || t.settings?.slogan || 'Special Launch Offer! Free express delivery across the country on all orders');
          setHeroTitle(t.settings?.heroTitle || t.heroTitle || 'Year-End Electronics Discount Festival 2026');
          setHeroSubtitle(t.settings?.heroSubtitle || t.heroSubtitle || 'Authorized Direct Factory-Grade Inverter ACs, Smart Home Automation, and Heavy Industrial Switchgear with Official Brand Warranty.');
          setMetaPixelId(t.settings?.metaPixelId || '');
          setGoogleAnalyticsId(t.settings?.googleAnalyticsId || '');
          setCustomDomain(t.settings?.customDomain || t.customDomain || '');
          setWhatsappNumber(t.settings?.whatsappNumber || t.phone || '');
          setWhatsappWelcomeMsg(t.settings?.whatsappWelcomeMsg || '');
          setSteadfastApiKey(t.settings?.steadfastApiKey || '');
          setSteadfastSecretKey(t.settings?.steadfastSecretKey || '');
          setPathaoStoreId(t.settings?.pathaoStoreId || '');
          setPathaoClientId(t.settings?.pathaoClientId || '');
          setPathaoClientSecret(t.settings?.pathaoClientSecret || '');
          setDbidRegistrationNo(t.settings?.dbidRegistrationNo || '');
          setTradeLicenseNo(t.settings?.tradeLicenseNo || '');
          if (t.settings?.showrooms && Array.isArray(t.settings.showrooms) && t.settings.showrooms.length > 0) {
            setShowroomsList(t.settings.showrooms);
          }
          if (t.settings?.accessories && Array.isArray(t.settings.accessories) && t.settings.accessories.length > 0) {
            setAccessoriesList(t.settings.accessories);
          }
        }
        if (ordersRes?.success && Array.isArray(ordersRes.data)) {
          setOrders(ordersRes.data);
        }
        if (mediaRes?.success && Array.isArray(mediaRes.data)) {
          setMediaItems(mediaRes.data);
        }
        if (catRes?.success && Array.isArray(catRes.data)) {
          setCategories(catRes.data);
          if (catRes.data.length > 0 && !prodCategoryId) {
            setProdCategoryId(catRes.data[0].id || catRes.data[0].slug);
          }
        }
        if (brandRes?.success && Array.isArray(brandRes.data)) {
          setBrands(brandRes.data);
          if (brandRes.data.length > 0 && !prodBrandId) {
            setProdBrandId(brandRes.data[0].id || brandRes.data[0].slug);
          }
        }
        if (itemsRes?.success && Array.isArray(itemsRes.data)) {
          setItems(itemsRes.data);
        }
        if (summaryRes?.success && summaryRes.data) {
          setStats(summaryRes.data);
        }
        if (dbRes?.success && dbRes.data) {
          setDbInfo(dbRes.data);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    }
    loadTenantData();
  }, [tenantSlug, refreshTrigger]);

  const refreshCatalogItems = async () => {
    try {
      const itemsRes = await api.getItems({}, tenantSlug);
      if (itemsRes?.success && Array.isArray(itemsRes.data)) {
        setItems(itemsRes.data);
      }
    } catch (err) {
      console.error('Error refreshing items:', err);
    }
  };

  useEffect(() => {
    async function loadSheet() {
      setLoadingSheet(true);
      try {
        const res = await api.getDailyAppointmentsSheet(selectedSheetDate, tenantSlug);
        if (res?.success && res.data?.appointments) {
          setSheetData(res.data.appointments);
        } else {
          setSheetData([
            {
              id: 'b-1',
              serialNumber: 1,
              customerName: 'Michael Anderson',
              customerPhone: '+1 555-019-2834',
              bookingDate: selectedSheetDate,
              bookingTime: '10:00 AM - 11:00 AM',
              status: 'CONFIRMED',
              item: { title: 'Senior Dental Consultation & Full OPG Screening' },
            },
            {
              id: 'b-2',
              serialNumber: 2,
              customerName: 'Sophia Reynolds',
              customerPhone: '+1 555-829-4721',
              bookingDate: selectedSheetDate,
              bookingTime: '11:00 AM - 12:00 PM',
              status: 'CONFIRMED',
              item: { title: '1-Hour Ultrasonic Scaling & Polishing' },
            },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSheet(false);
      }
    }
    loadSheet();
  }, [selectedSheetDate, tenantSlug]);

  // Load dynamic category schema when category selection changes
  useEffect(() => {
    async function loadSchemaForCategory() {
      if (!prodCategoryId) {
        setActiveCategorySchema(null);
        return;
      }
      setLoadingSchema(true);
      try {
        const selectedCat = categories.find((c) => c.id === prodCategoryId || c.slug === prodCategoryId);
        const catKey = selectedCat?.slug || prodCategoryId;
        const res = await api.getCategorySchema(catKey);
        if (res?.success && res.data) {
          setActiveCategorySchema(res.data);
          // Pre-populate with empty values for each field
          const initialAttrs: Record<string, any> = {};
          res.data.fields?.forEach((f: any) => {
            if (f.type === 'multiselect') initialAttrs[f.key] = [];
            else if (f.type === 'boolean') initialAttrs[f.key] = false;
            else initialAttrs[f.key] = '';
          });
          setProdCustomAttributes(initialAttrs);
        }
      } catch (err) {
        console.error('Failed to load category schema:', err);
      } finally {
        setLoadingSchema(false);
      }
    }
    loadSchemaForCategory();
  }, [prodCategoryId, categories]);

  // If user navigates to media tab, automatically route to products with media sub-tab
  useEffect(() => {
    if (activeTab === 'media') {
      setActiveTab('products');
      setProductSubTab('media');
    }
  }, [activeTab]);

  // Direct Image Upload Handler (with automatic client-side canvas compression for high-res device photos)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        if (!rawDataUrl) return;

        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            if (isEdit) {
              setEditForm((prev: any) => ({
                ...prev,
                images: [...(prev.images || []), optimizedDataUrl],
              }));
            } else {
              setProdImages((prev) => [...prev, optimizedDataUrl]);
            }
            return;
          }

          if (isEdit) {
            setEditForm((prev: any) => ({
              ...prev,
              images: [...(prev.images || []), rawDataUrl],
            }));
          } else {
            setProdImages((prev) => [...prev, rawDataUrl]);
          }
        };
        img.onerror = () => {
          if (isEdit) {
            setEditForm((prev: any) => ({
              ...prev,
              images: [...(prev.images || []), rawDataUrl],
            }));
          } else {
            setProdImages((prev) => [...prev, rawDataUrl]);
          }
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev: any) => ({
        ...prev,
        images: (prev.images || []).filter((_: any, idx: number) => idx !== indexToRemove),
      }));
    } else {
      setProdImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    }
  };

  // Open Edit Product Modal
  const handleOpenEditModal = async (item: any) => {
    const existingImages = Array.isArray(item.images)
      ? item.images
      : (item.images ? [item.images] : []);
    const existingVariants = Array.isArray(item.variants)
      ? item.variants.join(', ')
      : (typeof item.variants === 'string' ? item.variants : '');
    const existingSpecs = Array.isArray(item.specifications) && item.specifications.length > 0
      ? item.specifications
      : [{ key: 'Material', value: '' }];

    const catId = item.categoryId || item.category?.id || item.category?.slug || '';

    setEditForm({
      id: item.id,
      title: item.title || '',
      categoryId: catId,
      brandId: item.brandId || item.brand?.id || item.brand?.slug || '',
      price: item.price ? String(item.price) : '',
      comparePrice: item.comparePrice ? String(item.comparePrice) : '',
      stockQuantity: item.stockQuantity !== undefined ? String(item.stockQuantity) : '20',
      itemType: item.itemType || 'PHYSICAL_PRODUCT',
      shortDescription: item.shortDescription || '',
      badge: item.badge || '',
      variants: existingVariants,
      images: existingImages,
      videoUrl: item.videoUrl || '',
      isFeatured: Boolean(item.isFeatured),
      specifications: existingSpecs,
      customAttributes: item.customAttributes || {},
    });

    const selectedCat = categories.find((c) => c.id === catId || c.slug === catId);
    const schemaKey = selectedCat?.slug || catId || tenantSlug;
    try {
      const res = await api.getCategorySchema(schemaKey);
      if (res?.success && res.data) {
        setEditSchema(res.data);
      } else {
        setEditSchema(null);
      }
    } catch {
      setEditSchema(null);
    }

    setEditModalOpen(true);
  };

  const handleEditCategoryChange = async (newCatId: string) => {
    setEditForm((prev: any) => ({ ...prev, categoryId: newCatId }));
    const selectedCat = categories.find((c) => c.id === newCatId || c.slug === newCatId);
    const schemaKey = selectedCat?.slug || newCatId || tenantSlug;
    try {
      const res = await api.getCategorySchema(schemaKey);
      if (res?.success && res.data) {
        setEditSchema(res.data);
      } else {
        setEditSchema(null);
      }
    } catch {
      setEditSchema(null);
    }
  };

  // Save Edited Product
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id || !editForm.title.trim() || !editForm.price) return;
    setEditingSaving(true);
    try {
      const validSpecs = (editForm.specifications || []).filter((s: any) => s.key?.trim() && s.value?.trim());
      const variantList = typeof editForm.variants === 'string'
        ? editForm.variants.split(',').map((v: string) => v.trim()).filter(Boolean)
        : (Array.isArray(editForm.variants) ? editForm.variants : undefined);

      const payload = {
        title: editForm.title.trim(),
        categoryId: editForm.categoryId || undefined,
        brandId: editForm.brandId || undefined,
        price: parseFloat(editForm.price),
        comparePrice: editForm.comparePrice ? parseFloat(editForm.comparePrice) : undefined,
        stockQuantity: parseInt(editForm.stockQuantity, 10) || 0,
        itemType: editForm.itemType,
        shortDescription: editForm.shortDescription?.trim() || undefined,
        images: editForm.images?.length > 0 ? editForm.images : undefined,
        videoUrl: editForm.videoUrl?.trim() || undefined,
        isFeatured: editForm.isFeatured,
        badge: editForm.badge?.trim() || undefined,
        specifications: validSpecs.length > 0 ? validSpecs : undefined,
        customAttributes: editForm.customAttributes && Object.keys(editForm.customAttributes).length > 0
          ? editForm.customAttributes
          : undefined,
        variants: variantList && variantList.length > 0 ? variantList : undefined,
      };

      const res = await api.updateItem(editForm.id, payload, tenantSlug);
      if (res?.success && res.data) {
        setItems((prev) =>
          prev.map((it) => (it.id === editForm.id || it.slug === editForm.id ? { ...it, ...res.data } : it))
        );
        setEditModalOpen(false);
        setProdNotice(`Product "${res.data.title}" updated successfully!`);
        setTimeout(() => setProdNotice(null), 4000);
      } else {
        alert(res?.message || 'Failed to update product');
      }
    } catch (err: any) {
      console.error('Error updating product:', err);
      alert('Error updating product: ' + (err?.message || 'Server error'));
    } finally {
      setEditingSaving(false);
    }
  };

  // Product Actions
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodPrice) return;
    setAddingProd(true);
    try {
      const validSpecs = prodSpecs.filter((s) => s.key.trim() && s.value.trim());
      const variantList = prodVariants
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

      const allImages = prodImages.length > 0
        ? prodImages
        : (prodImage.trim() ? [prodImage.trim()] : undefined);

      const res = await api.addItem(
        {
          title: prodTitle.trim(),
          categoryId: prodCategoryId || undefined,
          brandId: prodBrandId || undefined,
          price: parseFloat(prodPrice),
          comparePrice: prodComparePrice ? parseFloat(prodComparePrice) : undefined,
          stockQuantity: parseInt(prodStock, 10) || 0,
          itemType: prodType,
          shortDescription: prodShortDesc.trim() || undefined,
          images: allImages,
          videoUrl: prodVideoUrl.trim() || undefined,
          isFeatured: prodIsFeatured,
          badge: prodBadge.trim() || undefined,
          specifications: validSpecs.length > 0 ? validSpecs : undefined,
          customAttributes: Object.keys(prodCustomAttributes).length > 0 ? prodCustomAttributes : undefined,
          variants: variantList.length > 0 ? variantList : undefined,
        },
        tenantSlug
      );

      if (res?.success && res.data) {
        setItems((prev) => [res.data, ...prev]);
        setProdTitle('');
        setProdPrice('');
        setProdComparePrice('');
        setProdShortDesc('');
        setProdImage('');
        setProdImages([]);
        setProdVideoUrl('');
        setProdBadge('');
        setProdVariants('');
        setShowAddProdModal(false);
        setProdNotice(`Product "${res.data.title}" successfully published to category!`);
        setTimeout(() => setProdNotice(null), 4000);
      } else {
        alert(res?.error || 'Failed to add product');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error creating product: ' + (err?.message || 'Server error'));
    } finally {
      setAddingProd(false);
    }
  };

  const handleExportCatalog = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ tenant: tenantSlug, categories, items, exportedAt: new Date().toISOString() }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `catalog_export_${tenantSlug}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the catalog?`)) return;
    try {
      const res = await api.deleteItem(id, tenantSlug);
      if (res?.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setProdNotice(`Product "${title}" deleted successfully.`);
        setTimeout(() => setProdNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Category Actions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      const res = await api.addCategory(
        {
          name: newCatName.trim(),
          promoSlogan: newCatPromoSlogan.trim() || undefined,
          bannerImage: newCatBannerImage.trim() || undefined,
          parentId: newCatParentId.trim() || undefined,
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setCategories((prev) => [...prev, res.data]);
        setNewCatName('');
        setNewCatPromoSlogan('');
        setNewCatBannerImage('');
        setNewCatParentId('');
        const isSub = Boolean(res.data.parentId);
        setCatNotice(isSub ? `Subcategory "${res.data.name}" created successfully!` : `Category "${res.data.name}" added successfully!`);
        setTimeout(() => setCatNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingCat(false);
    }
  };

  const handleEditCategoryOpen = (cat: any) => {
    setEditingCategory(cat);
    setEditCatName(cat.name || '');
    setEditCatPromoSlogan(cat.promoSlogan || '');
    setEditCatParentId(cat.parentId || '');
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) return;
    setSavingEditCat(true);
    try {
      const res = await api.updateCategory(
        editingCategory.id,
        {
          name: editCatName.trim(),
          promoSlogan: editCatPromoSlogan.trim() || undefined,
          parentId: editCatParentId.trim() ? editCatParentId.trim() : null,
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? { ...c, ...res.data } : c)));
        setEditingCategory(null);
        setCatNotice(`Category "${res.data.name}" updated successfully!`);
        setTimeout(() => setCatNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEditCat(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const res = await api.deleteCategory(id, tenantSlug);
      if (res?.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
        setCatNotice(`Category "${name}" deleted.`);
        setTimeout(() => setCatNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Brand Actions & File Upload
  const handleBrandLogoFile = (file: File, isEdit: boolean) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB. Please choose a smaller logo image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (isEdit) {
        setEditBrandLogo(result);
      } else {
        setNewBrandLogo(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    setAddingBrand(true);
    try {
      const res = await api.addBrand(
        {
          name: newBrandName.trim(),
          logo: newBrandLogo.trim() || undefined,
          isVisible: newBrandIsVisible,
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setBrands((prev) => [...prev, res.data]);
        setNewBrandName('');
        setNewBrandLogo('');
        setNewBrandIsVisible(true);
        setBrandNotice(`Brand "${res.data.name}" created successfully!`);
        setTimeout(() => setBrandNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingBrand(false);
    }
  };

  const handleEditBrandOpen = (brand: any) => {
    setEditingBrand(brand);
    setEditBrandName(brand.name || '');
    setEditBrandLogo(brand.logo || '');
    setEditBrandIsVisible(brand.isVisible !== false);
  };

  const handleUpdateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editBrandName.trim()) return;
    setSavingEditBrand(true);
    try {
      const res = await api.updateBrand(
        editingBrand.id,
        {
          name: editBrandName.trim(),
          logo: editBrandLogo.trim() || undefined,
          isVisible: editBrandIsVisible,
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setBrands((prev) =>
          prev.map((b) => (b.id === editingBrand.id ? { ...b, ...res.data } : b))
        );
        setEditingBrand(null);
        setBrandNotice(`Brand "${res.data.name}" updated successfully!`);
        setTimeout(() => setBrandNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEditBrand(false);
    }
  };

  const handleToggleBrandVisibility = async (brand: any) => {
    const nextVisibility = !(brand.isVisible !== false);
    try {
      const res = await api.updateBrand(
        brand.id,
        {
          name: brand.name,
          isVisible: nextVisibility,
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setBrands((prev) =>
          prev.map((b) => (b.id === brand.id ? { ...b, isVisible: nextVisibility } : b))
        );
        setBrandNotice(
          `Brand "${brand.name}" is now ${nextVisibility ? 'visible on' : 'hidden from'} storefront!`
        );
        setTimeout(() => setBrandNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete brand "${name}"?`)) return;
    try {
      const res = await api.deleteBrand(id, tenantSlug);
      if (res?.success) {
        setBrands((prev) => prev.filter((b) => b.id !== id && b.slug !== id));
        setBrandNotice(`Brand "${name}" removed.`);
        setTimeout(() => setBrandNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order Handlers
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: string,
    courier?: string,
    trackingCode?: string
  ) => {
    try {
      const res = await api.updateOrderStatus(
        orderId,
        {
          orderStatus: status,
          courier,
          trackingCode,
        },
        tenantSlug
      );
      if (res?.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  orderStatus: status,
                  ...(courier ? { courier } : {}),
                  ...(trackingCode !== undefined ? { trackingCode } : {}),
                }
              : o
          )
        );
        setOrderNotice(`Order status updated to "${status}"!`);
        setTimeout(() => setOrderNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockCustomer = async (order: any, customReason?: string) => {
    setIsBlocking(true);
    try {
      const targetPhone = order.customerPhone || order.phone;
      const targetEmail = order.customerEmail || order.email;
      const targetIp = order.ipAddress || order.clientIp || order.ip;
      const targetName = order.customerName || order.name;

      const res = await api.blockCustomer(
        {
          phone: targetPhone,
          email: targetEmail,
          ip: targetIp,
          customerName: targetName,
          reason: customReason || blockReason,
        },
        tenantSlug
      );

      if (res?.success) {
        // Refresh orders list
        const updatedOrdersRes = await api.getOrders({}, tenantSlug);
        if (updatedOrdersRes?.success && Array.isArray(updatedOrdersRes.data)) {
          setOrders(updatedOrdersRes.data);
        }
        setBlockModalOrder(null);
        setOrderNotice(`Customer "${targetName || targetPhone}" has been blocked.`);
        setTimeout(() => setOrderNotice(null), 3500);
      } else {
        alert(res?.message || 'Failed to block customer');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblockCustomer = async (target: any) => {
    const targetPhone = typeof target === 'string' ? target : (target?.customerPhone || target?.phone || '');
    const targetEmail = typeof target === 'object' ? (target?.customerEmail || target?.email) : undefined;
    const targetIp = typeof target === 'object' ? (target?.ipAddress || target?.clientIp || target?.ip) : undefined;
    const displayName = typeof target === 'string' ? target : (target?.customerName || target?.customerPhone || 'Customer');

    try {
      const res = await api.unblockCustomer(
        {
          phone: targetPhone,
          email: targetEmail,
          ip: targetIp,
        },
        tenantSlug
      );

      if (res?.success) {
        const updatedOrdersRes = await api.getOrders({}, tenantSlug);
        if (updatedOrdersRes?.success && Array.isArray(updatedOrdersRes.data)) {
          setOrders(updatedOrdersRes.data);
        }
        setOrderNotice(`Customer "${displayName}" has been unblocked.`);
        setTimeout(() => setOrderNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewCustomerHistory = async (phone: string, customerName: string) => {
    setCustomerHistoryLoading(true);
    setCustomerHistoryModal({ phone, customerName, loading: true });
    try {
      const res = await api.getCustomerHistory(phone, tenantSlug);
      if (res?.success && res.data) {
        setCustomerHistoryModal({
          phone,
          customerName,
          loading: false,
          ...res.data,
        });
      }
    } catch (err) {
      console.error(err);
      setCustomerHistoryModal({ phone, customerName, loading: false, orders: [] });
    } finally {
      setCustomerHistoryLoading(false);
    }
  };

  const handleConvertIncompleteOrder = async (orderId: string) => {
    try {
      setConvertingOrderId(orderId);
      const res = await api.convertIncompleteOrder(orderId, tenantSlug);
      if (res?.success) {
        // Refresh orders list
        const updated = await api.getOrders({}, tenantSlug);
        if (updated?.success && Array.isArray(updated.data)) {
          setOrders(updated.data);
        }
        setOrderNotice(`Incomplete order successfully converted to Confirmed Pending Order #${res.data?.orderNumber || ''}!`);
        setTimeout(() => setOrderNotice(null), 4000);
      } else {
        alert(res?.message || 'Failed to convert incomplete order');
      }
    } catch {
      alert('Error connecting to server to convert order');
    } finally {
      setConvertingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to dismiss/delete this incomplete order record?')) return;
    try {
      setDeletingOrderId(orderId);
      const res = await api.deleteOrder(orderId, tenantSlug);
      if (res?.success) {
        const updated = await api.getOrders({}, tenantSlug);
        if (updated?.success && Array.isArray(updated.data)) {
          setOrders(updated.data);
        }
        setOrderNotice('Order record deleted successfully.');
        setTimeout(() => setOrderNotice(null), 3000);
      } else {
        alert(res?.message || 'Failed to delete order');
      }
    } catch {
      alert('Error deleting order');
    } finally {
      setDeletingOrderId(null);
    }
  };

  const handleExportOrdersToExcel = (ordersToExport: any[]) => {
    if (!ordersToExport || ordersToExport.length === 0) {
      alert('No orders available to export in current filter.');
      return;
    }

    const headers = [
      'Order Number',
      'Order Status',
      'Date & Time',
      'Customer Name',
      'Phone Number',
      'Email',
      'Shipping Address',
      'City',
      'Category / Type',
      'Ordered Items Summary',
      'Subtotal (BDT)',
      'Delivery Fee (BDT)',
      'Total Amount (BDT)',
      'Payment Method',
      'Courier Partner',
      'Tracking Code',
      'Customer Trust Score',
      'Customer Notes'
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = ordersToExport.map((ord) => {
      const itemsStr = Array.isArray(ord.items) && ord.items.length > 0
        ? ord.items.map((i: any) => `${i.itemTitle || i.title || 'Product'} (x${i.quantity || 1}) [${i.price || 0} BDT]`).join('; ')
        : (ord.serviceTitle || ord.propertyTitle || 'N/A');

      const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleString('en-GB') : '';

      return [
        escapeCsv(ord.orderNumber || ord.id),
        escapeCsv(ord.orderStatus || 'PENDING'),
        escapeCsv(dateStr),
        escapeCsv(ord.customerName || ''),
        escapeCsv(ord.customerPhone || ''),
        escapeCsv(ord.customerEmail || ''),
        escapeCsv(ord.shippingAddress || ''),
        escapeCsv(ord.city || ''),
        escapeCsv(ord.orderType || ord.businessCategory || 'PHYSICAL_PRODUCT'),
        escapeCsv(itemsStr),
        escapeCsv(ord.subtotal || 0),
        escapeCsv(ord.deliveryCharge || 0),
        escapeCsv(ord.totalAmount || 0),
        escapeCsv(ord.paymentMethod || 'COD'),
        escapeCsv(ord.courier || 'Pending'),
        escapeCsv(ord.trackingCode || ''),
        escapeCsv(ord.customerHistory?.trustScore || (ord.isBlockedCustomer ? 'BLOCKED' : 'NEW')),
        escapeCsv(ord.notes || '')
      ].join(',');
    });

    // UTF-8 BOM (\uFEFF) ensures Excel renders Bengali, special characters & accents cleanly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.href = url;
    link.setAttribute('download', `Orders_${tenantSlug}_${orderFilterStatus}_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCreateManualOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCustomerName.trim() || !manualCustomerPhone.trim()) {
      alert('Customer Name and Phone Number are required.');
      return;
    }
    if (!manualItemTitle.trim() && !manualSelectedItemId) {
      alert('Please select or specify an item to order.');
      return;
    }
    setCreatingManualOrder(true);
    try {
      const selectedItem = items.find((i) => i.id === manualSelectedItemId || i.slug === manualSelectedItemId);
      const res = await api.createManualOrder(
        {
          itemId: selectedItem?.id || (manualSelectedItemId !== 'custom' ? manualSelectedItemId : undefined),
          customerName: manualCustomerName.trim(),
          customerPhone: manualCustomerPhone.trim(),
          customerEmail: manualCustomerEmail.trim(),
          shippingAddress: manualDeliveryMethod === 'SHOWROOM_PICKUP'
            ? (manualAddress.trim() || 'Store / Showroom Counter Pickup')
            : (manualAddress.trim() || 'Customer Address'),
          city: manualCity,
          itemTitle: manualItemTitle.trim() || selectedItem?.title || 'Product Item',
          variantTitle: manualVariantTitle.trim() || undefined,
          price: manualPrice || selectedItem?.price || 0,
          quantity: manualQuantity || 1,
          deliveryCharge: manualDeliveryMethod === 'SHOWROOM_PICKUP' ? 0 : manualDeliveryCharge,
          courier: manualDeliveryMethod === 'SHOWROOM_PICKUP' ? 'Showroom Counter Pickup' : manualCourier,
          trackingCode: manualTracking.trim(),
          orderType: 'PHYSICAL_PRODUCT',
          paymentMethod: manualPaymentMethod,
          source: manualOrderSource,
          image: selectedItem?.images?.[0] || selectedItem?.image || '',
          notes: [
            manualNotes.trim(),
            `[Channel: ${manualOrderSource.replace(/_/g, ' ')}]`,
            manualDeliveryMethod === 'SHOWROOM_PICKUP' ? '[Showroom Counter Pickup]' : `[Delivery: ${manualDeliveryMethod.replace(/_/g, ' ')}]`
          ].filter(Boolean).join(' '),
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setOrders((prev) => [res.data, ...prev]);
        setShowManualOrderModal(false);
        setManualCustomerName('');
        setManualCustomerPhone('');
        setManualCustomerEmail('');
        setManualAddress('');
        setManualItemTitle('');
        setManualVariantTitle('');
        setManualPrice('');
        setManualQuantity('1');
        setManualSelectedItemId('');
        setManualNotes('');
        setOrderNotice(`New manual order #${res.data.orderNumber} created successfully!`);
        setTimeout(() => setOrderNotice(null), 3500);
      } else {
        alert(res?.message || 'Failed to create manual order');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server to create manual order');
    } finally {
      setCreatingManualOrder(false);
    }
  };

  // Automated Courier Logistics Handlers
  const handleFastDispatch = async (order: any, courierName: string) => {
    try {
      setDispatchingLoading(true);
      const res = await api.dispatchOrderToCourier(
        order.id,
        {
          courier: courierName,
          codAmount: order.totalAmount,
          note: 'Handle with care - Fragile electronics',
          parcelWeight: '1.0kg',
          deliveryType: courierName.includes('Pathao') ? 'EXPRESS_24H' : 'STANDARD_DELIVERY',
        },
        tenantSlug
      );
      if (res?.success) {
        setOrderNotice(`🚀 Order #${order.orderNumber} successfully booked with ${courierName}! Tracking: ${res.data?.trackingCode}`);
        setRefreshTrigger((prev) => prev + 1);
        setTimeout(() => setOrderNotice(null), 5000);
      } else {
        alert(res?.message || 'Courier dispatch failed. Please check your courier API keys.');
      }
    } catch (e: any) {
      console.error(e);
      alert('Network error while dispatching to courier.');
    } finally {
      setDispatchingLoading(false);
    }
  };

  const handleOpenDispatchModal = (order: any) => {
    setDispatchModalOrder(order);
    setDispatchCourierName(order.courier || 'Steadfast Courier');
    setDispatchCodAmount(String(order.totalAmount || ''));
    setDispatchParcelWeight('1.0');
    setDispatchDeliveryType('STANDARD_DELIVERY');
    setDispatchNotes(order.notes || 'Handle with care - Electronics product');
  };

  const handleConfirmModalDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;
    try {
      setDispatchingLoading(true);
      const res = await api.dispatchOrderToCourier(
        dispatchModalOrder.id,
        {
          courier: dispatchCourierName,
          codAmount: dispatchCodAmount ? Number(dispatchCodAmount) : dispatchModalOrder.totalAmount,
          note: dispatchNotes,
          parcelWeight: `${dispatchParcelWeight}kg`,
          deliveryType: dispatchDeliveryType,
        },
        tenantSlug
      );
      if (res?.success) {
        setOrderNotice(`🚀 Consignment booked with ${dispatchCourierName}! Consignment ID: ${res.data?.consignmentId || res.data?.trackingCode}`);
        setDispatchModalOrder(null);
        setRefreshTrigger((prev) => prev + 1);
        setTimeout(() => setOrderNotice(null), 5000);
      } else {
        alert(res?.message || 'Courier consignment booking failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to courier server.');
    } finally {
      setDispatchingLoading(false);
    }
  };

  const handleOpenLiveTracking = async (order: any) => {
    setTrackModalOrder(order);
    setTrackingLoading(true);
    setTrackingData(null);
    try {
      const res = await api.trackCourierConsignment(order.id, tenantSlug);
      if (res?.success && res.data) {
        setTrackingData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCopyTracking = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedTracking(code);
    setTimeout(() => setCopiedTracking(null), 2500);
  };

  // Media Handlers
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaUrl.trim()) return;
    setAddingMedia(true);
    try {
      const selectedCat = categories.find((c) => c.id === mediaCategoryId || c.slug === mediaCategoryId);
      const res = await api.addMedia(
        {
          title: mediaTitle.trim(),
          categoryId: mediaCategoryId,
          categoryName: selectedCat ? selectedCat.name : 'General Collection',
          type: mediaType,
          url: mediaUrl.trim(),
          description: mediaDescription.trim(),
        },
        tenantSlug
      );
      if (res?.success && res.data) {
        setMediaItems((prev) => [res.data, ...prev]);
        setMediaTitle('');
        setMediaUrl('');
        setMediaDescription('');
        setMediaNotice(`Media "${res.data.title}" published successfully!`);
        setTimeout(() => setMediaNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return;
    try {
      const res = await api.deleteMedia(id, tenantSlug);
      if (res?.success) {
        setMediaItems((prev) => prev.filter((m) => m.id !== id));
        setMediaNotice(`Media "${title}" deleted.`);
        setTimeout(() => setMediaNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Accessories Catalog & Megamenu Handlers
  const handleSaveAccessories = async (newList?: any[]) => {
    const dataToSave = newList || accessoriesList;
    setSavingAccessories(true);
    try {
      const res = await api.updateAccessories(dataToSave, tenantSlug);
      if (res?.success) {
        if (newList) setAccessoriesList(newList);
        setAccessoriesNotice('Accessories catalog updated & published live to storefront navigation!');
        setTimeout(() => setAccessoriesNotice(null), 3500);
      } else {
        setAccessoriesNotice('Failed to update accessories.');
        setTimeout(() => setAccessoriesNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setAccessoriesNotice('Error updating accessories.');
      setTimeout(() => setAccessoriesNotice(null), 3000);
    } finally {
      setSavingAccessories(false);
    }
  };

  const handleCreateDivision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!divisionForm.name.trim()) return;
    const newDiv = {
      id: `acc_${Date.now()}`,
      name: divisionForm.name.trim(),
      iconName: divisionForm.iconName,
      badge: divisionForm.badge.trim() || undefined,
      description: divisionForm.description.trim() || 'Accessory hardware and care essentials',
      subcategories: [],
    };
    const updated = [...accessoriesList, newDiv];
    setAccessoriesList(updated);
    setShowAddDivisionModal(false);
    setDivisionForm({ name: '', iconName: 'Wrench', badge: 'Certified', description: '' });
    handleSaveAccessories(updated);
  };

  const handleUpdateDivisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDivision || !divisionForm.name.trim()) return;
    const updated = accessoriesList.map((div) => {
      if (div.id === editingDivision.id) {
        return {
          ...div,
          name: divisionForm.name.trim(),
          iconName: divisionForm.iconName,
          badge: divisionForm.badge.trim() || undefined,
          description: divisionForm.description.trim(),
        };
      }
      return div;
    });
    setAccessoriesList(updated);
    setEditingDivision(null);
    setDivisionForm({ name: '', iconName: 'Wrench', badge: 'Certified', description: '' });
    handleSaveAccessories(updated);
  };

  const handleDeleteDivision = (divId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete accessory category "${name}"?`)) return;
    const updated = accessoriesList.filter((d) => d.id !== divId);
    setAccessoriesList(updated);
    handleSaveAccessories(updated);
  };

  const handleOpenAddItem = (divId: string) => {
    setTargetDivisionId(divId);
    const defaultBrand = brands[0]?.name || 'SmartVolt';
    const defaultBrandId = brands[0]?.id || brands[0]?.slug || '';
    setItemForm({
      name: '',
      brandId: defaultBrandId,
      brandName: defaultBrand,
      image: '',
      price: '',
      comparePrice: '',
      stock: '25',
      tag: '',
      description: '',
      query: '',
    });
    setShowAddItemModal(true);
  };

  const handleAddItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name.trim() || !targetDivisionId) return;

    const matchedBrand = brands.find((b) => b.id === itemForm.brandId || b.slug === itemForm.brandId);
    const brandName = matchedBrand?.name || itemForm.brandName || 'SmartVolt';

    // Fallback sample image if user didn't provide one
    const fallbackImage =
      itemForm.image ||
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80';

    const numPrice = itemForm.price ? Number(itemForm.price) : 1500;
    const numCompare = itemForm.comparePrice ? Number(itemForm.comparePrice) : undefined;
    const numStock = Number(itemForm.stock) || 20;

    const newItem = {
      id: `sub_${Date.now()}`,
      name: itemForm.name.trim(),
      brand: brandName,
      brandId: itemForm.brandId || undefined,
      image: fallbackImage,
      price: numPrice,
      comparePrice: numCompare,
      stock: numStock,
      tag: itemForm.tag.trim() || undefined,
      description: itemForm.description.trim() || undefined,
      query: itemForm.query.trim() || itemForm.name.trim().toLowerCase(),
    };

    const updated = accessoriesList.map((div) => {
      if (div.id === targetDivisionId) {
        return {
          ...div,
          subcategories: [...(div.subcategories || []), newItem],
        };
      }
      return div;
    });

    setAccessoriesList(updated);
    setShowAddItemModal(false);

    // Also register as a real product in items catalog
    try {
      await api.addItem(
        {
          title: itemForm.name.trim(),
          categoryId: targetDivisionId,
          brandId: itemForm.brandId || undefined,
          price: numPrice,
          comparePrice: numCompare,
          stockQuantity: numStock,
          itemType: 'PHYSICAL_PRODUCT',
          images: [fallbackImage],
          shortDescription:
            itemForm.description || `${itemForm.name.trim()} by ${brandName}. OEM certified electrical appliance accessory.`,
          badge: itemForm.tag.trim() || undefined,
          specifications: [
            { key: 'Product Type', value: 'Accessory & Hardware Add-On' },
            { key: 'Brand', value: brandName },
            { key: 'Warranty', value: 'Official Brand Warranty' },
          ],
        },
        tenantSlug
      );
      refreshCatalogItems();
    } catch (err) {
      console.log('Accessory product saved.');
    }

    handleSaveAccessories(updated);
  };

  const handleDeleteAccessoryItem = (divId: string, itemId: string) => {
    const updated = accessoriesList.map((div) => {
      if (div.id === divId) {
        return {
          ...div,
          subcategories: (div.subcategories || []).filter((sub: any) => sub.id !== itemId),
        };
      }
      return div;
    });
    setAccessoriesList(updated);
    handleSaveAccessories(updated);
  };

  const handleOpenEditAccessoryItem = (divId: string, item: any) => {
    setEditAccessoryTargetDivId(divId);
    setEditAccessoryForm({
      id: item.id || '',
      name: item.name || '',
      brandId: item.brandId || '',
      brandName: item.brand || '',
      image: item.image || '',
      price: item.price !== undefined ? String(item.price) : '',
      comparePrice: item.comparePrice !== undefined ? String(item.comparePrice) : '',
      stock: item.stock !== undefined ? String(item.stock) : '25',
      tag: item.tag || '',
      description: item.description || '',
      query: item.query || '',
    });
    setShowEditAccessoryModal(true);
  };

  const handleEditAccessorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAccessoryForm.name.trim() || !editAccessoryTargetDivId) return;

    const matchedBrand = brands.find(
      (b) => b.id === editAccessoryForm.brandId || b.slug === editAccessoryForm.brandId
    );
    const brandName = matchedBrand?.name || editAccessoryForm.brandName || 'SmartVolt';
    const fallbackImage =
      editAccessoryForm.image ||
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=400&q=80';

    const numPrice = editAccessoryForm.price ? Number(editAccessoryForm.price) : 1500;
    const numCompare = editAccessoryForm.comparePrice ? Number(editAccessoryForm.comparePrice) : undefined;
    const numStock = Number(editAccessoryForm.stock) || 20;

    const updatedItem = {
      id: editAccessoryForm.id,
      name: editAccessoryForm.name.trim(),
      brand: brandName,
      brandId: editAccessoryForm.brandId || undefined,
      image: fallbackImage,
      price: numPrice,
      comparePrice: numCompare,
      stock: numStock,
      tag: editAccessoryForm.tag.trim() || undefined,
      description: editAccessoryForm.description.trim() || undefined,
      query: editAccessoryForm.query.trim() || editAccessoryForm.name.trim().toLowerCase(),
    };

    const updated = accessoriesList.map((div) => {
      if (div.id === editAccessoryTargetDivId) {
        return {
          ...div,
          subcategories: (div.subcategories || []).map((sub: any) =>
            sub.id === editAccessoryForm.id ? { ...sub, ...updatedItem } : sub
          ),
        };
      }
      return div;
    });

    setAccessoriesList(updated);
    setShowEditAccessoryModal(false);

    // Also sync to catalog items
    try {
      const existingInCatalog = items.find(
        (ci: any) =>
          ci.id === editAccessoryForm.id ||
          ci.title?.toLowerCase() === editAccessoryForm.name.trim().toLowerCase() ||
          ci.slug?.includes(editAccessoryForm.id)
      );
      if (existingInCatalog) {
        await api.updateItem(
          existingInCatalog.id,
          {
            title: editAccessoryForm.name.trim(),
            categoryId: editAccessoryTargetDivId,
            brandId: editAccessoryForm.brandId || undefined,
            price: numPrice,
            comparePrice: numCompare,
            stockQuantity: numStock,
            images: [fallbackImage],
            shortDescription: editAccessoryForm.description || existingInCatalog.shortDescription,
            badge: editAccessoryForm.tag.trim() || undefined,
          },
          tenantSlug
        );
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.log('Error updating catalog item for accessory:', err);
    }

    handleSaveAccessories(updated);
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.updateStoreSettings(
        {
          name: storeName.trim(),
          phone: storePhone.trim(),
          email: storeEmail.trim(),
          address: storeAddress.trim(),
          announcementText: announcementText.trim(),
          heroTitle: heroTitle.trim(),
          heroSubtitle: heroSubtitle.trim(),
          metaPixelId: metaPixelId.trim(),
          googleAnalyticsId: googleAnalyticsId.trim(),
          customDomain: customDomain.trim(),
          whatsappNumber: whatsappNumber.trim(),
          whatsappWelcomeMsg: whatsappWelcomeMsg.trim(),
          steadfastApiKey: steadfastApiKey.trim(),
          steadfastSecretKey: steadfastSecretKey.trim(),
          pathaoStoreId: pathaoStoreId.trim(),
          pathaoClientId: pathaoClientId.trim(),
          pathaoClientSecret: pathaoClientSecret.trim(),
          dbidRegistrationNo: dbidRegistrationNo.trim(),
          tradeLicenseNo: tradeLicenseNo.trim(),
        },
        tenantSlug
      );
      if (res?.success) {
        setSettingsNotice('Master configuration, tracking pixels, courier credentials & domain saved successfully!');
        if (tenantInfo) {
          setTenantInfo({
            ...tenantInfo,
            name: storeName,
            phone: storePhone,
            email: storeEmail,
            address: storeAddress,
            announcementText,
            heroTitle,
            heroSubtitle,
            settings: {
              ...tenantInfo.settings,
              metaPixelId,
              googleAnalyticsId,
              customDomain,
              whatsappNumber,
              whatsappWelcomeMsg,
              steadfastApiKey,
              steadfastSecretKey,
              pathaoStoreId,
              pathaoClientId,
              pathaoClientSecret,
              dbidRegistrationNo,
              tradeLicenseNo,
            },
          });
        }
        setTimeout(() => setSettingsNotice(null), 3500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handlePrint = () => {
    document.body.classList.remove('printing-single-invoice');
    window.print();
  };

  const isServiceOrMedical = tenantInfo?.businessType === 'healthcare_service' || tenantSlug === 'medicare' || tenantSlug === 'meradenralcare';

  const filteredCatalogItems = items.filter((item) => {
    const matchCat =
      selectedProdCatFilter === 'all' ||
      item.categoryId === selectedProdCatFilter ||
      item.category?.id === selectedProdCatFilter ||
      item.category?.slug === selectedProdCatFilter;
    const matchSearch =
      !prodSearchQuery.trim() ||
      item.title?.toLowerCase().includes(prodSearchQuery.toLowerCase()) ||
      item.shortDescription?.toLowerCase().includes(prodSearchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (!authChecking && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080B14] text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white relative overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rose-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[160px] pointer-events-none" />

        {/* Top Minimal Bar */}
        <header className="border-b border-[#182033] bg-[#0A0E1A]/60 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-rose-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-[#080B14] rounded-[14px] flex items-center justify-center text-white font-black text-sm">
                ⚡
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight block">
                {tenantInfo?.name || tenantSlug.toUpperCase() + ' Store'}
              </span>
              <span className="text-[11px] text-indigo-400 font-mono">
                Admin Security Gateway • {tenantSlug}.localhost
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href={`/?tenant=${tenantSlug}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-[#111728] hover:bg-[#1A2238] border border-[#1E2840] text-slate-300 font-semibold transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Live Store</span>
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-md shadow-indigo-600/20"
            >
              Switch Store / Platform Login
            </Link>
          </div>
        </header>

        {/* Central Authentication Card */}
        <main className="max-w-md mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center relative z-10">
          <div className="bg-[#0D1222]/90 border border-[#1E2840] p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-2xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                <Lock className="w-7 h-7 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Store Admin Login
              </h1>
              <p className="text-xs text-slate-400">
                Enter your credentials to access dashboard, sales analytics and order management.
              </p>
            </div>

            {/* Error Message */}
            {adminLoginError && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{adminLoginError}</span>
              </div>
            )}

            <form onSubmit={handleDashboardAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Store Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminLoginEmail}
                    onChange={(e) => setAdminLoginEmail(e.target.value)}
                    placeholder={`admin@${tenantSlug}.com`}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14] border border-[#1E2840] text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminLoginEmail(`admin@${tenantSlug}.com`);
                      setAdminLoginPassword('admin@123');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    ⚡ Auto-fill Default
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminLoginPassword}
                    onChange={(e) => setAdminLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14] border border-[#1E2840] text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={adminLoginLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {adminLoginLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign in to Dashboard (Unlock Console)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Assist */}
            <div className="pt-4 border-t border-[#182033] text-center space-y-2">
              <span className="text-[11px] text-slate-400 block font-semibold">
                Demo Admin Credentials:
              </span>
              <div className="bg-[#111728] p-3 rounded-xl border border-[#1E2840] text-[11px] text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Email: </span>
                  <span className="font-mono text-cyan-400 font-semibold">admin@{tenantSlug}.com</span>
                </div>
                <div>
                  <span className="text-slate-400">Pass: </span>
                  <span className="font-mono text-emerald-400 font-semibold">admin@123</span>
                </div>
              </div>
            </div>

          </div>
        
        
        </main>

        {/* Footer */}
        <footer className="border-t border-[#182033] py-4 text-center text-xs text-slate-500 relative z-10">
          &copy; {new Date().getFullYear()} SaaS E-Commerce Platform. Enterprise Tenant Security & Isolation Active.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* ============================================================== */}
      {/* FLUX LEFT SIDEBAR */}
      {/* ============================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#090D16] border-r border-[#1B2236] transition-all duration-300 print:hidden ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo & Collapse Toggle */}
          <div className="h-16 px-5 border-b border-[#1B2236] flex items-center justify-between shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-3 overflow-hidden text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#090D16]/40 backdrop-blur-sm rounded-[10px] flex items-center justify-center text-white font-black text-sm">
                  {isMedical ? '🩺' : isRealEstate ? '🏢' : isElectronics ? '⚡' : '👗'}
                </div>
              </div>
              {!sidebarCollapsed && (
                <div className="leading-tight overflow-hidden">
                  <span className="text-sm font-extrabold tracking-tight text-white block truncate max-w-[130px]">
                    {tenantInfo?.name || (isMedical ? 'MediCare Clinic' : isRealEstate ? 'Aeban Real Estate' : isElectronics ? 'SmartVolt Store' : 'Gulshan Boutique')}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider inline-block border ${getArchetypeBadge().color}`}>
                    {getArchetypeBadge().label}
                  </span>
                </div>
              )}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-7 h-7 rounded-lg bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-400 hover:text-white flex items-center justify-center transition"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <ChevronLeft
                className={`w-4 h-4 transition-transform duration-300 ${
                  sidebarCollapsed ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Navigation Items (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* GROUP 1: OVERVIEW */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center justify-between">
                  <span>OVERVIEW</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              )}

              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'overview'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Dashboard"
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeTab === 'overview' ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'analytics'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Business Intelligence & Analytics"
              >
                <BarChart3 className={`w-4 h-4 shrink-0 ${activeTab === 'analytics' ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span>Analytics</span>}
              </button>
            </div>

            {/* GROUP 2: COMMERCE */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center justify-between">
                  <span>COMMERCE</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              )}

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'orders'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title={isMedical ? 'Patient Serial Bookings' : isRealEstate ? 'Booking Deposits & Tokens' : 'Orders'}
              >
                <div className="flex items-center gap-3">
                  {isMedical ? (
                    <Stethoscope className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-teal-400' : 'text-slate-400'}`} />
                  ) : isRealEstate ? (
                    <Building2 className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-amber-400' : 'text-slate-400'}`} />
                  ) : (
                    <ShoppingCart className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  )}
                  {!sidebarCollapsed && (
                    <span>
                      {isMedical
                        ? 'Patient Serials'
                        : isRealEstate
                        ? 'Booking Deposits'
                        : isElectronics
                        ? 'Orders & COD'
                        : 'Store Orders'}
                    </span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow ${
                    isMedical ? 'bg-teal-600 text-white' : isRealEstate ? 'bg-amber-600 text-slate-950' : 'bg-indigo-600 text-white'
                  }`}>
                    {orders.length || stats.totalOrders || 12}
                  </span>
                )}
              </button>

              {/* Category-Specific Appointments or Site Visits Tab */}
              {(isMedical || isRealEstate) && (
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'appointments'
                      ? isMedical
                        ? 'bg-teal-950 text-teal-300 border border-teal-500/30 shadow-sm'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                  }`}
                  title={isMedical ? '1-Hour Chamber Patient Appointments' : 'Private Property Tours & Site Visits'}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className={`w-4 h-4 shrink-0 ${activeTab === 'appointments' ? (isMedical ? 'text-teal-400' : 'text-amber-400') : 'text-slate-400'}`} />
                    {!sidebarCollapsed && (
                      <span>{isMedical ? '1-Hour Patient Serials' : 'Site Visits & Tours'}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      isMedical ? 'bg-teal-950 text-teal-400 border-teal-800/60' : 'bg-amber-950 text-amber-400 border-amber-800/60'
                    }`}>
                      {sheetData.length || 5}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  setActiveTab('products');
                  setProductSubTab('catalog');
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'products'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Products"
              >
                <div className="flex items-center gap-3">
                  <Package className={`w-4 h-4 shrink-0 ${activeTab === 'products' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && (
                    <span>
                      {isMedical
                        ? 'Doctors & Chamber Fees'
                        : isRealEstate
                        ? 'Properties & Developments'
                        : isElectronics
                        ? 'Devices & Hardware'
                        : 'Outfits & Apparel'}
                    </span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {items.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'inventory'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Inventory & Stock Engine"
              >
                <div className="flex items-center gap-3">
                  <Boxes className={`w-4 h-4 shrink-0 ${activeTab === 'inventory' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && (
                    <span>
                      {isElectronics
                        ? 'IMEI & Stock Ledger'
                        : isMedical
                        ? 'Medicine & Supplies'
                        : isRealEstate
                        ? 'Plot & Unit Inventory'
                        : 'Inventory & Stock'}
                    </span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    Live
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'categories'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Categories"
              >
                <div className="flex items-center gap-3">
                  <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'categories' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Categories</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {categories.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('brands')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'brands'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Brands"
              >
                <div className="flex items-center gap-3">
                  <Award className={`w-4 h-4 shrink-0 ${activeTab === 'brands' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Brands</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {brands.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('invoices')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Invoices & Customer Billing Hub"
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'invoices' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && <span>Invoices</span>}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950 text-indigo-400 border border-indigo-800/60">
                    {orders.filter((o) => o.orderStatus !== 'INCOMPLETE').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'customers'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Customer CRM & Fraud Prevention Engine"
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 shrink-0 ${activeTab === 'customers' ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && (
                    <span>
                      {isMedical
                        ? 'Patient Records CRM'
                        : isRealEstate
                        ? 'Investor Leads CRM'
                        : 'Customers & CRM'}
                    </span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
                    6
                  </span>
                )}
              </button>

              {/* Showrooms & POS Counter Terminal */}
              {(tenantInfo?.businessType === 'electronics' || tenantSlug === 'smartvolt') && (
                <button
                  onClick={() => setActiveTab('showrooms')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'showrooms'
                      ? 'bg-[#201A3D] text-orange-400 border border-orange-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                  }`}
                  title="Showrooms & Retail POS Terminal"
                >
                  <div className="flex items-center gap-3">
                    <Store className={`w-4 h-4 shrink-0 ${activeTab === 'showrooms' ? 'text-orange-400' : 'text-slate-400'}`} />
                    {!sidebarCollapsed && <span>Showrooms & POS</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-950 text-orange-400 border border-orange-800/60">
                      POS Live
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* GROUP 3: SYSTEM */}
            <div className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 py-1 text-[11px] font-bold text-slate-500 tracking-wider uppercase flex items-center justify-between">
                  <span>SETTINGS</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              )}

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'settings'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Store Settings"
              >
                <Sliders className={`w-4 h-4 shrink-0 ${activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span>Store Settings</span>}
              </button>

              <button
                onClick={() => setActiveTab('subscription')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'subscription'
                    ? 'bg-[#201A3D] text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-[#111625] hover:text-slate-200'
                }`}
                title="Subscription & Plan Limits"
              >
                <CreditCard className={`w-4 h-4 shrink-0 ${activeTab === 'subscription' ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span>Subscription & Limits</span>}
              </button>
            </div>
          </div>

          {/* User Profile Card (Bottom of Sidebar) */}
          <div className="p-3 border-t border-[#1B2236] shrink-0 bg-[#070A11]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#111625]/80 border border-[#1E2638]">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow">
                  {adminUser?.name ? adminUser.name.slice(0, 2).toUpperCase() : 'AD'}
                </div>
                {!sidebarCollapsed && (
                  <div className="leading-tight overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">
                      {adminUser?.name || tenantInfo?.name || 'Store Admin'}
                    </p>
                    <p className="text-[10px] text-emerald-400 font-mono truncate">
                      {adminUser?.email || `admin@${tenantSlug}.com`}
                    </p>
                  </div>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleDashboardAdminLogout}
                    className="w-7 h-7 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center justify-center transition cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    href={`/?tenant=${tenantSlug}`}
                    target="_blank"
                    className="w-7 h-7 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 flex items-center justify-center transition"
                    title="View Storefront"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MAIN CONTENT COLUMN */}
      {/* ============================================================== */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <header className="h-16 bg-[#090D16]/95 backdrop-blur-md border-b border-[#1B2236] sticky top-0 z-40 px-6 flex items-center justify-between print:hidden">
          {/* Demo Store Archetype Switcher */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#111625] border border-[#1E2638] text-[11px] font-bold">
            <span className="text-slate-500 mr-1 text-[10px] uppercase font-mono tracking-wider">Store:</span>
            <Link
              href="/admin/dashboard?tenant=gulshanfashion"
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                isFashion ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Fashion & Boutique Archetype"
            >
              <span>👗 Fashion</span>
            </Link>
            <Link
              href="/admin/dashboard?tenant=smartvolt"
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                isElectronics ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Electronics & POS Archetype"
            >
              <span>⚡ Tech/POS</span>
            </Link>
            <Link
              href="/admin/dashboard?tenant=medicare"
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                isMedical ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Healthcare & Clinic Archetype"
            >
              <span>🩺 Doctor/Clinic</span>
            </Link>
            <Link
              href="/admin/dashboard?tenant=aebanproperty"
              className={`px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
                isRealEstate ? 'bg-amber-600 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Real Estate Archetype"
            >
              <span>🏢 Real Estate</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative w-72 sm:w-96 max-w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search anything..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setProdSearchQuery(e.target.value);
                setOrderSearchQuery(e.target.value);
              }}
              className="w-full bg-[#111625] border border-[#1E2638] rounded-xl pl-9 pr-12 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#1A2234] border border-[#232D44] text-[10px] font-mono text-slate-400">
              ⌘K
            </span>
          </div>

          {/* Right Header Action Controls */}
          <div className="flex items-center gap-3">
            {/* + New Order Button (Vibrant Gradient Pill from Screenshot) */}
            <button
              onClick={() => setShowManualOrderModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Order</span>
            </button>

            {/* + Add Product Button */}
            <button
              onClick={() => {
                setActiveTab('products');
                setProductSubTab('catalog');
                setShowAddProdModal(true);
              }}
              className="hidden sm:flex px-3.5 py-2 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-200 font-bold text-xs items-center gap-1.5 transition"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
              <span>Add Product</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-9 h-9 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-400 hover:text-slate-200 flex items-center justify-center transition"
              title="Toggle Theme"
            >
              <Sun className="w-4 h-4" />
            </button>

            {/* AI / Sparkles */}
            <button
              onClick={() => setActiveTab('modules')}
              className="w-9 h-9 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-400 hover:text-indigo-400 flex items-center justify-center transition"
              title="Store Modules"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveTab('orders')}
              className="w-9 h-9 rounded-xl bg-[#111625] hover:bg-[#1A2234] border border-[#1E2638] text-slate-400 hover:text-slate-200 flex items-center justify-center relative transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            </button>

            {/* Profile Avatar Pill with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 text-indigo-300 border border-indigo-500/40 font-bold text-xs flex items-center justify-center shadow-sm hover:ring-2 hover:ring-indigo-500/50 transition cursor-pointer"
                title="Profile Menu & Switcher"
              >
                {adminUser?.name ? adminUser.name.slice(0, 2).toUpperCase() : 'AD'}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0E1320] border border-[#1E2638] rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-[#1E2638]/80">
                    <p className="font-bold text-white text-xs truncate">{adminUser?.name || tenantInfo?.name || 'Store Admin'}</p>
                    <p className="text-[11px] text-cyan-400 font-mono truncate">{adminUser?.email || `admin@${tenantSlug}.com`}</p>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-1">
                      {adminUser?.role || 'TENANT_ADMIN'}
                    </span>
                  </div>
                  <Link
                    href={`/?tenant=${tenantSlug}`}
                    target="_blank"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-300 hover:bg-emerald-500/10 transition font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Live Storefront</span>
                  </Link>
                  <button
                    onClick={handleDashboardAdminLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-500/20 transition font-semibold text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <main className="p-6 lg:p-8 space-y-6 flex-1 w-full max-w-[1600px] mx-auto">
          {/* ============================================================== */}
          {/* TAB 1: FLUX OVERVIEW & DASHBOARD */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* TOP HERO GREETING BANNER WITH GLASSMORPHISM METRIC CARDS */}
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#5848FD] via-[#7B53FF] to-[#00C5FF] text-white shadow-2xl relative overflow-hidden">
                {/* Background Ambient Glow Accents */}
                <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute right-40 -bottom-20 w-60 h-60 rounded-full bg-indigo-900/30 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Good morning, {tenantInfo?.name || 'Aigars'}
                      </h2>
                      <p className="text-xs sm:text-sm text-indigo-100/90 mt-1 font-medium">
                        Here&apos;s what&apos;s happening with your product today.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>PostgreSQL DB Isolated</span>
                      </span>
                    </div>
                  </div>

                  {/* 4 Glassmorphism Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {/* Card 1: Revenue / Pipeline */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner flex flex-col justify-between hover:bg-white/15 transition group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>{isMedical ? 'Consultation Revenue' : isRealEstate ? 'Inquiry Pipeline Value' : 'Store Gross Revenue'}</span>
                        </span>
                        <span className="text-[10px] text-indigo-200 uppercase font-mono">{isMedical ? 'Chamber Fees' : isRealEstate ? 'Token Deposits' : 'GMV'}</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                        {stats.totalRevenue ? `BDT ${(stats.totalRevenue).toLocaleString()}` : (isMedical ? 'BDT 124,500' : isRealEstate ? 'BDT 8.5M' : 'BDT 482,000')}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-2">
                        <span>↗ +14.2%</span>
                        <span className="text-indigo-200/80 font-normal">vs last month</span>
                      </div>
                    </div>

                    {/* Card 2: Patients / Leads / Users */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner flex flex-col justify-between hover:bg-white/15 transition group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-sky-300" />
                          <span>{isMedical ? 'Patient Records' : isRealEstate ? 'Investor Leads' : 'Active Shoppers'}</span>
                        </span>
                        <span className="text-[10px] text-indigo-200 uppercase font-mono">{isMedical ? 'Verified' : isRealEstate ? 'High Intent' : 'Registered'}</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                        {orders.length ? (orders.length * (isMedical ? 42 : isRealEstate ? 12 : 714)).toLocaleString() : (isMedical ? '1,420' : isRealEstate ? '348' : '12,847')}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-2">
                        <span>↗ +9.5%</span>
                        <span className="text-indigo-200/80 font-normal">vs last month</span>
                      </div>
                    </div>

                    {/* Card 3: Doctors / Properties / Catalog */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner flex flex-col justify-between hover:bg-white/15 transition group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
                          <Rocket className="w-3.5 h-3.5 text-purple-200" />
                          <span>{isMedical ? 'Listed Doctors' : isRealEstate ? 'Live Developments' : 'Active Catalog'}</span>
                        </span>
                        <span className="text-[10px] text-indigo-200 uppercase font-mono">{isMedical ? 'Chambers' : isRealEstate ? 'Residences' : 'Items'}</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                        {isMedical ? `${items.length || 8} Doctors` : isRealEstate ? `${items.length || 6} Projects` : (items.length ? (items.length * 34 + 2) : '342')}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-2">
                        <span>↗ +18.4%</span>
                        <span className="text-indigo-200/80 font-normal">active status</span>
                      </div>
                    </div>

                    {/* Card 4: Slot Attendance / Tours / Uptime */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-inner flex flex-col justify-between hover:bg-white/15 transition group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{isMedical ? 'Slot Attendance' : isRealEstate ? 'Site Tours Booked' : isElectronics ? 'IMEI Clearance' : 'Fulfillment Rate'}</span>
                        </span>
                        <span className="text-[10px] text-emerald-300 uppercase font-mono">{isMedical ? 'Verified' : isRealEstate ? 'Weekend' : '100% Valid'}</span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2">
                        {isMedical ? '99.4%' : isRealEstate ? `${sheetData.length || 14} Tours` : '99.8%'}
                      </div>
                      <div className="text-[11px] text-emerald-300 font-bold flex items-center gap-1 mt-2">
                        <span>↗ +0.4%</span>
                        <span className="text-indigo-200/80 font-normal">on-time rating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 2: REVENUE GROWTH CHART + SPRINT 24 + TEAM ACTIVITY */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Revenue Growth Card (8 cols) */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">Revenue Growth</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Monthly recurring revenue trend</p>
                    </div>

                    {/* MRR / ARR Toggle Pill */}
                    <div className="p-1 rounded-xl bg-[#090D16] border border-[#1E2638] flex items-center gap-1">
                      <button
                        onClick={() => setRevenueMetric('MRR')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          revenueMetric === 'MRR'
                            ? 'bg-[#1E2638] text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        MRR
                      </button>
                      <button
                        onClick={() => setRevenueMetric('ARR')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          revenueMetric === 'ARR'
                            ? 'bg-[#1E2638] text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ARR
                      </button>
                    </div>
                  </div>

                  {/* Spline Chart SVG */}
                  <div className="mt-6 w-full">
                    <div className="flex">
                      {/* Y-axis labels */}
                      <div className="flex flex-col justify-between text-[11px] font-mono text-slate-500 pr-3 h-56 select-none">
                        <span>$60K</span>
                        <span>$45K</span>
                        <span>$30K</span>
                        <span>$15K</span>
                        <span>$0K</span>
                      </div>

                      {/* SVG Area */}
                      <div className="flex-1 relative h-56">
                        {/* Horizontal Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                          <div className="border-b border-[#1A2234]/70 w-full"></div>
                        </div>

                        <svg viewBox="0 0 700 220" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient id="fluxRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.28" />
                              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Area Fill */}
                          <path
                            d={
                              revenueMetric === 'MRR'
                                ? "M 0,170 C 110,165 190,150 280,135 C 370,120 460,95 560,75 C 620,65 670,55 700,45 L 700,220 L 0,220 Z"
                                : "M 0,185 C 100,180 200,160 300,140 C 400,115 500,85 600,60 C 650,45 680,35 700,25 L 700,220 L 0,220 Z"
                            }
                            fill="url(#fluxRevenueGrad)"
                          />
                          {/* Curved Spline */}
                          <path
                            d={
                              revenueMetric === 'MRR'
                                ? "M 0,170 C 110,165 190,150 280,135 C 370,120 460,95 560,75 C 620,65 670,55 700,45"
                                : "M 0,185 C 100,180 200,160 300,140 C 400,115 500,85 600,60 C 650,45 680,35 700,25"
                            }
                            fill="none"
                            stroke="#A78BFA"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          {/* Glowing endpoint marker */}
                          <circle
                            cx="700"
                            cy={revenueMetric === 'MRR' ? "45" : "25"}
                            r="6"
                            fill="#C4B5FD"
                            stroke="#090D16"
                            strokeWidth="2.5"
                            className="animate-pulse"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between pl-10 pr-2 pt-3 text-[11px] font-mono text-slate-500">
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                      <span>Jan</span>
                    </div>
                  </div>
                </div>

                {/* Right: Stack of 2 Cards (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  {/* Card 1: Sprint 24 / Fulfillment Pipeline */}
                  <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Sprint 24</h3>
                        <p className="text-xs text-slate-400 mt-0.5">5 days remaining</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                      >
                        <span>View board</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Segmented Progress Bar */}
                    <div className="mt-5">
                      <div className="h-3.5 rounded-full bg-[#1A2234] p-0.5 flex gap-1 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-l-full h-full w-[65%]" title="Completed (14)"></div>
                        <div className="bg-sky-400 h-full w-[25%]" title="In Progress (5)"></div>
                        <div className="bg-amber-500 rounded-r-full h-full w-[10%]" title="To Do (2)"></div>
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-4 mt-4 text-xs text-slate-300 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                          <span>Completed (14)</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                          <span>In Progress (5)</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span>To Do (2)</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Team Activity */}
                  <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Team Activity</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Latest from your team</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                      >
                        <span>View all</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Activity Feed */}
                    <div className="mt-4 space-y-3.5">
                      {[
                        { initials: 'SC', name: 'Sarah C.', action: 'merged PR #284', time: '3m', color: 'bg-cyan-500 text-slate-950' },
                        { initials: 'AM', name: 'Alex M.', action: 'deployed to production', time: '12m', color: 'bg-emerald-500 text-slate-950' },
                        { initials: 'PK', name: 'Priya K.', action: 'opened issue #92', time: '28m', color: 'bg-purple-500 text-white' },
                        { initials: 'ML', name: 'Marcus L.', action: 'reviewed PR #281', time: '45m', color: 'bg-rose-500 text-white' },
                        { initials: 'JT', name: 'Jen T.', action: 'closed issue #88', time: '1h', color: 'bg-indigo-500 text-white' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${item.color}`}>
                              {item.initials}
                            </span>
                            <p className="text-slate-300 leading-tight">
                              <span className="font-bold text-white">{item.name}</span>{' '}
                              <span className="text-slate-400">{item.action}</span>
                            </p>
                          </div>
                          <span className="text-slate-500 text-[11px] font-mono shrink-0 pl-2">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ROW 3: RECENT DEPLOYMENTS + FEATURE ADOPTION */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Recent Deployments (6 cols) */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">Recent Deployments</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Latest releases across environments</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                    >
                      <span>View all</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Deployments List */}
                  <div className="mt-5 space-y-4">
                    {[
                      {
                        title: 'fix: auth token refresh',
                        status: 'ok',
                        env: 'Production',
                        envColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                        branch: 'main',
                        time: '2 min ago',
                      },
                      {
                        title: 'feat: webhook retry logic',
                        status: 'ok',
                        env: 'Staging',
                        envColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                        branch: 'feat/webhooks-v2',
                        time: '18 min ago',
                      },
                      {
                        title: 'chore: bump dependencies',
                        status: 'ok',
                        env: 'Production',
                        envColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                        branch: 'main',
                        time: '1h ago',
                      },
                      {
                        title: 'feat: dark mode toggle',
                        status: 'pending',
                        env: 'Preview',
                        envColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                        branch: 'feat/dark-mode',
                        time: '1h ago',
                      },
                      {
                        title: 'fix: websocket memory leak',
                        status: 'error',
                        env: 'Staging',
                        envColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                        branch: 'fix/memory-leak',
                        time: '3h ago',
                      },
                      {
                        title: 'feat: export CSV endpoint',
                        status: 'ok',
                        env: 'Production',
                        envColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
                        branch: 'main',
                        time: '5h ago',
                      },
                    ].map((dep, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-3">
                          {/* Status dot icon */}
                          <div className="shrink-0">
                            {dep.status === 'ok' && (
                              <div className="w-5 h-5 rounded-full border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                              </div>
                            )}
                            {dep.status === 'pending' && (
                              <div className="w-5 h-5 rounded-full border border-amber-500/40 flex items-center justify-center text-amber-400">
                                <Clock className="w-3 h-3" />
                              </div>
                            )}
                            {dep.status === 'error' && (
                              <div className="w-5 h-5 rounded-full border border-rose-500/40 flex items-center justify-center text-rose-400">
                                <AlertCircle className="w-3 h-3" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-white tracking-tight">{dep.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${dep.envColor}`}>
                                {dep.env}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                                <span>-o-</span>
                                <span>{dep.branch}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono text-slate-500 shrink-0">{dep.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Feature Adoption / Category Performance (6 cols) */}
                <div className="lg:col-span-6 p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white tracking-tight">Feature Adoption</h3>
                        <p className="text-xs text-slate-400 mt-0.5">% of users using each feature</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('modules')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition"
                      >
                        <span>Flags</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Horizontal Bar Chart */}
                    <div className="mt-6 space-y-4">
                      {[
                        { label: 'Dashboard', percent: 88 },
                        { label: 'API', percent: 76 },
                        { label: 'Webhooks', percent: 64 },
                        { label: 'Team Mgmt', percent: 52 },
                        { label: 'SSO', percent: 36 },
                        { label: 'Audit Log', percent: 22 },
                      ].map((feat, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <span className="w-24 text-right pr-4 font-medium text-slate-300 shrink-0">{feat.label}</span>
                          <div className="flex-1 h-3 rounded-full bg-[#1A2234] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 transition-all duration-500"
                              style={{ width: `${feat.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* X-axis percentage scale */}
                  <div className="flex justify-between pl-24 pt-4 text-[10px] font-mono text-slate-500 border-t border-[#1E2638] mt-6">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* QUICK STORE ACTIONS STRIP */}
              <div className="p-6 rounded-3xl bg-[#111625] border border-[#1E2638] shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Store Management</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setProductSubTab('catalog');
                      setShowAddProdModal(true);
                    }}
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <ShoppingBag className="w-4 h-4 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Add Product</span>
                    <span className="text-[10px] text-slate-400">Direct upload</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('categories')}
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <Layers className="w-4 h-4 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Categories</span>
                    <span className="text-[10px] text-slate-400">{categories.length} Taxonomies</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('brands')}
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <Award className="w-4 h-4 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Brands</span>
                    <span className="text-[10px] text-slate-400">{brands.length} Registered</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <Sliders className="w-4 h-4 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Settings</span>
                    <span className="text-[10px] text-slate-400">Branding & Banners</span>
                  </button>

                  <Link
                    href={`/?tenant=${tenantSlug}`}
                    target="_blank"
                    className="p-3.5 rounded-2xl bg-[#161D30] hover:bg-[#1C2640] border border-[#212C46] text-left transition group"
                  >
                    <Store className="w-4 h-4 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-white block">Storefront</span>
                    <span className="text-[10px] text-slate-400">Live Customer View</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

        {/* ============================================================== */}
        {/* TAB: ECOMMERCE BUSINESS & GROWTH ANALYTICS HUB */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (() => {
          // Filter valid orders by analyticsDateRange
          const validOrders = orders.filter((o: any) => o.orderStatus !== 'INCOMPLETE');
          const incompleteOrdersList = orders.filter((o: any) => o.orderStatus === 'INCOMPLETE');

          const filteredAnalyticsOrders = validOrders.filter((ord: any) => {
            if (analyticsDateRange === 'all') return true;
            if (!ord.createdAt) return true;
            const time = new Date(ord.createdAt).getTime();
            const now = new Date();
            if (analyticsDateRange === 'today') {
              const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
              return time >= startOfToday;
            }
            if (analyticsDateRange === '7days') {
              return time >= now.getTime() - 7 * 24 * 3600 * 1000;
            }
            if (analyticsDateRange === '30days') {
              return time >= now.getTime() - 30 * 24 * 3600 * 1000;
            }
            if (analyticsDateRange === 'this_month') {
              return time >= new Date(now.getFullYear(), now.getMonth(), 1).getTime();
            }
            return true;
          });

          // Compute KPI totals
          const calculatedGross = filteredAnalyticsOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
          const grossRevenue = calculatedGross > 0 ? calculatedGross : 348500;
          const totalOrdersCount = filteredAnalyticsOrders.length > 0 ? filteredAnalyticsOrders.length : 26;
          const aov = Math.round(grossRevenue / (totalOrdersCount || 1));

          const deliveredOrders = filteredAnalyticsOrders.filter((o: any) => ['DELIVERED', 'COMPLETED'].includes(o.orderStatus?.toUpperCase()));
          const deliveredRevenue = deliveredOrders.length > 0
            ? deliveredOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0)
            : Math.round(grossRevenue * 0.84);

          const rtoRate = 3.8;
          const deliverySuccessRate = 95.2;

          // Day-by-day trend data for chart
          const dailyTrendData = [
            { day: 'Mon', date: 'Oct 21', revenue: Math.round(grossRevenue * 0.12), orders: Math.max(2, Math.round(totalOrdersCount * 0.12)) },
            { day: 'Tue', date: 'Oct 22', revenue: Math.round(grossRevenue * 0.15), orders: Math.max(3, Math.round(totalOrdersCount * 0.15)) },
            { day: 'Wed', date: 'Oct 23', revenue: Math.round(grossRevenue * 0.19), orders: Math.max(5, Math.round(totalOrdersCount * 0.20)) },
            { day: 'Thu', date: 'Oct 24', revenue: Math.round(grossRevenue * 0.13), orders: Math.max(3, Math.round(totalOrdersCount * 0.13)) },
            { day: 'Fri', date: 'Oct 25', revenue: Math.round(grossRevenue * 0.23), orders: Math.max(6, Math.round(totalOrdersCount * 0.23)) },
            { day: 'Sat', date: 'Oct 26', revenue: Math.round(grossRevenue * 0.10), orders: Math.max(2, Math.round(totalOrdersCount * 0.10)) },
            { day: 'Sun', date: 'Oct 27', revenue: Math.round(grossRevenue * 0.08), orders: Math.max(2, Math.round(totalOrdersCount * 0.07)) },
          ];

          const maxDailyRevenue = Math.max(...dailyTrendData.map((d) => d.revenue), 1);
          const maxDailyOrders = Math.max(...dailyTrendData.map((d) => d.orders), 1);

          // Top selling products extraction
          const productSalesMap: Record<string, { title: string; count: number; revenue: number; stock: number; image?: string; category?: string }> = {};

          items.slice(0, 5).forEach((item: any, idx: number) => {
            const baseCount = [14, 11, 8, 6, 5][idx] || 4;
            const price = Number(item.price) || 28000;
            productSalesMap[item.id || item.title] = {
              title: item.title,
              count: baseCount,
              revenue: baseCount * price,
              stock: Number(item.stockQuantity ?? item.stock ?? 18),
              image: item.images?.[0] || item.imageUrl || item.image || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80',
              category: item.category?.name || 'Home Appliances',
            };
          });

          filteredAnalyticsOrders.forEach((ord: any) => {
            if (Array.isArray(ord.items)) {
              ord.items.forEach((it: any) => {
                const key = it.title || it.id || 'Custom Product';
                if (productSalesMap[key]) {
                  productSalesMap[key].count += Number(it.quantity) || 1;
                  productSalesMap[key].revenue += (Number(it.price) || 0) * (Number(it.quantity) || 1);
                }
              });
            }
          });

          const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

          return (
            <div className="space-y-6">
              {/* Analytics Header & Date Range Filter Bar */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/60">
                      Live Business Intelligence
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Realtime Synced
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">E-Commerce & Revenue Analytics Hub</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live operational metrics, courier realization rates, conversion funnel drop-offs, and SKU sales velocity.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
                  {/* Date Range Selector Pills */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                    <button
                      onClick={() => setAnalyticsDateRange('today')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        analyticsDateRange === 'today'
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setAnalyticsDateRange('7days')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        analyticsDateRange === '7days'
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setAnalyticsDateRange('30days')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        analyticsDateRange === '30days'
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      30 Days
                    </button>
                    <button
                      onClick={() => setAnalyticsDateRange('this_month')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        analyticsDateRange === 'this_month'
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      This Month
                    </button>
                    <button
                      onClick={() => setAnalyticsDateRange('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        analyticsDateRange === 'all'
                          ? 'bg-white text-slate-900 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      All Time
                    </button>
                  </div>

                  {/* Live Refresh Trigger */}
                  <button
                    onClick={() => setRefreshTrigger((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
                    title="Refresh Live Metrics"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync</span>
                  </button>
                </div>
              </div>

              {/* 4 High-Impact KPI Performance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Gross Sales Revenue */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Sales</span>
                    <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      ৳ {grossRevenue.toLocaleString('en-BD')}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 font-medium">Delivered:</span>
                      <span className="text-emerald-600 font-bold">৳ {deliveredRevenue.toLocaleString('en-BD')}</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+18.4% vs previous period</span>
                  </div>
                </div>

                {/* KPI 2: Total Confirmed Orders */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed Orders</span>
                    <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {totalOrdersCount} <span className="text-sm font-semibold text-slate-400">orders</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 font-medium">Daily Velocity:</span>
                      <span className="text-blue-600 font-bold">~{Math.max(1, Math.round(totalOrdersCount / 7))} / day</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-blue-600">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+12.6% order frequency</span>
                  </div>
                </div>

                {/* KPI 3: Average Order Value (AOV) */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Order Value</span>
                    <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                      <Target className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      ৳ {aov.toLocaleString('en-BD')}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 font-medium">Basket Size:</span>
                      <span className="text-purple-600 font-bold">High Ticket SKU</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-purple-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Electronics Archetype</span>
                  </div>
                </div>

                {/* KPI 4: Courier Delivery Success Rate */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Success</span>
                    <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform">
                      <Truck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                      {deliverySuccessRate}%
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500 font-medium">RTO / Return Rate:</span>
                      <span className="text-emerald-600 font-bold">{rtoRate}% (Low Risk)</span>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-amber-600">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Steadfast & Pathao Synced</span>
                  </div>
                </div>
              </div>

              {/* Visual Interactive Sales Revenue & Order Velocity Chart */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Performance Over Time</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Sales Velocity & Daily Volume Trend</h3>
                  </div>

                  {/* Metric Toggle Button Group */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                    <button
                      onClick={() => setAnalyticsChartMetric('revenue')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        analyticsChartMetric === 'revenue'
                          ? 'bg-purple-600 text-white shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Sales Revenue (৳)</span>
                    </button>
                    <button
                      onClick={() => setAnalyticsChartMetric('orders')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        analyticsChartMetric === 'orders'
                          ? 'bg-purple-600 text-white shadow-sm font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order Volume (#)</span>
                    </button>
                  </div>
                </div>

                {/* Bar Chart Canvas */}
                <div className="mt-6">
                  <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-100">
                    {dailyTrendData.map((item, idx) => {
                      const value = analyticsChartMetric === 'revenue' ? item.revenue : item.orders;
                      const maxValue = analyticsChartMetric === 'revenue' ? maxDailyRevenue : maxDailyOrders;
                      const heightPercent = Math.max(12, Math.round((value / maxValue) * 100));

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                          {/* Hover Tooltip Popup */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none absolute -top-12 z-20 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[11px] font-semibold whitespace-nowrap shadow-xl flex flex-col items-center">
                            <span>{item.date}</span>
                            <span className="text-purple-300 font-bold">
                              {analyticsChartMetric === 'revenue' ? `৳ ${item.revenue.toLocaleString('en-BD')}` : `${item.orders} Orders`}
                            </span>
                            <div className="w-2 h-2 bg-slate-900 rotate-45 -mb-1 mt-0.5" />
                          </div>

                          {/* Top Value Display */}
                          <div className="mb-2 text-[10px] sm:text-[11px] font-bold text-slate-500 opacity-80 group-hover:opacity-100 transition">
                            {analyticsChartMetric === 'revenue' ? `৳${Math.round(item.revenue / 1000)}k` : `${item.orders}`}
                          </div>

                          {/* Gradient Bar */}
                          <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t-xl transition-all duration-500 group-hover:brightness-110 ${
                                analyticsChartMetric === 'revenue'
                                  ? 'bg-gradient-to-t from-purple-700 via-purple-600 to-indigo-400'
                                  : 'bg-gradient-to-t from-blue-700 via-blue-600 to-cyan-400'
                              }`}
                            />
                          </div>

                          {/* Day Label */}
                          <div className="mt-3 text-center">
                            <span className="block text-xs font-bold text-slate-800">{item.day}</span>
                            <span className="block text-[10px] text-slate-400">{item.date.split(' ')[1]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Bar Footer */}
                  <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                        Peak Sales: <strong className="text-slate-800">Friday (৳ {Math.round(grossRevenue * 0.23).toLocaleString('en-BD')})</strong>
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                        Weekend Volume: <strong className="text-slate-800">Moderate</strong>
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-200/50">
                      Projected 30-Day Run-Rate: ৳ {Math.round(grossRevenue * 1.25).toLocaleString('en-BD')}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Stage E-Commerce Conversion Funnel & Abandoned Cart Recovery */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Customer Journey & Funnel</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">5-Stage Storefront Conversion Funnel</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Analyze where shoppers drop off from first site visit to order confirmation.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200/60">
                    Overall Conversion: 7.8%
                  </span>
                </div>

                {/* Funnel Stage Steps */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {/* Stage 1 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Stage 1</span>
                      <Globe className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-lg font-black text-slate-900">14,850</div>
                    <div className="text-xs font-bold text-slate-600 mt-0.5">Storefront Visitors</div>
                    <div className="mt-3 text-[11px] font-bold text-slate-500">100% of traffic</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-slate-700 h-full w-full rounded-full" />
                    </div>
                  </div>

                  {/* Stage 2 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Stage 2</span>
                      <Eye className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-lg font-black text-slate-900">9,520</div>
                    <div className="text-xs font-bold text-slate-600 mt-0.5">Product Detail Views</div>
                    <div className="mt-3 text-[11px] font-bold text-blue-600">64.1% retention</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-600 h-full w-[64%]" />
                    </div>
                  </div>

                  {/* Stage 3 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Stage 3</span>
                      <ShoppingCart className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-lg font-black text-slate-900">3,680</div>
                    <div className="text-xs font-bold text-slate-600 mt-0.5">Added to Cart</div>
                    <div className="mt-3 text-[11px] font-bold text-purple-600">24.8% of visitors</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-purple-600 h-full w-[25%]" />
                    </div>
                  </div>

                  {/* Stage 4 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Stage 4</span>
                      <CreditCard className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-lg font-black text-slate-900">1,940</div>
                    <div className="text-xs font-bold text-slate-600 mt-0.5">Checkout Reached</div>
                    <div className="mt-3 text-[11px] font-bold text-amber-600">13.1% reach checkout</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-amber-500 h-full w-[13%]" />
                    </div>
                  </div>

                  {/* Stage 5 */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">Stage 5</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-lg font-black text-emerald-900">{totalOrdersCount} Orders</div>
                    <div className="text-xs font-bold text-emerald-800 mt-0.5">Completed Purchases</div>
                    <div className="mt-3 text-[11px] font-bold text-emerald-600">7.8% Final Won</div>
                    <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[8%]" />
                    </div>
                  </div>
                </div>

                {/* Abandoned Cart Recovery Banner */}
                <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {incompleteOrdersList.length || 3} Abandoned Checkout Sessions Recorded
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Recover up to <strong className="text-slate-900">৳ 58,400</strong> by sending 1-click WhatsApp reminders to incomplete buyers.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setOrderFilterStatus('incomplete');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-sm shrink-0"
                  >
                    <span>View Incomplete Orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Courier Partner Fulfillment Matrix (Steadfast, Pathao, RedX) */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Logistics & Courier Delivery</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Courier Delivery & Cash Realization Health</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-500">Steadfast / Pathao / RedX</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Steadfast Courier Card */}
                  <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 hover:border-emerald-300 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                          ST
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Steadfast Courier</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">Primary Logistics Partner</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                        Live API
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Delivery Success Rate:</span>
                        <span className="font-extrabold text-emerald-700">95.4%</span>
                      </div>
                      <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full w-[95%]" />
                      </div>
                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span className="text-slate-500">RTO / Return Rate:</span>
                        <span className="font-bold text-slate-700">3.2%</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Inside Dhaka Speed:</span>
                        <span className="font-bold text-slate-700">24 Hours (98.2%)</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Active In-Transit:</span>
                        <span className="font-bold text-purple-600">8 Parcels</span>
                      </div>
                    </div>
                  </div>

                  {/* Pathao Courier Card */}
                  <div className="p-5 rounded-2xl border border-red-200 bg-red-50/20 hover:border-red-300 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xs">
                          PT
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Pathao Courier</div>
                          <div className="text-[10px] text-red-600 font-semibold">Express City Logistics</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700">
                        Live API
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Delivery Success Rate:</span>
                        <span className="font-extrabold text-red-700">92.6%</span>
                      </div>
                      <div className="w-full bg-red-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-full w-[93%]" />
                      </div>
                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span className="text-slate-500">RTO / Return Rate:</span>
                        <span className="font-bold text-slate-700">4.8%</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Dhaka Express Speed:</span>
                        <span className="font-bold text-slate-700">Same Day / 12 Hours</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Active In-Transit:</span>
                        <span className="font-bold text-purple-600">5 Parcels</span>
                      </div>
                    </div>
                  </div>

                  {/* RedX & Regional Courier Card */}
                  <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/20 hover:border-amber-300 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs">
                          RX
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">RedX Logistics</div>
                          <div className="text-[10px] text-amber-600 font-semibold">Nationwide District Hubs</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700">
                        Connected
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Delivery Success Rate:</span>
                        <span className="font-extrabold text-amber-700">89.2%</span>
                      </div>
                      <div className="w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full w-[89%]" />
                      </div>
                      <div className="flex justify-between items-center text-[11px] pt-1">
                        <span className="text-slate-500">RTO / Return Rate:</span>
                        <span className="font-bold text-slate-700">5.9%</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Coverage:</span>
                        <span className="font-bold text-slate-700">64 Districts & Upazilas</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Active In-Transit:</span>
                        <span className="font-bold text-purple-600">2 Parcels</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Products & SKU Velocity Table */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Inventory & SKU Velocity</span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Top Selling Electronics & Appliances</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                  >
                    <span>View All Products</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pl-2">Rank</th>
                        <th className="pb-3">Product Name & Category</th>
                        <th className="pb-3 text-center">Units Sold</th>
                        <th className="pb-3 text-right">Revenue Generated</th>
                        <th className="pb-3 text-right pr-2">Stock Remaining</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topProducts.map((prod, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 pl-2">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                                idx === 0
                                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                  : idx === 1
                                  ? 'bg-slate-200 text-slate-700'
                                  : idx === 2
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              #{idx + 1}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              {prod.image && (
                                <img
                                  src={prod.image}
                                  alt={prod.title}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                              )}
                              <div>
                                <div className="font-bold text-slate-900">{prod.title}</div>
                                <span className="text-[10px] font-semibold text-slate-500">{prod.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center">
                            <span className="font-extrabold text-slate-900">{prod.count} units</span>
                            <div className="w-20 mx-auto bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, prod.count * 6)}%` }}
                                className="bg-purple-600 h-full rounded-full"
                              />
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <span className="font-black text-slate-900">৳ {prod.revenue.toLocaleString('en-BD')}</span>
                          </td>
                          <td className="py-3 text-right pr-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                prod.stock > 10
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : prod.stock > 3
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regional Sales & Payment Method Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regional (City / Division) Breakdown */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Demographics</span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">Regional Sales Distribution</h4>
                    </div>
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-bold text-slate-800">Dhaka Metro & Suburbs (Gazipur, Narayanganj)</span>
                        <span className="font-extrabold text-slate-900">64% (৳ {Math.round(grossRevenue * 0.64).toLocaleString('en-BD')})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full w-[64%] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-bold text-slate-800">Chittagong Division</span>
                        <span className="font-extrabold text-slate-900">18% (৳ {Math.round(grossRevenue * 0.18).toLocaleString('en-BD')})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[18%] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-bold text-slate-800">Sylhet Division</span>
                        <span className="font-extrabold text-slate-900">10% (৳ {Math.round(grossRevenue * 0.10).toLocaleString('en-BD')})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[10%] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-bold text-slate-800">Rajshahi & Khulna</span>
                        <span className="font-extrabold text-slate-900">8% (৳ {Math.round(grossRevenue * 0.08).toLocaleString('en-BD')})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[8%] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Gateway Breakdown */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Settlements</span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-0.5">Payment Method Share</h4>
                    </div>
                    <CreditCard className="w-4 h-4 text-slate-400" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span className="font-bold text-slate-800">Cash on Delivery (COD)</span>
                        </div>
                        <span className="font-extrabold text-slate-900">72%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[72%] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                          <span className="font-bold text-slate-800">bKash Merchant Payment</span>
                        </div>
                        <span className="font-extrabold text-slate-900">20%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-pink-500 h-full w-[20%] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          <span className="font-bold text-slate-800">Nagad Direct Gateway</span>
                        </div>
                        <span className="font-extrabold text-slate-900">5%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full w-[5%] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          <span className="font-bold text-slate-800">Visa / Mastercard / POS</span>
                        </div>
                        <span className="font-extrabold text-slate-900">3%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[3%] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* TAB: CATEGORY-TAILORED ORDER & APPOINTMENT MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orderNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{orderNotice}</span>
              </div>
            )}

            {/* Orders Header Banner */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Fulfillment & Operations</span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">Category-Tailored Order & Booking Management</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage physical goods shipments via Steadfast/Pathao, doctor clinical slots, and real estate buyer leads.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
                <button
                  onClick={() => {
                    const currentFiltered = orders.filter((ord) => {
                      const matchStatus =
                        orderFilterStatus === 'all' ||
                        ord.orderStatus?.toLowerCase() === orderFilterStatus.toLowerCase() ||
                        ord.consultationStatus?.toLowerCase() === orderFilterStatus.toLowerCase();
                      const matchSearch =
                        !orderSearchQuery.trim() ||
                        ord.customerName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                        ord.customerPhone?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                        ord.orderNumber?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                        (ord.clientIp && ord.clientIp.toLowerCase().includes(orderSearchQuery.toLowerCase()));
                      
                      let matchFraud = true;
                      if (fraudFilterTab === 'high_risk') {
                        matchFraud = ord.customerHistory?.trustScore === 'RISK' || (ord.customerHistory?.deliverySuccessRate != null && ord.customerHistory.deliverySuccessRate < 50) || ord.addressDiscrepancy === true;
                      } else if (fraudFilterTab === 'blocked') {
                        matchFraud = ord.isBlockedCustomer === true;
                      } else if (fraudFilterTab === 'trusted') {
                        matchFraud = ord.customerHistory?.trustScore === 'EXCELLENT' || ord.customerHistory?.trustScore === 'GOOD';
                      }

                      const matchDate = (() => {
                        if (orderDatePreset === 'all' && !orderStartDate && !orderEndDate) return true;
                        if (!ord.createdAt) return true;
                        const orderTime = new Date(ord.createdAt).getTime();
                        const now = new Date();
                        if (orderDatePreset === 'today') {
                          const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                          return orderTime >= startOfToday;
                        }
                        if (orderDatePreset === 'yesterday') {
                          const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
                          const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                          return orderTime >= startOfYesterday && orderTime < endOfYesterday;
                        }
                        if (orderDatePreset === '7days') {
                          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).getTime();
                          return orderTime >= sevenDaysAgo;
                        }
                        if (orderDatePreset === 'this_month') {
                          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                          return orderTime >= startOfMonth;
                        }
                        if (orderDatePreset === 'custom' || orderStartDate || orderEndDate) {
                          let afterStart = true;
                          let beforeEnd = true;
                          if (orderStartDate) {
                            afterStart = orderTime >= new Date(`${orderStartDate}T00:00:00`).getTime();
                          }
                          if (orderEndDate) {
                            beforeEnd = orderTime <= new Date(`${orderEndDate}T23:59:59`).getTime();
                          }
                          return afterStart && beforeEnd;
                        }
                        return true;
                      })();

                      return matchStatus && matchSearch && matchFraud && matchDate;
                    });
                    handleExportOrdersToExcel(currentFiltered);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
                  title="Export currently filtered orders to Excel / CSV with UTF-8 support"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                  <span>Export Excel (CSV)</span>
                </button>
                <button
                  onClick={() => setShowManualOrderModal(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Manual Order</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Sheet</span>
                </button>
              </div>
            </div>

            {/* Secondary Status & Search Filter */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder="Search customer, phone, order #..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Status:</span>
                {['all', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CONFIRMED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilterStatus(st)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderFilterStatus === st
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
                {/* Incomplete / Abandoned Checkout Filter Tab */}
                {(() => {
                  const incCount = orders.filter((o) => o.orderStatus === 'INCOMPLETE').length;
                  return (
                    <button
                      onClick={() => setOrderFilterStatus('INCOMPLETE')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                        orderFilterStatus === 'INCOMPLETE'
                          ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                          : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      <span>⚠️ Incomplete Orders</span>
                      {incCount > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                          orderFilterStatus === 'INCOMPLETE' ? 'bg-amber-900 text-amber-100' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {incCount}
                        </span>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Date Range & Quick Preset Filter Bar */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs print:hidden shadow-xs">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-bold text-slate-500 flex items-center gap-1.5 whitespace-nowrap mr-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date Filter:</span>
                </span>
                {[
                  { id: 'all', label: 'All Time' },
                  { id: 'today', label: 'Today' },
                  { id: 'yesterday', label: 'Yesterday' },
                  { id: '7days', label: 'Last 7 Days' },
                  { id: 'this_month', label: 'This Month' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setOrderDatePreset(preset.id as any);
                      if (preset.id !== 'custom') {
                        setOrderStartDate('');
                        setOrderEndDate('');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      orderDatePreset === preset.id && !orderStartDate && !orderEndDate
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-medium text-[11px]">From:</span>
                  <input
                    type="date"
                    value={orderStartDate}
                    onChange={(e) => {
                      setOrderStartDate(e.target.value);
                      setOrderDatePreset('custom');
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-medium text-[11px]">To:</span>
                  <input
                    type="date"
                    value={orderEndDate}
                    onChange={(e) => {
                      setOrderEndDate(e.target.value);
                      setOrderDatePreset('custom');
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                {(orderStartDate || orderEndDate || orderDatePreset !== 'all') && (
                  <button
                    onClick={() => {
                      setOrderDatePreset('all');
                      setOrderStartDate('');
                      setOrderEndDate('');
                    }}
                    className="px-2 py-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                    title="Reset date filter"
                  >
                    ✕ Reset Date
                  </button>
                )}
              </div>
            </div>

            {/* Customer Security & Fraud Intelligence Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Security Filter:</span>
              </span>
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'high_risk', label: '🚨 High Risk Orders', color: 'text-rose-700 bg-rose-50 border-rose-300' },
                { id: 'blocked', label: '🚫 Blocked Customers', color: 'text-red-700 bg-red-50 border-red-300' },
                { id: 'trusted', label: '💎 Trusted Customers', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFraudFilterTab(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                    fraudFilterTab === f.id
                      ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                      : f.color || 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Incomplete Orders KPI Banner (Shown when Incomplete Orders Tab is Active) */}
            {orderFilterStatus === 'INCOMPLETE' && (() => {
              const incOrders = orders.filter((o) => o.orderStatus === 'INCOMPLETE');
              const recoverableVal = incOrders.reduce((acc, o) => acc + (Number(o.totalAmount || o.subtotal) || 0), 0);
              return (
                <div className="p-5 rounded-3xl bg-linear-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300/80 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold text-lg">
                        ⚠️
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-amber-950">
                          Incomplete Orders & Abandoned Checkout Recovery
                        </h4>
                        <p className="text-xs text-amber-800">
                          These customers initiated checkout and left contact details but did not place their final order. Follow up directly to recover high-intent revenue!
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Recoverable Cart Value</span>
                        <span className="text-lg font-black text-amber-950 font-mono">
                          ৳ {recoverableVal.toLocaleString()} BDT
                        </span>
                      </div>
                      <div className="text-right border-l border-amber-300/80 pl-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Total Abandoned Leads</span>
                        <span className="text-lg font-black text-amber-950 font-mono">
                          {incOrders.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Orders Cards List */}
            {(() => {
              const filteredOrders = orders.filter((ord) => {
                const matchStatus =
                  orderFilterStatus === 'all' ||
                  ord.orderStatus?.toLowerCase() === orderFilterStatus.toLowerCase() ||
                  ord.consultationStatus?.toLowerCase() === orderFilterStatus.toLowerCase();
                const matchSearch =
                  !orderSearchQuery.trim() ||
                  ord.customerName?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                  ord.customerPhone?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                  ord.orderNumber?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
                  (ord.clientIp && ord.clientIp.toLowerCase().includes(orderSearchQuery.toLowerCase()));
                
                let matchFraud = true;
                if (fraudFilterTab === 'high_risk') {
                  matchFraud = ord.customerHistory?.trustScore === 'RISK' || (ord.customerHistory?.deliverySuccessRate != null && ord.customerHistory.deliverySuccessRate < 50) || ord.addressDiscrepancy === true;
                } else if (fraudFilterTab === 'blocked') {
                  matchFraud = ord.isBlockedCustomer === true;
                } else if (fraudFilterTab === 'trusted') {
                  matchFraud = ord.customerHistory?.trustScore === 'EXCELLENT' || ord.customerHistory?.trustScore === 'GOOD';
                }

                const matchDate = (() => {
                  if (orderDatePreset === 'all' && !orderStartDate && !orderEndDate) return true;
                  if (!ord.createdAt) return true;
                  const orderTime = new Date(ord.createdAt).getTime();
                  const now = new Date();
                  if (orderDatePreset === 'today') {
                    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    return orderTime >= startOfToday;
                  }
                  if (orderDatePreset === 'yesterday') {
                    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime();
                    const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    return orderTime >= startOfYesterday && orderTime < endOfYesterday;
                  }
                  if (orderDatePreset === '7days') {
                    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).getTime();
                    return orderTime >= sevenDaysAgo;
                  }
                  if (orderDatePreset === 'this_month') {
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                    return orderTime >= startOfMonth;
                  }
                  if (orderDatePreset === 'custom' || orderStartDate || orderEndDate) {
                    let afterStart = true;
                    let beforeEnd = true;
                    if (orderStartDate) {
                      afterStart = orderTime >= new Date(`${orderStartDate}T00:00:00`).getTime();
                    }
                    if (orderEndDate) {
                      beforeEnd = orderTime <= new Date(`${orderEndDate}T23:59:59`).getTime();
                    }
                    return afterStart && beforeEnd;
                  }
                  return true;
                })();

                return matchStatus && matchSearch && matchFraud && matchDate;
              });

              if (filteredOrders.length === 0) {
                return (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-600 text-sm">No orders matching the current filter</p>
                    <p className="mt-1">Try clearing the date filter, search query, or selecting a different status.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Printable Manifest Header (Only visible when printing sheet) */}
                  <div className="hidden print:block pb-4 mb-4 border-b-2 border-slate-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                          {tenantInfo?.name || 'Merchant Store'} — Daily Courier Dispatch & Order Sheet
                        </h1>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Store ID: {tenantSlug} | Helpline: {tenantInfo?.phone || '+880 1811-223344'} | Address: {tenantInfo?.address || 'Dhaka, Bangladesh'}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-800">
                        <p className="font-bold">Date: {new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-[11px] font-semibold text-slate-600">Total Manifest Orders: {filteredOrders.length}</p>
                      </div>
                    </div>
                  </div>

                  {filteredOrders.map((ord) => {
                    const isMed = ord.orderType === 'SERVICE_APPOINTMENT';
                    const isEstate = ord.orderType === 'LEAD_GEN_REAL_ESTATE';

                    return (
                      <div
                        key={ord.id || ord.orderNumber}
                        className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-4 print:p-4 print:rounded-2xl print:border-slate-800 print:shadow-none print:break-inside-avoid print:mb-4"
                      >
                        {/* Header: Order Number, Category & Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                              {ord.orderNumber}
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                                isMed
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isEstate
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {isMed ? 'Doctor Clinical Slot' : isEstate ? 'Real Estate Buyer Lead' : 'Physical Courier Parcel'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                                ord.orderStatus === 'INCOMPLETE'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : ord.orderStatus === 'DELIVERED' || ord.orderStatus === 'CONFIRMED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'SHIPPED'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : ord.orderStatus === 'PROCESSING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              <span>{ord.orderStatus === 'INCOMPLETE' ? '⚠️ INCOMPLETE (ABANDONED)' : (ord.orderStatus || 'PENDING')}</span>
                            </span>
                          </div>
                        </div>

                        {/* Customer & Category-Specific Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Customer Details & Fraud Intelligence */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                Customer Contact
                              </span>
                              {/* Trust Score Badge */}
                              {ord.isBlockedCustomer ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800 border border-red-300">
                                  <Ban className="w-3 h-3 text-red-600" />
                                  🚫 Blocked Customer
                                </span>
                              ) : ord.addressDiscrepancy ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  🚨 High Risk (IP Mismatch)
                                </span>
                              ) : ord.customerHistory?.trustScore === 'EXCELLENT' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  <Award className="w-3 h-3 text-emerald-600" />
                                  💎 Highly Trusted ({ord.customerHistory?.deliverySuccessRate}%)
                                </span>
                              ) : ord.customerHistory?.trustScore === 'GOOD' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300">
                                  <CheckCircle className="w-3 h-3 text-blue-600" />
                                  ✓ Trusted ({ord.customerHistory?.deliverySuccessRate}%)
                                </span>
                              ) : ord.customerHistory?.trustScore === 'RISK' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  ⚠️ Suspicious Customer ({ord.customerHistory?.deliverySuccessRate}%)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                  ✨ New Customer
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{ord.customerName}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <a href={`tel:${ord.customerPhone}`} className="hover:text-rose-600 font-mono font-bold">
                                  {ord.customerPhone}
                                </a>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleViewCustomerHistory(ord.customerPhone, ord.customerName)}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 transition hover:bg-indigo-100"
                                title="View customer past order history"
                              >
                                <Eye className="w-3 h-3" />
                                <span>History</span>
                              </button>
                            </div>

                            {/* Customer Lifetime Delivery Stats Pill */}
                            {ord.customerHistory && (
                              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
                                <div className="flex items-center justify-between text-slate-600 font-semibold text-[10px]">
                                  <span>Lifetime Order Record:</span>
                                  <span className="font-mono font-bold text-slate-900">{ord.customerHistory.totalOrders} Total</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                                  <div className="bg-emerald-50 text-emerald-800 rounded p-1 border border-emerald-200">
                                    <span className="block font-bold">✓ {ord.customerHistory.deliveredOrders}</span>
                                    <span className="text-[9px] text-emerald-600 font-sans">Delivered</span>
                                  </div>
                                  <div className="bg-rose-50 text-rose-800 rounded p-1 border border-rose-200">
                                    <span className="block font-bold">✕ {ord.customerHistory.cancelledOrders}</span>
                                    <span className="text-[9px] text-rose-600 font-sans">Cancelled</span>
                                  </div>
                                  <div className="bg-indigo-50 text-indigo-800 rounded p-1 border border-indigo-200">
                                    <span className="block font-bold">{ord.customerHistory.deliverySuccessRate}%</span>
                                    <span className="text-[9px] text-indigo-600 font-sans">Success Rate</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Shipping Delivery Address */}
                            <div className="flex items-start gap-2 text-xs text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span>
                                {ord.shippingAddress}, <strong>{ord.city}</strong>
                              </span>
                            </div>

                            {/* Device & Client IP Geolocation Card */}
                            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 text-[11px] space-y-1.5 border border-slate-800 shadow-inner">
                              <div className="flex items-center justify-between text-[10px] text-slate-400">
                                <span className="flex items-center gap-1 font-mono uppercase tracking-wider">
                                  <Laptop className="w-3 h-3 text-cyan-400" />
                                  <span>{ord.deviceType || 'Device'} • {ord.os || 'OS'} ({ord.browser || 'Browser'})</span>
                                </span>
                              </div>
                              <div className="flex items-center justify-between font-mono text-xs">
                                <span className="text-cyan-300 font-bold">{ord.clientIp || '103.205.71.42'}</span>
                                <span className="text-slate-300 text-[10px] bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                                  📍 IP: {ord.ipCity || 'Dhaka'}
                                </span>
                              </div>

                              {/* Address Discrepancy Alert */}
                              {ord.addressDiscrepancy && (
                                <div className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-200 text-[10px] flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  <span>
                                    <strong>Warning:</strong> IP City ({ord.ipCity}) & Delivery City ({ord.city}) do not match!
                                  </span>
                                </div>
                              )}

                              {/* Google Maps Button */}
                              <button
                                type="button"
                                onClick={() => setMapModalOrder(ord)}
                                className="w-full mt-1 py-1 px-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 font-bold text-[10px] transition flex items-center justify-center gap-1.5"
                              >
                                <Globe className="w-3 h-3 text-cyan-400" />
                                <span>View IP Location Pin on Google Maps</span>
                              </button>
                            </div>

                            {ord.notes && (
                              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100 mt-2">
                                Note: {ord.notes}
                              </p>
                            )}
                          </div>

                          {/* Category Specific Block */}
                          <div className="md:col-span-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                            {/* Physical Goods */}
                            {!isMed && !isEstate && (
                              <>
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Courier Shipment & Fulfillment
                                  </span>
                                  <span className="text-xs font-bold text-emerald-600">
                                    Payment: {ord.paymentMethod || 'COD (Cash on Delivery)'}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  {ord.items?.map((it: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-800">
                                          {it.itemTitle || it.title} {it.variantTitle ? `(${it.variantTitle})` : ''} × {it.quantity || 1}
                                        </span>
                                        {ord.orderStatus === 'DELIVERED' || ord.orderStatus === 'SHIPPED' ? (
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                            ✓ Dispatched
                                          </span>
                                        ) : ord.orderStatus === 'CANCELLED' ? (
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-300">
                                            🔓 Stock Unlocked
                                          </span>
                                        ) : (
                                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                            🔒 Stock Reserved ({it.quantity || 1})
                                          </span>
                                        )}
                                      </div>
                                      <span className="font-mono text-slate-700 font-bold">
                                        BDT {(it.price * (it.quantity || 1)).toLocaleString()}
                                      </span>
                                    </div>
                                  ))}
                                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
                                    <span>Delivery Fee ({ord.city}):</span>
                                    <span>BDT {ord.deliveryCharge || 60}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm font-black text-slate-900 pt-1">
                                    <span>Total Payable:</span>
                                    <span className="text-rose-600 font-black">BDT {ord.totalAmount?.toLocaleString()}</span>
                                  </div>
                                </div>

                                {/* Courier Assignment, 1-Click Fast Booking, Tracking & Label Print Row */}
                                 <div className="pt-3 border-t border-slate-200 space-y-2.5">
                                   {/* If parcel is already booked / has tracking code */}
                                   {ord.trackingCode ? (
                                     <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-100/90 p-2.5 rounded-2xl border border-slate-200">
                                       <div className="flex items-center gap-2">
                                         <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-[11px] shadow-xs">
                                           {ord.courier?.toLowerCase().includes('pathao') ? 'PT' : ord.courier?.toLowerCase().includes('redx') ? 'RX' : 'ST'}
                                         </div>
                                         <div>
                                           <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                                             <span>{ord.courier || 'Steadfast Courier'}</span>
                                             <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                               Booked
                                             </span>
                                           </div>
                                           <div className="flex items-center gap-1.5 mt-0.5">
                                             <span className="font-mono text-[11px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                               {ord.trackingCode}
                                             </span>
                                             <button
                                               type="button"
                                               onClick={() => handleCopyTracking(ord.trackingCode)}
                                               className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                               title="Copy tracking code"
                                             >
                                               {copiedTracking === ord.trackingCode ? (
                                                 <Check className="w-3.5 h-3.5 text-emerald-600" />
                                               ) : (
                                                 <Copy className="w-3.5 h-3.5" />
                                               )}
                                             </button>
                                           </div>
                                         </div>
                                       </div>

                                       <div className="flex items-center gap-2 print:hidden">
                                         {/* 1-Click Print Consignment Label */}
                                         <button
                                           type="button"
                                           onClick={() => setPrintLabelOrder(ord)}
                                           className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                                           title="Print 4x6 / A4 Courier Shipping Label & Challan"
                                         >
                                           <Printer className="w-3.5 h-3.5" />
                                           <span>চালান লেবেল প্রিন্ট</span>
                                         </button>

                                         {/* Live Consignment Tracking Drawer */}
                                         <button
                                           type="button"
                                           onClick={() => handleOpenLiveTracking(ord)}
                                           className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                                           title="Track live consignment milestones"
                                         >
                                           <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                                           <span>লাইভ ট্র্যাকিং</span>
                                         </button>
                                       </div>
                                     </div>
                                   ) : (
                                     /* If parcel is NOT YET booked: 1-Click Fast Book buttons & Custom Modal */
                                     <div className="bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-slate-50 p-2.5 rounded-2xl border border-indigo-100/80 flex flex-wrap items-center justify-between gap-3">
                                       <div className="flex items-center gap-2">
                                         <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                                           <Truck className="w-4 h-4" />
                                         </div>
                                         <div>
                                           <span className="text-xs font-extrabold text-slate-800 block">১-ক্লিক কুরিয়ার বুকিং</span>
                                           <span className="text-[10px] text-slate-500">Steadfast ও Pathao API দিয়ে সরাসরি পার্সেল বুক করুন</span>
                                         </div>
                                       </div>

                                       <div className="flex items-center gap-2 print:hidden flex-wrap">
                                         {/* 1-Click Steadfast */}
                                         <button
                                           type="button"
                                           disabled={dispatchingLoading}
                                           onClick={() => handleFastDispatch(ord, 'Steadfast Courier')}
                                           className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs disabled:opacity-50 cursor-pointer"
                                           title="Fast 1-click dispatch to Steadfast Courier"
                                         >
                                           <span className="w-4 h-4 rounded-full bg-white text-emerald-700 flex items-center justify-center font-black text-[9px]">ST</span>
                                           <span>Steadfast বুকিং</span>
                                         </button>

                                         {/* 1-Click Pathao */}
                                         <button
                                           type="button"
                                           disabled={dispatchingLoading}
                                           onClick={() => handleFastDispatch(ord, 'Pathao Courier')}
                                           className="px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition flex items-center gap-1 shadow-xs disabled:opacity-50 cursor-pointer"
                                           title="Fast 1-click dispatch to Pathao Courier"
                                         >
                                           <span className="w-4 h-4 rounded-full bg-white text-red-700 flex items-center justify-center font-black text-[9px]">PT</span>
                                           <span>Pathao বুকিং</span>
                                         </button>

                                         {/* Detailed Consignment Dispatch Modal */}
                                         <button
                                           type="button"
                                           onClick={() => handleOpenDispatchModal(ord)}
                                           className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition border border-slate-300 flex items-center gap-1 cursor-pointer"
                                           title="Customize COD amount, parcel weight and notes"
                                         >
                                           <Sliders className="w-3 h-3 text-slate-600" />
                                           <span>কাস্টম বুকিং</span>
                                         </button>
                                       </div>
                                     </div>
                                   )}
                                 </div>
                              </>
                            )}

                            {/* Healthcare Clinic */}
                            {isMed && (
                              <div className="space-y-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                                  Reserved Doctor Appointment
                                </span>
                                <div className="text-sm font-extrabold text-slate-900">
                                  {ord.serviceTitle || ord.items?.[0]?.itemTitle || 'Senior Dental Consultation'}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-slate-400 block text-[10px]">Date & Time Slot:</span>
                                    <span className="font-bold text-slate-800">
                                      {ord.appointmentDate || 'Today'}, {ord.appointmentTime || '11:00 AM'}
                                    </span>
                                  </div>
                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-slate-400 block text-[10px]">Slot Serial #:</span>
                                    <span className="font-bold text-emerald-600 font-mono">#{ord.serialNumber || 1}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Real Estate */}
                            {isEstate && (
                              <div className="space-y-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                                  Luxury Property Inquiry
                                </span>
                                <div className="text-sm font-extrabold text-slate-900">
                                  {ord.propertyTitle || 'The Grand Regal Country Estate'}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-slate-400 block text-[10px]">Buyer Budget:</span>
                                    <span className="font-bold text-amber-600">{ord.budget || 'BDT 45,000,000'}</span>
                                  </div>
                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-slate-400 block text-[10px]">Site Visit:</span>
                                    <span className="font-bold text-slate-800">{ord.siteVisitDate || 'Scheduled on request'}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Custom Attributes Snapshot (Metafield Attributes) */}
                        {ord.customAttributes && Object.keys(ord.customAttributes).length > 0 && (
                          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1.5 text-xs">
                            <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Order Specifications (Dynamic Custom Attributes)</span>
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                              {Object.entries(ord.customAttributes).map(([k, v]: [string, any]) => (
                                <div key={k} className="p-2 rounded-xl bg-white border border-indigo-100">
                                  <span className="text-[10px] text-slate-400 block font-semibold">{k.replace(/_/g, ' ')}</span>
                                  <span className="font-bold text-slate-900 truncate block">
                                    {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Order Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
                          {ord.orderStatus === 'INCOMPLETE' ? (
                            <div className="w-full flex flex-wrap items-center justify-between gap-2.5 bg-amber-500/10 p-3 rounded-2xl border border-amber-300">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-amber-950 flex items-center gap-1.5">
                                  <span>⚡ Recovery Actions:</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Direct Call Button */}
                                <a
                                  href={`tel:${ord.customerPhone}`}
                                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs active:scale-95"
                                  title="Call customer directly on mobile"
                                >
                                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Direct Call</span>
                                </a>

                                {/* 1-Click WhatsApp Follow-up */}
                                {(() => {
                                  const rawPhone = (ord.customerPhone || '').replace(/[^0-9]/g, '');
                                  const phoneForWa = rawPhone.startsWith('880') ? rawPhone : (rawPhone.startsWith('0') ? `88${rawPhone}` : `880${rawPhone}`);
                                  const firstItem = ord.items?.[0]?.itemTitle || 'পণ্য';
                                  const waMsg = `আসসালামু আলাইকুম ${ord.customerName || 'স্যার/ম্যাম'}, ${tenantInfo?.name || 'SmartVolt'} থেকে যোগাযোগ করছি। আপনি আমাদের ওয়েবসাইটে "${firstItem}" অর্ডার করার চেষ্টা করছিলেন কিন্তু অর্ডারটি সম্পন্ন হয়নি। কোনো তথ্য বা সহায়তা লাগলে আমাদের জানাতে পারেন। ধন্যবাদ!`;
                                  return (
                                    <a
                                      href={`https://wa.me/${phoneForWa}?text=${encodeURIComponent(waMsg)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-xs active:scale-95"
                                      title="Send WhatsApp recovery message"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>WhatsApp Follow-up</span>
                                    </a>
                                  );
                                })()}

                                {/* Convert to Confirmed Order */}
                                <button
                                  onClick={() => handleConvertIncompleteOrder(ord.id)}
                                  disabled={convertingOrderId === ord.id}
                                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95"
                                  title="Confirm and convert this incomplete draft into an active pending order"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{convertingOrderId === ord.id ? 'Converting...' : 'Convert to Order'}</span>
                                </button>

                                {/* Dismiss / Delete Order */}
                                <button
                                  onClick={() => handleDeleteOrder(ord.id)}
                                  disabled={deletingOrderId === ord.id}
                                  className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition flex items-center gap-1 active:scale-95"
                                  title="Dismiss / delete this abandoned order"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Dismiss</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500">Change Status:</span>
                                <select
                                  value={ord.orderStatus || 'PENDING'}
                                  onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                  className="text-xs font-bold bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                  <option value="CONFIRMED">CONFIRMED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Block / Unblock Customer Button */}
                                {ord.isBlockedCustomer ? (
                                  <button
                                    onClick={() => handleUnblockCustomer(ord.customerPhone)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 transition flex items-center gap-1 shadow-sm active:scale-95"
                                    title="Unblock Customer"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Unblock</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setBlockModalOrder(ord)}
                                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition flex items-center gap-1 shadow-sm active:scale-95"
                                    title="Block Fraud Customer"
                                  >
                                    <Ban className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Block Customer</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    handleUpdateOrderStatus(ord.id, 'DELIVERED');
                                  }}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                                >
                                  Mark Delivered
                                </button>
                                <button
                                  onClick={() => setInvoiceOrder(ord)}
                                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 shadow-sm active:scale-95"
                                  title="Print Single Customer Invoice"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>Invoice</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Modal: Manual Order Creation (Ecommerce Store Tailored) */}
        {showManualOrderModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto text-slate-900 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-orange-100 text-orange-700">
                      <ShoppingBag className="w-5 h-5 text-orange-600" />
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900">Create Manual Order (অর্ডার এন্ট্রি)</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Record a phone, WhatsApp, social media, or counter sale into your store inventory
                  </p>
                </div>
                <button
                  onClick={() => setShowManualOrderModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 text-xs font-bold transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateManualOrder} className="space-y-4">
                {/* 1. Fulfillment & Sales Channel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fulfillment / Delivery Method *
                    </label>
                    <select
                      value={manualDeliveryMethod}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setManualDeliveryMethod(val);
                        if (val === 'SHOWROOM_PICKUP') {
                          setManualDeliveryCharge('0');
                          setManualCourier('Showroom Counter');
                        } else if (val === 'EXPRESS_DELIVERY') {
                          setManualDeliveryCharge('150');
                          setManualCourier('Pathao Courier');
                        } else {
                          setManualDeliveryCharge(manualCity.toLowerCase().includes('dhaka') ? '60' : '120');
                          setManualCourier('Steadfast Courier');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="COURIER_DELIVERY">🚚 Standard Courier Delivery</option>
                      <option value="EXPRESS_DELIVERY">⚡ Express Same-Day Delivery</option>
                      <option value="SHOWROOM_PICKUP">🏬 Showroom / Counter Pickup</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sales Channel / Order Source *
                    </label>
                    <select
                      value={manualOrderSource}
                      onChange={(e) => setManualOrderSource(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="PHONE_CALL">📞 Phone Call Order</option>
                      <option value="WHATSAPP">💬 WhatsApp Chat Order</option>
                      <option value="FACEBOOK">🌐 Facebook / Social Media</option>
                      <option value="SHOWROOM_COUNTER">🏪 Showroom Walk-in Counter</option>
                    </select>
                  </div>
                </div>

                {/* 2. Product Picker from Store Inventory */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                      <span>Select Product from Store Catalog *</span>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {items.length} products in stock
                      </span>
                    </label>
                    <select
                      value={manualSelectedItemId}
                      onChange={(e) => {
                        const itId = e.target.value;
                        setManualSelectedItemId(itId);
                        if (!itId) return;
                        if (itId === 'custom') {
                          setManualItemTitle('');
                          setManualPrice('');
                          setManualVariantTitle('');
                          return;
                        }
                        const it = items.find((item) => item.id === itId || item.slug === itId);
                        if (it) {
                          setManualItemTitle(it.title || '');
                          setManualPrice(String(it.price || ''));
                          const vars = Array.isArray(it.variants)
                            ? it.variants
                            : (typeof it.variants === 'string' && it.variants.trim() ? it.variants.split(/[,;\n]/).map((s: string) => s.trim()).filter(Boolean) : []);
                          if (vars.length > 0) {
                            setManualVariantTitle(typeof vars[0] === 'string' ? vars[0] : (vars[0].title || ''));
                          } else {
                            setManualVariantTitle('');
                          }
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">-- Choose a Product from Catalog --</option>
                      {items.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.title} — ৳ {Number(it.price).toLocaleString()} {it.stock || it.stockQuantity ? `(Stock: ${it.stock || it.stockQuantity})` : ''}
                        </option>
                      ))}
                      <option value="custom">✏️ Custom / Unlisted Product Item...</option>
                    </select>
                  </div>

                  {/* Product Details & Variant */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={manualItemTitle}
                        onChange={(e) => setManualItemTitle(e.target.value)}
                        placeholder="e.g. Gree 1.5 Ton Inverter AC"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Option / Variant (Optional)</label>
                      {(() => {
                        const curItem = items.find((i) => i.id === manualSelectedItemId || i.slug === manualSelectedItemId);
                        const vars = curItem && Array.isArray(curItem.variants)
                          ? curItem.variants
                          : (curItem && typeof curItem.variants === 'string' && curItem.variants.trim() ? curItem.variants.split(/[,;\n]/).map((s: string) => s.trim()).filter(Boolean) : []);
                        
                        if (vars.length > 0) {
                          return (
                            <select
                              value={manualVariantTitle}
                              onChange={(e) => setManualVariantTitle(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                            >
                              <option value="">Standard Default</option>
                              {vars.map((v: any, vi: number) => {
                                const vLabel = typeof v === 'string' ? v : (v.title || v.name);
                                return <option key={vi} value={vLabel}>{vLabel}</option>;
                              })}
                            </select>
                          );
                        }
                        return (
                          <input
                            type="text"
                            value={manualVariantTitle}
                            onChange={(e) => setManualVariantTitle(e.target.value)}
                            placeholder="e.g. 1.5 Ton / White"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                          />
                        );
                      })()}
                    </div>
                  </div>

                  {/* Price, Quantity, Delivery Fee */}
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit Price (BDT) *</label>
                      <input
                        type="number"
                        required
                        value={manualPrice}
                        onChange={(e) => setManualPrice(e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={manualQuantity}
                        onChange={(e) => setManualQuantity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Delivery Charge</label>
                      <input
                        type="number"
                        value={manualDeliveryCharge}
                        onChange={(e) => setManualDeliveryCharge(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Real-time Order Total Calculation */}
                  {(() => {
                    const subtotal = (parseFloat(manualPrice) || 0) * (parseInt(manualQuantity, 10) || 1);
                    const fee = parseFloat(manualDeliveryCharge) || 0;
                    const grandTotal = subtotal + fee;
                    return (
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">
                          Subtotal: <strong>৳ {subtotal.toLocaleString()}</strong> + Delivery: <strong>৳ {fee}</strong>
                        </span>
                        <span className="font-extrabold text-slate-900 font-mono text-sm">
                          Total Payable: <span className="text-emerald-700">৳ {grandTotal.toLocaleString()} BDT</span>
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* 3. Customer Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={manualCustomerName}
                      onChange={(e) => setManualCustomerName(e.target.value)}
                      placeholder="e.g. Engr. Mahmudul Hasan"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      required
                      value={manualCustomerPhone}
                      onChange={(e) => setManualCustomerPhone(e.target.value)}
                      placeholder="01711-XXXXXX"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {manualDeliveryMethod === 'SHOWROOM_PICKUP' ? 'Showroom Pickup Location' : 'Delivery Address *'}
                    </label>
                    <input
                      type="text"
                      required={manualDeliveryMethod !== 'SHOWROOM_PICKUP'}
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      placeholder={manualDeliveryMethod === 'SHOWROOM_PICKUP' ? 'e.g. Dhanmondi Flagship Experience Center' : 'House, Road, Area'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Delivery City</label>
                    <select
                      value={manualCity}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        setManualCity(newCity);
                        if (manualDeliveryMethod !== 'SHOWROOM_PICKUP') {
                          setManualDeliveryCharge(newCity.includes('Dhaka') ? '60' : '120');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="Dhaka Metro">Dhaka Metro (Inside Dhaka - ৳ 60)</option>
                      <option value="Chattogram">Chattogram (Outside Dhaka - ৳ 120)</option>
                      <option value="Sylhet">Sylhet (Outside Dhaka - ৳ 120)</option>
                      <option value="Rajshahi">Rajshahi (Outside Dhaka - ৳ 120)</option>
                      <option value="Khulna">Khulna (Outside Dhaka - ৳ 120)</option>
                      <option value="Barishal">Barishal (Outside Dhaka - ৳ 120)</option>
                      <option value="Rangpur">Rangpur (Outside Dhaka - ৳ 120)</option>
                      <option value="Mymensingh">Mymensingh (Outside Dhaka - ৳ 120)</option>
                    </select>
                  </div>
                </div>

                {/* 4. Payment & Courier Logistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                    <select
                      value={manualPaymentMethod}
                      onChange={(e) => setManualPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    >
                      <option value="COD">💵 Cash on Delivery (COD)</option>
                      <option value="BKASH">📱 bKash / Nagad (MFS)</option>
                      <option value="BANK_TRANSFER">🏦 Bank Transfer / POS Card</option>
                      <option value="PAID">✓ Already Paid (Paid in Full)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Courier Partner / Logistics
                    </label>
                    <select
                      disabled={manualDeliveryMethod === 'SHOWROOM_PICKUP'}
                      value={manualCourier}
                      onChange={(e) => setManualCourier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="Steadfast Courier">Steadfast Courier</option>
                      <option value="Pathao Courier">Pathao Courier</option>
                      <option value="RedX Delivery">RedX Delivery</option>
                      <option value="In-House Delivery Rider">In-House Delivery Rider</option>
                      <option value="Showroom Counter Pickup">Showroom Counter Pickup</option>
                    </select>
                  </div>
                </div>

                {/* 5. Special Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Order Notes / Instructions (Optional)</label>
                  <input
                    type="text"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    placeholder="e.g. Call before delivery, customer prefers afternoon dispatch"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                {/* Modal Footer Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowManualOrderModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingManualOrder}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {creatingManualOrder ? 'Creating Order...' : 'Confirm & Save Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Single Order Printable Customer Invoice / Packing Slip */}
        {invoiceOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0 print:border-none print:overflow-visible text-slate-900">
              {/* Modal Top Actions - Hidden in Print */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black bg-slate-900 text-white px-3 py-1 rounded-xl">
                    INVOICE: {invoiceOrder.orderNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Customer Printable Slip</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      document.body.classList.add('printing-single-invoice');
                      window.print();
                      document.body.classList.remove('printing-single-invoice');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={() => setInvoiceOrder(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Document Body */}
              <div className="space-y-6 print:space-y-4 p-2 sm:p-4 text-slate-900">
                {/* Invoice Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                      {tenantInfo?.name || 'Merchant Store'}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-xs leading-relaxed">
                      {tenantInfo?.address || 'Dhaka, Bangladesh'}
                    </p>
                    <p className="text-xs text-slate-600">
                      Helpline: <strong className="text-slate-900">{tenantInfo?.phone || '+880 1811-223344'}</strong>
                    </p>
                    {tenantInfo?.email && (
                      <p className="text-xs text-slate-500">Email: {tenantInfo.email}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-black uppercase tracking-wider mb-1 print:border print:border-black print:text-black print:bg-white">
                      INVOICE / PACKING SLIP
                    </span>
                    <div className="font-mono text-sm font-black text-slate-950 mt-1">
                      {invoiceOrder.orderNumber}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Date: {new Date(invoiceOrder.createdAt).toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">
                      Payment: {invoiceOrder.paymentMethod || 'Cash on Delivery (COD)'}
                    </p>
                  </div>
                </div>

                {/* Recipient & Shipping Information */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 print:bg-white print:border-slate-800 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
                      BILL TO / DELIVER TO:
                    </span>
                    <p className="font-black text-slate-950 text-sm">{invoiceOrder.customerName}</p>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">{invoiceOrder.customerPhone}</p>
                    <p className="text-slate-600 mt-1 leading-relaxed">
                      {invoiceOrder.shippingAddress}, {invoiceOrder.city}
                    </p>
                    {invoiceOrder.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1.5">Note: {invoiceOrder.notes}</p>
                    )}
                  </div>

                  <div className="border-l border-slate-200 pl-4 print:border-slate-800">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-1">
                      DISPATCH & COURIER DETAILS:
                    </span>
                    <p className="font-bold text-slate-900">
                      Courier Partner: <span className="font-black text-indigo-700">{invoiceOrder.courier || 'Steadfast Courier'}</span>
                    </p>
                    <p className="font-mono text-slate-700 mt-0.5">
                      Tracking Code: <strong>{invoiceOrder.trackingCode || 'Pending Booking'}</strong>
                    </p>
                    <p className="text-slate-700 mt-0.5">
                      Order Status: <span className="font-bold uppercase">{invoiceOrder.orderStatus || 'PENDING'}</span>
                    </p>
                  </div>
                </div>

                {/* Items Breakdown Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden print:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200 print:bg-slate-50 print:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">SL</th>
                        <th className="py-2.5 px-4">Item & Variant Description</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-4 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                      {(invoiceOrder.items || []).map((it: any, idx: number) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 px-4 font-semibold text-slate-900">
                            {it.itemTitle || it.title} {it.variantTitle ? `(${it.variantTitle})` : ''}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">{it.quantity || 1}</td>
                          <td className="py-2.5 px-3 text-right font-mono">BDT {Number(it.price || 0).toLocaleString()}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                            BDT {(Number(it.price || 0) * (it.quantity || 1)).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Summary */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery Fee ({invoiceOrder.city}):</span>
                      <span className="font-mono font-bold">BDT {invoiceOrder.deliveryCharge || 60}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                      <span>Total Payable (COD):</span>
                      <span className="font-mono text-rose-600 font-black text-base print:text-black">
                        BDT {Number(invoiceOrder.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom Attributes / Special Instructions */}
                {invoiceOrder.customAttributes && Object.keys(invoiceOrder.customAttributes).length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 print:bg-white print:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 block mb-1 uppercase text-[10px]">
                      Order Metafields (Category Tailored):
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(invoiceOrder.customAttributes).map(([k, v]: [string, any]) => (
                        <div key={k} className="text-slate-700">
                          <span className="text-slate-400 capitalize">{k.replace(/_/g, ' ')}:</span>{' '}
                          <strong className="text-slate-900">
                            {typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signature Row */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
                  <div className="border-t border-slate-400 pt-1">
                    <p className="font-bold text-slate-800">Authorized Merchant Signature</p>
                    <p className="text-[10px] text-slate-400">{tenantInfo?.name || 'Verified Merchant'}</p>
                  </div>
                  <div className="border-t border-slate-400 pt-1">
                    <p className="font-bold text-slate-800">Customer Received By & Signature</p>
                    <p className="text-[10px] text-slate-400">Date: ____ / ____ / 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 1: GOOGLE MAPS IP GEOLOCATION PIN */}
        {/* ============================================================== */}
        {mapModalOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto text-slate-900 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Order Device & Real-Time IP Location
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Order #{mapModalOrder.orderNumber} • IP: {mapModalOrder.clientIp || '103.205.71.42'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMapModalOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Network, Device & City Summary Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Customer</span>
                  <span className="font-extrabold text-slate-900 truncate block">{mapModalOrder.customerName}</span>
                  <span className="font-mono text-[11px] text-slate-600">{mapModalOrder.customerPhone}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Device & Browser</span>
                  <span className="font-extrabold text-slate-900 truncate block">{mapModalOrder.deviceType || 'Mobile'} ({mapModalOrder.os || 'Android'})</span>
                  <span className="text-[11px] text-slate-600">{mapModalOrder.browser || 'Chrome'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">IP Location</span>
                  <span className="font-extrabold text-indigo-700 truncate block">{mapModalOrder.ipCity || 'Dhaka'}, {mapModalOrder.ipCountry || 'Bangladesh'}</span>
                  <span className="font-mono text-[10px] text-slate-500">{mapModalOrder.ipLatitude || 23.8103}, {mapModalOrder.ipLongitude || 90.4125}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Delivery Address</span>
                  <span className="font-extrabold text-slate-900 truncate block">{mapModalOrder.city || 'Dhaka'}</span>
                  <span className="text-[11px] text-slate-600 truncate block">{mapModalOrder.shippingAddress}</span>
                </div>
              </div>

              {/* Address Discrepancy Warning Notice */}
              {mapModalOrder.addressDiscrepancy ? (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <strong className="block font-black text-rose-900">🚨 Warning: Location Mismatch Detected!</strong>
                    <span>
                      The IP location of the customer's ordering device is <strong>{mapModalOrder.ipCity}</strong>, but the parcel delivery address is in <strong>{mapModalOrder.city}</strong>. Please contact the customer to verify before dispatching.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Location Matched:</strong> Order IP location ({mapModalOrder.ipCity}) and delivery address are consistent and trusted.
                  </span>
                </div>
              )}

              {/* Embedded Google Maps Pin Iframe */}
              <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-inner h-80 bg-slate-100">
                <iframe
                  title="Customer Geolocation Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${mapModalOrder.ipLatitude || 23.8103},${mapModalOrder.ipLongitude || 90.4125}&z=13&output=embed`}
                  className="w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapModalOrder.ipLatitude || 23.8103},${mapModalOrder.ipLongitude || 90.4125}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Google Maps App</span>
                </a>
                <button
                  type="button"
                  onClick={() => setMapModalOrder(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: BLOCK / BLACKLIST FAKE CUSTOMER */}
        {/* ============================================================== */}
        {blockModalOrder && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-slate-900 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <Ban className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Block / Blacklist Customer
                    </h3>
                    <p className="text-xs text-slate-500">Prevent fraudulent orders and repeated cancellations</p>
                  </div>
                </div>
                <button
                  onClick={() => setBlockModalOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Customer Name:</span>
                  <strong className="text-slate-900">{blockModalOrder.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Phone Number:</span>
                  <strong className="text-rose-700 font-mono font-bold">{blockModalOrder.customerPhone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Device IP:</span>
                  <span className="font-mono text-slate-700">{blockModalOrder.clientIp || '103.205.71.42'}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Select reason for blocking:</label>
                <select
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Fraudulent order / Repeated cancellations and returns">Fraudulent order / Repeated cancellations and returns</option>
                  <option value="Invalid or unauthorized phone number provided">Invalid or unauthorized phone number provided</option>
                  <option value="Rider harassment or abusive behavior">Rider harassment or abusive behavior</option>
                  <option value="Spam or malicious bot activity">Spam or malicious bot activity</option>
                  <option value="Blocked upon customer request">Blocked upon customer request</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                ⚠️ <strong>Notice:</strong> Once blocked, any attempt to checkout using this phone number or IP across your storefronts will immediately trigger an <strong>HTTP 403 (Order Rejected)</strong> response.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setBlockModalOrder(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isBlocking}
                  onClick={() => handleBlockCustomer(blockModalOrder)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{isBlocking ? 'Blocking...' : 'Confirm Block'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: CUSTOMER LIFETIME ORDER HISTORY & FRAUD STATS */}
        {/* ============================================================== */}
        {customerHistoryModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[92vh] overflow-y-auto text-slate-900 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Customer Lifetime Order History
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {customerHistoryModal.customerName} • {customerHistoryModal.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomerHistoryModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lifetime Metrics Dashboard */}
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Orders</span>
                  <span className="text-lg font-black text-slate-900 font-mono">
                    {customerHistoryModal.stats?.totalOrders ?? customerHistoryModal.totalOrders ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-600 block font-bold uppercase">Delivered</span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    {customerHistoryModal.stats?.deliveredOrders ?? customerHistoryModal.deliveredOrders ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] text-rose-600 block font-bold uppercase">Cancelled / Return</span>
                  <span className="text-lg font-black text-rose-700 font-mono">
                    {customerHistoryModal.stats?.cancelledOrders ?? customerHistoryModal.cancelledOrders ?? 0}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <span className="text-[10px] text-indigo-600 block font-bold uppercase">Delivery Rate</span>
                  <span className="text-lg font-black text-indigo-700 font-mono">
                    {customerHistoryModal.stats?.deliverySuccessRate ?? customerHistoryModal.deliverySuccessRate ?? 0}%
                  </span>
                </div>
              </div>

              {/* Status Alert */}
              {customerHistoryModal.isBlocked ? (
                <div className="p-3 rounded-2xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-center gap-2">
                  <Ban className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    <strong>This customer is currently blacklisted (Blocked):</strong> Reason: {customerHistoryModal.blockReason || 'Repeated parcel cancellations and fake orders'}
                  </span>
                </div>
              ) : customerHistoryModal.stats?.deliverySuccessRate < 50 && customerHistoryModal.stats?.totalOrders > 1 ? (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong>High Risk Customer:</strong> This customer has previously cancelled over 50% of orders. Collecting delivery fees in advance is strongly recommended before dispatching.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Trusted Customer:</strong> Successful delivery rate is satisfactory ({customerHistoryModal.stats?.deliverySuccessRate || 100}%).
                  </span>
                </div>
              )}

              {/* Past Orders Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Order History List:</span>
                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Order #</th>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Product</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(customerHistoryModal.orders || []).map((pastOrd: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{pastOrd.orderNumber}</td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {new Date(pastOrd.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700 truncate max-w-[150px]">
                            {pastOrd.items?.[0]?.itemTitle || pastOrd.items?.[0]?.title || 'Product'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            BDT {pastOrd.totalAmount?.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                pastOrd.orderStatus === 'DELIVERED' || pastOrd.orderStatus === 'CONFIRMED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : pastOrd.orderStatus === 'CANCELLED'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {pastOrd.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {customerHistoryModal.isBlocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleUnblockCustomer(customerHistoryModal.phone);
                      setCustomerHistoryModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unblock Customer</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setBlockModalOrder({
                        customerPhone: customerHistoryModal.phone,
                        customerName: customerHistoryModal.customerName,
                        clientIp: customerHistoryModal.orders?.[0]?.clientIp,
                      });
                      setCustomerHistoryModal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition flex items-center gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5 text-rose-600" />
                    <span>Block Customer</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCustomerHistoryModal(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: DEDICATED INVOICE, CASH MEMO & POS BILLING HUB */}
        {/* ============================================================== */}
        {activeTab === 'invoices' && (() => {
          // Filter valid orders to create invoice records
          const invoiceList = orders.filter((o: any) => o.orderStatus !== 'INCOMPLETE');

          // Filter by search and payment status
          const filteredInvoices = invoiceList.filter((inv: any) => {
            const matchesSearch =
              !invoiceSearchQuery.trim() ||
              (inv.orderNumber && inv.orderNumber.toLowerCase().includes(invoiceSearchQuery.toLowerCase())) ||
              (inv.customerName && inv.customerName.toLowerCase().includes(invoiceSearchQuery.toLowerCase())) ||
              (inv.customerPhone && inv.customerPhone.includes(invoiceSearchQuery)) ||
              (inv.city && inv.city.toLowerCase().includes(invoiceSearchQuery.toLowerCase()));

            const isPaid = ['DELIVERED', 'COMPLETED', 'PAID'].includes((inv.orderStatus || '').toUpperCase()) || inv.paymentStatus === 'PAID';
            let matchesStatus = true;
            if (invoicePaymentStatus === 'paid') matchesStatus = isPaid;
            if (invoicePaymentStatus === 'unpaid') matchesStatus = !isPaid;

            return matchesSearch && matchesStatus;
          });

          // Metrics calculations
          const totalInvoicedAmount = invoiceList.reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
          const paidAmount = invoiceList
            .filter((o: any) => ['DELIVERED', 'COMPLETED', 'PAID'].includes((o.orderStatus || '').toUpperCase()) || o.paymentStatus === 'PAID')
            .reduce((sum: number, o: any) => sum + (Number(o.totalAmount) || 0), 0);
          const pendingCodAmount = Math.max(0, totalInvoicedAmount - paidAmount);

          return (
            <div className="space-y-6">
              {/* Invoices Header Banner */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      Billing & Revenue Hub
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      A4 Cash Memo & 80mm Thermal POS Receipts
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    Customer Invoices & POS Receipts Hub
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ম্যানেজ করুন কাস্টমার চালান, A4 ভ্যাট ক্যাশ মেমো এবং ৮০মিমি থার্মাল পিওএস প্রিন্টিং স্লিপ।
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setRefreshTrigger((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>সিঙ্ক ইনভয়েস</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Total Invoices</span>
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight mt-3">
                    {invoiceList.length} <span className="text-sm font-semibold text-slate-400">মেমো</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">সব সফল অর্ডার ইনভয়েস</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Total Invoiced</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 tracking-tight mt-3 font-mono">
                    ৳ {totalInvoicedAmount.toLocaleString('en-BD')}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold block mt-1">গ্রস ইনভয়েস ভ্যালু</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Paid / Cash Settled</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-700 tracking-tight mt-3 font-mono">
                    ৳ {paidAmount.toLocaleString('en-BD')}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">কালেক্টেড ও সেটেল্ড পেমেন্ট</span>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Pending COD</span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-amber-700 tracking-tight mt-3 font-mono">
                    ৳ {pendingCodAmount.toLocaleString('en-BD')}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">কুরিয়ারের কাছে পাওনা COD</span>
                </div>
              </div>

              {/* Invoices Search & Filter Controls */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={invoiceSearchQuery}
                    onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                    placeholder="Search by Invoice #, Order #, Customer Name, Phone or City..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {invoiceSearchQuery && (
                    <button
                      onClick={() => setInvoiceSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Toggle Pills */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
                  <button
                    onClick={() => setInvoicePaymentStatus('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      invoicePaymentStatus === 'all'
                        ? 'bg-white text-slate-900 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Invoices ({invoiceList.length})
                  </button>
                  <button
                    onClick={() => setInvoicePaymentStatus('paid')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      invoicePaymentStatus === 'paid'
                        ? 'bg-white text-emerald-700 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Paid / Collected
                  </button>
                  <button
                    onClick={() => setInvoicePaymentStatus('unpaid')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      invoicePaymentStatus === 'unpaid'
                        ? 'bg-white text-amber-700 shadow-sm font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pending COD
                  </button>
                </div>
              </div>

              {/* Invoices Master Table */}
              <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-3.5 px-4">Invoice # & Date</th>
                        <th className="py-3.5 px-4">Customer Details</th>
                        <th className="py-3.5 px-4">Order Ref</th>
                        <th className="py-3.5 px-4">Billed Products</th>
                        <th className="py-3.5 px-4 text-center">Payment Status</th>
                        <th className="py-3.5 px-4 text-right">Total Amount</th>
                        <th className="py-3.5 px-4 text-center">Print Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            কোনো ইনভয়েস রেকর্ড খুঁজে পাওয়া যায়নি।
                          </td>
                        </tr>
                      ) : (
                        filteredInvoices.map((inv: any, idx: number) => {
                          const isPaid = ['DELIVERED', 'COMPLETED', 'PAID'].includes((inv.orderStatus || '').toUpperCase()) || inv.paymentStatus === 'PAID';
                          const invoiceNo = `INV-${(inv.orderNumber || '000').slice(-6).toUpperCase()}`;

                          return (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              {/* Invoice No & Date */}
                              <td className="py-3.5 px-4">
                                <span className="font-mono font-black text-indigo-700 block">
                                  {invoiceNo}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {new Date(inv.createdAt || Date.now()).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              </td>

                              {/* Customer Details */}
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-slate-900">{inv.customerName}</div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <a href={`tel:${inv.customerPhone}`} className="font-mono hover:text-indigo-600">
                                    {inv.customerPhone}
                                  </a>
                                </div>
                                <span className="text-[10px] text-slate-400 block font-medium">
                                  📍 {inv.city || 'Dhaka'}
                                </span>
                              </td>

                              {/* Order Ref */}
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  #{inv.orderNumber}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5 capitalize">
                                  {inv.courier || 'Steadfast Courier'}
                                </span>
                              </td>

                              {/* Billed Products */}
                              <td className="py-3.5 px-4 max-w-xs">
                                <div className="space-y-0.5">
                                  {(inv.items || []).slice(0, 2).map((item: any, itIdx: number) => (
                                    <div key={itIdx} className="text-xs truncate text-slate-800 font-medium">
                                      • {item.title || item.itemTitle}{' '}
                                      <span className="font-bold text-slate-500">× {item.quantity || 1}</span>
                                    </div>
                                  ))}
                                  {(inv.items || []).length > 2 && (
                                    <span className="text-[10px] text-indigo-600 font-semibold block">
                                      +{(inv.items || []).length - 2} more items
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Payment Status */}
                              <td className="py-3.5 px-4 text-center">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                                    isPaid
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : 'bg-amber-50 text-amber-700 border-amber-300'
                                  }`}
                                >
                                  {isPaid ? '✓ Paid / Settled' : '⏱ COD Pending'}
                                </span>
                                <span className="text-[10px] text-slate-500 block mt-0.5 font-bold">
                                  {inv.paymentMethod || 'COD'}
                                </span>
                              </td>

                              {/* Total Amount */}
                              <td className="py-3.5 px-4 text-right">
                                <span className="font-mono font-black text-slate-900 text-sm block">
                                  ৳ {Number(inv.totalAmount || 0).toLocaleString('en-BD')}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-medium">
                                  Fee: ৳{inv.deliveryCharge || 60}
                                </span>
                              </td>

                              {/* Print Actions */}
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                  {/* A4 Cash Memo Button */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedA4Invoice(inv)}
                                    className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                    title="View & Print Corporate A4 Cash Memo"
                                  >
                                    <FileText className="w-3 h-3 text-indigo-600" />
                                    <span>A4 ক্যাশ মেমো</span>
                                  </button>

                                  {/* 80mm POS Slip Button */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPosReceipt(inv)}
                                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                    title="View & Print 80mm Thermal POS Receipt"
                                  >
                                    <Printer className="w-3 h-3 text-slate-600" />
                                    <span>৮০মিমি POS</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* ============================================================== */}
        {/* TAB: CUSTOMER CRM & FRAUD PREVENTION ENGINE */}
        {/* ============================================================== */}
        {activeTab === 'customers' && (() => {
          // 1. Build and aggregate customer profiles from live orders + seeded electronics buyers
          const customerMap = new Map<string, any>();

          // Process live store orders
          orders.forEach((o: any) => {
            const rawPhone = o.customerPhone ? String(o.customerPhone).trim() : '';
            const phoneKey = rawPhone.replace(/\D/g, '').slice(-11) || rawPhone || (o.customerEmail ? o.customerEmail.toLowerCase() : `cust_${o.id}`);
            if (!phoneKey) return;

            const existing = customerMap.get(phoneKey);
            const amount = Number(o.totalAmount || 0);
            const isCompleted = ['DELIVERED', 'COMPLETED', 'SHIPPED', 'PROCESSING'].includes(o.orderStatus);
            const isDelivered = o.orderStatus === 'DELIVERED';
            const isCancelled = ['CANCELLED', 'RETURNED'].includes(o.orderStatus);

            if (existing) {
              existing.orderCount += 1;
              if (isCompleted) existing.totalSpent += amount;
              if (isDelivered) existing.deliveredCount += 1;
              if (isCancelled) existing.cancelledCount += 1;
              existing.orders.push(o);
              if (new Date(o.createdAt || Date.now()) > new Date(existing.lastOrderDate)) {
                existing.lastOrderDate = o.createdAt;
              }
              if (o.isBlocked) existing.isBlocked = true;
            } else {
              customerMap.set(phoneKey, {
                id: phoneKey,
                name: o.customerName || 'Registered Customer',
                phone: o.customerPhone || 'N/A',
                email: o.customerEmail || 'customer@gmail.com',
                address: o.shippingAddress || 'Dhaka, Bangladesh',
                district: (o.shippingAddress || '').toLowerCase().includes('chittagong') ? 'Chittagong' :
                          (o.shippingAddress || '').toLowerCase().includes('sylhet') ? 'Sylhet' :
                          (o.shippingAddress || '').toLowerCase().includes('gazipur') ? 'Gazipur' :
                          (o.shippingAddress || '').toLowerCase().includes('rajshahi') ? 'Rajshahi' : 'Dhaka',
                orderCount: 1,
                totalSpent: isCompleted ? amount : 0,
                deliveredCount: isDelivered ? 1 : 0,
                cancelledCount: isCancelled ? 1 : 0,
                firstOrderDate: o.createdAt || new Date().toISOString(),
                lastOrderDate: o.createdAt || new Date().toISOString(),
                isBlocked: !!o.isBlocked,
                orders: [o],
                adminNotes: customerNotesMap[phoneKey] || '',
              });
            }
          });

          // Seeded realistic customer base for SmartVolt Electronics store
          const seededCustomers = [
            {
              id: '01711982341',
              name: 'Tanvir Ahmed Chowdhury',
              phone: '+880 1711-982341',
              email: 'tanvir.chowdhury@acme.com',
              address: 'House 42, Road 7/A, Dhanmondi R/A, Dhaka-1209',
              district: 'Dhaka',
              orderCount: 4,
              totalSpent: 118500,
              deliveredCount: 4,
              cancelledCount: 0,
              firstOrderDate: '2026-08-14T10:30:00Z',
              lastOrderDate: '2026-10-25T14:20:00Z',
              isBlocked: false,
              adminNotes: customerNotesMap['01711982341'] || 'VIP Corporate Buyer. Prefers phone call before delivery. 100% genuine.',
              orders: [
                { id: 'ORD-7811', orderNumber: 'SV-ORD-7811', totalAmount: 64900, orderStatus: 'DELIVERED', paymentMethod: 'Card', createdAt: '2026-10-25T14:20:00Z', items: [{ title: 'Sony Bravia 55" 4K Google Smart TV', quantity: 1, price: 64900 }] },
                { id: 'ORD-6520', orderNumber: 'SV-ORD-6520', totalAmount: 45800, orderStatus: 'DELIVERED', paymentMethod: 'bKash', createdAt: '2026-09-12T11:00:00Z', items: [{ title: 'Gree 1.5 Ton Dual Inverter Smart AC', quantity: 1, price: 45800 }] },
                { id: 'ORD-5190', orderNumber: 'SV-ORD-5190', totalAmount: 7800, orderStatus: 'DELIVERED', paymentMethod: 'COD', createdAt: '2026-08-14T10:30:00Z', items: [{ title: 'Walton AC Digital Servo Stabilizer', quantity: 1, price: 7800 }] }
              ]
            },
            {
              id: '01819234567',
              name: 'Engr. Rafiqul Islam',
              phone: '+880 1819-234567',
              email: 'engr.rafiq@northsouth.edu',
              address: 'Sector 11, Road 4, House 12, Uttara, Dhaka-1230',
              district: 'Dhaka',
              orderCount: 3,
              totalSpent: 74200,
              deliveredCount: 3,
              cancelledCount: 0,
              firstOrderDate: '2026-09-01T09:15:00Z',
              lastOrderDate: '2026-10-26T16:45:00Z',
              isBlocked: false,
              adminNotes: customerNotesMap['01819234567'] || 'Repeat customer for smart home sensors and switches.',
              orders: [
                { id: 'ORD-7902', orderNumber: 'SV-ORD-7902', totalAmount: 28400, orderStatus: 'DELIVERED', paymentMethod: 'COD', createdAt: '2026-10-26T16:45:00Z', items: [{ title: 'Tuya Smart WiFi Zigbee Hub + 4 Sensors', quantity: 1, price: 28400 }] },
                { id: 'ORD-6810', orderNumber: 'SV-ORD-6810', totalAmount: 45800, orderStatus: 'DELIVERED', paymentMethod: 'Bank Transfer', createdAt: '2026-09-01T09:15:00Z', items: [{ title: 'Samsung 43" Crystal UHD 4K Smart TV', quantity: 1, price: 45800 }] }
              ]
            },
            {
              id: '01912876543',
              name: 'Dr. Farhana Yasmin',
              phone: '+880 1912-876543',
              email: 'farhana.dr@squarehospital.com',
              address: 'Avenue 2, Block D, Gulshan-2, Dhaka',
              district: 'Dhaka',
              orderCount: 2,
              totalSpent: 38900,
              deliveredCount: 2,
              cancelledCount: 0,
              firstOrderDate: '2026-09-20T12:00:00Z',
              lastOrderDate: '2026-10-20T10:30:00Z',
              isBlocked: false,
              adminNotes: customerNotesMap['01912876543'] || 'High-ticket smart appliance buyer. Fast payment.',
              orders: [
                { id: 'ORD-7640', orderNumber: 'SV-ORD-7640', totalAmount: 38900, orderStatus: 'DELIVERED', paymentMethod: 'Card', createdAt: '2026-10-20T10:30:00Z', items: [{ title: 'Panasonic Inverter Refrigerator Air Fresh', quantity: 1, price: 38900 }] }
              ]
            },
            {
              id: '01678123987',
              name: 'Kazi Zahid Hasan',
              phone: '+880 1678-123987',
              email: 'zahid.hasan@ctgport.gov.bd',
              address: 'Agrabad Commercial Area, Chittagong',
              district: 'Chittagong',
              orderCount: 1,
              totalSpent: 14500,
              deliveredCount: 1,
              cancelledCount: 0,
              firstOrderDate: '2026-10-15T15:20:00Z',
              lastOrderDate: '2026-10-15T15:20:00Z',
              isBlocked: false,
              adminNotes: customerNotesMap['01678123987'] || 'Chittagong delivery via Steadfast courier. Highly cooperative.',
              orders: [
                { id: 'ORD-7510', orderNumber: 'SV-ORD-7510', totalAmount: 14500, orderStatus: 'DELIVERED', paymentMethod: 'COD', createdAt: '2026-10-15T15:20:00Z', items: [{ title: 'Baseus Heavy Duty Surge Guard + HDMI 2.1 Cables', quantity: 1, price: 14500 }] }
              ]
            },
            {
              id: '01552349812',
              name: 'Rezaul Karim (Flagged)',
              phone: '+880 1552-349812',
              email: 'rezaul.k99@gmail.com',
              address: 'Mirpur 10, Block C, Road 5, Dhaka',
              district: 'Dhaka',
              orderCount: 3,
              totalSpent: 2100,
              deliveredCount: 1,
              cancelledCount: 2,
              firstOrderDate: '2026-09-10T14:00:00Z',
              lastOrderDate: '2026-10-22T18:10:00Z',
              isBlocked: false,
              adminNotes: customerNotesMap['01552349812'] || 'Repeatedly cancelled COD orders after parcel reached delivery hub. High risk!',
              orders: [
                { id: 'ORD-7688', orderNumber: 'SV-ORD-7688', totalAmount: 18500, orderStatus: 'CANCELLED', paymentMethod: 'COD', createdAt: '2026-10-22T18:10:00Z', items: [{ title: 'Smart WiFi AC Controller + Remote', quantity: 2, price: 18500 }] },
                { id: 'ORD-6210', orderNumber: 'SV-ORD-6210', totalAmount: 2100, orderStatus: 'DELIVERED', paymentMethod: 'bKash', createdAt: '2026-09-10T14:00:00Z', items: [{ title: 'Surge Protector Spike Guard', quantity: 1, price: 2100 }] }
              ]
            },
            {
              id: '01301982736',
              name: 'Sumon Mia (Fraud Alert)',
              phone: '+880 1301-982736',
              email: 'fake.sumon01@yahoo.com',
              address: 'Station Road, Tongi, Gazipur',
              district: 'Gazipur',
              orderCount: 2,
              totalSpent: 0,
              deliveredCount: 0,
              cancelledCount: 2,
              firstOrderDate: '2026-10-05T20:10:00Z',
              lastOrderDate: '2026-10-24T19:30:00Z',
              isBlocked: true,
              adminNotes: customerNotesMap['01301982736'] || 'Fake phone number, never answers delivery agent. Blacklisted from COD.',
              orders: [
                { id: 'ORD-7750', orderNumber: 'SV-ORD-7750', totalAmount: 12500, orderStatus: 'CANCELLED', paymentMethod: 'COD', createdAt: '2026-10-24T19:30:00Z', items: [{ title: 'Sony Magic Remote + HDMI Cable', quantity: 3, price: 12500 }] }
              ]
            }
          ];

          seededCustomers.forEach((s) => {
            if (!customerMap.has(s.id)) {
              customerMap.set(s.id, s);
            }
          });

          // 2. Compute metrics, delivery rates, and tier badges
          const allCustomers = Array.from(customerMap.values()).map((c) => {
            const totalAttempted = c.deliveredCount + c.cancelledCount;
            const rate = totalAttempted > 0 ? Math.round((c.deliveredCount / totalAttempted) * 100) : 100;
            
            let tier: 'vip' | 'regular' | 'new' | 'risk' | 'blocked' = 'new';
            if (c.isBlocked) tier = 'blocked';
            else if (c.totalSpent >= 40000) tier = 'vip';
            else if (c.orderCount > 1 && rate >= 75) tier = 'regular';
            else if (rate < 60 || c.cancelledCount >= 2) tier = 'risk';

            return {
              ...c,
              deliverySuccessRate: rate,
              tier,
              avgOrderValue: c.orderCount > 0 ? Math.round(c.totalSpent / c.orderCount) : 0,
              cleanPhone: String(c.phone).replace(/\D/g, '').slice(-11)
            };
          });

          // 3. Filter customers by search query and tier filter
          const filteredCustomers = allCustomers.filter((c) => {
            const matchesSearch =
              c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
              c.phone.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
              c.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
              c.district.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
              c.address.toLowerCase().includes(customerSearchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (customerTierFilter === 'all') return true;
            if (customerTierFilter === 'vip') return c.tier === 'vip';
            if (customerTierFilter === 'regular') return c.tier === 'regular';
            if (customerTierFilter === 'new') return c.tier === 'new';
            if (customerTierFilter === 'risk') return c.tier === 'risk';
            if (customerTierFilter === 'blocked') return c.tier === 'blocked' || c.isBlocked;
            return true;
          });

          // 4. Aggregate KPI Card totals
          const totalCustomersCount = allCustomers.length;
          const repeatBuyersCount = allCustomers.filter((c) => c.orderCount > 1).length;
          const repeatRate = totalCustomersCount > 0 ? Math.round((repeatBuyersCount / totalCustomersCount) * 100) : 0;
          const vipBuyersCount = allCustomers.filter((c) => c.tier === 'vip').length;
          const totalVipSpent = allCustomers.filter((c) => c.tier === 'vip').reduce((sum, c) => sum + c.totalSpent, 0);
          const blockedOrRiskCount = allCustomers.filter((c) => c.tier === 'blocked' || c.tier === 'risk' || c.isBlocked).length;

          // 5. Export to CSV handler
          const handleExportCustomersCSV = () => {
            const headers = ['Customer Name', 'Phone', 'Email', 'District', 'Address', 'Total Orders', 'Lifetime Spent (BDT)', 'Avg Order Value (BDT)', 'Delivery Success Rate (%)', 'Tier', 'Status'];
            const rows = filteredCustomers.map((c) => [
              `"${c.name}"`,
              `"${c.phone}"`,
              `"${c.email}"`,
              `"${c.district}"`,
              `"${c.address.replace(/"/g, '""')}"`,
              c.orderCount,
              c.totalSpent,
              c.avgOrderValue,
              `${c.deliverySuccessRate}%`,
              c.tier.toUpperCase(),
              c.isBlocked ? 'BLOCKED_COD' : 'ACTIVE'
            ]);
            const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `customers_crm_${tenantSlug}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };

          return (
            <div className="space-y-6">
              {/* Header Title & Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F1424] p-5 rounded-2xl border border-slate-800 shadow-xl">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Users className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        Customer CRM & Fraud Prevention Engine
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Live Insights
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400">
                        গ্রাহক ডিরেক্টরি, লাইফটাইম ভ্যালু (LTV), কুরিয়ার রিটার্ন রেট ও ১-ক্লিক ফেক COD প্রতিরোধ হাব
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportCustomersCSV}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition shadow-sm cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowManualOrderModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন গ্রাহক অর্ডার</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Customers */}
                <div className="bg-[#0F1424] p-4 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-indigo-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">মোট নিবন্ধিত গ্রাহক</span>
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white font-mono">{totalCustomersCount}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +12% MoM
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">অনলাইন ও শোরুম ক্রেতা ডাটাবেজ</p>
                </div>

                {/* 2. Repeat Customers */}
                <div className="bg-[#0F1424] p-4 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">পুনরাবৃত্তি ক্রেতা হার</span>
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <RefreshCw className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400 font-mono">{repeatRate}%</span>
                    <span className="text-xs font-mono text-slate-400">({repeatBuyersCount} ক্রেতা)</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">একাধিক অর্ডার সম্পন্নকারী গ্রাহক</p>
                </div>

                {/* 3. VIP High Spenders */}
                <div className="bg-[#0F1424] p-4 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">ভিআইপি ক্রেতা (LTV &gt; ৳৪০K)</span>
                    <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                      <Award className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-amber-400 font-mono">৳ {totalVipSpent.toLocaleString('en-BD')}</span>
                    <span className="text-xs font-mono text-slate-400">({vipBuyersCount} ভিআইপি)</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">মোট বিক্রয়ের ৬৮% কন্ট্রিবিউশন</p>
                </div>

                {/* 4. Fraud & COD Risk */}
                <div className="bg-[#0F1424] p-4 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-rose-500/30 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">রিটার্ন ঝুঁকি ও ব্লকড COD</span>
                    <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                      <Shield className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-black text-rose-400 font-mono">{blockedOrRiskCount}</span>
                    <span className="text-[11px] text-rose-400/90 font-bold bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800/40">
                      কুরিয়ার সেভার
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">ফেক পার্সেল রিটার্ন খরচ সাশ্রয়</p>
                </div>
              </div>

              {/* Search & Tier Filter Bar */}
              <div className="bg-[#0F1424] p-4 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    placeholder="নাম, মোবাইল নাম্বার (০১৭...), জেলা দিয়ে খুঁজুন..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  {customerSearchQuery && (
                    <button
                      onClick={() => setCustomerSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Tier Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                  {[
                    { id: 'all', label: 'সব গ্রাহক', count: allCustomers.length },
                    { id: 'vip', label: '👑 VIP ক্রেতা', count: allCustomers.filter((c) => c.tier === 'vip').length },
                    { id: 'regular', label: 'নিয়মিত (২+)', count: allCustomers.filter((c) => c.tier === 'regular').length },
                    { id: 'new', label: 'নতুন ক্রেতা', count: allCustomers.filter((c) => c.tier === 'new').length },
                    { id: 'risk', label: '⚠️ রিটার্ন ঝুঁকি', count: allCustomers.filter((c) => c.tier === 'risk').length },
                    { id: 'blocked', label: '🚫 ব্লকড COD', count: allCustomers.filter((c) => c.tier === 'blocked' || c.isBlocked).length },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setCustomerTierFilter(filter.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        customerTierFilter === filter.id
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        customerTierFilter === filter.id ? 'bg-indigo-950 text-indigo-200' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Customer Table */}
              <div className="bg-[#0F1424] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3.5 px-4">গ্রাহকের নাম ও যোগাযোগ</th>
                        <th className="py-3.5 px-4">শিপিং ঠিকানা ও জেলা</th>
                        <th className="py-3.5 px-4 text-center">অর্ডার সংখ্যা</th>
                        <th className="py-3.5 px-4">লাইফটাইম স্পেন্ড (LTV)</th>
                        <th className="py-3.5 px-4">কুরিয়ার ডেলিভারি স্কোর</th>
                        <th className="py-3.5 px-4 text-center">স্ট্যাটাস ও রিস্ক</th>
                        <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-500">
                            <Users className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-400" />
                            <p className="font-semibold text-slate-400">কোন গ্রাহক পাওয়া যায়নি</p>
                            <p className="text-[11px] text-slate-500 mt-1">অনুসন্ধান বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((cust) => {
                          const initials = cust.name
                            .split(' ')
                            .map((n: string) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase();

                          return (
                            <tr key={cust.id} className="hover:bg-slate-800/40 transition">
                              {/* 1. Name & Contact */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                      cust.tier === 'vip'
                                        ? 'bg-gradient-to-tr from-amber-600 to-yellow-400 text-slate-950 font-black shadow-md shadow-amber-500/20'
                                        : cust.tier === 'blocked'
                                        ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800/60'
                                    }`}>
                                      {initials || 'C'}
                                    </div>
                                    {cust.tier === 'vip' && (
                                      <span className="absolute -top-1.5 -right-1.5 text-xs" title="VIP Customer">
                                        👑
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-white flex items-center gap-1.5">
                                      <span>{cust.name}</span>
                                      {cust.tier === 'vip' && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                          VIP
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[11px] text-slate-400 font-mono">{cust.phone}</span>
                                      {/* Direct WhatsApp Action */}
                                      <a
                                        href={`https://wa.me/880${cust.cleanPhone}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${cust.name}, SmartVolt ইলেকট্রনিক্স থেকে যোগাযোগ করছি।`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 transition"
                                        title="WhatsApp এ সরাসরি চ্যাট করুন"
                                      >
                                        <MessageSquare className="w-3 h-3" />
                                      </a>
                                      {/* Direct Phone Call Action */}
                                      <a
                                        href={`tel:${cust.phone}`}
                                        className="p-1 rounded-md bg-blue-950 hover:bg-blue-900 text-blue-400 border border-blue-800/60 transition"
                                        title="সরাসরি কল দিন"
                                      >
                                        <PhoneCall className="w-3 h-3" />
                                      </a>
                                    </div>
                                    <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                      {cust.email}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Address & District */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-0.5">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                    {cust.district}
                                  </span>
                                  <p className="text-[11px] text-slate-400 line-clamp-2 max-w-[220px]">
                                    {cust.address}
                                  </p>
                                </div>
                              </td>

                              {/* 3. Orders Count */}
                              <td className="py-3.5 px-4 text-center">
                                <span className="inline-block px-2.5 py-1 rounded-xl font-mono font-bold text-xs bg-slate-800 text-slate-200 border border-slate-700">
                                  {cust.orderCount} টি
                                </span>
                              </td>

                              {/* 4. Lifetime Spend (LTV) */}
                              <td className="py-3.5 px-4">
                                <div className="font-mono font-bold text-emerald-400 text-sm">
                                  ৳ {cust.totalSpent.toLocaleString('en-BD')}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  গড়: ৳ {cust.avgOrderValue.toLocaleString('en-BD')} / অর্ডার
                                </div>
                              </td>

                              {/* 5. Courier Delivery Success Rate */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-1.5 w-36">
                                  <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-slate-400">সাকসেস রেট</span>
                                    <span className={`font-mono font-bold ${
                                      cust.deliverySuccessRate >= 85
                                        ? 'text-emerald-400'
                                        : cust.deliverySuccessRate >= 60
                                        ? 'text-amber-400'
                                        : 'text-rose-400'
                                    }`}>
                                      {cust.deliverySuccessRate}%
                                    </span>
                                  </div>
                                  {/* Progress bar */}
                                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        cust.deliverySuccessRate >= 85
                                          ? 'bg-emerald-500'
                                          : cust.deliverySuccessRate >= 60
                                          ? 'bg-amber-500'
                                          : 'bg-rose-500'
                                      }`}
                                      style={{ width: `${Math.max(5, cust.deliverySuccessRate)}%` }}
                                    />
                                  </div>
                                  <div className="text-[9px] text-slate-500 font-mono flex justify-between">
                                    <span>{cust.deliveredCount} ডেলিভারি</span>
                                    <span>{cust.cancelledCount} রিটার্ন</span>
                                  </div>
                                </div>
                              </td>

                              {/* 6. Status & Risk Badge */}
                              <td className="py-3.5 px-4 text-center">
                                {cust.isBlocked ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/80">
                                    <Ban className="w-3 h-3 text-rose-400" />
                                    <span>COD ব্লকড</span>
                                  </span>
                                ) : cust.tier === 'risk' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/80">
                                    <AlertCircle className="w-3 h-3 text-amber-400" />
                                    <span>রিটার্ন ঝুঁকি</span>
                                  </span>
                                ) : cust.tier === 'vip' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                    <Award className="w-3 h-3 text-amber-400" />
                                    <span>Trusted VIP</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>ভেরিফাইড</span>
                                  </span>
                                )}
                              </td>

                              {/* 7. Actions */}
                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {/* View Profile & Order History Modal */}
                                  <button
                                    onClick={() => setSelectedCustomerProfile(cust)}
                                    className="px-2.5 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                                    title="প্রোফাইল ও বিস্তারিত হিস্ট্রি দেখুন"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>প্রোফাইল</span>
                                  </button>

                                  {/* 1-Click Toggle Block COD */}
                                  {cust.isBlocked ? (
                                    <button
                                      onClick={() => handleUnblockCustomer(cust)}
                                      className="px-2 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                                      title="কাস্টমার আনব্লক করুন"
                                    >
                                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>আনব্লক</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleBlockCustomer({ customerPhone: cust.phone, customerName: cust.name }, 'High return risk / Blacklisted from COD')}
                                      className="px-2 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
                                      title="ফেক অর্ডার প্রতিরোধে COD ব্লক করুন"
                                    >
                                      <Shield className="w-3.5 h-3.5 text-rose-400" />
                                      <span>ব্লক COD</span>
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB: INVENTORY & STOCK MANAGEMENT ENGINE (PHASE 1) */}
        {/* ============================================================== */}
        {activeTab === 'inventory' && (
          <InventoryManager
            tenantSlug={tenantSlug}
            categories={categories}
            onItemUpdated={refreshCatalogItems}
          />
        )}

        {/* ============================================================== */}
        {/* TAB 2: DYNAMIC PRODUCT & INVENTORY MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {prodNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{prodNotice}</span>
              </div>
            )}

            {/* Unified Products & Accessories Sub-Navigation Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200 shadow-sm">
              <button
                type="button"
                onClick={() => setProductSubTab('catalog')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  productSubTab === 'catalog'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-rose-600" />
                <span>Product Catalog ({items.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setProductSubTab('accessories')}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
                  productSubTab === 'accessories'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Accessories Hub ({accessoriesList.length})</span>
              </button>
            </div>

            {/* SUB-TAB 1: PRODUCT CATALOG */}
            {productSubTab === 'catalog' && (
              <div className="space-y-6">
                {/* Top Product Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-rose-600" />
                  <span>Category-Wise Product Management</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700">
                    {items.length} Products
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload and publish products or service offerings dynamically under any store category and brand with custom specifications and variants.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleExportCatalog}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-2"
                  title="Export catalog data as JSON backup"
                >
                  <Database className="w-4 h-4 text-slate-500" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => setShowAddProdModal(!showAddProdModal)}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddProdModal ? 'Close Form' : '+ Add New Product'}</span>
                </button>
              </div>
            </div>

            {/* Add Product Collapsible Form */}
            {showAddProdModal && (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-rose-500/20 shadow-xl space-y-6 text-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      <span>Upload New Product to Category</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select target category, brand, pricing, dynamic specs, and variants to immediately publish to your storefront.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddProdModal(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Target Category *</span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('categories')}
                          className="text-[11px] text-rose-600 hover:underline"
                        >
                          + New Category
                        </button>
                      </label>
                      <select
                        value={prodCategoryId}
                        onChange={(e) => setProdCategoryId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      >
                        <option value="">-- Select Category --</option>
                        {categories
                          .filter((c) => !c.parentId)
                          .map((root) => {
                            const subs = categories.filter((s) => s.parentId === root.id || s.parentId === root.slug);
                            return (
                              <React.Fragment key={root.id || root.slug}>
                                <option value={root.id || root.slug} className="font-bold text-slate-900">
                                  📁 {root.name}
                                </option>
                                {subs.map((sub) => (
                                  <option key={sub.id || sub.slug} value={sub.id || sub.slug} className="text-slate-600">
                                    &nbsp;&nbsp;&nbsp;↳ {sub.name}
                                  </option>
                                ))}
                              </React.Fragment>
                            );
                          })}
                        {/* Any standalone subcategories whose parent is missing */}
                        {categories
                          .filter((c) => c.parentId && !categories.some((r) => r.id === c.parentId || r.slug === c.parentId))
                          .map((orphan) => (
                            <option key={orphan.id || orphan.slug} value={orphan.id || orphan.slug}>
                              ↳ {orphan.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Brand Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Brand / Manufacturer</span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('brands')}
                          className="text-[11px] text-amber-600 hover:underline"
                        >
                          + New Brand
                        </button>
                      </label>
                      <select
                        value={prodBrandId}
                        onChange={(e) => setProdBrandId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      >
                        <option value="">-- Generic / None --</option>
                        {brands.map((b) => (
                          <option key={b.id || b.slug} value={b.id || b.slug}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Item Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Catalog Item Type</label>
                      <select
                        value={prodType}
                        onChange={(e: any) => setProdType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      >
                        <option value="PHYSICAL_PRODUCT">Physical Product (Shipped via Courier)</option>
                        <option value="SERVICE_APPOINTMENT">Service (1-Hour Appointment Booking)</option>
                        <option value="DIGITAL_ITEM">Digital Item (Instant Download)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Product Title */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Product Title / Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hisense Smart Compact Inverter AC 1.5 Ton / Walton Refrigerator"
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    {/* Stock Quantity */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Inventory Stock Count</label>
                      <input
                        type="number"
                        min="0"
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Selling Price (BDT / Currency) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="e.g. 45000"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    {/* Compare Price */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Original / Compare Price (Shows % OFF)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 52000"
                        value={prodComparePrice}
                        onChange={(e) => setProdComparePrice(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Ribbon Badge and Selectable Variants */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Promotional Ribbon Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. 12 Years Compressor Warranty • 0% EMI Available"
                        value={prodBadge}
                        onChange={(e) => setProdBadge(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Selectable Variants / Colors / Sizes</label>
                      <input
                        type="text"
                        placeholder="e.g. 1.0 Ton, 1.5 Ton, 2.0 Ton / Matte Black, Pure White"
                        value={prodVariants}
                        onChange={(e) => setProdVariants(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                      <span className="text-[11px] text-slate-400">Separate options with commas. Displayed as selectable chips on storefront.</span>
                    </div>
                  </div>

                  {/* Manual / Additional Category Specifications */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-rose-600" />
                          <span>Additional Key-Value Specifications</span>
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Add custom key-value specs displayed as live specification badges on product cards.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setProdSpecs((prev) => [...prev, { key: '', value: '' }])}
                        className="px-3 py-1 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition flex items-center gap-1 w-fit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Spec</span>
                      </button>
                    </div>

                    {/* Quick suggested chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Add:</span>
                      {['Capacity', 'Compressor', 'Warranty', 'Power / Wattage', 'Dimensions', 'Origin', 'Color'].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            if (!prodSpecs.some((s) => s.key === chip)) {
                              setProdSpecs((prev) => [...prev, { key: chip, value: '' }]);
                            }
                          }}
                          className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 hover:border-rose-400 hover:text-rose-600 transition"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>

                    {/* Specifications List */}
                    <div className="space-y-2">
                      {prodSpecs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Specification (e.g. Capacity)"
                            value={spec.key}
                            onChange={(e) => {
                              const updated = [...prodSpecs];
                              updated[sIdx].key = e.target.value;
                              setProdSpecs(updated);
                            }}
                            className="w-1/3 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 1.5 Ton / 18,000 BTU/h)"
                            value={spec.value}
                            onChange={(e) => {
                              const updated = [...prodSpecs];
                              updated[sIdx].value = e.target.value;
                              setProdSpecs(updated);
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                          />
                          <button
                            type="button"
                            onClick={() => setProdSpecs((prev) => prev.filter((_, idx) => idx !== sIdx))}
                            className="p-2 text-slate-400 hover:text-rose-600 transition"
                            title="Remove specification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Image Upload & Gallery */}
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-rose-600" />
                        <span>Product Images & Media Gallery</span>
                      </span>
                      <span className="text-[11px] text-slate-400">Direct file upload or URL:</span>
                    </label>

                    {/* Direct Upload Button from PC / Mobile */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, false)}
                        id="prod-direct-file-input"
                        className="hidden"
                      />
                      <label
                        htmlFor="prod-direct-file-input"
                        className="cursor-pointer w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span>📁 Upload Image from Device (PC / Phone)</span>
                      </label>

                      <div className="flex-1 w-full flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="Or paste direct image URL (https://...)"
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                        />
                        {prodImage && (
                          <button
                            type="button"
                            onClick={() => {
                              if (prodImage.trim()) {
                                setProdImages((prev) => [...prev, prodImage.trim()]);
                                setProdImage('');
                              }
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shrink-0"
                          >
                            + Add URL
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Gallery Thumbnails Grid */}
                    {prodImages.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                          Selected Product Photos ({prodImages.length}):
                        </span>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {prodImages.map((img, iIdx) => (
                            <div key={iIdx} className="relative group w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shadow-sm">
                              <img src={img} alt="Product thumb" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(iIdx, false)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow hover:bg-rose-700 transition"
                                title="Remove photo"
                              >
                                ✕
                              </button>
                              {iIdx === 0 && (
                                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-bold text-white text-center py-0.5">
                                  COVER
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}



                    {/* Product Video / Media URL */}
                    <div className="pt-2 border-t border-slate-200/60">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Product Video Review / Demo URL (YouTube / Facebook)</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Optional video embed</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=... or Facebook reel"
                        value={prodVideoUrl}
                        onChange={(e) => setProdVideoUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Detailed Description & Visual Customization */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Product Description & Features Customization (Visual & Text Mode)</span>
                      <span className="text-[11px] font-semibold text-indigo-600">Rich-Text Visual Formatting</span>
                    </label>
                    <RichTextEditor
                      value={prodShortDesc}
                      onChange={setProdShortDesc}
                      placeholder="Write detailed product highlights, technical specifications, warranty, and features..."
                      minHeight="180px"
                    />
                  </div>

                  {/* Featured Checkbox & Submit */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prodIsFeatured}
                        onChange={(e) => setProdIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                      />
                      <span className="text-xs font-bold text-slate-700">Promote as Featured Item on Storefront Hero</span>
                    </label>

                    <button
                      type="submit"
                      disabled={addingProd}
                      className="px-8 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{addingProd ? 'Publishing Product...' : 'Publish Product to Store'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Filter by Category */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-600 shrink-0">Category Filter:</span>
                <select
                  value={selectedProdCatFilter}
                  onChange={(e) => setSelectedProdCatFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="all">All Categories ({items.length})</option>
                  {categories.map((c) => {
                    const count = items.filter(
                      (i) => i.categoryId === c.id || i.category?.id === c.id || i.category?.slug === c.slug
                    ).length;
                    return (
                      <option key={c.id || c.slug} value={c.id || c.slug}>
                        {c.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search by Title */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title..."
                  value={prodSearchQuery}
                  onChange={(e) => setProdSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Products Table / Catalog Grid */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  Store Catalog Items ({filteredCatalogItems.length})
                </h4>
                <span className="text-xs text-slate-500">Live in {tenantSlug} storefront</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredCatalogItems.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                    <Package className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="font-semibold text-slate-600">No products found under this filter.</p>
                    <p>Click &quot;+ Add New Product&quot; above to upload a product under your desired category.</p>
                  </div>
                ) : (
                  filteredCatalogItems.map((item, idx) => {
                    const itemImg = (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                    const catName = item.category?.name || categories.find((c) => c.id === item.categoryId || c.slug === item.categoryId)?.name || 'General';
                    const brandName = item.brand?.name || brands.find((b) => b.id === item.brandId || b.slug === item.brandId)?.name;

                    return (
                      <div key={item.id || idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition">
                        <div className="flex items-center gap-4">
                          <img
                            src={itemImg}
                            alt={item.title}
                            className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="text-sm font-bold text-slate-900">{item.title}</h5>
                              {item.isFeatured && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                                  ★ Featured
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-100">
                                📂 {catName}
                              </span>
                              {brandName && (
                                <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-medium border border-amber-100">
                                  🏷️ {brandName}
                                </span>
                              )}
                              <span className="text-slate-400 font-mono text-[11px]">
                                Stock: <strong className="text-slate-700">{item.stockQuantity ?? 20}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="text-right">
                            <div className="text-sm font-extrabold text-slate-900">
                              BDT {item.price?.toLocaleString()}
                            </div>
                            {item.comparePrice && item.comparePrice > item.price && (
                              <div className="text-xs text-slate-400 line-through">
                                BDT {item.comparePrice?.toLocaleString()}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1.5"
                              title="Edit Product Details & Images"
                            >
                              <Pencil className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Edit</span>
                            </button>
                            <Link
                              href={`/?tenant=${tenantSlug}`}
                              target="_blank"
                              className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                              title="View on Storefront"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.title)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-TAB 2: ACCESSORIES & ADD-ONS MANAGEMENT */}
        {/* ============================================================== */}
        {productSubTab === 'accessories' && (
          <div className="space-y-6">
            {accessoriesNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{accessoriesNotice}</span>
                </div>
                <button
                  onClick={() => setAccessoriesNotice(null)}
                  className="text-emerald-700 hover:text-emerald-900 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Header & Control Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200/60">
                      OFFICIAL ACCESSORIES CATALOG & ADD-ONS
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      Live on Storefront
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                    Storefront Accessories Mega-Menu Management
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    Create, edit, and organize accessory divisions (TV Wall Mounts, AC Stabilizers, Refrigerator Stands, Power Strips, IoT Hubs) and their sub-items. Any changes saved here sync directly with your storefront&apos;s navbar dropdown.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setDivisionForm({ name: '', iconName: 'Wrench', badge: 'Certified', description: '' });
                      setShowAddDivisionModal(true);
                    }}
                    className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-black shadow-md shadow-amber-500/20 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveAccessories()}
                    disabled={savingAccessories}
                    className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-black shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingAccessories ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-emerald-400" />
                        <span>Save & Publish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Categories
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      {accessoriesList.length} Divisions
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Total Items
                    </span>
                    <span className="text-lg font-black text-slate-900">
                      {accessoriesList.reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0)} Add-Ons
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Storefront Status
                    </span>
                    <span className="text-lg font-black text-emerald-600">
                      Live & Synced
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessory Categories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {accessoriesList.map((div, divIdx) => (
                <div
                  key={div.id || `div_${divIdx}`}
                  className="rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
                          {getAccessoryIcon(div.iconName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-black text-slate-900">
                              {div.name}
                            </h3>
                            {div.badge && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                                {div.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            Icon: {div.iconName || 'Wrench'} • ID: {div.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDivision(div);
                            setDivisionForm({
                              name: div.name,
                              iconName: div.iconName || 'Wrench',
                              badge: div.badge || '',
                              description: div.description || '',
                            });
                          }}
                          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                          title="Edit Category Details"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDivision(div.id, div.name)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      {div.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Category Items List */}
                  <div className="p-6 space-y-4 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                        Items & Accessories ({div.subcategories?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenAddItem(div.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-sm transition flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    {div.subcategories && div.subcategories.length > 0 ? (
                      <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                        {div.subcategories.map((sub: any, subIdx: number) => (
                          <div
                            key={sub.id || `sub_${subIdx}`}
                            className="p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/70 hover:border-amber-200 transition flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                {sub.image ? (
                                  <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition"
                                  />
                                ) : (
                                  <Wrench className="w-5 h-5 text-slate-300" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {sub.brand && (
                                    <span className="px-2 py-0.5 rounded-md text-[9.5px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-700">
                                      {sub.brand}
                                    </span>
                                  )}
                                  <span className="text-xs font-bold text-slate-900 truncate">
                                    {sub.name}
                                  </span>
                                  {sub.tag && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200/60">
                                      {sub.tag}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-[11px]">
                                  {sub.price && (
                                    <span className="font-black text-slate-900">
                                      BDT {Number(sub.price).toLocaleString()}
                                    </span>
                                  )}
                                  {sub.comparePrice && (
                                    <span className="text-slate-400 line-through text-[10px]">
                                      BDT {Number(sub.comparePrice).toLocaleString()}
                                    </span>
                                  )}
                                  <span className="text-slate-400 text-[10px]">
                                    Stock: {sub.stock ?? 20}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenEditAccessoryItem(div.id, sub)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                title="Edit Item & Details"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAccessoryItem(div.id, sub.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Remove Item"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                        <Wrench className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-medium text-slate-500">
                          No accessories added under this category yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenAddItem(div.id)}
                          className="mt-2 text-xs font-extrabold text-amber-600 hover:text-amber-700 underline"
                        >
                          + Add first item now
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Storefront Navigation Item</span>
                    <button
                      type="button"
                      onClick={() => handleOpenAddItem(div.id)}
                      className="font-bold text-slate-700 hover:text-amber-600 transition flex items-center gap-1"
                    >
                      <span>Add More</span>
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* MODAL: ADD / EDIT ACCESSORY CATEGORY */}
            {(showAddDivisionModal || editingDivision) && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          {editingDivision ? 'Edit Accessory Category' : 'Add New Accessory Category'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Displays as a main category in the storefront accessories mega dropdown
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddDivisionModal(false);
                        setEditingDivision(null);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={editingDivision ? handleUpdateDivisionSubmit : handleCreateDivision}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={divisionForm.name}
                        onChange={(e) => setDivisionForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Kitchen & Microwave Accessories"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Icon
                        </label>
                        <select
                          value={divisionForm.iconName}
                          onChange={(e) => setDivisionForm((prev) => ({ ...prev, iconName: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          <option value="Tv">Tv (Television & Audio)</option>
                          <option value="Wind">Wind (Air Conditioning)</option>
                          <option value="Refrigerator">Refrigerator (Fridges & Deep Freezers)</option>
                          <option value="WashingMachine">WashingMachine (Washer & Dryers)</option>
                          <option value="Zap">Zap (Stabilizers & Surge Gear)</option>
                          <option value="Cpu">Cpu (Smart Home & IoT)</option>
                          <option value="Flame">Flame (Kitchen Appliances)</option>
                          <option value="Wrench">Wrench (Tools & Hardware)</option>
                          <option value="ShieldCheck">ShieldCheck (Protection Gear)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Badge / Ribbon
                        </label>
                        <input
                          type="text"
                          value={divisionForm.badge}
                          onChange={(e) => setDivisionForm((prev) => ({ ...prev, badge: e.target.value }))}
                          placeholder="e.g. Certified, Essential, Heavy Duty"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Description / Category Highlight</span>
                        <span className="text-[11px] text-indigo-600 font-normal">Visual & Text Mode</span>
                      </label>
                      <RichTextEditor
                        value={divisionForm.description}
                        onChange={(val) => setDivisionForm((prev) => ({ ...prev, description: val }))}
                        placeholder="e.g. Heavy duty mounts, high-speed cables, voice remotes and protection gears"
                        minHeight="140px"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddDivisionModal(false);
                          setEditingDivision(null);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md transition flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{editingDivision ? 'Save Updates' : 'Create Category'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODAL: ADD / UPLOAD ACCESSORY PRODUCT */}
            {showAddItemModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Upload Accessory Product
                        </h3>
                        <p className="text-xs text-slate-500">
                          Upload a brand-certified accessory with image, price, specs, and live storefront sync
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddItemModal(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleAddItemSubmit} className="space-y-4">
                    {/* Category & Brand row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Target Accessory Category *
                        </label>
                        <select
                          value={targetDivisionId}
                          onChange={(e) => setTargetDivisionId(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          {accessoriesList.map((div) => (
                            <option key={div.id} value={div.id}>
                              {div.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Brand / Manufacturer *
                        </label>
                        <select
                          value={itemForm.brandId}
                          onChange={(e) => {
                            const bId = e.target.value;
                            const b = brands.find((x) => x.id === bId || x.slug === bId);
                            setItemForm((prev) => ({
                              ...prev,
                              brandId: bId,
                              brandName: b ? b.name : prev.brandName,
                            }));
                          }}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          {brands.map((b) => (
                            <option key={b.id || b.slug} value={b.id || b.slug}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Product Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Accessory Title / Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={itemForm.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setItemForm((prev) => ({
                            ...prev,
                            name: val,
                            query: prev.query ? prev.query : val.toLowerCase(),
                          }));
                        }}
                        placeholder="e.g. Ultra High-Speed 4K/8K HDMI 2.1 Cable 3m"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    {/* Product Image Upload & URL */}
                    <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Product Image * (Upload or Image URL)
                        </label>
                        {itemForm.image && (
                          <button
                            type="button"
                            onClick={() => setItemForm((prev) => ({ ...prev, image: '' }))}
                            className="text-[11px] font-bold text-rose-600 hover:underline"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                          {itemForm.image ? (
                            <img
                              src={itemForm.image}
                              alt="Accessory preview"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer shadow-2xs transition">
                            <Upload className="w-3.5 h-3.5 text-slate-500" />
                            <span>Upload from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setItemForm((prev) => ({
                                      ...prev,
                                      image: reader.result as string,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>

                          <input
                            type="url"
                            value={itemForm.image}
                            onChange={(e) => setItemForm((prev) => ({ ...prev, image: e.target.value }))}
                            placeholder="Or paste image URL (https://...)"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Selling Price (BDT) *
                        </label>
                        <input
                          type="number"
                          required
                          value={itemForm.price}
                          onChange={(e) => setItemForm((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="e.g. 1850"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Original Price (BDT)
                        </label>
                        <input
                          type="number"
                          value={itemForm.comparePrice}
                          onChange={(e) => setItemForm((prev) => ({ ...prev, comparePrice: e.target.value }))}
                          placeholder="e.g. 2400"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={itemForm.stock}
                          onChange={(e) => setItemForm((prev) => ({ ...prev, stock: e.target.value }))}
                          placeholder="e.g. 25"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    {/* Tag / Ribbon & Query */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Tag / Ribbon Badge
                        </label>
                        <input
                          type="text"
                          value={itemForm.tag}
                          onChange={(e) => setItemForm((prev) => ({ ...prev, tag: e.target.value }))}
                          placeholder="e.g. Best Seller, Gold Plated, Rust Proof"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Search Keyword / Query
                        </label>
                        <input
                          type="text"
                          value={itemForm.query}
                          onChange={(e) => setItemForm((prev) => ({ ...prev, query: e.target.value }))}
                          placeholder="e.g. hdmi cable"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Description / Specs (Visual Customization)</span>
                        <span className="text-[11px] text-indigo-600 font-normal">WYSIWYG</span>
                      </label>
                      <RichTextEditor
                        value={itemForm.description}
                        onChange={(val) => setItemForm((prev) => ({ ...prev, description: val }))}
                        placeholder="e.g. 100% pure copper, 4K/8K 120Hz refresh rate, braided nylon"
                        minHeight="140px"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowAddItemModal(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md transition flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4 text-emerald-400" />
                        <span>Upload Accessory Product</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* MODAL: EDIT ACCESSORY PRODUCT */}
            {showEditAccessoryModal && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Pencil className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Edit Accessory Product
                        </h3>
                        <p className="text-xs text-slate-500">
                          Update accessory title, brand, image, price, stock, and rich description
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEditAccessoryModal(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleEditAccessorySubmit} className="space-y-4">
                    {/* Category & Brand row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Target Category *
                        </label>
                        <select
                          value={editAccessoryTargetDivId}
                          onChange={(e) => setEditAccessoryTargetDivId(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          {accessoriesList.map((div) => (
                            <option key={div.id} value={div.id}>
                              {div.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Brand / Manufacturer *
                        </label>
                        <select
                          value={editAccessoryForm.brandId}
                          onChange={(e) => {
                            const bId = e.target.value;
                            const b = brands.find((x) => x.id === bId || x.slug === bId);
                            setEditAccessoryForm((prev) => ({
                              ...prev,
                              brandId: bId,
                              brandName: b ? b.name : prev.brandName,
                            }));
                          }}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          {brands.map((b) => (
                            <option key={b.id || b.slug} value={b.id || b.slug}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Product Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Accessory Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editAccessoryForm.name}
                        onChange={(e) => setEditAccessoryForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Heavy Duty 32-75 Swivel TV Wall Mount"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>

                    {/* Image URL & Upload */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Accessory Photo / Image *
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                          {editAccessoryForm.image ? (
                            <img
                              src={editAccessoryForm.image}
                              alt="Accessory preview"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="url"
                            value={editAccessoryForm.image}
                            onChange={(e) => setEditAccessoryForm((prev) => ({ ...prev, image: e.target.value }))}
                            placeholder="Paste image link (https://...)"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload from Device</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (re) => {
                                    if (re.target?.result) {
                                      setEditAccessoryForm((prev) => ({
                                        ...prev,
                                        image: re.target!.result as string,
                                      }));
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Price, Compare Price, Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Price (BDT) *
                        </label>
                        <input
                          type="number"
                          required
                          value={editAccessoryForm.price}
                          onChange={(e) => setEditAccessoryForm((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="2450"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Compare Price (BDT)
                        </label>
                        <input
                          type="number"
                          value={editAccessoryForm.comparePrice}
                          onChange={(e) => setEditAccessoryForm((prev) => ({ ...prev, comparePrice: e.target.value }))}
                          placeholder="3200"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Stock Units *
                        </label>
                        <input
                          type="number"
                          required
                          value={editAccessoryForm.stock}
                          onChange={(e) => setEditAccessoryForm((prev) => ({ ...prev, stock: e.target.value }))}
                          placeholder="45"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    {/* Tag / Ribbon & Query */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Badge / Ribbon Tag
                        </label>
                        <input
                          type="text"
                          value={editAccessoryForm.tag}
                          onChange={(e) => setEditAccessoryForm((prev) => ({ ...prev, tag: e.target.value }))}
                          placeholder="e.g. Best Seller, Gold Plated"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Search Keyword / Query
                        </label>
                        <input
                          type="text"
                          value={editAccessoryForm.query}
                          onChange={(e) => setEditAccessoryForm((prev) => ({ ...prev, query: e.target.value }))}
                          placeholder="e.g. mount, hdmi cable"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>

                    {/* Description (Visual Editor) */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Description / Specifications (Visual Customization)</span>
                        <span className="text-[11px] text-indigo-600 font-normal">WYSIWYG</span>
                      </label>
                      <RichTextEditor
                        value={editAccessoryForm.description}
                        onChange={(val) => setEditAccessoryForm((prev) => ({ ...prev, description: val }))}
                        placeholder="Write accessory specifications, features, warranty, and compatibility..."
                        minHeight="140px"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowEditAccessoryModal(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 text-white" />
                        <span>Save Accessory Changes</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: EDIT PRODUCT DETAILS & IMAGES */}
        {/* ============================================================== */}
        {editModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto border border-slate-200 text-slate-900">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Edit Product: {editForm.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update pricing, upload images from your device, specs, and category attributes
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditProduct} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
                  />
                </div>

                {/* Category & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Category *
                    </label>
                    <select
                      value={editForm.categoryId}
                      onChange={(e) => handleEditCategoryChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id || c.slug} value={c.id || c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Brand / Manufacturer
                    </label>
                    <select
                      value={editForm.brandId}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, brandId: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">No Brand Selected</option>
                      {brands.map((b) => (
                        <option key={b.id || b.slug} value={b.id || b.slug}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price, Compare Price, Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Price (BDT) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={editForm.price}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Compare Price (BDT)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={editForm.comparePrice}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, comparePrice: e.target.value }))}
                      placeholder="e.g. 5999"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={editForm.stockQuantity}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, stockQuantity: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                {/* Badge & Item Type & Featured */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Badge (e.g. HOT DEAL, 20% OFF)
                    </label>
                    <input
                      type="text"
                      value={editForm.badge}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, badge: e.target.value }))}
                      placeholder="HOT DEAL"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Product Type
                    </label>
                    <select
                      value={editForm.itemType}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, itemType: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="PHYSICAL_PRODUCT">Physical Product</option>
                      <option value="SERVICE_APPOINTMENT">Service Appointment</option>
                      <option value="DIGITAL_SUBSCRIPTION">Digital / Download</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="edit-featured"
                      checked={Boolean(editForm.isFeatured)}
                      onChange={(e) => setEditForm((prev: any) => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    <label htmlFor="edit-featured" className="text-xs font-bold text-slate-800 cursor-pointer">
                      ★ Mark as Featured
                    </label>
                  </div>
                </div>

                {/* Product Description & Visual Formatting */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Product Description & Specifications (Visual & Text Mode)</span>
                    <span className="text-[11px] text-indigo-600 font-normal">WordPress-Style Customization</span>
                  </label>
                  <RichTextEditor
                    value={editForm.shortDescription || editForm.description || ''}
                    onChange={(val) =>
                      setEditForm((prev: any) => ({
                        ...prev,
                        shortDescription: val,
                        description: val,
                      }))
                    }
                    placeholder="Write full product specifications, technical details, warranty, and features..."
                    minHeight="200px"
                  />
                </div>

                {/* DIRECT DEVICE IMAGE UPLOAD & GALLERY FOR EDIT */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-rose-600" />
                      <span>Product Photos & Media Gallery</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Direct file upload or URL:</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, true)}
                      id="edit-prod-direct-file-input"
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-prod-direct-file-input"
                      className="cursor-pointer w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>📁 Upload Image from Device (PC / Phone)</span>
                    </label>

                    <div className="flex-1 w-full flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Or paste direct image URL (https://...)"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                      {editImageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            if (editImageUrl.trim()) {
                              setEditForm((prev: any) => ({
                                ...prev,
                                images: [...(prev.images || []), editImageUrl.trim()],
                              }));
                              setEditImageUrl('');
                            }
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shrink-0"
                        >
                          + Add URL
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Edit Form Image Thumbnails Grid */}
                  {editForm.images && editForm.images.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                        Product Photos ({editForm.images.length}):
                      </span>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {editForm.images.map((img: string, iIdx: number) => (
                          <div key={iIdx} className="relative group w-16 h-16 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 shadow-sm">
                            <img src={img} alt="Product thumb" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(iIdx, true)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow hover:bg-rose-700 transition"
                              title="Remove photo"
                            >
                              ✕
                            </button>
                            {iIdx === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] font-bold text-white text-center py-0.5">
                                COVER
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Review URL */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Video Review / Walk-Through URL (YouTube or Facebook)
                  </label>
                  <input
                    type="url"
                    value={editForm.videoUrl || ''}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>



                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editingSaving}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {editingSaving ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )}

        {/* ============================================================== */}
        {/* TAB 2: CATEGORY & SUBCATEGORY MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {catNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{catNotice}</span>
              </div>
            )}

            {/* Add Category / Subcategory Form */}
            <div id="cat-add-form" className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-rose-600" />
                  <span>
                    {newCatParentId ? (
                      <>
                        Add New <span className="text-indigo-600">Subcategory</span> to Store
                      </>
                    ) : (
                      'Add New Category to Store'
                    )}
                  </span>
                </h3>
                {newCatParentId && (
                  <button
                    type="button"
                    onClick={() => setNewCatParentId('')}
                    className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
                  >
                    Switch to Main Category
                  </button>
                )}
              </div>

              <form onSubmit={handleAddCategory} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Parent Category Selector */}
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Category Hierarchy / Parent</span>
                      {newCatParentId && (
                        <span className="text-[10px] text-indigo-600 font-extrabold uppercase">Subcategory Mode</span>
                      )}
                    </label>
                    <select
                      value={newCatParentId}
                      onChange={(e) => setNewCatParentId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
                    >
                      <option value="">📁 None (Main Category / Root)</option>
                      <optgroup label="Or create as Subcategory under:">
                        {categories
                          .filter((c) => !c.parentId)
                          .map((parent) => (
                            <option key={parent.id || parent.slug} value={parent.id || parent.slug}>
                              ↳ Under: {parent.name}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Category Name */}
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {newCatParentId ? 'Subcategory Name *' : 'Category Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={
                        newCatParentId
                          ? 'e.g. 1.5 Ton Dual Inverter, WiFi Touch Switches, Track Lights...'
                          : 'e.g. Air Conditioners, Smart TVs, Inverter Refrigerators...'
                      }
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  {/* Campaign Slogan */}
                  <div className="sm:col-span-4 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Campaign Slogan / Ribbon (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Official Warranty & Free Express Delivery"
                      value={newCatPromoSlogan}
                      onChange={(e) => setNewCatPromoSlogan(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-slate-500">
                    {newCatParentId ? (
                      <span className="text-indigo-600 font-medium">
                        💡 Creating a subcategory under:{' '}
                        <strong>
                          {categories.find((c) => c.id === newCatParentId || c.slug === newCatParentId)?.name || newCatParentId}
                        </strong>
                      </span>
                    ) : (
                      <span>💡 This will be created as a top-level main category. You can add subcategories under it anytime.</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={addingCat}
                    className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 ${
                      newCatParentId ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-rose-600 hover:bg-rose-500'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {addingCat
                        ? 'Saving...'
                        : newCatParentId
                        ? '+ Add Subcategory'
                        : '+ Add Category'}
                    </span>
                  </button>
                </div>
              </form>
            </div>

            {/* Hierarchical Categories & Subcategories View */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Active Categories & Subcategories ({categories.length})
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {categories.filter((c) => !c.parentId).length} Main Categories
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    {categories.filter((c) => Boolean(c.parentId)).length} Subcategories
                  </span>
                </div>
                <span className="text-xs text-slate-500">Stored in {dbInfo?.dbName || `tenant_${tenantSlug}`}</span>
              </div>

              <div className="divide-y divide-slate-100 p-4 space-y-4">
                {categories.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No custom categories added yet. Add your first category using the form above.
                  </div>
                ) : (
                  categories
                    .filter((c) => !c.parentId)
                    .map((cat, idx) => {
                      const count = items.filter(
                        (i) => i.categoryId === cat.id || i.category?.id === cat.id || i.category?.slug === cat.slug
                      ).length;
                      const subcategories = categories.filter(
                        (sub) => sub.parentId === cat.id || sub.parentId === cat.slug
                      );

                      return (
                        <div
                          key={cat.id || idx}
                          className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition"
                        >
                          {/* Main Category Header Bar */}
                          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
                            <div className="flex items-start sm:items-center gap-3">
                              <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700">
                                    {count} {count === 1 ? 'Product' : 'Products'}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    {subcategories.length} {subcategories.length === 1 ? 'Subcategory' : 'Subcategories'}
                                  </span>
                                </div>
                                <span className="text-xs font-mono text-slate-400">slug: {cat.slug}</span>
                                {cat.promoSlogan && (
                                  <p className="text-[11px] text-rose-600 font-medium mt-0.5 flex items-center gap-1">
                                    <span>🏷️ Campaign Slogan: {cat.promoSlogan}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto">
                              {/* + Subcategory Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setNewCatParentId(cat.id || cat.slug);
                                  const formEl = document.getElementById('cat-add-form');
                                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5 border border-indigo-200/60"
                                title="Add a subcategory directly under this category"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Subcategory</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setProdCategoryId(cat.id || cat.slug);
                                  setActiveTab('products');
                                  setShowAddProdModal(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5"
                                title="Upload product directly to this category"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Upload Product</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedProdCatFilter(cat.id || cat.slug);
                                  setActiveTab('products');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                                title="View all products under this category"
                              >
                                <Filter className="w-3.5 h-3.5" />
                                <span>View Items</span>
                              </button>

                              {/* Edit Category Button */}
                              <button
                                type="button"
                                onClick={() => handleEditCategoryOpen(cat)}
                                className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-slate-200/80 transition"
                                title="Edit Category"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              {/* Delete Category Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition"
                                title="Delete Category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Subcategories Nested List */}
                          {subcategories.length > 0 && (
                            <div className="bg-slate-50/40 border-t border-slate-100 px-4 sm:px-6 py-3.5 space-y-2">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                                <span>Subcategories under {cat.name} ({subcategories.length})</span>
                              </div>

                              <div className="grid grid-cols-1 gap-2 pl-3 sm:pl-4 border-l-2 border-indigo-300">
                                {subcategories.map((sub, sIdx) => {
                                  const subCount = items.filter(
                                    (i) => i.categoryId === sub.id || i.category?.id === sub.id || i.category?.slug === sub.slug
                                  ).length;

                                  return (
                                    <div
                                      key={sub.id || sIdx}
                                      className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <span className="text-sm text-indigo-500 font-black">↳</span>
                                        <div>
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-bold text-slate-800">{sub.name}</span>
                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                              {subCount} {subCount === 1 ? 'Product' : 'Products'}
                                            </span>
                                          </div>
                                          <span className="text-[10px] font-mono text-slate-400">slug: {sub.slug}</span>
                                          {sub.promoSlogan && (
                                            <p className="text-[10.5px] text-rose-500 font-medium">🏷️ {sub.promoSlogan}</p>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setProdCategoryId(sub.id || sub.slug);
                                            setActiveTab('products');
                                            setShowAddProdModal(true);
                                          }}
                                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition flex items-center gap-1"
                                          title="Upload product directly to this subcategory"
                                        >
                                          <Plus className="w-3 h-3" />
                                          <span>Upload</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedProdCatFilter(sub.id || sub.slug);
                                            setActiveTab('products');
                                          }}
                                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition flex items-center gap-1"
                                          title="View products in this subcategory"
                                        >
                                          <Filter className="w-3 h-3" />
                                          <span>Items</span>
                                        </button>

                                        {/* Edit Subcategory Button */}
                                        <button
                                          type="button"
                                          onClick={() => handleEditCategoryOpen(sub)}
                                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-slate-200/60 transition"
                                          title="Edit Subcategory"
                                        >
                                          <Pencil className="w-3.5 h-3.5" />
                                        </button>

                                        {/* Delete Subcategory Button */}
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteCategory(sub.id, sub.name)}
                                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 transition"
                                          title="Delete Subcategory"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                )}

                {/* Any Standalone / Orphan Subcategories */}
                {categories.some(
                  (c) => c.parentId && !categories.some((r) => r.id === c.parentId || r.slug === c.parentId)
                ) && (
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2 mt-4">
                    <h5 className="text-xs font-bold text-amber-800">Independent Subcategories (Unassigned Parent)</h5>
                    <div className="space-y-2">
                      {categories
                        .filter((c) => c.parentId && !categories.some((r) => r.id === c.parentId || r.slug === c.parentId))
                        .map((orphan) => (
                          <div
                            key={orphan.id}
                            className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between"
                          >
                            <div>
                              <span className="text-xs font-bold text-slate-800">{orphan.name}</span>
                              <span className="text-[10px] font-mono text-slate-400 block">slug: {orphan.slug}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleEditCategoryOpen(orphan)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(orphan.id, orphan.name)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: BRAND MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'brands' && (
          <div className="space-y-6">
            {brandNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{brandNotice}</span>
              </div>
            )}

            {/* Add Brand Form */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <span>Add New Brand to Store</span>
              </h3>
              <form onSubmit={handleAddBrand} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Brand Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Brand Name (e.g. Apple, Walton, Samsung, Gree)"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Logo Image (Upload File or Enter URL)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Paste image URL (https://...)"
                        value={newBrandLogo}
                        onChange={(e) => setNewBrandLogo(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                      />
                      <label className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition flex items-center gap-1.5 shrink-0 border border-slate-200">
                        <Upload className="w-3.5 h-3.5 text-slate-600" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleBrandLogoFile(e.target.files[0], false);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Logo Preview & Visibility Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    {newBrandLogo ? (
                      <div className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-slate-50 border border-slate-200">
                        <img
                          src={newBrandLogo}
                          alt="Preview"
                          className="w-8 h-8 object-contain rounded-lg bg-white p-0.5 border border-slate-200"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <span className="text-xs font-medium text-slate-600">Logo selected</span>
                        <button
                          type="button"
                          onClick={() => setNewBrandLogo('')}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Remove logo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No logo chosen yet (optional)</span>
                    )}

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={newBrandIsVisible}
                        onChange={(e) => setNewBrandIsVisible(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                      />
                      <span>Show on Storefront (স্টোরফ্রন্টে প্রদর্শন করুন)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={addingBrand}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{addingBrand ? 'Saving Brand...' : 'Save Brand'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Brands Grid */}
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Registered Brands ({brands.length})</h4>
                  <p className="text-[11px] text-slate-400">Click Eye icon to toggle storefront visibility on/off</p>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {brands.filter((b) => b.isVisible !== false).length} Visible · {brands.filter((b) => b.isVisible === false).length} Hidden
                </span>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-xs text-slate-400">
                    No brands registered yet. Add your brand partners above.
                  </div>
                ) : (
                  brands.map((brand, idx) => {
                    const isVisible = brand.isVisible !== false;
                    return (
                      <div
                        key={brand.id || idx}
                        className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                          isVisible
                            ? 'border-slate-200/90 bg-white shadow-xs hover:shadow-md'
                            : 'border-dashed border-slate-300 bg-slate-50/70 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-10 h-10 object-contain rounded-xl bg-white p-1 border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center shrink-0">
                              {brand.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h5 className="text-sm font-bold text-slate-900 truncate">{brand.name}</h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              {isVisible ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>Visible</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                  <span>Hidden</span>
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-slate-400 truncate">slug: {brand.slug}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Quick Visibility Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleBrandVisibility(brand)}
                            className={`p-2 rounded-lg border transition ${
                              isVisible
                                ? 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-slate-200'
                            }`}
                            title={isVisible ? 'Click to hide brand from storefront' : 'Click to show brand on storefront'}
                          >
                            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          {/* Edit Brand Button */}
                          <button
                            type="button"
                            onClick={() => handleEditBrandOpen(brand)}
                            className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-slate-200/60 transition"
                            title="Edit Brand"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete Brand Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteBrand(brand.id, brand.name)}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 transition"
                            title="Delete Brand"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: EDIT CATEGORY / SUBCATEGORY */}
        {/* ============================================================== */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Edit {editingCategory.parentId ? 'Subcategory' : 'Category'}
                    </h3>
                    <p className="text-[11px] text-slate-500">Update category details and taxonomy hierarchy</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Hierarchy Level / Parent Category</label>
                  <select
                    value={editCatParentId}
                    onChange={(e) => setEditCatParentId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="">📁 None (Main Category / Root)</option>
                    <optgroup label="Or place as Subcategory under:">
                      {categories
                        .filter((c) => !c.parentId && c.id !== editingCategory.id && c.slug !== editingCategory.slug)
                        .map((c) => (
                          <option key={c.id || c.slug} value={c.id || c.slug}>
                            ↳ Subcategory under: {c.name}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                  <span className="text-[10.5px] text-slate-400">
                    Choose "None (Main Category)" for top-level, or select a parent category to place it as a subcategory.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    placeholder="e.g. Air Conditioners, Inverter AC..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Campaign Slogan / Ribbon (Optional)</label>
                  <input
                    type="text"
                    value={editCatPromoSlogan}
                    onChange={(e) => setEditCatPromoSlogan(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 10 Years Official Warranty..."
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEditCat}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {savingEditCat ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: EDIT BRAND */}
        {/* ============================================================== */}
        {editingBrand && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Edit Brand</h3>
                    <p className="text-[11px] text-slate-500">Update brand name and logo image</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBrand(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateBrand} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={editBrandName}
                    onChange={(e) => setEditBrandName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                    placeholder="e.g. Apple, Walton, Samsung..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Logo Image (Upload File or Enter URL)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editBrandLogo}
                      onChange={(e) => setEditBrandLogo(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-500 placeholder-slate-400"
                      placeholder="Paste image URL (https://...)"
                    />
                    <label className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition flex items-center gap-1.5 shrink-0 border border-slate-200 shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleBrandLogoFile(e.target.files[0], true);
                        }}
                      />
                    </label>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Upload from your device (PNG, JPG, SVG, WebP up to 2MB) or paste an image URL.
                  </span>
                </div>

                {/* Logo Preview Card */}
                {editBrandLogo && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={editBrandLogo}
                        alt="Preview"
                        className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-slate-200 shrink-0"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-800 block">Logo Selected</span>
                        <span className="text-[10.5px] text-slate-400 truncate block max-w-[200px]">
                          {editBrandLogo.startsWith('data:') ? 'Uploaded from device' : editBrandLogo}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditBrandLogo('')}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100 transition flex items-center gap-1 shrink-0"
                      title="Remove Logo"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}

                {/* Visibility Control Switch */}
                <div className="pt-2">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition cursor-pointer select-none">
                    <div className="space-y-0.5 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Show on Storefront</span>
                        {editBrandIsVisible ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Visible
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        স্টোরফ্রন্টের ব্র্যান্ড পার্টনার স্ট্রিপ ও ব্র্যান্ড ফিল্টারে দেখাবে কিনা নির্ধারণ করুন
                      </p>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={editBrandIsVisible}
                        onChange={(e) => setEditBrandIsVisible(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </div>
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBrand(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEditBrand}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {savingEditBrand ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: STORE SETTINGS & BRANDING */}
        {/* ============================================================== */}
        {/* ============================================================== */}
        {/* TAB 4: STORE MASTER SETTINGS & INTEGRATIONS */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {settingsNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 shadow-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{settingsNotice}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* CARD 1: STORE BRANDING & PROFILE */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-indigo-600" />
                      <span>Store Branding & Profile Configuration</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Public business name, contact lines, address, and live promotional slogans.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                    Step 1 · Core Profile
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Store / Business Name</label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Official Helpline Phone</label>
                    <input
                      type="text"
                      placeholder="+880 1812-778899"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Customer Support Email</label>
                    <input
                      type="email"
                      placeholder="info@smartvoltbd.com"
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Physical Store / Office Address</label>
                    <input
                      type="text"
                      placeholder="Nawabpur Road Electrical Market, Dhaka"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Top Announcement Banner Text</label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  <span className="text-[11px] text-slate-400">Displayed in red ribbon bar at the top of the storefront.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Hero Festival Campaign Title</label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      placeholder="e.g. Year-End Electronics Discount Festival 2026"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Hero Campaign Subtitle</label>
                    <input
                      type="text"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      placeholder="Authorized Direct Factory-Grade Products..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 2: MARKETING & ANALYTICS TRACKING (Meta Pixel & GA4) */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-rose-600" />
                      <span>Marketing & Conversion Tracking (Meta Pixel & GA4)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Automatically sends PageView, ViewContent, AddToCart, InitiateCheckout, and Purchase events to Meta & Google.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Step 2 · Ad ROI
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Meta Pixel (Facebook Pixel) ID</span>
                      <span className="text-[10px] text-rose-500 font-mono">fbq('init')</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 182749019284710"
                      value={metaPixelId}
                      onChange={(e) => setMetaPixelId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-rose-600"
                    />
                    <span className="text-[11px] text-slate-400">Tracks standard e-commerce conversions across your Facebook & Instagram ads.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <span>Google Analytics (GA4) Measurement ID</span>
                      <span className="text-[10px] text-indigo-500 font-mono">gtag('config')</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. G-XXXXXXXXXX or GTM-XXXXXX"
                      value={googleAnalyticsId}
                      onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                    <span className="text-[11px] text-slate-400">Streamlines user journey tracking and Google Ads conversion events.</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Active Tracking Events: <strong>PageView</strong>, <strong>ViewContent</strong>, <strong>AddToCart</strong>, <strong>Purchase</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${metaPixelId ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-[11px] font-bold">{metaPixelId ? 'Meta Pixel Active' : 'Pixel Unconfigured'}</span>
                    <span className="text-slate-300">|</span>
                    <span className={`w-2 h-2 rounded-full ${googleAnalyticsId ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="text-[11px] font-bold">{googleAnalyticsId ? 'GA4 Active' : 'GA4 Unconfigured'}</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: INSTANT CONVERSIONS (WhatsApp Live Widget) */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      <span>Instant Conversions & WhatsApp Live Chat</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure the floating WhatsApp contact button displayed across all catalog and product pages.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Step 3 · Instant Sales
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Official WhatsApp Business Number</label>
                    <input
                      type="text"
                      placeholder="+880 1812-778899"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[11px] text-slate-400">Accepts international or BD standard format with country code.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Pre-filled Customer Welcome Message</label>
                    <input
                      type="text"
                      placeholder="Hello SmartVolt, I would like to inquire about your products."
                      value={whatsappWelcomeMsg}
                      onChange={(e) => setWhatsappWelcomeMsg(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <span className="text-[11px] text-slate-400">Pre-fills the customer's WhatsApp chat prompt on click.</span>
                  </div>
                </div>
              </div>

              {/* CARD 4: CUSTOM DOMAIN & MULTI-TENANT ROUTING */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-sky-600" />
                      <span>Custom Domain & DNS Setup</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Connect your branded top-level domain (e.g. shop.smartvoltbd.com or smartvolt.com).
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                    Step 4 · White-Label
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Custom Domain Hostname</label>
                  <input
                    type="text"
                    placeholder="e.g. store.smartvolt.com or smartvoltbd.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-sky-600"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 text-xs space-y-2 text-sky-900">
                  <div className="font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>DNS Configuration Instructions for Your Registrar (Namecheap, GoDaddy, BTCL):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] bg-white p-3 rounded-xl border border-sky-200">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Record Type</span>
                      <strong className="text-slate-800">CNAME Record</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Host / Name</span>
                      <strong className="text-slate-800">{customDomain ? customDomain.split('.')[0] : 'store'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase">Target / Value</span>
                      <strong className="text-indigo-600 font-bold">cname.nexstore.com</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 5: BUSINESS & LEGAL COMPLIANCE (DBID & Trade License) */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-600" />
                      <span>Legal Compliance & Business Credentials (DBID / e-CAB)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Required by the Ministry of Commerce Bangladesh digital commerce regulatory guidelines.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Step 5 · Compliance
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Digital Business ID (DBID) Number</label>
                    <input
                      type="text"
                      placeholder="e.g. DBID-2026-091482"
                      value={dbidRegistrationNo}
                      onChange={(e) => setDbidRegistrationNo(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                    <span className="text-[11px] text-slate-400">Official DBID registered with the Ministry of Commerce.</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Trade License / BIN Registration No</label>
                    <input
                      type="text"
                      placeholder="e.g. TRAD/DSCC/012984/2026"
                      value={tradeLicenseNo}
                      onChange={(e) => setTradeLicenseNo(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                    <span className="text-[11px] text-slate-400">Displayed in footer to comply with e-CAB transparency norms.</span>
                  </div>
                </div>
              </div>

              {/* CARD 6: COURIER & SHIPPING LOGISTICS APIS (Steadfast & Pathao) */}
              <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-indigo-600" />
                      <span>Courier Logistics & Dispatch API (Steadfast / Pathao)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enable 1-click consignment creation, pickup orders, and live tracking code generation.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Step 6 · Logistics
                  </span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Steadfast Courier API Integration</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Steadfast API Key</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••••••••••"
                        value={steadfastApiKey}
                        onChange={(e) => setSteadfastApiKey(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Steadfast Secret Key</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••••••••••"
                        value={steadfastSecretKey}
                        onChange={(e) => setSteadfastSecretKey(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 pt-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Pathao Courier API Integration</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Pathao Store ID</label>
                      <input
                        type="text"
                        placeholder="e.g. 12948"
                        value={pathaoStoreId}
                        onChange={(e) => setPathaoStoreId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Pathao Client ID</label>
                      <input
                        type="text"
                        placeholder="Client ID..."
                        value={pathaoClientId}
                        onChange={(e) => setPathaoClientId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Pathao Client Secret</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••"
                        value={pathaoClientSecret}
                        onChange={(e) => setPathaoClientSecret(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON BAR */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Save Master Setup Configuration</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Saves all domain mappings, tracking scripts, logistics keys, and legal credentials instantly.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-50 shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving All Settings...' : 'Save Master Setup'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: SUBSCRIPTION, QUOTA LIMITS & PLAN METRICS */}
        {/* ============================================================== */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            {merchantRequestNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{merchantRequestNotice}</span>
              </div>
            )}

            {/* Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {subscriptionData?.subscription?.planName || 'Growth Business Pro'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{subscriptionData?.subscription?.status?.toUpperCase() || 'ACTIVE'}</span>
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">SaaS Subscription & Resource Quotas</h2>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Active storefront license powered by multi-tenant cloud isolation, certified DBID compliance, and automated logistics.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    Active on Platform: {subscriptionData?.subscription?.activeDays || 71} Days
                  </span>
                  <span>•</span>
                  <span className="text-amber-300 font-semibold">
                    Next Renewal: {subscriptionData?.subscription?.daysUntilRenewal !== undefined ? subscriptionData.subscription.daysUntilRenewal : 21} Days remaining
                  </span>
                  <span>•</span>
                  <span>Billing: <strong>BDT {Number(subscriptionData?.subscription?.priceBDT || 3500).toLocaleString()}</strong> / {subscriptionData?.subscription?.billingCycle || 'month'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                <a
                  href="#request-upgrade-section"
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition text-center"
                >
                  ⚡ Request Plan Upgrade / Feature
                </a>
              </div>
            </div>

            {/* Quota Usage Meters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Product Limit */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-indigo-600" />
                    <span>Catalog Products</span>
                  </span>
                  <span className="text-slate-900">{subscriptionData?.usage?.products?.used || 9} / {subscriptionData?.usage?.products?.limit || 500}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, subscriptionData?.usage?.products?.percent || 2)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>{subscriptionData?.usage?.products?.percent || 2}% of plan capacity</span>
                  <span className="text-emerald-600 font-bold">Healthy</span>
                </div>
              </div>

              {/* Monthly Orders */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-rose-600" />
                    <span>Monthly Orders</span>
                  </span>
                  <span className="text-slate-900">{subscriptionData?.usage?.orders?.used || 2} / {subscriptionData?.usage?.orders?.limit || 1500}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-rose-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, subscriptionData?.usage?.orders?.percent || 1)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>{subscriptionData?.usage?.orders?.percent || 0}% used this cycle</span>
                  <span className="text-emerald-600 font-bold">Healthy</span>
                </div>
              </div>

              {/* Staff Accounts */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Staff Accounts</span>
                  </span>
                  <span className="text-slate-900">{subscriptionData?.usage?.staff?.used || 1} / {subscriptionData?.usage?.staff?.limit || 5}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, subscriptionData?.usage?.staff?.percent || 20)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>{subscriptionData?.usage?.staff?.percent || 20}% allocated</span>
                  <span className="text-slate-600 font-medium">{subscriptionData?.usage?.staff?.limit || 5} seats max</span>
                </div>
              </div>

              {/* Database Telemetry */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-amber-600" />
                    <span>Dedicated DB Partition</span>
                  </span>
                  <span className="text-emerald-600 font-bold">Isolated</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500 w-[12%]" />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>tenant_{tenantSlug}</span>
                  <span className="font-mono text-slate-600">Postgres JSON</span>
                </div>
              </div>
            </div>

            {/* Feature Entitlements Grid */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Active Plan Feature Entitlements</h3>
                <p className="text-xs text-slate-500 mt-0.5">Architectural capabilities granted by platform super-administrators for your store instance.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Branded Custom Domain', active: subscriptionData?.features?.customDomain, desc: 'CNAME pointed domain' },
                  { label: 'Steadfast & Pathao APIs', active: subscriptionData?.features?.courierLogisticsAPI, desc: 'Automated 1-click dispatch' },
                  { label: 'Meta Pixel & GA4 Suite', active: subscriptionData?.features?.metaPixelAndGA4, desc: 'Full conversion tracking' },
                  { label: 'Anti-Fraud Risk Engine', active: subscriptionData?.features?.fraudIntelligence, desc: 'Customer blacklist & protection' },
                  { label: 'Transactional Email Receipts', active: subscriptionData?.features?.automatedEmailReceipts, desc: 'Itemized HTML manifests' },
                  { label: 'Transactional SMS Gateway', active: subscriptionData?.features?.automatedSmsGateway, desc: 'Order tracking dispatches' },
                  { label: 'White-Label Branding', active: subscriptionData?.features?.whiteLabelBranding, desc: 'SaaS branding removed' },
                  { label: '24/7 Priority VIP Support', active: subscriptionData?.features?.priority24x7Support, desc: 'Emergency response hotline' },
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition flex items-start gap-3 ${
                      feat.active
                        ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        feat.active ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {feat.active ? <Check className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">{feat.label}</h4>
                      <p className="text-[11px] opacity-80 mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoices History */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">SaaS Subscription Invoices</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Official receipts and payment ledger for store hosting and platform services.</p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                    <tr>
                      <th className="p-3.5">Invoice ID</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Payment Method</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Receipt / Tax Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(subscriptionData?.subscription?.invoices || []).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400 font-medium">No recorded invoices yet.</td>
                      </tr>
                    ) : (
                      subscriptionData.subscription.invoices.map((inv: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="p-3.5 font-mono font-bold text-slate-900">{inv.invoiceId}</td>
                          <td className="p-3.5 text-slate-600">{inv.date}</td>
                          <td className="p-3.5 font-bold text-slate-900">BDT {Number(inv.amount).toLocaleString()}</td>
                          <td className="p-3.5 text-slate-600">{inv.paymentMethod}</td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {inv.status || 'PAID'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setShowInvoiceModal(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-[11px] font-bold shadow-sm transition inline-flex items-center gap-1.5 active:scale-95"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Request Upgrade / Custom Requirements Form */}
            <div id="request-upgrade-section" className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Request Custom Feature or Plan Upgrade</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Need a higher catalog limit, bulk barcode printers, special payment gateways, or enterprise API access? Submit directly to platform administrators.
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!merchantRequestText.trim()) return;
                  try {
                    const res = await api.addMerchantRequirement(tenantSlug, merchantRequestText.trim());
                    if (res?.success) {
                      setMerchantRequestNotice('Your custom requirement has been submitted to the Super-Admin command center.');
                      setMerchantRequestText('');
                      setRefreshTrigger((prev) => prev + 1);
                      setTimeout(() => setMerchantRequestNotice(null), 5000);
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="space-y-3"
              >
                <textarea
                  required
                  rows={3}
                  value={merchantRequestText}
                  onChange={(e) => setMerchantRequestText(e.target.value)}
                  placeholder="Describe your requirement (e.g. Please upgrade my monthly order quota to 5,000 orders and enable custom bKash merchant checkout)..."
                  className="w-full p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-white text-xs leading-relaxed outline-none focus:border-indigo-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
                  >
                    <span>Submit Requirement to Super-Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: 1-HOUR APPOINTMENTS SHEET */}
        {/* ============================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm print:hidden">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  {isRealEstate ? (
                    <Building2 className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Calendar className="w-5 h-5 text-emerald-600" />
                  )}
                  <span>
                    {isRealEstate
                      ? 'Daily Property Site Tour & Client Visit Manifest'
                      : 'Daily 1-Hour Appointment Manifest'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isRealEstate
                    ? 'Generate or print the scheduled private property tour & client visit itinerary.'
                    : 'Select a date to generate or print the doctor / clinic physical consultation queue.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={selectedSheetDate}
                  onChange={(e) => setSelectedSheetDate(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                />
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Daily Sheet</span>
                </button>
              </div>
            </div>

            {/* Printable Daily Sheet Manifest */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{tenantInfo?.name || 'Clinic Management'}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consultation Manifest for Date: <strong className="text-slate-800">{selectedSheetDate}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Total Patients: {sheetData.length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Serial #</th>
                      <th className="py-3 px-4">Patient / Client Name</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4">Assigned 1-Hour Slot</th>
                      <th className="py-3 px-4">Requested Service / Treatment</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheetData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-black text-slate-900">#{row.serialNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{row.customerName}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{row.customerPhone}</td>
                        <td className="py-3.5 px-4 font-bold text-emerald-700">{row.bookingTime}</td>
                        <td className="py-3.5 px-4 text-slate-600">{row.item?.title || 'General Consultation'}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: STORE MODULES */}
        {/* ============================================================== */}
        {activeTab === 'modules' && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Installed Store Modules</h3>
              <p className="text-xs text-slate-500 mt-1">
                Toggle features on and off for this store. Enabled modules automatically inject into your storefront.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">1-Hour Slot Booking Engine</h4>
                  <p className="text-xs text-slate-500">Allows visitors to select a calendar date and reserved 1-hour time slot.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Enabled</span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">72-Hour Consumer Dispute Redressal</h4>
                  <p className="text-xs text-slate-500">Provides customers with public dispute filing and refund claims.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Enabled</span>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Verified Product Reviews & Ratings</h4>
                  <p className="text-xs text-slate-500">Enables customer feedback collection and 5-star rating badges.</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ============================================================== */}
        {/* TAB 7: ELECTRONICS SHOWROOMS & RETAIL COUNTER POS TERMINAL */}
        {/* ============================================================== */}
        {activeTab === 'showrooms' && (() => {
          const activeBranch = showroomsList.find((s) => s.id === posSelectedBranch) || showroomsList[0];

          // Filter catalog items for POS
          const posAvailableItems = items.filter((it: any) => {
            const matchesQuery = !posSearchQuery ||
              (it.title || '').toLowerCase().includes(posSearchQuery.toLowerCase()) ||
              (it.sku || '').toLowerCase().includes(posSearchQuery.toLowerCase()) ||
              (it.brand || '').toLowerCase().includes(posSearchQuery.toLowerCase());

            const matchesCategory = posCategoryFilter === 'all' ||
              it.category === posCategoryFilter ||
              it.categoryId === posCategoryFilter;

            return matchesQuery && matchesCategory;
          });

          // POS Cart Calculations
          const cartSubtotal = posCart.reduce((sum, item) => sum + (Number(item.price || 0) * item.quantity), 0);
          const cartDiscount = Math.min(cartSubtotal, Math.max(0, Number(posDiscount || 0)));
          const cartFinalTotal = Math.max(0, cartSubtotal - cartDiscount);
          const cashTenderedNum = Number(posCashTendered) || 0;
          const changeDue = Math.max(0, cashTenderedNum - cartFinalTotal);

          // Add item to POS Cart
          const handleAddToCart = (item: any) => {
            setPosCart((prev) => {
              const existingIdx = prev.findIndex((p) => p.id === item.id);
              if (existingIdx >= 0) {
                const next = [...prev];
                next[existingIdx].quantity += 1;
                return next;
              } else {
                return [
                  ...prev,
                  {
                    id: item.id,
                    title: item.title,
                    price: Number(item.price || 0),
                    quantity: 1,
                    sku: item.sku || `SKU-${item.id.slice(-4)}`,
                    image: item.images?.[0] || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=200&q=80',
                    stock: item.stock ?? item.inventory ?? 20
                  }
                ];
              }
            });
          };

          const handleUpdateQuantity = (id: string, delta: number) => {
            setPosCart((prev) => {
              return prev
                .map((it) => {
                  if (it.id === id) {
                    const nextQty = it.quantity + delta;
                    return nextQty > 0 ? { ...it, quantity: nextQty } : null;
                  }
                  return it;
                })
                .filter(Boolean) as any[];
            });
          };

          const handleRemoveFromCart = (id: string) => {
            setPosCart((prev) => prev.filter((it) => it.id !== id));
          };

          // Complete Showroom Sale & Print Thermal 80mm POS Slip
          const handleCompletePosSale = () => {
            if (posCart.length === 0) {
              alert('দয়া করে প্রথমে কাউন্টার কার্টে পণ্য যুক্ত করুন');
              return;
            }

            const timestamp = Date.now();
            const orderNum = `POS-${String(timestamp).slice(-6)}`;
            const custName = posCustomerName.trim() || 'Walk-in Showroom Buyer';
            const custPhone = posCustomerPhone.trim() || '+880 1700-000000';
            const branchName = activeBranch?.name || 'SmartVolt Dhanmondi Flagship';

            const newOrder = {
              id: `pos_${timestamp}`,
              orderNumber: orderNum,
              customerName: custName,
              customerPhone: custPhone,
              customerEmail: 'showroom.pos@smartvolt.com',
              shippingAddress: `${branchName}, ${activeBranch?.city || 'Dhaka'} (Walk-in Outlet Counter Sale)`,
              totalAmount: cartFinalTotal,
              subtotal: cartSubtotal,
              discount: cartDiscount,
              deliveryCharge: 0,
              orderStatus: 'DELIVERED',
              paymentStatus: 'PAID',
              paymentMethod: posPaymentMethod.toUpperCase(),
              createdAt: new Date().toISOString(),
              items: posCart.map((c) => ({
                id: c.id,
                title: c.title,
                price: c.price,
                quantity: c.quantity,
              })),
              posBranch: branchName,
              posCashier: 'Admin (Counter 01)',
              posCashTendered: cashTenderedNum || cartFinalTotal,
              posChangeDue: changeDue,
              posTrxId: posTrxId || undefined
            };

            // 1. Add order to state
            setOrders((prev) => [newOrder, ...prev]);

            // 2. Deduct item stock in local state
            setItems((prevItems) => {
              return prevItems.map((item) => {
                const cartItem = posCart.find((c) => c.id === item.id);
                if (cartItem) {
                  const currentStock = item.stock ?? item.inventory ?? 20;
                  return {
                    ...item,
                    stock: Math.max(0, currentStock - cartItem.quantity),
                    inventory: Math.max(0, currentStock - cartItem.quantity)
                  };
                }
                return item;
              });
            });

            // 3. Trigger 80mm thermal receipt modal
            setSelectedPosReceipt(newOrder);

            // 4. Reset Cart
            setPosCart([]);
            setPosCustomerName('');
            setPosCustomerPhone('');
            setPosDiscount(0);
            setPosCashTendered('');
            setPosTrxId('');

            setPosOrderSuccessNotice(`কাউন্টার বিক্রয় #${orderNum} সফলভাবে সম্পন্ন হয়েছে! ৮০মিমি থার্মাল রিসিট প্রিন্ট হচ্ছে...`);
            setTimeout(() => setPosOrderSuccessNotice(null), 4000);
          };

          return (
            <div className="space-y-6">
              {/* POS Top Header & Mode Switcher */}
              <div className="bg-[#0F1424] p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-white tracking-tight">
                        SmartVolt Showrooms & Retail Counter POS
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Counter 01 Online
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ওয়াক-ইন কাস্টমারদের দ্রুত কাউন্টার বিলিং, স্টক কর্তন ও ৮০মিমি থার্মাল রিসিট প্রিন্ট টার্মিনাল
                    </p>
                  </div>
                </div>

                {/* Branch Dropdown & View Mode Switcher */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Select Showroom Branch */}
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <select
                      value={posSelectedBranch}
                      onChange={(e) => setPosSelectedBranch(e.target.value)}
                      className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
                    >
                      {showroomsList.map((s) => (
                        <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                          {s.name} ({s.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mode Switcher Buttons */}
                  <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
                    <button
                      onClick={() => setPosViewMode('pos')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        posViewMode === 'pos'
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>⚡ লাইভ POS বিলিং</span>
                    </button>
                    <button
                      onClick={() => setPosViewMode('directory')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        posViewMode === 'directory'
                          ? 'bg-slate-800 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>আউটলেট ডিরেক্টরি</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Success Notification Alert */}
              {posOrderSuccessNotice && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <strong className="text-white text-sm">{posOrderSuccessNotice}</strong>
                  </div>
                  <button
                    onClick={() => setPosOrderSuccessNotice(null)}
                    className="text-emerald-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* MODE 1: LIVE POS COUNTER TERMINAL */}
              {posViewMode === 'pos' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* LEFT COLUMN: PRODUCT CATALOG & BARCODE SCANNER (7 COLS) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Search & Barcode Input */}
                    <div className="bg-[#0F1424] p-4 rounded-2xl border border-slate-800 shadow-lg space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={posSearchQuery}
                          onChange={(e) => setPosSearchQuery(e.target.value)}
                          placeholder="বারকোড স্ক্যান করুন অথবা পণ্যের নাম / মডেল লিখুন..."
                          className="w-full pl-10 pr-24 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">
                          SCANNER READY
                        </span>
                      </div>

                      {/* Quick Category Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                        {[
                          { id: 'all', label: 'সব প্রোডাক্ট' },
                          { id: 'Smart TV', label: 'টিভি ও অডিও' },
                          { id: 'Air Conditioner', label: 'ইনভার্টার এসি' },
                          { id: 'Refrigerator', label: 'রেফ্রিজারেটর' },
                          { id: 'Accessories', label: 'এক্সেসরিজ' },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setPosCategoryFilter(cat.id)}
                            className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer text-[11px] ${
                              posCategoryFilter === cat.id
                                ? 'bg-orange-600 text-white shadow'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[620px] overflow-y-auto pr-1">
                      {posAvailableItems.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-slate-500 bg-[#0F1424] rounded-2xl border border-slate-800">
                          <Package className="w-10 h-10 mx-auto mb-2 opacity-30 text-orange-400" />
                          <p className="font-semibold text-slate-400">কোন প্রোডাক্ট পাওয়া যায়নি</p>
                          <p className="text-[11px] text-slate-500 mt-1">অনুসন্ধান বা ক্যাটাগরি ফিল্টার পরিবর্তন করুন</p>
                        </div>
                      ) : (
                        posAvailableItems.map((item: any) => {
                          const stockCount = item.stock ?? item.inventory ?? 20;
                          const inCart = posCart.find((c) => c.id === item.id);

                          return (
                            <div
                              key={item.id}
                              onClick={() => handleAddToCart(item)}
                              className={`bg-[#0F1424] border rounded-2xl p-3 flex flex-col justify-between transition cursor-pointer hover:border-orange-500/60 hover:shadow-lg group relative overflow-hidden select-none ${
                                inCart ? 'border-orange-500/60 ring-1 ring-orange-500/30' : 'border-slate-800'
                              }`}
                            >
                              <div>
                                <div className="aspect-video w-full rounded-xl bg-slate-900 overflow-hidden relative mb-2.5">
                                  <img
                                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80'}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  />
                                  {inCart && (
                                    <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-600 text-white shadow">
                                      {inCart.quantity}x
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-orange-300 transition">
                                  {item.title}
                                </h4>
                                <div className="text-[10px] text-slate-500 font-mono mt-1">
                                  SKU: {item.sku || `SV-${item.id.slice(-4)}`}
                                </div>
                              </div>

                              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                                <div>
                                  <div className="font-mono font-black text-sm text-emerald-400">
                                    ৳ {Number(item.price || 0).toLocaleString('en-BD')}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    স্টক: <span className={stockCount < 5 ? 'text-rose-400 font-bold' : 'text-slate-300'}>{stockCount} টি</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  className="w-7 h-7 rounded-xl bg-orange-600/20 group-hover:bg-orange-600 text-orange-400 group-hover:text-white flex items-center justify-center transition"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* RIGHT COLUMN: POS COUNTER CART & CHECKOUT REGISTER (5 COLS) */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-[#0F1424] rounded-2xl border border-slate-800 shadow-2xl p-5 space-y-4 flex flex-col justify-between min-h-[680px]">
                      {/* Top Header & Customer Search */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-orange-400" />
                            <h3 className="font-black text-white text-sm">কাউন্টার কার্ট</h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-950 text-orange-300 border border-orange-800/60">
                              {posCart.reduce((s, i) => s + i.quantity, 0)} আইটেম
                            </span>
                          </div>

                          {posCart.length > 0 && (
                            <button
                              onClick={() => setPosCart([])}
                              className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>খালি করুন</span>
                            </button>
                          )}
                        </div>

                        {/* Customer Info (Walk-in / CRM) */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">ক্রেতার মোবাইল নম্বর</label>
                            <input
                              type="text"
                              value={posCustomerPhone}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPosCustomerPhone(val);
                                // Auto-fill if matching CRM
                                if (val.includes('1711982341')) setPosCustomerName('Tanvir Ahmed Chowdhury (VIP)');
                                else if (val.includes('1819234567')) setPosCustomerName('Engr. Rafiqul Islam (VIP)');
                                else if (val.includes('1912876543')) setPosCustomerName('Dr. Farhana Yasmin');
                              }}
                              placeholder="০১৭xxxxxxxx"
                              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-0.5">ক্রেতার নাম</label>
                            <input
                              type="text"
                              value={posCustomerName}
                              onChange={(e) => setPosCustomerName(e.target.value)}
                              placeholder="ওয়াক-ইন ক্রেতা"
                              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-white text-[11px] focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Cart Items List */}
                      <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2 pr-1 divide-y divide-slate-800/60">
                        {posCart.length === 0 ? (
                          <div className="py-12 text-center text-slate-500">
                            <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                            <p className="text-xs font-semibold text-slate-400">কাউন্টার কার্ট খালি</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">বাম পাশ থেকে পণ্য ক্লিক করে যোগ করুন</p>
                          </div>
                        ) : (
                          posCart.map((c) => (
                            <div key={c.id} className="pt-2 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                <img
                                  src={c.image}
                                  alt={c.title}
                                  className="w-9 h-9 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                                />
                                <div className="truncate">
                                  <h5 className="font-bold text-white text-xs truncate">{c.title}</h5>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    ৳ {c.price.toLocaleString('en-BD')} / ইউনিট
                                  </div>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(c.id, -1)}
                                  className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-black"
                                >
                                  -
                                </button>
                                <span className="w-5 text-center font-mono font-bold text-white text-xs">
                                  {c.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(c.id, 1)}
                                  className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-black"
                                >
                                  +
                                </button>
                              </div>

                              {/* Line Total */}
                              <div className="font-mono font-bold text-emerald-400 text-xs w-20 text-right shrink-0">
                                ৳ {(c.price * c.quantity).toLocaleString('en-BD')}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveFromCart(c.id)}
                                className="text-slate-500 hover:text-rose-400 transition p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Calculations & Discount */}
                      <div className="border-t border-slate-800 pt-3 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>সাবটোটাল</span>
                          <span className="font-mono text-slate-200">৳ {cartSubtotal.toLocaleString('en-BD')}</span>
                        </div>

                        {/* Flat Discount Input */}
                        <div className="flex items-center justify-between text-slate-400">
                          <span>কাউন্টার ছাড় (ডিসকাউন্ট)</span>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">৳</span>
                            <input
                              type="number"
                              min={0}
                              value={posDiscount || ''}
                              onChange={(e) => setPosDiscount(Number(e.target.value) || 0)}
                              placeholder="0"
                              className="w-20 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded-lg text-right font-mono text-xs text-white focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        {/* Grand Total */}
                        <div className="flex justify-between items-baseline border-t border-dashed border-slate-700 pt-2">
                          <span className="font-black text-white text-sm">সর্বমোট প্রদেয়</span>
                          <span className="font-mono font-black text-xl text-emerald-400">
                            ৳ {cartFinalTotal.toLocaleString('en-BD')}
                          </span>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          পেমেন্ট মেথড নির্বাচন করুন
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 text-xs">
                          {[
                            { id: 'cash', label: '💵 ক্যাশ' },
                            { id: 'bkash', label: '📱 বিকাশ / নগদ' },
                            { id: 'card', label: '💳 পিওএস কার্ড' },
                          ].map((pm) => (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setPosPaymentMethod(pm.id as any)}
                              className={`py-2 px-1.5 rounded-xl font-bold transition text-center cursor-pointer ${
                                posPaymentMethod === pm.id
                                  ? 'bg-orange-600 text-white shadow'
                                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
                              }`}
                            >
                              {pm.label}
                            </button>
                          ))}
                        </div>

                        {/* Cash Tendered Calculator (If Cash) */}
                        {posPaymentMethod === 'cash' && (
                          <div className="grid grid-cols-2 gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs mt-2">
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1">গ্রাহক দিয়েছেন (৳)</span>
                              <input
                                type="number"
                                value={posCashTendered}
                                onChange={(e) => setPosCashTendered(e.target.value)}
                                placeholder={String(cartFinalTotal)}
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-orange-500"
                              />
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block mb-1">ফেরত দিতে হবে (৳)</span>
                              <div className="font-mono font-black text-base text-emerald-400 pt-1">
                                ৳ {changeDue.toLocaleString('en-BD')}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TrxID (If bKash or Card) */}
                        {posPaymentMethod !== 'cash' && (
                          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-xs mt-2">
                            <span className="text-[10px] text-slate-400 block mb-1">ট্রানজেকশন আইডি / কার্ড স্লিপ নম্বর</span>
                            <input
                              type="text"
                              value={posTrxId}
                              onChange={(e) => setPosTrxId(e.target.value)}
                              placeholder="TrxID: 9X8A7B..."
                              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        )}
                      </div>

                      {/* Checkout Action Button */}
                      <button
                        type="button"
                        onClick={handleCompletePosSale}
                        disabled={posCart.length === 0}
                        className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition shadow-xl cursor-pointer ${
                          posCart.length === 0
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white shadow-orange-600/30 active:scale-[0.98]'
                        }`}
                      >
                        <Printer className="w-4 h-4" />
                        <span>✅ পেমেন্ট সম্পন্ন ও ৮০মিমি রিসিট প্রিন্ট</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: SHOWROOMS & SERVICE OUTLETS DIRECTORY */}
              {posViewMode === 'directory' && (
                <div className="space-y-6">
                  {/* Directory Header Card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#0F1424] border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-500/20 text-orange-400 uppercase tracking-wider border border-orange-500/30">
                          Retail & Service Network
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Central Hotline: 09606 111 777
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-400" />
                        <span>Authorized Showrooms & Customer Service Outlet Network</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xl">
                        Manage physical showrooms, flagship experience zones, and official service points nationwide.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowAddShowroomModal(true)}
                        className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add New Showroom</span>
                      </button>
                    </div>
                  </div>

                  {/* Outlets List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {showroomsList.map((showroom) => (
                      <div
                        key={showroom.id}
                        className="bg-[#0F1424] rounded-3xl p-6 border border-slate-800 shadow-lg hover:border-orange-500/40 transition space-y-4 text-slate-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            {showroom.city}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingShowroom(showroom);
                                setEditShowroomCity(showroom.city || 'Dhaka');
                                setEditShowroomName(showroom.name || '');
                                setEditShowroomAddress(showroom.address || '');
                                setEditShowroomPhone(showroom.phone || '');
                                setEditShowroomManager(showroom.manager || '');
                                setEditShowroomHours(showroom.hours || '10:00 AM - 09:00 PM');
                                setEditShowroomIsActive(showroom.isActive !== false);
                              }}
                              className="text-slate-400 hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
                              title="Edit Showroom"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const updated = showroomsList.filter((s) => s.id !== showroom.id);
                                setShowroomsList(updated);
                                try {
                                  await api.updateStoreSettings({ showrooms: updated }, tenantSlug);
                                } catch (err) {
                                  console.error('Failed to persist showroom removal:', err);
                                }
                              }}
                              className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-base font-extrabold text-white leading-snug">
                            {showroom.name}
                          </h4>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                            <span>{showroom.address}</span>
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-400">
                            <span>Hotline:</span>
                            <span className="font-bold text-slate-200">{showroom.phone}</span>
                          </div>

                          <div className="flex items-center justify-between text-slate-400">
                            <span>In-Charge / Manager:</span>
                            <span className="font-semibold text-slate-200">{showroom.manager}</span>
                          </div>

                          <div className="flex items-center justify-between text-slate-400">
                            <span>Operating Hours:</span>
                            <span className="text-slate-300">{showroom.hours}</span>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Showroom Open
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setPosSelectedBranch(showroom.id);
                              setPosViewMode('pos');
                            }}
                            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                          >
                            <span>Open POS</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Showroom Modal */}
              {showAddShowroomModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#0F1424] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-800 text-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span>Add New Showroom or Service Hub</span>
                      </h4>
                      <button
                        onClick={() => setShowAddShowroomModal(false)}
                        className="text-slate-400 hover:text-white font-bold"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!newShowroomName.trim() || !newShowroomAddress.trim()) return;
                        const newObj = {
                          id: `shw_${Date.now()}`,
                          city: newShowroomCity,
                          name: newShowroomName.trim(),
                          address: newShowroomAddress.trim(),
                          phone: newShowroomPhone.trim(),
                          manager: newShowroomManager.trim() || 'Store Manager',
                          hours: newShowroomHours.trim(),
                          isActive: true,
                        };
                        const updated = [newObj, ...showroomsList];
                        setShowroomsList(updated);
                        setNewShowroomName('');
                        setNewShowroomAddress('');
                        setShowAddShowroomModal(false);
                        setProdNotice('New showroom successfully added and published!');
                        setTimeout(() => setProdNotice(null), 3000);
                        try {
                          await api.updateStoreSettings({ showrooms: updated }, tenantSlug);
                        } catch (err) {
                          console.error('Failed to persist new showroom:', err);
                        }
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="font-bold text-slate-400 block mb-1">Division or City *</label>
                        <select
                          value={newShowroomCity}
                          onChange={(e) => setNewShowroomCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-bold text-white"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chattogram</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Bogura">Bogura</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-400 block mb-1">Showroom Name *</label>
                        <input
                          type="text"
                          required
                          value={newShowroomName}
                          onChange={(e) => setNewShowroomName(e.target.value)}
                          placeholder="e.g. Jamuna Future Park Mega Store"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-400 block mb-1">Full Address *</label>
                        <input
                          type="text"
                          required
                          value={newShowroomAddress}
                          onChange={(e) => setNewShowroomAddress(e.target.value)}
                          placeholder="Level 4, Zone C, Shop 42, Jamuna Future Park, Dhaka"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-400 block mb-1">Hotline / Phone</label>
                          <input
                            type="text"
                            value={newShowroomPhone}
                            onChange={(e) => setNewShowroomPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-400 block mb-1">In-Charge / Manager</label>
                          <input
                            type="text"
                            value={newShowroomManager}
                            onChange={(e) => setNewShowroomManager(e.target.value)}
                            placeholder="Manager Name"
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-400 block mb-1">Operating Hours</label>
                        <input
                          type="text"
                          value={newShowroomHours}
                          onChange={(e) => setNewShowroomHours(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>

                      <div className="pt-3 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddShowroomModal(false)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md cursor-pointer"
                        >
                          Save Showroom
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Showroom Modal */}
              {editingShowroom && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#0F1424] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-800 text-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-indigo-400" />
                        <span>Edit Showroom or Service Hub</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setEditingShowroom(null)}
                        className="text-slate-400 hover:text-white font-bold p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!editShowroomName.trim() || !editShowroomAddress.trim()) return;
                        const updated = showroomsList.map((s) => {
                          if (s.id === editingShowroom.id) {
                            return {
                              ...s,
                              city: editShowroomCity,
                              name: editShowroomName.trim(),
                              address: editShowroomAddress.trim(),
                              phone: editShowroomPhone.trim(),
                              manager: editShowroomManager.trim() || 'Store Manager',
                              hours: editShowroomHours.trim(),
                              isActive: editShowroomIsActive,
                            };
                          }
                          return s;
                        });
                        setShowroomsList(updated);
                        setEditingShowroom(null);
                        setProdNotice('Showroom details updated and published live!');
                        setTimeout(() => setProdNotice(null), 3000);
                        try {
                          await api.updateStoreSettings({ showrooms: updated }, tenantSlug);
                        } catch (err) {
                          console.error('Failed to persist edited showroom:', err);
                        }
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="font-bold text-slate-400 block mb-1">Division or City *</label>
                        <select
                          value={editShowroomCity}
                          onChange={(e) => setEditShowroomCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chattogram</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Bogura">Bogura</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-slate-400 block mb-1">Showroom Name *</label>
                        <input
                          type="text"
                          required
                          value={editShowroomName}
                          onChange={(e) => setEditShowroomName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-400 block mb-1">Full Address *</label>
                        <input
                          type="text"
                          required
                          value={editShowroomAddress}
                          onChange={(e) => setEditShowroomAddress(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-400 block mb-1">Hotline / Phone</label>
                          <input
                            type="text"
                            value={editShowroomPhone}
                            onChange={(e) => setEditShowroomPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-400 block mb-1">In-Charge / Manager</label>
                          <input
                            type="text"
                            value={editShowroomManager}
                            onChange={(e) => setEditShowroomManager(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-400 block mb-1">Operating Hours</label>
                        <input
                          type="text"
                          value={editShowroomHours}
                          onChange={(e) => setEditShowroomHours(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                        />
                      </div>

                      <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={editShowroomIsActive}
                            onChange={(e) => setEditShowroomIsActive(e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          />
                          <span className="text-xs font-bold text-slate-300">Showroom Active & Open for Customers</span>
                        </label>
                      </div>

                      <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setEditingShowroom(null)}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md cursor-pointer"
                        >
                          Save Showroom Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Official Printable SaaS Subscription Invoice & Tax Receipt Modal */}
        <SaaSInvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedInvoice(null);
          }}
          invoice={selectedInvoice}
          merchant={{
            name: tenantInfo?.name || subscriptionData?.tenantName || tenantSlug,
            subdomain: tenantSlug,
            businessType: tenantInfo?.businessType,
            subscription: subscriptionData?.subscription,
            merchantProfile: subscriptionData?.merchantProfile,
          }}
        />
        {/* ============================================================== */}
        {/* MODAL 1: CUSTOM COURIER CONSIGNMENT DISPATCH MODAL */}
        {/* ============================================================== */}
        {dispatchModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      কুরিয়ার পার্সেল বুকিং — #{dispatchModalOrder.orderNumber}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Steadfast / Pathao / RedX API এর মাধ্যমে কনসাইনমেন্ট বুক করুন
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmModalDispatch} className="p-6 space-y-4 text-xs">
                {/* Customer Snapshot */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span className="font-semibold">গ্রাহকের নাম:</span>
                    <strong className="text-slate-900">{dispatchModalOrder.customerName}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span className="font-semibold">মোবাইল নম্বর:</span>
                    <strong className="font-mono text-slate-900">{dispatchModalOrder.customerPhone}</strong>
                  </div>
                  <div className="flex justify-between items-start text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                    <span className="font-semibold">ডেলিভারি ঠিকানা:</span>
                    <span className="text-right text-slate-800 font-medium max-w-[240px]">
                      {dispatchModalOrder.shippingAddress}, {dispatchModalOrder.city}
                    </span>
                  </div>
                </div>

                {/* Courier Selection Cards */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">কুরিয়ার পার্টনার নির্বাচন করুন *</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'Steadfast Courier', name: 'Steadfast', tag: 'সারাদেশে COD', color: 'border-emerald-500 bg-emerald-50/40 text-emerald-800' },
                      { id: 'Pathao Courier', name: 'Pathao', tag: 'দ্রুততম ঢাকা এক্সপ্রেস', color: 'border-red-500 bg-red-50/40 text-red-800' },
                      { id: 'RedX Delivery', name: 'RedX', tag: 'উপজেলা হাব', color: 'border-amber-500 bg-amber-50/40 text-amber-800' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setDispatchCourierName(c.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          dispatchCourierName === c.id
                            ? `${c.color} ring-2 ring-indigo-500/30 font-extrabold shadow-xs`
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                        }`}
                      >
                        <span className="block font-bold text-xs">{c.name}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{c.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* COD Amount & Weight */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      COD কালেকশন পরিমাণ (৳ BDT) *
                    </label>
                    <input
                      type="number"
                      required
                      value={dispatchCodAmount}
                      onChange={(e) => setDispatchCodAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">কাস্টমার থেকে কুরিয়ার এই টাকা আদায় করবে</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পার্সেল ওজন (Weight in KG) *
                    </label>
                    <select
                      value={dispatchParcelWeight}
                      onChange={(e) => setDispatchParcelWeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900"
                    >
                      <option value="0.5">0.5 KG (ছোট গ্যাজেট / এক্সেসরিজ)</option>
                      <option value="1.0">1.0 KG (স্ট্যান্ডার্ড পার্সেল)</option>
                      <option value="2.0">2.0 KG (ভারী অ্যাপ্লায়েন্স)</option>
                      <option value="5.0">5.0 KG (টিভি / ওভেন / মাইক্রোওয়েভ)</option>
                      <option value="10.0">10.0 KG (এসি / রেফ্রিজারেটর)</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Type Speed */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ডেলিভারি স্পিড</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="STANDARD_DELIVERY"
                        checked={dispatchDeliveryType === 'STANDARD_DELIVERY'}
                        onChange={(e) => setDispatchDeliveryType(e.target.value)}
                        className="text-indigo-600"
                      />
                      <span className="font-medium text-slate-700">স্ট্যান্ডার্ড (২৪-৪৮ ঘণ্টা)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryType"
                        value="EXPRESS_24H"
                        checked={dispatchDeliveryType === 'EXPRESS_24H'}
                        onChange={(e) => setDispatchDeliveryType(e.target.value)}
                        className="text-indigo-600"
                      />
                      <span className="font-medium text-slate-700">এক্সপ্রেস (সেম ডে / ২৪ ঘণ্টা)</span>
                    </label>
                  </div>
                </div>

                {/* Special Delivery Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ডেলিভারি নির্দেশনা / স্পেশাল নোট</label>
                  <input
                    type="text"
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                    placeholder="যেমন: ভঙ্গুর পণ্য, সাবধানে ডেলিভারি দিন"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDispatchModalOrder(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={dispatchingLoading}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{dispatchingLoading ? 'বুকিং হচ্ছে...' : 'কনফার্ম ও পার্সেল বুকিং করুন'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 2: PRINTABLE SHIPPING LABEL & CHALLAN (চালান লেবেল) */}
        {/* ============================================================== */}
        {printLabelOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
              {/* Top Controls Bar (Hidden during print) */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">কুরিয়ার চালান ও শিপিং লেবেল (4x6 / A4 Printable)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>লেবেল প্রিন্ট করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintLabelOrder(null)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* The Printable Consignment Label Sticker Container */}
              <div className="p-6 bg-white text-slate-900 font-sans text-xs">
                <div className="border-2 border-slate-900 rounded-2xl p-5 space-y-4">
                  {/* Label Header */}
                  <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                        {tenantInfo?.name || 'SmartVolt Store'}
                      </h2>
                      <p className="text-[10px] text-slate-600 mt-0.5">
                        {tenantInfo?.address || 'Tejgaon Industrial Area, Dhaka-1208'}
                      </p>
                      <p className="text-[10px] font-mono font-bold text-slate-800">
                        Hotline: {whatsappNumber || '09606 111 777'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-sm rounded-lg uppercase tracking-wider">
                        {printLabelOrder.courier || 'Steadfast'}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-500 mt-1">
                        Order #{printLabelOrder.orderNumber}
                      </span>
                    </div>
                  </div>

                  {/* Barcode & Tracking Block */}
                  <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-mono text-2xl font-black tracking-widest text-slate-950">
                      ||| | |||| | ||| |||| | || |||||
                    </div>
                    <div className="font-mono text-xs font-black tracking-wider text-slate-800 mt-1">
                      {printLabelOrder.trackingCode || `STEAD-${printLabelOrder.orderNumber}-DHA`}
                    </div>
                    <span className="text-[9px] text-slate-500 block uppercase font-mono">
                      Consignment ID: {printLabelOrder.consignment?.consignmentId || `CN-${printLabelOrder.orderNumber}`}
                    </span>
                  </div>

                  {/* Recipient Details & COD Box (2-Columns) */}
                  <div className="grid grid-cols-2 gap-3 border-y-2 border-slate-900 py-3">
                    {/* Left: Deliver To */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                        DELIVER TO (গ্রাহক):
                      </span>
                      <div className="text-sm font-black text-slate-950">
                        {printLabelOrder.customerName}
                      </div>
                      <div className="font-mono font-bold text-slate-900 text-xs">
                        📞 {printLabelOrder.customerPhone}
                      </div>
                      <div className="text-xs text-slate-700 font-medium pt-1">
                        {printLabelOrder.shippingAddress}
                      </div>
                      <div className="text-xs font-black text-slate-950 uppercase pt-0.5">
                        📍 {printLabelOrder.city}
                      </div>
                    </div>

                    {/* Right: Cash on Delivery Collection Amount */}
                    <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-700 block tracking-wider">
                          CASH ON DELIVERY (COD)
                        </span>
                        <div className="text-2xl font-black text-slate-950 font-mono mt-1">
                          ৳ {Number(printLabelOrder.totalAmount || 0).toLocaleString('en-BD')}
                        </div>
                        <span className="text-[10px] font-bold text-rose-700 block mt-0.5">
                          ক্যাশ বুঝে নিয়ে পার্সেল হস্তান্তর করুন
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-300 flex justify-between text-[10px] font-mono text-slate-600">
                        <span>Weight: {printLabelOrder.consignment?.weight || '1.0 kg'}</span>
                        <span>Date: {new Date(printLabelOrder.createdAt || Date.now()).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Package Contents / Items List */}
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      PARCEL ITEMS / পণ্য বিবরণ:
                    </span>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-[11px]">
                      {printLabelOrder.items?.map((it: any, idx: number) => (
                        <div key={idx} className="p-2 flex justify-between bg-slate-50/50">
                          <span className="font-bold text-slate-800">
                            {it.title || it.itemTitle} {it.variantTitle ? `(${it.variantTitle})` : ''}
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            Qty: {it.quantity || 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Security Notice */}
                  <div className="pt-2 border-t border-slate-200 text-center text-[10px] text-slate-500 font-medium">
                    ⚠️ সিকিউরিটি সিল নষ্ট থাকলে পার্সেল গ্রহণ করবেন না। যেকোনো সমস্যায় হটলাইনে কল দিন।
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL 3: REAL-TIME COURIER CONSIGNMENT TRACKING DRAWER */}
        {/* ============================================================== */}
        {trackModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      লাইভ কুরিয়ার ট্র্যাকিং — #{trackModalOrder.orderNumber}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {trackModalOrder.courier || 'Steadfast'} • {trackModalOrder.trackingCode || 'Tracking Code'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setTrackModalOrder(null)}
                  className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-xs">
                {/* Consignment Status Overview Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Consignment Tracking ID</span>
                      <span className="font-mono text-base font-extrabold text-indigo-300">
                        {trackModalOrder.trackingCode}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      IN TRANSIT
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Recipient & City:</span>
                      <span className="font-bold text-white">{trackModalOrder.customerName} ({trackModalOrder.city})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Courier Helpline:</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {trackingData?.helpline || '09678-045045'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Milestone Timeline */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                    ডেলিভারি মাইলস্টোন ট্র্যাকিং
                  </h4>

                  {trackingLoading ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      কুরিয়ার API থেকে লাইভ স্ট্যাটাস লোড হচ্ছে...
                    </div>
                  ) : (
                    <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {(trackingData?.timeline || [
                        {
                          title: 'কনসাইনমেন্ট রেজিস্টার্ড ও চালান লেবেল তৈরি',
                          description: 'Steadfast API এর মাধ্যমে ট্র্যাকিং আইডি জেনারেট করা হয়েছে।',
                          time: 'Today, 10:30 AM',
                          status: 'COMPLETED',
                          location: 'SmartVolt Warehouse / Dhaka',
                        },
                        {
                          title: 'রাইডারের কাছে পার্সেল হ্যান্ডওভার সম্পন্ন',
                          description: 'কুরিয়ার পিকআপ ডেলিভারি হিরো মার্চেন্ট শপ থেকে পার্সেল রিসিভ করেছে।',
                          time: 'Today, 01:15 PM',
                          status: 'COMPLETED',
                          location: 'Central Fulfillment Hub',
                        },
                        {
                          title: 'সেন্ট্রাল সর্টিং হাবে পার্সেল চেকিং ও সর্টিং',
                          description: 'পার্সেল বারকোড স্ক্যান সম্পন্ন এবং গন্তব্য জেলার ডেলিভারি পয়েন্টে পাঠানো হয়েছে।',
                          time: 'Today, 04:45 PM',
                          status: 'IN_PROGRESS',
                          location: `${trackModalOrder.city || 'Dhaka'} Sorting Hub`,
                        },
                        {
                          title: 'আউট ফর ফাইনাল ডেলিভারি',
                          description: 'ক্যাশ অন ডেলিভারি (COD) রিসিট নিয়ে রাইডার কাস্টমারের ঠিকানায় পৌঁছাবে।',
                          time: 'আগামীকাল সকাল',
                          status: 'PENDING',
                          location: `${trackModalOrder.shippingAddress || 'Customer Address'}, ${trackModalOrder.city || 'Dhaka'}`,
                        },
                      ]).map((step: any, sIdx: number) => (
                        <div key={sIdx} className="flex items-start gap-3 relative">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-white text-[10px] font-bold ${
                              step.status === 'COMPLETED'
                                ? 'bg-emerald-600 shadow-xs'
                                : step.status === 'IN_PROGRESS'
                                ? 'bg-indigo-600 ring-4 ring-indigo-100 animate-pulse'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {step.status === 'COMPLETED' ? '✓' : sIdx + 1}
                          </div>
                          <div className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-900 text-xs">{step.title}</span>
                              <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5">{step.description}</p>
                            <span className="inline-block mt-1.5 text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                              📍 {step.location}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Courier Website Tracking Link */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <a
                    href={
                      trackModalOrder.courier?.toLowerCase().includes('pathao')
                        ? `https://pathao.com/courier/`
                        : `https://steadfast.com.bd/t/${trackModalOrder.trackingCode}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                  >
                    <span>কুরিয়ারের অফিশিয়াল পোর্টালে দেখুন</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setTrackModalOrder(null)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {/* ============================================================== */}
        {/* MODAL: CORPORATE A4 CASH MEMO & TAX INVOICE (মূসক ৬.৩) */}
        {/* ============================================================== */}
        {selectedA4Invoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
              {/* Top Controls Bar - Hidden on Print */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold">
                    Official Corporate Cash Memo & A4 Tax Invoice (ক্যাশ মেমো)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট A4 মেমো</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedA4Invoice(null)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Printable A4 Document Body */}
              <div className="p-8 sm:p-12 bg-white text-slate-900 font-sans text-xs space-y-6">
                {/* Header with Logo & Merchant Trade Details */}
                <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 gap-4">
                  <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-slate-950">
                      {tenantInfo?.name || 'SmartVolt Electrical & Automation'}
                    </h1>
                    <p className="text-[11px] font-semibold text-slate-600 mt-0.5">
                      Smart Home Automation, Energy Efficient Appliances & Industrial Gear
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-md">
                      {tenantInfo?.address || 'Nawabpur Road Electrical Market / Tejgaon Industrial Area, Dhaka-1208'}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-600 font-mono">
                      <span>BIN: 002918475-0101</span>
                      <span>•</span>
                      <span>Trade Lic: TRAD/DSCC/019284/2024</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="inline-block px-3 py-1 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider">
                      CASH MEMO / ক্যাশ মেমো
                    </div>
                    <div className="mt-2 text-xs font-mono">
                      <span className="text-slate-400 block text-[10px]">INVOICE NO:</span>
                      <strong className="text-slate-900 font-extrabold text-sm">
                        INV-{(selectedA4Invoice.orderNumber || '000').slice(-6).toUpperCase()}
                      </strong>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-600">
                      <span>Date: </span>
                      <strong>
                        {new Date(selectedA4Invoice.createdAt || Date.now()).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Bill To Customer Information & Order Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      CUSTOMER / BILL TO (গ্রাহক বিবরণী):
                    </span>
                    <div className="font-extrabold text-slate-900 text-sm">
                      {selectedA4Invoice.customerName}
                    </div>
                    <div className="font-mono text-slate-700 font-bold">
                      📞 {selectedA4Invoice.customerPhone}
                    </div>
                    <div className="text-slate-600 text-xs">
                      {selectedA4Invoice.shippingAddress}
                    </div>
                    <div className="font-bold text-slate-800 text-xs uppercase">
                      📍 {selectedA4Invoice.city}
                    </div>
                  </div>

                  <div className="space-y-1 sm:text-right">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      ORDER REFERENCE & LOGISTICS:
                    </span>
                    <div className="font-mono font-bold text-slate-900">
                      Order Ref: #{selectedA4Invoice.orderNumber}
                    </div>
                    <div className="text-xs text-slate-600">
                      Fulfillment: <strong>{selectedA4Invoice.courier || 'Steadfast Courier'}</strong>
                    </div>
                    {selectedA4Invoice.trackingCode && (
                      <div className="text-[11px] font-mono text-indigo-700">
                        Consignment: {selectedA4Invoice.trackingCode}
                      </div>
                    )}
                    <div className="pt-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Payment Mode: {selectedA4Invoice.paymentMethod || 'COD'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Itemized Products Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-3 text-center w-10">SL</th>
                        <th className="py-2.5 px-4">Item Description / Product Specification</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-center w-16">Qty</th>
                        <th className="py-2.5 px-4 text-right">Total (BDT)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedA4Invoice.items || []).map((it: any, idx: number) => {
                        const price = Number(it.price) || 0;
                        const qty = Number(it.quantity) || 1;
                        const lineTotal = price * qty;

                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3 text-center text-slate-500 font-mono font-bold">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-extrabold text-slate-900 block">
                                {it.title || it.itemTitle}
                              </span>
                              {it.variantTitle && (
                                <span className="text-[10px] font-medium text-slate-500">
                                  Variant: {it.variantTitle}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-slate-700">
                              ৳ {price.toLocaleString('en-BD')}
                            </td>
                            <td className="py-3 px-3 text-center font-bold font-mono text-slate-900">
                              {qty}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-black text-slate-900">
                              ৳ {lineTotal.toLocaleString('en-BD')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary & In Words */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      PAYMENT IN WORDS / টাকার পরিমাণ কথায়:
                    </span>
                    <p className="text-xs font-bold text-slate-800 italic">
                      Taka {Number(selectedA4Invoice.totalAmount || 0).toLocaleString('en-BD')} Only (ক্যাশ অন ডেলিভারি প্রযোজ্য)
                    </p>
                    <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed">
                      💡 <strong>ওয়ারেন্টি শর্তাবলী:</strong> পণ্যের অফিশিয়াল ওয়ারেন্টির জন্য ইনভয়েসটি সংরক্ষণ করুন। ডেলিভারির ৭ দিনের মধ্যে ত্রুটি থাকলে ব্র্যান্ড ওয়ারেন্টি পলিসি অনুসারে রিপ্লেসমেন্ট প্রদান করা হবে।
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal (আইটেম মূল্য):</span>
                      <span className="font-mono font-bold">
                        ৳ {(Number(selectedA4Invoice.totalAmount || 0) - Number(selectedA4Invoice.deliveryCharge || 60)).toLocaleString('en-BD')}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Delivery / Shipping ({selectedA4Invoice.city}):</span>
                      <span className="font-mono font-bold">৳ {selectedA4Invoice.deliveryCharge || 60}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>VAT / Tax (Retail Included):</span>
                      <span className="font-mono font-bold">৳ 0.00</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                      <span>Grand Total / মোট প্রদেয়:</span>
                      <span className="font-mono text-rose-600 font-black text-lg">
                        ৳ {Number(selectedA4Invoice.totalAmount || 0).toLocaleString('en-BD')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Signatures & Seal */}
                <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-200 text-center">
                  <div>
                    <div className="w-36 mx-auto border-b border-slate-400 mb-1" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Customer Signature / সিলমোহর
                    </span>
                  </div>
                  <div>
                    <div className="w-36 mx-auto border-b border-slate-400 mb-1" />
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider block">
                      Authorized Signatory (SmartVolt)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL: 80MM / 58MM COMPACT THERMAL POS RECEIPT (পিওএস স্লিপ) */}
        {/* ============================================================== */}
        {selectedPosReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
              {/* Top Controls Bar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">80mm Thermal POS Slip</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs transition flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট স্লিপ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPosReceipt(null)}
                    className="w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 80mm Thermal Receipt Layout Container */}
              <div className="p-6 bg-white font-mono text-xs text-slate-900 space-y-3 select-none">
                {/* Store Branding Header */}
                <div className="text-center space-y-1">
                  <div className="font-black text-base uppercase tracking-tight text-slate-950">
                    *** {tenantInfo?.name || 'SMARTVOLT'} ***
                  </div>
                  <p className="text-[10px] text-slate-600 leading-tight">
                    {tenantInfo?.address || 'Tejgaon Industrial Area, Dhaka'}
                  </p>
                  <p className="text-[10px] font-bold">
                    Hotline: {whatsappNumber || '09606 111 777'}
                  </p>
                  <div className="border-t border-dashed border-slate-400 pt-1 text-[10px] text-slate-500 flex justify-between">
                    <span>POS Terminal: #01</span>
                    <span>Admin: Cashier</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="border-y border-dashed border-slate-400 py-1.5 text-[10px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>INV NO:</span>
                    <strong className="font-bold">INV-{(selectedPosReceipt.orderNumber || '000').slice(-6).toUpperCase()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>ORDER:</span>
                    <span>#{selectedPosReceipt.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DATE:</span>
                    <span>{new Date(selectedPosReceipt.createdAt || Date.now()).toLocaleDateString('en-GB')} {new Date(selectedPosReceipt.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CUSTOMER:</span>
                    <strong className="truncate max-w-[150px]">{selectedPosReceipt.customerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>PHONE:</span>
                    <span>{selectedPosReceipt.customerPhone}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between font-bold border-b border-dashed border-slate-300 pb-1 text-[10px]">
                    <span>ITEM / QTY</span>
                    <span>PRICE</span>
                  </div>
                  {(selectedPosReceipt.items || []).map((it: any, idx: number) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="font-bold text-slate-950 truncate">
                        {it.title || it.itemTitle}
                      </div>
                      <div className="flex justify-between text-slate-600 text-[10px]">
                        <span>{it.quantity || 1} x ৳ {Number(it.price || 0).toLocaleString('en-BD')}</span>
                        <span className="font-bold text-slate-900">
                          ৳ {(Number(it.price || 0) * Number(it.quantity || 1)).toLocaleString('en-BD')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Calculations */}
                <div className="border-t border-dashed border-slate-400 pt-2 space-y-1 text-xs">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>SUBTOTAL:</span>
                    <span>৳ {(Number(selectedPosReceipt.totalAmount || 0) - Number(selectedPosReceipt.deliveryCharge || 60)).toLocaleString('en-BD')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>DELIVERY:</span>
                    <span>৳ {selectedPosReceipt.deliveryCharge || 60}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-1 border-t border-dashed border-slate-400 text-slate-950">
                    <span>TOTAL PAYABLE:</span>
                    <span>৳ {Number(selectedPosReceipt.totalAmount || 0).toLocaleString('en-BD')}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 pt-0.5">
                    <span>PAY METHOD:</span>
                    <strong className="uppercase">{selectedPosReceipt.paymentMethod || 'COD'}</strong>
                  </div>
                </div>

                {/* Barcode & Footer */}
                <div className="text-center pt-3 border-t border-dashed border-slate-400 space-y-1">
                  <div className="font-mono text-xl tracking-widest font-black text-slate-950">
                    |||| | ||| |||| | ||| |||
                  </div>
                  <div className="text-[9px] font-bold text-slate-600">
                    {selectedPosReceipt.orderNumber}
                  </div>
                  <p className="text-[10px] font-bold text-slate-800 pt-1">
                    Thank You For Your Business!
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Software by Flux SaaS Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {/* ============================================================== */}
        {/* MODAL: CUSTOMER PROFILE & ORDER HISTORY DRAWER */}
        {/* ============================================================== */}
        {selectedCustomerProfile && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0F1424] border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                    selectedCustomerProfile.tier === 'vip'
                      ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800/80'
                  }`}>
                    {selectedCustomerProfile.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">{selectedCustomerProfile.name}</h3>
                      {selectedCustomerProfile.tier === 'vip' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          👑 VIP High Spender
                        </span>
                      )}
                      {selectedCustomerProfile.isBlocked && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          🚫 COD Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedCustomerProfile.phone} • {selectedCustomerProfile.email} • {selectedCustomerProfile.district}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/880${selectedCustomerProfile.cleanPhone}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${selectedCustomerProfile.name}, SmartVolt ইলেকট্রনিক্স থেকে যোগাযোগ করছি।`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setSelectedCustomerProfile(null)}
                    className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* 4 Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">মোট অর্ডার</span>
                    <p className="text-xl font-black text-white font-mono mt-1">{selectedCustomerProfile.orderCount} টি</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">লাইফটাইম স্পেন্ড</span>
                    <p className="text-xl font-black text-emerald-400 font-mono mt-1">৳ {selectedCustomerProfile.totalSpent.toLocaleString('en-BD')}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">গড় অর্ডার মূল্য</span>
                    <p className="text-xl font-black text-indigo-400 font-mono mt-1">৳ {selectedCustomerProfile.avgOrderValue.toLocaleString('en-BD')}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">ডেলিভারি রেট</span>
                    <p className={`text-xl font-black font-mono mt-1 ${
                      selectedCustomerProfile.deliverySuccessRate >= 80 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {selectedCustomerProfile.deliverySuccessRate}%
                    </p>
                  </div>
                </div>

                {/* Risk Notice Banner */}
                {selectedCustomerProfile.isBlocked ? (
                  <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Ban className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>
                        <strong className="block text-white font-bold">এই কাস্টমারকে ব্লকলিস্টে রাখা হয়েছে:</strong>
                        <span>ফেক অর্ডার বা পার্সেল রিটার্নের কারণে এই নাম্বারে Cash on Delivery (COD) বন্ধ আছে।</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleUnblockCustomer(selectedCustomerProfile);
                        setSelectedCustomerProfile((prev: any) => ({ ...prev, isBlocked: false, tier: 'regular' }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap cursor-pointer transition shadow"
                    >
                      আনব্লক করুন
                    </button>
                  </div>
                ) : selectedCustomerProfile.deliverySuccessRate < 60 ? (
                  <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <strong className="block text-white font-bold">সতর্কতা — কুরিয়ার রিটার্ন ঝুঁকি:</strong>
                        <span>পূর্বে একাধিক পার্সেল রিসিভ না করে ফেরত পাঠিয়েছেন। ডেলিভারি কনফার্মেশনের জন্য কল করা জরুরি।</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleBlockCustomer({ customerPhone: selectedCustomerProfile.phone, customerName: selectedCustomerProfile.name }, 'High return risk');
                        setSelectedCustomerProfile((prev: any) => ({ ...prev, isBlocked: true, tier: 'blocked' }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold whitespace-nowrap cursor-pointer transition shadow"
                    >
                      COD ব্লক করুন
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      <strong className="text-white">বিশ্বস্ত ভেরিফাইড ক্রেতা:</strong> ১০০% সফল ডেলিভারি রেকর্ড। দ্রুত ও অগ্রাধিকার ভিত্তিতে পার্সেল ডিসপ্যাচ করা নিরাপদ।
                    </span>
                  </div>
                )}

                {/* Shipping & Delivery Info */}
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    শিপিং ও ডেলিভারি বিবরণ
                  </h4>
                  <p className="text-xs text-slate-300">{selectedCustomerProfile.address}</p>
                  <div className="flex gap-4 mt-2 text-[11px] text-slate-400">
                    <span>জেলা: <strong className="text-slate-200">{selectedCustomerProfile.district}</strong></span>
                    <span>মোবাইল: <strong className="text-slate-200">{selectedCustomerProfile.phone}</strong></span>
                  </div>
                </div>

                {/* Admin Internal Notes */}
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Save className="w-4 h-4 text-amber-400" />
                      অ্যাডমিন অভ্যন্তরীণ নোট (Internal Note)
                    </h4>
                    <span className="text-[10px] text-slate-500">শুধুমাত্র অ্যাডমিন দেখতে পাবে</span>
                  </div>
                  <textarea
                    rows={2}
                    value={customerNotesMap[selectedCustomerProfile.id] ?? selectedCustomerProfile.adminNotes}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomerNotesMap((prev) => ({ ...prev, [selectedCustomerProfile.id]: val }));
                    }}
                    placeholder="এই গ্রাহক সম্পর্কে বিশেষ নোট লিখুন (যেমন: কল করে কনফার্ম করার পর ডেলিভারি পাঠাবেন)..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Past Orders List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    অর্ডার হিস্ট্রি ({(selectedCustomerProfile.orders || []).length} টি অর্ডার)
                  </h4>
                  <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
                    {(selectedCustomerProfile.orders || []).map((ord: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-slate-900/40 hover:bg-slate-900/80 transition flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-xs">{ord.orderNumber || ord.id}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                                : ord.orderStatus === 'CANCELLED'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800/80'
                                : 'bg-blue-950 text-blue-300 border border-blue-800/80'
                            }`}>
                              {ord.orderStatus}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase">{ord.paymentMethod || 'COD'}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {(ord.items || []).map((it: any) => `${it.title || it.itemTitle} (${it.quantity || 1}x)`).join(', ') || 'Smart Home Electronics'}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-white text-xs">
                            ৳ {Number(ord.totalAmount || 0).toLocaleString('en-BD')}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  গ্রাহক আইডি: <span className="font-mono text-slate-300">{selectedCustomerProfile.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomerProfile(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        </main>
      </div>
    </div>
  );
}

export default function TenantAdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-slate-500">Loading Merchant Portal...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
