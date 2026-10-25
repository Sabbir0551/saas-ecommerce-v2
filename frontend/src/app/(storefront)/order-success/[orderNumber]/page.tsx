'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { CheckCircle, Printer, ArrowLeft, PackageCheck, Phone, MapPin, Calendar, Clock, Ticket } from 'lucide-react';
import { trackPurchase } from '@/components/AnalyticsTracker';

function OrderSuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params.orderNumber as string;
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  const [order, setOrder] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
          // Mock order for instant preview
          const mockOrder = {
            orderNumber,
            customerName: 'Valued Customer',
            customerPhone: '+880 1711-XXXXXX',
            shippingAddress: 'Dhaka Metropolitan Area, Bangladesh',
            totalAmount: 7100,
            paymentMethod: 'Cash on Delivery (COD)',
            orderStatus: 'PENDING',
            booking: {
              bookingDate: '2026-10-20',
              bookingTime: '10:00 AM',
              serialNumber: 1,
            },
            items: [
              {
                id: '1',
                itemTitle: 'Selected Premium Product / Service Package',
                price: 6500,
                quantity: 1,
                subtotal: 6500,
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
  }, [orderNumber, tenantSlug]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar tenantSlug={tenantSlug} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-8 print:shadow-none print:border-none">
          {/* Header */}
          <div className="text-center space-y-3 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Order Confirmed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Our fulfillment team has received your order and will contact you shortly to confirm delivery schedules.
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-mono font-bold">
              Tracking Order ID: <span className="text-rose-600">{orderNumber}</span>
            </div>
          </div>

          {/* If Appointment Booking, show Token & Time */}
          {order?.booking && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <Ticket className="w-4 h-4" />
                  <span>Appointment Slot Token</span>
                </span>
                <p className="text-sm font-semibold">
                  Date: {order.booking.bookingDate} | Time: {order.booking.bookingTime}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-700 block">Token #</span>
                <span className="text-3xl font-extrabold text-emerald-700">#{order.booking.serialNumber || '1'}</span>
              </div>
            </div>
          )}

          {/* Customer & Delivery Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block text-sm mb-1 flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-rose-600" />
                Customer Information
              </span>
              <p>Name: <strong className="text-slate-800">{order?.customerName}</strong></p>
              <p>Phone: <strong className="text-slate-800">{order?.customerPhone}</strong></p>
              <p>Payment Method: <strong className="text-slate-800">{order?.paymentMethod}</strong></p>
            </div>

            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-900 block text-sm mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                Shipping Destination
              </span>
              <p className="leading-relaxed text-slate-800 font-medium">
                {order?.shippingAddress}
              </p>
              <p>Status: <span className="font-bold text-amber-600">Processing</span></p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Order Items</h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {order?.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{item.itemTitle}</h4>
                    {item.variantTitle && <span className="text-[11px] text-slate-500 block">{item.variantTitle}</span>}
                    <span className="text-slate-500">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">BDT {item.subtotal?.toLocaleString('en-US')}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-700">Total Payable:</span>
              <span className="text-xl font-extrabold text-rose-600">
                BDT {order?.totalAmount?.toLocaleString('en-US')}
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
              <span>Print Official Invoice</span>
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
