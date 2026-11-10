import React from 'react';

export type StatusType =
  | 'committed'   // ملتزم (أخضر)
  | 'warning'     // مديونية تقترب (كهرماني)
  | 'overdue'     // متأخر / محظور (أحمر)
  | 'cash_only'   // نقدي فقط (أزرق داكن)
  | 'pending'     // قيد الانتظار
  | 'delivered'   // تم التسليم
  | 'in_transit'; // في الطريق

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const configs: Record<StatusType, { bg: string; text: string; defaultLabel: string; dot: string }> = {
    committed: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-700',
      defaultLabel: 'ملتزم بالسداد ✅',
      dot: 'bg-brand-success',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      defaultLabel: 'قريب من الحد الائتماني ⚠️',
      dot: 'bg-brand-warning',
    },
    overdue: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      defaultLabel: 'متأخر في السداد ⛔',
      dot: 'bg-brand-danger',
    },
    cash_only: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      defaultLabel: 'معاملات نقدية فقط 💵',
      dot: 'bg-brand-gps',
    },
    pending: {
      bg: 'bg-slate-100 border-slate-200',
      text: 'text-slate-700',
      defaultLabel: 'قيد المراجعة',
      dot: 'bg-slate-400',
    },
    delivered: {
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-700',
      defaultLabel: 'تم التسليم بالكامل',
      dot: 'bg-brand-success',
    },
    in_transit: {
      bg: 'bg-indigo-50 border-indigo-200',
      text: 'text-indigo-700',
      defaultLabel: 'مع المندوب للتسليم',
      dot: 'bg-indigo-500',
    },
  };

  const config = configs[status] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full border ${config.bg} ${config.text} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
