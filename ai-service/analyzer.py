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
   