# Project Brief: P2MW Bouquet Frontend

Pembuatan UI E-Commerce untuk layanan buket rajutan bunga. Mobile-first dengan arsitektur **Dual-Path UX** (Express vs Custom Builder).

## Design System
- **Palet Aktif: Blush & Sage**
  - Sage dark `#3D4F3D` — heading, navbar, hero bg
  - Blush pink `#E8A0BF` — aksen, CTA, highlight
  - Copper `#D4845B` — harga, elemen hangat
  - Dusty rose `#C94C4C` — urgensi, badge stok
  - Warm white `#FDF6F0` — background
  - Sage `#7A8B6F` — aksen sekunder
- **Typography**: Playfair Display (serif, heading) + Inter (sans, body)
- **Font Rules**: `font-display` untuk heading, `font-body` untuk semua body text
- **Opacity Tiers**: Primary 100%, Secondary /70, Tertiary /50

## Core Architecture: Dual-Path UX
- **Jalur Ekspres** (`/express`): Katalog ready-to-assemble, countdown timer, checkout <5 klik
- **Jalur Custom** (`/custom`): Step-by-step builder (bunga → warna → wrapping → ucapan)

## Implemented Pages
- **Landing** (`/`): Hero + 3D Carousel, Trust Bar, Popular Combinations, Navbar, Footer, FAB
- **Express** (`/express`): CountdownBadge, ProductCard grid (6 produk), Navbar, Footer
- **Custom** (`/custom`): ProgressStepper, StepContent, LayeredPreview, Navbar, Footer

## Technical Stack
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Zustand, R3F (planned)
