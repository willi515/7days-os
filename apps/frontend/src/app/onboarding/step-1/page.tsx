'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Globe,
  Upload,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { OnboardingStepper } from '@/components/ui/OnboardingStepper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function OnboardingStep1Page() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState('شركة روعة الجمال لتوزيع مستحضرات التجميل');
  const [taxNumber, setTaxNumber] = useState('109882312');
  const [adminPhone, setAdminPhone] = useState('01012345678');
  const [subdomain, setSubdomain] = useState('rawaa');
  const [brandColor, setBrandColor] = useState('#0F172A');
  const [hasLogo, setHasLogo] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding/step-2');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <OnboardingStepper currentStep={1} />

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg space-y-6">
          {/* 1. بيانات الشركة الأساسية */}
          <div className="space-y-3 pb-5 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-brand-gold text-xs font-mono font-black flex items-center justify-center">
                1
              </span>
              <span>بيانات الشركة الرسمية:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="اسم الشركة التجاري:"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              <Input
                label="رقم السجل التجاري / البطاقة الضريبية:"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                required
              />

              <Input
                label="رقم هاتف الإدارة الرسمي (واتساب الفواتير):"
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                dir="ltr"
                className="font-mono text-left"
                required
              />
            </div>
          </div>

          {/* 2. النطاق المخصص Subdomain */}
          <div className="space-y-3 pb-5 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-brand-gold text-xs font-mono font-black flex items-center justify-center">
                2
              </span>
              <span>النطاق السحابي المخصص لشركتك (Subdomain):</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 font-mono text-sm">
                <span className="text-slate-400 select-none">https://</span>
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                  className="bg-transparent font-black text-brand-primary px-1 focus:outline-none flex-1 text-center"
                  required
                />
                <span className="text-slate-400 select-none">.7daysos.com</span>
              </div>

              <div className="bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-2.5 rounded-xl border border-emerald-200 flex items-center justify-center gap-1.5 shrink-0">
                <CheckCircle2 size={16} className="text-brand-success" />
                <span>متاح وجاهز للحجز الفوري ✅</span>
              </div>
            </div>
          </div>

          {/* 3. الشعار والهوية البصرية */}
          <div className="space-y-3 pb-5 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-900 text-brand-gold text-xs font-mono font-black flex items-center justify-center">
                3
              </span>
              <span>شعار الشركة والهوية البصرية (White-Labeling):</span>
            </h3>

            <div
              onClick={() => setHasLogo(!hasLogo)}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                hasLogo
                  ? 'border-brand-success bg-emerald-50/50 text-emerald-900'
                  : 'border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Upload size={28} className={hasLogo ? 'text-brand-success mx-auto' : 'text-slate-400 mx-auto'} />
              <span className="text-xs font-bold block mt-2">
                {hasLogo
                  ? '✅ تم تحميل شعار الشركة (logo-rawaa.png) بنجاح'
                  : 'اسحب وأفلت شعار الشركة هنا (PNG أو SVG بخلفية شفافة)'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                يظهر الشعار تلقائياً على فواتير المناديب، ملصقات الشحن، ومتجر الصالونات
              </span>
            </div>
          </div>

          {/* 4. العملة الرسمية المعتمدة */}
          <div className="flex items-center justify-between text-xs font-bold bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-slate-700">العملة الأساسية لتعاملات وحسابات النظام:</span>
            <span className="bg-white text-brand-primary px-3 py-1 rounded-lg border border-slate-300 font-black">
              🇪🇬 الجنيه المصري (EGP)
            </span>
          </div>

          {/* أزرار التنقل */}
          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-auto px-8 font-black text-sm"
              icon={<ArrowRight size={18} className="rotate-180" />}
            >
              حفظ ومتابعة للخطوة 2: استيراد المنتجات والمخزون ➔
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
