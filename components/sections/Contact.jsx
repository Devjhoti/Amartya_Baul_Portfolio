import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import Button from "@/components/ui/Button";
import RevealText from "@/components/ui/RevealText";
import MagneticWrap from "@/components/ui/MagneticWrap";
import { getProfile } from "@/lib/content";

/**
 * Full-bleed machine ground. Form left, direct channels right. This phase is
 * markup only — validation, the four written states and the Formspree POST are
 * wired in Phase 5, as is the ticking Dhaka clock (static here). PRD §5.10
 */
const FIELD =
  "w-full border-b border-rule-inv bg-transparent pb-3 pt-2 font-body text-body text-chalk placeholder:text-chalk-mute";

export default async function Contact() {
  const profile = await getProfile();
  const { email, whatsapp, whatsappIntl } = profile.contact;

  return (
    <section id="contact" className="bg-machine py-section-gap text-chalk">
      <div className="container space-y-16">
        <div className="space-y-10">
          <SectionHeader
            tone="dark"
            index="07"
            label="CONTACT"
            meta="REPLIES WITHIN 24 HOURS"
          />
          <RevealText as="h2" text="Have a build in mind?" className="max-w-[12ch] text-display" />
        </div>

        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-6">
          <form className="space-y-10 lg:col-span-6">
            <div>
              <MonoLabel as="label" htmlFor="contact-name" className="block text-chalk-mute">
                NAME
              </MonoLabel>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                className={FIELD}
                placeholder="Your name"
              />
            </div>
            <div>
              <MonoLabel as="label" htmlFor="contact-email" className="block text-chalk-mute">
                EMAIL
              </MonoLabel>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                className={FIELD}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <MonoLabel as="label" htmlFor="contact-company" className="block text-chalk-mute">
                COMPANY — OPTIONAL
              </MonoLabel>
              <input
                id="contact-company"
                name="company"
                type="text"
                autoComplete="organization"
                className={FIELD}
                placeholder="Company or project"
              />
            </div>
            <div>
              <MonoLabel as="label" htmlFor="contact-message" className="block text-chalk-mute">
                MESSAGE
              </MonoLabel>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                className={FIELD}
                placeholder="What are you building, and when does it need to be live?"
              />
            </div>

            {/* Honeypot — real users never see or fill this. PRD §5.10 */}
            <div className="hidden" aria-hidden="true">
              <label>
                Leave this field empty
                <input name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <MagneticWrap>
              <Button type="submit" tone="dark">
                Send message
              </Button>
            </MagneticWrap>
          </form>

          <div className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div>
              <MonoLabel className="text-chalk-mute">EMAIL</MonoLabel>
              <a
                href={`mailto:${email}`}
                className="mt-2 inline-block break-all text-h3 font-medium underline decoration-1 underline-offset-8 transition-colors hover:decoration-signal"
              >
                {email}
              </a>
            </div>
            <div>
              <MonoLabel className="text-chalk-mute">WHATSAPP</MonoLabel>
              <a
                href={`https://wa.me/${whatsappIntl.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-h3 font-medium underline decoration-1 underline-offset-8 transition-colors hover:decoration-signal"
              >
                {whatsapp}
              </a>
            </div>
            <div>
              <MonoLabel className="text-chalk-mute">LOCAL TIME</MonoLabel>
              <MonoLabel className="mt-2">DHAKA, BANGLADESH — GMT+6</MonoLabel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
