'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ScanLine,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Package,
  QrCode,
  ArrowRight,
  Truck,
  Plus,
  Trash2,
} from 'lucide-react';
import { WarehouseHeader } from '@/components/ui/WarehouseHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function WarehouseSerialsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId || 'ORD-2026-1245';

  const [serialInput, setSerialInput] = useState('TR-88220911');
  const [scannedSerials, setScannedSerials] = useState<
    Array<{ serial: string; item: string; warrantyMonths: number }>
  >([
    {
      serial: 'TR-88220911',
      item: 'سشوار صالونات تورنادو 2500 وات الإيطالي',
      warrantyMonths: 12,
    },
  ]);

  const [boxesCount, setBoxesCount] = useState(1);
  const [isReady, setIsReady] = useState(false);

  const handleAddSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;

    setScannedSerials((prev) => [
      ...prev,
      {
        serial: serialInput.trim().toUpperCase(),
        item: 'سشوار صالونات تورنادو 2500 وات الإيطالي',
        warrantyMonths: 12,
      },
    ]);
    setSerialInput('');
  };

  const handleFinishToManifest = () => {
    setIsReady(true);
    setTimeout(() => {
      router.push('/warehouse/manifest');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-24">
      <WarehouseHeader />

      <main className="p-4 space-y-4 max-w-4xl mx-auto w-full">
        {/* شريط رأس الشاشة */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={`/warehouse/picking/${orderId}`} className="text-slate-400 hover:text-slate-700">
              <ArrowRight size={20} />
            </Link>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-mono">
                مسح سيريالات الأجهزة وملصق الشحن
              </h2>
              <p className="text-xs text-slate-500 font-bold">
                طلب: {orderId} · صالون نور الحياة (مدينة نصر)
              </p>
            </div>
          </div>

          <span className="text-xs font-black bg-blue-50 text-blue-900 px-3 py-1.5 rounded-xl border border-blue-200">
            أجهزة تحت الضمان 🛡️
          </span>
        </div>

        {/* وحدة مسح الباركود والسيريال */}
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ScanLine size={20} className="text-brand-gps" />
            <h3 className="font-black text-slate-900 text-sm">
              مسح باركود السيريال لجهاز: سشوار تورنادو 2500 وات
            </h3>
          </div>

          <form onSubmit={handleAddSerial} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="امسح الباركود بجهاز القارئ أو اكتب السيريال (مثلاً: TR-88220911)..."
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                className="font-mono text-sm uppercase font-bold"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-auto px-5 shrink-0"
              icon={<Plus size={18} />}
            >
              تأكيد السيريال
            </Button>
          </form>

          {/* قائمة السيريالات المسجلة */}
          <div className="space-y-2">
            {scannedSerials.map((s, idx) => (
              <div
                key={idx}
                className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-brand-success" />
                  <div>
                    <span className="font-mono font-black text-slate-900 block text-sm">
                      {s.serial}
                    </span>
                    <span className="text-slate-500 font-bold">{s.item}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md text-[11px] font-black text-blue-800 border border-blue-200">
                    <ShieldCheck size={13} />
                    ضمان {s.warrantyMonths} شهراً
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ملصق الشحن الحراري للكرتونة (Shipping Label Preview) */}
        <div className="bg-white rounded-2xl p-5 border-2 border-dashed border-slate-300 shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="font-black text-slate-800 text-sm flex items-center gap-1.5">
              <Package size={18} className="text-brand-primary" />
              <span>معاينة ملصق الشحن الحراري (10 × 15 سم)</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              icon={<Printer size={16} />}
              onClick={() => window.print()}
              className="w-auto text-xs"
            >
              طباعة الملصق الآن 🖨️
            </Button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 font-mono text-xs space-y-2">
            <div className="flex justify-between border-b pb-2">
              <div>
                <strong className="block text-slate-900 text-sm">7Days OS Logistics</strong>
                <span className="text-slate-500">شركة الأمل للتوزيع</span>
              </div>
              <div className="text-left">
                <span className="font-black text-sm block">#{orderId}</span>
                <span className="text-slate-500">طرد: 1 من 1</span>
              </div>
            </div>

            <div className="py-1">
              <span className="text-slate-500 block text-[10px]">المستلم (الصالون):</span>
              <strong className="text-slate-900 block text-sm">صالون نور الحياة</strong>
              <span className="text-slate-600 block">15 شارع عباس العقاد - مدينة نصر - القاهرة</span>
            </div>

            <div className="flex justify-between pt-2 border-t text-[11px]">
              <span>المندوب: محمد سالم</span>
              <span>سيريالات معتمدة: 1 جهاز</span>
              <span>تاريخ: 10/11/2026</span>
            </div>
          </div>
        </div>

        {/* زر الاعتماد النهائي والتحويل لبيان الشحن */}
        <Button
          variant="gold"
          size="lg"
          onClick={handleFinishToManifest}
          icon={<Truck size={20} />}
          isLoading={isReady}
        >
          اعتماد الطلب جاهز للشحن ← إضافته لبيان السيارة (WH-04)
        </Button>
      </main>
    </div>
  );
}
