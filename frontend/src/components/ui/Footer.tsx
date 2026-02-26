"use client";

import { Instagram, Twitter, Mail, Heart, Send } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="relative overflow-hidden bg-forest pt-32 pb-12 px-4 md:px-8">
            {/* Mega Watermark Background */}
            <div className="watermark-text absolute -bottom-10 -left-10 z-0 text-white/[0.03] select-none whitespace-nowrap">
                AMOUREA BOUQUET
            </div>

            <div className="mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
                    {/* Brand & Narrative (Asymmetric: 5 cols) */}
                    <div className="md:col-span-5 flex flex-col justify-between">
                        <div>
                            <div className="relative w-48 h-12 md:w-56 md:h-14 flex items-center mb-4 overflow-hidden">
                                <Image
                                    src="/logo.svg"
                                    alt="AMOUREA Logo"
                                    fill
                                    className="object-cover object-left"
                                />
                            </div>
                            <p className="mt-6 max-w-sm font-body text-lg leading-relaxed text-cream/70">
                                Merajut kenangan dalam setiap simpul. Koleksi bunga rajutan premium yang dirancang untuk keindahan abadi.
                            </p>
                        </div>

                        {/* Social Links with Tap Feedback */}
                        <div className="mt-12 flex gap-4">
                            {[
                                { icon: Instagram, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Mail, href: "#" },
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ y: -4, backgroundColor: "rgba(232, 160, 191, 1)", color: "#3D4F3D" }}
                                    whileTap={{ scale: 0.9 }}
                                    className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 text-cream transition-colors duration-300"
                                >
                                    <social.icon className="h-5 w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links (Asymmetric: 3 cols) */}
                    <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-10">
                        <div>
                            <h4 className="font-display text-xl font-bold text-cream">Layanan</h4>
                            <ul className="mt-6 flex flex-col gap-4">
                                {["Koleksi Cepat", "Rakit Sendiri", "Perawatan Produk"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="group flex items-center gap-2 font-body text-sm text-cream/40 transition-colors hover:text-blush">
                                            <span className="h-px w-0 bg-blush transition-all group-hover:w-4" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-display text-xl font-bold text-cream">Bantuan</h4>
                            <ul className="mt-6 flex flex-col gap-4">
                                {["FAQ", "Kebijakan", "Hubungi Kami"].map((link) => (
                                    <li key={link}>
                                        <a href="#" className="group flex items-center gap-2 font-body text-sm text-cream/40 transition-colors hover:text-blush">
                                            <span className="h-px w-0 bg-blush transition-all group-hover:w-4" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Widget (Asymmetric: 4 cols) */}
                    <div className="md:col-span-4">
                        <div className="rounded-[2rem] bg-white/5 p-8 border border-white/5 backdrop-blur-sm">
                            <h4 className="font-display text-xl font-bold text-cream">Bouquet Club</h4>
                            <p className="mt-3 font-body text-sm text-cream/50 leading-relaxed">
                                Dapatkan inspirasi hadiah dan promo eksklusif langsung di emailmu.
                            </p>
                            <div className="mt-6 relative">
                                <input
                                    type="email"
                                    placeholder="Email address..."
                                    className="w-full rounded-2xl bg-white/5 py-4 pl-5 pr-14 font-body text-sm text-cream placeholder:text-cream/20 border border-white/5 focus:outline-none focus:border-blush/30 transition-all"
                                />
                                <button className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center rounded-xl bg-blush text-forest hover:brightness-110 transition-all">
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-32 flex flex-col items-center justify-between border-t border-white/5 pt-12 md:flex-row gap-8">
                    <div className="flex items-center gap-4">
                        <p className="font-body text-xs text-cream/30 uppercase tracking-[0.2em]">
                            © 2026 AMOUREA Bouquet
                        </p>
                        <div className="h-1 w-1 rounded-full bg-white/10" />
                        <p className="font-body text-xs text-cream/30 flex items-center gap-1.5">
                            Merajut dengan <Heart className="h-3 w-3 text-red fill-red animate-pulse" /> di ADVAN
                        </p>
                    </div>

                    <div className="flex gap-8 font-body text-[10px] uppercase tracking-widest text-cream/20">
                        <a href="#" className="hover:text-blush transition-colors">Kebijakan Privasi</a>
                        <a href="#" className="hover:text-blush transition-colors">Syarat & Ketentuan</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
