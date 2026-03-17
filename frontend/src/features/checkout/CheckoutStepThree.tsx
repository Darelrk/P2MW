import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import type { PaymentMethod } from "./useCheckout";

interface CheckoutStepThreeProps {
    value: string;
    onChange: (val: string) => void;
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (val: PaymentMethod) => void;
    onNext: (e: React.FormEvent) => void;
    onBack: () => void;
    isSubmitting?: boolean;
}

const PAYMENT_OPTIONS: { key: PaymentMethod; label: string; emoji: string; desc: string }[] = [
    { key: "full", label: "Lunas di Muka", emoji: "💰", desc: "Bayar 100% sekarang — langsung diproses." },
    { key: "dp", label: "DP 50%", emoji: "🤝", desc: "Bayar setengah dulu, sisanya saat produk siap." },
    { key: "final", label: "Bayar di Akhir", emoji: "📦", desc: "Bayar penuh saat produk diserahkan." },
];

export function CheckoutStepThree({
    value, onChange,
    paymentMethod, onPaymentMethodChange,
    onNext, onBack,
    isSubmitting = false,
}: CheckoutStepThreeProps) {
    return (
        <motion.div
            key="step3"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
        >
            <div className="mb-6">
                <span className="mb-3 inline-block rounded-full border border-terracotta/20 bg-terracotta/10 px-4 py-1.5 font-body text-xs font-bold tracking-widest text-terracotta">
                    LANGKAH 3/3
                </span>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-forest leading-tight">
                    Atur penyerahan <br />
                    <span className="font-body font-light italic text-forest/70 text-2xl lg:text-3xl">& metode bayar:</span>
                </h1>
            </div>

            <form onSubmit={onNext} className="space-y-6">
                {/* Duration Selection */}
                <div>
                    <p className="font-body text-xs font-bold uppercase tracking-widest text-forest/40 mb-3">Durasi Penyerahan</p>
                    <div className="grid grid-cols-2 gap-3">
                        <label
                            onClick={() => onChange("Ekspres")}
                            className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${value === "Ekspres" ? "border-terracotta bg-white/60 shadow-md shadow-terracotta/5" : "border-forest/10 bg-white/20 hover:bg-white/40 hover:border-forest/20"}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-lg">⚡</div>
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${value === "Ekspres" ? "border-terracotta bg-terracotta" : "border-forest/20 bg-transparent"}`}>
                                    {value === "Ekspres" && (
                                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <p className="font-display text-base font-bold text-forest">Ekspres</p>
                            <p className="font-body text-xs text-forest/50">3 Jam</p>
                        </label>

                        <label
                            onClick={() => onChange("Santai")}
                            className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${value === "Santai" ? "border-terracotta bg-white/60 shadow-md shadow-terracotta/5" : "border-forest/10 bg-white/20 hover:bg-white/40 hover:border-forest/20"}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-lg">☕</div>
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 ${value === "Santai" ? "border-terracotta bg-terracotta" : "border-forest/20 bg-transparent"}`}>
                                    {value === "Santai" && (
                                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <p className="font-display text-base font-bold text-forest">Santai</p>
                            <p className="font-body text-xs text-forest/50">Esok hari</p>
                        </label>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                    <p className="font-body text-xs font-bold uppercase tracking-widest text-forest/40 mb-3">Metode Pembayaran</p>
                    <div className="space-y-3">
                        {PAYMENT_OPTIONS.map((opt) => (
                            <label
                                key={opt.key}
                                onClick={() => onPaymentMethodChange(opt.key)}
                                className={`group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border-2 p-4 transition-all duration-300 ${paymentMethod === opt.key ? "border-terracotta bg-white/60 shadow-md shadow-terracotta/5" : "border-forest/10 bg-white/20 hover:bg-white/40 hover:border-forest/20"}`}
                            >
                                <div className="text-2xl">{opt.emoji}</div>
                                <div className="flex-1">
                                    <p className="font-display text-sm font-bold text-forest">{opt.label}</p>
                                    <p className="font-body text-xs text-forest/50">{opt.desc}</p>
                                </div>
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0 ${paymentMethod === opt.key ? "border-terracotta bg-terracotta" : "border-forest/20 bg-transparent"}`}>
                                    {paymentMethod === opt.key && (
                                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4 sm:justify-end mt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="group flex items-center justify-center gap-2 rounded-full border-2 border-forest/10 bg-transparent px-8 py-4 font-body text-sm font-bold tracking-widest text-forest/70 transition-all hover:bg-forest/5 hover:text-forest"
                    >
                        KEMBALI
                    </button>
                    <button
                        type="submit"
                        disabled={!value || isSubmitting}
                        className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-forest px-8 py-4 font-body text-sm font-bold tracking-widest text-cream shadow-xl transition-all hover:bg-forest-light disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-2xl"
                    >
                        <span>{isSubmitting ? "MEMPROSES..." : "CHECKOUT VIA WHATSAPP"}</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-transform group-hover:scale-110">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                        </div>
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
