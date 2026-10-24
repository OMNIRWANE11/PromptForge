import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PromptStudio from './components/PromptStudio';
import FileStructuring from './components/FileStructuring';
import CrossModelMatrix from './components/CrossModelMatrix';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PrdOverview from './components/PrdOverview';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio');
  const [rawPrompt, setRawPrompt] = useState('');
  const [targetProvider, setTargetProvider] = useState('claude-3-5-sonnet');
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [loadingOptimize, setLoadingOptimize] = useState(false);

  // Run Prompt Optimization
  const handleOptimize = async () => {
    if (!rawPrompt.trim()) return;

    setLoadingOptimize(true);
    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPrompt: rawPrompt,
          targetProvider: targetProvider
        })
      });
      const data = await res.json();
      setOptimizationResult(data);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#10b981', '#3b82f6', '#fbbf24']
        });
      } catch (e) {}
    } catch (err) {
      console.error("Optimization pipeline call:", err);
    } finally {
      setLoadingOptimize(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Global Navigation Top Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Shell Layout: Left Sidebar + Center Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Engines & Telemetry Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Center Main Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 max-w-[1600px] mx-auto w-full">
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
            />
          )}

          {activeTab === 'files' && (
            <FileStructuring setActiveTab={setActiveTab} />
          )}

          {activeTab === 'matrix' && (
            <CrossModelMatrix />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard setActiveTab={setActiveTab} />
          )}

          {activeTab === 'prd' && (
            <PrdOverview />
          )}
        </main>
      </div>
    </div>
  );
}
