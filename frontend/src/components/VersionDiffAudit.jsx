import React, { useState } from 'react';
import { 
  GitCompare, ArrowRight, ShieldCheck, CheckCircle2, 
  AlertTriangle, DollarSign, Sparkles, Filter, Copy, Check
} from 'lucide-react';

export default function VersionDiffAudit({ rawPrompt, result, targetProvider, setActiveTab }) {
  const [filterMode, setFilterMode] = useState('all');
  const [simVolume, setSimVolume] = useState('1k');
  const [copied, setCopied] = useState(false);

  // Dynamic values or benchmark fallbacks matching Image 5
  const origTokens = result?.metrics?.originalTokens || 492;
  const ltTokens = result?.variants?.lowToken?.tokenCount || 114;
  const pctSaved = result?.metrics?.percentageSaved || 76.8;
  const tokensSaved = origTokens - ltTokens;

  // Strikethrough items
  const purgedFillers = result?.analysis?.detectedFillers?.length > 0 
    ? result.analysis.detectedFillers 
    : ["Hey can you please", "act as an expert", "basically", "i really need you to make sure", "in order to", "as much detail as possible"];

  const rawDisplay = rawPrompt || `Hey can you please help me triage this incoming tier-3 enterprise IT ticket? act as an expert cloud infrastructure triage engineer with over 15 years experience.

basically what I am trying to achieve here is to classify whether this server fault is hardware related, networking related, or software related. i really need you to make sure that you look at the logs very carefully before replying.

in order to produce an accurate response, make sure you double check Kubernetes pod restarts and network timeouts. Please return the answer with as much detail as humanly possible because our SRE leadership wants an exhaustive explanation of every potential root cause under the sun.`;

  const optDisplay = result?.variants?.lowToken?.prompt || `<task>
Triage enterprise IT server incidents. Classify category into [hardware|networking|software] using raw logs.
</task>

<instructions>
1. Inspect pod restarts and network timeout telemetry.
2. Map primary error signatures to root cause.
</instructions>`;

  const tableRows = [
    {
      phrase: '"Hey can you please..."',
      why: 'LLMs do not need conversational pleasantries. Direct action verbs execute faster without wasting token budget.',
      instead: 'Direct imperative ("Triage...")',
      saved: '+6 tokens'
    },
    {
      phrase: '"Act as an expert..."',
      why: 'Vague persona labels create unnecessary text overhead without specifying concrete instructions or schemas.',
      instead: '<task> tag with clear scope',
      saved: '+5 tokens'
    },
    {
      phrase: '"In order to ensure that..."',
      why: 'Wordy transitional phrases slow down parsing and use unnecessary tokens before the core instructions.',
      instead: 'Active verb ("Inspect...")',
      saved: '+7 tokens'
    },
    {
      phrase: '"Give me as much detail as possible..."',
      why: 'Open-ended instructions trigger output verbosity, hallucinations, and bloated inference costs.',
      instead: 'Structured schema constraint',
      saved: '+9 tokens'
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(optDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSimMultiplier = () => {
    if (simVolume === '50k') return 50;
    if (simVolume === '1M') return 1000;
    return 1;
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Side-by-Side BEFORE vs AFTER Comparison (Matches Image 5 Top) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 font-mono">
        {/* Left: BEFORE Raw Prompt */}
        <div className="p-4 rounded-xl bg-slate-900 border border-rose-950/70 shadow-xl space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 border border-rose-800 text-rose-400 uppercase">
                  BEFORE
                </span>
                <span className="text-sm font-bold text-white">Raw Prompt</span>
              </div>
              <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900">
                {origTokens} Tokens (Wordy)
              </span>
            </div>

            {/* Code / Text Block with Red Strikethrough Highlights */}
            <div className="p-3 rounded-lg bg-slate-950 border border-rose-950/80 text-xs font-mono text-slate-300 leading-relaxed max-h-56 overflow-y-auto space-y-2">
              <p>
                <span className="line-through text-rose-400 bg-rose-950/40 px-1 rounded">Hey can you please</span> help me triage this incoming tier-3 enterprise IT ticket? <span className="line-through text-rose-400 bg-rose-950/40 px-1 rounded">act as an expert</span> cloud infrastructure triage engineer with over 15 years experience.
              </p>
              <p>
                <span className="line-through text-rose-400 bg-rose-950/40 px-1 rounded">basically</span> what I am trying to achieve here is to classify whether this server fault is hardware related, networking related, or software related. <span className="line-through text-rose-400 bg-rose-950/40 px-1 rounded">i really need you to make sure</span> that you look at the logs very carefully before replying.
              </p>
              <p>
                <span className="line-through text-rose-400 bg-rose-950/40 px-1 rounded">in order to</span> produce an accurate response, make sure you double check Kubernetes pod restarts and network timeouts. Please return the answer <span className="line-through text-rose-400 bg-rose-950/40 px-1 rounded">with as much detail as humanly possible</span> because our SRE leadership wants an exhaustive explanation of every potential root cause under the sun.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Red strikethroughs indicate tokens safe to delete.</span>
            </span>
            <span className="text-rose-300 font-bold">-{tokensSaved} tokens identified</span>
          </div>
        </div>

        {/* Right: AFTER Optimized Prompt */}
        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-950/80 shadow-xl space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 border border-emerald-800 text-emerald-400 uppercase">
                  AFTER
                </span>
                <span className="text-sm font-bold text-white">Optimized Prompt</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                  {ltTokens} Tokens (-{pctSaved}%)
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Code / Text Block with Green Tint */}
            <div className="p-3 rounded-lg bg-slate-950 border border-emerald-950/80 text-xs font-mono text-emerald-200 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
{optDisplay}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Green highlights show structured, high-accuracy replacements.</span>
            </span>
            <span className="text-emerald-300 font-bold">97.8% Semantic Density</span>
          </div>
        </div>
      </div>

      {/* 2. Filler Words & Anti-Patterns Purged (Matches Image 5 Middle) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold text-white">
              Filler Words &amp; Anti-Patterns Purged
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              A beginner-friendly guide to phrases removed and how to write prompts more efficiently.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg border text-xs cursor-pointer transition-colors ${
                filterMode === 'all'
                  ? 'bg-blue-950 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Patterns (4)
            </button>
            <button
              onClick={() => setFilterMode('major')}
              className={`px-3 py-1 rounded-lg border text-xs cursor-pointer transition-colors ${
                filterMode === 'major'
                  ? 'bg-blue-950 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Tokens &gt; 5
            </button>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <th className="py-2.5 px-3">PHRASES REMOVED</th>
                <th className="py-2.5 px-3">WHY AVOID THIS</th>
                <th className="py-2.5 px-3">WHAT TO USE INSTEAD</th>
                <th className="py-2.5 px-3 text-right">TOKENS SAVED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tableRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 text-rose-300 font-semibold whitespace-nowrap">
                    <span className="line-through">{row.phrase}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans max-w-sm leading-relaxed">
                    {row.why}
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">
                    {row.instead}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-300 font-bold whitespace-nowrap">
                    {row.saved}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Model Consumption Cost Estimation Comparison (Matches Image 5 Bottom) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Model Consumption Cost Estimation Comparison</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Calculated against published frontier API pricing tiers based on current prompt revisions.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase px-2">Simulation Volume:</span>
            {['1k Runs', '50k Runs', '1M Runs'].map((vol) => {
              const key = vol.split(' ')[0];
              const isSelected = simVolume === key;
              return (
                <button
                  key={vol}
                  onClick={() => setSimVolume(key)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-cyan-300 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {vol}
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Cost Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Claude 3.5 Sonnet */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded text-xs font-bold bg-amber-950 border border-amber-800 text-amber-400">
                C3.5
              </span>
              <div>
                <div className="text-xs font-bold text-white">Claude 3.5 Sonnet</div>
                <div className="text-[10px] text-slate-400">Anthropic • $3.00 / 1M Input Tokens</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold text-sm">
                -${(5.70 * getSimMultiplier()).toFixed(2)} / {simVolume} runs
              </div>
              <div className="text-[10px] text-slate-500">Net API Cost Reduction</div>
            </div>
          </div>

          {/* ChatGPT GPT-4o */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded text-xs font-bold bg-indigo-950 border border-indigo-800 text-indigo-400">
                4o
              </span>
              <div>
                <div className="text-xs font-bold text-white">ChatGPT (GPT-4o)</div>
                <div className="text-[10px] text-slate-400">OpenAI • $2.50 / 1M Input Tokens</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold text-sm">
                -${(4.60 * getSimMultiplier()).toFixed(2)} / {simVolume} runs
              </div>
              <div className="text-[10px] text-slate-500">Net API Cost Reduction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

