import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wrench, TriangleAlert } from 'lucide-react';

// Windows 11 UAC shield (blue shield, gold keyhole)
const UACShield: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <defs>
      <linearGradient id="uacShieldBlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3a9bf0" />
        <stop offset="100%" stopColor="#0a5ab8" />
      </linearGradient>
      <linearGradient id="uacShieldGold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffd66b" />
        <stop offset="100%" stopColor="#e8a520" />
      </linearGradient>
    </defs>
    <path
      fill="url(#uacShieldBlue)"
      d="M24 1.8 42.5 8v13.2c0 11.6-7.9 20.6-18.5 25.1C13.4 41.8 5.5 32.8 5.5 21.2V8L24 1.8z"
    />
    <path
      fill="#ffffff"
      opacity="0.15"
      d="M24 6.2 38.5 11v10.2c0 8.9-5.8 16.1-14.5 19.9-8.7-3.8-14.5-11-14.5-19.9V11L24 6.2z"
    />
    <path
      fill="url(#uacShieldGold)"
      d="M24 13.5c-3.9 0-7.1 3.2-7.1 7.1 0 2.4 1.2 4.5 3 5.8l-1.5 5.5h11.2l-1.5-5.5c1.8-1.3 3-3.4 3-5.8 0-3.9-3.2-7.1-7.1-7.1zm0 4.2a2.9 2.9 0 1 1 0 5.8 2.9 2.9 0 0 1 0-5.8z"
    />
  </svg>
);

interface UACModalProps {
  open: boolean;
  /** The operation being authorized (e.g. "Delete Folder") */
  actionTitle: string;
  /** Human-readable explanation of the pending action */
  actionDescription: string;
  /** Inline error, e.g. "Incorrect credentials" */
  error: string | null;
  isVerifying: boolean;
  onConfirm: (username: string, password: string) => void;
  onCancel: () => void;
}

