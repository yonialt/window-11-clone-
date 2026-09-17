import React from 'react';
import { 
  Folder, 
  FolderPlus, 
  Code, 
  Briefcase, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  ShieldCheck, 
  Terminal, 
  Trash2, 
  Star,
  Layers
} from 'lucide-react';
import { FolderIconType, FolderColor } from '../types';

export function getFolderIconComponent(iconType: FolderIconType, className: string = 'w-5 h-5') {
  switch (iconType) {
    case 'code':
      return React.createElement(Code, { className });
    case 'briefcase':
      return React.createElement(Briefcase, { className });
    case 'sparkles':
      return React.createElement(Sparkles, { className });
    case 'image':
      return React.createElement(ImageIcon, { className });
    case 'document':
      return React.createElement(FileText, { className });
    case 'shield':
      return React.createElement(ShieldCheck, { className });
    case 'terminal':
      return React.createElement(Terminal, { className });
    case 'trash':
      return React.createElement(Trash2, { className });
    case 'star':
      return React.createElement(Star, { className });
    case 'layer':
      return React.createElement(Layers, { className });
    case 'folder':
    default:
      return React.createElement(Folder, { className });
  }
}

export function getFolderColorStyle(color: FolderColor) {
  switch (color) {
    case 'blue':
      return {
        bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        folderFill: 'fill-blue-500/30 text-blue-400',
        badge: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
      };
    case 'yellow':
      return {
        bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        folderFill: 'fill-amber-500/30 text-amber-400',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      };
    case 'purple':
      return {
        bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        folderFill: 'fill-purple-500/30 text-purple-400',
        badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      };
    case 'emerald':
      return {
        bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        folderFill: 'fill-emerald-500/30 text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      };
    case 'rose':
      return {
        bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        folderFill: 'fill-rose-500/30 text-rose-400',
        badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      };
    case 'amber':
      return {
        bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        folderFill: 'fill-amber-500/30 text-amber-400',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      };
    case 'cyan':
      return {
        bg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        folderFill: 'fill-cyan-500/30 text-cyan-400',
        badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      };
    case 'slate':
    default:
      return {
        bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
        folderFill: 'fill-slate-500/30 text-slate-300',
        badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
      };
  }
}
