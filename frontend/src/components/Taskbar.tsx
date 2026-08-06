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
  Globe,
  Settings,
  Terminal,
  ChevronUp,
  FolderPlus,
} from 'lucide-react';
import { WindowItem } from '../types';

interface TaskbarProps {
  windows: WindowItem[];
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  onToggleStartMenu: () => void;
  onToggleTaskView: () => void;
  onWindowClick: (win: WindowItem) => void;
  onOpenAddFolderModal: () => void;
  onOpenAddProjectModal: () => void;
  onOpenTerminal: () => void;
  onOpenSettings: () => void;
}

interface PinnedApp {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

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
    tooltipTimer.current = setTimeout(() => setShowTooltip(true), 600);
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
          width: 40,
          height: 40,
          background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
        }}
        whileHover={{ background: 'rgba(255,255,255,0.10)' }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.12 }}
        title={title}
      >
        {children}
      </motion.button>

      {/* Running indicator */}
      {hasRunning && (
        <div
          className="absolute bottom-0.5 rounded-full"
          style={{
            height: 3,
            width: isActive ? 16 : 6,
            background: isActive ? '#4FC3F7' : 'rgba(255,255,255,0.5)',
            transition: 'width 0.2s',
          }}
        />
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2 py-1 text-white text-xs rounded whitespace-nowrap pointer-events-none z-50"
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
  windows,
  activeWindowId,
  isStartMenuOpen,
  onToggleStartMenu,
  onToggleTaskView,
  onWindowClick,
  onOpenAddFolderModal,
  onOpenTerminal,
  onOpenSettings,
}) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

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
  const pinnedApps: PinnedApp[] = [
    {
      id: 'taskbar-pin-explorer',
      label: 'File Explorer',
      icon: <img src={windowsExplorer} alt="File Explorer" className="w-5 h-5 object-contain" />,
      onClick: onOpenAddFolderModal,
    },
    {
      id: 'taskbar-pin-browser',
      label: 'Browser',
      // Premium gradient-globe SVG to replace the standard code-editor/browser icon
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 48 48"
          width="20"
          height="20"
        >
          <defs>
            <linearGradient
              id="a"
              x1="3.2173"
              y1="15"
              x2="44.7812"
              y2="15"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#d93025" />
              <stop offset="1" stopColor="#ea4335" />
            </linearGradient>

            <linearGradient
              id="b"
              x1="20.7219"
              y1="47.6791"
              x2="41.5039"
              y2="11.6837"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#fcc934" />
              <stop offset="1" stopColor="#fbbc04" />
            </linearGradient>

            <linearGradient
              id="c"
              x1="26.5981"
              y1="46.5015"
              x2="5.8161"
              y2="10.506"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#1e8e3e" />
              <stop offset="1" stopColor="#34a853" />
            </linearGradient>
          </defs>

          <circle cx="24" cy="23.9947" r="12" style={{ fill: "#fff" }} />

          <path
            d="M3.2154,36A24,24,0,1,0,12,3.2154,24,24,0,0,0,3.2154,36ZM34.3923,18A12,12,0,1,1,18,13.6077,12,12,0,0,1,34.3923,18Z"
            style={{ fill: "none" }}
          />

          <path
            d="M24,12H44.7812a23.9939,23.9939,0,0,0-41.5639.0029L13.6079,30l.0093-.0024A11.9852,11.9852,0,0,1,24,12Z"
            style={{ fill: "url(#a)" }}
          />

          <circle cx="24" cy="24" r="9.5" style={{ fill: "#1a73e8" }} />

          <path
            d="M34.3913,30.0029,24.0007,48A23.994,23.994,0,0,0,44.78,12.0031H23.9989l-.0025.0093A11.985,11.985,0,0,1,34.3913,30.0029Z"
            style={{ fill: "url(#b)" }}
          />

          <path
            d="M13.6086,30.0031,3.218,12.006A23.994,23.994,0,0,0,24.0025,48L34.3931,30.0029l-.0067-.0068a11.9852,11.9852,0,0,1-20.7778.007Z"
            style={{ fill: "url(#c)" }}
          />
        </svg>
      ),
      onClick: () => { },
    },
    {
      id: 'taskbar-pin-settings',
      label: 'Settings',
      icon: <img src={settings} alt="File Explorer" className="w-5 h-5 object-contain" />,
      onClick: onOpenSettings,
    },
  ];

  return (
    <div
      id="windows-taskbar"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center select-none"
      style={{
        height: 48,
        background: 'rgba(0, 25, 250, 0.06)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── CENTER CLUSTER (Win11 style) ── */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5">






        {/* Start button */}
        <TaskbarIcon
          id="taskbar-btn-start"
          onClick={onToggleStartMenu}
          title="Start"
          isActive={isStartMenuOpen}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            width="18"
            height="18"
            animate={{ scale: isStartMenuOpen ? 0.9 : 1 }}
          >
            <path
              fill="#0078D4"
              d="M67.328 67.331h60.669V128H67.328zm-67.325 0h60.669V128H.003zM67.328 0h60.669v60.669H67.328zM.003 0h60.669v60.669H.003z"
            />
          </motion.svg>
        </TaskbarIcon>


        {/* Task View */}
        <TaskbarIcon
          id="taskbar-btn-taskview"
          onClick={onToggleTaskView}
          title="Task View"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background overlapping window */}
            <rect x="2" y="2" width="10" height="10" rx="1.5" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.2" />
            {/* Foreground active window */}
            <rect x="6" y="6" width="10" height="10" rx="1.5" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.2" />
          </svg>
        </TaskbarIcon>


        {/* Pinned apps */}
        {pinnedApps.map((app) => {
          const runningWin = windows.find((w) => w.id.includes(app.id.replace('taskbar-pin-', '')));
          const isActive = runningWin ? activeWindowId === runningWin.id && !runningWin.isMinimized : false;
          return (
            <TaskbarIcon
              key={app.id}
              id={app.id}
              onClick={app.onClick}
              title={app.label}
              isActive={isActive}
              hasRunning={!!runningWin}
            >
              {app.icon}
            </TaskbarIcon>
          );
        })}



        {/* Open window tabs */}
        {windows.map((win) => {
          const isActive = activeWindowId === win.id && !win.isMinimized;
          return (
            <div key={win.id} className="relative flex flex-col items-center justify-center">
              <motion.button
                id={`taskbar-win-${win.id}`}
                onClick={() => onWindowClick(win)}
                className="flex items-center gap-1.5 rounded text-xs"
                style={{
                  height: 36,
                  padding: '0 10px',
                  maxWidth: 140,
                  background: isActive ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                  fontFamily: '"Segoe UI", Inter, sans-serif',
                  fontSize: 12,
                  borderRadius: 4,
                  border: isActive ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                whileHover={{ background: 'rgba(255,255,255,0.10)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FolderOpen className="w-3.5 h-3.5 shrink-0" style={{ color: '#FDB44B' }} />

                <span className="truncate">{win.title}</span>
              </motion.button>
              {/* Running indicator */}
              <div
                className="absolute bottom-0.5 rounded-full transition-all"
                style={{
                  height: 3,
                  width: isActive ? 18 : 6,
                  background: isActive ? '#4FC3F7' : 'rgba(255,255,255,0.4)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── RIGHT: System tray ── */}
      <div
        className="absolute right-0 flex items-center h-full"
        style={{ paddingRight: 4 }}
      >
        {/* Chevron */}
        <motion.button
          className="flex items-center justify-center rounded text-slate-400 hover:text-white"
          style={{ width: 24, height: 40 }}
          whileHover={{ background: 'rgba(255,255,255,0.08)' }}
          title="Show hidden icons"
        >
          <ChevronUp className="w-3 h-3" />
        </motion.button>

        {/* Wi-Fi + Volume + Battery grouped */}
        <motion.button
          className="flex items-center gap-1.5 rounded"
          style={{
            height: 40,
            padding: '0 8px',
            color: 'rgba(255,255,255,0.85)',
          }}
          whileHover={{ background: 'rgba(255,255,255,0.08)' }}
          title="Network, Volume, Battery"
        >
          <Wifi className="w-3.5 h-3.5" />
          <Volume2 className="w-3.5 h-3.5" />
          <Battery className="w-3.5 h-3.5" />
        </motion.button>

        {/* Language indicator */}
        <motion.button
          className="flex items-center justify-center rounded"
          style={{
            height: 40,
            padding: '0 6px',
            color: 'rgba(255,255,255,0.85)',
            fontFamily: '"Segoe UI", Inter, sans-serif',
            fontSize: 11,
            fontWeight: 500,
            minWidth: 36,
          }}
          whileHover={{ background: 'rgba(255,255,255,0.08)' }}
          title="Input indicator"
        >
          ENG
        </motion.button>

        {/* Clock & date */}
        <motion.button
          className="flex flex-col items-end justify-center rounded"
          style={{
            height: 40,
            padding: '0 8px',
            gap: 1,
            fontFamily: '"Segoe UI", Inter, sans-serif',
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

        {/* Notification bell */}
        <motion.button
          id="taskbar-btn-notifications"
          onClick={onOpenSettings}
          className="flex items-center justify-center rounded"
          style={{ width: 32, height: 40, color: 'rgba(255,255,255,0.7)' }}
          whileHover={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
};
