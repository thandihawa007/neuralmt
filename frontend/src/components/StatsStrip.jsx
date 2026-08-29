/**
 * StatsStrip.jsx
 * --------------
 * Section 7 — thin 4-column stat strip.
 * All values are template placeholders — replace with real measured data.
 * Exact copy from NeuralMT_Master_Gravity_Prompt.md
 */

import React from "react";

const STATS = [
  { value: "{avgResponseTime}", unit: "ms",  label: "Avg. response time" },
  { value: "{modelSize}",       unit: "MB",  label: "Model size" },
  { value: "{languagePairsCount}", unit: "",  label: "Language pairs live" },
  { value: "{requestsPerSec}", unit: "",     label: "Requests/sec (local)" },
];

export default function StatsStrip() {
  return (
    <section className="px-6 pb-28 max-w-7xl mx-auto">
      <div className="divider mb-0" />

      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-b border-border">
        {STATS.map((s) => (
          <div key={s.label} className="px-8 py-10 flex flex-col gap-2">
            <p className="font-mono text-[28px] font-medium text-text-primary tracking-[-0.02em] leading-none">
              {s.value}
              {s.unit && (
                <span className="text-[16px] font-normal text-text-muted ml-1">
                  {s.unit}
                </span>
              )}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
