/**
 * PipelineSection.jsx
 * -------------------
 * Section 4 — "How it works"
 * Three-column bordered grid: 01/ENCODE · 02/ATTEND · 03/DECODE
 * Exact copy from NeuralMT_Master_Gravity_Prompt.md
 */

import React, { useEffect, useRef } from "react";

const STAGES = [
  {
    
    title: "Encoder",
    body:  "Reads the full source sentence and produces a sequence of hidden states — one per input token — instead of a single fixed vector.",
  },
  {
     
    title: "Attention",
    body:  "For each output word, the decoder weighs every encoder hidden state and pulls context from the most relevant source tokens.",
  },
  {
 
    title: "Decoder",
    body:  "Generates the target sentence token by token, conditioning each word on the attended context and everything decoded so far.",
  },
];

export default function PipelineSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.dataset.visible = "1"; obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="px-6 pb-28 max-w-7xl mx-auto"
    >
      <div className="divider mb-28" />

      {/* Section header */}
      <div className="mb-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent mb-4 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
          PIPELINE
        </p>
        <h2 className="font-display text-display-md font-semibold text-text-primary tracking-[-0.025em] mb-4">
          Three stages, one sentence at a time
        </h2>
        <p className="text-body-md text-text-secondary max-w-xl leading-relaxed">
          This is the actual sequence the model runs — not a marketing timeline. Each stage hands a specific representation to the next.
        </p>
      </div>

      {/* Three-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
        {STAGES.map((s, i) => (
          <div
            key={s.mono}
            className="bg-canvas p-8 flex flex-col gap-5"
            style={{
              opacity: 0,
              transform: "translateY(16px)",
              transition: `opacity 0.45s cubic-bezier(0.2,0,0,1) ${i * 80}ms, transform 0.45s cubic-bezier(0.2,0,0,1) ${i * 80}ms`,
            }}
            ref={(node) => {
              if (!node) return;
              const parent = node.closest("[data-visible]");
              const obs2 = new IntersectionObserver(([e]) => {
                if (e.isIntersecting) {
                  node.style.opacity = "1";
                  node.style.transform = "translateY(0)";
                  obs2.disconnect();
                }
              }, { threshold: 0.05 });
              obs2.observe(node);
            }}
          >
            <span className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
              {s.mono}
            </span>
            <h3 className="font-display text-[22px] font-semibold text-text-primary tracking-[-0.015em]">
              {s.title}
            </h3>
            <p className="text-body-sm text-text-secondary leading-relaxed">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
