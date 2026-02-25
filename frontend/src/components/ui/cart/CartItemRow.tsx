import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { type CartItem } from "@/store/useCartStore";

interface CartItemRowProps {
    item: CartItem;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemoveItem }: CartItemRowProps) {
    return (
        <li className="flex gap-4">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-forest/5 border border-forest/10 flex items-center justify-center">
                {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                    <span className="text-3xl">💐</span>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="font-body text-base font-bold text-forest pr-4">{item.name}</h4>
                        <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red/50 hover:text-red transition-colors"
                            aria-label="Hapus Item"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="font-body text-sm font-semibold text-terracotta mt-1">
                        Rp {item.price.toLocaleString("id-ID")}
                    </p>
                    {item.customDetails && (
                        <p className="mt-2 text-[11px] text-forest/60 uppercase tracking-widest leading-relaxed">
                            {item.customDetails.flower} • {item.customDetails.color} • {item.customDetails.wrap}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center rounded-full border border-forest/10 bg-white shadow-sm">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-forest/70 hover:text-forest transition-colors"
                        >
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-body text-sm font-medium text-forest">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-forest/70 hover:text-forest transition-colors"
                        >
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
}
