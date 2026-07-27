"use client";

import { useEffect, useState } from "react";
import MonoLabel from "@/components/ui/MonoLabel";

/**
 * Live Dhaka clock, GMT+6, ticking every second in Martian Mono. The seconds
 * render only after mount — server and first client paint both show the
 * static zone label, so there is no hydration mismatch. PRD §5.10
 */
export default function DhakaClock() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <MonoLabel className="mt-2">
      DHAKA, BANGLADESH — {time ? `${time} · ` : ""}GMT+6
    </MonoLabel>
  );
}
