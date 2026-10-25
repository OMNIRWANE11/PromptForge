import React from 'react';
import { Menu, Database, LogOut, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import PromptForgeLogo from './PromptForgeLogo';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onToggleSidebar, 
  currentUser, 
  onLogout,
  onOpenDbModal,
  onOpenAssumptionsModal,
  dbStatus 
}) {
  const tabs = [
    { id: 'studio', label: 'Prompt Optimizer' },
    { id: 'files', label: 'File Converter' },
    { id: 'diff', label: 'Comparison & Diff' },
    { id: 'analytics', label: 'Token Analytics' },
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between font-sans">
      {/* Left: 3-Lines Hamburger Button & Logo */}
      <div className="flex items-center gap-3">
        {/* 3-Lines Menu Icon Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer flex items-center gap-2 group shadow-sm"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-blue-400 group-hover:scale-105 transition-transform" />
          <span className="text-xs font-medium text-slate-300 hidden sm:inline">Menu</span>
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
      <nav className="hidden md:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Stated Assumptions, PostgreSQL Status Pill & User Profile */}
      <div className="flex items-center gap-2">
        {/* Stated Assumptions & Tokenizer Methodology Button */}
        <button
          onClick={onOpenAssumptionsModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-700/60 bg-slate-800/60 hover:bg-slate-700/80 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
          title="View stated assumptions and tokenizer library specifications"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden lg:inline">Assumptions</span>
        </button>

        {/* PostgreSQL Database Pill */}
        <button
          onClick={onOpenDbModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
            dbStatus?.isPostgres
              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-950/60'
              : 'bg-amber-950/30 border-amber-700/60 text-amber-300 hover:bg-amber-950/50'
          }`}
          title="Click to configure PostgreSQL connection"
        >
          <span className={`w-2 h-2 rounded-full ${dbStatus?.isPostgres ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {dbStatus?.isPostgres ? 'PostgreSQL Active' : 'Connect PostgreSQL'}
          </span>
        </button>

        {/* User Card & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
          <div className="text-right hidden sm:block">
            <div className="font-semibold text-slate-200 leading-tight">
              {currentUser?.fullName || 'Priya Patel'}
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">
              @{currentUser?.username || 'priya'}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-semibold text-xs shadow-sm">
            {currentUser?.fullName?.charAt(0) || 'P'}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-0.5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
