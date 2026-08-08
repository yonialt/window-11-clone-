import React, { useState } from 'react';
import {
  Monitor,
  Bluetooth,
  Wifi,
  Palette,
  LayoutGrid,
  User,
  Clock,
  Gamepad2,
  Accessibility,
  ShieldCheck,
  RefreshCw,
  Check,
  Search,
  ChevronRight,
  Sun,
  Moon,
  MoonStar,
  Info,
  Bell,
} from 'lucide-react';
import { Wallpaper, DeveloperProfile } from '../types';

interface SettingsAppProps {
  wallpapers: Wallpaper[];
  currentWallpaper: Wallpaper;
  onSelectWallpaper: (wp: Wallpaper) => void;
  profile: DeveloperProfile;
  onUpdateProfile: (p: DeveloperProfile) => void;
  onOpenApp: (id: string) => void;
}

type PageId =
  | 'system'
  | 'bluetooth'
  | 'network'
  | 'personalization'
  | 'apps'
  | 'accounts'
  | 'time'
  | 'gaming'
  | 'accessibility'
  | 'privacy'
  | 'update';

const NAV_ITEMS: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  { id: 'bluetooth', label: 'Bluetooth & devices', icon: <Bluetooth className="w-4 h-4" /> },
  { id: 'network', label: 'Network & internet', icon: <Wifi className="w-4 h-4" /> },
  { id: 'personalization', label: 'Personalization', icon: <Palette className="w-4 h-4" /> },
  { id: 'apps', label: 'Apps', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'accounts', label: 'Accounts', icon: <User className="w-4 h-4" /> },
  { id: 'time', label: 'Time & language', icon: <Clock className="w-4 h-4" /> },
  { id: 'gaming', label: 'Gaming', icon: <Gamepad2 className="w-4 h-4" /> },
  { id: 'accessibility', label: 'Accessibility', icon: <Accessibility className="w-4 h-4" /> },
  { id: 'privacy', label: 'Privacy & security', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'update', label: 'Windows Update', icon: <RefreshCw className="w-4 h-4" /> },
];

