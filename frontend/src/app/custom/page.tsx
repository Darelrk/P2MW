import { CustomBuilder } from "@/features/bouquet-builder/CustomBuilder";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { FloatingActionButton } from "@/components/ui/FloatingActionButton";

export const metadata = {
    title: "Rakit Sendiri — P2MW Bouquet",
    description:
        "Rakit buketmu sendiri langkah demi langkah. Pilih bunga, warna, wrapping, dan kartu ucapan.",
};

export default function CustomPage() {
    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-5xl px-4 pb-12 pt-28 md:px-8 md:pt-32">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blush/15 px-4 py-1.5 mb-4">
                        <span className="text-sm">🎨</span>
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-blush">
                            Custom Builder
                        </span>
                    </div>
                    <h1 className="font-display text-3xl font-bold text-forest md:text-4xl">
                        Rakit Sendiri
                    </h1>
                    <p className="mt-2 font-body text-base text-forest/70">
                        Pilih bunga, warna, wrapping, dan kartu ucapan — semua sesuai seleramu.
                    </p>
                </div>

                {/* Builder */}
                <CustomBuilder />
            </main>
            <Footer />
            <FloatingActionButton />
        </>
    );
}
