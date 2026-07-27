export default function Monogram({ className = "", framed = true }) {
  return (
    <svg viewBox="0 0 128 128" className={className} role="img" aria-label="Amartya Baul">
      {framed && (
        <>
          {/* frame */}
          <rect x="2" y="2" width="124" height="124"
                fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" />
          {/* registration mark — always safety yellow, in both grounds */}
          <rect x="108" y="108" width="10" height="10" fill="#E5C11F" />
        </>
      )}

      <g stroke="currentColor" strokeWidth="14"
         strokeLinecap="butt" strokeLinejoin="miter" fill="none">
        {/* shared stem */}
        <path d="M56 20 L56 108" />
        {/* A — diagonal and crossbar */}
        <path d="M56 20 L20 108" />
        <path d="M31 84 L56 84" />
        {/* B — upper bowl */}
        <path d="M56 20 L92 20 L92 57 L56 57" />
        {/* B — lower bowl */}
        <path d="M56 57 L104 57 L104 108 L56 108" />
      </g>
    </svg>
  );
}
