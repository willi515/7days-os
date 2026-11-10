'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Building2, Package, Users, Rocket, CheckCircle2 } from 'lucide-react';

interface OnboardingStepperProps {
  currentStep: 1 | 2 | 3 | 4;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ currentStep }) => {
  const steps = [
    { step: 1, label: 'الهوية والنطاق', percent: 25, icon: Building2 },
    { step: 2, label: 'المنتجات والمخزون', percent: 50, icon: Package },
    { step: 3, label: 'الصالونات والديون', percent: 75, icon: Users },
    { step: 4, label: 'المناديب والإطلاق', percent: 100, icon: Rocket },
  ];

  const currentPercent = currentStep === 1 ? 25 : currentStep === 2 ? 50 : currentStep === 3 ? 75 : 100;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md mb-6 space-y-4">
      {/* رأس المعالج */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-gold text-slate-950 flex items-center justify-center font-black shadow-md">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white leading-tight">
              معالج تهيئة الشركة الجديدة في 10 دقائق
            </h2>
            <span className="text-[11px] text-brand-gold font-bold">
              خطوة {currentStep} من 4 · {currentPercent}% مكتمل
            </span>
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-3 py-1 rounded-full border border-slate-700 w-fit">
          7Days OS Onboarding Engine
        </span>
      </div>

      {/* شريط التقدم المرئي */}
      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-brand-gold h-full rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
          style={{ width: `${currentPercent}%` }}
        />
      </div>

      {/* الخطوات الأربعة */}
      <div className="grid grid-cols-4 gap-2 pt-1 text-center">
        {steps.map((s) => {
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          const Icon = s.icon;

          return (
            <div
              key={s.step}
              className={`p-2 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-slate-800 text-brand-gold border border-brand-gold/40 font-black'
                  : isDone
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-500 font-medium'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {isDone ? (
                  <CheckCircle2 size={15} className="text-emerald-400" />
                ) : (
                  <Icon size={15} className={isCurrent ? 'text-brand-gold' : 'text-slate-500'} />
                )}
                <span className="text-xs font-mono font-black">{s.step}</span>
              </div>
              <span className="text-[11px] block truncate">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
