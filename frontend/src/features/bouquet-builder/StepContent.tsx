import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBouquetStore, type FlowerType, type FlowerColor, type WrapStyle } from "./store";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "@/store/useCartStore";
import { stepperSlide } from "@/lib/animations";
import { cn } from "@/lib/cn";

// Helper mapping for emojis and hex colors for UI
const FLOWER_EMOJIS: Record<string, string> = {
    mawar: "🌹",
    tulip: "🌷",
    hydrangea: "💐",
    lily: "🌸",
    daisy: "🌼",
};

const COLOR_HEX: Record<string, string> = {
    merah: "#C94C4C",
    pink: "#E8A0BF",
    putih: "#FEFCFA",
    kuning: "#D4A574",
    ungu: "#9B59B6",
};

const WRAP_DESC: Record<string, string> = {
    kraft: "Klasik & ramah lingkungan",
    satin: "Halus & mewah",
    organza: "Transparan & elegan",
    burlap: "Unik & natural",
};

/**
 * StepContent — Renders the correct option panel based on current step.
 * Uses AnimatePresence with slide transitions per animation_plan.md.
 */
import { FlowerConfetti } from "./FlowerConfetti";

export function StepContent() {
    const { step, flower, color, wrap, message, dbOptions,
        setFlower, setColor, setWrap, setMessage,
        nextStep, prevStep } = useBouquetStore(useShallow(state => ({
            step: state.step, dbOptions: state.dbOptions, flower: state.flower, color: state.color, wrap: state.wrap, message: state.message,
            setFlower: state.setFlower, setColor: state.setColor, setWrap: state.setWrap, setMessage: state.setMessage, nextStep: state.nextStep, prevStep: state.prevStep
        })));

    // Derived filtered arrays from DB
    const flowersDb = dbOptions.filter(opt => opt.category === "flower");
    const colorsDb = dbOptions.filter(opt => opt.category === "color");
    const wrapsDb = dbOptions.filter(opt => opt.category === "wrapper");

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
                                {flowersDb.map((f) => (
                                    <button
                                        key={f.name}
                                        onClick={() => setFlower(f.name as FlowerType)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-150 relative",
                                            flower === f.name
                                                ? "border-forest bg-forest/5 scale-[1.02]"
                                                : "border-transparent bg-cream-dark/50 hover:border-forest/20"
                                        )}
                                    >
                                        <span className="text-3xl">{FLOWER_EMOJIS[f.name.toLowerCase()] || "🌸"}</span>
                                        <span className="font-body text-sm font-medium text-forest capitalize">
                                            {f.name}
                                        </span>
                                        {f.priceAdjustment > 0 && (
                                            <span className="text-[10px] text-forest/50 absolute bottom-1 right-2">
                                                +Rp{f.priceAdjustment / 1000}k
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <h3 className="mb-4 font-display text-xl text-forest">Pilih Warna</h3>
                            <div className="flex flex-wrap gap-3">
                                {colorsDb.map((c) => (
                                    <button
                                        key={c.name}
                                        onClick={() => setColor(c.name as FlowerColor)}
                                        className={cn(
                                            "group flex flex-col items-center gap-2 rounded-lg p-3 transition-all duration-150 relative",
                                            color === c.name && "scale-[1.05]"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "h-12 w-12 rounded-full border-2 transition-all duration-200",
                                                color === c.name
                                                    ? "border-forest ring-2 ring-forest/30 ring-offset-2"
                                                    : "border-forest/10 hover:border-forest/30"
                                            )}
                                            style={{ backgroundColor: COLOR_HEX[c.name.toLowerCase()] || "#ccc" }}
                                        />
                                        <span className="font-body text-xs text-forest/70 capitalize">{c.name}</span>
                                        {c.priceAdjustment > 0 && (
                                            <span className="text-[10px] text-forest/50 mt-[-4px]">
                                                +Rp{c.priceAdjustment / 1000}k
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h3 className="mb-4 font-display text-xl text-forest">Pilih Wrapping</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {wrapsDb.map((w) => (
                                    <button
                                        key={w.name}
                                        onClick={() => setWrap(w.name as WrapStyle)}
                                        className={cn(
                                            "rounded-lg border-2 p-4 text-left transition-all duration-150 relative",
                                            wrap === w.name
                                                ? "border-forest bg-forest/5"
                                                : "border-transparent bg-cream-dark/50 hover:border-forest/20"
                                        )}
                                    >
                                        <span className="font-body text-base font-semibold text-forest capitalize">
                                            {w.name} Wrap
                                        </span>
                                        <p className="mt-1 font-body text-xs text-forest/50">
                                            {WRAP_DESC[w.name.toLowerCase()] || "Pilihan premium"}
                                        </p>
                                        {w.priceAdjustment > 0 && (
                                            <span className="text-[10px] text-forest/50 absolute top-2 right-2">
                                                +Rp{w.priceAdjustment / 1000}k
                                            </span>
                                        )}
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

                            // Find adjustments from DB
                            const flowerAdj = dbOptions.find(o => o.category === "flower" && o.name === flower)?.priceAdjustment || 0;
                            const colorAdj = dbOptions.find(o => o.category === "color" && o.name === color)?.priceAdjustment || 0;
                            const wrapAdj = dbOptions.find(o => o.category === "wrapper" && o.name === wrap)?.priceAdjustment || 0;

                            // Calculate dynamic price based on Base Custom Bouqet Price + Selected Options Adjustments
                            const baseCustomPrice = 150000;
                            const finalPrice = baseCustomPrice + flowerAdj + colorAdj + wrapAdj;

                            const { addItem } = useCartStore.getState();

                            addItem({
                                id: `custom-${Date.now()}`,
                                type: "custom",
                                name: "Buket Rakitan Sendiri",
                                price: finalPrice,
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
