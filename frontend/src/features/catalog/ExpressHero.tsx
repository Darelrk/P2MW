"use client";

import { motion } from "framer-motion";
import { Zap, Clock, Truck } from "lucide-react";
import Image from "next/image";

/**
 * ExpressHero — Dramatic hero banner for the Express Catalog page.
 * Features gradient overlay, floating badge, and ambient glows.
 */
export function ExpressHero() {
    return (
        <section className="relative overflow-hidden bg-forest px-4 pt-28 pb-16 md:pt-36 md:pb-20 md:px-8">
            {/* Background image & gradient matching HeroSection */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/red-romance.png"
                    alt="Express collection"
                    fill
                    className="object-cover opacity-15"
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/50 to-forest/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-forest/80 via-forest/40 to-transparent" />
            </div>

            {/* Grain Noise matching HeroSection */}
            <div
                className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
                style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E')` }}
            />
            {/* Bottom transition gradient matching HeroSection */}
            <div className="absolute bottom-0 left-0 right-0 z-[2] h-20 bg-gradient-to-t from-cream to-transparent" />

            {/* Ambient glows */}
            <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-blush/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-terracotta/10 blur-[100px] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-6xl">
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
                    {/* Left: Title */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-red/20 px-4 py-1.5 mb-4 animate-fade-up">
                            <Zap className="h-4 w-4 text-red" />
                            <span className="font-body text-xs font-bold uppercase tracking-widest text-red">
                                Ekspres 3 Jam
                            </span>
                        </div>

                        <h1
                            className="font-display text-4xl font-bold text-cream md:text-5xl lg:text-6xl leading-tight animate-fade-up"
                            style={{ animationDelay: '100ms' }}
                        >
                            Koleksi <br />
                            <span className="text-blush">Cepat</span>
                        </h1>

                        <p
                            className="mt-4 max-w-md font-body text-base text-cream/60 animate-fade-up"
                            style={{ animationDelay: '200ms' }}
                        >
                            Buket rajutan premium. Tersedia dan siap dikirim dalam 3 jam.
                        </p>
                    </div>

                    {/* Right: Feature chips */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-3"
                    >
                        <FeatureChip icon={<Clock className="h-4 w-4" />} label="Jadi 3 Jam" />
                        <FeatureChip icon={<Truck className="h-4 w-4" />} label="6 Pilihan" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function FeatureChip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <span className="text-blush">{icon}</span>
            <span className="font-body text-xs font-medium text-cream/80">{label}</span>
        </div>
    );
}
