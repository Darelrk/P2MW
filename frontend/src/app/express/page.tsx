import { CountdownBadge } from "@/features/catalog/CountdownBadge";
import { ExpressCatalog } from "@/features/catalog/ExpressCatalog";
import { ExpressHero } from "@/features/catalog/ExpressHero";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

export const metadata = {
    title: "Koleksi Cepat — AMOUREA Bouquet",
    description: "Buket rajutan yang jadi dalam 3 jam. Pesan sekarang!",
};

export default function ExpressPage() {
    return (
        <>
            <Navbar />
            <main>
                {/* Hero Section */}
                <ExpressHero />

                {/* Catalog Section */}
                <section className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8">
                    {/* Sticky Countdown */}
                    <div className="sticky top-20 z-40 -mx-4 px-4 py-3 bg-cream-light/90 backdrop-blur-md md:-mx-8 md:px-8">
                        <CountdownBadge />
                    </div>

                    {/* Product Grid */}
                    <div className="mt-6">
                        <ExpressCatalog />
                    </div>
                </section>
            </main>
            <Footer />
            <FloatingActionButton />
        </>
    );
}
