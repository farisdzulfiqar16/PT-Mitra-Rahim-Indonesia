# Keputusan Teknis — Celestia Website

Dokumen ini mencatat keputusan teknis yang diambil, alasannya, dan alternatif yang
dipertimbangkan. Tujuannya agar developer baru memahami "mengapa" di balik pilihan teknologi.

---

## ✅ Keputusan yang Sudah Diambil

### Next.js 16 dengan App Router

**Keputusan:** Menggunakan Next.js dengan App Router (bukan Pages Router).

**Alasan:**
- App Router adalah arah resmi Next.js ke depan.
- Server Components memungkinkan halaman dirender di server tanpa JavaScript berlebihan di browser.
- Routing berbasis folder mudah dipahami.

**Konsekuensi:** Semua komponen adalah Server Components secara default.
`"use client"` hanya ditambahkan jika perlu.

---

### TypeScript Strict Mode

**Keputusan:** `strict: true` di `tsconfig.json`.

**Alasan:**
- Mencegah bug umum seperti null reference.
- Dokumentasi kode melalui types.
- Lebih mudah refactoring di masa depan.

**Konsekuensi:** Tidak boleh ada `any` tanpa alasan. Semua fungsi harus memiliki return type yang jelas.

---

### Implementasi i18n (Bilingual)

**Keputusan:** Menggunakan `next-intl` untuk bilingual (Bahasa Indonesia + English).

**Alasan:**
- Integrasi native dengan App Router Next.js.
- Dukungan middleware routing berdasarkan locale.
- Komunitas aktif dan dokumentasi lengkap.

**Keputusan turunan yang sudah diterapkan:**
- Struktur URL: `/id/...` dan `/en/...` (keduanya dengan prefix eksplisit).
- File terjemahan disimpan di `src/i18n/messages/id.json` dan `en.json`.
- Slug URL tidak diterjemahkan — slug tetap sama di semua locale.
- Routing middleware dikonfigurasi di `src/proxy.ts`.
- Konfigurasi locale di `src/i18n/config.ts` dan `src/i18n/request.ts`.

**Bukti implementasi:** `package.json` dependency `"next-intl": "^4.14.9"`,
`next.config.ts` menggunakan `createNextIntlPlugin`, folder `src/i18n/` aktif,
routing `src/app/[locale]/` berjalan.

---

### Tailwind CSS v4

**Keputusan:** Menggunakan Tailwind CSS v4.

**Alasan:**
- Utility-first mempercepat pengembangan UI.
- Tidak butuh CSS file terpisah untuk setiap komponen.
- Dikonfigurasi otomatis oleh `create-next-app`.

**Catatan:** Tailwind v4 memiliki perbedaan konfigurasi dibanding v3. Tidak ada file `tailwind.config.js`
— konfigurasi dilakukan via CSS.

---

### Turbopack

**Keputusan:** Turbopack digunakan sebagai bundler untuk dev dan build.

**Konteks keputusan:** Awalnya ditolak (`--no-turbopack`) demi stabilitas. Keputusan berubah
saat Tailwind CSS v4 membutuhkan loader khusus. `@tailwindcss/turbopack` adalah paket resmi
dari Tailwind yang hanya bekerja dengan Turbopack, bukan Webpack. Karena proyek sudah
berkomitmen ke Tailwind v4, menggunakan Turbopack menjadi keharusan teknis.

**Kondisi aktual:** `next.config.ts` mengaktifkan Turbopack via blok `turbopack.rules`
untuk memproses file CSS dengan `@tailwindcss/turbopack`. Dev server (`next dev`) dan
build (`next build`) keduanya menggunakan Turbopack.

**Bukti implementasi:** `next.config.ts` blok `turbopack: { rules: { "*.css": ... } }`,
`package.json` devDependency `"@tailwindcss/turbopack": "^4"`.

---

### Data Statis (JSON) untuk MVP

**Keputusan:** Data properti disimpan sebagai file JSON di `src/data/`.

**Alasan:**
- Tidak membutuhkan backend atau database untuk MVP.
- Mudah diedit dan dikelola.
- Cukup untuk kebutuhan website marketing yang datanya tidak sering berubah.

**Konsekuensi:** Tidak ada update data real-time. Status unit harus diperbarui secara manual.

**Rencana migrasi:** Jika data mulai kompleks atau perlu dikelola non-developer,
ganti services layer agar membaca dari API. Komponen UI tidak perlu berubah.

---

## 🔄 Keputusan yang Masih Terbuka

### Google Maps vs Alternatif

**Pertanyaan:** Bagaimana menampilkan lokasi geografis proyek?

**Opsi:**
- Google Maps Embed API — mudah, familiar, tapi membutuhkan API key
- Google Maps iframe embed — lebih sederhana, tapi kurang fleksibel
- OpenStreetMap / Leaflet — open source, tidak butuh API key

**Yang perlu diputuskan:** Apakah perusahaan memiliki Google Maps API key?

---

### Interactive Site Plan

**Pertanyaan:** Teknologi apa untuk denah interaktif (zoom, pan, klik unit)?

**Opsi:**
- SVG murni dengan event handler — ringan, tidak perlu library tambahan
- Leaflet.js dengan gambar overlay — familiar untuk peta, mendukung zoom/pan
- Three.js — terlalu berat untuk use case ini (marketing website)

**Rekomendasi:** SVG interaktif atau Leaflet — evaluasi saat Feature Spec site plan disiapkan.

---

## ❌ Keputusan yang Ditolak

### Backend / Database

**Ditolak karena:** Tidak diperlukan untuk MVP website marketing.
Data properti cukup statis. Tidak ada transaksi, booking, atau login pengguna.

---

### Three.js, Anime.js, Motion (Framer Motion)

**Ditolak karena:** Belum ada kebutuhan teknis yang jelas untuk library animasi berat.
Tailwind CSS sudah mendukung animasi dasar. Tambahkan library animasi hanya jika dibutuhkan.
