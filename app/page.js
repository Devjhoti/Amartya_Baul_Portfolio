import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import SectorChip from "@/components/ui/SectorChip";
import { getProjects, getAgency } from "@/lib/content";
import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import Industries from "@/components/sections/Industries";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";

/**
 * Home — section order per PRD §5:
 * hero → trusted-by → work → about → capabilities → industries → process → contact.
 * There is no testimonials section (§2.4), and exactly one logo marquee (§2.4.1).
 */
export default async function Home() {
  // Work and Marquee animate client-side, so they take their content as
  // props — still sourced through /lib/content.js. PRD §8.3
  const [projects, agency] = await Promise.all([getProjects(), getAgency()]);

  // Label-plate chips render here on the server and travel down as elements,
  // keeping the procedural pattern data out of the client bundle. PRD §9
  const chips = Object.fromEntries(
    projects.map((p) => [
      p.slug,
      <SectorChip key={p.slug} sector={p.chip} size={56} label={`${p.sector} material sample`} />,
    ])
  );

  return (
    <>
      <Nav />
      <main id="content">
        <Hero />
        <Marquee projects={projects} agency={agency} />
        <Work projects={projects} chips={chips} />
        <About />
        <Capabilities />
        <Industries />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
