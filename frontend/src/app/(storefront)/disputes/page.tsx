'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { ShieldAlert, CheckCircle2, AlertCircle, Clock, FileText, Send } from 'lucide-react';

function CustomerDisputeContent() {
  const searchParams = useSearchParams();
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [reason, setReason] = useState('DAMAGED_GOODS');
  const [description, setDescription] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.submitDispute(
        {
          orderNumber,
          customerName,
          customerPhone,
          customerEmail,
          reason,
          description,
        },
        tenantSlug
      );

      if (res?.success) {
        setSuccessMsg('Your dispute has been logged successfully. Our resolution team will investigate within 72 hours.');
        setOrderNumber('');
        setDescription('');
      } else {
        setErrorMsg(res?.message || 'Failed to submit dispute claim.');
      }
    } catch {
      setErrorMsg('Unable to connect to customer redressal server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar tenantSlug={tenantSlug} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            <Clock className="w-3.5 h-3.5" />
            <span>Guaranteed 72-Hour Resolution Protocol</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Dispute & Redressal Cell
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            If there is any discrepancy with your delivered package or service, file a claim within 72 hours for an immediate refund or replacement.
          </p>
        </div>

        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Order / Invoice Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ORD-123456"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+880 1711-000000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nature of Dispute *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none font-medium"
              >
                <option value="DAMAGED_GOODS">Damaged or Broken Items Received</option>
                <option value="WRONG_ITEM">Incorrect or Incomplete Item Delivered</option>
                <option value="DELIVERY_DELAY">Severe Delivery Delay</option>
                <option value="REFUND_ISSUE">Refund or Billing Discrepancy</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Description of Issue *</label>
              <textarea
                rows={4}
                required
                placeholder="Provide a thorough explanation so our support team can verify courier logs and expedite resolution."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Dispute...' : 'Submit Official Dispute'}</span>
            </button>
          </form>
        </div>
      </main>

      <Footer tenantSlug={tenantSlug} />
    </div>
  );
}

export default function CustomerDisputePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading Dispute Form...</div>}>
      <CustomerDisputeContent />
    </Suspense>
  );
}
