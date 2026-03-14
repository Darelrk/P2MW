import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Camera, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/animations";
import { useCartStore } from "@/store/useCartStore";
import dynamic from "next/dynamic";

const ARViewer = dynamic(() => import("./ARViewer"), { ssr: false });

interface ProductCardProps {
    name: string;
    price: string;
    image: string;
    description?: string | null;
    stock: number;
    isExpress?: boolean;
    priority?: boolean;
    hasAR?: boolean;
    modelUrl?: string;
}

export const ProductCard = memo(function ProductCard({
    name,
    price,
    image,
    description,
    stock,
    isExpress = false,
    priority = false,
    hasAR = false,
    modelUrl,
}: ProductCardProps) {
    const [showAR, setShowAR] = useState(false);
    const lowStock = stock <= 3;
    const addItem = useCartStore(state => state.addItem);

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
        <>
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
                        priority={priority}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* AR Trigger Button */}
                    {hasAR && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.preventDefault();
                                setShowAR(true);
                            }}
                            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-white/20 backdrop-blur-md text-forest shadow-lg transition-all hover:bg-white"
                        >
                            <Camera className="h-5 w-5" />
                        </motion.button>
                    )}

                    {/* Badges */}
                    <div className="absolute left-4 top-4 flex flex-col gap-2">
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col items-start justify-between min-h-[5.5rem]">
                        <div className="w-full">
                            <h3 className="font-display text-xl font-bold text-forest truncate">
                                {name}
                            </h3>
                            <p className="mt-1 font-body text-xs text-forest/50 line-clamp-2 min-h-[2rem]">
                                {description || "Cotton Milk / Katun Combed + Premium Wrap"}
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

            {/* AR Modal Overlay */}
            {showAR && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        <button 
                            onClick={() => setShowAR(false)}
                            className="absolute right-6 top-6 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-forest transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="p-8 h-full flex flex-col">
                            <div className="mb-6">
                                <h2 className="font-display text-2xl font-bold text-forest">{name}</h2>
                                <p className="text-sm text-forest/60">Pengalaman Spasial AR — Lihat buket ini di ruangan Anda.</p>
                            </div>
                            <div className="flex-1 min-h-[400px]">
                                {modelUrl && <ARViewer modelUrl={modelUrl} />}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}, (prevProps: ProductCardProps, nextProps: ProductCardProps) => {
    // Custom comparison to prevent re-renders if only functions or unchanged primitives differ
    return prevProps.name === nextProps.name &&
        prevProps.price === nextProps.price &&
        prevProps.stock === nextProps.stock &&
        prevProps.image === nextProps.image &&
        prevProps.priority === nextProps.priority &&
        prevProps.hasAR === nextProps.hasAR;
});

