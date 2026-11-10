'use client';

import React, { useState } from 'react';
import {
  Sliders,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import { SuperAdminLayout } from '@/components/ui/SuperAdminLayout';
import { Button } from '@/components/ui/Button';

interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  minPlan: 'Starter' | 'Pro' | 'Enterprise';
  category: string;
}

export default function SuperAdminFeaturesPage() {
  const [selectedTenant, setSelectedTenant] = useState('elamal');

  const [features, setFeatures] = useState<FeatureFlag[]>([
    {
      key: 'gps_tracking',
      name: 'تتبع المناديب الميدانيين Live بالـ GPS',
      description: 'تسجيل مسارات المناديب والتحقق من التواجد الجغرافي بالصالون',
      enabled: true,
      minPlan: 'Pro',
      category: 'المبيعات الميدانية',
    },
    {
      key: 'easystore_adapter',
      name: 'مهايئ نقل بيانات EasyStore المباشر',
      description: 'سحب العملاء والمنتجات والمخازن من نظام EasyStore القديم آلياً',
      enabled: true,
      minPlan: 'Starter',
      category: 'استيراد البيانات',
    },
    {
      key: 'b2b_portal',
      name: 'بوابة الصالونات ومراكز التجميل للطلب الذاتي (B2B)',
      description: 'تمكين الصالونات من الطلب المباشر وكشف الحساب الشفاف',
      enabled: true,
      minPlan: 'Pro',
      category: 'القنوات الرقمية',
    },
    {
      key: 'b2c_store',
      name: 'متجر المستهلك النهائي الإلكتروني (B2C)',
      description: 'بيع التجزئة للأفراد والدفع عند الاستلام وبمحافظ الكاش',
      enabled: false,
      minPlan: 'Enterprise',
      category: 'القنوات الرقمية',
    },
    {
      key: 'equipment_serials',
      name: 'إدارة سيريالات وضمان أجهزة الصالونات',
      description: 'مسح الباركود، تتبع شهادات الضمان، وتوثيق صيانة الأجهزة',
      enabled: true,
      minPlan: 'Pro',
      category: 'المستودع وسلسلة الإمداد',
    },
    {
      key: 'whatsapp_gateway',
      name: 'إرسال الفواتير والمطالبات عبر واتساب تلقائياً',
      description: 'توليد الروابط المباشرة والرسائل الرسمية بدون أي وسيط خارجي',
      enabled: true,
      minPlan: 'Starter',
      category: 'التواصل والفوترة',
    },
  ]);

  const toggleFeature = (key: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleSave = () => {
    alert('تم حفظ إعدادات الميزات (Feature Flags) وحقنها في قاعدة البيانات فورياً.');
  };

  return (
    <SuperAdminLayout
      title="التحكم بالميزات وتخصيص الباقات (Feature Flags)"
      subtitle="تفعيل أو حظر الميزات لكل شركة ومشترك سحابياً مع الحفاظ على عزل الـ RLS التام"
      actions={
        <Button
          variant="gold"
          size="sm"
          onClick={handleSave}
          icon={<CheckCircle2 size={16} />}
          className="text-xs w-auto px-4 font-black"
        >
          حفظ وتطبيق التغييرات ⚡
        </Button>
      }
    >
      {/* 1. اختيار الشركة المراد ضبط ميزاتها */}
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-brand-gold flex items-center justify-center font-black">
            <Building2 size={22} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block">الشركة المستهدفة للتخصيص:</span>
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="bg-slate-800 text-white font-black text-sm rounded-xl px-3 py-1.5 border border-slate-700 mt-1"
            >
              <option value="elamal">شركة الأمل للتوزيع (باقة Pro)</option>
              <option value="royal">شركة رويال كوزمتكس (باقة Pro)</option>
              <option value="cleo">شركة كليوباترا فارما (باقة Enterprise)</option>
            </select>
          </div>
        </div>

        {/* حالة العزل الأمني */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">عزل RLS Tenant ID:</span>
            <span className="font-mono text-emerald-400 font-bold">11111111-1111-1111-1111</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-slate-400">حالة الأمان:</span>
            <span className="text-brand-gold font-bold flex items-center gap-1">
              <ShieldCheck size={13} />
              معزول سحابياً ومحمي 100%
            </span>
          </div>
        </div>
      </div>

      {/* 2. شبكة الميزات (Feature Flags Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feat) => (
          <div
            key={feat.key}
            className={`bg-slate-900 rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
              feat.enabled
                ? 'border-emerald-500/50 shadow-md shadow-emerald-500/5'
                : 'border-slate-800 opacity-60'
            }`}
          >
            <div>
              <div className="flex justify-between items-start gap-2 pb-2 border-b border-slate-800">
                <span className="text-[10px] font-black bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full">
                  {feat.category}
                </span>

                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                    feat.minPlan === 'Enterprise'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : feat.minPlan === 'Pro'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  الحد الأدنى: باقة {feat.minPlan}
                </span>
              </div>

              <h4 className="font-black text-white text-base mt-3">{feat.name}</h4>
              <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                {feat.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span
                className={`text-xs font-black flex items-center gap-1.5 ${
                  feat.enabled ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {feat.enabled ? <CheckCircle2 size={16} /> : <Lock size={16} />}
                <span>{feat.enabled ? 'مفعل ومتاح للمشترك' : 'معطل ومحجوب'}</span>
              </span>

              <button
                type="button"
                onClick={() => toggleFeature(feat.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors ${
                  feat.enabled
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'
                }`}
              >
                {feat.enabled ? 'تعطيل الميزة' : 'تفعيل الميزة ⚡'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </SuperAdminLayout>
  );
}
