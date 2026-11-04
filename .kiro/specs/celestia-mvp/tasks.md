# Implementation Plan: Celestia MVP

## Overview

Dokumen ini berisi daftar tugas untuk implementasi MVP website Celestia. Tugas diorganisir berdasarkan urutan dependency: fondasi → layout → fitur → integrasi. Setiap tugas memiliki acceptance criteria yang terukur.

Total: 20 tugas.

---

## Tasks

- [ ] 1. Setup routing bilingual dan next-intl: instal `next-intl`, buat `src/app/[locale]/`, konfigurasi middleware i18n, buat file terjemahan `src/i18n/id.json` dan `src/i18n/en.json` dengan semua key UI dasar. Pastikan redirect dari URL tanpa prefix locale ke path `/id/` yang sesuai (misal: `/projects/dehir` → `/id/projects/dehir`, bukan ke homepage). Unknown locale (bukan `id` atau `en`) diarahkan ke path setara dengan prefix `/id/`. Language switcher harus mempertahankan seluruh segmen path dan query parameter. **Acceptance:** next-intl terpasang, middleware redirect URL tanpa prefix ke `/id/` dengan path yang sesuai, unknown locale redirect ke `/id/` path setara, file terjemahan berisi key UI, akses /id/ dan /en/ tanpa error, `npx tsc --noEmit` tanpa error.

- [ ] 2. Update type definitions: ganti `"reserved"` dengan `"process"` di `UnitStatus` di `src/types/property.ts`. Tambahkan `status: "active" | "coming-soon"` ke `Project` interface. Tambahkan type `SitePlanPosition` dan `InterestFormData`. Update barrel export. **Acceptance:** UnitStatus = available|process|sold|unknown, Project punya field status, SitePlanPosition dan InterestFormData didefinisikan, `npx tsc --noEmit` tanpa error.

- [ ] 3. Update siteConfig dan globals.css: tambahkan pesan WhatsApp untuk konteks proyek dan unit di `src/config/site.ts`. Tambahkan color palette (primary sage green, neutral, status, accent, whatsapp), typography tokens, radius, shadow ke `@theme inline` di `src/app/globals.css`. Hapus dark mode bawaan. **Acceptance:** siteConfig punya pesan WhatsApp untuk homepage/proyek/unit, globals.css berisi semua token warna dari design.md, dark mode dihapus, `npm run build` tanpa error.

- [ ] 4. Buat data JSON untuk Dehir dan Pabuaran: buat `src/data/projects/dehir.json` (status: active) dan `src/data/projects/pabuaran.json` (status: coming-soon, data minimal). Buat `src/data/properties/dehir-units.json` dengan 9 unit menggunakan kode kavling dari brosur: A1, A2, A3, A4, B1, B2, B3, B4, B5 (tanpa tanda hubung). Semua unit awal memiliki status `unknown`. Tidak ada data harga/luas/dimensi yang dikarang. **Acceptance:** dehir.json berisi data lengkap dengan status active, pabuaran.json berisi data minimal dengan status coming-soon, dehir-units.json berisi 9 unit dengan kode A1-A4 B1-B5 dan status unknown, tidak ada data yang dikarang, file JSON valid.

- [ ] 5. Buat services layer: buat `src/services/projects.ts` (getAllProjects, getProjectBySlug, getActiveProjects) dan `src/services/properties.ts` (getUnitsByProject, getUnitByCode). Services membaca dari file JSON. **Acceptance:** getAllProjects mengembalikan semua proyek, getProjectBySlug mengembalikan proyek berdasarkan slug, getUnitsByProject mengembalikan unit berdasarkan projectId, getUnitByCode menggunakan kombinasi projectId+unitCode, `npx tsc --noEmit` tanpa error.

- [ ] 6. Buat komponen UI dasar: buat di `src/components/ui/` — Button (primary/secondary/outline/whatsapp/disabled, sm/md/lg), Card, Badge (4 status unit + Coming Soon dengan warna dan teks label), Input, Select, Placeholder (foto/peta/denah/video). Gunakan cn() untuk class merging. **Acceptance:** Button mendukung 5 variant dengan ukuran, Badge menampilkan 4 status + Coming Soon, Placeholder menampilkan teks label eksplisit, minimum touch target 44x44px, `npx tsc --noEmit` tanpa error.

