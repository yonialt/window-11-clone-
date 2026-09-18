import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppWindow, Monitor } from 'lucide-react';
import { WindowItem } from '../types';

interface TaskViewProps {
  isOpen: boolean;
  windows: WindowItem[];
  activeWindowId: string | null;
  onClose: () => void;
  onSelectWindow: (win: WindowItem) => void;
  icons: Record<string, React.ReactNode>;
}

export const TaskView: React.FC<TaskViewProps> = ({
  isOpen,
  windows,
  activeWindowId,
  onClose,
  onSelectWindow,
  icons,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[95]"
            style={{
              background: 'rgba(10, 12, 18, 0.55)',
              backdropFilter: 'blur(24px) saturate(140%)',
              WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            }}
            onClick={onClose}
          />

          {/* Window thumbnails */}
          <motion.div
            className="fixed inset-x-0 top-0 z-[96] flex flex-col items-center px-6 pt-10"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            {windows.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-32 text-slate-300/70 select-none">
                <AppWindow className="w-12 h-12 mb-3" style={{ opacity: 0.5 }} />
                <p className="text-sm">Nothing is open right now</p>
                <p className="text-xs mt-1" style={{ opacity: 0.6 }}>
                  Open an app from the Start menu or desktop
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-5 max-w-[1200px]">
                {windows.map((win, i) => {
                  const isActive = activeWindowId === win.id && !win.isMinimized;
                  return (
                    <motion.button
                      key={win.id}
                      onClick={() => onSelectWindow(win)}
                      className="group flex flex-col items-center gap-2 outline-none"
                      initial={{ opacity: 0, scale: 0.85, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.22 }}
                      whileHover={{ scale: 1.04, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Card */}
                      <div
                        className="relative rounded-xl overflow-hidden transition-shadow"
                        style={{
                          width: 232,
                          height: 146,
                          background: isActive
                            ? 'rgba(255,255,255,0.10)'
                            : 'rgba(255,255,255,0.05)',
                          border: isActive
                            ? '1.5px solid rgba(79, 195, 247, 0.85)'
                            : '1px solid rgba(255,255,255,0.12)',
                          boxShadow: isActive
                            ? '0 0 0 3px rgba(79,195,247,0.18), 0 18px 40px rgba(0,0,0,0.45)'
                            : '0 12px 32px rgba(0,0,0,0.4)',
                        }}
                      >
                        {/* Fake chrome: top bar */}
                        <div
                          className="absolute top-0 inset-x-0 h-6 flex items-center justify-end gap-1 pr-2"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(255,255,255,0.25)' }} />
                          <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(255,255,255,0.25)' }} />
                          <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(255,255,255,0.25)' }} />
                        </div>

                        {/* Centered app icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="scale-[2.2] opacity-40 group-hover:opacity-60 transition-opacity">
                            {icons[win.type]}
                          </div>
                        </div>

                        {/* Minimized dim */}
                        {win.isMinimized && (
                          <div
                            className="absolute inset-0"
                            style={{ background: 'rgba(0,0,0,0.45)' }}
                          />
                        )}
                      </div>

                      {/* Title */}
                      <span
                        className="text-xs max-w-[232px] truncate"
                        style={{
                          color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                          fontFamily: '"Segoe UI", Inter, sans-serif',
                        }}
                      >
                        {win.title || 'Window'}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Desktop indicator (visual) */}
            <div
              className="flex items-center gap-2 mt-12 px-4 py-2 rounded-full text-xs text-slate-200 select-none"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <Monitor className="w-4 h-4" style={{ opacity: 0.7 }} />
              <span style={{ opacity: 0.6 }}>Desktop 1</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};