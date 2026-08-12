import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Folder as FolderType,
  Project,
  WindowItem,
  Wallpaper,
  DeveloperProfile,
  DesktopPosition,
  WindowType,
} from './types';
import {
  INITIAL_FOLDERS,
  INITIAL_PROJECTS,
  WALLPAPERS,
  INITIAL_PROFILE,
} from './data/initialData';
import {
  FolderPlus,
  Plus,
  Terminal as TerminalIcon,
  Settings,
  Sparkles,
  RefreshCw,
  Grid,
  ArrowUpDown,
  ChevronRight,
  Monitor,
  Palette,
  Check,
  Folder,
  FolderOpen,
  Code,
  User,
  Award,
  FileText,
  Mail,
  Globe,
  Calculator,
  StickyNote,
  Terminal,
} from 'lucide-react';
import { DesktopIcon } from './components/DesktopIcon';
import { Window } from './components/Window';
import { ProjectDetailView } from './components/ProjectDetailView';
import { FolderModal } from './components/FolderModal';
import { ProjectModal } from './components/ProjectModal';
import { TerminalWindow } from './components/TerminalWindow';
import { SettingsApp } from './components/SettingsApp';
import { StartMenu } from './components/StartMenu';
import { Taskbar } from './components/Taskbar';
import { TaskView } from './components/TaskView';
import { AboutMeWindow } from './components/AboutMeWindow';
import { SkillsWindow } from './components/SkillsWindow';
import { ResumeWindow } from './components/ResumeWindow';
import { ContactWindow } from './components/ContactWindow';
import { BrowserWindow } from './components/BrowserWindow';
import { CalculatorWindow } from './components/CalculatorWindow';
import { NotepadWindow } from './components/NotepadWindow';
import { SearchPanel } from './components/SearchPanel';
import { FileExplorerApp } from './components/FileExplorerApp';
import { MobileNotice } from './components/MobileNotice';

const STORAGE_KEYS = {
  FOLDERS: 'portfolio_os_folders_v4',
  PROJECTS: 'portfolio_os_projects_v4',
  WALLPAPER: 'portfolio_os_wallpaper_v2',
  PROFILE: 'portfolio_os_profile_v2',
};

const DEFAULT_BROWSER_URL = 'https://www.google.com/webhp?igu=1';

// Resume PDF shortcut — opens the CV in a new browser tab (e.g. Chrome)
const RESUME_PDF_URL = '/resume.pdf';
const RESUME_DESKTOP_ICON: FolderType = {
  id: 'desktop-resume-pdf',
  name: 'Resume',
  icon: 'document',
  color: 'purple',
  parentId: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  isSystem: true,
  description: 'Open resume PDF in your browser',
};

// Contact Me shortcut — opens the Contact window (hub for email, GitHub, LinkedIn, Fiverr & Upwork)
const CONTACT_DESKTOP_ICON: FolderType = {
  id: 'desktop-contact-me',
  name: 'Contact Me',
  icon: 'document',
  color: 'purple',
  parentId: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  isSystem: true,
  description: 'Open all my contact links and send a message',
};

// Per-app title bar icons (Fluent style)
const WINDOW_ICONS: Record<string, React.ReactNode> = {
  folder: <Folder className="w-4 h-4 text-amber-400" />,
  project: <Code className="w-4 h-4 text-blue-400" />,
  settings: <Settings className="w-4 h-4 text-slate-400" />,
  terminal: <Terminal className="w-4 h-4 text-emerald-400" />,
  about: <User className="w-4 h-4 text-blue-400" />,
  skills: <Award className="w-4 h-4 text-amber-400" />,
  resume: <FileText className="w-4 h-4 text-emerald-400" />,
  contact: <Mail className="w-4 h-4 text-purple-400" />,
  browser: <Globe className="w-4 h-4 text-sky-400" />,
  calculator: <Calculator className="w-4 h-4 text-rose-400" />,
  notepad: <StickyNote className="w-4 h-4 text-yellow-400" />,
  'file-explorer': <FolderOpen className="w-4 h-4 text-amber-400" />,
};

