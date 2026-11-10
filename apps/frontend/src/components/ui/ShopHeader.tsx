'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Sparkles,
  Truck,
  MessageSquare,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';

interface ShopHeaderProps {
  cartCount?: number;
  cartTotal?: number;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  cartCount = 0,
  cartTotal = 0,
}) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* شريط الإعلان العلوي المميز */}
      <div className="bg-brand-primary text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Truck size={14} className="text-brand-gold animate-bounce" />
        <span>توصيل سريع لجميع محافظات مصر · الدفع عند الاستلام أو بمحافظ الكاش</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/shop" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-gold text-brand-primary flex items-center justify-center font-black shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <span className="text-base font-black text-slate-900 block leading-tight">
              7Days Beauty
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              مستحضرات صالونات أصلية معتمدة 100%
            </span>
          </div>
        </Link>

        {/* سلة المشتريات وزر الواتساب */}
        <div className="flex items-center gap-2">
          <Link
            href="/shop/checkout"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-black transition-colors min-h-[42px] shadow-sm"
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
            href="https://wa.me/201011223344?text=%D8%A3%D9%87%D9%84%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA%207Days%20Beauty"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
            title="استشارة خبيرة التجميل عبر واتساب"
          >
            <MessageSquare size={18} />
          </a>
        </div>
      </div>
    </header>
  );
};
