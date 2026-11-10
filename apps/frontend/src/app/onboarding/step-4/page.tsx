'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  Plus,
  Send,
  CheckCircle2,
  Rocket,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { OnboardingStepper } from '@/components/ui/OnboardingStepper';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SalesRepEntry {
  name: string;
  phone: string;
  role: 'rep' | 'driver';
  zone: string;
}

export default function OnboardingStep4Page() {
  const router = useRouter();

  const [team, setTeam] = useState<SalesRepEntry[]>([
    { name: 'محمد سالم', phone: '01011223344', role: 'rep', zone: 'مدينة نصر والتجمع' },
    { name: 'علي حسن', phone: '01223344556', role: 'rep', zone: 'الهرم وفيصل (الجيزة)' },
    { name: 'أحمد فؤاد', phone: '01511223344', role: 'rep', zone: 'مصر الجديدة والنزهة' },
    { name: 'عماد عبد الرحمن', phone: '01155667788', role: 'driver', zone: 'سائق شاحنة رقم ق ص ج 4821' },
  ]);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newZone, setNewZone] = useState('');
  const [isLaunched, setIsLaunched] = useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setTeam((prev) => [
      ...prev,
      {
        name: newName,
        phone: newPhone || '01000000000',
        role: 'rep',
        zone: newZone || 'منطقة القاهرة الكبرى',
      },
    ]);

    setNewName('');
    setNewPhone('');
    setNewZone('');
  };

  const handleFinalLaunch = () => {
    setIsLaunched(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <OnboardingStepper currentStep={4} />

        {isLaunched ? (
          /* شاشة الاحتفال بنجاح الإطلاق والتشغيل النهائي للمنصة */
          <div className="bg-white rounded-2xl p-8 border-2 border-emerald-300 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
              <Rocket size={42} className="animate-bounce" />
            </div>

            <div>
              <span className="bg-brand-gold text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
                تهانينا! شركتك جاهزة للبيع بنسبة 100% 🚀
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                تم تهيئة منصة 7Days OS لشركتك بنجاح تام!
              </h2>
              <p className="text-xs text-slate-500 font-bold max-w-md mx-auto mt-1 leading-relaxed">
                تم إنشاء قاعدة البيانات المعزولة، استيراد 142 صنفاً و 85 صالوناً، وتوليد حسابات الدخول لفريق المناديب وإرسال روابط التفعيل عبر واتساب.
              </p>
            </div>

            {/* بطاقات الانتقال المباشر */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
              <Link href="/admin/dashboard">
                <Button
                  variant="gold"
                  size="lg"
                  className="font-black text-sm h-full flex flex-col items-center justify-center p-4 min-h-[76px]"
                >
                  <Building2 size={24} className="mb-1" />
                  <span>فتح لوحة تحكم الإدارة (Admin) 📊</span>
                </Button>
              </Link>

              <Link href="/rep/route">
                <Button
                  variant="primary"
                  size="lg"
                  className="font-black text-sm h-full flex flex-col items-center justify-center p-4 min-h-[76px]"
                >
                  <Rocket size={24} className="mb-1" />
                  <span>فتح تطبيق المندوب وتجربته (PWA) 📱</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* خطوة تسجيل فريق المبيعات والإطلاق */
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-brand-gold text-xs font-mono font-black flex items-center justify-center">
                  4
                </span>
                <span>فريق المناديب والتوصيل وإطلاق المنظومة:</span>
              </h3>
              <p className="text-xs text-slate-500 font-bold mt-1">
                سيتلقى كل مندوب رسالة واتساب آلية تحتوي رابط تطبيق الموبايل PWA وبيانات دخوله فور الإطلاق
              </p>
            </div>

            {/* قائمة الفريق المجهز */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-black text-slate-700">أعضاء الفريق المسجلين ({team.length}):</h4>
              <div className="space-y-2">
                {team.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 font-black flex items-center justify-center text-xs">
                        {member.role === 'rep' ? '💼' : '🚚'}
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-black">{member.name}</strong>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {member.phone} · {member.zone}
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      <MessageSquare size={11} />
                      دعوة واتساب جاهزة
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* إضافة مندوب إضافي */}
            <form onSubmit={handleAddMember} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                <Plus size={15} />
                <span>إضافة مندوب أو سائق جديد:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  placeholder="اسم المندوب..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  placeholder="رقم الهاتف (واتساب)..."
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  dir="ltr"
                />
                <Input
                  placeholder="منطقة خط السير..."
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                />
              </div>

              <Button type="submit" variant="outline" size="sm" className="w-auto px-4 text-xs">
                إضافة للفريق +
              </Button>
            </form>

            {/* زر الإطلاق النهائي الكبير */}
            <div className="pt-2">
              <Button
                variant="gold"
                size="lg"
                onClick={handleFinalLaunch}
                icon={<Rocket size={22} />}
                className="font-black text-base py-4 shadow-xl"
              >
                إطلاق المنظومة بالكامل وإرسال دعوات الواتساب 🚀
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
