'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';

function RegisterWizardContent() {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [storeName, setStoreName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('fashion_clothing');
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'retail' | 'services' | 'food' | 'real_estate' | 'professional'>('all');

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

  const filteredCategories = BUSINESS_CATEGORIES.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      cat.shortDesc.toLowerCase().includes(categorySearch.toLowerCase());
    const matchesFilter = categoryFilter === 'all' || cat.group === categoryFilter;
    return matchesSearch && matchesFilter;
  });

  const activeCategoryDef = BUSINESS_CATEGORIES.find((c) => c.id === selectedCategory) || BUSINESS_CATEGORIES[0];

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim() || !subdomain.trim()) {
      setErrorMessage('Please provide a store name and subdomain.');
      return;
    }
    setErrorMessage(null);
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill out all required merchant credentials.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.registerTenant({
        name: storeName,
        subdomain,
        businessType: selectedCategory,
        adminName,
        email,
        phone,
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-rose-600/30">
            NX
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-tight block">NexStore SaaS Engine</span>
            <span className="text-[11px] text-slate-400 font-medium">Enterprise Multi-Tenant Operating System</span>
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-slate-400">Already have a store?</span>
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition border border-slate-700"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Wizard Form Container */}
      <main className="max-w-5xl mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        {/* Progress Tracker */}
        <div className="max-w-md mx-auto w-full mb-10">
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
          <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-2 px-1">
            <span>Store & Category</span>
            <span>Merchant Access</span>
            <span>Live Activation</span>
          </div>
        </div>

        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Store Name & Category Selection */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="max-w-4xl mx-auto w-full space-y-8 bg-slate-900/60 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-500">Step 1 of 3</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Name Your Store & Choose Industry
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Your store will be instantly auto-configured with tailored categories, templates, and schema for your industry.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Store / Business Name *</label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Gadget Express, Royal Bridal House"
                    value={storeName}
                    onChange={(e) => handleStoreNameChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Subdomain URL *</label>
                <div className="relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="mystore"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="w-full pl-10 pr-36 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-rose-400 font-mono text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                  <span className="absolute right-3.5 text-xs text-slate-500 font-mono pointer-events-none">
                    .saasengine.com
                  </span>
                </div>
              </div>
            </div>

            {/* Category Explorer */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-rose-500" />
                    Select Business Industry Template
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pre-configures database tables, 1-hour appointment slots, or product catalogs.
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search 34+ categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 text-xs">
                {(['all', 'retail', 'services', 'food', 'real_estate', 'professional'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setCategoryFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg font-medium capitalize transition ${
                      categoryFilter === filter
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {filter === 'real_estate' ? 'Real Estate' : filter}
                  </button>
                ))}
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1 pr-2 custom-scrollbar">
                {filteredCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-rose-600/10 border-rose-500 ring-2 ring-rose-500/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-white line-clamp-1">{cat.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {cat.shortDesc}
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase">
                        <span>{cat.archetype.replace('_', ' ')}</span>
                        <span className="text-rose-400">{cat.defaultCategories.length} Categories</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 transition active:scale-95"
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
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-500">Step 2 of 3</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Store Administrator Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Official store login credentials will be dispatched to this email from our official system.
              </p>
            </div>

            {/* Selected Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Deploying Store:</span>
                <span className="text-sm font-bold text-white">{storeName}</span>
                <span className="text-xs text-rose-400 font-mono block mt-0.5">{subdomain}.saasengine.com</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Selected Template:</span>
                <span className="text-xs font-bold text-emerald-400">{activeCategoryDef.name}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Merchant Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Vance"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Official Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="merchant@yourdomain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
                <span className="text-[11px] text-slate-500 block mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Your login URL, credentials, and verification keys will be emailed here.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-1122"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-rose-500 transition"
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
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Store Activated</span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {registeredResult.name} is Live!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Your store has been auto-provisioned with the <strong>{registeredResult.businessType}</strong> schema.
              </p>
            </div>

            {/* Email Dispatch Notice */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Mail className="w-4 h-4" />
                <span>Official Welcome Email Dispatched</span>
              </div>
              <p className="text-xs text-slate-400">
                We sent your full administrative login credentials, store URLs, and onboarding guide to <strong>{email}</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div><span className="text-slate-500">Store URL:</span> {registeredResult.storeUrl}</div>
                <div><span className="text-slate-500">Admin Dashboard:</span> {registeredResult.adminUrl}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={registeredResult.adminUrl}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span>Open Store Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={registeredResult.storeUrl}
                target="_blank"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} NexStore SaaS Engine. All 34+ Industry Archetypes Supported.
      </footer>
    </div>
  );
}

export default function RegisterWizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading provisioning wizard...</div>}>
      <RegisterWizardContent />
    </Suspense>
  );
}
