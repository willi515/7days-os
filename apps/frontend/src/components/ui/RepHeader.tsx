'use client';

import React from 'react';
import { ArrowRight, Wifi, WifiOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RepHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const RepHeader: React.FC<RepHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-primary text-white px-4 py-3 shadow-md flex items-center justify-between min-h-[58px]">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -mr-2 text-slate-300 hover:text-white rounded-lg active:bg-slate-800 min-h-touch-target min-w-touch-target flex items-center justify-center"
            aria-label="رجوع"
          >
            <ArrowRight size={22} />
          </button>
        )}
        <div>
          <h1 className="text-base font-extrabold text-white leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-brand-gold font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {rightAction ? (
          rightAction
        ) : (
          <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <Wifi size={14} />
            <span>متصل</span>
          </div>
        )}
      </div>
    </header>
  );
};
