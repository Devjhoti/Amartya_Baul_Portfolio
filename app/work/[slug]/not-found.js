import Link from "next/link";
import MonoLabel from "@/components/ui/MonoLabel";
import Monogram from "@/components/ui/Monogram";

/** No build with that slug — a real state, not a browser default. PRD §5.5 */
export default function CaseNotFound() {
  return (
    <main className="flex min-h-dvh flex-col justify-between bg-machine px-[var(--page-margin)] py-10 text-chalk">
      <Monogram framed={false} className="h-8 w-8" />
      <div className="space-y-6">
        <MonoLabel>
          <span className="text-signal">[ 404 ]</span>
          <span className="ml-3">BUILD NOT FOUND</span>
        </MonoLabel>
        <h1 className="max-w-[16ch] text-display">No build with that name in the index.</h1>
        <p className="max-w-[44ch] text-body text-chalk-mute">
          The eleven that do exist are all live and listed in the work section.
        </p>
        <MonoLabel as="p">
          <Link href="/#work" className="link-draw">
            OPEN THE PROJECT INDEX
          </Link>
        </MonoLabel>
      </div>
      <MonoLabel className="text-chalk-mute">AMARTYA BAUL — FULL-STACK DEVELOPER</MonoLabel>
    </main>
  );
}
