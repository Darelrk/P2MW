import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

interface CheckoutStepTwoProps {
    onNext: (e: React.FormEvent) => void;
    onBack: () => void;
}

export function CheckoutStepTwo({ onNext, onBack }: CheckoutStepTwoProps) {
    return (
        <motion.div
            key="step2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-forest mb-6">
                Ke mana buket ini akan dikirim?
            </h1>
            <form onSubmit={onNext} className="space-y-6">
                <div className="relative">
                    <textarea
                        autoFocus
                        required
                        rows={3}
                        placeholder="Alamat lengkap penerima..."
                        className="w-full border-b-2 border-forest/20 bg-transparent py-4 font-body text-2xl text-forest placeholder-forest/30 outline-none transition-colors focus:border-terracotta resize-none"
                    />
                </div>
                <div className="flex gap-4">
                    <button type="button" onClick={onBack} className="rounded-xl border border-forest/20 px-8 py-4 font-body text-sm font-bold tracking-widest text-forest transition-colors hover:bg-forest/5">
                        KEMBALI
                    </button>
                    <button type="submit" className="rounded-xl bg-terracotta px-8 py-4 font-body text-sm font-bold tracking-widest text-white shadow-lg transition-transform hover:-translate-y-1">
                        LANJUT ↵
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
