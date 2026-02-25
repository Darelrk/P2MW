import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItemType = "express" | "custom";

export interface CartItem {
    id: string; // unique string (e.g., product id or timestamp for custom)
    type: CartItemType;
    name: string;
    price: number;
    image?: string; // For express items
    quantity: number;
    // For custom items:
    customDetails?: {
        flower: string;
        color: string;
        wrap: string;
        message: string;
    };
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;

    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;

    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,

            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            addItem: (newItem) =>
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === newItem.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                            isOpen: true, // open cart when adding
                        };
                    }
                    return { items: [...state.items, { ...newItem, quantity: 1 }], isOpen: true };
                }),

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return { items: state.items.filter((i) => i.id !== id) };
                    }
                    return {
                        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                    };
                }),

            clearCart: () => set({ items: [] }),
        }),
        {
            name: "p2mw-cart-storage",
        }
    )
);
