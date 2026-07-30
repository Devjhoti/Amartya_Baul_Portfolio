import Link from "next/link";
import MonoLabel from "@/components/ui/MonoLabel";
import Monogram from "@/components/ui/Monogram";
import NotFoundRide from "@/components/layout/NotFoundRide";
import { profile } from "@/data/profile";

/** Site-wide 404 — same machine ground, same voice. PRD §8.2 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col justify-between bg-machine px-[var(--page-margin)] py-10 text-chalk">
      <Link href="/" aria-label="Amartya Baul — home" className="block w-fit">
        <Monogram framed={false} className="h-8 w-8" />
      </Link>

      <div className="space-y-6 py-8">
        <MonoLabel>
          <span className="text-signal">[ 404 ]</span>
          <span className="ml-3">NOTHING AT THIS ADDRESS</span>
        </MonoLabel>
        <h1 className="max-w-[16ch] text-display">This page isn&apos;t on the site.</h1>
        <p className="max-w-[44ch] text-body text-chalk-mute">
          The address may be mistyped, or the page may have moved. Everything that
          exists is reachable from the home page — or press{" "}
          <span className="whitespace-nowrap font-mono text-mono uppercase tracking-mono text-chalk">
            ⌘K
          </span>{" "}
          and search for it.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
          <MonoLabel as="p">
            <Link href="/" className="link-draw">
              GO TO THE HOME PAGE
            </Link>
          </MonoLabel>
          <MonoLabel as="p" className="text-chalk-mute">
            <Link href="/#work" className="link-draw transition-colors hover:text-chalk">
              SEE THE WORK
            </Link>
          </MonoLabel>
        </div>
      </div>

      {/* he came, he found nothing here, he left */}
      <NotFoundRide />

      <MonoLabel className="pt-6 text-chalk-mute">
        <span className="text-signal">{profile.name}</span> — {profile.role}
      </MonoLabel>
    </main>
  );
}
