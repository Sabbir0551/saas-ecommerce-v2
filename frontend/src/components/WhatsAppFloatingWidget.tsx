'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface WhatsAppWidgetProps {
  phone?: string;
  storeName?: string;
  tenantSlug?: string;
}

export function WhatsAppFloatingWidget({ 
  phone: defaultPhone = '+8801812778899', 
  storeName: defaultStoreName = 'SmartVolt',
  tenantSlug: propTenantSlug 
}: WhatsAppWidgetProps) {
  const searchParams = useSearchParams();
  const tenantSlug = propTenantSlug || searchParams.get('tenant') || 'smartvolt';

  const [phone, setPhone] = useState(defaultPhone);
  const [storeName, setStoreName] = useState(defaultStoreName);
  const [customMsg, setCustomMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadTenantWhatsapp() {
      try {
        const res = await api.getTenant(tenantSlug);
        if (res?.success && res.data && isMounted) {
          const t = res.data;
          const s = t.settings || {};
          if (s.whatsappNumber) setPhone(s.whatsappNumber);
          else if (t.phone) setPhone(t.phone);
          
          if (t.name) setStoreName(t.name);
          if (s.whatsappWelcomeMsg) setCustomMsg(s.whatsappWelcomeMsg);
        }
      } catch (err) {
        console.warn('Could not load tenant WhatsApp info:', err);
      }
    }
    loadTenantWhatsapp();
    return () => {
      isMounted = false;
    };
  }, [tenantSlug]);

  // Format phone number to international format without spaces or symbols
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const finalPhone = cleanPhone.startsWith('880') 
    ? cleanPhone 
    : cleanPhone.startsWith('0') 
      ? `88${cleanPhone}` 
      : `880${cleanPhone}`;

  const message = encodeURIComponent(
    customMsg || `Hello ${storeName}, I would like to inquire about your products.`
  );
  const whatsappUrl = `https://wa.me/${finalPhone}?text=${message}`;

  return (
    <aside 
      aria-label="Customer Support and WhatsApp Assistance"
      className="fixed bottom-6 right-6 z-50 flex items-center group"
    >
      <div 
        role="tooltip"
        className="mr-3 px-3.5 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold shadow-xl border border-slate-800 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
      >
        Chat with us on WhatsApp
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition transform hover:scale-110 active:scale-95 relative"
        title="Chat with us on WhatsApp"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-100 border-2 border-emerald-600"></span>
        </span>
      </a>
    </aside>
  );
}