- [ ] 7. Buat Navbar, Footer, dan Language Switcher: buat `src/components/layout/Navbar.tsx` (Server), `src/components/layout/Footer.tsx`, `src/components/layout/LanguageSwitcher.tsx` (Client, toggle /id/ dan /en/ dengan mempertahankan path). Mobile: hamburger menu. **Acceptance:** Navbar konsisten di semua halaman, Language Switcher mempertahankan konteks halaman, mobile hamburger menu berfungsi, `npx tsc --noEmit` tanpa error.

- [ ] 8. Buat Breadcrumb dan Sidebar: buat `src/components/layout/Breadcrumb.tsx` (navigasi hierarki) dan `src/components/layout/Sidebar.tsx` (daftar proyek dengan indikator aktif, Pabuaran Coming Soon, navigasi kontekstual). Mobile: Sidebar collapse jadi toggle. **Acceptance:** Breadcrumb menampilkan path dengan tautan, Sidebar menampilkan daftar proyek dengan indikator aktif, Pabuaran menampilkan badge Coming Soon, mobile collapse berfungsi, `npx tsc --noEmit` tanpa error.

- [ ] 9. Buat WhatsAppButton: buat `src/features/contact/WhatsAppButton.tsx` menggunakan buildWhatsAppUrl() dari siteConfig. Seluruh CTA WhatsApp di seluruh website menggunakan nomor dari siteConfig (jangan hardcode di komponen lain). Deteksi placeholder nomor (mengandung X), tampilkan disabled state dan cegah navigasi. Berlaku juga untuk halaman Pabuaran Coming Soon. Buka di tab baru dengan target=_blank rel=noopener noreferrer. **Acceptance:** menggunakan nomor dari siteConfig (tidak ada hardcode), disabled jika mengandung X termasuk di halaman Pabuaran, buka di tab baru, mendukung pesan kustom sesuai konteks halaman dan bahasa locale aktif, `npx tsc --noEmit` tanpa error.

- [ ] 10. Implementasi Homepage: buat `src/app/[locale]/page.tsx` dengan hero (nama+tagline dari siteConfig), seksi keunggulan proyek Dehir, kartu proyek (Dehir aktif + Pabuaran Coming Soon), area galeri (placeholder), area video/GIF (placeholder), CTA bawah. **Acceptance:** hero menampilkan siteConfig.name dan tagline, kartu Dehir dapat diklik ke Halaman Eksplorasi, kartu Pabuaran menampilkan Coming Soon, galeri dan video placeholder, CTA WhatsApp dan Jelajahi Proyek tersedia, Navbar dan Footer ditampilkan, `npm run build` tanpa error.

- [ ] 11. Implementasi Katalog Proyek: buat `src/app/[locale]/projects/page.tsx` menampilkan daftar proyek. Dehir: info lengkap, dapat diklik. Pabuaran: badge Coming Soon. Tampilkan jumlah proyek aktif. **Acceptance:** Dehir menampilkan name/fullName/shortDescription/city/province, Pabuaran badge Coming Soon tanpa data detail, klik Dehir navigasi ke eksplorasi, klik Pabuaran menampilkan teaser, jumlah proyek aktif ditampilkan, `npm run build` tanpa error.

