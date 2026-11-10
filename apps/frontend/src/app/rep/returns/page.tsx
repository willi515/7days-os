'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RotateCcw,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Package,
  FileCheck,
} from 'lucide-react';
import { RepHeader } from '@/components/ui/RepHeader';
import { MoneyDisplay } from '@/components/ui/MoneyDisplay';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RepReturnsPage() {
  const router = useRouter();

  const [salonName, setSalonName] = useState('بيوتي سنتر الملكة (مدام سوزان)');
  const [selectedProduct, setSelectedProduct] = useState('شامبو كيراتين برازيلي 1000 مل');
  const [quantity, setQuantity] = useState('2');
  const [returnReason, setReturnReason] = useState<'damaged' | 'expired' | 'device_fault' | 'exchange'>('damaged');
  const [unitPrice, setUnitPrice] = useState(200);
  const [serialOrBatch, setSerialOrBatch] = useState('BATCH-2026-08');
  const [notes, setNotes] = useState('عبوة مسربة أثناء النقل');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const numQty = parseInt(quantity || '0', 10);
  const totalRefund = numQty * unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-28">
      <RepHeader
        title="تسجيل مرتجع وتوالف"
        subtitle="إصدار إشعار خصم (Credit Note)"
        showBack
      />

      <div className="p-4 space-y-4">
        {isSubmitted ? (
          <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 text-center shadow-md space-y-4 my-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              تم تسجيل إشعار المرتجع بنجاح!
            </h3>
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              رقم الإشعار: <span className="font-mono text-brand-primary font-black">CRN-504</span>
              <br />
              تم إرسال الطلب لإدارة المستودع لاعتماده، وسيتم خصم{' '}
              <span className="text-brand-success font-black">{totalRefund.toLocaleString('ar-EG')} ج.م</span> من مديونية الصالون فور الفحص.
            </p>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/rep/route')}
              >
                العودة لخط السير
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* اختيار الصالون */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <label className="block text-xs font-bold text-slate-500 mb-1.5">
                الصالون المرتجع منه:
              </label>
              <input
                type="text"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                className="w-full bg-slate-50 rounded-xl px-4 py-3 font-bold text-slate-900 border border-slate-200 text-sm min-h-[48px]"
                required
              />
            </div>

            {/* سبب الإرجاع */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                سبب الإرجاع:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setReturnReason('damaged')}
                  className={`p-3 rounded-xl border-2 transition-all min-h-[48px] ${
                    returnReason === 'damaged'
                      ? 'border-brand-danger bg-red-50 text-red-700'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  تالف أثناء الشحن / عيب تعبئة 💥
                </button>
                <button
                  type="button"
                  onClick={() => setReturnReason('expired')}
                  className={`p-3 rounded-xl border-2 transition-all min-h-[48px] ${
                    returnReason === 'expired'
                      ? 'border-brand-warning bg-amber-50 text-amber-800'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  قريب من انتهاء الصلاحية ⏳
                </button>
                <button
                  type="button"
                  onClick={() => setReturnReason('device_fault')}
                  className={`p-3 rounded-xl border-2 transition-all min-h-[48px] ${
                    returnReason === 'device_fault'
                      ? 'border-brand-gps bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  عطل فني بجهاز (ضمان) ⚙️
                </button>
                <button
                  type="button"
                  onClick={() => setReturnReason('exchange')}
                  className={`p-3 rounded-xl border-2 transition-all min-h-[48px] ${
                    returnReason === 'exchange'
                      ? 'border-brand-primary bg-slate-900 text-white'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  رغبة الصالون في التبديل 🔄
                </button>
              </div>
            </div>

            {/* بيانات الصنف المرتجع والكمية */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <Input
                label="اسم الصنف المرتجع:"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="الكمية المرتجعة:"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="font-mono text-center font-bold"
                  required
                />
                <Input
                  label="رقم التشغيلة / سيريال الجهاز:"
                  value={serialOrBatch}
                  onChange={(e) => setSerialOrBatch(e.target.value)}
                  className="font-mono text-center font-bold"
                  required
                />
              </div>

              {/* تصوير المرتجع بالكاميرا */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  توثيق صورة المنتج والباركود / العيب (إلزامي):
                </label>
                <button
                  type="button"
                  onClick={() => setHasPhoto(!hasPhoto)}
                  className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 transition-all min-h-[80px] ${
                    hasPhoto
                      ? 'border-brand-success bg-emerald-50 text-emerald-800'
                      : 'border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Camera size={24} className={hasPhoto ? 'text-brand-success' : 'text-slate-400'} />
                  <span className="text-xs font-bold">
                    {hasPhoto ? '✅ تم التقاط وتأكيد صورة المرتجع' : 'اضغط لفتح الكاميرا والتقاط صورة'}
                  </span>
                </button>
              </div>

              <Input
                label="ملاحظات المندوب الميدانية:"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="تفاصيل العيب أو حالة التغليف..."
              />
            </div>

            {/* بطاقة الخصم المحسوب */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-300 block">
                  إجمالي قيمة الخصم من مديونية الصالون:
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {numQty} قطع × {unitPrice} ج.م
                </span>
              </div>
              <MoneyDisplay amount={totalRefund} size="xl" className="text-brand-gold" />
            </div>

            {/* زر الحفظ والرفع */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              icon={<RotateCcw size={20} />}
            >
              تسجيل ورفع إشعار المرتجع
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
