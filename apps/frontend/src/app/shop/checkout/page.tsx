'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Banknote,
  Smartphone,
  MapPin,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { ShopHeader } from '@/components/ui/ShopHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ShopCheckoutPage() {
  const [customerName, setCustomerName] = useState('سارة أحمد');
  const [phone, setPhone] = useState('01099887766');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [address, setAddress] = useState('شارع مكرم عبيد - عمارة 24 - الدور 4');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vodafone_cash' | 'instapay'>('cod');
  const [walletRef, setWalletRef] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const subtotal = 380; // سيروم + شامبو
  const shippingFee = 35;
  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      <ShopHeader />

      <main className="max-w-3xl mx-auto w-full p-4 space-y-4 flex-1">
        {isCompleted ? (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 text-center shadow-lg space-y-4 my-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <h2 className="text-xl font-black text-slate-900">
              تم تأكيد طلبك بنجاح يا {customerName}! 🎉
            </h2>
            <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-md mx-auto">
              رقم الشحنة: <span className="font-mono text-brand-primary text-sm font-black">#SHP-88204</span>
              <br />
              تم تجهيز الطلب في المستودع وسيتم تسليمه لكِ خلال 24 إلى 48 ساعة على العنوان:
              <br />
              <strong className="text-slate-800">{address} ({governorate})</strong>
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-sm mx-auto space-y-2 text-xs font-bold text-slate-700 text-right">
              <div className="flex justify-between">
                <span>طريقة الدفع:</span>
                <span className="text-brand-primary font-black">
                  {paymentMethod === 'cod'
                    ? 'نقدياً عند استلام الشحنة 💵'
                    : paymentMethod === 'vodafone_cash'
                    ? 'فودافون كاش 📱'
                    : 'إنستاباي ⚡'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>المبلغ المطلوب تسليمه:</span>
                <MoneyDisplay amount={totalAmount} size="md" />
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href={`https://wa.me/201011223344?text=${encodeURIComponent(`أهلاً، أود الاستفسار عن شحنتي رقم #SHP-88204 باسم ${customerName}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-3 rounded-xl min-h-[46px]"
              >
                <MessageSquare size={16} />
                <span>متابعة الشحنة عبر واتساب</span>
              </a>

              <Link href="/shop">
                <Button variant="outline" size="md" className="text-xs">
                  العودة للمتجر
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            {/* ملخص السلة */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
              <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-primary" />
                <span>ملخص مشترياتك:</span>
              </h3>

              <div className="text-xs font-bold divide-y divide-slate-100 space-y-1.5">
                <div className="pt-1.5 flex justify-between">
                  <span className="text-slate-800">1x سيروم الأرغان المغربي 100 مل</span>
                  <span className="font-mono">220 ج.م</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span className="text-slate-800">1x شامبو الكيراتين المغذي 500 مل</span>
                  <span className="font-mono">160 ج.م</span>
                </div>
                <div className="pt-1.5 flex justify-between text-slate-500">
                  <span>مصاريف الشحن والتوصيل للمنزل:</span>
                  <span className="font-mono">{shippingFee} ج.م</span>
                </div>
                <div className="pt-2 flex justify-between text-sm font-black text-slate-900 border-t-2 border-slate-200">
                  <span>الإجمالي الكلي:</span>
                  <MoneyDisplay amount={totalAmount} size="lg" className="text-brand-primary" />
                </div>
              </div>
            </div>

            {/* بيانات الشحن والتوصيل */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                <MapPin size={18} className="text-brand-gps" />
                <span>عنوان التوصيل واستلام الشحنة:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="الاسم الكامل:"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                <Input
                  label="رقم الهاتف للتواصل (للمندوب):"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                  className="font-mono text-left"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">
                    المحافظة:
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-800 min-h-[48px]"
                  >
                    <option value="القاهرة">القاهرة</option>
                    <option value="الجيزة">الجيزة</option>
                    <option value="الإسكندرية">الإسكندرية</option>
                    <option value="القليوبية">القليوبية</option>
                    <option value="الشرقية">الشرقية</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="العنوان بالتفصيل (المنطقة، الشارع، رقم العمارة والشقة):"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* وسائل الدفع المحلية المعتمدة فقط (COD والمحافظ) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100">
                طريقة الدفع المعتمدة:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border-2 text-right transition-all min-h-[56px] ${
                    paymentMethod === 'cod'
                      ? 'border-brand-primary bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Banknote size={20} className="text-emerald-400 mb-1" />
                  <strong className="block text-sm">الدفع نقداً عند الاستلام (COD)</strong>
                  <span className="text-[10px] opacity-80 block mt-0.5">
                    افحصي المنتجات أولاً ثم ادفعي للمندوب
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('vodafone_cash')}
                  className={`p-3.5 rounded-xl border-2 text-right transition-all min-h-[56px] ${
                    paymentMethod === 'vodafone_cash'
                      ? 'border-brand-primary bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone size={20} className="text-red-400 mb-1" />
                  <strong className="block text-sm">فودافون كاش / أورنج / اتصالات</strong>
                  <span className="text-[10px] opacity-80 block mt-0.5">
                    تحويل فوري لمحفظة الشركة الرسمية
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('instapay')}
                  className={`p-3.5 rounded-xl border-2 text-right transition-all min-h-[56px] ${
                    paymentMethod === 'instapay'
                      ? 'border-brand-primary bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone size={20} className="text-brand-gold mb-1" />
                  <strong className="block text-sm">إنستاباي (InstaPay)</strong>
                  <span className="text-[10px] opacity-80 block mt-0.5">
                    تحويل بنكي لحظي لحساب الشركة
                  </span>
                </button>
              </div>

              {/* تفاصيل التحويل للمحافظ إن اختارها */}
              {paymentMethod !== 'cod' && (
                <div className="mt-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                  <p className="font-bold">
                    📲 يرجى تحويل مبلغ{' '}
                    <strong className="font-mono text-sm">{totalAmount} ج.م</strong> إلى رقم
                    محفظة الشركة الرسمي:
                    <br />
                    <span className="font-mono text-base font-black text-slate-900">
                      01011223344
                    </span>
                  </p>
                  <Input
                    label="رقم العملية أو آخر 4 أرقام من رقم المحول:"
                    placeholder="مثلاً: TXN-442299"
                    value={walletRef}
                    onChange={(e) => setWalletRef(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {/* زر تأكيد الطلب النهائي */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              icon={<CheckCircle2 size={20} />}
            >
              تأكيد الطلب وشحن المنتجات لباب المنزل 🚚
            </Button>
          </form>
        )}
      </main>
    </div>
  );
}
