'use client';

import React, { useState } from 'react';
import {
  Truck,
  Printer,
  Navigation,
  CheckCircle2,
  Package,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { WarehouseHeader } from '@/components/ui/WarehouseHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface ManifestStop {
  stopNumber: number;
  orderId: string;
  salonName: string;
  address: string;
  cartonsCount: number;
  amount: number;
  loaded: boolean;
}

export default function WarehouseManifestPage() {
  const [manifestNumber] = useState('MAN-2026-1108');
  const [vehicle] = useState('شيفروليه جامبو · لوحات: ق ص ج 4821');
  const [driverName] = useState('عماد عبد الرحمن (01201122334)');
  const [routeArea] = useState('قطاع شرق القاهرة (مدينة نصر ومصر الجديدة)');
  const [isDispatched, setIsDispatched] = useState(false);

  const [stops, setStops] = useState<ManifestStop[]>([
    {
      stopNumber: 1,
      orderId: 'ORD-2026-1245',
      salonName: 'صالون نور الحياة',
      address: '15 شارع عباس العقاد - مدينة نصر',
      cartonsCount: 3,
      amount: 2450,
      loaded: true,
    },
    {
      stopNumber: 2,
      orderId: 'ORD-2026-1240',
      salonName: 'صالون رانيا بيوتي',
      address: 'شارع الثورة - مصر الجديدة',
      cartonsCount: 2,
      amount: 980,
      loaded: true,
    },
    {
      stopNumber: 3,
      orderId: 'ORD-2026-1238',
      salonName: 'بيوتي سنتر الملكة',
      address: 'شارع مكرم عبيد - مدينة نصر',
      cartonsCount: 4,
      amount: 3300,
      loaded: true,
    },
  ]);

  const totalCartons = stops.reduce((sum, s) => sum + s.cartonsCount, 0);
  const totalValue = stops.reduce((sum, s) => sum + s.amount, 0);

  const handleDispatch = () => {
    setIsDispatched(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-24">
      <WarehouseHeader />

      <main className="p-4 space-y-4 max-w-4xl mx-auto w-full">
        {/* بطاقة معلومات بيان الشحن */}
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-black text-slate-900">
                  #{manifestNumber}
                </span>
                <span className="bg-indigo-100 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-200">
                  {isDispatched ? 'في طريق التوزيع 🚀' : 'قيد التحميل بالمستودع 📦'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold mt-1">{routeArea}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<Printer size={16} />}
              onClick={() => window.print()}
              className="w-auto text-xs"
            >
              طباعة إذن خروج الشاحنة والبيان
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold block text-[11px]">بيانات الشاحنة:</span>
              <strong className="text-slate-800 text-sm mt-0.5 block flex items-center gap-1.5">
                <Truck size={16} className="text-brand-gps" />
                {vehicle}
              </strong>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold block text-[11px]">سائق الشاحنة:</span>
              <strong className="text-slate-800 text-sm mt-0.5 block flex items-center gap-1.5">
                <User size={16} className="text-brand-primary" />
                {driverName}
              </strong>
            </div>
          </div>
        </div>

        {/* إحصائيات الحمولة الكلية */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-500 block">عدد الطلبات</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block font-mono">
              {stops.length}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-500 block">إجمالي الطرود</span>
            <span className="text-2xl font-black text-brand-gps mt-1 block font-mono">
              {totalCartons}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-xs font-bold text-slate-500 block">قيمة البضاعة</span>
            <MoneyDisplay amount={totalValue} size="lg" className="mt-1" />
          </div>
        </div>

        {/* خط سير تسليمات الشاحنة (محطات التوزيع) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <Navigation size={18} className="text-brand-gps" />
            <span>محطات التوزيع بالترتيب الجغرافي:</span>
          </h3>

          <div className="space-y-3">
            {stops.map((stop) => (
              <div
                key={stop.orderId}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-white font-mono font-black flex items-center justify-center shrink-0">
                    {stop.stopNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{stop.salonName}</span>
                      <span className="font-mono text-slate-400 font-bold">{stop.orderId}</span>
                    </div>
                    <p className="text-slate-500 mt-0.5">{stop.address}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md mt-1">
                      <CheckCircle2 size={13} />
                      تم التحميل والمطابقة في الصندوق ({stop.cartonsCount} طرود)
                    </span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <MoneyDisplay amount={stop.amount} size="md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* زر انطلاق السيارة وبدء التتبع */}
        <div className="pt-2">
          {isDispatched ? (
            <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg text-center space-y-2">
              <CheckCircle2 size={32} className="mx-auto" />
              <h4 className="text-lg font-black">الشاحنة في طريقها للتسليم الآن!</h4>
              <p className="text-xs text-emerald-100 font-medium">
                تم تحديث حالة جميع الطلبات إلى (في طريق التوصيل)، ويجري تتبع خط سير السائق عبر الـ GPS.
              </p>
            </div>
          ) : (
            <Button
              variant="gold"
              size="lg"
              onClick={handleDispatch}
              icon={<Truck size={22} />}
            >
              اعتماد خروج الشاحنة وانطلاق خط السير 🚀
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
