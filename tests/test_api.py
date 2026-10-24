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


if __name__ == "__main__":
    unittest.main()

