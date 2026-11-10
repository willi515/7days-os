'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Upload,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { OnboardingStepper } from '@/components/ui/OnboardingStepper';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function OnboardingStep3Page() {
  const router = useRouter();

  const [defaultPaymentDays, setDefaultPaymentDays] = useState('30');
  const [defaultCreditLimit, setDefaultCreditLimit] = useState('5000');
  const [defaultReturnWithoutInvoiceLimit, setDefaultReturnWithoutInvoiceLimit] = useState('500');

  const handleNext = () => {
    router.push('/onboarding/step-4');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <OnboardingStepper currentStep={3} />

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg space-y-6">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-brand-gold text-xs font-mono font-black flex items-center justify-center">
                3
              </span>
              <span>استيراد الصالونات وقواعد الحدود الائتمانية والديون:</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              تسجيل قاعدة العملاء الحالية، تثبيت الأرصدة الافتتاحية السابقة، وضبط قواعد الائتمان الآمنة
            </p>
          </div>

          {/* ملخص العملاء والمديونيات المستوردة بنجاح */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-brand-success" />
                <span>تم سحب وتدقيق بيانات 85 عميلاً وصالوناً بنجاح ✅</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">
                مطابق 100%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block">صالونات ومراكز تجميل:</span>
                <strong className="text-sm font-black text-slate-900 block mt-0.5">
                  65 صالوناً
                </strong>
                <span className="text-[10px] text-slate-500 font-bold block mt-1">
                  شريحة أسعار الجملة المعتمدة
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block">تجار جملة وتجزئة:</span>
                <strong className="text-sm font-black text-slate-900 block mt-0.5">
                  20 عميلاً
                </strong>
                <span className="text-[10px] text-slate-500 font-bold block mt-1">
                  شريحة أسعار كبار التجار
                </span>
              </div>

              <div className="bg-red-50 p-3.5 rounded-xl border border-red-200">
                <span className="text-red-700 font-bold block">إجمالي الديون السابقة المستوردة:</span>
                <MoneyDisplay amount={240500} size="md" colored isDebt className="mt-0.5" />
                <span className="text-[10px] text-red-600 font-bold block mt-1">
                  سُجلت كأرصدة افتتاحية (Opening Balances)
                </span>
              </div>
            </div>
          </div>

          {/* إعدادات وضوابط الائتمان الآمنة */}
          <div className="space-y-3 pb-2 border-b border-slate-100">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <CreditCard size={16} className="text-brand-primary" />
              <span>الضوابط الائتمانية الافتراضية للصالونات (يمكن تعديلها لكل صالون):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  أقصى فترة سداد مسموحة:
                </label>
                <select
                  value={defaultPaymentDays}
                  onChange={(e) => setDefaultPaymentDays(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-800 min-h-[46px]"
                >
                  <option value="14">14 يوماً من الفاتورة</option>
                  <option value="30">30 يوماً (الافتراضي الموصى به)</option>
                  <option value="45">45 يوماً</option>
                  <option value="60">60 يوماً</option>
                </select>
              </div>

              <Input
                label="الحد الائتماني الافتراضي (ج.م):"
                type="number"
                value={defaultCreditLimit}
                onChange={(e) => setDefaultCreditLimit(e.target.value)}
                className="font-mono text-center font-bold"
              />

              <Input
                label="حد المرتجع بدون فاتورة سابقة (ج.م):"
                type="number"
                value={defaultReturnWithoutInvoiceLimit}
                onChange={(e) => setDefaultReturnWithoutInvoiceLimit(e.target.value)}
                className="font-mono text-center font-bold"
              />
            </div>
          </div>

          {/* التوزيع الجغرافي الآلي */}
          <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 flex items-center gap-2 text-xs text-blue-900 font-bold">
            <MapPin size={18} className="text-brand-gps shrink-0" />
            <span>
              تم تصنيف العملاء آلياً حسب المحافظات (القاهرة، الجيزة، الإسكندرية) لتسهيل توزيع خطوط السير على المناديب في الخطوة القادمة.
            </span>
          </div>

          {/* أزرار التنقل */}
          <div className="pt-2 flex justify-between items-center">
            <Link href="/onboarding/step-2">
              <Button variant="outline" size="md" className="w-auto px-5 text-xs">
                ◀ السابق: خطوة 2
              </Button>
            </Link>

            <Button
              variant="gold"
              size="lg"
              onClick={handleNext}
              className="w-auto px-8 font-black text-sm"
              icon={<ArrowRight size={18} className="rotate-180" />}
            >
              حفظ ومتابعة للخطوة 4: فريق المبيعات والإطلاق ➔
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
