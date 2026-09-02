"""
test_pairs.py
-------------
Integration test: verifies every language pair declared in SUPPORTED_PAIRS
can actually produce a non-empty translation.

Run AFTER starting the ML service:
    python test_pairs.py

Requires: the ml-service venv to be active.
"""

import sys
import time
from models.translator import SUPPORTED_PAIRS, translate

# One sample sentence per source language
SAMPLE = {
    "en": "Hello, how are you today?",
    "hi": "नमस्ते, आज आप कैसे हैं?",
    "fr": "Bonjour, comment allez-vous aujourd'hui?",
    "es": "Hola, ¿cómo estás hoy?",
}

passed = []
failed = []

print("=" * 60)
print("NeuralMT — Language pair verification")
print("=" * 60)

for pair_key, model_name in SUPPORTED_PAIRS.items():
    src, tgt = pair_key.split("-")
    text = SAMPLE.get(src, "Hello world")
    print(f"\n[{src}→{tgt}]  model={model_name}")
    print(f"  Input:  {text!r}")
    t0 = time.time()
    try:
        result = translate(text, source=src, target=tgt)
        elapsed = time.time() - t0
        if not result or not result.strip():
            raise ValueError("Empty translation returned")
        print(f"  Output: {result!r}  ({elapsed:.2f}s)")
        passed.append(f"{src}→{tgt}")
    except Exception as exc:
        elapsed = time.time() - t0
        print(f"  FAILED: {exc}  ({elapsed:.2f}s)")
        failed.append(f"{src}→{tgt}")

print("\n" + "=" * 60)
print(f"PASSED: {len(passed)}  |  FAILED: {len(failed)}")
if passed:
    print("  ✓ " + ", ".join(passed))
if failed:
    print("  ✗ " + ", ".join(failed))
print("=" * 60)

# Exit 1 so CI can catch failures
if failed:
    sys.exit(1)
