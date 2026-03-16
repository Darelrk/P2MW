import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Camera, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { fadeUp } from "@/lib/animations";
import { useCartStore } from "@/store/useCartStore";
import dynamic from "next/dynamic";

const ARViewer = dynamic(() => import("./ARViewer"), { ssr: false });

interface ProductCardProps {
    id: string;
    name: string;
    price: string;
    image: string;
    description?: string | null;
    stock: number;
    soldCount?: number;
    isExpress?: boolean;
    priority?: boolean;
    hasAR?: boolean;
    modelUrl?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const ProductCard = memo(function ProductCard({
    id,
    name,
    price,
    image,
    description,
    stock,
    soldCount = 0,
    isExpress = false,
    priority = false,
    hasAR = false,
    modelUrl,
    onClick,
}: ProductCardProps) {
    const [showAR, setShowAR] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showOrder, setShowOrder] = useState(false);
    const lowStock = stock <= 3;
    const addItem = useCartStore(state => state.addItem);

    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    const dpPrice = Math.floor(numericPrice * 0.5);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

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

    const handleWhatsAppOrder = () => {
        const message = encodeURIComponent(
            `Halo AMOUREA, saya ingin memesan produk Ekspres berikut:\n\n` +
            `*Produk:* ${name}\n` +
            `*Harga:* ${price}\n` +
            `*DP (50%):* Rp ${dpPrice.toLocaleString('id-ID')}\n\n` +
            `Mohon info ketersediaan dan langkah selanjutnya. Terima kasih!`
        );
        window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
    };

    return (
        <>
            <motion.article
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                data-product-id={id}
                onClick={(e) => {
                    if (onClick) {
                        onClick(e);
                    } else {
                        setShowPreview(true);
                    }
                }}
                className={cn(
                    "group relative overflow-hidden rounded-3xl border border-forest/5 cursor-pointer",
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
                                e.stopPropagation();
                                setShowAR(true);
                            }}
                            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-white/20 backdrop-blur-md text-forest shadow-lg transition-all hover:bg-white"
                        >
                            <Camera className="h-5 w-5" />
                        </motion.button>
                    )}

                    {/* Add to Cart Badge (Quick Action) */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToCart}
                        className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border border-white/20 backdrop-blur-md text-forest shadow-lg transition-all hover:bg-white md:opacity-0 md:group-hover:opacity-100"
                    >
                        <span className="text-lg">🛍️</span>
                    </motion.button>
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
                            <div className="flex items-center gap-2 mt-2">
                                <p className="font-body text-lg font-bold text-terracotta">
                                    {price}
                                </p>
                                {soldCount > 0 && (
                                    <span className="text-[10px] bg-forest/5 text-forest/60 px-2 py-0.5 rounded-full font-body font-medium">
                                        {soldCount} Terjual
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* CTA on Hover (Desktop) / Always (Mobile) */}
                        {isExpress ? (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowOrder(true);
                                }}
                                className={cn(
                                    "mt-4 flex w-full items-center justify-between transition-all duration-500",
                                    "opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0"
                                )}
                            >
                                <span className="font-body text-xs font-bold uppercase tracking-widest text-forest">
                                    Pesan Sekarang
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
                                    Lihat Detail
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

            {/* Product Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-fit max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setShowPreview(false)}
                                className="absolute right-6 top-6 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-forest transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto">
                                <Image src={image} alt={name} fill className="object-cover" />
                            </div>

                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
                                <h2 className="font-display text-3xl font-bold text-forest">{name}</h2>
                                <p className="mt-2 font-display text-2xl font-bold text-terracotta">{price}</p>
                                
                                <div className="mt-6 space-y-4">
                                    <div className="p-4 bg-forest/5 rounded-2xl border border-forest/10">
                                        <h4 className="font-body text-xs font-bold uppercase tracking-widest text-forest/40">Deskripsi</h4>
                                        <p className="mt-2 font-body text-sm text-forest/70 leading-relaxed">
                                            {description || "Buket bunga rajut premium yang dirancang khusus untuk momen spesial Anda. Menggunakan bahan berkualitas tinggi yang tahan lama dan elegan."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-cream rounded-2xl border border-forest/5">
                                            <h4 className="font-body text-[10px] font-bold uppercase tracking-widest text-forest/40 text-center">Stok</h4>
                                            <p className="mt-1 font-display text-lg font-bold text-forest text-center">{stock} pcs</p>
                                        </div>
                                        <div className="p-4 bg-cream rounded-2xl border border-forest/5">
                                            <h4 className="font-body text-[10px] font-bold uppercase tracking-widest text-forest/40 text-center">Terjual</h4>
                                            <p className="mt-1 font-display text-lg font-bold text-forest text-center">{soldCount}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 flex gap-3">
                                    <button 
                                        onClick={(e) => {
                                            handleAddToCart(e);
                                            setShowPreview(false);
                                        }}
                                        className="h-14 flex-1 rounded-2xl border-2 border-forest text-forest font-body text-sm font-bold hover:bg-forest hover:text-white transition-all"
                                    >
                                        Ke Keranjang
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setShowPreview(false);
                                            setShowOrder(true);
                                        }}
                                        className="h-14 flex-[1.5] rounded-2xl bg-forest text-cream font-body text-sm font-bold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Pesan Sekarang
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Direct Order / DP Overlay */}
                {showOrder && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl"
                        >
                            <button 
                                onClick={() => setShowOrder(false)}
                                className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 text-forest"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest/10 text-forest text-2xl">
                                    📝
                                </div>
                                <h3 className="font-display text-xl font-bold text-forest">Rincian Pesanan</h3>
                                <p className="text-sm text-forest/50">Konfirmasi pesanan via WhatsApp</p>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-dashed border-forest/10">
                                    <span className="text-sm text-forest/60">Produk</span>
                                    <span className="text-sm font-bold text-forest truncate max-w-[150px]">{name}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-dashed border-forest/10">
                                    <span className="text-sm text-forest/60">Harga Total</span>
                                    <span className="text-sm font-bold text-forest">{price}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 bg-blush/5 rounded-xl px-4">
                                    <span className="text-sm font-bold text-blush">Uang Muka (50%)</span>
                                    <span className="text-sm font-bold text-blush">Rp {dpPrice.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="p-3 bg-forest/5 rounded-xl text-[10px] text-forest/40 text-center uppercase tracking-widest font-bold">
                                    Sisa pembayaran dilakukan setelah produk siap
                                </div>
                            </div>

                            <button 
                                onClick={handleWhatsAppOrder}
                                className="mt-8 w-full h-14 bg-[#25D366] text-white rounded-2xl font-body font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                Lanjutkan ke WhatsApp
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
        prevProps.soldCount === nextProps.soldCount &&
        prevProps.image === nextProps.image &&
        prevProps.priority === nextProps.priority &&
        prevProps.hasAR === nextProps.hasAR;
});

