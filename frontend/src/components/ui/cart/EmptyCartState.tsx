import { ShoppingBag } from "lucide-react";

export function EmptyCartState() {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest/5 text-forest/30 mb-4">
                <ShoppingBag className="h-10 w-10" />
            </div>
            <h3 className="font-body text-lg font-bold text-forest">Keranjang Kosong</h3>
            <p className="mt-2 text-sm text-forest/60">
                Belum ada buket yang dipilih. Mari mulai merangkai bunga!
            </p>
        </div>
    );
}
