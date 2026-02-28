"use client";

import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Leaf, Sparkles, Sun } from "lucide-react";
import { staggerContainer } from "@/lib/animations";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/cn";

type TierFilter = "semua" | "affordable" | "standard" | "premium" | "special";
type SortOption = "default" | "price-asc" | "price-desc" | "stock-low";


const TIER_FILTERS: { key: TierFilter; label: string; color: string }[] = [
    { key: "semua", label: "Semua Harga", color: "bg-forest" },
    { key: "affordable", label: "Affordable", color: "bg-sage" },
    { key: "standard", label: "Standard", color: "bg-sage" },
    { key: "premium", label: "Premium", color: "bg-sage" },
    { key: "special", label: "Special", color: "bg-terracotta" },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
    { key: "default", label: "Rekomendasi" },
    { key: "price-asc", label: "Harga ↑" },
    { key: "price-desc", label: "Harga ↓" },
    { key: "stock-low", label: "Stok Menipis" },
];

export interface FormattedProduct {
    id: string;
    name: string;
    description: string | null;
    priceNum: number;
    image: string;
    stock: number;
    activeTiers: string[];
    tiers: Record<string, { enabled: boolean; val: number }>;
}

interface ExpressCatalogProps {
    initialProducts: FormattedProduct[];
}

export function ExpressCatalog({ initialProducts }: ExpressCatalogProps) {
    const [activeTier, setActiveTier] = useState<TierFilter>("semua");
    const [activeSort, setActiveSort] = useState<SortOption>("default");
    const [isPending, startTransition] = useTransition();

    // Recalculate display price based on active tier filter (Fast on Client)
    const processedProducts = useMemo(() => {
        return initialProducts.map(p => {
            let displayPrice = p.priceNum;

            if (activeTier !== "semua") {
                const targetTier = p.tiers[activeTier];
                if (targetTier && targetTier.enabled) {
                    displayPrice = targetTier.val;
                }
            }

            return {
                ...p,
                price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(displayPrice),
                priceNum: displayPrice,
                views: Math.floor(Math.random() * 50) + 10 // Mock views for now
            };
        });
    }, [initialProducts, activeTier]);

    const sortedProducts = useMemo(() => {
        const sorted = [...processedProducts];
        switch (activeSort) {
            case "price-asc": return sorted.sort((a, b) => a.priceNum - b.priceNum);
            case "price-desc": return sorted.sort((a, b) => b.priceNum - a.priceNum);
            case "stock-low": return sorted.sort((a, b) => a.stock - b.stock);
            default: return sorted;
        }
    }, [processedProducts, activeSort]);

    const visibleProductCount = useMemo(() => {
        return sortedProducts.filter(p => activeTier === "semua" || p.activeTiers.includes(activeTier)).length;
    }, [sortedProducts, activeTier]);

    return (
        <div>
            {/* Filter & Sort Bar */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Category/Tier Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    {TIER_FILTERS.map((tier) => (
                        <button
                            key={tier.key}
                            onClick={() => startTransition(() => setActiveTier(tier.key))}
                            disabled={isPending}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border",
                                activeTier === tier.key
                                    ? "bg-forest text-cream border-forest shadow-md"
                                    : "bg-white text-forest/40 border-forest/10 hover:border-forest/30",
                                isPending && "opacity-70 cursor-wait"
                            )}
                        >
                            {tier.label}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <select
                    value={activeSort}
                    onChange={(e) => startTransition(() => setActiveSort(e.target.value as SortOption))}
                    disabled={isPending}
                    className={cn(
                        "rounded-xl border border-forest/10 bg-white px-4 py-2 font-body text-sm text-forest/70 outline-none focus:border-forest/30 transition-colors cursor-pointer",
                        isPending && "opacity-70 cursor-wait"
                    )}
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
                Menampilkan {visibleProductCount} produk
            </p>

            {/* Product Grid - Pure CSS Render Performance */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {sortedProducts.map((product) => {
                    const isVisible = activeTier === "semua" || product.activeTiers.includes(activeTier);
                    if (!isVisible) return null;

                    return (
                        <div
                            key={product.id}
                            className="animate-in fade-in duration-300 ease-out"
                        >
                            <ProductCard
                                name={product.name}
                                price={(product as any).price || "Rp 0"}
                                image={product.image || "/images/placeholder.png"}
                                description={product.description}
                                stock={product.stock}
                                isExpress={true}
                                priority={true}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
