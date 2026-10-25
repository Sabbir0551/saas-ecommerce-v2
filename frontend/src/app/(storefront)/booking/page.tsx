'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { Calendar as CalendarIcon, Clock, CheckCircle2, User, Phone, Mail, FileText, AlertCircle, Sparkles } from 'lucide-react';

function ServiceBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tenantSlug = searchParams.get('tenant') || 'medicare';
  const paramItemId = searchParams.get('itemId');

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [slots, setSlots] = useState<any[]>([]);
  const [service, setService] = useState<any>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSlots() {
      setLoadingSlots(true);
      setErrorMsg(null);
      try {
        const itemId = paramItemId || 'default-service';
        const res = await api.getAvailableSlots(selectedDate, itemId, tenantSlug);

        if (res?.success && res.data?.slots) {
          setSlots(res.data.slots);
          setService(res.data.service);
        } else {
          setSlots([
            { startTime: '10:00', endTime: '11:00', label: '10:00 AM - 11:00 AM', availableSeats: 2, isAvailable: true },
            { startTime: '11:00', endTime: '12:00', label: '11:00 AM - 12:00 PM', availableSeats: 1, isAvailable: true },
            { startTime: '12:00', endTime: '13:00', label: '12:00 PM - 01:00 PM', availableSeats: 0, isAvailable: false },
            { startTime: '14:00', endTime: '15:00', label: '02:00 PM - 03:00 PM', availableSeats: 2, isAvailable: true },
            { startTime: '15:00', endTime: '16:00', label: '03:00 PM - 04:00 PM', availableSeats: 2, isAvailable: true },
            { startTime: '16:00', endTime: '17:00', label: '04:00 PM - 05:00 PM', availableSeats: 1, isAvailable: true },
            { startTime: '17:00', endTime: '18:00', label: '05:00 PM - 06:00 PM', availableSeats: 2, isAvailable: true },
            { startTime: '18:00', endTime: '19:00', label: '06:00 PM - 07:00 PM', availableSeats: 2, isAvailable: true },
          ]);
          setService({
            id: 'med-1',
            title: 'Senior Dental Consultation & Full OPG Screening',
            price: 500,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate, tenantSlug, paramItemId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg('Please select a 1-hour time slot.');
      return;
    }
    if (!customerName || !customerPhone) {
      setErrorMsg('Patient name and contact mobile number are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress: 'Direct Clinic Visit',
        city: 'Dhaka',
        notes,
        bookingDate: selectedDate,
        bookingTime: selectedSlot,
        serviceItemId: service?.id || 'med-1',
        paymentMethod: 'PAY_AT_CLINIC',
      };

      const res = await api.placeOrder(payload, tenantSlug);

      if (res?.success && res.data?.orderNumber) {
        router.push(`/order-success/${res.data.orderNumber}?tenant=${tenantSlug}`);
      } else {
        setErrorMsg(res?.message || 'Failed to confirm booking.');
      }
    } catch {
      setErrorMsg('Unable to connect to clinic reservation server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar tenantSlug={tenantSlug} storeName="MediCare Specialized Health Clinic" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guaranteed 1-Hour Time Slot Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Reserve Appointment & Doctor Consultation
          </h1>
          <p className="text-sm text-slate-600">
            Choose your preferred date and 1-hour time window. You will receive an instant digital token upon booking.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Step 1 & 2: Date & Slot Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Service Summary Card */}
            {service && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Selected Service</span>
                  <h3 className="font-bold text-slate-900 text-base">{service.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Consultation Fee</span>
                  <span className="text-lg font-extrabold text-slate-900">BDT {service.price}</span>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                <span>Select Appointment Date:</span>
              </label>

              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
              />
            </div>

            {/* 1-Hour Slots Grid */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Available 1-Hour Slots ({selectedDate}):</span>
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {loadingSlots ? 'Loading slots...' : 'Real-time capacity'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot.startTime;

                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot.startTime)}
                      className={`p-3.5 rounded-2xl text-left border transition flex items-center justify-between ${
                        !slot.isAvailable
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                          : 'bg-white border-slate-200 hover:border-emerald-500 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{slot.label}</span>
                        <span
                          className={`text-[11px] block mt-0.5 ${
                            isSelected ? 'text-emerald-100' : slot.isAvailable ? 'text-emerald-600 font-medium' : 'text-slate-400'
                          }`}
                        >
                          {slot.isAvailable ? `${slot.availableSeats} slots left` : 'Fully Booked'}
                        </span>
                      </div>

                      {isSelected && <CheckCircle2 className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Patient Information Form */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5 sticky top-28">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Patient / Client Information</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Contact Mobile Number (for SMS token) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+880 1711-000000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="patient@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Medical Symptoms or Clinical Notes
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <textarea
                      rows={2}
                      placeholder="Briefly describe dental pain or previous prescription history"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Selected Slot Summary */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Date:</span>
                    <span className="font-bold text-slate-900">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Selected Slot:</span>
                    <span className="font-bold text-emerald-600">{selectedSlot || 'None selected'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-200">
                    <span>Consultation Fee:</span>
                    <span className="font-extrabold text-slate-900">BDT {service?.price || 500} (Pay at Clinic)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedSlot}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition active:scale-95"
                >
                  {submitting ? 'Confirming Appointment...' : 'Confirm Appointment Slot'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer tenantSlug={tenantSlug} storeName="MediCare Specialized Health Clinic" />
    </div>
  );
}

export default function ServiceBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading Reservation Engine...</div>}>
      <ServiceBookingContent />
    </Suspense>
  );
}
