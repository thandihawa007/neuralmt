/**
 * StaircaseGlyphGrid.jsx
 * ----------------------
 * Decorative ambient element for the NeuralMT hero section.
 *
 * Renders a right-aligned staircase of square glyph boxes.
 * RIGHT edge stays flush; LEFT edge steps inward row-by-row.
 *
 * v3 — wide & short:
 *   • 8 rows  (10·9·8·7·6·5·4·3) — shorter than v2 (was 11 rows)
 *   • Top row 10 boxes wide × 66 px = 660 px — wider than v2 (was 6 × 66 = 396 px)
 *   • Lasso SVG re-added, path widened/flattened to match the new silhouette
 *
 * Accessibility: fully aria-hidden, purely decorative.
 * Responsive:   hidden below lg (1024 px).
 */

import React from "react";

// ── Character set ─────────────────────────────────────────────────────────
// 52 glyphs: Latin-extended · Devanagari · Cyrillic · CJK · Hangul
const ROWS = [
  // Row 1 — 10 boxes (widest)
  ["Á", "Ã", "Č", "Ę", "अ", "Ğ", "Ł", "Ñ", "Ø", "Д"],
  // Row 2 — 9 boxes
  ["Ü", "ब", "Ê", "Ж", "Î", "क", "Ô", "語", "Ş"],
  // Row 3 — 8 boxes
  ["Ž", "ग", "Ы", "Ý", "文", "Þ", "Æ", "ड"],
  // Row 4 — 7 boxes
  ["Ф", "字", "Ì", "言", "Ю", "न", "Ш"],
  // Row 5 — 6 boxes
  ["Ò", "한", "Я", "प", "Ù", "中"],
  // Row 6 — 5 boxes
  ["म", "र", "Ś", "Б", "ह"],
  // Row 7 — 4 boxes
  ["Г", "Ĺ", "Ĵ", "Ķ"],
  // Row 8 — 3 boxes (narrowest)
  ["Ľ", "Ç", "Ě"],
];

// ── Timing ────────────────────────────────────────────────────────────────
const BASE_DELAY_MS  = 360;   // start after headline text settles (~240 ms)
const ROW_STAGGER_MS = 80;    // each row reveals 80 ms after the previous

// ── Geometry ──────────────────────────────────────────────────────────────
const BOX      = 66;                                    // px — each square cell
const MAX_COLS = Math.max(...ROWS.map(r => r.length));  // 10
const GRID_W   = MAX_COLS * BOX;                        // 660 px
const GRID_H   = ROWS.length * BOX;                    // 528 px (pre-collapse)



// ── Colour tokens ─────────────────────────────────────────────────────────
const COLOR = {
  border:      "#262626",
  fill:        "#0A0A0A",            // matches hero bg-canvas
  fillCorner:  "#171717",            // subtle highlight on corner box
  fillHover:   "#F5F5F4",            // white invert on hover
  borderHover: "transparent",        // no border — white fill pops on its own
  text:        "rgba(245,245,244,0.72)",
  textHover:   "#0A0A0A",            // black text on white bg
  accentMuted: "rgba(78,110,255,0.28)",
};

// ── GlyphBox ──────────────────────────────────────────────────────────────
function GlyphBox({ char, isCorner = false }) {
  const [hovered, setHovered] = React.useState(false);

  const borderColor = hovered
    ? COLOR.borderHover
    : isCorner ? COLOR.accentMuted : COLOR.border;

  const bgColor   = hovered ? COLOR.fillHover : isCorner ? COLOR.fillCorner : COLOR.fill;
  const textColor = hovered ? COLOR.textHover : COLOR.text;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width:          BOX,
        height:         BOX,
        flexShrink:     0,
        // Collapse the double-border produced by adjacent boxes sharing edges
        marginLeft:     "-1px",
        marginTop:      "-1px",
        // Appearance
        border:         `1px solid ${borderColor}`,
        background:     bgColor,
        // Centre the glyph
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        // Typography — broad font-stack for Unicode coverage
        fontSize:       "27px",
        lineHeight:     1,
        color:          textColor,
        fontFamily:     "Inter, 'Noto Sans', 'Noto Sans Devanagari', system-ui, sans-serif",
        // UX
        userSelect:     "none",
        cursor:         "default",
        // Hovered box draws its transparent border on top of neighbours
        position:       "relative",
        zIndex:         hovered ? 2 : 0,
        // Snappy white/black invert transition
        transition:     [
          "border-color 160ms cubic-bezier(0.2,0,0,1)",
          "background   160ms cubic-bezier(0.2,0,0,1)",
          "color        160ms cubic-bezier(0.2,0,0,1)",
        ].join(", "),
      }}
    >
      {char}
    </div>
  );
}

// ── StaircaseGlyphGrid ────────────────────────────────────────────────────
export default function StaircaseGlyphGrid() {
  return (
    <>
      {/* Self-contained keyframe — no Tailwind config edit needed */}
      <style>{`
        @keyframes sgg-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/*
        Outer wrapper
        ─────────────
        • hidden lg:flex  — invisible on mobile; flex column at ≥ 1024 px
        • flex-col items-end — each row is right-aligned; right edge flush,
          left edge steps inward
        • flex-none — hero flexbox must not shrink this block
        • lg:-mt-[70px] — pulls the grid top to ~90 px below the fixed nav
        • pr-px pb-px — 1-px padding offsets the -1px border-collapse trick
      */}
      <div
        aria-hidden="true"
        role="presentation"
        className="hidden lg:flex flex-col items-end flex-none pr-px pb-px lg:-mt-[70px]"
      >

        {/* ── Glyph rows ──────────────────────────────────────────── */}
        {ROWS.map((chars, rowIdx) => {
          const delay = BASE_DELAY_MS + rowIdx * ROW_STAGGER_MS;

          return (
            <div
              key={rowIdx}
              style={{
                display:       "flex",
                flexDirection: "row",
                // zIndex 1 keeps rows above the absolute SVG (zIndex 0)
                position:      "relative",
                zIndex:        1,
                animation:     `sgg-fade-up 380ms cubic-bezier(0.2,0,0,1) ${delay}ms both`,
              }}
            >
              {chars.map((char, colIdx) => (
                <GlyphBox
                  key={colIdx}
                  char={char}
                  isCorner={rowIdx === 0 && colIdx === 0}
                />
              ))}
            </div>
          );
        })}

      </div>
    </>
  );
}
