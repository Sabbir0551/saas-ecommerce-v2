'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BUSINESS_CATEGORIES } from '@/lib/categories';
import {
  ShieldAlert,
  Server,
  Database,
  Cpu,
  Layers,
  Store,
  Users,
  ShoppingBag,
  DollarSign,
  Plus,
  ExternalLink,
  Power,
  CheckCircle2,
  AlertCircle,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Search,
  Sliders,
  CreditCard,
  Calendar,
  ShieldCheck,
  Check,
  FileText,
  Sparkles,
  Clock,
  Trash2,
  UserCheck,
  X,
  RefreshCw,
  Globe,
  Lock,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  Save,
  Printer,
} from 'lucide-react';
import SaaSInvoiceModal from '@/components/SaaSInvoiceModal';

const DEFAULT_MIGRATED_DATA = {
  stats: {
    totalTenants: 11,
    activeTenants: 11,
    totalOrders: 148,
    totalUsers: 52,
    platformGrossVolume: 585000,
  },
  tenants: [
    { id: 'aebanproperty', name: 'Arban Property', subdomain: 'aebanproperty', customDomain: 'aebanproperty.localhost', businessType: 'real_estate', isActive: true, createdAt: '2026-10-18T10:00:00Z', _count: { items: 1, orders: 2, users: 3 } },
    { id: 'armanfashion', name: 'Arman Fashion', subdomain: 'armanfashion', customDomain: 'armanfashion.localhost', businessType: 'fashion_clothing', isActive: true, createdAt: '2026-10-18T12:00:00Z', _count: { items: 8, orders: 15, users: 3 } },
    { id: 'artbd', name: 'Art BD', subdomain: 'artbd', customDomain: 'artbd.localhost', businessType: 'fashion_clothing', isActive: true, createdAt: '2026-10-18T14:00:00Z', _count: { items: 1, orders: 15, users: 3 } },
    { id: 'artfashion', name: 'Art Fashion', subdomain: 'artfashion', customDomain: 'artfashion.localhost', businessType: 'fashion_clothing', isActive: true, createdAt: '2026-10-18T15:00:00Z', _count: { items: 1, orders: 1, users: 3 } },
    { id: 'bestlaptop', name: 'Best Laptop Gallery', subdomain: 'bestlaptop', customDomain: 'bestlaptop.localhost', businessType: 'laptop_computer', isActive: true, createdAt: '2026-10-19T09:00:00Z', _count: { items: 5, orders: 15, users: 3 } },
    { id: 'gadgethub', name: 'Gadget Hub Bangladesh', subdomain: 'gadgethub', customDomain: 'gadgethub.localhost', businessType: 'mobile_gadgets', isActive: true, createdAt: '2026-10-19T11:00:00Z', _count: { items: 2, orders: 1, users: 3 } },
    { id: 'glamarbeauty', name: 'Glamar Beauty & Salon', subdomain: 'glamarbeauty', customDomain: 'glamarbeauty.localhost', businessType: 'barber_salon', isActive: true, createdAt: '2026-10-19T13:00:00Z', _count: { items: 1, orders: 15, users: 3 } },
    { id: 'medicare', name: 'MediCare Pharma & Health', subdomain: 'medicare', customDomain: 'medicare.localhost', businessType: 'pharmacy', isActive: true, createdAt: '2026-10-19T16:00:00Z', _count: { items: 2, orders: 15, users: 3 } },
    { id: 'meherhashion', name: 'Meher Fashion', subdomain: 'meherhashion', customDomain: 'meherhashion.localhost', businessType: 'fashion_clothing', isActive: true, createdAt: '2026-10-20T08:00:00Z', _count: { items: 1, orders: 15, users: 3 } },
    { id: 'meradenralcare', name: 'Mera Dental Care & Clinic', subdomain: 'meradenralcare', customDomain: 'meradenralcare.localhost', businessType: 'doctor', isActive: true, createdAt: '2026-10-20T09:00:00Z', _count: { items: 1, orders: 5, users: 3 } },
    { id: 'petshopbd', name: 'Pet Shop BD', subdomain: 'petshopbd', customDomain: 'petshopbd.localhost', businessType: 'pet_food', isActive: true, createdAt: '2026-10-20T10:00:00Z', _count: { items: 1, orders: 15, users: 3 } },
  ],
  systemHealth: {
    database: 'CONNECTED',
    databaseType: 'PostgreSQL',
    redis: 'IN_MEMORY_FALLBACK',
    uptimeSeconds: 3600,
    nodeVersion: 'v22.23.2',
    memoryUsageMB: 42,
  },
};

export const INDUSTRY_CLUSTERS = [
  { key: 'all', label: 'All Merchants', icon: '🌐' },
  { key: 'fashion', label: 'Fashion & Luxury', icon: '👗' },
  { key: 'tech', label: 'Tech & Electronics', icon: '⚡' },
  { key: 'healthcare', label: 'Healthcare & Clinic', icon: '🩺' },
  { key: 'real_estate', label: 'Real Estate & Land', icon: '🏢' },
  { key: 'retail', label: 'Specialty Retail', icon: '🛍️' },
];

