# P2MW Bouquet Frontend: Animation & Visual Plan

Dokumen ini memetakan detail interaksi, transisi, dan standar animasi 3D untuk antarmuka "P2MW Bouquet", memastikan *craftsmanship* tinggi sesuai gaya `frontend-design` & `ui-ux-pro-max`.

## Prinsip Dasar Animasi
1. **Purposeful:** Tidak ada *micro-motion* dekoratif. Animasi hanya terjadi untuk memandu fokus pengguna atau memberikan *feedback* sukses/error.
2. **Performance-First:** Menggunakan properti GPU-accelerated (`transform` & `opacity`). Hindari animasi manipulasi DOM layout (`width`, `height`, `margin`).
3. **Smooth & Snappy:** Durasi mikro-interaksi antara 150ms-300ms. Kurva *easing* menggunakan `cubic-bezier`.

## 1. Hero Section (3D & Stacked Cards)
*   **3D Flower Canvas (React Three Fiber):**
    *   **Entrance:** Kamera perlahan *zooming out* (durasi: 1200ms, ease-out) untuk mengungkapkan buket bunga secara utuh dari sudut makro (sangat dekat) menjadi prespektif meja/ruang saat halaman dimuat (on load).
    *   **Idle:** Rotasi *subtle* dan lambat pada sumbu Y (0.1 radian/detik) agar bunga terlihat hidup.
    *   **Scroll Interactivity:** (Opsional) Menggunakan `useScroll` dari Framer Motion agar model 3D sedikit berputar (15 derajat) mengikuti arah *scroll* pengguna ke bawah.
*   **Stacked Cards (Kiri & Kanan / Atas & Bawah):**
    *   **Entrance:** Muncul (*Fade-up*) satu persatu secara *staggered* setelah animasi kamera 3D selesai.
        *   Card 1 ("Rakit Sendiri"): `delay: 0s, duration: 400ms`.
        *   Card 2 ("Express"): `delay: 0.15s, duration: 400ms`.

## 2. "The Creative Path" (Custom Builder)
*   **Layered Visual Preview (Paper Doll UI):**
    *   **Swap Transition:** Saat user memilih warna bunga/kertas baru, gambar (layer) bunga lama memudar (`opacity: 0 -> duration 200ms`) serentak dengan gambar baru yang memudar masuk (`opacity: 1 -> duration 200ms`).
    *   Tidak menggunakan *sliding* untuk area preview bunga agar transisi terasa organik, bukan seperti lembaran aplikasi.
*   **Progress Stepper:**
    *   Saat berpindah step (Misal, *Bunga* -> *Wrapping*), konten opsi meluncur dari kanan ke kiri (`x: 100% -> 0%`) dengan kurva elastis ringan (spring, stiffness 100).
*   **Selection Feedback:**
    *   Saat kotak warna diklik: Skala membesar sejenak (`scale: 0.95 -> 1.05 -> 1.0`) sebagai *haptic visual feedback*.
    *   Warna border penanda (Active ring) transisi secara halus menggunakan *layout animation* (Framer Motion `layoutId`).

## 3. "The Panic-Button Path" (Express)
*   **Countdown Timer:**
    *   Animasi *tick* pada angka detik memudar keluar ke atas, lalu angka baru masuk dari bawah (mirip efek *flip clock* mini).
*   **Product Card Hover (Desktop):**
    *   Gambar buket perlahan memperbesar (`scale: 1.05`, durasi 300ms, *ease-in-out*).
    *   Tombol (Ekspres 3 Jam) menyala (*glow* dengan warna `#E8332A` ber-opasitas 0.2).

## 4. Konfigurasi Framer Motion (Standard Variables)
Pola yang dapat digunakan ulang di seluruh *codebase*:
```ts
// Constants / lib/animations.ts
export const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }
};
```

## 5. Aksesibilitas (A11y)
- Semua animasi akan menghormati preferensi OS: `prefers-reduced-motion`. Jika aktif, ubah semua elemen *slide/scale* menjadi hanya sekadar *fade* atau bahkan tanpa transisi (langsung tampil).
