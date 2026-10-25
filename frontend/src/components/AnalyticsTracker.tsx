'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

interface AnalyticsTrackerProps {
  tenantSlug?: string;
}

// Global declaration for TypeScript
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Standard Facebook Pixel & Google Analytics Event Dispatchers
 */
export function trackPixelEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', eventName, params);
    } catch (e) {
      console.warn('Pixel event dispatch failed:', e);
    }
  }
}

export function trackGtagEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, params);
    } catch (e) {
      console.warn('Google Analytics event dispatch failed:', e);
    }
  }
}

export function trackViewContent(item: { id: string; title: string; price: number; category?: string }) {
  trackPixelEvent('ViewContent', {
    content_name: item.title,
    content_ids: [item.id],
    content_type: 'product',
    value: item.price,
    currency: 'BDT',
  });
  trackGtagEvent('view_item', {
    currency: 'BDT',
    value: item.price,
    items: [{ item_id: item.id, item_name: item.title, price: item.price, item_category: item.category }],
  });
}

export function trackAddToCart(item: { id: string; title: string; price: number; quantity?: number }) {
  trackPixelEvent('AddToCart', {
    content_name: item.title,
    content_ids: [item.id],
    content_type: 'product',
    value: item.price * (item.quantity || 1),
    currency: 'BDT',
  });
  trackGtagEvent('add_to_cart', {
    currency: 'BDT',
    value: item.price * (item.quantity || 1),
    items: [{ item_id: item.id, item_name: item.title, price: item.price, quantity: item.quantity || 1 }],
  });
}

export function trackInitiateCheckout(total: number, numItems: number) {
  trackPixelEvent('InitiateCheckout', {
    value: total,
    currency: 'BDT',
    num_items: numItems,
  });
  trackGtagEvent('begin_checkout', {
    currency: 'BDT',
    value: total,
  });
}

export function trackPurchase(order: { orderNumber: string; totalAmount: number; items?: any[] }) {
  trackPixelEvent('Purchase', {
    value: order.totalAmount,
    currency: 'BDT',
    content_type: 'product',
    contents: order.items?.map((it: any) => ({
      id: it.id || it.itemId,
      quantity: it.quantity || 1,
      item_price: it.price || 0,
    })),
    num_items: order.items?.length || 1,
  });
  trackGtagEvent('purchase', {
    transaction_id: order.orderNumber,
    value: order.totalAmount,
    currency: 'BDT',
    items: order.items?.map((it: any) => ({
      item_id: it.id || it.itemId,
      item_name: it.itemTitle || it.title,
      price: it.price,
      quantity: it.quantity || 1,
    })),
  });
}

export function AnalyticsTracker({ tenantSlug: propTenantSlug }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tenantSlug = propTenantSlug || searchParams.get('tenant') || 'smartvolt';

  const [metaPixelId, setMetaPixelId] = useState<string>('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadTrackingConfig() {
      try {
        const res = await api.getTenant(tenantSlug);
        if (res?.success && res.data && isMounted) {
          const s = res.data.settings || {};
          if (s.metaPixelId) setMetaPixelId(s.metaPixelId);
          if (s.googleAnalyticsId) setGoogleAnalyticsId(s.googleAnalyticsId);
        }
      } catch (err) {
        console.warn('Could not load analytics configuration:', err);
      }
    }
    loadTrackingConfig();
    return () => {
      isMounted = false;
    };
  }, [tenantSlug]);

  // Track page views on route navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.fbq && metaPixelId) {
        window.fbq('track', 'PageView');
      }
      if (window.gtag && googleAnalyticsId) {
        window.gtag('event', 'page_view', {
          page_path: pathname,
        });
      }
    }
  }, [pathname, metaPixelId, googleAnalyticsId]);

  return (
    <>
      {/* Meta Pixel Tracker */}
      {metaPixelId && (
        <>
          <Script
            id="facebook-pixel-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt="Facebook Pixel"
            />
          </noscript>
        </>
      )}

      {/* Google Analytics (GA4) Tracker */}
      {googleAnalyticsId && (
        <>
          <Script
            id="google-analytics-script"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <Script
            id="google-analytics-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}
