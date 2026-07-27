/**
 * Dependency-free text splitter. Words become overflow-hidden mask spans,
 * characters become transformable spans inside them. Screen readers get one
 * clean copy of the string (visually hidden), while the churn of split spans
 * is aria-hidden — real text stays in the DOM either way. aria-label is not
 * used: it is prohibited on generic spans. PRD §8.6
 *
 * Server-safe (no hooks) — RevealText adds the animation on top.
 */
export default function SplitText({ text, as: Tag = "span", className = "", ref, ...rest }) {
  const words = text.split(" ");
  return (
    <Tag ref={ref} className={className} {...rest}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={`${word}-${wi}`}>
            <span className="st-word">
              {[...word].map((ch, ci) => (
                <span key={ci} className="st-char">
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
