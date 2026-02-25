"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Palette } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Carousel3D } from "./Carousel3D";

const GRAIN_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export function HeroSection() {
    return (
        <section className="relative flex flex-col justify-center overflow-hidden bg-forest px-4 py-20 pb-32 md:min-h-[90dvh] md:px-8 lg:px-16">
            <HeroBackground />

            <div className="relative z-10 mx-auto w-full max-w-7xl">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    {/* Left content: Headline */}
                    <div className="flex flex-col items-start text-left">
                        <HeroHeadline />

                        <div className="mt-12 flex w-full flex-col gap-4 sm:flex-row lg:max-w-xl">
                            <PathCard
                                title="Rakit Sendiri"
                                description="Pilih bunga, warna, dan wrapping sesuai seleramu."
                                href="/custom"
                                badge={
                                    <span className="inline-block rounded-full bg-cream/10 px-3 py-1 font-body text-xs font-semibold uppercase tracking-widest text-blush">
                                        Custom Builder
                                    </span>
                                }
                                icon={<Palette className="h-5 w-5" />}
                            />
                            <PathCard
                                title="Koleksi Cepat"
                                description="Buket siap pesan — jadi dalam 3 jam."
                                href="/express"
                                isExpress
                                badge={
                                    <span className="inline-block rounded-full bg-red/20 px-3 py-1 font-body text-xs font-bold uppercase tracking-widest text-red">
                                        Ekspres 3 Jam
                                    </span>
                                }
                                icon={<Zap className="h-5 w-5" />}
                            />
                        </div>
                    </div>

                    {/* Right content: 3D Showcase */}
                    <div className="relative flex justify-center lg:justify-end">
                        <Carousel3D />
                    </div>
                </div>
            </div>
        </section>
    );
}

function HeroBackground() {
    return (
        <>
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-bouquet.png"
                    alt="Buket rajutan premium"
                    fill
                    className="object-cover opacity-15"
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/50 to-forest/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-forest/80 via-forest/40 to-transparent" />
            </div>
            <div
                className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
                style={{ backgroundImage: `url('${GRAIN_SVG}')` }}
            />
            <div className="absolute bottom-0 left-0 right-0 z-[2] h-20 bg-gradient-to-t from-cream to-transparent" />
        </>
    );
}

function HeroHeadline() {
    return (
        <div
            className="animate-fade-up"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.3)" }}
        >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-1.5 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-blush" />
                <span className="font-body text-xs font-semibold tracking-wider text-white">
                    RAJUTAN TANGAN PREMIUM
                </span>
            </div>
            <h1 className="font-display text-4xl leading-[1.08] tracking-tight text-white md:text-5xl lg:text-6xl">
                Buket yang
                <br />
                <span className="text-blush drop-shadow-[0_2px_8px_rgba(232,160,191,0.5)]">Tak Layu</span>
            </h1>
            <p className="mt-5 max-w-md font-body text-base leading-relaxed text-white">
                Rajutan tangan premium. Bebas debu, anti alergi, dan abadi.
            </p>
        </div>
    );
}

interface PathCardProps {
    title: string;
    description: string;
    href: string;
    badge: React.ReactNode;
    icon: React.ReactNode;
    isExpress?: boolean;
}

import { revealScroll } from "@/lib/animations";

function PathCard({ title, description, href, badge, icon, isExpress }: PathCardProps) {
    return (
        <motion.a
            href={href}
            variants={revealScroll}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "group relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl p-6 transition-all duration-300",
                isExpress
                    ? "border border-red/40 bg-red/20 backdrop-blur-md hover:border-red/50 hover:bg-red/25 shadow-red/20 shadow-xl"
                    : "border border-white/20 bg-white/10 backdrop-blur-md hover:border-white/30 hover:bg-white/15 shadow-black/20 shadow-xl",
                "hover:shadow-2xl hover:-translate-y-1"
            )}
        >
            <div
                className={cn(
                    "absolute h-28 w-28 rounded-full blur-3xl transition-all duration-500 opacity-50",
                    isExpress
                        ? "-left-8 -bottom-8 bg-red/20 group-hover:bg-red/30"
                        : "-right-10 -top-10 h-32 w-32 bg-blush/20 group-hover:bg-blush/30"
                )}
            />
            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    {badge}
                    <div className="animate-float text-white/50 group-hover:text-white transition-colors">
                        {icon}
                    </div>
                </div>
                <h2 className="mt-3 font-display text-2xl text-white">{title}</h2>
                <p className="mt-1.5 font-body text-sm leading-relaxed text-white/80">
                    {description}
                </p>
            </div>
            <div
                className={cn(
                    "relative z-10 mt-6 inline-flex items-center gap-2 font-body text-sm text-white transition-all group-hover:gap-3",
                    isExpress ? "font-bold" : "font-semibold"
                )}
            >
                {isExpress ? "Pesan Sekarang" : "Mulai Merakit"}
                <ArrowRight className="h-4 w-4" />
            </div>
        </motion.a>
    );
}
