import MonoLabel from "./MonoLabel";

/**
 * The spec-plate device: a full-width top rule with the mono index and label
 * sitting on it, meta right-aligned — the data plate riveted to the section.
 * Used identically on every section. PRD §3.5
 */
export default function SectionHeader({
  index,
  label,
  meta,
  tone = "light",
  headingAs = "p",
  className = "",
}) {
  const rule = tone === "dark" ? "border-rule-inv" : "border-rule";
  const mute = tone === "dark" ? "text-chalk-mute" : "text-ink-mute";
  // Safety yellow reads at ~1.2:1 on concrete — on light plates the index is
  // ink; signal indices belong to the dark plates. §8.6 over §3.3's allowance.
  const idx = tone === "dark" ? "text-signal" : "text-ink";

  return (
    <div
      data-plate-index={index}
      data-plate-label={label}
      className={`flex items-baseline justify-between gap-6 border-t ${rule} pt-4 ${className}`}
    >
      <MonoLabel as={headingAs}>
        <span className={idx}>[ {index} ]</span>
        <span className="ml-3">{label}</span>
      </MonoLabel>
      {meta ? <MonoLabel className={`text-right ${mute}`}>{meta}</MonoLabel> : null}
    </div>
  );
}
