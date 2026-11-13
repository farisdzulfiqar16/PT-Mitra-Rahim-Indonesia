# Celestia — Existing Implementation & Technical Audit

**Tanggal audit:** November 2026  
**Auditor:** Kiro (read-only audit berdasarkan source code)  
**Cakupan:** Wave 1–8 + UI redesign (V2)  
**Revisi:** Audit diperluas mencakup keseluruhan source code  
**Status:** Prototype aktif, build **RUSAK** (build error aktif)

---

## Cakupan Audit

### Area yang Berhasil Diperiksa

| Area | Rincian |
|---|---|
| **Halaman (pages)** | Semua 12 route di `src/app/` termasuk `[locale]`, `[slug]`, `[unitCode]` |
| **Komponen** | Semua 11 komponen di `src/components/` (homepage, layout, projects, ui) |
| **Features** | `src/features/site-plan/` (SitePlanPanel, InteractiveSitePlan) |
| **Config** | `src/config/site.ts`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` |
| **i18n** | `src/i18n/` (config, request, messages ID & EN) |
| **Data** | `src/data/` (dehir.json, pabuaran.json, dehir-units.json) |
| **Types** | `src/types/` (project.ts, property.ts, index.ts) |
| **Utils** | `src/lib/utils.ts` |
| **Middleware** | `src/proxy.ts` |
| **SEO/Routing** | `src/app/robots.ts`, `src/app/sitemap.ts` |
| **Aset** | `public/` (6 file) |
| **Dokumentasi** | `docs/` (5 file + 3 konsultasi) |
| **Konfigurasi root** | `package.json`, `.gitignore`, `.env.local.example`, `AGENTS.md`, `README.md` |
| **Build output** | `.next/` (manifest, routes, build artifacts — selektif) |
| **Dependencies** | `node_modules/` (inventory via package.json + node_modules listing) |

### Area yang Tidak Dapat Diverifikasi

| Area | Alasan |
|---|---|
| Perilaku runtime browser | Tidak menjalankan server; redirect, animasi, hover state tidak diuji langsung |
| Rendering mobile fisik | Tidak ada akses ke device nyata |
| Performance runtime | Tidak ada profiling |
| Git history | Tidak diperiksa (tidak relevan untuk audit state saat ini) |
| Node.js version aktif | Tidak dicek via command; diasumsikan ≥18 |

---

## 1. Executive Summary

Website Celestia MVP dibangun dengan fondasi teknis yang solid: Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, dan next-intl untuk bilingual. Semua halaman utama telah diimplementasikan dengan UI V2 yang mengikuti mockup referensi.

**⚠️ TEMUAN BARU KRITIS: Build rusak** — `src/app/[locale]/projects/[slug]/units/page.tsx` memiliki 14 karakter `-` ilegal di baris pertama file, menyebabkan `Turbopack build failed: Import is not allowed here`. Website tidak dapat di-build untuk produksi dalam kondisi ini.

**Kondisi keseluruhan:** Build rusak. Perlu perbaikan file sebelum prototype dapat berjalan di lingkungan produksi.

**Temuan kritis:**
- **🔴 BUILD RUSAK** — `units/page.tsx` memiliki karakter ilegal di baris 1, menyebabkan Turbopack error
- **Nomor WhatsApp masih placeholder** — seluruh CTA WhatsApp di-disable secara otomatis
- **Services layer belum diimplementasikan** — semua page import JSON langsung, melanggar arsitektur yang direncanakan
- **Tidak ada foto/video/logo resmi** — semua konten visual adalah placeholder
- **Domain belum dikonfirmasi** — SEO canonical dan hreflang tidak aktif
- **Formulir Minat (Task 16) belum ada** — halaman `/interest` tidak eksis

**Yang sudah berjalan baik:**
- Routing bilingual (ID/EN) berfungsi penuh
- SEO metadata, robots.txt, dan sitemap.xml terpasang dengan benar
- Proteksi indexing prototype aktif (noindex/nofollow)
- Desain UI V2 mengikuti mockup referensi
- TypeScript strict dan lint: bersih (hanya build Turbopack yang rusak)

---

## 2. Kondisi Website dan Halaman

### Inventarisasi Halaman

| Route | Nama Halaman | Status | Catatan |
|---|---|---|---|
| `/id` / `/en` | Homepage | ✅ Fungsional | V2 aktif, data placeholder |
| `/id/projects` / `/en/projects` | Katalog Proyek | ✅ Fungsional | V2 aktif, dua proyek |
| `/id/projects/dehir` | Eksplorasi Dehir | ✅ Fungsional | V2 aktif, unit grid |
| `/id/projects/pabuaran` | Pabuaran Coming Soon | ✅ Fungsional | Teaser ditampilkan |
| `/id/projects/dehir/units` | Katalog Unit | ✅ Fungsional | 9 unit, semua unknown |
| `/id/projects/dehir/units/[A1-B5]` | Detail Unit | ✅ Fungsional | Data minimal |
| `/id/interest` | Formulir Minat | ❌ Not Implemented | Route tidak ada |
| `/id/contact` | Kontak | ❌ Not Implemented | Nav link mengarah ke halaman kosong |
| `/robots.txt` | Robots | ✅ Fungsional | Allow: /, noindex via meta |
| `/sitemap.xml` | Sitemap | ✅ Fungsional | Kosong karena siteUrl belum diisi |
| `/_not-found` / `/id/not-found` | 404 | ✅ Fungsional | Bilingual |
| `/[locale]/error` | Error Boundary | ✅ Fungsional | Client component, retry button |

### Redirect dan Routing

- URL tanpa prefix (`/projects/dehir`) → redirect ke `/id/projects/dehir` ✅
- Unknown locale → redirect ke `/id/` equivalen ✅
- Language switcher Navbar → bekerja (ganti `/id/` ↔ `/en/`) ✅
- Language switcher di Navbar V2 **tidak mempertahankan path saat ini** (langsung ke `/id` atau `/en`) — ini adalah **partial functional** karena tidak menggunakan `LanguageSwitcher` component yang seharusnya ada dari Task 7

---

## 3. UI & Functional Audit

### 3.1 Navigasi

| Elemen | Status | Catatan |
|---|---|---|
| Navbar logo → homepage | ✅ Functional | |
| Navbar: Beranda/Home | ✅ Functional | |
| Navbar: Proyek/Projects | ✅ Functional | |
| Navbar: Dehir (V2) | ✅ Functional | Link ke `/projects/dehir` |
| Navbar: Site Plan (V2) | ✅ Functional | Link ke `/projects/dehir/units` |
| Navbar: Formulir Minat (V2) | ⚠️ Partially Functional | Link ke `/interest` — halaman tidak ada, klik → 404 |
| Navbar: Hubungi/Contact (V1 & V2) | ⚠️ Partially Functional | Link ke `/contact` — halaman tidak ada, klik → 404 |
| Navbar: WhatsApp CTA button (V2) | ⚠️ Dummy | Tampil disabled (placeholder nomor) |
| Language switcher ID/EN | ⚠️ Partially Functional | Switch bekerja tapi tidak mempertahankan path lengkap di semua kondisi |
| Breadcrumb semua halaman | ✅ Functional | |
| Footer | ✅ Functional | V2: compact horizontal |

### 3.2 Button dan CTA

| Elemen | Halaman | Status | Catatan |
|---|---|---|---|
| "Jelajahi Proyek" | Homepage | ✅ Functional | Navigasi ke /projects |
| "Tanya Marketing" WA CTA | Homepage | ⚠️ Dummy | Disabled — nomor placeholder |
| "Lihat Detail" Dehir | Homepage | ✅ Functional | |
| "Info Terbaru" Pabuaran | Homepage | ✅ Functional | → /projects/pabuaran |
| "Lihat Detail" per proyek | Katalog Proyek | ✅ Functional | |
| "Hubungi Info Terbaru" Pabuaran | Katalog Proyek | ✅ Functional | |
| Filter chips (Semua/Tersedia/...) | Eksplorasi & Katalog Unit | ⚠️ Dummy | Visual only — tidak memfilter data |
| "Detail" per unit card | Eksplorasi & Katalog Unit | ✅ Functional | Navigasi ke detail unit |
| "WA" per unit card | Eksplorasi & Katalog Unit | ⚠️ Dummy | Disabled — nomor placeholder |
| "Ajukan Minat via WhatsApp" | Detail Unit | ⚠️ Dummy | Disabled — nomor placeholder |
| "Lihat di Site Plan" | Detail Unit | ✅ Functional | → /projects/dehir?unit=X |
| Tombol "Coba lagi" | Error boundary | ✅ Functional | |
| "Kembali ke Beranda" | 404 | ✅ Functional | |

### 3.3 Form dan Input

| Elemen | Status | Catatan |
|---|---|---|
| Formulir Minat | ❌ Not Implemented | Task 16 belum dikerjakan |
| Komponen `Input` | ✅ Functional | Ada di `/src/components/ui/Input.tsx`, belum digunakan di halaman |
| Komponen `Select` | ✅ Functional | Ada di `/src/components/ui/Select.tsx`, belum digunakan di halaman |
| Komponen `Button` | ✅ Functional | Ada tapi tidak dipakai di halaman — halaman memakai tag `<a>` dan `<Link>` langsung |

### 3.4 Interaktivitas

| Fitur | Status | Catatan |
|---|---|---|
| Site Plan Interaktif | ❌ Not Implemented | `InteractiveSitePlan` adalah stub yang return null |
| Filter/sort unit | ⚠️ Dummy | Chip visual saja, tidak ada logika filter |
| Deep-link unit ke site plan (`?unit=X`) | ✅ Functional | Parameter diterima, ditandai di unit list |
| Galeri foto | ⚠️ Dummy | Semua placeholder |
| Video embed | ⚠️ Dummy | Placeholder |
| Peta Google Maps | ⚠️ Dummy | Placeholder (koordinat dan API key belum ada) |

---

## 4. Data & Content Asset Inventory

### 4.1 Data Proyek

| Item | Status | Nilai Saat Ini | Keterangan |
|---|---|---|---|
| Nama proyek Dehir | ✅ Tersedia | "Celestia Jatiluhur" | Dari konsultasi awal |
| Nama proyek Pabuaran | ✅ Tersedia | "Celestia Jatiranggon" | Dari konsultasi awal |
| Deskripsi Dehir | ⚠️ Placeholder | Teks generik | Belum teks resmi dari perusahaan |
| Kota/provinsi Dehir | ⚠️ Perlu konfirmasi | Jatiluhur, Jawa Barat | Diambil dari nama proyek |
| Koordinat GPS Dehir | ❌ Belum ada | — | Diperlukan untuk Google Maps |
| URL Google Maps Dehir | ❌ Belum ada | — | Diperlukan untuk tombol "Lihat di Maps" |
| Tagline resmi | ⚠️ Placeholder | "Temukan Hunian Impian Anda" | Belum dikonfirmasi |
| Nomor WhatsApp | ❌ Placeholder | `62XXXXXXXXXX` | **Blokir semua CTA WA** |

### 4.2 Data Unit Kavling

| Item | Status | Nilai Saat Ini | Keterangan |
|---|---|---|---|
| Daftar kode unit | ✅ Tersedia | A1, A2, A3, A4, B1, B2, B3, B4, B5 | 9 unit dari brosur |
| Status setiap unit | ❌ Belum dikonfirmasi | Semua `unknown` | Perlu konfirmasi perusahaan |
| Luas tanah (m²) | ❌ Belum ada | undefined/null semua | Perlu data dari perusahaan |
| Dimensi kavling | ❌ Belum ada | undefined/null semua | Perlu data dari perusahaan |
| Harga | ❌ Belum ada | null semua | Perlu keputusan bisnis apakah dipublikasikan |
| Tipe unit | ✅ Tersedia | "kavling" semua | |

> **File:** `src/data/properties/dehir-units.json` — semua field opsional kosong

### 4.3 Aset Visual

| Aset | Halaman Terdampak | Status | Format yang Dibutuhkan |
|---|---|---|---|
| Foto proyek Dehir (eksterior) | Homepage, Eksplorasi, Katalog | ❌ Placeholder | JPG/WebP, min 1200px lebar |
| Foto per unit/kavling | Katalog Unit, Detail Unit | ❌ Placeholder | JPG/WebP |
| Denah/Site Plan resmi | Eksplorasi Dehir | ❌ Placeholder | SVG (untuk interaktif) atau PNG |
| Video promosi | Homepage | ❌ Placeholder | MP4 atau YouTube embed URL |
| Logo Celestia | Navbar, Favicon | ❌ Belum ada | SVG + PNG, favicon 48x48 |
| Gambar tipe bangunan (brosur) | Formulir Minat (belum ada) | ❌ Belum ada | JPG/PNG dari brosur digital |
| Favicon | Browser tab | ⚠️ Default Next.js | ICO/SVG kustom Celestia |

> **File di public/:** Saat ini hanya berisi SVG default Next.js dan satu gambar brosur (`Hybrid 1 — A Dominan, C Diserap@2x.png`) yang belum diintegrasikan ke kode.

### 4.4 File public/ yang Ada

```
public/
├── file.svg           (default Next.js)
├── globe.svg          (default Next.js)
├── next.svg           (default Next.js)
├── vercel.svg         (default Next.js)
├── window.svg         (default Next.js)
└── Hybrid 1 — A Dominan, C Diserap@2x.png  (1.4MB — tidak digunakan di kode)
```

---

## 5. Technology & Dependency Inventory

### 5.1 Framework dan Runtime

| Teknologi | Versi | Status | Catatan |
|---|---|---|---|
| Next.js | 16.4.4 | ✅ Direct dep, digunakan aktif | App Router, Turbopack (build) |
| React | 19.3.0 | ✅ Direct dep, digunakan aktif | |
| React DOM | 19.3.0 | ✅ Direct dep, digunakan aktif | |
| TypeScript | ^5 | ✅ DevDep, aktif | strict mode on |
| Node.js | ≥18 (diasumsikan) | ✅ Runtime | Tidak di-pin di package.json |

### 5.2 Styling

| Teknologi | Versi | Status | Catatan |
|---|---|---|---|
| Tailwind CSS | ^4 | ✅ DevDep, aktif | Konfigurasi via CSS `@theme inline`, bukan tailwind.config.js |
| `@tailwindcss/turbopack` | ^4 | ✅ DevDep, aktif | Loader CSS untuk Turbopack |

### 5.3 i18n

| Teknologi | Versi | Status | Catatan |
|---|---|---|---|
| next-intl | ^4.14.9 | ✅ Direct dep, aktif | Routing, terjemahan, locale detection |

### 5.4 Build & Linting

| Teknologi | Versi | Status | Catatan |
|---|---|---|---|
| ESLint | ^9 | ✅ DevDep, aktif | Config flat, core-web-vitals + typescript rules |
| eslint-config-next | 16.4.4 | ✅ DevDep, aktif | |

### 5.5 Tidak Ada Dependency Tambahan

Tidak ada:
- State management library (Zustand, Redux, Jotai, dsb.)
- UI component library (shadcn/ui, MUI, Radix, dsb.)
- Form library (React Hook Form, Formik, dsb.)
- Query library (TanStack Query, SWR, dsb.)
- Animation library (Framer Motion, Anime.js, dsb.)
- Database, ORM, atau backend
- Authentication (NextAuth, Clerk, dsb.)
- Analytics (GA, Posthog, dsb.)
- Error monitoring (Sentry, dsb.)
- AWS SDK atau dependency cloud lainnya

> ✅ Tidak ada AWS (Amazon Web Services) yang digunakan. Tidak ada `aws-sdk`, `@aws-sdk/*`, atau konfigurasi AWS yang ditemukan di seluruh codebase.

### 5.6 Konfigurasi Environment Variables

| Variable | File | Status | Keterangan |
|---|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `.env.local.example` | ⚠️ Defined tapi tidak dipakai | Nomor WA di-hardcode di `siteConfig`, bukan dari env |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `.env.local.example` (commented out) | ❌ Tidak digunakan | Belum ada implementasi Maps |
| `NODE_ENV` | `.env.local.example` | ✅ Standard Next.js | |

> **Catatan penting:** `.env.local` tidak ada di sistem. Saat ini tidak ada production secrets aktif. Nomor WhatsApp di-hardcode di `src/config/site.ts` sebagai placeholder `62XXXXXXXXXX`.

> **Risk:** Variable `NEXT_PUBLIC_WHATSAPP_NUMBER` di `.env.local.example` didefinisikan tapi tidak digunakan di kode. Jika nanti nomor WA diisi di env tapi kode masih membaca dari `siteConfig`, nomor tidak akan terupdate. **Perlu sinkronisasi** antara env dan siteConfig.

---

## 6. External Services & Integration

| Layanan | Status | Keterangan |
|---|---|---|
| WhatsApp (wa.me) | ⚠️ Disabled | URL dibangun tapi CTA non-aktif karena nomor placeholder |
| Google Maps | ❌ Tidak terpasang | Placeholder saja, tidak ada API key atau embed |
| Google Analytics | ❌ Tidak ada | Tidak dipasang |
| Vercel / Netlify / Hosting | ❌ Belum dikonfigurasi | Tidak ada konfigurasi deploy |
| Domain (celestia.id) | ❌ Belum dikonfirmasi | URL masih placeholder di `siteConfig.url` |
| CDN / Image optimization | ⚠️ Next.js built-in | Belum ada gambar nyata, optimasi belum dapat diuji |

---

## 7. Code Quality & Technical Risks

### 7.1 Deviasi dari Arsitektur yang Direncanakan

| Masalah | Lokasi | Severity | Keterangan |
|---|---|---|---|
| Services layer (Task 5) tidak diimplementasikan | Semua page files | **High** | Semua halaman import JSON langsung: `import dehirData from "@/data/projects/dehir.json"`. Ini melanggar prinsip arsitektur yang didokumentasikan di `ARCHITECTURE.md`. Migrasi ke services akan mudah di masa depan, tapi harus segera dilakukan sebelum codebase berkembang. |
| `Button` component tidak dipakai di halaman | Semua halaman V2 | **Medium** | Halaman menggunakan `<Link>` dan `<a>` dengan Tailwind langsung, bukan `Button` component. Button component ada tapi tidak digunakan. Inkonsistensi ini akan menjadi masalah saat ada perubahan gaya global. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` env tidak terhubung ke kode | `.env.local.example`, `site.ts` | **Medium** | Disconnect antara env variable yang didefinisikan dan kode yang menggunakan hardcoded value. |
| Feature flag `uiConfig.uiVariant` di-hardcode | `src/config/site.ts` | **Low** | Tidak ada env variable untuk mengontrol variant. Ubah kode = deploy baru. Acceptable untuk sekarang. |

### 7.2 Fitur Belum Diimplementasikan

| Fitur | Task | Status | Dampak |
|---|---|---|---|
| Services layer | Task 5 | ❌ Tidak ada folder `src/services/` | Arsitektur tidak sesuai rencana |
| `WhatsAppButton` component | Task 9 | ❌ Tidak ada `src/features/contact/WhatsAppButton.tsx` | WA CTA diimplementasikan inline di setiap komponen, duplikasi logika |
| `LanguageSwitcher` component | Task 7 | ❌ Tidak ada `src/components/layout/LanguageSwitcher.tsx` | Language switcher di Navbar tidak mempertahankan path |
| `Breadcrumb` component | Task 8 | ❌ Tidak ada komponen terpisah | Breadcrumb di-inline setiap halaman, duplikasi |
| `Sidebar` component | Task 8 | ❌ Tidak ada komponen terpisah | Sidebar di-inline di halaman eksplorasi |
| Formulir Minat | Task 16 | ❌ Tidak ada halaman `/interest` | Nav link menghasilkan 404 |
| Site Plan Interaktif | Task 15 | ⚠️ Stub only | `InteractiveSitePlan` return null, menunggu denah |
| Teaser Coming Soon (halaman terpisah) | Task 17 | ⚠️ Inline only | Teaser Pabuaran di-inline di dalam halaman eksplorasi, bukan halaman terpisah |
| Google Maps embed | Task 12 | ⚠️ Placeholder | Tidak ada koordinat atau API key |

### 7.3 Duplikasi Logika

| Duplikasi | Lokasi | Catatan |
|---|---|---|
| WhatsApp URL building | `HomepageV2`, `ExplorationV2`, `UnitCatalogV2`, `UnitDetailV2`, `Navbar` | Logika `isWhatsAppNumberPlaceholder()` + `buildWhatsAppUrl()` dipanggil di 5+ tempat berbeda. Seharusnya `WhatsAppButton` component. |
| Breadcrumb markup | 4 halaman + 2 komponen V2 | Markup breadcrumb ditulis ulang di setiap halaman. |
| Filter chips (Semua/Tersedia/...) | `ExplorationV2`, `UnitCatalogV2` | Duplikasi visual tanpa logika. |

### 7.4 Error Handling

| Kondisi | Status | Catatan |
|---|---|---|
| Slug proyek tidak valid | ✅ notFound() | `notFound()` dipanggil dengan benar |
| Unit code tidak valid | ✅ notFound() | `notFound()` dipanggil dengan benar |
| Locale tidak valid | ✅ notFound() | Middleware + layout menangani |
| Error runtime | ✅ Error boundary | `error.tsx` ada dengan tombol retry |
| Data JSON kosong/undefined | ✅ Partial | Empty state untuk unit kosong ada |
| Loading state | ⚠️ Tidak ada | Tidak ada loading UI — acceptable karena SSR |

### 7.5 TypeScript dan Build

| Check | Status |
|---|---|
| `npx tsc --noEmit` | ✅ 0 error |
| `npm run lint` | ✅ 0 error |
| `npm run build` | 🔴 **GAGAL** — Build error aktif |

**Detail build error:**
```
./src/app/[locale]/projects/[slug]/units/page.tsx:5:8
Error: Import is not allowed here

> 5 | import type { Metadata } from "next";
    |        ^^^^
```

**Penyebab root:** File `src/app/[locale]/projects/[slug]/units/page.tsx` memiliki 14 karakter `-` di baris pertama sebelum komentar JSDoc. Ini menyebabkan Turbopack gagal mem-parse file sebagai modul ECMAScript yang valid.

**Bukti:**
```
# Byte hex 14 pertama file:
2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D 2D  (14x karakter '-')
2F 2A 2A  (kemudian '/**')
```

**File lain yang diperiksa:** `units/[unitCode]/page.tsx` bersih (dimulai dengan `/**`).

### 7.6 Temuan Tambahan dari Audit Lanjutan

#### a. Hardcode string bahasa Indonesia yang bypass i18n

Ditemukan di beberapa komponen V2 — string ini tidak melalui sistem terjemahan next-intl, sehingga selalu tampil dalam Bahasa Indonesia meskipun locale aktif adalah English:

| String | File | Baris | Dampak |
|---|---|---|---|
| `"Jelajahi properti"` | `ExplorationV2.tsx` | ~92 | Selalu ID |
| `"📍 Lokasi"` | `ExplorationV2.tsx` | ~146 | Selalu ID |
| `"Kavling"` (label kecil) | `ExplorationV2.tsx`, `UnitCatalogV2.tsx`, `UnitDetailV2.tsx` | ~219, ~121, ~101 | Selalu ID |
| `"Luas"`, `"Harga"`, `"Status"` | `ExplorationV2.tsx`, `UnitCatalogV2.tsx` | ~228-240, ~130-140 | Selalu ID |
| `"Unit"` (breadcrumb label) | `UnitCatalogV2.tsx` | ~57 | Selalu ID |
| `"Kavling ({unitCode})"` (judul h1) | `UnitDetailV2.tsx` | ~101 | Selalu ID |
| `"proyek aktif"` / `"active project"` | `projects/page.tsx` | ~83 | String bilingual inline (bukan dari messages) |
| `"Semua"` / `"All"` (filter) | `[slug]/page.tsx`, `units/page.tsx` | ~156, ~108 | Bilingual inline |
| Hero sub-text EN/ID | `[locale]/page.tsx` | ~90-91 | String panjang bilingual inline |

**Severity:** Medium — Website tidak sepenuhnya bilingual untuk halaman-halaman V2.

#### b. Komponen UI yang didefinisikan tapi tidak dipakai di halaman

| Komponen | File | Digunakan di |
|---|---|---|
| `Button` | `src/components/ui/Button.tsx` | Tidak digunakan di halaman manapun — halaman memakai `<Link>` dan `<a>` langsung |
| `Input` | `src/components/ui/Input.tsx` | Belum digunakan (Formulir Minat belum ada) |
| `Select` | `src/components/ui/Select.tsx` | Belum digunakan (Formulir Minat belum ada) |

#### c. Next.js Image component tidak digunakan

`next/image` tidak diimpor di manapun dalam codebase. Semua tampilan gambar menggunakan komponen `Placeholder`. Ketika foto nyata tersedia, perlu dipastikan menggunakan `<Image>` dari `next/image` untuk optimasi otomatis (WebP conversion, lazy loading, responsive sizes).

#### d. `sharp` ada di node_modules tapi tidak di-import

`sharp` tersedia sebagai transitive dependency Next.js (untuk optimasi gambar server-side). Tidak perlu diimpor secara manual — Next.js menggunakannya secara otomatis saat `<Image>` dipakai. Saat ini tidak relevan karena `next/image` belum digunakan.

#### e. `zod` dan `zod-validation-error` ada di node_modules

Dua package ini ada di `node_modules/` tapi tidak ada di `package.json` dependencies dan tidak diimpor di source code. Kemungkinan transitive dependency dari `next-intl` atau ESLint. Tidak perlu ditangani.

#### f. Karakter V2 di `ExplorationV2.tsx` mengandung label "Reservasi" di komentar

Komentar JSDoc di baris 7 `ExplorationV2.tsx` menyebut "Filter/tab bar (Semua, Tersedia, Proses, Terjual, **Reservasi**)". `UnitStatus` tidak memiliki nilai `"reservasi"` — ini kemungkinan copy-paste dari desain lama. Tidak berdampak pada runtime (hanya komentar), tapi perlu diklarifikasi.

#### g. Import tidak terpakai di halaman setelah penambahan V2

Beberapa page file mengimpor komponen dan types yang tidak digunakan di jalur V2 aktif:

| File | Import tidak terpakai (saat V2 aktif) |
|---|---|
| `projects/page.tsx` | `Card`, `Badge`, `Placeholder` (hanya dipakai di V1 fallback) |
| `projects/[slug]/page.tsx` | `Card`, `Badge`, `Placeholder`, `Link`, `SitePlanPanel` (hanya di V1 fallback) |
| `projects/[slug]/units/[unitCode]/page.tsx` | `Badge`, `Placeholder`, `Link`, `formatRupiah` (hanya di V1 fallback) |

**Severity:** Low — Tidak menyebabkan error, tapi menambah bundle size sedikit dan bisa memunculkan lint warning di masa depan.

#### h. Konfigurasi tsconfig: incremental build dengan tsbuildinfo

`tsconfig.json` mengaktifkan `"incremental": true`, menghasilkan file `tsconfig.tsbuildinfo` di root. File ini ada di `.gitignore` secara implisit (karena `*.tsbuildinfo` ada di `.gitignore`). Tidak ada masalah.

#### i. `.vscode/settings.json` kosong

File ada tapi isinya `{}`. Tidak berdampak, tapi tidak ada value yang dikonfigurasi untuk konsistensi formatting antar developer.

#### j. AGENTS.md — instruksi untuk AI coding assistant

`AGENTS.md` berisi instruksi untuk Next.js 16 API yang ditambahkan otomatis oleh `next dev`. Ini adalah mekanisme resmi Next.js 16, bukan kode bisnis. File harus tetap di-commit apa adanya.

#### k. README.md tidak mencerminkan state terkini

`README.md` menunjukkan semua fitur MVP sebagai "Planned" dan status pengembangan sebagai "Upcoming". Ini tidak akurat lagi karena sebagian besar sudah diimplementasikan.

#### l. Turbopack warning: package-lock.json di luar Git repository

```
⚠ Warning: Next.js ignored package-lock.json in C:\Users\faris dzulfiqar
because it is outside the current Git repository
```

Git repository ada di `celestia-web/` tapi `package-lock.json` berada satu level lebih tinggi dari yang dikenali Turbopack. Ini terjadi karena struktur direktori proyek (`magang PT.../Celestia/celestia-web/.git`). Solusi: tambahkan `turbopack.root` di `next.config.ts`. Warning ini tidak memblokir build tapi muncul setiap run.

---

## 8. Security & Operational Readiness

### 8.1 Pengelolaan Secrets

| Item | Status | Catatan |
|---|---|---|
| `.env.local` | ✅ Tidak ada | Tidak ada secret aktif |
| `.gitignore` | ✅ Ada | `.env.local` sudah ada di .gitignore |
| Nomor WhatsApp | ⚠️ Hardcoded placeholder | `62XXXXXXXXXX` di `site.ts` — aman karena placeholder, tapi perlu dipindah ke env sebelum nomor nyata diisi |
| API key (Maps, dsb.) | ✅ Tidak ada | Belum dipasang |
| Credentials lainnya | ✅ Tidak ada | Tidak ada backend, database, atau auth |

### 8.2 Perlindungan Prototype

| Mekanisme | Status | Keterangan |
|---|---|---|
| `robots.txt`: `Allow: /` | ✅ Aktif | Crawler bisa masuk tapi tidak akan index |
| Meta robots: `noindex, nofollow` | ✅ Aktif | Setiap halaman punya meta robots noindex |
| `seoConfig.indexingEnabled = false` | ✅ Aktif | Dikontrol via config, tidak otomatis dari NODE_ENV |
| Sitemap kosong (siteUrl belum diisi) | ✅ Aktif | `sitemap.xml` mengembalikan `<urlset/>` kosong |
| Canonical/hreflang tidak diterbitkan | ✅ Aktif | `buildAlternates()` return undefined jika siteUrl kosong |

### 8.3 Kebutuhan Hosting/Deployment

| Item | Status | Keterangan |
|---|---|---|
| Platform hosting | ❌ Belum dipilih | Vercel/Netlify/VPS belum ditentukan |
| Domain | ❌ Belum dikonfirmasi | `celestia.id` belum dikonfirmasi perusahaan |
| Environment variables produksi | ❌ Belum ada | Perlu diisi saat deploy |
| HTTPS/SSL | ❌ Belum dikonfigurasi | Bergantung pada platform hosting |
| Backup data | N/A | Data statis di repo Git |

---

## 9. Business Baseline Alignment

Referensi: `docs/consultation/company-information-checklist.md`

### 9.1 Sudah Diimplementasikan (Already Implemented)

- ✅ Website bilingual ID/EN dengan routing `/id/` dan `/en/`
- ✅ Menampilkan daftar proyek (Dehir aktif + Pabuaran Coming Soon)
- ✅ Halaman eksplorasi proyek Dehir dengan daftar unit
- ✅ Detail unit dengan informasi yang tersedia
- ✅ Badge status unit (Tersedia/Proses/Terjual/Belum Diketahui)
- ✅ Perlindungan data: unit dengan status unknown tidak menampilkan angka 0 misleading
- ✅ WhatsApp CTA dengan pesan kontekstual per halaman (dinonaktifkan karena nomor placeholder)
- ✅ Proteksi prototype: noindex/nofollow di semua halaman
- ✅ SEO metadata bilingual per halaman
- ✅ 404 dan error boundary bilingual
- ✅ Responsive design (mobile → desktop)
- ✅ Minimum touch target 44px
- ✅ Keyboard navigation & focus state

### 9.2 Partially Implemented

- ⚠️ **Peta lokasi Dehir** — Ada placeholder, belum ada koordinat atau Maps embed
- ⚠️ **Site Plan** — Panel ada, tapi interaktif SVG belum aktif (menunggu denah resmi)
- ⚠️ **Language switcher** — Berfungsi tapi tidak sepenuhnya mempertahankan sub-path
- ⚠️ **Teaser Pabuaran** — Ada tapi inline di halaman eksplorasi, bukan halaman Coming Soon terpisah
- ⚠️ **Galeri foto** — Placeholder grid ada, belum ada foto nyata
- ⚠️ **Video promo** — Placeholder ada, belum ada konten

### 9.3 Not Implemented

- ❌ **Formulir Minat Dehir** (`/interest`) — Task 16 belum dikerjakan
- ❌ **Services layer** — Task 5 belum dikerjakan
- ❌ **WhatsAppButton component** — Task 9 belum dikerjakan (logika ada inline)
- ❌ **LanguageSwitcher component** — Task 7 sebagian (switcher ada tapi bukan komponen terpisah)
- ❌ **Breadcrumb component** — Task 8 sebagian (markup ada inline)
- ❌ **Sidebar component** — Task 8 sebagian (markup ada inline di halaman)

### 9.4 Pending Business Confirmation (Blocker)

- 🔒 Nomor WhatsApp marketing Dehir
- 🔒 Status setiap kavling (A1–B5)
- 🔒 Luas dan dimensi kavling
- 🔒 Harga kavling (atau keputusan "Hubungi Marketing")
- 🔒 Denah/site plan resmi Dehir (untuk Site Plan Interaktif)
- 🔒 Posisi setiap kavling di denah
- 🔒 Foto proyek Dehir
- 🔒 Koordinat GPS dan URL Google Maps Dehir
- 🔒 Logo Celestia resmi
- 🔒 Tagline resmi
- 🔒 Domain produksi (`celestia.id` atau lainnya)
- 🔒 Konfirmasi format kode kavling (`A1` vs `A-01`)

### 9.5 Out of Current Scope

Sesuai `ARCHITECTURE.md` dan keputusan bisnis:
- Login pengguna / customer portal
- Online payment / booking / reservasi
- Dashboard admin untuk update data
- Backend/database real-time
- VA (virtual assistant) / chatbot
- Google Analytics (belum dipasang, menunggu persetujuan)
- Integrasi CRM

---

### 10. Recommended Next Actions

### Critical — Harus sebelum demo atau pengembangan lanjutan

| # | Aksi | Alasan | Bukti / File |
|---|---|---|---|
| **C-0** | **Perbaiki build error di `units/page.tsx`** | Build produksi gagal total. Hapus 14 karakter `-` di baris 1 file. | `src/app/[locale]/projects/[slug]/units/page.tsx` baris 1 |
| C-1 | Perbaiki link Navbar: hapus atau tambahkan halaman placeholder untuk `/contact` dan `/interest` | Link mati menghasilkan 404 saat demo | `src/components/layout/Navbar.tsx` |
| C-2 | Minta nomor WhatsApp dari perusahaan dan update `siteConfig` | Semua CTA WA non-fungsional | `src/config/site.ts` |

### High — Sebelum pengembangan lanjutan

| # | Aksi | Alasan | Referensi |
|---|---|---|---|
| H-1 | Implementasikan services layer (`src/services/projects.ts`, `src/services/properties.ts`) | Semua halaman masih import JSON langsung, melanggar arsitektur dokumentasi. | Task 5, `ARCHITECTURE.md` |
| H-2 | Buat `WhatsAppButton` component di `src/features/contact/` | Logika WA duplikat di 5+ tempat | Task 9 |
| H-3 | Buat halaman Formulir Minat (`/interest`) | Link di Navbar menghasilkan 404 | Task 16 |
| H-4 | Pindahkan nomor WhatsApp dari hardcode ke env variable sebelum nomor nyata diisi | Setelah nomor nyata diisi langsung di `site.ts`, ada risiko terekspose di git history | `site.ts`, `.env.local.example` |
| H-5 | Konfirmasi dan masukkan data unit Dehir (status, luas, dimensi, harga) | Semua unit tampil "Belum Diketahui" dengan data minimal | `src/data/properties/dehir-units.json` |
| H-6 | Perbaiki string hardcode ID di komponen V2 yang bypass i18n | `"Kavling"`, `"Luas"`, `"Harga"`, `"Status"`, `"📍 Lokasi"` selalu tampil ID meski locale EN | `ExplorationV2.tsx`, `UnitCatalogV2.tsx`, `UnitDetailV2.tsx` |

### Medium — Peningkatan kualitas

| # | Aksi | Alasan |
|---|---|---|
| M-1 | Refactor breadcrumb menjadi komponen terpisah | Duplikasi markup di 6+ file |
| M-2 | Implementasikan `LanguageSwitcher` component yang mempertahankan path lengkap | Task 7 partial — switcher saat ini drop ke root locale |
| M-3 | Tambah logika filter unit (filter by status) | Filter chips saat ini hanya visual/dummy |
| M-4 | Pasang `next/image` saat foto nyata tersedia | Optimasi otomatis (WebP, lazy load, sizes) tidak aktif |
| M-5 | Tambah `turbopack.root` di `next.config.ts` | Menghilangkan warning package-lock.json setiap run |
| M-6 | Tambah `generateStaticParams` di `units/page.tsx` dan `[unitCode]/page.tsx` | Halaman masih dynamic (ƒ), bisa di-SSG penuh |
| M-7 | Update `README.md` agar mencerminkan status implementasi terkini | README masih menunjukkan semua fitur sebagai "Planned" |
| M-8 | Hapus atau pindahkan `Hybrid 1 — A Dominan, C Diserap@2x.png` dari `public/` | File 1.4MB tidak digunakan di kode |

### Low — Penyempurnaan

| # | Aksi | Alasan |
|---|---|---|
| L-1 | Pasang favicon Celestia (ICO/SVG kustom) | Masih favicon default Next.js |
| L-2 | Koordinasikan pilihan hosting dengan perusahaan | Vercel free tier cukup untuk MVP |
| L-3 | Pasang Google Maps setelah koordinat dikonfirmasi | Perlu API key atau iframe embed URL dari perusahaan |
| L-4 | Update `seoConfig.siteUrl` setelah domain dikonfirmasi | Untuk mengaktifkan SEO canonical dan hreflang |
| L-5 | Tambahkan konfigurasi `.vscode/settings.json` | File ada tapi kosong — bisa diisi formatOnSave, ruler, dll. |
| L-6 | Perbaiki komentar "Reservasi" di `ExplorationV2.tsx` | UnitStatus tidak punya nilai "reservasi" — komentar tidak akurat |

---

## Lampiran A: Inventarisasi Lengkap File Source Code

### `src/app/` — Routing & Pages

| File | Jenis | Status | Catatan |
|---|---|---|---|
| `globals.css` | CSS global | ✅ | Tailwind v4 `@theme inline`, design tokens lengkap |
| `favicon.ico` | Aset | ⚠️ | Default Next.js, belum logo Celestia |
| `not-found.tsx` | Root 404 | ✅ | Redirect ke `/id`, bahasa Indonesia hardcode |
| `robots.ts` | SEO | ✅ | Allow: /, prototype proteksi aktif |
| `sitemap.ts` | SEO | ✅ | Kosong selama `siteUrl` belum diisi |
| `[locale]/layout.tsx` | Layout | ✅ | Geist font, NextIntlProvider, Navbar, Footer |
| `[locale]/page.tsx` | Homepage | ✅ | V1 + V2, feature flag aktif |
| `[locale]/not-found.tsx` | Locale 404 | ✅ | Bilingual via next-intl |
| `[locale]/error.tsx` | Error boundary | ✅ | `"use client"`, bilingual |
| `[locale]/projects/page.tsx` | Katalog Proyek | ✅ | V1 + V2 |
| `[locale]/projects/[slug]/page.tsx` | Eksplorasi | ✅ | V1 + V2, Coming Soon inline |
| `[locale]/projects/[slug]/units/page.tsx` | Katalog Unit | 🔴 | **Build error** — karakter `-` di baris 1 |
| `[locale]/projects/[slug]/units/[unitCode]/page.tsx` | Detail Unit | ✅ | V1 + V2 |

### `src/components/` — Komponen UI

| File | Jenis | Digunakan | Catatan |
|---|---|---|---|
| `ui/Button.tsx` | UI primitive | ❌ | Didefinisikan, tidak dipakai di halaman |
| `ui/Card.tsx` | UI primitive | ⚠️ | Dipakai di V1 fallback saja |
| `ui/Badge.tsx` | UI primitive | ✅ | Dipakai di semua layout |
| `ui/Input.tsx` | UI primitive | ❌ | Belum ada halaman yang memakainya |
| `ui/Select.tsx` | UI primitive | ❌ | Belum ada halaman yang memakainya |
| `ui/Placeholder.tsx` | UI primitive | ✅ | Dipakai luas sebagai pengganti aset |
| `layout/Navbar.tsx` | Layout | ✅ | V1 + V2, WA CTA disabled |
| `layout/Footer.tsx` | Layout | ✅ | V1 + V2 |
| `homepage/HomepageV2.tsx` | Feature | ✅ | Homepage V2 |
| `projects/ProjectCatalogV2.tsx` | Feature | ✅ | Katalog proyek V2 |
| `projects/ExplorationV2.tsx` | Feature | ✅ | Eksplorasi V2, string ID hardcode |
| `projects/UnitCatalogV2.tsx` | Feature | ✅ | Katalog unit V2, string ID hardcode |
| `projects/UnitDetailV2.tsx` | Feature | ✅ | Detail unit V2, string ID hardcode |

### `src/features/` — Feature Modules

| File | Status | Catatan |
|---|---|---|
| `site-plan/SitePlanPanel.tsx` | ✅ Fungsional | Server component, placeholder saat denah belum ada |
| `site-plan/InteractiveSitePlan.tsx` | ❌ Stub | `"use client"`, return null — menunggu denah resmi |

### `src/config/`, `src/i18n/`, `src/lib/`, `src/types/`

| File | Status | Catatan |
|---|---|---|
| `config/site.ts` | ✅ | siteConfig, seoConfig, uiConfig, helper functions |
| `i18n/config.ts` | ✅ | Derives locales dari siteConfig |
| `i18n/request.ts` | ✅ | next-intl server config, fallback ke defaultLocale |
| `i18n/messages/id.json` | ✅ | ~70 keys, lengkap termasuk namespace `meta` |
| `i18n/messages/en.json` | ✅ | ~70 keys, paritas dengan id.json |
| `lib/utils.ts` | ✅ | `cn()`, `formatRupiah()`, `formatArea()` |
| `types/index.ts` | ✅ | Barrel export |
| `types/project.ts` | ✅ | Project, ProjectId, ProjectLocation |
| `types/property.ts` | ✅ | PropertyUnit, UnitStatus, SitePlanPosition, InterestFormData |
| `proxy.ts` | ✅ | next-intl middleware untuk i18n routing |

### `src/data/` — Data Statis JSON

| File | Status | Catatan |
|---|---|---|
| `projects/dehir.json` | ✅ Minimal | Tanpa koordinat GPS, googleMapsUrl |
| `projects/pabuaran.json` | ✅ Minimal | Status coming-soon, data placeholder |
| `properties/dehir-units.json` | ⚠️ Minimal | 9 unit, semua `status: "unknown"`, tanpa luas/dimensi/harga |

---

## Lampiran B: Ringkasan Status Task Wave 1–8

| Task | Deskripsi | Status Aktual |
|---|---|---|
| 1 | Setup routing bilingual + next-intl | ✅ Selesai |
| 2 | Update type definitions | ✅ Selesai |
| 3 | Update siteConfig + globals.css | ✅ Selesai |
| 4 | Data JSON Dehir & Pabuaran | ✅ Selesai (data minimal, menunggu konfirmasi) |
| 5 | Services layer | ❌ **Belum dikerjakan** — folder `src/services/` tidak ada |
| 6 | Komponen UI dasar | ✅ Selesai — Button, Card, Badge, Input, Select, Placeholder |
| 7 | Navbar, Footer, LanguageSwitcher | ⚠️ Partial — Navbar & Footer ada; LanguageSwitcher tidak jadi komponen terpisah |
| 8 | Breadcrumb & Sidebar | ⚠️ Partial — markup inline di setiap halaman, bukan komponen terpisah |
| 9 | WhatsAppButton component | ❌ **Belum dikerjakan** — logika WA ada inline di 5+ tempat |
| 10 | Homepage | ✅ Selesai (V1 & V2) |
| 11 | Katalog Proyek | ✅ Selesai (V1 & V2) |
| 12 | Halaman Eksplorasi Dehir | ✅ Selesai (V1 & V2, Maps placeholder) |
| 13 | Katalog Unit | 🔴 **Build rusak** — file corrupt (karakter `-` di baris 1) |
| 14 | Detail Unit | ✅ Selesai (V1 & V2) |
| 15 | Site Plan Interaktif | ⚠️ Stub — `InteractiveSitePlan` return null, menunggu denah |
| 16 | Formulir Minat Dehir | ❌ **Belum dikerjakan** — halaman `/interest` tidak ada |
| 17 | Teaser Coming Soon Pabuaran | ⚠️ Partial — inline di halaman eksplorasi, bukan halaman/modal terpisah |
| 18 | 404 & Error Boundary | ✅ Selesai |
| 19 | SEO Metadata & Sitemap | ✅ Selesai |
| 20 | Final build & quality check | 🔴 **Gagal** — build error dari Task 13 |
| — | UI V2 redesign (post Wave 8) | ✅ Selesai (semua halaman punya V2 layout) |
| — | Feature flag `uiConfig.uiVariant` | ✅ Aktif, saat ini = "v2" |

---

## Lampiran C: Node Modules — Transitive Dependencies Penting

Ditemukan di `node_modules/` tapi bukan direct dependency (tidak di `package.json`):

| Package | Kemungkinan asal | Catatan |
|---|---|---|
| `sharp` | Next.js | Digunakan otomatis oleh `next/image` saat build. Saat ini tidak relevan karena `next/image` belum dipakai. |
| `zod` | next-intl | Validasi schema internal next-intl. Tidak perlu diimpor manual. |
| `zod-validation-error` | next-intl | Sama seperti zod. |
| `lightningcss` | Tailwind CSS v4 | CSS processing. Digunakan otomatis. |
| `styled-jsx` | Next.js | Sudah include di Next.js. Tidak digunakan secara eksplisit. |
| `axe-core` | eslint-plugin-jsx-a11y | Testing aksesibilitas, hanya untuk dev/lint. |

---

*Dokumen ini adalah hasil audit read-only. Tidak ada perubahan yang dilakukan pada source code.*

*Versi audit: 2 (diperluas mencakup keseluruhan source code)*  
*Pemeriksaan terakhir: November 2026*  
*Area tidak terverifikasi: perilaku runtime browser, rendering mobile fisik, performance profiling, git history.*
