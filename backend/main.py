from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import docx
import json
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from ai_engine import analyze_resume_with_gemini

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI Resume Screener Backend is successfully running!"}

def extract_text(file: UploadFile, content: bytes) -> str:
    text = ""
    if file.filename.endswith(".pdf"):
        doc = fitz.open(stream=content, filetype="pdf")
        for page in doc:
            text += page.get_text()
    elif file.filename.endswith(".docx"):
        from io import BytesIO
        doc = docx.Document(BytesIO(content))
        for para in doc.paragraphs:
            text += para.text + "\n"
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")
    return text

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    jobDescription: str = Form(...),
    additionalCriteria: str = Form(None)
):
    try:
        content = await file.read()
        resume_text = extract_text(file, content)
        
        # Call Gemini AI
        analysis_result = analyze_resume_with_gemini(resume_text, jobDescription, additionalCriteria)
        
        return json.loads(analysis_result)
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)