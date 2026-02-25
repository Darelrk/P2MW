import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

interface CheckoutStepOneProps {
    value: string;
    onChange: (val: string) => void;
    onNext: (e: React.FormEvent) => void;
}

export function CheckoutStepOne({ value, onChange, onNext }: CheckoutStepOneProps) {
    return (
        <motion.div
            key="step1"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
        >
            <div className="mb-8">
                <span className="mb-3 inline-block rounded-full border border-terracotta/20 bg-terracotta/10 px-4 py-1.5 font-body text-xs font-bold tracking-widest text-terracotta">
                    LANGKAH 1/3
                </span>
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-forest leading-tight">
                    Halo! <br />
                    <span className="font-body font-light italic text-forest/70 text-3xl lg:text-4xl">Siapa nama Anda?</span>
                </h1>
            </div>

            <form onSubmit={onNext} className="space-y-8">
                <div className="group relative rounded-2xl bg-white/40 p-1 ring-1 ring-forest/10 transition-all focus-within:bg-white focus-within:ring-forest/30 focus-within:shadow-xl hover:ring-forest/20 backdrop-blur-sm">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-forest/20 transition-colors group-focus-within:text-terracotta">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        autoFocus
                        required
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Ketik nama lengkap Anda..."
                        className="w-full bg-transparent py-5 pl-16 pr-6 font-body text-xl text-forest placeholder-forest/30 outline-none transition-all"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={value.trim() === ""}
                        className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-forest px-8 py-4 font-body text-sm font-bold tracking-widest text-cream shadow-xl transition-all hover:bg-forest-light disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-2xl"
                    >
                        <span>LANJUTKAN</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-forest transition-transform group-hover:translate-x-1">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
