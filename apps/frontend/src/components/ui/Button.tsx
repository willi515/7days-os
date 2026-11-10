import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'success' | 'danger' | 'outline' | 'gps';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 active:scale-[0.98] min-h-touch-target shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-slate-800 active:bg-slate-900',
    gold: 'bg-brand-gold text-brand-primary hover:bg-amber-400 active:bg-amber-500 font-extrabold',
    success: 'bg-brand-success text-white hover:bg-emerald-600 active:bg-emerald-700',
    danger: 'bg-brand-danger text-white hover:bg-red-600 active:bg-red-700',
    outline: 'border-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50',
    gps: 'bg-brand-gps text-white hover:bg-blue-700 active:bg-blue-800',
  };

  const sizes = {
    sm: 'text-sm py-2 px-3 min-h-[44px]',
    md: 'text-base py-3 px-5 min-h-[50px]',
    lg: 'text-lg py-4 px-6 min-h-[56px]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent mr-2" />
      ) : icon ? (
        <span className="ml-2 inline-flex items-center">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
