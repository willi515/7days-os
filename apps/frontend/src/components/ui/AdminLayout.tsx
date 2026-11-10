'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PieChart,
  MapPin,
  AlertTriangle,
  FileSpreadsheet,
  Tag,
  RotateCcw,
  Building2,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  Warehouse,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: '/admin/dashboard',
      label: 'نبض الأعمال الرئيسي',
      icon: LayoutDashboard,
      badge: 'مباشر',
      badgeColor: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      href: '/admin/debt-radar',
      label: 'رادار الديون والأعمار',
      icon: PieChart,
      badge: '5 متأخر',
      badgeColor: 'bg-red-500/20 text-red-400',
    },
    {
      href: '/admin/rep-tracking',
      label: 'خريطة تتبع المناديب Live',
      icon: MapPin,
      badge: '6 في الميدان',
      badgeColor: 'bg-blue-500/20 text-blue-400',
    },
    {
      href: '/admin/inventory-alerts',
      label: 'تنبيهات المخزون والصلاحية',
      icon: AlertTriangle,
      badge: '3 نواقص',
      badgeColor: 'bg-amber-500/20 text-amber-400',
    },
    {
      href: '/admin/reports',
      label: 'تقارير الأرباح والأداء',
      icon: FileSpreadsheet,
    },
    {
      href: '/admin/promotions',
      label: 'إدارة العروض والبوانص',
      icon: Tag,
    },
    {
      href: '/admin/returns',
      label: 'إدارة المرتجعات والتسويات',
      icon: RotateCcw,
      badge: '2 جديد',
      badgeColor: 'bg-purple-500/20 text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* القائمة الجانبية (Desktop Sidebar) */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col justify-between border-l border-slate-800 shadow-xl`}
      >
        <div>
          {/* رأس القائمة والشعار */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold text-brand-primary flex items-center justify-center font-black shadow-md">
                <Building2 size={24} />
              </div>
              <div>
                <h2 className="font-black text-white text-base leading-tight">7Days OS Sales</h2>
                <span className="text-[11px] text-brand-gold font-bold">شركة الأمل للتوزيع</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* روابط التنقل السبعة */}
          <nav className="p-3 space-y-1.5">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-colors min-h-[46px] ${
                    isActive
                      ? 'bg-brand-primary text-brand-gold border-r-4 border-brand-gold shadow-sm font-black'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} className={isActive ? 'text-brand-gold' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* روابط سريعة للمستودع والتطبيق في أسفل القائمة */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2">
          <Link
            href="/warehouse/orders"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Warehouse size={16} className="text-amber-400" />
              <span className="font-bold">المستودع المركزي</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">12 طلب</span>
          </Link>

          <Link
            href="/rep/route"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span className="font-bold">محاكي تطبيق المندوب</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">PWA</span>
          </Link>

          <div className="pt-2 text-center text-[10px] text-slate-500 font-bold">
            7Days OS · Multi-Tenant Enterprise v1.0
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي ولوحة الإدارة */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* الشريط العلوي (Top Header) */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-black text-slate-900">{title}</h1>
              {subtitle && (
                <p className="text-xs text-slate-500 font-bold mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-brand-gold font-bold text-xs flex items-center justify-center">
                م
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  أ. محمود
                </span>
                <span className="text-[10px] text-slate-400 font-bold">المالك والمدير العام</span>
              </div>
            </div>
          </div>
        </header>

        {/* جسم الصفحة */}
        <main className="p-4 md:p-6 flex-1 space-y-5 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* تغطية الخلفية عند فتح القائمة بالموبايل */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-sm"
        />
      )}
    </div>
  );
};
