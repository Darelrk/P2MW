"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Cek jika splash screen sudah pernah muncul di sesi ini
        const hasSeenSplash = sessionStorage.getItem("AMOUREA_splash_seen");
        if (hasSeenSplash) {
            // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
            setIsVisible(false);
            return;
        }

        // Jalankan timer untuk menutup splash screen setelah presentasi selesai
        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem("AMOUREA_splash_seen", "true");
        }, 2600);

        return () => clearTimeout(timer);
    }, []);

    // Hindari hydration mismatch saat SSR
    const [mounted, setMounted] = useState(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="splash"
                    initial={{ y: 0 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-forest text-cream overflow-hidden"
                >
                    {/* Decorative subtle background elements */}
                    <div
                        className="absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
                    />

                    <div className="relative flex flex-col items-center z-10">
                        {/* Animated SVG Flower */}
                        <motion.svg
                            width="90"
                            height="90"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--color-blush)"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mb-8"
                        >
                            {/* Stem & Leaves */}
                            <motion.path
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                d="M12 22V12M12 12C12 12 15 7 18 8C20 8.6 20 12 17 14C14 16 12 12 12 12ZM12 12C12 12 9 7 6 8C4 8.6 4 12 7 14C10 16 12 12 12 12ZM12 12C12 12 14 10 16 12C18 14 16 18 12 20C8 18 6 14 8 12C10 10 12 12 12 12Z"
                            />
                        </motion.svg>

                        {/* Typographic Reveal */}
                        <div className="overflow-hidden">
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ delay: 1.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                className="relative w-64 h-16 md:w-80 md:h-20 flex items-center mx-auto overflow-hidden"
                            >
                                <Image
                                    src="/logo.svg"
                                    alt="AMOUREA Logo"
                                    fill
                                    className="object-cover object-center scale-125 origin-center"
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Subtitle Fade In */}
                        <motion.p
                            initial={{ opacity: 0, filter: "blur(4px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            className="font-body text-xs text-cream/60 tracking-[0.2em] font-medium uppercase mt-4"
                        >
                            Rangkai Kenangan Manismu
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
