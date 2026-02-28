import { ExpressCatalog } from "@/features/catalog/ExpressCatalog";
import { ExpressHero } from "@/features/catalog/ExpressHero";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const metadata = {
    title: "Koleksi Cepat — AMOUREA Bouquet",
    description: "Buket rajutan yang jadi dalam 3 jam. Pesan sekarang!",
};

export default async function ExpressPage() {
    // Fetch data server-side
    const dbProducts = await db.select().from(products).where(eq(products.status, true));

    // Format products on server for better LCP
    const formattedProducts = dbProducts.map(p => {
        const tiers = [
            { key: "affordable", enabled: p.allowAffordable, val: p.priceAffordable },
            { key: "standard", enabled: p.allowStandard, val: p.priceStandard },
            { key: "premium", enabled: p.allowPremium, val: p.pricePremium },
            { key: "special", enabled: p.allowSpecial, val: p.priceSpecial },
        ];

        const enabledTiers = tiers.filter(t => t.enabled);
        const minPrice = enabledTiers.length > 0 ? Math.min(...enabledTiers.map(t => t.val)) : 0;

        return {
            id: p.id,
            name: p.name,
            description: p.description,
            priceNum: minPrice, // Default min price for initial load
            image: p.imageUrl || "/images/forest-bloom.png",
            stock: p.stock,
            activeTiers: enabledTiers.map(t => t.key),
            // Pre-calculate tier values for client-side switching
            tiers: tiers.reduce((acc, t) => ({ ...acc, [t.key]: { enabled: t.enabled, val: t.val } }), {})
        };
    });

    return (
        <>
            <Navbar />
            <main>
                {/* Hero Section */}
                <ExpressHero />

                {/* Catalog Section */}
                <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8">
                    {/* Product Grid */}
                    <div className="mt-6">
                        <ExpressCatalog initialProducts={formattedProducts as any} />
                    </div>
                </section>
            </main>
            <Footer />
            <FloatingActionButton />
        </>
    );
}
