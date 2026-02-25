"use client";

import { motion } from "framer-motion";
import { HandHeart, Clock } from "lucide-react";

export function TrustBar() {
    return (
        <section className="bg-cream py-20 px-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blush/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-forest/5 blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min">
                    {/* Hero Bento Item (Takes 2 cols on md) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass-premium md:col-span-2 p-8 rounded-[2.5rem] flex flex-col justify-end min-h-[220px]"
                    >
                        <h3 className="font-display text-3xl font-bold text-forest leading-tight">
                            Kualitas Premium <br />
                            <span className="text-blush">Tanpa Takut Layu.</span>
                        </h3>
                        <p className="mt-4 font-body text-base text-forest/60 max-w-sm">
                            Setiap kelopak dirajut dengan tangan menggunakan benang kualitas terbaik untuk keindahan abadi.
                        </p>
                    </motion.div>

                    {/* Bento Item 1: Rajutan Tangan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-blush/10 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-lg hover:shadow-xl transition-shadow border border-blush/20"
                    >
                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-md mb-4 text-blush">
                            <HandHeart className="h-8 w-8" />
                        </div>
                        <h4 className="font-display text-xl font-bold text-forest">100% Handmade</h4>
                        <p className="mt-2 font-body text-sm text-forest/70">Dibuat penuh dedikasi</p>
                    </motion.div>

                    {/* Bento Item 2: Jabodetabek */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-forest/5 p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center border border-forest/10"
                    >
                        <div className="h-16 w-16 bg-forest text-cream rounded-2xl flex items-center justify-center shadow-md mb-4">
                            <Clock className="h-8 w-8" />
                        </div>
                        <h4 className="font-display text-xl font-bold text-forest">Jadi dalam 3 Jam</h4>
                        <p className="mt-2 font-body text-sm text-forest/70">Proses cepat & berkualitas</p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
