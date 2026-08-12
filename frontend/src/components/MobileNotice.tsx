import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone, X, ChevronDown, Chrome, Apple, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'portfolio_mobile_notice_dismissed';

// Detect touch-first, phone/tablet-sized devices (and any mobile user agent).
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const narrowScreen = window.innerWidth <= 1024;
  const mobileUA =
    /Android|iPhone|iPad|iPod|Mobile|Windows Phone|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  return (coarsePointer && narrowScreen) || mobileUA;
};

const DESKTOP_MODE_STEPS = [
  {
    icon: Chrome,
    title: 'Chrome / Edge — Android',
    steps: ['Tap the ⋮ menu (top right)', 'Tick “Desktop site”'],
  },
  {
    icon: Apple,
    title: 'Safari — iPhone / iPad',
    steps: ['Tap “aA” in the address bar', 'Choose “Request Desktop Website”'],
  },
  {
    icon: Chrome,
    title: 'Chrome — iPhone',
    steps: ['Tap ⋮ at the bottom of the screen', 'Tick “Request Desktop Website”'],
  },
];

export const MobileNotice: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (!isMobileDevice()) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* storage unavailable — still show the notice */
    }
    setVisible(true);

    // Auto-hide if the user switches to a desktop-sized viewport.
    const onResize = () => {
      if (!isMobileDevice()) setVisible(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Desktop-only notice"
        className="relative w-full max-w-md win11-acrylic win11-window-shadow border border-white/10 rounded-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-5 pb-3">
          <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Monitor className="w-6 h-6 text-blue-300" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-white leading-tight">
              Best experienced on desktop
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              This portfolio is a full Windows 11 desktop simulation
            </p>
          </div>
          <button
            onClick={dismiss}
            className="p-1.5 -mr-1 -mt-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
            aria-label="Close notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 space-y-4">
          <p className="text-[13px] text-slate-300 leading-relaxed">
            This site is designed as an interactive desktop operating system and works best on a
            laptop or desktop browser. On a phone you can still look around, but dragging windows,
            right-clicking, and the full desktop experience are limited.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              onClick={dismiss}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              Continue anyway
            </button>
            <button
              onClick={() => setShowInstructions((s) => !s)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-sm font-medium transition-colors"
            >
              <Smartphone className="w-4 h-4 text-sky-300" />
              How to enable desktop mode
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  showInstructions ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Instructions */}
          {showInstructions && (
            <div className="space-y-3 border-t border-white/10 pt-3 animate-in fade-in duration-150">
              <p className="text-[12px] text-slate-400">
                Open this URL in your phone's browser and switch it to desktop mode:
              </p>
              {DESKTOP_MODE_STEPS.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-slate-200">{item.title}</p>
                    <ol className="text-[12px] text-slate-400 mt-0.5 space-y-0.5 list-none">
                      {item.steps.map((step, i) => (
                        <li key={step}>
                          <span className="text-sky-300 font-semibold mr-1">{i + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
              <p className="text-[11px] text-slate-500 italic">
                Tip: desktop mode works best in landscape orientation.
              </p>
            </div>
          )}

          <p className="text-[11px] text-slate-500 text-center">
            Prefer a real desktop? Open this site on any laptop or PC for the full experience.
          </p>
        </div>
      </div>
    </div>
  );
};
