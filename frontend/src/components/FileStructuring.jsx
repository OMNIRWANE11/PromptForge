import React, { useState } from 'react';
import { 
  FileText, CheckSquare, Square, Sparkles, Copy, 
  ExternalLink, Check, Download, Layers, ArrowRight, ShieldCheck, Filter
} from 'lucide-react';

export default function FileStructuring({ setActiveTab }) {
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [instruction, setInstruction] = useState(
    'Analyze the audit findings and draft an executive 5-point action plan for the CTO.'
  );

  const [chunks, setChunks] = useState([
    {
      id: 1,
      title: 'Section 1: Executive Summary & Non-...',
      tag: 'Boilerplate Pruned',
      tagColor: 'text-cyan-400 bg-cyan-950 border-cyan-800',
      tokens: 180,
      active: true,
      preview: '# Summary: Internal compliance audit flags elevated risk in vendor onboarding and API key rotation delays. 2 minor breach vectors resolved within 72h.',
      sub: 'Page: 1-3 • Density: High • Saved 1,420 legal boilerplate tokens'
    },
    {
      id: 2,
      title: 'Section 2.3: Core Risk Assessment Findin...',
      tag: 'High Priority',
      tagColor: 'text-cyan-400 bg-cyan-950 border-cyan-800',
      tokens: 420,
      active: true,
      preview: '### Vulnerability Matrix: Critical severity assigned to unencrypted cache partitions in staging cluster us-west-2. SLA resolution: 14 days overdue.',
      sub: 'Page: 12-16 • Entities: 8 CVE items • AST Cleaned'
    },
    {
      id: 3,
      title: 'Section 2.4: Historical Committee Minutes ...',
      tag: 'Excluded',
      tagColor: 'text-slate-400 bg-slate-900 border-slate-700',
      tokens: 4200,
      active: false,
      preview: 'Verbatim audio transcript recorded July 14th: "Meeting called to order at 09:00 EST. Present: Sarah Lin, Markus Thorne... Discussion of lunch menu..."',
      sub: 'Page: 17-29 • Skipping saves 4,200 tokens ($0.013/run)'
    },
    {
      id: 4,
      title: 'Section 3.1: Remediation Roadmap Table',
      tag: 'Clean Pipe Table',
      tagColor: 'text-emerald-400 bg-emerald-950 border-emerald-800',
      tokens: 510,
      active: true,
      preview: '| ID | Vulnerability | Owner | Target | Status |\n|:---|:--------------|:------|:-------|:-------|\n| SEC-01 | KMS Auto-Rotation | CloudSec | Q4-W1 | Delayed |\n| SEC-04 | Zero-Trust Mesh | DevOps | Q3-W4 | Complete |',
      sub: 'Page: 30-31 • Original: 3,100 tokens unstructured layout • -83.5% dense tabular'
    },
    {
      id: 5,
      title: 'Section 4.0: Appendix & Legal Disclaimers',
      tag: 'Excluded',
      tagColor: 'text-slate-400 bg-slate-900 border-slate-700',
      tokens: 8900,
      active: false,
      preview: '"Notice is hereby given pursuant to Regulatory Code 881-J. The liability of the auditing contractor is bounded strictly according to Exhibit C..."',
      sub: 'Page: 32-46 • Bulk noise: Pruned from context window'
    },
    {
      id: 6,
      title: 'Section 5.2: Actionable Next Quarter Direc...',
      tag: 'High Priority',
      tagColor: 'text-cyan-400 bg-cyan-950 border-cyan-800',
      tokens: 360,
      active: true,
      preview: '### Directives: 1. Migrate IAM privilege rings by Nov 15th. 2. Enforce ephemeral credential TTL < 60 mins. 3. Finalize third-party vendor SOC-2...',
      sub: 'Page: 47-48 • Action Items: 3 Target KPIs'
    }
  ]);

  const toggleChunk = (id) => {
    setChunks(chunks.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const selectAll = () => setChunks(chunks.map(c => ({ ...c, active: true })));
  const clearAll = () => setChunks(chunks.map(c => ({ ...c, active: false })));

  const activeCount = chunks.filter(c => c.active).length;
  const activeTokens = chunks.filter(c => c.active).reduce((sum, c) => sum + c.tokens, 0);

  const curatedPayloadText = `# SYSTEM DIRECTIVE & CONTEXT PAYLOAD
You are a Senior Infrastructure Security Architect. Based exclusively on the extracted audit sections provided below, execute the instruction:

"${instruction}"

--- START CURATED CONTEXT (${activeCount} SECTIONS) ---
## Section 1: Executive Summary
Internal compliance audit flags elevated risk in vendor onboarding and API key rotation delays. 2 minor breach vectors resolved within 72h. Total infrastructure footprint analyzed: 14 VPCs.

## Section 2.3: Core Risk Assessment Findings
Critical severity assigned to unencrypted cache partitions in staging cluster us-west-2. SLA resolution: 14 days overdue. Residual access identified in 4 decommissioned contractor accounts.

## Section 3.1: Remediation Roadmap Table
| ID | Vulnerability | Owner | Target | Status |
| SEC-01 | KMS Auto-Rotation | CloudSec | Q4-W1 | Delayed |
| SEC-04 | Zero-Trust Mesh | DevOps | Q3-W4 | Complete |

## Section 5.2: Actionable Next Quarter Directives
1. Migrate IAM privilege rings by Nov 15th.
2. Enforce ephemeral credential TTL < 60 mins.
3. Finalize third-party vendor SOC-2 verification.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curatedPayloadText);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. File Metadata & Transformation Architecture Card */}
      <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Source Artifact */}
        <div className="md:col-span-4 space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-mono uppercase block">SOURCE ARTIFACT •</span>
              <span className="font-bold text-sm text-white font-mono">Q3_Financial_Compliance_Audit.pdf</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 pt-1">
            <span>48 pages</span>
            <span>•</span>
            <span>14.2 MB</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Parsed AST Valid
            </span>
          </div>
        </div>

        {/* Transformation Pipeline Architecture */}
        <div className="md:col-span-5 space-y-2 border-y md:border-y-0 md:border-x border-slate-800/80 py-2 md:py-0 md:px-4">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
            TRANSFORMATION ARCHITECTURE
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> Stage 01 PDF Binary Ingest
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
              Stage 02 Semantic OCR &amp; Clean
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              Stage 03 Lean Markdown AST
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono pt-1">
            <span className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold">
              Markdown (.md) [-64% vs Raw]
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              CSV / TSV [Tabular Engine]
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              YAML / TOON [API Schema]
            </span>
          </div>
        </div>

        {/* Compression Ratio */}
        <div className="md:col-span-3 text-right space-y-1">
          <div className="text-[10px] font-mono text-slate-400">Status: Normalized</div>
          <div className="text-[10px] font-mono text-slate-500 uppercase">COMPRESSION RATIO</div>
          <div className="text-emerald-400 font-bold text-sm font-mono">
            -92.5% PRUNED
          </div>
          <div className="text-xs font-mono text-slate-300 font-semibold">
            {activeTokens.toLocaleString()} tokens active <span className="text-slate-500 font-normal">/ 24,650 raw</span>
          </div>
          <div className="text-[10px] text-cyan-400 font-mono">
            • Prompt Budget Safe Max window: 128k
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Extracted Semantic Chunks (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold font-mono uppercase text-white">
                  Extracted Semantic Chunks
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  {activeCount} of {chunks.length} active
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <button onClick={selectAll} className="text-slate-400 hover:text-white">Select All</button>
                <span className="text-slate-600">/</span>
                <button onClick={clearAll} className="text-slate-400 hover:text-white">Clear</button>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <button className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1">
                <span>✂</span> Drop Legal Boilerplate
              </button>
              <button className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1">
                <span>☰</span> Strip Headers / Footers
              </button>
              <button className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1">
                <span>▦</span> Extract Tables Only
              </button>
              <button className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1">
                <span>✦</span> Remove Redundancies
              </button>
            </div>

            {/* Chunks List */}
            <div className="space-y-2">
              {chunks.map((c) => (
                <div
                  key={c.id}
                  onClick={() => toggleChunk(c.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    c.active
                      ? 'bg-[#080f1a] border-slate-700 hover:border-cyan-500/50'
                      : 'bg-[#070b13]/60 border-slate-800/80 opacity-60 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-cyan-400">
                        {c.active ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-600" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold font-mono ${c.active ? 'text-white' : 'text-slate-400'}`}>
                            {c.title}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${c.tagColor}`}>
                            {c.tag}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed">
                          {c.preview}
                        </p>
                        <div className="text-[10px] font-mono text-slate-500 mt-1">
                          {c.sub}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-mono font-bold ${c.active ? 'text-cyan-400' : 'text-slate-600'}`}>
                        {c.tokens.toLocaleString()} tok
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Attention Distribution Bar */}
            <div className="p-2.5 rounded bg-[#070b13] border border-slate-800/80 space-y-1 text-xs font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">ATTENTION DISTRIBUTION BY DOCUMENT POSITION</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-3 bg-emerald-400 rounded-xs"></span>
                  <span className="w-1.5 h-5 bg-emerald-400 rounded-xs"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400/40 rounded-xs"></span>
                  <span className="w-1.5 h-4 bg-emerald-400 rounded-xs"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400/40 rounded-xs"></span>
                  <span className="w-1.5 h-4 bg-emerald-400 rounded-xs"></span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500">
                Pruning concentrated around middle legal narrative &amp; minutes
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Execution Directive & Curated Payload Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Directive Input */}
          <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase tracking-wider">
                EXECUTION DIRECTIVE / PROMPT INSTRUCTION
              </span>
              <span className="text-slate-500 text-[11px]">37 tokens</span>
            </div>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={2}
              className="w-full bg-[#070b13] text-slate-200 border border-slate-800 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Curated Prompt Payload Preview */}
          <div className="p-3.5 rounded-xl bg-[#0b121e] border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-mono pb-1 border-b border-slate-800/80">
              <span className="text-white font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Curated Prompt Payload Preview</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                {copiedPayload ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPayload ? 'Copied' : 'Copy Clean Markdown'}</span>
              </button>
            </div>

            <pre className="font-mono text-xs text-slate-300 bg-[#070b13] p-3 rounded-lg border border-slate-800/80 max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
{curatedPayloadText}
            </pre>
          </div>

          {/* Token ROI & Cost Advantage Box */}
          <div className="p-3 rounded-xl bg-[#08141e] border border-cyan-900/40 text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span>TOKEN ROI &amp; COST ADVANTAGE</span>
              <span className="text-slate-400 font-normal text-[11px]">Model: Gemini 1.5 Pro ($3.50/1M tok)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-cyan-900/40">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Raw File Injection</span>
                <span className="text-slate-300 font-bold">24,650</span>
                <span className="text-[10px] text-slate-500 block">~$0.074 / call</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Curated Ingest</span>
                <span className="text-cyan-400 font-bold">{activeTokens.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block">~$0.0055 / call</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Net Savings (1,000 runs)</span>
                <span className="text-emerald-400 font-bold">+$68.50</span>
                <span className="text-[10px] text-emerald-300 block">7.2x Latency Lift</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-mono text-xs">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors">
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Curated Prompt (.prompt)</span>
              </button>
              <button
                onClick={() => setActiveTab('matrix')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              >
                <span>Send to Multi-Model Matrix</span>
              </button>
            </div>

            <button
              onClick={() => window.open('https://gemini.google.com/app', '_blank')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>One-Click Launch in Gemini 1.5 Pro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
