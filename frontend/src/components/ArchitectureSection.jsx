/**
 * ArchitectureSection.jsx
 * -----------------------
 * Section 5 — "Architecture"
 * Three grid-line cards (no individual card borders, only inter-cell dividers).
 * Exact copy from NeuralMT_Master_Gravity_Prompt.md
 */

import React from "react";

const CARDS = [
  {
    tag:   "React",
    title: "Frontend",
    body:  "Language selectors, debounced input, and the live translation stream — talks only to the Express gateway.",
  },
  {
    tag:   "Express",
    title: "API Gateway",
    body:  "Validates requests, optionally logs translation history to MongoDB, forwards inference calls to the ML service.",
  },
  {
    tag:   "FastAPI",
    title: "Inference Service",
    body:  "Loads the Hugging Face model once at startup and serves translation requests over a lightweight internal API.",
  },
];

export default function ArchitectureSection() {
  return (
    <section id="architecture" className="px-6 pb-28 max-w-7xl mx-auto">
      <div className="divider mb-28" />

      {/* Section header */}
      <div className="mb-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent mb-4 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          ARCHITECTURE
        </p>
        <h2 className="font-display text-display-md font-semibold text-text-primary tracking-[-0.025em] mb-4">
          Three services, one request
        </h2>
        <p className="text-body-md text-text-secondary max-w-xl leading-relaxed">
          A polyglot setup — each service owns exactly one responsibility.
        </p>
      </div>

      {/* Card grid — grid lines only, no outer borders on individual cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
        {CARDS.map((c, i) => (
          <div
            key={c.tag}
            className="bg-canvas p-8 flex flex-col gap-5 group hover:bg-[#0e0e0e] transition-colors duration-200"
            style={{
              opacity: 0,
              transform: "translateY(14px)",
              transition: `opacity 0.45s cubic-bezier(0.2,0,0,1) ${i * 80}ms, transform 0.45s cubic-bezier(0.2,0,0,1) ${i * 80}ms, background 200ms`,
            }}
            ref={(node) => {
              if (!node) return;
              const obs = new IntersectionObserver(([e]) => {
                if (e.isIntersecting) {
                  node.style.opacity = "1";
                  node.style.transform = "translateY(0)";
                  obs.disconnect();
                }
              }, { threshold: 0.05 });
              obs.observe(node);
            }}
          >
            <span className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
              {c.tag}
            </span>
            <h3 className="font-display text-[22px] font-semibold text-text-primary tracking-[-0.015em]">
              {c.title}
            </h3>
            <p className="text-body-sm text-text-secondary leading-relaxed">
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
