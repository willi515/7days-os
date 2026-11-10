'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, MessageSquare, Search, CheckCircle2, ChevronLeft, Navigation } from 'lucide-react';
import { RepHeader } from '@/components/ui/RepHeader';
import { StatusBadge, StatusType } from '@/components/ui/StatusBadge';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface SalonRouteItem {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
  area: string;
  balance: number;
  creditLimit: number;
  status: StatusType;
  visited: boolean;
  distanceKm: number;
}

const mockSalons: SalonRouteItem[] = [
  {
    id: '1',
    name: 'بيوتي سنتر الملكة',
    contactPerson: 'مدام سوزان',
    phone: '01012345678',
    address: '15 شارع عباس العقاد',
    area: 'مدينة نصر',
    balance: 4500,
    creditLimit: 15000,
    status: 'committed',
    visited: true,
    distanceKm: 0.3,
  },
  {
    id: '2',
    name: 'صالون البرنسيسة',
    contactPerson: 'كوافير هاني',
    phone: '01223344556',
    address: '28 شارع مكرم عبيد',
    area: 'مدينة نصر',
    balance: 18200,
    creditLimit: 15000,
    status: 'overdue',
    visited: false,
    distanceKm: 1.1,
  },
  {
    id: '3',
    name: 'صالون لمسة جمال',
    contactPerson: 'مدام ميرفت',
    phone: '01199887766',
    address: 'شارع مصطفى النحاس - عمارة 4',
    area: 'مدينة نصر',
    balance: 0,
    creditLimit: 10000,
    status: 'cash_only',
    visited: false,
    distanceKm: 1.8,
  },
  {
    id: '4',
    name: 'كوافير جولدن روز',
    contactPerson: 'أستاذ كمال',
    phone: '01511223344',
    address: 'شارع حسن المأمون - أمام النادي الأهلي',
    area: 'مدينة نصر',
    balance: 8900,
    creditLimit: 12000,
    status: 'warning',
    visited: false,
    distanceKm: 2.5,
  },
];

export default function RepRoutePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'remaining' | 'visited' | 'debt'>('all');
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  const filteredSalons = mockSalons.filter((salon) => {
    const matchesSearch =
      salon.name.includes(searchQuery) ||
      salon.contactPerson.includes(searchQuery) ||
      salon.address.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filter === 'visited') return salon.visited;
    if (filter === 'remaining') return !salon.visited;
    if (filter === 'debt') return salon.balance > 0;
    return true;
  });

  const handleCheckIn = (salonId: string) => {
    setCheckingInId(salonId);
    setTimeout(() => {
      setCheckingInId(null);
      router.push(`/rep/salon/${salonId}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <RepHeader
        title="صالونات اليوم (مدينة نصر)"
        subtitle="خط سيرك اليوم: 12 صالون · تم 4"
      />

      {/* شريط البحث الميداني السريع */}
      <div className="bg-white p-3 border-b border-slate-200 sticky top-[58px] z-30 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث باسم الصالون، الكوافير أو الشارع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 rounded-xl pr-10 pl-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary border border-slate-200 transition-all min-h-[44px]"
          />
        </div>

        {/* فلاتر التصفية السريعة */}
        <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap min-h-[36px] transition-colors ${
              filter === 'all'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل ({mockSalons.length})
          </button>
          <button
            onClick={() => setFilter('remaining')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap min-h-[36px] transition-colors ${
              filter === 'remaining'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            متبقي زيارتهم (3)
          </button>
          <button
            onClick={() => setFilter('visited')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap min-h-[36px] transition-colors ${
              filter === 'visited'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            تمت زيارتهم (1)
          </button>
          <button
            onClick={() => setFilter('debt')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap min-h-[36px] transition-colors ${
              filter === 'debt'
                ? 'bg-brand-danger text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            عليهم مديونية (3)
          </button>
        </div>
      </div>

      {/* قائمة بطاقات الصالونات */}
      <div className="p-4 space-y-3 flex-1 pb-24">
        {filteredSalons.map((salon) => (
          <div
            key={salon.id}
            className={`bg-white rounded-2xl border-2 transition-all p-4 shadow-sm relative overflow-hidden ${
              salon.visited
                ? 'border-emerald-200 bg-emerald-50/20'
                : salon.status === 'overdue'
                ? 'border-red-200'
                : 'border-slate-200 hover:border-brand-primary'
            }`}
          >
            {/* شريط جانبي يوضح حالة المديونية فورياً */}
            <div
              className={`absolute top-0 right-0 bottom-0 w-2 ${
                salon.status === 'committed'
                  ? 'bg-brand-success'
                  : salon.status === 'overdue'
                  ? 'bg-brand-danger'
                  : salon.status === 'warning'
                  ? 'bg-brand-warning'
                  : 'bg-slate-300'
              }`}
            />

            <div className="pr-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-base">{salon.name}</h3>
                    {salon.visited && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-success bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={13} />
                        تمت الزيارة
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    المسؤول: {salon.contactPerson} · {salon.area}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <Navigation size={13} className="text-brand-gps shrink-0" />
                    <span>{salon.address}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({salon.distanceKm} كم)</span>
                  </p>
                </div>
                <StatusBadge status={salon.status} size="sm" />
              </div>

              {/* قسم المديونية والحد الائتماني */}
              <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-bold block text-[11px]">المديونية الحالية:</span>
                  <MoneyDisplay
                    amount={salon.balance}
                    size="sm"
                    colored
                    isDebt={salon.balance > 0}
                  />
                </div>
                <div className="text-left">
                  <span className="text-slate-500 font-bold block text-[11px]">الحد الائتماني:</span>
                  <span className="font-bold text-slate-700">{salon.creditLimit.toLocaleString('ar-EG')} ج.م</span>
                </div>
              </div>

              {/* أزرار الإجراءات الميدانية (48px Touch Target) */}
              <div className="mt-3 grid grid-cols-4 gap-2 pt-1">
                <Button
                  variant={salon.visited ? 'outline' : 'gps'}
                  size="sm"
                  className="col-span-2 text-xs"
                  isLoading={checkingInId === salon.id}
                  onClick={() => handleCheckIn(salon.id)}
                  icon={<MapPin size={16} />}
                >
                  {salon.visited ? 'فتح بطاقة الصالون' : 'تسجيل وصول GPS'}
                </Button>

                <a
                  href={`tel:${salon.phone}`}
                  className="inline-flex items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-bold text-xs min-h-[44px] transition-colors border border-slate-200"
                >
                  <Phone size={16} className="ml-1 text-slate-600" />
                  <span>اتصال</span>
                </a>

                <a
                  href={`https://wa.me/2${salon.phone}?text=${encodeURIComponent(`أهلاً يا ${salon.contactPerson}، مندوب شركة الأمل في الطريق لحضرتك.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-xs min-h-[44px] transition-colors border border-emerald-200"
                >
                  <MessageSquare size={16} className="ml-1 text-emerald-600" />
                  <span>واتساب</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
