import { getProjects, getProfile } from "@/lib/content";

/**
 * TEMPORARY — Phase 0 token proof sheet. A test instrument, not a design:
 * every colour token as a labelled swatch, every type size as a specimen,
 * all 11 projects as plain text through the content layer. Deleted and
 * replaced by the real home page in Phase 1. PRD §10 Phase 0
 */

const COLORS = [
  { token: "concrete", cls: "bg-concrete", value: "#D5D7D0" },
  { token: "concrete-2", cls: "bg-concrete-2", value: "#C6C9C1" },
  { token: "machine", cls: "bg-machine", value: "#1C221E" },
  { token: "machine-2", cls: "bg-machine-2", value: "#262E29" },
  { token: "machine-3", cls: "bg-machine-3", value: "#313A34" },
  { token: "ink", cls: "bg-ink", value: "#141815" },
  { token: "ink-mute", cls: "bg-ink-mute", value: "#666E68" },
  { token: "chalk", cls: "bg-chalk", value: "#E8EAE5" },
  { token: "chalk-mute", cls: "bg-chalk-mute", value: "#8B948C" },
  { token: "signal", cls: "bg-signal", value: "#E5C11F" },
  { token: "signal-dim", cls: "bg-signal-dim", value: "#9C8615" },
  { token: "rule", cls: "bg-rule", value: "rgba(20,24,21,0.14)" },
  { token: "rule-inv", cls: "bg-rule-inv", value: "rgba(232,234,229,0.14)" },
];

const TYPE = [
  { token: "fs-hero", cls: "text-hero font-display tracking-display leading-display", value: "clamp(3.25rem, 11.5vw, 12rem)" },
  { token: "fs-display", cls: "text-display font-display tracking-display leading-display", value: "clamp(2.5rem, 6vw, 5.5rem)" },
  { token: "fs-h2", cls: "text-h2 font-display tracking-display leading-display", value: "clamp(1.75rem, 3.2vw, 3rem)" },
  { token: "fs-h3", cls: "text-h3 font-display tracking-display leading-display", value: "clamp(1.25rem, 1.8vw, 1.6rem)" },
  { token: "fs-body", cls: "text-body font-body", value: "clamp(1rem, 1.05vw, 1.125rem)" },
  { token: "fs-small", cls: "text-small font-body", value: "0.875rem" },
  { token: "fs-mono", cls: "text-mono font-mono uppercase tracking-mono", value: "0.6875rem" },
];

function MonoTag({ children }) {
  return (
    <p className="font-mono text-mono uppercase tracking-mono text-ink-mute">{children}</p>
  );
}

export default async function ProofSheet() {
  const projects = await getProjects();
  const profile = await getProfile();

  return (
    <main className="space-y-16 p-8">
      <header className="space-y-2 border-b border-rule pb-6">
        <MonoTag>PHASE 0 — TOKEN PROOF SHEET · TEMPORARY · DELETED IN PHASE 1</MonoTag>
        <h1 className="text-h2">{profile.seo.title}</h1>
      </header>

      <section className="space-y-4">
        <MonoTag>01 · COLOUR TOKENS</MonoTag>
        <ul className="flex flex-wrap gap-6">
          {COLORS.map((c) => (
            <li key={c.token} className="space-y-1">
              <div className={`h-20 w-32 border border-rule ${c.cls}`} />
              <p className="font-mono text-mono uppercase tracking-mono">{c.token}</p>
              <p className="text-small text-ink-mute">{c.value}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3 bg-machine p-8 text-chalk">
        <p className="font-mono text-mono uppercase tracking-mono text-signal">
          02 · DARK GROUND — SIGNAL ON MACHINE
        </p>
        <p>Primary text: chalk on machine.</p>
        <p className="text-chalk-mute">Secondary text: chalk-mute on machine.</p>
        <hr className="border-rule-inv" />
        <p className="text-small">Hairline above uses rule-inv.</p>
      </section>

      <section className="space-y-8">
        <MonoTag>03 · TYPE SCALE — ARCHIVO / SATOSHI / MARTIAN MONO</MonoTag>
        {TYPE.map((t) => (
          <div key={t.token} className="space-y-1 border-b border-rule pb-6">
            <p className="font-mono text-mono uppercase tracking-mono text-ink-mute">
              {t.token} · {t.value}
            </p>
            <p className={t.cls}>Machine room, lit well.</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <MonoTag>04 · PROJECTS — VIA getProjects()</MonoTag>
        <ol className="space-y-1">
          {projects.map((p, i) => (
            <li key={p.slug}>
              {String(i + 1).padStart(2, "0")} · {p.client} — {p.sector} — {p.year} —{" "}
              {p.role} — {p.type === "internal" ? "INTERNAL" : "CLIENT"} · {p.context} —{" "}
              {p.url}
            </li>
          ))}
        </ol>
        <p className="text-small text-ink-mute">
          {projects.length} projects loaded through /lib/content.js.
        </p>
      </section>
    </main>
  );
}