export function getTenantClusterInfo(businessType: string) {
  const bt = (businessType || '').toLowerCase();
  if (bt.includes('health') || bt.includes('doctor') || bt.includes('pharm') || bt.includes('dental') || bt.includes('clinic')) {
    return {
      key: 'healthcare',
      label: 'Healthcare & Clinic',
      badge: 'DOCTOR & CLINIC',
      iconText: '🩺',
      colorClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
      pillClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      archetypeDesc: 'Doctor Serial Booking, Slot Scheduler & Prescription Upload',
      storeDemoSlug: 'medicare',
    };
  }
  if (bt.includes('real_estate') || bt.includes('property') || bt.includes('housing') || bt.includes('apartment') || bt.includes('land')) {
    return {
      key: 'real_estate',
      label: 'Real Estate & Property',
      badge: 'LUXURY PROPERTY',
      iconText: '🏢',
      colorClass: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
      pillClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      archetypeDesc: 'VIP Villa/Plot Showcase, Bed/Bath Specs & Convoy Tour Booking',
      storeDemoSlug: 'aebanproperty',
    };
  }
  if (bt.includes('fashion') || bt.includes('cloth') || bt.includes('boutique') || bt.includes('apparel') || bt.includes('beauty') || bt.includes('salon')) {
    return {
      key: 'fashion',
      label: 'Fashion & Boutique',
      badge: 'EDITORIAL BOUTIQUE',
      iconText: '👗',
      colorClass: 'bg-pink-950/80 text-pink-300 border-pink-800/80',
      pillClass: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      archetypeDesc: 'Editorial Lookbook, S/M/L/XL Size Grid & Swatch Quick View',
      storeDemoSlug: 'gulshanfashion',
    };
  }
  if (bt.includes('laptop') || bt.includes('mobile') || bt.includes('gadget') || bt.includes('tech') || bt.includes('computer')) {
    return {
      key: 'tech',
      label: 'Tech & Electronics',
      badge: 'TECH & HARDWARE POS',
      iconText: '⚡',
      colorClass: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/80',
      pillClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      archetypeDesc: 'IMEI / Serial Ledger, Tech Specifications & Warranty Claims',
      storeDemoSlug: 'smartvolt',
    };
  }
  return {
    key: 'retail',
    label: (businessType || 'Retail').replace(/_/g, ' '),
    badge: 'GENERAL RETAIL',
    iconText: '🛍️',
    colorClass: 'bg-sky-950/80 text-sky-300 border-sky-800/80',
    pillClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    archetypeDesc: 'Omnichannel Catalog, Live Stock Tracking & Express COD',
    storeDemoSlug: 'petshopbd',
  };
}

