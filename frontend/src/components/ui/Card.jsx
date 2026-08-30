/**
 * Card.jsx
 * --------
 * A borderline-only card (no fill) following the minimal design language.
 * Uses a 1px border + generous internal padding. No shadow, no background.
 *
 * Props:
 *   eyebrow   {string}              Optional small-caps label above heading.
 *   heading   {string | ReactNode}  Card title.
 *   body      {string | ReactNode}  Description / body text.
 *   footer    {ReactNode}           Optional slot for actions or meta.
 *   accent    {boolean}             When true, adds a 1px blue top accent line.
 *   className {string}              Extra Tailwind classes.
 *   children  {ReactNode}           If provided, renders instead of heading/body/footer slots.
 *
 * Usage:
 *   <Card eyebrow="Feature" heading="Fast inference" body="Sub-200ms latency." />
 *   <Card accent heading="Custom content"><p>Anything here</p></Card>
 */

import React from "react";
import { clsx } from "clsx";

function Card({
  eyebrow,
  heading,
  body,
  footer,
  accent = false,
  className,
  children,
  ...rest
}) {
  return (
    <div
      className={clsx(
        // Structure
        "relative flex flex-col gap-3",
        "border border-border rounded-md",
        "p-6",
        // No background fill — transparent on canvas
        "bg-transparent",
        // Subtle hover lift
        "transition-all duration-300 ease-precise",
        "hover:border-[#383838]",
        // Accent top line
        accent && "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-accent before:rounded-t-md",
        className
      )}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <>
          {eyebrow && (
            <p className="eyebrow">{eyebrow}</p>
          )}
          {heading && (
            <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-text-primary">
              {heading}
            </h3>
          )}
          {body && (
            <p className="text-body-sm text-text-secondary leading-relaxed">
              {body}
            </p>
          )}
          {footer && (
            <div className="mt-auto pt-4 border-t border-border">
              {footer}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Card;
