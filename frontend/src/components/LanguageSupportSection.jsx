/**
 * LanguageSupportSection.jsx
 * --------------------------
 * Section 6 — "Language Support / Coverage"
 * Badge grid of EN→HI, EN→FR, EN→ES, HI→EN pill shapes.
 * Exact copy from NeuralMT_Master_Gravity_Prompt.md
 */

import React from "react";

const PAIRS = ["EN → HI", "EN → FR", "EN → ES", "HI → EN"];

export default function LanguageSupportSection() {
  return (
    <section id="coverage" className="px-6 pb-28 max-w-7xl mx-auto">
      <div className="divider mb-28" />

      {/* Section header */}
      <div className="mb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent mb-4 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          COVERAGE
        </p>
        <h2 className="font-display text-display-md font-semibold text-text-primary tracking-[-0.025em] mb-4">
          Built on Helsinki-NLP's OPUS-MT models
        </h2>
        <p className="text-body-md text-text-secondary max-w-2xl leading-relaxed">
          Each language pair is a separate pretrained model, loaded on demand — not one giant multilingual model doing everything at once.
        </p>
      </div>

      {/* Badge grid */}
      <div className="flex flex-wrap gap-3 mb-8">
        {PAIRS.map((pair) => (
          <span
            key={pair}
            className="font-mono text-[13px] tracking-[0.06em] text-text-secondary border border-border rounded-full px-5 py-2 hover:border-[#383838] hover:text-text-primary transition-colors duration-200"
          >
            {pair}
          </span>
        ))}
      </div>

      {/* Footnote */}
      <p className="text-body-sm text-text-muted leading-relaxed max-w-xl">
        Adding a new pair means pointing the inference service at a different OPUS-MT checkpoint — no retraining required.
      </p>
    </section>
  );
}
