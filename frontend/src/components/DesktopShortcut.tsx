import React from 'react';
import { motion } from 'motion/react';
import { DesktopShortcutDef } from '../config/desktopShortcuts';

interface DesktopShortcutProps {
  shortcut: DesktopShortcutDef;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const DesktopShortcut: React.FC<DesktopShortcutProps> = ({
  shortcut,
  isSelected,
  onSelect,
  onOpen,
  size = 'medium',
}) => {
  const containerSize = size === 'large' ? 60 : size === 'small' ? 44 : 52;
  const wrapperWidth = size === 'large' ? 96 : size === 'small' ? 72 : 80;

  return (
    <motion.div
      id={`desktop-shortcut-${shortcut.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
        onOpen();
      }}
      className="relative flex flex-col items-center justify-start cursor-pointer select-none"
      style={{ width: wrapperWidth, paddingTop: 6, paddingBottom: 4 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        style={{
          width: containerSize,
          height: containerSize,
          borderRadius: 6,
          background: isSelected ? 'rgba(0, 120, 212, 0.25)' : 'transparent',
          boxShadow: isSelected
            ? '0 0 0 1px rgba(0,120,212,0.6), 0 4px 16px rgba(0,120,212,0.3)'
            : undefined,
        }}
        animate={{ background: isSelected ? 'rgba(0, 120, 212, 0.25)' : 'rgba(0,0,0,0)' }}
        transition={{ duration: 0.12 }}
      >
        <div className="w-9 h-9 flex items-center justify-center drop-shadow-lg">{shortcut.icon}</div>
      </motion.div>

      <div
        className="mt-1 text-center text-white leading-tight"
        style={{
          fontSize: 11,
          fontFamily: '"Segoe UI", Inter, system-ui, sans-serif',
          fontWeight: isSelected ? 600 : 400,
          maxWidth: wrapperWidth - 4,
          wordBreak: 'break-word',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          textShadow: '0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)',
          background: isSelected ? 'rgba(0,78,152,0.85)' : 'transparent',
          padding: isSelected ? '0 3px 1px' : undefined,
          borderRadius: isSelected ? 2 : undefined,
        }}
      >
        {shortcut.label}
      </div>
    </motion.div>
  );
};
