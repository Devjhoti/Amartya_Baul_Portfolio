/**
 * The test-equipment frame: machine-enamel chassis, square corners, thin bezel,
 * and the four safety-yellow registration marks — the same mark that sits in
 * the monogram's corner. Screen area is overflow-hidden; the label plate slots
 * beneath it inside the chassis. Purely presentational. PRD §3.6
 */
const MARK = "pointer-events-none absolute h-2.5 w-2.5 bg-signal";

export default function RigChassis({ screen, plate, className = "" }) {
  return (
    <div className={`relative border border-rule-inv bg-machine p-2 sm:p-3 ${className}`}>
      {/* corner registration marks */}
      <span aria-hidden="true" className={`${MARK} left-0 top-0`} />
      <span aria-hidden="true" className={`${MARK} right-0 top-0`} />
      <span aria-hidden="true" className={`${MARK} bottom-0 left-0`} />
      <span aria-hidden="true" className={`${MARK} bottom-0 right-0`} />

      <div className="relative aspect-[1440/900] overflow-hidden bg-machine-2">
        {screen}
      </div>

      {plate}
    </div>
  );
}
