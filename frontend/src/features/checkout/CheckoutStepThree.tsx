import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

interface CheckoutStepThreeProps {
    onNext: (e: React.FormEvent) => void;
    onBack: () => void;
}

export function CheckoutStepThree({ onNext, onBack }: CheckoutStepThreeProps) {
    return (
        <motion.div
            key="step3"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-forest mb-6">
                Pilih durasi pembuatan:
            </h1>
            <form onSubmit={onNext} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex cursor-pointer items-center justify-between rounded-2xl border-2 border-terracotta bg-terracotta/5 p-6 transition-colors hover:bg-terracotta/10">
                        <div>
                            <p className="font-body text-lg font-bold text-forest">Ekspres</p>
                            <p className="font-body text-sm text-forest/60">Selesai dalam 3 Jam</p>
                        </div>
                        <div className="h-6 w-6 rounded-full border-4 border-terracotta bg-cream"></div>
                    </label>
                    <label className="flex cursor-pointer border-forest/10 items-center justify-between rounded-2xl border-2 p-6 transition-colors hover:bg-forest/5">
                        <div>
                            <p className="font-body text-lg font-bold text-forest">Santai</p>
                            <p className="font-body text-sm text-forest/60">Selesai Besok</p>
                        </div>
                        <div className="h-6 w-6 rounded-full border-2 border-forest/20 bg-transparent"></div>
                    </label>
                </div>
                <div className="flex gap-4">
                    <button type="button" onClick={onBack} className="rounded-xl border border-forest/20 px-8 py-4 font-body text-sm font-bold tracking-widest text-forest transition-colors hover:bg-forest/5">
                        KEMBALI
                    </button>
                    <button type="submit" className="rounded-xl bg-forest px-8 py-4 font-body text-sm font-bold tracking-widest text-cream shadow-xl transition-transform hover:-translate-y-1">
                        BAYAR SEKARANG
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
