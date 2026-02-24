"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/cn";
import { scaleOnTap } from "@/lib/animations";

const LINKS = [
    { label: "Beranda", href: "/" },
    { label: "Koleksi Cepat", href: "/express" },
    { label: "Rakit Sendiri", href: "/custom" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed inset-x-0 top-0 z-[100] transition-all duration-500 px-4 md:px-8",
                isScrolled
                    ? "bg-sage/80 backdrop-blur-xl py-2 shadow-2xl scale-[0.98] mt-2 mx-4 rounded-3xl border border-white/10"
                    : "bg-transparent py-5"
            )}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                {/* Logo */}
                <motion.a
                    href="/"
                    variants={scaleOnTap}
                    whileTap="tap"
                    className="font-display text-2xl font-bold text-cream"
                >
                    P2MW<span className="text-blush">.</span>
                </motion.a>

                {/* Desktop Links */}
                <div className="hidden items-center gap-8 md:flex">
                    {LINKS.map((link) => (
                        <motion.a
                            key={link.href}
                            href={link.href}
                            variants={scaleOnTap}
                            whileTap="tap"
                            className="font-body text-sm font-medium text-cream/80 transition-colors hover:text-white"
                        >
                            {link.label}
                        </motion.a>
                    ))}
                    <motion.a
                        href="/custom"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full bg-blush px-6 py-2 font-body text-sm font-bold text-forest transition-all shadow-lg"
                    >
                        Mulai Merakit
                    </motion.a>
                </div>

                {/* Mobile Icons */}
                <div className="flex items-center gap-4 md:hidden">
                    <motion.button
                        variants={scaleOnTap}
                        whileTap="tap"
                        className="text-cream"
                        aria-label="Keranjang Belanja"
                    >
                        <ShoppingBag className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        variants={scaleOnTap}
                        whileTap="tap"
                        className="text-cream"
                        aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
                    >
                        {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[-1] bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 z-0 w-[80%] max-w-sm bg-forest p-8 shadow-2xl flex flex-col pt-24"
                        >
                            <div className="flex flex-col gap-6">
                                {LINKS.map((link) => (
                                    <motion.a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        variants={scaleOnTap}
                                        whileTap="tap"
                                        className="font-display text-2xl text-cream/80 active:text-white"
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                            </div>
                            <motion.a
                                href="/custom"
                                whileTap={{ scale: 0.98 }}
                                className="mt-auto block rounded-xl bg-blush py-4 text-center font-body text-lg font-bold text-forest shadow-md"
                                onClick={() => setIsOpen(false)}
                            >
                                Mulai Merakit
                            </motion.a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
