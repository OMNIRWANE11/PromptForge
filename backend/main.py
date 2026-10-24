"""
PromptForge Backend Server
FastAPI Application implementing all requirements from the PromptForge Product Requirement Document.
Track: Problem Statement 3 — Prompt Optimization & Token-Efficiency Engine
Team: PromptForge (Om Shital Nirwane, Shraddha Santosh Sutar, Tanishq Vikas Patil, Shreyas Santosh Parit)
"""

import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import PlainTextResponse, JSONResponse
from pydantic import BaseModel

from .tokenizers import (
    PRICING_REGISTRY,
    PRICING_SNAPSHOT_DATE,
    count_tokens_for_provider,
    calculate_script_tax
)
from .multilingual import (
    detect_language,
    translate_to_english_pivot,
    back_translate_to_native,
    LANGUAGE_REGISTRY
)
from .optimizer import optimize_prompt_pipeline
from .file_converter import process_uploaded_file, serialize_to_toon
from .comparison_engine import run_cross_model_comparison
from .analytics_db import (
    init_db,
    log_optimization_event,
    get_analytics_summary,
    generate_export_report
)
from .test_data import BENCHMARK_PROMPTS, SAMPLE_DOCUMENTS

# Initialize Analytics Database on startup
init_db()

app = FastAPI(
    title="PromptForge Engine API",
    description="Multi-LLM Prompt Optimization and Token-Efficiency Platform",
    version="1.0.0"
)

# Enable CORS for local development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class OptimizationRequest(BaseModel):
    rawPrompt: str
    targetProvider: str = "gpt-4o"
    userLanguage: Optional[str] = None


class MergeOptimizeRequest(BaseModel):
    instruction: str
    selectedChunkContents: List[str]
    targetProvider: str = "gpt-4o"


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PromptForge Token-Efficiency Engine",
        "version": "1.0.0",
        "track": "Problem Statement 3 — Prompt Optimization & Token-Efficiency Engine",
        "team": {
            "name": "PromptForge",
            "members": [
                "Om Shital Nirwane",
                "Shraddha Santosh Sutar",
                "Tanishq Vikas Patil",
                "Shreyas Santosh Parit"
            ]
        },
        "pricingSnapshotDate": PRICING_SNAPSHOT_DATE,
        "supportedProviders": list(PRICING_REGISTRY.keys()),
        "supportedLanguages": list(LANGUAGE_REGISTRY.keys())
    }


@app.get("/api/benchmarks")
def get_benchmarks():
    """Returns curated benchmark prompts and sample document data for instant 1-click demos."""
    return {
        "prompts": BENCHMARK_PROMPTS,
        "sampleDocument": SAMPLE_DOCUMENTS["financial_compliance_audit"]
    }


@app.get("/api/models")
def get_model_registry():
    """Returns official public pricing and context window registry."""
    return {
        "snapshotDate": PRICING_SNAPSHOT_DATE,
        "models": PRICING_REGISTRY
    }


