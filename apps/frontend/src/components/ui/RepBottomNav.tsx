'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Users, ShoppingBag, RotateCcw, TrendingUp } from 'lucide-react';

export const RepBottomNav: React.FC = () => {
  const pathname = usePathname();

  // لا تظهر في شاشة تسجيل الدخول
  if (pathname === '/rep/login') {
    return null;
  }

  const navItems = [
    {
      href: '/rep/route',
      label: 'خط السير',
      icon: MapPin,
      badge: '12',
    },
    {
      href: '/rep/salon/1',
      label: 'الصالون',
      icon: Users,
    },
    {
      href: '/rep/order/new',
      label: 'طلبية جديدة',
      icon: ShoppingBag,
      highlight: true,
    },
    {
      href: '/rep/returns',
      label: 'مرتجع',
      icon: RotateCcw,
    },
    {
      href: '/rep/payment',
      label: 'تحصيل',
      icon: TrendingUp,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg max-w-md mx-auto">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4 relative group"
              >
                <div className="w-13 h-13 rounded-full bg-brand-gold text-brand-primary shadow-lg flex items-center justify-center p-3 border-4 border-white transition-transform active:scale-90 group-hover:scale-105">
                  <Icon size={24} className="stroke-[2.5]" />
                </div>
                <span className="text-[11px] font-extrabold text-brand-primary mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative min-h-touch-target ${
                isActive ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-brand-gps text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 ${
                  isActive ? 'font-black text-brand-primary' : 'font-semibold text-slate-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-brand-gold rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
