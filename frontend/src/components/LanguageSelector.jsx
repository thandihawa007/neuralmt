// src/components/LanguageSelector.jsx
// ------------------------------------
// Renders a dropdown (or similar control) that lets the user pick a language.
// Props:
//   label     {string}   - Accessible label for the selector (e.g. "Source" | "Target").
//   value     {string}   - Currently selected language code (e.g. "en").
//   onChange  {function} - Callback invoked with the new language code on change.
//   options   {Array<{ code: string, label: string }>} - Available languages.

import React from "react";

// TODO: Replace stub with actual dropdown UI.
function LanguageSelector({ label, value, onChange, options = [] }) {
  // TODO: Render a styled <select> or custom dropdown bound to value/onChange.
  return (
    <div id={`language-selector-${label?.toLowerCase()}`}>
      {/* TODO: Map options to <option> elements and wire onChange */}
      <span>{label}: {value}</span>
    </div>
  );
}

export default LanguageSelector;
