"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/cn";

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
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest/5 text-forest/30 mb-4">
                                        <ShoppingBag className="h-10 w-10" />
                                    </div>
                                    <h3 className="font-body text-lg font-bold text-forest">Keranjang Kosong</h3>
                                    <p className="mt-2 text-sm text-forest/60">
                                        Belum ada buket yang dipilih. Mari mulai merangkai bunga!
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-6">
                                    {items.map((item) => (
                                        <li key={item.id} className="flex gap-4">
                                            {/* Image placeholder / thumbnail */}
                                            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-forest/5 border border-forest/10 flex items-center justify-center">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-3xl">💐</span>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-body text-base font-bold text-forest pr-4">{item.name}</h4>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red/50 hover:text-red transition-colors"
                                                            aria-label="Hapus Item"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <p className="font-body text-sm font-semibold text-terracotta mt-1">
                                                        Rp {item.price.toLocaleString("id-ID")}
                                                    </p>
                                                    {item.customDetails && (
                                                        <p className="mt-2 text-[11px] text-forest/60 uppercase tracking-widest leading-relaxed">
                                                            {item.customDetails.flower} • {item.customDetails.color} • {item.customDetails.wrap}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="flex items-center rounded-full border border-forest/10 bg-white shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="flex h-8 w-8 items-center justify-center text-forest/70 hover:text-forest transition-colors"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-8 text-center font-body text-sm font-medium text-forest">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="flex h-8 w-8 items-center justify-center text-forest/70 hover:text-forest transition-colors"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
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
