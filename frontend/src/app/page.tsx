import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/ui/HeroSection";
import { TrustBar } from "@/components/ui/TrustBar";
import { PopularCombinations } from "@/components/ui/PopularCombinations";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { getTopSellingProducts } from "@/db/queries";

/**
 * Landing Page — Composites the main marketing sections.
 */
export default async function Home() {
  // Ambil 3 produk terlaris dari DAL (Cached)
  const dbProducts = await getTopSellingProducts(3);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <PopularCombinations initialProducts={dbProducts as any} />
      </main>
      <Footer />
      <FloatingActionButton />
    </>
  );
}
