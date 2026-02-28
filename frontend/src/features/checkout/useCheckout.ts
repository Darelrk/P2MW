import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";

export function useCheckout() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        duration: "Ekspres"
    });

    const router = useRouter();
    const { items, clearCart } = useCartStore();

    const handleNextStep = () => setStep((s) => s + 1);
    const handlePrevStep = () => setStep((s) => s - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (step < 3) {
            handleNextStep();
            return;
        }

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
    };

    return {
        step,
        formData,
        setFormData,
        items,
        handlePrevStep,
        handleSubmit,
        goBackToCatalog: () => router.push('/express')
    };
}
