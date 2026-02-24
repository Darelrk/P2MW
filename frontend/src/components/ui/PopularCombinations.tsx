"use client";

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";

const POPULAR_COMBOS = [
    {
        id: "p1",
        name: "Forest Bloom",
        price: "Rp 185.000",
        image: "/images/forest-bloom.png",
        stock: 5,
    },
    {
        id: "p2",
        name: "Pastel Dream",
        price: "Rp 210.000",
        image: "/images/pastel-dream.png",
        stock: 2,
    },
    {
        id: "p3",
        name: "Red Romance",
        price: "Rp 195.000",
        image: "/images/red-romance.png",
        stock: 8,
    },
];

export function PopularCombinations() {
    return (
        <section className="bg-cream py-24 px-4 md:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex items-end justify-between">
                    <div className="max-w-xl">
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-blush">Favorit Pelanggan</span>
                        <h2 className="mt-3 font-display text-4xl font-bold text-forest md:text-5xl">Kombinasi Populer</h2>
                        <p className="mt-4 font-body text-base text-forest/60">
                            Pilihan paling dicintai yang siap untuk dikirimkan sebagai bingkisan spesial untuk yang tersayang.
                        </p>
                    </div>
                </div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
                >
                    {POPULAR_COMBOS.map((product) => (
                        <div key={product.id} className="flex justify-center">
                            <div className="w-full max-w-[320px]">
                                <ProductCard
                                    name={product.name}
                                    price={product.price}
                                    image={product.image}
                                    stock={product.stock}
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
