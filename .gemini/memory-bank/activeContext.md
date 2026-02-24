# Active Context

## Current Focus
Frontend sudah dibangun dan berjalan. Fokus terakhir: **recovery & debugging** setelah insiden `git restore` yang menghapus komponen kustom, lalu **UI/UX polish** dengan palet Blush & Sage.

## Recent Changes (2026-02-24)
- **INSIDEN**: `git restore src/` secara tidak sengaja menghapus semua komponen kustom dan mengembalikan `globals.css` + `layout.tsx` ke template default Next.js.
- **RECOVERY**: Semua file berhasil dibangun ulang dari memori:
  - `globals.css` — Design system tokens dikembalikan
  - `layout.tsx` — Font Playfair + Inter dikembalikan
  - `Navbar.tsx`, `HeroSection.tsx`, `Carousel3D.tsx`, `TrustBar.tsx`, `PopularCombinations.tsx`, `ProductCard.tsx`, `Footer.tsx`, `ProgressStepper.tsx`
- **Color Token Rename**: `lime` → `blush` di semua file untuk mencegah konflik dengan Tailwind v4 built-in `lime` (hijau).
- **Image Paths Fixed**: Carousel dan ProductCard kini memakai gambar berbeda (`forest-bloom.png`, `pastel-dream.png`, `red-romance.png`).
- **Tracking Documents Created**: `Colorpath.md` dan `Fontpath.md` di `.gemini/`.

## Active Decisions
- **Palet Warna: Blush & Sage** — forest, blush, terracotta, red, cream, sage
- Token `blush` menggantikan `lime` di seluruh codebase
- `font-display` (Playfair Display) untuk heading, `font-body` (Inter) untuk body
- Opacity 3 tier: Primary /100, Secondary /70, Tertiary /50
- CSS 3D Carousel (perspective + rotateY), bukan Three.js

## Next Steps
- Debugging lanjutan (kontras, animasi, responsiveness)
- Checkout flow & payment integration  
- Real product data / API connection
- Performance optimization
- Accessibility review (WCAG contrast)
