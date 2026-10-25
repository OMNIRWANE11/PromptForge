import React from 'react';

/**
 * Professional PromptForge Brand Logo
 * - Displays the official recolored Royal Blue + Slate theme
 * - Features the AI Monitor with 'PF' monogram & Microchip Optimization Engine
 * - Can render in 'icon', 'horizontal' (icon + text), or 'badge' mode
 */
export default function PromptForgeLogo({
  size = 'md',
  variant = 'horizontal', // 'icon' | 'horizontal' | 'badge'
  showTagline = false,
  className = '',
  onClick
}) {
  // Dimension mapping
  const sizeMap = {
    xs: { icon: 22, text: 'text-sm', badge: 32 },
    sm: { icon: 28, text: 'text-base', badge: 44 },
    md: { icon: 36, text: 'text-lg', badge: 60 },
    lg: { icon: 48, text: 'text-2xl', badge: 80 },
    xl: { icon: 64, text: 'text-3xl', badge: 108 },
    '2xl': { icon: 84, text: 'text-4xl', badge: 140 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const iconPixel = typeof size === 'number' ? size : currentSize.icon;
  const badgePixel = typeof size === 'number' ? size : currentSize.badge;

  // Icon Only Mode (Clean Circular Badge with Monitor & Optimization Core)
  const renderIcon = () => (
    <div 
      style={{ width: `${iconPixel}px`, height: `${iconPixel}px` }} 
      className="relative shrink-0 rounded-full select-none shadow-sm shadow-blue-500/20 ring-1 ring-blue-500/30 overflow-hidden bg-slate-900"
    >
      <img
        src="/logo.png"
        alt="PromptForge Emblem"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to SVG if PNG is loading
          e.currentTarget.src = '/logo.svg';
        }}
      />
    </div>
  );

  // Full Circular Badge (e.g., for AuthScreen or prominent hero section)
  if (variant === 'badge') {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`} onClick={onClick}>
        <div 
          style={{ width: `${badgePixel}px`, height: `${badgePixel}px` }}
          className="relative shrink-0 rounded-full shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/40 hover:ring-blue-500 transition-all cursor-pointer bg-slate-900 overflow-hidden"
        >
          <img
            src="/logo.png"
            alt="PromptForge Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = '/logo.svg';
            }}
          />
        </div>
        {showTagline && (
          <div className="mt-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black tracking-tight font-sans">
              <span className="text-blue-600">PROMPT</span>
              <span className="text-slate-900">FORGE</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-[0.25em] uppercase font-mono mt-0.5">
              OPTIMIZE • MINIMIZE • MAXIMIZE
            </div>
          </div>
        )}
      </div>
    );
  }

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} onClick={onClick}>
        {renderIcon()}
      </div>
    );
  }

  // Default Horizontal Mode: Icon + "PROMPT FORGE" Typography
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`} onClick={onClick}>
      {renderIcon()}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-black tracking-tight font-sans flex items-center ${currentSize.text}`}>
          <span className="text-blue-600">Prompt</span>
          <span className="text-slate-900">Forge</span>
        </div>
        {showTagline && (
          <span className="text-[9px] font-bold text-slate-500 tracking-[0.2em] uppercase font-mono mt-0.5">
            OPTIMIZE • MINIMIZE
          </span>
        )}
      </div>
    </div>
  );
}

