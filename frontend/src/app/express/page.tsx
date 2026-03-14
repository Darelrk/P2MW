import { ExpressCatalog } from "@/features/catalog/ExpressCatalog";
import { ExpressHero } from "@/features/catalog/ExpressHero";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Koleksi Cepat — AMOUREA Bouquet",
    description: "Buket rajutan yang jadi dalam 3 jam. Pesan sekarang!",
};

type Product = InferSelectModel<typeof products>;

export default async function ExpressPage() {
    // Fetch data server-side - excluding deleted and inactive products
    const dbProducts = await db.select()
        .from(products)
        .where(
            and(
                eq(products.status, true),
                eq(products.isDeleted, false)
            )
        ) as Product[];

    // Format products on server for better LCP
    const formattedProducts = dbProducts.map((p: Product) => {
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
            priceNum: minPrice, 
            image: p.imageUrl || "/images/forest-bloom.png",
            stock: p.stock,
            soldCount: p.soldCount, // Pass soldCount to frontend
            activeTiers: enabledTiers.map(t => t.key),
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
