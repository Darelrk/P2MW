"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/cn";


interface PopularCombinationsProps {
    initialProducts?: any[];
}

export function PopularCombinations({ initialProducts = [] }: PopularCombinationsProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isMounted, setIsMounted] = React.useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setIsMounted(true);
        // Pre-warm library AR saat user masuk ke area katalog
        import("@google/model-viewer").catch(console.error);
    }, []);

    // Sync dots with scroll position on mobile
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollPosition = container.scrollLeft;
        const itemWidth = container.offsetWidth * 0.8; // Approximate item width on mobile
        const newIndex = Math.round(scrollPosition / itemWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < products.length) {
            setCurrentIndex(newIndex);
        }
    };
    
    // Memoize formatted products for performance and clean code
    const products = React.useMemo(() => {
        if (initialProducts && initialProducts.length > 0) {
            return initialProducts.map(p => {
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
                    modelUrl: p.modelUrl,
                    soldCount: p.soldCount
                };
            });
        }
        return [
            { id: "p1", name: "Forest Bloom", price: "Rp 185.000", image: "/images/forest-bloom.png", stock: 5, description: "Buket rajut premium dengan nuansa hutan.", modelUrl: null, soldCount: 0 },
            { id: "p2", name: "Pastel Dream", price: "Rp 210.000", image: "/images/pastel-dream.png", stock: 2, description: "Kombinasi warna pastel yang elegan.", modelUrl: null, soldCount: 0 },
            { id: "p3", name: "Red Romance", price: "Rp 195.000", image: "/images/red-romance.png", stock: 8, description: "Mawar merah klasik untuk orang tersayang.", modelUrl: null, soldCount: 0 },
        ];
    }, [initialProducts]);

    const next = () => {
        const newIndex = (currentIndex + 1) % products.length;
        setCurrentIndex(newIndex);
        if (window.innerWidth < 768 && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: newIndex * (scrollContainerRef.current.offsetWidth * 0.8),
                behavior: 'smooth'
            });
        }
    };

    const prev = () => {
        const newIndex = (currentIndex - 1 + products.length) % products.length;
        setCurrentIndex(newIndex);
        if (window.innerWidth < 768 && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: newIndex * (scrollContainerRef.current.offsetWidth * 0.8),
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="bg-cream py-24 px-0 md:px-8 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 md:px-0">
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
                    {/* Mobile: Native Scroll Snap | Desktop: Framer Motion Drag */}
                    <div 
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className={cn(
                            "flex items-center gap-6 md:gap-12 transition-all duration-500",
                            "overflow-x-auto snap-x snap-mandatory scrollbar-hide px-8 pb-8 md:overflow-visible md:snap-none md:justify-center md:px-0 md:pb-0"
                        )}
                    >
                        <AnimatePresence mode="popLayout" initial={false}>
                            {products.map((product, index) => {
                                const isActive = index === currentIndex;
                                const isPrev = index === (currentIndex - 1 + products.length) % products.length;
                                const isNext = index === (currentIndex + 1) % products.length;

                                return (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ 
                                            opacity: isActive ? 1 : 0.4,
                                            scale: isActive ? 1.05 : 0.85,
                                            zIndex: isActive ? 20 : 10,
                                            x: isMounted && window.innerWidth >= 768 ? (isActive ? 0 : (isPrev ? -20 : 20)) : 0,
                                            filter: isActive ? 'blur(0px)' : 'blur(2px)'
                                        }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ 
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }}
                                        className={cn(
                                            "w-[80vw] max-w-[300px] md:w-full md:max-w-[340px] shrink-0 snap-center",
                                            !isActive && "md:block hidden"
                                        )}
                                        drag={isMounted && window.innerWidth >= 768 ? "x" : false}
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={(_, info) => {
                                            if (info.offset.x < -50) next();
                                            else if (info.offset.x > 50) prev();
                                        }}
                                    >
                                        <ProductCard
                                            name={product.name}
                                            price={product.price}
                                            image={product.image}
                                            stock={product.stock}
                                            description={product.description}
                                            hasAR={!!product.modelUrl}
                                            modelUrl={product.modelUrl || undefined}
                                            soldCount={product.soldCount}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                    
                    {/* Snake Dots Navigation */}
                    <div className="flex justify-center items-center gap-3 mt-16">
                        {products.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setCurrentIndex(i);
                                    if (scrollContainerRef.current) {
                                        scrollContainerRef.current.scrollTo({
                                            left: i * (scrollContainerRef.current.offsetWidth * 0.8),
                                            behavior: 'smooth'
                                        });
                                    }
                                }}
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
