/**
 * NavBar.jsx
 * ----------
 * Sticky top navigation with glass blur effect.
 * Separates logo (left) from nav links + CTA (right).
 * Detects scroll to switch from transparent → glass background.
 *
 * Props:
 *   logo      {string | ReactNode}  Wordmark / logo content.
 *   links     {Array<{ label, href, active? }>}  Navigation links.
 *   ctaLabel  {string}   Text for the outlined CTA button.
 *   ctaHref   {string}   Href for the CTA button.
 *   onCtaClick {function} Alternative to ctaHref for SPA navigation.
 *
 * Usage:
 *   const links = [
 *     { label: "Features", href: "#features" },
 *     { label: "How it works", href: "#how" },
 *     { label: "API", href: "#api" },
 *   ];
 *   <NavBar logo="NeuralMT" links={links} ctaLabel="Get started" ctaHref="#translate" />
 */

import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import Button from "./Button";

function NavBar({
  logo = "NeuralMT",
  links = [],
  ctaLabel = "Get started",
  ctaHref = "#",
  onCtaClick,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply glass effect after the user scrolls even 1px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="site-nav"
      className={clsx(
        "fixed top-0 inset-x-0 z-50",
        "transition-all duration-300 ease-precise",
        scrolled ? "nav-glass" : "bg-transparent border-b border-transparent"
      )}
    >
      <nav
        className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* ── Logo / Wordmark ─────────────────────────────────────── */}
        <a
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-text-primary hover:opacity-80 transition-opacity duration-200"
          aria-label="Go to homepage"
        >
          {/* Minimal accent dot */}
          <span
            className="w-5 h-5 rounded-sm bg-accent flex-shrink-0"
            aria-hidden="true"
          />
          {logo}
        </a>

        {/* ── Desktop nav capsule ──────────────────────────────────── */}
        {/*
          Single pill-shaped container, content-hugging, centered between
          logo and CTA. Active item fills its own inner pill (white bg,
          black text). Hover on inactive items brightens text only.
        */}
        <ul
          role="list"
          className="hidden md:flex items-center gap-0 bg-[#1A1A1A] rounded-full p-1.5"
          aria-label="Primary navigation"
        >
          {links.map((link, i) => {
            const isActive = link.active ?? i === 0;
            // "Architecture" gets mono treatment (technical label)
            const isMono = link.label === "Architecture";

            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "inline-flex items-center px-[18px] py-[9px] rounded-full select-none",
                    "text-[13.5px] font-medium tracking-[-0.005em]",
                    "transition-colors duration-150 ease-in-out",
                    isMono ? "font-mono" : "font-sans",
                    isActive
                      ? "bg-[#F5F5F4] text-[#0A0A0A]"
                      : "text-[#8A8A8A] hover:text-[#F5F5F4]"
                  )}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>


        {/* ── CTA + mobile hamburger ──────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            as={onCtaClick ? "button" : "a"}
            href={!onCtaClick ? ctaHref : undefined}
            onClick={onCtaClick}
            className="hidden md:inline-flex"
          >
            {ctaLabel}
          </Button>

          {/* Mobile hamburger */}
          <button
            id="nav-mobile-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[5px] group"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={clsx(
                "w-5 h-px bg-text-primary transition-transform duration-300 origin-center",
                menuOpen && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={clsx(
                "w-5 h-px bg-text-primary transition-opacity duration-200",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={clsx(
                "w-5 h-px bg-text-primary transition-transform duration-300 origin-center",
                menuOpen && "-translate-y-[7px] -rotate-45"
              )}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown ─────────────────────────────────────────── */}
      <div
        className={clsx(
          "md:hidden overflow-hidden transition-all duration-300 ease-precise nav-glass",
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!menuOpen}
      >
        <ul className="px-6 pt-3 pb-5 flex flex-col gap-1" role="list">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="block px-2 py-2 text-[14px] text-text-secondary hover:text-text-primary transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <Button
              variant="outline"
              size="sm"
              as={onCtaClick ? "button" : "a"}
              href={!onCtaClick ? ctaHref : undefined}
              onClick={() => { setMenuOpen(false); onCtaClick?.(); }}
              className="w-full"
            >
              {ctaLabel}
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default NavBar;