function SuperAdminContent() {
  const [data, setData] = useState<any>(DEFAULT_MIGRATED_DATA);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New tenant form state
  const [newStoreName, setNewStoreName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newBusinessType, setNewBusinessType] = useState('fashion_clothing');
  const [adminEmail, setAdminEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [modalMsg, setModalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Merchant Deep-Dive Modal State
  const [selectedMerchantSubdomain, setSelectedMerchantSubdomain] = useState<string | null>(null);
  const [merchantData, setMerchantData] = useState<any>(null);
  const [loadingMerchant, setLoadingMerchant] = useState(false);
  const [merchantModalTab, setMerchantModalTab] = useState<'subscription' | 'features' | 'profile' | 'requirements'>('subscription');
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [merchantNotice, setMerchantNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newReqText, setNewReqText] = useState('');
  const [newInvoiceAmount, setNewInvoiceAmount] = useState('3500');
  const [newInvoiceMethod, setNewInvoiceMethod] = useState('bKash Merchant');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleOpenMerchantModal = async (subdomain: string) => {
    setSelectedMerchantSubdomain(subdomain);
    setLoadingMerchant(true);
    setMerchantModalTab('subscription');
    setMerchantNotice(null);
    try {
      const res = await api.getMerchantProfile(subdomain);
      if (res?.success && res.data) {
        setMerchantData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMerchant(false);
    }
  };

  const handleSaveSubscription = async () => {
    if (!selectedMerchantSubdomain || !merchantData?.subscription) return;
    setSavingSection('subscription');
    setMerchantNotice(null);
    try {
      const res = await api.updateMerchantSubscription(selectedMerchantSubdomain, merchantData.subscription);
      if (res?.success && res.data) {
        setMerchantData(res.data);
        setMerchantNotice({ type: 'success', text: 'Subscription plan & billing parameters saved successfully!' });
      }
    } catch {
      setMerchantNotice({ type: 'error', text: 'Failed to save subscription.' });
    } finally {
      setSavingSection(null);
      setTimeout(() => setMerchantNotice(null), 4000);
    }
  };

  const handleAddInvoice = async () => {
    if (!selectedMerchantSubdomain || !merchantData?.subscription) return;
    setSavingSection('invoice');
    try {
      const res = await api.updateMerchantSubscription(selectedMerchantSubdomain, {
        ...merchantData.subscription,
        addInvoice: {
          invoiceId: `INV-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().split('T')[0],
          amount: Number(newInvoiceAmount),
          paymentMethod: newInvoiceMethod,
          status: 'PAID',
        },
      });
      if (res?.success && res.data) {
        setMerchantData(res.data);
        setMerchantNotice({ type: 'success', text: 'New invoice recorded and marked as paid.' });
      }
    } catch {
      setMerchantNotice({ type: 'error', text: 'Failed to add invoice.' });
    } finally {
      setSavingSection(null);
      setTimeout(() => setMerchantNotice(null), 4000);
    }
  };

  const handleSaveFeatures = async () => {
    if (!selectedMerchantSubdomain || !merchantData?.features) return;
    setSavingSection('features');
    setMerchantNotice(null);
    try {
      const res = await api.updateMerchantFeatures(selectedMerchantSubdomain, merchantData.features);
      if (res?.success && res.data) {
        setMerchantData(res.data);
        setMerchantNotice({ type: 'success', text: 'Feature gate controls and resource quotas updated successfully!' });
      }
    } catch {
      setMerchantNotice({ type: 'error', text: 'Failed to update features.' });
    } finally {
      setSavingSection(null);
      setTimeout(() => setMerchantNotice(null), 4000);
    }
  };

  const handleSaveProfile = async () => {
    if (!selectedMerchantSubdomain || !merchantData?.merchantProfile) return;
    setSavingSection('profile');
    setMerchantNotice(null);
    try {
      const res = await api.updateMerchantProfileInfo(selectedMerchantSubdomain, merchantData.merchantProfile);
      if (res?.success && res.data) {
        setMerchantData(res.data);
        setMerchantNotice({ type: 'success', text: 'Merchant verification & KYC details updated!' });
      }
    } catch {
      setMerchantNotice({ type: 'error', text: 'Failed to update merchant profile.' });
    } finally {
      setSavingSection(null);
      setTimeout(() => setMerchantNotice(null), 4000);
    }
  };

  const handleAddRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchantSubdomain || !newReqText.trim()) return;
    setSavingSection('requirement');
    try {
      const res = await api.addMerchantRequirement(selectedMerchantSubdomain, newReqText.trim());
      if (res?.success && res.data) {
        setMerchantData(res.data);
        setNewReqText('');
        setMerchantNotice({ type: 'success', text: 'New merchant requirement recorded.' });
      }
    } catch {
      setMerchantNotice({ type: 'error', text: 'Failed to add requirement.' });
    } finally {
      setSavingSection(null);
      setTimeout(() => setMerchantNotice(null), 4000);
    }
  };

  const handleDeleteRequirement = async (index: number) => {
    if (!selectedMerchantSubdomain) return;
    try {
      const res = await api.deleteMerchantRequirement(selectedMerchantSubdomain, index);
      if (res?.success && res.data) {
        setMerchantData(res.data);
      }
    } catch {
      setMerchantNotice({ type: 'error', text: 'Failed to delete requirement.' });
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  async function loadPlatformData() {
    try {
      const res = await api.getSuperAdminOverview();
      if (res?.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleToggleStatus = async (tenantId: string, currentStatus: boolean) => {
    try {
      await api.toggleTenantStatus(tenantId, !currentStatus);
      setData((prev: any) => ({
        ...prev,
        tenants: prev.tenants.map((t: any) =>
          t.id === tenantId ? { ...t, isActive: !currentStatus } : t
        ),
      }));
    } catch {
      alert('Failed to update tenant status.');
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setModalMsg(null);

    try {
      const res = await api.createTenant({
        name: newStoreName,
        subdomain: newSubdomain,
        businessType: newBusinessType,
        adminEmail,
      });

      if (res?.success) {
        setModalMsg({ type: 'success', text: 'New merchant store provisioned successfully!' });
        setTimeout(() => {
          setShowCreateModal(false);
          loadPlatformData();
          setNewStoreName('');
          setNewSubdomain('');
          setAdminEmail('');
        }, 1500);
      } else {
        setModalMsg({ type: 'error', text: res?.message || 'Failed to create merchant.' });
      }
    } catch {
      setModalMsg({ type: 'error', text: 'Failed to communicate with provisioning service.' });
    } finally {
      setCreating(false);
    }
  };

  const filteredTenants = (data?.tenants || []).filter((t: any) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.businessType || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCluster === 'all') return true;
    const cluster = getTenantClusterInfo(t.businessType).key;
    return cluster === selectedCluster;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Super Admin Navbar */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-rose-950">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight text-white">
                  SaaS Central Super-Admin
                </h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  PLATFORM CORE
                </span>
              </div>
              <span className="text-xs text-slate-400">Multi-Tenant E-Commerce & Service Command Center</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Provision New Tenant</span>
            </button>

            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <Store className="w-3.5 h-3.5 text-rose-400" />
              <span>SaaS Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Merchants / Stores</span>
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{data?.stats?.totalTenants || 0}</span>
              <span className="text-xs text-emerald-400 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 100% Active
              </span>
            </div>
            <p className="text-xs text-slate-500">All provisioned subdomains & mapped domains</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Platform Gross Volume (GMV)</span>
              <DollarSign className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">
                BDT {(data?.stats?.platformGrossVolume || 585000).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500">Cumulative sales across all stores</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Total Orders & Bookings</span>
              <ShoppingBag className="w-5 h-5 text-pink-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{data?.stats?.totalOrders || 0}</span>
              <span className="text-xs text-pink-400 font-medium">Orders Fulfilled</span>
            </div>
            <p className="text-xs text-slate-500">Retail checkout + Clinical slots</p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
              <span>Database & Cache Telemetry</span>
              <Activity className="w-5 h-5 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-500">PostgreSQL + Resilient Cache Engine</p>
          </div>
        </div>

        {/* Platform MRR & Financials Telemetry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Platform Financials & MRR Telemetry</span>
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400">
              Recurring SaaS Subscription Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Monthly Recurring Revenue (MRR) */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Monthly Recurring Revenue (MRR)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  +100% Retained
                </span>
              </div>

              <div>
                <div className="text-3xl font-black text-white">
                  BDT {(data?.stats?.totalMRR || 98000).toLocaleString()}
                  <span className="text-xs font-normal text-slate-400 ml-1.5">/ month</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <span>ARR Run Rate:</span>
                  <strong className="text-emerald-400 font-mono">
                    BDT {((data?.stats?.totalMRR || 98000) * 12).toLocaleString()} / yr
                  </strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Active Paying Stores:</span>
                <span className="font-bold text-white font-mono">{data?.stats?.activeTenants || 28} Tenants</span>
              </div>
            </div>

            {/* Card 2: Subscription Plan Tier Distribution */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Plan Tier Distribution
                </span>
                <span className="text-xs font-bold text-indigo-400">3 SaaS Tiers</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-300 font-bold">Growth Pro (BDT 3,500/mo)</span>
                    <span className="font-mono font-bold text-white">
                      {data?.stats?.planDistribution?.growth_pro || 28} stores
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500 w-[95%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400">Starter Core (BDT 1,500/mo)</span>
                    <span className="font-mono text-slate-400">
                      {data?.stats?.planDistribution?.starter || 0} stores
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 w-[0%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400">Enterprise High-Scale (BDT 9,500/mo)</span>
                    <span className="font-mono text-slate-400">
                      {data?.stats?.planDistribution?.enterprise || 0} stores
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500 w-[0%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Upcoming Renewals Pipeline */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Upcoming Renewals (30d)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {(data?.stats?.upcomingRenewals || []).length} Due
                </span>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {(data?.stats?.upcomingRenewals || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">No subscriptions renewing in the next 30 days.</p>
                ) : (
                  (data.stats.upcomingRenewals).slice(0, 3).map((r: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="truncate">
                        <span className="font-bold text-slate-200 block truncate">{r.name}</span>
                        <span className="text-[10px] text-amber-400 font-semibold">
                          Renews in {r.daysUntilRenewal} days • BDT {Number(r.priceBDT || 3500).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenMerchantModal(r.subdomain)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 hover:text-white transition shrink-0"
                      >
                        Manage
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Infrastructure Health Panel */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-white text-sm">Infrastructure & Core Engine Status</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Primary Database</span>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>PostgreSQL (Prisma ORM)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Caching & Session Layer</span>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Redis / In-Memory Active</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Runtime Environment</span>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <span className="text-emerald-400 font-mono">Node.js {data?.systemHealth?.nodeVersion || 'v22'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 block mb-1">Heap Memory Usage</span>
              <div className="flex items-center gap-2 font-bold text-slate-200">
                <span className="font-mono text-sky-400">{data?.systemHealth?.memoryUsageMB || 42} MB Heap</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Storefront Archetype Sandbox Quick-Launcher */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-indigo-950/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span className="font-extrabold text-white text-xs tracking-tight">Category Storefront Archetype Sandbox</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">LIVE CLUSTERS</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Directly preview live category storefronts and tailored merchant dashboards</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
              <span className="text-xs px-2 font-bold text-pink-400">👗 Fashion:</span>
              <Link href="/?tenant=gulshanfashion" target="_blank" className="px-2 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-[11px] font-bold transition">Store</Link>
              <Link href="/admin/dashboard?tenant=gulshanfashion" target="_blank" className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition">Admin</Link>
            </div>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
              <span className="text-xs px-2 font-bold text-indigo-400">⚡ Tech/POS:</span>
              <Link href="/?tenant=smartvolt" target="_blank" className="px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-[11px] font-bold transition">Store</Link>
              <Link href="/admin/dashboard?tenant=smartvolt" target="_blank" className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition">Admin</Link>
            </div>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
              <span className="text-xs px-2 font-bold text-emerald-400">🩺 Clinic:</span>
              <Link href="/?tenant=medicare" target="_blank" className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold transition">Store</Link>
              <Link href="/admin/dashboard?tenant=medicare" target="_blank" className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition">Admin</Link>
            </div>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
              <span className="text-xs px-2 font-bold text-amber-400">🏢 Real Estate:</span>
              <Link href="/?tenant=aebanproperty" target="_blank" className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold transition">Store</Link>
              <Link href="/admin/dashboard?tenant=aebanproperty" target="_blank" className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition">Admin</Link>
            </div>
          </div>
        </div>

        {/* Tenant Management Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-4 pb-4 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-rose-500" />
                  <span>All Registered Merchants & Tenant Stores</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage active store instances, category archetypes, domain mappings, and provisioning status
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search store, subdomain, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Industry Cluster Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
              {INDUSTRY_CLUSTERS.map((c) => {
                const count = c.key === 'all'
                  ? (data?.tenants || []).length
                  : (data?.tenants || []).filter((t: any) => getTenantClusterInfo(t.businessType).key === c.key).length;
                const active = selectedCluster === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCluster(c.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                      active
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-y border-slate-800">
                <tr>
                  <th className="py-3 px-4">Merchant & Store Name</th>
                  <th className="py-3 px-4">Subdomain / Domain</th>
                  <th className="py-3 px-4">Industry Archetype</th>
                  <th className="py-3 px-4">Catalog & Orders</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No tenant stores matching the filter criteria
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((t: any) => {
                    const cluster = getTenantClusterInfo(t.businessType);
                    return (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-4 font-bold text-white">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
                              {cluster.iconText}
                            </div>
                            <div>
                              <span className="block">{t.name}</span>
                              <span className="text-[11px] text-slate-500 font-mono">ID: {t.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono">
                          <span className="text-sky-400 block">{t.subdomain}.localhost</span>
                          {t.customDomain ? (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] text-emerald-400 font-semibold">{t.customDomain}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                                🔒 SSL
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 block">subdomain routing</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${cluster.pillClass}`}>
                                {cluster.badge}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 block font-medium capitalize">
                              {t.businessType?.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-300">
                          <span className="block font-bold">{t._count?.items || 1} items</span>
                          <span className="text-[11px] text-slate-500">{t._count?.orders || 15} orders</span>
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleStatus(t.id, t.isActive)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition ${
                              t.isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30'
                            }`}
                          >
                            <Power className="w-3 h-3" />
                            <span>{t.isActive ? 'Active' : 'Suspended'}</span>
                          </button>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenMerchantModal(t.subdomain)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5 transition"
                            >
                              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Profile & Plan</span>
                            </button>

                            <Link
                              href={`/?tenant=${t.subdomain}`}
                              target="_blank"
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
                            >
                              <span>Storefront</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>

                            <Link
                              href={`/admin/dashboard?tenant=${t.subdomain}`}
                              target="_blank"
                              className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition"
                            >
                              <span>Dashboard</span>
                            </Link>
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
      </main>

      {/* Provision New Tenant Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Provision New Merchant Store</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {modalMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  modalMsg.type === 'success'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {modalMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{modalMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Gadget Express, Royal Silk"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Subdomain *</label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-rose-500">
                  <input
                    type="text"
                    required
                    placeholder="mystore"
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-3.5 py-2.5 bg-transparent text-white outline-none font-mono"
                  />
                  <span className="px-3 text-slate-500 font-mono">.localhost</span>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Business Category & Archetype *</label>
                <select
                  value={newBusinessType}
                  onChange={(e) => setNewBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} — [{cat.archetype}]
                    </option>
                  ))}
                </select>

                {/* Dynamic Category Archetype Preview */}
                {(() => {
                  const cluster = getTenantClusterInfo(newBusinessType);
                  const matchedCat = BUSINESS_CATEGORIES.find((c) => c.id === newBusinessType);
                  return (
                    <div className={`mt-2 p-3 rounded-2xl border text-xs ${cluster.colorClass} space-y-1.5`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-sm">{cluster.iconText}</span>
                          <span>Storefront Archetype: {cluster.label}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${cluster.pillClass}`}>
                          {cluster.badge}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-90 leading-relaxed">{cluster.archetypeDesc}</p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/10 text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-black/40 font-mono">Archetype: {matchedCat?.archetype || 'PHYSICAL_STORE'}</span>
                        <span className="px-2 py-0.5 rounded bg-black/40">Demo Archetype: {cluster.storeDemoSlug}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Merchant Admin Email *</label>
                <input
                  type="email"
                  required
                  placeholder="merchant@example.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold shadow-lg shadow-rose-600/30 transition"
                >
                  {creating ? 'Provisioning...' : 'Provision Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Merchant Deep-Dive Profile & Subscription Management Modal */}
      {selectedMerchantSubdomain && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                  {merchantData?.name?.charAt(0) || 'M'}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-white text-lg tracking-tight">
                      {merchantData?.name || selectedMerchantSubdomain}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                      {selectedMerchantSubdomain}.localhost
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/30 flex items-center gap-1">
                      <span>{getTenantClusterInfo(merchantData?.businessType || '').iconText}</span>
                      <span>{merchantData?.businessType?.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Active for {merchantData?.subscription?.activeDays || 60} days
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">
                      Renewal in {merchantData?.subscription?.daysUntilRenewal !== undefined ? merchantData.subscription.daysUntilRenewal : 25} days
                    </span>
                    <span>•</span>
                    <span>Plan: <strong className="text-white">{merchantData?.subscription?.planName || 'Growth Pro'}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <Link
                  href={`/?tenant=${selectedMerchantSubdomain}`}
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <Store className="w-3.5 h-3.5 text-rose-400" />
                  <span>Storefront</span>
                </Link>
                <Link
                  href={`/admin/dashboard?tenant=${selectedMerchantSubdomain}`}
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => setSelectedMerchantSubdomain(null)}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {merchantNotice && (
              <div
                className={`mx-6 mt-4 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 ${
                  merchantNotice.type === 'success'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950/80 text-rose-400 border border-rose-800'
                }`}
              >
                {merchantNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{merchantNotice.text}</span>
              </div>
            )}

            {/* Tabs Header */}
            <div className="px-6 pt-3 bg-slate-950/40 border-b border-slate-800 flex items-center gap-3 shrink-0 overflow-x-auto">
              <button
                onClick={() => setMerchantModalTab('subscription')}
                className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  merchantModalTab === 'subscription'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Subscription & Billing ({merchantData?.subscription?.planName || 'Plan'})</span>
              </button>

              <button
                onClick={() => setMerchantModalTab('features')}
                className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  merchantModalTab === 'features'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Feature Gates & Quotas</span>
              </button>

              <button
                onClick={() => setMerchantModalTab('profile')}
                className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  merchantModalTab === 'profile'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>KYC & Legal Verification</span>
              </button>

              <button
                onClick={() => setMerchantModalTab('requirements')}
                className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 whitespace-nowrap ${
                  merchantModalTab === 'requirements'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Custom Demands & Notes ({merchantData?.merchantProfile?.specialRequirements?.length || 0})</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingMerchant ? (
                <div className="py-20 text-center text-slate-500 font-bold text-xs flex flex-col items-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                  <span>Loading Merchant Command Profile...</span>
                </div>
              ) : (
                <>
                  {/* TAB 1: SUBSCRIPTION & BILLING */}
                  {merchantModalTab === 'subscription' && (
                    <div className="space-y-6">
                      {/* Subscription Plan Cards */}
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-3">Subscription Tier Package</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { id: 'starter', name: 'Starter Plan', price: 1500, desc: '50 Products, 200 Orders, Basic Storefront' },
                            { id: 'growth_pro', name: 'Growth Business Pro', price: 3500, desc: '500 Products, 1500 Orders, Custom Domain, Courier APIs, Pixel' },
                            { id: 'enterprise', name: 'Enterprise Custom', price: 8500, desc: '10,000 Products, Unlimited Orders, Dedicated DB, VIP Support' },
                          ].map((tier) => (
                            <div
                              key={tier.id}
                              onClick={() => {
                                setMerchantData((prev: any) => ({
                                  ...prev,
                                  subscription: {
                                    ...prev.subscription,
                                    planId: tier.id,
                                    planName: tier.name,
                                    priceBDT: tier.price,
                                  },
                                }));
                              }}
                              className={`p-4 rounded-2xl cursor-pointer transition border text-left flex flex-col justify-between ${
                                merchantData?.subscription?.planId === tier.id
                                  ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20'
                                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-bold text-white text-sm">{tier.name}</h4>
                                  {merchantData?.subscription?.planId === tier.id && (
                                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{tier.desc}</p>
                              </div>
                              <div className="text-xs font-black text-indigo-400">
                                BDT {tier.price.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/ month</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Billing Parameters */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                        <div>
                          <label className="text-slate-400 font-bold block mb-1.5">Subscription Status</label>
                          <select
                            value={merchantData?.subscription?.status || 'active'}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMerchantData((prev: any) => ({
                                ...prev,
                                subscription: { ...prev.subscription, status: val },
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none"
                          >
                            <option value="active">🟢 Active</option>
                            <option value="trial">🟡 Free Trial</option>
                            <option value="grace_period">🟠 Grace Period</option>
                            <option value="suspended">🔴 Suspended / Past Due</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-400 font-bold block mb-1.5">Billing Cycle</label>
                          <select
                            value={merchantData?.subscription?.billingCycle || 'monthly'}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMerchantData((prev: any) => ({
                                ...prev,
                                subscription: { ...prev.subscription, billingCycle: val },
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none"
                          >
                            <option value="monthly">Monthly Recurring</option>
                            <option value="quarterly">Quarterly (3 Months)</option>
                            <option value="yearly">Yearly (12 Months)</option>
                            <option value="lifetime">Lifetime Contract</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-400 font-bold block mb-1.5">Billing Amount (BDT)</label>
                          <input
                            type="number"
                            value={merchantData?.subscription?.priceBDT || 3500}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setMerchantData((prev: any) => ({
                                ...prev,
                                subscription: { ...prev.subscription, priceBDT: val },
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-slate-400 font-bold block mb-1.5">Subscription Start Date</label>
                          <input
                            type="date"
                            value={merchantData?.subscription?.startDate?.split('T')[0] || '2026-08-15'}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMerchantData((prev: any) => ({
                                ...prev,
                                subscription: { ...prev.subscription, startDate: new Date(val).toISOString() },
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-slate-400 font-bold block mb-1.5">Next Renewal Date</label>
                          <input
                            type="date"
                            value={merchantData?.subscription?.renewalDate?.split('T')[0] || '2026-11-15'}
                            onChange={(e) => {
                              const val = e.target.value;
                              setMerchantData((prev: any) => ({
                                ...prev,
                                subscription: { ...prev.subscription, renewalDate: new Date(val).toISOString() },
                              }));
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold outline-none"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={handleSaveSubscription}
                            disabled={savingSection === 'subscription'}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold shadow-md transition"
                          >
                            {savingSection === 'subscription' ? 'Saving Plan...' : 'Save Subscription Parameters'}
                          </button>
                        </div>
                      </div>

                      {/* Invoices & Payment Ledger */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-white text-sm">Platform Invoices & Payment History</h4>
                            <p className="text-[11px] text-slate-400">Track all paid subscriptions and record new disbursements</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Amount BDT"
                              value={newInvoiceAmount}
                              onChange={(e) => setNewInvoiceAmount(e.target.value)}
                              className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                            />
                            <select
                              value={newInvoiceMethod}
                              onChange={(e) => setNewInvoiceMethod(e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                            >
                              <option value="bKash Merchant">bKash Merchant</option>
                              <option value="Nagad Business">Nagad Business</option>
                              <option value="Bank Wire">Bank Wire</option>
                              <option value="Cash / Manual">Cash / Manual</option>
                            </select>
                            <button
                              onClick={handleAddInvoice}
                              disabled={savingSection === 'invoice'}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Record Paid Invoice</span>
                            </button>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] font-bold">
                              <tr>
                                <th className="p-2.5">Invoice ID</th>
                                <th className="p-2.5">Billing Date</th>
                                <th className="p-2.5">Amount BDT</th>
                                <th className="p-2.5">Payment Method</th>
                                <th className="p-2.5">Status</th>
                                <th className="p-2.5 text-right">Receipt / Tax Invoice</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80">
                              {(merchantData?.subscription?.invoices || []).length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="py-4 text-center text-slate-500">No invoices issued yet.</td>
                                </tr>
                              ) : (
                                merchantData.subscription.invoices.map((inv: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-slate-900/40">
                                    <td className="p-2.5 font-mono text-indigo-400 font-bold">{inv.invoiceId}</td>
                                    <td className="p-2.5 text-slate-300">{inv.date}</td>
                                    <td className="p-2.5 font-bold text-white">BDT {Number(inv.amount).toLocaleString()}</td>
                                    <td className="p-2.5 text-slate-400">{inv.paymentMethod}</td>
                                    <td className="p-2.5">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                        {inv.status || 'PAID'}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-right">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedInvoice(inv);
                                          setShowInvoiceModal(true);
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[10px] font-bold border border-indigo-500/30 transition inline-flex items-center gap-1 active:scale-95"
                                      >
                                        <Printer className="w-3 h-3" />
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
                    </div>
                  )}

                  {/* TAB 2: FEATURE GATES & LIMITS */}
                  {merchantModalTab === 'features' && (
                    <div className="space-y-6">
                      {/* Quota Limits Bar */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <h4 className="font-bold text-white text-sm">Resource Capacities & Usage Quotas</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-xs text-slate-400 block mb-1">Catalog Item Capacity</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={merchantData?.features?.maxProducts || 500}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setMerchantData((prev: any) => ({
                                    ...prev,
                                    features: { ...prev.features, maxProducts: val },
                                  }));
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm font-bold"
                              />
                              <span className="text-xs text-slate-400 shrink-0">Items</span>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1 block">Current used: {merchantData?.stats?.totalProducts || 0}</span>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-xs text-slate-400 block mb-1">Monthly Order Limit</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={merchantData?.features?.maxOrdersPerMonth || 1500}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setMerchantData((prev: any) => ({
                                    ...prev,
                                    features: { ...prev.features, maxOrdersPerMonth: val },
                                  }));
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm font-bold"
                              />
                              <span className="text-xs text-slate-400 shrink-0">Orders</span>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1 block">Current used: {merchantData?.stats?.totalOrders || 0}</span>
                          </div>

                          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-xs text-slate-400 block mb-1">Staff Accounts Limit</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={merchantData?.features?.staffAccountsLimit || 5}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setMerchantData((prev: any) => ({
                                    ...prev,
                                    features: { ...prev.features, staffAccountsLimit: val },
                                  }));
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm font-bold"
                              />
                              <span className="text-xs text-slate-400 shrink-0">Users</span>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1 block">Current active: {merchantData?.stats?.totalStaff || 1}</span>
                          </div>
                        </div>
                      </div>

                      {/* Feature Gates Switches */}
                      <div>
                        <h4 className="font-bold text-white text-sm mb-3">Architectural Feature Gates</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {[
                            { key: 'customDomain', label: 'Custom Domain & CNAME Mapping', desc: 'Allows pointing branded custom domain (e.g. store.client.com)' },
                            { key: 'courierLogisticsAPI', label: 'Steadfast & Pathao Courier Logistics API', desc: 'Automated 1-click consignment creation & tracking codes' },
                            { key: 'metaPixelAndGA4', label: 'Meta Pixel & Google Analytics GA4 Suite', desc: 'Full client-side marketing and purchase event telemetry' },
                            { key: 'fraudIntelligence', label: 'Anti-Fraud Risk Scoring & Blacklist Engine', desc: 'Detects phone/IP repetition and orders with discrepancy' },
                            { key: 'automatedEmailReceipts', label: 'Automated Transactional Emails', desc: 'Sends itemized invoice receipt to customer upon order placement' },
                            { key: 'automatedSmsGateway', label: 'Transactional SMS Notifications', desc: 'Sends instant order confirmation and courier dispatch SMS' },
                            { key: 'whiteLabelBranding', label: 'White-Label Branding (Remove SaaS Watermark)', desc: 'Hides "Powered by NexStore SaaS" in storefront footers' },
                            { key: 'priority24x7Support', label: 'Priority VIP Dedicated SLA Support', desc: 'Direct WhatsApp hotline for store emergency resolution' },
                          ].map((f) => {
                            const isEnabled = Boolean(merchantData?.features?.[f.key]);
                            return (
                              <div
                                key={f.key}
                                onClick={() => {
                                  setMerchantData((prev: any) => ({
                                    ...prev,
                                    features: {
                                      ...prev.features,
                                      [f.key]: !isEnabled,
                                    },
                                  }));
                                }}
                                className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                                  isEnabled
                                    ? 'bg-slate-950 border-emerald-500/40'
                                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                                }`}
                              >
                                <div>
                                  <h5 className="font-bold text-white text-xs">{f.label}</h5>
                                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{f.desc}</p>
                                </div>
                                <div
                                  className={`w-11 h-6 rounded-full transition relative shrink-0 p-0.5 ${
                                    isEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                                  }`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded-full bg-white shadow-md transition transform ${
                                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={handleSaveFeatures}
                          disabled={savingSection === 'features'}
                          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>{savingSection === 'features' ? 'Saving Feature Permissions...' : 'Save Feature Gates & Quotas'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: KYC & VERIFICATION */}
                  {merchantModalTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                        <h4 className="font-bold text-white text-sm">Merchant Identity & Legal Compliance (DBID / Trade License)</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="text-slate-400 font-bold block mb-1">Owner / Director Name</label>
                            <input
                              type="text"
                              value={merchantData?.merchantProfile?.ownerName || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMerchantData((prev: any) => ({
                                  ...prev,
                                  merchantProfile: { ...prev.merchantProfile, ownerName: val },
                                }));
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-slate-400 font-bold block mb-1">Verified Merchant Contact Phone</label>
                            <input
                              type="text"
                              value={merchantData?.merchantProfile?.contactPhone || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMerchantData((prev: any) => ({
                                  ...prev,
                                  merchantProfile: { ...prev.merchantProfile, contactPhone: val },
                                }));
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-slate-400 font-bold block mb-1">Emergency Escalation Phone</label>
                            <input
                              type="text"
                              value={merchantData?.merchantProfile?.emergencyPhone || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMerchantData((prev: any) => ({
                                  ...prev,
                                  merchantProfile: { ...prev.merchantProfile, emergencyPhone: val },
                                }));
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-slate-400 font-bold block mb-1">Official Business Email</label>
                            <input
                              type="email"
                              value={merchantData?.merchantProfile?.verifiedEmail || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMerchantData((prev: any) => ({
                                  ...prev,
                                  merchantProfile: { ...prev.merchantProfile, verifiedEmail: val },
                                }));
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-slate-400 font-bold block mb-1">DBID Registration Number</label>
                            <input
                              type="text"
                              value={merchantData?.merchantProfile?.dbidRegistrationNo || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMerchantData((prev: any) => ({
                                  ...prev,
                                  merchantProfile: { ...prev.merchantProfile, dbidRegistrationNo: val },
                                }));
                              }}
                              placeholder="e.g. DBID-2026-99120"
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-slate-400 font-bold block mb-1">Municipal Trade License Number</label>
                            <input
                              type="text"
                              value={merchantData?.merchantProfile?.tradeLicenseNo || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMerchantData((prev: any) => ({
                                  ...prev,
                                  merchantProfile: { ...prev.merchantProfile, tradeLicenseNo: val },
                                }));
                              }}
                              placeholder="e.g. TRAD/DSCC/012984/2026"
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-slate-400 font-bold block mb-1">Registered Commercial Office / Showroom Address</label>
                            <input
                              type="text"
                              value={merchantData?.merchantProfile?.officeAddress || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMerchantData((prev: any) => ({
                                  ...prev,
                                  merchantProfile: { ...prev.merchantProfile, officeAddress: val },
                                }));
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-slate-400 font-bold block mb-1">National ID (NID) / Passport Verification</label>
                            <input
                              type="text"
                              value={merchantData?.merchantProfile?.nidOrPassport || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setMerchantData((prev: any) => ({
                                  ...prev,
                                  merchantProfile: { ...prev.merchantProfile, nidOrPassport: val },
                                }));
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono outline-none"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={handleSaveProfile}
                            disabled={savingSection === 'profile'}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            <span>{savingSection === 'profile' ? 'Saving KYC Profile...' : 'Save KYC & Legal Data'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: CUSTOM REQUIREMENTS & NOTES */}
                  {merchantModalTab === 'requirements' && (
                    <div className="space-y-6">
                      {/* Add new requirement */}
                      <form onSubmit={handleAddRequirement} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <h4 className="font-bold text-white text-sm">Add Merchant Specific Requirement / Feature Request</h4>
                        <p className="text-[11px] text-slate-400">Record custom requests (e.g. customized bKash token gateway, Steadfast custom label printer, specific catalog category demands).</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Needs bulk barcode sticker printing format for 2-inch thermal printer..."
                            value={newReqText}
                            onChange={(e) => setNewReqText(e.target.value)}
                            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                          />
                          <button
                            type="submit"
                            disabled={savingSection === 'requirement'}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Requirement</span>
                          </button>
                        </div>
                      </form>

                      {/* Requirements List */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <h4 className="font-bold text-white text-sm">Active Merchant Requirements & Demands</h4>
                        {(merchantData?.merchantProfile?.specialRequirements || []).length === 0 ? (
                          <p className="text-xs text-slate-500 py-3">No active custom requirements noted for this merchant.</p>
                        ) : (
                          <div className="space-y-2">
                            {merchantData.merchantProfile.specialRequirements.map((req: string, idx: number) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-start gap-2.5">
                                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="text-slate-200 leading-relaxed font-medium">{req}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRequirement(idx)}
                                  className="text-slate-500 hover:text-rose-400 transition p-1 shrink-0"
                                  title="Mark Fulfilled / Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Super Admin Internal Notes */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <h4 className="font-bold text-white text-sm">Internal Super-Admin Management Notes</h4>
                        <p className="text-[11px] text-slate-400">Private CRM notes visible only to platform administrators.</p>
                        <textarea
                          rows={3}
                          value={merchantData?.merchantProfile?.adminInternalNotes || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMerchantData((prev: any) => ({
                              ...prev,
                              merchantProfile: { ...prev.merchantProfile, adminInternalNotes: val },
                            }));
                          }}
                          placeholder="e.g. VIP merchant. Contract renewed annually. Special SLA for AC peak season..."
                          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed outline-none"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Internal Notes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SaaS Official Printable Invoice & Tax Receipt Modal */}
      <SaaSInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        merchant={merchantData}
      />
    </div>
  );
}

export default function SuperAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-bold">Loading Super Admin...</div>}>
      <SuperAdminContent />
    </Suspense>
  );
}