- [ ] 12. Implementasi Halaman Eksplorasi (Dehir): buat `src/app/[locale]/projects/[slug]/page.tsx` dengan layout Sidebar kiri + Google Maps kanan + Site Plan bawah. Dehir: info proyek, peta embed atau fallback teks kota/provinsi, tautan "Lihat di Google Maps" (eksternal, tab baru) jika `googleMapsUrl` tersedia, site plan atau UI placeholder "Denah belum tersedia", ringkasan status unit, CTA WhatsApp. Ringkasan status tidak menampilkan angka 0 untuk kategori yang seluruh unitnya `unknown` seolah tidak ada unit — tampilkan keterangan bahwa status belum dikonfirmasi. Pabuaran: teaser Coming Soon. Slug tidak dikenali: 404. **Acceptance:** layout Sidebar+Maps+SitePlan, fullName/description/city/province ditampilkan, Maps embed jika coordinates ada, tautan "Lihat di Google Maps" jika googleMapsUrl ada, Site Plan placeholder "Denah belum tersedia" jika aset belum ada, ringkasan status unit tidak menyesatkan untuk unit unknown, CTA WhatsApp dengan fullName, Pabuaran teaser Coming Soon tanpa data detail, 404 untuk slug tidak dikenali, `npm run build` tanpa error.

- [ ] 13. Implementasi Katalog Unit: buat `src/app/[locale]/projects/[slug]/units/page.tsx` menampilkan daftar unit dalam grid. Kartu unit: unitCode, unitType, status badge, landArea (jika ada), price atau Hubungi Marketing. Breadcrumb. **Acceptance:** daftar unit dengan projectId sesuai, unitCode/unitType/status ditampilkan, unknown=Belum Diketahui, landArea jika bukan undefined/null, price formatRupiah jika bukan null atau Hubungi Marketing, klik navigasi ke detail unit, breadcrumb, empty state, `npm run build` tanpa error.

- [ ] 14. Implementasi Detail Unit: buat `src/app/[locale]/projects/[slug]/units/[unitCode]/page.tsx` menampilkan info lengkap unit: unitCode, unitType, fullName proyek, landArea, dimensions, price, status badge, foto/placeholder, tautan ke Site Plan, CTA WhatsApp. **Acceptance:** unitCode/unitType/fullName ditampilkan, landArea dalam m² jika ada, dimensions sebagai width×length m, price formatRupiah atau ajakan hubungi marketing, badge status dengan teks label, unknown=badge abu-abu Belum Diketahui, foto atau placeholder, tautan ke Site Plan dengan parameter unitCode, CTA WhatsApp dengan unitCode+fullName, 404 untuk kombinasi tidak dikenali, `npm run build` tanpa error.

- [ ] 15. Implementasi Site Plan Interaktif (kondisional): buat `src/features/site-plan/SitePlanPanel.tsx` dan `src/features/site-plan/InteractiveSitePlan.tsx` (Client). Site Plan tetap terintegrasi di Halaman Eksplorasi (Req 3), bukan halaman terpisah. Jika denah resmi dan data posisi unit tersedia dan dikonfirmasi: tampilkan SVG interaktif dengan unit yang dapat diklik, highlight, panel info, CTA WhatsApp, tautan ke Detail Unit. Jika belum tersedia: tampilkan UI placeholder dengan teks "Denah belum tersedia" — bukan ilustrasi visual yang menyerupai denah resmi. Unit yang belum memiliki posisi di Site Plan tetap dapat ditemukan melalui daftar unit (Katalog Unit atau daftar teks di bawah site plan). **Acceptance:** SVG dengan unit dapat diklik hanya jika denah resmi tersedia, klik unit tampilkan panel info, highlight visual, status dibedakan dengan warna DAN teks, CTA WhatsApp dan tautan ke Detail Unit, deep-link dari Detail Unit ter-highlight otomatis, unit tanpa posisi ditampilkan di daftar teks terpisah (tetap dapat ditemukan), placeholder "Denah belum tersedia" jika aset belum ada (bukan denah ilustratif), prefers-reduced-motion dihormati, `npm run build` tanpa error.

