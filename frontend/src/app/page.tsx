import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/ui/HeroSection";
import { TrustBar } from "@/components/ui/TrustBar";
import { PopularCombinations } from "@/components/ui/PopularCombinations";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

/**
 * Landing Page — Composites the main marketing sections.
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <PopularCombinations />
      </main>
      <Footer />
      <FloatingActionButton />
    </>
  );
}
