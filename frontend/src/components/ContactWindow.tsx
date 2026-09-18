import React, { useState, useRef } from 'react';
import { DeveloperProfile } from '../types';
import {
  Mail,
  Send,
  Github,
  Linkedin,
  MapPin,
  CheckCircle,
  Briefcase,
  TrendingUp,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { PROFILE_LINKS } from '../data/initialData';

// Web3Forms access key — public by design (aliases the owner's email), safe to expose in client code.
// Get a free key at https://web3forms.com; can also be set via the VITE_WEB3FORMS_ACCESS_KEY env var.
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'af9bd5b7-c0f4-4fbe-9e5f-f9703e9e19d7';

interface ContactWindowProps {
  profile: DeveloperProfile;
}

type SubmitStatus = 'idle' | 'sending' | 'sent' | 'error';

interface ContactRow {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  right?: React.ReactNode;
}

export const ContactWindow: React.FC<ContactWindowProps> = ({ profile }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  const scheduleReset = () => {
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setStatus('idle'), 5000);
  };

  const copyEmail = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(profile.email).then(done).catch(() => {
        // Fallback for older browsers / non-secure contexts
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!WEB3FORMS_ACCESS_KEY) {
      setErrorMsg("The contact form isn't configured yet. Add your Web3Forms access key (VITE_WEB3FORMS_ACCESS_KEY).");
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      // FormData (multipart) is required — Web3Forms doesn't allow JSON preflight CORS
      const formData = new FormData();
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', `Portfolio Contact from ${form.name}`);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('message', form.message);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
        scheduleReset();
      } else {
        setErrorMsg(data.message || 'The message could not be sent. Please try again.');
        setStatus('error');
        scheduleReset();
      }
    } catch {
      setErrorMsg('Network error — the message could not be sent. Please try again.');
      setStatus('error');
      scheduleReset();
    }
  };

  const rows: ContactRow[] = [
    {
      icon: Mail,
      label: profile.email,
      onClick: copyEmail,
      right: copied ? (
        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <Copy className="w-4 h-4 text-slate-500 shrink-0" />
      ),
    },
    { icon: Github, label: 'GitHub Profile', href: profile.github },
    { icon: Linkedin, label: 'LinkedIn Profile', href: profile.linkedin },
    { icon: Briefcase, label: 'Fiverr Profile', href: profile.fiverr || PROFILE_LINKS.fiverr },
    { icon: TrendingUp, label: 'Upwork Profile', href: profile.upwork || PROFILE_LINKS.upwork },
    { icon: MapPin, label: profile.location },
  ];

  return (
    <div className="h-full overflow-auto p-6" style={{ fontFamily: 'var(--win11-font)' }}>
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-semibold text-white mb-2">Get In Touch</h1>
        <p className="text-slate-400 text-sm mb-6">Send me a message and I'll get back to you soon.</p>

        <div className="flex flex-col gap-3 mb-6">
          {rows.map(({ icon: Icon, label, href, onClick, right }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="flex-1 min-w-0 truncate">{label}</span>
                {right}
              </a>
            ) : onClick ? (
              <button
                key={label}
                type="button"
                onClick={onClick}
                title="Click to copy email"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 text-sm text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
              >
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="flex-1 min-w-0 truncate">{label}</span>
                {right}
              </button>
            ) : (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-300"
              >
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="flex-1 min-w-0 truncate">{label}</span>
              </div>
            )
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Your Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/8 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/8 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/8 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Hi, I'd like to discuss a project..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>

          {status === 'sent' && (
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Message sent! I'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-start gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
