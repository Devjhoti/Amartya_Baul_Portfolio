import SectionHeader from "@/components/ui/SectionHeader";
import MonoLabel from "@/components/ui/MonoLabel";
import RevealText from "@/components/ui/RevealText";
import DhakaClock from "@/components/ui/DhakaClock";
import ContactForm from "./ContactForm";
import { getProfile } from "@/lib/content";

/**
 * Full-bleed machine ground. Wired form left (validation, four written states,
 * Formspree JSON POST — see ContactForm.jsx), direct channels and the live
 * Dhaka clock right. PRD §5.10
 */
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
          <div className="lg:col-span-6">
            <ContactForm endpoint={profile.formEndpoint} email={email} />
          </div>

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
              <DhakaClock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
