"use client";

import { motion } from "framer-motion";
import { Heart, Leaf, Sparkles, Flame } from "lucide-react";
import { useBouquetStore, type FlowerType, type FlowerColor, type WrapStyle } from "./store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/cn";

interface Mood {
    key: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
    preset: {
        flower: FlowerType;
        color: FlowerColor;
        wrap: WrapStyle;
    };
}

const MOODS: Mood[] = [
    {
        key: "romantic",
        label: "Romantic",
        description: "Penuh cinta & kehangatan",
        icon: <Heart className="h-6 w-6" />,
        accent: "border-blush/40 bg-blush/10 text-blush hover:border-blush",
        preset: { flower: "mawar", color: "merah", wrap: "satin" },
    },
    {
        key: "minimalist",
        label: "Minimalis",
        description: "Simpel & elegan",
        icon: <Leaf className="h-6 w-6" />,
        accent: "border-sage/40 bg-sage/10 text-sage hover:border-sage",
        preset: { flower: "tulip", color: "putih", wrap: "kraft" },
    },
    {
        key: "elegant",
        label: "Elegan",
        description: "Mewah & berkelas",
        icon: <Sparkles className="h-6 w-6" />,
        accent: "border-terracotta/40 bg-terracotta/10 text-terracotta hover:border-terracotta",
        preset: { flower: "hydrangea", color: "ungu", wrap: "organza" },
    },
    {
        key: "bold",
        label: "Bold",
        description: "Berani & mencolok",
        icon: <Flame className="h-6 w-6" />,
        accent: "border-red/40 bg-red/10 text-red hover:border-red",
        preset: { flower: "lily", color: "kuning", wrap: "burlap" },
    },
];

/**
 * MoodSelector — Onboarding mood picker that auto-fills builder presets.
 * Appears once at the top of the Custom Builder page.
 */
export function MoodSelector() {
    const { setFlower, setColor, setWrap } = useBouquetStore(
        useShallow(state => ({ setFlower: state.setFlower, setColor: state.setColor, setWrap: state.setWrap }))
    );

    const applyPreset = (mood: Mood) => {
        setFlower(mood.preset.flower);
        setColor(mood.preset.color);
        setWrap(mood.preset.wrap);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-3xl border border-forest/5 bg-white/60 p-6 shadow-card backdrop-blur-sm"
        >
            <div className="mb-1 font-body text-xs font-bold uppercase tracking-widest text-forest/40">
                Mulai dari mood
            </div>
            <h3 className="mb-4 font-display text-xl font-bold text-forest">
                Pilih nuansa
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {MOODS.map((mood, i) => (
                    <motion.button
                        key={mood.key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => applyPreset(mood)}
                        className={cn(
                            "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-300",
                            mood.accent
                        )}
                    >
                        {mood.icon}
                        <span className="font-body text-sm font-bold">{mood.label}</span>
                        <span className="font-body text-[10px] text-forest/50 leading-tight text-center">
                            {mood.description}
                        </span>
                    </motion.button>
                ))}
            </div>

            <p className="mt-3 text-center font-body text-xs text-forest/40">
                Klik mood untuk auto-fill pilihan, lalu sesuaikan sesukamu.
            </p>
        </motion.div>
    );
}
