'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Lock, Sparkles, MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';

export default function RepLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('01012345678');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // التحقق من رقم الهاتف المصري
    const egPhoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    if (!egPhoneRegex.test(phone)) {
      setErrorMessage('يرجى إدخال رقم هاتف مصري صحيح (11 رقماً يبدأ بـ 010، 011، 012، أو 015)');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('كلمة المرور يجب ألا تقل عن 6 أحرف');
      return;
    }

    setIsLoading(true);
    setGpsStatus('requesting');

    // طلب إذن الـ GPS
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setGpsStatus('granted');
          setTimeout(() => {
            router.push('/rep/route');
          }, 600);
        },
        (error) => {
          console.warn('GPS Denied or unavailable:', error.message);
          setGpsStatus('denied');
          // يُسمح للمندوب بالدخول حتى مع تعطل GPS مع تنبيه
          setTimeout(() => {
            router.push('/rep/route');
          }, 800);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        router.push('/rep/route');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6">
      {/* رأس الشاشة وشعار المنصة */}
      <div className="pt-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-primary text-brand-gold shadow-md mb-3 border-2 border-brand-gold/30">
          <Sparkles size={32} />
        </div>
        <h1 className="text-2xl font-black text-brand-primary">7Days OS Sales</h1>
        <p className="text-xs font-bold text-slate-500 mt-1">
          بوابة مندوب المبيعات الميداني · شركة الأمل للتوزيع
        </p>
      </div>

      {/* نموذج تسجيل الدخول */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-6">
        <h2 className="text-lg font-black text-slate-800 mb-4 text-center">
          تسجيل الدخول وبدء اليومية
        </h2>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-brand-danger text-xs font-bold">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Input
          label="رقم الهاتف"
          type="tel"
          placeholder="010xxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<Phone size={18} />}
          dir="ltr"
          className="text-left font-mono"
          required
        />

        <Input
          label="كلمة المرور"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          required
        />

        {gpsStatus === 'requesting' && (
          <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-center text-xs font-bold text-brand-gps flex items-center justify-center gap-2">
            <MapPin size={16} className="animate-bounce" />
            <span>جارٍ التحقق من موقعك الجغرافي وفتح خط السير...</span>
          </div>
        )}

        {gpsStatus === 'denied' && (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs font-bold text-amber-800">
            ⚠️ تعذر تحديد الموقع بدقة، سيتم فتح خط السير مع التنبيه.
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={<MapPin size={20} />}
          className="mt-2"
        >
          تسجيل الحضور وبدء خط السير
        </Button>
      </form>

      {/* لوحة تحفيز أداء المندوب الشهري */}
      <div className="bg-gradient-to-br from-brand-primary to-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 mt-6 mb-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-gold" />
            <span className="text-xs font-extrabold text-slate-200">
              ملخص أدائك لشهر نوفمبر 2026
            </span>
          </div>
          <span className="text-[11px] bg-brand-gold/20 text-brand-gold font-bold px-2 py-0.5 rounded-full border border-brand-gold/30">
            المندوب: أحمد فتحي
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-right">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/40">
            <p className="text-[11px] font-bold text-slate-400">المبيعات المحققة</p>
            <MoneyDisplay amount={145000} size="md" className="text-white mt-1" />
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/40">
            <p className="text-[11px] font-bold text-slate-400">التحصيلات النقدية</p>
            <MoneyDisplay amount={68000} size="md" className="text-brand-success mt-1" />
          </div>
        </div>

        <div className="mt-3 bg-brand-gold/10 p-3 rounded-xl border border-brand-gold/30 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-300">عمولتك المستحقة حتى الآن 💰</span>
          <MoneyDisplay amount={4850} size="lg" className="text-brand-gold" />
        </div>
      </div>
    </div>
  );
}
