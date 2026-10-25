import React from 'react';
import Link from 'next/link';
import { ShieldCheck, PhoneCall, Mail, MapPin, Truck, RefreshCw, Headphones } from 'lucide-react';

interface FooterProps {
  tenantSlug?: string;
  storeName?: string;
  phone?: string;
  email?: string;
  address?: string;
  dbid?: string;
  tradeLicense?: string;
}

export function Footer({ 
  tenantSlug = 'fashion', 
  storeName = 'Gulshan Fashion & Boutique',
  phone = '+880 1812-778899',
  email = 'support@saasengine.com',
  address = 'Nawabpur Road Electrical Market, Dhaka',
  dbid,
  tradeLicense,
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-auto">
      {/* 3 Pillars Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Reliable doorstep shipping via certified couriers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">72-Hour Return Policy</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free replacements and verified refund guarantees</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Dedicated Customer Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">9:00 AM to 11:00 PM uninterrupted assistance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Store Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">{storeName}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Committed to delivering authentic quality products, guaranteed slot schedules, and transparent customer service.
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
                <ShieldCheck className="w-4 h-4" />
                <span>Certified Digital Commerce Compliant</span>
              </div>
              {(dbid || tradeLicense) && (
                <div className="text-[10px] text-slate-400 space-y-0.5 font-mono pt-1">
                  {dbid && <div>DBID Reg: <span className="text-emerald-300 font-bold">{dbid}</span></div>}
                  {tradeLicense && <div>Trade License: <span className="text-slate-300">{tradeLicense}</span></div>}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/?tenant=${tenantSlug}`} className="hover:text-rose-400 transition">
                  Storefront Home
                </Link>
              </li>
              <li>
                <Link href={`/?tenant=${tenantSlug}#products`} className="hover:text-rose-400 transition">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href={`/checkout?tenant=${tenantSlug}`} className="hover:text-rose-400 transition">
                  Express Checkout
                </Link>
              </li>
              <li>
                <Link href={`/admin/dashboard?tenant=${tenantSlug}`} className="hover:text-rose-400 transition text-slate-400">
                  Merchant Control Dashboard
                </Link>
              </li>
              <li>
                <Link href="/super-admin" className="hover:text-rose-400 transition text-rose-400 font-semibold flex items-center gap-1">
                  <span>⚡ Central Super-Admin</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Policies & Consumer Rights</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/policies/terms?tenant=${tenantSlug}`} className="hover:text-rose-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href={`/policies/privacy?tenant=${tenantSlug}`} className="hover:text-rose-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={`/policies/refund-policy?tenant=${tenantSlug}`} className="hover:text-rose-400 transition">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link href={`/disputes?tenant=${tenantSlug}`} className="text-amber-400 hover:underline flex items-center gap-1.5 font-medium">
                  File Online Dispute (72-Hour Resolution)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Customer Contact</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
                <span>+880 1811-223344</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>support@saasengine.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>Road 11, Block D, Banani, Dhaka</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved. Powered by NexStore SaaS Engine.</p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>bKash</span>
            <span>•</span>
            <span>Nagad</span>
            <span>•</span>
            <span>Visa / MasterCard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
