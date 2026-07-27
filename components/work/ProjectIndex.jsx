import MonoLabel from "@/components/ui/MonoLabel";

/**
 * The scannable index below the rig: all 11 in one table — the fast path for
 * people who scan rather than scroll, and the crawlable path for everyone
 * else. PRD §5.4
 */
export default function ProjectIndex({ projects }) {
  return (
    <div className="space-y-8">
      <MonoLabel className="text-ink-mute">PROJECT INDEX — ALL 11</MonoLabel>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-t border-rule text-left">
          <thead>
            <tr className="border-b border-rule">
              {["NO", "CLIENT", "SECTOR", "YEAR", "LINK"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="py-3 pr-6 font-mono text-mono font-normal uppercase tracking-mono text-ink-mute"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={p.slug} className="border-b border-rule">
                <td className="py-4 pr-6 font-mono text-mono uppercase tracking-mono text-signal-dim">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="py-4 pr-6 font-medium">{p.client}</td>
                <td className="py-4 pr-6 text-ink-mute">{p.sector}</td>
                <td className="py-4 pr-6 font-mono text-mono uppercase tracking-mono text-ink-mute">
                  {p.year}
                </td>
                <td className="py-4">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-mono uppercase tracking-mono underline decoration-1 underline-offset-4 transition-colors hover:decoration-signal"
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
