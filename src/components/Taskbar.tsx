import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import windowsExplorer from '../assets/icons/windows-explorer.svg';
import settings from '../assets/icons/settings.svg';
import {
  Search,
  Wifi,
  Volume2,
  Battery,
  Bell,
  FolderOpen,
  Terminal,
  ChevronUp,
  Check,
} from 'lucide-react';
import { WindowItem } from '../types';
import { QuickSettingsFlyout } from './QuickSettingsFlyout';
import { CalendarFlyout } from './CalendarFlyout';
import { NotificationsFlyout } from './NotificationsFlyout';
import { WeatherWidget } from './WeatherWidget';

interface TaskbarProps {
  onOpenFileExplorer: () => void;
  onOpenBrowser: () => void;
  onOpenTerminal: () => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  onToggleTaskView: () => void;
  isTaskViewOpen?: boolean;
  windows: WindowItem[];
  /** Per-window-type icons (same set as the window title bars) */
  windowIcons: Record<string, React.ReactNode>;
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onWindowClick: (win: WindowItem) => void;
}

interface PinnedApp {
  /** DOM id for the taskbar button */
  id: string;
  /** Match key used to group windows under this pin (see appIdForWindow) */
  appId: string;
  label: string;
  icon: React.ReactNode;
  /** Launch the app when no window for it is open yet */
  launch: () => void;
}

type FlyoutType = 'quick' | 'calendar' | 'notifications' | 'lang' | null;

// Input languages shown in the taskbar language selector (English + Amharic only)
const LANGUAGES = [
  { code: 'ENG', label: 'English (United States)', display: 'ENG' },
  { code: 'AMH', label: 'አማርኛ (ኢትዮጵያ)', display: 'አማ' },
] as const;

