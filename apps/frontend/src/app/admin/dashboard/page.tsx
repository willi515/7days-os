'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Clock,
  ChevronLeft,
  PieChart,
  MapPin,
  Package,
  RotateCcw,
} from 'lucide-react';
import { AdminLayout } from '@/components/ui/AdminLayout';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

export default function AdminDashboardPage() {
  const kpis = [
    {
      title: 'مبيعات اليوم المحققة',
      amount: 185400,
      change: '+14.2%',
      isPositive: true,
      note: 'مقارنة بالأمس (162,000 ج.م)',
      icon: TrendingUp,
      color: 'text-brand-success',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'التحصيلات النقدية اليوم',
      amount: 92300,
      change: '+8.5%',
      isPositive: true,
      note: 'كاش 64 ألف · محافظ 28.3 ألف',
      icon: DollarSign,
      color: 'text-brand-primary',
      bg: 'bg-slate-100',
    },
    {
      title: 'ديون تستوجب التحصيل (أحمر)',
      amount: 48200,
      change: '5 صالونات',
      isPositive: false,
      note: 'تجاوزت الحد الائتماني أو 30 يوماً',
      icon: AlertTriangle,
      color: 'text-brand-danger',
      bg: 'bg-red-500/10',
      link: '/admin/debt-radar',
    },
    {
      title: 'المناديب النشطون بالميدان',
      amount: 6,
      isCount: true,
      change: 'من أصل 8',
      isPositive: true,
      note: '12 صالون تمت زيارتهم اليوم',
      icon: Users,
      color: 'text-brand-gps',
      bg: 'bg-blue-500/10',
      link: '/admin/rep-tracking',
    },
  ];

  const criticalAlerts = [
    {
      id: 'a1',
      title: 'تحذير مديونية: صالون البرنسيسة (مدينة نصر)',
      desc: 'المديونية 18,200 ج.م تجاوزت الحد الائتماني (15,000 ج.م) بـ 3,200 ج.م.',
      type: 'danger',
      link: '/admin/debt-radar',
      actionText: 'فحص الحساب والاتصال',
    },
    {
      id: 'a2',
      title: 'تنبيه مخزون: سيروم شعر بالأرجان 100 مل',
      desc: 'المتبقي بالمستودع 15 قطعة فقط (أقل من نقطة إعادة الطلب 20 قطعة).',
      type: 'warning',
      link: '/admin/inventory-alerts',
      actionText: 'إصدار أمر توريد',
    },
    {
      id: 'a3',
      title: 'إشعار مرتجع جديد: صالون نور الحياة',
      desc: 'المندوب سجل مرتجع 2 قطعة شامبو تالف مع صور التوثيق بقيمة 400 ج.م.',
      type: 'info',
      link: '/admin/returns',
      actionText: 'مراجعة واعتماد الخصم',
    },
  ];

  const recentLiveOrders = [
    {
      id: 'ORD-1090',
      salon: 'بيوتي سنتر الملكة',
      rep: 'أحمد فتحي',
      time: 'منذ 8 دقائق',
      amount: 3300,
      paid: 2000,
      status: 'معتمد بنجاح',
    },
    {
      id: 'ORD-1089',
      salon: 'صالون لمسة جمال',
      rep: 'محمد سالم',
      time: 'منذ 24 دقيقة',
      amount: 1450,
      paid: 1450,
      status: 'مسدد بالكامل',
    },
    {
      id: 'ORD-1088',
      salon: 'كوافير هاني ستارز',
      rep: 'علي حسن',
      time: 'منذ 45 دقيقة',
      amount: 5200,
      paid: 0,
      status: 'آجل معتمد',
    },
  ];

  return (
    <AdminLayout
      title="نبض الأعمال اليومي"
      subtitle="متابعة مبيعات الصالونات والتحصيلات والمناديب في الوقت الفعلي"
      actions={
        <div className="flex gap-2">
          <Link href="/admin/debt-radar">
            <Button variant="danger" size="sm" className="text-xs w-auto px-3.5">
              رادار الديون 🚨
            </Button>
          </Link>
          <Link href="/admin/rep-tracking">
            <Button variant="primary" size="sm" className="text-xs w-auto px-3.5">
              خريطة المناديب 📍
            </Button>
          </Link>
        </div>
      }
    >
      {/* 1. مؤشرات الأداء الرئيسية (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{kpi.title}</span>
                <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="my-3">
                {kpi.isCount ? (
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {kpi.amount}
                  </span>
                ) : (
                  <MoneyDisplay amount={kpi.amount} size="xl" className="text-slate-900" />
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-100">
                <span
                  className={`flex items-center gap-0.5 ${
                    kpi.isPositive ? 'text-brand-success' : 'text-brand-danger'
                  }`}
                >
                  {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.change}
                </span>
                <span className="text-slate-400 text-[11px] truncate max-w-[140px]">
                  {kpi.note}
                </span>
              </div>

              {kpi.link && (
                <Link
                  href={kpi.link}
                  className="absolute inset-0 z-10"
                  aria-label={kpi.title}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 2. شريط التنبيهات العاجلة (Critical Action Center) */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
          مركز التنبيهات والقرارات الفورية (Action Radar)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {criticalAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 rounded-2xl border-2 shadow-sm flex flex-col justify-between ${
                alt.type === 'danger'
                  ? 'bg-red-50/60 border-red-200 text-red-900'
                  : alt.type === 'warning'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                  : 'bg-blue-50/60 border-blue-200 text-blue-900'
              }`}
            >
              <div>
                <h4 className="font-black text-sm">{alt.title}</h4>
                <p className="text-xs font-medium mt-1 leading-relaxed opacity-90">
                  {alt.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-current/10 flex justify-end">
                <Link
                  href={alt.link}
                  className="inline-flex items-center gap-1 text-xs font-black underline hover:no-underline"
                >
                  <span>{alt.actionText}</span>
                  <ChevronLeft size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. جدول آخر الفواتير المباشرة + رادار التوزيع الجغرافي */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* جدول الفواتير اللحظية */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-brand-primary" />
              <h3 className="font-black text-slate-900 text-base">
                آخر الفواتير والطلبيات المسجلة الآن
              </h3>
            </div>
            <Link
              href="/admin/reports"
              className="text-xs font-bold text-brand-gold hover:underline"
            >
              عرض كل الفواتير
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100 pb-2">
                  <th className="pb-2">رقم الفاتورة</th>
                  <th className="pb-2">الصالون</th>
                  <th className="pb-2">المندوب</th>
                  <th className="pb-2">الوقت</th>
                  <th className="pb-2">الإجمالي</th>
                  <th className="pb-2">المدفوع</th>
                  <th className="pb-2">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {recentLiveOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono font-black text-slate-900">{ord.id}</td>
                    <td className="py-3 font-black text-slate-900">{ord.salon}</td>
                    <td className="py-3 text-slate-500">{ord.rep}</td>
                    <td className="py-3 text-slate-400 font-mono">{ord.time}</td>
                    <td className="py-3 font-mono font-bold">
                      {ord.amount.toLocaleString('ar-EG')} ج.م
                    </td>
                    <td className="py-3 font-mono font-bold text-brand-success">
                      {ord.paid.toLocaleString('ar-EG')} ج.م
                    </td>
                    <td className="py-3">
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* توزيع المبيعات بالمناطق */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-brand-gps" />
              <h3 className="font-black text-slate-900 text-sm">أعلى المناطق مبيعاً اليوم</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>مدينة نصر (قطاع شرق)</span>
                <span className="font-mono">78,500 ج.م (42%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-brand-primary h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>مصر الجديدة والنزهة</span>
                <span className="font-mono">54,200 ج.م (29%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-brand-gold h-full rounded-full" style={{ width: '29%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>الهرم والدقي (الجيزة)</span>
                <span className="font-mono">36,700 ج.م (20%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-brand-gps h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>المعادي وحلوان</span>
                <span className="font-mono">16,000 ج.م (9%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '9%' }} />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              href="/admin/rep-tracking"
              className="text-xs font-black text-brand-gps hover:underline inline-flex items-center gap-1"
            >
              <span>متابعة خطوط سير سيارات التوزيع على الخريطة</span>
              <ChevronLeft size={14} />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
