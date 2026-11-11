'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const mockDeliveries = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2026-1001',
    customerName: 'صالون نور الحياة',
    address: 'شارع الهرم، الجيزة',
    area: 'الجيزة',
    phone: '01012345678',
    items: 3,
    totalAmount: 2800,
    paymentMethod: 'cash_on_delivery',
    status: 'pending',
    priority: 1,
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2026-1002',
    customerName: 'صالون الملكة',
    address: 'شارع فيصل، الجيزة',
    area: 'الجيزة',
    phone: '01011112222',
    items: 2,
    totalAmount: 1500,
    paymentMethod: 'e_wallet',
    status: 'pending',
    priority: 2,
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2026-0998',
    customerName: 'صالون لمسة جمال',
    address: 'شارع التحرير، الدقي',
    area: 'الدقي',
    phone: '01033334444',
    items: 5,
    totalAmount: 4200,
    paymentMethod: 'cash_on_delivery',
    status: 'delivered',
    priority: 3,
  },
];

const statusLabel: Record<string, { text: string; color: string; bg: string }> = {
  pending: { text: 'في الانتظار', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  in_transit: { text: 'جاري التوصيل', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
  delivered: { text: 'تم التسليم ✓', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
};

const paymentLabel: Record<string, { text: string; icon: string }> = {
  cash_on_delivery: { text: 'كاش عند التسليم', icon: '💵' },
  e_wallet: { text: 'محفظة إلكترونية', icon: '📱' },
  credit_terms: { text: 'آجل', icon: '📋' },
};

export default function DriverRoutePage() {
  const router = useRouter();
  const [deliveries] = useState(mockDeliveries);
  const [driverName, setDriverName] = useState('كابتن ياسر الجمل');

  useEffect(() => {
    // Check session
    const session = sessionStorage.getItem('driver_session');
    if (!session) {
      router.replace('/driver/login');
      return;
    }
    try {
      const parsed = JSON.parse(session);
      setDriverName(parsed.name || 'كابتن ياسر الجمل');
    } catch {}
  }, [router]);

  const pending = deliveries.filter((d) => d.status !== 'delivered');
  const done = deliveries.filter((d) => d.status === 'delivered');
  const totalCash = deliveries
    .filter((d) => d.status === 'delivered' && d.paymentMethod === 'cash_on_delivery')
    .reduce((s, d) => s + d.totalAmount, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white" dir="rtl">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gold-400" style={{ color: '#F59E0B' }}>🚗 جدول التوصيل</h1>
            <p className="text-sm text-slate-400">{ driverName } — {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="text-center bg-slate-700 rounded-xl px-3 py-2">
            <div className="text-xl font-bold" style={{ color: '#F59E0B' }}>{done.length}/{deliveries.length}</div>
            <div className="text-xs text-slate-400">تسليمات</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 bg-slate-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${(done.length / deliveries.length) * 100}%`, backgroundColor: '#F59E0B' }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-2xl font-bold text-amber-400">{pending.length}</div>
          <div className="text-xs text-slate-400 mt-1">متبقية</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-2xl font-bold text-emerald-400">{done.length}</div>
          <div className="text-xs text-slate-400 mt-1">تم تسليمها</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-lg font-bold text-blue-400">{totalCash.toLocaleString('ar-EG')}</div>
          <div className="text-xs text-slate-400 mt-1">كاش محصّل</div>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="px-4 pb-24">
        {pending.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">📦 طلبات اليوم</h2>
            <div className="space-y-3">
              {pending.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} onClick={() => router.push(`/driver/delivery/${delivery.id}`)} />
              ))}
            </div>
          </>
        )}

        {done.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-slate-400 mb-3 mt-6 uppercase tracking-wide">✅ تم التسليم</h2>
            <div className="space-y-3 opacity-70">
              {done.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} onClick={() => router.push(`/driver/delivery/${delivery.id}`)} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-700">
        <button
          onClick={() => router.push('/driver/collection')}
          className="w-full py-4 rounded-2xl font-bold text-lg text-slate-900 shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: '#F59E0B' }}
        >
          💰 تأكيد التحصيل اليومي
        </button>
      </div>
    </div>
  );
}

function DeliveryCard({ delivery, onClick }: { delivery: typeof mockDeliveries[0]; onClick: () => void }) {
  const st = statusLabel[delivery.status];
  const pm = paymentLabel[delivery.paymentMethod];

  return (
    <button
      onClick={onClick}
      className="w-full bg-slate-800 rounded-2xl p-4 border border-slate-700 text-right active:scale-95 transition-transform"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-500">{delivery.orderNumber}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${st.bg} ${st.color}`}>
              {st.text}
            </span>
          </div>
          <h3 className="font-bold text-white text-base">{delivery.customerName}</h3>
          <p className="text-sm text-slate-400 mt-0.5">📍 {delivery.address}</p>
        </div>
        <div className="text-left">
          <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>
            {delivery.totalAmount.toLocaleString('ar-EG')}
          </div>
          <div className="text-xs text-slate-400">ج.م</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
        <div className="flex items-center gap-1 text-sm text-slate-400">
          <span>{pm.icon}</span>
          <span>{pm.text}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span>📦 {delivery.items} منتجات</span>
          <span>›</span>
        </div>
      </div>
    </button>
  );
}
