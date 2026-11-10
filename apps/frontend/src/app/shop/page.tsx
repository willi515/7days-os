'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Star,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Heart,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { ShopHeader } from '@/components/ui/ShopHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

interface RetailProduct {
  id: string;
  name: string;
  category: 'hair' | 'skin' | 'equipment';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  tag?: string;
  unit: string;
  inStock: boolean;
}

const mockRetailProducts: RetailProduct[] = [
  {
    id: 'prod-1',
    name: 'سيروم الأرغان المغربي المركز لإصلاح الشعر وحمايته من الحرارة 100 مل',
    category: 'hair',
    price: 220,
    originalPrice: 280,
    rating: 4.9,
    reviewsCount: 142,
    tag: 'الأكثر مبيعاً 🔥',
    unit: 'عبوة 100 مل',
    inStock: true,
  },
  {
    id: 'prod-2',
    name: 'شامبو الكيراتين البرازيلي المغذي والخالي من السلفات 500 مل',
    category: 'hair',
    price: 160,
    originalPrice: 200,
    rating: 4.8,
    reviewsCount: 89,
    tag: 'خالٍ من السلفات 🌿',
    unit: 'عبوة 500 مل',
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'حمام كريم كولاجين وزبدة الشيا للترميم العميق 500 مل',
    category: 'hair',
    price: 200,
    originalPrice: 250,
    rating: 4.7,
    reviewsCount: 65,
    unit: 'عبوة 500 مل',
    inStock: true,
  },
  {
    id: 'prod-4',
    name: 'سشوار صالونات تورنادو 2500 وات الإيطالي الاحترافي',
    category: 'equipment',
    price: 1450,
    originalPrice: 1750,
    rating: 5.0,
    reviewsCount: 54,
    tag: 'ضمان سنة معتمد 🛡️',
    unit: 'جهاز أصلي',
    inStock: true,
  },
  {
    id: 'prod-5',
    name: 'مكواة شعر سيراميك نانو تيتانيوم بيبي ليس برو للشعر الإفريقي',
    category: 'equipment',
    price: 1950,
    originalPrice: 2300,
    rating: 4.9,
    reviewsCount: 78,
    tag: 'ضمان 24 شهراً ⚙️',
    unit: 'جهاز أصلي',
    inStock: true,
  },
];

export default function ShopStorefrontPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'hair' | 'skin' | 'equipment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({ 'prod-1': 1, 'prod-2': 1 });

  const updateCart = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const addFeaturedBundle = () => {
    setCart((prev) => ({
      ...prev,
      'prod-1': (prev['prod-1'] || 0) + 1,
      'prod-2': (prev['prod-2'] || 0) + 1,
      'prod-3': (prev['prod-3'] || 0) + 1,
    }));
  };

  const filtered = mockRetailProducts.filter((p) => {
    const matchesSearch = p.name.includes(searchQuery);
    if (!matchesSearch) return false;
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    return true;
  });

  let cartTotal = 0;
  let cartCount = 0;
  Object.entries(cart).forEach(([id, qty]) => {
    const item = mockRetailProducts.find((p) => p.id === id);
    if (item) {
      cartTotal += item.price * qty;
      cartCount += qty;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28">
      <ShopHeader cartCount={cartCount} cartTotal={cartTotal} />

      <main className="max-w-5xl mx-auto w-full p-4 space-y-5 flex-1">
        {/* بانر العرض الحصري المخفض */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-primary to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="bg-brand-gold text-brand-primary text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
              تخفيضات نهاية الأسبوع 🌟
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
              بكج العناية بالشعر التالف المتكامل (شامبو + حمام كريم + سيروم أرغان)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              علاج وتقوية ألياف الشعر المعالج بالكيراتين والصبغات بخصم فوري 20% مع شحن مجاني لكافة المحافظات!
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <MoneyDisplay amount={490} size="xl" className="text-brand-gold font-mono" />
                <span className="text-xs text-slate-400 line-through">620 ج.م</span>
              </div>

              <Button
                variant="gold"
                size="md"
                onClick={addFeaturedBundle}
                className="w-auto px-5 text-xs font-black shadow-md"
                icon={<ShoppingBag size={16} />}
              >
                اشتري البكج الآن بخصم 20%
              </Button>
            </div>
          </div>
        </div>

        {/* شريط البحث وتصنيفات الأقسام */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
          <div className="relative">
            <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحثي عن شامبو، سيروم، بروتين، أو سشوار..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 rounded-xl pr-10 pl-4 py-2.5 text-xs font-bold border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[44px]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors min-h-[38px] ${
                activeCategory === 'all'
                  ? 'bg-brand-primary text-white font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع المنتجات ({mockRetailProducts.length})
            </button>
            <button
              onClick={() => setActiveCategory('hair')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors min-h-[38px] ${
                activeCategory === 'hair'
                  ? 'bg-brand-primary text-white font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              مستحضرات العناية بالشعر 💆‍♀️
            </button>
            <button
              onClick={() => setActiveCategory('equipment')}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors min-h-[38px] ${
                activeCategory === 'equipment'
                  ? 'bg-brand-primary text-white font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              أجهزة وسشوار ومكواة ⚙️
            </button>
          </div>
        </div>

        {/* شبكة المنتجات (Product Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prod) => {
            const qty = cart[prod.id] || 0;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-brand-primary shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* شارة التقييم والمميزات */}
                  <div className="flex justify-between items-center text-xs">
                    {prod.tag ? (
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 font-black text-[10px] px-2 py-0.5 rounded-full">
                        {prod.tag}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">{prod.unit}</span>
                    )}

                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star size={13} className="fill-amber-400 stroke-amber-400" />
                      <span className="text-slate-800 font-mono font-black">{prod.rating}</span>
                      <span className="text-slate-400 text-[10px]">({prod.reviewsCount})</span>
                    </div>
                  </div>

                  {/* اسم المنتج ورابط التفاصيل */}
                  <Link href={`/shop/product/${prod.id}`}>
                    <h3 className="font-black text-slate-900 text-sm mt-3 leading-snug hover:text-brand-primary transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                  </Link>

                  <div className="mt-3 flex items-baseline gap-2">
                    <MoneyDisplay
                      amount={prod.price}
                      size="lg"
                      className="text-brand-primary font-mono"
                    />
                    {prod.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {prod.originalPrice} ج.م
                      </span>
                    )}
                  </div>
                </div>

                {/* أزرار التحكم بالسلة والتفاصيل */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/shop/product/${prod.id}`}
                    className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
                    title="دليل الاستخدام والمكونات"
                  >
                    <Eye size={18} />
                  </Link>

                  {qty > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCart(prod.id, -1)}
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 flex items-center justify-center font-bold"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-black text-slate-900 font-mono">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateCart(prod.id, 1)}
                        className="w-8 h-8 rounded-lg bg-brand-primary text-white hover:bg-slate-800 flex items-center justify-center font-bold"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs w-auto px-4"
                      onClick={() => updateCart(prod.id, 1)}
                      icon={<Plus size={15} />}
                    >
                      أضف للسلة
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* شريط السلة العائم السريع */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-slate-200 shadow-2xl p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 block">
                محتويات سلتك ({cartCount} منتجات):
              </span>
              <MoneyDisplay amount={cartTotal} size="xl" className="text-brand-primary" />
            </div>

            <Link href="/shop/checkout">
              <Button
                variant="gold"
                size="lg"
                className="w-auto px-6 text-sm font-black"
                icon={<ShoppingBag size={18} />}
              >
                إتمام الطلب والدفع عند الاستلام 🚚
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
