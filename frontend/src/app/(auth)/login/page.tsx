'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Store,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  Globe,
  Sparkles,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<'merchant' | 'superadmin'>('superadmin');
  const [tenantSubdomain, setTenantSubdomain] = useState('apexwatches');
  const [email, setEmail] = useState('superadmin@nexstore.com');
  const [password, setPassword] = useState('admin@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (loginMode === 'superadmin') {
      try {
        const res = await api.superAdminLogin({ email, password });
        if (res?.success) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('superadmin_auth', JSON.stringify(res.data));
          }
          router.push('/super-admin');
          return;
        } else {
          setErrorMsg(res?.message || 'Invalid credentials. Use: superadmin@nexstore.com / admin@123');
          setLoading(false);
          return;
        }
      } catch (err: any) {
        setErrorMsg('Authentication service unreachable.');
        setLoading(false);
        return;
      }
    } else {
      setTimeout(() => {
        router.push(`/admin/dashboard?tenant=${tenantSubdomain.toLowerCase().trim()}`);
      }, 500);
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
          <Link
            href="/super-admin"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-semibold transition border border-rose-500/20 flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Super Admin Direct</span>
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition shadow-md shadow-rose-600/20"
          >
            Create Store Free
          </Link>
        </div>
      </header>

      {/* Login Card */}
      <main className="max-w-md mx-auto px-4 py-12 w-full flex-1 flex flex-col justify-center">
        <div className="bg-slate-900/80 p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setLoginMode('superadmin');
                setEmail('superadmin@nexstore.com');
                setPassword('admin@123');
              }}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                loginMode === 'superadmin'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode('merchant');
                setEmail('admin@apexwatches.com');
                setPassword('password123');
              }}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                loginMode === 'merchant'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Store Merchant</span>
            </button>
          </div>

          <div className="text-center space-y-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ring-4 transition ${
              loginMode === 'superadmin'
                ? 'bg-rose-500/10 text-rose-400 ring-rose-500/10'
                : 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/10'
            }`}>
              {loginMode === 'superadmin' ? (
                <ShieldAlert className="w-6 h-6 text-rose-400" />
              ) : (
                <Store className="w-6 h-6 text-indigo-400" />
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {loginMode === 'superadmin' ? 'Super Admin Command Sign In' : 'Merchant Store Sign In'}
            </h1>
            <p className="text-xs text-slate-400">
              {loginMode === 'superadmin'
                ? 'Central control center for all multi-tenant stores, platform telemetry, and merchant provisioning.'
                : 'Sign in to manage your orders, catalog products, booking slots, and store theme.'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {loginMode === 'merchant' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Store Subdomain</label>
                <div className="relative flex items-center">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. apexwatches, fashion, medicare"
                    value={tenantSubdomain}
                    onChange={(e) => setTenantSubdomain(e.target.value)}
                    className="w-full pl-10 pr-32 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-400 font-mono text-xs focus:outline-none focus:border-rose-500"
                  />
                  <span className="absolute right-3 text-[11px] text-slate-500 font-mono pointer-events-none">
                    .localhost
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {loginMode === 'superadmin' ? 'Super Admin Email' : 'Merchant Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={loginMode === 'superadmin' ? 'superadmin@nexstore.com' : 'admin@yourstore.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <span>
                {loading
                  ? 'Verifying Credentials...'
                  : loginMode === 'superadmin'
                  ? 'Launch Super-Admin Command Center'
                  : 'Enter Store Dashboard'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
            <span className="text-[11px] text-slate-500 block font-semibold">
              {loginMode === 'superadmin' ? 'Platform Shortcuts:' : 'Quick Demo Stores:'}
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {loginMode === 'superadmin' ? (
                <>
                  <Link
                    href="/super-admin"
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold transition flex items-center gap-1"
                  >
                    <ShieldAlert className="w-3 h-3" />
                    <span>Direct Access to /super-admin</span>
                  </Link>
                </>
              ) : (
                [
                  { label: 'Gadget Hub (Mobile)', slug: 'gadgethub' },
                  { label: 'Best Laptop (PC)', slug: 'bestlaptop' },
                  { label: 'SmartVolt (Electric)', slug: 'smartvolt' },
                  { label: 'Royal Diamond (Jewelry)', slug: 'royaldiamond' },
                  { label: 'Apex Watches (Horology)', slug: 'apexwatches' },
                  { label: 'Fashion Boutique', slug: 'fashion' },
                  { label: 'PharmaExpress (Pharmacy)', slug: 'pharmaexpress' },
                  { label: 'FlyBangla (Travel)', slug: 'flybangla' },
                  { label: 'AquaPure (RO Filter)', slug: 'aquapure' },
                  { label: 'ChilliBite (Restaurant)', slug: 'chillibite' },
                  { label: 'LuxeWood (Furniture)', slug: 'luxewood' },
                  { label: 'GreenAgro (Farm & Agro)', slug: 'greenagro' },
                  { label: 'BonsaiBD (Nursery & Plants)', slug: 'bonsaibd' },
                  { label: 'Arban Property (Real Estate)', slug: 'aebanproperty' },
                  { label: 'MediCare (Doctor Clinic)', slug: 'medicare' },
                  { label: 'Makeover (Salon & Barber)', slug: 'makeover' },
                  { label: 'Pet Shop BD (Pet Care)', slug: 'petshopbd' },
                  { label: 'ScaleUp (Agency)', slug: 'scaleup' },
                  { label: 'DevNexus (Software & Keys)', slug: 'devnexus' },
                  { label: 'EduExcel (IELTS Academy)', slug: 'eduexcel' },
                  { label: 'AdvisoryPro (Legal & Tax)', slug: 'advisorypro' },
                ].map((demo) => (
                  <button
                    key={demo.slug}
                    type="button"
                    onClick={() => {
                      setTenantSubdomain(demo.slug);
                      setEmail(`admin@${demo.slug}.com`);
                      setPassword('admin@123');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 border border-slate-700/60 text-slate-300 text-[11px] font-medium transition cursor-pointer"
                  >
                    {demo.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} NexStore SaaS Engine. All 34+ Industry Archetypes Supported.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
