import React, { useState, useEffect } from 'react';
import { 
  Folder as FolderType, 
  Project, 
  WindowItem, 
  Wallpaper, 
  DeveloperProfile 
} from './types';
import { 
  INITIAL_FOLDERS, 
  INITIAL_PROJECTS, 
  WALLPAPERS, 
  INITIAL_PROFILE 
} from './data/initialData';
import { DesktopIcon } from './components/DesktopIcon';
import { WindowFrame } from './components/WindowFrame';
import { FileExplorer } from './components/FileExplorer';
import { ProjectDetailView } from './components/ProjectDetailView';
import { FolderModal } from './components/FolderModal';
import { ProjectModal } from './components/ProjectModal';
import { TerminalWindow } from './components/TerminalWindow';
import { SettingsWindow } from './components/SettingsWindow';
import { StartMenu } from './components/StartMenu';
import { Taskbar } from './components/Taskbar';
import { 
  FolderPlus, 
  Plus, 
  Terminal as TerminalIcon, 
  Settings, 
  Sparkles, 
  RefreshCw, 
  X,
  Layers
} from 'lucide-react';

const STORAGE_KEYS = {
  FOLDERS: 'portfolio_os_folders_v1',
  PROJECTS: 'portfolio_os_projects_v1',
  WALLPAPER: 'portfolio_os_wallpaper_v2',
  PROFILE: 'portfolio_os_profile_v1',
};

