"""
main.py
-------
FastAPI ML microservice for Neural Machine Translation.

Start with:
    uvicorn main:app --reload --port 8000

Endpoints:
    GET  /health           → { status: "ok" }
    GET  /supported-pairs  → list of available language pair + model
    POST /translate        → { translatedText, modelUsed, latencyMs }
"""

import time

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

from models.translator import translate, SUPPORTED_PAIRS

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="NeuralMT — ML Service",
    description="Helsinki-NLP OPUS-MT inference service.",
    version="1.0.0",
)

# CORS: allow the frontend (5173) and the Express gateway (5000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------
class TranslateRequest(BaseModel):
    text:       str = Field(..., min_length=1, max_length=500,
                            description="Text to translate (1–500 chars)")
    sourceLang: str = Field(default="en",
                            description="Source language code, e.g. 'en'")
    targetLang: str = Field(default="hi",
                            description="Target language code, e.g. 'hi'")


class TranslateResponse(BaseModel):
    translatedText: str
    modelUsed:      str
    latencyMs:      int


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    """Health check — returns 200 {"status":"ok"} when the service is up."""
    return {"status": "ok"}


@app.get("/supported-pairs")
async def get_supported_pairs():
    """Return every language pair that has a loaded model."""
    return {
        "pairs": [
            {
                "source": key.split("-")[0],
                "target": key.split("-")[1],
                "model":  model,
            }
            for key, model in SUPPORTED_PAIRS.items()
        ]
    }


@app.post("/translate", response_model=TranslateResponse)
async def translate_text(payload: TranslateRequest):
    """
    Translate text from sourceLang to targetLang.

    Returns 400 when:
      - The language pair has no corresponding Helsinki-NLP model.
      - Pydantic validation fails (text empty, over 500 chars).

    Returns 500 when the Hugging Face pipeline raises an unexpected error.
    """
    pair_key = f"{payload.sourceLang}-{payload.targetLang}"

    # Explicit 400 before calling the pipeline — clear user-facing message
    if pair_key not in SUPPORTED_PAIRS:
        available = ", ".join(
            f"{k.split('-')[0]}→{k.split('-')[1]}" for k in SUPPORTED_PAIRS
        )
        raise HTTPException(
            status_code=400,
            detail=(
                f"Translation for {payload.sourceLang}→{payload.targetLang} "
                f"is not supported yet. Available pairs: {available}"
            ),
        )

    model_name = SUPPORTED_PAIRS[pair_key]

    t_start = time.perf_counter()
    try:
        translated = translate(
            text=payload.text,
            source=payload.sourceLang,
            target=payload.targetLang,
        )
    except ValueError as exc:
        # Belt-and-suspenders: unsupported pair raised inside translator
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        # Model load failure (network issue, model removed from HF Hub, etc.)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Inference error: {str(exc)}"
        ) from exc

    latency_ms = int((time.perf_counter() - t_start) * 1000)

    return TranslateResponse(
        translatedText=translated,
        modelUsed=model_name,
        latencyMs=latency_ms,
    )


# ---------------------------------------------------------------------------
# Standalone entry-point (python main.py)
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
