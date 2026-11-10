'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Banknote,
  Smartphone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowLeft,
} from 'lucide-react';
import { RepHeader } from '@/components/ui/RepHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderTotal = parseFloat(searchParams.get('total') || '3300');
  const bonusCount = parseInt(searchParams.get('bonus') || '1', 10);

  const currentDebt = 4500;
  const creditLimit = 15000;

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'ewallet' | 'partial' | 'credit'>('cash');
  const [paidAmount, setPaidAmount] = useState<string>(String(orderTotal));
  const [referenceNumber, setReferenceNumber] = useState('');
  const [nextPaymentDate, setNextPaymentDate] = useState('2026-11-24');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numericPaid = parseFloat(paidAmount || '0');
  const remainingOrder = Math.max(0, orderTotal - numericPaid);
  const newTotalDebt = currentDebt + remainingOrder;
  const isOverLimit = newTotalDebt > creditLimit;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/rep/order/1090/confirm?total=${orderTotal}&paid=${numericPaid}&method=${paymentMethod}&bonus=${bonusCount}`);
    }, 600);
  };

  return (
    <div className="p-4 space-y-4">
      {/* بطاقة ملخص الحساب */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold block">إجمالي الفاتورة الحالية</span>
            <MoneyDisplay amount={orderTotal} size="lg" className="mt-1" />
          </div>
          <div className="bg-red-50/60 p-3 rounded-xl border border-red-200">
            <span className="text-xs text-red-700 font-bold block">المديونية السابقة</span>
            <MoneyDisplay amount={currentDebt} size="lg" colored isDebt className="mt-1" />
          </div>
        </div>
      </div>

      {/* اختيار طريقة السداد */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 mb-3">طريقة السداد المعتمدة:</h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setPaymentMethod('cash');
              setPaidAmount(String(orderTotal));
            }}
            className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all min-h-[50px] ${
              paymentMethod === 'cash'
                ? 'border-brand-primary bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Banknote size={18} className="text-emerald-400 shrink-0" />
            <span>نقدي كاش (كامل)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMethod('ewallet');
              setPaidAmount(String(orderTotal));
            }}
            className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all min-h-[50px] ${
              paymentMethod === 'ewallet'
                ? 'border-brand-primary bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Smartphone size={18} className="text-brand-gold shrink-0" />
            <span>فودافون كاش / إنستاباي</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMethod('partial');
              setPaidAmount(String(Math.round(orderTotal / 2)));
            }}
            className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all min-h-[50px] ${
              paymentMethod === 'partial'
                ? 'border-brand-primary bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Clock size={18} className="text-amber-400 shrink-0" />
            <span>سداد جزئي + تأجيل</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMethod('credit');
              setPaidAmount('0');
            }}
            className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all min-h-[50px] ${
              paymentMethod === 'credit'
                ? 'border-brand-primary bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calendar size={18} className="text-blue-400 shrink-0" />
            <span>آجل بالكامل (14 يوم)</span>
          </button>
        </div>

        {/* حقول الإدخال حسب الطريقة */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Input
            label="المبلغ المحصل الآن (بالجنيه المصري):"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            disabled={paymentMethod === 'credit'}
            className="font-mono text-lg font-black text-brand-primary"
          />

          {paymentMethod === 'ewallet' && (
            <Input
              label="رقم العملية / المرجع في المحفظة الإلكترونية:"
              placeholder="مثلاً: TXN-99882211"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              required
            />
          )}

          {remainingOrder > 0 && (
            <div className="mt-2">
              <Input
                label="تاريخ استحقاق المتبقي (جدولة الدفعة القادمة):"
                type="date"
                value={nextPaymentDate}
                onChange={(e) => setNextPaymentDate(e.target.value)}
                icon={<Calendar size={18} />}
              />
            </div>
          )}
        </div>
      </div>

      {/* ملخص الوضع المالي بعد العملية */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between font-bold text-slate-300">
          <span>المبلغ المدفوع الآن:</span>
          <span className="text-brand-success font-black text-sm">
            {numericPaid.toLocaleString('ar-EG')} ج.م
          </span>
        </div>
        <div className="flex justify-between font-bold text-slate-300">
          <span>المتبقي من الفاتورة:</span>
          <span className="text-amber-400 font-black text-sm">
            {remainingOrder.toLocaleString('ar-EG')} ج.م
          </span>
        </div>
        <div className="flex justify-between font-black text-white pt-2 border-t border-slate-800 text-sm">
          <span>إجمالي مديونية الصالون الجديدة:</span>
          <span className={isOverLimit ? 'text-brand-danger' : 'text-brand-gold'}>
            {newTotalDebt.toLocaleString('ar-EG')} ج.م
          </span>
        </div>

        {isOverLimit && (
          <p className="text-[11px] text-brand-danger font-bold pt-1">
            ⛔ تحذير: إجمالي المديونية سيتخطى الحد الائتماني المسموح به للصالون ({creditLimit.toLocaleString('ar-EG')} ج.م)!
          </p>
        )}
      </div>

      {/* زر إصدار الفاتورة والإيصال */}
      <Button
        variant="success"
        size="lg"
        isLoading={isSubmitting}
        onClick={handleConfirm}
        icon={<CheckCircle2 size={20} />}
        disabled={isOverLimit}
      >
        إصدار الفاتورة وإيصال الاستلام
      </Button>
    </div>
  );
}

export default function RepPaymentPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28">
      <RepHeader
        title="السداد وتحصيل النقدية"
        subtitle="بيوتي سنتر الملكة · فاتورة ORD-1090"
        showBack
      />
      <Suspense fallback={<div className="p-8 text-center text-slate-400 font-bold">جارٍ تحميل بيانات السداد...</div>}>
        <PaymentContent />
      </Suspense>
    </div>
  );
}

