import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Available flower types */
export type FlowerType = "mawar" | "tulip" | "hydrangea" | "lily" | "daisy";

/** Available color variants */
export type FlowerColor = "merah" | "pink" | "putih" | "kuning" | "ungu";

/** Available wrapping styles */
export type WrapStyle = "kraft" | "satin" | "organza" | "burlap";

/** Builder step index */
export type BuilderStep = 0 | 1 | 2 | 3;

export const STEP_LABELS = [
    "Pilih Bunga",
    "Pilih Warna",
    "Pilih Wrapping",
    "Kartu Ucapan",
] as const;

interface BouquetState {
    /** Current step (0-3) */
    step: BuilderStep;
    /** Selected flower type */
    flower: FlowerType | null;
    /** Selected color */
    color: FlowerColor | null;
    /** Selected wrapping */
    wrap: WrapStyle | null;
    /** Greeting card message */
    message: string;

    /** Actions */
    setStep: (step: BuilderStep) => void;
    nextStep: () => void;
    prevStep: () => void;
    setFlower: (flower: FlowerType) => void;
    setColor: (color: FlowerColor) => void;
    setWrap: (wrap: WrapStyle) => void;
    setMessage: (msg: string) => void;
    reset: () => void;
}

const INITIAL_STATE = {
    step: 0 as BuilderStep,
    flower: null,
    color: null,
    wrap: null,
    message: "",
};

/**
 * Zustand store with `persist` middleware.
 * State is saved to localStorage so users don't lose progress on refresh.
 */
export const useBouquetStore = create<BouquetState>()(
    persist(
        (set) => ({
            ...INITIAL_STATE,

            setStep: (step) => set({ step }),
            nextStep: () =>
                set((s) => ({
                    step: Math.min(s.step + 1, 3) as BuilderStep,
                })),
            prevStep: () =>
                set((s) => ({
                    step: Math.max(s.step - 1, 0) as BuilderStep,
                })),
            setFlower: (flower) => set({ flower }),
            setColor: (color) => set({ color }),
            setWrap: (wrap) => set({ wrap }),
            setMessage: (msg) => set({ message: msg }),
            reset: () => set(INITIAL_STATE),
        }),
        {
            name: "AMOUREA-bouquet-builder",
        }
    )
);
