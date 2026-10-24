import React, { useState } from 'react';
import { 
  Cpu, Sparkles, TrendingDown, DollarSign, Award, 
  CheckCircle2, ArrowRight, ExternalLink, RefreshCw, Download
} from 'lucide-react';

export default function CrossModelMatrix() {
  const [activeFixture, setActiveFixture] = useState('Standard AST');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <div className="space-y-4">
      {/* 1. Benchmark Suite Sub-Header */}
      <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-bold">
              BENCHMARK SUITE V3.2
            </span>
            <span className="text-emerald-400 font-semibold">• 10,000 Iterations Verified</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Task: <strong className="text-slate-200">Complex Systems Code (Go / Distributed Systems)</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md mx-2">
          <div className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#070b13] border border-slate-800 text-slate-300 text-xs">
            <span className="text-cyan-400">{`{ }`}</span>
            <span className="truncate">"Multi-tenant authorization middleware with JWT vali..."</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Re-run Benchmark Simulation</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report ▾</span>
          </button>
        </div>
      </div>

      {/* 2. Recommendation Engine Winner Card */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#071d18] via-[#09151e] to-[#0d1627] border border-emerald-500/40 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider">
              PROMPTFORGE RECOMMENDATION ENGINE
            </span>
            <span className="text-slate-500">• Pareto Optimality Alpha Index: 9.84</span>
          </div>

          <h3 className="text-base font-bold text-white">
            Anthropic Claude 3.5 Sonnet (LT Variant) is the Optimal Choice for this task.
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            It achieves <strong className="text-emerald-400 font-semibold">97.4% Output Quality Retention</strong> using{' '}
            <strong className="text-cyan-400 font-semibold">44% fewer tokens</strong> than GPT-4o, delivering the lowest total cost-to-accuracy ratio (<strong className="text-white">$0.62 per 10k calls</strong>) while preserving strict Go type signatures without explanatory fluff.
          </p>
        </div>

        <div className="md:col-span-4 flex items-center justify-end gap-4 font-mono text-xs">
          <div className="text-right p-2.5 rounded-lg bg-[#070b13]/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">PROJECTED NET SAVINGS</span>
            <span className="text-emerald-400 font-black text-sm">-$432.80</span>
            <span className="text-[10px] text-slate-400 block">per 1,000,000 pipeline calls</span>
          </div>

          <div className="text-right p-2.5 rounded-lg bg-[#070b13]/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">QUALITY-COST RATIO</span>
            <span className="text-cyan-400 font-black text-sm">157.1 pts/$</span>
            <span className="text-[10px] text-slate-400 block">Highest across models</span>
          </div>
        </div>
      </div>

      {/* 3. Three Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gemini 1.5 Flash / Pro */}
        <div className="p-4 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                  G
                </span>
                <span className="font-bold text-sm text-white">Gemini 1.5 Flash / Pro</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400">
                High Speed
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 mb-2">
              Google DeepMind • API v1beta
            </div>

            {/* Cost Curve Sparkline */}
            <div className="py-1 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Cost Curve (10k-1M)</span>
              <span className="h-1 w-16 bg-cyan-500/60 rounded"></span>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 border-y border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block">Token Density</span>
                <span className="text-slate-200 font-bold">264</span>
                <span className="text-[10px] text-slate-500 block">Gemini Tokenizer</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Cost / 1M Calls</span>
                <span className="text-emerald-400 font-bold">$0.35</span>
                <span className="text-[10px] text-slate-500 block">In: $0.15 / Out: $0.20</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Quality Retention</span>
                <span className="text-slate-300 font-bold">93.8% <span className="text-rose-400 text-[10px]">(-3.6%)</span></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Avg Latency</span>
                <span className="text-cyan-400 font-bold">680 ms</span>
                <span className="text-[10px] text-emerald-400 block">Fastest Response</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 italic pt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase not-italic block mb-0.5">EVALUATION VERDICT</span>
              "Most economical per raw token, but requires slightly more explicit role guardrails for strict Go type safety and concurrency mutex sync."
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Token Budget Overhead</span>
              <span className="text-slate-300">+15.7% vs Claude</span>
            </div>
            <button
              onClick={() => window.open('https://gemini.google.com/app', '_blank')}
              className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
            >
              Open in Google AI Studio ↗
            </button>
          </div>
        </div>

        {/* Claude 3.5 Sonnet (WINNER CARD) */}
        <div className="p-4 rounded-xl bg-[#09151e] border-2 border-cyan-500/80 shadow-2xl shadow-cyan-500/10 flex flex-col justify-between space-y-3 relative overflow-hidden">
          {/* Header Banner */}
          <div className="absolute top-0 left-0 right-0 py-0.5 bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold font-mono text-[10px] text-center tracking-wider uppercase">
            RECOMMENDED WINNER: BEST EFFICIENCY &amp; ACCURACY
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                  C
                </span>
                <span className="font-bold text-sm text-white">Claude 3.5 Sonnet</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/60 text-emerald-400 font-bold">
                Tier 1 Choice
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 mb-2">
              Anthropic • claude-3-5-sonnet-20241022
            </div>

            {/* Cost Curve Sparkline */}
            <div className="py-1 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Cost Curve (10k-1M)</span>
              <span className="h-1 w-16 bg-emerald-400 rounded"></span>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 border-y border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block">Token Density</span>
                <span className="text-emerald-400 font-bold">228 <span className="text-cyan-400 text-[10px]">-44%</span></span>
                <span className="text-[10px] text-slate-500 block">Anthropic Tokenizer</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Cost / 1M Calls</span>
                <span className="text-white font-bold">$0.68</span>
                <span className="text-[10px] text-slate-400 block">$0.62 per 10k calls</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Quality Retention</span>
                <span className="text-emerald-400 font-bold">97.4% <span className="text-emerald-300 text-[10px]">Peak</span></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Avg Latency</span>
                <span className="text-slate-200 font-bold">820 ms</span>
                <span className="text-[10px] text-slate-400 block">Predictable P95</span>
              </div>
            </div>

            <div className="text-xs text-slate-200 italic pt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase not-italic block mb-0.5">EVALUATION VERDICT</span>
              "Superb instruction following on terse LT prompt. Preserves zero-filler code format with exact syntax and flawless token compression metrics."
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">Token Efficiency Rating</span>
              <span className="text-emerald-400 font-bold">Optimal (A+)</span>
            </div>
            <button
              onClick={() => window.open('https://claude.ai/new', '_blank')}
              className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Open in Claude Console ↗
            </button>
          </div>
        </div>

        {/* GPT-4o (Omni) */}
        <div className="p-4 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  O
                </span>
                <span className="font-bold text-sm text-white">GPT-4o (Omni)</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                High Quality
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 mb-2">
              OpenAI • Standard Production
            </div>

            {/* Cost Curve Sparkline */}
            <div className="py-1 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Cost Curve (10k-1M)</span>
              <span className="h-1 w-16 bg-amber-500 rounded"></span>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 border-y border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block">Token Density</span>
                <span className="text-slate-200 font-bold">395</span>
                <span className="text-[10px] text-slate-500 block">tiktoken cl100k</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Cost / 1M Calls</span>
                <span className="text-amber-400 font-bold">$1.15</span>
                <span className="text-[10px] text-slate-500 block">Highest cost profile</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Quality Retention</span>
                <span className="text-slate-300 font-bold">96.2% <span className="text-slate-400 text-[10px]">Solid</span></span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Avg Latency</span>
                <span className="text-slate-300 font-bold">910 ms</span>
                <span className="text-[10px] text-slate-500 block">Higher Variance</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 italic pt-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase not-italic block mb-0.5">EVALUATION VERDICT</span>
              "High accuracy but prone to repetitive commentary and boilerplate explanations unless negative constraints are heavily emphasized."
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Token Budget Overhead</span>
              <span className="text-rose-400">+73.2% vs Claude</span>
            </div>
            <button
              onClick={() => window.open('https://chatgpt.com/', '_blank')}
              className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
            >
              Open in ChatGPT ↗
            </button>
          </div>
        </div>
      </div>

      {/* 4. Deep Parametric Audit Matrix */}
      <div className="p-4 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Deep Parametric Audit Matrix
            </h4>
            <p className="text-[11px] text-slate-400">
              Standardized testing across identical semantic test fixtures and AST integrity validation
            </p>
          </div>

          {/* Test Fixture Toggles */}
          <div className="flex items-center gap-1 text-[11px]">
            {['Standard AST', 'JSON Schema Guard', 'Edge Cases (100% P99)'].map((fix) => (
              <button
                key={fix}
                onClick={() => setActiveFixture(fix)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeFixture === fix
                    ? 'bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {fix}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">METRIC DIMENSION</th>
                <th className="py-2 px-3">GEMINI 1.5 PRO/FLASH</th>
                <th className="py-2 px-3 text-cyan-400">• CLAUDE 3.5 SONNET (WINNER)</th>
                <th className="py-2 px-3">OPENAI GPT-4o</th>
                <th className="py-2 px-3 text-right">DELTA ADVANTAGE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="py-2 px-3 flex items-center gap-2">
                  <span className="text-slate-500">📄</span>
                  <span>Raw Unoptimized Tokens</span>
                </td>
                <td className="py-2 px-3">482</td>
                <td className="py-2 px-3 text-cyan-400 font-bold">410</td>
                <td className="py-2 px-3">520</td>
                <td className="py-2 px-3 text-right text-cyan-300 font-semibold">-21.1% Claude Base</td>
              </tr>

              <tr className="hover:bg-slate-900/40">
                <td className="py-2 px-3 flex items-center gap-2">
                  <span className="text-slate-500">➗</span>
                  <span>Optimized HC (High Compression)</span>
                </td>
                <td className="py-2 px-3">312</td>
                <td className="py-2 px-3 text-cyan-400 font-bold">284</td>
                <td className="py-2 px-3">430</td>
                <td className="py-2 px-3 text-right text-cyan-300 font-semibold">-33.9% vs GPT-4o</td>
              </tr>

              <tr className="hover:bg-slate-900/40 bg-cyan-950/10">
                <td className="py-2 px-3 flex items-center gap-2 text-white font-semibold">
                  <span className="text-emerald-400">⚡</span>
                  <span>Optimized LT (Light-Touch Tokens)</span>
                </td>
                <td className="py-2 px-3">264</td>
                <td className="py-2 px-3 text-emerald-400 font-bold text-sm">228</td>
                <td className="py-2 px-3">395</td>
                <td className="py-2 px-3 text-right text-emerald-300 font-bold">-44.3% Maximum Reduction</td>
              </tr>

              <tr className="hover:bg-slate-900/40">
                <td className="py-2 px-3 flex items-center gap-2">
                  <span className="text-slate-500">%</span>
                  <span>% Token Pruning Delta Ratio</span>
                </td>
                <td className="py-2 px-3 text-emerald-400">-45.2%</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">-44.4%</td>
                <td className="py-2 px-3 text-amber-400">-24.0%</td>
                <td className="py-2 px-3 text-right text-slate-300">1.85x compression factor</td>
              </tr>

              <tr className="hover:bg-slate-900/40">
                <td className="py-2 px-3 flex items-center gap-2">
                  <span className="text-slate-500">💳</span>
                  <span>Cost per 10k Calls</span>
                </td>
                <td className="py-2 px-3 text-cyan-400">$0.35</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">$0.62</td>
                <td className="py-2 px-3 text-amber-400">$1.15</td>
                <td className="py-2 px-3 text-right text-emerald-400 font-semibold">Save $5.30 per 100k vs GPT-4o</td>
              </tr>

              <tr className="hover:bg-slate-900/40">
                <td className="py-2 px-3 flex items-center gap-2">
                  <span className="text-slate-500">🛡</span>
                  <span>Constraint Fidelity (AST Strictness)</span>
                </td>
                <td className="py-2 px-3">98.2%</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">100.0%</td>
                <td className="py-2 px-3">99.4%</td>
                <td className="py-2 px-3 text-right text-emerald-300">Zero compiler syntax errors</td>
              </tr>

              <tr className="hover:bg-slate-900/40">
                <td className="py-2 px-3 flex items-center gap-2">
                  <span className="text-slate-500">↻</span>
                  <span>Translation Overhead</span>
                </td>
                <td className="py-2 px-3 text-slate-400">0 ms (pre-cached)</td>
                <td className="py-2 px-3 text-slate-400">0 ms (pre-cached)</td>
                <td className="py-2 px-3 text-slate-400">0 ms (pre-cached)</td>
                <td className="py-2 px-3 text-right text-cyan-400">L2 Cache Hit</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Meta */}
        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex flex-wrap items-center justify-between">
          <div>
            • Test Runner Daemon: active-worker-pool-us-east • Seed: 0x93FA8B17 • Deterministic Temp: 0.0
          </div>
          <div>
            Execution verified at 14:02:49 UTC
          </div>
        </div>
      </div>
    </div>
  );
}
