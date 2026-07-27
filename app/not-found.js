import Link from "next/link";
import MonoLabel from "@/components/ui/MonoLabel";
import Monogram from "@/components/ui/Monogram";

/** Site-wide 404 — same machine ground, same voice. PRD §8.2 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col justify-between bg-machine px-[var(--page-margin)] py-10 text-chalk">
      <Monogram framed={false} className="h-8 w-8" />
      <div className="space-y-6">
        <MonoLabel>
          <span className="text-signal">[ 404 ]</span>
          <span className="ml-3">NOTHING AT THIS ADDRESS</span>
        </MonoLabel>
        <h1 className="max-w-[16ch] text-display">This page isn&apos;t on the site.</h1>
        <p className="max-w-[44ch] text-body text-chalk-mute">
          The address may be mistyped, or the page may have moved. Everything that exists is reachable from the home page.
        </p>
        <MonoLabel as="p">
          <Link href="/" className="link-draw">
            GO TO THE HOME PAGE
          </Link>
        </MonoLabel>
      </div>
      <MonoLabel className="text-chalk-mute">AMARTYA BAUL — FULL-STACK DEVELOPER</MonoLabel>
    </main>
  );
}
