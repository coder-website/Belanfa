import React from 'react';

interface BelanfaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color';
  showSubtitle?: boolean;
}

export const BelanfaLogo: React.FC<BelanfaLogoProps> = ({
  size = 'md',
  variant = 'color',
  showSubtitle = true,
}) => {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8 text-xs', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-11 h-11 text-sm', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14 text-base', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20 text-xl', text: 'text-3xl', sub: 'text-sm' },
  }[size];

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Authentic Geometric Emblem */}
      <div 
        className={`relative ${sizeClasses.icon} shrink-0 rounded-2xl flex items-center justify-center font-serif font-black shadow-md border transition-transform group-hover:scale-105 ${
          variant === 'dark'
            ? 'bg-stone-900 border-amber-500/40 text-amber-400'
            : 'bg-gradient-to-br from-amber-700 via-stone-900 to-amber-950 border-amber-500/30 text-amber-300'
        }`}
      >
        {/* Moroccan Octagonal / Star Geometry Motif */}
        <div className="absolute inset-1 border border-amber-400/40 rounded-xl pointer-events-none rotate-45 scale-80 opacity-60"></div>
        <div className="relative z-10 flex flex-col items-center justify-center leading-none">
          <span className="font-serif tracking-tighter text-amber-300">B</span>
          <span className="w-2.5 h-0.5 bg-amber-400 rounded-full mt-0.5"></span>
        </div>
      </div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center gap-2">
          <span 
            className={`font-serif font-black tracking-wider ${sizeClasses.text} ${
              variant === 'light' ? 'text-white' : 'text-stone-900'
            }`}
          >
            BELANFA
          </span>
          <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            CASA
          </span>
        </div>
        {showSubtitle && (
          <p className={`${sizeClasses.sub} text-stone-500 uppercase tracking-widest font-medium`}>
            Grillades · Feu de Bois · Terrasse
          </p>
        )}
      </div>
    </div>
  );
};