export default function App() {
  // State Initialization from LocalStorage
  const [folders, setFolders] = useState<FolderType[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLPAPER);
    return saved ? JSON.parse(saved) : WALLPAPERS[0];
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
  const [selectedDesktopFolderId, setSelectedDesktopFolderId] = useState<string | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);

  // Desktop Context Menu (Right Click)
  const [desktopContextMenu, setDesktopContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Folder Modal State
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<FolderType | null>(null);
  const [defaultParentFolderId, setDefaultParentFolderId] = useState<string | null>(null);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [defaultProjectFolderId, setDefaultProjectFolderId] = useState<string>('folder-web-apps');

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

  // Window Focus Handler
  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
    );
  };

  // Open Folder Window
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
    const newWindow: WindowItem = {
      id: windowId,
      type: 'folder',
      targetId: folderId,
      title: targetFolder.name,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
      position: { x: 80 + offset, y: 60 + offset },
      size: { width: 780, height: 520 },
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(windowId);
  };

  // Open Project Detail Window
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
    const newWindow: WindowItem = {
      id: windowId,
      type: 'project',
      targetId: project.id,
      title: project.title,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
      position: { x: 120 + offset, y: 80 + offset },
      size: { width: 840, height: 560 },
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(windowId);
  };

  // Open Terminal Window
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
        position: { x: 160, y: 100 },
        size: { width: 680, height: 420 },
      },
    ]);
    setActiveWindowId(windowId);
  };

  // Open Settings Window
  const openSettingsWindow = () => {
    const windowId = 'app-settings';
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
        type: 'settings',
        targetId: null,
        title: 'Windows Personalization & Developer Settings',
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        position: { x: 180, y: 120 },
        size: { width: 640, height: 500 },
      },
    ]);
    setActiveWindowId(windowId);
  };

  // Close Window
  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id);
      if (remaining.length > 0) {
        setActiveWindowId(remaining[remaining.length - 1].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  // Minimize / Maximize Window
  const toggleMinimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
    );
  };

  const toggleMaximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  // Add / Edit Folder Operations
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
      // Update existing
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderToEdit.id ? { ...f, ...folderData } : f
        )
      );
      // Update open window title if open
      setWindows((prev) =>
        prev.map((w) =>
          w.id === `folder-${folderToEdit.id}` ? { ...w, title: folderData.name } : w
        )
      );
    } else {
      // Create new folder
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
      // Immediately open new folder window for convenience
      openFolderWindow(newFolder.id);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this folder and its project references?')) {
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      closeWindow(`folder-${folderId}`);
    }
  };

  // Add / Edit Project Operations
  const handleOpenAddProject = (folderId: string = 'folder-web-apps') => {
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

  // Handle Desktop Right Click
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedDesktopFolderId(null);
    setDesktopContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Filter root desktop folders (where parentId is null)
  const rootDesktopFolders = folders.filter((f) => f.parentId === null);

  return (
    <div
      id="windows-desktop-root"
      onContextMenu={handleDesktopContextMenu}
      onClick={() => {
        setSelectedDesktopFolderId(null);
        setDesktopContextMenu(null);
        setIsStartMenuOpen(false);
      }}
      className="relative w-screen h-screen overflow-hidden select-none font-sans"
      style={{ background: currentWallpaper.value }}
    >
      {/* Light Geometry overlay matching Windows 11 wallpaper aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 pointer-events-none" />

      {/* Desktop Grid Icons (Top-to-Bottom, Left-to-Right Grid Alignment) */}
      <div className="absolute top-3 left-3 z-10 grid grid-flow-col grid-rows-[repeat(auto-fill,80px)] auto-cols-[88px] gap-x-1 gap-y-0.5 max-h-[calc(100vh-56px)] overflow-hidden pointer-events-auto">
        {rootDesktopFolders.map((folder) => {
          const itemCount = projects.filter((p) => p.folderId === folder.id).length;
          return (
            <DesktopIcon
              key={folder.id}
              folder={folder}
              itemCount={itemCount}
              isSelected={selectedDesktopFolderId === folder.id}
              onSelect={() => setSelectedDesktopFolderId(folder.id)}
              onOpen={() => openFolderWindow(folder.id)}
              onRename={handleOpenEditFolder}
              onDelete={handleDeleteFolder}
            />
          );
        })}

        {/* Dedicated "+ Add Folder" Shortcut Icon on Desktop */}
        <DesktopIcon
          isAddFolderShortcut
          isSelected={false}
          onSelect={() => {}}
          onOpen={() => {}}
          onAddFolderClick={() => handleOpenAddFolder(null)}
        />
      </div>

      {/* Windows Application Layer */}
      {windows.map((win) => {
        const isActive = activeWindowId === win.id;

        return (
          <WindowFrame
            key={win.id}
            window={win}
            isActive={isActive}
            onFocus={() => focusWindow(win.id)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => toggleMinimizeWindow(win.id)}
            onMaximize={() => toggleMaximizeWindow(win.id)}
          >
            {win.type === 'folder' && win.targetId && (() => {
              const currentFolder = folders.find((f) => f.id === win.targetId);
              if (!currentFolder) return <p className="p-4 text-xs text-rose-400">Folder deleted.</p>;

              const subfolders = folders.filter((f) => f.parentId === currentFolder.id);
              const folderProjects = projects.filter((p) => p.folderId === currentFolder.id);

              return (
                <FileExplorer
                  currentFolder={currentFolder}
                  subfolders={subfolders}
                  projects={folderProjects}
                  allFolders={folders}
                  onNavigateFolder={(fId) => openFolderWindow(fId)}
                  onOpenProject={(proj) => openProjectWindow(proj)}
                  onAddFolderClick={(pId) => handleOpenAddFolder(pId)}
                  onAddProjectClick={(fId) => handleOpenAddProject(fId)}
                  onEditFolder={handleOpenEditFolder}
                  onDeleteFolder={handleDeleteFolder}
                  onEditProject={handleOpenEditProject}
                  onDeleteProject={handleDeleteProject}
                />
              );
            })()}

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
                onOpenAddProjectModal={() => handleOpenAddProject('folder-web-apps')}
              />
            )}

            {win.type === 'settings' && (
              <SettingsWindow
                wallpapers={WALLPAPERS}
                currentWallpaper={currentWallpaper}
                onSelectWallpaper={setCurrentWallpaper}
                profile={profile}
                onUpdateProfile={setProfile}
              />
            )}
          </WindowFrame>
        );
      })}

      {/* Desktop Context Menu (Right-Click) */}
      {desktopContextMenu && (
        <div
          className="fixed z-50 w-52 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-xl shadow-2xl py-1 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: desktopContextMenu.y, left: desktopContextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              handleOpenAddFolder(null);
              setDesktopContextMenu(null);
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-amber-500 hover:text-slate-950 font-semibold transition-colors text-amber-300"
          >
            <FolderPlus className="w-4 h-4" />
            + New Folder
          </button>
          <button
            onClick={() => {
              handleOpenAddProject('folder-web-apps');
              setDesktopContextMenu(null);
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-400" />
            + New Portfolio Project
          </button>
          <div className="h-px bg-slate-800 my-1" />
          <button
            onClick={() => {
              openTerminalWindow();
              setDesktopContextMenu(null);
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800 transition-colors"
          >
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            Open Command Prompt
          </button>
          <button
            onClick={() => {
              openSettingsWindow();
              setDesktopContextMenu(null);
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4 text-purple-400" />
            Personalize Desktop
          </button>
        </div>
      )}

      {/* Task View Window Switcher Overlay (Triggered by taskbar task view icon) */}
      {isTaskViewOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl p-8 flex flex-col justify-between animate-in fade-in duration-200"
          onClick={() => setIsTaskViewOpen(false)}
        >
          <div className="flex items-center justify-between text-white border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-lg font-bold">Task View / Virtual Desktops</h2>
                <p className="text-xs text-slate-400">Click any window thumbnail to bring to focus</p>
              </div>
            </div>
            <button
              onClick={() => setIsTaskViewOpen(false)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Windows Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-auto">
            {windows.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500 text-sm">
                No active windows running. Double-click any folder or icon on the desktop to launch.
              </div>
            ) : (
              windows.map((win) => (
                <div
                  key={win.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    focusWindow(win.id);
                    setIsTaskViewOpen(false);
                  }}
                  className="group bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-2xl p-4 shadow-2xl cursor-pointer hover:scale-105 transition-all flex flex-col justify-between h-48 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white truncate">{win.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeWindow(win.id);
                      }}
                      className="p-1 rounded hover:bg-rose-600 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                    [ Active Window ]
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center text-xs text-slate-500">
            Press ESC or click anywhere to exit Task View
          </div>
        </div>
      )}

      {/* Start Menu Popup */}
      <StartMenu
        isOpen={isStartMenuOpen}
        profile={profile}
        folders={folders}
        projects={projects}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenFolder={openFolderWindow}
        onOpenProject={openProjectWindow}
        onOpenTerminal={openTerminalWindow}
        onOpenSettings={openSettingsWindow}
        onOpenAddFolderModal={() => handleOpenAddFolder(null)}
        onOpenAddProjectModal={() => handleOpenAddProject('folder-web-apps')}
      />

      {/* Windows Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        isStartMenuOpen={isStartMenuOpen}
        onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
        onToggleTaskView={() => setIsTaskViewOpen(!isTaskViewOpen)}
        onWindowClick={(win) => {
          if (win.isMinimized) {
            focusWindow(win.id);
          } else if (activeWindowId === win.id) {
            toggleMinimizeWindow(win.id);
          } else {
            focusWindow(win.id);
          }
        }}
        onOpenAddFolderModal={() => handleOpenAddFolder(null)}
        onOpenAddProjectModal={() => handleOpenAddProject('folder-web-apps')}
        onOpenTerminal={openTerminalWindow}
        onOpenSettings={openSettingsWindow}
      />

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
