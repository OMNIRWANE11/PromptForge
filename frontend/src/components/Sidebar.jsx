import React from 'react';
import { Terminal, FileCode2, Cpu, BarChart3, Activity } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'studio', label: 'Prompt Studio', icon: Terminal },
    { id: 'files', label: 'File Structuring', icon: FileCode2 },
    { id: 'matrix', label: 'Cross-Model Matrix', icon: Cpu },
    { id: 'analytics', label: 'Token Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-56 bg-[#080d16] border-r border-slate-800/80 flex flex-col justify-between shrink-0 p-3 select-none hidden md:flex">
      {/* Navigation Links */}
      <div className="space-y-4">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 px-3">
          ENGINES & WORKFLOWS
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-slate-800/90 text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Telemetry Box at Bottom */}
      <div className="p-3 rounded-xl bg-[#0b121e] border border-slate-800/80 space-y-2.5">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>SYSTEM TELEMETRY</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Context Cache</span>
            <span className="text-emerald-400 font-bold">94.2%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" style={{ width: '94.2%' }}></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-800/60">
          <span className="text-slate-400">Avg Latency</span>
          <span className="text-slate-200 font-bold">312ms</span>
        </div>
      </div>
    </aside>
  );
}

