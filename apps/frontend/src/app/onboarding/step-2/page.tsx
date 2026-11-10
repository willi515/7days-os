'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Upload,
  Database,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Download,
} from 'lucide-react';
import { OnboardingStepper } from '@/components/ui/OnboardingStepper';
import { Button } from '@/components/ui/Button';

export default function OnboardingStep2Page() {
  const router = useRouter();

  const [importMethod, setImportMethod] = useState<'easystore' | 'excel'>('easystore');
  const [isImported, setIsImported] = useState(true);

  const handleNext = () => {
    router.push('/onboarding/step-3');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <OnboardingStepper currentStep={2} />

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg space-y-6">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-brand-gold text-xs font-mono font-black flex items-center justify-center">
                2
              </span>
              <span>اختر طريقة استيراد منتجاتك ومخزونك الأولي:</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              يدعم النظام السحب الذاتي بضغطة زر مع التمييز التلقائي بين مستحضرات الصلاحية وأجهزة الضمان
            </p>
          </div>

          {/* خيارا الاستيراد المعتمدان في المرحلة 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* خيار 1: EasyStore Adapter */}
            <div
              onClick={() => setImportMethod('easystore')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                importMethod === 'easystore'
                  ? 'border-brand-primary bg-slate-900 text-white shadow-lg'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Database size={24} className="text-brand-gold" />
                  <span className="text-[10px] font-black bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full border border-brand-gold/30">
                    مهايئ سحابي مباشر ⚡
                  </span>
                </div>
                <h4 className="font-black text-sm">السحب المباشر من EasyStore</h4>
                <p className={`text-xs mt-1 leading-relaxed ${importMethod === 'easystore' ? 'text-slate-300' : 'text-slate-500'}`}>
                  سحب آلي فوري لبيانات الأصناف، الأكواد، الباركود، وأرصدة المستودع من جداول EasyStore القديمة.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-current/10">
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={15} />
                  جاهز للربط الفوري
                </span>
              </div>
            </div>

            {/* خيار 2: مستورد Excel/CSV */}
            <div
              onClick={() => setImportMethod('excel')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                importMethod === 'excel'
                  ? 'border-brand-primary bg-slate-900 text-white shadow-lg'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <FileSpreadsheet size={24} className="text-emerald-400" />
                  <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    ملفات Excel / CSV 📊
                  </span>
                </div>
                <h4 className="font-black text-sm">رفع شيت إكسيل المنتجات</h4>
                <p className={`text-xs mt-1 leading-relaxed ${importMethod === 'excel' ? 'text-slate-300' : 'text-slate-500'}`}>
                  رفع شيت Excel يحتوي: اسم المنتج، SKU، سعر التكلفة، سعر الجملة، ورصيد المخزن الأولي.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">قالب موحد معتمد</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert('جاري تنزيل قالب المنتجات الموحد 7days-products-template.csv');
                  }}
                  className="text-brand-gold hover:underline font-black flex items-center gap-1"
                >
                  <Download size={13} />
                  <span>تنزيل القالب</span>
                </button>
              </div>
            </div>
          </div>

          {/* معاينة البيانات المستوردة ونتائج الكشف التلقائي الذكي */}
          {isImported && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Sparkles size={16} className="text-brand-gold" />
                  <span>معاينة نتائج الاستيراد (تم التعرف على 142 صنفاً بنجاح ✅)</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">
                  دقة 100%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold block">مستحضرات تجميل وعناية:</span>
                  <strong className="text-sm font-black text-brand-primary block mt-0.5">
                    120 صنفاً
                  </strong>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                    ربط آلي بنظام التشغيلات وتواريخ الصلاحية (FEFO)
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold block">أجهزة ومعدات صالونات (Auto-Detect):</span>
                  <strong className="text-sm font-black text-brand-gps block mt-0.5">
                    22 جهازاً
                  </strong>
                  <span className="text-[10px] text-blue-700 font-bold block mt-1">
                    ربط آلي بمسح السيريالات وشهادات الضمان (سشوار، مكواة، استريتشر)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* أزرار التنقل */}
          <div className="pt-2 flex justify-between items-center">
            <Link href="/onboarding/step-1">
              <Button variant="outline" size="md" className="w-auto px-5 text-xs">
                ◀ السابق: خطوة 1
              </Button>
            </Link>

            <Button
              variant="gold"
              size="lg"
              onClick={handleNext}
              className="w-auto px-8 font-black text-sm"
              icon={<ArrowRight size={18} className="rotate-180" />}
            >
              حفظ ومتابعة للخطوة 3: الصالونات والديون ➔
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
