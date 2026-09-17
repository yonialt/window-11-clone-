import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  RefreshCw,
} from 'lucide-react';

interface WeatherData {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  windSpeed: number;
  code: number;
  location: string;
  isLive: boolean;
  isDay: boolean;
}

type WeatherIconProps = { className?: string; style?: React.CSSProperties };

// ─── Shared cloud paths (Windows 11 style: layered grey + white clouds) ───
const CLOUD_PATH = 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z';
const DROP_PATH = 'M0 -4 C 2.5 -1.5, 4 0.8, 4 3 A 4 4 0 1 1 -4 3 C -4 0.8 -2.5 -1.5 0 -4 Z';

const SunIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#FFC94D" strokeWidth="3.5" strokeLinecap="round">
      <path d="M36.5 24 L41.5 24" />
      <path d="M32.8 32.8 L36.4 36.4" />
      <path d="M24 36.5 L24 41.5" />
      <path d="M15.2 32.8 L11.6 36.4" />
      <path d="M11.5 24 L6.5 24" />
      <path d="M15.2 15.2 L11.6 11.6" />
      <path d="M24 11.5 L24 6.5" />
      <path d="M32.8 15.2 L36.4 11.6" />
    </g>
    <circle cx="24" cy="24" r="10" fill="#FFD54F" />
  </svg>
);

const MoonIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* stars */}
    <circle cx="12" cy="13" r="1.4" fill="#E3F2FD" />
    <circle cx="38" cy="11" r="1.1" fill="#E3F2FD" />
    <circle cx="40" cy="30" r="1.4" fill="#E3F2FD" />
    {/* amber crescent */}
    <g transform="scale(2)">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#FFC94D" />
    </g>
  </svg>
);

const PartlyCloudyDayIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* amber sun peeking from behind */}
    <circle cx="31" cy="19" r="9" fill="#FFD54F" />
    {/* grey cloud (behind) */}
    <g transform="translate(-1.5 1.5) scale(2)">
      <path d={CLOUD_PATH} fill="#A9B4BF" />
    </g>
    {/* white cloud (front) */}
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#FFFFFF" opacity="0.95" />
    </g>
  </svg>
);

const NightPartlyCloudyIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* stars */}
    <circle cx="10" cy="12" r="1.4" fill="#E3F2FD" />
    <circle cx="38" cy="10" r="1.1" fill="#E3F2FD" />
    {/* amber crescent moon peeking from behind */}
    <g transform="translate(3 -3) scale(1.9)">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#FFC94D" />
    </g>
    {/* grey cloud (behind) */}
    <g transform="translate(-1.5 1.5) scale(2)">
      <path d={CLOUD_PATH} fill="#A9B4BF" />
    </g>
    {/* white cloud (front) */}
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#FFFFFF" opacity="0.95" />
    </g>
  </svg>
);

const OvercastIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(-1.5 1.5) scale(2)">
      <path d={CLOUD_PATH} fill="#9AA4AF" />
    </g>
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#C7CCD1" />
    </g>
  </svg>
);

const FogIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#AEB8C2" />
    </g>
    <g stroke="#8FA0AE" strokeWidth="3.5" strokeLinecap="round">
      <path d="M11 39.5 h26" />
      <path d="M15 43 h18" />
      <path d="M11 46.5 h26" />
    </g>
  </svg>
);

const DrizzleIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#C7CCD1" />
    </g>
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#FFFFFF" opacity="0.85" />
    </g>
    <path d={DROP_PATH} fill="#90CAF9" transform="translate(15 41.5) scale(0.8)" />
    <path d={DROP_PATH} fill="#90CAF9" transform="translate(24 42) scale(0.8)" />
    <path d={DROP_PATH} fill="#90CAF9" transform="translate(33 41.5) scale(0.8)" />
  </svg>
);

const RainIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#C7CCD1" />
    </g>
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#FFFFFF" opacity="0.85" />
    </g>
    <path d={DROP_PATH} fill="#64B5F6" transform="translate(14 37) scale(1.3)" />
    <path d={DROP_PATH} fill="#64B5F6" transform="translate(24 38.5) scale(1.3)" />
    <path d={DROP_PATH} fill="#64B5F6" transform="translate(34 37) scale(1.3)" />
  </svg>
);

const SnowIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#C7CCD1" />
    </g>
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#FFFFFF" opacity="0.85" />
    </g>
    <g stroke="#E3F2FD" strokeWidth="2" strokeLinecap="round">
      <g transform="translate(15 40)">
        <path d="M0 -5 L0 5" />
        <path d="M-4.3 2.5 L4.3 -2.5" />
        <path d="M-4.3 -2.5 L4.3 2.5" />
      </g>
      <g transform="translate(25 42.5)">
        <path d="M0 -5 L0 5" />
        <path d="M-4.3 2.5 L4.3 -2.5" />
        <path d="M-4.3 -2.5 L4.3 2.5" />
      </g>
      <g transform="translate(35 40)">
        <path d="M0 -5 L0 5" />
        <path d="M-4.3 2.5 L4.3 -2.5" />
        <path d="M-4.3 -2.5 L4.3 2.5" />
      </g>
    </g>
  </svg>
);

const ThunderstormIcon: React.FC<WeatherIconProps> = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="scale(2)">
      <path d={CLOUD_PATH} fill="#AEB8C2" />
    </g>
    {/* yellow lightning bolt */}
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" fill="#FFD54F" transform="translate(10 2) scale(2)" />
  </svg>
);

