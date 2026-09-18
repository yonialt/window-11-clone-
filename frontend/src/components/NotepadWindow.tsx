import React from 'react';

interface NotepadWindowProps {
  content: string;
  onChange: (content: string) => void;
}

export const NotepadWindow: React.FC<NotepadWindowProps> = ({ content, onChange }) => {
  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'Consolas, "Courier New", monospace' }}>
      <div className="flex items-center gap-4 px-4 py-1.5 bg-slate-900/80 border-b border-white/8 text-xs text-slate-400 shrink-0">
        <span className="hover:text-white cursor-pointer">File</span>
        <span className="hover:text-white cursor-pointer">Edit</span>
        <span className="hover:text-white cursor-pointer">Format</span>
        <span className="hover:text-white cursor-pointer">View</span>
        <span className="hover:text-white cursor-pointer">Help</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-white text-slate-900 p-4 text-sm resize-none focus:outline-none leading-relaxed"
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
};
