"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * CountdownBadge — Premium urgency countdown to 17:00 cutoff.
 * Features: color shift when < 1hr, breathing pulse, sticky support.
 */
export function CountdownBadge() {
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, total: 0 });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
        setMounted(true);
        setTimeLeft(getTimeUntilCutoff());
        const interval = setInterval(() => {
            setTimeLeft(getTimeUntilCutoff());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return <div className="h-[82px] w-[340px] opacity-0" />; // Invisible layout placeholder
    }

    const isUrgent = timeLeft.total > 0 && timeLeft.hours === 0;
    const isClosed = timeLeft.total <= 0;

    if (isClosed) {
        return (
            <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-5 py-2.5 font-body text-sm text-forest/50">
                Pengiriman ekspres hari ini telah ditutup
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "inline-flex items-center gap-4 rounded-2xl border px-5 py-3 transition-colors duration-700",
                isUrgent
                    ? "border-red/30 bg-red/10"
                    : "border-terracotta/15 bg-terracotta/5"
            )}
        >
            {/* Pulsing icon */}
            <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Zap className={cn("h-5 w-5", isUrgent ? "text-red" : "text-terracotta")} />
            </motion.div>

            <span className="font-body text-sm text-forest/70">Pesan dalam</span>

            <div className="flex items-center gap-1.5">
                <DigitBlock value={timeLeft.hours} label="jam" isUrgent={isUrgent} />
                <Separator />
                <DigitBlock value={timeLeft.minutes} label="mnt" isUrgent={isUrgent} />
                <Separator />
                <DigitBlock value={timeLeft.seconds} label="dtk" isUrgent={isUrgent} />
            </div>

            <span className="font-body text-sm text-forest/70 hidden sm:inline">untuk jadi hari ini</span>
        </motion.div>
    );
}

function Separator() {
    return <span className="font-body text-lg font-bold text-forest/30 mx-0.5">:</span>;
}

function DigitBlock({ value, label, isUrgent }: { value: number; label: string; isUrgent: boolean }) {
    const display = String(value).padStart(2, "0");
    return (
        <div className="flex flex-col items-center">
            <div className={cn(
                "relative flex h-10 w-11 items-center justify-center overflow-hidden rounded-lg transition-colors duration-500",
                isUrgent ? "bg-red/10" : "bg-forest/5"
            )}>
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={display}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={cn(
                            "font-body text-lg font-bold tabular-nums",
                            isUrgent ? "text-red" : "text-forest"
                        )}
                    >
                        {display}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="mt-1 font-body text-[10px] font-bold uppercase tracking-wider text-forest/50">
                {label}
            </span>
        </div>
    );
}

function getTimeUntilCutoff() {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(17, 0, 0, 0);
    const diff = cutoff.getTime() - now.getTime();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, total: 0 };
    return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        total: diff,
    };
}