@app.post("/api/optimize")
def optimize_prompt_endpoint(req: OptimizationRequest):
    """
    Journey A (P0): Complete raw prompt optimization workflow.
    Detects language -> English Pivot -> Intent Analysis -> HC & LT Generation -> Guardrail Check -> Tokenization & Back-Translation.
    """
    if not req.rawPrompt or not req.rawPrompt.strip():
        raise HTTPException(status_code=400, detail="Prompt text cannot be empty.")
    
    text = req.rawPrompt.strip()
    
    # 1. Language Detection
    lang_info = detect_language(text)
    
    # 2. Script Multiplier & Tax Calculation
    script_tax = calculate_script_tax(text, lang_info["code"])
    
    # 3. Translation to English Pivot if non-English
    pivot_info = translate_to_english_pivot(text, lang_info["code"])
    pivot_text = pivot_info["englishPivot"]
    
    # 4. Run Core Optimization Pipeline on English Pivot
    opt_result = optimize_prompt_pipeline(
        raw_prompt=pivot_text,
        target_provider=req.targetProvider,
        language_info=lang_info
    )
    
    # 5. Back-Translation for Native Inspection if input was non-English
    back_translated_hc = None
    back_translated_lt = None
    if lang_info["isNonEnglish"]:
        back_translated_hc = back_translate_to_native(opt_result["variants"]["highContext"]["prompt"], lang_info["code"])
        back_translated_lt = back_translate_to_native(opt_result["variants"]["lowToken"]["prompt"], lang_info["code"])
        
    opt_result["multilingual"] = {
        "detectedLanguage": lang_info,
        "scriptTax": script_tax,
        "pivotInfo": pivot_info,
        "backTranslatedHC": back_translated_hc,
        "backTranslatedLT": back_translated_lt
    }
    
    # 6. Log Event to Analytics SQLite Database
    try:
        log_optimization_event(
            prompt=text,
            task_type=opt_result["analysis"]["taskType"],
            provider=req.targetProvider,
            language=lang_info["code"],
            orig_tokens=opt_result["metrics"]["originalTokens"],
            hc_tokens=opt_result["variants"]["highContext"]["tokenCount"],
            lt_tokens=opt_result["variants"]["lowToken"]["tokenCount"],
            constraints_count=len(opt_result["analysis"]["constraints"]),
            redundancy_score=opt_result["analysis"]["redundancyPercentage"]
        )
    except Exception as e:
        # Logging failure should not disrupt user response
        pass
        
    return opt_result


@app.post("/api/files/convert")
async def upload_file_endpoint(file: UploadFile = File(...)):
    """
    Journey B (P0/P1): Converts uploaded PDF, DOCX, PPTX, XLSX/CSV, or JSON
    into lowest-token format (.md, .csv, .toon) with selectable semantic chunks.
    """
    try:
        content_bytes = await file.read()
        if not content_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
            
        conversion_result = process_uploaded_file(content_bytes, file.filename)
        return conversion_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File conversion error: {str(e)}")


@app.post("/api/files/merge-and-optimize")
def merge_and_optimize_endpoint(req: MergeOptimizeRequest):
    """
    Journey B (Step 5-6): Merges curated document chunks with user instruction prompt
    and feeds into the HC/LT optimization engine.
    """
    joined_chunks = "\n\n---\n\n".join([chunk.strip() for chunk in req.selectedChunkContents if chunk.strip()])
    
    if not joined_chunks:
        merged_prompt = req.instruction.strip()
    else:
        merged_prompt = f"""### Source Context & Extracted Data
{joined_chunks}

### User Instruction & Task
{req.instruction.strip()}"""

    return optimize_prompt_pipeline(
        raw_prompt=merged_prompt,
        target_provider=req.targetProvider
    )


@app.post("/api/compare")
def compare_cross_model_endpoint(req: OptimizationRequest):
    """
    Journey C (P1): Runs prompt through Gemini, Claude, and ChatGPT in parallel.
    Returns comparison scorecards and optimal model recommendation.
    """
    if not req.rawPrompt or not req.rawPrompt.strip():
        raise HTTPException(status_code=400, detail="Prompt text cannot be empty.")
    
    return run_cross_model_comparison(req.rawPrompt.strip())


@app.get("/api/analytics")
def get_analytics_endpoint(call_multiplier: int = Query(10000, ge=1, le=1000000)):
    """
    Journey D (P1/P2): Returns personal token-efficiency dashboard metrics,
    historical time series, prompting improvement rate, and anti-pattern coaching insights.
    """
    return get_analytics_summary(call_multiplier)


@app.get("/api/export")
def export_report_endpoint(format: str = Query("markdown", pattern="^(markdown|json)$")):
    """P1-7: Export optimization audit report as Markdown or JSON."""
    report_content = generate_export_report(format)
    if format == "json":
        return JSONResponse(content=report_content)
    else:
        return PlainTextResponse(
            content=report_content,
            media_type="text/markdown",
            headers={"Content-Disposition": "attachment; filename=promptforge_audit_report.md"}
        )


# If frontend dist exists, mount as static files for seamless single-server deployment
dist_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")
