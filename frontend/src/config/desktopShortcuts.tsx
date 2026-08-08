import React from 'react';
import {
  Monitor,
  Wifi,
  Download,
  FileText,
  Image,
  Music,
  Video,
  Trash2,
  Briefcase,
  Github,
  Linkedin,
} from 'lucide-react';

export interface DesktopShortcutDef {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const DESKTOP_SHORTCUTS: DesktopShortcutDef[] = [
  { id: 'this-pc', label: 'This PC', icon: <Monitor className="w-9 h-9 text-sky-400" strokeWidth={1.5} /> },
  { id: 'network', label: 'Network', icon: <Wifi className="w-9 h-9 text-emerald-400" strokeWidth={1.5} /> },
  { id: 'downloads', label: 'Downloads', icon: <Download className="w-9 h-9 text-blue-400" strokeWidth={1.5} /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="w-9 h-9 text-amber-300" strokeWidth={1.5} /> },
  { id: 'pictures', label: 'Pictures', icon: <Image className="w-9 h-9 text-purple-300" strokeWidth={1.5} /> },
  { id: 'music', label: 'Music', icon: <Music className="w-9 h-9 text-emerald-300" strokeWidth={1.5} /> },
  { id: 'videos', label: 'Videos', icon: <Video className="w-9 h-9 text-rose-300" strokeWidth={1.5} /> },
  { id: 'recycle-bin', label: 'Recycle Bin', icon: <Trash2 className="w-9 h-9 text-slate-300" strokeWidth={1.5} /> },
  { id: 'resume', label: 'Resume', icon: <FileText className="w-9 h-9 text-emerald-300" strokeWidth={1.5} /> },
  { id: 'projects', label: 'Projects', icon: <Briefcase className="w-9 h-9 text-amber-300" strokeWidth={1.5} /> },
  { id: 'github', label: 'GitHub', icon: <Github className="w-9 h-9 text-slate-100" strokeWidth={1.5} /> },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-9 h-9 text-blue-300" strokeWidth={1.5} /> },
];
