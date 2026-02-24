# 🎨 P2MW Bouquet — Color Path Tracking

> Dokumen ini melacak penggunaan semua token warna di seluruh file proyek.
> **Terakhir diperbarui:** 2026-02-24

---

## 1. Design Tokens (Sumber: `globals.css`)

| Token | Hex | Deskripsi |
|-------|-----|-----------|
| `--color-forest` | `#3D4F3D` | Sage dark (primary) |
| `--color-forest-light` | `#576E57` | Sage terang (hover) |
| `--color-blush` | `#E8A0BF` | Blush pink (aksen utama) |
| `--color-blush-muted` | `#F0BFD4` | Blush lembut |
| `--color-terracotta` | `#D4845B` | Warm copper |
| `--color-red` | `#C94C4C` | Dusty rose |
| `--color-red-glow` | `rgba(201,76,76,0.2)` | Shadow merah |
| `--color-cream` | `#F5EDE6` | Warm beige |
| `--color-cream-dark` | `#E8DDD3` | Beige gelap |
| `--color-cream-light` | `#FDF6F0` | Warm white (background) |
| `--color-white` | `#FEFCFA` | Off-white |
| `--color-black` | `#2B2B2B` | Soft black |
| `--color-sage` | `#7A8B6F` | Muted green |

---

## 2. Penggunaan Per File

### 📁 `app/globals.css`
Sumber definisi semua token warna di atas + shadow dan font variables.

| Properti | Token |
|----------|-------|
| `--color-background` | `cream-light` |
| `--color-foreground` | `forest` |
| `--shadow-card` | `rgba(61,79,61, 0.06)` |
| `--shadow-card-hover` | `rgba(61,79,61, 0.12)` |
| scrollbar-thumb | `sage` |
| `::selection` | `bg: blush`, `color: forest` |
| `*:focus-visible` | `outline: blush` |

---

### 📁 `app/layout.tsx`
| Elemen | Token |
|--------|-------|
| `<body>` | `bg-cream-light text-forest` |

---

### 📁 `components/ui/Navbar.tsx`
| Elemen | Token |
|--------|-------|
| Nav background (scrolled) | `bg-forest/90` |
| Logo "P2MW" | `text-cream` |
| Logo titik "." | `text-blush` |
| Desktop links | `text-cream/80` → hover: `text-white` |
| CTA "Mulai Merakit" | `bg-blush text-forest` |
| Mobile menu background | `bg-forest` |
| Mobile links | `text-cream/80` |
| Mobile CTA | `bg-blush text-forest` |

---

### 📁 `components/ui/HeroSection.tsx`
| Elemen | Token |
|--------|-------|
| Section background | `bg-forest` |
| Background overlay (vertical) | `from-forest/70 via-forest/50 to-forest/80` |
| Background overlay (horizontal) | `from-forest/80 via-forest/40 to-transparent` |
| Bottom fade | `from-cream-light to-transparent` |
| Badge pill border/bg | `border-white/20 bg-black/20` |
| Badge sparkle icon | `text-blush` |
| Badge text | `text-white` |
| H1 "Buket yang" | `text-white` |
| H1 "Tak Layu" | `text-blush` + `drop-shadow pink` |
| Description paragraph | `text-white` |
| PathCard (Custom) border/bg | `border-white/10 bg-white/5` |
| PathCard (Express) border/bg | `border-red/30 bg-red/15` |
| PathCard glow (Custom) | `bg-blush/20` |
| PathCard glow (Express) | `bg-red/20` |
| PathCard title | `text-white` |
| PathCard description | `text-white/80` |
| PathCard CTA text | `text-white` |
| Custom Builder badge | `bg-cream/10 text-blush` |
| Express badge | `bg-red/20 text-red` |

---

### 📁 `components/ui/Carousel3D.tsx`
| Elemen | Token |
|--------|-------|
| Active card border | `border-blush/40` |
| Inactive card border | `border-white/10` |
| Card title overlay | `text-white` |
| Nav button border/bg | `border-white/10 bg-white/5 text-white` |
| Active dot | `bg-blush` |
| Inactive dot | `bg-white/20` → hover: `bg-white/40` |

---

### 📁 `components/ui/TrustBar.tsx`
| Elemen | Token |
|--------|-------|
| Section background | `bg-cream-light` |
| Icon aksen "Rajutan" | `bg-blush/15 text-forest` |
| Icon aksen "Kualitas" | `bg-forest/10 text-forest` |
| Icon aksen "Pengiriman" | `bg-terracotta/10 text-terracotta` |
| Heading label | `text-forest` |
| Description | `text-forest/50` |

---

### 📁 `components/ui/PopularCombinations.tsx`
| Elemen | Token |
|--------|-------|
| Section background | `bg-cream` |
| Subtitle label | `text-blush` |
| Heading | `text-forest` |
| Description | `text-forest/60` |

---

### 📁 `components/ui/ProductCard.tsx`
| Elemen | Token |
|--------|-------|
| Card border | `border-forest/5` |
| Card background | `bg-white` |
| Stock badge | `bg-red text-white` |
| Express badge bg | `bg-forest/90 text-cream` |
| Express badge icon | `text-blush` |
| Product name | `text-forest` |
| Product price | `text-terracotta` |
| CTA text | `text-forest` |
| CTA icon circle | `bg-forest text-cream` |
| Wishlist button | `bg-white/80 text-forest` → hover: `text-red` |

---

