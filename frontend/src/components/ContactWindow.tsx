import React, { useState } from 'react';
import { DeveloperProfile } from '../types';
import { Mail, Send, Github, Linkedin, MapPin, CheckCircle } from 'lucide-react';

interface ContactWindowProps {
  profile: DeveloperProfile;
}

export const ContactWindow: React.FC<ContactWindowProps> = ({ profile }) => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
    const body = encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`);
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="h-full overflow-auto p-6" style={{ fontFamily: 'var(--win11-font)' }}>
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-semibold text-white mb-2">Get In Touch</h1>
        <p className="text-slate-400 text-sm mb-6">Send me a message and I'll get back to you soon.</p>

        <div className="flex flex-col gap-3 mb-6">
          {[
            { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
            { icon: Github, label: 'GitHub Profile', href: profile.github },
            { icon: Linkedin, label: 'LinkedIn Profile', href: profile.linkedin },
            { icon: MapPin, label: profile.location, href: undefined },
          ].map(({ icon: Icon, label, href }) => (
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 border border-white/8 text-sm text-slate-300 hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                {label}
              </a>
            ) : (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 text-sm text-slate-300"
              >
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                {label}
              </div>
            )
          ))}
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          >
            {sent ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Opening Email Client...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
