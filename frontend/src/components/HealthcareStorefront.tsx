'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  Stethoscope,
  HeartPulse,
  UserCheck,
  Calendar,
  Clock,
  Phone,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Star,
  MapPin,
  UploadCloud,
  FileText,
  ChevronRight,
  AlertCircle,
  Sparkles,
  X,
  Plus,
  Check,
  MessageSquare,
  Activity,
  Award,
  Video,
  Building,
  HelpCircle
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface HealthcareStorefrontProps {
  tenant: any;
  tenantSlug: string;
  items: any[];
  categories: any[];
  brands?: any[];
}

export function HealthcareStorefront({
  tenant,
  tenantSlug,
  items,
  categories,
}: HealthcareStorefrontProps) {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookingModalDoctor, setBookingModalDoctor] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingSlot, setBookingSlot] = useState<string>('10:00 AM - 11:00 AM');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientProblem, setPatientProblem] = useState<string>('');
  const [bookingSuccessNotice, setBookingSuccessNotice] = useState<any | null>(null);

  // Prescription Upload Modal
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<boolean>(false);
  const [prescriptionPhone, setPrescriptionPhone] = useState<string>('');
  const [prescriptionFileUploaded, setPrescriptionFileUploaded] = useState<boolean>(false);
  const [prescriptionNotice, setPrescriptionNotice] = useState<string | null>(null);

  const brandName = tenant?.name || 'MediCare Health Specialists & Chamber Care';
  const currency = tenant?.currency || 'BDT';

  // Available Time Slots for appointments
  const TIME_SLOTS = [
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:30 PM - 07:30 PM',
    '08:00 PM - 09:00 PM',
  ];

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.categoryId === selectedCategory || item.category === selectedCategory || item.slug?.includes(selectedCategory);
  });

  const handleOpenBooking = (doctor: any) => {
    setBookingModalDoctor(doctor);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) {
      alert('অনুগ্রহ করে রোগীর নাম এবং মোবাইল নাম্বার প্রদান করুন।');
      return;
    }

    // Add consultation token to cart for checkout
    addToCart({
      id: `booking-${bookingModalDoctor.id}-${Date.now()}`,
      title: `Serial: ${bookingModalDoctor.title} (${bookingSlot})`,
      price: bookingModalDoctor.price || 500,
      quantity: 1,
      image: bookingModalDoctor.images?.[0] || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
    });

    setBookingSuccessNotice({
      doctor: bookingModalDoctor.title,
      date: bookingDate,
      slot: bookingSlot,
      patient: patientName,
      serialNumber: Math.floor(100 + Math.random() * 900),
    });

    setBookingModalDoctor(null);
    setPatientName('');
    setPatientPhone('');
    setPatientProblem('');
  };

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionPhone) {
      alert('অনুগ্রহ করে আপনার ফোন নাম্বারটি দিন।');
      return;
    }
    setPrescriptionNotice('আপনার প্রেসক্রিপশন সফলভাবে জমা হয়েছে! আমাদের ফার্মাসিস্ট বা কাস্টমার সাপোর্ট ১০ মিনিটের মধ্যে কল করবে।');
    setTimeout(() => {
      setShowPrescriptionModal(false);
      setPrescriptionFileUploaded(false);
      setPrescriptionPhone('');
      setPrescriptionNotice(null);
    }, 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A101D] text-slate-100 font-sans">
      <Navbar tenantSlug={tenantSlug} storeName={brandName} />

      {/* Top Healthcare Emergency & Hotline Notice Bar */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 border-b border-teal-800/40 py-2.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-teal-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span>24/7 ইমার্জেন্সি সিরিয়াল ও বিশেষজ্ঞ চেম্বার হেল্পলাইন খোলা আছে</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:+8801700000000" className="flex items-center gap-1.5 hover:text-white transition">
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              <span>জরুরি সিরিয়াল: +880 1700-000000</span>
            </a>
            <button
              onClick={() => setShowPrescriptionModal(true)}
              className="px-2.5 py-0.5 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[11px] font-bold transition flex items-center gap-1"
            >
              <UploadCloud className="w-3 h-3" />
              <span>প্রেসক্রিপশন আপলোড</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Success Alert */}
      {bookingSuccessNotice && (
        <div className="fixed top-20 right-6 z-50 bg-teal-950 border border-teal-500/40 text-white p-5 rounded-2xl shadow-2xl max-w-sm backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-teal-300">সিরিয়াল বুকিং কনফার্মড!</h4>
              <p className="text-xs text-slate-300">
                সিরিয়াল টোকেন: <strong className="text-white">#{bookingSuccessNotice.serialNumber}</strong> ({bookingSuccessNotice.patient})
              </p>
              <p className="text-[11px] text-slate-400">
                {bookingSuccessNotice.doctor} • {bookingSuccessNotice.date} ({bookingSuccessNotice.slot})
              </p>
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/checkout?tenant=${tenantSlug}`}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition"
                >
                  পেমেন্ট সম্পন্ন করুন
                </Link>
                <button
                  onClick={() => setBookingSuccessNotice(null)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Healthcare Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-teal-950/80">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border border-teal-500/30 bg-teal-950/60 text-teal-300">
                <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                <span>BMDC Certified Specialists & Zero Wait Care</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
                নির্ভুল স্বাস্থ্যসেবায় <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400">
                  বিশেষজ্ঞ ডাক্তারের ১-ঘণ্টার কনফার্মড সিরিয়াল
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                দীর্ঘ সময় লাইনে না দাঁড়িয়ে অনলাইনে সরাসরি বিশেষজ্ঞ চিকিৎসকের নির্দিষ্ট চেম্বার ও সময়ের সিরিয়াল বুক করুন। সাথে ডিজিটাল প্রেসক্রিপশন ও অভিজ্ঞ পেশেন্ট কেয়ার সহায়তা।
              </p>

              {/* Verified Value Props */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-300 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>BMDC ভেরিফাইড ডাক্তার</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl">
                  <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>জিরো ওয়েটিং টাইম</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
                  <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>নিরাপদ ডিজিটাল ট্র্যাকিং</span>
                </div>
              </div>

              {/* Hero Action CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-4">
                <a
                  href="#specialists"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 transition active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>ডাক্তার সিরিয়াল দেখুন</span>
                </a>
                <button
                  onClick={() => setShowPrescriptionModal(true)}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-teal-300 font-semibold text-sm border border-teal-800/60 flex items-center gap-2 transition"
                >
                  <UploadCloud className="w-4 h-4 text-teal-400" />
                  <span>প্রেসক্রিপশন আপলোড করুন</span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-gradient-to-b from-teal-950/40 via-slate-900/70 to-slate-950 p-3 rounded-3xl border border-teal-700/30 shadow-2xl">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80"
                    alt="Senior Specialist Doctor"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 bg-teal-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-teal-500/40 text-[11px] font-bold text-teal-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-teal-400" />
                    <span>BMDC Certified Specialist Clinic</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">চেম্বার ও অনলাইন সিরিয়াল</p>
                        <p className="text-[11px] text-teal-400 font-medium">প্রতিটি ভিজিট নিশ্চিত ১-ঘণ্টা স্লটে</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        স্লট ওপেন
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Consultation Stats */}
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <p className="text-base font-extrabold text-teal-400">১০০%</p>
                    <p className="text-[10px] text-slate-400">ভেরিফাইড ডাক্তার</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <p className="text-base font-extrabold text-emerald-400">১৫,০০০+</p>
                    <p className="text-[10px] text-slate-400">রোগীর আস্থা</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    <p className="text-base font-extrabold text-teal-400">১০ মি.</p>
                    <p className="text-[10px] text-slate-400">গড় সিরিয়াল সময়</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Four Healthcare Trust Pillars */}
      <section className="py-8 bg-slate-900/40 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">BMDC সার্টিফাইড বিশেষজ্ঞ</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">অভিজ্ঞ এফসিপিএস ও কনসালটেন্ট চিকিৎসকদের চেম্বার।</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">জিরো ওয়েটিং টাইম</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">১-ঘণ্টার নির্দিষ্ট টাইম-স্লট বুকিং থাকায় কোনো বাড়তি অপেক্ষা নয়।</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">ডিজিটাল প্রেসক্রিপশন রেকর্ড</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">ভিজিটের পর প্রেসক্রিপশন ও ফলো-আপ ডাটা অনলাইনে সংরক্ষিত থাকে।</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">ডেডিকেটেড পেশেন্ট সাপোর্ট</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">চেম্বার লোকেশন, সিরিয়াল কনফার্মেশন ও এসএমএস অ্যালার্ট সুবিধা।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Specialist Directory & Appointment Services */}
      <section id="specialists" className="py-14 sm:py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400">
                Specialist Chambers & Medical Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                বিশেষজ্ঞ ডাক্তার ও স্বাস্থ্যসেবা তালিকা
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                পছন্দের বিশেষজ্ঞ নির্বাচন করে নির্দিষ্ট চেম্বার ও সময়ে সরাসরি সিরিয়াল গ্রহণ করুন
              </p>
            </div>

            {/* Category / Department Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === 'all'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                সকল ডিপার্টমেন্ট ({items.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug || cat.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedCategory === (cat.slug || cat.name)
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((doctor) => {
              const docImage = doctor.images?.[0] || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80';
              const consultationFee = Number(doctor.price || 500);

              return (
                <div
                  key={doctor.id}
                  className="bg-slate-900/60 rounded-3xl border border-slate-800/80 hover:border-teal-500/40 p-5 transition flex flex-col justify-between group shadow-xl hover:shadow-teal-900/10"
                >
                  <div className="space-y-4">
                    {/* Doctor Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-teal-500/30 bg-slate-800">
                        <img
                          src={docImage}
                          alt={doctor.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-wider border border-teal-500/20">
                          {doctor.category || 'Specialist Consultant'}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition leading-snug">
                          {doctor.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {doctor.shortDescription || 'MBBS, FCPS, Senior Consultant'}
                        </p>
                      </div>
                    </div>

                    {/* Qualifications & Chamber Info */}
                    <div className="space-y-2 py-2 border-y border-slate-800/60 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-teal-400" />
                          চেম্বার:
                        </span>
                        <span className="font-medium text-white">ধানমন্ডি স্পেশালাইজড কেয়ার</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-teal-400" />
                          ভিজিট সময়:
                        </span>
                        <span className="font-medium text-teal-300">প্রতিদিন বিকাল ৫টা - রাত ৯টা</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          সিরিয়াল স্লট:
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          আজ ৩টি স্লট বাকি
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Consultation Fee & CTA */}
                  <div className="pt-4 mt-2 flex items-center justify-between gap-3 border-t border-slate-800/60">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">পরামর্শ ফি</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-black text-white">৳{consultationFee.toLocaleString()}</span>
                        {doctor.comparePrice && (
                          <span className="text-xs text-slate-500 line-through">৳{doctor.comparePrice}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenBooking(doctor)}
                        className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/30 flex items-center gap-1.5 transition active:scale-95"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>সিরিয়াল নিন</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
              <Stethoscope className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">এই ডিপার্টমেন্টে বর্তমানে কোনো ডাক্তার তালিকাভুক্ত নেই</h3>
              <p className="text-xs text-slate-500">অন্যান্য বিভাগ নির্বাচন করুন অথবা হেল্পলাইনে যোগাযোগ করুন।</p>
            </div>
          )}

        </div>
      </section>

      {/* 4. Prescription Upload Helper Banner */}
      <section className="py-12 bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/90 rounded-3xl border border-teal-500/30 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                <UploadCloud className="w-3.5 h-3.5 text-teal-400" />
                <span>প্রেসক্রিপশন আপলোড ও মেডিসিন ডেলিভারি</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                ডাক্তারের প্রেসক্রিপশন আছে? ছবি আপলোড করুন
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                প্রেসক্রিপশনের ছবি তুলে আমাদের পাঠিয়ে দিন। আমাদের রেজিস্টার্ড ফার্মাসিস্ট ঔষধ যাচাই করে হোম ডেলিভারি কনফার্ম করবেন।
              </p>
            </div>

            <button
              onClick={() => setShowPrescriptionModal(true)}
              className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-xl shadow-teal-600/30 flex items-center gap-2 transition shrink-0"
            >
              <UploadCloud className="w-4 h-4" />
              <span>প্রেসক্রিপশন পাঠান (ফ্রি)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Booking Serial Modal */}
      {bookingModalDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">সিরিয়াল বুকিং ফর্ম</span>
                <h3 className="text-lg font-bold text-white">{bookingModalDoctor.title}</h3>
                <p className="text-xs text-slate-400">পরামর্শ ফি: ৳{bookingModalDoctor.price} | ১-ঘণ্টা স্লট</p>
              </div>
              <button
                onClick={() => setBookingModalDoctor(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">ভিজিটের তারিখ</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">পছন্দের সময় স্লট</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot} (কনফার্মড)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">রোগীর পূর্ণ নাম *</label>
                <input
                  type="text"
                  placeholder="উদাঃ মোঃ আব্দুল্লাহ"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">মোবাইল নাম্বার (এসএমএস সিরিয়ালের জন্য) *</label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">সমস্যার সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)</label>
                <textarea
                  rows={2}
                  placeholder="যেমনঃ জ্বর, দাঁতের তীব্র ব্যথা বা রুটিন চেকআপ..."
                  value={patientProblem}
                  onChange={(e) => setPatientProblem(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModalDoctor(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-lg shadow-teal-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>সিরিয়াল কনফার্ম করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Upload Modal */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">প্রেসক্রিপশন আপলোড সার্ভিস</span>
                <h3 className="text-lg font-bold text-white">প্রেসক্রিপশন ফাইল জমা দিন</h3>
              </div>
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {prescriptionNotice ? (
              <div className="p-4 rounded-2xl bg-teal-950 border border-teal-500/40 text-teal-200 text-xs space-y-2 text-center animate-in zoom-in-95">
                <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                <p className="font-semibold">{prescriptionNotice}</p>
              </div>
            ) : (
              <form onSubmit={handlePrescriptionSubmit} className="space-y-4 text-xs">
                {/* Upload drag/click area */}
                <div
                  onClick={() => setPrescriptionFileUploaded(true)}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                    prescriptionFileUploaded
                      ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                      : 'border-slate-700 bg-slate-950/60 text-slate-400 hover:border-teal-500 hover:text-teal-300'
                  }`}
                >
                  <UploadCloud className="w-8 h-8 mx-auto mb-2 text-teal-400" />
                  {prescriptionFileUploaded ? (
                    <div className="space-y-1">
                      <p className="font-bold text-emerald-400">✓ prescription_scan_01.jpg সংযুক্ত হয়েছে</p>
                      <p className="text-[11px] text-slate-400">ফাইল পরিবর্তন করতে পুনরায় ক্লিক করুন</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-semibold text-white">প্রেসক্রিপশনের ছবি সিলেক্ট করুন</p>
                      <p className="text-[10px] text-slate-500">JPG, PNG অথবা PDF ফাইল সাপোর্ট করে (সর্বোচ্চ ১০ এমবি)</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">আপনার সচল মোবাইল নাম্বার *</label>
                  <input
                    type="tel"
                    placeholder="017XXXXXXXX"
                    value={prescriptionPhone}
                    onChange={(e) => setPrescriptionPhone(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    আমাদের ফার্মাসিস্ট এই নাম্বারে কল করে ঔষধের নাম ও ডোজ নিশ্চিত করবেন।
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPrescriptionModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                  >
                    বন্ধ
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-lg shadow-teal-600/30 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>জমা দিন</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
