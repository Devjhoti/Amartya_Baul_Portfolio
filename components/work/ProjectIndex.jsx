import MonoLabel from "@/components/ui/MonoLabel";

/**
 * The scannable index below the rig: all 11 in one table — the fast path for
 * people who scan rather than scroll, and the crawlable path for everyone
 * else. Set in the dark auditorium palette: it sits on the black floor with
 * the vortex turning behind it. PRD §5.4
 */
export default function ProjectIndex({ projects, filter = null, onClear }) {
  return (
    <div
      id="project-index"
      // the vortex turns behind this table — every glyph carries a tight dark
      // halo so legibility never depends on which frame the funnel is in
      // (tight, not wide: a soft 10px glow smudged the mono labels)
      className="scroll-mt-24 space-y-8 [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_0_6px_rgba(0,0,0,0.55)]"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <MonoLabel className="text-chalk-mute">
          PROJECT INDEX — {filter ? filter.toUpperCase() : "ALL 11"}
        </MonoLabel>
        {filter ? (
          <button
            type="button"
            onClick={onClear}
            className="link-draw font-mono text-mono uppercase tracking-mono text-chalk-mute transition-colors hover:text-chalk"
          >
            [ CLEAR FILTER ]
          </button>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-t border-rule-inv text-left">
          <thead>
            <tr className="border-b border-rule-inv">
              {["NO", "CLIENT", "SECTOR", "YEAR", "LINK"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="py-3 pr-6 font-mono text-mono font-normal uppercase tracking-mono text-chalk-mute"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={p.slug} className="border-b border-rule-inv">
                <td className="py-4 pr-6 font-mono text-mono uppercase tracking-mono text-chalk-mute">
                  {String(p.no ?? i + 1).padStart(2, "0")}
                </td>
                <td className="py-4 pr-6 font-medium text-chalk">{p.client}</td>
                <td className="py-4 pr-6 text-chalk-mute">{p.sector}</td>
                <td className="py-4 pr-6 font-mono text-mono uppercase tracking-mono text-chalk-mute">
                  {p.year}
                </td>
                <td className="py-4">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-draw font-mono text-mono uppercase tracking-mono text-chalk"
                  >
                    OPEN <span aria-hidden="true">↗</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
