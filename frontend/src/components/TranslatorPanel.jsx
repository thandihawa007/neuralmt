/**
 * TranslatorPanel.jsx
 * -------------------
 * Live translator demo panel — bordered card, two-panel split.
 * UI states: idle · loading (shimmer) · success · error
 * Debounce: 450ms. Does not call API on empty input.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

// ── shimmer helper ────────────────────────────────────────────────────────
function Shimmer({ lines = 3 }) {
  return (
    <div className="space-y-3 animate-pulse" aria-busy="true" aria-label="Translating…">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-[#1e1e1e]"
          style={{ width: i === lines - 1 ? "55%" : "100%" }}
        />
      ))}
    </div>
  );
}

// ── copy-to-clipboard button ──────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };
  return (
    <button
      onClick={handle}
      title="Copy translation"
      className="ml-auto flex items-center gap-1.5 text-[12px] font-mono text-text-muted hover:text-text-secondary transition-colors duration-150 select-none"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function TranslatorPanel() {
  const [input, setInput]         = useState("");
  const [status, setStatus]       = useState("idle"); // idle | loading | success | error
  const [result, setResult]       = useState({ text: "", latencyMs: 0, model: "" });
  const debounceRef               = useRef(null);

  // Translate via the Express gateway → ML service
  const translate = useCallback(async (text) => {
    if (!text.trim()) { setStatus("idle"); return; }
    setStatus("loading");
    const t0 = Date.now();
    try {
      const res = await fetch("/api/translate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text, source: "en", target: "hi" }),
      });
      if (!res.ok) throw new Error("non-2xx");
      const data = await res.json();
      setResult({
        text:      data.translation ?? "",
        latencyMs: Date.now() - t0,
        model:     data.model ?? "Helsinki-NLP/opus-mt-en-hi",
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, []);

  // Debounce input → translate
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!input.trim()) { setStatus("idle"); return; }
    debounceRef.current = setTimeout(() => translate(input), 450);
    return () => clearTimeout(debounceRef.current);
  }, [input, translate]);

  return (
    <section id="translate" className="px-6 pb-24 max-w-7xl mx-auto">
      {/* Section label */}
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent mb-6 flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
        LIVE DEMO
      </p>

      {/* Main card */}
      <div className="border border-border rounded-lg overflow-hidden">

        {/* Header row */}
        <div className="flex items-center border-b border-border px-6 py-3 gap-4">
          {/* Source tag */}
          <span className="font-mono text-[11px] tracking-[0.14em] text-text-muted uppercase">
            SOURCE · EN
          </span>

          {/* Flow divider + swap */}
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <button
              title="Swap languages"
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text-secondary hover:border-[#383838] transition-colors duration-150"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Target tag */}
          <span className="font-mono text-[11px] tracking-[0.14em] text-text-muted uppercase">
            TARGET · HI
          </span>
        </div>

        {/* Two-panel split */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[220px]">

          {/* Left — input */}
          <div className="flex flex-col p-6 gap-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a sentence to translate…"
              maxLength={500}
              rows={5}
              className="flex-1 resize-none bg-transparent text-text-primary text-[15px] leading-relaxed placeholder:text-text-muted focus:outline-none font-sans"
              aria-label="Source text"
            />
            <p className="text-[11px] font-mono text-text-muted self-end">
              {input.length} / 500
            </p>
          </div>

          {/* Right — output */}
          <div className="flex flex-col p-6 gap-4">

            {status === "idle" && (
              <p className="text-text-muted text-[15px] leading-relaxed flex-1">
                Your translation will appear here.
              </p>
            )}

            {status === "loading" && (
              <div className="flex-1">
                <Shimmer lines={4} />
              </div>
            )}

            {status === "success" && (
              <>
                <p className="text-text-primary text-[15px] leading-relaxed flex-1">
                  {result.text}
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-3">
                  <p className="font-mono text-[11px] text-text-muted">
                    Translated in {result.latencyMs}ms · {result.model}
                  </p>
                  <CopyButton text={result.text} />
                </div>
              </>
            )}

            {status === "error" && (
              <div className="flex-1 flex flex-col gap-3">
                <p className="text-text-muted text-[15px] leading-relaxed">
                  Your translation will appear here.
                </p>
                <div className="rounded-md border border-red-900/40 bg-red-950/20 px-4 py-2.5">
                  <p className="text-[12px] text-red-400 font-mono leading-relaxed">
                    Translation service is unavailable. Check that the ML service is running on port 8000.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
