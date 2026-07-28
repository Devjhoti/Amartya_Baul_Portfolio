/**
 * The preloader's dirt bike — line art in the site's own drawing language
 * (hairline strokes, chalk on machine, signal only for the lamps), drawn
 * procedurally like Monogram and SectorChip so there is no external asset and
 * no licence to carry. Facing right, riderless: this is a site about building
 * for machines.
 *
 * Proportioned off a real 450: wheelbase 2.8× wheel diameter, the engine
 * carried high above the axle line for ground clearance, fenders standing
 * clear of both tyres. The masses (tank, seat, engine, shroud, plate) are
 * filled in the panel's own ground so they punch out of the lines behind
 * them — pure outline turns to spaghetti at this size.
 *
 * Animatable parts, all keyed by class. Their transform origins are left to
 * GSAP, which measures SVG elements off getBBox — setting transform-box in
 * CSS as well applies the origin twice and throws the parts across the panel.
 *   .bk-body    everything — squash-and-stretch on landing
 *   .bk-wheel   each wheel, spun about its own centre
 *   .bk-flash   headlight bloom, lit on impact
 *   .bk-exhaust invisible anchor the smoke engine emits from
 *
 * The viewBox ends exactly on the tyres' contact line (y=127), so the
 * element's bottom edge IS the contact line — the choreography can sit it
 * straight on a surface with no packing to subtract.
 */
export default function DirtBike({ className = "", ...rest }) {
  return (
    <svg
      viewBox="0 0 240 127"
      className={className}
      {...rest}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <radialGradient id="bkGlow">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="var(--signal)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="bk-body">
        {/* ───────── wheels — dashed outer stroke reads as knobby tread */}
        <g className="bk-wheel bk-wheel-r">
          <circle cx="52" cy="101" r="25" strokeWidth="5.5" strokeDasharray="2.6 4.6" />
          <circle cx="52" cy="101" r="19.5" strokeWidth="1" opacity="0.55" />
          <circle cx="52" cy="101" r="12" strokeWidth="1.5" />
          <path
            strokeWidth="1.1"
            d="M56 101h6.5M54.1 104.4l3.2 5.6M49.9 104.4l-3.2 5.6M48 101h-6.5M49.9 97.6l-3.2-5.6M54.1 97.6l3.2-5.6"
          />
          <circle cx="52" cy="101" r="7.5" strokeWidth="1" opacity="0.5" />
          <circle cx="52" cy="101" r="3" fill="currentColor" stroke="none" />
        </g>
        <g className="bk-wheel bk-wheel-f">
          <circle cx="196" cy="101" r="25" strokeWidth="5.5" strokeDasharray="2.6 4.6" />
          <circle cx="196" cy="101" r="19.5" strokeWidth="1" opacity="0.55" />
          <circle cx="196" cy="101" r="12" strokeWidth="1.5" />
          <path
            strokeWidth="1.1"
            d="M200 101h6.5M198.1 104.4l3.2 5.6M193.9 104.4l-3.2 5.6M192 101h-6.5M193.9 97.6l-3.2-5.6M198.1 97.6l3.2-5.6"
          />
          <circle cx="196" cy="101" r="3" fill="currentColor" stroke="none" />
        </g>

        {/* ───────── chain run */}
        <path strokeWidth="1" opacity="0.55" d="M110 86 L54 99M110 91 L54 103" />

        {/* ───────── swingarm and shock (dashed thick stroke = coil spring) */}
        <path d="M112 85 L53 98M112 90 L53.5 102.5" strokeWidth="2.2" />
        <circle cx="112" cy="87.5" r="2.6" strokeWidth="1.5" fill="var(--machine)" />
        <path d="M124 56 L96 84" strokeWidth="6.5" strokeDasharray="2.6 3.2" opacity="0.85" />
        <path d="M124 56 L96 84" strokeWidth="1.1" />

        {/* ───────── frame: top tube, subframe, down tube, cradle */}
        <path d="M172 44 L128 50 L96 44" strokeWidth="2.4" />
        <path d="M174 48 C164 54 152 62 142 76" strokeWidth="2.4" />
        <path d="M142 76 L124 88 L112 87" strokeWidth="2.2" />

        {/* ───────── engine, carried high for clearance */}
        <path
          d="M110 60 L142 57 L148 72 L140 86 L116 88 L106 76 Z"
          strokeWidth="2"
          fill="var(--machine)"
        />
        <path strokeWidth="1.1" opacity="0.75" d="M116 62 L138 60M116 66.5 L140 64.5M116 71 L141 69" />
        <path d="M124 90 L114 94" strokeWidth="3" />

        {/* ───────── exhaust: header up off the head, muffler back over the wheel */}
        <path
          d="M144 60 C156 54 158 42 146 38 C128 32 108 36 100 42"
          strokeWidth="2.4"
        />
        <path d="M100 42 L64 52" strokeWidth="6.5" />
        <path d="M64 52 L56 54.5" strokeWidth="9" />
        <circle className="bk-exhaust" cx="54" cy="55" r="1" fill="none" stroke="none" />

        {/* ───────── seat and tank */}
        <path d="M94 42 L136 36 L142 44 L98 50 Z" strokeWidth="2" fill="var(--machine)" />
        <path
          d="M136 36 L158 33 L172 40 L168 56 L150 62 L138 52 Z"
          strokeWidth="2"
          fill="var(--machine)"
        />
        <path d="M146 42 L162 39 L164 57 L148 60 Z" strokeWidth="1.1" opacity="0.55" />

        {/* ───────── high fenders, the dirt-bike signature */}
        <path d="M96 42 C84 32 68 27 52 30" strokeWidth="2.6" />
        <path d="M98 47 C86 38 70 33 55 35" strokeWidth="1.2" opacity="0.7" />
        <path d="M170 52 C182 43 202 43 216 55" strokeWidth="2.6" />
        <path d="M172 57 C184 49 200 49 213 59" strokeWidth="1.2" opacity="0.7" />
        <path d="M173 52 L175 58" strokeWidth="1.2" opacity="0.7" />
        <rect x="49" y="27" width="6" height="4" rx="1" fill="var(--signal)" stroke="none" />

        {/* ───────── fork: tube, second-leg hint, fatter slider */}
        <path d="M174 46 L196 101" strokeWidth="4.5" />
        <path d="M180 44 L201 97" strokeWidth="1.8" opacity="0.4" />
        <path d="M184 71 L192 93" strokeWidth="7.5" opacity="0.9" />
        <path d="M167 42 L181 38" strokeWidth="4" />

        {/* ───────── bars and the front plate */}
        <path d="M174 40 L170 26" strokeWidth="2.6" />
        <path d="M160 24 L182 22" strokeWidth="3" />
        <path d="M176 22.6 L186 21.6" strokeWidth="5" />
        <path
          d="M182 30 C192 27 200 32 200 40 C200 47 193 51 184 49 Z"
          strokeWidth="2"
          stroke="var(--signal)"
          fill="var(--machine)"
        />
        <circle cx="191" cy="39" r="3.6" fill="var(--signal)" stroke="none" />

        {/* headlight bloom, lit on impact */}
        <circle
          className="bk-flash"
          cx="191"
          cy="39"
          r="44"
          fill="url(#bkGlow)"
          stroke="none"
          opacity="0"
        />
      </g>
    </svg>
  );
}
