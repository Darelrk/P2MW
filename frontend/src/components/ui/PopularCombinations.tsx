"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface PopularCombinationsProps {
    initialProducts?: any[];
}

export function PopularCombinations({ initialProducts = [] }: PopularCombinationsProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Pre-warm library AR saat user masuk ke area katalog
        import("@google/model-viewer").catch(console.error);
    }, []);

    // Gunakan data dari database jika ada, jika tidak gunakan hardcoded (backup)
    const products = initialProducts.length > 0 ? initialProducts.map(p => {
        // Cari harga terendah dari tier yang aktif
        const prices = [p.priceAffordable, p.priceStandard, p.pricePremium, p.priceSpecial]
            .filter((_, i) => [p.allowAffordable, p.allowStandard, p.allowPremium, p.allowSpecial][i]);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        
        return {
            id: p.id,
            name: p.name,
            price: `Rp ${minPrice.toLocaleString('id-ID')}`,
            image: p.imageUrl || "/images/forest-bloom.png",
            stock: p.stock,
            description: p.description,
            modelUrl: p.modelUrl
        };
    }) : [
        { id: "p1", name: "Forest Bloom", price: "Rp 185.000", image: "/images/forest-bloom.png", stock: 5, description: "Buket rajut premium dengan nuansa hutan.", modelUrl: null },
        { id: "p2", name: "Pastel Dream", price: "Rp 210.000", image: "/images/pastel-dream.png", stock: 2, description: "Kombinasi warna pastel yang elegan.", modelUrl: null },
        { id: "p3", name: "Red Romance", price: "Rp 195.000", image: "/images/red-romance.png", stock: 8, description: "Mawar merah klasik untuk orang tersayang.", modelUrl: null },
    ];

    const next = () => setCurrentIndex((prev) => (prev + 1) % products.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);

    return (
        <section className="bg-cream py-24 px-4 md:px-8 overflow-hidden">
            <div className="mx-auto max-w-7xl">
                <div className="mb-16 flex flex-col md:flex-row items-center md:items-end justify-between text-center md:text-left">
                    <div className="max-w-xl">
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-blush">Produk Terlaris</span>
                        <h2 className="mt-3 font-display text-4xl font-bold text-forest md:text-5xl">Favorit Pelanggan</h2>
                        <p className="mt-4 font-body text-base text-forest/60">
                            Terhubung langsung dengan koleksi terpopuler kami yang paling dicintai oleh AMOUREA Lovers.
                        </p>
                    </div>
                    
                    {/* Navigation Buttons (Desktop) */}
                    <div className="hidden md:flex items-center gap-4 mt-8 md:mt-0">
                        <button 
                            onClick={prev}
                            className="p-4 rounded-full border border-forest/10 hover:bg-forest hover:text-white transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <button 
                            onClick={next}
                            className="p-4 rounded-full border border-forest/10 hover:bg-forest hover:text-white transition-all duration-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>

                {/* Carousel Mechanism */}
                <div className="relative">
                    <motion.div
                        className="flex items-center justify-center gap-4 md:gap-12"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -50) next();
                            else if (info.offset.x > 50) prev();
                        }}
                    >
                        <AnimatePresence mode="popLayout" initial={false}>
                            {products.map((product, index) => {
                                // Logic for 3 items carousel
                                const isActive = index === currentIndex;
                                const isPrev = index === (currentIndex - 1 + products.length) % products.length;
                                const isNext = index === (currentIndex + 1) % products.length;

                                // Only show these 3
                                if (!isActive && !isPrev && !isNext) return null;

                                return (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ 
                                            opacity: isActive ? 1 : 0.4,
                                            scale: isActive ? 1.05 : 0.85,
                                            zIndex: isActive ? 20 : 10,
                                            x: isActive ? 0 : (isPrev ? -20 : 20),
                                            filter: isActive ? 'blur(0px)' : 'blur(2px)'
                                        }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }}
                                        className="w-full max-w-[300px] md:max-w-[340px] shrink-0"
                                    >
                                        <ProductCard
                                            name={product.name}
                                            price={product.price}
                                            image={product.image}
                                            stock={product.stock}
                                            description={product.description}
                                            hasAR={!!product.modelUrl}
                                            modelUrl={product.modelUrl || undefined}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                    
                    {/* Snake Dots Navigation */}
                    <div className="flex justify-center items-center gap-3 mt-16">
                        {products.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className="relative py-2 focus:outline-none"
                            >
                                <motion.div
                                    animate={{
                                        width: i === currentIndex ? 32 : 8,
                                        backgroundColor: i === currentIndex ? "#223026" : "#22302633",
                                    }}
                                    className="h-2 rounded-full transition-colors duration-300"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
