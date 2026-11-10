import React from 'react';

interface MoneyDisplayProps {
  amount: number | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  colored?: boolean;
  isDebt?: boolean;
  className?: string;
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount,
  size = 'md',
  colored = false,
  isDebt = false,
  className = '',
}) => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount || '0');
  const formatted = new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(numericAmount));

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl sm:text-3xl font-black',
  };

  const colorClass = colored
    ? isDebt || numericAmount < 0
      ? 'text-brand-danger'
      : 'text-brand-success'
    : 'text-brand-primary';

  return (
    <span className={`inline-flex items-baseline gap-1 ${sizeClasses[size]} ${colorClass} ${className}`}>
      <span>{formatted}</span>
      <span className="text-xs font-bold text-slate-500">ج.م</span>
    </span>
  );
};
