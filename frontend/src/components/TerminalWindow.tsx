import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { Folder, Project, DeveloperProfile } from '../types';

interface TerminalWindowProps {
  folders: Folder[];
  projects: Project[];
  profile: DeveloperProfile;
  onOpenFolder: (folderId: string) => void;
  onOpenAddFolderModal: () => void;
  onOpenAddProjectModal: () => void;
}

interface CommandHistory {
  cmd: string;
  output: React.ReactNode;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  folders,
  projects,
  profile,
  onOpenFolder,
  onOpenAddFolderModal,
  onOpenAddProjectModal,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      cmd: 'welcome',
      output: (
        <div className="space-y-1 text-slate-300">
          <p className="text-amber-400 font-bold">
            Windows Portfolio CLI v2026.1 [Version 10.0.22631]
          </p>
          <p className="text-slate-400">
            Type <span className="text-blue-400 font-mono font-bold">help</span> to view available system commands.
          </p>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = input.trim();
    if (!rawCmd) return;

    const parts = rawCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: React.ReactNode = null;

    switch (command) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-amber-400 font-bold">Available Commands:</p>
            <p><span className="font-mono text-emerald-400 w-24 inline-block">ls / dir</span> List all desktop folders & projects</p>
            <p><span className="font-mono text-emerald-400 w-24 inline-block">open &lt;name&gt;</span> Open folder or project by name</p>
            <p><span className="font-mono text-emerald-400 w-24 inline-block">mkdir</span> Launch new folder dialog</p>
            <p><span className="font-mono text-emerald-400 w-24 inline-block">addproj</span> Launch add project dialog</p>
            <p><span className="font-mono text-emerald-400 w-24 inline-block">whoami</span> Display developer profile details</p>
            <p><span className="font-mono text-emerald-400 w-24 inline-block">clear / cls</span> Clear terminal history</p>
          </div>
        );
        break;

      case 'ls':
      case 'dir':
        output = (
          <div className="space-y-2 text-xs">
            <div>
              <p className="text-amber-400 font-bold mb-1">Folders ({folders.length}):</p>
              <div className="grid grid-cols-2 gap-1 text-slate-300">
                {folders.map((f) => (
                  <span key={f.id} className="text-blue-400">
                    📁 {f.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-amber-400 font-bold mb-1">Projects ({projects.length}):</p>
              <div className="space-y-0.5 text-slate-300">
                {projects.map((p) => (
                  <p key={p.id}>
                    ⚡ <span className="text-white font-medium">{p.title}</span> - <span className="text-slate-400">{p.tagline}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-1 text-xs text-slate-200">
            <p className="text-blue-400 font-bold text-sm">{profile.name}</p>
            <p className="text-slate-300">{profile.role}</p>
            <p className="text-slate-400">{profile.bio}</p>
            <p className="text-slate-400">📍 {profile.location} | 📧 {profile.email}</p>
          </div>
        );
        break;

      case 'mkdir':
        onOpenAddFolderModal();
        output = <p className="text-emerald-400">Opening new folder dialog...</p>;
        break;

      case 'addproj':
        onOpenAddProjectModal();
        output = <p className="text-emerald-400">Opening add project dialog...</p>;
        break;

      case 'open':
        if (!args.length) {
          output = <p className="text-rose-400">Usage: open &lt;folder-name or project-name&gt;</p>;
        } else {
          const searchName = args.join(' ').toLowerCase();
          const targetFolder = folders.find((f) => f.name.toLowerCase().includes(searchName));
          if (targetFolder) {
            onOpenFolder(targetFolder.id);
            output = <p className="text-emerald-400">Opening folder '{targetFolder.name}'...</p>;
          } else {
            output = <p className="text-rose-400">No folder found matching '{searchName}'</p>;
          }
        }
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        setInput('');
        return;

      default:
        output = (
          <p className="text-rose-400">
            Command not recognized: '{command}'. Type <span className="font-mono text-blue-400">help</span> for assistance.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { cmd: rawCmd, output }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 font-mono text-xs text-slate-200 p-4 overflow-y-auto">
      {history.map((item, idx) => (
        <div key={idx} className="mb-3 space-y-1">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-emerald-400 font-bold">PS C:\Users\Yonathan\Portfolio&gt;</span>
            <span className="text-white font-medium">{item.cmd}</span>
          </div>
          <div className="pl-4">{item.output}</div>
        </div>
      ))}

      {/* Input Prompt */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 mt-1">
        <span className="text-emerald-400 font-bold shrink-0">PS C:\Users\Yonathan\Portfolio&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-slate-100 focus:outline-none caret-blue-400"
          placeholder="Type command..."
          autoFocus
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
};
