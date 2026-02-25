"use client";

import { useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useBouquetStore } from "./store";
import { layerSwap } from "@/lib/animations";
import { cn } from "@/lib/cn";

/**
 * Wrapping mappings for the preview layers.
 */

const WRAP_MAP: Record<string, { color: string; label: string }> = {
    kraft: { color: "#C8A96E", label: "Kraft" },
    satin: { color: "#D4A0B9", label: "Satin" },
    organza: { color: "rgba(255,255,255,0.4)", label: "Organza" },
    burlap: { color: "#A08060", label: "Burlap" },
};

/**
 * LayeredPreview — "Paper Doll" style visual preview.
 * Layers stack: wrapping (back) → flower (center) → ribbon (front).
 * Each layer fades in/out when user changes their selection.
 */
export function LayeredPreview() {
    const { flower, color, wrap } = useBouquetStore();

    // Parallax Tilt Setup
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const mouseXSpring = useSpring(x, springConfig);
    const mouseYSpring = useSpring(y, springConfig);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / rect.width - 0.5;
        const yPct = mouseY / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="sticky top-8" style={{ perspective: "1200px" }}>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className={cn(
                    "relative mx-auto flex aspect-[3/4] w-full max-w-xs items-center justify-center",
                    "overflow-hidden rounded-2xl border border-forest/8 bg-cream-dark/30 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-shadow duration-300 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                )}
            >
                {/* Layer 1: Wrapping (background) */}
                <AnimatePresence mode="wait">
                    {wrap && (
                        <motion.div
                            key={`wrap-${wrap}`}
                            variants={layerSwap}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute inset-0 z-0"
                            style={{ backgroundColor: WRAP_MAP[wrap]?.color, transform: "translateZ(0px)" }}
                        />
                    )}
                </AnimatePresence>

                {/* Layer 2: Flower (center) */}
                <AnimatePresence mode="wait">
                    {flower && (
                        <motion.div
                            key={`color-${color}`}
                            variants={layerSwap}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute inset-0 z-10"
                            style={{ transform: "translateZ(10px)" }}
                        >
                            <Image
                                src={`/images/layers/flower-${flower}.png`}
                                alt={flower}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 70vw, 30vw"
                                quality={65}
                                unoptimized={true}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty state */}
                {!flower && !color && !wrap && (
                    <div className="text-center" style={{ transform: "translateZ(20px)" }}>
                        <span className="text-4xl drop-shadow-xl">🌿</span>
                        <p className="mt-2 font-body text-sm text-forest/50">
                            Preview akan muncul di sini
                        </p>
                    </div>
                )}

                {/* Label overlay (Floats highest) */}
                {(flower || color || wrap) && (
                    <div
                        className="absolute bottom-4 left-4 right-4 z-20 rounded-xl bg-white/90 p-3 backdrop-blur-md shadow-lg border border-white/50"
                        style={{ transform: "translateZ(40px)" }}
                    >
                        <p className="font-body text-xs font-bold uppercase tracking-widest text-forest text-center">
                            {[
                                flower && `${flower.charAt(0).toUpperCase()}${flower.slice(1)}`,
                                color && `${color}`,
                                wrap && WRAP_MAP[wrap]?.label,
                            ]
                                .filter(Boolean)
                                .join(" · ")}
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
