'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ScanLine, Truck, ClipboardList, Warehouse, Bell } from 'lucide-react';

export const WarehouseHeader: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/warehouse/orders', label: 'الطلبات الواردة', icon: ClipboardList, badge: '12' },
    { href: '/warehouse/picking/ORD-2026-1245', label: 'قائمة التجميع (FEFO)', icon: Package },
    { href: '/warehouse/serials/ORD-2026-1245', label: 'مسح السيريالات', icon: ScanLine },
    { href: '/warehouse/manifest', label: 'بيان شحن السيارات', icon: Truck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gold text-brand-primary flex items-center justify-center font-black shadow-sm">
            <Warehouse size={22} />
          </div>
          <div>
            <h1 className="text-base font-black text-white flex items-center gap-2">
              <span>مستودع 7Days OS الرئيسي</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                سحابي مباشر
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              مشرف الوردية: أ. أحمد الرفاعي · مستودع العبور المركزي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-danger rounded-full" />
          </button>
        </div>
      </div>

      {/* شريط التبويبات العلوي للعمليات الأربعة */}
      <nav className="flex px-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none bg-slate-900/90 text-xs font-bold">
        {links.map((item) => {
          const isActive = pathname === item.href || (item.href.includes('/picking') && pathname.includes('/picking')) || (item.href.includes('/serials') && pathname.includes('/serials'));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-3 whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-brand-gold text-brand-gold bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="bg-brand-warning text-slate-900 text-[10px] font-black rounded-full px-1.5 py-0.2">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
