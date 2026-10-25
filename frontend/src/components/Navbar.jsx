import React from 'react';
import { Menu, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import PromptForgeLogo from './PromptForgeLogo';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onToggleSidebar, 
  currentUser, 
  onLogout 
}) {
  const tabs = [
    { id: 'studio', label: 'Prompt Optimizer' },
    { id: 'files', label: 'File Converter' },
    { id: 'diff', label: 'Comparison & Diff' },
    { id: 'analytics', label: 'Token Analytics' },
  ];

  return (
    <header className="h-16 border-b border-slate-200/90 bg-white/85 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between font-sans shadow-sm">
      {/* Left: 3-Lines Hamburger Button & Logo */}
      <div className="flex items-center gap-3">
        {/* 3-Lines Menu Icon Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer flex items-center gap-2 group shadow-sm bg-white"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-blue-600 group-hover:scale-105 transition-transform" />
          <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Menu</span>
        </button>

        {/* Brand Logo with Professional PromptForge Emblem */}
        <div 
          onClick={() => setActiveTab('studio')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <PromptForgeLogo size="sm" variant="horizontal" />
        </div>
      </div>

      {/* Center: Clean Workspace Tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right: User Profile */}
      <div className="flex items-center gap-2">

        {/* User Card & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
          <div className="text-right hidden sm:block">
            <div className="font-bold text-slate-800 leading-tight">
              {currentUser?.fullName || 'Priya Patel'}
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              @{currentUser?.username || 'priya'}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {currentUser?.fullName?.charAt(0) || 'P'}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-0.5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
