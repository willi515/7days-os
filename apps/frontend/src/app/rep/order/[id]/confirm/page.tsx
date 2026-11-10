'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  MessageSquare,
  Printer,
  MapPin,
  Share2,
  Sparkles,
  ShieldCheck,
  Gift,
  FileCheck,
} from 'lucide-react';
import { RepHeader } from '@/components/ui/RepHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

function ConfirmContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const orderId = params?.id || 'ORD-1090';
  const total = parseFloat(searchParams.get('total') || '3300');
  const paid = parseFloat(searchParams.get('paid') || '2000');
  const paymentMethod = searchParams.get('method') || 'cash';
  const bonus = parseInt(searchParams.get('bonus') || '1', 10);

  const salon = {
    name: 'بيوتي سنتر الملكة',
    contactPerson: 'مدام سوزان',
    phone: '01012345678',
    address: '15 شارع عباس العقاد - مدينة نصر',
  };

  const remaining = Math.max(0, total - paid);
  const totalSalonBalance = 4500 + remaining;

  // نص الفاتورة المهني الجاهز للواتساب
  const whatsappMessage = `*شركة الأمل لتوزيع مستحضرات التجميل ومعدات الصالونات*
فاتورة بيع رسمية رقم: #${orderId}
الصالون: ${salon.name} (${salon.contactPerson})
التاريخ: 10 نوفمبر 2026

الأصناف:
- 10x شامبو كيراتين برازيلي 1000 مل: 2,000 ج.م
  🎁 بونص مجاني: +1 قطعة مجاناً
- 1x سشوار تورنادو 2500 وات (ضمان سنة - سيريال: TR-882209): 1,300 ج.م

-----------------------------
*إجمالي الفاتورة:* ${total.toLocaleString('ar-EG')} ج.م
*المدفوع نقداً:* ${paid.toLocaleString('ar-EG')} ج.م
*المتبقي من الفاتورة:* ${remaining.toLocaleString('ar-EG')} ج.م
*إجمالي الحساب المتبقي:* ${totalSalonBalance.toLocaleString('ar-EG')} ج.م
-----------------------------
مندوب المبيعات: أحمد فتحي (01012345678)
شكراً لتعاملكم معنا! 🌹`;

  return (
    <div className="p-4 space-y-4">
      {/* شارة النجاح العلوية */}
      <div className="bg-emerald-500 text-white rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-emerald-600 shadow-md mb-2">
          <CheckCircle2 size={36} className="stroke-[2.5]" />
        </div>
        <h2 className="text-xl font-black">تم تسجيل الفاتورة بنجاح!</h2>
        <p className="text-emerald-100 text-xs font-bold mt-1">
          تم تحديث رصيد الصالون وحركات المخزن وإرسال البيانات للفرع الرئيسي.
        </p>
      </div>

      {/* بطاقة الفاتورة الرقمية */}
      <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-start pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">رقم الفاتورة</span>
            <span className="font-mono text-base font-black text-brand-primary">#{orderId}</span>
          </div>
          <div className="text-left">
            <span className="text-[11px] font-bold text-slate-400 block">الصالون</span>
            <span className="text-sm font-extrabold text-slate-900">{salon.name}</span>
          </div>
        </div>

        {/* تفاصيل الأصناف المحسوبة */}
        <div className="space-y-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">10x شامبو كيراتين برازيلي 1000 مل</span>
              {bonus > 0 && (
                <span className="text-[11px] font-extrabold text-amber-700 flex items-center gap-1 mt-0.5">
                  <Gift size={12} className="text-brand-gold" />
                  +{bonus} قطعة بونص مجاني 🎁
                </span>
              )}
            </div>
            <span className="font-black text-slate-900">2,000 ج.م</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">1x سشوار تورنادو صالونات 2500 وات</span>
              <span className="text-[11px] font-semibold text-brand-gps flex items-center gap-1 mt-0.5">
                <ShieldCheck size={12} />
                ضمان 12 شهراً · سيريال: TR-882209
              </span>
            </div>
            <span className="font-black text-slate-900">1,300 ج.م</span>
          </div>
        </div>

        {/* الحسابات المالية */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs font-bold">
          <div className="flex justify-between text-slate-600">
            <span>إجمالي قيمة الطلبية:</span>
            <span className="font-black text-slate-900">{total.toLocaleString('ar-EG')} ج.م</span>
          </div>
          <div className="flex justify-between text-emerald-700">
            <span>المبلغ المدفوع (إيصال استلام):</span>
            <span className="font-black">{paid.toLocaleString('ar-EG')} ج.م</span>
          </div>
          <div className="flex justify-between text-amber-700">
            <span>المتبقي من الفاتورة:</span>
            <span className="font-black">{remaining.toLocaleString('ar-EG')} ج.م</span>
          </div>
          <div className="flex justify-between text-slate-900 pt-2 border-t border-slate-200 text-sm font-black">
            <span>رصيد مديونية الصالون الكلي:</span>
            <span className="text-brand-danger">{totalSalonBalance.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>
      </div>

      {/* زر الواتساب الأخضر الكبير المباشر للصالون */}
      <a
        href={`https://wa.me/2${salon.phone}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-base py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] min-h-[56px] gap-2"
      >
        <MessageSquare size={22} className="stroke-[2.5]" />
        <span>إرسال الفاتورة عبر واتساب للصالون 💬</span>
      </a>

      {/* أزرار الإجراءات الإضافية */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Button
          variant="outline"
          size="md"
          icon={<Printer size={18} />}
          onClick={() => window.print()}
          className="text-xs"
        >
          طباعة إيصال بلوتوث
        </Button>

        <Link href="/rep/route">
          <Button
            variant="primary"
            size="md"
            icon={<MapPin size={18} />}
            className="text-xs"
          >
            العودة لخط السير
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function RepOrderConfirmPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28">
      <RepHeader
        title="تم الاعتماد بنجاح"
        subtitle="فاتورة إلكترونية معتمدة"
        showBack={false}
      />
      <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">جارٍ تحميل بيانات الفاتورة...</div>}>
        <ConfirmContent />
      </Suspense>
    </div>
  );
}

