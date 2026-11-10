'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Heart,
  Share2,
  Clock,
  Droplets,
} from 'lucide-react';
import { ShopHeader } from '@/components/ui/ShopHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';

export default function ShopProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id || 'prod-1';

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'how_to_use' | 'ingredients' | 'guarantee'>('how_to_use');

  const product = {
    id: productId,
    name: 'سيروم الأرغان المغربي المركز لإصلاح الشعر وحمايته من الحرارة 100 مل',
    brand: '7Days Professional Care',
    price: 220,
    originalPrice: 280,
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    volume: 'عبوة 100 مل زجاجية بمضخة دقيقة',
    deliveryTime: 'التوصيل خلال 24 - 48 ساعة لباب المنزل',
  };

  const handleQuickBuy = () => {
    router.push(`/shop/checkout?direct=true&qty=${quantity}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28">
      <ShopHeader cartCount={1} cartTotal={220} />

      <main className="max-w-4xl mx-auto w-full p-4 space-y-4 flex-1">
        {/* زر الرجوع للمتجر */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900"
        >
          <ArrowRight size={16} />
          <span>العودة لجميع مستحضرات المتجر</span>
        </Link>

        {/* بطاقة المنتج وصورته التفاعلية */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* معرض الصور التفاعلي */}
            <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-100 flex flex-col items-center justify-center min-h-[280px] text-center relative">
              <span className="absolute top-3 right-3 bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                الأصلي معتمد 100% 🛡️
              </span>

              <div className="w-24 h-24 rounded-full bg-brand-gold/20 text-brand-primary flex items-center justify-center text-4xl shadow-inner mb-3">
                🧴
              </div>

              <h4 className="font-black text-slate-800 text-sm">{product.name}</h4>
              <span className="text-xs text-slate-400 font-bold mt-1">{product.volume}</span>
            </div>

            {/* تفاصيل الأسعار والشراء */}
            <div className="space-y-3">
              <span className="text-xs font-black text-brand-gold">{product.brand}</span>
              <h1 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* التقييم */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <span className="font-mono font-black text-sm text-slate-900">{product.rating}</span>
                <span className="text-xs text-slate-400 font-bold">
                  (بناءً على {product.reviewsCount} تجربة موثقة)
                </span>
              </div>

              {/* السعر */}
              <div className="py-2 flex items-baseline gap-3">
                <MoneyDisplay
                  amount={product.price}
                  size="xl"
                  className="text-brand-primary font-mono"
                />
                <span className="text-sm text-slate-400 line-through">
                  {product.originalPrice} ج.م
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2 py-0.5 rounded-md">
                  وفر 60 ج.م
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <CheckCircle2 size={16} className="text-brand-success" />
                <span>متوفر بالمستودع للشحن الفوري (خلال 24 إلى 48 ساعة)</span>
              </div>

              {/* أزرار الشراء الفوري والسلة */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={handleQuickBuy}
                  icon={<ShoppingBag size={20} />}
                  className="flex-1 font-black"
                >
                  شراء فوري بضغطة واحدة (COD) ⚡
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/shop/checkout')}
                  className="sm:w-auto px-6 text-xs"
                >
                  أضف للسلة
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* دليل الاستخدام والمكونات وضمان الجودة */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex gap-2 border-b border-slate-100 pb-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('how_to_use')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeTab === 'how_to_use'
                  ? 'bg-slate-900 text-white font-black'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              طريقة الاستخدام الصحيحة 🧴
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeTab === 'ingredients'
                  ? 'bg-slate-900 text-white font-black'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              المكونات الفعالة 🌿
            </button>
            <button
              onClick={() => setActiveTab('guarantee')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                activeTab === 'guarantee'
                  ? 'bg-slate-900 text-white font-black'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              ضمان الأصالة والتوريد 🛡️
            </button>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed font-medium space-y-2">
            {activeTab === 'how_to_use' && (
              <div className="space-y-2">
                <p>1. ضعي من 2 إلى 3 قطرات على راحة اليد وافركيها بلطف لتوزيع الحرارة.</p>
                <p>2. وزعي السيروم بالتساوي على أطراف الشعر المبلل بعد غسله أو قبل استخدام السشوار والمكواة.</p>
                <p>3. يعطي لمعاناً فورياً وحماية قصوى من حرارة حتى 230 درجة مئوية.</p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-2">
                <p>• زيت الأرغان المغربي النقي 100% المعصور على البارد غني بأوميغا 6 و 9.</p>
                <p>• فيتامين E المركز لتقوية ألياف الشعر ومقاومة التقصف.</p>
                <p>• خالٍ تماماً من السيليكونات الثقيلة، السلفات، والبارابين الضار.</p>
              </div>
            )}

            {activeTab === 'guarantee' && (
              <div className="space-y-2">
                <p>• مستحضر أصلي 100% مستورد ومخزن بدرجات حرارة معتمدة بالمستودع المركزي.</p>
                <p>• يحق لك فحص العبوة والباركود أمام مندوب الشحن قبل سداد القيمة.</p>
                <p>• ضمان استرجاع أو استبدال فوري في حالة وجود أي عيب في التعبئة.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
