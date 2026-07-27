/**
 * The utility voice of the site: Martian Mono, 11px, uppercase, tracked wide.
 * Used for labels, indices, metadata and nothing else. PRD §3.4
 */
export default function MonoLabel({ as: Tag = "p", className = "", children, ...rest }) {
  return (
    <Tag className={`font-mono text-mono uppercase tracking-mono ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
