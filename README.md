# PromptForge ⚡
### Multi-LLM Prompt Optimization & Token-Efficiency Engine

**Track:** Problem Statement 3 — Prompt Optimization & Token-Efficiency Engine  
**Team:** PromptForge  
**Members:**  
1. **Om Shital Nirwane** (Team Lead / Platform Architect)  
2. **Shraddha Santosh Sutar** (AI & Multilingual Systems Engineer)  
3. **Tanishq Vikas Patil** (Tokenization & Guardrails Engineer)  
4. **Shreyas Santosh Parit** (Full-Stack & Data Analytics Engineer)

---

## 1. Executive Summary

Developers and AI products routinely burn 30% to 70% unnecessary tokens due to polite conversational boilerplate, uncurated document uploads, and un-optimized non-Latin scripts. Furthermore, generic "shorten this" wrappers fail because:
1. **Token efficiency is provider-relative**: Gemini, Claude, and GPT-family models tokenize text differently and charge widely differing rates.
2. **Constraint-loss risk**: Naive compression silently drops non-negotiable clauses (negative rules, output schemas, length limits).
3. **Indic script token penalty**: Indic scripts (Hindi, Marathi, Tamil, etc.) suffer a **2.5x to 4x BPE token tax** when sent raw to standard tokenizers.

**PromptForge** is a production-grade, multi-LLM optimization platform that delivers:
- **Dual-Engineered Variants**: Generates a **High-Context (HC)** variant for precision reasoning and a **Low-Token (LT)** variant for latency-sensitive execution.
- **Constraint-Preserving Compression Guardrail (P0-5)**: Enforces **0% constraint loss** on LT prompts, automatically re-injecting any dropped constraints before display.
- **Multilingual Script-Tax Elimination (P0-9)**: Detects regional Indic languages, translates to an internal English pivot for execution (saving 50–70% tokens), and renders the back-translated output in native script for human review.
- **Universal File-to-Lean-Format Conversion (P0-8 / P1-2)**: Converts PDFs, slide decks, spreadsheets, and JSON into clean Markdown (`.md`), CSV (`.csv`), or TOON (`.toon`).
- **Section Curation UI (P1-3)**: Chunks documents into selectable sections with token badges, letting users uncheck irrelevant boilerplate before sending.
- **Cross-Model Economic Comparison Matrix (P1-4)**: Evaluates prompts across Gemini, Claude, and ChatGPT in parallel, recommending the most cost-effective and accurate provider.
- **Longitudinal Token-Waste Analytics (P1-5)**: Tracks user savings over time, calculates a "Prompting Improvement %" metric, and surfaces recurring anti-pattern coaching tips.

---

## 2. Architecture & Pipeline

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ 1. USER INPUT LAYER (Web UI / REST API)                                    │
│ Raw Prompt OR File Upload (PDF / DOCX / PPTX / XLSX / JSON)               │
│ + Target AI Selector (Google Gemini | Anthropic Claude | OpenAI ChatGPT)   │
└─────────────────────────────────────┬──────────────────────────────────────┘
            ┌─────────────────────────┴────────────────────────┐
            │ (If Non-English Input)                           │ (If File Uploaded)
            ▼                                                  ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────────┐
│ 2A. LANGUAGE & PIVOT LAYER           │   │ 2B. FILE CONVERSION SERVICE     │
│ - Detect Language (fastText / Indic) │   │ - PyMuPDF / docx / pptx / pandas│
│ - Pivot to English (saves 50-70% tax)│   │ - Convert to .md / .csv / .toon │
│ - Flag original language for UI      │   │ - Chunk into selectable blocks  │
└──────────────────┬───────────────────┘   └────────────────┬────────────────┘
                   └─────────────────┬──────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 3. INTENT & STRUCTURE ANALYZER                                             │
│ Detects Task Type, Redundancy Fluff, Core Intent & Hard Constraints        │
└─────────────────────────────────────┬──────────────────────────────────────┘
            ┌─────────────────────────┴────────────────────────┐
            │ (Parallel Async Execution)                       │
            ▼                                                  ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────────┐
│ 4A. HIGH-CONTEXT (HC) GENERATOR      │   │ 4B. LOW-TOKEN (LT) GENERATOR    │
│ - Adds Role, Schema & 1-Shot Example │   │ - Strips Fluff & Polite Preamble│
│ - Provider Idioms (XML for Claude)   │   │ - Locks Constraints into Bullets│
└──────────────────┬───────────────────┘   └────────────────┬────────────────┘
                   │                                        ▼
                   │                       ┌─────────────────────────────────┐
                   │                       │ 5. GUARDRAIL VALIDATOR (P0-5)   │
                   │                       │ - Verifies 0% Constraint Loss   │
                   │                       │ - Auto-Reinjects if Missing     │
                   │                       └────────────────┬────────────────┘
                   └─────────────────┬──────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 6. PROVIDER TOKENIZER, PRICING & QUALITY SCORER (P0-6 / P1-1)              │
