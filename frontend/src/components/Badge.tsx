import React from 'react';

interface BadgeProps {
  count?: number | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ count, className = '' }) => {
  if (count === undefined || count === null || count === '') return null;

  return (
    <span
      className={`absolute -bottom-1 -right-1 min-w-[20px] h-[20px] px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full bg-white text-amber-300 border border-amber-400/60 shadow-lg select-none z-10 ${className}`}
    >
      {count}
    </span>
  );
};
