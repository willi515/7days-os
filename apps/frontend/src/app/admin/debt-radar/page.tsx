'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PieChart,
  AlertTriangle,
  Lock,
  Unlock,
  MessageSquare,
  Phone,
  FileSpreadsheet,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { AdminLayout } from '@/components/ui/AdminLayout';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface SalonDebtItem {
  id: string;
  name: string;
  area: string;
  repName: string;
  phone: string;
  totalDebt: number;
  creditLimit: number;
  oldestInvoiceDays: number;
  status: 'green' | 'yellow' | 'orange' | 'red';
  isBlocked: boolean;
}

const mockDebts: SalonDebtItem[] = [
  {
    id: 's1',
    name: 'صالون البرنسيسة',
    area: 'مدينة نصر',
    repName: 'أحمد فتحي',
    phone: '01223344556',
    totalDebt: 18200,
    creditLimit: 15000,
    oldestInvoiceDays: 42,
    status: 'orange',
    isBlocked: true,
  },
  {
    id: 's2',
    name: 'كوافير رويال ستايل',
    area: 'الهرم - الجيزة',
    repName: 'علي حسن',
    phone: '01009988776',
    totalDebt: 12500,
    creditLimit: 10000,
    oldestInvoiceDays: 68,
    status: 'red',
    isBlocked: true,
  },
  {
    id: 's3',
    name: 'كوافير جولدن روز',
    area: 'مدينة نصر',
    repName: 'محمد سالم',
    phone: '01511223344',
    totalDebt: 8900,
    creditLimit: 12000,
    oldestInvoiceDays: 24,
    status: 'yellow',
    isBlocked: false,
  },
  {
    id: 's4',
    name: 'بيوتي سنتر الملكة',
    area: 'مدينة نصر',
    repName: 'أحمد فتحي',
    phone: '01012345678',
    totalDebt: 4500,
    creditLimit: 15000,
    oldestInvoiceDays: 12,
    status: 'green',
    isBlocked: false,
  },
  {
    id: 's5',
    name: 'صالون ميرال بيوتي',
    area: 'مصر الجديدة',
    repName: 'أحمد فؤاد',
    phone: '01122334455',
    totalDebt: 6100,
    creditLimit: 8000,
    oldestInvoiceDays: 18,
    status: 'yellow',
    isBlocked: false,
  },
];

