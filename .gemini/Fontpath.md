# 🔤 P2MW Bouquet — Font Path Tracking

> Dokumen ini melacak penggunaan semua font family, size, weight, dan text utility di seluruh file proyek.
> **Terakhir diperbarui:** 2026-02-24

---

## 1. Font Definitions (Sumber: `globals.css` + `layout.tsx`)

| Token CSS | Font | Weights | Source |
|-----------|------|---------|--------|
| `--font-display` | **Playfair Display** (Serif) | 400, 600, 700, 800 | Google Fonts via `next/font` |
| `--font-body` | **Inter** (Sans-Serif) | all (variable) | Google Fonts via `next/font` |

**Tailwind Classes:**
- `font-display` → Playfair Display (headings, logo, titik penting)
- `font-body` → Inter (paragraf, label, tombol, badge)

---

## 2. Font Weight Scale

| Tailwind Class | CSS Value | Digunakan Untuk |
|---------------|-----------|-----------------|
| `font-normal` | 400 | *(jarang dipakai langsung)* |
| `font-medium` | 500 | Nav links, option labels, "Kembali" button |
| `font-semibold` | 600 | Badge text, CTA hero, "Lanjut" button |
| `font-bold` | 700 | Logo, headings, harga, badge stock, countdown digits |
| `font-extrabold` | 800 | *(belum dipakai)* |

---

## 3. Font Size Scale

| Tailwind Class | Rem / Pixel | Digunakan Untuk |
|---------------|-------------|-----------------|
| `text-[10px]` | 10px (custom) | Stepper label, stock badge, express badge |
| `text-xs` | 0.75rem / 12px | Sub-labels, footer links, color labels, countdown label |
| `text-sm` | 0.875rem / 14px | Nav links, CTA buttons, descriptions, countdown text |
| `text-base` | 1rem / 16px | Body paragraphs, prices, mobile CTA, wrap labels |
| `text-lg` | 1.125rem / 18px | TrustBar headings, carousel card title, footer section headings |
| `text-xl` | 1.25rem / 20px | Step headings (Builder), product card name, mobile nav links |
| `text-2xl` | 1.5rem / 24px | Logo (Navbar), path card titles, footer logo |
| `text-3xl` | 1.875rem / 30px | Page headings (Express, Custom), footer brand, emoji |
| `text-4xl` | 2.25rem / 36px | Hero H1 (mobile), section headings (Popular), emoji preview |
| `text-5xl` | 3rem / 48px | Hero H1 (md breakpoint), section heading (md), emoji lg |
| `text-6xl` | 3.75rem / 60px | Hero H1 (lg breakpoint) |

---

## 4. Text Utilities

| Utility | Digunakan Di |
|---------|-------------|
| `tracking-widest` | Badge labels (Hero, Product, Stepper, Popular) |
| `tracking-wider` | Hero badge text "RAJUTAN TANGAN PREMIUM" |
| `tracking-tight` | Hero H1 headline |
| `leading-[1.08]` | Hero H1 (tight line-height) |
| `leading-relaxed` | Body descriptions (Hero, Footer) |
| `uppercase` | Badges, stepper labels, CTA labels |
| `truncate` | Product card name |
| `tabular-nums` | Countdown digit display |
| `text-center` | Mobile CTA, LayeredPreview info |
| `text-right` | Character count di textarea |

---

## 5. Penggunaan Per File

### 📁 `app/layout.tsx`
| Property | Value |
|----------|-------|
| Font import | `Playfair_Display`, `Inter` dari `next/font/google` |
| `<body>` class | `font-body antialiased` |
| CSS variable | `--font-display`, `--font-body` |

---

### 📁 `app/globals.css`
| Token | Value |
|-------|-------|
| `--font-display` | `"Playfair Display", serif` |
| `--font-body` | `"Inter", sans-serif` |

---

