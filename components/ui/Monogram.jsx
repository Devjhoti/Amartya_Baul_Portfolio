/**
 * The AB monogram. Revised on client direction from the PRD §3.7.1 original:
 * the A's diagonal is now a filled, flat-footed polygon (same silhouette, but
 * the apex notch and baseline wedge left by separate butt-capped strokes are
 * closed), and the safety-yellow registration mark can render without the
 * frame (`mark`) — it is the same --signal #E5C11F as the hero's MACHINES.
 */
export default function Monogram({ className = "", framed = true, mark = framed }) {
  return (
    <svg viewBox="0 0 128 128" className={className} role="img" aria-label="Amartya Baul">
      {framed && (
        /* frame */
        <rect x="2" y="2" width="124" height="124"
              fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="2" />
      )}
      <g stroke="currentColor" strokeWidth="14"
         strokeLinecap="butt" strokeLinejoin="miter" fill="none">
        {/* shared stem */}
        <path d="M56 20 L56 108" />
        {/* A — crossbar */}
        <path d="M31 84 L56 84" />
        {/* B — both bowls on one axis, equal width, single right edge */}
        <path d="M56 20 L98 20 L98 57 L56 57" />
        <path d="M56 57 L98 57 L98 108 L56 108" />
      </g>

      {mark && (
        /* registration mark — safety yellow, flush with the B's outer
           bottom-right corner: the corner block itself turns signal */
        <rect x="95" y="105" width="10" height="10" fill="#E5C11F" />
      )}

      {/* A — diagonal as a filled polygon: solid at the apex, flat at the
          baseline (closes the two open notches of the stroked original) */}
      <polygon
        points="49.5,17.3 62.5,22.7 27.6,108 12.4,108"
        fill="currentColor"
      />
    </svg>
  );
}