- [ ] 16. Implementasi Formulir Minat Dehir: buat `src/app/[locale]/interest/page.tsx` dan `src/features/contact/InterestForm.tsx` (Client). Pilihan utama wajib (Kavling saja/Kavling+Bangunan), kode kavling opsional (A1-A4, B1-B5 dari brosur), visual cards tipe bangunan dengan tiga opsi: Type 1 Lantai (LB 46, 3KT), Type 1 Lantai Promo (LB 30, 2KT), Belum menentukan / ingin konsultasi. Gunakan gambar resmi dari brosur jika tersedia; jika belum, gunakan placeholder yang jelas. Pemilihan kode kavling adalah preferensi awal calon pembeli, bukan reservasi atau jaminan ketersediaan. Pertanyaan opsional, tombol kirim menyusun pesan WhatsApp. **Acceptance:** pilihan utama wajib, Kavling saja menampilkan kode A1-A4 B1-B5 opsional dengan keterangan preferensi bukan reservasi, Kavling+Bangunan menampilkan 3 visual cards (Type 1 Lantai, Type 1 Lantai Promo, Belum menentukan), gambar dari brosur jika tersedia atau placeholder, pertanyaan opsional, tombol kirim menyusun pesan WhatsApp dengan format yang ditentukan, field tidak diisi sebagai tanda -, CTA WhatsApp langsung tersedia, tidak ada penyimpanan data, hanya untuk Dehir, `npm run build` tanpa error.

- [ ] 17. Implementasi Teaser Coming Soon: buat halaman/modal teaser untuk Pabuaran. Nama proyek, badge Coming Soon, pesan singkat, CTA info terbaru. Tidak menampilkan data unit/harga/lokasi/site plan. **Acceptance:** nama Pabuaran dan fullName ditampilkan, badge Coming Soon jelas, tidak ada data unit/harga/site plan, CTA Hubungi untuk Info Terbaru tersedia, `npm run build` tanpa error.

- [ ] 18. Implementasi halaman 404 dan error boundary: buat `src/app/[locale]/not-found.tsx` (404 dengan tautan ke homepage) dan `src/app/[locale]/error.tsx` (error boundary Client Component dengan tombol retry — diperlukan `"use client"` untuk error boundary dan fungsi `reset()` Next.js). Keduanya bilingual. **Acceptance:** 404 menampilkan pesan dan tautan ke homepage, error.tsx menggunakan `"use client"` untuk error boundary dan tombol retry, bilingual, `npm run build` tanpa error.

- [ ] 19. Implementasi SEO metadata dan sitemap: tambahkan metadata (title, description, og tags, hreflang) ke setiap halaman via generateMetadata. Pastikan `<html lang>` mengikuti locale aktif. og:image menggunakan aset brand resmi jika tersedia; jika belum, jangan membuat aset fiktif. Buat `src/app/sitemap.ts` yang generate sitemap dari data JSON untuk kedua locale. **Acceptance:** setiap halaman punya title dan meta description unik (maks 160 char), og tags (og:title, og:description, og:locale) di setiap halaman, og:image hanya jika aset brand resmi tersedia, hreflang (id, en, x-default), html lang mengikuti locale aktif, sitemap mencakup semua halaman publik kedua bahasa, sitemap di-generate statis saat build, `npm run build` tanpa error.

- [ ] 20. Final build, lint, dan quality check: jalankan `npm run lint`, `npx tsc --noEmit`, `npm run build`. Perbaiki semua error dan warning. Verifikasi semua halaman dapat diakses di /id/ dan /en/. Periksa responsive hingga lebar 320px (no horizontal overflow, no content clipping, font minimum 14px). Periksa ukuran tap target minimum 44x44px. Periksa keyboard navigation dan focus state (kontras 3:1). Periksa alt text pada semua gambar. Periksa prefers-reduced-motion. Verifikasi penggunaan Next Image component (width, height, alt, sizes). Verifikasi progressive enhancement (halaman utama dapat dirender tanpa JS browser). **Acceptance:** npm run lint tanpa error, npx tsc --noEmit tanpa error, npm run build tanpa error, halaman dapat diakses di /id/ dan /en/, no horizontal scroll di 320px, tap target minimum 44x44px, keyboard navigation berfungsi dengan focus visible, alt text pada gambar informatif, reduced motion dihormati, Next Image digunakan dengan atribut lengkap, progressive enhancement terverifikasi, language switcher berfungsi, WhatsApp CTA berfungsi atau disabled jika nomor placeholder (termasuk Pabuaran), tidak ada data palsu yang ditampilkan.

