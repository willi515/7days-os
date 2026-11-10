'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  PackageCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  Barcode,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { WarehouseHeader } from '@/components/ui/WarehouseHeader';
import { Button } from '@/components/ui/Button';

interface PickItem {
  id: string;
  name: string;
  sku: string;
  type: 'cosmetic' | 'equipment';
  location: string;
  batchNumber?: string;
  expiryDate?: string;
  requiredQty: number;
  pickedQty: number;
  isNearExpiry?: boolean;
}

export default function WarehousePickingPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId || 'ORD-2026-1245';

  const [items, setItems] = useState<PickItem[]>([
    {
      id: 'item-1',
      name: 'شامبو كيراتين برازيلي احترافي 1000 مل',
      sku: '6224001122334',
      type: 'cosmetic',
      location: 'الرف A-04 · الممر 2',
      batchNumber: 'BATCH-2026-08',
      expiryDate: '2027-08-15',
      requiredQty: 10,
      pickedQty: 10,
    },
    {
      id: 'item-2',
      name: 'سيروم شعر بالأرجان الطبيعي 100 مل',
      sku: '6221112223334',
      type: 'cosmetic',
      location: 'الرف B-02 · الممر 1',
      batchNumber: 'BATCH-2026-04',
      expiryDate: '2027-04-10',
      requiredQty: 5,
      pickedQty: 5,
      isNearExpiry: true,
    },
    {
      id: 'item-3',
      name: 'سشوار صالونات تورنادو 2500 وات الإيطالي',
      sku: 'EQ-DRY-802',
      type: 'equipment',
      location: 'قسم الأجهزة والمعدات · الرف E-01',
      requiredQty: 1,
      pickedQty: 0,
    },
  ]);

  const togglePick = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = item.pickedQty === item.requiredQty ? 0 : item.requiredQty;
          return { ...item, pickedQty: nextQty };
        }
        return item;
      })
    );
  };

  const totalRequired = items.reduce((sum, item) => sum + item.requiredQty, 0);
  const totalPicked = items.reduce((sum, item) => sum + item.pickedQty, 0);
  const progressPercent = Math.round((totalPicked / totalRequired) * 100);
  const allPicked = items.every((i) => i.pickedQty === i.requiredQty);

  const handleFinish = () => {
    router.push(`/warehouse/serials/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-24">
      <WarehouseHeader />

      <main className="p-4 space-y-4 max-w-4xl mx-auto w-full">
        {/* شريط معلومات الطلب والتجميع */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/warehouse/orders" className="text-slate-400 hover:text-slate-700">
                <ArrowRight size={20} />
              </Link>
              <h2 className="text-lg font-black text-slate-900 font-mono">
                قائمة تجميع {orderId}
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-bold mt-1">
              العميل: صالون نور الحياة (مدينة نصر) · المندوب: محمد سالم
            </p>
          </div>

          <div className="bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>نظام الصرف الآلي بالأسبقية (FEFO) مفعّل</span>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between text-xs font-black text-slate-700 mb-1.5">
            <span>نسبة إنجاز التجميع:</span>
            <span>{progressPercent}% ({totalPicked} من {totalRequired} قطعة)</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-brand-success h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* قائمة الأصناف بنظام FEFO */}
        <div className="space-y-3">
          {items.map((item) => {
            const isCompleted = item.pickedQty === item.requiredQty;
            const isEquipment = item.type === 'equipment';

            return (
              <div
                key={item.id}
                onClick={() => togglePick(item.id)}
                className={`bg-white rounded-2xl p-4 border-2 shadow-sm transition-all cursor-pointer ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-slate-200 hover:border-brand-primary'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border-2 transition-all ${
                        isCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      <CheckCircle2 size={18} />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            isEquipment
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {isEquipment ? 'جهاز ومعدة' : 'مستحضر (FEFO)'}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {item.sku}
                        </span>
                      </div>

                      <h4 className="font-black text-slate-900 text-sm mt-1">{item.name}</h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500 mt-1.5">
                        <span className="flex items-center gap-1 text-brand-primary font-black bg-slate-100 px-2 py-0.5 rounded-md">
                          <MapPin size={13} className="text-brand-gps" />
                          {item.location}
                        </span>

                        {item.batchNumber && (
                          <span className="flex items-center gap-1 font-mono text-slate-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Barcode size={13} />
                            تشغيلة: {item.batchNumber}
                          </span>
                        )}

                        {item.expiryDate && (
                          <span className="flex items-center gap-1 font-mono text-slate-600">
                            <Calendar size={13} />
                            صلاحية: {item.expiryDate}
                          </span>
                        )}
                      </div>

                      {item.isNearExpiry && (
                        <div className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-200 mt-2">
                          <AlertTriangle size={13} />
                          <span>تنبيه FEFO: هذه أقدم تشغيلة مسجلة، يلزم صرفها أولاً للصالون.</span>
                        </div>
                      )}

                      {isEquipment && (
                        <div className="inline-flex items-center gap-1 text-blue-800 bg-blue-50 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-blue-200 mt-2">
                          <ShieldAlert size={13} />
                          <span>هذا الجهاز يتطلب تسجيل وقراءة السيريال في الخطوة القادمة.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <span className="text-xs text-slate-400 font-bold block">الكمية</span>
                    <span className="text-lg font-black font-mono text-slate-900 block">
                      {item.pickedQty} / {item.requiredQty}
                    </span>
                    <span
                      className={`text-[10px] font-black block mt-0.5 ${
                        isCompleted ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {isCompleted ? '✅ تم الاستيفاء' : 'قيد التجميع'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* زر الانتقال لمسح السيريالات واعتماد التجميع */}
        <div className="pt-2">
          <Button
            variant={allPicked ? 'gold' : 'primary'}
            size="lg"
            onClick={handleFinish}
            icon={<PackageCheck size={20} />}
          >
            {allPicked
              ? 'اكتمال التجميع ← الانتقال لمسح سيريالات الأجهزة (WH-03)'
              : 'حفظ واستكمال التجميع'}
          </Button>
        </div>
      </main>
    </div>
  );
}
