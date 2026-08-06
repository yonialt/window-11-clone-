import React from 'react';
import { Palette, User, Check, Sparkles, Monitor, Info } from 'lucide-react';
import { Wallpaper, DeveloperProfile } from '../types';

interface SettingsWindowProps {
  wallpapers: Wallpaper[];
  currentWallpaper: Wallpaper;
  onSelectWallpaper: (wp: Wallpaper) => void;
  profile: DeveloperProfile;
  onUpdateProfile: (p: DeveloperProfile) => void;
}

export const SettingsWindow: React.FC<SettingsWindowProps> = ({
  wallpapers,
  currentWallpaper,
  onSelectWallpaper,
  profile,
  onUpdateProfile,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-6 overflow-y-auto space-y-8">
      {/* Wallpapers Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Desktop Background Wallpapers
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Choose a desktop theme inspired by Windows dark aesthetics and space gradients.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {wallpapers.map((wp) => (
            <div
              key={wp.id}
              onClick={() => onSelectWallpaper(wp)}
              className={`group relative rounded-xl border-2 p-1 cursor-pointer transition-all hover:scale-105 ${
                currentWallpaper.id === wp.id
                  ? 'border-blue-500 ring-2 ring-blue-500/50 shadow-lg'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className="h-24 w-full rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden"
                style={{ background: wp.value }}
              >
                {currentWallpaper.id === wp.id && (
                  <span className="p-1.5 rounded-full bg-blue-600 text-white shadow-md">
                    <Check className="w-4 h-4 font-bold" />
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs font-semibold text-center text-slate-300 group-hover:text-white">
                {wp.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Settings Section */}
      <div className="pt-6 border-t border-slate-800/80">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Developer Account Info
          </h3>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Developer Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Title / Role</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => onUpdateProfile({ ...profile, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Bio</label>
            <input
              type="text"
              value={profile.bio}
              onChange={(e) => onUpdateProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Email Contact</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => onUpdateProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => onUpdateProfile({ ...profile, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
