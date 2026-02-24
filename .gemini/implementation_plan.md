# P2MW Bouquet Frontend: Implementation Plan

Rencana teknis untuk membangun aplikasi web "P2MW Bouquet" berdasarkan sesi brainstorming dan arsitektur *Dual-Path UX*.

## 1. Goal Description
Membangun antarmuka pengguna (UI) yang *mobile-first*, fungsional, dan sangat estetis untuk E-Commerce buket rajutan bunga. Sistem harus mendukung dua alur belanja utama:
1.  **Jalur Ekspres**: Cepat, responsif, dan mendesak.
2.  **Jalur Kustom**: *Step-by-step Builder* yang interaktif tanpa *data loss*.

Proyek ini menjunjung tinggi standar desain tingkat produksi, menghindar dari kesan "generik", dan menggunakan palet warna khusus (`#0F3E2E`, `#C7D056`, `#BF3B2F`, `#E8332A`, `#F7E3CD`).

## 2. Tech Stack Proposal
Berdasarkan kebutuhan animasi 3D dan *state management* yang kompleks:
*   **Core Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript (Strict Mode)
*   **Styling**: Tailwind CSS v3/v4 (Konfigurasi warna kustom di `tailwind.config.ts`)
*   **3D Rendering**: React Three Fiber (R3F) & Drei (Visualisasi Hero Bunga)
*   **UI Animations**: Framer Motion (Transisi *Stepper*, efek *Hover*, *Stacked Card*)
*   **State Management**: Zustand (Ringan, sempurna untuk menyimpan data *Custom Builder* antar halaman/refresh)
*   **Data Fetching**: TanStack Query (jika ada integrasi API katalog nantinya)
*   **Icons**: Lucide React

## 3. Proposed Folder Structure
Sesuai dengan `frontend-dev-guidelines` (Feature-based architecture):

```text
src/
├── app/                  # Next.js App Router (Halaman utama)
│   ├── (shop)/
│   │   ├── express/      # Halaman Jalur Ekspres
│   │   └── custom/       # Halaman Builder Kustom
│   ├── layout.tsx
│   └── page.tsx          # Landing Page (Hero)
├── components/           # UI Reusable (Button, Card, Typography)
│   ├── ui/               # Base components
│   └── 3d/               # Komponen R3F / Canvas
├── features/             # Logika bisnis terisolasi
│   ├── bouquet-builder/  # State Zustand, Logic Stepper, Layering logic
│   └── catalog/          # Logic filter/sort Jalur Ekspres
├── lib/                  # Helper, formatters, utilities
└── styles/               # Global CSS & Tailwind entry
```

## 4. Proposed Components
### `src/components/ui/StackedCard.tsx`
- Implementasi desain hero untuk Mobile yang menumpuk.
- Menggunakan Framer Motion untuk efek muncul saat *scroll*.

### `src/components/3d/FlowerCanvas.tsx`
- Wadah `Canvas` R3F untuk me-render model animasi 3D dari klien.
- Harus di-load secara dinamis (`next/dynamic`) agar tidak memblokir FCP (First Contentful Paint).

### `src/features/bouquet-builder/LayeredPreview.tsx`
- Menangani setumpuk gambar `.webp` transparan berdasarkan state Zustand saat ini.
- `z-index` diatur ketat agar wrapping selalu di bawah, bunga di tengah, pita di atas.

### `src/features/catalog/CountdownBadge.tsx`
- Komponen *real-time* yang menghitung sisa waktu *batch* pengiriman ekspres hari ini.

## 5. Verification Plan
### Automated Tests
- Menghindari render 3D di unit test standar (lakukan _mock_ pada R3F).
- Test state Zustand: Memastikan `addFlower()`, `changeWrapper()`, `resetBuilder()` berjalan sesuai ekspektasi.
- Lighthouse Audit: Memastikan *Performance Score* tetap >85 meskipun ada elemen 3D (menggunakan *lazy loading*).

### Manual Verification
- Uji Coba Mobile (DevTools): Memastikan *Stacked Card* dan *Progress Stepper* terasa pas di resolusi 375px (iPhone SE) dan 430px (iPhone 14 Pro Max).
- Simulasikan *refresh* halaman di tengah-tengah *Custom Builder* -> Pastikan bunga pilihan tidak hilang (Zustand `persist` middleware).
