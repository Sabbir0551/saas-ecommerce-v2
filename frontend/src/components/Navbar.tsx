'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Calendar, ShieldAlert, Sparkles, Menu, X, ArrowRight, Store, Settings, Zap, User } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface NavbarProps {
  tenantSlug?: string;
  storeName?: string;
}

export function Navbar({ tenantSlug = 'fashion', storeName }: NavbarProps) {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isMedical = tenantSlug === 'medicare';
  const isElectronics = tenantSlug === 'smartvolt';
  const resolvedStoreName = storeName || (isElectronics ? 'SmartVolt Electrical & Automation' : 'Gulshan Fashion & Boutique');
  const isDemoTenant = ['fashion', 'medicare', 'aebanproperty', 'bestlaptop'].includes(tenantSlug);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 shadow-sm transition-all">
      {/* Top Announcement Bar */}
      <div className={`py-1.5 px-4 text-xs font-medium text-white text-center flex items-center justify-center gap-2 ${
        isMedical ? 'bg-emerald-600' : isElectronics ? 'bg-[#0b0f19] text-orange-400' : 'bg-rose-600'
      }`}>
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-orange-400" />
        <span>
          {isMedical 
            ? '🏥 Senior doctor consultations: Guaranteed 1-hour confirmed time slot booking'
            : isElectronics
            ? '⚡ 0% EMI across 28 Banks & Free AC Installation Nationwide'
            : '🎉 Special Launch Offer! Free express delivery across the country on all orders'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Store Info */}
          <div className="flex items-center gap-4">
            <Link href={`/?tenant=${tenantSlug}`} className="flex items-center gap-2.5 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-105 ${
                isMedical ? 'bg-emerald-600 shadow-emerald-200' : isElectronics ? 'bg-orange-600 shadow-orange-500/20' : 'bg-rose-600 shadow-rose-200'
              }`}>
                {isElectronics ? (
                  <Zap className="w-5 h-5 fill-white text-white" />
                ) : (
                  resolvedStoreName.slice(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl block">
                  {resolvedStoreName}
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  {isMedical ? 'Specialized Healthcare Clinic' : isElectronics ? 'Electrical & Automation Store' : 'Verified Storefront'}
                </span>
              </div>
            </Link>

            {/* Tenant Switcher Demo Links (Only on template demos) */}
            {isDemoTenant && (
              <div className="hidden lg:flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-200 text-xs text-slate-500">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>Demos:</span>
                <Link
                  href="/?tenant=fashion"
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition ${
                    tenantSlug === 'fashion'
                      ? 'bg-rose-100 text-rose-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Fashion
                </Link>
                <Link
                  href="/?tenant=medicare"
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition ${
                    tenantSlug === 'medicare'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Clinic
                </Link>
                <Link
                  href="/?tenant=aebanproperty"
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition ${
                    tenantSlug === 'aebanproperty'
                      ? 'bg-amber-100 text-amber-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Real Estate
                </Link>
                <Link
                  href="/?tenant=bestlaptop"
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold transition ${
                    tenantSlug === 'bestlaptop'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Laptops
                </Link>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <Link href={`/?tenant=${tenantSlug}`} className="hover:text-rose-600 transition">
              Home
            </Link>
            {isMedical ? (
              <Link href={`/booking?tenant=${tenantSlug}`} className="hover:text-emerald-600 transition flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Doctor Slots</span>
              </Link>
            ) : (
              <Link href={`/?tenant=${tenantSlug}#products`} className="hover:text-rose-600 transition">
                Catalog
              </Link>
            )}
            <Link href={`/policies/terms?tenant=${tenantSlug}`} className="hover:text-rose-600 transition">
              Terms
            </Link>
            <Link href={`/portal?tenant=${tenantSlug}`} className="hover:text-rose-600 transition flex items-center gap-1.5 font-bold text-slate-800">
              <User className="w-3.5 h-3.5 text-rose-500" />
              <span>Portal & Track</span>
            </Link>
            <Link href={`/disputes?tenant=${tenantSlug}`} className="hover:text-rose-600 transition text-slate-500 hover:text-slate-900 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Disputes (72h)</span>
            </Link>
          </nav>

          {/* Right Action Icons: Cart & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href={`/checkout?tenant=${tenantSlug}`}
              className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center font-bold shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-100 text-xs">
            <span className="text-slate-500">Switch:</span>
            <Link
              href="/?tenant=fashion"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-2 py-0.5 rounded font-bold ${
                tenantSlug === 'fashion' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100'
              }`}
            >
              Fashion
            </Link>
            <Link
              href="/?tenant=medicare"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-2 py-0.5 rounded font-bold ${
                tenantSlug === 'medicare' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100'
              }`}
            >
              Clinic
            </Link>
            <Link
              href="/?tenant=aebanproperty"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-2 py-0.5 rounded font-bold ${
                tenantSlug === 'aebanproperty' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100'
              }`}
            >
              Real Estate
            </Link>
            <Link
              href="/?tenant=bestlaptop"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-2 py-0.5 rounded font-bold ${
                tenantSlug === 'bestlaptop' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100'
              }`}
            >
              Laptops
            </Link>
          </div>
          <Link
            href={`/?tenant=${tenantSlug}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-800 font-medium py-1"
          >
            Home
          </Link>
          {isMedical ? (
            <Link
              href={`/booking?tenant=${tenantSlug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-emerald-700 font-semibold py-1"
            >
              Doctor Appointment Slots
            </Link>
          ) : (
            <Link
              href={`/?tenant=${tenantSlug}#products`}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-800 font-medium py-1"
            >
              Product Catalog
            </Link>
          )}
          <Link
            href={`/portal?tenant=${tenantSlug}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-rose-600 font-bold py-1"
          >
            Customer Portal & Track Records
          </Link>
          <Link
            href={`/policies/terms?tenant=${tenantSlug}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 py-1"
          >
            Terms & Conditions
          </Link>
          <Link
            href={`/policies/refund-policy?tenant=${tenantSlug}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-700 py-1"
          >
            Refund & Return Policy
          </Link>
          <Link
            href={`/disputes?tenant=${tenantSlug}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block text-amber-700 font-medium py-1"
          >
            File Consumer Dispute (72h)
          </Link>
        </div>
      )}
    </header>
  );
}
