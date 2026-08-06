import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Folder, Code, Terminal, Settings, Globe, Calculator, FileText, User, Briefcase, Mail } from 'lucide-react';
import { Folder as FolderType, Project, SearchResult } from '../types';
import { Win11Icon } from './Win11Icon';

interface SearchPanelProps {
  isOpen: boolean;
  folders: FolderType[];
  projects: Project[];
  onClose: () => void;
  onOpenFolder: (id: string) => void;
  onOpenProject: (project: Project) => void;
  onOpenApp: (app: string) => void;
}

const APP_ITEMS = [
  { id: 'terminal', label: 'Command Prompt', icon: Terminal, color: '#69F0AE' },
  { id: 'settings', label: 'Settings', icon: Settings, color: '#BDBDBD' },
  { id: 'browser', label: 'Microsoft Edge', icon: Globe, color: '#4FC3F7' },
  { id: 'calculator', label: 'Calculator', icon: Calculator, color: '#0078D4' },
  { id: 'notepad', label: 'Notepad', icon: FileText, color: '#FDB44B' },
  { id: 'about', label: 'About Me', icon: User, color: '#0078D4' },
  { id: 'skills', label: 'Skills', icon: Briefcase, color: '#107C10' },
  { id: 'resume', label: 'Resume', icon: FileText, color: '#8764B8' },
  { id: 'contact', label: 'Contact', icon: Mail, color: '#E74856' },
];

export const SearchPanel: React.FC<SearchPanelProps> = ({
  isOpen,
  folders,
  projects,
  onClose,
  onOpenFolder,
  onOpenProject,
  onOpenApp,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const results: SearchResult[] = React.useMemo(() => {
    if (!query.trim()) {
      return APP_ITEMS.slice(0, 6).map((app) => ({
        id: app.id,
        type: 'app' as const,
        title: app.label,
        action: () => { onOpenApp(app.id); onClose(); },
      }));
    }
    const q = query.toLowerCase();
    const res: SearchResult[] = [];

    APP_ITEMS.filter((a) => a.label.toLowerCase().includes(q)).forEach((app) => {
      res.push({ id: app.id, type: 'app', title: app.label, action: () => { onOpenApp(app.id); onClose(); } });
    });

    folders.filter((f) => f.name.toLowerCase().includes(q)).forEach((f) => {
      res.push({
        id: f.id,
        type: 'folder',
        title: f.name,
        subtitle: f.description,
        action: () => { onOpenFolder(f.id); onClose(); },
      });
    });

    projects.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    ).forEach((p) => {
      res.push({
        id: p.id,
        type: 'project',
        title: p.title,
        subtitle: p.tagline,
        action: () => { onOpenProject(p); onClose(); },
      });
    });

    return res.slice(0, 8);
  }, [query, folders, projects, onOpenApp, onOpenFolder, onOpenProject, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              style={{ background: 'rgba(32, 32, 32, 0.97)', backdropFilter: 'blur(40px)' }}
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') onClose();
                    if (e.key === 'Enter' && results.length > 0) results[0].action();
                  }}
                  placeholder="Search for apps, folders, projects..."
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-slate-500"
                />
              </div>

              <div className="p-2 max-h-80 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm py-8">No results found for "{query}"</p>
                ) : (
                  <>
                    {!query && (
                      <p className="text-xs text-slate-500 px-3 py-1.5 uppercase tracking-wider font-medium">
                        Suggested
                      </p>
                    )}
                    {results.map((result) => {
                      const appItem = APP_ITEMS.find((a) => a.id === result.id);
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={result.action}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors text-left"
                        >
                          {result.type === 'folder' ? (
                            <Win11Icon name={result.title} size={24} />
                          ) : result.type === 'project' ? (
                            <Code className="w-6 h-6 text-blue-400 shrink-0" />
                          ) : appItem ? (
                            <appItem.icon className="w-6 h-6 shrink-0" style={{ color: appItem.color }} />
                          ) : (
                            <Folder className="w-6 h-6 text-amber-400" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">{result.title}</p>
                            {result.subtitle && (
                              <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