const Toggle: React.FC<{ label: string; description?: string; defaultOn?: boolean }> = ({
  label,
  description,
  defaultOn = false,
}) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${on ? 'bg-blue-600' : 'bg-gray-300'}`}
        role="switch"
        aria-checked={on}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${on ? 'left-[22px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({
  title,
  children,
  className = '',
}) => (
  <section className={`bg-white rounded-lg shadow-sm border border-gray-200/80 ${className}`}>
    <h3 className="text-[13px] font-semibold text-gray-900 px-5 pt-4 pb-2 border-b border-gray-100">{title}</h3>
    <div className="px-5 py-2">{children}</div>
  </section>
);

const PageHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-5">
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const ListRow: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; right?: React.ReactNode; onClick?: () => void }> = ({
  icon,
  title,
  subtitle,
  right,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 py-3 text-left border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2"
  >
    <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 shrink-0">{icon}</span>
    <span className="flex-1 min-w-0">
      <span className="block text-sm text-gray-800 truncate">{title}</span>
      {subtitle && <span className="block text-xs text-gray-500 truncate">{subtitle}</span>}
    </span>
    {right ?? <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
  </button>
);

export const SettingsApp: React.FC<SettingsAppProps> = ({
  wallpapers,
  currentWallpaper,
  onSelectWallpaper,
  profile,
  onUpdateProfile,
  onOpenApp,
}) => {
  const [page, setPage] = useState<PageId>('system');
  const [query, setQuery] = useState('');
  const [checkedForUpdates, setCheckedForUpdates] = useState(false);

  const accentColors = ['#0078D4', '#C42B1C', '#107C10', '#8764B8', '#FFB900', '#E3008C', '#00B7C3', '#FF8C00'];

  const renderPage = () => {
    switch (page) {
      case 'system':
        return (
          <div className="space-y-4">
            <PageHeader title="System" subtitle="Display, sound, notifications, power" />
            <Card title="Display">
              <div className="py-2">
                <label className="text-sm text-gray-700 block mb-1">Brightness</label>
                <input type="range" min={10} max={100} defaultValue={85} className="w-full accent-blue-600" />
              </div>
              <div className="py-2">
                <label className="text-sm text-gray-700 block mb-1">Display scale</label>
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
                  <option>100% (Recommended)</option>
                  <option>125%</option>
                  <option>150%</option>
                </select>
              </div>
              <div className="py-2">
                <label className="text-sm text-gray-700 block mb-1">Display resolution</label>
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white">
                  <option>1920 × 1080 (Recommended)</option>
                  <option>2560 × 1440</option>
                  <option>3840 × 2160</option>
                </select>
              </div>
            </Card>
            <Card title="Notifications">
              <Toggle label="Notifications" description="Get notifications from apps and senders" defaultOn />
              <Toggle label="Do not disturb" description="Quiet hours from 22:00 to 07:00" />
            </Card>
            <Card title="About">
              <ListRow icon={<Monitor className="w-4 h-4" />} title="Device name" subtitle="DESKTOP-PORTFOLIO" />
              <ListRow icon={<Info className="w-4 h-4" />} title="Edition" subtitle="Windows 11 Portfolio OS" />
            </Card>
          </div>
        );

      case 'bluetooth':
        return (
          <div className="space-y-4">
            <PageHeader title="Bluetooth & devices" subtitle="Add and manage Bluetooth devices" />
            <Card title="Bluetooth">
              <Toggle label="Bluetooth" description="Connect to Bluetooth accessories" defaultOn />
            </Card>
            <Card title="Devices">
              <ListRow icon={<Bluetooth className="w-4 h-4" />} title="Magic Mouse" subtitle="Connected" right={<span className="text-xs text-green-600 font-medium">Connected</span>} />
              <ListRow icon={<Bluetooth className="w-4 h-4" />} title="AirPods Pro" subtitle="Paired" right={<span className="text-xs text-gray-400">Paired</span>} />
            </Card>
          </div>
        );

      case 'network':
        return (
          <div className="space-y-4">
            <PageHeader title="Network & internet" subtitle="Wi-Fi, ethernet, VPN" />
            <Card title="Wi-Fi">
              <Toggle label="Wi-Fi" defaultOn />
            </Card>
            <Card title="Networks">
              <ListRow icon={<Wifi className="w-4 h-4" />} title="Portfolio_5G" subtitle="Connected, secured" right={<span className="text-xs text-green-600 font-medium">Connected</span>} />
              <ListRow icon={<Wifi className="w-4 h-4" />} title="HomeNetwork" subtitle="Secured" />
            </Card>
          </div>
        );

      case 'personalization':
        return (
          <div className="space-y-4">
            <PageHeader title="Personalization" subtitle="Background, colors, themes" />
            <Card title="Background">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => onSelectWallpaper(wp)}
                    className={`group relative h-24 rounded-lg overflow-hidden border-2 transition-all hover:scale-[1.03] ${
                      currentWallpaper.id === wp.id ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ background: wp.value }}
                  >
                    {currentWallpaper.id === wp.id && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Click a wallpaper to apply it instantly.</p>
            </Card>
            <Card title="Themes">
              <div className="grid grid-cols-2 gap-3 py-2">
                {[
                  { name: 'Windows (dark)', icon: <Moon className="w-5 h-5" />, bg: 'from-slate-800 to-slate-950' },
                  { name: 'Windows (light)', icon: <Sun className="w-5 h-5" />, bg: 'from-slate-100 to-white' },
                  { name: 'Windows (glow)', icon: <MoonStar className="w-5 h-5" />, bg: 'from-blue-900 to-purple-950' },
                ].map((t) => (
                  <button
                    key={t.name}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-left"
                  >
                    <span className={`w-9 h-9 rounded-lg bg-gradient-to-br ${t.bg} flex items-center justify-center text-gray-700`}>
                      {t.icon}
                    </span>
                    <span className="text-xs text-gray-700 font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </Card>
            <Card title="Colors">
              <div className="flex items-center gap-2.5 py-2 flex-wrap">
                {accentColors.map((c) => (
                  <span
                    key={c}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 cursor-default ${c === '#0078D4' ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}
                    style={{ background: c }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 -mt-1">Accent color preview</p>
            </Card>
            <Card title="Transparency effects">
              <Toggle label="Transparency effects" description="Make Start, taskbar and windows translucent" defaultOn />
            </Card>
          </div>
        );

      case 'apps':
        return (
          <div className="space-y-4">
            <PageHeader title="Apps" subtitle="Installed portfolio applications" />
            <Card title="Installed apps">
              {[
                { id: 'resume', name: 'Resume' },
                { id: 'skills', name: 'Skills' },
                { id: 'about', name: 'About Me' },
                { id: 'contact', name: 'Contact' },
                { id: 'browser', name: 'Browser' },
                { id: 'terminal', name: 'Command Prompt' },
                { id: 'notepad', name: 'Notepad' },
                { id: 'calculator', name: 'Calculator' },
              ].map((app) => (
                <ListRow
                  key={app.id}
                  icon={<LayoutGrid className="w-4 h-4" />}
                  title={app.name}
                  subtitle="Portfolio application"
                  right={<span className="text-xs text-blue-600 font-medium">Open</span>}
                  onClick={() => onOpenApp(app.id)}
                />
              ))}
            </Card>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-4">
            <PageHeader title="Accounts" subtitle="Your developer profile" />
            <Card title="Your info">
              <div className="flex items-center gap-4 py-3">
                <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                <div>
                  <p className="text-base font-semibold text-gray-900">{profile.name}</p>
                  <p className="text-sm text-gray-500">{profile.role}</p>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <label className="block">
                  <span className="text-xs text-gray-500">Display name</span>
                  <input
                    value={profile.name}
                    onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Role / Title</span>
                  <input
                    value={profile.role}
                    onChange={(e) => onUpdateProfile({ ...profile, role: e.target.value })}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">Email</span>
                  <input
                    value={profile.email}
                    onChange={(e) => onUpdateProfile({ ...profile, email: e.target.value })}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
              </div>
            </Card>
          </div>
        );

      case 'time':
        return (
          <div className="space-y-4">
            <PageHeader title="Time & language" subtitle="Date, time, region" />
            <Card title="Date & time">
              <Toggle label="Set time automatically" defaultOn />
              <Toggle label="Set time zone automatically" defaultOn />
              <ListRow icon={<Clock className="w-4 h-4" />} title="Time zone" subtitle="(UTC+00:00) Dublin, Edinburgh, Lisbon, London" />
            </Card>
            <Card title="Language & region">
              <ListRow icon={<span className="text-xs font-bold">ENG</span>} title="English (United Kingdom)" subtitle="Default language" right={<Check className="w-4 h-4 text-blue-600" />} />
            </Card>
          </div>
        );

      case 'gaming':
        return (
          <div className="space-y-4">
            <PageHeader title="Gaming" subtitle="Game Mode, Game Bar, captures" />
            <Card title="Game Mode">
              <Toggle label="Game Mode" description="Prioritize gaming performance" defaultOn />
            </Card>
            <Card title="Game Bar">
              <Toggle label="Game Bar" description="Open Game Bar with Win + G" defaultOn />
            </Card>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-4">
            <PageHeader title="Accessibility" subtitle="Vision, hearing, interaction" />
            <Card title="Vision">
              <Toggle label="Text size" />
              <Toggle label="Color filters" />
              <Toggle label="Contrast themes" />
            </Card>
            <Card title="Interaction">
              <Toggle label="Mouse pointer & touch" defaultOn />
              <Toggle label="Narrator" />
            </Card>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <PageHeader title="Privacy & security" subtitle="App permissions, security" />
            <Card title="Windows security">
              <Toggle label="Real-time protection" defaultOn />
              <Toggle label="Cloud-delivered protection" defaultOn />
            </Card>
            <Card title="App permissions">
              <Toggle label="Location" defaultOn />
              <Toggle label="Camera" />
              <Toggle label="Microphone" />
              <Toggle label="Notifications" defaultOn />
            </Card>
          </div>
        );

      case 'update':
        return (
          <div className="space-y-4">
            <PageHeader title="Windows Update" subtitle="Updates available for your device" />
            <Card title="Update status">
              <div className="py-2 flex flex-col items-center text-center">
                {checkedForUpdates ? (
                  <>
                    <span className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                      <Check className="w-6 h-6" />
                    </span>
                    <p className="text-sm font-medium text-gray-800">You're up to date</p>
                    <p className="text-xs text-gray-500 mt-1">Last checked: just now</p>
                  </>
                ) : (
                  <>
                    <span className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                      <RefreshCw className="w-6 h-6" />
                    </span>
                    <p className="text-sm font-medium text-gray-800">Portfolio OS, version 11</p>
                    <p className="text-xs text-gray-500 mt-1">Updates are checked automatically</p>
                    <button
                      onClick={() => setCheckedForUpdates(true)}
                      className="mt-4 px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-500 transition-colors"
                    >
                      Check for updates
                    </button>
                  </>
                )}
              </div>
            </Card>
            <Card title="Update history">
              <ListRow icon={<Bell className="w-4 h-4" />} title="Feature update" subtitle="Portfolio OS 11 – Quality Update (Installed)" right={<Check className="w-4 h-4 text-green-600" />} />
            </Card>
          </div>
        );
    }
  };

  const filteredNav = NAV_ITEMS.filter(
    (n) => !query || n.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#f3f3f3] text-gray-900" style={{ fontFamily: '"Segoe UI", Inter, sans-serif' }}>
      {/* ── Left sidebar ── */}
      <aside className="w-60 shrink-0 bg-[#f3f3f3] border-r border-gray-200 flex flex-col">
        <div className="p-4 pb-2 relative">
          <Search className="absolute left-7 top-6 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a setting"
            className="w-full pl-8 pr-3 py-2 rounded-md bg-white border border-gray-200 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left ${
                page === item.id
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200/70'
                  : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
              }`}
            >
              <span className={page === item.id ? 'text-blue-600' : 'text-gray-500'}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <img src={profile.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{profile.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{profile.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto p-6">{renderPage()}</main>
    </div>
  );
};
