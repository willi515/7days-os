'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Gift,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { B2BHeader } from '@/components/ui/B2BHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface B2BProduct {
  id: string;
  name: string;
  sku: string;
  category: 'protein' | 'care' | 'equipment';
  salonPrice: number;
  retailPrice: number;
  unit: string;
  warrantyOrOrigin: string;
  inStock: boolean;
  minOrderQty: number;
}

const mockB2BProducts: B2BProduct[] = [
  {
    id: 'b1',
    name: 'بروتين برازيلي معالج مكثف كيراتين وفيتامينات 1000 مل',
    sku: '6224001122334',
    category: 'protein',
    salonPrice: 1250,
    retailPrice: 1450,
    unit: 'عبوة 1000 مل',
    warrantyOrOrigin: 'صناعة برازيلية أصلية معتمدة 🇧🇷',
    inStock: true,
    minOrderQty: 1,
  },
  {
    id: 'b2',
    name: 'سيروم شعر بالأرجان الطبيعي للشعر التالف 100 مل',
    sku: '6221112223334',
    category: 'care',
    salonPrice: 130,
    retailPrice: 180,
    unit: 'قطعة',
    warrantyOrOrigin: 'خالٍ من السلفات والبارابين 🌿',
    inStock: true,
    minOrderQty: 2,
  },
  {
    id: 'b3',
    name: 'مكواة شعر سيراميك نانو تيتانيوم صالونات احترافية',
    sku: 'EQ-STR-501',
    category: 'equipment',
    salonPrice: 1650,
    retailPrice: 2100,
    unit: 'جهاز',
    warrantyOrOrigin: 'ضمان استبدال معتمد 24 شهراً 🛡️',
    inStock: true,
    minOrderQty: 1,
  },
  {
    id: 'b4',
    name: 'سشوار صالونات تورنادو 2500 وات الإيطالي',
    sku: 'EQ-DRY-802',
    category: 'equipment',
    salonPrice: 1300,
    retailPrice: 1600,
    unit: 'جهاز',
    warrantyOrOrigin: 'موتور إيطالي شديد التحمل - ضمان سنة ⚙️',
    inStock: true,
    minOrderQty: 1,
  },
];

export default function B2BCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'protein' | 'care' | 'equipment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({ b1: 1, b4: 1 });

  const updateCart = (productId: string, delta: number) => {
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

  const addPromoBundle = () => {
    setCart((prev) => ({
      ...prev,
      b1: (prev.b1 || 0) + 2,
      b2: (prev.b2 || 0) + 1,
    }));
  };

  const filteredProducts = mockB2BProducts.filter((product) => {
    const matchesSearch =
      product.name.includes(searchQuery) || product.sku.includes(searchQuery);
    if (!matchesSearch) return false;
    if (activeCategory !== 'all' && product.category !== activeCategory) return false;
    return true;
  });

  // حساب إجمالي السلة
  let cartTotal = 0;
  let cartCount = 0;
  Object.entries(cart).forEach(([id, qty]) => {
    const item = mockB2BProducts.find((p) => p.id === id);
    if (item) {
      cartTotal += item.salonPrice * qty;
      cartCount += qty;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-32">
      <B2BHeader cartCount={cartCount} cartTotal={cartTotal} />

      <main className="max-w-4xl mx-auto w-full p-4 space-y-4 flex-1">
        {/* بانر العرض الحصري الأسبوعي للصالون */}
        <div className="bg-gradient-to-r from-slate-900 to-brand-primary text-white p-5 rounded-2xl shadow-md border-2 border-brand-gold/40 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-brand-gold text-brand-primary text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                عرض الصالونات الحصري 🎁
              </span>
              <span className="text-slate-300 text-xs font-bold">ينتهي خلال 3 أيام</span>
            </div>

            <h2 className="text-base sm:text-lg font-black text-white">
              باكيدج كيراتين الفرد المكثف: 2 عبوة بروتين + سيروم أرجان مجاناً!
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              وفر 480 ج.م لصالونك مع شحن سريع مجاني لباب المشغل.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <MoneyDisplay amount={2630} size="lg" className="text-brand-gold font-mono" />
                <span className="text-xs text-slate-400 line-through">3,110 ج.م</span>
              </div>

              <button
                onClick={addPromoBundle}
                className="bg-brand-gold hover:bg-amber-400 text-brand-primary font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <ShoppingBag size={16} />
                <span>إضافة العرض للطلب بضغطة واحدة</span>
              </button>
            </div>
          </div>
        </div>

        {/* شريط البحث وتصنيفات المنتجات */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
          <div className="relative">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحثي باسم المستحضر، البروتين، أو أجهزة الصالون..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 rounded-xl pr-10 pl-4 py-2.5 text-xs font-bold border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[44px]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap min-h-[38px] transition-colors ${
                activeCategory === 'all'
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع المستحضرات ({mockB2BProducts.length})
            </button>
            <button
              onClick={() => setActiveCategory('protein')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap min-h-[38px] transition-colors ${
                activeCategory === 'protein'
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              فرد وبروتين وكيراتين
            </button>
            <button
              onClick={() => setActiveCategory('care')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap min-h-[38px] transition-colors ${
                activeCategory === 'care'
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              سيروم وعناية وترميم
            </button>
            <button
              onClick={() => setActiveCategory('equipment')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap min-h-[38px] transition-colors ${
                activeCategory === 'equipment'
                  ? 'bg-brand-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              أجهزة ومعدات صالونات
            </button>
          </div>
        </div>

        {/* بطاقات المنتجات بأسعار الجملة الحصرية للصالون */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((product) => {
            const qty = cart[product.id] || 0;
            const savings = product.retailPrice - product.salonPrice;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl p-4 border-2 shadow-sm transition-all flex flex-col justify-between ${
                  qty > 0 ? 'border-brand-primary shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {product.unit}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <TrendingDown size={12} />
                      وفر لصالونك {savings} ج.م
                    </span>
                  </div>

                  <h3 className="font-black text-slate-900 text-sm mt-2 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">
                    {product.warrantyOrOrigin}
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xs font-bold text-slate-400">سعر صالونك:</span>
                    <MoneyDisplay
                      amount={product.salonPrice}
                      size="lg"
                      className="text-brand-primary font-mono"
                    />
                    <span className="text-xs text-slate-400 line-through">
                      {product.retailPrice} ج.م
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-brand-success" />
                    <span>متوفر بالمستودع</span>
                  </span>

                  {qty > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCart(product.id, -1)}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-black text-slate-900 font-mono">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateCart(product.id, 1)}
                        className="w-8 h-8 rounded-lg bg-brand-primary text-white hover:bg-slate-800 flex items-center justify-center font-bold"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-auto px-4 text-xs"
                      onClick={() => updateCart(product.id, 1)}
                      icon={<Plus size={15} />}
                    >
                      أضف للطلب
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* شريط السلة العائم السريع في الأسفل للصالون */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-200 shadow-2xl p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block">
                إجمالي طلبية صالونك ({cartCount} عناصر):
              </span>
              <MoneyDisplay amount={cartTotal} size="xl" className="text-brand-primary" />
            </div>

            <Link href="/b2b/checkout">
              <Button
                variant="gold"
                size="lg"
                className="w-auto px-6 text-sm font-black"
                icon={<ShoppingBag size={18} />}
              >
                تأكيد الطلبية واختيار طريقة الدفع ➡️
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
