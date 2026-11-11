'use client';

import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

const mockOrders: Record<string, {
  id: string;
  orderNumber: string;
  customerName: string;
  address: string;
  addressForMaps: string;
  phone: string;
  area: string;
  items: { name: string; qty: number }[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  notes: string;
}> = {
  'ord-001': {
    id: 'ord-001',
    orderNumber: 'ORD-2026-1001',
    customerName: 'صالون نور الحياة',
    address: 'شارع الهرم، أمام مسجد الرحمة، الجيزة',
    addressForMaps: 'شارع الهرم الجيزة مصر',
    phone: '01012345678',
    area: 'الجيزة',
    items: [
      { name: 'شامبو كيراتين 500ml', qty: 2 },
      { name: 'كريم معالج بالزيوت', qty: 1 },
    ],
    totalAmount: 2800,
    paymentMethod: 'cash_on_delivery',
    status: 'pending',
    notes: 'الاتصال قبل الوصول بـ 15 دقيقة',
  },
  'ord-002': {
    id: 'ord-002',
    orderNumber: 'ORD-2026-1002',
    customerName: 'صالون الملكة',
    address: 'شارع فيصل، برج النيل، الجيزة',
    addressForMaps: 'شارع فيصل الجيزة مصر',
    phone: '01011112222',
    area: 'الجيزة',
    items: [
      { name: 'سيروم الأرغان', qty: 2 },
    ],
    totalAmount: 1500,
    paymentMethod: 'e_wallet',
    status: 'pending',
    notes: '',
  },
  'ord-003': {
    id: 'ord-003',
    orderNumber: 'ORD-2026-0998',
    customerName: 'صالون لمسة جمال',
    address: 'شارع التحرير، الدقي',
    addressForMaps: 'شارع التحرير الدقي الجيزة مصر',
    phone: '01033334444',
    area: 'الدقي',
    items: [
      { name: 'شامبو كيراتين 500ml', qty: 3 },
      { name: 'كريم معالج بالزيوت', qty: 2 },
    ],
    totalAmount: 4200,
    paymentMethod: 'cash_on_delivery',
    status: 'delivered',
    notes: '',
  },
};

type Step = 'detail' | 'confirm' | 'done';

export default function DeliveryDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = (routeParams?.id as string) || '';
  const order = mockOrders[id];

  const [step, setStep] = useState<Step>('detail');
  const [cashCollected, setCashCollected] = useState('');
  const [podConfirmed, setPodConfirmed] = useState(false);
  const [podPhoto, setPodPhoto] = useState<string | null>(null);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-slate-400">الطلب غير موجود</p>
          <button onClick={() => router.back()} className="mt-4 text-amber-400 underline">رجوع</button>
        </div>
      </div>
    );
  }

  const isDelivered = order.status === 'delivered';
  const isCash = order.paymentMethod === 'cash_on_delivery';

  // Google Maps Navigation URL
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.addressForMaps)}&travelmode=driving`;

  // WhatsApp message URL
  const waMessage = encodeURIComponent(
    `السلام عليكم ${order.customerName}،\nأنا السائق من شركة 7Days — وصلت قريباً لتسليم طلبكم رقم ${order.orderNumber}.\nإجمالي الطلب: ${order.totalAmount.toLocaleString('ar-EG')} ج.م\nشكراً 🙏`
  );
  const whatsappUrl = `https://wa.me/2${order.phone}?text=${waMessage}`;

  // Handle POD photo capture
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPodPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-6" dir="rtl">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">تم التسليم بنجاح!</h2>
          <p className="text-slate-400 mb-2">{order.orderNumber}</p>
          <p className="text-slate-400 mb-4">{order.customerName}</p>
          {podPhoto && (
            <div className="mb-4 rounded-2xl overflow-hidden border-2 border-emerald-500/50 w-48 h-36 mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={podPhoto} alt="صورة التسليم" className="w-full h-full object-cover" />
            </div>
          )}
          {isCash && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6">
              <p className="text-emerald-400 font-bold text-lg">
                💵 تم استلام {parseInt(cashCollected || String(order.totalAmount)).toLocaleString('ar-EG')} ج.م
              </p>
            </div>
          )}
          <button
            onClick={() => router.push('/driver/route')}
            className="w-full py-4 rounded-2xl font-bold text-lg text-slate-900"
            style={{ backgroundColor: '#F59E0B' }}
          >
            العودة للجدول
          </button>
        </div>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-slate-900 text-white px-4 py-6" dir="rtl">
        <div className="mb-6">
          <button onClick={() => setStep('detail')} className="text-slate-400 flex items-center gap-2 text-sm mb-4">
            ‹ رجوع
          </button>
          <h1 className="text-xl font-bold text-white">تأكيد التسليم</h1>
          <p className="text-slate-400 text-sm mt-1">{order.customerName}</p>
        </div>

        <div className="space-y-4 pb-32">
          {/* Cash */}
          {isCash && (
            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">💵 استلام الكاش</h3>
              <div className="text-sm text-slate-400 mb-2">
                المبلغ المطلوب: <span className="text-amber-400 font-bold">{order.totalAmount.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <input
                type="number"
                inputMode="numeric"
                value={cashCollected}
                onChange={(e) => setCashCollected(e.target.value)}
                placeholder={String(order.totalAmount)}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-lg font-bold text-center focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {order.paymentMethod === 'e_wallet' && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
              <p className="text-blue-400 font-bold flex items-center gap-2">📱 سيتم التحصيل إلكترونياً</p>
              <p className="text-slate-400 text-sm mt-1">فودافون كاش / انستاباي</p>
            </div>
          )}

          {/* 📸 POD Photo Upload */}
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <span>📸</span> صورة إثبات التسليم (POD)
            </h3>
            {podPhoto ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={podPhoto}
                  alt="صورة التسليم"
                  className="w-full h-40 object-cover rounded-xl border-2 border-emerald-500"
                />
                <button
                  onClick={() => setPodPhoto(null)}
                  className="absolute top-2 left-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
                <div className="mt-2 text-center text-emerald-400 text-sm font-bold">✓ تم رفع الصورة</div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-600 rounded-xl py-8 flex flex-col items-center gap-2 text-slate-400 active:bg-slate-700 transition-colors"
              >
                <span className="text-4xl">📷</span>
                <span className="font-bold">التقط صورة</span>
                <span className="text-xs">صوّر العميل وهو يستلم الطلب</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoCapture}
            />
          </div>

          {/* POD checkbox */}
          <button
            onClick={() => setPodConfirmed(!podConfirmed)}
            className={`w-full rounded-2xl p-4 border-2 flex items-center gap-3 transition-all ${
              podConfirmed
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-600 bg-slate-800'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              podConfirmed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'
            }`}>
              {podConfirmed && <span className="text-white text-sm font-bold">✓</span>}
            </div>
            <span className={`font-bold ${podConfirmed ? 'text-emerald-400' : 'text-slate-300'}`}>
              تأكيد استلام العميل للطلب
            </span>
          </button>

          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 text-sm text-slate-400">
            <p className="flex items-start gap-2">
              <span>⚠️</span>
              <span>بالضغط على "تأكيد التسليم" ستُسجّل العملية في النظام ولا يمكن التراجع عنها.</span>
            </p>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-700">
          <button
            onClick={async () => {
              setLoading(true);
              await new Promise((r) => setTimeout(r, 800));
              setLoading(false);
              setStep('done');
            }}
            disabled={!podConfirmed || (isCash && !cashCollected) || loading}
            className="w-full py-4 rounded-2xl font-bold text-lg text-slate-900 disabled:opacity-40 active:scale-95 transition-all"
            style={{ backgroundColor: '#F59E0B' }}
          >
            {loading ? '⏳ جاري التسجيل...' : '✅ تأكيد التسليم'}
          </button>
        </div>
      </div>
    );
  }

  // ── Main detail view ──
  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-slate-400 text-2xl leading-none">‹</button>
          <div className="flex-1">
            <h1 className="font-bold text-white">{order.customerName}</h1>
            <p className="text-xs text-slate-400 font-mono">{order.orderNumber}</p>
          </div>
          {isDelivered && (
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
              تم التسليم ✓
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-36">
        {/* Address + actions */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <h3 className="text-xs text-slate-400 uppercase tracking-wide mb-2">📍 عنوان التوصيل</h3>
          <p className="text-white font-medium mb-4">{order.address}</p>

          {order.notes && (
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 mb-4">
              <p className="text-amber-300 text-sm">📝 {order.notes}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* 📞 Call */}
            <a
              href={`tel:${order.phone}`}
              className="flex items-center justify-center gap-2 py-3 bg-slate-700 rounded-xl text-white font-bold active:scale-95 transition-transform"
            >
              <span>📞</span>
              <span className="text-sm">اتصال</span>
            </a>

            {/* 💬 WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setWhatsappSent(true)}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold active:scale-95 transition-all ${
                whatsappSent
                  ? 'bg-green-600/30 border border-green-500/50 text-green-400'
                  : 'bg-green-600 text-white'
              }`}
            >
              <span>💬</span>
              <span className="text-sm">{whatsappSent ? 'تم الإرسال ✓' : 'واتساب'}</span>
            </a>
          </div>

          {/* 🗺️ Google Maps */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #1a73e8, #0f5fc8)' }}
          >
            <span className="text-xl">🗺️</span>
            <div className="text-right">
              <div className="text-sm font-bold">ابدأ الملاحة</div>
              <div className="text-xs opacity-80">Google Maps</div>
            </div>
            <span className="mr-auto text-xl">›</span>
          </a>
        </div>

        {/* Items */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <h3 className="text-xs text-slate-400 uppercase tracking-wide mb-3">📦 المنتجات</h3>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-white">{item.name}</span>
                <span className="text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full text-sm">
                  × {item.qty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          <h3 className="text-xs text-slate-400 uppercase tracking-wide mb-3">💳 الدفع</h3>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">
              {order.paymentMethod === 'cash_on_delivery' ? '💵 كاش عند التسليم' : '📱 محفظة إلكترونية'}
            </span>
            <span className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
              {order.totalAmount.toLocaleString('ar-EG')} ج.م
            </span>
          </div>
        </div>

        {/* WhatsApp preview */}
        {!whatsappSent && (
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <h3 className="text-xs text-slate-400 uppercase tracking-wide mb-3">💬 رسالة واتساب جاهزة</h3>
            <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-3 text-sm text-slate-300 leading-relaxed">
              السلام عليكم {order.customerName}،<br />
              أنا السائق من شركة 7Days — وصلت قريباً لتسليم طلبكم رقم {order.orderNumber}.<br />
              إجمالي الطلب: {order.totalAmount.toLocaleString('ar-EG')} ج.م 🙏
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setWhatsappSent(true)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3 bg-green-600 rounded-xl font-bold text-white active:scale-95 transition-transform"
            >
              <span>💬</span> إرسال على واتساب
            </a>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {!isDelivered && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-700">
          <button
            onClick={() => setStep('confirm')}
            className="w-full py-4 rounded-2xl font-bold text-lg text-slate-900 active:scale-95 transition-transform shadow-lg"
            style={{ backgroundColor: '#F59E0B' }}
          >
            🏁 تأكيد التسليم
          </button>
        </div>
      )}
    </div>
  );
}
