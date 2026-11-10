'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Calendar,
  Package,
  Plus,
  Tag,
  ArrowRight,
  TrendingDown,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { AdminLayout } from '@/components/ui/AdminLayout';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface ExpiryBatchAlert {
  id: string;
  productName: string;
  sku: string;
  batchNumber: string;
  expiryDate: string;
  daysRemaining: number;
  stockQty: number;
  costValue: number;
  urgency: 'critical' | 'warning' | 'normal';
}

interface LowStockAlert {
  id: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  monthlyDemand: number;
  supplierName: string;
}

export default function AdminInventoryAlertsPage() {
  const [activeTab, setActiveTab] = useState<'expiry' | 'low_stock'>('expiry');

  const expiryAlerts: ExpiryBatchAlert[] = [
    {
      id: 'e1',
      productName: 'سيروم شعر بالأرجان الطبيعي 100 مل',
      sku: '6221112223334',
      batchNumber: 'BATCH-2026-04',
      expiryDate: '2026-12-15',
      daysRemaining: 35,
      stockQty: 45,
      costValue: 3847.5,
      urgency: 'critical',
    },
    {
      id: 'e2',
      productName: 'حمام كريم كولاجين برازيلي 500 مل',
      sku: '6223334445556',
      batchNumber: 'BATCH-2026-06',
      expiryDate: '2027-01-20',
      daysRemaining: 71,
      stockQty: 80,
      costValue: 6400,
      urgency: 'warning',
    },
  ];

  const lowStockAlerts: LowStockAlert[] = [
    {
      id: 'l1',
      productName: 'سشوار صالونات تورنادو 2500 وات الإيطالي',
      sku: 'EQ-DRY-802',
      currentStock: 2,
      reorderPoint: 5,
      monthlyDemand: 18,
      supplierName: 'التوكيل الإيطالي للأجهزة',
    },
    {
      id: 'l2',
      productName: 'شامبو كيراتين برازيلي 1000 مل',
      sku: '6224001122334',
      currentStock: 8,
      reorderPoint: 20,
      monthlyDemand: 65,
      supplierName: 'المصنع البرازيلي الدولي',
    },
  ];

  return (
    <AdminLayout
      title="تنبيهات المخزون والصلاحية (FEFO & Reorder Radar)"
      subtitle="حماية رأس المال من التلف والركود وضمان توافر البضاعة المطلوبة"
      actions={
        <Link href="/admin/promotions">
          <Button variant="gold" size="sm" icon={<Tag size={16} />} className="text-xs w-auto px-4">
            إنشاء عرض بونص للمخزون الراكد 🎁
          </Button>
        </Link>
      }
    >
      {/* 1. بطاقات الإحصاءات السريعة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50/80 p-5 rounded-2xl border-2 border-red-200">
          <div className="flex justify-between items-center text-xs font-bold text-red-800">
            <span>تشغيلات قريبة الانتهاء (أقل من 60 يوماً)</span>
            <Clock size={18} className="text-brand-danger" />
          </div>
          <span className="text-3xl font-black text-brand-danger font-mono mt-2 block">
            {expiryAlerts.length} تشغيلات
          </span>
          <span className="text-[11px] text-red-700 font-bold block mt-1">
            قيمة التكلفة المعرضة للخطر: 10,247 ج.م
          </span>
        </div>

        <div className="bg-amber-50/80 p-5 rounded-2xl border-2 border-amber-200">
          <div className="flex justify-between items-center text-xs font-bold text-amber-900">
            <span>أصناف أوشكت على النفاد</span>
            <TrendingDown size={18} className="text-amber-600" />
          </div>
          <span className="text-3xl font-black text-amber-900 font-mono mt-2 block">
            {lowStockAlerts.length} أصناف
          </span>
          <span className="text-[11px] text-amber-800 font-bold block mt-1">
            أقل من حد إعادة الطلب الآمن
          </span>
        </div>

        <div className="bg-emerald-50/80 p-5 rounded-2xl border-2 border-emerald-200">
          <div className="flex justify-between items-center text-xs font-bold text-emerald-900">
            <span>وفر الصرف بنظام FEFO</span>
            <Sparkles size={18} className="text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-emerald-900 font-mono mt-2 block">
            100%
          </span>
          <span className="text-[11px] text-emerald-800 font-bold block mt-1">
            يتم توجيه المستودع للأقدم آلياً
          </span>
        </div>
      </div>

      {/* 2. أزرار التبديل بين التبويبين */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('expiry')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'expiry'
              ? 'bg-slate-900 text-white shadow-sm font-black'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          ⏳ تنبيهات تواريخ الصلاحية والتشغيلات ({expiryAlerts.length})
        </button>

        <button
          onClick={() => setActiveTab('low_stock')}
          className={`px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'low_stock'
              ? 'bg-slate-900 text-white shadow-sm font-black'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          📦 تنبيهات نقص المخزون وإعادة الطلب ({lowStockAlerts.length})
        </button>
      </div>

      {/* 3. قائمة التنبيهات حسب التبويب المختار */}
      {activeTab === 'expiry' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-black border-b border-slate-200">
                <tr>
                  <th className="p-4">الصنف والباركود</th>
                  <th className="p-4">رقم التشغيلة</th>
                  <th className="p-4">تاريخ الانتهاء</th>
                  <th className="p-4">المتبقي للصلاحية</th>
                  <th className="p-4">الكمية بالمستودع</th>
                  <th className="p-4">قيمة التكلفة</th>
                  <th className="p-4 text-center">القرار والإجراء التجاري</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {expiryAlerts.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <strong className="block text-slate-900 text-sm font-black">
                        {batch.productName}
                      </strong>
                      <span className="text-slate-400 font-mono text-[11px]">{batch.sku}</span>
                    </td>
                    <td className="p-4 font-mono font-bold">{batch.batchNumber}</td>
                    <td className="p-4 font-mono text-slate-600">{batch.expiryDate}</td>
                    <td className="p-4">
                      <span
                        className={`font-black px-2.5 py-1 rounded-full text-xs ${
                          batch.daysRemaining <= 45
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        متبقي {batch.daysRemaining} يوماً فقط!
                      </span>
                    </td>
                    <td className="p-4 font-mono font-black text-slate-900 text-sm">
                      {batch.stockQty} قطعة
                    </td>
                    <td className="p-4">
                      <MoneyDisplay amount={batch.costValue} size="sm" colored isDebt />
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={`/admin/promotions?product=${encodeURIComponent(batch.productName)}`}
                      >
                        <Button variant="gold" size="sm" className="text-xs">
                          إنشاء بونص / خصم فوري 🎁
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-black border-b border-slate-200">
                <tr>
                  <th className="p-4">الصنف والباركود</th>
                  <th className="p-4">الرصيد الفعلي الحالي</th>
                  <th className="p-4">نقطة إعادة الطلب</th>
                  <th className="p-4">متوسط السحب الشهري</th>
                  <th className="p-4">المورد المعتمد</th>
                  <th className="p-4 text-center">إجراء التوريد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {lowStockAlerts.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <strong className="block text-slate-900 text-sm font-black">
                        {item.productName}
                      </strong>
                      <span className="text-slate-400 font-mono text-[11px]">{item.sku}</span>
                    </td>
                    <td className="p-4 font-mono font-black text-brand-danger text-sm">
                      {item.currentStock} قطع فقط!
                    </td>
                    <td className="p-4 font-mono text-slate-600">{item.reorderPoint} قطعة</td>
                    <td className="p-4 font-mono text-slate-600">{item.monthlyDemand} قطعة/شهر</td>
                    <td className="p-4 text-slate-700 font-bold">{item.supplierName}</td>
                    <td className="p-4 text-center">
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs"
                        onClick={() => alert(`تم إنشاء أمر شراء مبدئي لصنف: ${item.productName}`)}
                      >
                        إصدار أمر توريد للمصنع 📝
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
