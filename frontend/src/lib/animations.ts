import type { Variants } from "framer-motion";

/**
 * Reusable Framer Motion variant presets for AMOUREA Bouquet.
 * All durations & easings follow animation_plan.md specs.
 */

// Custom cubic-bezier: snappy but organic
const EASE_SMOOTH: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const EASE_OUT: [number, number, number, number] = [0.0, 0.0, 0.2, 1];

export const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: EASE_SMOOTH },
    },
};

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3, ease: EASE_OUT },
    },
};

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

export const scaleOnTap: Variants = {
    tap: { scale: 0.97 },
};

export const cardHover: Variants = {
    rest: { scale: 1, boxShadow: "0 4px 24px rgba(15,62,46,0.08)" },
    hover: {
        scale: 1.03,
        boxShadow: "0 8px 32px rgba(15,62,46,0.14)",
        transition: { duration: 0.3, ease: EASE_SMOOTH },
    },
};

/** Flip-clock style tick for countdown digits */
export const flipDigit: Variants = {
    exit: {
        y: -20,
        opacity: 0,
        transition: { duration: 0.15, ease: EASE_OUT },
    },
    enter: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.15, ease: EASE_OUT },
    },
};

/** Stepper slide transition (right-to-left elastic) */
export const stepperSlide: Variants = {
    enter: {
        x: "100%",
        opacity: 0,
    },
    center: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: {
        x: "-100%",
        opacity: 0,
        transition: { duration: 0.2, ease: EASE_OUT },
    },
};

/** Layer swap for Paper Doll preview */
export const layerSwap: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.2, ease: EASE_OUT },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2, ease: EASE_OUT },
    },
};
/** Scroll-trigger reveal: items scale up and fade in */
export const revealScroll: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE_SMOOTH },
    },
};

/** Blooming effect: circular scale with rotation */
export const bloomEntrance: Variants = {
    hidden: { opacity: 0, scale: 0, rotate: -15 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            duration: 0.8,
            type: "spring",
            stiffness: 120,
            damping: 12,
        },
    },
};
