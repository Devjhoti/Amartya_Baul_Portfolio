import SectionHeader from "@/components/ui/SectionHeader";
import RevealText from "@/components/ui/RevealText";

/**
 * Four steps as hairlined spec rows — index, name, decision. Static state; the
 * sticky column with the rolling index arrives with the motion core. PRD §5.9
 */
const STEPS = [
  {
    name: "Understand",
    body: "What must the site do for the business, and who actually reads it? A dealer on a phone in a hardware shop is a different reader than a procurement head at a desk. Scope comes from those answers, not from a feature list.",
  },
  {
    name: "Design",
    body: "Structure before decoration: what belongs on each page, in what order, in the client's own material world — spec tables, product data, real photography. No template shopping.",
  },
  {
    name: "Build",
    body: "Next.js, with a performance budget set on day one and checked on a mid-range Android over mobile data — because that is the device most visitors are holding.",
  },
  {
    name: "Ship",
    body: "Deploy, verify against the budget, hand over. Handover includes how to change things, because a site nobody can update starts dying the day it launches.",
  },
];

export default function Process() {
  return (
    <section className="bg-concrete py-section-half">
      <div className="container space-y-14">
        <div className="space-y-10">
          <SectionHeader index="06" label="PROCESS" meta="4 STEPS · EVERY BUILD" />
          <RevealText as="h2" text="The same four steps, every time." className="max-w-[16ch] text-h2" />
        </div>

        <ol className="border-t border-rule">
          {STEPS.map((step, i) => (
            <li
              key={step.name}
              className="grid grid-cols-1 gap-y-4 border-b border-rule py-10 lg:grid-cols-12 lg:gap-x-6"
            >
              <p
                aria-hidden="true"
                className="font-display text-display leading-display tracking-display text-ink-mute lg:col-span-2"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-h3 lg:col-span-3 lg:pt-2">{step.name}</h3>
              <p className="max-w-[58ch] text-body text-ink-mute lg:col-span-7 lg:pt-2">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
