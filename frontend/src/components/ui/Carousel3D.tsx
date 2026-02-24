"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/cn";

const CARDS = [
    { id: 1, image: "/images/forest-bloom.png", title: "Forest Bloom", subtitle: "Nuansa Hutan" },
    { id: 2, image: "/images/pastel-dream.png", title: "Pastel Dream", subtitle: "Lembut & Elegan" },
    { id: 3, image: "/images/red-romance.png", title: "Red Romance", subtitle: "Cinta Abadi" },
];

const SWIPE_THRESHOLD = 50;
const AUTO_ROTATE_MS = 5000;

/**
 * Premium 3D Carousel with drag gestures, dynamic tilt,
 * glossy shine overlay, and liquid snake-dot indicators.
 */
export function Carousel3D() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
    const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
    // Shine position derived from mouse
    const shineX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 25 });
    const shineY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 25 });

    useEffect(() => {
        if (isDragging) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % CARDS.length);
        }, AUTO_ROTATE_MS);
        return () => clearInterval(timer);
    }, [isDragging]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    }, [mouseX, mouseY]);

    const handleMouseLeave = useCallback(() => {
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        if (info.offset.x < -SWIPE_THRESHOLD) {
            setCurrentIndex((prev) => (prev + 1) % CARDS.length);
        } else if (info.offset.x > SWIPE_THRESHOLD) {
            setCurrentIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length);
        }
    }, []);

    const next = () => setCurrentIndex((prev) => (prev + 1) % CARDS.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length);

    return (
        <div
            ref={containerRef}
            className="relative flex h-[380px] w-full max-w-[420px] items-center justify-center perspective-[1200px] md:h-[480px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ambient glow behind active card */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-52 rounded-[3rem] bg-blush/15 pointer-events-none"
                animate={{ filter: `blur(${isDragging ? 60 : 90}px)`, scale: isDragging ? 1.1 : 1 }}
                transition={{ duration: 0.6 }}
            />

            {/* Drag Surface */}
            <motion.div
                className="relative h-full w-full cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                style={{ touchAction: "pan-y" }}
            >
                <AnimatePresence mode="popLayout">
                    {CARDS.map((card, i) => {
                        const offset = (i - currentIndex + CARDS.length) % CARDS.length;
                        const isActive = offset === 0;
                        const { x, z, rotateY, scale, opacity, zIndex } = getCardTransform(offset, CARDS.length);

                        return (
                            <motion.div
                                key={card.id}
                                initial={false}
                                animate={{ x, z, rotateY, scale, opacity, zIndex }}
                                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute left-1/2 top-1/2 h-[320px] w-56 -translate-x-1/2 -translate-y-1/2 md:h-[420px] md:w-[17rem]"
                                style={{
                                    transformStyle: "preserve-3d",
                                    // Apply tilt only to active card
                                    rotateX: isActive ? tiltX : 0,
                                    rotateY: isActive ? tiltY : rotateY,
                                }}
                            >
                                <CardContent card={card} isActive={isActive} shineX={shineX} shineY={shineY} />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* Navigation Controls */}
            <NavigationControls
                currentIndex={currentIndex}
                total={CARDS.length}
                onPrev={prev}
                onNext={next}
            />
        </div>
    );
}

/* ─────────────────────────────────────────────
   Card Content — Glassmorphism + Glossy Shine
   ───────────────────────────────────────────── */
interface CardContentProps {
    card: (typeof CARDS)[number];
    isActive: boolean;
    shineX: ReturnType<typeof useSpring>;
    shineY: ReturnType<typeof useSpring>;
}

function CardContent({ card, isActive, shineX, shineY }: CardContentProps) {
    // Hook MUST be called at top level, not inside conditional JSX
    const shineBackground = useTransform(
        [shineX, shineY],
        ([sx, sy]) =>
            `radial-gradient(ellipse at ${sx}% ${sy}%, rgba(255,255,255,0.35) 0%, transparent 60%)`
    );

    return (
        <div
            className={cn(
                "relative h-full w-full overflow-hidden rounded-[2rem] border-2 shadow-2xl transition-all duration-500",
                isActive
                    ? "border-blush/40 shadow-blush/20"
                    : "border-white/10 shadow-black/5"
            )}
        >
            {/* Image */}
            <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover"
                priority={isActive}
                sizes="(max-width: 768px) 224px, 272px"
            />

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

            {/* ✨ Glossy Shine Overlay — always rendered, opacity controlled */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-10 mix-blend-soft-light"
                style={{ background: shineBackground }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Label — only on active */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="absolute bottom-0 left-0 right-0 z-20 p-5"
                    >
                        <div className="glass-premium rounded-2xl px-4 py-3">
                            <p className="font-display text-lg font-bold text-white drop-shadow-lg leading-tight">
                                {card.title}
                            </p>
                            <p className="font-body text-xs text-white/60 mt-0.5">
                                {card.subtitle}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Navigation — Snake Dot Indicators
   ───────────────────────────────────────────── */
interface NavigationControlsProps {
    currentIndex: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
}

function NavigationControls({ currentIndex, total, onPrev, onNext }: NavigationControlsProps) {
    return (
        <div className="absolute -bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-6">
            <button
                onClick={onPrev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white hover:scale-110 active:scale-95"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Snake Dots */}
            <div className="relative flex items-center gap-2">
                {Array.from({ length: total }).map((_, i) => {
                    const isActive = i === currentIndex;
                    return (
                        <motion.button
                            key={i}
                            className="relative p-1.5 -m-1.5"
                            aria-label={`Slide ${i + 1}`}
                            disabled
                        >
                            <motion.span
                                layout
                                className={cn(
                                    "block rounded-full",
                                    isActive ? "bg-blush" : "bg-white/20"
                                )}
                                animate={{
                                    width: isActive ? 28 : 8,
                                    height: 8,
                                    opacity: isActive ? 1 : 0.5,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                }}
                            />
                        </motion.button>
                    );
                })}
            </div>

            <button
                onClick={onNext}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white hover:scale-110 active:scale-95"
                aria-label="Next slide"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}

function getCardTransform(offset: number, totalCards: number) {
    const isActive = offset === 0;
    const isRight = offset === 1;
    const isLeft = offset === totalCards - 1;

    if (isActive) return { x: 0, z: 20, rotateY: 0, scale: 1, opacity: 1, zIndex: 30 };
    if (isRight) return { x: 130, z: -120, rotateY: -30, scale: 0.82, opacity: 0.5, zIndex: 20 };
    if (isLeft) return { x: -130, z: -120, rotateY: 30, scale: 0.82, opacity: 0.5, zIndex: 20 };
    return { x: 0, z: 0, rotateY: 0, scale: 1, opacity: 0, zIndex: 0 };
}
