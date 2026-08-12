import React, { useState, useEffect, useRef } from 'react';
import { X, Code, Sparkles, Plus, Trash2, Link as LinkIcon, Github, Image as ImageIcon } from 'lucide-react';
import { Project, Folder as FolderType } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  projectToEdit?: Project | null;
  defaultFolderId: string;
  folders: FolderType[];
  onClose: () => void;
  onSubmit: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  projectToEdit,
  defaultFolderId,
  folders,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState(defaultFolderId);
  const [tagsInput, setTagsInput] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');
  const [featured, setFeatured] = useState(false);
  const [stars, setStars] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setTagline(projectToEdit.tagline);
      setDescription(projectToEdit.description);
      setFolderId(projectToEdit.folderId);
      setTagsInput(projectToEdit.tags.join(', '));
      setTechStackInput(projectToEdit.techStack.join(', '));
      setGithubUrl(projectToEdit.githubUrl || '');
      setLiveUrl(projectToEdit.liveUrl || '');
      setImageUrl(projectToEdit.imageUrl || '');
      setFeatured(!!projectToEdit.featured);
      setStars(projectToEdit.stars || 0);
    } else {
      setTitle('');
      setTagline('');
      setDescription('');
      setFolderId(defaultFolderId);
      setTagsInput('React, TypeScript, Tailwind');
      setTechStackInput('React 19, Tailwind CSS v4, Vite');
      setGithubUrl('');
      setLiveUrl('');
      setImageUrl('');
      setFeatured(false);
      setStars(0);
    }
  }, [projectToEdit, defaultFolderId, isOpen]);

  if (!isOpen) return null;

  // Raster formats only (SVG can taint the canvas and break data-URL export)
  const isSupportedImage = (file: File) => {
    if (file.type) return /^image\/(png|jpe?g|webp|gif|bmp)$/.test(file.type);
    // Some systems report an empty MIME type — fall back to the file extension
    return /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name);
  };

  // Reads a picked image, resizes it to a small cover thumbnail and stores it
  // as a data URL so it works with the browser-local project storage.
  const handleImageFile = (file: File) => {
    setImageError('');
    if (!isSupportedImage(file)) {
      setImageError('Please choose an image file (PNG, JPG, WebP, GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError('Image is too large (max 10 MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setImageError('Could not process this image.');
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          setImageUrl(canvas.toDataURL('image/jpeg', 0.82));
        } catch {
          setImageError('Could not process this image (unsupported format).');
        }
      };
      img.onerror = () => setImageError('Could not read this image.');
      img.src = String(reader.result);
    };
    reader.onerror = () => setImageError('Could not read this file.');
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      folderId,
      tags,
      techStack,
      githubUrl: githubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      featured,
      stars: Number(stars) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800/80 border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {projectToEdit ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
              </h3>
              <p className="text-xs text-slate-400">
                Add project details, tech stack, and links to your folder
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AI Workspace IDE, Cloud Analytics..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Folder Destination */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Target Folder <span className="text-rose-400">*</span>
              </label>
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none"
              >
                {folders
                  .filter((f) => !f.isSystem)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Stars Count */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                GitHub Stars
              </label>
              <input
                type="number"
                min="0"
                value={stars}
                onChange={(e) => setStars(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Short Tagline */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Short Tagline / Summary
            </label>
            <input
              type="text"
              placeholder="e.g. Real-time telemetry and revenue data visualization"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Full Overview & Key Features
            </label>
            <textarea
              rows={3}
              placeholder="Detailed description of features, problem solved, architecture choices..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Tags & Tech Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Filter Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="React, Tailwind, Node, AI"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tech Stack Badges (comma-separated)
              </label>
              <input
                type="text"
                placeholder="React 19, Vite, Express, PostgreSQL"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* External Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Live Preview Link
              </label>
              <input
                type="url"
                placeholder="https://my-app.example.com"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Cover / Screenshot Image */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Cover / Screenshot Image
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Paste an image URL (https://...) or upload a file"
                value={imageUrl}
                onChange={(e) => {
                  setImageError('');
                  setImageUrl(e.target.value);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors shrink-0"
                title="Upload image from your computer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
                e.target.value = '';
              }}
            />
            {imageUrl && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={imageUrl}
                  alt="Cover preview"
                  className="w-32 h-20 object-cover rounded-lg border border-slate-700 bg-slate-950"
                />
                <div className="flex flex-col gap-1 text-[11px] text-slate-400">
                  <span>
                    {imageUrl.startsWith('data:')
                      ? 'Uploaded image (resized & stored in browser)'
                      : 'Remote image URL'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageError('');
                      setImageUrl('');
                    }}
                    className="text-rose-400 hover:underline w-fit"
                  >
                    Remove image
                  </button>
                </div>
              </div>
            )}
            {imageError && <p className="mt-1.5 text-[11px] text-rose-400">{imageError}</p>}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="chk-featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
            />
            <label htmlFor="chk-featured" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Pin as Featured Project
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md active:scale-95"
            >
              {projectToEdit ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
