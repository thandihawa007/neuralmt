/**
 * Hero.jsx
 * --------
 * Hero section for NeuralMT:
 * - Headline with Space Grotesk display text and pixel-art "borders." in Press Start 2P
 * - Eyebrow with accent blue dot
 * - Subheadline and CTA buttons
 * - StaircaseGlyphGrid ambient element on the right
 */

import React from "react";
import StaircaseGlyphGrid from "./StaircaseGlyphGrid";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Faint dot-grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(#fff 0 1px, transparent 1px 80px), repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 80px)",
        }}
      />

      {/* Hero row: text left · staircase right */}
      <div className="relative flex items-start justify-between gap-10 lg:gap-14">
        {/* Left — copy */}
        <div className="flex-1 min-w-0">


          {/* Headline — Space Grotesk for "Language without", Press Start 2P for "borders." */}
          <h1
            className="hero-title font-display font-semibold text-text-primary tracking-[-0.04em] opacity-0 animate-fade-up"
            style={{ animationDelay: "80ms", animationFillMode: "forwards" }}
          >
            Language without
            <br />
            <span className="pixel-word">borders.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-body-lg text-text-secondary max-w-[500px] leading-relaxed mb-10 opacity-0 animate-fade-up"
            style={{ animationDelay: "160ms", animationFillMode: "forwards" }}
          >
            Open-source, self-hosted translation powered by Helsinki-NLP models.
            No API keys. No rate limits. Your data stays local.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-wrap items-center gap-5 opacity-0 animate-fade-up"
            style={{ animationDelay: "240ms", animationFillMode: "forwards" }}
          >
            {/* Primary — solid white bg, black text */}
            <a
              href="#translate"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#F5F5F4] text-[#0A0A0A] text-[14px] font-semibold tracking-[-0.01em] hover:bg-white transition-colors duration-150 select-none"
            >
              Start translating
            </a>

            {/* Secondary — bold text link, no background */}
            <a
              href="#how-it-works"
              className="text-[14px] font-semibold text-text-secondary hover:text-text-primary tracking-[-0.01em] transition-colors duration-150 select-none"
            >
              See how it works →
            </a>
          </div>
        </div>

        {/* Right — staircase decoration (hidden on mobile) */}
        <StaircaseGlyphGrid />
      </div>

      <div className="divider mt-24" />
    </section>
  );
}
