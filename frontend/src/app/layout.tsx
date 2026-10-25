import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'SmartVolt | Smart Home & Electronics Store',
    template: '%s | SmartVolt',
  },
  description: 'Shop smart home devices, IoT sensors, security cameras and premium gadgets with warranty across Bangladesh.',
  keywords: ['Smart Home', 'IoT Devices', 'Electronics Bangladesh', 'SmartVolt', 'Security Cameras', 'Smart Lighting'],
  authors: [{ name: 'SaaS E-commerce Engine' }],
  creator: 'Multi-Tenant SaaS',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    title: 'SmartVolt | Smart Home & Electronics Store',
    description: 'Shop smart home devices, IoT sensors, security cameras and premium gadgets with warranty across Bangladesh.',
    siteName: 'SmartVolt',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartVolt | Smart Home & Electronics Store',
    description: 'Shop smart home devices, IoT sensors, security cameras and premium gadgets with warranty across Bangladesh.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
