"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/animations";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
    name: string;
    price: string;
    image: string;
    stock: number;
    isExpress?: boolean;
}

export function ProductCard({
    name,
    price,
    image,
    stock,
    isExpress = false,
}: ProductCardProps) {
    const lowStock = stock <= 3;
    const { addItem } = useCartStore();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();

        // Parse "Rp 250.000" to 250000
        const numericPrice = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;

        addItem({
            id: `express-${name.toLowerCase().replace(/\s+/g, '-')}`,
            type: "express",
            name,
            price: numericPrice,
            image,
        });

        toast.success("Berhasil ditambahkan", {
            description: `${name} telah masuk ke keranjang belanja Anda.`,
            icon: "🛍️"
        });
    };

    return (
        <motion.article
            variants={fadeUp}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-forest/5",
                "bg-white shadow-xl transition-all duration-500 hover:shadow-2xl"
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark/20">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    quality={65}
                    unoptimized={true}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                    {lowStock && (
                        <span className="rounded-full bg-red px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                            Sisa {stock}!
                        </span>
                    )}
                </div>

                {isExpress && (
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-forest/90 px-3 py-1 font-body text-[10px] font-bold text-cream backdrop-blur-md shadow-lg">
                        <Zap className="h-3 w-3 text-blush" />
                        <span>3 Jam</span>
                    </div>
                )}

                {/* Wishlist Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                        "absolute right-4 bottom-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-forest backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-red",
                        "opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    )}
                >
                    <Heart className="h-5 w-5" />
                </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex flex-col items-start justify-between min-h-[5.5rem]">
                    <div className="w-full">
                        <h3 className="font-display text-xl font-bold text-forest truncate">
                            {name}
                        </h3>
                        <p className="mt-1 font-body text-xs text-forest/50">
                            Cotton Milk / Katun Combed + Premium Wrap
                        </p>
                        <p className="mt-2 font-body text-lg font-bold text-terracotta">
                            {price}
                        </p>
                    </div>

                    {/* CTA on Hover (Desktop) / Always (Mobile) */}
                    {isExpress ? (
                        <button
                            onClick={handleAddToCart}
                            className={cn(
                                "mt-4 flex w-full items-center justify-between transition-all duration-500",
                                "opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
                            )}
                        >
                            <span className="font-body text-xs font-bold uppercase tracking-widest text-forest">
                                Pesan Ekspres
                            </span>
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-cream shadow-lg transition-transform duration-300 group-hover:translate-x-1"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </motion.div>
                        </button>
                    ) : (
                        <div
                            className={cn(
                                "mt-4 flex w-full items-center justify-between transition-all duration-500",
                                "opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
                            )}
                        >
                            <span className="font-body text-xs font-bold uppercase tracking-widest text-forest">
                                Detail Produk
                            </span>
                            <motion.div
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-cream shadow-lg transition-transform duration-300 group-hover:translate-x-1"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
