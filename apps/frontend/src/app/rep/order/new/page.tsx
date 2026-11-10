'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus,
  Minus,
  Gift,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { RepHeader } from '@/components/ui/RepHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  type: 'cosmetic' | 'equipment';
  price: number;
  stock: number;
  batchOrWarranty: string;
  bonusRule?: string; // مثلاً: اشتري 10 واحصل على 1 مجاناً
}

const mockProducts: ProductItem[] = [
  {
    id: 'p1',
    name: 'شامبو كيراتين برازيلي احترافي 1000 مل',
    sku: '6224001122334',
    type: 'cosmetic',
    price: 200,
    stock: 45,
    batchOrWarranty: 'صلاحية: 08/2028 · تشغيلة B-802',
    bonusRule: 'اشتري 10 قطع واحصل على 1 مجاناً 🎁',
  },
  {
    id: 'p2',
    name: 'سيروم شعر بالأرجان الطبيعي 100 مل',
    sku: '6221112223334',
    type: 'cosmetic',
    price: 130,
    stock: 80,
    batchOrWarranty: 'صلاحية: 12/2027 · تشغيلة B-610',
  },
  {
    id: 'p3',
    name: 'سشوار صالونات تورنادو 2500 وات الإيطالي',
    sku: 'EQ-DRY-802',
    type: 'equipment',
    price: 1300,
    stock: 8,
    batchOrWarranty: 'ضمان الوكيل: 12 شهراً بسيريال الجهاز',
  },
  {
    id: 'p4',
    name: 'مكواة شعر نانو تيتانيوم بيبي ليس برو',
    sku: 'EQ-STR-501',
    type: 'equipment',
    price: 1650,
    stock: 6,
    batchOrWarranty: 'ضمان الوكيل: 24 شهراً بسيريال الجهاز',
  },
];

