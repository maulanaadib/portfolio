import { Hero, About, Skills, Projects, Experience, Services, Testimonials, Contact } from "@/components/public/Sections";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
}
