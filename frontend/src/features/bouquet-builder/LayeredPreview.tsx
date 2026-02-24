"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useBouquetStore } from "./store";
import { layerSwap } from "@/lib/animations";
import { cn } from "@/lib/cn";

/**
 * Color mappings for the preview layers.
 */
const COLOR_MAP: Record<string, string> = {
    merah: "#C94C4C",
    pink: "#E8A0BF",
    putih: "#FEFCFA",
    kuning: "#D4A574",
    ungu: "#9B59B6",
};

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

    return (
        <div className="sticky top-8">
            <div
                className={cn(
                    "relative mx-auto flex aspect-[3/4] w-full max-w-xs items-center justify-center",
                    "overflow-hidden rounded-2xl border border-forest/8 bg-cream-dark/30"
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
                            style={{ backgroundColor: WRAP_MAP[wrap]?.color }}
                        />
                    )}
                </AnimatePresence>

                {/* Layer 2: Flower color (center circle) */}
                <AnimatePresence mode="wait">
                    {color && (
                        <motion.div
                            key={`color-${color}`}
                            variants={layerSwap}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute z-10 flex h-32 w-32 items-center justify-center rounded-full"
                            style={{ backgroundColor: COLOR_MAP[color] || "#ccc" }}
                        >
                            <span className="text-5xl">
                                {flower === "mawar" && "🌹"}
                                {flower === "tulip" && "🌷"}
                                {flower === "hydrangea" && "💐"}
                                {flower === "lily" && "🌸"}
                                {flower === "daisy" && "🌼"}
                                {!flower && "🌿"}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty state */}
                {!flower && !color && !wrap && (
                    <div className="text-center">
                        <span className="text-4xl">🌿</span>
                        <p className="mt-2 font-body text-sm text-forest/50">
                            Preview akan muncul di sini
                        </p>
                    </div>
                )}

                {/* Label overlay */}
                {(flower || color || wrap) && (
                    <div className="absolute bottom-3 left-3 right-3 z-20 rounded-lg bg-white/80 p-2 backdrop-blur-sm">
                        <p className="font-body text-xs text-forest/70 text-center">
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
            </div>
        </div>
    );
}
