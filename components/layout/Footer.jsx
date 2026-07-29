import Monogram from "@/components/ui/Monogram";
import MonoLabel from "@/components/ui/MonoLabel";
import CubeRollName from "@/components/ui/CubeRollName";
import { getProfile } from "@/lib/content";

/**
 * Three columns over the giant baseline-clipped wordmark (Archivo 700, width
 * 110, the 1px signal rule inset 8px per §3.7.2), then the register line.
 * The scale-on-enter treatment is Phase 2 — this is the static state. PRD §5.11
 */
export default async function Footer() {
  const profile = await getProfile();
  const { email, whatsapp, whatsappIntl, github, linkedin } = profile.contact;

  return (
    <footer className="border-t border-rule-inv text-chalk">
      <div className="container space-y-24 pb-10 pt-24">
        <div className="grid grid-cols-1 gap-y-14 md:grid-cols-12 md:gap-x-6">
          <div className="md:col-span-4">
            <Monogram className="h-24 w-24" />
          </div>
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-6">
            <MonoLabel className="text-chalk-mute">INDEX</MonoLabel>
            <ul className="mt-4 space-y-2">
              {[
                ["Work", "/#work"],
                ["About", "/#about"],
                ["Contact", "/#contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="font-body text-body text-chalk-mute transition-colors hover:text-chalk"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4 md:col-start-9">
            <MonoLabel className="text-chalk-mute">DIRECT</MonoLabel>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="font-body text-body text-chalk-mute transition-colors hover:text-chalk"
                >
                  {email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappIntl.replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-body text-chalk-mute transition-colors hover:text-chalk"
                >
                  WhatsApp — {whatsapp}
                </a>
              </li>
              {github ? (
                <li>
                  <a href={github} target="_blank" rel="noopener noreferrer" className="font-body text-body text-chalk-mute transition-colors hover:text-chalk">
                    GitHub
                  </a>
                </li>
              ) : null}
              {linkedin ? (
                <li>
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="font-body text-body text-chalk-mute transition-colors hover:text-chalk">
                    LinkedIn
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div>
          {/* centred, sized to always fit the container, and rolling — each
              character a prism turning over in a travelling wave */}
          <div className="text-center">
            {/* the clamp floor decides the narrow end: at 2.75rem the nowrap
                wordmark was wider than a 360px screen, and since it is the
                widest thing on the page it dragged the layout viewport with
                it — which every fixed element then sized to */}
            <CubeRollName
              text={profile.name}
              className="whitespace-nowrap font-display text-[clamp(2.2rem,9.6vw,9.6rem)] uppercase leading-none tracking-display"
            />
          </div>
          <div className="mx-2 mt-2 h-px bg-signal" />
          <div className="flex justify-end pt-3">
            <MonoLabel className="text-chalk-mute">FULL-STACK DEVELOPER — DHAKA</MonoLabel>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-rule-inv pt-6">
          <MonoLabel className="text-chalk-mute">© 2026 · BUILT IN DHAKA</MonoLabel>
          <a
            href="#top"
            className="font-mono text-mono uppercase tracking-mono text-chalk-mute transition-colors hover:text-chalk"
          >
            BACK TO TOP ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
