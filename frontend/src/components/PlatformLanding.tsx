'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BUSINESS_CATEGORIES, BusinessCategoryDefinition } from '@/lib/categories';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Layers,
  Store,
  Zap,
  Globe,
  Clock,
  Mail,
  Sliders,
  DollarSign,
  Search,
  ChevronRight,
  Lock,
  Headphones,
} from 'lucide-react';

export function PlatformLanding() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'retail' | 'services' | 'food' | 'real_estate' | 'professional'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = BUSINESS_CATEGORIES.filter((cat) => {
    const matchesFilter = selectedFilter === 'all' || cat.group === selectedFilter;
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Platform Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
              NX
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block">NexStore Engine</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Multi-Tenant SaaS Operating System</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#categories" className="hover:text-rose-400 transition">Industry Templates</a>
            <a href="#demos" className="hover:text-rose-400 transition">Live Demos</a>
            <a href="#features" className="hover:text-rose-400 transition">Architecture</a>
            <a href="#pricing" className="hover:text-rose-400 transition">Pricing Plans</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold shadow-lg shadow-rose-600/25 flex items-center gap-2 transition active:scale-95"
            >
              <span>Create Store Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-slate-800/80 bg-radial-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(225,29,72,0.15),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-rose-500/10 border border-rose-500/30 text-rose-300 mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Unified SaaS Engine • 34+ Industry Archetypes Supported</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            Launch Your High-Converting <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400">
              Online Store, Clinic or Agency
            </span>{' '}
            in 2 Minutes
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Provision custom subdomains, category-specific database templates, automated official welcome emails, 1-hour appointment booking slots, and a full merchant control dashboard.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-2xl shadow-rose-600/40 flex items-center justify-center gap-2.5 transition active:scale-95"
            >
              <span>Deploy Your Store Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#demos"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 shadow-md flex items-center justify-center gap-2 transition"
            >
              <span>Explore Live Store Demos</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Trust Metric Badges */}
          <div className="mt-16 pt-10 border-t border-slate-800/60 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">34+</span>
              <span className="text-xs text-slate-400 mt-1 block">Industry Templates</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">&lt; 2 Mins</span>
              <span className="text-xs text-slate-400 mt-1 block">Instant Auto-Provisioning</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">100% Isolated</span>
              <span className="text-xs text-slate-400 mt-1 block">Multi-Tenant Databases</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white block">Official Email</span>
              <span className="text-xs text-slate-400 mt-1 block">Automated Credential Dispatch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demos Section */}
      <section id="demos" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-rose-500">Live Demonstrations</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience Real Working Multi-Tenant Stores
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Click any active tenant below to preview real storefronts, booking systems, and checkout workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Demo 1: Arban Property */}
          <div className="group rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Real Estate & Luxury Villa
                </span>
                <span className="text-xs font-mono text-slate-500">aebanproperty</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition">Arban Property</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lead generation archetype showcasing Huntleigh Country Estate ($5.5M), high-resolution gallery, legal clearance badges, and private inquiry booking.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                href="/?tenant=aebanproperty"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
              >
                <span>Launch Live Storefront</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/dashboard?tenant=aebanproperty"
                className="text-xs text-slate-400 hover:text-white"
              >
                Admin Panel &rarr;
              </Link>
            </div>
          </div>

          {/* Demo 2: Best Laptop Gallery */}
          <div className="group rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Laptops & Electronics
                </span>
                <span className="text-xs font-mono text-slate-500">bestlaptop</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition">Best Laptop Gallery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full physical retail catalog with 5 live laptop models (Surface Copilot+ PC, ThinkPad, MacBook Air, Dell Latitude), warranty badges, and cart checkout.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                href="/?tenant=bestlaptop"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
              >
                <span>Launch Live Storefront</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/dashboard?tenant=bestlaptop"
                className="text-xs text-slate-400 hover:text-white"
              >
                Admin Panel &rarr;
              </Link>
            </div>
          </div>

          {/* Demo 3: MediCare Specialized Clinic */}
          <div className="group rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Healthcare & Clinic
                </span>
                <span className="text-xs font-mono text-slate-500">medicare</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">MediCare Health Clinic</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Service appointment engine featuring 1-hour time slot booking, dental consultations, printable daily appointment sheets, and SMS confirmation notifications.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
              <Link
                href="/?tenant=medicare"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
              >
                <span>Launch Live Storefront</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/dashboard?tenant=medicare"
                className="text-xs text-slate-400 hover:text-white"
              >
                Admin Panel &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Categories Grid Section */}
      <section id="categories" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-rose-500">Universal Catalog Support</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pre-Configured for 34+ Specific Industries
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Each industry template comes equipped with its own default categories, schema fields, sample items, and enabled business modules.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search industries (e.g. Mobile, Doctor)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 'retail', 'services', 'food', 'real_estate', 'professional'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                selectedFilter === tab
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab === 'real_estate' ? 'Real Estate' : tab === 'all' ? 'All (34+ Categories)' : tab}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 group-hover:text-rose-400 transition">
                    {cat.archetype.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {cat.defaultCategories.length} Categories
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition">
                  {cat.name}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {cat.shortDesc}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">Default Setup:</span>
                  <div className="flex flex-wrap gap-1">
                    {cat.defaultCategories.slice(0, 3).map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {c}
                      </span>
                    ))}
                    {cat.defaultCategories.length > 3 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-500">
                        +{cat.defaultCategories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link
                  href={`/?category=${cat.id}`}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 transition"
                >
                  <span>Open Store</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <Link
                  href={`/register?category=${cat.id}`}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-xl border border-rose-500/30 transition"
                >
                  <span>Deploy</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-rose-500">Core Engine Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for High-Growth Multi-Tenant Scalability
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything your merchants need to sell products, manage appointments, and comply with e-commerce regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Subdomains & Custom Domains</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every tenant gets an instant automated subdomain (e.g. store.platform.com) and full support for custom branded root domains with automated SSL.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Official Welcome Email Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon registration, the merchant instantly receives an official system email containing their store URLs, administrative credentials, and setup instructions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1-Hour Time Slot Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ideal for clinics, salons, coaching centers, and consultants. Enforces time-slot booking with live capacity tracking and printable daily appointment manifests.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">72-Hour Dispute System</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built-in consumer protection and e-commerce compliance. Customers can file disputes, track resolutions, and request refunds with guaranteed 72-hour turnaround.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Merchant Admin Panel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tenants can add, rename, and delete categories, update product prices, manage stock levels, view invoices, and toggle module switches in real time.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Central Super-Admin Command</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform owners have bird's-eye visibility over gross merchandise value (GMV), tenant health metrics, instant store status toggles, and server resource telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-b border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-rose-500">Transparent Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Simple, Transparent Plans for Every Business
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Start free for 14 days. Scale as your business and customer volume grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Starter Trial</h3>
              <p className="text-xs text-slate-400">Perfect for exploring templates and launching your first digital catalog.</p>
              <div className="py-4">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">/ 14 days free</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Free Subdomain</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Up to 50 Products or Services</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Standard Checkout & Booking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Official Email Credentials</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Business Plan */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-rose-950/30 via-slate-900 to-slate-900 border-2 border-rose-500/80 shadow-2xl shadow-rose-950/50 flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
              Most Popular
            </span>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Pro Merchant</h3>
              <p className="text-xs text-slate-400">For active retail stores, busy clinics, agencies, and restaurants.</p>
              <div className="py-4">
                <span className="text-4xl font-black text-white">$29</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-400" /> Custom Domain Mapping</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-400" /> Unlimited Products & Bookings</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-400" /> 1-Hour Time Slot Engine</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-400" /> 72-Hour Dispute System</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-rose-400" /> Daily Manifest Sheet Printing</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs text-center shadow-lg shadow-rose-600/30 transition active:scale-95"
            >
              Launch Pro Store
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Enterprise & Multi-Chain</h3>
              <p className="text-xs text-slate-400">For developers, large healthcare networks, and corporate brands.</p>
              <div className="py-4">
                <span className="text-4xl font-black text-white">$99</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multiple Storefront Sub-Tenants</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated Database Isolation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> High-Throughput Redis Cache</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 Priority SLA Support</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition"
            >
              Contact Enterprise
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Footer */}
      <footer className="py-12 border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white">
              NX
            </div>
            <span>&copy; {new Date().getFullYear()} NexStore SaaS Engine. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition">Merchant Sign In</Link>
            <Link href="/register" className="hover:text-white transition">Register Store</Link>
            <Link href="/super-admin" className="text-rose-400 hover:underline font-semibold">⚡ Central Super-Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
