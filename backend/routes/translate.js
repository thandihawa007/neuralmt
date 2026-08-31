/**
 * routes/translate.js
 * -------------------
 * POST /api/translate
 *
 * Validates the request, calls the ML service, optionally persists to MongoDB,
 * and returns the translation to the frontend.
 *
 * Request body (JSON):
 *   { text: string, sourceLang?: string, targetLang?: string }
 *
 * Success response (200):
 *   { translatedText: string, modelUsed: string, latencyMs: number }
 *
 * Error responses:
 *   400  – validation failure OR unsupported language pair (from ML service)
 *   502  – ML service unreachable
 *   504  – ML service timed out
 *   500  – unexpected internal error
 */

"use strict";

const express  = require("express");
const router   = express.Router();
const mongoose = require("mongoose");

const { callTranslate }    = require("../services/mlServiceClient");
const TranslationHistory   = require("../models/TranslationHistory");

const MAX_CHARS = 500;

router.post("/", async (req, res) => {
  // Accept both { sourceLang, targetLang } and { source, target } from the frontend
  const {
    text,
    sourceLang,
    source,
    targetLang,
    target,
  } = req.body || {};

  const src     = (sourceLang || source || "en").trim().toLowerCase();
  const tgt     = (targetLang || target || "hi").trim().toLowerCase();
  const rawText = text;

  // ── Input validation ───────────────────────────────────────────────────────
  if (rawText === undefined || rawText === null) {
    return res.status(400).json({ error: "Field 'text' is required." });
  }

  if (typeof rawText !== "string") {
    return res.status(400).json({ error: "Field 'text' must be a string." });
  }

  if (rawText.trim().length === 0) {
    return res.status(400).json({ error: "Field 'text' must not be empty or whitespace-only." });
  }

  if (rawText.length > MAX_CHARS) {
    return res.status(400).json({
      error:
        `Text exceeds the ${MAX_CHARS}-character limit ` +
        `(received ${rawText.length} chars). Please shorten your input.`,
    });
  }

  if (!src || !tgt) {
    return res.status(400).json({ error: "sourceLang and targetLang are required." });
  }

  const trimmed  = rawText.trim();
  const expected = `Helsinki-NLP/opus-mt-${src}-${tgt}`;
  console.log(`[translate] ${src}→${tgt}  expectedModel=${expected}  chars=${trimmed.length}`);

  // ── Call ML service ────────────────────────────────────────────────────────
  try {
    const { translatedText, modelUsed, latencyMs } = await callTranslate(trimmed, src, tgt);

    // ── Persist to MongoDB (optional) ─────────────────────────────────────
    if (mongoose.connection.readyState === 1) {
      TranslationHistory.create({
        sourceText: trimmed,
        translatedText,
        sourceLang: src,
        targetLang: tgt,
      }).catch((dbErr) => {
        console.warn("[translate] MongoDB save failed (non-fatal):", dbErr.message);
      });
    }

    return res.status(200).json({ translatedText, modelUsed, latencyMs });

  } catch (err) {

    // ML service returned 400 (unsupported pair, bad input)
    if (err.mlStatus === 400) {
      return res.status(400).json({ error: err.message });
    }

    // ML service returned 503 (model load failure)
    if (err.mlStatus === 503) {
      return res.status(503).json({
        error: `Model load error: ${err.message}`,
      });
    }

    // Network: service not running
    if (err.code === "ML_UNREACHABLE") {
      return res.status(502).json({ error: err.message });
    }

    // Network: service too slow / still loading the model
    if (err.code === "ML_TIMEOUT") {
      return res.status(504).json({ error: err.message });
    }

    // Anything else
    console.error("[translate] Unexpected error:", err.message);
    return res.status(500).json({
      error: "An unexpected error occurred. Check server logs for details.",
    });
  }
});

module.exports = router;
