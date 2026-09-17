import React, { useState, useEffect } from 'react';
import { Wifi, Bluetooth, Plane, Moon, Focus, Volume2, Sun, Battery, Pencil, ChevronDown } from 'lucide-react';

interface ToggleState {
  wifi: boolean;
  bluetooth: boolean;
  airplane: boolean;
  nightLight: boolean;
  focusAssist: boolean;
}

interface QuickSettingsFlyoutProps {
  onClose: () => void;
}

const STORAGE_KEY = 'portfolio_os_quick_settings_v1';

export const QuickSettingsFlyout: React.FC<QuickSettingsFlyoutProps> = ({ onClose }) => {
  const [toggles, setToggles] = useState<ToggleState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    return { wifi: true, bluetooth: true, airplane: false, nightLight: false, focusAssist: true };
  });
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(85);
  const [battery, setBattery] = useState(87);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toggles));
  }, [toggles]);

  const toggle = (key: keyof ToggleState) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const quickToggles: {
    key: keyof ToggleState;
    label: string;
    icon: React.ReactNode;
  }[] = [
      { key: 'wifi', label: 'Wi-Fi', icon: <Wifi className="w-4 h-4" /> },
      { key: 'bluetooth', label: 'Bluetooth', icon: <Bluetooth className="w-4 h-4" /> },
      { key: 'airplane', label: 'Airplane mode', icon: <Plane className="w-4 h-4" /> },
      { key: 'nightLight', label: 'Night light', icon: <Moon className="w-4 h-4" /> },
      { key: 'focusAssist', label: 'Focus assist', icon: <Focus className="w-4 h-4" /> },
    ];

  return (
    <div
      className="w-80 rounded-2xl overflow-hidden shadow-2xl border text-gray-800"
      style={{
        background: 'rgba(223, 212, 212, 0)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        boxShadow: '0 24px 64px rgba(61, 12, 236, 0.25), 0 4px 16px rgba(0, 0, 0, 0.12)',
      }}
    >
      <div className="p-4 space-y-3">
        {/* Toggle grid */}
        <div className="grid grid-cols-3 gap-2">
          {quickToggles.map((t) => (
            <button
              key={t.key}
              onClick={() => toggle(t.key)}
              className={`flex flex-col items-start gap-1.5 p-2.5 rounded-xl border transition-all active:scale-95 ${toggles[t.key]
                ? 'bg-blue-500 border-blue-500 text-black shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {t.icon}
              <span className="text-[10px] font-medium leading-tight">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-100 border border-gray-200">
          <Volume2 className="w-4 h-4 text-gray-600 shrink-0" />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 accent-blue-500 h-1 cursor-pointer"
          />
          <span className="text-[10px] text-gray-500 w-7 text-right">{volume}</span>
        </div>

        {/* Brightness slider */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-100 border border-gray-200">
          <Sun className="w-4 h-4 text-gray-600 shrink-0" />
          <input
            type="range"
            min={10}
            max={100}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="flex-1 accent-blue-500 h-1 cursor-pointer"
          />
          <span className="text-[10px] text-gray-500 w-7 text-right">{brightness}</span>
        </div>

        {/* Battery */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-100 border border-gray-200">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-700">Battery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-14 h-2.5 rounded-full bg-gray-300 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${battery}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 w-8 text-right">{battery}%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-[11px] text-black hover:text-gray-900 transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Edit quick settings
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-900 transition-colors"
        >
          All settings
          <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
        </button>
      </div>
    </div>
  );
};
