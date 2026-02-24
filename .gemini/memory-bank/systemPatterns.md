# System Patterns

## Architecture
- **Next.js App Router** — File-based routing (`/`, `/express`, `/custom`)
- **Feature-Based Folder Structure**:
  - `src/components/ui/` — Shared UI components (Navbar, Footer, ProductCard, HeroSection, etc.)
  - `src/features/catalog/` — Express path (CountdownBadge, ExpressCatalog)
  - `src/features/bouquet-builder/` — Custom path (store, stepper, preview, builder)
  - `src/lib/` — Utilities (cn.ts, animations.ts)
  - `src/app/` — Route pages
- **Server Components** by default, `"use client"` hanya untuk interaktivitas

## Design Patterns
- **Design Token System**: Semua warna, spacing, shadow didefinisikan di `globals.css` `@theme inline`. Ganti hex di satu file → seluruh app berubah.
- **Composition Pattern**: Page components compose smaller UI pieces (Navbar + Hero + TrustBar + Footer)
- **Zustand Store** dengan `persist` middleware untuk Custom Builder state
- **Framer Motion Variants** di `lib/animations.ts` — reusable animation definitions
- **3D Carousel**: CSS `perspective` + `rotateY` + `translateZ` (bukan Three.js)
- **Scroll-Aware Navbar**: `useEffect` + `window.scrollY` → toggle opacity class
- **Responsive Strategy**: Mobile-first, `md:` dan `lg:` breakpoints untuk desktop

## File Structure (Key Files)
```
frontend/src/
├── app/
│   ├── globals.css          ← Design tokens (palet warna)
│   ├── layout.tsx           ← Root layout (fonts, metadata)
│   ├── page.tsx             ← Landing page
│   ├── express/page.tsx     ← Express catalog
│   └── custom/page.tsx      ← Custom builder
├── components/ui/
│   ├── HeroSection.tsx      ← Hero + 3D Carousel
│   ├── Carousel3D.tsx       ← CSS 3D perspective carousel
│   ├── Navbar.tsx           ← Scroll-aware floating navbar
│   ├── Footer.tsx           ← 3-column dark footer
│   ├── TrustBar.tsx         ← Value propositions
│   ├── PopularCombinations.tsx
│   ├── ProductCard.tsx
│   └── FloatingActionButton.tsx
├── features/
│   ├── catalog/
│   │   ├── CountdownBadge.tsx
│   │   └── ExpressCatalog.tsx
│   └── bouquet-builder/
│       ├── store.ts         ← Zustand + persist
│       ├── ProgressStepper.tsx
│       ├── StepContent.tsx
│       ├── LayeredPreview.tsx
│       └── CustomBuilder.tsx
└── lib/
    ├── animations.ts        ← Framer Motion variants
    └── cn.ts                ← clsx + tailwind-merge
```
