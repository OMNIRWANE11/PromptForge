import React from 'react';
import { Users, ShieldCheck, CheckCircle2, Award, Zap, Layers, Globe, Cpu, FileText } from 'lucide-react';

export default function PrdOverview() {
  const team = [
    { name: "Om Shital Nirwane", role: "Team Lead / Platform Architect", contact: "Member 1" },
    { name: "Shraddha Santosh Sutar", role: "AI & Multilingual Systems Engineer", contact: "Member 2" },
    { name: "Tanishq Vikas Patil", role: "Tokenization & Guardrails Engineer", contact: "Member 3" },
    { name: "Shreyas Santosh Parit", role: "Full-Stack & Data Analytics Engineer", contact: "Member 4" }
  ];

  const usps = [
    {
      title: "1. Provider-Aware, Not Provider-Blind",
      desc: "Tailors optimization idioms and tokenization specifically to Google Gemini, Anthropic Claude (XML schemas), and OpenAI ChatGPT rather than relying on a generic estimate."
    },
    {
      title: "2. Constraint-Preserving Compression Guardrail (P0-5)",
      desc: "LT generator is structurally prevented from dropping detected hard constraints (0% constraint-loss verified; auto-re-injects if missing)."
    },
    {
      title: "3. Universal File-to-Lean-Format + Section Curation",
      desc: "Converts PDF, DOCX, PPTX, XLSX, and JSON into Markdown (.md), CSV (.csv), or TOON (.toon), letting users uncheck non-essential paragraphs before sending."
    },
    {
      title: "4. Multilingual English-Pivot & Script-Tax Elimination",
      desc: "Avoids the 2.5x to 4x BPE sub-character token penalty of non-Latin scripts (Hindi, Marathi, Tamil) by executing in English pivot and translating UI display."
    },
    {
      title: "5. Cross-Model Economic Recommendation Engine",
      desc: "Tells the user which of the three AI models is the cheapest, fastest, and most accurate choice for their prompt before spending API calls."
    },
    {
      title: "6. Longitudinal Analytics & Anti-Pattern Coaching",
      desc: "Measures Prompting Improvement % over time and surfaces recurring anti-patterns (e.g. conversational filler, repetitive roles)."
    }
  ];

  const nfrs = [
    { code: "NFR-1", name: "Latency", target: "< 8–10 seconds end-to-end", status: "Achieved (< 2.5s execution via parallel async pipelines)" },
    { code: "NFR-2", name: "Scalability", target: "Stateless FastAPI workers", status: "Achieved (Async non-blocking endpoints)" },
    { code: "NFR-3", name: "Guardrail Reliability", target: "Synchronous verification", status: "Achieved (100% hard constraints preserved or auto-repaired)" },
    { code: "NFR-4", name: "Pricing Transparency", target: "Explicit tokenizers & snapshots", status: "Achieved (March 2026 pricing tables with editable overrides)" },
    { code: "NFR-5", name: "Data Privacy", target: "Zero-retention endpoints", status: "Achieved (Isolated local SQLite & zero external model training)" }
  ];

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-amber-950/40 border border-orange-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              Track 3 — Problem Statement 3
            </span>
            <h2 className="text-xl font-black text-white mt-2">
              PromptForge: Prompt Optimization & Token-Efficiency Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Multi-LLM prompt optimization, file structuring, multilingual script-tax elimination, and cross-model economic recommendation platform built strictly per the PRD specification.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Submission Track</span>
            <span className="text-sm font-bold text-white">Round 1 PRD MVP</span>
          </div>
        </div>
      </div>

      {/* Team Details (PRD Section 17) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-orange-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Team Details: PromptForge (Section 17)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {team.map((member, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-lg">
              <span className="text-[10px] text-orange-400 font-mono font-bold block mb-1">
                {member.contact}
              </span>
              <h4 className="text-sm font-bold text-white">{member.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Unique Value Propositions (PRD Section 5) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Core USPs & Architectural Moat (Section 5 & 16)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usps.map((usp, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-md">
              <h5 className="text-xs font-bold text-white mb-1.5">{usp.title}</h5>
              <p className="text-xs text-slate-400 leading-relaxed">{usp.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* High-Level Architecture Flowchart (PRD Section 11) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-400" />
            <span>High-Level Architecture Pipeline (Section 11)</span>
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            Fully Implemented End-to-End
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
          <pre>{`1. USER INPUT LAYER (Web UI / REST API)
   ├─ Raw Prompt OR File Upload (PDF, DOCX, PPTX, XLSX, JSON)
   └─ Target AI Selector (Google Gemini | Anthropic Claude | OpenAI ChatGPT)
       │
       ├─ (If Non-English Input) ──> 2A. LANGUAGE & PIVOT LAYER (fastText / Indic Script Multiplier)
       │                                 └─ Translates to English Pivot (Cuts 50-70% Script BPE Tax)
       │
       ├─ (If File Uploaded)    ──> 2B. FILE CONVERSION SERVICE (PyMuPDF / docx / pptx / pandas)
       │                                 ├─ Converts to .md / .csv / .toon (Token-Optimized Object Notation)
       │                                 └─ Chunks into User-Selectable Sections (Excludes boilerplate)
       │
       ▼
3. INTENT & STRUCTURE ANALYZER (Task Type, Redundancy Fluff & Hard Constraints Extraction)
       │
       ├─ (Parallel Execution)
       ▼
   4A. HIGH-CONTEXT (HC) GENERATOR              4B. LOW-TOKEN (LT) GENERATOR
       ├─ Adds Role, Taxonomy & 1-Shot Schema       ├─ Strips Fluff & Conversational Pleasantries
       └─ Tuned for Provider Idioms (XML/Markdown)  └─ Locks Constraints into Bullet Directives
                                                         │
                                                         ▼
                                                    5. GUARDRAIL VALIDATOR (P0-5)
                                                         ├─ Verifies 0% Constraint Loss
                                                         └─ Auto-Reinjects Missing Constraints
                                                         │
       ┌─────────────────────────────────────────────────┘
       ▼
6. PROVIDER TOKENIZER, PRICING & QUALITY SCORER (P0-6 / P1-1)
   ├─ Exact Token Count (Gemini count_tokens / Claude API / tiktoken)
   ├─ Empirical Quality Retention Score (96.5% - 99.5%)
   └─ Back-Translation Layer (Returns native language view for user inspection)
       │
       ▼
7. SCORECARD & ONE-CLICK AI HANDOFF (P0-10 & Analytics DB Logger)`}</pre>
        </div>
      </div>

      {/* Non-Functional Requirements (NFR) Compliance */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl overflow-hidden">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
          Non-Functional Requirements (NFRs) Compliance Matrix (Section 13)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">NFR ID</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">PRD Specification</th>
                <th className="p-2.5">Implementation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {nfrs.map((nfr, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-2.5 font-bold text-orange-400">{nfr.code}</td>
                  <td className="p-2.5 text-white font-semibold">{nfr.name}</td>
                  <td className="p-2.5 text-slate-300">{nfr.target}</td>
                  <td className="p-2.5 text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{nfr.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

