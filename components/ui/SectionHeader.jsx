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

  return (
    <div
      className={`flex items-baseline justify-between gap-6 border-t ${rule} pt-4 ${className}`}
    >
      <MonoLabel as={headingAs}>
        <span className="text-signal">[ {index} ]</span>
        <span className="ml-3">{label}</span>
      </MonoLabel>
      {meta ? <MonoLabel className={`text-right ${mute}`}>{meta}</MonoLabel> : null}
    </div>
  );
}
