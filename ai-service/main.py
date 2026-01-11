from fastapi import FastAPI
from pydantic import BaseModel
from analyzer import analyze_text
app = FastAPI(title="NoCap AI Service")
class TextRequest(BaseModel):
    text: str
@app.post("/analyze")
def analyze(request: TextRequest):
    return analyze_text(request.text)
