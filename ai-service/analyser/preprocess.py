import re
def clean_text(text: str) -> str:
    text=text.strip()
    text=re.sub(r'\s+', ' ', text)
    return text
def basic_signals(text: str)->dict:
    return{
        "length": len(text),
        "all_caps_ratio": sum(1 for c in text if c.isupper()) / max(len(text), 1),
        "exclamation_count": text.count("!")
    }