import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Lock, Globe } from 'lucide-react';

interface BrowserWindowProps {
  initialUrl?: string;
}

const DEFAULT_URL = 'https://www.google.com/webhp?igu=1';

export const BrowserWindow: React.FC<BrowserWindowProps> = ({ initialUrl }) => {
  const [url, setUrl] = useState(initialUrl || DEFAULT_URL);
  const [inputUrl, setInputUrl] = useState(initialUrl || DEFAULT_URL);
  const [history, setHistory] = useState<string[]>([initialUrl || DEFAULT_URL]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = (newUrl: string) => {
    let formatted = newUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      if (formatted.includes('.') && !formatted.includes(' ')) {
        formatted = `https://${formatted}`;
      } else {
        formatted = `https://www.google.com/search?igu=1&q=${encodeURIComponent(formatted)}`;
      }
    }
    setUrl(formatted);
    setInputUrl(formatted);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(formatted);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setLoading(true);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      setUrl(history[idx]);
      setInputUrl(history[idx]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setUrl(history[idx]);
      setInputUrl(history[idx]);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'var(--win11-font)' }}>
      {/* Browser toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 border-b border-white/8 shrink-0">
        <button
          onClick={goBack}
          disabled={historyIndex === 0}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex === history.length - 1}
          className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 text-slate-300"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setLoading(true); setUrl(url); }}
          className="p-1.5 rounded hover:bg-white/10 text-slate-300"
        >
          <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={() => navigate(DEFAULT_URL)}
          className="p-1.5 rounded hover:bg-white/10 text-slate-300"
        >
          <Home className="w-4 h-4" />
        </button>

        <form
          onSubmit={(e) => { e.preventDefault(); navigate(inputUrl); }}
          className="flex-1 flex items-center gap-2 bg-white/8 rounded-lg px-3 py-1.5 border border-white/10"
        >
          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white focus:outline-none"
            placeholder="Search or enter address"
          />
        </form>
      </div>

      {/* Loading bar */}
      {loading && (
        <div className="h-0.5 bg-blue-500 animate-pulse shrink-0" />
      )}

      {/* iframe */}
      <div className="flex-1 relative bg-white">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="Browser"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          onLoad={() => setLoading(false)}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
            <Globe className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
