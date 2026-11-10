'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Battery,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Search,
  Compass,
} from 'lucide-react';
import { AdminLayout } from '@/components/ui/AdminLayout';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface SalesRepTracking {
  id: string;
  name: string;
  phone: string;
  zone: string;
  status: 'at_salon' | 'driving' | 'idle' | 'offline';
  currentLocationName: string;
  speedKmH: number;
  batteryLevel: number;
  completedVisits: number;
  totalVisits: number;
  salesToday: number;
  cashCollectedToday: number;
  lastUpdate: string;
}

const mockReps: SalesRepTracking[] = [
  {
    id: 'rep-1',
    name: 'أحمد فتحي',
    phone: '01012345678',
    zone: 'مدينة نصر (قطاع الشرق)',
    status: 'at_salon',
    currentLocationName: 'داخل صالون بيوتي سنتر الملكة (شارع عباس العقاد)',
    speedKmH: 0,
    batteryLevel: 84,
    completedVisits: 5,
    totalVisits: 8,
    salesToday: 42000,
    cashCollectedToday: 24000,
    lastUpdate: 'منذ دقيقة',
  },
  {
    id: 'rep-2',
    name: 'محمد سالم',
    phone: '01224455667',
    zone: 'مصر الجديدة والنزهة',
    status: 'driving',
    currentLocationName: 'في الطريق إلى صالون رانيا (شارع الثورة)',
    speedKmH: 38,
    batteryLevel: 62,
    completedVisits: 3,
    totalVisits: 7,
    salesToday: 28500,
    cashCollectedToday: 18000,
    lastUpdate: 'منذ 30 ثانية',
  },
  {
    id: 'rep-3',
    name: 'علي حسن',
    phone: '01122334455',
    zone: 'الهرم وفيصل (الجيزة)',
    status: 'idle',
    currentLocationName: 'متوقف أمام محطة وقود التعاون - شارع فيصل',
    speedKmH: 0,
    batteryLevel: 45,
    completedVisits: 4,
    totalVisits: 9,
    salesToday: 35000,
    cashCollectedToday: 15500,
    lastUpdate: 'منذ 8 دقائق',
  },
  {
    id: 'rep-4',
    name: 'أحمد فؤاد',
    phone: '01511223344',
    zone: 'المعادي وحلوان',
    status: 'at_salon',
    currentLocationName: 'داخل صالون لمسة جمال - دجلة المعادي',
    speedKmH: 0,
    batteryLevel: 91,
    completedVisits: 6,
    totalVisits: 10,
    salesToday: 51000,
    cashCollectedToday: 31000,
    lastUpdate: 'منذ لحظات',
  },
];

