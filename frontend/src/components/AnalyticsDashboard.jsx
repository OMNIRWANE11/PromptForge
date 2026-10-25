import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, Download, 
  Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Lightbulb, Activity, Search,
  Database, RefreshCw, Filter, ChevronRight, ChevronLeft
} from 'lucide-react';

export default function AnalyticsDashboard({ setActiveTab, currentUser, setRawPrompt }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const userId = currentUser?.id || 1;
      try {
        const [analyticsRes, historyRes] = await Promise.all([
          fetch(`/api/user/analytics?userId=${userId}`),
          fetch(`/api/user/history?userId=${userId}&limit=50`)
        ]);
        const analyticsData = await analyticsRes.json();
        const historyData = await historyRes.json();

        setAnalytics(analyticsData);
        setHistory(historyData.history || []);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [currentUser]);

  // Historical Prompt rows matching Image 3 Bottom Table
  const tableRows = [
    {
      time: 'Today 14:22',
      prompt: 'Generate a comprehensive analysis of microservice telemetry and error rates...',
      model: 'Claude 3.5 Sonnet',
      modelClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      raw: 492,
      opt: 114,
      saved: '76.8%',
      lang: 'EN'
    },
    {
      time: 'Yesterday 18:10',
      prompt: 'Mujhe ek automated script chahiye python me jo daily sales data parse kare...',
      model: 'ChatGPT (GPT-4o)',
      modelClass: 'text-blue-400 bg-blue-950/60 border-blue-800',
      raw: 380,
      opt: 98,
      saved: '74.2%',
      lang: 'HI'
    },
    {
      time: 'Oct 28',
      prompt: 'Create API authentication middleware in Go using JWT tokens and Redis session cache...',
      model: 'Claude 3.5 Sonnet',
      modelClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
      raw: 610,
      opt: 175,
      saved: '71.3%',
      lang: 'EN'
    },
    {
      time: 'Oct 27',
      prompt: 'Summarize the customer review sentiment de las últimas semanas in tabular format...',
      model: 'General AI',
      modelClass: 'text-amber-400 bg-amber-950/60 border-amber-800',
      raw: 290,
      opt: 120,
      saved: '58.6%',
      lang: 'ES'
    }
  ];

  const filteredRows = tableRows.filter(r => {
    const matchesSearch = r.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || r.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModel = modelFilter === 'all' || r.model.toLowerCase().includes(modelFilter.toLowerCase());
    return matchesSearch && matchesModel;
  });

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "DATE_TIME,RAW_PROMPT,MODEL,RAW_TOKENS,OPT_TOKENS,PERCENT_SAVED,LANGUAGE\n" +
      tableRows.map(e => `"${e.time}","${e.prompt.replace(/"/g, '""')}","${e.model}",${e.raw},${e.opt},"${e.saved}","${e.lang}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `promptforge_telemetry_scoreboard.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-sans select-none">
      {/* 1. Top 4 High-Level Metric KPI Cards (Matches Image 3 Top Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        {/* TOTAL TOKENS SAVED */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase text-[10px] font-semibold tracking-wider">TOTAL TOKENS SAVED</span>
            <span className="text-emerald-400">⚡</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            4.86M
          </div>
          <div className="flex items-center text-[11px] text-emerald-400 font-semibold">
            <span>↑ +34% Saved in past 30 days</span>
          </div>
        </div>

        {/* AVERAGE TOKEN REDUCTION */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase text-[10px] font-semibold tracking-wider">AVERAGE TOKEN REDUCTION</span>
            <span className="text-blue-400">➗</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            68.4%
          </div>
          <div className="text-[11px] text-slate-400">
            Prompts cut from 412 to 130 tokens
          </div>
        </div>

        {/* MONEY SAVED */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase text-[10px] font-semibold tracking-wider">MONEY SAVED</span>
            <span className="text-emerald-400">$</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight flex items-baseline gap-1">
            <span>$382</span>
            <span className="text-xs text-slate-400 font-normal">USD</span>
          </div>
          <div className="text-[11px] text-slate-400">
            ~$114/50 Off your AI billing bills
          </div>
        </div>

        {/* PROMPTS OPTIMIZED */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase text-[10px] font-semibold tracking-wider">PROMPTS OPTIMIZED</span>
            <span className="text-purple-400">↗</span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            1,248
          </div>
          <div className="text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">99.4%</span> Mean prompt intent accuracy
          </div>
        </div>
      </div>

      {/* 2. Middle Section: Prompt Mastery Curve + Model Allocation Donut Chart (Matches Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 font-mono">
        {/* Left: Prompt Mastery Curve: Before vs After (8 cols) */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    Prompt Mastery Curve: Before vs After
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    30-Day Progress
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Your prompts start shorter and sharper, trimming unnecessary filler while keeping full prompt capability.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span className="w-3 h-0.5 border-t border-dashed border-slate-400"></span>
                  <span>Before (Original Input)</span>
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                  <span className="w-3 h-0.5 bg-emerald-400"></span>
                  <span>After (Optimized Result)</span>
                </span>
              </div>
            </div>

            {/* Sub-header metric & Y-Axis Label */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1">
              <span>Tokens Per Prompt</span>
              <span className="text-emerald-400 font-bold">Your Progress: -53.8% Wordiness &amp; Filler</span>
            </div>

            {/* SVG Visual Line Chart with Floating Tooltip (Matches Image 3 Left) */}
            <div className="relative h-48 w-full bg-slate-950 rounded-lg p-2 border border-slate-800/80 overflow-hidden">
              {/* Y Axis Grid Numbers */}
              <div className="absolute left-2 top-2 bottom-6 flex flex-col justify-between text-[9px] text-slate-600 select-none">
                <span>550</span>
                <span>400</span>
                <span>250</span>
                <span>100</span>
              </div>

              <svg className="w-full h-full pl-6 pr-2" viewBox="0 0 600 160" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="30" y1="20" x2="590" y2="20" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="30" y1="65" x2="590" y2="65" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="30" y1="110" x2="590" y2="110" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="30" y1="150" x2="590" y2="150" stroke="#1e293b" strokeWidth="1" />

                {/* Gray Dashed Curve: Before (Original Input) */}
                <path
                  d="M 40 45 L 140 65 L 240 85 L 340 100 L 440 115 L 560 120"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Green Solid Curve: After (Optimized Result) */}
                <path
                  d="M 40 125 L 140 122 L 240 125 L 340 128 L 440 132 L 560 135"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                <circle cx="40" cy="125" r="3.5" fill="#10b981" />
                <circle cx="240" cy="125" r="3.5" fill="#10b981" />
                <circle cx="560" cy="135" r="4" fill="#34d399" />
              </svg>

              {/* Floating Tooltip Box: Day 30 Snapshot (Matches Image 3) */}
              <div className="absolute right-12 top-6 p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-[10px] font-mono shadow-xl backdrop-blur-sm">
                <div className="text-slate-300 font-bold">Day 30 Snapshot</div>
                <div className="text-slate-400">Before: <strong className="text-white">240 tokens</strong></div>
                <div className="text-emerald-400 font-bold">After: 118 tokens (-51%)</div>
              </div>
            </div>

            {/* X Axis Time Labels */}
            <div className="flex justify-between text-[10px] text-slate-500 pt-1.5 px-6">
              <span>Day 1</span>
              <span>Day 6</span>
              <span>Day 12</span>
              <span>Day 18</span>
              <span>Day 24</span>
              <span className="text-slate-300 font-bold">Day 30 (Today)</span>
            </div>
          </div>

          {/* Quick Take Note at bottom of Chart Card */}
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-sans text-slate-300 flex items-center gap-2">
            <span className="text-blue-400 font-mono font-bold">💡 Quick Take:</span>
            <span>By week 3, you are naturally writing prompts that are <strong>2.3x more concise</strong> before even compressing!</span>
          </div>
        </div>

        {/* Right: Model Allocation & Savings Donut Chart (4 cols, Matches Image 3 Right) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold text-white">Model Allocation &amp; Savings</h3>
              <span className="text-slate-500 text-xs">ⓘ</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Where your prompts go and how much each model saves you on average.
            </p>

            {/* Visual Donut Chart with 68.4% AVG SAVINGS in center (Matches Image 3) */}
            <div className="flex flex-col items-center justify-center py-4 relative">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-slate-800"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Claude Arc (58% Purple/Indigo) */}
                  <path
                    className="text-indigo-500"
                    strokeDasharray="58, 100"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* ChatGPT Arc (34% Cyan) */}
                  <path
                    className="text-blue-400"
                    strokeDasharray="34, 100"
                    strokeDashoffset="-58"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* General AI Arc (8% Amber) */}
                  <path
                    className="text-amber-400"
                    strokeDasharray="8, 100"
                    strokeDashoffset="-92"
                    strokeWidth="4.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>

                {/* Donut Center Display: 68.4% AVG SAVINGS */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-mono">
                  <span className="text-base font-extrabold text-white">68.4%</span>
                  <span className="text-[9px] text-slate-400 font-semibold tracking-wider">AVG SAVINGS</span>
                </div>
              </div>
            </div>

            {/* Model Breakdown Legend (Matches Image 3) */}
            <div className="space-y-2.5 text-xs">
              {/* Claude 3.5 Sonnet */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <div>
                    <span className="font-bold text-white block">Claude 3.5 Sonnet</span>
                    <span className="text-[10px] text-slate-400">58% Share (724 prompts)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">71.2%</span>
                  <span className="text-[10px] text-slate-500">saved</span>
                </div>
              </div>

              {/* ChatGPT (GPT-4o) */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <div>
                    <span className="font-bold text-white block">ChatGPT (GPT-4o)</span>
                    <span className="text-[10px] text-slate-400">34% Share (424 prompts)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">66.8%</span>
                  <span className="text-[10px] text-slate-500">saved</span>
                </div>
              </div>

              {/* General Universal */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <div>
                    <span className="font-bold text-white block">General Universal</span>
                    <span className="text-[10px] text-slate-400">8% Share (100 prompts)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">54.0%</span>
                  <span className="text-[10px] text-slate-500">saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Table: Historical Prompt Log & Quality Scoreboard (Matches Image 3) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <h4 className="text-sm font-bold text-white">
              Historical Prompt Log &amp; Quality Scoreboard
            </h4>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Audited telemetry, translation tags, and raw vs compiled token metrics per execution.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search Box */}
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search prompts by keyword, model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Models Dropdown */}
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="all">All Models</option>
              <option value="claude">Claude</option>
              <option value="chatgpt">ChatGPT</option>
              <option value="general">General AI</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            >
              <Filter className="w-3 h-3 text-blue-400" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Historical Scoreboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <th className="py-2.5 px-3">DATE / TIME</th>
                <th className="py-2.5 px-3">RAW PROMPT PREVIEW</th>
                <th className="py-2.5 px-3">MODEL</th>
                <th className="py-2.5 px-3 text-right">RAW</th>
                <th className="py-2.5 px-3 text-right">OPT.</th>
                <th className="py-2.5 px-3 text-right">% SAVED</th>
                <th className="py-2.5 px-3 text-center">LANG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                    {row.time}
                  </td>
                  <td className="py-3 px-3 text-slate-200 max-w-md truncate font-sans text-xs">
                    "{row.prompt}"
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.modelClass}`}>
                      {row.model}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">
                    {row.raw}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {row.opt}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {row.saved}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-bold">
                      {row.lang}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination (Matches Image 3 Bottom) */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
          <div>
            Showing 1-4 of 1,248 prompt optimizations
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">1</span>
            <span className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 cursor-pointer">2</span>
            <span className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 cursor-pointer">3</span>
            <span>...</span>
            <span className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 cursor-pointer">312</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
