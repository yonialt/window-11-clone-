import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { WindowItem, DesktopPosition } from '../types';
import { TitleBar } from './TitleBar';

const TASKBAR_H = 40;
const MIN_W = 420;
const MIN_H = 320;
const SNAP_MARGIN = 6;

type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
type SnapPreview = 'max' | 'left' | 'right' | null;

interface WindowProps {
  window: WindowItem;
  isActive: boolean;
  icon?: React.ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onSnap: (snap: 'left' | 'right' | null) => void;
  onBoundsChange: (bounds: { position: DesktopPosition; size: { width: number; height: number } }) => void;
  children: React.ReactNode;
}

const RESIZE_HANDLES: { dir: ResizeDir; style: React.CSSProperties }[] = [
  { dir: 'n', style: { top: 0, left: 8, right: 8, height: 5, cursor: 'n-resize' } },
  { dir: 's', style: { bottom: 0, left: 8, right: 8, height: 5, cursor: 's-resize' } },
  { dir: 'e', style: { top: 8, right: 0, bottom: 8, width: 5, cursor: 'e-resize' } },
  { dir: 'w', style: { top: 8, left: 0, bottom: 8, width: 5, cursor: 'w-resize' } },
  { dir: 'ne', style: { top: 0, right: 0, width: 10, height: 10, cursor: 'ne-resize' } },
  { dir: 'nw', style: { top: 0, left: 0, width: 10, height: 10, cursor: 'nw-resize' } },
  { dir: 'se', style: { bottom: 0, right: 0, width: 14, height: 14, cursor: 'se-resize' } },
  { dir: 'sw', style: { bottom: 0, left: 0, width: 10, height: 10, cursor: 'sw-resize' } },
];

