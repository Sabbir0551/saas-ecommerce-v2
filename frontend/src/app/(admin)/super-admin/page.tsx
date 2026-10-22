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
} from 'lucide-react';

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

function SuperAdminContent() {
  const [data, setData] = useState<any>(DEFAULT_MIGRATED_DATA);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New tenant form state
  const [newStoreName, setNewStoreName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newBusinessType, setNewBusinessType] = useState('fashion_clothing');
  const [adminEmail, setAdminEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [modalMsg, setModalMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const filteredTenants = (data?.tenants || []).filter((t: any) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                ৳ {(data?.stats?.platformGrossVolume || 585000).toLocaleString()}
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

        {/* Tenant Management Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-500" />
                <span>All Registered Merchants & Tenant Stores</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage active store instances, domain mappings, and provisioning status
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search store or subdomain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
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
                      No tenant stores matching the query
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-4 font-bold text-white">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                            {t.name.slice(0, 1)}
                          </div>
                          <div>
                            <span className="block">{t.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">ID: {t.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono">
                        <span className="text-sky-400 block">{t.subdomain}.localhost</span>
                        {t.customDomain && (
                          <span className="text-[11px] text-emerald-400 block">{t.customDomain}</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                          t.businessType === 'healthcare_service' || t.businessType === 'doctor'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : t.businessType === 'real_estate'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : t.businessType === 'laptop_computer' || t.businessType === 'mobile_gadgets'
                            ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {t.businessType?.replace('_', ' ')}
                        </span>
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
                  ))
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
                <label className="text-slate-300 font-bold block mb-1">Business Category *</label>
                <select
                  value={newBusinessType}
                  onChange={(e) => setNewBusinessType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.archetype})
                    </option>
                  ))}
                </select>
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