### 📁 `components/ui/Footer.tsx`
| Elemen | Token |
|--------|-------|
| Section background | `bg-forest` |
| Logo "P2MW" | `text-cream` |
| Logo titik "." | `text-blush` |
| Brand description | `text-cream/60` |
| Social icon default | `bg-white/5 text-cream` |
| Social icon hover | `bg-blush text-forest` |
| Section heading | `text-cream` |
| Link text | `text-cream/50` → hover: `text-blush` |
| Heart icon | `text-red fill-red` |
| Copyright | `text-cream/40` + `border-white/5` |
| Bottom links | `text-cream/30` → hover: `text-cream` |

---

### 📁 `components/ui/FloatingActionButton.tsx`
| Elemen | Token |
|--------|-------|
| *(Belum di-scan, tapi kemungkinan menggunakan `bg-forest` atau `bg-blush`)* | — |

---

### 📁 `features/catalog/CountdownBadge.tsx`
| Elemen | Token |
|--------|-------|
| Expired state | `bg-forest/10 text-forest/50` |
| Active border/bg | `border-red/15 bg-red/5` |
| Zap icon | `text-red` |
| Label text | `text-forest/70` |
| Colon separator | `text-forest/50` |
| Digit bg | `bg-forest/5` |
| Digit text | `text-forest` |
| Sub-label | `text-forest/50` |

---

### 📁 `features/catalog/ExpressCatalog.tsx`
| Elemen | Token |
|--------|-------|
| *Menggunakan `ProductCard` — lihat tabel di atas* | — |

---

### 📁 `features/bouquet-builder/StepContent.tsx`
| Elemen | Token |
|--------|-------|
| Container | `border-forest/8 bg-cream` |
| Step headings | `text-forest` |
| Selected option | `border-forest bg-forest/5` |
| Unselected option | `bg-cream-dark/50` → hover: `border-forest/20` |
| Label text | `text-forest` |
| Color label | `text-forest/70` |
| Color ring (selected) | `border-forest ring-forest/30` |
| Wrap description | `text-forest/50` |
| Textarea border | `border-forest/15 bg-white` |
| Textarea focus | `border-forest/40 ring-forest/10` |
| Placeholder | `text-forest/30` |
| Character count | `text-forest/50` |
| "Kembali" btn (disabled) | `text-forest/20` |
| "Kembali" btn (active) | `border-forest/10 text-forest` |
| "Lanjut" btn | `bg-forest text-cream` → hover: `bg-forest-light` |
| "Checkout" btn | `bg-terracotta text-white` |

**Hardcoded Hex:**

| Hex | Label | Digunakan Di |
|-----|-------|-------------|
| `#C94C4C` | Merah | COLORS array |
| `#E8A0BF` | Pink | COLORS array |
| `#FEFCFA` | Putih | COLORS array |
| `#D4A574` | Kuning | COLORS array |
| `#9B59B6` | Ungu | COLORS array |

---

### 📁 `features/bouquet-builder/ProgressStepper.tsx`
| Elemen | Token |
|--------|-------|
| Current step circle | `bg-forest text-cream` |
| Completed step circle | `bg-blush text-forest` |
| Inactive step circle | `bg-forest/10 text-forest/30` → animation: `bg-cream-dark` |
| Active label | `text-forest` |
| Inactive label | `text-forest/30` |
| Connector (done) | `bg-blush` |
| Connector (pending) | `bg-forest/10` |

---

### 📁 `features/bouquet-builder/LayeredPreview.tsx`
| Elemen | Token |
|--------|-------|
| Container | `border-forest/8 bg-cream-dark/30` |
| Empty state text | `text-forest/50` |
| Info overlay | `bg-white/80 text-forest/70` |

**Hardcoded Hex (COLOR_MAP):**

| Hex | Label |
|-----|-------|
| `#C94C4C` | merah |
| `#E8A0BF` | pink |
| `#FEFCFA` | putih |
| `#D4A574` | kuning |
| `#9B59B6` | ungu |

**Hardcoded Hex (WRAP_STYLES):**

| Hex | Label |
|-----|-------|
| `#C8A96E` | Kraft |
| `#D4A0B9` | Satin |
| `#A08060` | Burlap |

---

### 📁 `app/express/page.tsx`
| Elemen | Token |
|--------|-------|
| Heading | `text-forest` |
| Description | `text-forest/70` |

---

### 📁 `app/custom/page.tsx`
| Elemen | Token |
|--------|-------|
| Heading | `text-forest` |
| Description | `text-forest/70` |

---

## 3. Ringkasan Frekuensi Token

| Token | Jumlah File | Penggunaan Utama |
|-------|-------------|-----------------|
| `forest` | 12 | Background, teks, border — warna dominan |
| `blush` | 7 | Aksen, CTA button, badge, dot aktif |
| `cream` / `cream-light` / `cream-dark` | 8 | Background, teks terang di dark section |
| `white` | 5 | Teks di atas forest, overlay |
| `red` | 5 | Badge, express section, countdown |
| `terracotta` | 3 | Harga, CTA checkout |
| `sage` | 1 | Scrollbar thumb |
| `black` | 2 | Badge backdrop, soft text |
| `forest-light` | 1 | Hover pada button "Lanjut" |
| `blush-muted` | 0 | **Belum dipakai** |

---

## 4. ⚠️ Potensi Masalah

| Issue | Detail |
|-------|--------|
| `blush-muted` tidak terpakai | Token `#F0BFD4` didefinisikan tapi belum dipakai di komponen manapun |
| Hardcoded hex di `StepContent` & `LayeredPreview` | 8 warna hardcoded (`#C94C4C`, `#E8A0BF`, dll) — pertimbangkan migrasi ke CSS variables |
| Opacity tiers tidak seragam | Ditemukan `/5`, `/8`, `/10`, `/15`, `/20`, `/30`, `/40`, `/50`, `/60`, `/70`, `/80`, `/90` — idealnya batasi ke 3-4 tier |
