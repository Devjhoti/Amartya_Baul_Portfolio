/**
 * Dependency-free text splitter. Words become overflow-hidden mask spans,
 * characters become transformable spans inside them. The parent carries the
 * full text in aria-label and every span is aria-hidden, so screen readers get
 * one clean string while GSAP gets per-char targets. Real text nodes remain in
 * the DOM at all times. PRD §8.6
 *
 * Server-safe (no hooks) — RevealText adds the animation on top.
 */
export default function SplitText({ text, as: Tag = "span", className = "", ref, ...rest }) {
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} aria-label={text} {...rest}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`}>
          <span aria-hidden="true" className="st-word">
            {[...word].map((ch, ci) => (
              <span key={ci} className="st-char">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
