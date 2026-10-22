'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function PolicyDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const policyType = params.type as 'terms' | 'privacy' | 'refund-policy';
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  const [policy, setPolicy] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    async function fetchPolicy() {
      const res = await api.getPolicy(policyType, tenantSlug);
      if (res?.success && res.data) {
        setPolicy(res.data);
      } else {
        // Fallback policy
        const titles: Record<string, string> = {
          'refund-policy': 'Return & Refund Policy',
          'privacy': 'Privacy Policy',
          'terms': 'Terms & Conditions of Service',
        };
        setPolicy({
          title: titles[policyType] || 'Store Policy & Legal Terms',
          content: 'In compliance with Digital Commerce Guidelines and Consumer Protection standards, any defect, missing item, or dispute must be reported within 72 hours of delivery. Once verified, replacements or refunds will be executed within 7-10 business days.',
        });
      }
    }
    fetchPolicy();
  }, [policyType, tenantSlug]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar tenantSlug={tenantSlug} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="mb-6">
          <Link
            href={`/?tenant=${tenantSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront</span>
          </Link>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {policy?.title || 'Store Policy'}
              </h1>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Compliant with Digital Commerce Guidelines & Consumer Protection Standards</span>
              </span>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {policy?.content}
          </div>
        </div>
      </main>

      <Footer tenantSlug={tenantSlug} />
    </div>
  );
}

export default function PolicyDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading policy...</div>}>
      <PolicyDetailContent />
    </Suspense>
  );
}
