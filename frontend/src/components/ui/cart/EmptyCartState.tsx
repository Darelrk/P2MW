import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export function EmptyCartState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex h-full flex-col items-center justify-center text-center p-6"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-forest/5 text-forest/30 mb-6 border border-forest/10 shadow-inner"
            >
                <ShoppingBag className="h-10 w-10" />
            </motion.div>
            <h3 className="font-display text-xl font-bold text-forest">Keranjang Masih Kosong</h3>
            <p className="mt-3 text-sm text-forest/60 max-w-[220px] leading-relaxed">
                Belum ada buket yang dipilih. Mari mulai merangkai bunga abadi!
            </p>
        </motion.div>
    );
}
