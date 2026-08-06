import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, Copy, X, Folder, Maximize2, Minimize2 } from 'lucide-react';
import { WindowItem } from '../types';

interface WindowFrameProps {
  window: WindowItem;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  isActive,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  children,
}) => {
  const [position, setPosition] = useState(win.position);
  const [size, setSize] = useState(win.size);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const posStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Handle Dragging via Titlebar
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
  };

  // Handle Resizing via Bottom Right Handle
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (win.isMaximized) return;
    onFocus();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        setPosition({
          x: Math.max(0, posStartRef.current.x + dx),
          y: Math.max(0, posStartRef.current.y + dy),
        });
      } else if (isResizing) {
        const dx = e.clientX - resizeStartRef.current.x;
        const dy = e.clientY - resizeStartRef.current.y;
        setSize({
          width: Math.max(420, resizeStartRef.current.width + dx),
          height: Math.max(300, resizeStartRef.current.height + dy),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  if (win.isMinimized) {
    return null;
  }

  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: '48px', // Space for bottom Taskbar
        zIndex: win.zIndex,
      }
    : {
        position: 'absolute',
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      id={`window-${win.id}`}
      onClick={onFocus}
      style={windowStyle}
      className={`flex flex-col rounded-xl overflow-hidden shadow-2xl border transition-shadow duration-150 ${
        isActive
          ? 'bg-slate-900/95 border-slate-600/90 shadow-blue-900/30 ring-1 ring-blue-500/30'
          : 'bg-slate-900/85 border-slate-700/60 opacity-95'
      } backdrop-blur-xl`}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDownHeader}
        onDoubleClick={onMaximize}
        className={`flex items-center justify-between px-3 py-2 select-none border-b cursor-grab active:cursor-grabbing ${
          isActive
            ? 'bg-slate-800/90 border-slate-700/80 text-slate-100'
            : 'bg-slate-900/90 border-slate-800 text-slate-400'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Folder className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-medium truncate">{win.title}</span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            id={`btn-minimize-${win.id}`}
            onClick={onMinimize}
            title="Minimize"
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            id={`btn-maximize-${win.id}`}
            onClick={onMaximize}
            title={win.isMaximized ? 'Restore' : 'Maximize'}
            className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {win.isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            id={`btn-close-${win.id}`}
            onClick={onClose}
            title="Close"
            className="p-1.5 rounded hover:bg-rose-600 text-slate-300 hover:text-white transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Window Body Content */}
      <div className="flex-1 overflow-auto bg-slate-950/70 text-slate-100 relative">
        {children}
      </div>

      {/* Resize Handle (bottom right) */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 rounded-br-xs" />
        </div>
      )}
    </div>
  );
};
