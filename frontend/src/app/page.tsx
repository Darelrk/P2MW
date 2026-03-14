import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/ui/HeroSection";
import { TrustBar } from "@/components/ui/TrustBar";
import { PopularCombinations } from "@/components/ui/PopularCombinations";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { db } from "@/db";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * Landing Page — Composites the main marketing sections.
 */
export default async function Home() {
  // ID Produk Spesifik: Standard Red Romance, Standard Pastel Dream, Mini Forest Bloom
  const targetIds = [
    "1d2ffccd-e89c-49a8-b825-d8f1caa22664", // Standard Red Romance
    "b5fef7a5-af33-470d-9959-65ee24c336aa", // Standard Pastel Dream
    "daeed931-8c59-4e57-b929-7c88f25fe8c3"  // Mini Forest Bloom
  ];

  const dbProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, targetIds));

  // Sortir manual agar urutannya sesuai targetIds
  const sortedProducts = targetIds.map(id => 
    dbProducts.find((p: any) => p.id === id)
  ).filter(Boolean);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <PopularCombinations initialProducts={sortedProducts as any} />
      </main>
      <Footer />
      <FloatingActionButton />
    </>
  );
}
