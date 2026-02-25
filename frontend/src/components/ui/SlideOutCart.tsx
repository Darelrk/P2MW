"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { EmptyCartState } from "./cart/EmptyCartState";
import { CartItemRow } from "./cart/CartItemRow";

export function SlideOutCart() {
    const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
    const router = useRouter();

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        closeCart();
        router.push("/checkout");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-cream shadow-2xl flex flex-col sm:border-l sm:border-forest/10 overflow-hidden"
                    >
                        {/* Noise Overlay */}
                        <div
                            className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
                        />
                        {/* Header */}
                        <div className="relative z-10 flex items-center justify-between border-b border-forest/10 p-6 bg-cream/50 backdrop-blur-sm">
                            <h2 className="font-display text-2xl font-bold text-forest flex items-center gap-3">
                                <ShoppingBag className="h-6 w-6 text-terracotta" />
                                Keranjang ({items.length})
                            </h2>
                            <button
                                onClick={closeCart}
                                className="rounded-full p-2 text-forest/50 transition-colors hover:bg-forest/10 hover:text-forest"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="relative z-10 flex-1 overflow-y-auto p-6 scrollbar-none">
                            {items.length === 0 ? (
                                <EmptyCartState />
                            ) : (
                                <ul className="space-y-6">
                                    {items.map((item) => (
                                        <CartItemRow
                                            key={item.id}
                                            item={item}
                                            onUpdateQuantity={updateQuantity}
                                            onRemoveItem={removeItem}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Footer / Checkout Button */}
                        {items.length > 0 && (
                            <div className="relative z-10 border-t border-forest/10 bg-cream/80 backdrop-blur-md p-6 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-body text-sm text-forest/70 font-medium tracking-wide">TOTAL TAGIHAN</span>
                                    <span className="font-display text-2xl font-bold text-forest">
                                        Rp {totalPrice.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <button onClick={handleCheckout} className="group relative w-full overflow-hidden rounded-xl bg-forest py-4 font-body text-sm font-bold tracking-widest text-cream shadow-xl hover:bg-forest-light transition-all hover:shadow-2xl">
                                    <span className="relative z-10">LANJUTKAN KE PEMBAYARAN</span>
                                    <div className="absolute inset-0 z-0 h-full w-full translate-y-full bg-white/10 transition-transform duration-300 ease-out group-hover:translate-y-0" />
                                </button>
                                <p className="mt-4 text-center text-xs text-forest/40 flex justify-center items-center gap-2">
                                    <span className="grayscale opacity-50">🔒</span> Pembayaran aman dan terenkripsi
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
