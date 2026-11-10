'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Camera,
  AlertTriangle,
  FileText,
  Clock,
  Printer,
} from 'lucide-react';
import { AdminLayout } from '@/components/ui/AdminLayout';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface ReturnRequest {
  id: string;
  salonName: string;
  repName: string;
  productName: string;
  serialOrBatch: string;
  quantity: number;
  totalRefund: number;
  reason: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  hasPhoto: boolean;
}

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([
    {
      id: 'CRN-504',
      salonName: 'صالون نور الحياة',
      repName: 'أحمد فتحي',
      productName: 'شامبو كيراتين برازيلي 1000 مل',
      serialOrBatch: 'BATCH-2026-08',
      quantity: 2,
      totalRefund: 400,
      reason: 'عبوة مسربة وتالفة أثناء الشحن',
      date: '10 نوفمبر 2026',
      status: 'pending',
      hasPhoto: true,
    },
    {
      id: 'CRN-503',
      salonName: 'صالون البرنسيسة',
      repName: 'محمد سالم',
      productName: 'سشوار صالونات تورنادو 2500 وات',
      serialOrBatch: 'سيريال: TR-882209',
      quantity: 1,
      totalRefund: 1300,
      reason: 'عطل فني بالموتور خلال فترة الضمان',
      date: '08 نوفمبر 2026',
      status: 'approved',
      hasPhoto: true,
    },
    {
      id: 'CRN-501',
      salonName: 'كوافير رويال ستايل',
      repName: 'علي حسن',
      productName: 'سيروم شعر بالأرجان 100 مل',
      serialOrBatch: 'BATCH-2026-01',
      quantity: 5,
      totalRefund: 650,
      reason: 'انتهاء الصلاحية بالمستودع',
      date: '03 نوفمبر 2026',
      status: 'approved',
      hasPhoto: true,
    },
  ]);

  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const updateStatus = (id: string, newStatus: 'approved' | 'rejected') => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const pendingCount = returns.filter((r) => r.status === 'pending').length;
  const approvedTotalRefund = returns
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.totalRefund, 0);

  return (
    <AdminLayout
      title="إدارة المرتجعات وإشعارات الخصم"
      subtitle="فحص طلبات المرتجعات المرفوعة من المناديب واعتماد الخصم من مديونيات الصالونات"
      actions={
        <Button
          variant="outline"
          size="sm"
          icon={<Printer size={16} />}
          onClick={() => window.print()}
          className="text-xs w-auto px-4"
        >
          طباعة بيان المرتجعات
        </Button>
      }
    >
      {/* 1. ملخص الإحصاءات */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50/80 p-5 rounded-2xl border-2 border-amber-200">
          <span className="text-xs font-bold text-amber-900 block">مرتجعات بانتظار الاعتماد</span>
          <span className="text-3xl font-black text-amber-900 font-mono mt-2 block">
            {pendingCount} إشعارات
          </span>
          <span className="text-[11px] text-amber-800 font-bold block mt-1">
            بحاجة لموافقة المدير لتسوية المديونية
          </span>
        </div>

        <div className="bg-emerald-50/80 p-5 rounded-2xl border-2 border-emerald-200">
          <span className="text-xs font-bold text-emerald-900 block">إجمالي الخصومات المعتمدة</span>
          <MoneyDisplay amount={approvedTotalRefund} size="xl" className="text-emerald-900 mt-2" />
          <span className="text-[11px] text-emerald-800 font-bold block mt-1">
            تم خصمها من حسابات الصالونات
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block">نسبة المرتجع لإجمالي المبيعات</span>
          <span className="text-3xl font-black text-slate-900 font-mono mt-2 block">
            0.8%
          </span>
          <span className="text-[11px] text-brand-success font-bold block mt-1">
            ضمن المعدل الآمن الممتاز (أقل من 2%)
          </span>
        </div>
      </div>

      {/* 2. جدول المرتجعات والإجراءات */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-black border-b border-slate-200">
              <tr>
                <th className="p-4">رقم الإشعار</th>
                <th className="p-4">الصالون والمندوب</th>
                <th className="p-4">الصنف والتشغيلة</th>
                <th className="p-4">الكمية وقيمة الخصم</th>
                <th className="p-4">سبب الإرجاع</th>
                <th className="p-4">التوثيق بالصورة</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">قرار الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-black text-slate-900 text-sm">
                    #{ret.id}
                  </td>

                  <td className="p-4">
                    <strong className="block text-slate-900 text-sm font-black">
                      {ret.salonName}
                    </strong>
                    <span className="text-slate-400 text-[11px] font-bold">
                      المندوب: {ret.repName} · {ret.date}
                    </span>
                  </td>

                  <td className="p-4">
                    <strong className="block text-slate-900">{ret.productName}</strong>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {ret.serialOrBatch}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-mono font-bold block">{ret.quantity} قطع</span>
                    <MoneyDisplay amount={ret.totalRefund} size="sm" colored isDebt />
                  </td>

                  <td className="p-4 text-slate-600 max-w-[180px]">{ret.reason}</td>

                  <td className="p-4">
                    {ret.hasPhoto ? (
                      <button
                        onClick={() => setActivePhoto(ret.id)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-gps bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                      >
                        <Camera size={14} />
                        <span>معاينة الصورة</span>
                      </button>
                    ) : (
                      <span className="text-slate-400">لا توجد صورة</span>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                        ret.status === 'pending'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : ret.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {ret.status === 'pending'
                        ? 'بانتظار الاعتماد'
                        : ret.status === 'approved'
                        ? 'معتمد ومخصوم'
                        : 'مرفوض'}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    {ret.status === 'pending' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateStatus(ret.id, 'approved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 size={14} />
                          <span>اعتماد الخصم</span>
                        </button>
                        <button
                          onClick={() => updateStatus(ret.id, 'rejected')}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-xs transition-colors"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-bold">
                        تم اتخاذ القرار
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* معاينة الصورة الموثقة للمرتجع */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-5 max-w-md w-full text-center space-y-3"
          >
            <h4 className="font-black text-slate-900 text-sm">
              صورة المنتج التالف المرفوعة من المندوب (#{activePhoto})
            </h4>
            <div className="h-64 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Camera size={48} />
              <span className="text-xs font-bold text-slate-600">
                عبوة شامبو كيراتين 1000 مل - تسريب واضح بغطاء العبوة
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                GPS: 30.0444° N, 31.2357° E · تم الالتقاط في الصالون
              </span>
            </div>
            <Button variant="primary" size="sm" onClick={() => setActivePhoto(null)}>
              إغلاق المعاينة
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
