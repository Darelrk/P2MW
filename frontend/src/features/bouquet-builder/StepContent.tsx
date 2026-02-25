import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBouquetStore, type FlowerType, type FlowerColor, type WrapStyle } from "./store";
import { useCartStore } from "@/store/useCartStore";
import { stepperSlide } from "@/lib/animations";
import { cn } from "@/lib/cn";

/** Option data for each step */
const FLOWERS: { value: FlowerType; label: string; emoji: string }[] = [
    { value: "mawar", label: "Mawar", emoji: "🌹" },
    { value: "tulip", label: "Tulip", emoji: "🌷" },
    { value: "hydrangea", label: "Hydrangea", emoji: "💐" },
    { value: "lily", label: "Lily", emoji: "🌸" },
    { value: "daisy", label: "Daisy", emoji: "🌼" },
];

const COLORS: { value: FlowerColor; label: string; hex: string }[] = [
    { value: "merah", label: "Merah", hex: "#C94C4C" },
    { value: "pink", label: "Pink", hex: "#E8A0BF" },
    { value: "putih", label: "Putih", hex: "#FEFCFA" },
    { value: "kuning", label: "Kuning", hex: "#D4A574" },
    { value: "ungu", label: "Ungu", hex: "#9B59B6" },
];

const WRAPS: { value: WrapStyle; label: string; desc: string }[] = [
    { value: "kraft", label: "Kraft Paper", desc: "Klasik & ramah lingkungan" },
    { value: "satin", label: "Satin Wrap", desc: "Halus & mewah" },
    { value: "organza", label: "Organza Sheer", desc: "Transparan & elegan" },
    { value: "burlap", label: "Burlap Rustic", desc: "Unik & natural" },
];

/**
 * StepContent — Renders the correct option panel based on current step.
 * Uses AnimatePresence with slide transitions per animation_plan.md.
 */
import { FlowerConfetti } from "./FlowerConfetti";

export function StepContent() {
    const { step, flower, color, wrap, message,
        setFlower, setColor, setWrap, setMessage,
        nextStep, prevStep } = useBouquetStore();

    // Trigger confetti when reaching step 3 (Greeting Card)
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (step === 3) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    return (
        <div className="relative overflow-hidden rounded-3xl border border-forest/10 bg-white/50 p-6 shadow-card backdrop-blur-sm">
            <FlowerConfetti active={showConfetti} />
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    variants={stepperSlide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                >
                    {step === 0 && (
                        <div>
                            <h3 className="mb-4 font-display text-xl text-forest">Pilih Jenis Bunga</h3>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {FLOWERS.map((f) => (
                                    <button
                                        key={f.value}
                                        onClick={() => setFlower(f.value)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-150",
                                            flower === f.value
                                                ? "border-forest bg-forest/5 scale-[1.02]"
                                                : "border-transparent bg-cream-dark/50 hover:border-forest/20"
                                        )}
                                    >
                                        <span className="text-3xl">{f.emoji}</span>
                                        <span className="font-body text-sm font-medium text-forest">
                                            {f.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h3 className="mb-4 font-display text-xl text-forest">Pilih Warna</h3>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map((c) => (
                                    <button
                                        key={c.value}
                                        onClick={() => setColor(c.value)}
                                        className={cn(
                                            "group flex flex-col items-center gap-2 rounded-lg p-3 transition-all duration-150",
                                            color === c.value && "scale-[1.05]"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "h-12 w-12 rounded-full border-2 transition-all duration-200",
                                                color === c.value
                                                    ? "border-forest ring-2 ring-forest/30 ring-offset-2"
                                                    : "border-forest/10 hover:border-forest/30"
                                            )}
                                            style={{ backgroundColor: c.hex }}
                                        />
                                        <span className="font-body text-xs text-forest/70">{c.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="mb-4 font-display text-xl text-forest">Pilih Wrapping</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {WRAPS.map((w) => (
                                    <button
                                        key={w.value}
                                        onClick={() => setWrap(w.value)}
                                        className={cn(
                                            "rounded-lg border-2 p-4 text-left transition-all duration-150",
                                            wrap === w.value
                                                ? "border-forest bg-forest/5"
                                                : "border-transparent bg-cream-dark/50 hover:border-forest/20"
                                        )}
                                    >
                                        <span className="font-body text-base font-semibold text-forest">
                                            {w.label}
                                        </span>
                                        <p className="mt-1 font-body text-xs text-forest/50">{w.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h3 className="mb-4 font-display text-xl text-forest">Kartu Ucapan</h3>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tulis pesan spesialmu di sini... (opsional)"
                                rows={4}
                                className={cn(
                                    "w-full rounded-xl border-2 border-forest/15 bg-white p-4 shadow-inner",
                                    "font-body text-sm text-forest placeholder:text-forest/30",
                                    "resize-none focus:border-forest/40 focus:outline-none focus:ring-4 focus:ring-forest/10 transition-all"
                                )}
                                maxLength={200}
                            />
                            <p className="mt-1 text-right font-body text-xs text-forest/50">
                                {message.length}/200
                            </p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={prevStep}
                    disabled={step === 0}
                    className={cn(
                        "rounded-lg border-2 px-5 py-2 font-body text-sm font-medium transition-all",
                        step === 0
                            ? "border-transparent text-forest/20 cursor-not-allowed"
                            : "border-forest/10 text-forest hover:border-forest/30 hover:bg-forest/5"
                    )}
                >
                    Kembali
                </button>

                {step < 3 ? (
                    <button
                        onClick={nextStep}
                        disabled={
                            (step === 0 && !flower) ||
                            (step === 1 && !color) ||
                            (step === 2 && !wrap)
                        }
                        className={cn(
                            "rounded-lg bg-forest px-5 py-2.5 font-body text-sm font-semibold text-cream transition-all",
                            "disabled:opacity-40 disabled:cursor-not-allowed",
                            "hover:bg-forest-light"
                        )}
                    >
                        Lanjut
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            if (!flower || !color || !wrap) return;

                            // Using a fixed placeholder price for custom bouquets.
                            const customPrice = 350000;

                            const { addItem } = useCartStore.getState();

                            addItem({
                                id: `custom-${Date.now()}`,
                                type: "custom",
                                name: "Buket Rakitan Sendiri",
                                price: customPrice,
                                customDetails: {
                                    flower,
                                    color,
                                    wrap,
                                    message,
                                }
                            });

                            import("sonner").then(({ toast }) => {
                                toast.success("Karya Anda berhasil disimpan", {
                                    description: "Buket Rakitan Sendiri telah masuk ke keranjang belanja Anda.",
                                    icon: "✨"
                                });
                            });

                            // Reset builder
                            useBouquetStore.getState().reset();
                        }}
                        className={cn(
                            "rounded-lg bg-terracotta px-6 py-2.5 font-body text-sm font-bold text-white transition-all",
                            "hover:brightness-110"
                        )}
                    >
                        Pesan Sekarang
                    </button>
                )}
            </div>
        </div>
    );
}