---

## Notes

- Semua tugas menggunakan Bahasa Indonesia untuk implementasi (komentar kode, label UI)
- Data JSON menggunakan nilai placeholder (status: unknown, price: null) sampai perusahaan mengonfirmasi
- Kode kavling menggunakan format dari brosur: A1, A2, A3, A4, B1, B2, B3, B4, B5 (tanpa tanda hubung). Type definition `property.ts` saat ini menggunakan format `A-01` — konflik format ini menunggu konfirmasi P-20. Jangan mengubah format tanpa konfirmasi.
- Site Plan Interaktif (Task 15) hanya aktif jika denah resmi dan data posisi unit tersedia dan dikonfirmasi; jika tidak, tampilkan UI placeholder "Denah belum tersedia" (bukan ilustrasi visual yang menyerupai denah resmi)
- Formulir Minat (Task 16) hanya untuk Dehir selama Pabuaran Coming Soon
- Tidak ada backend, database, atau API eksternal di MVP
- Library baru yang direkomendasikan: `next-intl` (Task 1). Tidak menambahkan library lain tanpa alasan kuat.
- Ringkasan status unit di Halaman Eksplorasi tidak boleh menampilkan angka 0 untuk kategori yang seluruh unitnya `unknown` seolah-olah tidak ada unit tersedia — tampilkan keterangan bahwa status belum dikonfirmasi.
- Pabuaran Coming Soon juga mengikuti aturan disabled WhatsApp CTA jika nomor masih placeholder.
- error.tsx di Next.js App Router wajib menggunakan `"use client"` untuk error boundary dan fungsi `reset()`.
- og:image hanya menggunakan aset brand resmi jika tersedia; jangan membuat aset fiktif.

### Konflik / Open Questions yang Masih Tersisa

| # | Item | Status |
|---|---|---|
| P-20 | Format kode kavling: brosur pakai `A1` (tanpa hubung), type definition pakai `A-01` (dengan hubung). Task 4 menggunakan format brosur. Type definition perlu disesuaikan saat implementasi atau menunggu konfirmasi perusahaan. | Menunggu konfirmasi |
| P-09 | Google Maps API key vs embed: Task 12 menggunakan iframe embed. Jika perusahaan memiliki API key, pendekatan dapat diubah. | Menunggu konfirmasi / Design Phase |
| P-17 | Aset gambar tipe bangunan dari brosur untuk visual cards formulir: Task 16 menggunakan gambar brosur jika tersedia, placeholder jika belum. | Menunggu konfirmasi |

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "wave": 1,
      "tasks": [1, 2, 3],
      "reason": "Foundation: i18n routing, type definitions, config/CSS — no dependencies"
    },
    {
      "wave": 2,
      "tasks": [4, 6, 18],
      "reason": "Data and UI components — depends on wave 1"
    },
    {
      "wave": 3,
      "tasks": [5, 7, 9],
      "reason": "Services, layout components, WhatsApp button — depends on waves 1-2"
    },
    {
      "wave": 4,
      "tasks": [8, 10, 11, 16, 17],
      "reason": "Sidebar, Homepage, Katalog Proyek, Formulir Minat, Coming Soon — depends on waves 1-3"
    },
    {
      "wave": 5,
      "tasks": [12, 13],
      "reason": "Halaman Eksplorasi and Katalog Unit — depends on layout and services"
    },
    {
      "wave": 6,
      "tasks": [14],
      "reason": "Detail Unit — depends on Katalog Unit and WhatsApp"
    },
    {
      "wave": 7,
      "tasks": [15],
      "reason": "Site Plan Interaktif — depends on Eksplorasi, Detail Unit, and WhatsApp"
    },
    {
      "wave": 8,
      "tasks": [19],
      "reason": "SEO and Sitemap — depends on all page implementations"
    },
    {
      "wave": 9,
      "tasks": [20],
      "reason": "Final build and lint check — depends on everything"
    }
  ]
}
```
