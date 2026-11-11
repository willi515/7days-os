'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const mockCollections = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2026-1001',
    customerName: 'صالون نور الحياة',
    amount: 2800,
    paymentMethod: 'cash_on_delivery',
    status: 'delivered',
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2026-0998',
    customerName: 'صالون لمسة جمال',
    amount: 4200,
    paymentMethod: 'cash_on_delivery',
    status: 'delivered',
  },
];

export default function DriverCollectionPage() {
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalCash = mockCollections.reduce((s, c) => s + c.amount, 0);

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-6" dir="rtl">
        <div className="text-center">
          <div className="w-28 h-28 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">💰</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">تم تسليم التحصيل!</h2>
          <div className="text-4xl font-bold my-4" style={{ color: '#F59E0B' }}>
            {totalCash.toLocaleString('ar-EG')} ج.م
          </div>
          <p className="text-slate-400 mb-8">تم تسجيل التحصيل في النظام بنجاح ✅</p>
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-8 text-sm text-slate-400">
            <p>📅 {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-1">🕐 {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <button
            onClick={() => router.push('/driver/route')}
            className="w-full py-4 rounded-2xl font-bold text-lg text-slate-900"
            style={{ backgroundColor: '#F59E0B' }}
          >
            العودة للجدول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-400 text-2xl leading-none">‹</button>
          <div>
            <h1 className="font-bold text-white">💰 تأكيد التحصيل اليومي</h1>
            <p className="text-xs text-slate-400">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-36">
        {/* Total highlight */}
        <div
          className="rounded-2xl p-6 text-center border"
          style={{ backgroundColor: '#F59E0B15', borderColor: '#F59E0B40' }}
        >
          <p className="text-sm text-slate-400 mb-1">إجمالي الكاش المحصّل</p>
          <div className="text-4xl font-bold" style={{ color: '#F59E0B' }}>
            {totalCash.toLocaleString('ar-EG')}
          </div>
          <p className="text-slate-400 text-lg mt-1">ج.م</p>
          <div className="mt-3 text-sm text-slate-400">
            من {mockCollections.length} طلبات كاش
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <h3 className="text-xs text-slate-400 uppercase tracking-wide mb-3">📋 تفاصيل التحصيل</h3>
          <div className="space-y-3">
            {mockCollections.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-white font-medium text-sm">{c.customerName}</p>
                  <p className="text-xs text-slate-500 font-mono">{c.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{c.amount.toLocaleString('ar-EG')} ج.م</p>
                  <p className="text-xs text-slate-500">💵 كاش</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total row */}
          <div className="flex items-center justify-between pt-3 mt-2">
            <span className="font-bold text-white">الإجمالي</span>
            <span className="font-bold text-xl" style={{ color: '#F59E0B' }}>
              {totalCash.toLocaleString('ar-EG')} ج.م
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <h3 className="text-xs text-slate-400 uppercase tracking-wide mb-3">📌 تعليمات التسليم</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">1.</span>
              سلّم المبلغ كاملاً للمحاسب في المستودع
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">2.</span>
              خذ إيصال استلام موقّع من المحاسب
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">3.</span>
              اضغط "تأكيد التسليم" بعد تسليم الكاش
            </li>
          </ul>
        </div>

        {/* Confirmation checkbox */}
        <button
          onClick={() => setConfirmed(!confirmed)}
          className={`w-full rounded-2xl p-4 border-2 flex items-center gap-3 transition-all ${
            confirmed
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-slate-600 bg-slate-800'
          }`}
        >
          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            confirmed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'
          }`}>
            {confirmed && <span className="text-white font-bold">✓</span>}
          </div>
          <span className={`font-bold text-right ${confirmed ? 'text-emerald-400' : 'text-slate-300'}`}>
            أؤكد تسليم مبلغ {totalCash.toLocaleString('ar-EG')} ج.م للمحاسب
          </span>
        </button>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-700">
        <button
          onClick={handleSubmit}
          disabled={!confirmed || loading}
          className="w-full py-4 rounded-2xl font-bold text-lg text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
          style={{ backgroundColor: '#F59E0B' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> جاري التسجيل...
            </span>
          ) : (
            '✅ تأكيد تسليم التحصيل'
          )}
        </button>
      </div>
    </div>
  );
}
