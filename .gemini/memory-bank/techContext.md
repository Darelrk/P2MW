# Tech Context

## Technology Stack
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **UI Library**: React 19.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (`@theme inline` syntax)
- **Animation**: Framer Motion
- **State**: Zustand (with `persist` middleware for localStorage)
- **3D**: React Three Fiber (installed, not yet used)
- **Data Fetching**: TanStack Query (installed, not yet used)
- **Icons**: Lucide React
- **Fonts**: Playfair Display + Inter (via `next/font/google`)

## Environment
- **OS**: Windows 11 (Intel i3-1220P, 16GB RAM)
- **Path**: `C:\JS\P2MW\frontend`
- **Dev Server**: `npm run dev` → `http://localhost:3000`
- **Node**: via system install
- **Package Manager**: npm
- **Git**: Initialized tapi BELUM dipakai untuk version control — JANGAN pakai `git restore`

## Design Tokens (globals.css)
Semua warna dikontrol via CSS custom properties di `@theme inline`:
- Token names: `forest`, `blush`, `terracotta`, `red`, `cream`, `sage`
- ⚠️ **PENTING**: Token `lime` sudah di-rename ke `blush` untuk mencegah konflik dengan Tailwind v4 built-in `lime` (hijau)
- Font: `--font-display` (Playfair Display), `--font-body` (Inter)
- Tracking detail: lihat `.gemini/Colorpath.md` dan `.gemini/Fontpath.md`

## Key Patterns
- Semua komponen menggunakan `font-display` untuk heading, `font-body` untuk body text
- Opacity standardized: primary 100%, secondary /70, tertiary /50
- Tailwind class `text-forest`, `bg-blush`, dll merujuk ke CSS tokens (bukan hardcode hex)
- Hardcoded hex hanya di: StepContent.tsx (color picker), LayeredPreview.tsx (color/wrap map)

## Images (public/images/)
- `hero-bouquet.png` — Hero background
- `forest-bloom.png` — Produk Forest Bloom
- `pastel-dream.png` — Produk Pastel Dream
- `red-romance.png` — Produk Red Romance
