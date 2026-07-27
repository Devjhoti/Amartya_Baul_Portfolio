/**
 * Every design token from globals.css mapped to a utility, so components write
 * `bg-machine text-chalk border-rule` and never a raw hex. AGENTS.md §Colour ·
 * PRD §3.3–§3.5
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "clamp(20px, 4.5vw, 80px)", // page margin, PRD §3.5
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1560px", // container max-width, PRD §3.5
      },
    },
    extend: {
      colors: {
        concrete: "var(--concrete)",
        "concrete-2": "var(--concrete-2)",
        machine: "var(--machine)",
        "machine-2": "var(--machine-2)",
        "machine-3": "var(--machine-3)",
        ink: "var(--ink)",
        "ink-mute": "var(--ink-mute)",
        chalk: "var(--chalk)",
        "chalk-mute": "var(--chalk-mute)",
        signal: "var(--signal)",
        "signal-dim": "var(--signal-dim)",
        rule: "var(--rule)",
        "rule-inv": "var(--rule-inv)",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        body: ["var(--font-satoshi)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-martian)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        hero: "var(--fs-hero)",
        display: "var(--fs-display)",
        h2: "var(--fs-h2)",
        h3: "var(--fs-h3)",
        body: "var(--fs-body)",
        small: "var(--fs-small)",
        mono: "var(--fs-mono)",
      },
      letterSpacing: {
        display: "-0.03em", // display headings
        mono: "0.14em", // uppercase mono labels
      },
      lineHeight: {
        display: "0.88",
      },
      spacing: {
        "page-margin": "var(--page-margin)",
        "section-gap": "var(--section-gap)",
      },
      maxWidth: {
        container: "1560px",
      },
    },
  },
  plugins: [],
};
