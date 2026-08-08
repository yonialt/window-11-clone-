import React from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';

interface TitleBarProps {
  title: string;
  icon?: React.ReactNode;
  isActive: boolean;
  isMaximized: boolean;
  light?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title,
  icon,
  isActive,
  isMaximized,
  light = false,
  onMouseDown,
  onDoubleClick,
  onMinimize,
  onMaximize,
  onClose,
}) => {
  const dark = !light;
  const titleColor = light
    ? isActive ? '#1b1a1aff' : '#6b6b6b'
    : isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.5)';

  const btnBase = light
    ? 'text-gray-600 hover:bg-black/8'
    : 'text-slate-300 hover:bg-white/10';

  return (
    <div
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      className="relative flex items-center justify-between px-3 select-none cursor-default shrink-0"
      style={{
        height: 36,
        background: light
          ? 'rgba(255,255,255,0.72)'
          : 'rgba(35, 35, 38, 0.72)',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        borderBottom: `1px solid ${light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {icon && <span className="shrink-0 flex items-center">{icon}</span>}
        <span
          className="text-xs font-medium truncate"
          style={{ color: titleColor, fontFamily: '"Segoe UI", Inter, sans-serif' }}
        >
          {title}
        </span>
      </div>

      {/* Window controls */}
      <div className="flex items-center shrink-0 -mr-3" style={{ height: 36 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          title="Minimize"
          className={`flex items-center justify-center w-11 h-full transition-colors duration-100 ${btnBase}`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMaximize(); }}
          title={isMaximized ? 'Restore Down' : 'Maximize'}
          className={`flex items-center justify-center w-11 h-full transition-colors duration-100 ${btnBase}`}
        >
          {isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          title="Close"
          className="win11-btn-close flex items-center justify-center w-11 h-full transition-colors duration-100 text-slate-300 hover:bg-[#C42B1C] hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
