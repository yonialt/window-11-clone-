import React from 'react';
import { 
  ExternalLink, 
  Github, 
  Star, 
  Sparkles, 
  Calendar, 
  Tag, 
  Folder, 
  Edit3, 
  Trash2,
  Code2,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Project, Folder as FolderType } from '../types';

interface ProjectDetailViewProps {
  project: Project;
  folder?: FolderType;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  folder,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Header Banner */}
      <div className="relative w-full min-h-[200px] bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 flex flex-col justify-end">
        {project.imageUrl && (
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover filter blur-xs"
            />
            <div className="absolute inset-0 bg-slate-950/80" />
          </div>
        )}

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            {folder && (
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-blue-400" />
                {folder.name}
              </span>
            )}
            {project.featured && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Featured Project
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {project.title}
          </h2>
          <p className="text-slate-300 text-sm mt-1.5 font-medium leading-relaxed max-w-2xl">
            {project.tagline}
          </p>

          {/* Links & Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md active:scale-95"
              >
                <span>Launch Live Preview</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all shadow-sm"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={onDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/80 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Preview */}
        <div className="md:col-span-2 space-y-6">
          {project.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-slate-900">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-auto max-h-[360px] object-cover"
              />
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" /> About This Project
            </h3>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </div>
          </div>

          {project.techStack.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" /> Technology Architecture
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium shadow-2xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Metadata Sidebar */}
        <div className="space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800 h-fit">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
            Project Specs
          </h4>

          {project.stars !== undefined && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" /> GitHub Stars
              </span>
              <span className="font-bold text-amber-300">{project.stars}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" /> Date Created
            </span>
            <span className="text-slate-200 font-medium">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-amber-400" /> Location
            </span>
            <span className="text-slate-200 font-medium">
              {folder ? folder.name : 'Root Desktop'}
            </span>
          </div>

          {project.tags.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 block mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
