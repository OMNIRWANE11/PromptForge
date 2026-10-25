import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import SidebarDrawer from './components/SidebarDrawer';
import PromptStudio from './components/PromptStudio';
import FileConverter from './components/FileConverter';
import VersionDiffAudit from './components/VersionDiffAudit';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AuthScreen from './components/AuthScreen';
import PromptForgeLogo from './components/PromptForgeLogo';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('promptforge_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('studio');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState({
    connected: true,
    isPostgres: false,
    type: 'sqlite',
    info: 'Local storage active'
  });

  const [rawPrompt, setRawPrompt] = useState('');
  const [targetProvider, setTargetProvider] = useState('claude-3-5-sonnet');
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loadingOptimize, setLoadingOptimize] = useState(false);

  // Poll or fetch database status on load
  const refreshDbStatus = async () => {
    try {
      const res = await fetch('/api/database/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.warn("Could not fetch DB status:", e);
    }
  };

  useEffect(() => {
    refreshDbStatus();
  }, []);

  // Sign out handler
  const handleLogout = () => {
    localStorage.removeItem('promptforge_user');
    localStorage.removeItem('promptforge_token');
    setCurrentUser(null);
    setOptimizationResult(null);
  };

  // Run Prompt Optimization and persist to PostgreSQL/SQLite
  const handleOptimize = async (overrideProvider) => {
    if (!rawPrompt.trim()) return null;

    const providerToUse = overrideProvider || targetProvider;
    if (overrideProvider && overrideProvider !== targetProvider) {
      setTargetProvider(overrideProvider);
    }

    setLoadingOptimize(true);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt: rawPrompt,
          targetProvider: providerToUse,
          userId: currentUser?.id || 1
        })
      });
      const data = await res.json();
      setOptimizationResult(data);

      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#2563eb', '#10b981', '#38bdf8', '#f59e0b']
        });
      } catch (e) {}
      return data;
    } catch (err) {
      console.error("Optimization pipeline call:", err);
      return null;
    } finally {
      setLoadingOptimize(false);
    }
  };

  // Step 1: If user is not authenticated, render Login / Sign Up Page first!
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Step 2: Once authenticated, render clean, functional workspace
  return (
    <div className="min-h-screen bg-[#edf2f9] text-slate-800 flex flex-col font-sans selection:bg-blue-600/20 selection:text-blue-800">
      {/* Slide-out Sidebar Drawer triggered by 3 lines hamburger menu */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Clean Global Navbar with 3-Lines Menu Icon & Tabs */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onToggleSidebar={() => setIsSidebarOpen(true)}
        currentUser={currentUser} 
        onLogout={handleLogout}
      />

      {/* Main Workspace (No clutter, spacious, clean & focused) */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl mx-auto w-full relative z-10">
        {/* 1. Prompt Optimizer */}
        {activeTab === 'studio' && (
          <PromptStudio
            rawPrompt={rawPrompt}
            setRawPrompt={setRawPrompt}
            targetProvider={targetProvider}
            setTargetProvider={setTargetProvider}
            onOptimize={handleOptimize}
            result={optimizationResult}
            loading={loadingOptimize}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
          />
        )}

        {/* 2. Fully Functional File Converter (PDF, Word, Excel, JSON -> Markdown/TSV/TOON) */}
        {activeTab === 'files' && (
          <FileConverter 
            setRawPrompt={setRawPrompt}
            setActiveTab={setActiveTab}
          />
        )}

        {/* 3. Comparison & Diff */}
        {activeTab === 'diff' && (
          <VersionDiffAudit
            rawPrompt={rawPrompt}
            result={optimizationResult}
            targetProvider={targetProvider}
            setActiveTab={setActiveTab}
          />
        )}

        {/* 4. Token & Prompt Improvement Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            setActiveTab={setActiveTab} 
            currentUser={currentUser}
            setRawPrompt={setRawPrompt}
          />
        )}
      </main>

      {/* Sleek Professional Brand Footer with PromptForge Logo */}
      <footer className="border-t border-slate-200/90 bg-white/80 py-4 px-6 text-xs text-slate-500 mt-auto select-none backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <PromptForgeLogo size="xs" variant="horizontal" />
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-500 font-mono tracking-widest hidden sm:inline uppercase font-medium">
              Optimize • Minimize • Maximize
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </span>
            <span>•</span>
            <span>PromptForge Engine v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
