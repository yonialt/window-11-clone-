import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Folder,
  Settings,
  Terminal,
  Globe,
  FileText,
  Briefcase,
  Award,
  User,
  Mail,
  Github,
  Linkedin,
  Power,
  CornerDownLeft,
  Moon,
  RotateCw,
  PowerOff,
} from 'lucide-react';
import { Win11Icon } from './Win11Icon';
import { Folder as FolderType, Project, DeveloperProfile } from '../types';

interface StartMenuProps {
  isOpen: boolean;
  profile: DeveloperProfile;
  folders: FolderType[];
  projects: Project[];
  onClose: () => void;
  onOpenApp: (id: string) => void;
}

const PINS: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'file-explorer', label: 'File Explorer', icon: <Folder className="w-5 h-5 fill-amber-400/30 text-amber-400" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 text-slate-300" /> },
  { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-5 h-5 text-emerald-400" /> },
  { id: 'browser', label: 'Browser', icon: <Globe className="w-5 h-5 text-sky-400" /> },
  { id: 'resume', label: 'Resume', icon: <FileText className="w-5 h-5 text-emerald-300" /> },
  { id: 'projects', label: 'Projects', icon: <Briefcase className="w-5 h-5 text-amber-300" /> },
  { id: 'skills', label: 'Skills', icon: <Award className="w-5 h-5 text-amber-400" /> },
  { id: 'about', label: 'About Me', icon: <User className="w-5 h-5 text-blue-400" /> },
  { id: 'contact', label: 'Contact', icon: <Mail className="w-5 h-5 text-purple-400" /> },
  { id: 'github', label: 'GitHub', icon: <Github className="w-5 h-5 text-slate-200" /> },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5 text-blue-300" /> },
];

interface SearchEntry {
  id: string;
  type: 'app' | 'folder' | 'project';
  title: string;
  subtitle?: string;
  action: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  profile,
  folders,
  projects,
  onClose,
  onOpenApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [shuttingDown, setShuttingDown] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setShowPowerMenu(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const q = searchQuery.trim().toLowerCase();

  const results: SearchEntry[] = q
    ? [
      ...PINS.filter((a) => a.label.toLowerCase().includes(q)).map((a) => ({
        id: a.id,
        type: 'app' as const,
        title: a.label,
        action: () => {
          onOpenApp(a.id);
          onClose();
        },
      })),
      ...folders
        .filter((f) => !f.isSystem && f.name.toLowerCase().includes(q))
        .map((f) => ({
          id: f.id,
          type: 'folder' as const,
          title: f.name,
          subtitle: f.description || 'Portfolio folder',
          action: () => {
            onOpenApp(`folder:${f.id}`);
            onClose();
          },
        })),
      ...projects
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        )
        .map((p) => ({
          id: p.id,
          type: 'project' as const,
          title: p.title,
          subtitle: p.tagline,
          action: () => {
            onOpenApp(`project:${p.id}`);
            onClose();
          },
        })),
    ]
    : [];

  const handleShutDown = () => {
    setShowPowerMenu(false);
    setShuttingDown(true);
    setTimeout(() => window.location.reload(), 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-[95]"
            onClick={onClose}
          />

          {/* Start Menu */}
          <motion.div
            id="windows-start-menu"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] w-[440px] sm:w-[560px] win11-acrylic border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
            style={{ boxShadow: '0 24px 64px rgba(248, 242, 242, 0.03)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search box */}
            <div className="p-5 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') onClose();
                    if (e.key === 'Enter' && results.length > 0) results[0].action();
                  }}
                  placeholder="Search apps, folders, projects..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/8 border border-white/10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {q ? (
              /* ── Search results ── */
              <div className="max-h-[380px] overflow-y-auto px-4 pb-4 text-sm">
                {results.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <Search className="w-8 h-8 text-slate-600 mb-3" />
                    <p className="text-sm text-slate-300">No results found</p>
                    <p className="text-xs text-slate-500 mt-1">Try different keywords</p>
                  </div>
                ) : (
                  results.map((r) => (
                    <button
                      key={`${r.type}-${r.id}`}
                      onClick={r.action}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors text-left"
                    >
                      {r.type === 'folder' ? (
                        <Win11Icon name={r.title} size={26} />
                      ) : r.type === 'project' ? (
                        <Briefcase className="w-6 h-6 text-amber-300" />
                      ) : (
                        PINS.find((p) => p.id === r.id)?.icon ?? <Search className="w-5 h-5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{r.title}</p>
                        {r.subtitle && <p className="text-xs text-slate-400 truncate">{r.subtitle}</p>}
                      </div>
                      <CornerDownLeft className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  ))
                )}
              </div>
            ) : (
              /* ── Pinned apps ── */
              <div className="px-5 pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Pinned</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                  {PINS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        onOpenApp(app.id);
                        onClose();
                      }}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg hover:bg-white/8 transition-colors"
                    >
                      <span className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/6 border border-white/8">
                        {app.icon}
                      </span>
                      <span className="text-[11px] text-slate-200 text-center leading-tight">{app.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer: profile + power */}
            <div className="flex items-center justify-between px-5 py-3 bg-black/25 border-t border-white/8 relative">
              <div className="flex items-center gap-3">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-9 h-9 rounded-full border border-white/20 object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-white leading-tight">{profile.name}</p>
                  <p className="text-[11px] text-slate-400">{profile.role}</p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowPowerMenu(!showPowerMenu)}
                  className={`p-2.5 rounded-lg transition-colors ${showPowerMenu ? 'bg-white/10' : 'hover:bg-white/10'}`}
                  title="Power"
                >
                  <Power className="w-5 h-5 text-slate-300" />
                </button>

                <AnimatePresence>
                  {showPowerMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.12 }}
                      className="absolute bottom-12 right-0 w-44 win11-acrylic border border-white/10 rounded-xl py-1.5 shadow-2xl"
                    >
                      {[
                        { label: 'Sleep', icon: <Moon className="w-4 h-4" />, action: () => setShowPowerMenu(false) },
                        { label: 'Restart', icon: <RotateCw className="w-4 h-4" />, action: () => setShowPowerMenu(false) },
                        { label: 'Shut down', icon: <PowerOff className="w-4 h-4" />, action: handleShutDown },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-white/8 transition-colors text-left"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Shutdown overlay */}
          <AnimatePresence>
            {shuttingDown && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
              >
                <p className="text-slate-300 text-lg mb-2">Shutting down</p>
                <motion.div
                  className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-slate-200"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};
