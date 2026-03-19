import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { createOrder } from "@/actions/orderActions";
import { useBouquetStore } from "@/features/bouquet-builder/store";

export type PaymentMethod = "full" | "dp" | "final";

export function useCheckout() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("full");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        duration: "Ekspres"
    });

    const router = useRouter();
    const { items, clearCart } = useCartStore();

    const handleNextStep = () => setStep((s) => s + 1);
    const handlePrevStep = () => setStep((s) => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step < 3) {
            handleNextStep();
            return;
        }

        setIsSubmitting(true);

        try {
            // Calculate totals
            const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const grandTotal = totalPrice;
            const dpAmount = Math.round(grandTotal * 0.5);

            // 1. Save order to database FIRST
            const { data: order, error } = await createOrder({
                customerName: formData.name,
                customerPhone: formData.phone,
                customerAddress: formData.address,
                deliveryType: formData.duration,
                totalAmount: grandTotal,
                paymentMethod,
                items: items.map(item => ({
                    itemType: item.type,
                    productId: item.type === 'express' ? item.id : null,
                    customDetails: item.customDetails || null,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity,
                }))
            });

            if (error || !order) {
                toast.error(error || "Gagal menyimpan pesanan. Silakan coba lagi.");
                setIsSubmitting(false);
                return;
            }

            // 2. Build WhatsApp message (dynamic based on payment method)
            const orderDetails = items.map(item => {
                let text = `- ${item.quantity}x ${item.name} (Rp ${item.price.toLocaleString("id-ID")})`;
                if (item.type === 'custom' && item.customDetails) {
                    const d = item.customDetails;
                    text += `\n  [${d.flower}, ${d.color}, ${d.wrap}] Msg: ${d.message.substring(0, 20)}...`;
                }
                return text;
            }).join("\n");

            const paymentLabel =
                paymentMethod === "full" ? "Bayar Lunas di Muka" :
                paymentMethod === "dp" ? "Down Payment (DP 50%)" :
                "Bayar di Akhir (saat serah terima)";

            let paymentInfo = "";
            if (paymentMethod === "full") {
                paymentInfo = `*Metode:* ${paymentLabel}\n*Jumlah Transfer:* Rp ${grandTotal.toLocaleString("id-ID")}`;
            } else if (paymentMethod === "dp") {
                paymentInfo = `*Metode:* ${paymentLabel}\n*DP Sekarang:* Rp ${dpAmount.toLocaleString("id-ID")}\n*Sisa (saat selesai):* Rp ${(grandTotal - dpAmount).toLocaleString("id-ID")}`;
            } else {
                paymentInfo = `*Metode:* ${paymentLabel}\n*Total (dibayar saat serah terima):* Rp ${grandTotal.toLocaleString("id-ID")}`;
            }

            const waPhone = "6281234567890"; // Ganti dengan nomor asli AMOUREA
            const message = `Halo AMOUREA! Saya baru saja membuat pesanan di web.
---------------------------
ID Pesanan: #${order.orderNumber}
---------------------------

*Nama:* ${formData.name}
*No. HP:* ${formData.phone}
*Alamat:* ${formData.address}
*Durasi:* ${formData.duration}

*Pesanan:*
${orderDetails}

*Total:* Rp ${grandTotal.toLocaleString("id-ID")}

${paymentInfo}

Mohon info nomor rekening untuk konfirmasi pembayaran. Terima kasih! 💐`;

            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;

            // 3. Show success toast
            toast.success(`Pesanan #${order.orderNumber} berhasil dibuat!`, {
                description: "Mengarahkan ke WhatsApp untuk konfirmasi pembayaran.",
                icon: "💐"
            });

            // Save to localStorage for "Order Memory" feature
            localStorage.setItem('amourea_last_order', JSON.stringify({
                id: order.id,
                orderNumber: order.orderNumber,
                timestamp: new Date().toISOString(),
            }));

            clearCart();
            useBouquetStore.getState().reset();

            // 4. Redirect to WhatsApp, then to tracking page
            setTimeout(() => {
                window.open(waUrl, '_blank');
                router.push(`/orders/${order.id}`);
            }, 1000);

        } catch {
            toast.error("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        step,
        formData,
        setFormData,
        items,
        isSubmitting,
        paymentMethod,
        setPaymentMethod,
        handlePrevStep,
        handleSubmit,
        goBackToCatalog: () => router.push('/express')
    };
}
