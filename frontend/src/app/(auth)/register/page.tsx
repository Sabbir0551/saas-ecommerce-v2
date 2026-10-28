'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BUSINESS_CATEGORIES, BusinessCategoryDefinition } from '@/lib/categories';
import { api } from '@/lib/api';
import {
  Store,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Building2,
  ShoppingBag,
  Stethoscope,
  Briefcase,
  UtensilsCrossed,
  Zap,
  Laptop,
  Smartphone,
  Watch,
  Shirt,
  Trees,
  Pill,
  Plane,
  Droplet,
  Scissors,
  Dog,
  FileCode,
  GraduationCap,
  Check,
  Tag,
  Shield,
  Clock,
  Package,
  BadgeCheck,
  Star,
  Plus,
} from 'lucide-react';

const CLUSTERS = [
  { id: 'all', label: 'All Industries', icon: Layers },
  { id: 'tech', label: 'Tech & Electrical', icon: Zap },
  { id: 'fashion', label: 'Fashion & Luxury', icon: ShoppingBag },
  { id: 'health', label: 'Healthcare & Clinical', icon: Stethoscope },
  { id: 'home_agro', label: 'Home, Agro & Living', icon: Trees },
  { id: 'real_estate', label: 'Real Estate & Land', icon: Building2 },
  { id: 'food', label: 'Restaurant & Food', icon: UtensilsCrossed },
  { id: 'professional', label: 'Digital & Professional', icon: Briefcase },
];

const CLUSTER_MAP: Record<string, string[]> = {
  tech: ['mobile_store', 'laptop_computers', 'electronics'],
  fashion: ['fashion_clothing', 'jewelry', 'luxury_watches'],
  health: ['healthcare_service', 'pharmacy_medicine', 'barber_salon'],
  home_agro: ['furniture_decor', 'water_treatment', 'agro_farm', 'plant_nursery', 'pet_care'],
  real_estate: ['real_estate'],
  food: ['restaurant_food'],
  professional: ['digital_products', 'marketing_agency', 'coaching_education', 'consultant_portfolio', 'travel_agency'],
};

function getCategoryIcon(iconName: string, className = "w-5 h-5") {
  switch (iconName) {
    case 'Zap': return <Zap className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Watch': return <Watch className={className} />;
    case 'Shirt': return <Shirt className={className} />;
    case 'Pill': return <Pill className={className} />;
    case 'Plane': return <Plane className={className} />;
    case 'Droplet': return <Droplet className={className} />;
    case 'UtensilsCrossed': return <UtensilsCrossed className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Stethoscope': return <Stethoscope className={className} />;
    case 'Scissors': return <Scissors className={className} />;
    case 'Dog':
    case 'PawPrint': return <Dog className={className} />;
    case 'Trees': return <Trees className={className} />;
    case 'FileCode':
    case 'Code2': return <FileCode className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    default: return <ShoppingBag className={className} />;
  }
}

function RegisterWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [storeName, setStoreName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  
  // Initialize with URL param if user clicked Deploy on landing page
  const initialCategory = searchParams.get('category') || 'electronics';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  
  // Sub-categories interactive selection state
  const initialCategoryDef = BUSINESS_CATEGORIES.find((c) => c.id === initialCategory) || BUSINESS_CATEGORIES[0];
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(initialCategoryDef.defaultCategories);
  const [primarySubcategory, setPrimarySubcategory] = useState<string>(initialCategoryDef.defaultCategories[0] || '');
  const [customSubcategoryInput, setCustomSubcategoryInput] = useState('');

  const [categorySearch, setCategorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tech' | 'fashion' | 'health' | 'home_agro' | 'real_estate' | 'food' | 'professional'>('all');

  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredResult, setRegisteredResult] = useState<any>(null);

  // Auto-generate subdomain from store name
  const handleStoreNameChange = (val: string) => {
    setStoreName(val);
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '');
    setSubdomain(slug);
  };

  const getFilteredList = (filterKey: string, searchKey: string) => {
    return BUSINESS_CATEGORIES.filter((cat) => {
      const q = searchKey.toLowerCase().trim();
      const matchesSearch = !q || 
        cat.name.toLowerCase().includes(q) ||
        cat.shortDesc.toLowerCase().includes(q) ||
        cat.badge.toLowerCase().includes(q) ||
        cat.keywords?.some((k) => k.toLowerCase().includes(q)) ||
        cat.popularBrands?.some((b) => b.toLowerCase().includes(q)) ||
        cat.defaultCategories.some((c) => c.toLowerCase().includes(q));

      let matchesFilter = true;
      if (filterKey !== 'all' && CLUSTER_MAP[filterKey]) {
        matchesFilter = CLUSTER_MAP[filterKey].includes(cat.id);
      }

      return matchesSearch && matchesFilter;
    });
  };

  const filteredCategories = getFilteredList(categoryFilter, categorySearch);
  const activeCategoryDef = BUSINESS_CATEGORIES.find((c) => c.id === selectedCategory) || BUSINESS_CATEGORIES[0];

  // Category select handler: updates selectedCategory and resets subcategories to this archetype's defaults
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    const def = BUSINESS_CATEGORIES.find((c) => c.id === catId);
    if (def) {
      setSelectedSubcategories(def.defaultCategories);
      setPrimarySubcategory(def.defaultCategories[0] || '');
    }
  };

  // Filter change handler: switches tab and automatically auto-selects the first category of that cluster
  const handleFilterChange = (filterId: any) => {
    setCategoryFilter(filterId);
    const nextList = getFilteredList(filterId, categorySearch);
    if (nextList.length > 0) {
      const isCurrentInList = nextList.some((c) => c.id === selectedCategory);
      if (!isCurrentInList) {
        handleSelectCategory(nextList[0].id);
      }
    }
  };

  // Sub-category toggles
  const toggleSubcategory = (subCat: string) => {
    setSelectedSubcategories((prev) => {
      if (prev.includes(subCat)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        const updated = prev.filter((s) => s !== subCat);
        if (primarySubcategory === subCat) {
          setPrimarySubcategory(updated[0] || '');
        }
        return updated;
      } else {
        return [...prev, subCat];
      }
    });
  };

  const handleSelectAllSubcategories = () => {
    setSelectedSubcategories(activeCategoryDef.defaultCategories);
    if (!primarySubcategory && activeCategoryDef.defaultCategories.length > 0) {
      setPrimarySubcategory(activeCategoryDef.defaultCategories[0]);
    }
  };

  const handleSetPrimary = (e: React.MouseEvent, subCat: string) => {
    e.stopPropagation();
    if (!selectedSubcategories.includes(subCat)) {
      setSelectedSubcategories((prev) => [...prev, subCat]);
    }
    setPrimarySubcategory(subCat);
  };

  const handleAddCustomSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSubcategoryInput.trim();
    if (trimmed && !selectedSubcategories.includes(trimmed)) {
      setSelectedSubcategories((prev) => [...prev, trimmed]);
      if (!primarySubcategory) {
        setPrimarySubcategory(trimmed);
      }
      setCustomSubcategoryInput('');
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !subdomain.trim()) {
      setErrorMessage('Please provide a store name and subdomain.');
      return;
    }
    if (selectedSubcategories.length === 0) {
      setErrorMessage('Please select at least one sub-category for your store.');
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-recover if browser autofilled email into phone input
    const resolvedEmail = email.trim() || (phone.includes('@') ? phone.trim() : '');
    const resolvedPhone = phone.includes('@') ? '' : phone.trim();
    const resolvedAdminName = adminName.trim() || `${storeName} Admin`;

    if (!resolvedEmail || !password.trim()) {
      setErrorMessage('Please provide an official email address and password for merchant login.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.registerTenant({
        name: storeName,
        subdomain,
        businessType: selectedCategory,
        subcategories: selectedSubcategories,
        primarySubcategory: primarySubcategory || selectedSubcategories[0] || null,
        adminName: resolvedAdminName,
        email: resolvedEmail,
        phone: resolvedPhone,
        password,
      });

      if (res?.success && res.data) {
        setRegisteredResult(res.data);
        setStep(3);
      } else {
        setErrorMessage(res?.message || 'Store registration failed. Please try again.');
      }
    } catch {
      setErrorMessage('Unable to connect to the central provisioning server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
            NX
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight block">NexStore SaaS Engine</span>
            <span className="text-[11px] text-slate-400 font-medium">Enterprise Multi-Tenant Operating System</span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-slate-400">Already registered a store?</span>
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition border border-slate-700"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Wizard Form Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12 w-full flex-1 flex flex-col justify-center">
        {/* Progress Tracker */}
        <div className="max-w-md mx-auto w-full mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
            
            <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
              step >= 1 ? 'bg-rose-600 text-white ring-4 ring-rose-600/20' : 'bg-slate-800 text-slate-400'
            }`}>
              1
            </div>

            <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
              step >= 2 ? 'bg-rose-600 text-white ring-4 ring-rose-600/20' : 'bg-slate-800 text-slate-400'
            }`}>
              2
            </div>

            <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
              step >= 3 ? 'bg-emerald-600 text-white ring-4 ring-emerald-600/20' : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </div>
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-1">
            <span className={step >= 1 ? 'text-rose-400 font-bold' : ''}>Store & Category</span>
            <span className={step >= 2 ? 'text-rose-400 font-bold' : ''}>Merchant Access</span>
            <span className={step >= 3 ? 'text-emerald-400 font-bold' : ''}>Live Activation</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Store Name & Category Selection */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-8 bg-slate-900/60 p-6 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-500">Step 1 of 3: Tailored Store Setup</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Name Your Store & Choose Exact Business Industry
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Each category pre-configures isolated database schemas, product categories, brand catalogs, and order workflows to match your specific industry.
              </p>
            </div>

            {/* Store Name & Subdomain Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Store / Business Name *</label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mejan Electric, Gulshan Fashion, MediCare Clinic"
                    value={storeName}
                    onChange={(e) => handleStoreNameChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Subdomain Identifier *</label>
                <div className="relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="mejanelectric"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full pl-10 pr-36 py-3 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 font-mono text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                  <span className="absolute right-3.5 text-xs text-slate-500 font-mono pointer-events-none">
                    .saasengine.com
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-mono flex items-center gap-1.5">
                  <span className="text-slate-400">Local URL:</span>
                  <span className="text-emerald-400 font-bold">http://localhost:3000/?tenant={subdomain || 'yourstore'}</span>
                </div>
              </div>
            </div>

            {/* Category Section Header & Controls */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-rose-500" />
                    <span>Select Business Industry Template</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                      {filteredCategories.length} Archetypes
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select your exact trade archetype below to view its live specification blueprint before deployment.
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by keyword (e.g. switch, doctor, ac, saree)..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition shadow-inner"
                  />
                </div>
              </div>

              {/* Industry Clusters / Group Filters */}
              <div className="flex flex-wrap gap-2 text-xs">
                {CLUSTERS.map((cluster) => {
                  const Icon = cluster.icon;
                  const isActive = categoryFilter === cluster.id;
                  const clusterCount = cluster.id === 'all' 
                    ? BUSINESS_CATEGORIES.length 
                    : (CLUSTER_MAP[cluster.id]?.length || 0);

                  return (
                    <button
                      key={cluster.id}
                      type="button"
                      onClick={() => handleFilterChange(cluster.id)}
                      className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-600/25 ring-2 ring-rose-500/50'
                          : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cluster.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-slate-900 text-slate-500'}`}>
                        {clusterCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* DUAL-PANE SELECTION: Grid of Categories + Live Blueprint Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                {/* Left: Category Cards Grid (7 Cols) */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredCategories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden ${
                          isSelected
                            ? 'bg-rose-950/20 border-rose-500 ring-2 ring-rose-500/40 shadow-xl shadow-rose-950/30'
                            : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90'
                        }`}
                        style={{ minHeight: '135px' }}
                      >
                        {isSelected && (
                          <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                            <div className="absolute transform rotate-45 bg-rose-600 text-white font-bold text-[9px] py-0.5 right-[-24px] top-[10px] w-[80px] text-center shadow-md">
                              SELECTED
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="flex items-start gap-3 mb-2">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-white group-hover:border-slate-700'
                            }`}>
                              {getCategoryIcon(cat.icon, 'w-4 h-4')}
                            </div>
                            <div className="pr-4">
                              <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition leading-snug">
                                {cat.name}
                              </h4>
                              <span className="text-[10px] text-slate-500 font-mono block">
                                {(cat.archetype || 'PHYSICAL_STORE').replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                            {cat.shortDesc}
                          </p>

                          {/* Sub-category tags snippet */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {cat.defaultCategories.slice(0, 3).map((sc, i) => (
                              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800/80">
                                {sc}
                              </span>
                            ))}
                            {cat.defaultCategories.length > 3 && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/60 text-slate-500 font-mono">
                                +{cat.defaultCategories.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono border border-slate-800">
                            {cat.defaultCategories.length} Sub-Categories
                          </span>
                          <span className={`font-semibold flex items-center gap-1 ${isSelected ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                            {isSelected ? 'Active Selection' : 'Click to Select'}
                            <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Interactive Industry Blueprint Panel (5 Cols) */}
                <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    {/* Selected Header */}
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                          {getCategoryIcon(activeCategoryDef.icon, 'w-6 h-6')}
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 block">
                            Blueprint Verification
                          </span>
                          <h3 className="text-base font-extrabold text-white leading-tight">
                            {activeCategoryDef.name}
                          </h3>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        Ready to Provision
                      </span>
                    </div>

                    {/* Engine Archetype Badge */}
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Engine Archetype:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {activeCategoryDef.archetype}
                      </span>
                    </div>

                    {/* INTERACTIVE SUB-CATEGORIES SECTION */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-rose-500" />
                            <span>Configure Sub-Categories ({selectedSubcategories.length})</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            শপে যে সাব-ক্যাটাগোরিগুলো রাখতে চান টিক দিন / ফোকাস সিলেক্ট করুন:
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleSelectAllSubcategories}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20"
                        >
                          Select All
                        </button>
                      </div>

                      {/* Clickable Sub-category Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {activeCategoryDef.defaultCategories.map((sub, i) => {
                          const isChecked = selectedSubcategories.includes(sub);
                          const isPrimary = primarySubcategory === sub;

                          return (
                            <div
                              key={i}
                              onClick={() => toggleSubcategory(sub)}
                              className={`group text-xs px-3 py-1.5 rounded-xl border cursor-pointer transition flex items-center gap-2 select-none ${
                                isChecked
                                  ? 'bg-slate-900 border-rose-500/60 text-white shadow-sm'
                                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] ${
                                isChecked ? 'bg-rose-600 text-white' : 'border border-slate-700'
                              }`}>
                                {isChecked && <CheckCircle2 className="w-3 h-3" />}
                              </div>

                              <span className="font-medium">{sub}</span>

                              {/* Star icon to toggle Primary Focus */}
                              <button
                                type="button"
                                title="Set as primary focus subcategory"
                                onClick={(e) => handleSetPrimary(e, sub)}
                                className={`p-0.5 rounded transition ${
                                  isPrimary
                                    ? 'text-amber-400 hover:text-amber-300'
                                    : 'text-slate-600 hover:text-amber-400 opacity-60 group-hover:opacity-100'
                                }`}
                              >
                                <Star className={`w-3 h-3 ${isPrimary ? 'fill-amber-400' : ''}`} />
                              </button>

                              {isPrimary && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">
                                  Primary
                                </span>
                              )}
                            </div>
                          );
                        })}

                        {/* Any custom added subcategories */}
                        {selectedSubcategories
                          .filter((s) => !activeCategoryDef.defaultCategories.includes(s))
                          .map((customSub, i) => (
                            <div
                              key={`custom_${i}`}
                              onClick={() => toggleSubcategory(customSub)}
                              className="text-xs px-3 py-1.5 rounded-xl border border-indigo-500/60 bg-indigo-950/30 text-indigo-200 flex items-center gap-2 cursor-pointer shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="font-medium">{customSub}</span>
                              <span className="text-[9px] px-1 rounded bg-indigo-500/20 text-indigo-300 font-mono">Custom</span>
                            </div>
                          ))}
                      </div>

                      {/* Add Custom Subcategory Input */}
                      <div className="pt-2 border-t border-slate-900 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="+ Add custom subcategory (e.g. Solar Panels)"
                          value={customSubcategoryInput}
                          onChange={(e) => setCustomSubcategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomSubcategory(e);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSubcategory}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Active Capabilities & Features */}
                    {activeCategoryDef.features && activeCategoryDef.features.length > 0 && (
                      <div>
                        <span className="text-[11px] font-bold text-slate-300 block mb-2">
                          Included Modules & Capabilities:
                        </span>
                        <div className="space-y-1.5">
                          {activeCategoryDef.features.map((feat, i) => (
                            <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Partner Brands */}
                    {activeCategoryDef.popularBrands && activeCategoryDef.popularBrands.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                          Default Partner Brands:
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {activeCategoryDef.popularBrands.join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Pre-Loaded Sample Item */}
                    {activeCategoryDef.sampleItems && activeCategoryDef.sampleItems[0] && (
                      <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center gap-3">
                        <img
                          src={activeCategoryDef.sampleItems[0].image}
                          alt="Sample Item"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="overflow-hidden">
                          <span className="text-[10px] text-slate-500 block font-semibold uppercase">Sample Merchandise:</span>
                          <span className="text-xs font-bold text-white block truncate">
                            {activeCategoryDef.sampleItems[0].title}
                          </span>
                          <span className="text-xs font-mono font-bold text-rose-400">
                            ৳{activeCategoryDef.sampleItems[0].price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTION BUTTONS IN BLUEPRINT PANEL */}
                  <div className="pt-4 border-t border-slate-800 space-y-2.5">
                    {/* Preview Live Demo Store Button */}
                    <a
                      href={`/?tenant=${activeCategoryDef.demoSlug || activeCategoryDef.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 group shadow-sm"
                    >
                      <Globe className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                      <span>Preview Live Demo Store (এই ক্যাটাগরির লাইভ শপ দেখুন)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    {/* Select This Shop & Continue Button */}
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                      <span>Select This Shop & Continue (এই শপ সিলেক্ট করে এগিয়ে যান)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] text-slate-500 block text-center">
                      Opens an active production storefront running this exact template with your selected subcategories.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1 Submit Button Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
              <div className="text-xs text-slate-400">
                Selected: <strong className="text-white">{activeCategoryDef.name}</strong> •{' '}
                <span className="text-rose-400 font-bold">{selectedSubcategories.length} Sub-Categories configured</span>
                {primarySubcategory && (
                  <span className="text-amber-400 ml-1 font-semibold">(Primary: {primarySubcategory})</span>
                )}
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <span>Continue to Merchant Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Merchant Account Credentials */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="max-w-2xl mx-auto w-full space-y-6 bg-slate-900/60 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-500">Step 2 of 3: Merchant Credentials</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Store Administrator Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Official store login credentials and dedicated tenant database keys will be dispatched to this email.
              </p>
            </div>

            {/* Selected Summary Card with Full Confirmation */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-900">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Deploying Store:</span>
                  <span className="text-base font-extrabold text-white block">{storeName}</span>
                  <span className="text-xs text-emerald-400 font-mono block">
                    Local Dev URL: http://localhost:3000/?tenant={subdomain}
                  </span>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Archetype Blueprint:</span>
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1 sm:justify-end">
                    {getCategoryIcon(activeCategoryDef.icon, 'w-3.5 h-3.5')}
                    {activeCategoryDef.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Engine: {activeCategoryDef.archetype}
                  </span>
                </div>
              </div>

              {/* Sub-Categories Chosen */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Configured Store Catalog Sub-Categories ({selectedSubcategories.length}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSubcategories.map((sub, i) => {
                    const isPrimary = primarySubcategory === sub;
                    return (
                      <span
                        key={i}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1 ${
                          isPrimary
                            ? 'bg-amber-400/10 border-amber-500/40 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        {isPrimary && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                        <span>{sub}</span>
                        {isPrimary && <span className="text-[9px] font-bold opacity-80">(Primary Focus)</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="adminName" className="block text-xs font-semibold text-slate-300 mb-2">Merchant Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="adminName"
                    name="adminName"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Mejan Rahman"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-2">Official Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="merchant@yourdomain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Your login URL, credentials, and verification keys will be emailed here.
                </span>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-300 mb-2">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+880 1700-000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition"
              >
                &larr; Back to Step 1
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-90 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Provisioning Store & Dispatching Email...' : 'Provision Store Now'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Instant Provisioning & Email Confirmation */}
        {step === 3 && registeredResult && (
          <div className="max-w-2xl mx-auto w-full bg-slate-900/80 p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Store Activated & Online</span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {registeredResult.name} is Live!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Your store has been auto-provisioned with the <strong>{activeCategoryDef.name}</strong> archetype engine.
              </p>
            </div>

            {/* Email Dispatch Notice */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Mail className="w-4 h-4" />
                <span>Official Welcome Email Dispatched</span>
              </div>
              <p className="text-xs text-slate-400">
                We sent your full administrative login credentials, store URLs, and onboarding guide to <strong>{email || registeredResult.email}</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div><span className="text-slate-500">Public Storefront:</span> {registeredResult.storeUrl}</div>
                <div><span className="text-slate-500">Merchant Admin Portal:</span> {registeredResult.adminUrl}</div>
                <div><span className="text-slate-500">Isolated Database:</span> {registeredResult.database?.dbName || ('tenant_' + subdomain)}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={registeredResult.storeUrl}
                target="_blank"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Launch Public Storefront</span>
                <ExternalLink className="w-4 h-4" />
              </Link>

              <Link
                href={registeredResult.adminUrl}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} NexStore SaaS Engine. All 34+ Industry Archetypes Supported with Isolated Multi-Tenancy.
      </footer>
    </div>
  );
}

export default function RegisterWizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-bold">Loading NexStore Provisioning Wizard...</div>}>
      <RegisterWizardContent />
    </Suspense>
  );
}
