/**
 * Button.jsx
 * ----------
 * Reusable button component implementing the design system's two variants:
 *   - "primary"  : white fill, black text — the highest-contrast action
 *   - "outline"  : 1px border, transparent bg, white text — secondary action
 *
 * Props:
 *   variant   {"primary" | "outline"}  default: "primary"
 *   size      {"sm" | "md" | "lg"}     default: "md"
 *   as        {string | component}     default: "button"  (set to "a" for links)
 *   className {string}                 extra Tailwind classes
 *   ...rest   — all native button / anchor props (onClick, href, disabled…)
 *
 * Usage:
 *   <Button>Translate</Button>
 *   <Button variant="outline">Learn more</Button>
 *   <Button as="a" href="/">Go home</Button>
 */

import React from "react";
import { clsx } from "clsx"; // lightweight conditional class helper

// ── Base classes shared by both variants ───────────────────────────────────
const BASE = [
  "inline-flex items-center justify-center gap-2",
  "font-medium font-sans",
  "rounded-sm",
  "border border-transparent",
  "transition-all duration-200 ease-precise",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
  "disabled:opacity-40 disabled:pointer-events-none",
  "select-none whitespace-nowrap",
];

// ── Variant-specific classes ───────────────────────────────────────────────
const VARIANTS = {
  primary: [
    "bg-text-primary text-canvas",
    "hover:opacity-85 active:opacity-70",
  ],
  outline: [
    "bg-transparent text-text-primary",
    "border-border",
    "hover:border-[#525252] hover:bg-white/[0.04] active:bg-white/[0.02]",
  ],
  ghost: [
    "bg-transparent text-text-secondary",
    "hover:text-text-primary hover:bg-white/[0.06] active:bg-white/[0.03]",
  ],
};

// ── Size-specific classes ──────────────────────────────────────────────────
const SIZES = {
  sm: "px-3 py-1.5 text-[13px] tracking-[0.01em]",
  md: "px-4 py-2   text-[14px] tracking-[0.01em]",
  lg: "px-5 py-2.5 text-[15px] tracking-[0.005em]",
};

function Button({
  variant = "primary",
  size = "md",
  as: Tag = "button",
  className,
  children,
  ...rest
}) {
  return (
    <Tag
      className={clsx(BASE, VARIANTS[variant], SIZES[size], className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Button;
