'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Smartphone,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Settings2,
  Sparkles,
  Zap,
  RefreshCw,
  Sliders,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface NotificationProps {
  tenantSlug: string;
  tenantInfo: any;
  isMedical?: boolean;
  isRealEstate?: boolean;
  isElectronics?: boolean;
}

export default function NotificationEngineTab({
  tenantSlug,
  tenantInfo,
  isMedical,
  isRealEstate,
  isElectronics,
}: NotificationProps) {
  const storeName = tenantInfo?.name || tenantSlug.toUpperCase();

  // Channel toggle states
  const [channels, setChannels] = useState({
    whatsapp: true,
    sms: true,
    email: false,
  });

  // Active trigger for editing
  const [activeTrigger, setActiveTrigger] = useState<string>(
    isMedical
      ? 'appointment_confirmed'
      : isRealEstate
      ? 'site_visit_reminder'
      : isElectronics
      ? 'warranty_activated'
      : 'order_dispatched'
  );

  // Template states
  const [templates, setTemplates] = useState<Record<string, { wa: string; sms: string }>>({
    order_created: {
      wa: `নমস্কার {customer_name}! 🛍️\n\n${storeName}-এ আপনার অর্ডার #{order_number} সফলভাবে গৃহীত হয়েছে।\n💰 সর্বমোট: ৳{total_amount} (ক্যাশ অন ডেলিভারি)\n\nলাইভ অর্ডার ট্র্যাক করতে ভিজিট করুন: {tracking_link}\nযেকোনো সহায়তায় কল করুন: ${tenantInfo?.phone || '01811-223344'}। ধন্যবাদ!`,
      sms: `[${storeName}] প্রিয় {customer_name}, অর্ডার #{order_number} গৃহীত হয়েছে। মোট: ৳{total_amount}। ট্র্যাকিং: {tracking_link}`,
    },
    order_dispatched: {
      wa: `সুখবর {customer_name}! 🚚\n\nআপনার অর্ডার #{order_number} কুরিয়ারে হস্তান্তর করা হয়েছে।\n📦 ট্র্যাকিং কোড: {tracking_code} ({courier_name})\n💵 ডেলিভারির সময় প্রদেয়: ৳{total_amount}\n\nপার্সেলটি ট্র্যাক করুন: {tracking_link}\n\n${storeName} সাথে থাকার জন্য ধন্যবাদ!`,
      sms: `[${storeName}] অর্ডার #{order_number} কুরিয়ারে পাঠানো হয়েছে। পার্সেল ট্র্যাক করুন: {tracking_link}`,
    },
    appointment_confirmed: {
      wa: `সম্মানিত {customer_name}, 🩺\n\n${storeName}-এ আপনার সিরিয়াল কনফার্ম হয়েছে।\n👨‍⚕️ কনসালট্যান্ট: {doctor_name}\n🕒 তারিখ ও সময়: {appointment_time}\n📍 চেম্বার রুম: ৩০২ (৩য় তলা), ধানমন্ডি শাখা\n\nদয়া করে ১৫ মিনিট পূর্বে উপস্থিত থাকুন। ডিজিটাল স্লিপ: {tracking_link}`,
      sms: `[${storeName}] সিরিয়াল কনফার্ম! ডাঃ: {doctor_name}, সময়: {appointment_time}। ডিজিটাল স্লিপ: {tracking_link}`,
    },
    site_visit_reminder: {
      wa: `প্রিয় {customer_name}, 🏢\n\nআগামীকাল আপনার কাঙ্ক্ষিত প্রজেক্ট "{property_title}" প্রাইভেট সাইট ভিজিট নির্ধারিত রয়েছে।\n🕒 সময়: {appointment_time}\n📍 লোকেশন: {property_address}\n🚗 সাইট ম্যানেজার: তানভীর আহমেদ ({tenantInfo?.phone || '01911-001122'})\n\nট্যুর কনফার্মেশন ও রুট ম্যাপ: {tracking_link}`,
      sms: `[${storeName}] প্রজেক্ট {property_title} সাইট ভিজিট রিমাইন্ডার! সময়: {appointment_time}। লোকেশন ও রুট: {tracking_link}`,
    },
    warranty_activated: {
      wa: `অভিনন্দন {customer_name}! ⚡\n\nআপনার ক্রয়কৃত ডিভাইসের অফিসিয়াল ওয়ারেন্টি স্বয়ংক্রিয়ভাবে সক্রিয় হয়েছে।\n📟 পণ্য: {product_name}\n🔢 সিরিয়াল / IMEI: {serial_number}\n🛡️ ওয়ারেন্টি মেয়াদ: ২ বছর (২৪ মাস পার্টস ও সার্ভিস)\n\nওয়ারেন্টি ডিজিটাল সার্টিফিকেট: {tracking_link}\n${storeName}`,
      sms: `[${storeName}] ওয়ারেন্টি সক্রিয়! আইটেম: {product_name}, সিরিয়াল: {serial_number}। সার্টিফিকেট: {tracking_link}`,
    },
  });

  // Test dispatch state
  const [testPhone, setTestPhone] = useState('01711223344');
  const [testDispatchSuccess, setTestDispatchSuccess] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Simulated live delivery logs
  const [logs, setLogs] = useState([
    {
      id: 'log_01',
      recipient: '01819-887766',
      customerName: 'Aigars Silkalns',
      channel: 'whatsapp',
      event: isMedical ? 'Appointment Confirmed' : 'Order Dispatched',
      status: 'Delivered',
      time: '2 mins ago',
      cost: '৳০.৪৮',
    },
    {
      id: 'log_02',
      recipient: '01712-334455',
      customerName: 'Nasir Uddin',
      channel: 'sms',
      event: 'OTP Verification',
      status: 'Delivered',
      time: '14 mins ago',
      cost: '৳০.২৫',
    },
    {
      id: 'log_03',
      recipient: '01914-556677',
      customerName: 'Farhana Chowdhury',
      channel: 'whatsapp',
      event: isRealEstate ? 'Site Visit Reminder' : 'Order Confirmation',
      status: 'Read',
      time: '42 mins ago',
      cost: '৳০.৪৮',
    },
    {
      id: 'log_04',
      recipient: '01611-998822',
      customerName: 'Kamrul Hasan',
      channel: 'sms',
      event: 'Warranty Voucher',
      status: 'Delivered',
      time: '1 hour ago',
      cost: '৳০.২৫',
    },
  ]);

  const handleSendTest = () => {
    setIsSending(true);
    setTestDispatchSuccess(null);
    setTimeout(() => {
      setIsSending(false);
      setTestDispatchSuccess(`সফলভাবে টেস্ট নোটিফিকেশন পাঠানো হয়েছে (${testPhone})-এ!`);
      const newLog = {
        id: `log_${Date.now()}`,
        recipient: testPhone,
        customerName: 'Test Recipient',
        channel: 'whatsapp',
        event: activeTrigger.replace('_', ' ').toUpperCase(),
        status: 'Delivered',
        time: 'Just now',
        cost: '৳০.৪৮',
      };
      setLogs([newLog, ...logs]);
      setTimeout(() => setTestDispatchSuccess(null), 5000);
    }, 900);
  };

  const getTriggerLabel = (key: string) => {
    switch (key) {
      case 'order_created':
        return '🛒 Order Created / Serial Placed';
      case 'order_dispatched':
        return '🚚 Parcel Dispatched (Steadfast/Pathao)';
      case 'appointment_confirmed':
        return '🩺 Doctor Serial Confirmed';
      case 'site_visit_reminder':
        return '🏢 Real Estate Site Visit Reminder';
      case 'warranty_activated':
        return '⚡ Serial/IMEI Warranty Activated';
      default:
        return key;
    }
  };

  const activeWaText = templates[activeTrigger]?.wa || '';
  const activeSmsText = templates[activeTrigger]?.sms || '';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-[#0B132B]/80 to-teal-950/70 border border-emerald-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Update 7 • Enterprise Engine
              </span>
              <span className="flex items-center gap-1 text-[11px] text-teal-300 font-mono">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> WhatsApp Cloud & BD SMS API
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              মাল্টি-চ্যানেল অটোমেটেড নোটিফিকেশন ইঞ্জিন
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              অর্ডার, কুরিয়ার ট্র্যাকিং, ডাক্তারের অ্যাপয়েন্টমেন্ট কিংবা রিয়েল এস্টেট সাইট ভিজিটের তাৎক্ষণিক হোয়াটসঅ্যাপ ও এসএমএস অটোমেশন।
            </p>
          </div>

          {/* Channel quick toggles */}
          <div className="flex items-center gap-2 bg-[#0E1528] p-2 rounded-xl border border-emerald-500/30 shrink-0">
            <button
              onClick={() => setChannels({ ...channels, whatsapp: !channels.whatsapp })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                channels.whatsapp
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp {channels.whatsapp ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setChannels({ ...channels, sms: !channels.sms })}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                channels.sms
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> SMS {channels.sms ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Trigger List, Template Editor & Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triggers & Template Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Trigger Selector */}
          <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>১. অটোমেটেড ইভেন্ট ট্র্রিগার নির্বাচন করুন</span>
              <span className="text-[11px] text-emerald-400 font-mono">5 Active Rules</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.keys(templates).map((key) => {
                const isActive = activeTrigger === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTrigger(key)}
                    className={`flex items-center justify-between p-3 rounded-xl text-left border transition text-xs font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-950/60 to-teal-950/40 text-emerald-300 border-emerald-500/50 shadow-md'
                        : 'bg-[#12192C]/60 text-slate-300 border-slate-800/80 hover:bg-[#18213A]'
                    }`}
                  >
                    <span className="truncate">{getTriggerLabel(key)}</span>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Text Editor */}
          <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>২. হোয়াটসঅ্যাপ মেসেজ টেমপ্লেট</span>
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="bg-[#12192C] px-2 py-0.5 rounded border border-slate-800 font-mono">
                  {'{customer_name}'}
                </span>
                <span className="bg-[#12192C] px-2 py-0.5 rounded border border-slate-800 font-mono">
                  {'{tracking_link}'}
                </span>
              </div>
            </div>

            <textarea
              rows={6}
              value={activeWaText}
              onChange={(e) =>
                setTemplates({
                  ...templates,
                  [activeTrigger]: { ...templates[activeTrigger], wa: e.target.value },
                })
              }
              className="w-full bg-[#11172A] border border-slate-700/80 rounded-xl p-3 text-xs md:text-sm text-slate-200 font-sans focus:outline-none focus:border-emerald-500 transition resize-y"
              placeholder="হোয়াটসঅ্যাপ মেসেজ লিখুন..."
            />

            {/* SMS text */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-400 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-teal-400" />
                  <span>এসএমএস টেমপ্লেট (১৬০ ক্যারেক্টার)</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  {activeSmsText.length} / 160 ক্যারেক্টার (১ SMS)
                </span>
              </div>
              <textarea
                rows={3}
                value={activeSmsText}
                onChange={(e) =>
                  setTemplates({
                    ...templates,
                    [activeTrigger]: { ...templates[activeTrigger], sms: e.target.value },
                  })
                }
                className="w-full bg-[#11172A] border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 font-sans focus:outline-none focus:border-teal-500 transition resize-y"
                placeholder="এসএমএস টেক্সট লিখুন..."
              />
            </div>

            {/* Test Send Input */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="মোবাইল নম্বর (যেমন 01711223344)"
                  className="w-full bg-[#11172A] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleSendTest}
                disabled={isSending}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>লাইভ টেস্ট পাঠান</span>
              </button>
            </div>

            {testDispatchSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{testDispatchSuccess}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Smartphone WhatsApp Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>লাইভ স্মার্টফোন প্রিভিউ</span>
            </h3>

            {/* Realistic Phone Case */}
            <div className="mx-auto max-w-[320px] bg-[#111624] border-4 border-slate-700 rounded-[36px] p-3 shadow-2xl relative overflow-hidden">
              {/* Speaker Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-600 rounded-full"></div>
              </div>

              {/* WhatsApp App Interface */}
              <div className="bg-[#0b141a] rounded-[24px] overflow-hidden border border-slate-800">
                {/* WA Top Bar */}
                <div className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2.5 border-b border-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow">
                    {storeName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="overflow-hidden leading-tight">
                    <p className="text-xs font-bold text-slate-100 truncate flex items-center gap-1">
                      <span>{storeName}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </p>
                    <p className="text-[10px] text-emerald-400">Official Business Account</p>
                  </div>
                </div>

                {/* WA Chat Body */}
                <div className="p-3 min-h-[300px] flex flex-col justify-end bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] bg-[#0c1317]">
                  <div className="bg-[#005c4b] text-slate-100 p-3 rounded-2xl rounded-tl-sm text-xs leading-relaxed shadow-lg max-w-[92%] relative">
                    <p className="whitespace-pre-line text-[11px] leading-relaxed font-sans">
                      {activeWaText
                        .replace('{customer_name}', 'মোঃ তানভীর আহমেদ')
                        .replace('{order_number}', 'ORD-88412')
                        .replace('{total_amount}', '৪,৫০০')
                        .replace('{doctor_name}', 'ডাঃ রফিকুল ইসলাম (FCPS)')
                        .replace('{appointment_time}', 'আজ সন্ধ্যা ৭:০০ PM')
                        .replace('{property_title}', 'লেকভিউ ট্রিপ্লেক্স পেন্টহাউস')
                        .replace('{property_address}', 'প্লট ১২, রোড ৮, গুলশান-২, ঢাকা')
                        .replace('{product_name}', 'SmartVolt Wi-Fi 6 Gateway Pro')
                        .replace('{serial_number}', 'SN-8829-VTX')
                        .replace('{tracking_code}', 'ST-889104')
                        .replace('{courier_name}', 'Steadfast Courier')
                        .replace('{tracking_link}', `https://${tenantSlug}.smartsaas.app/portal?order=88412`)}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-teal-200 font-mono">
                      <span>৭:১২ PM</span>
                      <CheckCircle2 className="w-3 h-3 text-cyan-300" />
                    </div>
                  </div>
                </div>

                {/* WA Footer */}
                <div className="bg-[#202c33] px-3 py-2 text-center text-[10px] text-slate-400">
                  End-to-end encrypted • Verified Merchant
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch History & Gateway Health */}
      <div className="bg-[#0B101E] border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>সাম্প্রতিক নোটিফিকেশন লগ ও ডেলিভারি স্ট্যাটাস</span>
            </h3>
            <p className="text-xs text-slate-400">রিয়েল-টাইম গেটওয়ে স্ট্যাটাস ও প্রতিটি মেসেজের খরচ পর্যবেক্ষণ</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-mono">
              Gateway: Active (99.8% Success)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase text-slate-400 bg-[#0E1528]">
                <th className="py-2.5 px-3">প্রাপক</th>
                <th className="py-2.5 px-3">গ্রাহক</th>
                <th className="py-2.5 px-3">চ্যানেল</th>
                <th className="py-2.5 px-3">ইভেন্ট</th>
                <th className="py-2.5 px-3">স্ট্যাটাস</th>
                <th className="py-2.5 px-3">সময়</th>
                <th className="py-2.5 px-3 text-right">খরচ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#11172A] transition">
                  <td className="py-2.5 px-3 font-semibold text-white">{log.recipient}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{log.customerName}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.channel === 'whatsapp'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-teal-950 text-teal-300 border border-teal-800'
                      }`}
                    >
                      {log.channel === 'whatsapp' ? <MessageSquare className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                      {log.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{log.event}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {log.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">{log.time}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{log.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

