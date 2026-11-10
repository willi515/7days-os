import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RepBottomNav } from '@/components/ui/RepBottomNav';

export const metadata: Metadata = {
  title: '7Days OS | نظام مبيعات وتوزيع مستحضرات التجميل',
  description: 'المنصة السحابية المتكاملة لإدارة مبيعات وتوزيع مستحضرات التجميل وتجهيز الصالونات في مصر',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0F172A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 font-cairo antialiased selection:bg-brand-gold selection:text-brand-primary">
        <main className="mx-auto max-w-md min-h-screen bg-white shadow-xl relative pb-20">
          {children}
          <RepBottomNav />
        </main>
      </body>
    </html>
  );
}
