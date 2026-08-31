/**
 * services/mlServiceClient.js
 * ---------------------------
 * Axios wrapper that calls the FastAPI ML service's POST /translate endpoint.
 *
 * Environment variable:
 *   ML_SERVICE_URL   Base URL of the ML service (default: http://localhost:8000)
 *
 * Error taxonomy returned to the caller:
 *   err.mlStatus === 400  → unsupported language pair or bad input
 *   err.mlStatus === 503  → model failed to load (network / HF Hub issue)
 *   err.mlStatus === 500  → unexpected inference error
 *   err.code === "ML_UNREACHABLE"  → service not running (ECONNREFUSED)
 *   err.code === "ML_TIMEOUT"      → service too slow (first-time model load)
 */

"use strict";

const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// 15-second timeout: first-time model download from HuggingFace can be slow.
const mlClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

/**
 * POST /translate on the ML service.
 *
 * @param {string} text        Text to translate (already validated, ≤ 500 chars).
 * @param {string} sourceLang  Source language code (e.g. "en").
 * @param {string} targetLang  Target language code (e.g. "hi").
 * @returns {Promise<{ translatedText: string, modelUsed: string, latencyMs: number }>}
 * @throws {Error}  Enriched with .mlStatus or .code for the route to inspect.
 */
const callTranslate = async (text, sourceLang, targetLang) => {
  const preview = text.length > 80 ? text.slice(0, 80) + "…" : text;
  console.log(
    `[mlServiceClient] → POST ${ML_SERVICE_URL}/translate  ` +
    `{ sourceLang: "${sourceLang}", targetLang: "${targetLang}", text: "${preview}" }`
  );

  try {
    const response = await mlClient.post("/translate", {
      text,
      sourceLang,
      targetLang,
    });

    const { translatedText, modelUsed, latencyMs } = response.data;
    console.log(
      `[mlServiceClient] ← 200  model=${modelUsed}  latency=${latencyMs}ms  ` +
      `result="${translatedText.slice(0, 80)}${translatedText.length > 80 ? "…" : ""}"`
    );

    return { translatedText, modelUsed, latencyMs };

  } catch (err) {

    // ── Service not running ───────────────────────────────────────────────
    if (
      err.code === "ECONNREFUSED" ||
      err.code === "ECONNRESET"   ||
      err.code === "ENOTFOUND"
    ) {
      const msg = `ML service is unreachable at ${ML_SERVICE_URL}. Is it running?`;
      console.error("[mlServiceClient] Connection refused:", msg);
      const out = new Error(msg);
      out.code = "ML_UNREACHABLE";
      throw out;
    }

    // ── Request timed out ─────────────────────────────────────────────────
    if (err.code === "ECONNABORTED" || (err.message && err.message.includes("timeout"))) {
      const msg =
        `ML service timed out after 15s for ${sourceLang}→${targetLang}. ` +
        "If this is the first request, the model may still be downloading — try again in a moment.";
      console.error("[mlServiceClient] Timeout:", msg);
      const out = new Error(msg);
      out.code = "ML_TIMEOUT";
      throw out;
    }

    // ── ML service returned a non-2xx response ────────────────────────────
    if (err.response) {
      const status = err.response.status;
      // FastAPI wraps errors in { detail: "…" }
      const detail =
        err.response.data?.detail ||
        err.response.statusText     ||
        "Unknown error from ML service";

      console.error(`[mlServiceClient] ← ${status}  detail: ${detail}`);

      const out = new Error(detail);
      out.mlStatus = status;
      throw out;
    }

    // ── Anything else ─────────────────────────────────────────────────────
    console.error("[mlServiceClient] Unexpected error:", err.message);
    throw new Error(`Unexpected ML client error: ${err.message}`);
  }
};

module.exports = { callTranslate };
