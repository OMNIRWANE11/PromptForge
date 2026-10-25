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
    ASSUMPTIONS_REGISTRY,
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
from .database import (
    init_database,
    create_user,
    authenticate_user,
    get_user_by_id,
    save_user_prompt,
    get_user_prompt_history,
    get_user_analytics,
    configure_postgres,
    get_db_status,
    CURRENT_DB_TYPE,
    PG_AVAILABLE
)

# Initialize Databases on startup (PostgreSQL with SQLite fallback)
init_db()
init_database()

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


class SignUpRequest(BaseModel):
    username: str
    email: str
    password: str
    fullName: str


class LoginRequest(BaseModel):
    usernameOrEmail: str
    password: str


class PostgresConfigRequest(BaseModel):
    host: str = "localhost"
    port: str = "5432"
    user: str = "postgres"
    password: str = ""
    dbname: str = "promptforge"


class OptimizationRequest(BaseModel):
    rawPrompt: str
    targetProvider: str = "gpt-4o"
    userLanguage: Optional[str] = None
    userId: Optional[int] = None


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


@app.get("/api/assumptions")
def get_assumptions_endpoint():
    """
    Returns formal statement of all standard tokenizer libraries, 
    public pricing tables, empirical script multipliers, and effectiveness assumptions.
    Directly addresses Hackathon PRD requirement: 'All assumptions should be clearly stated.'
    """
    return ASSUMPTIONS_REGISTRY


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
    
    # 4. Run Core Optimization Pipeline on English Pivot with original user text context
    opt_result = optimize_prompt_pipeline(
        raw_prompt=pivot_text,
        target_provider=req.targetProvider,
        language_info=lang_info,
        original_user_text=text
    )
    
    # 5. Strict Token Ceiling Invariant: Low-Token count must NEVER exceed user raw tokens
    user_raw_tokens = count_tokens_for_provider(text, req.targetProvider)
    lt_tokens = opt_result["variants"]["lowToken"]["tokenCount"]
    
    if lt_tokens > user_raw_tokens:
        # Guarantee invariant: if already minimal, clamp to user_raw_tokens and use clean text
        lt_tokens = user_raw_tokens
        opt_result["variants"]["lowToken"]["tokenCount"] = lt_tokens
        opt_result["variants"]["lowToken"]["prompt"] = text.strip()

    tokens_saved = max(0, user_raw_tokens - lt_tokens)
    lt_pct_saved = round((tokens_saved / max(1, user_raw_tokens)) * 100, 1)
    
    opt_result["metrics"]["originalTokens"] = user_raw_tokens
    opt_result["metrics"]["tokensSavedPerCall"] = tokens_saved
    opt_result["metrics"]["percentageSaved"] = lt_pct_saved
    opt_result["variants"]["lowToken"]["tokenDelta"] = -tokens_saved
    opt_result["variants"]["lowToken"]["percentageDelta"] = lt_pct_saved
    
    hc_tokens = opt_result["variants"]["highContext"]["tokenCount"]
    opt_result["variants"]["highContext"]["tokenDelta"] = hc_tokens - user_raw_tokens
    opt_result["variants"]["highContext"]["percentageDelta"] = round(((hc_tokens - user_raw_tokens) / max(1, user_raw_tokens)) * 100, 1)

    # 6. Back-Translation for Native Inspection and Dual-Language Token Metrics
    back_translated_hc = None
    back_translated_lt = None
    native_lt_tokens = 0
    native_hc_tokens = 0
    token_comparison = None

    if lang_info["isNonEnglish"]:
        back_translated_hc = back_translate_to_native(opt_result["variants"]["highContext"]["prompt"], lang_info["code"])
        back_translated_lt = back_translate_to_native(opt_result["variants"]["lowToken"]["prompt"], lang_info["code"])
        native_lt_tokens = count_tokens_for_provider(back_translated_lt, req.targetProvider)
        native_hc_tokens = count_tokens_for_provider(back_translated_hc, req.targetProvider)
        
        eng_lt_tokens = opt_result["variants"]["lowToken"]["tokenCount"]
        eng_hc_tokens = opt_result["variants"]["highContext"]["tokenCount"]
        
        opt_result["variants"]["lowToken"]["nativePrompt"] = back_translated_lt
        opt_result["variants"]["lowToken"]["nativeTokenCount"] = native_lt_tokens
        opt_result["variants"]["lowToken"]["englishPrompt"] = opt_result["variants"]["lowToken"]["prompt"]
        opt_result["variants"]["lowToken"]["englishTokenCount"] = eng_lt_tokens

        opt_result["variants"]["highContext"]["nativePrompt"] = back_translated_hc
        opt_result["variants"]["highContext"]["nativeTokenCount"] = native_hc_tokens
        opt_result["variants"]["highContext"]["englishPrompt"] = opt_result["variants"]["highContext"]["prompt"]
        opt_result["variants"]["highContext"]["englishTokenCount"] = eng_hc_tokens

        additional_savings_pct = round(((native_lt_tokens - eng_lt_tokens) / max(1, native_lt_tokens)) * 100, 1)

        token_comparison = {
            "isNonEnglish": True,
            "nativeLangCode": lang_info["code"],
            "nativeLangName": lang_info["name"],
            "nativeLangNative": lang_info["native"],
            "nativeLTTokens": native_lt_tokens,
            "englishLTTokens": eng_lt_tokens,
            "nativeHCTokens": native_hc_tokens,
            "englishHCTokens": eng_hc_tokens,
            "additionalSavingsPct": max(0, additional_savings_pct),
            "recommendation": f"We recommend using the English prompt below for your AI model ({req.targetProvider}). Because AI tokenizers use Byte-Pair Encoding (BPE), the English version consumes only {eng_lt_tokens} tokens compared to {native_lt_tokens} tokens in {lang_info['name']} (saving an additional {max(0, additional_savings_pct)}% tokens with identical accuracy)."
        }
        
    opt_result["targetProvider"] = req.targetProvider
    opt_result["multilingual"] = {
        "detectedLanguage": lang_info,
        "scriptTax": script_tax,
        "pivotInfo": pivot_info,
        "backTranslatedHC": back_translated_hc,
        "backTranslatedLT": back_translated_lt,
        "tokenComparison": token_comparison
    }
    
    # 6. Log Event to Analytics Database
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
        pass

    # 7. Persist User Prompt into Database (PostgreSQL / SQLite) for suggestions & comparison charts
    try:
        target_uid = req.userId if req.userId else 1
        save_user_prompt(
            user_id=target_uid,
            raw_prompt=text,
            target_provider=req.targetProvider,
            task_type=opt_result["analysis"]["taskType"],
            hc_prompt=opt_result["variants"]["highContext"]["prompt"],
            lt_prompt=opt_result["variants"]["lowToken"]["prompt"],
            raw_tokens=opt_result["metrics"]["originalTokens"],
            optimized_tokens=opt_result["variants"]["lowToken"]["tokenCount"],
            fillers=opt_result["analysis"].get("detectedFillers", []),
            redundancies=opt_result["analysis"].get("redundancies", [])
        )
    except Exception as e:
        print(f"[DATABASE] Prompt persistence error: {e}")
        
    return opt_result


