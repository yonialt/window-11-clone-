import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  FolderPlus, 
  Code, 
  Terminal, 
  Settings, 
  User, 
  Search, 
  Sparkles, 
  Plus, 
  ExternalLink,
  Power
} from 'lucide-react';
import { Win11Icon } from './Win11Icon';
import { Folder as FolderType, Project, DeveloperProfile } from '../types';

interface StartMenuProps {
  isOpen: boolean;
  profile: DeveloperProfile;
  folders: FolderType[];
  projects: Project[];
  onClose: () => void;
  onOpenFolder: (folderId: string) => void;
  onOpenProject: (project: Project) => void;
  onOpenTerminal: () => void;
  onOpenSettings: () => void;
  onOpenAddFolderModal: () => void;
  onOpenAddProjectModal: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  profile,
  folders,
  projects,
  onClose,
  onOpenFolder,
  onOpenProject,
  onOpenTerminal,
  onOpenSettings,
  onOpenAddFolderModal,
  onOpenAddProjectModal,
}) => {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop listener */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Start Menu Floating Popup */}
          <motion.div
            id="windows-start-menu"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-14 left-4 z-50 w-96 sm:w-[420px] bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Search bar */}
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Type here to search apps, folders, and projects..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-5 max-h-[480px] overflow-y-auto text-xs">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenAddFolderModal();
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold transition-all"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ Add Folder</span>
            </button>
            <button
              onClick={() => {
                onOpenAddProjectModal();
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Project</span>
            </button>
          </div>

          {/* Pinned Folders */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Portfolio Folders
              </h4>
              <span className="text-[10px] text-slate-500">{folders.length} items</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {folders.filter((f) => !f.isSystem).map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => {
                    onOpenFolder(folder.id);
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/90 border border-slate-800 text-left transition-colors"
                >
                  <Win11Icon name={folder.name} size={20} />
                  <span className="truncate text-xs font-medium text-slate-200">{folder.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Projects
                </h4>
              </div>
              <div className="space-y-1.5">
                {featuredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onOpenProject(p);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Code className="w-4 h-4 text-blue-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">{p.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{p.tagline}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* System Utilities */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              System Utilities
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenTerminal();
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Command Prompt</span>
              </button>
              <button
                onClick={() => {
                  onOpenSettings();
                  onClose();
                }}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Settings & Wallpaper</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Profile Bar */}
        <div className="flex items-center justify-between p-3 bg-slate-950 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full border border-blue-500/50 object-cover"
            />
            <div>
              <p className="text-xs font-bold text-white">{profile.name}</p>
              <p className="text-[10px] text-slate-400">{profile.role}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
            title="Close Start Menu"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
  );
};
