'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import {
  CheckCircle,
  Printer,
  ArrowLeft,
  PackageCheck,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Stethoscope,
  Building2,
  Laptop,
  Sparkles,
  ShieldCheck,
  Car,
  FileCheck,
  User,
  QrCode,
  AlertCircle,
  Award,
  Download,
} from 'lucide-react';
import { trackPurchase } from '@/components/AnalyticsTracker';

function OrderSuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params.orderNumber as string;
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  const [order, setOrder] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Archetype Detection
  const bType = tenant?.businessType || (
    tenantSlug === 'medicare' || tenantSlug === 'meradenralcare' ? 'doctor' :
    tenantSlug === 'aebanproperty' ? 'real_estate' :
    tenantSlug === 'smartvolt' || tenantSlug === 'bestlaptop' || tenantSlug === 'gadgethub' ? 'laptop_computer' :
    'fashion_clothing'
  );

  const isMedical = bType === 'doctor' || bType === 'healthcare_service' || bType === 'pharmacy' || tenantSlug === 'medicare' || tenantSlug === 'meradenralcare' || order?.customAttributes?.archetype === 'MEDICAL';
  const isRealEstate = bType === 'real_estate' || tenantSlug === 'aebanproperty' || order?.customAttributes?.archetype === 'REAL_ESTATE';
  const isElectronics = bType === 'laptop_computer' || bType === 'mobile_gadgets' || tenantSlug === 'smartvolt' || tenantSlug === 'bestlaptop' || tenantSlug === 'gadgethub' || order?.customAttributes?.archetype === 'ELECTRONICS';
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

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await api.trackOrder(orderNumber, tenantSlug);
        if (res?.success && res.data) {
          setOrder(res.data);
          trackPurchase(res.data);
        } else {
          // Mock order for instant preview matching archetype
          const mockOrder = {
            orderNumber,
            customerName: isMedical ? 'Dr. / Mr. Anisur Rahman' : isRealEstate ? 'Engr. Tanvir Ahmed' : 'Valued Customer',
            customerPhone: '+880 1711-889900',
            shippingAddress: isMedical ? 'MediCare Specialist Chamber, Mirpur-10, Dhaka' : isRealEstate ? 'Convoy Pickup: Gulshan-2 Circle Hub' : 'Dhaka Metropolitan Area, Bangladesh',
            totalAmount: isRealEstate ? 25000 : isMedical ? 1000 : 7100,
            paymentMethod: isMedical ? 'Pay at Chamber Counter' : isRealEstate ? 'Complimentary VIP Convoy Tour' : 'Cash on Delivery (COD)',
            orderStatus: 'CONFIRMED',
            booking: {
              bookingDate: new Date().toISOString().split('T')[0],
              bookingTime: '10:00 AM - 11:00 AM',
              serialNumber: 7,
            },
            customAttributes: {
              archetype: isMedical ? 'MEDICAL' : isRealEstate ? 'REAL_ESTATE' : isElectronics ? 'ELECTRONICS' : 'FASHION',
              patientAge: '34',
              patientGender: 'Male',
              appointmentSlot: '10:00 AM - 11:00 AM',
              patientSymptoms: 'Tooth sensitivity & pain during chewing',
              tourDate: 'Tomorrow, 11:00 AM',
              convoyPickup: 'Gulshan-2 Circle Convoy Hub',
              investmentReadiness: 'Ready to Book within 30 days',
              attendeeCount: '2 Persons',
              warrantyType: '1-Year Official National Manufacturer Warranty',
              imeiNumber: '864920061298411',
              sizeVerified: true,
              giftBox: true,
            },
            items: isMedical ? [
              {
                id: '1',
                itemTitle: 'Specialist Medical Consultation & Serial Slot Pass',
                price: 1000,
                quantity: 1,
                subtotal: 1000,
              }
            ] : isRealEstate ? [
              {
                id: '1',
                itemTitle: 'Private VIP Convoy Site Tour & Luxury Dossier',
                price: 0,
                quantity: 1,
                subtotal: 0,
              }
            ] : [
              {
                id: '1',
                itemTitle: isElectronics ? 'Apple iPhone 16 Pro Max 256GB - Official BTRC' : 'Handcrafted Jamdani Silk Designer Kurti (Size M)',
                price: isElectronics ? 175000 : 6500,
                quantity: 1,
                subtotal: isElectronics ? 175000 : 6500,
              },
            ],
          };
          setOrder(mockOrder);
          trackPurchase(mockOrder);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber, tenantSlug, isMedical, isRealEstate, isElectronics]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar tenantSlug={tenantSlug} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-8 print:shadow-none print:border-none">
          {/* Archetype-Specific Header */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-100">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-lg ${
              isMedical ? 'bg-emerald-100 text-emerald-600 shadow-emerald-500/10' :
              isRealEstate ? 'bg-amber-100 text-amber-600 shadow-amber-500/10' :
              isElectronics ? 'bg-indigo-100 text-indigo-600 shadow-indigo-500/10' :
              'bg-pink-100 text-pink-600 shadow-pink-500/10'
            }`}>
              {isMedical ? <Stethoscope className="w-9 h-9" /> :
               isRealEstate ? <Building2 className="w-9 h-9" /> :
               isElectronics ? <Laptop className="w-9 h-9" /> :
               <CheckCircle className="w-9 h-9" />}
            </div>

            <div className="inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-800">
              {isMedical ? '🩺 DOCTOR CHAMBER APPOINTMENT PASS' :
               isRealEstate ? '🏢 VIP PRIVATE SITE CONVOY PASS' :
               isElectronics ? '⚡ HARDWARE & WARRANTY CERTIFICATE' :
               '👗 BOUTIQUE ORDER CONFIRMATION'}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isMedical ? 'Doctor Serial Booked Successfully!' :
               isRealEstate ? 'VIP Site Visit Pass Issued!' :
               isElectronics ? 'Hardware Order & Warranty Confirmed!' :
               'Boutique Order Placed Successfully!'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              {isMedical ? 'Your specialist consultation serial slot has been allocated. Please present this serial pass upon chamber arrival.' :
               isRealEstate ? 'Your private luxury convoy site tour is confirmed. Our dedicated Relationship Manager will escort you from your pickup hub.' :
               isElectronics ? 'Your order is verified and IMEI details registered for official 1-year brand warranty and doorstep inspection.' :
               'Our fashion team has received your order and prepared your designer apparel with 7-day doorstep size exchange protection.'}
            </p>

            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold">
              {isMedical ? 'Serial Token Ref:' : isRealEstate ? 'VIP Pass Ref:' : 'Tracking Order ID:'}{' '}
              <span className={isMedical ? 'text-emerald-600' : isRealEstate ? 'text-amber-600' : isElectronics ? 'text-indigo-600' : 'text-rose-600'}>
                {orderNumber}
              </span>
            </div>
          </div>

          {/* Archetype Hero Voucher Cards */}
          {isMedical && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-black tracking-wider uppercase text-emerald-300">
                    Doctor Chamber Serial Slip
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  BMDC Verified
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-emerald-300 font-semibold block">Chamber Consultation Center</span>
                  <h4 className="text-base font-bold text-white">MediCare Specialist Chamber</h4>
                  <p className="text-xs text-slate-300">
                    Slot Time: <strong className="text-emerald-400 font-mono">{order?.customAttributes?.appointmentSlot || order?.booking?.bookingTime || '10:00 AM - 11:00 AM'}</strong>
                  </p>
                  <p className="text-xs text-slate-300">
                    Patient: <strong>{order?.customerName}</strong> ({order?.customAttributes?.patientGender || 'Male'}, {order?.customAttributes?.patientAge || '34'} Yrs)
                  </p>
                  {order?.customAttributes?.patientSymptoms && (
                    <p className="text-[11px] text-slate-400">Chief Symptoms: {order.customAttributes.patientSymptoms}</p>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center shrink-0 w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">Token Number</span>
                  <span className="text-4xl font-black text-emerald-400 font-mono">
                    #{order?.booking?.serialNumber || '07'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Priority Queue</span>
                </div>
              </div>
            </div>
          )}

          {isRealEstate && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-black tracking-wider uppercase text-amber-300">
                    VIP Chauffeur Convoy Tour Pass
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Arban Luxury Estates
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-amber-300 font-semibold block">Private Site Inspection Details</span>
                  <h4 className="text-base font-bold text-white">Arban Heights & Luxury Penthouse Showcase</h4>
                  <div className="text-xs text-slate-300 space-y-0.5 mt-1">
                    <p className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pickup Hub: <strong className="text-amber-300">{order?.customAttributes?.convoyPickup || 'Gulshan-2 Circle Convoy Hub'}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Scheduled Date: <strong className="text-white">{order?.customAttributes?.tourDate || 'Tomorrow, 11:00 AM'}</strong></span>
                    </p>
                    <p>Convoy Party Size: <strong>{order?.customAttributes?.attendeeCount || '2 Persons'}</strong></p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center shrink-0 w-full sm:w-auto">
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">VIP PASS CODE</span>
                  <span className="text-2xl font-black text-amber-400 font-mono tracking-widest block mt-0.5">
                    ARB-9021
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block mt-1">✓ Chauffeur Assigned</span>
                </div>
              </div>
            </div>
          )}

          {isElectronics && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-black tracking-wider uppercase text-indigo-300">
                    BTRC Hardware Warranty Certificate
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  National Coverage
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-indigo-300 font-semibold block">Registered Device & IMEI</span>
                  <p className="text-white font-mono font-bold text-sm">IMEI: {order?.customAttributes?.imeiNumber || '864920061298411'}</p>
                  <p className="text-slate-300">Warranty Tier: <strong className="text-indigo-300">{order?.customAttributes?.warrantyType || '1-Year Official National Manufacturer Warranty'}</strong></p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <span className="text-emerald-400 font-bold block">✓ Doorstep Seal Unboxing Allowed</span>
                  <span className="text-slate-300 block">72-Hour Dead on Arrival Replacement</span>
                  <span className="text-[10px] text-slate-400 block font-mono">BTRC Reg: SMARTVOLT-2026-HQ</span>
                </div>
              </div>
            </div>
          )}

          {isFashion && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950 via-slate-900 to-rose-950 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-400" />
                  <span className="text-xs font-black tracking-wider uppercase text-pink-300">
                    Signature Designer Boutique Receipt
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  7-Day Alteration Guard
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-pink-300 font-semibold block">Boutique Packaging & Delivery</span>
                  <p className="text-white font-bold">{order?.customAttributes?.giftBox ? '🎁 Signature Luxury Gift Box Pack' : '🛍️ Standard Designer Silk Pack'}</p>
                  <p className="text-slate-300">Fitting Protection: <strong className="text-pink-300">Hassle-Free Doorstep Size Exchange</strong></p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <span className="text-emerald-400 font-bold block">✓ Express Dispatch Active</span>
                  <span className="text-slate-300 block">Care Helpline: +880 1711-998877</span>
                  <span className="text-[10px] text-slate-400 block font-mono">Boutique ID: GULSHAN-LUX-88</span>
                </div>
              </div>
            </div>
          )}

          {/* Customer & Delivery Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block text-sm mb-1 flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-rose-600" />
                {isMedical ? 'Patient / Guardian Information' : isRealEstate ? 'Client / Investor Information' : 'Customer Information'}
              </span>
              <p>Name: <strong className="text-slate-800">{order?.customerName}</strong></p>
              <p>Phone: <strong className="text-slate-800">{order?.customerPhone}</strong></p>
              <p>Payment Method: <strong className="text-slate-800">{order?.paymentMethod}</strong></p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block text-sm mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                {isMedical ? 'Chamber Center / Destination' : isRealEstate ? 'Convoy Pickup / Residence' : 'Shipping Destination'}
              </span>
              <p className="leading-relaxed text-slate-800 font-medium">
                {order?.shippingAddress}
              </p>
              <p>Status: <span className="font-bold text-emerald-600 font-mono">CONFIRMED / ACTIVE</span></p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              {isMedical ? 'Clinical Consultation Package' : isRealEstate ? 'Tour Pass & Reserved Unit' : 'Order Items'}
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {order?.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{item.itemTitle}</h4>
                    {item.variantTitle && <span className="text-[11px] text-slate-500 block">{item.variantTitle}</span>}
                    <span className="text-slate-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">
                    {item.price === 0 ? 'FREE / COMPLIMENTARY' : `BDT ${item.subtotal?.toLocaleString('en-US')}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-700">Total Payable / Settlement:</span>
              <span className={`text-xl font-extrabold ${
                isMedical ? 'text-emerald-600' : isRealEstate ? 'text-amber-600' : isElectronics ? 'text-indigo-600' : 'text-rose-600'
              }`}>
                {order?.totalAmount === 0 ? 'FREE (No Charge)' : `BDT ${order?.totalAmount?.toLocaleString('en-US')}`}
              </span>
            </div>
          </div>

          {/* Action buttons (Hidden during print) */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <Link
              href={`/?tenant=${tenantSlug}`}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>

            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>
                {isMedical ? 'Print Doctor Serial Slip' :
                 isRealEstate ? 'Print VIP Convoy Gate Pass' :
                 isElectronics ? 'Print Warranty Certificate & Invoice' :
                 'Print Official Boutique Invoice'}
              </span>
            </button>
          </div>
        </div>
      </main>

      <Footer 
        tenantSlug={tenantSlug} 
        storeName={tenant?.name}
        phone={tenant?.phone}
        email={tenant?.email}
        address={tenant?.address}
        dbid={tenant?.settings?.dbidRegistrationNo}
        tradeLicense={tenant?.settings?.tradeLicenseNo}
      />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
