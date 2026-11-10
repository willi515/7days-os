'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Building2,
  Users,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Sparkles,
  Phone,
  Clock,
  ChevronLeft,
} from 'lucide-react';
import { SuperAdminLayout } from '@/components/ui/SuperAdminLayout';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

export default function SuperAdminDashboardPage() {
  const metrics = [
    {
      title: 'الإيراد الشهري المتكرر (MRR)',
      amount: 145000,
      change: '+15.4%',
      note: 'مقارنة بالشهر الماضي (125,600 ج.م)',
      icon: TrendingUp,
      color: 'text-brand-gold',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'الشركات والمشتركين',
      amount: 28,
      isCount: true,
      change: '23 نشطة · 3 تجريبي',
      note: '2 شركات معلقة بالسداد',
      icon: Building2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      link: '/super-admin/tenants',
    },
    {
      title: 'المناديب النشطون في مصر',
      amount: 184,
      isCount: true,
      change: '162 متصل الآن Live',
      note: 'عبر كافة شركات التوزيع',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'حجم فواتير المنصة اليوم',
      amount: 1250000,
      change: '1,420 فاتورة بيع',
      note: 'إجمالي التداول اليومي بالجنيه',
      icon: CreditCard,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  const criticalRenewals = [
    {
      id: 'r1',
      name: 'شركة الأندلس لمستحضرات التجميل',
      subdomain: 'alandalus.7daysos.com',
      status: 'expired',
      daysAgo: 3,
      plan: 'باقة Pro (15 مندوب)',
      amount: 4500,
    },
    {
      id: 'r2',
      name: 'مؤسسة الجوهرة لتجهيز الصالونات',
      subdomain: 'aljawhara.7daysos.com',
      status: 'expiring_soon',
      daysLeft: 5,
      plan: 'باقة Enterprise السنوية',
      amount: 95000,
    },
  ];

  const recentTenants = [
    {
      name: 'شركة رويال كوزمتكس',
      subdomain: 'royal.7daysos.com',
      plan: 'الاحترافية (Pro)',
      repsCount: 15,
      joinedAt: 'اليوم 09:30 ص',
      status: 'نشط',
    },
    {
      name: 'شركة كليوباترا فارما وتجميل',
      subdomain: 'cleo.7daysos.com',
      plan: 'المؤسسات (Enterprise)',
      repsCount: 30,
      joinedAt: 'أمس 04:15 م',
      status: 'نشط',
    },
    {
      name: 'شركة الأمل للتوزيع',
      subdomain: 'elamal.7daysos.com',
      plan: 'الاحترافية (Pro)',
      repsCount: 12,
      joinedAt: '10 نوفمبر 2026',
      status: 'نشط',
    },
  ];

  return (
    <SuperAdminLayout
      title="نبض المنصة وإيرادات الـ SaaS"
      subtitle="نظرة استراتيجية شاملة على كافة الشركات المشتركة وحجم التداول والإيرادات المتكررة"
      actions={
        <Link href="/super-admin/tenants">
          <Button variant="gold" size="sm" icon={<Building2 size={16} />} className="text-xs w-auto px-4 font-black">
            إدارة الشركات والمشتركين (SUP-02) ➡️
          </Button>
        </Link>
      }
    >
      {/* 1. بطاقات المؤشرات الاستراتيجية الأربعة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{m.title}</span>
                <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="my-3">
                {m.isCount ? (
                  <span className="text-3xl font-black text-white font-mono">{m.amount}</span>
                ) : (
                  <MoneyDisplay amount={m.amount} size="xl" className="text-white font-mono" />
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-800 text-slate-400">
                <span className={`flex items-center gap-0.5 ${m.color}`}>
                  <ArrowUpRight size={14} />
                  {m.change}
                </span>
                <span className="text-[11px] truncate max-w-[130px]">{m.note}</span>
              </div>

              {m.link && <Link href={m.link} className="absolute inset-0" aria-label={m.title} />}
            </div>
          );
        })}
      </div>

      {/* 2. تنبيهات الاشتراكات والتجديدات الحرجة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* الشركات التي انتهى اشتراكها أو قارب على الانتهاء */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-brand-danger" />
              <h3 className="font-black text-white text-sm">
                تنبيهات التجديد والاشتراكات المستحقة
              </h3>
            </div>
            <span className="text-xs font-mono text-brand-gold font-bold">2 شركات</span>
          </div>

          <div className="space-y-3">
            {criticalRenewals.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
                  item.status === 'expired'
                    ? 'bg-red-950/30 border-red-800/60 text-red-200'
                    : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                }`}
              >
                <div>
                  <strong className="block text-white text-sm font-black">{item.name}</strong>
                  <span className="font-mono text-xs text-slate-400 block mt-0.5">
                    {item.subdomain} · {item.plan}
                  </span>
                  <span
                    className={`text-[11px] font-black inline-block mt-1 ${
                      item.status === 'expired' ? 'text-red-400' : 'text-amber-400'
                    }`}
                  >
                    {item.status === 'expired'
                      ? `انتهى الاشتراك منذ ${item.daysAgo} أيام (المستحق: ${item.amount} ج.م)`
                      : `ينتهي بعد ${item.daysLeft} أيام (قيمة التجديد: ${item.amount.toLocaleString('ar-EG')} ج.م)`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/20100000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors flex items-center gap-1"
                  >
                    <Phone size={13} />
                    <span>تواصل واتساب</span>
                  </a>

                  {item.status === 'expired' && (
                    <button
                      onClick={() => alert(`تم إيقاف دخول شركة: ${item.name}`)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors"
                    >
                      إيقاف مؤقت ⛔
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أحدث الشركات المنضمة للمنظومة */}
        <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-brand-gold" />
              <h3 className="font-black text-white text-sm">
                أحدث الشركات المنضمة لمنصة 7Days OS
              </h3>
            </div>
            <Link
              href="/super-admin/tenants"
              className="text-xs font-bold text-brand-gold hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          <div className="space-y-3">
            {recentTenants.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <strong className="block text-white text-sm font-black">{t.name}</strong>
                  <span className="font-mono text-brand-gold text-[11px] block mt-0.5">
                    {t.subdomain}
                  </span>
                  <span className="text-slate-400 text-[10px] block mt-0.5">
                    {t.plan} · {t.repsCount} مندوب مبيعات
                  </span>
                </div>

                <div className="text-left shrink-0">
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30 block mb-1">
                    {t.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{t.joinedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
