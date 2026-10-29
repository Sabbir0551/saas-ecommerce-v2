'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/lib/cart-context';
import { api } from '@/lib/api';
import { trackInitiateCheckout } from '@/components/AnalyticsTracker';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Stethoscope,
  Building2,
  Laptop,
  Sparkles,
  Upload,
  Calendar,
  Clock,
  Car,
  FileText,
  BadgeCheck,
  Check,
  CreditCard,
  Receipt,
  Ticket,
  ChevronRight,
  Shield,
  HelpCircle,
} from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tenantSlug = searchParams.get('tenant') || 'fashion';

  const [tenant, setTenant] = useState<any>(null);
  const [schema, setSchema] = useState<any>(null);

  // Archetype Detection
  const bType = tenant?.businessType || (
    tenantSlug === 'medicare' || tenantSlug === 'meradenralcare' ? 'doctor' :
    tenantSlug === 'aebanproperty' ? 'real_estate' :
    tenantSlug === 'smartvolt' || tenantSlug === 'bestlaptop' || tenantSlug === 'gadgethub' ? 'laptop_computer' :
    'fashion_clothing'
  );

  const isMedical = bType === 'doctor' || bType === 'healthcare_service' || bType === 'pharmacy' || tenantSlug === 'medicare' || tenantSlug === 'meradenralcare';
  const isRealEstate = bType === 'real_estate' || tenantSlug === 'aebanproperty';
  const isElectronics = bType === 'laptop_computer' || bType === 'mobile_gadgets' || tenantSlug === 'smartvolt' || tenantSlug === 'bestlaptop' || tenantSlug === 'gadgethub';
  const isFashion = !isMedical && !isRealEstate && !isElectronics;

  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('Dhaka Metro');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(
    isMedical ? 'PAY_AT_CLINIC' : isRealEstate ? 'FREE_VIP_TOUR' : 'COD'
  );
  const [orderCustomAttributes, setOrderCustomAttributes] = useState<Record<string, any>>({});

  // Archetype-Specific Fields State
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientSymptoms, setPatientSymptoms] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);
  const [appointmentSlot, setAppointmentSlot] = useState('10:00 AM - 11:00 AM');

  const [tourDate, setTourDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [convoyPickup, setConvoyPickup] = useState('Gulshan-2 Circle Convoy Point');
  const [investmentReadiness, setInvestmentReadiness] = useState('Ready to Book / Token within 30 days');
  const [attendeeCount, setAttendeeCount] = useState('2 Persons');

  const [imeiRegistrationAgreed, setImeiRegistrationAgreed] = useState(true);
  const [warrantyType, setWarrantyType] = useState('1-Year Official National Manufacturer Warranty');

  const [sizeVerified, setSizeVerified] = useState(true);
  const [giftBox, setGiftBox] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const draftIdRef = React.useRef<string | null>(null);

  // Background auto-capture of incomplete draft when customer enters name or mobile number
  React.useEffect(() => {
    if (items.length === 0) return;
    if ((!customerPhone || customerPhone.trim().length < 6) && (!customerName || customerName.trim().length < 3)) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const draftPayload = {
          draftId: draftIdRef.current,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail.trim(),
          shippingAddress: shippingAddress.trim(),
          city,
          notes,
          paymentMethod,
          items: items.map((i) => ({
            id: i.id,
            itemId: i.id,
            variantId: i.variantId,
            title: i.title,
            variantTitle: i.variantTitle,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        };
        const res = await api.saveDraftOrder(draftPayload, tenantSlug);
        if (res?.success && res.data?.id) {
          draftIdRef.current = res.data.id;
        }
      } catch (err) {
        // Non-blocking draft auto-capture
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [customerName, customerPhone, customerEmail, shippingAddress, city, notes, paymentMethod, items, tenantSlug]);

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

  const isServiceBooking = isMedical || isRealEstate;
  const deliveryCharge = isServiceBooking ? 0 : (city.includes('Dhaka') ? 60 : 120);
  const effectiveSubtotal = (items.length === 0 && isMedical) ? 1000 : (items.length === 0 && isRealEstate) ? 0 : subtotal;
  const netTotal = paymentMethod === 'EARNEST_TOKEN' ? 25000 : (effectiveSubtotal + ((items.length > 0 && !isServiceBooking) ? deliveryCharge : 0));

  React.useEffect(() => {
    if (items.length > 0 || isServiceBooking) {
      trackInitiateCheckout(netTotal, items.length || 1);
    }
  }, [items.length, isServiceBooking]);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0 && !isServiceBooking) {
      setErrorMessage('Your shopping bag is empty! Please add items before checking out.');
      return;
    }

    const finalAddress = shippingAddress.trim() || (
      isMedical ? 'Direct Clinic / Chamber Appointment Visit' :
      isRealEstate ? `VIP Site Tour Pickup: ${convoyPickup}` :
      ''
    );

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Name and mobile number are required.');
      return;
    }

    if (!isServiceBooking && !finalAddress) {
      setErrorMessage('Complete delivery address is required.');
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
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        shippingAddress: finalAddress,
        city: isServiceBooking ? 'Dhaka' : city,
        notes,
        paymentMethod,
        orderType: isMedical ? 'APPOINTMENT' : isRealEstate ? 'REAL_ESTATE_LEAD' : schema?.orderType || 'STANDARD',
        customAttributes: {
          ...orderCustomAttributes,
          archetype: isMedical ? 'MEDICAL' : isRealEstate ? 'REAL_ESTATE' : isElectronics ? 'ELECTRONICS' : 'FASHION',
          ...(isMedical ? { patientAge, patientGender, patientSymptoms, prescriptionFile, appointmentSlot } : {}),
          ...(isRealEstate ? { tourDate, convoyPickup, investmentReadiness, attendeeCount } : {}),
          ...(isElectronics ? { imeiRegistrationAgreed, warrantyType } : {}),
          ...(isFashion ? { sizeVerified, giftBox } : {}),
        },
        items: items.length > 0 ? items.map((i) => ({
          itemId: i.id,
          variantId: i.variantId,
          quantity: i.quantity,
        })) : [
          {
            itemId: isMedical ? 'med-serial-1' : 'real-estate-tour-1',
            variantId: undefined,
            quantity: 1,
          }
        ],
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
      <Navbar tenantSlug={tenantSlug} storeName={tenant?.name || tenant?.settings?.name || (tenantSlug === 'smartvolt' ? 'SmartVolt Electrical & Automation' : undefined)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Dynamic Archetype Header */}
        <div className="mb-8 pb-4 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isMedical ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              isRealEstate ? 'bg-amber-100 text-amber-800 border border-amber-300' :
              isElectronics ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' :
              'bg-pink-100 text-pink-800 border border-pink-300'
            }`}>
              {isMedical ? '🩺 DOCTOR & CLINICAL SERIAL ENGINE' :
               isRealEstate ? '🏢 VIP PROPERTY TOUR & RESERVATION' :
               isElectronics ? '⚡ HARDWARE & OFFICIAL WARRANTY ENGINE' :
               '👗 BOUTIQUE LOOKBOOK & DESIGNER CHECKOUT'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            {isMedical ? <Stethoscope className="w-7 h-7 text-emerald-600" /> :
             isRealEstate ? <Building2 className="w-7 h-7 text-amber-600" /> :
             isElectronics ? <Laptop className="w-7 h-7 text-orange-600" /> :
             <ShoppingBag className="w-7 h-7 text-rose-600" />}
            <span>
              {isMedical ? 'Doctor Consultation & Serial Booking' :
               isRealEstate ? 'VIP Property Site Visit & Reservation Pass' :
               isElectronics ? 'Hardware Checkout & IMEI Warranty Registration' :
               'Designer Boutique & Express Delivery Checkout'}
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isMedical ? 'Provide patient details, preferred consultation time slot, and medical history.' :
             isRealEstate ? 'Select chauffeur convoy pickup location, visit date, and luxury unit preferences.' :
             isElectronics ? 'Verify warranty registration parameters and doorstep unboxing inspection options.' :
             'Review your size selections, recipient destination, and doorstep delivery options.'}
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
                <MapPin className={`w-5 h-5 ${
                  isMedical ? 'text-emerald-600' :
                  isRealEstate ? 'text-amber-600' :
                  isElectronics ? 'text-orange-600' :
                  'text-rose-600'
                }`} />
                <span>
                  {isMedical ? '1. Patient & Primary Guardian Details' :
                   isRealEstate ? '1. Client & Convoy Pickup Hub' :
                   '1. Recipient & Shipping Information'}
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isMedical ? 'Patient Full Name *' :
                     isRealEstate ? 'Client / Investor Name *' :
                     'Recipient Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder={isMedical ? 'e.g. Dr. / Mr. Anisur Rahman' : isRealEstate ? 'e.g. Engr. Tanvir Ahmed' : 'e.g. Fahmida Hossain'}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isMedical ? 'Mobile Number (For Serial SMS) *' :
                     isRealEstate ? 'Primary Mobile (For Convoy Driver) *' :
                     'Mobile Phone Number *'}
                  </label>
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

              {isMedical ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chamber Branch / Consultation Center</label>
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">MediCare Specialist Chamber — Mirpur & Dhanmondi</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200/60 text-emerald-800">
                      BMDC Registered
                    </span>
                  </div>
                </div>
              ) : isRealEstate ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">VIP Chauffeur Convoy Pickup Hub *</label>
                  <select
                    value={convoyPickup}
                    onChange={(e) => setConvoyPickup(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none font-medium bg-white"
                  >
                    <option value="Gulshan-2 Circle Convoy Hub">Gulshan-2 Circle Convoy Hub (Near The Westin Dhaka)</option>
                    <option value="Banani Kemal Ataturk Point">Banani Kemal Ataturk Point (Near Coffee World)</option>
                    <option value="Uttara Sector 3 Metro Hub">Uttara Sector 3 Metro Station Pickup Hub</option>
                    <option value="Direct Site Arrival">Direct Arrival at Arban Luxury Park (Self Drive)</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Delivery City / Zone *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none font-medium bg-white"
                  >
                    <option value="Dhaka Metro">Dhaka Metropolitan Area (Express Shipping: BDT 60)</option>
                    <option value="Outside Dhaka">Outside Dhaka / Nationwide (Standard Courier: BDT 120)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isMedical ? 'Patient Home City / Area (Optional)' :
                   isRealEstate ? 'Client Office / Residence Address (Optional)' :
                   'Detailed Street Address *'}
                </label>
                <textarea
                  rows={2}
                  required={!isServiceBooking}
                  placeholder={
                    isMedical ? 'e.g. Mirpur-10, Dhaka' :
                    isRealEstate ? 'e.g. Level 6, Banani Kemal Ataturk Avenue, Dhaka' :
                    'e.g. House 14, Road 5, Block B, Banani, Dhaka'
                  }
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Special Notes / Requests (Optional)</label>
                <input
                  type="text"
                  placeholder={
                    isMedical ? 'e.g. Patient requires wheelchair assistance' :
                    isRealEstate ? 'e.g. Interested specifically in 4,500 sqft Penthouse' :
                    'e.g. Please deliver after 5:00 PM'
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
            </div>

            {/* Section 2: Archetype-Specific Clinical / Real Estate / Tech / Fashion Modules */}
            {isMedical && (
              <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/5 border border-emerald-200 shadow-sm space-y-5">
                <div className="border-b border-emerald-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-lg">2. Clinical Consultation & Serial Specs</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                    BMDC Slot Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Patient Age</label>
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="e.g. 34"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Patient Gender</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Child">Child (Pediatric)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select 1-Hour Chamber Slot *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      '10:00 AM - 11:00 AM',
                      '11:00 AM - 12:00 PM',
                      '04:00 PM - 05:00 PM',
                      '06:00 PM - 07:00 PM',
                      '08:00 PM - 09:00 PM',
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setAppointmentSlot(slot)}
                        className={`p-2.5 rounded-xl text-xs font-bold border text-center transition ${
                          appointmentSlot === slot
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                            : 'bg-white hover:bg-emerald-50/60 text-slate-700 border-slate-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chief Complaints / Medical Symptoms</label>
                  <input
                    type="text"
                    value={patientSymptoms}
                    onChange={(e) => setPatientSymptoms(e.target.value)}
                    placeholder="e.g. Tooth sensitivity, persistent back pain, fever since 3 days"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Attach Previous Prescription / Diagnostic Report</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={prescriptionFile || ''}
                      placeholder="No prescription uploaded (Optional)"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 text-slate-600"
                    />
                    <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setPrescriptionFile(f.name);
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Upload JPG, PNG, or PDF of previous doctor advice.</p>
                </div>
              </div>
            )}

            {isRealEstate && (
              <div className="p-6 sm:p-8 rounded-3xl bg-amber-950/5 border border-amber-200 shadow-sm space-y-5">
                <div className="border-b border-amber-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900 text-lg">2. Private VIP Tour & Dossier Specs</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Complimentary Chauffeur
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Site Visit Date *</label>
                    <input
                      type="date"
                      value={tourDate}
                      onChange={(e) => setTourDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Convoy Party Size</label>
                    <select
                      value={attendeeCount}
                      onChange={(e) => setAttendeeCount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="1-2 Persons">1 - 2 Persons (Self / Partner)</option>
                      <option value="3-4 Family Members">3 - 4 Family Members</option>
                      <option value="Corporate Investment Committee">Corporate Investment Delegation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Investment Horizon & Financing</label>
                  <select
                    value={investmentReadiness}
                    onChange={(e) => setInvestmentReadiness(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="Ready to Book / Token within 30 days">Ready to Book / Token within 30 days (Instant Decision)</option>
                    <option value="Exploring for Long-Term Portfolio (3-6 Months)">Exploring for Long-Term Portfolio (3 - 6 Months)</option>
                    <option value="Seeking Structured Bank Loan / Home Financing">Seeking Structured Bank Loan / Home Financing Assistance</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-100/50 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2.5">
                  <Car className="w-5 h-5 text-amber-700 shrink-0" />
                  <p>Our dedicated Relationship Manager will arrive with the project dossier and escort you via private luxury convoy directly from your pickup hub.</p>
                </div>
              </div>
            )}

            {isElectronics && (
              <div className="p-6 sm:p-8 rounded-3xl bg-indigo-950/5 border border-indigo-200 shadow-sm space-y-4">
                <div className="border-b border-indigo-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-lg">2. IMEI & Official Warranty Policy</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    BTRC Approved
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select Hardware Warranty Tier</label>
                  <select
                    value={warrantyType}
                    onChange={(e) => setWarrantyType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="1-Year Official National Manufacturer Warranty">1-Year Official National Manufacturer Warranty (Included Free)</option>
                    <option value="2-Year Extended Hardware Care & Battery Protection">2-Year Extended Hardware Care & Battery Protection (+BDT 1,500)</option>
                  </select>
                </div>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-indigo-200 bg-white hover:bg-indigo-50/40 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={imeiRegistrationAgreed}
                    onChange={(e) => setImeiRegistrationAgreed(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 rounded mt-0.5 accent-indigo-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Register IMEI & Serial under my Mobile Number
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Ensures official warranty certificate generation, BTRC database pairing, and easy claim processing at any authorized service center.
                    </span>
                  </div>
                </label>
              </div>
            )}

            {isFashion && (
              <div className="p-6 sm:p-8 rounded-3xl bg-pink-950/5 border border-pink-200 shadow-sm space-y-4">
                <div className="border-b border-pink-100 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-600" />
                    <h3 className="font-bold text-slate-900 text-lg">2. Boutique Tailoring & Packaging</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                    7-Day Alteration Guard
                  </span>
                </div>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-pink-200 bg-white hover:bg-pink-50/40 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={sizeVerified}
                    onChange={(e) => setSizeVerified(e.target.checked)}
                    className="w-5 h-5 text-pink-600 rounded mt-0.5 accent-pink-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Size & Cut Alignment Verified
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      I have verified the size chart (S / M / L / XL / XXL) and acknowledge the 7-day hassle-free doorstep size exchange guarantee.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-pink-50/30 cursor-pointer transition">
                  <input
                    type="checkbox"
                    checked={giftBox}
                    onChange={(e) => setGiftBox(e.target.checked)}
                    className="w-5 h-5 text-pink-600 rounded mt-0.5 accent-pink-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Deliver in Signature Luxury Boutique Gift Box (+Free)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Wrapped in luxury gold tissue, velvet ribbon, and custom gift note card.
                    </span>
                  </div>
                </label>
              </div>
            )}

            {/* Section 3: Payment Methods */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Truck className={`w-5 h-5 ${
                  isMedical ? 'text-emerald-600' :
                  isRealEstate ? 'text-amber-600' :
                  isElectronics ? 'text-orange-600' :
                  'text-rose-600'
                }`} />
                <span>3. Select Payment / Confirmation Method</span>
              </h3>

              <div className="space-y-3">
                {isMedical ? (
                  <>
                    <label
                      onClick={() => setPaymentMethod('PAY_AT_CLINIC')}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === 'PAY_AT_CLINIC'
                          ? 'border-emerald-600 bg-emerald-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'PAY_AT_CLINIC'}
                          onChange={() => setPaymentMethod('PAY_AT_CLINIC')}
                          className="text-emerald-600"
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">Pay at Doctor Chamber Counter (No Advance Needed)</span>
                          <span className="text-xs text-slate-500">Pay consultation fee via cash or card upon arrival at chamber reception</span>
                        </div>
                      </div>
                      <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'PAY_AT_CLINIC' ? 'text-emerald-600' : 'text-slate-300'}`} />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('BKASH_SERIAL')}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === 'BKASH_SERIAL'
                          ? 'border-emerald-600 bg-emerald-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'BKASH_SERIAL'}
                          onChange={() => setPaymentMethod('BKASH_SERIAL')}
                          className="text-emerald-600"
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">Instant VIP Serial Confirmation via bKash / Nagad</span>
                          <span className="text-xs text-slate-500">Lock guaranteed priority serial number with SMS confirmation voucher</span>
                        </div>
                      </div>
                      <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'BKASH_SERIAL' ? 'text-emerald-600' : 'text-slate-300'}`} />
                    </label>
                  </>
                ) : isRealEstate ? (
                  <>
                    <label
                      onClick={() => setPaymentMethod('FREE_VIP_TOUR')}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === 'FREE_VIP_TOUR'
                          ? 'border-amber-600 bg-amber-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'FREE_VIP_TOUR'}
                          onChange={() => setPaymentMethod('FREE_VIP_TOUR')}
                          className="text-amber-600"
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">Complimentary VIP Convoy Tour (100% Free)</span>
                          <span className="text-xs text-slate-500">Zero booking fee. Includes chauffeur convoy pickup, project briefing & refreshments</span>
                        </div>
                      </div>
                      <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'FREE_VIP_TOUR' ? 'text-amber-600' : 'text-slate-300'}`} />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('EARNEST_TOKEN')}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === 'EARNEST_TOKEN'
                          ? 'border-amber-600 bg-amber-50/50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'EARNEST_TOKEN'}
                          onChange={() => setPaymentMethod('EARNEST_TOKEN')}
                          className="text-amber-600"
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">Earnest Money Unit Reservation Token (BDT 25,000)</span>
                          <span className="text-xs text-slate-500">Hold specific penthouse / villa for 14 days with official signed agreement</span>
                        </div>
                      </div>
                      <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'EARNEST_TOKEN' ? 'text-amber-600' : 'text-slate-300'}`} />
                    </label>
                  </>
                ) : (
                  <>
                    <label
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === 'COD'
                          ? `${isElectronics ? 'border-orange-600 bg-orange-50/50' : 'border-rose-600 bg-rose-50/50'}`
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className={isElectronics ? 'text-orange-600' : 'text-rose-600'}
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">
                            {isElectronics ? 'Cash on Delivery (Inspect & Unbox before Paying)' : 'Cash on Delivery (Doorstep COD)'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {isElectronics ? 'Inspect product seals and IMEI before handing payment to courier' : 'Pay cash upon receiving products at your doorstep'}
                          </span>
                        </div>
                      </div>
                      <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'COD' ? (isElectronics ? 'text-orange-600' : 'text-rose-600') : 'text-slate-300'}`} />
                    </label>

                    <label
                      onClick={() => setPaymentMethod('BKASH')}
                      className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === 'BKASH'
                          ? `${isElectronics ? 'border-orange-600 bg-orange-50/50' : 'border-rose-600 bg-rose-50/50'}`
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'BKASH'}
                          onChange={() => setPaymentMethod('BKASH')}
                          className={isElectronics ? 'text-orange-600' : 'text-rose-600'}
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">
                            {isFashion ? 'bKash / Nagad / Visa (Instant 5% Prepaid Cashback)' : 'Digital Mobile Wallet / Cards & EMI'}
                          </span>
                          <span className="text-xs text-slate-500">Instant digital checkout via bKash, Nagad, Visa, Mastercard</span>
                        </div>
                      </div>
                      <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'BKASH' ? (isElectronics ? 'text-orange-600' : 'text-rose-600') : 'text-slate-300'}`} />
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 sticky top-28">
              <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between">
                <span>
                  {isMedical ? 'Consultation Summary' :
                   isRealEstate ? 'Site Visit Dossier' :
                   'Order Summary'}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {items.length > 0 ? `${items.length} items` : isMedical ? '1 Consultation' : 'VIP Tour'}
                </span>
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  isMedical ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-5 h-5 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-900">Doctor Chamber Consultation Slot</span>
                        </div>
                        <span className="text-xs font-black text-emerald-700">BDT 1,000</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">Includes 1-on-1 specialist consultation, prescription, and 14-day free report review.</p>
                      <div className="text-[10px] text-slate-500 font-mono">Slot: {appointmentSlot}</div>
                    </div>
                  ) : isRealEstate ? (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-amber-600" />
                          <span className="text-xs font-bold text-slate-900">VIP Private Convoy Site Visit</span>
                        </div>
                        <span className="text-xs font-black text-amber-700">COMPLIMENTARY</span>
                      </div>
                      <p className="text-[11px] text-amber-800">Chauffeur luxury convoy, site architectural walk, and investor prospectus included.</p>
                      <div className="text-[10px] text-slate-500 font-mono">Date: {tourDate} | Pickup: {convoyPickup}</div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      <p>Your shopping bag is currently empty</p>
                      <Link href={`/?tenant=${tenantSlug}`} className="text-rose-600 font-bold hover:underline mt-2 inline-block">
                        Browse Store Catalog &rarr;
                      </Link>
                    </div>
                  )
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
                  <span>{isMedical ? 'Consultation Fee' : isRealEstate ? 'Tour / Reservation Value' : 'Subtotal'}</span>
                  <span className="font-bold text-slate-900">
                    {isRealEstate && paymentMethod === 'EARNEST_TOKEN' ? 'BDT 25,000' :
                     isRealEstate ? 'BDT 0 (Free)' :
                     `BDT ${effectiveSubtotal.toLocaleString()}`}
                  </span>
                </div>
                {!isServiceBooking && (
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-slate-900">BDT {deliveryCharge}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className={`text-lg ${
                    isMedical ? 'text-emerald-600' :
                    isRealEstate ? 'text-amber-600' :
                    isElectronics ? 'text-orange-600' :
                    'text-rose-600'
                  }`}>
                    {isRealEstate && paymentMethod === 'FREE_VIP_TOUR' ? 'FREE' :
                     `BDT ${netTotal.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || (items.length === 0 && !isServiceBooking)}
                className={`w-full py-4 rounded-2xl ${
                  isMedical ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25' :
                  isRealEstate ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25' :
                  isElectronics ? 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/25' :
                  'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25'
                } disabled:opacity-50 text-white font-extrabold text-sm shadow-xl transition active:scale-95`}
              >
                {submitting ? 'Confirming...' :
                 isMedical ? 'Confirm Doctor Serial & Consultation' :
                 isRealEstate ? 'Confirm VIP Tour & Reserve Site Pass' :
                 isElectronics ? 'Place Hardware Order & Warranty' :
                 'Confirm Boutique Order'}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Encrypted & Authenticated SaaS Engine</span>
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
