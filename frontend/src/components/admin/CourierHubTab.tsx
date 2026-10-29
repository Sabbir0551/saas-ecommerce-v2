'use client';

import React, { useState } from 'react';
import {
  Truck,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  ExternalLink,
  RefreshCw,
  Search,
  Sliders,
  AlertTriangle,
  QrCode,
  PackageCheck,
  PhoneCall,
  Zap,
} from 'lucide-react';

interface CourierProps {
  tenantSlug: string;
  tenantInfo: any;
  orders: any[];
}

export default function CourierHubTab({ tenantSlug, tenantInfo, orders }: CourierProps) {
  const storeName = tenantInfo?.name || tenantSlug.toUpperCase();

  // Active courier provider
  const [activeCourier, setActiveCourier] = useState<'steadfast' | 'pathao' | 'redx'>('steadfast');

  // API Config modal or state
  const [apiKeys, setApiKeys] = useState({
    steadfastKey: 'sf_live_9921_sec_8841',
    steadfastSecret: '••••••••••••••••••••••••',
    pathaoStoreId: 'PT-STORE-7821',
  });

  // Mock shipments
  const [shipments, setShipments] = useState([
    {
      id: 'SHP-101',
      orderNumber: 'ORD-88412',
      customerName: 'মোঃ তানভীর আহমেদ',
      phone: '01819887766',
      city: 'Dhaka (Dhanmondi)',
      courier: 'Steadfast',
      consignmentId: 'ST-889104',
      codAmount: 4500,
      status: 'In Transit',
      riskScore: 'LOW', // LOW, MEDIUM, HIGH
      deliveryRate: '98%',
      returnsCount: 0,
      createdAt: 'Today, 11:20 AM',
    },
    {
      id: 'SHP-102',
      orderNumber: 'ORD-88413',
      customerName: 'Nasir Uddin',
      phone: '01712334455',
      city: 'Chittagong (Agrabad)',
      courier: 'Pathao',
      consignmentId: 'PT-443219',
      codAmount: 7800,
      status: 'Out for Delivery',
      riskScore: 'LOW',
      deliveryRate: '95%',
      returnsCount: 1,
      createdAt: 'Yesterday',
    },
    {
      id: 'SHP-103',
      orderNumber: 'ORD-88414',
      customerName: 'রাকিবুল হাসান (সন্দেহজনক)',
      phone: '01912998877',
      city: 'Gazipur (Boardbazar)',
      courier: 'Steadfast',
      consignmentId: 'ST-992184',
      codAmount: 3200,
      status: 'Pending Verification',
      riskScore: 'HIGH', // Customer with 4 returns in RedX / Steadfast
      deliveryRate: '24%',
      returnsCount: 4,
      createdAt: 'Today, 02:40 PM',
    },
    {
      id: 'SHP-104',
      orderNumber: 'ORD-88415',
      customerName: 'শারমিন আক্তার',
      phone: '01611776655',
      city: 'Sylhet (Zindabazar)',
      courier: 'RedX',
      consignmentId: 'RX-771209',
      codAmount: 2150,
      status: 'Delivered',
      riskScore: 'LOW',
      deliveryRate: '100%',
      returnsCount: 0,
      createdAt: '2 days ago',
    },
  ]);

  // Dispatch state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedFeedback, setBookedFeedback] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<any | null>(null);

  // Quick 1-click booking
  const handleQuickBook = (shpId: string) => {
    setBookingLoading(true);
    setBookedFeedback(null);
    setTimeout(() => {
      setBookingLoading(false);
      setShipments(
        shipments.map((s) =>
          s.id === shpId
            ? {
                ...s,
                status: 'Dispatched to Courier',
                consignmentId: `ST-${Math.floor(100000 + Math.random() * 900000)}`,
              }
            : s
        )
      );
      setBookedFeedback(`✅ কনসাইনমেন্ট সফলভাবে Steadfast-এ পুশ করা হয়েছে!`);
      setTimeout(() => setBookedFeedback(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/70 via-[#0B132B]/80 to-blue-950/70 border border-cyan-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Update 9 • Logistics Hub
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-300 font-mono">
                <Truck className="w-3.5 h-3.5" /> Steadfast, Pathao & RedX 1-Click Dispatch
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              কুরিয়ার হাব ও কাস্টমার ফ্রড প্রিভেনশন রাডার
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              এক ক্লিকে পার্সেল বুকিং, ট্র্যাকিং কোড জেনারেট, ৪x৬ থার্মাল লেবেল প্রিন্ট এবং ফোন নাম্বার ভিত্তিক রিটার্ন রিস্ক বিশ্লেষণ।
            </p>
          </div>

          {/* Quick Courier Provider Badges */}
          <div className="flex items-center gap-2 bg-[#0E1528] p-1.5 rounded-xl border border-cyan-500/30 shrink-0 text-xs font-bold">
            <button
              onClick={() => setActiveCourier('steadfast')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeCourier === 'steadfast'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Steadfast (Active)
            </button>
            <button
              onClick={() => setActiveCourier('pathao')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeCourier === 'pathao'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pathao
            </button>
            <button
              onClick={() => setActiveCourier('redx')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeCourier === 'redx'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RedX
            </button>
          </div>
        </div>
      </div>

      {bookedFeedback && (
        <div className="p-3 bg-cyan-950/80 border border-cyan-500/50 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{bookedFeedback}</span>
        </div>
      )}

      {/* KPI Cards: In Transit, Delivered, Returns, High Risk */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-bold uppercase">মোট ইন-ট্রানজিট পার্সেল</p>
          <p className="text-2xl font-black text-cyan-400 font-mono mt-1">১২ টি</p>
          <span className="text-[10px] text-slate-500">চলতি সপ্তাহে ডেলিভারি প্রক্রিয়াধীন</span>
        </div>
        <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-bold uppercase">সাকসেসফুল ডেলিভারি রেট</p>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">৯৪.৬%</p>
          <span className="text-[10px] text-emerald-500">জাতীয় গড়ের চেয়ে ৪% বেশি</span>
        </div>
        <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-bold uppercase">পেন্ডিং COD কালেকশন</p>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">৳৩৯,৫০০</p>
          <span className="text-[10px] text-slate-500">কুরিয়ার সেটেলমেন্ট অপেক্ষমাণ</span>
        </div>
        <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-4">
          <p className="text-[11px] text-slate-400 font-bold uppercase">ফ্রড রাডার ফ্ল্যাগড</p>
          <p className="text-2xl font-black text-rose-400 font-mono mt-1">২ টি পার্সেল</p>
          <span className="text-[10px] text-rose-500">অগ্রিম ডেলিভারি চার্জ গ্রহণের পরামর্শ</span>
        </div>
      </div>

      {/* Shipments Table with Fraud Radar Badges */}
      <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>পার্সেল কনসাইনমেন্ট ও রিটার্ন প্রোটেকশন লিস্ট</span>
            </h3>
            <p className="text-xs text-slate-400">
              গ্রাহকের ফোন নাম্বার বিশ্লেষণ করে স্বয়ংক্রিয় রিটার্ন রিস্ক স্কোর নির্ধারণ
            </p>
          </div>
          <button
            onClick={() => handleQuickBook('SHP-103')}
            disabled={bookingLoading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition cursor-pointer disabled:opacity-50"
          >
            {bookingLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            <span>১-ক্লিকে কুরিয়ারে পুশ করুন</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 bg-[#0E1528]">
                <th className="py-3 px-3">অর্ডার ও কনসাইনমেন্ট</th>
                <th className="py-3 px-3">গ্রাহক ও ফোন</th>
                <th className="py-3 px-3">গন্তব্য</th>
                <th className="py-3 px-3">COD মূল্য</th>
                <th className="py-3 px-3">ফ্রড রিস্ক স্কোর</th>
                <th className="py-3 px-3">কুরিয়ার স্ট্যাটাস</th>
                <th className="py-3 px-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {shipments.map((shp) => (
                <tr key={shp.id} className="hover:bg-[#11172A] transition">
                  <td className="py-3 px-3">
                    <p className="font-bold text-white">{shp.orderNumber}</p>
                    <p className="text-[10px] text-cyan-400 font-mono">{shp.consignmentId}</p>
                  </td>
                  <td className="py-3 px-3 font-sans">
                    <p className="text-slate-200 font-semibold">{shp.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{shp.phone}</p>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">{shp.city}</td>
                  <td className="py-3 px-3 text-amber-400 font-bold">৳{shp.codAmount.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    {shp.riskScore === 'HIGH' ? (
                      <div className="inline-flex flex-col">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          <ShieldAlert className="w-3 h-3 text-rose-400" /> High Risk ({shp.deliveryRate})
                        </span>
                        <span className="text-[9px] text-rose-400 font-sans mt-0.5">
                          ⚠️ {shp.returnsCount} বার পার্সেল রিটার্ন করেছে
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Safe ({shp.deliveryRate} Success)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        shp.status === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : shp.status === 'In Transit' || shp.status === 'Out for Delivery'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      <Clock className="w-3 h-3" /> {shp.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedLabel(shp)}
                        className="px-2.5 py-1 rounded bg-[#131B31] border border-cyan-500/30 hover:border-cyan-500 text-cyan-300 text-[11px] font-sans flex items-center gap-1 transition cursor-pointer"
                        title="Print 4x6 Shipping Label"
                      >
                        <Printer className="w-3 h-3" /> লেবেল
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4x6 Thermal Shipping Label Modal */}
      {selectedLabel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl font-mono text-xs space-y-4">
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
              <span className="text-lg font-black tracking-tight uppercase">STEADFAST COURIER</span>
              <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">STANDARD 24H</span>
            </div>

            {/* Barcode */}
            <div className="text-center py-2 border-b border-dashed border-slate-300">
              <div className="h-12 bg-slate-900 mx-auto w-4/5 flex items-center justify-around px-2 text-[9px] text-white">
                ||||| | |||| | |||||| || | |||| ||||| ||||
              </div>
              <p className="text-xs font-black tracking-wider text-slate-900 mt-1">
                {selectedLabel.consignmentId}
              </p>
            </div>

            {/* Recipient Details */}
            <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
              <p className="font-bold text-slate-900 text-xs">RECIPIENT (প্রাপক):</p>
              <p className="font-bold text-slate-950">{selectedLabel.customerName}</p>
              <p className="text-slate-700">Phone: {selectedLabel.phone}</p>
              <p className="text-slate-700">Address: {selectedLabel.city}</p>
            </div>

            {/* COD Value */}
            <div className="flex justify-between items-center p-2 rounded bg-amber-50 border border-amber-300">
              <span className="font-bold text-amber-900">CASH ON DELIVERY (COD):</span>
              <span className="text-base font-black text-amber-950">৳{selectedLabel.codAmount.toLocaleString()}</span>
            </div>

            {/* Sender Details */}
            <div className="text-[10px] text-slate-500 pt-1 border-t border-dashed border-slate-300">
              <p className="font-bold text-slate-700">SENDER: {storeName}</p>
              <p>Helpline: {tenantInfo?.phone || '+880 1811-223344'}</p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> প্রিন্ট লেবেল (4x6 Thermal)
              </button>
              <button
                onClick={() => setSelectedLabel(null)}
                className="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                বন্ধ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
