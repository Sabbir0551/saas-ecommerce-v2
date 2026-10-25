import React, { Suspense } from 'react';
import { WhatsAppFloatingWidget } from '@/components/WhatsAppFloatingWidget';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <WhatsAppFloatingWidget />
      </Suspense>
    </>
  );
}
