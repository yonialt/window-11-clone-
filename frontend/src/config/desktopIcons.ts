// ============================================================================
// DESKTOP ICONS & PORTFOLIO APPS CONFIGURATION
// ============================================================================
// This configuration file defines the default desktop icons for your portfolio.
// Each icon on the desktop maps to a portfolio section or desktop window.
// ============================================================================

export interface DesktopIconConfig {
  id: string;
  name: string;
  type: 'about' | 'projects' | 'skills' | 'resume' | 'contact' | 'folder' | 'terminal';
  iconName: string;
  color: 'blue' | 'amber' | 'emerald' | 'purple' | 'cyan' | 'rose' | 'slate';
  description: string;
  targetWindowId?: string;
  actionUrl?: string; // Optional direct link or PDF path
}

export const DEFAULT_DESKTOP_ICONS: DesktopIconConfig[] = [
  {
    id: 'app-about',
    name: 'About Me',
    type: 'about',
    iconName: 'user',
    color: 'blue',
    description: 'Personal background, bio, experience, and contact links',
    targetWindowId: 'win-about-me',
  },
  {
    id: 'app-projects',
    name: 'Projects',
    type: 'projects',
    iconName: 'briefcase',
    color: 'amber',
    description: 'Interactive portfolio showcase with project thumbnails and live links',
    targetWindowId: 'folder-other-projects',
  },
  {
    id: 'app-skills',
    name: 'Skills',
    type: 'skills',
    iconName: 'code',
    color: 'emerald',
    description: 'Tech stack, frameworks, tools, and engineering proficiencies',
    targetWindowId: 'win-skills',
  },
  {
    id: 'app-resume',
    name: 'Resume',
    type: 'resume',
    iconName: 'file-text',
    color: 'purple',
    description: 'Downloadable PDF resume and career history breakdown',
    targetWindowId: 'win-resume',
    actionUrl: '/resume.pdf',
  },
  {
    id: 'app-contact',
    name: 'Contact',
    type: 'contact',
    iconName: 'mail',
    color: 'rose',
    description: 'Direct email contact form and social media channels',
    targetWindowId: 'win-contact',
  },
];

// Start menu branding setting
export const START_MENU_CONFIG = {
  brandingName: 'Yonatan Altaye',
  brandingSubtext: 'Software Engineer | Network & System Admin',
  logoText: 'YA',
};

// Default Desktop Wallpaper
export const DEFAULT_WALLPAPER_CONFIG = {
  name: 'Dark Blue Space Gradient',
  value: 'radial-gradient(circle at 75% 30%, #1a5eb0 0%, #0c2340 45%, #050d1a 100%)',
};
