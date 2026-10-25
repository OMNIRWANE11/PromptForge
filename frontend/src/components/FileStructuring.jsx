import React, { useState } from 'react';
import { 
  FileText, FileSpreadsheet, FileCode, Upload, Check, 
  Copy, Sparkles, ShieldCheck, ArrowRight, Trash2, CheckCircle2, 
  ExternalLink, Layers, Terminal, ToggleLeft, ToggleRight, Eye
} from 'lucide-react';

export default function FileStructuring({ setActiveTab }) {
  const [stripStyles, setStripStyles] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(5); // Step 5: Chunking

  // Pruning filter toggles
  const [filters, setFilters] = useState({
    boilerplate: true,
    headers: true,
    tablesOnly: false,
    redundancies: true
  });

  // Conversion table rows (Matches Image 4)
  const convertedFiles = [
    {
      name: 'Product_Strategy_Deck.pptx',
      type: 'pptx',
      origSize: '14.8 MB',
      origTokens: '32,450 tokens',
      convName: 'Product_Strategy.md',
      convType: 'Clean Markdown Doc',
      newTokens: '1,840 tokens',
      savings: '+94% saved',
      status: 'Ready'
    },
    {
      name: 'User_Financial_Logs.json',
      type: 'json',
      origSize: '4.2 MB',
      origTokens: '18,900 tokens',
      convName: 'User_Financial_Logs.tsv',
      convType: 'Clean Tab-Separated Table',
      newTokens: '3,210 tokens',
      savings: '+83% saved',
      status: 'Ready'
    },
    {
      name: 'Enterprise_API_Schema.json',
      type: 'json',
      origSize: '1.1 MB',
      origTokens: '8,480 tokens',
      convName: 'Enterprise_API.toon',
      convType: 'Token-Oriented Object Notation',
      newTokens: '3,950 tokens',
      savings: '+53% saved',
      status: 'Ready'
    }
  ];

  const rawJsonSnippet = `{
  "openapi": "3.1.0",
  "info": { "title": "Billing Core", "version": "4.2" },
  "paths": {
    "/v1/invoices/{id}": {
      "get": {
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": { "due": { "type": "string" } }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

  const toonSnippet = `@schema BillingCore:v4.2
GET /v1/invoices/{id:str} -> {
  200: {
    due: ISO_DATE,
    val: INT_CENTS,
    status: ("PAID" | "PENDING" | "OVERDUE")
  },
  404: { error: str }
}

POST /v1/invoices/create(cust_id:str, amount:int) -> { id:str, created:ts }

Optimal LLM tabular attention density achieved • Tab-Delimited 712 KB`;

  const handleCopy = () => {
    navigator.clipboard.writeText(toonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 font-sans select-none">
      {/* 1. Top Section: File Ingestion Dock + How Formats Auto-Convert (Matches Image 4 Top) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 font-mono">
        {/* Left: File Ingestion Dock */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>File Ingestion Dock</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400 font-bold">
                Free In-Browser Tool
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Drop any heavy file to compress it for your prompts
            </p>

            {/* Dropzone Box */}
            <label className="mt-3 border-2 border-dashed border-slate-700/80 hover:border-blue-500/80 rounded-xl p-5 text-center flex flex-col items-center justify-center gap-2 bg-slate-950 cursor-pointer transition-colors block">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">
                Drag &amp; drop files here, or browse files
              </div>
              <div className="text-[10px] text-slate-400 font-sans">
                Supported types: PDF, Word (DOCX), Slides (PPTX), Excel (XLSX), JSON, HTML
              </div>
              <input type="file" multiple className="hidden" />

              {/* Format Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  PDF / DOCX <strong className="text-emerald-400">→ Markdown</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Excel / CSV <strong className="text-emerald-400">→ Clean TSV</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  JSON Logs <strong className="text-emerald-400">→ Clean TSV</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  API Specs <strong className="text-emerald-400">→ TOON / YAML</strong>
                </span>
              </div>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
            <span>🔒 100% private: Files stay in your browser (no server upload)</span>
            <span>Up to 100MB per file</span>
          </div>
        </div>

        {/* Right: How Formats Auto-Convert */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold text-white">How Formats Auto-Convert</h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold">
                Instant &amp; Automatic
              </span>
            </div>

            {/* 3 Transformation Guidance Cards */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Documents &amp; Slides</span>
                  <span className="text-[10px] text-slate-400 font-sans">PDF, Word, Slides, Web HTML</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">Docs → Markdown</span>
                  <span className="text-[10px] text-emerald-500 font-semibold">(saves ~70% tokens)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Spreadsheets &amp; Data Tables</span>
                  <span className="text-[10px] text-slate-400 font-sans">Excel, CSV, Big JSON Arrays</span>
                </div>
                <div className="text-right">
                  <span className="text-blue-400 font-bold block">Sheets → TSV</span>
                  <span className="text-[10px] text-blue-400 font-semibold">(saves ~80% tokens)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Nested JSON &amp; APIs</span>
                  <span className="text-[10px] text-slate-400 font-sans">OpenAPI Specs &amp; Payloads</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-bold block">JSON → TOON / YAML</span>
                  <span className="text-[10px] text-amber-500 font-semibold">(saves ~50% tokens)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-300 font-bold block text-[11px]">Remove unnecessary styling &amp; images</span>
              <span className="text-[10px] text-slate-500 font-sans">Keeps pure text content LLMs actually read</span>
            </div>
            <button
              onClick={() => setStripStyles(!stripStyles)}
              className="text-blue-400 cursor-pointer"
            >
              {stripStyles ? <ToggleRight className="w-6 h-6 text-blue-400" /> : <ToggleLeft className="w-6 h-6 text-slate-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Transformation Pipeline Step Progress (Matches Image 1) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase">Transformation Pipeline</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400 font-bold">
              Step 5 of 7
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Raw Injection:</span>
              <span className="text-rose-400 font-bold line-through">84,500 tok</span>
            </div>
            <span className="text-slate-600">→</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800">
              -92.3% Pruned
            </span>
            <span className="text-slate-600">→</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Curated Target:</span>
              <span className="text-emerald-400 font-bold">6,520 tok</span>
            </div>
          </div>
        </div>

        {/* 7 Pipeline Steps */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] pt-1">
          {[
            { step: 1, label: 'Upload', done: true },
            { step: 2, label: 'Density', done: true },
            { step: 3, label: 'OCR Parse', done: true },
            { step: 4, label: 'Restructure', done: true },
            { step: 5, label: 'Chunking', active: true },
            { step: 6, label: 'Curation' },
            { step: 7, label: 'Tokenize' }
          ].map((s) => (
            <div
              key={s.step}
              className={`p-1.5 rounded-lg border text-center transition-all ${
                s.active
                  ? 'bg-blue-950/80 border-cyan-500 text-cyan-300 font-bold ring-1 ring-cyan-500/30'
                  : s.done
                  ? 'bg-slate-950 border-emerald-900/60 text-emerald-400 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <div>{s.step}. {s.label}</div>
            </div>
          ))}
        </div>

        {/* Pruning Filters (Matches Image 1) */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-bold">Pruning Filters:</span>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.boilerplate}
                  onChange={(e) => setFilters({ ...filters, boilerplate: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-400"
                />
                <span>Strip Legal Boilerplate</span>
              </label>

              <label className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.headers}
                  onChange={(e) => setFilters({ ...filters, headers: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-400"
                />
                <span>Strip Headers/Footers</span>
              </label>

              <label className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.tablesOnly}
                  onChange={(e) => setFilters({ ...filters, tablesOnly: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-400"
                />
                <span>Keep Tables Only</span>
              </label>

              <label className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.redundancies}
                  onChange={(e) => setFilters({ ...filters, redundancies: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-blue-400"
                />
                <span>Remove Redundancies</span>
              </label>
            </div>
          </div>

          <button className="text-[11px] text-blue-400 hover:text-cyan-300 cursor-pointer">
            Select All
          </button>
        </div>

        {/* Prompt Execution Directive Bar (Matches Image 1) */}
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-purple-400">⚡</span>
            <span className="text-slate-400 text-[11px]">Prompt Execution Directive:</span>
            <span className="text-white font-sans text-xs">Extract the top 3 growth drivers and calculate YoY margin expansion.</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px]">
            Injects @Top
          </span>
        </div>
      </div>

      {/* 3. Active Conversion Workspace (Matches Image 4 Middle) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <h4 className="text-sm font-bold text-white">
              Active Conversion Workspace (3 Files Synced)
            </h4>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Live token density reduction across uploaded documents, spreadsheets, and API schemas
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-400 font-bold">
              Total Saved: 51,850 Tokens (-86.7%)
            </span>
            <button className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer">
              Clear Queue
            </button>
          </div>
        </div>

        {/* Conversion Workspace Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <th className="py-2.5 px-3">ORIGINAL FILE</th>
                <th className="py-2.5 px-3">ORIGINAL SIZE</th>
                <th className="py-2.5 px-3">CONVERTED FORMAT</th>
                <th className="py-2.5 px-3 text-right">NEW SIZE</th>
                <th className="py-2.5 px-3 text-right">TOKEN SAVINGS</th>
                <th className="py-2.5 px-3 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {convertedFiles.map((f, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 text-slate-200 font-bold flex items-center gap-2">
                    {f.type === 'pptx' ? <FileText className="w-3.5 h-3.5 text-blue-400" /> : f.type === 'json' ? <FileCode className="w-3.5 h-3.5 text-amber-400" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{f.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    <div>{f.origSize}</div>
                    <div className="text-[10px] text-slate-500">{f.origTokens}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-cyan-300 font-bold block">{f.convName}</span>
                    <span className="text-[10px] text-slate-400">{f.convType}</span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300">
                    {f.newTokens}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                    {f.savings}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      • {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Before & After Comparison: Raw JSON vs Compacted TOON (Matches Image 4 Bottom) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Before &amp; After Comparison</h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Comparing: Enterprise_API_Schema.json (Raw AST) ↔ Enterprise_API.toon (Compacted TOON)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-emerald-400 font-bold">
              Saved: -53.0% (-4,450 tokens)
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied TOON' : 'Copy Token-Saving Text'}</span>
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Snippets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {/* Raw JSON */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
              <span>Enterprise_API_Schema.json (Raw JSON)</span>
              <span className="text-[10px] text-slate-500">18,900 Tokens • High Overhead</span>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-rose-950/80 text-xs font-mono text-slate-300 max-h-56 overflow-y-auto leading-relaxed">
{rawJsonSnippet}
            </pre>
          </div>

          {/* Compacted TOON */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>Enterprise_API.toon (OPTIMIZED)</span>
              <span className="text-[10px] text-emerald-500">3,210 Tokens • Clean Delimiter</span>
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 border border-emerald-950/80 text-xs font-mono text-emerald-200 max-h-56 overflow-y-auto leading-relaxed whitespace-pre-wrap">
{toonSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
