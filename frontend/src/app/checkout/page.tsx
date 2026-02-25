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
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        duration: "Ekspres"
    });

    const router = useRouter();
    const { items, clearCart } = useCartStore();

    if (items.length === 0) {
        // Fallback for empty cart
        return (
            <main className="min-h-screen bg-cream-light pt-32 pb-24 overflow-hidden flex flex-col items-center justify-center">
                <Navbar />
                <h1 className="font-display text-4xl font-bold text-forest mb-4">Keranjang Anda Kosong</h1>
                <button onClick={() => router.push('/express')} className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-forest px-8 py-4 font-body text-sm font-bold tracking-widest text-cream shadow-xl transition-all hover:bg-forest-light hover:-translate-y-1 hover:shadow-2xl">
                    <span>KEMBALI KE KATALOG</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-forest transition-transform group-hover:translate-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </button>
            </main>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Final submit to WhatsApp
            const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const tax = totalPrice * 0.11;
            const grandTotal = totalPrice + tax;
            const dpAmount = grandTotal * 0.5;

            const orderDetails = items.map(item => `- ${item.quantity}x ${item.name} (Rp ${item.price.toLocaleString("id-ID")})`).join("\n");

            const waPhone = "6281234567890"; // Ganti dengan nomor asli AMOUREA
            const message = `Halo AMOUREA! Saya ingin memesan buket:

*Nama:* ${formData.name}
*Alamat Kelurahan/Kecamatan:* ${formData.address}
*Durasi:* ${formData.duration}

*Pesanan:*
${orderDetails}

*Subtotal:* Rp ${totalPrice.toLocaleString("id-ID")}
*PPN (11%):* Rp ${tax.toLocaleString("id-ID")}
*Total Keseluruhan:* Rp ${grandTotal.toLocaleString("id-ID")}

*DP 50%: Rp ${dpAmount.toLocaleString("id-ID")}*

Apakah pesanan ini bisa segera diproses? Terima kasih!`;

            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;

            toast.success("Mengarahkan ke WhatsApp...", {
                description: "Silakan selesaikan pesanan Anda dengan admin kami.",
                icon: "💬"
            });
            clearCart();

            setTimeout(() => {
                window.open(waUrl, '_blank');
                router.push("/");
            }, 1000);
        }
    };

    return (
        <main className="min-h-screen bg-cream-light pt-32 pb-24 overflow-hidden">
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 md:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left: Typeform-style Forms */}
                    <div className="flex flex-col justify-center min-h-[60vh] pb-10">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <CheckoutStepOne
                                    value={formData.name}
                                    onChange={(v) => setFormData({ ...formData, name: v })}
                                    onNext={handleSubmit}
                                />
                            )}

                            {step === 2 && (
                                <CheckoutStepTwo
                                    value={formData.address}
                                    onChange={(v) => setFormData({ ...formData, address: v })}
                                    onNext={handleSubmit}
                                    onBack={() => setStep(1)}
                                />
                            )}

                            {step === 3 && (
                                <CheckoutStepThree
                                    value={formData.duration}
                                    onChange={(v) => setFormData({ ...formData, duration: v })}
                                    onNext={handleSubmit}
                                    onBack={() => setStep(2)}
                                />
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
