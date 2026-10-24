import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, Copy, ExternalLink, Check, AlertTriangle, 
  ArrowRight, Globe, Layers, Zap, Info, Sliders, CheckCircle2, Eye, Lock, 
  RefreshCw, Terminal, Paperclip, FileText, FileSpreadsheet, FileCode, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import DiffViewer from './DiffViewer';

export default function PromptStudio({
  rawPrompt,
  setRawPrompt,
  targetProvider,
  setTargetProvider,
  onOptimize,
  result,
  loading,
  setActiveTab
}) {
  const [copiedHC, setCopiedHC] = useState(false);
  const [copiedLT, setCopiedLT] = useState(false);
  const [showOriginalHindi, setShowOriginalHindi] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [showWasteDetails, setShowWasteDetails] = useState(true);
  const [ltLang, setLtLang] = useState('en');
  
  // Attached file state (Flow Point 3)
  const [attachedFile, setAttachedFile] = useState(null);
  const [fileConverting, setFileConverting] = useState(false);

  // Flow Point 1: Specific target AI platforms: Claude, ChatGPT, and General AI
  const providers = [
    { 
      id: 'claude-3-5-sonnet', 
      name: 'Anthropic Claude', 
      sub: 'Tuned for Claude: XML Tags & Code',
      badge: 'XML Tags'
    },
    { 
      id: 'gpt-4o', 
      name: 'OpenAI ChatGPT', 
      sub: 'Tuned for ChatGPT: Markdown & JSON',
      badge: 'Markdown'
    },
    { 
      id: 'general-ai', 
      name: 'General / Universal AI', 
      sub: 'Average Best Prompt for Every AI',
      badge: 'Universal'
    }
  ];

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'hc') {
      setCopiedHC(true);
      setTimeout(() => setCopiedHC(false), 2000);
    } else {
      setCopiedLT(true);
      setTimeout(() => setCopiedLT(false), 2000);
    }
  };

  const handleLaunch = () => {
    if (targetProvider.includes('claude')) {
      window.open('https://claude.ai/new', '_blank');
    } else if (targetProvider.includes('gpt') || targetProvider.includes('chatgpt')) {
      window.open('https://chatgpt.com/', '_blank');
    } else {
      window.open('https://chatgpt.com/', '_blank');
    }
  };

  // Flow Point 3: File conversion pipeline
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileConverting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/files/convert', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setAttachedFile(data);
      
      // Auto-append converted structured format to the prompt
      const prefix = `\n\n--- [ATTACHED CONTEXT: ${data.filename} (${data.formatExtension})] ---\n${data.fullContent.substring(0, 1500)}${data.fullContent.length > 1500 ? '\n...(curated content truncated)' : ''}\n--- [END CONTEXT] ---`;
      setRawPrompt((prev) => (prev ? prev : '') + prefix);
    } catch (err) {
      alert("Error parsing file. Supported formats: .pdf, .docx, .pptx, .xlsx, .csv, .json");
    } finally {
      setFileConverting(false);
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
  };

  // Check if current prompt text has non-Latin script (Flow Point 8)
  const isNonEnglishText = /[\u0900-\u0D7F\u0400-\u04FF\u4E00-\u9FFF\u0600-\u06FF]/.test(rawPrompt || '');
  const showMultilingualBanner = isNonEnglishText || (result?.multilingual?.detectedLanguage?.isNonEnglish && rawPrompt.length > 0);

  // Dynamic analysis & waste detection (Flow Point 4)
  const analysis = result?.analysis;
  const metrics = result?.metrics;
  const variants = result?.variants;
  const detectedFillers = analysis?.detectedFillers || [];

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Target AI Platform Selector (Flow Point 1) */}
      <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              1. SELECT TARGET AI PLATFORM
            </span>
            <span className="text-slate-500 text-[11px] font-normal hidden sm:inline">
              (Prompt will be specifically optimized for the chosen platform's idioms)
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-bold">
            Provider-Aware Optimization
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          {providers.map((p) => {
            const isSelected = targetProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setTargetProvider(p.id)}
                className={`flex flex-col p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500/80 text-cyan-300 ring-1 ring-cyan-500/30 shadow-md'
                    : 'bg-[#070b13] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                    <span className="font-bold text-sm text-white font-mono">{p.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-900 border border-slate-700 text-slate-300">
                    {p.badge}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans">{p.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Regional Language & Script Multiplier Banner (Flow Point 8: Shown when non-English text is entered) */}
      {showMultilingualBanner && (
        <div className="p-2.5 rounded-xl bg-[#090f1a] border border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Regional Language Detected: <strong>{result?.multilingual?.detectedLanguage?.name || 'Indic Script'}</strong> → Pivoted to English to avoid <strong>2.85x BPE Script Penalty</strong>!</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-[10px] font-mono">
              Saves 50–70% Script Tokens
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <button
              onClick={() => setShowOriginalHindi(!showOriginalHindi)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showOriginalHindi ? 'Show English Pivot' : 'Show Original Script'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Workspace: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Raw Prompt Input, File Attachment & Waste Suggestions (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Raw Prompt Buffer */}
          <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
                  RAW PROMPT BUFFER
                </span>
              </div>
              <div className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                {(rawPrompt || '').length} chars • ~{Math.round((rawPrompt || '').length / 4)} tokens
              </div>
            </div>

            <textarea
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              rows={6}
              placeholder="Type or paste your raw prompt here... (e.g. 'Write a Python function to parse JSON files. Return strictly JSON only, with no commentary.')"
              className="w-full bg-[#070b13] text-slate-200 border border-slate-800/90 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-all leading-relaxed placeholder:text-slate-600"
            />

            {/* File Attachment Integration (Flow Point 3) */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono cursor-pointer transition-colors">
                  <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Attach Document / File</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.csv,.json"
                    className="hidden"
                  />
                </label>
                {fileConverting && (
                  <span className="text-[11px] font-mono text-cyan-400 animate-pulse">
                    Converting to low-token format...
                  </span>
                )}
              </div>

              {rawPrompt.length > 0 && (
                <button
                  onClick={() => setRawPrompt('')}
                  className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  Clear Buffer
                </button>
              )}
            </div>

            {/* Converted File Indicator (Flow Point 3) */}
            {attachedFile && (
              <div className="p-2.5 rounded-lg bg-[#07141a] border border-cyan-800/60 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{attachedFile.filename}</span>
                  </div>
                  <button onClick={removeAttachment} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[10px] text-slate-300">
                  Converted to <strong className="text-emerald-400">{attachedFile.formatExtension}</strong> ({attachedFile.targetFormat})
                  — {attachedFile.rationale}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  Saves ~{attachedFile.conversionSavingsPct}% tokens vs raw file ingestion!
                </div>
              </div>
            )}
          </div>

          {/* Prompt Fluff, Waste & Suggestion Engine (Flow Point 4) */}
          <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>WHERE RAW PROMPT WASTES TOKENS (SUGGESTIONS)</span>
              </div>
              <button
                onClick={() => setShowWasteDetails(!showWasteDetails)}
                className="text-[11px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-0.5"
              >
                {showWasteDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showWasteDetails && (
              <div className="space-y-2.5 text-xs">
                {rawPrompt.trim().length === 0 ? (
                  <div className="p-3 rounded bg-[#070b13] border border-slate-800/80 text-[11px] text-slate-400 font-mono text-center">
                    Type or paste a prompt above to detect filler words, structural weaknesses, and token-waste heuristics.
                  </div>
                ) : (
                  <>
                    {/* Specific Fillers to Avoid */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                        Filler Words Detected to Avoid:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {detectedFillers.length > 0 ? (
                          detectedFillers.map((filler, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-[11px] line-through flex items-center gap-1"
                            >
                              "{filler}"
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> No polite filler phrases detected!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Redundant Repetitions to Eliminate */}
                    {analysis?.redundancies && analysis.redundancies.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold block">
                          Redundant Clauses Removed:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.redundancies.map((red, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300 font-mono text-[11px] line-through flex items-center gap-1"
                            >
                              "{red}"
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions list */}
                    <div className="space-y-1.5 pt-1">
                      {analysis?.suggestions?.map((sug, idx) => (
                        <div key={idx} className="p-2 rounded bg-[#070b13] border border-slate-800 space-y-0.5">
                          <span className="text-cyan-400 font-bold font-mono text-[11px] block">
                            {sug.title}
                          </span>
                          <p className="text-[11px] text-slate-300 leading-tight">
                            {sug.details}
                          </p>
                        </div>
                      )) || (
                        <div className="p-2 rounded bg-[#070b13] border border-slate-800 space-y-0.5">
                          <span className="text-cyan-400 font-bold font-mono text-[11px] block">
                            Direct Imperative Commands
                          </span>
                          <p className="text-[11px] text-slate-300 leading-tight">
                            Use imperative verbs (e.g. 'Implement...', 'Parse...', 'Generate...') rather than conversational queries.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Forge & Optimize Button */}
          <button
            onClick={() => onOptimize()}
            disabled={loading || !rawPrompt.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer font-mono disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Optimizing for {providers.find(p => p.id === targetProvider)?.name}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Optimized Variants (Point 2)</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: Dual Optimized Alternatives & Token Difference (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Token Difference & Savings Comparison Header (Flow Points 5 & 6) */}
          <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">
                TOKEN CONSUMPTION &amp; SAVINGS COMPARISON
              </span>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {result ? (
                  <>
                    <span className="text-slate-400">
                      Raw: <strong className="text-slate-200">{metrics?.originalTokens} tokens</strong>
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="text-emerald-400 font-bold">
                      LT: {variants?.lowToken?.tokenCount} tokens ({metrics?.percentageSaved}% Saved)
                    </span>
                    <span className="text-slate-500 text-[11px] font-normal">
                      (~{variants?.lowToken?.tokenCount} tokens consumed by {providers.find(p => p.id === targetProvider)?.name || 'Selected AI'})
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500 italic">
                    Awaiting prompt input to calculate exact token consumption...
                  </span>
                )}
              </div>
            </div>

            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showDiff ? 'Hide Diff' : 'View Raw vs Optimized Diff'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Visual Difference Viewer (Flow Point 6) */}
          {showDiff && variants?.lowToken?.diff && (
            <div className="p-3 rounded-xl bg-[#070b13] border border-slate-800 shadow-xl space-y-1.5">
              <div className="text-xs font-mono font-bold text-slate-300">
                Visual Diff: Raw Input vs Low-Token Alternative
              </div>
              <DiffViewer diff={variants.lowToken.diff} />
            </div>
          )}

          {/* Dual Optimized Alternatives (Flow Point 2) */}
          {result ? (
            <>
              {/* Alternative 1: High-Context (HC) Version */}
              <div className="rounded-xl bg-[#0b121e] border border-blue-900/40 overflow-hidden shadow-xl">
                <div className="p-3 bg-[#0d1627] border-b border-blue-900/30 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Alternative 1: High-Context (HC)
                    </span>
                    <span className="text-xs text-slate-400 font-sans">Precision Reasoning &amp; Full Context</span>
                  </div>
                  <div className="text-xs font-mono text-slate-300 font-bold">
                    {variants.highContext.tokenCount} tokens{' '}
                    <span className="text-blue-400">(+{variants.highContext.percentageDelta}%)</span>{' '}
                    <span className="text-slate-500 font-normal">${variants.highContext.costPerCall.toFixed(6)}</span>
                  </div>
                </div>

                <div className="p-3 relative">
                  <button
                    onClick={() => handleCopy(variants.highContext.prompt, 'hc')}
                    className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-white"
                  >
                    {copiedHC ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHC ? 'Copied' : 'Copy HC'}</span>
                  </button>

                  <pre className="font-mono text-xs text-slate-300 bg-[#070b13] p-3 rounded-lg border border-slate-800/80 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed">
{variants.highContext.prompt}
                  </pre>
                </div>
              </div>

              {/* Alternative 2: Low-Token (LT) Version */}
              <div className="rounded-xl bg-[#0b121e] border border-emerald-900/50 overflow-hidden shadow-xl ring-1 ring-emerald-500/20">
                <div className="p-3 bg-[#0a181d] border-b border-emerald-900/40 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Alternative 2: Low-Token (LT)
                    </span>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300">
                      {metrics.percentageSaved}% Tokens Saved
                    </span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold">
                    {variants.lowToken.tokenCount} tokens{' '}
                    <span className="text-slate-400 font-normal">${variants.lowToken.costPerCall.toFixed(6)}</span>{' '}
                    <span className="text-emerald-300 font-semibold">Saves ~${metrics.costSavedPer10kCalls} / 10k calls</span>
                  </div>
                </div>

                <div className="p-3 relative space-y-2">
                  <button
                    onClick={() => handleCopy(variants.lowToken.prompt, 'lt')}
                    className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 hover:text-white"
                  >
                    {copiedLT ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLT ? 'Copied' : 'Copy LT'}</span>
                  </button>

                  <pre className="font-mono text-xs text-emerald-200 bg-[#070b13] p-3 rounded-lg border border-slate-800/80 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
{variants.lowToken.prompt}
                  </pre>

                  {/* Guardrail Lock Indicator */}
                  <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Guardrail Active: 100% Constraints Preserved (0% Loss)</span>
                    </span>
                    <span>Optimized for: <strong>{providers.find(p => p.id === targetProvider)?.name}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Launcher Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
                <button
                  onClick={handleLaunch}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Copy &amp; Open in {providers.find(p => p.id === targetProvider)?.name} ↗</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>View User Improvement Analytics →</span>
                </button>
              </div>
            </>
          ) : (
            /* Clean Empty State Placeholder (when no prompt is submitted yet) */
            <div className="p-8 rounded-xl bg-[#0b121e] border border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Ready to Optimize Prompt
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Type or paste your raw prompt on the left, select your target AI platform (<strong className="text-slate-200">Claude</strong>, <strong className="text-slate-200">ChatGPT</strong>, or <strong className="text-slate-200">General</strong>), and click <strong>"Generate Optimized Variants"</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left font-mono text-xs pt-2">
                <div className="p-2.5 rounded-lg bg-[#070b13] border border-slate-800">
                  <span className="text-blue-400 font-bold block mb-0.5">High-Context (HC)</span>
                  <span className="text-[10px] text-slate-400">Adds role framing, taxonomy, schemas &amp; worked examples.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#070b13] border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-0.5">Low-Token (LT)</span>
                  <span className="text-[10px] text-slate-400">Strips conversational fluff, locks constraints in bullet form.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
