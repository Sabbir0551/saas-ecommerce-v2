'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { api } from '@/lib/api';
import { trackInitiateCheckout } from '@/components/AnalyticsTracker';
import { ShoppingBag, Truck, ShieldCheck, MapPin, Phone, User, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Dhaka Metro');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderCustomAttributes, setOrderCustomAttributes] = useState<Record<string, any>>({});
  const [schema, setSchema] = useState<any>(null);
  const [tenant, setTenant] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadTenantSchema() {
      try {
        const tRes = await api.getTenant(tenantSlug);
        if (tRes?.success && tRes.data) {
          setTenant(tRes.data);
          const catKey = tRes.data.businessType || 'general';
          const sRes = await api.getCategorySchema(catKey);
          if (sRes?.success && sRes.data) {
            setSchema(sRes.data);
            // Pre-initialize boolean confirmation fields (e.g. size_chart_verified) so checkout isn't blocked
            if (Array.isArray(sRes.data.orderFields)) {
              const defaults: Record<string, any> = {};
              sRes.data.orderFields.forEach((f: any) => {
                if (f.type === 'boolean') {
                  defaults[f.key] = true;
                }
              });
              setOrderCustomAttributes((prev) => ({ ...defaults, ...prev }));
            }
          }
        }
      } catch {}
    }
    loadTenantSchema();
  }, [tenantSlug]);

  const deliveryCharge = city.includes('Dhaka') ? 60 : 120;
  const netTotal = subtotal + (items.length > 0 ? deliveryCharge : 0);

  React.useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(netTotal, items.length);
    }
  }, [items.length]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage('Your shopping bag is empty! Please add items before checking out.');
      return;
    }
    if (!customerName || !customerPhone || !shippingAddress) {
      setErrorMessage('Full name, mobile number, and complete delivery address are required.');
      return;
    }

    // Validate required orderFields from schema if present
    if (schema?.orderFields) {
      for (const field of schema.orderFields) {
        const val = orderCustomAttributes[field.key];
        if (field.required && (val === undefined || val === '' || val === false)) {
          setErrorMessage(`${field.label_en || field.label_bn} is required.`);
          document.getElementById('section-order-custom-attributes')?.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const orderData = {
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        city,
        notes,
        paymentMethod,
        orderType: schema?.orderType || 'STANDARD',
        customAttributes: orderCustomAttributes,
        items: items.map((i) => ({
          itemId: i.id,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      };

      const res = await api.placeOrder(orderData, tenantSlug);

      if (res?.success && res.data?.orderNumber) {
        clearCart();
        router.push(`/order-success/${res.data.orderNumber}?tenant=${tenantSlug}`);
      } else {
        setErrorMessage(res?.message || 'Failed to complete order placement.');
      }
    } catch {
      setErrorMessage('Unable to connect to order processing server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar tenantSlug={tenantSlug} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="mb-8 pb-4 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-rose-600" />
            <span>Secure Checkout & Order Placement</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provide your recipient details and delivery destination to finalize your order.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <span>1. Shipping & Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Recipient Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+880 1711-000000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Delivery City / Zone *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none font-medium"
                >
                  <option value="Dhaka Metro">Dhaka Metropolitan Area (Express Shipping: BDT 60)</option>
                  <option value="Outside Dhaka">Outside Dhaka / Nationwide (Standard Shipping: BDT 120)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Street Address *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. House 14, Road 5, Block B, Banani, Dhaka"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Order Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Please deliver after 5:00 PM"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            {/* Dynamic Category Specific Order Fields (from Specification PDF) */}
            {schema?.orderFields && schema.orderFields.length > 0 && (
              <div id="section-order-custom-attributes" className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 scroll-mt-20">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <span>2. {schema.name_en || schema.name_bn} — Order Specifications</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please provide required category information for accurate order fulfillment.
                  </p>
                </div>

                <div className="space-y-4">
                  {schema.orderFields.map((f: any) => {
                    const curVal = orderCustomAttributes[f.key] !== undefined ? orderCustomAttributes[f.key] : '';
                    return (
                      <div key={f.key} className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <span>{f.label_en || f.label_bn}</span>
                          {f.required && (
                            <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold">
                              Required
                            </span>
                          )}
                        </label>

                        {f.type === 'file' && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={curVal}
                              onChange={(e) => setOrderCustomAttributes(prev => ({ ...prev, [f.key]: e.target.value }))}
                              placeholder="Enter file URL or upload..."
                              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                            />
                            <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1">
                              <span>Upload</span>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setOrderCustomAttributes(prev => ({ ...prev, [f.key]: `/storage/prescriptions/${file.name}` }));
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}

                        {f.type === 'select' && (
                          <select
                            value={curVal}
                            onChange={(e) => setOrderCustomAttributes(prev => ({ ...prev, [f.key]: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                          >
                            <option value="">-- Select option --</option>
                            {(f.options || []).map((opt: string) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}

                        {f.type === 'boolean' && (
                          <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer transition">
                            <input
                              type="checkbox"
                              checked={Boolean(curVal)}
                              onChange={(e) => setOrderCustomAttributes(prev => ({ ...prev, [f.key]: e.target.checked }))}
                              className="w-5 h-5 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
                            />
                            <div className="flex-1">
                              <span className="text-xs font-semibold text-slate-800 block">
                                {f.help_text_en || f.help_text_bn || 'I agree with the terms and verification details'}
                              </span>
                              {Boolean(curVal) && (
                                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                          </label>
                        )}

                        {f.type !== 'file' && f.type !== 'select' && f.type !== 'boolean' && (
                          <input
                            type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                            value={curVal}
                            placeholder={f.help_text_en || f.help_text_bn || `Enter ${f.label_en || f.label_bn}...`}
                            onChange={(e) => setOrderCustomAttributes(prev => ({ ...prev, [f.key]: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                          />
                        )}

                        {(f.help_text_en || f.help_text_bn) && (
                          <p className="text-[11px] text-slate-400">{f.help_text_en || f.help_text_bn}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-600" />
                <span>3. Select Payment Method</span>
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'COD'
                      ? 'border-rose-600 bg-rose-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="text-rose-600"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-slate-500">Pay cash upon receiving products at your doorstep</span>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'COD' ? 'text-rose-600' : 'text-slate-300'}`} />
                </label>

                <label
                  onClick={() => setPaymentMethod('BKASH')}
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    paymentMethod === 'BKASH'
                      ? 'border-rose-600 bg-rose-50/50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'BKASH'}
                      onChange={() => setPaymentMethod('BKASH')}
                      className="text-rose-600"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">Digital Mobile Wallet / Cards</span>
                      <span className="text-xs text-slate-500">Instant digital checkout via bKash, Nagad, Visa, Mastercard</span>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'BKASH' ? 'text-rose-600' : 'text-slate-300'}`} />
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 sticky top-28">
              <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {items.length} items
                </span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <p>Your shopping bag is currently empty</p>
                    <Link href={`/?tenant=${tenantSlug}`} className="text-rose-600 font-bold hover:underline mt-2 inline-block">
                      Browse Store Catalog &rarr;
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.id}-${item.variantId}`} className="py-3 flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                        <span className="text-xs text-slate-500 block">BDT {item.price.toLocaleString()}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                            className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                            className="w-5 h-5 rounded bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.variantId)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">BDT {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-900">BDT {deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-rose-600 text-lg">BDT {netTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl shadow-rose-600/25 transition active:scale-95"
              >
                {submitting ? 'Processing Order...' : 'Confirm Order'}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Encrypted & Secure Digital Checkout</span>
              </div>
            </div>
          </div>
        </form>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
