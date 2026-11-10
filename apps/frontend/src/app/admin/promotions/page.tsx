'use client';

import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Gift,
  Package,
  Calendar,
  CheckCircle2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from 'lucide-react';
import { AdminLayout } from '@/components/ui/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PromotionDeal {
  id: string;
  title: string;
  type: 'bonus' | 'bundle' | 'clearance';
  description: string;
  buyQty?: number;
  freeQty?: number;
  targetProduct: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  salonsTargeted: string;
}

export default function AdminPromotionsPage() {
  const [deals, setDeals] = useState<PromotionDeal[]>([
    {
      id: 'd1',
      title: 'عرض كيراتين الذهب (10 + 1 مجاناً)',
      type: 'bonus',
      description: 'كل طلبية 10 عبوات شامبو كيراتين 1000 مل يحصل الصالون على عبوة مجانية فوراً',
      buyQty: 10,
      freeQty: 1,
      targetProduct: 'شامبو كيراتين برازيلي 1000 مل',
      startDate: '2026-11-01',
      endDate: '2026-11-30',
      isActive: true,
      salonsTargeted: 'جميع الصالونات ومراكز التجميل',
    },
    {
      id: 'd2',
      title: 'باكيدج تجهيز صالون إيطالي (سشوار + مكواة)',
      type: 'bundle',
      description: 'سشوار تورنادو 2500 وات + مكواة تيتانيوم بسعر 2,750 ج.م بدلاً من 2,950 ج.م',
      targetProduct: 'سشوار تورنادو + مكواة نانو تيتانيوم',
      startDate: '2026-11-05',
      endDate: '2026-12-05',
      isActive: true,
      salonsTargeted: 'عملاء شريحة كبار العملاء فقط',
    },
    {
      id: 'd3',
      title: 'تصفية تشغيلة سيروم أرجان (خصم 20%)',
      type: 'clearance',
      description: 'خصم فوري لتصريف تشغيلة BATCH-2026-04 قريبة الصلاحية',
      targetProduct: 'سيروم شعر بالأرجان 100 مل',
      startDate: '2026-11-10',
      endDate: '2026-11-25',
      isActive: true,
      salonsTargeted: 'جميع العملاء',
    },
  ]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newBuyQty, setNewBuyQty] = useState('10');
  const [newFreeQty, setNewFreeQty] = useState('1');

  const toggleDealStatus = (id: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isActive: !d.isActive } : d))
    );
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setDeals((prev) => [
      {
        id: `d-${Date.now()}`,
        title: newTitle,
        type: 'bonus',
        description: `اشتري ${newBuyQty} وخذ ${newFreeQty} مجاناً`,
        buyQty: parseInt(newBuyQty, 10),
        freeQty: parseInt(newFreeQty, 10),
        targetProduct: newProduct || 'منتج مختار',
        startDate: '2026-11-10',
        endDate: '2026-12-10',
        isActive: true,
        salonsTargeted: 'جميع الصالونات',
      },
      ...prev,
    ]);

    setShowNewModal(false);
    setNewTitle('');
    setNewProduct('');
  };

  return (
    <AdminLayout
      title="إدارة العروض والصفقات والبوانص"
      subtitle="تطبيق بوانص الكمية وخصومات الصالونات آلياً على تطبيقات المناديب"
      actions={
        <Button
          variant="gold"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => setShowNewModal(true)}
          className="text-xs w-auto px-4"
        >
          إنشاء عرض بونص جديد 🎁
        </Button>
      }
    >
      {/* 1. نافذة إنشاء عرض جديد */}
      {showNewModal && (
        <div className="bg-white p-5 rounded-2xl border-2 border-brand-gold shadow-lg space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Sparkles size={18} className="text-brand-gold" />
              <span>إطلاق عرض ترويجي / بونص جديد</span>
            </h3>
            <button
              onClick={() => setShowNewModal(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              إلغاء
            </button>
          </div>

          <form onSubmit={handleCreateDeal} className="space-y-3">
            <Input
              label="عنوان العرض الترويجي:"
              placeholder="مثلاً: عرض الكيراتين الاحترافي (10 + 1)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />

            <Input
              label="اسم المنتج المستهدف:"
              placeholder="مثلاً: شامبو كيراتين 1000 مل"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="الكمية المطلوبة للشراء:"
                type="number"
                value={newBuyQty}
                onChange={(e) => setNewBuyQty(e.target.value)}
                required
              />
              <Input
                label="عدد قطع البونص المجاني:"
                type="number"
                value={newFreeQty}
                onChange={(e) => setNewFreeQty(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md">
              اعتماد ونشر العرض فورياً على أجهزة المناديب ⚡
            </Button>
          </form>
        </div>
      )}

      {/* 2. قائمة العروض النشطة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className={`bg-white rounded-2xl p-5 border-2 shadow-sm transition-all flex flex-col justify-between ${
              deal.isActive ? 'border-brand-gold/60' : 'border-slate-200 opacity-60'
            }`}
          >
            <div>
              <div className="flex justify-between items-start gap-2 pb-2 border-b border-slate-100">
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    deal.type === 'bonus'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : deal.type === 'bundle'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}
                >
                  {deal.type === 'bonus'
                    ? 'بونص كمية 🎁'
                    : deal.type === 'bundle'
                    ? 'حزمة أجهزة ⚙️'
                    : 'تصفية مخزون ⏳'}
                </span>

                <button
                  onClick={() => toggleDealStatus(deal.id)}
                  className={`text-xs font-black flex items-center gap-1 ${
                    deal.isActive ? 'text-brand-success' : 'text-slate-400'
                  }`}
                >
                  {deal.isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  <span>{deal.isActive ? 'مفعل' : 'معطل'}</span>
                </button>
              </div>

              <h4 className="font-black text-slate-900 text-base mt-3">{deal.title}</h4>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                {deal.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>المنتج:</span>
                  <span className="text-slate-800">{deal.targetProduct}</span>
                </div>
                <div className="flex justify-between">
                  <span>الفترة:</span>
                  <span className="font-mono">{deal.startDate} إلى {deal.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>الشريحة المستهدفة:</span>
                  <span className="text-brand-primary">{deal.salonsTargeted}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-black flex items-center gap-1">
                <CheckCircle2 size={14} />
                يُطبق تلقائياً بالفاتورة
              </span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
