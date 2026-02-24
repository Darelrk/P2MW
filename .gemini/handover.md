# P2MW Bouquet Frontend: Debugger Handover

**To: Gemini 3 Flash (Debugger / QA)**
**From: Antigravity (Builder & Recovery Agent)**
**Date: 2026-02-24**

---

## 1. Konteks Proyek

UI E-Commerce **"P2MW Bouquet"** — buket bunga rajutan handmade premium.  
Arsitektur **Dual-Path UX**: Jalur Ekspres (siap kirim) vs Jalur Kustom (Builder step-by-step).

### Status Saat Ini
- ✅ Semua halaman sudah berjalan (`/`, `/express`, `/custom`)
- ✅ Design system Blush & Sage diterapkan penuh
- ⚠️ Baru saja dipulihkan dari insiden `git restore` — beberapa komponen ditulis ulang dari memori
- ⚠️ Git belum dipakai untuk version control — **JANGAN gunakan perintah git apapun**

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 (`@theme inline`) |
| Animation | Framer Motion |
| State | Zustand + persist |
| Icons | Lucide React |
| Fonts | Playfair Display (display) + Inter (body) |

---

## 3. File Structure (Critical)

```
frontend/src/
├── app/
│   ├── globals.css          ← DESIGN SYSTEM (semua token warna)
│   ├── layout.tsx           ← Root layout (fonts, metadata)
│   ├── page.tsx             ← Landing page (compose Hero+Trust+Popular)
│   ├── express/page.tsx     ← Katalog ekspres
│   └── custom/page.tsx      ← Custom builder
├── components/ui/
│   ├── Navbar.tsx           ← Scroll-aware, z-[100]
│   ├── HeroSection.tsx      ← Hero + background + PathCards
│   ├── Carousel3D.tsx       ← CSS 3D perspective carousel
│   ├── TrustBar.tsx         ← 3 value propositions
│   ├── PopularCombinations.tsx ← Product grid section
│   ├── ProductCard.tsx      ← Reusable product card
│   ├── Footer.tsx           ← 3-column dark footer
│   └── FloatingActionButton.tsx ← WhatsApp FAB
├── features/
│   ├── catalog/
│   │   ├── CountdownBadge.tsx
│   │   └── ExpressCatalog.tsx
│   └── bouquet-builder/
│       ├── store.ts         ← Zustand state
│       ├── ProgressStepper.tsx
│       ├── StepContent.tsx  ← 4-step form
│       ├── LayeredPreview.tsx
│       └── CustomBuilder.tsx
└── lib/
    ├── animations.ts        ← Framer Motion presets
    └── cn.ts                ← clsx + tailwind-merge
```

---

## 4. Design System — Warna

> ⚠️ **KRITIS**: Token `lime` sudah di-rename ke `blush` karena konflik dengan Tailwind v4 built-in `lime` (hijau). Jika kamu menemukan `lime` di kode, itu BUG — ganti ke `blush`.

| Token | Hex | Penggunaan |
|-------|-----|-----------|
| `forest` | `#3D4F3D` | Background utama, teks, border |
| `blush` | `#E8A0BF` | Aksen pink, CTA, badge aktif |
| `terracotta` | `#D4845B` | Harga, CTA checkout |
| `red` | `#C94C4C` | Badge express, countdown |
| `cream` | `#F5EDE6` | Background section terang |
| `cream-light` | `#FDF6F0` | Background body |
| `sage` | `#7A8B6F` | Scrollbar |

**Detail lengkap**: `.gemini/Colorpath.md`
**Font tracking**: `.gemini/Fontpath.md`

---

## 5. Known Issues & Area Debugging

### 🔴 Prioritas Tinggi
1. **Carousel 3D bisa glitch** — Animasi `rotateY` + `translateZ` kadang flicker saat auto-play. Cek di `Carousel3D.tsx` line 76-91.
2. **Hero background image** mungkin tidak ter-load jika path `/images/hero-bouquet.png` salah. Pastikan file ada di `public/images/`.
3. **`perspective` CSS** — Tailwind v4 memakai `perspective-[1200px]`, bukan `perspective: 1200px`. Pastikan syntax benar.

### 🟡 Prioritas Sedang
4. **Responsive breakpoints** — Beberapa komponen belum optimal di tablet (768-1024px).
5. **Opacity tiers** — Idealnya hanya 3 tier (/100, /70, /50), tapi ada beberapa tempat yang pakai /60, /40, /30, /20, /15, /10, /8, /5. Standardisasi jika memungkinkan.
6. **`text-[10px]`** — 3 tempat pakai custom size. Pertimbangkan token.
7. **Hardcoded hex** di `StepContent.tsx` dan `LayeredPreview.tsx` — 8 warna color picker dan 3 warna wrapping.

### 🟢 Prioritas Rendah
8. **`font-extrabold` (800)** di-load tapi belum dipakai — bisa di-remove dari layout.tsx.
9. **`blush-muted`** token didefinisikan tapi belum dipakai di komponen manapun.
10. **SEO** — `express/page.tsx` dan `custom/page.tsx` belum punya structured data.

---

## 6. Panduan Debugging

### Dev Server
```bash
cd C:\JS\P2MW\frontend
npm run dev
# → http://localhost:3000
```

### Halaman yang Perlu Dicek
| URL | Hal yang Perlu Diperiksa |
|-----|-------------------------|
| `/` | Hero contrast, carousel rotation, trust bar alignment, product cards |
| `/express` | Countdown timer, product grid spacing, express badges |
| `/custom` | Stepper progress, color picker, wrapping selection, preview, textarea |

### Tools Referensi
- **Colorpath**: `.gemini/Colorpath.md` — semua penggunaan warna per file
- **Fontpath**: `.gemini/Fontpath.md` — semua penggunaan font per file
- **Animation Plan**: `.gemini/animation_plan.md` — aturan baku animasi
- **Implementation Plan**: `.gemini/implementation_plan.md` — arsitektur keputusan

### ⛔ JANGAN Lakukan
- **JANGAN** pakai perintah `git` apapun (`git restore`, `git reset`, dll.)
- **JANGAN** rename token `blush` kembali ke `lime`
- **JANGAN** hapus `"use client"` dari komponen interaktif
- **JANGAN** ganti `@theme inline` ke format Tailwind v3

---

## 7. Checklist QA

- [ ] Semua gambar product BERBEDA (bukan duplikat)
- [ ] "Tak Layu" berwarna PINK (bukan hijau)
- [ ] Hero background GELAP (forest), bukan putih
- [ ] Navbar transparan → opaque saat scroll
- [ ] Footer tampil di semua 3 halaman
- [ ] Mobile menu bisa dibuka/tutup
- [ ] Carousel auto-rotate & manual navigation
- [ ] Custom Builder: stepper, color picker, preview update
- [ ] Countdown badge menghitung mundur
- [ ] FAB WhatsApp tampil di semua halaman
