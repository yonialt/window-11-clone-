import React, { useState } from 'react';
import { DeveloperProfile } from '../types';
import { Github, Linkedin, Mail, MapPin, ExternalLink, Copy, Check } from 'lucide-react';

interface AboutMeWindowProps {
  profile: DeveloperProfile;
}

export const AboutMeWindow: React.FC<AboutMeWindowProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(profile.email).then(done).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = profile.email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      });
    } else {
      done();
    }
  };

  return (
    <div className="h-full overflow-auto p-6" style={{ fontFamily: 'var(--win11-font)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start gap-6 mb-8">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-28 h-28 rounded-2xl object-cover border-2 border-blue-500/40 shadow-xl"
          />
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">{profile.name}</h1>
            <p className="text-blue-400 text-sm font-medium mb-3">{profile.role}</p>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              {profile.location}
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/8">
          <h2 className="text-sm font-semibold text-white mb-3">About</h2>
          <p className="text-slate-300 text-sm leading-relaxed">{profile.bio}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Projects', value: '6+' },
            { label: 'Experience', value: '2+ yrs' },
            { label: 'Technologies', value: '20+' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 rounded-xl p-4 text-center border border-white/8">
              <div className="text-xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/8 hover:bg-white/12 text-sm text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
            <ExternalLink className="w-3 h-3 opacity-50" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-sm text-white transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <button
            type="button"
            onClick={copyEmail}
            title="Click to copy email"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/8 hover:bg-white/12 text-sm text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Email'}
          </button>
        </div>
      </div>
    </div>
  );
};
