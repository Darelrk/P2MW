import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

interface CheckoutStepOneProps {
    onNext: (e: React.FormEvent) => void;
}

export function CheckoutStepOne({ onNext }: CheckoutStepOneProps) {
    return (
        <motion.div
            key="step1"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-forest mb-6">
                Halo! Siapa nama Anda?
            </h1>
            <form onSubmit={onNext} className="space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        autoFocus
                        required
                        placeholder="Ketik nama lengkap..."
                        className="w-full border-b-2 border-forest/20 bg-transparent py-4 font-body text-2xl text-forest placeholder-forest/30 outline-none transition-colors focus:border-terracotta"
                    />
                </div>
                <button type="submit" className="rounded-xl bg-terracotta px-8 py-4 font-body text-sm font-bold tracking-widest text-white shadow-lg transition-transform hover:-translate-y-1">
                    LANJUT ↵
                </button>
            </form>
        </motion.div>
    );
}
