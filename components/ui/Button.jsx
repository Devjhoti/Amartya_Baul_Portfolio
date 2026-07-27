/**
 * Buttons are ink/chalk only — never signal-filled. Square corners; radius 999
 * exists solely for the `pill` variant used in the nav. Labels say what
 * happens. PRD §3.3 (accent discipline) · §4
 */

const STYLES = {
  solid: {
    light: "bg-ink text-chalk hover:bg-machine-3",
    dark: "bg-chalk text-ink hover:bg-concrete-2",
  },
  outline: {
    light: "border border-ink text-ink hover:bg-ink hover:text-chalk",
    dark: "border border-chalk text-chalk hover:bg-chalk hover:text-ink",
  },
};

export default function Button({
  href,
  type = "button",
  variant = "solid",
  tone = "light",
  pill = false,
  external = false,
  className = "",
  children,
}) {
  const classes = [
    "inline-flex items-center justify-center gap-3 font-body text-small font-medium transition-colors",
    pill ? "rounded-full px-6 py-2.5" : "px-8 py-4",
    STYLES[variant][tone],
    className,
  ].join(" ");

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
