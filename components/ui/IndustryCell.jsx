"use client";

/**
 * Client shell for an Industries cell: clicking rides up to the auditorium —
 * the one place the work now shows (the filterable index it used to target
 * was replaced by the FAQ band on client direction). The chip inside arrives
 * server-rendered as children, so the procedural pattern data stays out of
 * the client bundle. PRD §5.8 (revised)
 */
export default function IndustryCell({ sector, className = "", children }) {
  const onClick = () => {
    const el = document.getElementById("work");
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`See the ${sector} build in the auditorium`}
      className={className}
    >
      {children}
    </button>
  );
}
