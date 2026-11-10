'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  UserCheck,
  Search,
  Filter,
  Package,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Timer,
  Eye,
} from 'lucide-react';
import { WarehouseHeader } from '@/components/ui/WarehouseHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface IncomingOrder {
  id: string;
  salonName: string;
  area: string;
  repName: string;
  time: string;
  elapsedMinutes: number;
  itemsCount: number;
  totalAmount: number;
  status: 'new' | 'picking' | 'ready' | 'delivered';
  assignedPicker?: string;
  hasEquipment: boolean;
}

const mockOrders: IncomingOrder[] = [
  {
    id: 'ORD-2026-1245',
    salonName: 'صالون نور الحياة',
    area: 'مدينة نصر',
    repName: 'محمد سالم',
    time: '11:30 ص',
    elapsedMinutes: 12,
    itemsCount: 3,
    totalAmount: 2450,
    status: 'new',
    hasEquipment: true,
  },
  {
    id: 'ORD-2026-1244',
    salonName: 'مركز تجميل لميس',
    area: 'الهرم',
    repName: 'علي حسن',
    time: '10:15 ص',
    elapsedMinutes: 45,
    itemsCount: 7,
    totalAmount: 5800,
    status: 'picking',
    assignedPicker: 'خالد عمر',
    hasEquipment: false,
  },
  {
    id: 'ORD-2026-1240',
    salonName: 'صالون رانيا بيوتي',
    area: 'مصر الجديدة',
    repName: 'أحمد فؤاد',
    time: '09:30 ص',
    elapsedMinutes: 65,
    itemsCount: 2,
    totalAmount: 980,
    status: 'new',
    hasEquipment: false,
  },
  {
    id: 'ORD-2026-1238',
    salonName: 'بيوتي سنتر الملكة',
    area: 'مدينة نصر',
    repName: 'أحمد فتحي',
    time: '08:45 ص',
    elapsedMinutes: 90,
    itemsCount: 2,
    totalAmount: 3300,
    status: 'ready',
    assignedPicker: 'محمود عزب',
    hasEquipment: true,
  },
];

export default function WarehouseOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'picking' | 'ready'>('all');
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.includes(searchQuery) ||
      order.salonName.includes(searchQuery) ||
      order.repName.includes(searchQuery);

    if (!matchesSearch) return false;
    if (selectedArea !== 'all' && order.area !== selectedArea) return false;
    if (activeTab !== 'all' && order.status !== activeTab) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-16">
      <WarehouseHeader />

      <main className="p-4 space-y-4 max-w-4xl mx-auto w-full">
        {/* شريط الإحصائيات الحية لليوم */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => setActiveTab('new')}
            className={`p-3 rounded-2xl border-2 text-center transition-all ${
              activeTab === 'new'
                ? 'border-amber-400 bg-amber-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-amber-200'
            }`}
          >
            <span className="text-[11px] font-bold text-amber-800 block">🟡 جديد</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block font-mono">12</span>
          </button>

          <button
            onClick={() => setActiveTab('picking')}
            className={`p-3 rounded-2xl border-2 text-center transition-all ${
              activeTab === 'picking'
                ? 'border-blue-400 bg-blue-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-blue-200'
            }`}
          >
            <span className="text-[11px] font-bold text-blue-800 block">🔵 جارٍ التجهيز</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block font-mono">5</span>
          </button>

          <button
            onClick={() => setActiveTab('ready')}
            className={`p-3 rounded-2xl border-2 text-center transition-all ${
              activeTab === 'ready'
                ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-emerald-200'
            }`}
          >
            <span className="text-[11px] font-bold text-emerald-800 block">🟢 جاهز للشحن</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block font-mono">8</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`p-3 rounded-2xl border-2 text-center transition-all ${
              activeTab === 'all'
                ? 'border-slate-800 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-400'
            }`}
          >
            <span className="text-[11px] font-bold block">📋 إجمالي اليوم</span>
            <span className="text-xl font-black mt-0.5 block font-mono">48</span>
          </button>
        </div>

        {/* شريط البحث والفلترة */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث برقم الطلب ORD، اسم الصالون، أو المندوب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 rounded-xl pr-10 pl-4 py-2.5 text-xs font-bold border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[44px]"
            />
          </div>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 min-h-[44px]"
          >
            <option value="all">📍 جميع المناطق</option>
            <option value="مدينة نصر">مدينة نصر</option>
            <option value="الهرم">الهرم والجيزة</option>
            <option value="مصر الجديدة">مصر الجديدة</option>
          </select>
        </div>

        {/* بطاقات الطلبات */}
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isLate = order.status === 'new' && order.elapsedMinutes > 30;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl p-4 border-2 shadow-sm transition-all relative ${
                  isLate
                    ? 'border-red-300 bg-red-50/20'
                    : order.status === 'picking'
                    ? 'border-blue-200'
                    : order.status === 'ready'
                    ? 'border-emerald-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-slate-900">
                        {order.id}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          order.status === 'new'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : order.status === 'picking'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {order.status === 'new'
                          ? 'طلب جديد'
                          : order.status === 'picking'
                          ? 'جارٍ التجميع'
                          : 'جاهز للشحن'}
                      </span>

                      {order.hasEquipment && (
                        <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md border border-indigo-200">
                          يحتوي أجهزة ⚙️
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-slate-900 text-sm mt-1">
                      {order.salonName} · <span className="text-slate-500 font-semibold">{order.area}</span>
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-bold mt-1.5">
                      <span>المندوب: {order.repName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock size={13} />
                        {order.time}
                      </span>
                      <span>•</span>
                      <span>{order.itemsCount} أصناف</span>

                      {isLate && (
                        <span className="text-brand-danger font-black flex items-center gap-1">
                          <Timer size={13} />
                          متأخر: منذ {order.elapsedMinutes} دقيقة!
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <MoneyDisplay amount={order.totalAmount} size="lg" />
                    {order.assignedPicker && (
                      <span className="text-xs text-slate-500 font-bold mt-1 block">
                        عامل التجميع: <strong className="text-slate-800">{order.assignedPicker}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {order.status === 'new' ? (
                      <Link href={`/warehouse/picking/${order.id}`}>
                        <Button
                          variant={isLate ? 'danger' : 'gold'}
                          size="sm"
                          icon={<UserCheck size={16} />}
                          className="text-xs"
                        >
                          {isLate ? 'تعيين عامل فوراً 🚨' : 'تعيين لعامل التجميع'}
                        </Button>
                      </Link>
                    ) : order.status === 'picking' ? (
                      <Link href={`/warehouse/picking/${order.id}`}>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Package size={16} />}
                          className="text-xs"
                        >
                          متابعة قائمة التجميع (FEFO)
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/warehouse/serials/${order.id}`}>
                        <Button
                          variant="success"
                          size="sm"
                          icon={<CheckCircle2 size={16} />}
                          className="text-xs"
                        >
                          فحص السيريالات والملصق
                        </Button>
                      </Link>
                    )}

                    {order.hasEquipment && order.status === 'picking' && (
                      <Link href={`/warehouse/serials/${order.id}`}>
                        <button className="px-3 py-2 bg-blue-50 text-blue-800 rounded-xl font-bold text-xs hover:bg-blue-100 transition-colors border border-blue-200 min-h-[44px]">
                          مسح سيريالات الأجهزة 🔍
                        </button>
                      </Link>
                    )}
                  </div>

                  <Link href={`/rep/salon/1`}>
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800 p-2 flex items-center gap-1 min-h-[44px]">
                      <Eye size={15} />
                      <span>عرض الطلب الكامل</span>
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
