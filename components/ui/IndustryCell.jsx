"use client";

/**
 * Client shell for an Industries cell: clicking filters the project index to
 * that sector and rides down to it. The chip inside arrives server-rendered
 * as children, so the procedural pattern data stays out of the client bundle.
 * PRD §5.8
 */
export default function IndustryCell({ sector, className = "", children }) {
  const onClick = () => {
    if (window.__filterIndex) {
      window.__filterIndex(sector);
    } else {
      document.getElementById("project-index")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Show ${sector} in the project index`}
      className={className}
    >
      {children}
    </button>
  );
}
