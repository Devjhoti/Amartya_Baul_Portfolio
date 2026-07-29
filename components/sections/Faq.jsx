"use client";

import { useState } from "react";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";

/**
 * FAQ — the band under the auditorium (it replaced the project index on
 * client direction). Spec-plate language: hairlined rows, signal indices,
 * questions in the display face, answers in the utility voice. One open at a
 * time; the grid-rows transition costs nothing and collapses cleanly under
 * reduced motion. Ships FAQPage JSON-LD for the crawlers. §5.4 (revised)
 */
const FAQS = [
  {
    q: "What kind of work do you take on?",
    a: "Production websites for operating businesses — manufacturers, industrials, hospitality, education. Marketing sites, product catalogues, booking and enquiry flows. Custom-coded every time; no page builders, no templates.",
  },
  {
    q: "How long does a build take?",
    a: "A focused marketing site: two to four weeks. Catalogue-heavy or multi-page work runs longer. You get a dated plan before work starts, and you watch the site live on a staging URL from the first week.",
  },
  {
    q: "What will my site run on?",
    a: "React or Next.js up front, Node.js behind it when the work needs a server. Performance is a day-one budget, checked on a mid-range Android over mobile data — because that is the phone your customer is actually holding.",
  },
  {
    q: "Do you work with clients outside Bangladesh?",
    a: "Yes. The work is remote-first from Dhaka (GMT+6), with overlap hours agreed up front and everything in writing. Eleven industries shipped so far — the auditorium above is the honest record.",
  },
  {
    q: "Who owns the code and the site?",
    a: "You do. Repository, hosting, domain and content all sit in accounts you control. Handover includes how to change things yourself — a site nobody can update starts dying the day it launches.",
  },
  {
    q: "What happens after launch?",
    a: "Every build ships with a verification pass against its performance budget and a written handover. If you want a hand with ongoing changes, a monthly arrangement is available — otherwise the site is yours and it keeps running.",
  },
  {
    q: "How do we start?",
    a: "Send one message with what the site must do for the business. You get a straight answer on scope, timeline and price — usually within twenty-four hours.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div
      id="faq"
      // the vortex turns behind this — every glyph carries a tight dark halo
      className="scroll-mt-24 [text-shadow:0_1px_2px_rgba(10,13,11,0.9),0_0_6px_rgba(10,13,11,0.55)]"
    >
      <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-6">
        <div className="space-y-8 lg:col-span-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule-inv pt-4">
            <MonoLabel className="whitespace-nowrap">
              <span className="text-signal">[ FAQ ]</span>
              <span className="ml-3">STRAIGHT ANSWERS</span>
            </MonoLabel>
            <MonoLabel className="whitespace-nowrap text-chalk-mute">
              {String(FAQS.length).padStart(2, "0")} QUESTIONS
            </MonoLabel>
          </div>
          <RevealText
            as="h2"
            text="Asked on every build."
            className="max-w-[12ch] text-h2"
          />
          <p className="max-w-[36ch] text-body text-chalk-mute">
            The questions every client asks before work starts — answered the
            same way the sites are built: plainly.
          </p>
        </div>

        <ol className="border-t border-rule-inv lg:col-span-8">
          {FAQS.map(({ q, a }, i) => {
            const isOpen = open === i;
            return (
              <li key={q} className="border-b border-rule-inv">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="group flex w-full items-baseline gap-5 py-6 text-left"
                  >
                    <MonoLabel as="span" className="shrink-0 text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </MonoLabel>
                    <span
                      className={`flex-1 font-display text-h3 leading-display tracking-display transition-colors ${
                        isOpen
                          ? "text-chalk"
                          : "text-[rgba(232,234,229,0.85)] group-hover:text-chalk"
                      }`}
                    >
                      {q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 self-center font-mono text-h3 leading-none text-chalk-mute transition-transform duration-300 motion-reduce:transition-none ${
                        isOpen ? "rotate-45 text-signal" : "group-hover:text-chalk"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-label={q}
                  className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* glass plate — same material as the auditorium walls,
                        so the answer lifts clear of the tornado behind it */}
                    <div
                      className="mb-7 ml-9 border border-white/15 bg-white/[0.06] px-6 py-5 backdrop-blur-md lg:ml-12"
                      style={{
                        boxShadow:
                          "0 16px 32px -16px rgba(0,0,0,0.5), inset 1px 1px 0 rgba(255,255,255,0.12)",
                      }}
                    >
                      <p className="max-w-[62ch] text-body leading-relaxed text-chalk">
                        {a}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </div>
  );
}
