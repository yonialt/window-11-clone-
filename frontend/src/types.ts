export type FolderIconType =
  | 'folder'
  | 'code'
  | 'briefcase'
  | 'sparkles'
  | 'image'
  | 'document'
  | 'shield'
  | 'terminal'
  | 'trash'
  | 'star'
  | 'layer';

export type FolderColor =
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'emerald'
  | 'rose'
  | 'amber'
  | 'cyan'
  | 'slate';

export interface Folder {
  id: string;
  name: string;
  icon: FolderIconType;
  color: FolderColor;
  parentId: string | null;
  createdAt: string;
  isSystem?: boolean;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  folderId: string;
  tags: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  stars?: number;
}

export interface DeletedItem {
  id: string;
  type: 'folder' | 'project';
  data: Folder | Project;
  deletedAt: string;
}

export interface DesktopPosition {
  x: number;
  y: number;
}

export type WindowType =
  | 'folder'
  | 'project'
  | 'settings'
  | 'terminal'
  | 'about'
  | 'skills'
  | 'resume'
  | 'contact'
  | 'browser'
  | 'calculator'
  | 'notepad'
  | 'file-explorer'
  | 'add-folder'
  | 'add-project';

export interface WindowItem {
  id: string;
  type: WindowType;
  targetId: string | null;
  title: string;
  icon?: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: DesktopPosition;
  size: { width: number; height: number };
  desktopId?: number;
  notepadContent?: string;
  browserUrl?: string;
  /** Current snap state: half-screen left, half-screen right, or none */
  snap?: 'left' | 'right' | null;
  /** Geometry to restore when un-maximizing / unsnapping */
  restoreBounds?: {
    position: DesktopPosition;
    size: { width: number; height: number };
  } | null;
  /** Light-themed window chrome (used by Settings & File Explorer) */
  lightChrome?: boolean;
  /** File Explorer navigation location (folder id or virtual location) */
  explorerLocation?: string;
}

export interface Wallpaper {
  id: string;
  name: string;
  type: 'image' | 'gradient';
  value: string;
  thumbnail: string;
}

export type ViewMode = 'grid' | 'list' | 'details';

export interface DeveloperProfile {
  name: string;
  role: string;
  bio: string;
  value: string;
  avatarUrl: string;
  github: string;
  linkedin: string;
  email: string;
  location: string;
}

export interface VirtualDesktop {
  id: number;
  name: string;
}

export interface SearchResult {
  id: string;
  type: 'folder' | 'project' | 'app';
  title: string;
  subtitle?: string;
  icon?: string;
  action: () => void;
}

export interface SystemSettings {
  wifi: boolean;
  bluetooth: boolean;
  airplaneMode: boolean;
  nightLight: boolean;
  focusAssist: boolean;
  volume: number;
  brightness: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
