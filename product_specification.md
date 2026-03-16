# Product Specification: AMOUREA Bouquet & Gifts

**Status:** Final Specification (Audit Production-Ready)
**Nama Merek:** AMOUREA (sebelumnya P2MW)
**Filosofi:** Digital Tactility, Intentional Friction, Silent Elegance.

## 1. Visi Produk
AMOUREA adalah platform e-commerce premium khusus untuk buket bunga rajutan tangan (*crochet*). Produk ini menawarkan alternatif bunga abadi yang personal, tahan lama, dan memiliki nilai seni tinggi bagi pelanggan yang mencari hadiah unik.

## 2. Pengalaman Pengguna (Dual-Path UX)

### A. Jalur Express (Instant Gifting)
Target: Pelanggan yang membutuhkan hadiah segera.
- **Katalog Terkurasi**: Daftar produk *ready-to-assemble* dengan 3 tier harga (Mini, Standard, Premium).
- **Efisiensi**: Alur pemesanan singkat (< 5 klik) hingga ke WhatsApp.
- **Service Level**: Janji layanan "Jadi dalam 3 Jam".

### B. Jalur Custom Builder (Emotional Crafting)
Target: Pelanggan yang ingin personalisasi mendalam.
- **Step-by-Step Builder**: Proses perakitan terpandu (Bunga → Warna → Wrapping → Kartu Ucapan).
- **Intentional Friction**: Desain yang menghargai proses kreatif, bukan sekadar pengisian formulir cepat.
- **Zustand Persistence**: Progres rakitan tersimpan otomatis di browser pelanggan.

## 3. Fitur Utama & Spesifikasi Teknis

### 🖥️ Frontend & UI/UX
- **Teknologi**: Next.js 15+ (App Router), Tailwind CSS v4, Framer Motion.
- **Premium Animations**: Transisi halaman mulus dan interaksi mikro pada kartu produk.
- **AR Visualization**: Dukungan penampil model 3D (.glb) dinamis untuk melihat buket secara spasial.
- **Hybrid Carousel**: Navigasi responsif (Snap Scroll mobile + Framer Drag desktop).

### ⚙️ Infrastruktur & Backend
- **Database**: PostgreSQL (Supabase) dengan Drizzle ORM.
- **Caching Strategi**: Data Access Layer (DAL) dengan `unstable_cache` untuk optimasi LCP (< 800ms).
- **Admin Dashboard**: Sistem CRUD lengkap dengan proteksi Supabase Auth untuk manajemen produk (Express) dan opsi rakitan (Custom).
- **WhatsApp Checkout**: Generator format pesanan otomatis dengan sistem Down Payment (DP) 50%.

### 📦 Manajemen Aset
- **Image Compression**: Otomatisasi WebP dan reduksi ukuran file sebelum penyimpanan cloud.
- **Storage**: Bucket terpisah untuk aset media (`products`) dan model 3D (`product-models`).

## 4. Standar Desain (Design Tokens)
- **Palet Warna**: Sage (#3D4F3D), Blush (#E8A0BF), Warm White (#FDF6F0).
- **Tipografi**: Playfair Display (Heading), Inter (Body).
- **Opacity Tiers**: 100% (Primary), 70% (Secondary), 50% (Tertiary).

## 5. Roadmap & Pemeliharaan
- **Maintenance**: Penggunaan hook [useBaseCrud](file:///C:/JS/P2MW/frontend/src/hooks/useBaseCrud.ts#17-120) untuk standarisasi fitur manajerial.
- **Integrasi Mendatang**: Implementasi penuh React Three Fiber (R3F) untuk builder yang lebih imersif.
- **Monitoring**: Revalidasi cache secara on-demand untuk menjaga sinkronisasi data real-time.
