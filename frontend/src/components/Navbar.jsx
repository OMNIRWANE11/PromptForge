import React from 'react';
import { Sparkles, Cpu, FileText, BarChart3, Terminal, BookOpen, Bell, CheckCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const navTabs = [
    { id: 'studio', label: 'Prompt Studio', tag: '(P0)' },
    { id: 'files', label: 'File Structuring', tag: '(P0/P1)' },
    { id: 'matrix', label: 'Cross-Model Matrix', tag: '(P1)' },
    { id: 'analytics', label: 'Token Analytics', tag: '(P1/P2)' },
  ];

  return (
    <header className="h-14 border-b border-slate-800/90 bg-[#070b13] sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6">
      {/* Brand & Version Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-cyan-400 font-bold text-base tracking-tight">&gt;_</span>
          <span className="text-white font-bold text-base tracking-tight">PromptForge</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60">
          v1.4-Hackathon-MVP
        </span>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="flex items-center gap-1.5">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800/90 text-cyan-300 font-semibold border border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <span className="text-xs">{tab.label}</span>
              <span className="text-[10px] text-slate-500 font-mono -mt-0.5">{tab.tag}</span>
            </button>
          );
        })}
      </nav>

      {/* Status Indicators & User Profile */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Saved: 142.8k tokens / $18.40</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>All Tokenizers Live</span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 pl-1 border-l border-slate-800">
          <button className="p-1.5 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors" title="Documentation">
            <BookOpen className="w-4 h-4" />
          </button>
          <div className="relative">
            <button className="p-1.5 hover:text-slate-200 hover:bg-slate-800/60 rounded-md transition-colors" title="Notifications">
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-cyan-500 text-slate-950 rounded-full text-[9px] font-bold flex items-center justify-center">
              2
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-200 leading-tight">Priya Patel</div>
            <div className="text-[10px] text-cyan-400 font-mono leading-tight">AI Lead</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border border-cyan-400/40 shadow-sm">
            PP
          </div>
        </div>
      </div>
    </header>
  );
}
