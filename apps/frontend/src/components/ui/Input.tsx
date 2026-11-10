'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  type = 'text',
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full text-right mb-4">
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute right-3.5 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={effectiveType}
          className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-slate-900 font-medium placeholder-slate-400 transition-colors focus:outline-none min-h-touch-target ${
            icon ? 'pr-11' : ''
          } ${isPassword ? 'pl-11' : ''} ${
            error
              ? 'border-brand-danger focus:border-brand-danger bg-red-50/20'
              : 'border-slate-200 focus:border-brand-primary'
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 text-slate-400 hover:text-slate-600 focus:outline-none p-2 min-h-[36px]"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-bold text-brand-danger">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
