"use client";

import Image from "next/image";
import SectorChip from "@/components/ui/SectorChip";
import MonoLabel from "@/components/ui/MonoLabel";
import ScrambleText from "@/components/ui/ScrambleText";

/**
 * The data plate riveted to the bottom of the chassis: sector material chip at
 * 56px, silhouetted client logo, sector · year · stack in mono (scrambling in
 * when the rig becomes active), the attribution line, and the status LED —
 * LOADING → LIVE → OFFLINE. The LED renders only where an iframe can exist;
 * the poster-only paths (mobile, reduced motion) don't claim a boot status.
 * PRD §3.6 · §2.2.1 · §6.2
 */
const LED = {
  LOADING: { dot: "bg-signal-dim animate-pulse", text: "LOADING" },
  LIVE: { dot: "bg-signal", text: "LIVE" },
  OFFLINE: { dot: "bg-chalk-mute", text: "OFFLINE" },
};

export default function LabelPlate({ project, status = null, scramble = false }) {
  const led = status ? LED[status] : null;
  const meta = [project.sector, project.year, project.stack.join(" · ")].join("  ·  ");

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2 text-chalk sm:pt-3">
      <SectorChip
        sector={project.chip}
        size={56}
        label={`${project.sector} material sample`}
        className="shrink-0"
      />

      <div className="relative h-6 w-24 shrink-0">
        <Image
          src={project.logo}
          alt={`${project.client} logo`}
          fill
          sizes="96px"
          className="object-contain object-left opacity-55 brightness-0 invert"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <MonoLabel className="truncate">
          <ScrambleText text={meta} play={scramble} />
        </MonoLabel>
        <MonoLabel className="text-chalk-mute">
          {project.type === "internal" ? "INTERNAL · PKG IT" : "CLIENT · DELIVERED AT PKG IT"}
        </MonoLabel>
      </div>

      {led ? (
        <MonoLabel className="flex shrink-0 items-center gap-2">
          <span aria-hidden="true" className={`inline-block h-2 w-2 rounded-full ${led.dot}`} />
          {led.text}
        </MonoLabel>
      ) : null}
    </div>
  );
}
