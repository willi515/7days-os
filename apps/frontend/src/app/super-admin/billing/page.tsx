'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Building2,
  Printer,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { SuperAdminLayout } from '@/components/ui/SuperAdminLayout';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

export default function SuperAdminBillingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'باقة البداية (Starter)',
      description: 'للشركات الناشئة والموزعين المبتدئين في المحافظات',
      monthlyPrice: 1500,
      yearlyPrice: 15000,
      features: [
        'حتى 3 مناديب مبيعات ميدانيين',
        'مستودع مركزي واحد بنظام FEFO',
        'تطبيق المندوب الميداني PWA',
        'رادار الديون والائتمان',
        'مستورد ملفات Excel/CSV',
      ],
      currentSubscribers: 6,
    },
    {
      id: 'pro',
      name: 'باقة الاحتراف (Pro)',
      description: 'الخيار القياسي لمعظم شركات توزيع مستحضرات التجميل',
      monthlyPrice: 4500,
      yearlyPrice: 45000,
      highlight: true,
      features: [
        'حتى 15 مندوب مبيعات ميداني',
        'خريطة تتبع المناديب Live بالـ GPS',
        'بوابة الصالونات الذاتية (B2B)',
        'محول EasyStore المباشر',
        'نظام البوانص والعروض التلقائية',
        'طباعة ملصقات الشحن الحرارية',
      ],
      currentSubscribers: 18,
    },
    {
      id: 'enterprise',
      name: 'باقة المؤسسات (Enterprise)',
      description: 'لكبرى شركات ومصانع التجميل والتجهيزات',
      monthlyPrice: 9500,
      yearlyPrice: 95000,
      features: [
        'عدد مناديب مبيعات غير محدود',
        'متجر المستهلك الإلكتروني (B2C)',
        'فروع ومستودعات متعددة',
        'دعم فني خاص على مدار الساعة',
        'عزل متقدم ومساحة سحابية غير محدودة',
      ],
      currentSubscribers: 4,
    },
  ];

  const recentInvoices = [
    { id: 'INV-SUB-108', company: 'شركة الأمل للتوزيع', plan: 'Pro', amount: 4500, date: '01 نوفمبر 2026', status: 'مدفوعة' },
    { id: 'INV-SUB-107', company: 'رويال كوزمتكس', plan: 'Pro', amount: 4500, date: '28 أكتوبر 2026', status: 'مدفوعة' },
    { id: 'INV-SUB-106', company: 'كليوباترا فارما', plan: 'Enterprise', amount: 9500, date: '15 أكتوبر 2026', status: 'مدفوعة' },
  ];

  return (
    <SuperAdminLayout
      title="باقات الاشتراكات والفوترة السحابية"
      subtitle="إدارة أسعار الباقات الشهرية والسنوية ومتابعة مدفوعات اشتراكات الشركات"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Printer size={16} />}
            onClick={() => window.print()}
            className="text-xs w-auto text-white border-slate-700 hover:bg-slate-800"
          >
            طباعة تقرير الفوترة 🖨️
          </Button>
        </div>
      }
    >
      {/* 1. أداة التبديل بين الفوترة الشهرية والسنوية */}
      <div className="flex justify-center pb-2">
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              billingCycle === 'monthly'
                ? 'bg-brand-gold text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الاشتراك الشهري (Monthly)
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              billingCycle === 'yearly'
                ? 'bg-brand-gold text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الاشتراك السنوي (وفر شهرين مجاناً 🎁)
          </button>
        </div>
      </div>

      {/* 2. بطاقات الباقات الثلاثة المعتمدة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border-2 flex flex-col justify-between transition-all ${
                plan.highlight
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-brand-gold shadow-xl shadow-amber-500/5 relative'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                {plan.highlight && (
                  <span className="bg-brand-gold text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase absolute -top-3 right-6 shadow-md">
                    الباقة الأكثر طلباً ⭐
                  </span>
                )}

                <h3 className="text-lg font-black text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                  {plan.description}
                </p>

                <div className="my-5 pb-4 border-b border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <MoneyDisplay amount={price} size="xl" className="text-brand-gold font-mono" />
                    <span className="text-xs text-slate-400 font-bold">
                      {billingCycle === 'monthly' ? '/ شهرياً' : '/ سنوياً'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold mt-1 block">
                    {plan.currentSubscribers} شركات مشتركة حالياً بهذة الباقة
                  </span>
                </div>

                {/* ميزات الباقة */}
                <div className="space-y-2.5 text-xs text-slate-300 font-medium">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-brand-gold shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <Button
                  variant={plan.highlight ? 'gold' : 'primary'}
                  size="md"
                  className={plan.highlight ? 'font-black' : 'border border-slate-700'}
                  onClick={() => alert(`تم تحديد تعديل باقة: ${plan.name}`)}
                >
                  تعديل تسعير الباقة وميزاتها ⚙️
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. سجل فواتير الاشتراكات الأخيرة */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm p-5 space-y-4">
        <h3 className="font-black text-white text-base pb-3 border-b border-slate-800 flex items-center gap-2">
          <CreditCard size={18} className="text-brand-gold" />
          <span>سجل فواتير الاشتراكات والتحصيلات السحابية</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-black border-b border-slate-800">
              <tr>
                <th className="p-3">رقم الفاتورة</th>
                <th className="p-3">الشركة المشتركة</th>
                <th className="p-3">الباقة</th>
                <th className="p-3">تاريخ الدفع</th>
                <th className="p-3">المبلغ المحصل</th>
                <th className="p-3 text-left">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-semibold text-slate-300">
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-mono font-black text-white">{inv.id}</td>
                  <td className="p-3 font-black text-white">{inv.company}</td>
                  <td className="p-3 text-slate-400">{inv.plan}</td>
                  <td className="p-3 font-mono text-slate-400">{inv.date}</td>
                  <td className="p-3 font-mono text-brand-gold font-bold">
                    {inv.amount.toLocaleString('ar-EG')} ج.م
                  </td>
                  <td className="p-3 text-left">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {inv.status} ✅
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
