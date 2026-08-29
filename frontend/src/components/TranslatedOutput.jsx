// src/components/TranslatedOutput.jsx
// -------------------------------------
// Displays the translated text returned by the backend.
// Props:
//   translatedText {string}  - The translation result to display.
//   isLoading      {boolean} - When true, show a loading/skeleton state.
//   error          {string}  - Error message to display if translation failed.

import React from "react";

// TODO: Replace stub with actual styled output panel.
function TranslatedOutput({ translatedText, isLoading = false, error = null }) {
  // TODO: Show a spinner or skeleton when isLoading is true.
  // TODO: Display error message when error is non-null.
  // TODO: Render translatedText in a styled read-only area with a copy button.
  return (
    <div id="translated-output">
      {isLoading && <p>[Loading…]</p>}
      {error && <p>[Error]: {error}</p>}
      {!isLoading && !error && <p>{translatedText || "Translation will appear here."}</p>}
    </div>
  );
}

export default TranslatedOutput;
