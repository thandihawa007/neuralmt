/**
 * translate.js  (routes)
 * ----------------------
 * POST /api/translate
 *
 * Validates the incoming request, calls the ML service via mlServiceClient,
 * optionally persists the result to MongoDB, and returns the translation.
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { callTranslate } = require("../services/mlServiceClient");
const TranslationHistory = require("../models/TranslationHistory");

/**
 * POST /api/translate
 * Body: { text: string, sourceLang?: string, targetLang?: string }
 */
router.post("/", async (req, res) => {
  const { text, sourceLang = "en", targetLang = "hi" } = req.body;

  // --- Input validation ---
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return res.status(400).json({ error: "Field 'text' is required and must be a non-empty string." });
  }

  if (typeof sourceLang !== "string" || typeof targetLang !== "string") {
    return res.status(400).json({ error: "sourceLang and targetLang must be strings." });
  }

  try {
    // --- Forward to ML service ---
    const translatedText = await callTranslate(text.trim(), sourceLang, targetLang);

    // --- Persist to MongoDB (optional — only when DB is connected) ---
    if (mongoose.connection.readyState === 1) {
      try {
        await TranslationHistory.create({
          sourceText: text.trim(),
          translatedText,
          sourceLang,
          targetLang,
        });
      } catch (dbErr) {
        // Non-fatal: log but don't block the response
        console.warn("[translate] Failed to save history:", dbErr.message);
      }
    }

    return res.status(200).json({ translatedText });
  } catch (err) {
    console.error("[translate] Error calling ML service:", err.message);
    return res.status(502).json({
      error: "Failed to reach the ML service. Make sure it is running on ML_SERVICE_URL.",
    });
  }
});

module.exports = router;