export const Window: React.FC<WindowProps> = ({
  window: win,
  isActive,
  icon,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onSnap,
  onBoundsChange,
  children,
}) => {
  const [position, setPosition] = useState<DesktopPosition>(win.position);
  const [size, setSize] = useState({ width: win.size.width, height: win.size.height });
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDir, setResizeDir] = useState<ResizeDir | null>(null);
  const [snapPreview, setSnapPreview] = useState<SnapPreview>(null);

  // Refs keep the single global listener stable (no re-subscribe churn)
  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  const isDraggingRef = useRef(false);
  const resizeDirRef = useRef<ResizeDir | null>(null);
  const snapPreviewRef = useRef<SnapPreview>(null);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 });
  const resizeStart = useRef({ mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 });
  const wasMaxed = useRef(win.isMaximized);
  const wasSnapped = useRef(!!win.snap);

  const onBoundsChangeRef = useRef(onBoundsChange);
  const onMaximizeRef = useRef(onMaximize);
  const onSnapRef = useRef(onSnap);
  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
    onMaximizeRef.current = onMaximize;
    onSnapRef.current = onSnap;
  });

  const setPos = (p: DesktopPosition) => {
    positionRef.current = p;
    setPosition(p);
  };
  const setSz = (s: { width: number; height: number }) => {
    sizeRef.current = s;
    setSize(s);
  };

  const commitBounds = useCallback(() => {
    onBoundsChangeRef.current({ position: positionRef.current, size: sizeRef.current });
  }, []);

  // Restore geometry when leaving maximized / snapped state
  useEffect(() => {
    if (wasMaxed.current && !win.isMaximized && win.restoreBounds) {
      setPos(win.restoreBounds.position);
      setSz(win.restoreBounds.size);
    }
    if (wasSnapped.current && !win.snap && win.restoreBounds) {
      setPos(win.restoreBounds.position);
      setSz(win.restoreBounds.size);
    }
    wasMaxed.current = win.isMaximized;
    wasSnapped.current = !!win.snap;
  }, [win.isMaximized, win.snap, win.restoreBounds]);

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    onFocus();

    // Window control buttons (min/max/close) must never start a drag or
    // restore the window from maximized/snapped state. Without this guard,
    // pressing Close on a maximized window restores it down first — moving the
    // title bar out from under the cursor so the click never reaches the
    // button — and the window ends up merely restored instead of closed.
    if ((e.target as HTMLElement).closest('button')) return;

    // Dragging a maximized / snapped window first restores it
    if (win.isMaximized) {
      const rb = win.restoreBounds ?? { position: win.position, size: win.size };
      onBoundsChangeRef.current(rb);
      onMaximizeRef.current();
      setPos(rb.position);
      setSz(rb.size);
    } else if (win.snap) {
      const rb = win.restoreBounds ?? { position: win.position, size: win.size };
      onBoundsChangeRef.current(rb);
      onSnapRef.current(null);
      setPos(rb.position);
      setSz(rb.size);
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, winX: positionRef.current.x, winY: positionRef.current.y };
  };

  const handleResizeStart = (dir: ResizeDir) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (win.isMaximized || win.snap) return;
    onFocus();
    resizeDirRef.current = dir;
    setResizeDir(dir);
    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      x: positionRef.current.x,
      y: positionRef.current.y,
      w: sizeRef.current.width,
      h: sizeRef.current.height,
    };
  };

  // Restore from maximize / snap (button or double-click)
  const restoreOrMaximize = useCallback(() => {
    if (win.snap) {
      const rb = win.restoreBounds ?? { position: positionRef.current, size: sizeRef.current };
      onBoundsChangeRef.current(rb);
      onSnapRef.current(null);
      setPos(rb.position);
      setSz(rb.size);
      return;
    }
    if (win.isMaximized) {
      const rb = win.restoreBounds ?? { position: positionRef.current, size: sizeRef.current };
      onBoundsChangeRef.current(rb);
      onMaximizeRef.current();
    } else {
      commitBounds();
      onMaximizeRef.current();
    }
  }, [win.snap, win.isMaximized, win.restoreBounds, commitBounds]);

  // Single global listener (mounted once)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const dx = e.clientX - dragStart.current.mouseX;
        const dy = e.clientY - dragStart.current.mouseY;
        const cur = sizeRef.current;
        setPos({
          x: Math.max(-cur.width + 100, dragStart.current.winX + dx),
          y: Math.max(0, dragStart.current.winY + dy),
        });

        if (e.clientY <= SNAP_MARGIN) {
          snapPreviewRef.current = 'max';
          setSnapPreview('max');
        } else if (e.clientX <= SNAP_MARGIN) {
          snapPreviewRef.current = 'left';
          setSnapPreview('left');
        } else if (e.clientX >= window.innerWidth - SNAP_MARGIN) {
          snapPreviewRef.current = 'right';
          setSnapPreview('right');
        } else {
          snapPreviewRef.current = null;
          setSnapPreview(null);
        }
      } else if (resizeDirRef.current) {
        const rs = resizeStart.current;
        const dir = resizeDirRef.current;
        const dx = e.clientX - rs.mouseX;
        const dy = e.clientY - rs.mouseY;
        let { x, y, w, h } = { x: rs.x, y: rs.y, w: rs.w, h: rs.h };

        if (dir.includes('e')) w = rs.w + dx;
        if (dir.includes('s')) h = rs.h + dy;
        if (dir.includes('w')) {
          x = Math.max(0, rs.x + dx);
          w = rs.w + (rs.x - x);
        }
        if (dir.includes('n')) {
          y = Math.max(0, rs.y + dy);
          h = rs.h + (rs.y - y);
        }

        setSz({ width: Math.max(MIN_W, w), height: Math.max(MIN_H, h) });
        setPos({ x: Math.max(0, x), y: Math.max(0, y) });
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        const preview = snapPreviewRef.current;
        if (preview === 'max') {
          commitBounds();
          onMaximizeRef.current();
        } else if (preview === 'left') {
          commitBounds();
          onSnapRef.current('left');
        } else if (preview === 'right') {
          commitBounds();
          onSnapRef.current('right');
        } else {
          commitBounds();
        }
        isDraggingRef.current = false;
        setIsDragging(false);
        snapPreviewRef.current = null;
        setSnapPreview(null);
      }
      if (resizeDirRef.current) {
        commitBounds();
        resizeDirRef.current = null;
        setResizeDir(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [commitBounds]);

  if (win.isMinimized) return null;

  const fullHeight = `calc(100vh - ${TASKBAR_H}px)`;

  const layout: React.CSSProperties = win.isMaximized
    ? { top: 0, left: 0, width: '100vw', height: fullHeight }
    : win.snap === 'left'
    ? { top: 0, left: 0, width: '50vw', height: fullHeight }
    : win.snap === 'right'
    ? { top: 0, left: '50vw', width: '50vw', height: fullHeight }
    : { top: position.y, left: position.x, width: size.width, height: size.height };

  const isChromeLight = win.lightChrome === true;

  const previewRect =
    snapPreview === 'max'
      ? { top: 8, left: 8, right: 8, bottom: 8 + TASKBAR_H }
      : snapPreview === 'left'
      ? { top: 8, left: 8, bottom: 8 + TASKBAR_H, width: 'calc(50vw - 12px)' }
      : snapPreview === 'right'
      ? { top: 8, right: 8, bottom: 8 + TASKBAR_H, width: 'calc(50vw - 12px)' }
      : null;

  return (
    <div
      id={`window-${win.id}`}
      onMouseDown={onFocus}
      className="absolute flex flex-col overflow-hidden rounded-lg pointer-events-auto win11-window-shadow"
      style={{
        ...layout,
        zIndex: win.zIndex,
        background: isChromeLight
          ? 'rgba(247, 247, 247, 0.96)'
          : 'rgba(32, 32, 32, 0.94)',
        backdropFilter: 'blur(30px) saturate(160%)',
        WebkitBackdropFilter: 'blur(30px) saturate(160%)',
        border: `1px solid ${
          isActive
            ? isChromeLight ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)'
            : isChromeLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.08)'
        }`,
      }}
    >
      <TitleBar
        title={win.title}
        icon={icon}
        isActive={isActive}
        isMaximized={win.isMaximized || !!win.snap}
        light={isChromeLight}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={restoreOrMaximize}
        onMinimize={onMinimize}
        onMaximize={restoreOrMaximize}
        onClose={onClose}
      />

      {/* Window body */}
      <div className="flex-1 overflow-hidden relative" style={{ background: 'transparent' }}>
        {children}
      </div>

      {/* Resize handles */}
      {!win.isMaximized && !win.snap &&
        RESIZE_HANDLES.map(({ dir, style }) => (
          <div key={dir} onMouseDown={handleResizeStart(dir)} className="absolute z-10" style={style} />
        ))}

      {/* Snap preview overlay (portaled above every stacking context) */}
      {snapPreview && previewRect &&
        createPortal(
          <div className="fixed inset-0 z-[9999] pointer-events-none">
            <div
              className="absolute bg-blue-500/25 rounded-lg"
              style={{ ...previewRect, border: '2px solid rgba(0, 120, 212, 0.65)' }}
            />
          </div>,
          document.body
        )}
    </div>
  );
};
