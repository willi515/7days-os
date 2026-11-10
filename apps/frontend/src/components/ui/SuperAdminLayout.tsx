'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Crown,
  LayoutDashboard,
  Building2,
  CreditCard,
  Sliders,
  ShieldCheck,
  Server,
  Bell,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface SuperAdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    {
      href: '/super-admin/dashboard',
      label: 'نبض المنصة و MRR',
      icon: LayoutDashboard,
      badge: '145 ألف ج.م',
      badgeColor: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      href: '/super-admin/tenants',
      label: 'الشركات والمشتركين',
      icon: Building2,
      badge: '28 شركة',
      badgeColor: 'bg-brand-gold/20 text-brand-gold',
    },
    {
      href: '/super-admin/billing',
      label: 'باقات الاشتراكات والفوترة',
      icon: CreditCard,
    },
    {
      href: '/super-admin/features',
      label: 'التحكم بالميزات (Feature Flags)',
      icon: Sliders,
      badge: 'RLS مؤمن',
      badgeColor: 'bg-blue-500/20 text-blue-400',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-cairo">
      {/* القائمة الجانبية للمالك العام (Super Admin Sidebar) */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 border-l border-slate-800 flex flex-col justify-between transform transition-transform duration-200 md:translate-x-0 md:static ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* رأس القائمة */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-gold to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/10">
                <Crown size={24} />
              </div>
              <div>
                <h2 className="font-black text-white text-base leading-tight flex items-center gap-1.5">
                  <span>7Days OS</span>
                  <span className="text-[10px] bg-brand-gold/20 text-brand-gold font-bold px-1.5 py-0.2 rounded border border-brand-gold/30">
                    SaaS
                  </span>
                </h2>
                <span className="text-[11px] text-brand-gold font-bold">بوابة المالك العام</span>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* روابط التنقل الأربعة */}
          <nav className="p-3 space-y-1.5">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-colors min-h-[46px] ${
                    isActive
                      ? 'bg-brand-gold text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={18} className={isActive ? 'text-slate-950' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-slate-950/20 text-slate-950' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* روابط الدخول للأنظمة الفرعية */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <span>لوحة تحكم الشركة (Admin)</span>
            <ExternalLink size={14} className="text-slate-400" />
          </Link>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-right">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">عزل الـ RLS:</span>
              <span className="text-emerald-400 font-black flex items-center gap-1">
                <ShieldCheck size={13} />
                مفعل 100%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono block mt-1">
              DB: PostgreSQL 16 · Port 5432
            </span>
          </div>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* الشريط العلوي */}
        <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-black text-white">{title}</h1>
              {subtitle && (
                <p className="text-xs text-brand-gold font-bold mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actions}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-brand-gold text-slate-950 font-black text-xs flex items-center justify-center">
                👑
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-white block leading-tight">
                  أ. محمود (المالك العام)
                </span>
                <span className="text-[10px] text-brand-gold font-bold">Platform Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* جسم الصفحة */}
        <main className="p-4 md:p-6 flex-1 space-y-5 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* قناع الموبايل */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 md:hidden backdrop-blur-sm"
        />
      )}
    </div>
  );
};
