import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

interface CheckoutStepThreeProps {
    value: string;
    onChange: (val: string) => void;
    onNext: (e: React.FormEvent) => void;
    onBack: () => void;
}

export function CheckoutStepThree({ value, onChange, onNext, onBack }: CheckoutStepThreeProps) {
    return (
        <motion.div
            key="step3"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
        >
            <div className="mb-8">
                <span className="mb-3 inline-block rounded-full border border-terracotta/20 bg-terracotta/10 px-4 py-1.5 font-body text-xs font-bold tracking-widest text-terracotta">
                    LANGKAH 3/3
                </span>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-forest leading-tight">
                    Pilih durasi <br />
                    <span className="font-body font-light italic text-forest/70 text-3xl lg:text-4xl">penyerahan:</span>
                </h1>
            </div>

            <form onSubmit={onNext} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                        onClick={() => onChange("Ekspres")}
                        className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${value === "Ekspres" ? "border-terracotta bg-white/60 shadow-lg shadow-terracotta/5" : "border-forest/10 bg-white/20 hover:bg-white/40 hover:border-forest/20"}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/5 text-forest/50 group-hover:bg-terracotta/10 group-hover:text-terracotta transition-colors">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${value === "Ekspres" ? "border-terracotta bg-terracotta" : "border-forest/20 bg-transparent"}`}>
                                {value === "Ekspres" && (
                                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="font-display text-xl font-bold text-forest">Ekspres ⚡</p>
                            <p className="mt-1 font-body text-sm text-forest/60">Selesai dalam 3 Jam. (+ Rp 0)</p>
                        </div>
                    </label>

                    <label
                        onClick={() => onChange("Santai")}
                        className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${value === "Santai" ? "border-terracotta bg-white/60 shadow-lg shadow-terracotta/5" : "border-forest/10 bg-white/20 hover:bg-white/40 hover:border-forest/20"}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/5 text-forest/50 group-hover:bg-forest/10 group-hover:text-forest transition-colors">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${value === "Santai" ? "border-terracotta bg-terracotta" : "border-forest/20 bg-transparent"}`}>
                                {value === "Santai" && (
                                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="font-display text-xl font-bold text-forest">Santai ☕</p>
                            <p className="mt-1 font-body text-sm text-forest/60">Sambut esok hari dengan sabar.</p>
                        </div>
                    </label>
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
                        disabled={!value}
                        className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full bg-forest px-8 py-4 font-body text-sm font-bold tracking-widest text-cream shadow-xl transition-all hover:bg-forest-light disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-2xl"
                    >
                        <span>CHECKOUT VIA WHATSAPP</span>
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
