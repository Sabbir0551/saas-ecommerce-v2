'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import {
  Search,
  User,
  Phone,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Building2,
  Laptop,
  Sparkles,
  Car,
  Package,
  Truck,
  ShieldCheck,
  Printer,
  ArrowRight,
  FileText,
  RotateCcw,
  RefreshCw,
  QrCode,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

function CustomerPortalContent() {
  const searchParams = useSearchParams();
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  const [tenant, setTenant] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'appointments' | 'tours' | 'orders' | 'warranty'>('all');
  const [searching, setSearching] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [exchangeItem, setExchangeItem] = useState<string | null>(null);
  const [exchangeMsg, setExchangeMsg] = useState(false);

  // Archetype Detection
  const bType = tenant?.businessType || (
    tenantSlug === 'medicare' || tenantSlug === 'meradenralcare' ? 'doctor' :
    tenantSlug === 'aebanproperty' ? 'real_estate' :
    tenantSlug === 'smartvolt' || tenantSlug === 'bestlaptop' || tenantSlug === 'gadgethub' ? 'laptop_computer' :
    'fashion_clothing'
  );

  const isMedical = bType === 'doctor' || bType === 'healthcare_service' || bType === 'pharmacy' || tenantSlug === 'medicare' || tenantSlug === 'meradenralcare';
  const isRealEstate = bType === 'real_estate' || tenantSlug === 'aebanproperty';
  const isElectronics = bType === 'laptop_computer' || bType === 'mobile_gadgets' || tenantSlug === 'smartvolt' || tenantSlug === 'bestlaptop' || tenantSlug === 'gadgethub';
  const isFashion = !isMedical && !isRealEstate && !isElectronics;

  useEffect(() => {
    async function loadTenant() {
      try {
        const tRes = await api.getTenant(tenantSlug);
        if (tRes?.success && tRes.data) setTenant(tRes.data);
      } catch {}
    }
    loadTenant();
  }, [tenantSlug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar tenantSlug={tenantSlug} storeName={tenant?.name || tenant?.settings?.name} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Hero Banner */}
        <div className={`p-8 rounded-3xl text-white shadow-xl relative overflow-hidden ${
          isMedical ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/60' :
          isRealEstate ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border border-amber-800/60' :
          isElectronics ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/60' :
          'bg-gradient-to-r from-pink-950 via-slate-900 to-rose-950 border border-pink-800/60'
        }`}>
          <div className="max-w-2xl space-y-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 border border-white/20 inline-flex items-center gap-1.5">
              {isMedical ? <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> :
               isRealEstate ? <Building2 className="w-3.5 h-3.5 text-amber-400" /> :
               isElectronics ? <Laptop className="w-3.5 h-3.5 text-indigo-400" /> :
               <Sparkles className="w-3.5 h-3.5 text-pink-400" />}
              <span>Customer Self-Service & Tracking Portal</span>
            </span>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              {isMedical ? 'Patient Records & Live Serial Queue' :
               isRealEstate ? 'VIP Private Site Tour & Reservation Dossier' :
               isElectronics ? 'Device Warranty Ledger & Order Tracking' :
               'Customer Wardrobe & Live Courier Tracking'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isMedical ? 'Check your serial token position in real-time, view digital prescriptions, and chamber schedules.' :
               isRealEstate ? 'Access your private chauffeur convoy gate pass, tour timetable, and assigned Relationship Manager.' :
               isElectronics ? 'Track your hardware courier dispatch and verify your official BTRC registered IMEI warranty validity.' :
               'Follow your designer garment fulfillment step-by-step with instant 7-day doorstep size exchange requests.'}
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearch} className="pt-2 flex items-center gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Enter Mobile Number (+880...) or Order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 backdrop-blur-md"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-md active:scale-95 shrink-0"
              >
                {searching ? 'Finding...' : 'Track Record'}
              </button>
            </form>
          </div>
        </div>

        {/* Portal Cluster Content */}
        {isMedical && (
          <div className="space-y-6">
            {/* Live Serial Queue Alert */}
            <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-600/30">
                  #07
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">Your Serial: Token #07</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                      Live Queue Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Currently serving Token #04 • Estimated call time in approx. <strong>20-25 mins</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100/60 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Serial Pass</span>
                </button>
                <Link
                  href={`/booking?tenant=${tenantSlug}`}
                  className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Book New Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Appointment Record Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <Stethoscope className="w-4 h-4" />
                  <span>Specialist Doctor & Chamber</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Dr. Anisur Rahman, FCPS</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Senior Consultant Dental & Maxillofacial Surgeon • BMDC Reg: A-49102
                </p>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Slot: <strong>10:00 AM - 11:00 AM</strong></span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Chamber: MediCare Mirpur Central Branch</span>
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>Registered Patient Dossier</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">Anisur Rahman</h3>
                <p className="text-xs text-slate-500">
                  Age: <strong>34 Years</strong> • Gender: <strong>Male</strong>
                </p>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p>Chief Complaints: <span className="font-medium text-slate-800">Tooth sensitivity & chewing pain</span></p>
                  <p>Prescription Status: <span className="text-emerald-700 font-bold">Attached & Reviewed</span></p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>Consultation Fee & Receipt</span>
                </div>
                <div className="text-2xl font-black text-slate-900">
                  BDT 1,000
                </div>
                <p className="text-xs text-slate-500">
                  Payment Mode: <strong>Pay at Chamber Reception</strong>
                </p>
                <div className="pt-2 border-t border-slate-100 text-xs text-emerald-700 font-medium">
                  ✓ Includes 14-day free medical follow-up
                </div>
              </div>
            </div>
          </div>
        )}

        {isRealEstate && (
          <div className="space-y-6">
            {/* VIP Tour Gate Pass Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-800/80">
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    VIP Chauffeur Convoy Gate Pass
                  </span>
                  <span className="text-xs font-mono text-slate-400">Pass Code: ARB-9021</span>
                </div>
                <h3 className="text-xl font-bold">Arban Luxury Heights & Penthouse Site Visit</h3>
                <p className="text-xs text-slate-300">
                  Scheduled for: <strong>Tomorrow, 11:00 AM</strong> • Pickup Hub: <strong>Gulshan-2 Circle Convoy Point (Near The Westin)</strong>
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-amber-300">
                  <span>Convoy Party: <strong>2 Persons</strong></span>
                  <span>•</span>
                  <span>Escort: <strong>Executive Relationship Director</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center shrink-0 w-full md:w-auto">
                <Car className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Chauffeur Status</span>
                <span className="text-xs font-black text-emerald-400 block mt-0.5">Assigned & On Schedule</span>
                <button
                  onClick={() => window.print()}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] transition shadow-md"
                >
                  Download VIP Gate Pass
                </button>
              </div>
            </div>

            {/* Reserved Property Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Selected Unit: Skyview Penthouse Duplex</span>
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Reserved for Inspection
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Bedrooms</span>
                    <strong className="text-slate-800 text-sm">4 Beds</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Bathrooms</span>
                    <strong className="text-slate-800 text-sm">5 Baths</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Total Area</span>
                    <strong className="text-slate-800 text-sm">4,500 Sqft</strong>
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Includes private infinity plunge pool, double-height living foyer, and 3 reserved basement car parks.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>Assigned Private Client Desk</span>
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>Relationship Manager: <strong className="text-slate-900">Barrister Shahriar Kabir</strong></p>
                  <p>Direct Private Mobile: <strong className="text-amber-700 font-mono">+880 1711-223344</strong></p>
                  <p>WhatsApp Concierge: <strong className="text-emerald-700 font-mono">+880 1819-009988</strong></p>
                </div>
                <div className="pt-2 flex gap-2">
                  <a
                    href="tel:+8801711223344"
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition"
                  >
                    Direct Call
                  </a>
                  <a
                    href="https://wa.me/8801819009988"
                    target="_blank"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition"
                  >
                    WhatsApp Dossier
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {isElectronics && (
          <div className="space-y-6">
            {/* IMEI Warranty Certificate Vault */}
            <div className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-base">National Hardware Warranty Certificate</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Device: <strong>Apple iPhone 16 Pro Max 256GB - Natural Titanium</strong>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>328 Days Warranty Remaining</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Registered IMEI</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">864920061298411</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">✓ BTRC Database Paired</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Warranty Coverage Tier</span>
                  <span className="font-bold text-slate-900 block">1-Year Official Manufacturer Care</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Parts & Motherboard Protected</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Service Center Support</span>
                  <span className="font-bold text-slate-900 block">All Official National Hubs</span>
                  <span className="text-[10px] text-indigo-600 block mt-0.5">Helpline: +880 9612-445566</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Warranty Slip</span>
                </button>
                <span className="text-[11px] text-slate-400">Dispatch Batch: SMARTVOLT-2026-DHAKA</span>
              </div>
            </div>
          </div>
        )}

        {isFashion && (
          <div className="space-y-6">
            {/* Fashion Order Dispatch & 7-Day Size Exchange */}
            <div className="p-6 rounded-3xl bg-white border border-pink-200 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-600" />
                    <h3 className="font-bold text-slate-900 text-base">Signature Boutique Order & Dispatch</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Item: <strong>Handcrafted Jamdani Silk Designer Kurti (Size M)</strong>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-800 border border-pink-200 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-pink-600" />
                  <span>Out for Delivery (Rider: Shakil +88017228833)</span>
                </span>
              </div>

              {/* Transit Timeline */}
              <div className="relative flex items-center justify-between max-w-xl mx-auto py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">✓</div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">Order Placed</span>
                </div>
                <div className="flex-1 h-1 bg-emerald-500 mx-2" />
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-md">✓</div>
                  <span className="text-[11px] font-bold text-slate-800 mt-1">Quality Check</span>
                </div>
                <div className="flex-1 h-1 bg-pink-500 mx-2 animate-pulse" />
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xs shadow-md">3</div>
                  <span className="text-[11px] font-bold text-pink-700 mt-1">In Transit</span>
                </div>
                <div className="flex-1 h-1 bg-slate-200 mx-2" />
                <div className="flex flex-col items-center text-center">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs">4</div>
                  <span className="text-[11px] text-slate-400 mt-1">Doorstep Delivered</span>
                </div>
              </div>

              {/* 7-Day Size Exchange Guard Box */}
              <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <RotateCcw className="w-4 h-4 text-pink-600" />
                    <span>7-Day Doorstep Size Exchange Policy Active</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    If the size doesn&apos;t fit perfectly, request a free doorstep size swap (S/M/L/XL/XXL) within 7 days.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setExchangeItem('Handcrafted Jamdani Silk Designer Kurti');
                    setExchangeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition shadow-md shadow-pink-600/20 shrink-0"
                >
                  Request Size Swap
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exchange Modal */}
        {exchangeModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="font-bold text-slate-900 text-base">Request Doorstep Size Swap</h4>
                <button onClick={() => setExchangeModalOpen(false)} className="text-slate-400 hover:text-slate-800 text-sm">✕</button>
              </div>

              {exchangeMsg ? (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Size exchange scheduled! Our courier will deliver your replacement and collect the original.</span>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <p className="text-slate-600">
                    Select your desired replacement size for <strong>{exchangeItem}</strong>:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {['S', 'M', 'L', 'XL'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="py-2 rounded-xl border border-slate-300 font-bold hover:bg-pink-50 hover:border-pink-500 hover:text-pink-600 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setExchangeMsg(true);
                      setTimeout(() => {
                        setExchangeModalOpen(false);
                        setExchangeMsg(false);
                      }, 2000);
                    }}
                    className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold transition shadow-md shadow-pink-600/20"
                  >
                    Submit Exchange Request
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer
        tenantSlug={tenantSlug}
        storeName={tenant?.name}
        phone={tenant?.phone}
        email={tenant?.email}
        address={tenant?.address}
      />
    </div>
  );
}

export default function CustomerPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading Customer Portal...</div>}>
      <CustomerPortalContent />
    </Suspense>
  );
}
