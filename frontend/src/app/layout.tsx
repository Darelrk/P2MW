import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AMOUREA Bouquet - Rangkai Kenangan Manismu",
  description: "Buket rajut premium untuk setiap momen spesial. Beli buket ekspres atau rakit sendiri gaya unikmu.",
  icons: {
    icon: "/favicon.ico",
  },
};

import { Toaster } from "sonner";
import { SlideOutCart } from "@/components/ui/SlideOutCart";
import { SplashScreen } from "@/components/ui/SplashScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${inter.variable} font-body antialiased bg-cream-light text-forest relative min-h-screen`}
      >
        <div
          className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.04] mix-blend-multiply"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
        />

        <SplashScreen />
        {children}
        <SlideOutCart />
        <Toaster position="top-center" toastOptions={{
          style: {
            background: 'rgba(34, 48, 38, 0.95)', // Forest dark with slight transparency
            backdropFilter: 'blur(12px)',
            color: '#F5EEDC', // Cream text
            border: '1px solid rgba(245, 238, 220, 0.1)',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 20px 40px -20px rgba(0,0,0,0.4)',
            borderRadius: '1rem',
          },
        }} />
      </body>
    </html>
  );
}