export default function App() {
  // State Initialization from LocalStorage
  const [folders, setFolders] = useState<FolderType[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          let merged: Project[] = parsed;
          // One-time merge: prepend any projects introduced after the user's first visit
          // (e.g. the SRMS final-year project and new certificates) so returning visitors
          // see them without wiping saved data.
          const missing = INITIAL_PROJECTS.filter(
            (p) => !parsed.some((s: Project) => s.id === p.id)
          );
          if (missing.length > 0) merged = [...missing, ...parsed];
          // One-time thumbnail migration: swap the previous stock Unsplash images for the
          // new SRMS dashboard screenshot and the real certificate preview thumbnails.
          // Never overwrite an image the user set manually.
          const OLD_THUMBNAILS: Record<string, string> = {
            'proj-final-year-srms':
              'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
            'proj-ccna-certificate':
              'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
            'proj-aws-certificate':
              'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
          };
          const needsRefresh = merged.some(
            (p: Project) => !!p.imageUrl && OLD_THUMBNAILS[p.id] === p.imageUrl
          );
          if (needsRefresh) {
            return merged.map((p: Project) => {
              const fresh = INITIAL_PROJECTS.find((f) => f.id === p.id);
              return fresh && OLD_THUMBNAILS[p.id] === p.imageUrl
                ? { ...p, imageUrl: fresh.imageUrl }
                : p;
            });
          }
          return merged;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROJECTS;
  });

  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLPAPER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const matched = WALLPAPERS.find((w) => w.id === parsed.id);
        if (matched) return matched;
      } catch (e) {
        console.error(e);
      }
    }
    return WALLPAPERS[0];
  });

  const [profile, setProfile] = useState<DeveloperProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  // Windows OS Management
  const [windows, setWindows] = useState<WindowItem[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [topZIndex, setTopZIndex] = useState(10);

  // UI Popups & Modals State
  const [selectedDesktopId, setSelectedDesktopId] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);

  // Desktop Context Menu (Right Click)
  const [desktopContextMenu, setDesktopContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [desktopIconSize, setDesktopIconSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showDesktopIcons, setShowDesktopIcons] = useState<boolean>(true);
  const [desktopSortBy, setDesktopSortBy] = useState<'name' | 'date' | null>(null);
  const [submenu, setSubmenu] = useState<'view' | 'sort' | 'new' | null>(null);

  // Folder Modal State
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<FolderType | null>(null);
  const [defaultParentFolderId, setDefaultParentFolderId] = useState<string | null>(null);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [defaultProjectFolderId, setDefaultProjectFolderId] = useState<string>('folder-software-dev');

  // Global keyboard shortcuts: ESC closes overlays, Windows key toggles Start Menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTaskViewOpen) {
          setIsTaskViewOpen(false);
          return;
        }
        setIsSearchOpen(true);
        setIsStartMenuOpen(true);
        return;
      }
      if (e.key === 'Meta') {
        e.preventDefault();
        setIsStartMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTaskViewOpen]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  }, [folders]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLPAPER, JSON.stringify(currentWallpaper));
  }, [currentWallpaper]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  // ── Window Manager helpers ──
  const toggleTaskView = () => {
    setIsStartMenuOpen(false);
    setIsSearchOpen(false);
    setIsTaskViewOpen((prev) => !prev);
  };

  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
    );
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const toggleMinimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)));
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized, snap: null } : w))
    );
  };

  const handleSnap = (id: string, snap: 'left' | 'right' | null) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, snap, isMaximized: snap ? false : w.isMaximized } : w))
    );
  };

  // Remember live window geometry (drag/resize end, before maximize/snap)
  const handleBoundsChange = (
    id: string,
    bounds: { position: DesktopPosition; size: { width: number; height: number } }
  ) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, position: bounds.position, size: bounds.size, restoreBounds: bounds } : w
      )
    );
  };

  // ── Window launchers ──
  const openFolderWindow = (folderId: string) => {
    const targetFolder = folders.find((f) => f.id === folderId);
    if (!targetFolder) return;
    const windowId = `folder-${folderId}`;
    const existing = windows.find((w) => w.id === windowId);
    if (existing) {
      focusWindow(windowId);
      return;
    }
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    const offset = (windows.length % 5) * 24;
    setWindows((prev) => [
      ...prev,
      {
        id: windowId,
        type: 'folder',
        targetId: folderId,
        title: targetFolder.name,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: { x: 100 + offset, y: 60 + offset },
        size: { width: 900, height: 600 },
        lightChrome: true,
        explorerLocation: folderId,
      },
    ]);
    setActiveWindowId(windowId);
  };

  const openProjectWindow = (project: Project) => {
    const windowId = `project-${project.id}`;
    const existing = windows.find((w) => w.id === windowId);
    if (existing) {
      focusWindow(windowId);
      return;
    }
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    const offset = (windows.length % 5) * 24;
    setWindows((prev) => [
      ...prev,
      {
        id: windowId,
        type: 'project',
        targetId: project.id,
        title: project.title,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: { x: 140 + offset, y: 80 + offset },
        size: { width: 840, height: 560 },
      },
    ]);
    setActiveWindowId(windowId);
  };

  const openTerminalWindow = () => {
    const windowId = 'app-terminal';
    const existing = windows.find((w) => w.id === windowId);
    if (existing) {
      focusWindow(windowId);
      return;
    }
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setWindows((prev) => [
      ...prev,
      {
        id: windowId,
        type: 'terminal',
        targetId: null,
        title: 'Command Prompt - Portfolio CLI',
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: { x: 160, y: 90 },
        size: { width: 720, height: 440 },
      },
    ]);
    setActiveWindowId(windowId);
  };

  const openSettingsWindow = () => {
    const windowId = 'app-settings';
    const existing = windows.find((w) => w.id === windowId);
    if (existing) {
      focusWindow(windowId);
      return;
    }
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    const width = Math.min(1100, window.innerWidth * 0.75);
    const height = Math.min(750, window.innerHeight * 0.75);
    setWindows((prev) => [
      ...prev,
      {
        id: windowId,
        type: 'settings',
        targetId: null,
        title: 'Settings',
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: { x: Math.max(20, (window.innerWidth - width) / 2 - 80), y: 60 },
        size: { width, height },
        lightChrome: true,
      },
    ]);
    setActiveWindowId(windowId);
  };

  const openFileExplorerWindow = (location: string = 'this-pc') => {
    const windowId = 'app-file-explorer';
    const existing = windows.find((w) => w.id === windowId);
    if (existing) {
      focusWindow(windowId);
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? { ...w, explorerLocation: location, title: location === 'this-pc' ? 'File Explorer' : location }
            : w
        )
      );
      return;
    }
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    const width = Math.min(1100, window.innerWidth * 0.8);
    const height = Math.min(700, window.innerHeight * 0.75);
    setWindows((prev) => [
      ...prev,
      {
        id: windowId,
        type: 'file-explorer',
        targetId: null,
        title: 'File Explorer',
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: { x: Math.max(20, (window.innerWidth - width) / 2), y: 50 },
        size: { width, height },
        lightChrome: true,
        explorerLocation: location,
      },
    ]);
    setActiveWindowId(windowId);
  };

  const openBrowserWindow = (url?: string) => {
    const windowId = 'app-browser';
    const targetUrl = url || DEFAULT_BROWSER_URL;
    const existing = windows.find((w) => w.id === windowId);
    if (existing) {
      focusWindow(windowId);
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, browserUrl: targetUrl } : w))
      );
      return;
    }
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setWindows((prev) => [
      ...prev,
      {
        id: windowId,
        type: 'browser',
        targetId: null,
        title: '',
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: { x: 180, y: 70 },
        size: { width: 980, height: 640 },
        browserUrl: targetUrl,
      },
    ]);
    setActiveWindowId(windowId);
  };

  const APP_WINDOW_CONFIG: Record<string, { title: string; size: { width: number; height: number } }> = {
    about: { title: 'About Me', size: { width: 640, height: 540 } },
    skills: { title: 'Skills', size: { width: 720, height: 580 } },
    resume: { title: 'Resume', size: { width: 720, height: 620 } },
    contact: { title: 'Contact', size: { width: 560, height: 560 } },
    calculator: { title: 'Calculator', size: { width: 340, height: 520 } },
    notepad: { title: 'Notepad', size: { width: 580, height: 500 } },
  };

  const openAppWindow = (type: WindowType) => {
    if (type === 'file-explorer') {
      openFileExplorerWindow('this-pc');
      return;
    }
    const config = APP_WINDOW_CONFIG[type];
    if (!config) return;
    const windowId = `app-${type}`;
    const existing = windows.find((w) => w.id === windowId);
    if (existing) {
      focusWindow(windowId);
      return;
    }
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    const offset = (windows.length % 5) * 24;
    setWindows((prev) => [
      ...prev,
      {
        id: windowId,
        type,
        targetId: null,
        title: config.title,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: { x: 220 + offset, y: 90 + offset },
        size: config.size,
      },
    ]);
    setActiveWindowId(windowId);
  };

  // Unified app launcher used by Start Menu, Search, desktop shortcuts, Settings & File Explorer
  const launchApp = (id: string) => {
    if (id.startsWith('folder:')) {
      openFolderWindow(id.slice(7));
      return;
    }
    if (id.startsWith('project:')) {
      const proj = projects.find((p) => p.id === id.slice(8));
      if (proj) openProjectWindow(proj);
      return;
    }
    switch (id) {
      case 'file-explorer': openFileExplorerWindow(); break;
      case 'settings': openSettingsWindow(); break;
      case 'terminal': openTerminalWindow(); break;
      case 'browser': openBrowserWindow(); break;
      case 'projects': openFolderWindow('folder-software-dev'); break;
      case 'github': openBrowserWindow(profile.github || DEFAULT_BROWSER_URL); break;
      case 'linkedin': openBrowserWindow(profile.linkedin || DEFAULT_BROWSER_URL); break;
      case 'resume': window.open(RESUME_PDF_URL, '_blank', 'noopener,noreferrer'); break;
      default: openAppWindow(id as WindowType);
    }
  };

  const updateExplorerWindow = (windowId: string, location: string, title: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === windowId ? { ...w, explorerLocation: location, title } : w))
    );
  };

  // ── Folder / Project CRUD ──
  const handleOpenAddFolder = (parentId: string | null = null) => {
    setFolderToEdit(null);
    setDefaultParentFolderId(parentId);
    setIsFolderModalOpen(true);
  };

  const handleOpenEditFolder = (folder: FolderType) => {
    setFolderToEdit(folder);
    setDefaultParentFolderId(folder.parentId);
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = (folderData: {
    name: string;
    description: string;
    icon: any;
    color: any;
    parentId: string | null;
  }) => {
    if (folderToEdit) {
      setFolders((prev) => prev.map((f) => (f.id === folderToEdit.id ? { ...f, ...folderData } : f)));
      setWindows((prev) =>
        prev.map((w) =>
          w.id === `folder-${folderToEdit.id}` ? { ...w, title: folderData.name } : w
        )
      );
    } else {
      const newFolder: FolderType = {
        id: `folder-${Date.now()}`,
        name: folderData.name,
        description: folderData.description,
        icon: folderData.icon,
        color: folderData.color,
        parentId: folderData.parentId,
        createdAt: new Date().toISOString(),
      };
      setFolders((prev) => [...prev, newFolder]);
      openFolderWindow(newFolder.id);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this folder and its project references?')) {
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      closeWindow(`folder-${folderId}`);
    }
  };

  const handleOpenAddProject = (folderId: string = 'folder-software-dev') => {
    setProjectToEdit(null);
    setDefaultProjectFolderId(folderId);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project: Project) => {
    setProjectToEdit(project);
    setDefaultProjectFolderId(project.folderId);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (projectToEdit) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectToEdit.id
            ? { ...p, ...projectData, updatedAt: new Date().toISOString() }
            : p
        )
      );
      setWindows((prev) =>
        prev.map((w) =>
          w.id === `project-${projectToEdit.id}` ? { ...w, title: projectData.title } : w
        )
      );
    } else {
      const newProj: Project = {
        ...projectData,
        id: `proj-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects((prev) => [...prev, newProj]);
      openProjectWindow(newProj);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Delete this project?')) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      closeWindow(`project-${projectId}`);
    }
  };

  // ── Desktop ──
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedDesktopId(null);
    setDesktopContextMenu({ x: e.clientX, y: e.clientY });
  };

  let rootDesktopFolders = folders.filter((f) => f.parentId === null && !f.isSystem);
  if (desktopSortBy === 'name') {
    rootDesktopFolders = [...rootDesktopFolders].sort((a, b) => a.name.localeCompare(b.name));
  } else if (desktopSortBy === 'date') {
    rootDesktopFolders = [...rootDesktopFolders].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  // Windows 11 desktop grid: even rows/columns, enough room for icon + 2-line label
  const gridClass =
    desktopIconSize === 'large'
      ? 'grid-rows-[repeat(auto-fill,114px)] auto-cols-[120px]'
      : desktopIconSize === 'small'
        ? 'grid-rows-[repeat(auto-fill,88px)] auto-cols-[92px]'
        : 'grid-rows-[repeat(auto-fill,100px)] auto-cols-[108px]';

  return (
    <div
      id="windows-desktop-root"
      onContextMenu={handleDesktopContextMenu}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('#windows-taskbar')) return;
        setSelectedDesktopId(null);
        setDesktopContextMenu(null);
        setSubmenu(null);
        setIsStartMenuOpen(false);
      }}
      className="relative w-screen h-screen overflow-hidden select-none font-sans"
      style={{ background: currentWallpaper.value }}
    >
      {/* Light geometry overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

      {/* Desktop icons (top-to-bottom grid, Windows spacing) */}
      {showDesktopIcons && (
        <div
          className={`absolute top-2 left-3 z-10 grid grid-flow-col gap-x-1.5 gap-y-1.5 max-h-[calc(100vh-52px)] overflow-hidden pointer-events-auto ${gridClass}`}
        >


          {rootDesktopFolders.map((folder) => {
            const itemCount = projects.filter((p) => p.folderId === folder.id).length;
            return (
              <DesktopIcon
                key={folder.id}
                folder={folder}
                itemCount={itemCount}
                isSelected={selectedDesktopId === folder.id}
                onSelect={() => setSelectedDesktopId(folder.id)}
                onOpen={() => openFolderWindow(folder.id)}
                onRename={handleOpenEditFolder}
                onDelete={handleDeleteFolder}
                size={desktopIconSize}
              />
            );
          })}

          {/* Resume PDF shortcut — opens the CV in a new browser tab */}
          <DesktopIcon
            key={RESUME_DESKTOP_ICON.id}
            folder={RESUME_DESKTOP_ICON}
            isSelected={selectedDesktopId === RESUME_DESKTOP_ICON.id}
            onSelect={() => setSelectedDesktopId(RESUME_DESKTOP_ICON.id)}
            onOpen={() => window.open(RESUME_PDF_URL, '_blank', 'noopener,noreferrer')}
            size={desktopIconSize}
          />

          {/* Contact Me shortcut — opens the Contact window with all contact links */}
          <DesktopIcon
            key={CONTACT_DESKTOP_ICON.id}
            folder={CONTACT_DESKTOP_ICON}
            isSelected={selectedDesktopId === CONTACT_DESKTOP_ICON.id}
            onSelect={() => setSelectedDesktopId(CONTACT_DESKTOP_ICON.id)}
            onOpen={() => openAppWindow('contact')}
            size={desktopIconSize}
          />

        </div>
      )}

      {/* ── Window layer (Window Manager) ── */}
      <AnimatePresence>
        {windows.map((win) => {
          const isActive = activeWindowId === win.id;
          return (
            <motion.div
              key={win.id}
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: win.zIndex }}
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: 'spring', damping: 30, stiffness: 380 }}
            >
              <Window
                window={win}
                isActive={isActive}
                icon={WINDOW_ICONS[win.type]}
                onFocus={() => focusWindow(win.id)}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => toggleMinimizeWindow(win.id)}
                onMaximize={() => toggleMaximizeWindow(win.id)}
                onSnap={(snap) => handleSnap(win.id, snap)}
                onBoundsChange={(bounds) => handleBoundsChange(win.id, bounds)}
              >
                {(win.type === 'folder' || win.type === 'file-explorer') && (
                  <FileExplorerApp
                    location={win.explorerLocation ?? (win.type === 'folder' ? win.targetId ?? 'this-pc' : 'this-pc')}
                    folders={folders}
                    projects={projects}
                    onLocationChange={(loc, title) => updateExplorerWindow(win.id, loc, title)}
                    onOpenProject={openProjectWindow}
                    onAddFolder={handleOpenAddFolder}
                    onAddProject={handleOpenAddProject}
                    onEditFolder={handleOpenEditFolder}
                    onDeleteFolder={handleDeleteFolder}
                    onEditProject={handleOpenEditProject}
                    onDeleteProject={handleDeleteProject}
                    onOpenApp={launchApp}
                  />
                )}

                {win.type === 'project' && win.targetId && (() => {
                  const proj = projects.find((p) => p.id === win.targetId);
                  if (!proj) return <p className="p-4 text-xs text-rose-400">Project deleted.</p>;
                  const folder = folders.find((f) => f.id === proj.folderId);
                  return (
                    <ProjectDetailView
                      project={proj}
                      folder={folder}
                      onEdit={() => handleOpenEditProject(proj)}
                      onDelete={() => handleDeleteProject(proj.id)}
                    />
                  );
                })()}

                {win.type === 'terminal' && (
                  <TerminalWindow
                    folders={folders}
                    projects={projects}
                    profile={profile}
                    onOpenFolder={openFolderWindow}
                    onOpenAddFolderModal={() => handleOpenAddFolder(null)}
                    onOpenAddProjectModal={() => handleOpenAddProject('folder-software-dev')}
                  />
                )}

                {win.type === 'about' && <AboutMeWindow profile={profile} />}
                {win.type === 'skills' && <SkillsWindow />}
                {win.type === 'resume' && <ResumeWindow profile={profile} />}
                {win.type === 'contact' && <ContactWindow profile={profile} />}

                {win.type === 'browser' && (
                  <BrowserWindow key={win.browserUrl ?? 'default'} initialUrl={win.browserUrl} />
                )}
                {win.type === 'calculator' && <CalculatorWindow />}
                {win.type === 'notepad' && (
                  <NotepadWindow
                    content={win.notepadContent || ''}
                    onChange={(content) =>
                      setWindows((prev) =>
                        prev.map((w) => (w.id === win.id ? { ...w, notepadContent: content } : w))
                      )
                    }
                  />
                )}

                {win.type === 'settings' && (
                  <SettingsApp
                    wallpapers={WALLPAPERS}
                    currentWallpaper={currentWallpaper}
                    onSelectWallpaper={setCurrentWallpaper}
                    profile={profile}
                    onUpdateProfile={setProfile}
                    onOpenApp={launchApp}
                  />
                )}
              </Window>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Desktop context menu */}
      {desktopContextMenu && (
        <div
          className="fixed z-[120] w-52 bg-slate-700/95 backdrop-blur-xl border border-slate-600/80 rounded-xl shadow-2xl py-1 text-xs text-slate-200"
          style={{ top: desktopContextMenu.y, left: desktopContextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative"
            onMouseEnter={() => setSubmenu('view')}
            onMouseLeave={() => setSubmenu(null)}
          >
            <button className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors text-left">
              <div className="flex items-center gap-2.5">
                <Grid className="w-4 h-4 text-blue-400" />
                <span>View</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {submenu === 'view' && (
              <div className="absolute left-[98%] top-0 w-44 bg-slate-700/95 backdrop-blur-xl border border-slate-600/80 rounded-xl shadow-2xl py-1 text-xs text-slate-200">
                <button
                  onClick={() => { setDesktopIconSize('large'); setDesktopContextMenu(null); setSubmenu(null); }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors"
                >
                  <span>Large icons</span>
                  {desktopIconSize === 'large' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
                <button
                  onClick={() => { setDesktopIconSize('medium'); setDesktopContextMenu(null); setSubmenu(null); }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors"
                >
                  <span>Medium icons</span>
                  {desktopIconSize === 'medium' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
                <button
                  onClick={() => { setDesktopIconSize('small'); setDesktopContextMenu(null); setSubmenu(null); }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors"
                >
                  <span>Small icons</span>
                  {desktopIconSize === 'small' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
                <div className="h-px bg-slate-800 my-1" />
                <button
                  onClick={() => { setShowDesktopIcons(!showDesktopIcons); setDesktopContextMenu(null); setSubmenu(null); }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors"
                >
                  <span>Show desktop icons</span>
                  {showDesktopIcons && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setSubmenu('sort')}
            onMouseLeave={() => setSubmenu(null)}
          >
            <button className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors text-left">
              <div className="flex items-center gap-2.5">
                <ArrowUpDown className="w-4 h-4 text-emerald-400" />
                <span>Sort by</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {submenu === 'sort' && (
              <div className="absolute left-[98%] top-0 w-40 bg-slate-700/95 backdrop-blur-xl border border-slate-600/80 rounded-xl shadow-2xl py-1 text-xs text-slate-200">
                <button
                  onClick={() => { setDesktopSortBy('name'); setDesktopContextMenu(null); setSubmenu(null); }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors"
                >
                  <span>Name</span>
                  {desktopSortBy === 'name' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
                <button
                  onClick={() => { setDesktopSortBy('date'); setDesktopContextMenu(null); setSubmenu(null); }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors"
                >
                  <span>Date created</span>
                  {desktopSortBy === 'date' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
                <button
                  onClick={() => { setDesktopSortBy(null); setDesktopContextMenu(null); setSubmenu(null); }}
                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors"
                >
                  <span>Unsorted</span>
                  {desktopSortBy === null && <Check className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setDesktopContextMenu(null)}
            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800 transition-colors text-left"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Refresh</span>
          </button>

          <div className="h-px bg-slate-800 my-1" />

          <div
            className="relative"
            onMouseEnter={() => setSubmenu('new')}
            onMouseLeave={() => setSubmenu(null)}
          >
            <button className="flex items-center justify-between w-full px-3 py-2 hover:bg-slate-800 transition-colors text-left">
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-sky-400" />
                <span>New</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {submenu === 'new' && (
              <div className="absolute left-[98%] top-0 w-44 bg-slate-700/95 backdrop-blur-xl border border-slate-600/80 rounded-xl shadow-2xl py-1 text-xs text-slate-200">
                <button
                  onClick={() => { handleOpenAddFolder(null); setDesktopContextMenu(null); setSubmenu(null); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800 transition-colors text-left"
                >
                  <FolderPlus className="w-4 h-4 text-amber-400" />
                  <span>Folder</span>
                </button>
                <button
                  onClick={() => { handleOpenAddProject('folder-software-dev'); setDesktopContextMenu(null); setSubmenu(null); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800 transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Portfolio Project</span>
                </button>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-800 my-1" />

          <button
            onClick={() => { openTerminalWindow(); setDesktopContextMenu(null); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800 transition-colors text-left"
          >
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span>Open Command Prompt</span>
          </button>
          <button
            onClick={() => { openSettingsWindow(); setDesktopContextMenu(null); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800 transition-colors text-left"
          >
            <Monitor className="w-4 h-4 text-teal-400" />
            <span>Display settings</span>
          </button>
          <button
            onClick={() => { openSettingsWindow(); setDesktopContextMenu(null); }}
            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800 transition-colors text-left"
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Personalize</span>
          </button>
        </div>
      )}

      {/* Start Menu */}
      <StartMenu
        isOpen={isStartMenuOpen}
        profile={profile}
        folders={folders}
        projects={projects}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenApp={launchApp}
      />

      {/* Task View */}
      <TaskView
        isOpen={isTaskViewOpen}
        windows={windows}
        activeWindowId={activeWindowId}
        icons={WINDOW_ICONS}
        onClose={() => setIsTaskViewOpen(false)}
        onSelectWindow={(win) => {
          focusWindow(win.id);
          setIsTaskViewOpen(false);
        }}
      />

      {/* Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
        onWindowClick={(win) => {
          if (win.isMinimized) {
            focusWindow(win.id);
          } else if (activeWindowId === win.id) {
            toggleMinimizeWindow(win.id);
          } else {
            focusWindow(win.id);
          }
        }}
        onOpenTerminal={openTerminalWindow}
        onOpenSettings={openSettingsWindow}
        onOpenFileExplorer={() => openFileExplorerWindow('this-pc')}
        onOpenBrowser={() => openBrowserWindow()}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleTaskView={toggleTaskView}
        isTaskViewOpen={isTaskViewOpen}
      />

      {/* Search Panel */}
      <SearchPanel
        isOpen={isSearchOpen}
        folders={folders}
        projects={projects}
        onClose={() => setIsSearchOpen(false)}
        onOpenFolder={(id) => {
          openFolderWindow(id);
          setIsSearchOpen(false);
        }}
        onOpenProject={(proj) => {
          openProjectWindow(proj);
          setIsSearchOpen(false);
        }}
        onOpenApp={(app) => {
          launchApp(app);
          setIsSearchOpen(false);
        }}
      />

      {/* Mobile-only desktop notice */}
      <MobileNotice />

      {/* Modals */}
      <FolderModal
        isOpen={isFolderModalOpen}
        folderToEdit={folderToEdit}
        defaultParentId={defaultParentFolderId}
        allFolders={folders}
        onClose={() => setIsFolderModalOpen(false)}
        onSubmit={handleSaveFolder}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        projectToEdit={projectToEdit}
        defaultFolderId={defaultProjectFolderId}
        folders={folders}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleSaveProject}
      />
    </div>
  );
}
