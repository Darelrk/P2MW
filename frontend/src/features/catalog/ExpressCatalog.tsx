"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Leaf, Sun } from "lucide-react";
import { staggerContainer } from "@/lib/animations";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/cn";

type MoodFilter = "semua" | "romantis" | "elegan" | "hangat";
type SortOption = "default" | "price-asc" | "price-desc" | "stock-low";

const MOOD_FILTERS: { key: MoodFilter; label: string; icon: React.ReactNode }[] = [
    { key: "semua", label: "Semua", icon: <Sparkles className="h-4 w-4" /> },
    { key: "romantis", label: "Romantis", icon: <Heart className="h-4 w-4" /> },
    { key: "elegan", label: "Elegan", icon: <Leaf className="h-4 w-4" /> },
    { key: "hangat", label: "Hangat", icon: <Sun className="h-4 w-4" /> },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
    { key: "default", label: "Rekomendasi" },
    { key: "price-asc", label: "Harga ↑" },
    { key: "price-desc", label: "Harga ↓" },
    { key: "stock-low", label: "Stok Menipis" },
];

const EXPRESS_PRODUCTS = [
    {
        id: 1,
        name: "Standard Red Romance",
        price: "Rp 100.000",
        priceNum: 100000,
        image: "/images/red-romance.png",
        stock: 5,
        mood: "romantis" as MoodFilter,
        views: 45,
    },
    {
        id: 2,
        name: "Mini Forest Bloom",
        price: "Rp 75.000",
        priceNum: 75000,
        image: "/images/forest-bloom.png",
        stock: 8,
        mood: "hangat" as MoodFilter,
        views: 22,
    },
    {
        id: 3,
        name: "Standard Pastel Dream",
        price: "Rp 100.000",
        priceNum: 100000,
        image: "/images/pastel-dream.png",
        stock: 4,
        mood: "elegan" as MoodFilter,
        views: 38,
    },
    {
        id: 4,
        name: "Premium Eternal Soft",
        price: "Rp 150.000",
        priceNum: 150000,
        image: "/images/soft-hydrangea.png",
        stock: 3,
        mood: "hangat" as MoodFilter,
        views: 15,
    },
    {
        id: 5,
        name: "Premium Elegance Hampers",
        price: "Rp 200.000",
        priceNum: 200000,
        image: "/images/tulip-velvet.png",
        stock: 2,
        mood: "elegan" as MoodFilter,
        views: 18,
    },
    {
        id: 6,
        name: "Mini Sunset Glow",
        price: "Rp 75.000",
        priceNum: 75000,
        image: "/images/sunset-glow.png",
        stock: 6,
        mood: "romantis" as MoodFilter,
        views: 29,
    },
];

export function ExpressCatalog() {
    const [activeMood, setActiveMood] = useState<MoodFilter>("semua");
    const [activeSort, setActiveSort] = useState<SortOption>("default");

    const filtered = useFilteredCatalog(EXPRESS_PRODUCTS, activeMood, activeSort);

    return (
        <div>
            {/* Filter & Sort Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Mood Chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {MOOD_FILTERS.map((filter) => (
                        <motion.button
                            key={filter.key}
                            onClick={() => setActiveMood(filter.key)}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "flex items-center gap-1.5 rounded-full px-4 py-2 font-body text-sm font-medium transition-all duration-300 whitespace-nowrap border",
                                activeMood === filter.key
                                    ? "border-forest bg-forest text-cream shadow-lg"
                                    : "border-forest/10 bg-white text-forest/70 hover:border-forest/30 hover:bg-forest/5"
                            )}
                        >
                            <span>{filter.icon}</span>
                            <span>{filter.label}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <select
                    value={activeSort}
                    onChange={(e) => setActiveSort(e.target.value as SortOption)}
                    className="rounded-xl border border-forest/10 bg-white px-4 py-2 font-body text-sm text-forest/70 outline-none focus:border-forest/30 transition-colors cursor-pointer"
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Results count */}
            <p className="mb-4 font-body text-xs text-forest/40">
                Menampilkan {filtered.length} produk
            </p>

            {/* Product Grid */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4 md:grid-cols-3"
            >
                <AnimatePresence mode="popLayout">
                    {filtered.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductCard
                                name={product.name}
                                price={product.price}
                                image={product.image}
                                stock={product.stock}
                                isExpress
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Custom Hook — Catalog Business Logic
   ───────────────────────────────────────────── */
function useFilteredCatalog(
    products: typeof EXPRESS_PRODUCTS,
    mood: MoodFilter,
    sort: SortOption
) {
    return useMemo(() => {
        const filtered = mood === "semua"
            ? [...products]
            : products.filter((p) => p.mood === mood);

        switch (sort) {
            case "price-asc":
                return filtered.sort((a, b) => a.priceNum - b.priceNum);
            case "price-desc":
                return filtered.sort((a, b) => b.priceNum - a.priceNum);
            case "stock-low":
                return filtered.sort((a, b) => a.stock - b.stock);
            default:
                return filtered;
        }
    }, [products, mood, sort]);
}
