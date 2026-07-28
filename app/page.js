import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import { getProjects, getAgency } from "@/lib/content";
import About from "@/components/sections/About";
import Capabilities from "@/components/sections/Capabilities";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";

/**
 * Home — section order per PRD §5 (Industries replaced by Services on
 * client direction):
 * hero → trusted-by → work → about → capabilities → services → process → contact.
 * There is no testimonials section (§2.4), and exactly one logo marquee (§2.4.1).
 */
export default async function Home() {
  // Work and Marquee animate client-side, so they take their content as
  // props — still sourced through /lib/content.js. PRD §8.3
  const [projects, agency] = await Promise.all([getProjects(), getAgency()]);

  return (
    <>
      <Nav />
      <main id="content">
        <Hero />
        <Marquee projects={projects} agency={agency} />
        <Work projects={projects} />
        <About />
        <Capabilities />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
