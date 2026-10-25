import React from 'react';
import { 
  Sparkles, FileText, GitCompare, BarChart3, Database, 
  X, LogOut, User, CheckCircle2, ChevronRight, Sliders, ShieldCheck
} from 'lucide-react';
import PromptForgeLogo from './PromptForgeLogo';

export default function SidebarDrawer({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout, 
  onOpenDbModal,
  dbStatus 
}) {
  const menuItems = [
    { 
      id: 'studio', 
      label: 'Prompt Optimizer', 
      desc: 'Input raw prompt & get lean, high-efficiency AI prompts', 
      icon: Sparkles 
    },
    { 
      id: 'files', 
      label: 'File Converter', 
      desc: 'Convert PDF, Word, Excel, and JSON to Markdown/TSV/TOON', 
      icon: FileText 
    },
    { 
      id: 'diff', 
      label: 'Comparison & Diff', 
      desc: 'Review token savings, removed fluff, and side-by-side diff', 
      icon: GitCompare 
    },
    { 
      id: 'analytics', 
      label: 'Token Analytics', 
      desc: 'Prompt improvement line chart & Claude vs ChatGPT donut chart', 
      icon: BarChart3 
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel from the left */}
      <aside className="relative w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col justify-between p-5 z-10 animate-slideRight">
        {/* Top Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <PromptForgeLogo size="sm" variant="horizontal" showTagline={true} />
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 mb-2">
              Workspaces &amp; Tools
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/15 border border-blue-500/30 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold flex items-center justify-between">
                      <span>{item.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-blue-400"></span>}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Database Setting & User Profile */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          {/* Database Setup Button */}
          <button
            onClick={() => {
              onClose();
              if (onOpenDbModal) onOpenDbModal();
            }}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors cursor-pointer ${
              dbStatus?.isPostgres
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/50'
                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Database className={`w-4 h-4 ${dbStatus?.isPostgres ? 'text-emerald-400' : 'text-blue-400'}`} />
              <div className="text-left">
                <div className="font-semibold text-[11px]">
                  {dbStatus?.isPostgres ? 'PostgreSQL Connected' : 'PostgreSQL Settings'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {dbStatus?.isPostgres ? 'Saving prompts live to DB' : 'Configure pgAdmin password'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* User Profile Bar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                {currentUser?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="text-left">
                <div className="font-medium text-white text-xs truncate max-w-[120px]">
                  {currentUser?.fullName || 'User'}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser?.email || ''}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

