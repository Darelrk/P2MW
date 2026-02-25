"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const PETAL_EMOJIS = ["🌸", "🌹", "🌷", "💐", "✨", "💖"];

interface Petal {
    id: number;
    emoji: string;
    x: number;
    duration: number;
    delay: number;
    rotation: number;
}

export function FlowerConfetti({ active }: { active: boolean }) {
    const [petals, setPetals] = useState<Petal[]>([]);

    useEffect(() => {
        if (active) {
            const newPetals = Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                emoji: PETAL_EMOJIS[Math.floor(Math.random() * PETAL_EMOJIS.length)],
                x: Math.random() * 100, // percentage
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 2,
                rotation: 360 * (Math.random() > 0.5 ? 1 : -1)
            }));
            // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
            setPetals(newPetals);

            // Auto-cleanup after 5s
            const timer = setTimeout(() => setPetals([]), 6000);
            return () => clearTimeout(timer);
        } else {
            setPetals([]);
        }
    }, [active]);

    return (
        <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
            <AnimatePresence>
                {petals.map((petal) => (
                    <motion.div
                        key={petal.id}
                        initial={{ y: -50, x: `${petal.x}vw`, opacity: 0, rotate: 0 }}
                        animate={{
                            y: "110vh",
                            opacity: [0, 1, 1, 0],
                            rotate: petal.rotation
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: petal.duration,
                            delay: petal.delay,
                            ease: "linear"
                        }}
                        className="absolute text-2xl"
                    >
                        {petal.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
