"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveReceipt } from "@/components/ui/InteractiveReceipt";
import { fadeUp } from "@/lib/animations";
import { Navbar } from "@/components/ui/Navbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const { items, clearCart } = useCartStore();

    if (items.length === 0) {
        // Fallback for empty cart
        return (
            <main className="min-h-screen bg-cream-light pt-32 pb-24 overflow-hidden flex flex-col items-center justify-center">
                <Navbar />
                <h1 className="font-display text-4xl font-bold text-forest mb-4">Keranjang Anda Kosong</h1>
                <button onClick={() => router.push('/express')} className="rounded-xl bg-terracotta px-8 py-4 font-body text-sm font-bold tracking-widest text-white shadow-lg transition-transform hover:-translate-y-1">
                    KEMBALI KE KATALOG
                </button>
            </main>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Final submit
            toast.success("Pesanan Berhasil!", {
                description: "Silakan periksa email Anda untuk rincian pembayaran.",
                icon: "🎉"
            });
            clearCart();
            // Simulate redirect after 2s
            setTimeout(() => {
                router.push("/");
            }, 2000);
        }
    };

    return (
        <main className="min-h-screen bg-cream-light pt-32 pb-24 overflow-hidden">
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 md:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left: Typeform-style Forms */}
                    <div className="flex flex-col justify-center min-h-[60vh]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
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
                                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            )}

                            {step === 2 && (
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
                                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                            <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-forest/20 px-8 py-4 font-body text-sm font-bold tracking-widest text-forest transition-colors hover:bg-forest/5">
                                                KEMBALI
                                            </button>
                                            <button type="submit" className="rounded-xl bg-terracotta px-8 py-4 font-body text-sm font-bold tracking-widest text-white shadow-lg transition-transform hover:-translate-y-1">
                                                LANJUT ↵
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 3 && (
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
                                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                            <button type="button" onClick={() => setStep(2)} className="rounded-xl border border-forest/20 px-8 py-4 font-body text-sm font-bold tracking-widest text-forest transition-colors hover:bg-forest/5">
                                                KEMBALI
                                            </button>
                                            <button type="submit" className="rounded-xl bg-forest px-8 py-4 font-body text-sm font-bold tracking-widest text-cream shadow-xl transition-transform hover:-translate-y-1">
                                                BAYAR SEKARANG
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: Interactive Receipt */}
                    <div className="flex justify-center items-center lg:justify-end">
                        <InteractiveReceipt />
                    </div>
                </div>
            </div>
        </main>
    );
}
