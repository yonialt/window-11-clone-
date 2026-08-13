import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Search,
  RefreshCw,
  FolderPlus,
  Plus,
  Trash2,
  Edit3,
  Code,
  Star,
  Folder,
  FolderOpen,
  Download,
  Video,
  Music,
  Image,
  FileText,
  Monitor,
  ChevronRight,
  Calendar,
  HardDrive,
} from 'lucide-react';
import { Folder as FolderType, Project } from '../types';
import { Win11Icon } from './Win11Icon';

interface FileExplorerAppProps {
  location: string;
  folders: FolderType[];
  projects: Project[];
  onOpenProject: (p: Project) => void;
  onAddFolder: (parentId: string | null) => void;
  onAddProject: (folderId: string) => void;
  onEditFolder: (f: FolderType) => void;
  onDeleteFolder: (id: string) => void;
  onEditProject: (p: Project) => void;
  onDeleteProject: (id: string) => void;
  onOpenApp: (id: string) => void;
  onLocationChange: (location: string, title: string) => void;
}

const SIDEBAR: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: 'this-pc', label: 'Quick Access', icon: <FolderOpen className="w-4 h-4 text-blue-500" /> },
  { id: 'this-pc', label: 'Desktop', icon: <Monitor className="w-4 h-4 text-sky-500" /> },
  { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4 text-amber-500" /> },
  { id: 'downloads', label: 'Downloads', icon: <Download className="w-4 h-4 text-blue-500" /> },
  { id: 'pictures', label: 'Pictures', icon: <Image className="w-4 h-4 text-purple-500" /> },
  { id: 'videos', label: 'Videos', icon: <Video className="w-4 h-4 text-rose-500" /> },
  { id: 'music', label: 'Music', icon: <Music className="w-4 h-4 text-emerald-500" /> },
  { id: 'this-pc', label: 'This PC', icon: <Monitor className="w-4 h-4 text-sky-500" /> },
  { id: 'recycle-bin', label: 'Recycle Bin', icon: <Trash2 className="w-4 h-4 text-slate-500" /> },
];

const VIRTUAL_LABELS: Record<string, string> = {
  downloads: 'Downloads',
  videos: 'Videos',
  music: 'Music',
};

const LOCATION_TO_FOLDER: Record<string, string> = {
  documents: 'folder-documents',
  pictures: 'folder-media',
  'recycle-bin': 'folder-recycle-bin',
};

