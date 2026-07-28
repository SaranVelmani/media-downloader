import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PlatformCards } from "@/components/PlatformCards";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <PlatformCards />
        <FeaturesGrid />
        <FaqAccordion />
      </main>
      <Footer />
    </div>
  );
}
