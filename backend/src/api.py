from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from .transcribe import transcription_service


app = FastAPI(title="GigaAM API")

frontend_host = os.getenv("FRONTEND_HOST", "localhost")
frontend_port = os.getenv("VITE_PORT", "5173")

allow_origins = [
    f"http://localhost:{frontend_port}",
    f"http://127.0.0.1:{frontend_port}",
    f"http://{frontend_host}:{frontend_port}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.wav'):
        raise HTTPException(status_code=400, detail="Only .wav files are supported")

    try:
        content = await file.read()
        transcription = transcription_service.transcribe_file(content)
        return {"transcription": transcription}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")


@app.get("/health")
async def health():
    return {"status": "ok"}