### 📁 `components/ui/Navbar.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Logo "P2MW." | `font-display` | `text-2xl` | `font-bold` | — |
| Desktop links | `font-body` | `text-sm` | `font-medium` | — |
| Desktop CTA | `font-body` | `text-sm` | `font-bold` | — |
| Mobile links | `font-display` | `text-xl` | *(default)* | — |
| Mobile CTA | `font-body` | `text-base` | `font-bold` | `text-center` |

---

### 📁 `components/ui/HeroSection.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Hero badge text | `font-body` | `text-xs` | `font-semibold` | `tracking-wider` |
| H1 "Buket yang Tak Layu" | `font-display` | `text-4xl` → `md:text-5xl` → `lg:text-6xl` | *(default)* | `leading-[1.08] tracking-tight` |
| Description paragraph | `font-body` | `text-base` | *(default)* | `leading-relaxed` |
| Custom Builder badge | `font-body` | `text-xs` | `font-semibold` | `uppercase tracking-widest` |
| Express badge | `font-body` | `text-xs` | `font-bold` | `uppercase tracking-widest` |
| PathCard title | `font-display` | `text-2xl` | *(default)* | — |
| PathCard description | `font-body` | `text-sm` | *(default)* | `leading-relaxed` |
| PathCard CTA text | `font-body` | `text-sm` | `font-semibold` / `font-bold` | — |

---

### 📁 `components/ui/Carousel3D.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Active card title | `font-display` | `text-lg` | `font-bold` | `drop-shadow-lg` |

---

### 📁 `components/ui/TrustBar.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Feature heading | `font-display` | `text-lg` | `font-bold` | — |
| Feature description | `font-body` | `text-sm` | *(default)* | — |

---

### 📁 `components/ui/PopularCombinations.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Subtitle "Favorit Pelanggan" | `font-body` | `text-xs` | `font-bold` | `uppercase tracking-widest` |
| Section heading | `font-display` | `text-4xl` → `md:text-5xl` | `font-bold` | — |
| Description | `font-body` | `text-base` | *(default)* | — |

---

### 📁 `components/ui/ProductCard.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Stock badge | `font-body` | `text-[10px]` | `font-bold` | `uppercase tracking-wider` |
| Express badge | `font-body` | `text-[10px]` | `font-bold` | — |
| Product name | `font-display` | `text-xl` | `font-bold` | `truncate` |
| Price | `font-body` | `text-base` | `font-bold` | — |
| CTA label | `font-body` | `text-xs` | `font-bold` | `uppercase tracking-widest` |

---

### 📁 `components/ui/Footer.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Brand logo "P2MW." | `font-display` | `text-3xl` | `font-bold` | — |
| Brand description | `font-body` | `text-base` | *(default)* | `leading-relaxed` |
| Section headings | `font-display` | `text-lg` | `font-bold` | — |
| Link items | `font-body` | `text-sm` | *(default)* | — |
| Copyright | `font-body` | `text-xs` | *(default)* | — |
| Bottom links | `font-body` | `text-xs` | *(default)* | — |

---

### 📁 `features/catalog/CountdownBadge.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Expired text | `font-body` | `text-sm` | *(default)* | — |
| "Pesan dalam" label | `font-body` | `text-sm` | *(default)* | — |
| Colon separators | `font-body` | `text-base` | `font-bold` | — |
| Digit display | `font-body` | `text-base` | `font-bold` | `tabular-nums` |
| Unit label (Jam/Mnt/Dtk) | `font-body` | `text-xs` | *(default)* | — |

---

### 📁 `features/bouquet-builder/StepContent.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Step headings (h3) | `font-display` | `text-xl` | *(default)* | — |
| Flower emoji | *(system)* | `text-3xl` | — | — |
| Option label (bunga) | `font-body` | `text-sm` | `font-medium` | — |
| Color label | `font-body` | `text-xs` | *(default)* | — |
| Wrapping name | `font-body` | `text-base` | `font-semibold` | — |
| Wrapping desc | `font-body` | `text-xs` | *(default)* | — |
| Textarea | `font-body` | `text-sm` | *(default)* | — |
| Character count | `font-body` | `text-xs` | *(default)* | `text-right` |
| "Kembali" button | `font-body` | `text-sm` | `font-medium` | — |
| "Lanjut" button | `font-body` | `text-sm` | `font-semibold` | — |
| "Checkout" button | `font-body` | `text-sm` | `font-bold` | — |

