"use client";

import { ProgressStepper } from "@/features/bouquet-builder/ProgressStepper";
import { StepContent } from "@/features/bouquet-builder/StepContent";
import { LayeredPreview } from "@/features/bouquet-builder/LayeredPreview";
import { MoodSelector } from "@/features/bouquet-builder/MoodSelector";
import { useEffect, useState } from "react";
import { BuilderOption, useBouquetStore } from "./store";

interface CustomBuilderProps {
    initialOptions: BuilderOption[];
}

/**
 * CustomBuilder — Premium builder page with mood selector onboarding.
 * Left: mood selector + step content. Right (sticky): layered visual preview.
 */
export function CustomBuilder({ initialOptions }: CustomBuilderProps) {
    const initOptions = useBouquetStore((state) => state.initOptions);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (initialOptions && initialOptions.length > 0) {
            initOptions(initialOptions);
        }
    }, [initialOptions, initOptions]);

    if (!isMounted) {
        return <div className="min-h-[600px] flex items-center justify-center text-forest/50">Memuat Builder...</div>;
    }

    return (
        <div>
            {/* Mood Selector — Onboarding */}
            <MoodSelector />

            {/* Builder Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
                {/* Left: Stepper + Content */}
                <div>
                    <ProgressStepper />
                    <StepContent />
                </div>

                {/* Right: Visual Preview (sticky on mobile & desktop) */}
                <div className="order-first md:order-last sticky top-20 z-30 bg-cream/80 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:static md:bg-transparent md:backdrop-blur-none md:p-0 md:m-0">
                    <LayeredPreview />
                </div>
            </div>
        </div>
    );
}
