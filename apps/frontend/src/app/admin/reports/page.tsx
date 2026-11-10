'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  TrendingUp,
  Printer,
  DollarSign,
  PieChart,
  Users,
  Award,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { AdminLayout } from '@/components/ui/AdminLayout';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

export default function AdminReportsPage() {
  const [reportPeriod, setReportPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  const repsPerformance = [
    { name: 'أحمد فؤاد', sales: 385000, collections: 290000, commission: 12500, targetPercent: 115 },
    { name: 'أحمد فتحي', sales: 342000, collections: 245000, commission: 10800, targetPercent: 102 },
    { name: 'علي حسن', sales: 295000, collections: 198000, commission: 8900, targetPercent: 88 },
    { name: 'محمد سالم', sales: 260000, collections: 175000, commission: 7800, targetPercent: 82 },
  ];

  const topSellingProducts = [
    { name: 'شامبو كيراتين برازيلي 1000 مل', unitsSold: 420, revenue: 84000, profitMargin: '42%' },
    { name: 'سشوار صالونات تورنادو 2500 وات', unitsSold: 48, revenue: 62400, profitMargin: '31%' },
    { name: 'مكواة نانو تيتانيوم بيبي ليس', unitsSold: 32, revenue: 52800, profitMargin: '28%' },
    { name: 'سيروم شعر بالأرجان 100 مل', unitsSold: 310, revenue: 40300, profitMargin: '38%' },
  ];

  return (
    <AdminLayout
      title="تقارير الأرباح والأداء المالي"
      subtitle="تحليل الإيرادات وصافي الربح وعمولات المناديب والأصناف الأعلى ربحية"
      actions={
        <Button
          variant="outline"
          size="sm"
          icon={<Printer size={16} />}
          onClick={() => window.print()}
          className="text-xs w-auto px-4"
        >
          طباعة التقرير المالي المعتمد 🖨️
        </Button>
      }
    >
      {/* 1. قائمة الدخل والأرباح التنفيذية (P&L Snapshot) */}
      <div className="bg-gradient-to-br from-brand-primary to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-700/80 gap-3">
          <div>
            <span className="text-xs font-black text-brand-gold uppercase tracking-wider block">
              قائمة الدخل التقديرية لشهر نوفمبر 2026
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              صافي أرباح العمليات والتوزيع
            </h3>
          </div>

          <div className="flex gap-2 text-xs font-bold bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setReportPeriod('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reportPeriod === 'month' ? 'bg-brand-gold text-brand-primary font-black' : 'text-slate-300'
              }`}
            >
              هذا الشهر
            </button>
            <button
              onClick={() => setReportPeriod('quarter')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                reportPeriod === 'quarter' ? 'bg-brand-gold text-brand-primary font-black' : 'text-slate-300'
              }`}
            >
              الربع الحالي
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs font-bold block">إجمالي إيراد المبيعات</span>
            <MoneyDisplay amount={1450000} size="lg" className="text-white mt-1" />
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">+18% نمو شهري</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs font-bold block">تكلفة البضاعة المباعة (COGS)</span>
            <MoneyDisplay amount={920000} size="lg" className="text-slate-300 mt-1" />
            <span className="text-[10px] text-slate-400 font-bold block mt-1">تكلفة الشراء والتوريد</span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 text-xs font-bold block">عمولات المناديب المستحقة</span>
            <MoneyDisplay amount={52000} size="lg" className="text-amber-400 mt-1" />
            <span className="text-[10px] text-slate-400 font-bold block mt-1">تصرف بنهاية الشهر</span>
          </div>

          <div className="bg-brand-gold/15 p-4 rounded-xl border-2 border-brand-gold/40">
            <span className="text-brand-gold text-xs font-black block">صافي الربح التشغيلي</span>
            <MoneyDisplay amount={478000} size="xl" className="text-brand-gold mt-1" />
            <span className="text-[10px] text-emerald-400 font-black block mt-1">هامش ربح 33% 🎯</span>
          </div>
        </div>
      </div>

      {/* 2. جدول أداء المناديب والعمولات */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-brand-gold" />
            <h3 className="font-black text-slate-900 text-base">
              أداء المناديب الميدانيين ونسب تحقيق التارجت
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-black border-b border-slate-200">
              <tr>
                <th className="p-3">اسم المندوب</th>
                <th className="p-3">المبيعات المحققة</th>
                <th className="p-3">التحصيلات النقدية</th>
                <th className="p-3">نسبة التارجت</th>
                <th className="p-3 text-left">العمولة المستحقة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {repsPerformance.map((rep, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-black text-slate-900 text-sm flex items-center gap-2">
                    {idx === 0 && <span className="text-base">🥇</span>}
                    {idx === 1 && <span className="text-base">🥈</span>}
                    {rep.name}
                  </td>
                  <td className="p-3 font-mono font-bold">
                    {rep.sales.toLocaleString('ar-EG')} ج.م
                  </td>
                  <td className="p-3 font-mono text-emerald-700 font-bold">
                    {rep.collections.toLocaleString('ar-EG')} ج.م
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-black px-2 py-0.5 rounded-full ${
                        rep.targetPercent >= 100
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rep.targetPercent}%
                    </span>
                  </td>
                  <td className="p-3 text-left">
                    <MoneyDisplay amount={rep.commission} size="sm" colored />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. الأصناف الأعلى مبيعاً وربحية */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-black text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
          <TrendingUp size={20} className="text-brand-success" />
          <span>الأصناف والمنتجات الأكثر مبيعاً وربحية في الصالونات</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topSellingProducts.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="block text-slate-900 text-sm font-black line-clamp-1">
                {p.name}
              </strong>
              <div className="mt-2 flex justify-between text-xs text-slate-500 font-bold">
                <span>المباع: {p.unitsSold} قطعة</span>
                <span className="text-emerald-700 font-black">{p.profitMargin} هامش</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-bold">إجمالي الإيراد</span>
                <MoneyDisplay amount={p.revenue} size="sm" className="text-brand-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
