from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI(title="Nocap AI Service")
class TextRequest(BaseModel):
    text: str
@app.post("/analyze")
def analyze_text(request: TextRequest):
    return{
        "status": "received",
        "length": len(request.text)
    }