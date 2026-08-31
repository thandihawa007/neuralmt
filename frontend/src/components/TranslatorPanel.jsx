/**
 * TranslatorPanel.jsx
 * -------------------
 * Live interactive translator demo panel.
 *
 * Verified language pairs (must match SUPPORTED_PAIRS in translator.py):
 *   en→hi, hi→en, en→fr, fr→en, en→es, es→en
 *
 * UI states: idle · loading (shimmer + pulsing dot) · success · error
 * Debounce: 450ms. Does not call API on empty or whitespace-only input.
 * Enforces 500-char limit client-side (char counter) and shows error if exceeded.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

const MAX_CHARS = 500;
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ── Supported language list (must map 1-to-1 with SUPPORTED_PAIRS in translator.py) ──
const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "Hindi",   short: "HI" },
  { code: "fr", label: "French",  short: "FR" },
  { code: "es", label: "Spanish", short: "ES" },
];

// ── Shimmer loading placeholder ───────────────────────────────────────────
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

// ── Copy-to-clipboard button ──────────────────────────────────────────────
function CopyButton({ text, disabled }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text || disabled) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!text || disabled}
      title="Copy translation"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono tracking-wider transition-all duration-150 select-none ${
        copied
          ? "bg-[#4E6EFF]/15 text-accent border border-[#4E6EFF]/50 shadow-[0_0_8px_rgba(78,110,255,0.25)]"
          : text && !disabled
          ? "bg-[#0f0f0f] border border-border text-text-muted hover:text-text-primary hover:bg-[#171717] hover:border-[#383838] cursor-pointer"
          : "opacity-40 cursor-not-allowed text-text-muted border border-border/50"
      }`}
      aria-label={copied ? "Translation copied" : "Copy translation"}
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Copied</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

// ── Language dropdown selector ────────────────────────────────────────────
function LanguageDropdown({ label, value, onChange, options, disabledCode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function outside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, []);

  const current = options.find((o) => o.code === value) || options[0];

  return (
    <div className="relative inline-block font-mono text-[11px] tracking-[0.14em]" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border bg-[#0e0e0e] hover:bg-[#171717] hover:border-[#383838] focus:bg-[#171717] focus:border-accent focus:outline-none text-text-primary transition-all duration-150 cursor-pointer select-none"
      >
        <span className="text-text-muted font-medium">{label} ·</span>
        <span className="font-semibold text-text-primary">{current.short}</span>
        <svg
          className={`w-3 h-3 text-text-muted transition-transform duration-200 ${open ? "rotate-180 text-text-primary" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 mt-1.5 w-36 rounded-md bg-[#121212] border border-[#2a2a2a] shadow-2xl py-1 z-30 font-mono text-[12px] normal-case"
        >
          {options.map((opt) => {
            const isSelected = opt.code === value;
            const isDisabled = opt.code === disabledCode;
            return (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={isDisabled}
                onClick={() => { onChange(opt.code); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition-colors duration-150 ${
                  isSelected
                    ? "bg-[#1f1f1f] text-accent font-semibold"
                    : isDisabled
                    ? "opacity-35 cursor-not-allowed text-text-muted"
                    : "text-text-secondary hover:text-text-primary hover:bg-[#171717] cursor-pointer"
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-[10px] text-text-muted uppercase font-mono tracking-wider">{opt.short}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Pulsing "Translating…" indicator ─────────────────────────────────────
function TranslatingIndicator() {
  return (
    <div className="flex items-center gap-2 text-accent font-mono text-[11px] tracking-wider animate-fade-in select-none">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
      </span>
      <span>Translating…</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function TranslatorPanel() {
  const [input, setInput]               = useState("");
  const [sourceLang, setSourceLang]     = useState("en");
  const [targetLang, setTargetLang]     = useState("hi");
  const [status, setStatus]             = useState("idle"); // idle | loading | success | error | overlimit
  const [errorMsg, setErrorMsg]         = useState("");
  const [result, setResult]             = useState({ text: "", latencyMs: 0, model: "" });
  const [isInputFocused, setIsInputFocused] = useState(false);
  const debounceRef                     = useRef(null);

  // ── Core translate function ──────────────────────────────────────────────
  const translate = useCallback(async (text, src, tgt) => {
    if (!text || !text.trim()) {
      setStatus("idle");
      return;
    }

    // Client-side 500-char guard (belt + suspenders — backend also enforces this)
    if (text.length > MAX_CHARS) {
      setStatus("overlimit");
      return;
    }

    const payload = { text: text.trim(), sourceLang: src, targetLang: tgt };
    console.log("[TranslatorPanel] → POST /api/translate", payload);

    setStatus("loading");
    const t0 = Date.now();

    try {
      const res = await fetch(`${API_BASE}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000), // 15s browser-side safety timeout
      });

      const data = await res.json();
      console.log("[TranslatorPanel] ← Response", res.status, data);

      if (!res.ok) {
        // Surface specific error messages from the API (e.g. unsupported pair, over-limit)
        setErrorMsg(data.error || `Server error ${res.status}`);
        setStatus("error");
        return;
      }

      setResult({
        text:      data.translatedText ?? "",
        latencyMs: data.latencyMs     ?? (Date.now() - t0),
        model:     data.modelUsed     ?? data.model ?? `Helsinki-NLP/opus-mt-${src}-${tgt}`,
      });
      setStatus("success");
    } catch (err) {
      console.error("[TranslatorPanel] Fetch error:", err);
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        setErrorMsg("Request timed out. The ML service may be slow or unreachable.");
      } else {
        setErrorMsg("Translation service is unavailable. Check that the backend and ML service are running.");
      }
      setStatus("error");
    }
  }, []);

  // ── Debounced trigger on input change ─────────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setStatus("idle");
      setResult({ text: "", latencyMs: 0, model: "" });
      return;
    }

    if (input.length > MAX_CHARS) {
      setStatus("overlimit");
      return;
    }

    debounceRef.current = setTimeout(() => {
      translate(input, sourceLang, targetLang);
    }, 450);

    return () => clearTimeout(debounceRef.current);
  }, [input, sourceLang, targetLang, translate]);

  // ── Language change handlers ──────────────────────────────────────────
  const handleSourceChange = (newSrc) => {
    setSourceLang(newSrc);
    if (input.trim() && input.length <= MAX_CHARS) translate(input, newSrc, targetLang);
  };

  const handleTargetChange = (newTgt) => {
    setTargetLang(newTgt);
    if (input.trim() && input.length <= MAX_CHARS) translate(input, sourceLang, newTgt);
  };

  // ── Swap button ───────────────────────────────────────────────────────
  const handleSwap = () => {
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);

    if (status === "success" && result.text) {
      // Swap text too: put translation into input and re-translate
      setInput(result.text);
      translate(result.text, prevTgt, prevSrc);
    } else if (input.trim() && input.length <= MAX_CHARS) {
      translate(input, prevTgt, prevSrc);
    }
  };

  const charOverLimit = input.length > MAX_CHARS;
  const charCount     = input.length;

  return (
    <section id="translate" className="px-4 sm:px-6 pb-24 max-w-7xl mx-auto">

      {/* ── Instructional clarity line ── */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          LIVE DEMO
        </p>
        <p className="text-[13px] text-text-muted font-mono">
          Try it yourself — type a sentence below and see it translated live.
        </p>
      </div>

      {/* ── Main card ── */}
      <div className="border border-border rounded-lg bg-surface/40 overflow-hidden shadow-lg">

        {/* ── Desktop Header ── */}
        <div className="hidden md:flex items-center border-b border-border px-6 py-3 gap-4 bg-[#0e0e0e]/80">
          <LanguageDropdown
            label="SOURCE"
            value={sourceLang}
            onChange={handleSourceChange}
            options={LANGUAGES}
            disabledCode={targetLang}
          />

          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <button
              type="button"
              onClick={handleSwap}
              title="Swap languages"
              aria-label="Swap source and target languages"
              className="group w-7 h-7 rounded-full border border-border bg-[#121212] flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:shadow-[0_0_12px_rgba(78,110,255,0.3)] transition-all duration-300 cursor-pointer active:scale-95"
            >
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 ease-precise group-hover:rotate-180"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex-1 h-px bg-border" />
          </div>

          <LanguageDropdown
            label="TARGET"
            value={targetLang}
            onChange={handleTargetChange}
            options={LANGUAGES}
            disabledCode={sourceLang}
          />

          {/* Desktop right-header actions */}
          <div className="flex items-center gap-3 pl-3 border-l border-border min-w-[140px] justify-end">
            {status === "loading" && <TranslatingIndicator />}
            <CopyButton text={result.text} disabled={status !== "success"} />
          </div>
        </div>

        {/* ── Split panels (stacked on mobile, side-by-side on md+) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border min-h-[220px]">

          {/* ── Left: Source Input ── */}
          <div
            className={`relative flex flex-col transition-all duration-200 ${
              isInputFocused
                ? "shadow-[inset_0_0_0_1px_#4E6EFF,0_0_20px_rgba(78,110,255,0.18)] bg-[#0b0e1b]/40 z-10"
                : "bg-transparent"
            }`}
          >
            {/* Mobile-only source header */}
            <div className="md:hidden flex items-center justify-between border-b border-border px-4 py-2.5 bg-[#0e0e0e]/80">
              <LanguageDropdown
                label="SOURCE"
                value={sourceLang}
                onChange={handleSourceChange}
                options={LANGUAGES}
                disabledCode={targetLang}
              />
              <span className={`font-mono text-[11px] ${charOverLimit ? "text-red-400" : "text-text-muted"}`}>
                {charCount} / {MAX_CHARS}
              </span>
            </div>

            <div className="flex-1 flex flex-col p-4 md:p-6 gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Type a sentence to translate live…"
                maxLength={MAX_CHARS + 50} // allow slight over-limit to show error, not silently truncate
                rows={5}
                className="flex-1 resize-none bg-transparent text-text-primary text-[15px] md:text-[16px] leading-relaxed placeholder:text-text-muted/70 focus:outline-none font-sans caret-[#4E6EFF]"
                aria-label="Source text input"
              />

              {/* Over-limit inline error */}
              {charOverLimit && (
                <p className="text-[11px] text-red-400 font-mono animate-fade-in">
                  Input exceeds {MAX_CHARS} characters — please shorten it.
                </p>
              )}

              {/* Desktop char counter + status */}
              <div className="hidden md:flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-[11px] font-mono text-text-muted">
                  {input.trim().length > 0 ? "Live translating" : "Ready for input"}
                </span>
                <p className={`text-[11px] font-mono ${charOverLimit ? "text-red-400" : "text-text-muted"}`}>
                  {charCount} / {MAX_CHARS}
                </p>
              </div>
            </div>
          </div>

          {/* ── Mobile swap divider ── */}
          <div className="md:hidden flex items-center px-4 py-1.5 bg-[#0a0a0a] border-y border-border">
            <div className="flex-1 h-px bg-border" />
            <button
              type="button"
              onClick={handleSwap}
              title="Swap languages"
              aria-label="Swap source and target languages"
              className="group mx-3 w-8 h-8 rounded-full border border-border bg-[#141414] flex items-center justify-center text-text-muted hover:text-accent hover:border-accent hover:shadow-[0_0_12px_rgba(78,110,255,0.3)] transition-all duration-300 cursor-pointer active:scale-95"
            >
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300 ease-precise group-hover:rotate-180"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path d="M2 5h12M10 2l4 3-4 3M14 11H2M6 8l-4 3 4 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* ── Right: Output ── */}
          <div className="flex flex-col relative bg-[#090909]/60">

            {/* Mobile-only target header */}
            <div className="md:hidden flex items-center justify-between border-b border-border px-4 py-2.5 bg-[#0e0e0e]/80">
              <LanguageDropdown
                label="TARGET"
                value={targetLang}
                onChange={handleTargetChange}
                options={LANGUAGES}
                disabledCode={sourceLang}
              />
              <div className="flex items-center gap-2">
                {status === "loading" && <TranslatingIndicator />}
                <CopyButton text={result.text} disabled={status !== "success"} />
              </div>
            </div>

            <div className="flex-1 flex flex-col p-4 md:p-6 gap-4">

              {/* Idle */}
              {(status === "idle") && (
                <p className="text-text-muted text-[15px] md:text-[16px] leading-relaxed flex-1 font-sans">
                  Your translation will appear here.
                </p>
              )}

              {/* Over-limit */}
              {status === "overlimit" && (
                <p className="text-text-muted text-[15px] leading-relaxed flex-1 font-sans">
                  Your translation will appear here.
                </p>
              )}

              {/* Loading */}
              {status === "loading" && (
                <div className="flex-1 flex flex-col gap-3">
                  <div className="hidden md:block">
                    <TranslatingIndicator />
                  </div>
                  <Shimmer lines={4} />
                </div>
              )}

              {/* Success with fade-in */}
              {status === "success" && (
                <div className="flex-1 flex flex-col justify-between gap-4 animate-fade-in">
                  <p
                    key={result.text}
                    className="text-text-primary text-[15px] md:text-[16px] leading-relaxed flex-1 font-sans"
                  >
                    {result.text}
                  </p>
                  <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
                    <p className="font-mono text-[11px] text-text-muted">
                      {result.latencyMs}ms · {result.model}
                    </p>
                    <div className="hidden md:block">
                      <CopyButton text={result.text} />
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {status === "error" && (
                <div className="flex-1 flex flex-col gap-3">
                  <p className="text-text-muted text-[15px] leading-relaxed">
                    Your translation will appear here.
                  </p>
                  <div className="rounded-md border border-red-900/40 bg-red-950/20 px-4 py-2.5">
                    <p className="text-[12px] text-red-400 font-mono leading-relaxed">
                      {errorMsg || "Translation service is unavailable. Check that the backend (port 5000) and ML service (port 8000) are running."}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
