'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { B2BHeader } from '@/components/ui/B2BHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

export default function B2BCheckoutPage() {
  const [paymentOption, setPaymentOption] = useState<'credit' | 'cash_on_delivery' | 'ewallet'>('credit');
  const [deliverySlot, setDeliverySlot] = useState<'morning' | 'evening'>('morning');
  const [notes, setNotes] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);

  const orderTotal = 2550;
  const availableCredit = 7800;

  const handleConfirmOrder = () => {
    setIsOrdered(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      <B2BHeader />

      <main className="max-w-4xl mx-auto w-full p-4 space-y-4 flex-1">
        {isOrdered ? (
          /* شاشة التتبع المباشر للطلب (Live Tracking Stepper) */
          <div className="space-y-4">
            <div className="bg-emerald-500 text-white rounded-2xl p-6 text-center shadow-lg space-y-2">
              <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-xl font-black">تم تأكيد طلب صالونك بنجاح!</h2>
              <p className="text-xs text-emerald-100 font-bold">
                رقم الطلب: <span className="font-mono text-white text-sm">#ORD-2026-1250</span> · القيمة: {orderTotal.toLocaleString('ar-EG')} ج.م
              </p>
            </div>

            {/* مراحل تتبع الشحنة من المستودع إلى الصالون */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Truck size={18} className="text-brand-gps" />
                <span>حالة تتبع الشحنة المباشرة:</span>
              </h3>

              <div className="relative pr-6 space-y-6 border-r-2 border-slate-200">
                {/* الخطوة 1 */}
                <div className="relative">
                  <span className="absolute -right-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <strong className="block text-slate-900 text-xs font-black">
                    1. تم تسجيل الطلب واعتماده آلياً ✅
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    10 نوفمبر 2026 - تم إشعار المندوب المسؤول (محمد سالم)
                  </p>
                </div>

                {/* الخطوة 2 */}
                <div className="relative">
                  <span className="absolute -right-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 animate-pulse ring-4 ring-blue-100" />
                  <strong className="block text-brand-primary text-xs font-black">
                    2. جارٍ التجهيز والتجميع بنظام FEFO بالمستودع 📦
                  </strong>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-bold">
                    مشرف المستودع يفحص التشغيلات وتاريخ الصلاحية
                  </p>
                </div>

                {/* الخطوة 3 */}
                <div className="relative opacity-50">
                  <span className="absolute -right-[31px] top-0 w-4 h-4 rounded-full bg-slate-300" />
                  <strong className="block text-slate-700 text-xs font-bold">
                    3. خروج سيارة التوزيع مع السائق 🚚
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    الوصول المتوقع: غداً صباحاً (بين 10 ص - 2 ظ)
                  </p>
                </div>

                {/* الخطوة 4 */}
                <div className="relative opacity-50">
                  <span className="absolute -right-[31px] top-0 w-4 h-4 rounded-full bg-slate-300" />
                  <strong className="block text-slate-700 text-xs font-bold">
                    4. التسليم والتوقيع بمقر الصالون 💇‍♀️
                  </strong>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    15 شارع عباس العقاد - مدينة نصر
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold">
                  المندوب المسؤول: <strong>محمد سالم (01011223344)</strong>
                </span>
                <Link href="/b2b/catalog">
                  <Button variant="outline" size="sm" className="text-xs w-auto">
                    العودة للكتالوج
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* شاشة مراجعة السلة وتحديد خيارات السداد */
          <div className="space-y-4">
            {/* ملخص عناصر الطلبية */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-primary" />
                <span>محتويات طلبية الصالون:</span>
              </h3>

              <div className="space-y-2 text-xs font-bold divide-y divide-slate-100">
                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="text-slate-900 block font-black">
                      1x بروتين برازيلي معالج مكثف 1000 مل
                    </span>
                    <span className="text-slate-400 text-[11px]">سعر الصالون الحصري</span>
                  </div>
                  <span className="font-mono">1,250 ج.م</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="text-slate-900 block font-black">
                      1x سشوار صالونات تورنادو 2500 وات
                    </span>
                    <span className="text-brand-gps text-[11px]">ضمان معتمد 12 شهراً</span>
                  </div>
                  <span className="font-mono">1,300 ج.م</span>
                </div>

                <div className="pt-2 flex justify-between items-center text-emerald-700">
                  <span>تكلفة الشحن والتوصيل للمشغل:</span>
                  <span className="font-black">مجاناً (عرض الصالونات المعتمدة) 🎉</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-center">
                <span className="text-sm font-black text-slate-900">صافي قيمة الطلبية:</span>
                <MoneyDisplay amount={orderTotal} size="xl" className="text-brand-primary" />
              </div>
            </div>

            {/* طريقة السداد المفضلة */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-slate-900 text-sm">اختاري طريقة السداد المناسبة:</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentOption('credit')}
                  className={`p-3.5 rounded-xl border-2 text-right transition-all ${
                    paymentOption === 'credit'
                      ? 'border-brand-primary bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard size={18} className="text-brand-gold mb-1.5" />
                  <strong className="block text-sm">آجل على حساب الصالون</strong>
                  <span className="text-[10px] opacity-80 block mt-0.5">
                    يخصم من الائتمان المتاح (7,800 ج.م)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOption('cash_on_delivery')}
                  className={`p-3.5 rounded-xl border-2 text-right transition-all ${
                    paymentOption === 'cash_on_delivery'
                      ? 'border-brand-primary bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Banknote size={18} className="text-emerald-400 mb-1.5" />
                  <strong className="block text-sm">نقداً عند الاستلام</strong>
                  <span className="text-[10px] opacity-80 block mt-0.5">
                    تسليم المبلغ لسائق الشاحنة بمشغلك
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOption('ewallet')}
                  className={`p-3.5 rounded-xl border-2 text-right transition-all ${
                    paymentOption === 'ewallet'
                      ? 'border-brand-primary bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone size={18} className="text-amber-400 mb-1.5" />
                  <strong className="block text-sm">فودافون كاش / إنستاباي</strong>
                  <span className="text-[10px] opacity-80 block mt-0.5">
                    تحويل فوري لمحفظة الشركة الرسمية
                  </span>
                </button>
              </div>
            </div>

            {/* موعد التوصيل المفضل */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
              <label className="text-xs font-black text-slate-800 block">
                الوقت المفضل لوصول مندوب الشحن للصالون:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDeliverySlot('morning')}
                  className={`p-2.5 rounded-xl border-2 transition-all ${
                    deliverySlot === 'morning'
                      ? 'border-brand-primary bg-slate-100 text-slate-900 font-black'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  الفترة الصباحية (10 ص - 2 ظ) ☀️
                </button>
                <button
                  type="button"
                  onClick={() => setDeliverySlot('evening')}
                  className={`p-2.5 rounded-xl border-2 transition-all ${
                    deliverySlot === 'evening'
                      ? 'border-brand-primary bg-slate-100 text-slate-900 font-black'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  الفترة المسائية (2 ظ - 7 م) 🌙
                </button>
              </div>
            </div>

            {/* زر تأكيد الطلب النهائي */}
            <Button
              variant="gold"
              size="lg"
              onClick={handleConfirmOrder}
              icon={<CheckCircle2 size={20} />}
            >
              تأكيد وإرسال الطلبية للمستودع المركزي 🚀
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
