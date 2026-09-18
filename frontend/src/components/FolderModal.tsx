import React, { useState, useEffect } from 'react';
import { X, Folder, FolderPlus, Palette, Check } from 'lucide-react';
import { Folder as FolderType, FolderIconType, FolderColor } from '../types';
import { getFolderIconComponent, getFolderColorStyle } from '../lib/folderHelpers';

interface FolderModalProps {
  isOpen: boolean;
  folderToEdit?: FolderType | null;
  defaultParentId?: string | null;
  allFolders: FolderType[];
  onClose: () => void;
  onSubmit: (folderData: {
    name: string;
    description: string;
    icon: FolderIconType;
    color: FolderColor;
    parentId: string | null;
  }) => void;
}

const ICON_OPTIONS: { type: FolderIconType; label: string }[] = [
  { type: 'folder', label: 'Folder' },
  { type: 'code', label: 'Code' },
  { type: 'briefcase', label: 'Briefcase' },
  { type: 'sparkles', label: 'Sparkles' },
  { type: 'image', label: 'Media' },
  { type: 'document', label: 'Docs' },
  { type: 'shield', label: 'Security' },
  { type: 'terminal', label: 'Terminal' },
  { type: 'star', label: 'Starred' },
  { type: 'layer', label: 'Layers' },
];

const COLOR_OPTIONS: { color: FolderColor; name: string; hex: string }[] = [
  { color: 'blue', name: 'Blue', hex: '#3b82f6' },
  { color: 'yellow', name: 'Yellow', hex: '#eab308' },
  { color: 'purple', name: 'Purple', hex: '#a855f7' },
  { color: 'emerald', name: 'Emerald', hex: '#10b981' },
  { color: 'rose', name: 'Rose', hex: '#f43f5e' },
  { color: 'amber', name: 'Amber', hex: '#f59e0b' },
  { color: 'cyan', name: 'Cyan', hex: '#06b6d4' },
  { color: 'slate', name: 'Slate', hex: '#64748b' },
];

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  folderToEdit,
  defaultParentId = null,
  allFolders,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<FolderIconType>('folder');
  const [color, setColor] = useState<FolderColor>('blue');
  const [parentId, setParentId] = useState<string | null>(defaultParentId);

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setDescription(folderToEdit.description || '');
      setIcon(folderToEdit.icon);
      setColor(folderToEdit.color);
      setParentId(folderToEdit.parentId);
    } else {
      setName('');
      setDescription('');
      setIcon('folder');
      setColor('blue');
      setParentId(defaultParentId);
    }
  }, [folderToEdit, defaultParentId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      parentId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {folderToEdit ? 'Edit Folder' : 'Create New Folder'}
              </h3>
              <p className="text-xs text-slate-400">
                Organize portfolio projects into custom folders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Folder Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Folder Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Full Stack Apps, UI Concepts, Mobile..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief description of folder contents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Choose Icon
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setIcon(opt.type)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-[10px] transition-all ${icon === opt.type
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {getFolderIconComponent(opt.type, 'w-4 h-4 mb-1')}
                  <span className="truncate max-w-full">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Folder Color Theme
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setColor(c.color)}
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full border transition-transform ${color === c.color ? 'scale-110 ring-2 ring-white border-transparent' : 'border-slate-700 hover:scale-105'
                    }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {color === c.color && <Check className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                </button>
              ))}
            </div>
          </div>

          {/* Location / Parent Folder */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Location
            </label>
            <select
              value={parentId || ''}
              onChange={(e) => setParentId(e.target.value ? e.target.value : null)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none"
            >
              <option value="">Desktop (Top Level)</option>
              {allFolders
                .filter((f) => !f.isSystem && f.id !== folderToEdit?.id)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md active:scale-95"
            >
              {folderToEdit ? 'Save Changes' : 'Create Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
