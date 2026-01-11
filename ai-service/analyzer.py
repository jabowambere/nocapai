import re
from urllib.parse import urlparse
TRUSTED_DOMAIN_PATTERNS=(
    ".gov",
    ".gov.uk",
    ".edu",
    ".ac.uk",
    ".org",
    ".org.uk",
    ".int"
)
def extract_domains(text: str):
    urls = re.findall(r"https?://[^\s]+", text)
    domains=[]
    for url in urls:
        parsed=urlparse(url)
        if parsed.netloc:
            domains.append(parsed.netloc.lower())

    return domains
def check_lack_of_sources(text: str):
    domains=extract_domains(text)
    has_trusted_domain=any(
        domain.endswith(TRUSTED_DOMAIN_PATTERNS)
        for domain in domains
    )
    has_citation_language=bool(
        re.search(
            r"\b(according to|study by|research shows|data from|reported by)\b",
            text,
            re.IGNORECASE
        )
    )
    if not domains and not has_citation_language:
        return{
            "score": 0.4,
            "reason": "The text makes claims without sources, citations, or credible domain references."
        }
    if domains and not has_trusted_domain:
        return{
            "score": 0.2,
            "reason": "The text references sources, but none from trusted domains."
        }
    return{
        "score": 0.0,
        "reason": "The text includes credible sources or citations."
    }
EMOTIONAL_TRIGGERS=(
    "shocking",
    "terrifying",
    "you won't believe",
    "they don't want you to know",
    "act now",
    "before it's too late",
    "everyone knows",
    "the truth about",
    "what they don't tell you",
    "wake up",
    "exposed",
    "secret",
    "unbelievable"
)
def check_emotional_manipulation(text:str):
    text_lower=text.lower()
    trigger_hits=sum(
        1 for phrase in EMOTIONAL_TRIGGERS
        if phrase in text_lower
    )
    if trigger_hits>=3:
        return{
            "score": 0.4,
            "reason": "The text contains multiple emotional manipulation triggers."
        }
    if trigger_hits>0:
        return{
            "score":0.2,
            "reason":"The text contains some emotional manipulation triggers that may bias perception."
        }
    return{
        "score":0.0,
        "reason":"The text uses neutral or informational language."
    }
FACTUAL_CLAIM_TRIGGERS=(
    "always",
    "never",
    "100%",
    "guaranteed",
    "scientists prove",
    "experts confirm",
    "no doubt",
    "undeniable",
    "everyone agrees"
)
def check_potential_fact_contradition(text:str):
    text_lower=text_lower()
    hits=sum(
        1 for phrase in FACTUAL_CLAIM_TRIGGERS
        if phrase in text_lower
    )
    if hits>=2:
        return{
            "score":0.3,
            "reason":"The text makes multiple absolute factual claims that may require verification against established knowledge.",
            "needs_ai_verification": True
        }
    return{
        "score":0.0,
        "reason":"The text does not make absolute factual claims.",
        "needs_ai_verification": False
    }
def analyze_text(text: str):
    results=[]
    source_check=check_lack_of_sources(text)
    emotion_check=check_emotional_manipulation(text)
    fact_check=check_potential_fact_contradition(text)
    results.extend([source_check, emotion_check, fact_check])
    total_score=min(
        sum(item["score"]for item in results),
        1.0
    )
    needs_ai=any(
        item.get("needs_ai_verification", False)
        for item in results
    )
    return{
        "risk_score": round(total_score, 2),
        "signals": results,
        "needs_ai_verification": needs_ai
    }