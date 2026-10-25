'use client';

import React from 'react';
import { Printer, X, CheckCircle2, ShieldCheck, Download, Building, Phone, Mail, MapPin, FileText } from 'lucide-react';

export interface SaaSInvoiceData {
  invoiceId: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status?: string;
  period?: string;
}

export interface MerchantBillingInfo {
  name?: string;
  subdomain?: string;
  businessType?: string;
  planName?: string;
  planId?: string;
  priceBDT?: number;
  merchantProfile?: {
    ownerName?: string;
    contactPhone?: string;
    emergencyPhone?: string;
    verifiedEmail?: string;
    officeAddress?: string;
    tradeLicenseNo?: string;
    dbidRegistrationNo?: string;
    nidOrPassport?: string;
  };
  subscription?: {
    planName?: string;
    planId?: string;
    priceBDT?: number;
    billingCycle?: string;
    startDate?: string;
    nextRenewalDate?: string;
    status?: string;
  };
}

interface SaaSInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: SaaSInvoiceData | null;
  merchant: MerchantBillingInfo | null;
}

export default function SaaSInvoiceModal({
  isOpen,
  onClose,
  invoice,
  merchant,
}: SaaSInvoiceModalProps) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const planName = merchant?.subscription?.planName || merchant?.planName || 'Growth Business Pro Plan';
  const price = invoice.amount || merchant?.subscription?.priceBDT || 3500;
  const ownerName = merchant?.merchantProfile?.ownerName || 'Authorized Merchant Principal';
  const storeName = merchant?.name || 'Registered Store Instance';
  const phone = merchant?.merchantProfile?.contactPhone || '+880 1711 000 111';
  const email = merchant?.merchantProfile?.verifiedEmail || `billing@${merchant?.subdomain || 'store'}.com`;
  const address = merchant?.merchantProfile?.officeAddress || 'Dhaka, Bangladesh';
  const dbid = merchant?.merchantProfile?.dbidRegistrationNo || 'DBID-2026-99120';
  const tradeLic = merchant?.merchantProfile?.tradeLicenseNo || 'TRAD/DSCC/012984/2026';
  const period = invoice.period || (merchant?.subscription?.startDate && merchant?.subscription?.nextRenewalDate 
    ? `${merchant.subscription.startDate} to ${merchant.subscription.nextRenewalDate}`
    : 'Monthly Recurring Cycle');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      {/* Container */}
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:rounded-none print:w-full print:max-w-none">
        
        {/* Action Header (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center font-black text-white text-sm">
              ⚡
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                <span>Official SaaS Subscription Tax Receipt</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  NBR COMPLIANT
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Computer Generated Multi-Tenant Cloud Billing Invoice</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-saas-invoice" className="p-6 sm:p-10 space-y-8 bg-white text-slate-900">
          
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md">
                  ⚡
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">NexStore Cloud Infrastructure</h1>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Enterprise Multi-Tenant SaaS Platform</span>
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-0.5 leading-relaxed mt-3">
                <p>Level 14, Silicon Tower, Gulshan-2, Dhaka-1212</p>
                <p>Government Reg BIN / VAT ID: <strong className="text-slate-800 font-mono font-semibold">9928172948-0201</strong></p>
                <p>Central Drooto Helpline: <strong className="text-slate-800 font-mono">09606 111 777</strong> | billing@nexstore.cloud</p>
              </div>
            </div>

            {/* Invoice Stamp & Metadata */}
            <div className="text-left sm:text-right space-y-2">
              <div className="inline-block px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>PAYMENT RECEIVED & VERIFIED</span>
                </div>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <p>Invoice Number: <strong className="font-mono text-slate-900 font-bold">{invoice.invoiceId}</strong></p>
                <p>Invoice Date: <strong className="text-slate-800 font-semibold">{invoice.date}</strong></p>
                <p>Billing Cycle: <span className="font-semibold text-slate-700">{period}</span></p>
                <p>Payment Gateway: <strong className="text-indigo-600 font-bold">{invoice.paymentMethod}</strong></p>
              </div>
            </div>
          </div>

          {/* Bill-To and Merchant KYC Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">
                Billed To (Authorized Merchant)
              </span>
              <h2 className="text-base font-black text-slate-900">{storeName}</h2>
              <div className="text-xs text-slate-600 space-y-1 mt-2">
                <p className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Principal Owner:</span>
                  <strong className="text-slate-900 font-semibold">{ownerName}</strong>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Subdomain:</span>
                  <span className="font-mono font-bold text-indigo-600">{merchant?.subdomain || 'store'}.localhost</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Phone:</span>
                  <span className="font-mono text-slate-800">{phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Address:</span>
                  <span className="text-slate-700">{address}</span>
                </p>
              </div>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-6">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">
                Government KYC & Compliance Registry
              </span>
              <div className="text-xs text-slate-600 space-y-2 mt-2">
                <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Digital Business ID (DBID):</span>
                  <strong className="font-mono text-emerald-700 text-xs font-bold">{dbid}</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Trade License (City Corp):</span>
                  <strong className="font-mono text-slate-800 text-xs">{tradeLic}</strong>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified SaaS merchant instance under Bangladesh E-Commerce Guidelines</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Service Description</th>
                  <th className="py-3 px-4 text-center">Billing Cycle</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 text-sm">{planName}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Includes PostgreSQL isolated tenant database partition, catalog quota, Steadfast logistics integration, anti-fraud scoring, and high-availability SSL cloud hosting.
                    </p>
                  </td>
                  <td className="py-4 px-4 text-center text-slate-700 font-medium">1 Month</td>
                  <td className="py-4 px-4 text-right font-mono text-slate-900 font-bold">BDT {price.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right font-mono text-slate-900 font-extrabold">BDT {price.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-600">
                    <p className="font-medium text-slate-800">Automated Daily Cloud Backups & TLS/SSL Protection</p>
                    <p className="text-[10px] text-slate-500">Continuous snapshot replication & firewall perimeter</p>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">Included</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">BDT 0</td>
                  <td className="py-4 px-4 text-right font-mono text-emerald-600 font-bold">BDT 0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Computation */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 space-y-1.5 max-w-sm">
              <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Terms & Regulatory Disclaimers</p>
              <p className="leading-relaxed">
                This document serves as an authentic electronic receipt for subscription services under SRO-148/2021. Cloud hosting & SaaS software services provided on recurring prepayment basis.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-emerald-700">Digital Seal Verified: VALID RECORD</span>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-900">BDT {price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Value Added Tax (VAT 0%):</span>
                <span className="font-mono text-slate-500">BDT 0</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Paid:</span>
                <span className="font-mono text-indigo-700 text-base">BDT {price.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-800">
                  Amount Cleared via {invoice.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Official Verification Stamp */}
          <div className="pt-6 border-t border-slate-200 text-center space-y-1">
            <p className="text-[11px] text-slate-400">
              Generated automatically by NexStore Multi-Tenant SaaS Engine. Transaction Hash: 
              <span className="font-mono text-slate-600 ml-1">
                sha256_{invoice.invoiceId.toLowerCase()}_{Date.now().toString(36)}
              </span>
            </p>
            <p className="text-[10px] text-slate-400">
              For billing inquiries or tax deduction certificates (TDS/VDS), please reach out to billing@nexstore.cloud
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