const TaskbarIcon: React.FC<{
  id: string;
  onClick: () => void;
  title: string;
  isActive?: boolean;
  hasRunning?: boolean;
  children: React.ReactNode;
}> = ({ id, onClick, title, isActive, hasRunning, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = React.useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = () => {
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 500);
  };
  const handleMouseLeave = () => {
    clearTimeout(tooltipTimer.current);
    setShowTooltip(false);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        id={id}
        onClick={onClick}
        className="relative flex items-center justify-center rounded"
        style={{
          width: 36,
          height: 32,
          background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
          boxShadow: isActive
            ? '0 0 12px rgba(79, 195, 247, 0.35), inset 0 0 0 1px rgba(255,255,255,0.08)'
            : undefined,
        }}
        whileHover={{ background: 'rgba(255,255,255,0.10)' }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.12 }}
      >
        {children}
      </motion.button>

      {/* Active indicator */}
      {hasRunning && (
        <div
          className="absolute bottom-[3px] rounded-full"
          style={{
            height: 3,
            width: isActive ? 14 : 6,
            background: isActive ? '#4FC3F7' : 'rgba(255,255,255,0.45)',
            boxShadow: isActive ? '0 0 6px rgba(79,195,247,0.8)' : undefined,
            transition: 'width 0.2s',
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-11 left-1/2 -translate-x-1/2 px-2 py-1 text-white text-xs rounded whitespace-nowrap pointer-events-none z-[110]"
            style={{
              background: 'rgba(28,28,28,0.96)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Taskbar: React.FC<TaskbarProps> = ({
  onOpenBrowser,
  onOpenTerminal,
  onOpenSettings,
  onOpenSearch,
  windows,
  windowIcons,
  activeWindowId,
  isStartMenuOpen,
  onToggleStartMenu,
  onWindowClick,
  onOpenFileExplorer,
  onToggleTaskView,
  isTaskViewOpen,
}) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [activeFlyout, setActiveFlyout] = useState<FlyoutType>(null);
  const flyoutRef = React.useRef<HTMLDivElement>(null);
  const [currentLang, setCurrentLang] = useState<string>('ENG');
  const currentLangInfo = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }));
    };
    update();
    const t = setInterval(update, 10000);
    return () => clearInterval(t);
  }, []);

  // ESC closes any open tray flyout
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveFlyout(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Click-outside handling: keeps taskbar buttons live while a flyout is open
  useEffect(() => {
    if (!activeFlyout) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (flyoutRef.current?.contains(target)) return;
      const trigger = target.closest('[data-flyout-trigger]') as HTMLElement | null;
      if (trigger) {
        const type = trigger.getAttribute('data-flyout-trigger') as FlyoutType;
        if (type === activeFlyout) return;
        setActiveFlyout(null);
        return;
      }
      setActiveFlyout(null);
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [activeFlyout]);

  const toggleFlyout = (type: Exclude<FlyoutType, null>) => {
    setActiveFlyout((prev) => (prev === type ? null : type));
  };

  const toggleStart = () => {
    setActiveFlyout(null);
    onToggleStartMenu();
  };

  // Maps a window to the taskbar app that represents it. Folder windows and
  // File Explorer share the Explorer pin; every other window type maps to its
  // own app (calculator -> Calculator icon, contact -> Contact icon, ...).
  const appIdForWindow = (win: WindowItem): string => {
    if (win.type === 'folder' || win.type === 'file-explorer') return 'explorer';
    return win.type;
  };

  // True when a window is represented by one of the always-pinned app icons
  const isPinnedAppWindow = (win: WindowItem) =>
    pinnedApps.some((app) => appIdForWindow(win) === app.appId);

  // Taskbar icon click: launch the app when nothing is running, otherwise
  // toggle/focus the most relevant window (the active one, else the most
  // recently focused) via the same logic used by running-window buttons.
  const handleAppClick = (app: PinnedApp) => {
    const appWindows = windows.filter((w) => appIdForWindow(w) === app.appId);
    if (appWindows.length === 0) {
      app.launch();
      return;
    }
    const representative =
      appWindows.find((w) => w.id === activeWindowId) ??
      appWindows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b));
    onWindowClick(representative);
  };

  const pinnedApps: PinnedApp[] = [
    {
      id: 'taskbar-pin-explorer',
      appId: 'explorer',
      label: 'File Explorer',
      icon: <img src={windowsExplorer} alt="File Explorer" className="w-5 h-5 object-contain" />,
      launch: onOpenFileExplorer,
    },
    {
      id: 'taskbar-pin-browser',
      appId: 'browser',
      label: 'Browser',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 48 48"
          width="20"
          height="20"
        >
          <defs>
            <linearGradient id="a" x1="3.2173" y1="15" x2="44.7812" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#d93025" />
              <stop offset="1" stopColor="#ea4335" />
            </linearGradient>
            <linearGradient id="b" x1="20.7219" y1="47.6791" x2="41.5039" y2="11.6837" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fcc934" />
              <stop offset="1" stopColor="#fbbc04" />
            </linearGradient>
            <linearGradient id="c" x1="26.5981" y1="46.5015" x2="5.8161" y2="10.506" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1e8e3e" />
              <stop offset="1" stopColor="#34a853" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="23.9947" r="12" style={{ fill: '#fff' }} />
          <path
            d="M3.2154,36A24,24,0,1,0,12,3.2154,24,24,0,0,0,3.2154,36ZM34.3923,18A12,12,0,1,1,18,13.6077,12,12,0,0,1,34.3923,18Z"
            style={{ fill: 'none' }}
          />
          <path
            d="M24,12H44.7812a23.9939,23.9939,0,0,0-41.5639.0029L13.6079,30l.0093-.0024A11.9852,11.9852,0,0,1,24,12Z"
            style={{ fill: 'url(#a)' }}
          />
          <circle cx="24" cy="24" r="9.5" style={{ fill: '#1a73e8' }} />
          <path
            d="M34.3913,30.0029,24.0007,48A23.994,23.994,0,0,0,44.78,12.0031H23.9989l-.0025.0093A11.985,11.985,0,0,1,34.3913,30.0029Z"
            style={{ fill: 'url(#b)' }}
          />
          <path
            d="M13.6086,30.0031,3.218,12.006A23.994,23.994,0,0,0,24.0025,48L34.3931,30.0029l-.0067-.0068a11.9852,11.9852,0,0,1-20.7778.007Z"
            style={{ fill: 'url(#c)' }}
          />
        </svg>
      ),
      launch: onOpenBrowser,
    },
    {
      id: 'taskbar-pin-terminal',
      appId: 'terminal',
      label: 'Terminal',
      icon: <Terminal className="w-5 h-5" style={{ color: '#090a0aff' }} />,
      launch: onOpenTerminal,
    },
    {
      id: 'taskbar-pin-settings',
      appId: 'settings',
      label: 'Settings',
      icon: <img src={settings} alt="Settings" className="w-5 h-5 object-contain" />,
      launch: onOpenSettings,
    },
  ];

  const trayButtonBase = (active: boolean) => ({
    background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
  });

  return (
    <>
      <div
        id="windows-taskbar"
        className="fixed bottom-0 left-0 right-0 z-[100] flex items-center select-none"
        style={{
          height: 40,
          background: 'rgba(0, 25, 250, 0.06)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* ── LEFT: Weather widget ── */}
        <div className="absolute left-0 flex items-center h-full" style={{ paddingLeft: 6 }}>
          <WeatherWidget />
        </div>

        {/* ── CENTER CLUSTER ── */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5">
          {/* Start button */}
          <TaskbarIcon
            id="taskbar-btn-start"
            onClick={toggleStart}
            title="Start"
            isActive={isStartMenuOpen}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 128"
              width="17"
              height="17"
              animate={{ scale: isStartMenuOpen ? 0.9 : 1 }}
            >
              <path
                fill="#0078D4"
                d="M67.328 67.331h60.669V128H67.328zm-67.325 0h60.669V128H.003zM67.328 0h60.669v60.669H67.328zM.003 0h60.669v60.669H.003z"
              />
            </motion.svg>
          </TaskbarIcon>

          {/* Search pill */}
          <motion.button
            id="taskbar-btn-search"
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-full mr-1"
            style={{
              height: 30,
              padding: '0 13px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
            whileHover={{ background: 'rgba(255,255,255,0.14)' }}
            whileTap={{ scale: 0.96 }}
            title="Search"
          >
            <Search className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-xs text-slate-300" style={{ fontFamily: '"Segoe UI", Inter, sans-serif' }}>
              Search
            </span>
          </motion.button>
          <TaskbarIcon
            id="taskbar-btn-taskview"
            onClick={onToggleTaskView}
            title="Task View"
            isActive={isTaskViewOpen}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background overlapping window */}
              <rect x="2" y="2" width="10" height="10" rx="1.5" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.2" />
              {/* Foreground active window */}
              <rect x="6" y="6" width="10" height="10" rx="1.5" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.2" />
            </svg>
          </TaskbarIcon>

          {/* Pinned apps — folder & File Explorer windows all light up the Explorer pin */}
          {pinnedApps.map((app) => {
            const appWindows = windows.filter((w) => appIdForWindow(w) === app.appId);
            const activeWin = appWindows.find((w) => w.id === activeWindowId);
            const isActive = !!activeWin && !activeWin.isMinimized;
            return (
              <TaskbarIcon
                key={app.id}
                id={app.id}
                onClick={() => handleAppClick(app)}
                title={app.label}
                isActive={isActive}
                hasRunning={appWindows.length > 0}
              >
                {app.icon}
              </TaskbarIcon>
            );
          })}

          {/* Running app icons — one button per window not covered by a pinned icon */}
          {windows
            .filter((win) => !isPinnedAppWindow(win))
            .map((win) => {
              const isActive = activeWindowId === win.id && !win.isMinimized;
              return (
                <TaskbarIcon
                  key={win.id}
                  id={`taskbar-win-${win.id}`}
                  onClick={() => onWindowClick(win)}
                  title={win.title}
                  isActive={isActive}
                  hasRunning
                >
                  <span className="flex items-center justify-center" style={{ width: 20, height: 20 }}>
                    {windowIcons[win.type] ?? (
                      <FolderOpen className="w-4 h-4" style={{ color: '#FDB44B' }} />
                    )}
                  </span>
                </TaskbarIcon>
              );
            })}
        </div>

        {/* ── RIGHT: System tray ── */}
        <div className="absolute right-0 flex items-center h-full" style={{ paddingRight: 4 }}>
          <motion.button
            id="taskbar-btn-chevron"
            data-flyout-trigger="quick"
            onClick={() => toggleFlyout('quick')}
            className="flex items-center justify-center rounded text-slate-400 hover:text-white"
            style={{ width: 24, height: 34, ...trayButtonBase(activeFlyout === 'quick') }}
            whileHover={{ background: 'rgba(255,255,255,0.08)' }}
            title="Show hidden icons"
          >
            <ChevronUp className="w-3 h-3" />
          </motion.button>

          <motion.button
            id="taskbar-btn-quicksettings"
            data-flyout-trigger="quick"
            onClick={() => toggleFlyout('quick')}
            className="flex items-center gap-1.5 rounded"
            style={{
              height: 34,
              padding: '0 8px',
              color: 'rgba(255,255,255,0.85)',
              ...trayButtonBase(activeFlyout === 'quick'),
            }}
            whileHover={{ background: 'rgba(255,255,255,0.08)' }}
            title="Network, Volume, Battery"
          >
            <Wifi className="w-3.5 h-3.5" />
            <Volume2 className="w-3.5 h-3.5" />
            <Battery className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            id="taskbar-btn-lang"
            data-flyout-trigger="lang"
            onClick={() => toggleFlyout('lang')}
            className="flex items-center justify-center rounded"
            style={{
              height: 34,
              padding: '0 6px',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: '"Segoe UI", Inter, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              minWidth: 34,
              ...trayButtonBase(activeFlyout === 'lang'),
            }}
            whileHover={{ background: 'rgba(255,255,255,0.08)' }}
            title="Input indicator"
          >
            {currentLangInfo.display}
          </motion.button>

          <motion.button
            id="taskbar-btn-clock"
            data-flyout-trigger="calendar"
            onClick={() => toggleFlyout('calendar')}
            className="flex flex-col items-end justify-center rounded"
            style={{
              height: 34,
              padding: '0 8px',
              gap: 1,
              fontFamily: '"Segoe UI", Inter, sans-serif',
              ...trayButtonBase(activeFlyout === 'calendar'),
            }}
            whileHover={{ background: 'rgba(255,255,255,0.08)' }}
            title="Date and time"
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>
              {time || '12:00 PM'}
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', lineHeight: 1 }}>
              {date || '8/6/2026'}
            </span>
          </motion.button>

          <motion.button
            id="taskbar-btn-notifications"
            data-flyout-trigger="notifications"
            onClick={() => toggleFlyout('notifications')}
            className="flex items-center justify-center rounded"
            style={{ width: 30, height: 34, color: 'rgba(255,255,255,0.7)', ...trayButtonBase(activeFlyout === 'notifications') }}
            whileHover={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>

      {/* ── System Tray Flyouts ── */}
      <AnimatePresence>
        {activeFlyout && (
          <motion.div
            ref={flyoutRef}
            className="fixed bottom-[44px] right-2 z-[110]"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {activeFlyout === 'quick' && <QuickSettingsFlyout onClose={() => setActiveFlyout(null)} />}
            {activeFlyout === 'calendar' && <CalendarFlyout onClose={() => setActiveFlyout(null)} />}
            {activeFlyout === 'notifications' && (
              <NotificationsFlyout onClose={() => setActiveFlyout(null)} onOpenSettings={onOpenSettings} />
            )}
            {activeFlyout === 'lang' && (
              <div
                className="w-48 rounded-2xl overflow-hidden shadow-2xl border border-white/10 text-slate-100 py-1.5"
                style={{ background: 'rgba(32,32,32,0.97)', backdropFilter: 'blur(40px)' }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setActiveFlyout(null);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:bg-white/8 transition-colors text-left"
                  >
                    <span>{lang.label}</span>
                    {lang.code === currentLang && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
