import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "P2MW Bouquet — Buket Rajutan Premium",
  description:
    "Buket bunga rajutan handmade yang bertahan selamanya. Bebas debu, bebas alergi, penuh cinta. Pesan sekarang dengan pengiriman 3 jam!",
  keywords: ["buket rajutan", "bunga handmade", "hadiah premium", "bouquet"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${inter.variable} font-body antialiased bg-cream-light text-forest`}
      >
        {children}
      </body>
    </html>
  );
}
