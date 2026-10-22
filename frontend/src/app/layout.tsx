import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';

export const metadata: Metadata = {
  title: 'Multi-Tenant SaaS E-commerce & Service Engine',
  description: 'Ultra-fast Next.js Storefront and Booking Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="stylesheet" href="/output.css" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
