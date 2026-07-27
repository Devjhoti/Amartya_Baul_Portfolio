// HeroFallback — the static atmosphere shown instead of the Three.js hero on
// mobile, low-power devices, save-data connections and prefers-reduced-motion.
// Procedural SVG: ~1.5KB, no image request, no decode cost, sharp at any DPR.
// PRD §2.7 · §5.2 · §5.12

export default function HeroFallback({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* wide, slow undulation in the enamel surface */}
        <filter id="haWarp" x="-10%" y="-10%" width="120%" height="120%"
                colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.0016 0.0034"
                        numOctaves="4" seed="17" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="260"
                             xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="26" />
        </filter>

        {/* fine film grain, the same primitive used for the page-wide overlay */}
        <filter id="haGrain" x="0" y="0" width="100%" height="100%"
                colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="4" />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        <linearGradient id="haSheen" x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor="#242C27" />
          <stop offset="0.55" stopColor="#1C221E" />
          <stop offset="1" stopColor="#171C19" />
        </linearGradient>
      </defs>

      {/* base enamel */}
      <rect width="1600" height="900" fill="#1C221E" />

      {/* barely-there surface variation, lit from upper left */}
      <g filter="url(#haWarp)" opacity="0.5">
        <rect width="1600" height="900" fill="url(#haSheen)" />
        <ellipse cx="430" cy="250" rx="620" ry="380" fill="#2B342F" opacity="0.55" />
        <ellipse cx="1240" cy="700" rx="560" ry="340" fill="#161B18" opacity="0.5" />
      </g>

      {/* grain */}
      <rect width="1600" height="900" filter="url(#haGrain)" opacity="0.055" />
    </svg>
  );
}
