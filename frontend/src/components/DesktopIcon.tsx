import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderOpen, Edit2, Trash2 } from 'lucide-react';
import { Win11Icon } from './Win11Icon';
import { Folder as FolderType } from '../types';

interface DesktopIconProps {
  folder?: FolderType;
  isAddFolderShortcut?: boolean;
  itemCount?: number;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onAddFolderClick?: () => void;
  onRename?: (folder: FolderType) => void;
  onDelete?: (folderId: string) => void;
  size?: 'small' | 'medium' | 'large';
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  folder,
  isAddFolderShortcut = false,
  itemCount = 0,
  isSelected,
  onSelect,
  onOpen,
  onAddFolderClick,
  onRename,
  onDelete,
  size = 'medium',
}) => {
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  // Hover is tracked on the whole desktop item so the highlight applies to the
  // single parent wrapper — never to individual icon sub-elements.
  const [isHovered, setIsHovered] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    if (!isAddFolderShortcut && folder) {
      setContextMenuPos({ x: e.clientX, y: e.clientY });
    }
  };

  const closeContextMenu = () => setContextMenuPos(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    onOpen();
  };

  const name = isAddFolderShortcut ? 'Add Folder' : folder?.name ?? '';

  const containerSize = size === 'large' ? 60 : size === 'small' ? 44 : 52;
  const iconSize = size === 'large' ? 52 : size === 'small' ? 36 : 44;
  const wrapperWidth = size === 'large' ? 114 : size === 'small' ? 86 : 102;

  return (
    <>
      <motion.div
        id={isAddFolderShortcut ? 'desktop-add-folder-icon' : `desktop-icon-${folder?.id}`}
        onClick={isAddFolderShortcut ? onAddFolderClick : handleClick}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex flex-col items-center justify-start cursor-pointer select-none"
        style={{ width: wrapperWidth, paddingTop: 6, paddingBottom: 4 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Icon container */}
        <motion.div
          className="relative flex items-center justify-center"
          style={{
            width: containerSize,
            height: containerSize,
            borderRadius: 6,
            background: isSelected
              ? 'rgba(0, 120, 212, 0.25)'
              : isHovered
                ? 'rgba(255, 255, 255, 0.10)'
                : 'transparent',
            boxShadow: isSelected
              ? '0 0 0 1px rgba(0,120,212,0.6), 0 4px 16px rgba(0,120,212,0.3)'
              : undefined,
          }}
          animate={{
            background: isSelected
              ? 'rgba(0, 120, 212, 0.25)'
              : isHovered
                ? 'rgba(255, 255, 255, 0.10)'
                : 'rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.12 }}
        >
          <Win11Icon name={isAddFolderShortcut ? 'add folder' : (folder?.name ?? '')} size={iconSize} />
        </motion.div>

        {/* Label */}
        <div
          className="mt-1 text-center text-white leading-tight"
          style={{
            fontSize: 11,
            fontFamily: '"Segoe UI", Inter, system-ui, sans-serif',
            fontWeight: isSelected ? 600 : 400,
            maxWidth: wrapperWidth - 8,
            wordBreak: 'break-word',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textShadow: '0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.8)',
            background: isSelected
              ? 'rgba(0,78,152,0.85)'
              : isHovered
                ? 'rgba(255,255,255,0.12)'
                : 'transparent',
            transition: 'background 0.12s',
            padding: isSelected ? '0 3px 1px' : undefined,
            borderRadius: isSelected ? 2 : undefined,
          }}
        >
          {name}
        </div>
      </motion.div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenuPos && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={closeContextMenu}
              onContextMenu={(e) => { e.preventDefault(); closeContextMenu(); }}
            />
            <motion.div
              className="fixed z-50 py-1 text-sm text-slate-200"
              style={{
                top: contextMenuPos.y,
                left: contextMenuPos.x,
                width: 176,
                background: 'rgba(36, 36, 36, 0.94)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
              }}
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id={`ctx-open-${folder?.id}`}
                onClick={() => { onOpen(); closeContextMenu(); }}
                className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs hover:bg-white/8 transition-colors text-left"
                style={{ color: '#e8e8e8' }}
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Open
              </button>
              {onRename && !folder?.isSystem && (
                <>
                  <div className="mx-2 my-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <button
                    id={`ctx-rename-${folder?.id}`}
                    onClick={() => { onRename(folder!); closeContextMenu(); }}
                    className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs hover:bg-white/8 transition-colors text-left"
                    style={{ color: '#e8e8e8' }}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Rename
                  </button>
                </>
              )}
              {onDelete && !folder?.isSystem && (
                <>
                  <div className="mx-2 my-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <button
                    id={`ctx-delete-${folder?.id}`}
                    onClick={() => { onDelete(folder!.id); closeContextMenu(); }}
                    className="flex items-center gap-2.5 w-full px-3 py-1.5 text-xs transition-colors text-left text-rose-400 hover:bg-rose-500/15"
                  >
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    Delete
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
