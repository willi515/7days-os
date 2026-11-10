'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  ShoppingBag,
  FileText,
  Truck,
  MessageSquare,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';

interface B2BHeaderProps {
  cartCount?: number;
  cartTotal?: number;
}

export const B2BHeader: React.FC<B2BHeaderProps> = ({
  cartCount = 0,
  cartTotal = 0,
}) => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/b2b/catalog', label: 'الكتالوج والطلب', icon: ShoppingBag },
    { href: '/b2b/statement', label: 'كشف الحساب الشفاف', icon: FileText },
    { href: '/b2b/checkout', label: 'تتبع الطلبيات', icon: Truck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* الشريط العلوي للصالون */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-primary text-brand-gold flex items-center justify-center font-black shadow-md border-2 border-brand-gold/30">
            💇‍♀️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 leading-tight">
                صالون نور الحياة
              </h1>
              <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <Sparkles size={11} className="text-brand-gold" />
                فئة ذهبية
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-0.5 flex items-center gap-1">
              <span>الائتمان المتاح للآجل:</span>
              <strong className="text-brand-success font-mono font-black">7,800 ج.م</strong>
            </p>
          </div>
        </div>

        {/* سلة التسوق السريعة وزر الواتساب */}
        <div className="flex items-center gap-2">
          <Link
            href="/b2b/checkout"
            className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-black hover:bg-slate-800 transition-colors shadow-sm min-h-[42px]"
          >
            <div className="relative">
              <ShoppingBag size={18} className="text-brand-gold" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-danger text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-black">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-mono">
              {cartTotal.toLocaleString('ar-EG')} ج.م
            </span>
          </Link>

          <a
            href="https://wa.me/201011223344?text=%D8%A3%D9%87%D9%84%D8%A7%D9%8B%20%D8%A5%D8%AF%D8%A7%D8%B1%D8%A9%207Days%D8%8C%20%D9%85%D8%B9%D8%A7%D9%83%D9%85%20%D8%B5%D8%A7%D9%84%D9%88%D9%86%20%D9%86%D9%88%D8%B1%20%D8%A7%D9%84%D8%AD%D9%8A%D8%A7%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
            title="محادثة الإدارة"
          >
            <MessageSquare size={18} />
          </a>
        </div>
      </div>

      {/* شريط التبويبات الثلاثة المباشرة */}
      <nav className="max-w-4xl mx-auto flex px-4 border-t border-slate-100 overflow-x-auto text-xs font-bold">
        {navLinks.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 py-2.5 px-3 whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-brand-primary text-brand-primary font-black'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