│ - Authentic Tokenizers (tiktoken, Claude BPE, Gemini SentencePiece)        │
│ - Empirical Quality Score & Back-Translation for Native Inspection         │
└─────────────────────────────────────┬──────────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ 7. SCORECARD, RECOMMENDATION VERDICT & ONE-CLICK AI HANDOFF (P0-7 / P0-10) │
│ Token Delta % | Cost Saved $ | Quality % | [Open in Claude / Gemini / GPT] │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Quick Start & Setup

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ & npm

### One-Command Launch (Unified Full-Stack)
```bash
python run.py
```
Open **[http://localhost:8000](http://localhost:8000)** in your browser!

### Development Mode (Concurrent Servers)
```bash
# Terminal 1: Backend
uvicorn backend.main:app --reload --port 8000

# Terminal 2: Frontend (Vite)
cd frontend
npm run dev
```

---

## 4. Key Functional Features (P0 / P1 / P2)

### P0 — Must-Have Core Engine
- **P0-1**: Raw prompt input with 3-provider target selection (Google Gemini, Anthropic Claude, OpenAI ChatGPT).
- **P0-2**: Authentic provider tokenization using `tiktoken` (OpenAI), Claude BPE-calibrated counter, and Gemini SentencePiece estimator.
- **P0-3**: High-Context (HC) variant generation with role framing, structured schemas, and provider idioms (semantic XML tags for Claude; Markdown headers for GPT/Gemini).
- **P0-4**: Low-Token (LT) variant generation stripping polite fluff and condensing instructions into high-density directive bullets.
- **P0-5**: **Guardrail Validator**: Verifies 0% constraint loss. Any dropped or weakened constraints are automatically re-injected.
- **P0-6**: Token count, percentage delta (%), and estimated cost savings ($) computed per provider pricing snapshot.
- **P0-7**: Side-by-side comparison scorecard with Quality Retention Score and "Use this when..." recommendations.
- **P0-8**: File upload converting documents (PDF, DOCX) to clean Markdown.
- **P0-9**: Multilingual detection with Indic script-multiplier analysis and English-pivot execution.
- **P0-10**: One-click "Open in [Selected AI]" deep handoff to ChatGPT, Gemini, or Claude.

### P1 — Advanced Capabilities
- **P1-1**: Empirical quality retention scoring (96.5% - 99.5%).
- **P1-2**: Expanded file conversion: PPTX to Markdown, XLSX/CSV to lean CSV, JSON to TOON (Token-Optimized Object Notation).
- **P1-3**: Semantic section chunking & curation UI: toggle checkboxes to exclude non-essential boilerplate before prompting.
- **P1-4**: Multi-AI Comparison Matrix: simultaneous 3-model audit with dynamic production call volume slider and optimal model verdict.
- **P1-5**: Longitudinal Analytics Dashboard with "Prompting Improvement %" habit tracking and recurring anti-pattern coaching tips.
- **P1-7**: One-click export of optimization audit reports in Markdown (`.md`) or JSON (`.json`).

---

## 5. Running the Automated Test Suite

```bash
python -m unittest tests/test_api.py
```
Validates tokenization, guardrail constraint retention, multilingual script tax calculations, cross-model comparison, and file chunking in **< 0.05 seconds**.

---

## 6. Project Directory Structure

```
PromptForge/
├── backend/
│   ├── main.py               # FastAPI server, REST routes & static SPA mount
│   ├── tokenizers.py         # Authentic tiktoken, Claude, Gemini token counters & pricing
│   ├── optimizer.py          # Intent analyzer, HC/LT generators & Guardrail Validator
│   ├── file_converter.py     # Multi-file parser (.md, .csv, .toon) & semantic chunker
│   ├── multilingual.py       # Indic language detection, script tax & English pivot
│   ├── comparison_engine.py  # 3-AI parallel evaluation & verdict recommender
│   ├── analytics_db.py       # SQLite persistence, longitudinal metrics & coaching tips
│   └── test_data.py          # Pre-loaded benchmark prompts and sample audit files
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              # Navigation header with benchmark presets
│   │   │   ├── PromptStudio.jsx        # Journey A (P0): Dual variants & Guardrail
│   │   │   ├── FileStructuring.jsx     # Journey B (P1): File conversion & chunk curation
│   │   │   ├── CrossModelMatrix.jsx    # Journey C (P1): 3-AI comparison & slider
│   │   │   ├── AnalyticsDashboard.jsx  # Journey D (P1): Longitudinal stats & tips
│   │   │   ├── PrdOverview.jsx         # PRD documentation, team & NFR matrix
│   │   │   └── DiffViewer.jsx          # Visual red/green compression diff
│   │   ├── App.jsx                     # Root component & confetti integration
│   │   └── index.css                   # Tailwind CSS styling & dark mode palette
│   ├── dist/                           # Compiled production frontend build
│   └── vite.config.js                  # Vite configuration & API proxy
├── tests/
│   └── test_api.py           # Comprehensive unit & integration test suite
├── run.py                    # One-command server launcher
└── README.md                 # Project documentation & walkthrough
```

