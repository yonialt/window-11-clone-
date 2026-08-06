import React, { useState, useMemo } from 'react';
import { 
  FolderPlus, 
  Plus, 
  Search, 
  Grid, 
  List, 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Star, 
  Trash2, 
  Edit3, 
  FolderOpen, 
  Tag, 
  Sparkles, 
  Code,
  Calendar
} from 'lucide-react';
import { Folder as FolderType, Project, ViewMode } from '../types';
import { getFolderIconComponent, getFolderColorStyle } from '../lib/folderHelpers';
import { Win11Icon } from './Win11Icon';

interface FileExplorerProps {
  currentFolder: FolderType;
  subfolders: FolderType[];
  projects: Project[];
  allFolders: FolderType[];
  onNavigateFolder: (folderId: string) => void;
  onOpenProject: (project: Project) => void;
  onAddFolderClick: (parentId: string) => void;
  onAddProjectClick: (folderId: string) => void;
  onEditFolder: (folder: FolderType) => void;
  onDeleteFolder: (folderId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onRestoreFolder?: (folderId: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  currentFolder,
  subfolders,
  projects,
  allFolders,
  onNavigateFolder,
  onOpenProject,
  onAddFolderClick,
  onAddProjectClick,
  onEditFolder,
  onDeleteFolder,
  onEditProject,
  onDeleteProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'stars'>('name');

  // Breadcrumbs calculation
  const breadcrumbs = useMemo(() => {
    const chain: FolderType[] = [];
    let curr: FolderType | undefined = currentFolder;
    while (curr) {
      chain.unshift(curr);
      curr = allFolders.find((f) => f.id === curr?.parentId);
    }
    return chain;
  }, [currentFolder, allFolders]);

  // Filter subfolders and projects
  const filteredSubfolders = useMemo(() => {
    return subfolders.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subfolders, searchQuery]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesQuery =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [projects, searchQuery, sortBy]);

  const parentFolder = allFolders.find((f) => f.id === currentFolder.parentId);

  return (
    <div className="flex flex-col h-full bg-slate-950/80 text-slate-100">
      {/* Explorer Top Navigation & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/90 border-b border-slate-800 text-xs">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          {parentFolder && (
            <button
              id={`nav-back-${currentFolder.id}`}
              onClick={() => onNavigateFolder(parentFolder.id)}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors mr-1"
              title="Go to parent folder"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <span
            onClick={() => {
              /* root click could reset to top */
            }}
            className="text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            Desktop
          </span>

          {breadcrumbs.map((folder, idx) => (
            <React.Fragment key={folder.id}>
              <span className="text-slate-600">/</span>
              <button
                id={`breadcrumb-${folder.id}`}
                onClick={() => onNavigateFolder(folder.id)}
                className={`font-medium transition-colors ${
                  idx === breadcrumbs.length - 1
                    ? 'text-amber-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id={`btn-add-folder-sub-${currentFolder.id}`}
            onClick={() => onAddFolderClick(currentFolder.id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-medium transition-all shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Folder</span>
          </button>

          <button
            id={`btn-add-project-${currentFolder.id}`}
            onClick={() => onAddProjectClick(currentFolder.id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Filter & View Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-slate-900/50 border-b border-slate-800/80 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={`Search in ${currentFolder.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
          />
        </div>

        {/* View Mode & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'stars')}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none"
          >
            <option value="name">Sort by Name</option>
            <option value="date">Sort by Date</option>
            <option value="stars">Sort by Stars</option>
          </select>
        </div>
      </div>

      {/* Folder Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {filteredSubfolders.length === 0 && filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3 shadow-inner">
              <FolderOpen className="w-8 h-8 text-amber-500/60" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">This folder is empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Organize your portfolio by adding new projects or creation subfolders inside {currentFolder.name}.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => onAddFolderClick(currentFolder.id)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium hover:bg-amber-500/30 transition-colors"
              >
                + New Folder
              </button>
              <button
                onClick={() => onAddProjectClick(currentFolder.id)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition-colors shadow-sm"
              >
                + Add Project
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Subfolders Section */}
            {filteredSubfolders.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Subfolders ({filteredSubfolders.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {filteredSubfolders.map((f) => {
                    return (
                      <div
                        key={f.id}
                        onClick={() => onNavigateFolder(f.id)}
                        className="group flex items-center gap-3 p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800/90 cursor-pointer transition-all hover:scale-[1.02]"
                      >
                        <div className="shrink-0 p-1 rounded-lg">
                          <Win11Icon name={f.name} size={32} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-100 truncate group-hover:text-amber-300">
                            {f.name}
                          </p>
                          <p className="text-[10px] text-slate-400">Folder</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {filteredProjects.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Portfolio Projects ({filteredProjects.length})
                </h4>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => onOpenProject(project)}
                        className="group relative flex flex-col justify-between bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                      >
                        {/* Cover image or visual header */}
                        {project.imageUrl ? (
                          <div className="h-32 w-full overflow-hidden bg-slate-950 relative">
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            {project.featured && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-[10px] font-bold text-slate-950 flex items-center gap-1 shadow-xs">
                                <Sparkles className="w-3 h-3" /> Featured
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="h-20 w-full bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border-b border-slate-800/80 p-3 flex items-center justify-between">
                            <Code className="w-6 h-6 text-blue-400" />
                            {project.featured && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Featured
                              </span>
                            )}
                          </div>
                        )}

                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">
                                {project.title}
                              </h5>
                              {project.stars !== undefined && project.stars > 0 && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 shrink-0">
                                  <Star className="w-3 h-3 fill-amber-400" /> {project.stars}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {project.tagline || project.description}
                            </p>
                          </div>

                          {/* Tech Stack Tags */}
                          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 text-[10px] font-medium border border-slate-700/60"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 3 && (
                              <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                                +{project.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick action buttons on card bottom */}
                        <div className="px-3.5 py-2 bg-slate-950/60 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                          <span className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onEditProject(project)}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              title="Edit Project"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProject(project.id)}
                              className="p-1 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-1.5">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => onOpenProject(project)}
                        className="group flex items-center justify-between p-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                            <Code className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 truncate">
                                {project.title}
                              </h5>
                              {project.featured && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {project.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 shrink-0 text-xs" onClick={(e) => e.stopPropagation()}>
                          <div className="hidden sm:flex items-center gap-1">
                            {project.tags.slice(0, 2).map((t, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => onEditProject(project)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProject(project.id)}
                            className="p-1 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
