// src/api/translateApi.js
// -----------------------
// Axios wrapper that calls the Express backend's /api/translate endpoint.
// The base URL is read from the Vite env variable VITE_API_BASE_URL
// (default: http://localhost:5000) so it can be overridden per environment.

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Translate text via the Express backend.
 *
 * @param {string} text       - Text to translate.
 * @param {string} sourceLang - Source language code (e.g. "en").
 * @param {string} targetLang - Target language code (e.g. "hi").
 * @returns {Promise<{ translatedText: string }>}
 */
export const translateText = async (text, sourceLang = "en", targetLang = "hi") => {
  const response = await axios.post(`${API_BASE}/api/translate`, {
    text,
    sourceLang,
    targetLang,
  });
  return response.data; // { translatedText: "…" }
};
