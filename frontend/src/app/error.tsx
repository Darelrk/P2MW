'use client';

import { useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service here
        console.error('🚨 Global App Error Caught:', error);
    }, [error]);

    return (
        <main className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
            <Navbar />
            <div className="bg-white p-8 rounded-3xl shadow-card max-w-md w-full text-center border border-red/10">
                <div className="w-16 h-16 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-forest mb-2">Terjadi Kesalahan!</h2>
                <p className="font-body text-sm text-forest/70 mb-8">
                    Maaf, sistem kami mengalami sedikit kendala: <br />
                    <span className="font-mono text-xs text-red mt-2 block bg-red/5 p-2 rounded">{error.message || "Unknown error"}</span>
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 rounded-full border border-forest/10 font-body text-sm font-bold text-forest hover:bg-forest/5 transition-all"
                    >
                        Beranda
                    </button>
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 rounded-full bg-forest font-body text-sm font-bold text-cream hover:bg-forest-light transition-all shadow-lg"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        </main>
    );
}