export const FileExplorerApp: React.FC<FileExplorerAppProps> = ({
  location,
  folders,
  projects,
  onOpenProject,
  onAddFolder,
  onAddProject,
  onEditFolder,
  onDeleteFolder,
  onEditProject,
  onDeleteProject,
  onOpenApp,
  onLocationChange,
}) => {
  const [currentLoc, setCurrentLoc] = useState(location || 'this-pc');
  const [history, setHistory] = useState<string[]>([location || 'this-pc']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [query, setQuery] = useState('');

  const folderById = (id: string) => folders.find((f) => f.id === id);

  const titleFor = (loc: string): string => {
    if (loc === 'this-pc') return 'This PC';
    if (VIRTUAL_LABELS[loc]) return VIRTUAL_LABELS[loc];
    const folderId = LOCATION_TO_FOLDER[loc] ?? loc;
    return folderById(folderId)?.name ?? 'This PC';
  };

  const navigate = (loc: string) => {
    if (loc === currentLoc) return; // avoid duplicate history entries
    const next = [...history.slice(0, historyIndex + 1), loc];
    setHistory(next);
    setHistoryIndex(next.length - 1);
    setCurrentLoc(loc);
    onLocationChange(loc, titleFor(loc));
  };

  // Sync external location changes (e.g. desktop shortcut clicked while open)
  useEffect(() => {
    if (location && location !== currentLoc) {
      setCurrentLoc(location);
      setHistory([location]);
      setHistoryIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const resolved = useMemo(() => {
    if (currentLoc === 'this-pc') return { kind: 'home' as const };
    if (currentLoc === 'downloads' || currentLoc === 'videos' || currentLoc === 'music')
      return { kind: 'virtual' as const, label: VIRTUAL_LABELS[currentLoc] };
    const folderId = LOCATION_TO_FOLDER[currentLoc] ?? currentLoc;
    const folder = folderById(folderId);
    if (!folder) return { kind: 'missing' as const };
    return { kind: 'folder' as const, folder };
  }, [currentLoc, folders]);

  const breadcrumbs = useMemo(() => {
    if (resolved.kind === 'folder') {
      const chain: { id: string; label: string }[] = [];
      let curr: FolderType | undefined = resolved.folder;
      while (curr) {
        chain.unshift({ id: curr.id, label: curr.name });
        curr = folderById(curr.parentId ?? '');
      }
      return [{ id: 'this-pc', label: 'Desktop' }, ...chain];
    }
    if (resolved.kind === 'virtual') return [{ id: 'this-pc', label: 'Desktop' }, { id: currentLoc, label: resolved.label }];
    if (resolved.kind === 'missing') return [{ id: 'this-pc', label: 'Desktop' }];
    return [{ id: 'this-pc', label: 'Desktop' }, { id: 'this-pc', label: 'This PC' }];
  }, [resolved, currentLoc, folders]);

  const goBack = () => { if (historyIndex > 0) { const i = historyIndex - 1; setHistoryIndex(i); setCurrentLoc(history[i]); onLocationChange(history[i], titleFor(history[i])); } };
  const goForward = () => { if (historyIndex < history.length - 1) { const i = historyIndex + 1; setHistoryIndex(i); setCurrentLoc(history[i]); onLocationChange(history[i], titleFor(history[i])); } };
  const goUp = () => {
    if (resolved.kind === 'folder' && resolved.folder.parentId) {
      navigate(resolved.folder.parentId);
    } else if (resolved.kind === 'folder' || resolved.kind === 'virtual') {
      navigate('this-pc');
    }
  };

  const subfolders = resolved.kind === 'folder'
    ? folders.filter((f) => f.parentId === resolved.folder.id)
    : [];
  const folderProjects = resolved.kind === 'folder'
    ? projects.filter((p) => p.folderId === resolved.folder.id)
    : [];
  const rootFolders = folders.filter((f) => f.parentId === null);

  const q = query.toLowerCase();
  const filteredSubfolders = subfolders.filter((f) => !q || f.name.toLowerCase().includes(q));
  const filteredProjects = folderProjects.filter(
    (p) => !q || p.title.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
  );

  const isRecycle = resolved.kind === 'folder' && resolved.folder.isSystem;

  const renderEmpty = (icon: React.ReactNode, title: string, sub: string) => (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
        {icon}
      </div>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      <p className="text-xs text-gray-400 mt-1 max-w-xs">{sub}</p>
    </div>
  );

  return (
    <div className="flex h-full bg-white text-gray-800" style={{ fontFamily: '"Segoe UI", Inter, sans-serif' }}>
      {/* ── Sidebar ── */}
      <aside className="w-48 shrink-0 bg-[#f3f3f3] border-r border-gray-200 flex flex-col">
        <div className="px-3 pt-3 pb-1.5 text-[11px] font-semibold text-gray-500">Quick access</div>
        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {SIDEBAR.map((item, i) => {
            const active = currentLoc === item.id;
            const isSectionBreak = i === 7;
            return (
              <React.Fragment key={`${item.id}-${i}`}>
                {isSectionBreak && <div className="pt-3 pb-1 text-[11px] font-semibold text-gray-500">This PC</div>}
                <button
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors text-left ${
                    active ? 'bg-blue-100/80 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-200/70'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 bg-white border-b border-gray-200 shrink-0">
          <button onClick={goBack} disabled={historyIndex === 0} className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Back">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={goForward} disabled={historyIndex >= history.length - 1} className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Forward">
            <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={goUp} disabled={resolved.kind === 'home'} className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors" title="Up">
            <ArrowUp className="w-4 h-4" />
          </button>
          <button onClick={() => setQuery('')} className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Address bar (breadcrumbs) */}
          <div className="flex-1 flex items-center gap-1 mx-1 px-3 py-1.5 bg-gray-100 rounded-md min-w-0">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={`${crumb.id}-${idx}`}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />}
                <button
                  onClick={() => navigate(crumb.id)}
                  className={`text-[13px] truncate rounded px-1 hover:bg-white transition-colors ${
                    idx === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-44 pl-8 pr-3 py-1.5 rounded-md bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none text-[13px]"
            />
          </div>
        </div>

        {/* Command bar */}
        {resolved.kind === 'folder' && !isRecycle && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white border-b border-gray-100 shrink-0">
            <button
              onClick={() => onAddFolder(resolved.folder.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FolderPlus className="w-4 h-4 text-amber-500" /> New folder
            </button>
            <button
              onClick={() => onAddProject(resolved.folder.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4 text-blue-500" /> Add project
            </button>
            <div className="flex-1" />
            <span className="text-xs text-gray-400">{filteredSubfolders.length + filteredProjects.length} items</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          {resolved.kind === 'home' && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-sky-500" /> This PC
              </h2>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-2">Folders</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
                {rootFolders.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => navigate(f.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(f.id);
                      }
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                  >
                    <Win11Icon name={f.name} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-gray-800 group-hover:text-blue-700 truncate font-medium">{f.name}</p>
                      <p className="text-[11px] text-gray-400">Folder</p>
                    </div>
                    <div
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onEditFolder(f)}
                        className="p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
                        title="Rename"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteFolder(f.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-2">Portfolio apps</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {[
                  { id: 'about', label: 'About Me', icon: '👤' },
                  { id: 'skills', label: 'Skills', icon: '🏆' },
                  { id: 'resume', label: 'Resume', icon: '📄' },
                  { id: 'contact', label: 'Contact', icon: '✉️' },
                  { id: 'browser', label: 'Browser', icon: '🌐' },
                  { id: 'terminal', label: 'Command Prompt', icon: '💻' },
                ].map((app) => (
                  <button
                    key={app.id}
                    onClick={() => onOpenApp(app.id)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                  >
                    <span className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-lg">{app.icon}</span>
                    <span className="text-[13px] text-gray-800 group-hover:text-blue-700 truncate font-medium">{app.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {resolved.kind === 'folder' && isRecycle && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recycle Bin</h2>
              {renderEmpty(<Trash2 className="w-8 h-8" />, 'The Recycle Bin is empty', 'Deleted folders and projects will appear here.')}
            </>
          )}

          {resolved.kind === 'folder' && !isRecycle && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{resolved.folder.name}</h2>
              {filteredSubfolders.length === 0 && filteredProjects.length === 0 ? (
                renderEmpty(<FolderOpen className="w-8 h-8" />, 'This folder is empty', 'Add a project or create a subfolder to organize your portfolio.')
              ) : (
                <div className="space-y-6">
                  {filteredSubfolders.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-2">Folders</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {filteredSubfolders.map((f) => (
                          <div
                            key={f.id}
                            onClick={() => navigate(f.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                navigate(f.id);
                              }
                            }}
                            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                          >
                            <Win11Icon name={f.name} size={40} />
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] text-gray-800 group-hover:text-blue-700 truncate font-medium">{f.name}</p>
                              <p className="text-[11px] text-gray-400">Folder</p>
                            </div>
                            <div
                              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => onEditFolder(f)}
                                className="p-1.5 rounded hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
                                title="Rename"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteFolder(f.id)}
                                className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {filteredProjects.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-2">Projects</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredProjects.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => onOpenProject(p)}
                            className="group border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                          >
                            {p.imageUrl ? (
                              <div className="h-24 bg-gray-100 relative overflow-hidden">
                                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                {p.featured && (
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-400 text-[10px] font-bold text-amber-950">
                                    ⭐ Featured
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div className="h-16 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center justify-center">
                                <Code className="w-6 h-6 text-blue-500" />
                              </div>
                            )}
                            <div className="p-3">
                              <div className="flex items-start justify-between gap-2">
                                <h5 className="text-[13px] font-semibold text-gray-900 group-hover:text-blue-700 line-clamp-1">{p.title}</h5>
                                {p.stars ? (
                                  <span className="flex items-center gap-0.5 text-[11px] text-amber-500 shrink-0">
                                    <Star className="w-3 h-3 fill-amber-400" /> {p.stars}
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.tagline}</p>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {new Date(p.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => onEditProject(p)}
                                    className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => onDeleteProject(p.id)}
                                    className="p-1 rounded hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {resolved.kind === 'virtual' && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{resolved.label}</h2>
              {renderEmpty(
                resolved.label === 'Downloads' ? <Download className="w-8 h-8" /> : resolved.label === 'Videos' ? <Video className="w-8 h-8" /> : <Music className="w-8 h-8" />,
                `This folder is empty`,
                'Your downloaded files would appear here.'
              )}
            </>
          )}

          {resolved.kind === 'missing' && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">This PC</h2>
              {renderEmpty(<HardDrive className="w-8 h-8" />, 'Folder not found', 'This folder may have been deleted.')}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
