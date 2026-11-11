'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_DRIVERS = [
  { phone: '01000000003', pin: '1234', name: 'كابتن ياسر الجمل', avatar: '🧔', vehicle: 'تويوتا هايلوكس — ق ج ز ٤٥٦٧' },
];

export default function DriverLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'pin'>('phone');
  const [driverName, setDriverName] = useState('');

  const handlePhoneSubmit = () => {
    const driver = DEMO_DRIVERS.find((d) => d.phone === phone);
    if (!driver) {
      setError('رقم الهاتف غير مسجّل في النظام');
      return;
    }
    setDriverName(driver.name);
    setError('');
    setStep('pin');
  };

  const handlePinInput = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === 4) {
      handleLogin(newPin);
    }
  };

  const handleLogin = async (enteredPin: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const driver = DEMO_DRIVERS.find((d) => d.phone === phone && d.pin === enteredPin);
    if (!driver) {
      setError('PIN خطأ — حاول مرة أخرى');
      setPin('');
      setLoading(false);
      return;
    }
    // Store session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('driver_session', JSON.stringify({ name: driver.name, phone: driver.phone, vehicle: driver.vehicle }));
    }
    router.push('/driver/route');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col" dir="rtl">
      {/* Logo area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
          style={{ backgroundColor: '#F59E0B' }}
        >
          <span className="text-4xl">🚗</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">بوابة السائق</h1>
        <p className="text-slate-400 text-sm">7Days OS — نظام التوصيل</p>
      </div>

      {/* Form */}
      <div className="bg-slate-800 rounded-t-3xl px-6 pt-8 pb-12 shadow-2xl">
        {step === 'phone' ? (
          <>
            <h2 className="text-lg font-bold text-white mb-6 text-center">ادخل رقم هاتفك</h2>
            <div className="mb-4">
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(''); }}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-700 border border-slate-600 rounded-2xl px-4 py-4 text-white text-xl text-center tracking-widest focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                maxLength={11}
                autoFocus
              />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <button
              onClick={handlePhoneSubmit}
              disabled={phone.length < 11}
              className="w-full py-4 rounded-2xl font-bold text-lg text-slate-900 disabled:opacity-40 active:scale-95 transition-all"
              style={{ backgroundColor: '#F59E0B' }}
            >
              متابعة
            </button>
            <p className="text-center text-slate-500 text-xs mt-6">
              للتجربة: رقم <span className="text-amber-400 font-mono">01000000003</span>
            </p>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🧔</span>
              </div>
              <h2 className="text-lg font-bold text-white">{driverName}</h2>
              <p className="text-slate-400 text-sm">ادخل الـ PIN المكوّن من 4 أرقام</p>
            </div>

            {/* PIN dots */}
            <div className="flex justify-center gap-4 mb-6">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pin.length > i
                      ? 'bg-amber-400 border-amber-400'
                      : 'border-slate-500 bg-transparent'
                  }`}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '', '٠', '⌫'].map((key, i) => {
                const digitMap: Record<string, string> = { '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9', '٠': '0' };
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (key === '') return;
                      if (key === '⌫') { setPin((p) => p.slice(0, -1)); setError(''); }
                      else handlePinInput(digitMap[key] || key);
                    }}
                    disabled={loading || key === ''}
                    className={`h-14 rounded-2xl font-bold text-xl transition-all active:scale-90 ${
                      key === ''
                        ? 'invisible'
                        : key === '⌫'
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    {loading && pin.length === 4 ? '⏳' : key}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => { setStep('phone'); setPin(''); setError(''); }}
              className="w-full text-center text-slate-400 text-sm py-2"
            >
              ‹ تغيير رقم الهاتف
            </button>
            <p className="text-center text-slate-500 text-xs mt-2">
              للتجربة: PIN هو <span className="text-amber-400 font-mono">1234</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
