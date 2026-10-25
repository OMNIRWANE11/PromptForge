import io
import os
import sys

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath("."))

import pymupdf
import backend.database as db
from backend.main import (
    health_check,
    get_benchmarks,
    get_model_registry,
    demo_login_endpoint,
    login_endpoint,
    optimize_prompt_endpoint,
    compare_cross_model_endpoint,
    get_analytics_endpoint,
    export_report_endpoint,
    OptimizationRequest,
    LoginRequest
)
from backend.tokenizers import count_tokens_openai, count_tokens_claude, count_tokens_gemini
from backend.file_converter import process_uploaded_file, serialize_to_toon
from backend.test_data import BENCHMARK_PROMPTS

def run_diagnostics():
    print("=" * 65)
    print("PROMPTFORGE FULL SYSTEM & FUNCTION DIAGNOSTICS")
    print("=" * 65)

    # 1. Health & Configuration Check
    print("\n[1/8] Verifying API Health & Model Registry...")
    health = health_check()
    assert health["status"] == "healthy"
    print(f"  -> Health Status: {health['status']}")
    print(f"  -> Supported AI Providers: {len(health['supportedProviders'])}")
    print(f"  -> Supported Languages: {len(health['supportedLanguages'])}")

    # 2. Database & Authentication Check
    print("\n[2/8] Verifying Database & User Authentication...")
    db_status = db.get_db_status()
    print(f"  -> Active Database Driver: {db_status.get('dbType')}")
    print(f"  -> PostgreSQL State: {db_status.get('isPostgres')}")
    print(f"  -> Message: {db_status.get('message')}")
    
    # 1-Click Demo Login
    demo_auth = demo_login_endpoint()
    demo_user = demo_auth["user"]
    print(f"  -> 1-Click Demo Login: SUCCESS ({demo_user['fullName']}, username={demo_user['username']}, id={demo_user['id']})")
    assert demo_user["id"] == 1
    
    # Standard Credentials Login
    cred_auth = login_endpoint(LoginRequest(usernameOrEmail="priya", password="password123"))
    print(f"  -> Standard Credentials Login: SUCCESS (token={cred_auth['token']})")

    # 3. English Benchmark Prompt Optimization
    print("\n[3/8] Running English Benchmark Prompt Optimization...")
    en_req = OptimizationRequest(
        rawPrompt=BENCHMARK_PROMPTS[0]["prompt"],
        targetProvider="gpt-4o",
        userId=demo_user["id"]
    )
    en_res = optimize_prompt_endpoint(en_req)
    en_orig = en_res["metrics"]["originalTokens"]
    en_lt = en_res["variants"]["lowToken"]["tokenCount"]
    en_pct = en_res["metrics"]["percentageSaved"]
    print(f"  -> Raw: {en_orig} tokens -> Low-Token: {en_lt} tokens ({en_pct}% saved)")
    print(f"  -> Target Provider: {en_res['targetProvider']}")
    guardrail = en_res["variants"]["lowToken"]["guardrail"]
    print(f"  -> Guardrail Enforcement: {guardrail['status']} (Retention: {guardrail['constraintRetentionRate']}%, Loss: {guardrail['constraintLossRate']}%)")
    assert en_pct > 25, "English prompt did not meet savings threshold"
    assert guardrail["constraintRetentionRate"] == 100.0
    assert guardrail["constraintLossRate"] == 0.0

    # 4. Regional Indic Prompt (Marathi) with Lingua Detection & Script Tax
    print("\n[4/8] Running Regional Demo Prompt (Marathi)...")
    mr_prompt = "मला भारतीय राज्यघटनेच्या 'प्रस्तावाने'वर (Preamble) एक पीडीएफ (PDF) तयार करायची आहे . भारतीय राज्यघटनेतील मजकुरातून ५० ओळी घेऊन एक पीडीएफ तयार करा"
    mr_req = OptimizationRequest(
        rawPrompt=mr_prompt,
        targetProvider="gpt-4o",
        userId=demo_user["id"]
    )
    mr_res = optimize_prompt_endpoint(mr_req)
    mr_orig = mr_res["metrics"]["originalTokens"]
    mr_lt = mr_res["variants"]["lowToken"]["tokenCount"]
    mr_pct = mr_res["metrics"]["percentageSaved"]
    mr_lang = mr_res["multilingual"]["detectedLanguage"]["name"]
    mr_conf = mr_res["multilingual"]["detectedLanguage"]["confidence"]
    print(f"  -> Detected Language: {mr_lang} (Confidence: {mr_conf})")
    print(f"  -> Raw Indic Script Tokens: {mr_orig} -> English Pivot Low-Token: {mr_lt} ({mr_pct}% saved)")
    print(f"  -> Localized Suggestions: {len(mr_res['analysis']['localizedSuggestionsByLang']['mr']['suggestions'])} Marathi coaching tips generated")
    assert mr_pct > 70, "Regional script optimization failed to achieve Indic BPE compression"
    assert mr_lang == "Marathi"

    # 5. Database Telemetry & Prompt Logging Check
    print("\n[5/8] Verifying Database Telemetry & User History...")
    user_analytics = db.get_user_analytics(demo_user["id"])
    history = db.get_user_prompt_history(demo_user["id"], limit=5)
    print(f"  -> Historical Prompts Logged: {len(history)} entries")
    print(f"  -> Total Lifetime Prompts: {user_analytics.get('totalPrompts')}")
    print(f"  -> Total Tokens Saved: {user_analytics.get('totalTokensSaved'):,}")
    print(f"  -> Most Used AI Platform: {user_analytics['platformDistribution']['mostUsedPlatform']}")
    print(f"  -> Estimated Financial Savings: ${user_analytics.get('estimatedCostSaved')}")
    assert len(history) > 0

    # 6. PDF File Converter & Semantic Chunker
    print("\n[6/8] Testing PDF Conversion & Chunking Pipeline...")
    doc = pymupdf.open()
    page = doc.new_page()
    page.insert_text((50, 72), "EXECUTIVE SUMMARY\n\nPromptForge Token-Efficiency Compliance Engine.")
    page.insert_text((50, 150), "SECTION 1: SYSTEM SPECIFICATIONS\n\n- Cross-Platform Prompt Optimization\n- 0% Hard Constraint Loss\n- 90% Indic Script Savings")
    pdf_bytes = doc.tobytes()
    doc.close()

    pdf_res = process_uploaded_file(pdf_bytes, "demo_compliance.pdf")
    print(f"  -> Processed: {pdf_res['filename']}")
    print(f"  -> Converted Format: {pdf_res['targetFormat']} ({pdf_res['formatExtension']})")
    print(f"  -> Raw Tokens: {pdf_res['rawEstimatedTokens']} -> Converted: {pdf_res['convertedTokens']}")
    print(f"  -> Conversion Savings: {pdf_res['conversionSavingsPct']}%")
    print(f"  -> Semantic Chunks Generated: {len(pdf_res['chunks'])}")
    assert pdf_res["convertedTokens"] < pdf_res["rawEstimatedTokens"]

    # 7. TOON Serializer Check
    print("\n[7/8] Testing TOON Serializer for JSON Payloads...")
    sample_json = [
        {"id": 101, "service": "AuthGateway", "status": "nominal", "latency_ms": 12},
        {"id": 102, "service": "OptimizerCore", "status": "active", "latency_ms": 28}
    ]
    toon_str = serialize_to_toon(sample_json)
    print(f"  -> Serialized TOON Header: {toon_str.splitlines()[0]}")
    assert "service" in toon_str and "AuthGateway" in toon_str

    # 8. Cross-Model Matrix & Export Report
    print("\n[8/8] Testing Cross-Model Comparison & Export Report...")
    comparison = compare_cross_model_endpoint(OptimizationRequest(rawPrompt="Build a REST API with FastAPI and PostgreSQL."))
    print(f"  -> Optimal Cost Winner: {comparison['recommendation']['winnerModel']} ({comparison['recommendation']['winnerProvider']})")
    print(f"  -> Evaluated Providers: {[s['modelName'] for s in comparison['scorecards']]}")
    assert len(comparison["scorecards"]) == 3
    
    report_md = export_report_endpoint("markdown")
    print(f"  -> Markdown Audit Report Generated ({len(report_md.body)} bytes)")
    assert len(report_md.body) > 100

    print("\n" + "=" * 65)
    print("ALL 8 VERIFICATION PHASES PASSED WITH 100% SUCCESS!")
    print("=" * 65)

if __name__ == "__main__":
    run_diagnostics()

