import React from 'react';
import { 
  Terminal, Sliders, GitCompare, BarChart3, Cpu, FolderLock, 
  Plus, Activity, Layers, Sparkles 
} from 'lucide-react';
import PromptForgeLogo from './PromptForgeLogo';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'studio', label: 'System Prompts', sub: 'Prompt Optimizer Studio', icon: Terminal },
    { id: 'compression', label: 'Token Compression', sub: 'Terse Directives', icon: Sliders },
    { id: 'diff', label: 'Version Diff & Audit', sub: 'Anti-Patterns Purged', icon: GitCompare },
    { id: 'analytics', label: 'Cost & Token Telemetry', sub: 'Discipline Scoreboard', icon: BarChart3 },
    { id: 'matrix', label: 'Model Benchmarks', sub: 'Cross-Model Matrix', icon: Cpu },
    { id: 'files', label: 'Context Vault & Files', sub: 'Markdown / TOON Ingest', icon: FolderLock },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between shrink-0 p-3 select-none hidden md:flex font-mono">
      {/* Navigation Links */}
      <div className="space-y-4">
        {/* Workspace Brand Header */}
        <div className="px-2 pt-1 pb-2 border-b border-slate-800/80 flex items-center justify-between">
          <PromptForgeLogo size="sm" variant="horizontal" />
        </div>

        {/* Workspace Header */}
        <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span>WORKSPACES &amp; TASKS</span>
          <button 
            onClick={() => setActiveTab('studio')}
            className="p-1 hover:text-blue-400 hover:bg-slate-800/60 rounded transition-colors"
            title="New Prompt Workspace"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-900 text-slate-500 group-hover:text-slate-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate -mt-0.5">
                    {item.sub}
                  </div>
                </div>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Telemetry Box at Bottom */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-blue-400" />
            <span>SYSTEM TELEMETRY</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-bold">ONLINE</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Context Cache</span>
            <span className="text-emerald-400 font-bold">94.2%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '94.2%' }}></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
          <span className="text-slate-400">Avg Optimization</span>
          <span className="text-slate-200 font-bold">18.4ms</span>
        </div>
      </div>
    </aside>
  );
}