export const UACModal: React.FC<UACModalProps> = ({
  open,
  actionTitle,
  actionDescription,
  error,
  isVerifying,
  onConfirm,
  onCancel,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Reset + focus the username field each time the dialog opens (UAC-style)
  useEffect(() => {
    if (!open) return;
    setUsername('');
    setPassword('');
    setShowDetails(false);
    setShowChoices(false);
    const t = setTimeout(() => usernameRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, [open]);

  // When credentials are rejected, re-focus the offending field and select it
  useEffect(() => {
    if (!error) return;
    const el = username.trim() ? passwordRef.current : usernameRef.current;
    el?.focus();
    el?.select();
  }, [error, username]);

  // Escape cancels, matching the Windows UAC dialog
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || isVerifying) return;
    onConfirm(username, password);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Dimmed backdrop */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" onClick={onCancel} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="User Account Control"
            className="relative w-full max-w-[440px] overflow-hidden rounded-lg shadow-[0_16px_48px_rgba(0,0,0,0.45)] border border-black/10"
            style={{ background: '#f3f3f3' }}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between h-9 pl-4 pr-2 border-b border-black/10"
              style={{ background: '#fafafa' }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <UACShield size={15} />
                <span
                  className="text-xs font-medium truncate"
                  style={{ color: '#333', fontFamily: '"Segoe UI", Inter, sans-serif' }}
                >
                  User Account Control
                </span>
              </div>
              <button
                onClick={onCancel}
                className="flex items-center justify-center w-7 h-7 rounded text-[#555] hover:bg-black/10 transition-colors"
                aria-label="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Body */}
              <div className="px-6 pt-5 pb-4">
                <h3
                  className="text-sm font-bold leading-snug"
                  style={{ color: '#1b1b1b', fontFamily: '"Segoe UI", Inter, sans-serif' }}
                >
                  Do you want to allow this app to make changes to your device?
                </h3>

                {actionDescription && (
                  <p className="mt-1.5 text-xs leading-relaxed" style={{ color: '#444' }}>
                    {actionDescription}
                  </p>
                )}

                {/* App card */}
                <div
                  className="mt-4 flex items-center gap-3 rounded-md px-3 py-2.5 border border-black/10"
                  style={{ background: '#fff' }}
                >
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-md shrink-0"
                    style={{ background: '#d43100' }}
                  >
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[13px] font-semibold truncate"
                      style={{ color: '#1b1b1b', fontFamily: '"Segoe UI", Inter, sans-serif' }}
                    >
                      Portfolio Admin Console
                    </div>
                    <div className="text-[11px] truncate" style={{ color: '#666' }}>
                      Verified publisher: Portfolio Owner
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDetails((v) => !v)}
                      className="text-[11px] hover:underline"
                      style={{ color: '#0067c0' }}
                    >
                      {showDetails ? 'Hide details' : 'Show more details'}
                    </button>
                  </div>
                </div>

                {showDetails && (
                  <div
                    className="mt-2 rounded-md px-3 py-2 text-[11px] leading-relaxed border border-black/10"
                    style={{ background: '#fff', color: '#555' }}
                  >
                    <div>
                      <span className="font-semibold" style={{ color: '#333' }}>Program name:</span> Portfolio Admin Console
                    </div>
                    <div>
                      <span className="font-semibold" style={{ color: '#333' }}>Publisher:</span> Portfolio Owner
                    </div>
                    <div>
                      <span className="font-semibold" style={{ color: '#333' }}>Program location:</span> portfolio-os.app
                    </div>
                    <div>
                      <span className="font-semibold" style={{ color: '#333' }}>Action:</span> {actionTitle}
                    </div>
                  </div>
                )}

                {/* Prompt + credential fields */}
                <p className="mt-4 text-xs" style={{ color: '#333' }}>
                  To continue, enter an admin username and password.
                </p>

                <div className="mt-3 space-y-2.5">
                  <input
                    ref={usernameRef}
                    id="uac-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    autoComplete="username"
                    className="w-full px-3 py-2 rounded text-[13px] bg-white border border-[#b8b8b8] focus:border-[#0067c0] focus:outline-none transition-colors"
                    style={{ fontFamily: '"Segoe UI", Inter, sans-serif' }}
                  />
                  <input
                    ref={passwordRef}
                    id="uac-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full px-3 py-2 rounded text-[13px] bg-white border border-[#b8b8b8] focus:border-[#0067c0] focus:outline-none transition-colors"
                    style={{ fontFamily: '"Segoe UI", Inter, sans-serif' }}
                  />
                </div>

                {/* Inline error */}
                <div className="mt-2 flex items-center gap-1.5 text-xs min-h-[18px]" style={{ color: '#c42b1c' }}>
                  {error && (
                    <>
                      <TriangleAlert className="w-3.5 h-3.5 shrink-0" />
                      {error}
                    </>
                  )}
                </div>

                {/* More choices */}
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => setShowChoices((v) => !v)}
                    className="text-[11px] hover:underline"
                    style={{ color: '#0067c0' }}
                  >
                    More choices
                  </button>
                  {showChoices && (
                    <div className="mt-1.5 text-[11px]" style={{ color: '#666' }}>
                      Sign in with a different administrator account.
                    </div>
                  )}
                </div>
              </div>

              {/* White action footer */}
              <div
                className="px-6 py-3.5 flex items-center justify-end gap-2.5 border-t border-black/10"
                style={{ background: '#fff' }}
              >
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isVerifying}
                  className="px-5 py-1.5 rounded text-[13px] font-medium bg-white hover:bg-[#f0f0f0] transition-colors disabled:opacity-50"
                  style={{ border: '1px solid #c8c8c8', color: '#1b1b1b' }}
                >
                  No
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || !username.trim() || !password}
                  className="px-6 py-1.5 rounded text-[13px] font-semibold text-white bg-[#0067c0] hover:bg-[#0058a3] transition-colors disabled:opacity-60"
                >
                  {isVerifying ? 'Checking…' : 'Yes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