export default function RepNewOrderPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'cosmetic' | 'equipment'>('all');
  const [cart, setCart] = useState<Record<string, number>>({ p1: 10, p3: 1 });

  const salonAvailableCredit = 10500; // رصيد الحد الائتماني المتبقي لبيوتي سنتر الملكة

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.includes(searchQuery) || product.sku.includes(searchQuery);
    if (!matchesSearch) return false;
    if (activeTab === 'cosmetic') return product.type === 'cosmetic';
    if (activeTab === 'equipment') return product.type === 'equipment';
    return true;
  });

  // حساب الإجماليات والبوانص
  let subtotal = 0;
  let totalBonusItems = 0;

  Object.entries(cart).forEach(([prodId, qty]) => {
    const prod = mockProducts.find((p) => p.id === prodId);
    if (prod) {
      subtotal += prod.price * qty;
      // منطق البونص التلقائي: كل 10 قطع = 1 بونص مجاني
      if (prod.bonusRule && qty >= 10) {
        totalBonusItems += Math.floor(qty / 10);
      }
    }
  });

  const exceedsCredit = subtotal > salonAvailableCredit;

  const handleProceedToPayment = () => {
    if (subtotal === 0) return;
    router.push(`/rep/payment?total=${subtotal}&bonus=${totalBonusItems}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-36">
      <RepHeader
        title="طلبية جديدة"
        subtitle="بيوتي سنتر الملكة · شريحة الجملة"
        showBack
      />

      {/* شريط البحث وفلاتر النوع */}
      <div className="bg-white p-3 border-b border-slate-200 sticky top-[58px] z-30 shadow-sm">
        <div className="relative">
          <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو الباركود..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 rounded-xl pr-10 pl-4 py-2 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary border border-slate-200 transition-all min-h-[44px]"
          />
        </div>

        <div className="flex gap-2 mt-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-lg transition-colors min-h-[36px] ${
              activeTab === 'all'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            جميع الأصناف
          </button>
          <button
            onClick={() => setActiveTab('cosmetic')}
            className={`flex-1 py-1.5 rounded-lg transition-colors min-h-[36px] ${
              activeTab === 'cosmetic'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            مستحضرات وتجميل
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`flex-1 py-1.5 rounded-lg transition-colors min-h-[36px] ${
              activeTab === 'equipment'
                ? 'bg-brand-primary text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            أجهزة وسيريالات
          </button>
        </div>
      </div>

      {/* قائمة المنتجات */}
      <div className="p-4 space-y-3 flex-1">
        {filteredProducts.map((product) => {
          const qty = cart[product.id] || 0;
          const isEquipment = product.type === 'equipment';

          return (
            <div
              key={product.id}
              className={`bg-white rounded-2xl p-4 border-2 transition-all shadow-sm ${
                qty > 0 ? 'border-brand-primary ring-1 ring-brand-primary/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        isEquipment
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isEquipment ? 'جهاز ومعدة' : 'مستحضر تجميل'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{product.sku}</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm mt-1">{product.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                    {isEquipment ? (
                      <ShieldCheck size={14} className="text-brand-gps" />
                    ) : (
                      <Calendar size={14} className="text-emerald-600" />
                    )}
                    <span>{product.batchOrWarranty}</span>
                  </p>

                  {product.bonusRule && (
                    <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-md border border-amber-200 mt-1.5">
                      <Gift size={13} className="text-brand-gold" />
                      <span>{product.bonusRule}</span>
                    </div>
                  )}
                </div>

                <div className="text-left shrink-0">
                  <span className="text-xs text-slate-400 block font-bold">سعر الجملة</span>
                  <MoneyDisplay amount={product.price} size="md" />
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-bold">
                    المتاح: {product.stock}
                  </span>
                </div>
              </div>

              {/* عداد الكمية الميداني المريح للمندوب */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {qty > 0 ? (
                    <span className="text-brand-primary font-black">
                      الإجمالي: {(product.price * qty).toLocaleString('ar-EG')} ج.م
                    </span>
                  ) : (
                    'الكمية المطلوبة:'
                  )}
                </span>

                <div className="flex items-center gap-3">
                  {qty > 0 && (
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-95 flex items-center justify-center font-bold text-lg min-h-[40px] min-w-[40px]"
                    >
                      <Minus size={18} />
                    </button>
                  )}

                  {qty > 0 && (
                    <span className="w-8 text-center font-black text-slate-900 text-base font-mono">
                      {qty}
                    </span>
                  )}

                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="w-10 h-10 rounded-xl bg-brand-primary text-white hover:bg-slate-800 active:scale-95 flex items-center justify-center font-bold text-lg min-h-[40px] min-w-[40px]"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* شريط السلة العائم في أسفل الشاشة */}
      <div className="fixed bottom-16 left-0 right-0 z-30 max-w-md mx-auto bg-white border-t-2 border-slate-200 p-4 shadow-2xl">
        {exceedsCredit && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-brand-danger">
            <AlertTriangle size={16} className="shrink-0" />
            <span>
              قيمة الطلبية تتجاوز الحد الائتماني المتبقي للصالون ({salonAvailableCredit.toLocaleString('ar-EG')} ج.م). يلزم تحصيل دفعة نقدية فورية.
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold text-slate-500 block">إجمالي الطلبية الحالية:</span>
            <div className="flex items-center gap-2">
              <MoneyDisplay amount={subtotal} size="xl" colored={exceedsCredit} isDebt={exceedsCredit} />
              {totalBonusItems > 0 && (
                <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                  +{totalBonusItems} بونص مجاني 🎁
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            {Object.keys(cart).length} أصناف في السلة
          </span>
        </div>

        <Button
          variant={exceedsCredit ? 'danger' : 'gold'}
          size="lg"
          onClick={handleProceedToPayment}
          disabled={subtotal === 0}
          icon={<ShoppingBag size={20} />}
        >
          {exceedsCredit ? 'متابعة مع التحصيل النقدي الإلزامي' : 'متابعة السداد والاعتماد'}
        </Button>
      </div>
    </div>
  );
}
