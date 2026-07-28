import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";

/**
 * What I do — three numbered service plates (client direction: replaces the
 * Industries specimen board). Machine-room language on the site's smoke:
 * hairlined glass cards, ghosted display indices, signal-lit marks, a square
 * bullet checklist and a mono CTA riding to contact. Copy stays in the
 * site's truth-first voice — claims a client can hold the site to. PRD §5.8
 * (revised)
 */

const ICONS = {
  code: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
    </svg>
  ),
  api: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="5" cy="12" r="2.2" />
      <circle cx="19" cy="5.5" r="2.2" />
      <circle cx="19" cy="18.5" r="2.2" />
      <path d="M7 11l9.8-4.6M7 13l9.8 4.6" />
    </svg>
  ),
  gauge: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 17.5a8 8 0 1 1 16 0" />
      <path d="M12 17.5 16.5 12" strokeWidth="1.8" />
      <circle cx="12" cy="17.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  ),
};

const SERVICES = [
  {
    index: "01",
    icon: "code",
    title: "Full-Stack Web Development",
    body: "Complete production websites, end to end — React or Next.js up front, Node.js and a real data layer behind. Built for businesses that sell, book and quote through them, not for design awards.",
    points: [
      "Clean, handover-ready architecture",
      "Fast on a mid-range phone, on mobile data",
      "SEO and a performance budget from day one",
    ],
  },
  {
    index: "02",
    icon: "api",
    title: "APIs & Integrations",
    body: "REST APIs designed, secured and documented — and wired into whatever the business already runs: payments, mail, storage, authentication.",
    points: [
      "JWT authentication done properly",
      "Documented, testable endpoints",
      "Queries tuned under real load",
    ],
  },
  {
    index: "03",
    icon: "gauge",
    title: "Rebuilds & Performance Rescue",
    body: "Slow, ageing sites moved onto a modern stack without losing traffic or uptime. Measured before, measured after — the numbers are the deliverable.",
    points: [
      "Speed measured, not promised",
      "Migrations without downtime",
      "Mobile-first refinement",
    ],
  },
];

export default function Services() {
  return (
    <section className="py-section-half text-chalk">
      <div className="container space-y-14">
        <div className="space-y-10">
          <SectionHeader
            tone="dark"
            index="05"
            label="SERVICES"
            meta="3 WAYS TO ENGAGE"
          />
          <RevealText as="h2" text="What I do." className="max-w-[10ch] text-h2" />
        </div>

        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <RevealText
              key={s.index}
              as="li"
              variant="fade"
              lineIndex={i}
              className="group relative flex flex-col border border-white/15 bg-white/[0.04] p-7 transition-colors hover:border-white/35"
            >
              {/* ghosted display index, the card's registration mark */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-5 top-4 font-display text-[4.5rem] leading-none tracking-display text-white/[0.07] transition-colors group-hover:text-white/[0.12]"
              >
                {s.index}
              </span>

              <span className="flex h-11 w-11 items-center justify-center border border-rule-inv bg-white/[0.05] text-signal">
                {ICONS[s.icon]}
              </span>

              <h3 className="mt-6 max-w-[18ch] text-h3 font-medium leading-snug">
                {s.title}
              </h3>
              <p className="mt-3 text-body leading-relaxed text-chalk-mute">{s.body}</p>

              <ul className="mt-6 flex-1 space-y-2.5 border-t border-rule-inv pt-5">
                {s.points.map((point) => (
                  <li key={point} className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] bg-signal"
                    />
                    <span className="text-small leading-relaxed text-chalk">{point}</span>
                  </li>
                ))}
              </ul>

              <MonoLabel as="p" className="mt-7">
                <a href="#contact" className="link-draw">
                  DISCUSS A PROJECT <span aria-hidden="true">↗</span>
                </a>
              </MonoLabel>
            </RevealText>
          ))}
        </ul>
      </div>
    </section>
  );
}
