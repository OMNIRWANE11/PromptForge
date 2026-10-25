"""
Direct Unit Test Suite for PromptForge Backend Modules
Runs synchronously and quickly in < 1 second.
"""

import unittest
from backend.optimizer import optimize_prompt_pipeline, analyze_intent_and_structure, guardrail_validator
from backend.multilingual import detect_language, translate_to_english_pivot
from backend.tokenizers import count_tokens_openai, count_tokens_claude, count_tokens_gemini, calculate_script_tax
from backend.comparison_engine import run_cross_model_comparison
from backend.analytics_db import get_analytics_summary, generate_export_report
from backend.file_converter import serialize_to_toon, chunk_document_semantically


class TestPromptForgeCore(unittest.TestCase):
    def test_01_tokenizers(self):
        text = "Hello world! This is a test prompt with constraints."
        t_gpt = count_tokens_openai(text)
        t_claude = count_tokens_claude(text)
        t_gemini = count_tokens_gemini(text)
        self.assertGreater(t_gpt, 5)
        self.assertGreater(t_claude, 5)
        self.assertGreater(t_gemini, 5)

    def test_02_intent_and_guardrail(self):
        prompt = "Write a python function to validate JWT tokens. Output strictly in JSON format only. No markdown ticks."
        analysis = analyze_intent_and_structure(prompt)
        self.assertEqual(analysis["taskType"], "coding")
        self.assertTrue(len(analysis["constraints"]) >= 2)
        
        # Test guardrail enforcement
        mock_lt = "DIRECTIVE: Validate JWT in python.\nCONSTRAINTS:\n• Strictly valid JSON format"
        final_lt, guardrail = guardrail_validator(prompt, mock_lt, analysis["constraints"])
        self.assertEqual(guardrail["constraintRetentionRate"], 100.0)

    def test_03_optimization_pipeline(self):
        prompt = "Hey can you please help me write a Python function to parse JSON? Output strictly in valid JSON format only! Thanks so much!"
        res = optimize_prompt_pipeline(prompt, "gpt-4o")
        self.assertIn("highContext", res["variants"])
        self.assertIn("lowToken", res["variants"])
        self.assertGreater(res["metrics"]["percentageSaved"], 20.0)

    def test_04_indic_script_multiplier(self):
        hindi = "कृपया मुझे पिछले तिमाही के बिक्री डेटा का एक सारांश एक तालिका के रूप में दें।"
        lang = detect_language(hindi)
        self.assertEqual(lang["code"], "hi")
        tax = calculate_script_tax(hindi, "hi")
        self.assertTrue(tax["isNonLatin"])
        self.assertGreater(tax["multiplier"], 1.5)

    def test_05_cross_model_comparison(self):
        prompt = "Write an async database connection pool manager in Python. Return only code."
        res = run_cross_model_comparison(prompt)
        self.assertIn("Claude", res["recommendation"]["winnerModel"])
        self.assertEqual(len(res["scorecards"]), 3)

    def test_06_file_toon_and_chunking(self):
        data = {"user": "Alice", "role": "admin", "permissions": ["read", "write"]}
        toon = serialize_to_toon(data)
        self.assertNotIn("{", toon)
        self.assertIn("user: Alice", toon)
        
        chunks = chunk_document_semantically("## Section 1\nContent 1\n## Section 2\nContent 2", "markdown")
        self.assertEqual(len(chunks), 2)

    def test_07_analytics_and_export(self):
        summary = get_analytics_summary(10000)
        self.assertGreater(summary["totalOptimizations"], 0)
        report = generate_export_report("markdown")
        self.assertIn("PromptForge", report)

    def test_08_conversational_and_redundancy_compression(self):
        # Exact prompt reported by user
        prompt = "i want to make a ppt for the hackathon where my problem statement is deppend on the garbage / waste management . Waste management is the problem statement ."
        res = optimize_prompt_pipeline(prompt, "claude-3-5-sonnet")
        
        orig_tokens = res["metrics"]["originalTokens"]
        lt_tokens = res["variants"]["lowToken"]["tokenCount"]
        
        # Invariant 1: LT must use strictly fewer tokens than raw
        self.assertLess(lt_tokens, orig_tokens)
        
        # Invariant 2: At least 50% tokens saved on this conversational prompt
        self.assertGreater(res["metrics"]["percentageSaved"], 50.0)
        
        # Invariant 3: Fillers and redundancies must be accurately identified
        self.assertGreater(len(res["analysis"]["detectedFillers"]), 0)
        self.assertGreater(len(res["analysis"]["redundancies"]), 0)

    def test_09_database_and_auth(self):
        from backend.database import create_user, authenticate_user, save_user_prompt, get_user_analytics
        import time
        
        # Test unique user signup
        test_uname = f"testuser_{int(time.time())}"
        user = create_user(test_uname, f"{test_uname}@test.com", "mypassword123", "Test Engineer")
        self.assertIsNotNone(user["id"])
        
        # Test login
        auth = authenticate_user(test_uname, "mypassword123")
        self.assertIsNotNone(auth)
        self.assertEqual(auth["username"], test_uname)
        
        # Test wrong password fails
        bad_auth = authenticate_user(test_uname, "wrongpass")
        self.assertIsNone(bad_auth)
        
        # Test prompt persistence
        prompt_id = save_user_prompt(
            user_id=user["id"],
            raw_prompt="Write a Python script to parse logs. JSON format only.",
            target_provider="claude-3-5-sonnet",
            task_type="coding",
            hc_prompt="HC prompt",
            lt_prompt="LT prompt",
            raw_tokens=35,
            optimized_tokens=15,
            fillers=["please"],
            redundancies=[]
        )
        self.assertGreater(prompt_id, 0)
        
        # Test analytics computed from DB
        analytics = get_user_analytics(user["id"])
        self.assertEqual(analytics["totalPrompts"], 1)
        self.assertEqual(analytics["platformDistribution"]["claude"]["count"], 1)
        self.assertGreater(analytics["totalTokensSaved"], 0)

    def test_10_regional_marathi_optimization(self):
        # Test regional prompt optimization (Marathi example)
        from backend.multilingual import detect_language
        from backend.tokenizers import count_tokens_openai

        marathi_prompt = "मला भारतीय राज्यघटनेच्या 'प्रस्तावाने'वर (Preamble) एक पीडीएफ (PDF) तयार करायची आहे . भारतीय राज्यघटनेतील मजकुरातून ५० ओळी घेऊन एक पीडीएफ तयार करा"
        lang = detect_language(marathi_prompt)
        self.assertIn(lang["code"], ["mr", "hi"])
        self.assertTrue(lang["isNonEnglish"])

        res = optimize_prompt_pipeline(marathi_prompt, "gpt-4o")
        self.assertIn("lowToken", res["variants"])
        self.assertIn("highContext", res["variants"])
        self.assertGreater(res["metrics"]["percentageSaved"], 40.0)
        self.assertIn("mr", res["analysis"]["localizedSuggestionsByLang"])

    def test_11_pdf_converter_and_chunking(self):
        # Test real PDF document creation and conversion to Markdown
        import pymupdf
        from backend.file_converter import process_uploaded_file

        # Generate a minimal PDF with sections using PyMuPDF
        doc = pymupdf.open()
        page = doc.new_page()
        page.insert_text((50, 72), "EXECUTIVE SUMMARY\n\nThis is a token-efficient compliance document.")
        page.insert_text((50, 150), "SECTION 1: SYSTEM ARCHITECTURE\n\nMicroservice mesh deployed on Kubernetes cluster.")
        pdf_bytes = doc.tobytes()
        doc.close()

        result = process_uploaded_file(pdf_bytes, "architecture_report.pdf")
        self.assertEqual(result["filename"], "architecture_report.pdf")
        self.assertEqual(result["targetFormat"], "markdown")
        self.assertEqual(result["formatExtension"], ".md")
        self.assertGreater(result["rawEstimatedTokens"], result["convertedTokens"])
        self.assertGreater(result["conversionSavingsPct"], 0)
        self.assertTrue(len(result["chunks"]) >= 1)
        self.assertIn("Executive Summary", result["fullContent"])

    def test_12_short_query_low_token_guarantee(self):
        # Test that short queries (e.g. 'what meant by DBMS') strictly reduce tokens in Low-Token mode
        test_queries = [
            "what meant by DBMS",
            "what is meant by DBMS",
            "what is DBMS",
            "tell me about DBMS",
            "what is python",
            "tell me about yourself , i want to know your information"
        ]
        for q in test_queries:
            for model in ["claude-3-5-sonnet", "gpt-4o"]:
                res = optimize_prompt_pipeline(q, model)
                orig = res["metrics"]["originalTokens"]
                lt = res["variants"]["lowToken"]["tokenCount"]
                self.assertLessEqual(lt, orig, f"Low-token ({lt}) must be <= raw ({orig}) for query '{q}' on {model}")
                self.assertGreaterEqual(res["metrics"]["percentageSaved"], 0.0)
                # Verify that 'Create what meant' is never generated
                self.assertNotIn("Create what", res["variants"]["lowToken"]["prompt"])


if __name__ == "__main__":
    unittest.main()

