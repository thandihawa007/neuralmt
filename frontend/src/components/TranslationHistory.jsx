// src/components/TranslationHistory.jsx
// ----------------------------------------
// Renders a list of past translations fetched from the backend (MongoDB).
// Props:
//   history {Array<{
//     _id:            string,
//     sourceText:     string,
//     translatedText: string,
//     sourceLang:     string,
//     targetLang:     string,
//     createdAt:      string,   // ISO date string
//   }>}              - Array of history items to display.
//   onSelect {function} - Callback invoked with a history item when the user
//                         clicks it (e.g. to reload it into the input box).

import React from "react";

// TODO: Replace stub with a styled history panel (cards, list, or table).
function TranslationHistory({ history = [], onSelect }) {
  // TODO: API wiring — fetch history from GET /api/translate/history (to be implemented).
  // TODO: Render each item as a clickable card that calls onSelect(item).
  // TODO: Add clear / delete individual history entry actions.
  return (
    <div id="translation-history">
      <h2>Translation History</h2>
      {history.length === 0 ? (
        <p>No history yet.</p>
      ) : (
        <ul>
          {history.map((item) => (
            <li key={item._id} onClick={() => onSelect && onSelect(item)}>
              {/* TODO: Style each list item as a card */}
              <strong>{item.sourceLang} → {item.targetLang}:</strong>{" "}
              {item.sourceText} → {item.translatedText}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TranslationHistory;