export default function AdminRepTrackingPage() {
  const [selectedRep, setSelectedRep] = useState<SalesRepTracking>(mockReps[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReps = mockReps.filter((r) =>
    r.name.includes(searchQuery) || r.zone.includes(searchQuery)
  );

  return (
    <AdminLayout
      title="خريطة تتبع المناديب المباشرة (GPS Live Radar)"
      subtitle="متابعة حركة المناديب في الشوارع، توثيق الزيارات، ونسب البطارية والمبيعات اللحظية"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 1. قائمة المناديب الجانبية */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث باسم المندوب أو المنطقة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 rounded-xl pr-9 pl-3 py-2 text-xs font-bold border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[42px]"
            />
          </div>

          <div className="space-y-2">
            {filteredReps.map((rep) => {
              const isSelected = selectedRep.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedRep(rep)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-brand-primary bg-slate-900 text-white shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          rep.status === 'at_salon'
                            ? 'bg-emerald-400 animate-pulse'
                            : rep.status === 'driving'
                            ? 'bg-blue-400 animate-bounce'
                            : 'bg-amber-400'
                        }`}
                      />
                      <strong className={`font-black text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {rep.name}
                      </strong>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-slate-800 text-brand-gold'
                          : rep.status === 'at_salon'
                          ? 'bg-emerald-100 text-emerald-800'
                          : rep.status === 'driving'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rep.status === 'at_salon'
                        ? 'في صالون الآن 🟢'
                        : rep.status === 'driving'
                        ? 'في الطريق 🚗'
                        : 'متوقف ⏸️'}
                    </span>
                  </div>

                  <p className={`text-xs mt-1 font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {rep.zone}
                  </p>

                  <div className="mt-2 pt-2 border-t border-current/10 flex items-center justify-between text-[11px] font-bold">
                    <span>
                      الزيارات: {rep.completedVisits} / {rep.totalVisits}
                    </span>
                    <span className={isSelected ? 'text-brand-gold font-mono' : 'text-brand-primary font-mono'}>
                      مبيعات: {rep.salesToday.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. رادار الخريطة الحي والبيانات التفصيلية للمندوب المحدد */}
        <div className="lg:col-span-2 space-y-4">
          {/* محاكي الخريطة التفاعلية */}
          <div className="bg-slate-900 rounded-2xl border-2 border-slate-800 shadow-lg p-6 text-white relative overflow-hidden min-h-[340px] flex flex-col justify-between">
            {/* خلفية شبكة GPS الإحداثية */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* شريط أدوات الخريطة العلوية */}
            <div className="relative z-10 flex justify-between items-center bg-slate-800/90 backdrop-blur-md p-3 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-brand-gold animate-spin" style={{ animationDuration: '8s' }} />
                <span className="text-xs font-black text-slate-200">
                  خريطة الميدان الحية · القاهرة الكبرى
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>إشارة GPS دقيقة (±4 أمتار)</span>
              </div>
            </div>

            {/* نقطة المندوب المحدد على الخريطة */}
            <div className="relative z-10 my-auto text-center p-6">
              <div className="inline-flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-brand-gps/30 animate-ping absolute inset-0" />
                  <div className="w-16 h-16 rounded-full bg-brand-gps text-white flex items-center justify-center shadow-2xl border-4 border-white relative z-10">
                    <Navigation size={28} className="rotate-45" />
                  </div>
                </div>

                <div className="mt-3 bg-slate-800/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-600 shadow-xl">
                  <strong className="text-sm font-black text-white block">
                    {selectedRep.name} ({selectedRep.zone})
                  </strong>
                  <span className="text-xs text-brand-gold font-bold block mt-0.5">
                    {selectedRep.currentLocationName}
                  </span>
                </div>
              </div>
            </div>

            {/* شريط الإحصائيات الميداني أسفل الخريطة */}
            <div className="relative z-10 grid grid-cols-3 gap-2 bg-slate-800/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">السرعة الحالية</span>
                <strong className="text-sm font-mono text-white">
                  {selectedRep.speedKmH} كم/س
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">شحن بطارية الهاتف</span>
                <strong className="text-sm font-mono text-emerald-400 flex items-center justify-center gap-1">
                  <Battery size={14} />
                  {selectedRep.batteryLevel}%
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">آخر تحديث للموقع</span>
                <strong className="text-sm font-mono text-slate-300">
                  {selectedRep.lastUpdate}
                </strong>
              </div>
            </div>
          </div>

          {/* بطاقة تفاصيل مبيعات وتحصيلات المندوب اليوم */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right">
                <span className="text-xs font-bold text-slate-400 block">إجمالي مبيعات اليوم</span>
                <MoneyDisplay amount={selectedRep.salesToday} size="lg" className="mt-1" />
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-right">
                <span className="text-xs font-bold text-emerald-800 block">التحصيلات النقدية</span>
                <MoneyDisplay amount={selectedRep.cashCollectedToday} size="lg" colored className="mt-1" />
              </div>
            </div>

            {/* أزرار الاتصال المباشر بالمندوب */}
            <div className="flex gap-2 w-full sm:w-auto">
              <a
                href={`tel:${selectedRep.phone}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-slate-900 text-white px-4 py-3 rounded-xl font-black text-xs hover:bg-slate-800 min-h-[46px]"
              >
                <Phone size={16} />
                <span>اتصال بالمندوب</span>
              </a>

              <a
                href={`https://wa.me/2${selectedRep.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-4 py-3 rounded-xl font-black text-xs hover:bg-emerald-700 min-h-[46px]"
              >
                <MessageSquare size={16} />
                <span>واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