export default function AdminDebtRadarPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBucket, setSelectedBucket] = useState<'all' | 'green' | 'yellow' | 'orange' | 'red'>('all');
  const [debts, setDebts] = useState<SalonDebtItem[]>(mockDebts);

  const toggleBlockStatus = (id: string) => {
    setDebts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isBlocked: !s.isBlocked } : s))
    );
  };

  const filteredDebts = debts.filter((item) => {
    const matchesSearch =
      item.name.includes(searchQuery) ||
      item.area.includes(searchQuery) ||
      item.repName.includes(searchQuery);

    if (!matchesSearch) return false;
    if (selectedBucket !== 'all' && item.status !== selectedBucket) return false;
    return true;
  });

  return (
    <AdminLayout
      title="رادار الديون وأعمار الحسابات"
      subtitle="متابعة مديونيات الصالونات والتحكم الفوري في إيقاف الحسابات المتأخرة"
      actions={
        <Button
          variant="outline"
          size="sm"
          icon={<FileSpreadsheet size={16} />}
          onClick={() => window.print()}
          className="text-xs w-auto px-4"
        >
          تصدير كشف الديون (Excel / PDF)
        </Button>
      }
    >
      {/* 1. أشرطة وأوعية أعمار الديون (Aging Buckets) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedBucket(selectedBucket === 'green' ? 'all' : 'green')}
          className={`p-4 rounded-2xl border-2 text-right transition-all ${
            selectedBucket === 'green'
              ? 'border-emerald-500 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
              : 'border-emerald-200 bg-white hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold text-emerald-800">
            <span>🟢 1 - 14 يوماً (أجل عادي)</span>
            <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full">ملتزم</span>
          </div>
          <MoneyDisplay amount={45000} size="lg" className="mt-2 text-emerald-800 font-mono block" />
          <span className="text-[11px] text-slate-500 font-bold block mt-1">12 صالون</span>
        </button>

        <button
          onClick={() => setSelectedBucket(selectedBucket === 'yellow' ? 'all' : 'yellow')}
          className={`p-4 rounded-2xl border-2 text-right transition-all ${
            selectedBucket === 'yellow'
              ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-500/20'
              : 'border-amber-200 bg-white hover:bg-amber-50/30'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold text-amber-900">
            <span>🟡 15 - 30 يوماً (استحقاق)</span>
            <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded-full">تحذير</span>
          </div>
          <MoneyDisplay amount={28000} size="lg" className="mt-2 text-amber-900 font-mono block" />
          <span className="text-[11px] text-slate-500 font-bold block mt-1">6 صالونات</span>
        </button>

        <button
          onClick={() => setSelectedBucket(selectedBucket === 'orange' ? 'all' : 'orange')}
          className={`p-4 rounded-2xl border-2 text-right transition-all ${
            selectedBucket === 'orange'
              ? 'border-orange-500 bg-orange-50/80 shadow-md ring-2 ring-orange-500/20'
              : 'border-orange-200 bg-white hover:bg-orange-50/30'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold text-orange-900">
            <span>🟠 31 - 60 يوماً (متأخر)</span>
            <span className="text-[10px] bg-orange-100 px-2 py-0.5 rounded-full">حظر طلبيات</span>
          </div>
          <MoneyDisplay amount={18200} size="lg" className="mt-2 text-orange-900 font-mono block" />
          <span className="text-[11px] text-slate-500 font-bold block mt-1">3 صالونات</span>
        </button>

        <button
          onClick={() => setSelectedBucket(selectedBucket === 'red' ? 'all' : 'red')}
          className={`p-4 rounded-2xl border-2 text-right transition-all ${
            selectedBucket === 'red'
              ? 'border-red-500 bg-red-50/80 shadow-md ring-2 ring-red-500/20'
              : 'border-red-200 bg-white hover:bg-red-50/30'
          }`}
        >
          <div className="flex justify-between items-center text-xs font-bold text-red-900">
            <span>🔴 +60 يوماً (خطر عالي)</span>
            <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full">إدارة قانونية</span>
          </div>
          <MoneyDisplay amount={12500} size="lg" className="mt-2 text-red-900 font-mono block" />
          <span className="text-[11px] text-slate-500 font-bold block mt-1">2 صالون</span>
        </button>
      </div>

      {/* 2. شريط البحث والفرز */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث باسم الصالون، المنطقة، أو المندوب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 rounded-xl pr-10 pl-4 py-2.5 text-xs font-bold border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[44px]"
          />
        </div>

        {selectedBucket !== 'all' && (
          <button
            onClick={() => setSelectedBucket('all')}
            className="text-xs font-black text-brand-primary hover:underline px-3 py-2 bg-slate-100 rounded-xl"
          >
            إلغاء التصفية (عرض الكل)
          </button>
        )}
      </div>

      {/* 3. جدول تفصيل مديونيات الصالونات والإجراءات الرادعة */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-black border-b border-slate-200">
              <tr>
                <th className="p-4">الصالون والمنطقة</th>
                <th className="p-4">المندوب المسؤول</th>
                <th className="p-4">المديونية الحالية</th>
                <th className="p-4">الحد الائتماني</th>
                <th className="p-4">أقدم فاتورة</th>
                <th className="p-4">حالة الحساب</th>
                <th className="p-4 text-center">إجراءات التحصيل والردع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredDebts.map((item) => {
                const isOverLimit = item.totalDebt > item.creditLimit;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <strong className="block text-slate-900 text-sm font-black">
                        {item.name}
                      </strong>
                      <span className="text-slate-400 text-[11px] font-bold">
                        {item.area} · {item.phone}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600 font-bold">{item.repName}</td>

                    <td className="p-4">
                      <MoneyDisplay amount={item.totalDebt} size="md" colored isDebt />
                      {isOverLimit && (
                        <span className="text-[10px] font-black text-brand-danger block mt-0.5">
                          متجاوز للحد بـ {(item.totalDebt - item.creditLimit).toLocaleString('ar-EG')} ج.م
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-600">
                      {item.creditLimit.toLocaleString('ar-EG')} ج.م
                    </td>

                    <td className="p-4 font-mono">
                      <span
                        className={`font-black px-2 py-0.5 rounded-md ${
                          item.oldestInvoiceDays > 30
                            ? 'bg-red-100 text-red-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.oldestInvoiceDays} يوماً
                      </span>
                    </td>

                    <td className="p-4">
                      {item.isBlocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black bg-red-100 text-red-800 px-2.5 py-1 rounded-full border border-red-200">
                          <Lock size={12} />
                          محظور من الفواتير
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                          <Unlock size={12} />
                          مفتوح للطلب
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* زر واتساب كشف الحساب الفوري */}
                        <a
                          href={`https://wa.me/2${item.phone}?text=${encodeURIComponent(`أهلاً بحضرتك من إدارة شركة الأمل. نرجو التكرم بسداد المديونية المستحقة وقدرها ${item.totalDebt.toLocaleString('ar-EG')} ج.م تفادياً لإيقاف الحساب.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          title="إرسال مطالبة عبر واتساب"
                        >
                          <MessageSquare size={16} />
                        </a>

                        {/* زر الاتصال */}
                        <a
                          href={`tel:${item.phone}`}
                          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
                          title="اتصال مباشر"
                        >
                          <Phone size={16} />
                        </a>

                        {/* زر القفل / الفتح الفوري */}
                        <button
                          onClick={() => toggleBlockStatus(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                            item.isBlocked
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-brand-danger text-white hover:bg-red-700'
                          }`}
                        >
                          {item.isBlocked ? 'إلغاء الحظر' : 'حظر الحساب 🔒'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
