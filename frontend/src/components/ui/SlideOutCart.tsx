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
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[110] w-full max-w-md bg-cream shadow-2xl flex flex-col sm:border-l sm:border-forest/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-forest/10 p-6">
                            <h2 className="font-display text-2xl font-bold text-forest flex items-center gap-3">
                                <ShoppingBag className="h-6 w-6 text-terracotta" />
                                Keranjang ({items.length})
                            </h2>
                            <button
                                onClick={closeCart}
                                className="rounded-full p-2 text-forest/50 transition-colors hover:bg-forest/5 hover:text-forest"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
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
                            <div className="border-t border-forest/10 bg-white p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-body text-sm text-forest/70 font-medium tracking-wide">TOTAL TAGIHAN</span>
                                    <span className="font-display text-2xl font-bold text-forest">
                                        Rp {totalPrice.toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <button onClick={handleCheckout} className="w-full rounded-xl bg-forest py-4 font-body text-sm font-bold tracking-wider text-cream shadow-xl hover:bg-forest-light transition-all hover:-translate-y-1">
                                    LANJUTKAN KE PEMBAYARAN
                                </button>
                                <p className="mt-4 text-center text-xs text-forest/40 flex justify-center items-center gap-2">
                                    <span>🔒</span> Pembayaran aman dan terenkripsi
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
