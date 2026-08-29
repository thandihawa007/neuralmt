// src/components/TextInputBox.jsx
// --------------------------------
// A controlled textarea where the user types (or pastes) source text.
// Props:
//   value       {string}   - Current input text (controlled).
//   onChange    {function} - Callback invoked with new text on every keystroke.
//   placeholder {string}   - Placeholder text shown when input is empty.
//   disabled    {boolean}  - When true, the textarea is non-interactive (e.g. during translation).

import React from "react";

// TODO: Replace stub with actual styled textarea.
function TextInputBox({ value, onChange, placeholder = "Enter text…", disabled = false }) {
  // TODO: Render a <textarea> element bound to value / onChange.
  // TODO: Add character counter and clear button as UX enhancements.
  return (
    <div id="text-input-box">
      {/* TODO: <textarea value={value} onChange={e => onChange(e.target.value)} … /> */}
      <p>[TextInputBox stub] value: {value}</p>
    </div>
  );
}

export default TextInputBox;
