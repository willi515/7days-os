'use client';

import React from 'react';
import {
  FileText,
  Printer,
  Download,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Clock,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { B2BHeader } from '@/components/ui/B2BHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

export default function B2BStatementPage() {
  const transactions = [
    {
      id: 'INV-2026-1042',
      type: 'invoice',
      title: 'فاتورة توريد مستحضرات كيراتين وسشوار',
      date: '01 نوفمبر 2026',
      totalAmount: 4200,
      paidAmount: 2000,
      remainingAmount: 2200,
      status: 'جزئي',
    },
    {
      id: 'REC-8891',
      type: 'receipt',
      title: 'إيصال سداد نقدي مستلم بواسطة المندوب (محمد سالم)',
      date: '28 أكتوبر 2026',
      totalAmount: 3000,
      status: 'معتمد',
    },
    {
      id: 'INV-2026-0918',
      type: 'invoice',
      title: 'فاتورة توريد صبغات وبروتين معالج',
      date: '15 أكتوبر 2026',
      totalAmount: 5000,
      paidAmount: 5000,
      remainingAmount: 0,
      status: 'مسددة بالكامل',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      <B2BHeader />

      <main className="max-w-4xl mx-auto w-full p-4 space-y-4 flex-1">
        {/* معلومات الحساب والمندوب المسؤول */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900">
              كشف الحساب المالي والشفافية التامة
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              المندوب المعتمد لمنطقتك: أ. محمد سالم (01011223344)
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Printer size={15} />}
              onClick={() => window.print()}
              className="text-xs w-auto px-3.5"
            >
              طباعة كشف الحساب
            </Button>
            <a
              href="https://wa.me/201011223344?text=%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D9%85%D8%A7%D9%84%D9%8A%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D9%83%D8%B4%D9%81%20%D8%AD%D8%B3%D8%A7%D8%A8%20%D8%B5%D8%A7%D9%84%D9%88%D9%86%20%D9%86%D9%88%D8%B1%20%D8%A7%D9%84%D8%AD%D9%8A%D8%A7%D8%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-colors min-h-[38px]"
            >
              <MessageSquare size={15} />
              <span>استفسار عبر واتساب</span>
            </a>
          </div>
        </div>

        {/* 1. الموقف المالي الحالي (3 بطاقات) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-400 block">إجمالي مشتريات صالونك</span>
            <MoneyDisplay amount={45200} size="lg" className="mt-1" />
            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">منذ بداية التعامل</span>
          </div>

          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-sm text-center">
            <span className="text-xs font-bold text-emerald-800 block">إجمالي ما تم سداده</span>
            <MoneyDisplay amount={38000} size="lg" colored className="mt-1" />
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">سندات قبض معتمدة ✅</span>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-sm text-center">
            <span className="text-xs font-bold text-amber-900 block">المتبقي المستحق حالياً</span>
            <MoneyDisplay amount={7200} size="lg" colored isDebt className="mt-1" />
            <span className="text-[10px] text-amber-800 font-bold block mt-0.5">ضمن فترة الائتمان الآمنة</span>
          </div>
        </div>

        {/* شريط الحد الائتماني والائتمان المتاح */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>الحد الائتماني المعتمد: 15,000 ج.م</span>
            <span className="text-brand-success font-black">
              الرصيد المتاح لطلبياتك القادمة: 7,800 ج.م 🟢
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-gold h-full rounded-full transition-all"
              style={{ width: `${(7200 / 15000) * 100}%` }}
            />
          </div>
        </div>

        {/* 2. سجل المعاملات المفصل (فواتير + إيصالات) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
          <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Receipt size={18} className="text-brand-primary" />
            <span>سجل المعاملات والفواتير السابقة</span>
          </h3>

          <div className="space-y-3">
            {transactions.map((txn) => {
              const isInvoice = txn.type === 'invoice';

              return (
                <div
                  key={txn.id}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
                    isInvoice
                      ? 'border-slate-200 bg-slate-50/40'
                      : 'border-emerald-200 bg-emerald-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                        isInvoice ? 'bg-slate-200 text-slate-800' : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {isInvoice ? <FileText size={18} /> : <CheckCircle2 size={18} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-xs">
                          {txn.id}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            txn.status === 'مسددة بالكامل' || txn.status === 'معتمد'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs mt-1">{txn.title}</h4>
                      <span className="text-[11px] text-slate-400 font-bold mt-0.5 block">
                        التاريخ: {txn.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <MoneyDisplay
                      amount={txn.totalAmount}
                      size="md"
                      colored={!isInvoice}
                    />
                    {isInvoice && txn.remainingAmount !== undefined && txn.remainingAmount > 0 && (
                      <span className="text-[11px] font-black text-amber-700 block mt-0.5">
                        متبقي: {txn.remainingAmount.toLocaleString('ar-EG')} ج.م
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
