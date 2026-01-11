from fastapi import FastAPI
from pydantic import BaseModel

from analyzer.preprocess import clean_text, basic_signals
from analyzer.credibility import heuristic_score
from analyzer.analyzer import analyze_text

app = FastAPI(title="Nocap AI Service")

class TextRequest(BaseModel):
    text: str

@app.post("/analyze")
def analyze(request: TextRequest):
    text = clean_text(request.text)
    signals = basic_signals(text)
    score = heuristic_score(signals)

    return {
        "credibility_score": score,
        "signals": signals,
        "verdict": "likely_fake" if score < 0.4 else "uncertain"
    }
