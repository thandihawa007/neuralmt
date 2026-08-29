/**
 * TranslationHistory.js
 * ---------------------
 * Mongoose model for persisting translation requests.
 * Each document stores the original text, the translated result,
 * and the language pair used.
 */

const mongoose = require("mongoose");

const translationHistorySchema = new mongoose.Schema(
  {
    sourceText: {
      type: String,
      required: true,
      trim: true,
    },
    translatedText: {
      type: String,
      required: true,
    },
    sourceLang: {
      type: String,
      required: true,
      default: "en",
    },
    targetLang: {
      type: String,
      required: true,
      default: "hi",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("TranslationHistory", translationHistorySchema);
