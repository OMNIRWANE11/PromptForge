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
  onLogout 
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
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel from the left */}
      <aside className="relative w-80 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl flex flex-col justify-between p-5 z-10 animate-slideRight">
        {/* Top Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <PromptForgeLogo size="sm" variant="horizontal" showTagline={true} />
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
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
                      ? 'bg-blue-50/80 border border-blue-200 text-blue-900 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold flex items-center justify-between text-slate-900">
                      <span>{item.label}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Profile */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          {/* User Profile Bar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {currentUser?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-800 text-xs truncate max-w-[120px]">
                  {currentUser?.fullName || 'User'}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  @{currentUser?.username || 'user'}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
