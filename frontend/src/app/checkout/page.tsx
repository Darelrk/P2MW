"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { InteractiveReceipt } from "@/components/ui/InteractiveReceipt";
import { Navbar } from "@/components/ui/Navbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { CheckoutStepOne } from "@/features/checkout/CheckoutStepOne";
import { CheckoutStepTwo } from "@/features/checkout/CheckoutStepTwo";
import { CheckoutStepThree } from "@/features/checkout/CheckoutStepThree";

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
                                <CheckoutStepOne onNext={handleSubmit} />
                            )}

                            {step === 2 && (
                                <CheckoutStepTwo onNext={handleSubmit} onBack={() => setStep(1)} />
                            )}

                            {step === 3 && (
                                <CheckoutStepThree onNext={handleSubmit} onBack={() => setStep(2)} />
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
