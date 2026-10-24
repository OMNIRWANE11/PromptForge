import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Download, 
  Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Lightbulb, Activity, Search
} from 'lucide-react';

export default function AnalyticsDashboard({ setActiveTab }) {
  const [activeFilter, setActiveFilter] = useState('30D');
  const [searchTerm, setSearchTerm] = useState('');

  const auditEvents = [
    {
      id: 'prod/analytics-service#184',
      time: '14:32:04.18',
      title: 'SQL Query Generator & Explainer',
      model: 'Gemini 1.5 Pro',
      modelColor: 'text-blue-400 bg-blue-950/60 border-blue-800',
      raw: '1,842',
      lean: '1,190',
      delta: '-35.4%',
      guardrail: 'Pass'
    },
    {
      id: 'legal/document-pipeline#4042',
      time: '14:31:18.50',
      title: 'Compliance PDF Section Extractor',
      model: 'Claude 3.5 Sonnet',
      modelColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      raw: '12,400',
      lean: '6,820',
      delta: '-45.0%',
      guardrail: 'Pass'
    },
    {
      id: 'core-ui/widget-builder#882',
      time: '14:28:45.32',
      title: 'Frontend Component Scaffold (TSX)',
      model: 'GPT-4o',
      modelColor: 'text-amber-400 bg-amber-950/60 border-amber-800',
      raw: '3,120',
      lean: '2,410',
      delta: '-22.8%',
      guardrail: 'Pass'
    },
    {
      id: 'sre/pager-bot#914',
      time: '14:25:01.03',
      title: 'Microservice Health Incident Brief',
      model: 'Gemini 1.5 Flash',
      modelColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800',
      raw: '4,500',
      lean: '3,010',
      delta: '-33.1%',
      guardrail: 'Pass'
    }
  ];

  const filteredEvents = auditEvents.filter(ev => 
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ev.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "TIMESTAMP,TASK,IDENTIFIER,MODEL,RAW_TOKENS,LEAN_TOKENS,DELTA,GUARDRAIL\n" +
      auditEvents.map(e => `${e.time},"${e.title}",${e.id},${e.model},${e.raw},${e.lean},${e.delta},${e.guardrail}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "promptforge_audit_telemetry.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Executive Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl">
        <div className="space-y-1 font-mono">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-cyan-400 font-bold">TELEMETRY MODULE // P1-P2</span>
            <span className="text-emerald-400 font-semibold">• Live Stream Sync: 12s ago</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Executive Token Intelligence &amp; Cost Guard
          </h2>
          <div className="text-[11px] text-slate-500">
            Cluster: <strong className="text-slate-300">US-East-Production-Fleet</strong>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          {/* Time Filter Pills */}
          <div className="flex items-center bg-[#070b13] p-1 rounded-lg border border-slate-800">
            {['7D', '30D', '90D (Q3)', 'FY24'].map((period) => (
              <button
                key={period}
                onClick={() => setActiveFilter(period)}
                className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                  activeFilter === period
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 High-Level Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        {/* Cumulative Tokens Saved */}
        <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase text-[10px]">CUMULATIVE TOKENS SAVED</span>
            <span className="p-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight">
            14,842,109
          </div>
          <div className="flex items-center justify-between text-[11px] text-emerald-400">
            <span>↗ +34.2% vs unoptimized baseline</span>
            <span className="text-slate-500">~</span>
          </div>
        </div>

        {/* Estimated API Cost Avoidance */}
        <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase text-[10px]">ESTIMATED API COST AVOIDANCE</span>
            <span className="p-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-emerald-400 tracking-tight">
            $3,420.50
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>9 accounts pooled across Anthropic, Google, OpenAI</span>
            <span className="text-cyan-400 font-bold">-$0.23 / 1k req</span>
          </div>
        </div>

        {/* Prompt Discipline Score */}
        <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase text-[10px]">PROMPT DISCIPLINE SCORE</span>
            <span className="p-1 rounded bg-amber-950 border border-amber-800 text-amber-400">
              <Activity className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-white tracking-tight flex items-baseline gap-2">
            <span>78.4%</span>
            <span className="text-emerald-400 text-xs font-semibold">+21.6%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Baseline: 56.8%</span>
            <span>Target: 85%</span>
          </div>
        </div>

        {/* Guardrail Zero-Defect Rate */}
        <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase text-[10px]">GUARDRAIL ZERO-DEFECT RATE</span>
            <span className="p-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl font-bold text-emerald-400 tracking-tight">
            100.0%
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>0 constraints dropped • 12,480 AST safety passes</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
              Deterministic
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Chart + Donut Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 font-mono">
        {/* Left Chart: User Prompt Improvement Line Chart (Requirement 7) */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    User Prompt Writing Improvement (Discipline Score)
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold">
                    Line Chart • Longitudinal Trend
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Measures whether the user's raw prompt writing is becoming leaner and more disciplined over time
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span className="w-3 h-0.5 border-t border-dashed border-slate-400"></span>
                  <span>Raw Tokens Consumed</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                  <span className="w-3 h-0.5 bg-emerald-400"></span>
                  <span>Discipline Score (% Gain)</span>
                </span>
              </div>
            </div>

            {/* SVG Visual Line Chart */}
            <div className="relative h-44 w-full bg-[#070b13] rounded-lg p-2 border border-slate-800/80 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 600 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under improvement curve */}
                <path
                  d="M 10 125 L 70 115 L 140 102 L 210 92 L 280 80 L 350 68 L 420 54 L 490 44 L 560 32 L 590 28 L 590 145 L 10 145 Z"
                  fill="url(#chartGradient)"
                />
                {/* Raw Prompt Token Trend (dashed line decreasing as user improves) */}
                <path
                  d="M 10 65 L 70 72 L 140 85 L 210 95 L 280 108 L 350 112 L 420 120 L 490 126 L 560 132 L 590 135"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                {/* User Prompt Writing Discipline Improvement Line (Rising green line) */}
                <path
                  d="M 10 125 L 70 115 L 140 102 L 210 92 L 280 80 L 350 68 L 420 54 L 490 44 L 560 32 L 590 28"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
                <circle cx="10" cy="125" r="3" fill="#10b981" />
                <circle cx="280" cy="80" r="3" fill="#10b981" />
                <circle cx="590" cy="28" r="4" fill="#34d399" />
              </svg>
            </div>

            {/* Time labels */}
            <div className="flex justify-between text-[10px] text-slate-500 pt-1">
              <span>Week 1 (56.8% Baseline)</span>
              <span>Week 2 (64.2%)</span>
              <span>Week 3 (71.5%)</span>
              <span>Week 4 (78.4% Current)</span>
              <span className="text-emerald-400 font-bold">Target: 85%</span>
            </div>
          </div>

          {/* Metric Footer Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
            <div className="p-2 rounded bg-[#070b13] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Prompting Habit Gain</span>
              <span className="text-emerald-400 font-bold">+21.6% cleaner inputs</span>
            </div>
            <div className="p-2 rounded bg-[#070b13] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Avg Fluff Stripped</span>
              <span className="text-slate-200 font-bold">42.8 tokens / prompt</span>
            </div>
            <div className="p-2 rounded bg-[#070b13] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Guardrail Defect Rate</span>
              <span className="text-emerald-400 font-bold">0% (Zero loss)</span>
            </div>
            <div className="p-2 rounded bg-[#070b13] border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Tokens Saved / Mo</span>
              <span className="text-cyan-400 font-bold">14.8M tokens</span>
            </div>
          </div>
        </div>

        {/* Right Card: Donut Chart comparing ChatGPT vs Claude (Requirement 7) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h4 className="text-sm font-bold text-white">ChatGPT vs Claude Comparison</h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                Donut Chart
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Comparing prompt improvement &amp; token savings between ChatGPT and Claude AI
            </p>

            {/* Donut Graphic comparing Claude & ChatGPT */}
            <div className="flex items-center justify-center py-4 relative">
              <div className="w-32 h-32 rounded-full border-8 border-cyan-400 border-t-emerald-400 border-l-emerald-400 flex items-center justify-center">
                <div className="text-center font-mono">
                  <span className="text-xs font-bold text-white block">ChatGPT vs</span>
                  <span className="text-xs font-bold text-emerald-400 block">Claude</span>
                  <span className="text-[9px] text-slate-400 uppercase">Comparison</span>
                </div>
              </div>
            </div>

            {/* Claude vs ChatGPT Comparison Legend */}
            <div className="space-y-2.5 text-xs">
              {/* Claude */}
              <div className="p-2 rounded-lg bg-[#070b13] border border-emerald-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-white font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span>Anthropic Claude</span>
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">54% Volume</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Prompt Improvement Rate:</span>
                  <span className="text-emerald-300 font-bold">+28.4%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Avg Reduction: -44.0%</span>
                  <span>5.64M tokens saved</span>
                </div>
              </div>

              {/* ChatGPT */}
              <div className="p-2 rounded-lg bg-[#070b13] border border-cyan-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-white font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    <span>OpenAI ChatGPT</span>
                  </span>
                  <span className="text-cyan-400 font-bold font-mono">46% Volume</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Prompt Improvement Rate:</span>
                  <span className="text-cyan-300 font-bold">+24.1%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Avg Reduction: -38.5%</span>
                  <span>4.82M tokens saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recurring Token Leaks & Waste Heuristics */}
      <div className="p-4 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-amber-400">⚡</span>
            <h4 className="text-sm font-bold text-white">
              Recurring Token Leaks &amp; Waste Heuristics
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Auto-remediation active across all pipelines
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* Card 1 */}
          <div className="p-3.5 rounded-lg bg-[#070b13] border border-slate-800/90 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold">
                  Found in 78% of raw prompts
                </span>
                <span className="text-rose-400">-28 tokens avg</span>
              </div>
              <h5 className="font-bold text-white text-sm">Redundant Role Framing</h5>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Developers repeatedly prefix prompts with verbose personas like <span className="text-cyan-400 font-mono">"You are an expert fullstack architect..."</span>.
              </p>
            </div>

            <div className="p-2 rounded bg-[#0b121e] border border-slate-800 text-[10px]">
              <span className="text-cyan-400 font-bold block mb-0.5">PROMPTFORGE FIX ACTION</span>
              <p className="text-slate-300 leading-tight">
                Shifts persona into system-instruction parameter or strips boilerplate if redundant with schema requirements.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-3.5 rounded-lg bg-[#070b13] border border-slate-800/90 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold">
                  Found in 41% of file jobs
                </span>
                <span className="text-rose-400">-1,420 tokens avg</span>
              </div>
              <h5 className="font-bold text-white text-sm">Uncurated Document Dumps</h5>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Engineers ingest massive multi-page raw specs or logs without targeting, causing context windows to balloon and cache misses to spike.
              </p>
            </div>

            <div className="p-2 rounded bg-[#0b121e] border border-slate-800 text-[10px]">
              <span className="text-cyan-400 font-bold block mb-0.5">PROMPTFORGE FIX ACTION</span>
              <p className="text-slate-300 leading-tight">
                Auto-extracts target syntax trees and slices irrelevant boilerplate headings prior to dispatch.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-3.5 rounded-lg bg-[#070b13] border border-slate-800/90 space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/40 text-blue-300 font-bold">
                  Found in 64% of prompts
                </span>
                <span className="text-rose-400">-14 tokens avg</span>
              </div>
              <h5 className="font-bold text-white text-sm">Conversational Politeness &amp; Filler</h5>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Pleasantries such as <span className="text-cyan-400 font-mono">"Please can you kindly..."</span> and <span className="text-cyan-400 font-mono">"Thank you so much!"</span> occupy valuable compute slots.
              </p>
            </div>

            <div className="p-2 rounded bg-[#0b121e] border border-slate-800 text-[10px]">
              <span className="text-cyan-400 font-bold block mb-0.5">PROMPTFORGE FIX ACTION</span>
              <p className="text-slate-300 leading-tight">
                Pruned via deterministic regex token strips with 0% semantic or instructional degradation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Optimization Audit Stream Table */}
      <div className="p-4 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white">Live Optimization Audit Stream</h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Real-time compilation logs showing token deltas, target models, and guardrail validation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#070b13] border border-slate-800 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter task or model..."
                className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Stream Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">PROMPT TASK / IDENTIFIER</th>
                <th className="py-2.5 px-3">TARGET MODEL</th>
                <th className="py-2.5 px-3 text-right">RAW TOKENS</th>
                <th className="py-2.5 px-3 text-right">LEAN TOKENS</th>
                <th className="py-2.5 px-3 text-right">DELTA (%)</th>
                <th className="py-2.5 px-3 text-center">SAFETY GUARDRAIL</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredEvents.map((ev, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{ev.time}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-white block">{ev.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{ev.id}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${ev.modelColor}`}>
                      {ev.model}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{ev.raw}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{ev.lean}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">{ev.delta}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                      <Check className="w-2.5 h-2.5" /> Pass
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setActiveTab('studio')}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[10px] transition-colors cursor-pointer"
                    >
                      Open in Studio
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
          <span>Showing {filteredEvents.length} of 12,480 telemetry events</span>
          <div className="flex items-center gap-2">
            <button className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Previous</button>
            <button className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
