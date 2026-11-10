'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  TrendingUp,
  RotateCcw,
  FileText,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Tag,
} from 'lucide-react';
import { RepHeader } from '@/components/ui/RepHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

export default function RepSalonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const salonId = params?.id || '1';

  // بيانات الصالون الحية
  const salon = {
    id: salonId,
    name: 'بيوتي سنتر الملكة',
    contactPerson: 'مدام سوزان',
    phone: '01012345678',
    address: '15 شارع عباس العقاد - الدور الثاني',
    area: 'مدينة نصر - القاهرة',
    balance: 4500,
    creditLimit: 15000,
    availableCredit: 10500,
    priceTier: 'شريحة كبار العملاء (جملة مميزة)',
    paymentTerms: 'أجل 14 يوماً من تاريخ الفاتورة',
    status: 'committed' as const,
    notes: 'يفضلون منتجات الكيراتين والبروتين البرازيلي، ومكواة وسشوار تورنادو الإيطالي.',
  };

  const recentOrders = [
    {
      id: 'ORD-1089',
      date: '28 أكتوبر 2026',
      total: 4500,
      paid: 0,
      status: 'معلقة بالسداد',
      statusColor: 'text-brand-warning',
    },
    {
      id: 'ORD-1042',
      date: '14 أكتوبر 2026',
      total: 3200,
      paid: 3200,
      status: 'مسددة بالكامل',
      statusColor: 'text-brand-success',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      <RepHeader
        title={salon.name}
        subtitle={`المسؤول: ${salon.contactPerson}`}
        showBack
      />

      <div className="p-4 space-y-4">
        {/* رادار الائتمان والمديونية المالي */}
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-400 block">حالة الحساب المالي</span>
              <StatusBadge status={salon.status} />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-400 block">شريحة السعر</span>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-brand-primary bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Tag size={12} className="text-brand-gold" />
                جملة صالونات
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-red-50/60 p-3 rounded-xl border border-red-200/70">
              <span className="text-[11px] font-bold text-red-700 block">المديونية الحالية</span>
              <MoneyDisplay amount={salon.balance} size="lg" colored isDebt className="mt-1" />
            </div>
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70">
              <span className="text-[11px] font-bold text-emerald-800 block">الحد الائتماني المتبقي</span>
              <MoneyDisplay amount={salon.availableCredit} size="lg" colored className="mt-1" />
            </div>
          </div>

          {/* شريط استهلاك الحد الائتماني */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
              <span>نسبة استخدام الحد الائتماني:</span>
              <span>{Math.round((salon.balance / salon.creditLimit) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-warning h-full rounded-full transition-all"
                style={{ width: `${(salon.balance / salon.creditLimit) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-1">
              <span>0 ج.م</span>
              <span>أقصى حد: {salon.creditLimit.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>
        </div>

        {/* شبكة الإجراءات الميدانية الأربعة الرئيسية */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/rep/order/new?salonId=${salon.id}`}>
            <Button
              variant="gold"
              size="lg"
              className="flex flex-col gap-1 items-center justify-center p-4 min-h-[72px]"
            >
              <div className="flex items-center gap-1.5">
                <ShoppingBag size={20} />
                <span className="text-base font-black">طلبية جديدة</span>
              </div>
              <span className="text-[11px] text-slate-800 font-bold">بوانص وخصومات فورية</span>
            </Button>
          </Link>

          <Link href={`/rep/payment?salonId=${salon.id}`}>
            <Button
              variant="success"
              size="lg"
              className="flex flex-col gap-1 items-center justify-center p-4 min-h-[72px]"
            >
              <div className="flex items-center gap-1.5">
                <TrendingUp size={20} />
                <span className="text-base font-black">تحصيل نقدية</span>
              </div>
              <span className="text-[11px] text-emerald-100 font-bold">إيصال كاش / محفظة</span>
            </Button>
          </Link>

          <Link href={`/rep/returns?salonId=${salon.id}`}>
            <Button
              variant="outline"
              size="md"
              className="flex items-center justify-center gap-2 text-xs font-bold border-slate-300"
            >
              <RotateCcw size={16} className="text-slate-600" />
              <span>تسجيل مرتجع</span>
            </Button>
          </Link>

          <a
            href={`https://wa.me/2${salon.phone}?text=${encodeURIComponent(`أهلاً يا ${salon.contactPerson}، تفضل كشف حسابك المحدث من شركة الأمل.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-300 rounded-xl font-bold text-xs min-h-[50px] transition-colors"
          >
            <MessageSquare size={16} className="text-emerald-600" />
            <span>كشف حساب واتساب</span>
          </a>
        </div>

        {/* سجل آخر الطلبيات */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
              <Clock size={16} className="text-brand-primary" />
              <span>آخر الفواتير والطلبيات</span>
            </h3>
            <span className="text-xs text-brand-gold font-bold">عرض الكل</span>
          </div>

          <div className="space-y-2.5">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-extrabold text-slate-900 block font-mono">{ord.id}</span>
                  <span className="text-slate-400 font-bold text-[11px]">{ord.date}</span>
                </div>
                <div className="text-left">
                  <MoneyDisplay amount={ord.total} size="sm" />
                  <span className={`block font-bold text-[11px] ${ord.statusColor} mt-0.5`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* تفاصيل العنوان وملاحظات الصالون الميدانية */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-brand-gps shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">العنوان الجغرافي:</span>
              <span className="text-slate-600">{salon.address}</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl mt-2 text-amber-900 font-medium leading-relaxed">
            💡 <strong>تفضيلات الصالون:</strong> {salon.notes}
          </div>
        </div>
      </div>
    </div>
  );
}
