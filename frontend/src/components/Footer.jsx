/**
 * Footer.jsx
 * ----------
 * Section 9 — minimal footer per MD spec:
 *   Left:  "NeuralMT — built for placements, not production"
 *   Right: GitHub | README | Architecture
 *   Thin top border, generous padding.
 */

import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        {/* Left — tagline */}
        <p className="font-mono text-[12px] tracking-[0.04em] text-text-muted">
          NeuralMT — built for placements, not production
        </p>

        {/* Right — links */}
        <nav className="flex items-center gap-6" aria-label="Footer links">
          {["GitHub", "README", "Architecture"].map((label) => (
            <a
              key={label}
              href="#"
              className="font-mono text-[12px] tracking-[0.04em] text-text-muted hover:text-text-secondary transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </nav>

      </div>
    </footer>
  );
}
