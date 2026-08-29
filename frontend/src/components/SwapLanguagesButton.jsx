// src/components/SwapLanguagesButton.jsx
// ----------------------------------------
// A button that swaps the source and target language codes (and optionally
// the source/translated text) in the parent component's state.
// Props:
//   onSwap {function} - Callback invoked when the button is clicked.
//                       The parent is responsible for swapping state.

import React from "react";

// TODO: Replace stub with a styled icon button (e.g. ⇄ or an SVG swap icon).
function SwapLanguagesButton({ onSwap }) {
  // TODO: Add rotation animation on click for a polished UX.
  return (
    <button id="swap-languages-btn" onClick={onSwap}>
      {/* TODO: Replace text with swap icon */}
      ⇄ Swap
    </button>
  );
}

export default SwapLanguagesButton;
