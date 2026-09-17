import React, { useState } from 'react';
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
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Terminal,
  Server,
  ShieldCheck,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  X
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isExpandedImage, setIsExpandedImage] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
      }
    };
    if (isImageModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isImageModalOpen]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleZoomReset = () => setZoomLevel(1);
  const handleActualSize = () => setZoomLevel(1.6);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Header Banner */}
      <div className="relative w-full min-h-[200px] bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 flex flex-col justify-end">
        {project.imageUrl && (
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <img
              src={project.imageUrl}
              alt={project.title}
              referrerPolicy="no-referrer"
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

      {/* Dedicated High-Resolution Screenshot Showcase */}
      {project.imageUrl && (
        <div className="border-b border-slate-800/80 bg-slate-950/70 px-6 py-5">
          <div className="max-w-6xl mx-auto space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Project Capture Preview
                </h3>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Original Screenshot
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpandedImage(!isExpandedImage)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
                  title={isExpandedImage ? "Show standard size" : "Expand picture size"}
                >
                  {isExpandedImage ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Standard Size</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>Make Picture Bigger</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsImageModalOpen(true);
                    setZoomLevel(1);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Full Screen & Zoom (1:1)</span>
                </button>
              </div>
            </div>

            {/* High-Resolution Image Canvas */}
            <div 
              onClick={() => {
                setIsImageModalOpen(true);
                setZoomLevel(1);
              }}
              className={`group relative w-full bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-2xl cursor-zoom-in transition-all duration-300 flex items-center justify-center p-2 sm:p-4 ${
                isExpandedImage ? 'min-h-[580px]' : 'min-h-[380px]'
              }`}
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                referrerPolicy="no-referrer"
                className={`w-full h-auto object-contain transition-all duration-300 group-hover:scale-[1.01] ${
                  isExpandedImage ? 'max-h-[850px]' : 'max-h-[540px]'
                }`}
              />
              <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors pointer-events-none" />
              
              <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xl backdrop-blur-md transition-all">
                <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Click for Full Screen & Zoom</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center font-medium">
              Click anywhere on the image to open full-screen inspector with zoom, pan, and 100% native resolution
            </p>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Description & Details */}
        <div className="md:col-span-2 space-y-6">
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

          {project.steps && project.steps.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-emerald-400" /> CI/CD Deployment Pipeline & Verification Steps
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {project.steps.length} Stages Passed · 2m 28s
                </span>
              </div>

              {/* Pipeline summary card */}
              <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400 flex items-center gap-1 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> AWS IAM
                  </div>
                  <div className="text-slate-100 font-semibold">Account 933858446201</div>
                  <div className="text-emerald-400 text-[11px] mt-0.5">Root MFA · Scoped CI User</div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400 flex items-center gap-1 mb-1">
                    <Server className="w-3.5 h-3.5 text-purple-400" /> Amazon ECR
                  </div>
                  <div className="text-slate-100 font-semibold">us-east-1</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">backend & frontend repos</div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400 flex items-center gap-1 mb-1">
                    <Terminal className="w-3.5 h-3.5 text-amber-400" /> Docker Desktop
                  </div>
                  <div className="text-slate-100 font-semibold">Local Verification</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">verify-backend :18080</div>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-slate-400 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AWS EC2 Host
                  </div>
                  <div className="text-slate-100 font-semibold">hagerawi (t3.micro)</div>
                  <div className="text-emerald-400 text-[11px] mt-0.5">3/3 checks passed</div>
                </div>
              </div>

              {/* Step list */}
              <div className="space-y-2 pt-1">
                {project.steps.map((step) => (
                  <div
                    key={step.number}
                    className="bg-slate-900/60 hover:bg-slate-900/90 rounded-xl border border-slate-800/80 p-3.5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center shrink-0">
                          {step.number}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                            {step.title}
                          </h4>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {step.duration && (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {step.duration}
                          </span>
                        )}
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>

                    {step.command && (
                      <div className="mt-2.5 pl-8.5">
                        <div className="bg-slate-950/80 px-3 py-1.5 rounded-md border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto flex items-center gap-2">
                          <Terminal className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{step.command}</span>
                        </div>
                      </div>
                    )}

                    {step.details && step.details.length > 0 && (
                      <div className="mt-2 pl-8.5 space-y-1">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="text-[12px] text-slate-400 flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold leading-none mt-1">•</span>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

      {/* Full-Screen Image Lightbox Modal */}
      {isImageModalOpen && project.imageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-2 sm:p-4 md:p-6"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-7xl h-[94vh] bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header with Interactive Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-xs sm:max-w-sm">
                  {project.title}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                  Original Screenshot
                </span>
              </div>

              {/* Zoom & Inspection Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2.5 text-xs font-mono font-semibold text-blue-400 min-w-[52px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleActualSize}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    zoomLevel > 1.2
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                  title="View at 1:1 crisp actual size"
                >
                  100% Size
                </button>

                <button
                  type="button"
                  onClick={handleZoomReset}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    zoomLevel === 1
                      ? 'bg-slate-800 text-white border-slate-600'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                  }`}
                  title="Fit whole image to window"
                >
                  Fit Window
                </button>

                <div className="h-5 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

                <button
                  type="button"
                  onClick={() => setIsImageModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors flex items-center gap-1"
                  title="Close fullscreen preview (Esc)"
                >
                  <X className="w-5 h-5" />
                  <span className="text-xs text-slate-500 hidden sm:inline">Esc</span>
                </button>
              </div>
            </div>

            {/* Lightbox Image Viewport */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-slate-950/95 select-none">
              <div className="max-w-none flex items-center justify-center min-w-full min-h-full">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  onClick={() => setZoomLevel(prev => prev > 1.2 ? 1 : 1.6)}
                  style={{
                    width: zoomLevel === 1 ? 'auto' : `${zoomLevel * 100}%`,
                    maxWidth: zoomLevel === 1 ? '100%' : 'none',
                    maxHeight: zoomLevel === 1 ? '82vh' : 'none',
                  }}
                  className={`rounded-lg border border-slate-800 shadow-2xl transition-all duration-150 ${
                    zoomLevel === 1 ? 'cursor-zoom-in object-contain' : 'cursor-zoom-out object-contain'
                  }`}
                />
              </div>
            </div>

            {/* Lightbox Footer Tip */}
            <div className="px-5 py-2 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>
                💡 Tip: Click image to toggle between Fit &amp; 100% Zoom. Scroll to pan across the capture.
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Original Image Resolution
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
