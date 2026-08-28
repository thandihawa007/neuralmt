/**
 * mlServiceClient.js
 * ------------------
 * Axios wrapper that forwards translation requests to the Python ML service.
 * The base URL is read from the ML_SERVICE_URL environment variable so you
 * can point it at a remote host without changing code.
 */

const axios = require("axios");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Call the ML service's /translate endpoint.
 *
 * @param {string} text       - Text to translate.
 * @param {string} sourceLang - Source language code (e.g. "en").
 * @param {string} targetLang - Target language code (e.g. "hi").
 * @returns {Promise<string>} The translated text.
 */
const callTranslate = async (text, sourceLang, targetLang) => {
  const response = await axios.post(`${ML_SERVICE_URL}/translate`, {
    text,
    sourceLang,
    targetLang,
  });
  return response.data.translatedText;
};

module.exports = { callTranslate };