@app.post("/api/auth/signup")
def signup_endpoint(req: SignUpRequest):
    """User Registration"""
    try:
        user = create_user(
            username=req.username,
            email=req.email,
            password=req.password,
            full_name=req.fullName
        )
        return {
            "status": "success",
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "fullName": user["full_name"]
            },
            "token": f"user_token_{user['id']}"
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@app.post("/api/auth/login")
def login_endpoint(req: LoginRequest):
    """User Authentication"""
    user = authenticate_user(req.usernameOrEmail, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username/email or password.")
    return {
        "status": "success",
        "user": user,
        "token": f"user_token_{user['id']}"
    }


@app.post("/api/auth/demo")
def demo_login_endpoint():
    """1-Click instant login for evaluators"""
    user = authenticate_user("priya", "password123")
    if not user:
        user = create_user("priya", "priya@civixminds.ai", "password123", "Priya Patel (AI Lead)")
    return {
        "status": "success",
        "user": user,
        "token": f"user_token_{user['id']}"
    }


@app.get("/api/user/analytics")
def user_analytics_endpoint(userId: int = Query(1)):
    """Returns analytics computed from user's historical prompts in PostgreSQL/SQLite"""
    return get_user_analytics(userId)


@app.get("/api/user/history")
def user_history_endpoint(userId: int = Query(1), limit: int = Query(50)):
    """Returns the user's historical prompt log"""
    return {
        "history": get_user_prompt_history(userId, limit),
        "databaseType": CURRENT_DB_TYPE
    }


@app.get("/api/database/status")
def database_status_endpoint():
    """Returns live PostgreSQL / SQLite connection state"""
    return get_db_status()


@app.post("/api/database/configure")
def database_configure_endpoint(req: PostgresConfigRequest):
    """Configures and connects to user's PostgreSQL database"""
    try:
        result = configure_postgres(
            host=req.host,
            port=req.port,
            user=req.user,
            password=req.password,
            dbname=req.dbname
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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


@app.post("/api/voice/transcribe")
async def transcribe_voice_endpoint(
    audio: UploadFile = File(...),
    language: str = Form("mr-IN")
):
    """
    Transcribes uploaded audio files (WAV, MP3, WebM, M4A) into text
    with specialized support for regional Indic languages (mr-IN, hi-IN, ta-IN, te-IN, en-IN).
    """
    import speech_recognition as sr
    import tempfile
    
    try:
        content = await audio.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty audio content provided.")
            
        recognizer = sr.Recognizer()
        
        ext = os.path.splitext(audio.filename or "")[1].lower() or ".wav"
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp_in:
            tmp_in.write(content)
            tmp_in_path = tmp_in.name
            
        wav_path = tmp_in_path
        if ext != ".wav":
            try:
                from pydub import AudioSegment
                seg = AudioSegment.from_file(tmp_in_path)
                wav_path = tmp_in_path + ".wav"
                seg.export(wav_path, format="wav")
            except Exception:
                pass
                
        try:
            with sr.AudioFile(wav_path) as source:
                audio_data = recognizer.record(source)
                text = recognizer.recognize_google(audio_data, language=language)
                return {
                    "text": text,
                    "language": language,
                    "status": "success"
                }
        except sr.UnknownValueError:
            raise HTTPException(status_code=400, detail="Could not understand speech in the audio. Please speak clearly.")
        except sr.RequestError as re:
            raise HTTPException(status_code=502, detail=f"Speech recognition service error: {str(re)}")
        finally:
            if os.path.exists(tmp_in_path):
                os.remove(tmp_in_path)
            if wav_path != tmp_in_path and os.path.exists(wav_path):
                os.remove(wav_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice transcription failed: {str(e)}")



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
