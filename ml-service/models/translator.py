"""
models/translator.py
--------------------
Helsinki-NLP OPUS-MT pipeline cache.

- SUPPORTED_PAIRS is the single source of truth for what language pairs exist.
  Any pair NOT listed here returns a clean ValueError — no model is attempted.
- Each pipeline loads ONCE on first request and is kept in _pipelines forever.
  Console prints tell you whether a model is being downloaded or served from cache.
- Pre-warming en→hi at startup is wrapped in a try/except so a missing internet
  connection at boot does not crash the whole service.
"""

import time
from datetime import datetime, timezone

from transformers import pipeline as hf_pipeline

# ---------------------------------------------------------------------------
# Supported pairs — verified to exist on Hugging Face Hub.
# Key: "{source}-{target}", Value: full HuggingFace model identifier.
# ---------------------------------------------------------------------------
SUPPORTED_PAIRS: dict[str, str] = {
    "en-hi": "Helsinki-NLP/opus-mt-en-hi",
    "hi-en": "Helsinki-NLP/opus-mt-hi-en",
    "en-fr": "Helsinki-NLP/opus-mt-en-fr",
    "fr-en": "Helsinki-NLP/opus-mt-fr-en",
    "en-es": "Helsinki-NLP/opus-mt-en-es",
    "es-en": "Helsinki-NLP/opus-mt-es-en",
}

# ---------------------------------------------------------------------------
# In-memory cache: key → {"pipe": pipeline_obj, "loaded_at": iso_str}
# ---------------------------------------------------------------------------
_pipelines: dict[str, dict] = {}


def _now() -> str:
    return datetime.now(timezone.utc).strftime("%H:%M:%S UTC")


def _get_pipeline(source: str, target: str):
    """
    Return a cached Hugging Face pipeline for the given language pair.

    Raises
    ------
    ValueError  – if the pair is not in SUPPORTED_PAIRS.
    RuntimeError – if the model cannot be loaded from Hugging Face.
    """
    key = f"{source}-{target}"

    if key not in SUPPORTED_PAIRS:
        available = ", ".join(
            f"{k.split('-')[0]}→{k.split('-')[1]}" for k in SUPPORTED_PAIRS
        )
        raise ValueError(
            f"No model available for {source}→{target}. "
            f"Supported pairs: {available}"
        )

    if key in _pipelines:
        print(
            f"[translator] [{_now()}] Cache hit: {key} "
            f"(model loaded at {_pipelines[key]['loaded_at']})"
        )
        return _pipelines[key]["pipe"]

    # ── First-time load ──────────────────────────────────────────────────────
    model_name = SUPPORTED_PAIRS[key]
    print(f"[translator] [{_now()}] Loading model '{model_name}' — this may take a few minutes on first run …")

    t0 = time.perf_counter()
    try:
        pipe = hf_pipeline("translation", model=model_name)
    except Exception as exc:
        raise RuntimeError(
            f"Failed to load '{model_name}': {exc}. "
            "Check your internet connection and that the model exists on HuggingFace."
        ) from exc

    elapsed = time.perf_counter() - t0
    loaded_at = _now()
    _pipelines[key] = {"pipe": pipe, "loaded_at": loaded_at}
    print(f"[translator] [{loaded_at}] Model '{model_name}' ready in {elapsed:.1f}s")

    return pipe


# ---------------------------------------------------------------------------
# Pre-warm en→hi at import time so the first HTTP request is fast.
# Wrapped in try/except — a failed pre-warm is a warning, not a crash.
# ---------------------------------------------------------------------------
print(f"[translator] [{_now()}] Pre-warming en→hi model at startup …")
try:
    _get_pipeline("en", "hi")
    print(f"[translator] [{_now()}] Pre-warm complete.")
except Exception as _pre_warm_err:
    print(
        f"[translator] [{_now()}] WARNING: Pre-warm failed — {_pre_warm_err}\n"
        "  The service will still start. en→hi will load on first request."
    )


def translate(text: str, source: str = "en", target: str = "hi") -> str:
    """
    Translate *text* from *source* language to *target* language.

    Parameters
    ----------
    text   : The text string to translate (must be non-empty).
    source : OPUS-MT source code, e.g. "en", "hi", "fr", "es".
    target : OPUS-MT target code, e.g. "hi", "en", "fr", "es".

    Returns
    -------
    The translated string.

    Raises
    ------
    ValueError   – unsupported language pair.
    RuntimeError – model load failure.
    """
    pipe = _get_pipeline(source, target)
    result = pipe(text)
    return result[0]["translation_text"]