// Addis Ababa, Ethiopia (profile location)
const LAT = 9.03;
const LON = 38.74;
const LOCATION_NAME = 'Addis Ababa';

const toF = (c: number) => Math.round((c * 9) / 5 + 32);
const toMph = (kmh: number) => Math.round(kmh * 0.621371);

const DEMO_WEATHER: WeatherData = {
  tempC: 18,
  feelsLikeC: 18,
  humidity: 55,
  windSpeed: 9,
  code: 2,
  location: LOCATION_NAME,
  isLive: false,
  isDay: new Date().getHours() >= 6 && new Date().getHours() < 18,
};

// Day/night aware, all custom multi-color icons matching the Windows 11 widget look
const getWeatherMeta = (
  code: number,
  isDay: boolean
): { label: string; Icon: React.FC<WeatherIconProps> } => {
  if (code === 0) return { label: 'Clear sky', Icon: isDay ? SunIcon : MoonIcon };
  if (code === 1 || code === 2) {
    return {
      label: code === 1 ? 'Mostly clear' : 'Partly cloudy',
      Icon: isDay ? PartlyCloudyDayIcon : NightPartlyCloudyIcon,
    };
  }
  if (code === 3) return { label: 'Overcast', Icon: OvercastIcon };
  if (code === 45 || code === 48) return { label: 'Fog', Icon: FogIcon };
  if (code >= 51 && code <= 57) return { label: 'Drizzle', Icon: DrizzleIcon };
  if (code >= 61 && code <= 67) return { label: 'Rain', Icon: RainIcon };
  if (code >= 71 && code <= 77) return { label: 'Snow', Icon: SnowIcon };
  if (code >= 80 && code <= 82) return { label: 'Rain showers', Icon: RainIcon };
  if (code >= 85 && code <= 86) return { label: 'Snow showers', Icon: SnowIcon };
  if (code >= 95) return { label: 'Thunderstorm', Icon: ThunderstormIcon };
  return { label: 'Partly cloudy', Icon: isDay ? PartlyCloudyDayIcon : NightPartlyCloudyIcon };
};

const fetchWeather = async (signal: AbortSignal): Promise<WeatherData | null> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    const cur = data?.current;
    if (!cur) return null;
    const hour = typeof cur.time === 'string' ? parseInt(cur.time.slice(11, 13), 10) : new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    return {
      tempC: Math.round(cur.temperature_2m ?? 23),
      feelsLikeC: Math.round(cur.apparent_temperature ?? cur.temperature_2m ?? 23),
      humidity: Math.round(cur.relative_humidity_2m ?? 55),
      windSpeed: Math.round(cur.wind_speed_10m ?? 9),
      code: cur.weather_code ?? 2,
      location: LOCATION_NAME,
      isLive: true,
      isDay,
    };
  } catch {
    return null;
  }
};

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(DEMO_WEATHER);
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const load = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const data = await fetchWeather(controller.signal);
      if (data) setWeather(data);
    } catch {
      // keep current (demo or last live) data
    } finally {
      clearTimeout(timeout);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15 * 60 * 1000); // refresh every 15 min
    return () => clearInterval(interval);
  }, []);

  // Close flyout on outside click / ESC
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    await load();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const { Icon, label } = getWeatherMeta(weather.code, weather.isDay);
  const tempF = toF(weather.tempC);

  return (
    <div ref={ref} className="relative flex items-center h-full">
      {/* Weather widget — Windows 11 style: icon + stacked temp/condition */}
      <motion.button
        id="taskbar-btn-weather"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-md"
        style={{
          height: 34,
          padding: '0 8px',
          background: isOpen ? 'rgba(255,255,255,0.14)' : 'transparent',
        }}
        whileHover={{ background: 'rgba(255,255,255,0.10)' }}
        whileTap={{ scale: 0.97 }}
        title={`${weather.location} · ${label} · ${tempF}°F`}
      >
        <Icon className="w-6 h-6 shrink-0" />
        <div className="flex flex-col items-start" style={{ gap: 2 }}>
          <span
            className="leading-none text-white font-semibold"
            style={{ fontSize: 13, fontFamily: '"Segoe UI", Inter, sans-serif' }}
          >
            {tempF}°F
          </span>
          <span
            className="leading-none"
            style={{
              fontSize: 9.5,
              color: '#A8CCE8',
              fontFamily: '"Segoe UI", Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        </div>
      </motion.button>

      {/* Flyout */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-[44px] left-2 z-[110] w-72 rounded-2xl overflow-hidden shadow-2xl border border-white/10 text-slate-100"
            style={{ background: 'rgba(32,32,32,0.97)', backdropFilter: 'blur(40px)' }}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              {/* Location header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-xs font-medium">{weather.location}</span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                  title="Refresh"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Current conditions */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-3xl font-semibold leading-none">{tempF}°F</p>
                  <p className="text-xs text-slate-400 mt-1">{label}</p>
                </div>
                {!weather.isLive && (
                  <span className="ml-auto text-[10px] text-slate-500 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                    Demo
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { Icon: Thermometer, label: 'Feels like', value: `${toF(weather.feelsLikeC)}°F` },
                  { Icon: Droplets, label: 'Humidity', value: `${weather.humidity}%` },
                  { Icon: Wind, label: 'Wind', value: `${toMph(weather.windSpeed)} mph` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center gap-1 rounded-xl py-2.5"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <item.Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] text-slate-400">{item.label}</span>
                    <span className="text-xs font-medium text-slate-100">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
