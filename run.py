"""
PromptForge Unified Server Launcher
Runs the FastAPI backend and serves the compiled React frontend at http://localhost:8000.
"""

import os
import sys

# Ensure UTF-8 output on Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("   PROMPTFORGE - Multi-LLM Prompt Optimization & Token Engine")
    print("   Problem Statement 3 | Team: PromptForge")
    print("=" * 60)
    print("-> Loading authentic tokenizers (OpenAI, Claude, Gemini)...")
    print("-> Initializing Guardrail Validator (0% Constraint Loss)...")
    print("-> Launching Server at: http://127.0.0.1:8000")
    print("=" * 60)
    
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)

