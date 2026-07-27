import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Work from "@/components/sections/Work";
import { getProjects } from "@/lib/content";
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
  // Work pins and runs the iframe lifecycle client-side, so it takes its
  // content as props — still sourced through /lib/content.js. PRD §8.3
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <main id="content">
        <Hero />
        <Marquee />
        <Work projects={projects} />
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
