"use client";

import { motion, Variants } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";

export function InteractiveReceipt() {
    const { items } = useCartStore();

    // Prevent SSR hydration errors by deferring math
    const [mounted, setMounted] = useState(false);
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
        setMounted(true);
        // Fix for impure function in render:
        setOrderId(String(Math.floor(Math.random() * 9000) + 1000));
    }, []);

    if (!mounted) return null;

    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = totalPrice * 0.11; // PPN 11%
    const grandTotal = totalPrice + tax;

    const receiptVariants: Variants = {
        hidden: { height: 0, opacity: 0 },
        visible: {
            height: "auto",
            opacity: 1,
            transition: {
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1,
                delayChildren: 0.5
            }
        }
    };

    const rowVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative w-full max-w-sm drop-shadow-2xl">
            {/* Top rounded edge */}
            <div className="h-4 w-full bg-white rounded-t-2xl"></div>

            {/* Receipt Body */}
            <motion.div
                variants={receiptVariants}
                initial="hidden"
                animate="visible"
                className="bg-white px-8 pb-12 pt-6 font-mono text-sm uppercase text-forest/80 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] origin-top overflow-hidden border-x border-forest/5"
            >
                <div className="text-center mb-8 border-b-2 border-dashed border-forest/20 pb-6">
                    <h2 className="font-display font-bold text-2xl tracking-widest text-forest">AMOUREA BOUQUET</h2>
                    <p className="text-xs mt-2 font-mono">ID Pesanan: #{orderId}</p>
                    <p className="text-xs font-mono">{new Date().toLocaleDateString('id-ID')}</p>
                </div>

                <div className="space-y-4 mb-8">
                    {items.map((item) => (
                        <motion.div key={item.id} variants={rowVariants} className="flex justify-between items-start">
                            <div className="pr-4 flex-1">
                                <span className="font-bold">{item.quantity}X</span> {item.name}
                                {item.customDetails && (
                                    <div className="text-[10px] mt-1 ml-6 text-forest/50">
                                        + {item.customDetails.flower}<br />
                                        + {item.customDetails.color}<br />
                                        + {item.customDetails.wrap}
                                    </div>
                                )}
                            </div>
                            <div className="font-bold tabular-nums whitespace-nowrap">
                                {(item.price * item.quantity).toLocaleString("id-ID")}
                            </div>
                        </motion.div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center text-forest/30 py-8">
                            Keranjang Kosong
                        </div>
                    )}
                </div>

                <motion.div variants={rowVariants} className="border-t-2 border-dashed border-forest/20 pt-6 space-y-2">
                    <div className="flex justify-between">
                        <span>SUBTOTAL</span>
                        <span className="tabular-nums">{totalPrice.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>PAJAK (11%)</span>
                        <span className="tabular-nums">{tax.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-solid border-forest/20">
                        <span className="font-bold text-lg">TOTAL</span>
                        <span className="font-bold text-xl tabular-nums tracking-tighter">Rp {grandTotal.toLocaleString("id-ID")}</span>
                    </div>
                </motion.div>

                <motion.div variants={rowVariants} className="mt-12 text-center text-xs opacity-50">
                    <p>TERIMA KASIH ATAS PESANAN ANDA</p>
                    <div className="mt-4 h-8 bg-forest/20 flex space-x-1 justify-center items-center">
                        <div className="w-1 h-full bg-forest"></div>
                        <div className="w-2 h-full bg-forest"></div>
                        <div className="w-1 h-full bg-forest"></div>
                        <div className="w-3 h-full bg-forest"></div>
                        <div className="w-1 h-full bg-forest"></div>
                        <div className="w-2 h-full bg-forest"></div>
                        <div className="w-1 h-full bg-forest"></div>
                        <div className="w-4 h-full bg-forest"></div>
                        <div className="w-1 h-full bg-forest"></div>
                        <div className="w-2 h-full bg-forest"></div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Bottom edge */}
            <div className="h-4 w-full bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] rounded-b-lg"></div>
        </div>
    );
}
