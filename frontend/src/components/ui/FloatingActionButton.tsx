"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

const WHATSAPP_NUMBER = "6281234567890";
const WHATSAPP_MESSAGE = encodeURIComponent(
    "Halo AMOUREA! Saya ingin konsultasi tentang buket custom."
);

/**
 * FloatingActionButton — WhatsApp shortcut, always visible.
 * Positioned bottom-right with a pulse animation for attention.
 */
export function FloatingActionButton() {
    return (
        <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi Admin via WhatsApp"
            className={cn(
                "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full",
                "bg-forest text-cream shadow-[var(--shadow-float)]",
                "transition-transform duration-200 hover:scale-110",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
                "active:scale-95"
            )}
        >
            {/* Pulse ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-forest/30" />
            <MessageCircle className="relative z-10 h-6 w-6" strokeWidth={2} />
        </a>
    );
}
