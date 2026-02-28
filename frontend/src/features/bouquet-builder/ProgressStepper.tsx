"use client";

import { motion } from "framer-motion";
import { useBouquetStore } from "./store";
import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

const STEPS = [
    { label: "Bunga", number: "1" },
    { label: "Warna", number: "2" },
    { label: "Kertas", number: "3" },
    { label: "Pesan", number: "4" },
];

/**
 * ProgressStepper — Premium circular progress ring with micro-reward emojis.
 * Replaces the previous linear stepper with a more engaging, gamified design.
 */
export function ProgressStepper() {
    const step = useBouquetStore(state => state.step);
    const progress = ((step + 1) / STEPS.length) * 100;

    return (
        <div className="mb-8">
            {/* Progress Ring + Percentage */}
            <div className="flex items-center gap-6 mb-6">
                <ProgressRing progress={progress} step={step} />
                <div>
                    <p className="font-display text-2xl font-bold text-forest">
                        {Math.round(progress)}%
                    </p>
                    <p className="font-body text-xs text-forest/50">
                        Langkah {step + 1} dari {STEPS.length}
                    </p>
                </div>
            </div>

            {/* Step Pills */}
            <div className="flex items-center gap-2">
                {STEPS.map((s, i) => {
                    const isCurrent = i === step;
                    const isCompleted = i < step;
                    return (
                        <motion.div
                            key={s.label}
                            initial={false}
                            animate={{
                                opacity: isCurrent || isCompleted ? 1 : 0.4,
                                scale: isCurrent ? 1.05 : 1,
                            }}
                            className={cn(
                                "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs font-medium transition-colors duration-300 border",
                                isCurrent
                                    ? "border-forest bg-forest text-cream shadow-lg"
                                    : isCompleted
                                        ? "border-blush/30 bg-blush/10 text-forest"
                                        : "border-forest/10 bg-cream text-forest/40"
                            )}
                        >
                            {isCompleted ? (
                                <Check className="h-3 w-3" />
                            ) : (
                                <span className="font-bold">{s.number}</span>
                            )}
                            <span className="hidden sm:inline">{s.label}</span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   SVG Progress Ring
   ───────────────────────────────────────────── */
function ProgressRing({ progress, step }: { progress: number; step: number }) {
    const size = 64;
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--color-cream-dark)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress arc */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--color-blush)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    strokeDasharray={circumference}
                />
            </svg>
            {/* Center number */}
            <motion.span
                key={step}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="absolute font-display text-xl font-bold text-forest"
            >
                {STEPS[step]?.number ?? "1"}
            </motion.span>
        </div>
    );
}
