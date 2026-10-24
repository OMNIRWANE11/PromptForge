"""
Benchmark Pre-loaded Test Prompts and Sample Documents for PromptForge
Allows judges and testers to test every feature instantly with 1-click presets.
"""

BENCHMARK_PROMPTS = [
    {
        "id": "jwt-auth-coding",
        "title": "Python JWT Auth Middleware (Coding with Hard Constraints)",
        "category": "Coding & Security",
        "provider": "claude-3-5-sonnet",
        "prompt": "Hey there! Can you please help me write a production-grade Python function to parse JWT tokens and validate their cryptographic signature against an RS256 public key? Please make sure to handle token expiration, invalid signatures, and malformed headers. Output strictly in valid JSON format only, with keys 'valid', 'payload', and 'error'. Do not include markdown ticks, and do not use any external libraries—use the Python standard library only! Thanks in advance!"
    },
    {
        "id": "hindi-sales-table",
        "title": "Hindi Regional Sales Analysis (Indic Script Multiplier)",
        "category": "Indic Multilingual",
        "provider": "gemini-1.5-flash",
        "prompt": "कृपया मुझे पिछले तिमाही के बिक्री डेटा का एक सारांश प्रदान करें। डेटा को एक साफ सुथरी तालिका (Markdown table) के रूप में प्रदर्शित करें। केवल शीर्ष 5 उत्पाद और उनका राजस्व शामिल करें। कोई अतिरिक्त स्पष्टीकरण या बातचीत न लिखें।"
    },
    {
        "id": "marathi-api-debug",
        "title": "Marathi Regional API Debugging (Indic Script Multiplier)",
        "category": "Indic Multilingual",
        "provider": "claude-3-5-sonnet",
        "prompt": "मला पायथन आणि FastAPI मध्ये एक REST API एंडपॉइंट बनवायचा आहे जो PostgreSQL डेटाबेसशी कनेक्ट करतो. डेटाबेस कनेक्शन त्रुटी योग्यरित्या हाताळा. उत्तर फक्त JSON स्वरूपात द्या आणि बाह्य लायब्ररी वापरू नका."
    },
    {
        "id": "invoice-data-extraction",
        "title": "Financial Invoice Extraction (Data Extraction & Negative Rules)",
        "category": "Data Extraction",
        "provider": "gpt-4o",
        "prompt": "Could you please parse the following raw invoice text and extract the vendor name, invoice date, total due, and line items? Format output strictly as JSON. Do not include markdown codeblocks or backticks. No conversational preamble or postscript."
    },
    {
        "id": "architecture-tradeoffs",
        "title": "Distributed Systems Architecture (Analytical Reasoning)",
        "category": "Analytical",
        "provider": "claude-3-5-sonnet",
        "prompt": "I would really appreciate it if you could analyze the trade-offs between Apache Kafka and RabbitMQ for an event-driven payment processing system. Compare latency, message ordering guarantees, and throughput. Format the comparison as a Markdown table with exactly 3 columns: Feature, Kafka, RabbitMQ."
    }
]

SAMPLE_DOCUMENTS = {
    "financial_compliance_audit": {
        "filename": "Q3_Financial_Compliance_Audit.pdf",
        "type": "pdf",
        "markdown": """# Q3 Financial & Security Compliance Audit Report

## Section 1: Executive Summary & Overview
This audit examines enterprise token expenditures, cryptographic authentication controls, and SOC-2 Type II readiness across all microservice clusters. Over 720k tokens were consumed in un-curated prompt payloads during Q2. Immediate remediation is mandatory.

## Section 2: Core Risk Assessment Findings
Critical severity issue identified in tenant authorization middleware. API keys and Bearer tokens are logged in plaintext across intermediate proxies. Recommendation: implement zero-logging proxies and token hashing within 14 days.

## Section 3: Remediation Roadmap Table
| Priority | Vulnerability | Target System | SLA | Remediation Owner |
|---|---|---|---|---|
| P0 | Plaintext JWT Auth Logging | Gateway Proxy | 48h | Infra Lead |
| P1 | Unbounded Context Token Ingestion | Document Ingestion Worker | 7d | AI Platform Eng |
| P2 | Missing Negative Prompt Constraints | Customer Chatbot | 14d | Product Eng |

## Section 4: Historical Committee Minutes (2024-2025)
Archive of preliminary steering committee discussions regarding vendor contract negotiations, legacy database deprecation schedules, and regional travel expense policy revisions across all branch offices.

## Section 5: Appendix 4.0: Legal Disclaimers & Statutory Disclosures
This confidential report is delivered under strict non-disclosure terms. Any unauthorized dissemination, redistribution, or reproduction in whole or in part without prior written consent from General Counsel is strictly prohibited under international statutory statutes. All rights reserved.""",
        "json_sample": {
            "audit_id": "AUDIT-2026-Q3",
            "organization": "PromptForge Global",
            "findings": [
                {"severity": "CRITICAL", "item": "Plaintext JWT logging", "sla_hours": 48},
                {"severity": "HIGH", "item": "Unbounded token context", "sla_hours": 168}
            ],
            "signoff": {"approved": True, "date": "2026-10-24"}
        }
    }
}