---

### 📁 `features/bouquet-builder/ProgressStepper.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Step number/icon | `font-display` | `text-sm` | `font-bold` | — |
| Step label | `font-body` | `text-[10px]` | `font-bold` | `uppercase tracking-widest` |

---

### 📁 `features/bouquet-builder/LayeredPreview.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Flower emoji (preview) | *(system)* | `text-5xl` | — | — |
| Empty state emoji | *(system)* | `text-4xl` | — | — |
| Empty state text | `font-body` | `text-sm` | *(default)* | — |
| Info overlay text | `font-body` | `text-xs` | *(default)* | `text-center` |

---

### 📁 `app/express/page.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Page heading | `font-display` | `text-3xl` → `md:text-4xl` | *(default)* | — |
| Description | `font-body` | `text-base` | *(default)* | — |

---

### 📁 `app/custom/page.tsx`

| Elemen | Family | Size | Weight | Extras |
|--------|--------|------|--------|--------|
| Page heading | `font-display` | `text-3xl` → `md:text-4xl` | *(default)* | — |
| Description | `font-body` | `text-base` | *(default)* | — |

---

## 6. Ringkasan Penggunaan

### Font Family
| Family | Penggunaan | Jumlah File |
|--------|-----------|-------------|
| `font-display` (Playfair) | Logo, headings (h1-h4), step numbers, nav links mobile | 10 |
| `font-body` (Inter) | Semua teks lainnya (paragraf, label, button, badge, price) | 12 |
| *(system emoji)* | Emoji bunga/tanaman di preview & options | 2 |

### Font Weight
| Weight | Jumlah Penggunaan | Konteks Utama |
|--------|------------------|---------------|
| `font-bold` | ~25x | Logo, headings, prices, badges, digits |
| `font-semibold` | ~6x | Badge labels, CTA text, "Lanjut" button |
| `font-medium` | ~4x | Nav links, option labels, "Kembali" button |
| *(default/400)* | ~20x | Body text, descriptions, link items |

### Font Size
| Size | Jumlah Penggunaan | Konteks Utama |
|------|------------------|---------------|
| `text-[10px]` | 3x | Stepper label, badge micro-text |
| `text-xs` | ~12x | Sub-labels, footer, color labels, countdown |
| `text-sm` | ~18x | Nav links, buttons, descriptions |
| `text-base` | ~10x | Body paragraphs, prices, mobile CTA |
| `text-lg` | 3x | TrustBar headings, carousel title, footer section |
| `text-xl` | 6x | Step headings, product names, mobile nav |
| `text-2xl` | 3x | Logo, path card titles |
| `text-3xl` | 3x | Page headings, footer brand, emoji |
| `text-4xl` | 3x | Hero H1 mobile, section headings |
| `text-5xl` | 2x | Hero H1 tablet, section heading (md) |
| `text-6xl` | 1x | Hero H1 desktop (lg) |

---

## 7. ⚠️ Potensi Masalah

| Issue | Detail |
|-------|--------|
| `text-[10px]` non-standard | 3 tempat pakai custom size 10px. Pertimbangkan alias token |
| `font-extrabold` (800) tidak terpakai | Weight 800 di-load di layout.tsx tapi belum digunakan |
| Responsive typography terbatas | Hanya Hero H1 dan section headings yang punya responsive sizes (`md:`, `lg:`) |
| No `font-display` tanpa weight | Beberapa `font-display` element tidak menyertakan `font-bold` secara eksplisit |
