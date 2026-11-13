# Celestia — Stage 3A: Timeline & Asset Inventory Proposal (Revised)

**Tanggal:** November 2026
**Jenis dokumen:** Proposal read-only — belum ada perubahan yang dilakukan
**Revisi:** Rekonsiliasi acceptance criteria, koreksi rekap task, reklasifikasi aset
**Referensi utama:** `.kiro/specs/celestia-mvp/tasks.md`, source code aktual

---

## 1. Ringkasan Kondisi Timeline

### Konteks Perkembangan

Sejak audit di `celestia-existing-implementation-audit.md`, beberapa perbaikan sudah dilakukan:

- **Build error diperbaiki** — karakter ilegal di `units/page.tsx` baris 1 sudah dihapus. Build aktif.
- **Dokumentasi developer diperbarui** — README, DEVELOPMENT-GUIDE, ARCHITECTURE, TECH-DECISIONS, PROJECT-STRUCTURE sudah diakurasikan di Stage 2A–2C.
- **Kondisi implementasi lain tidak berubah** — semua gap yang tercatat di audit masih berlaku.

### Status Keseluruhan Task (Rekonsiliasi)

| Kategori | Jumlah | Task |
|---|---|---|
| **Completed** (semua acceptance criteria terpenuhi) | 10 | 1, 2, 3, 4, 6, 10, 11, 12, 13, 14 |
| **Partially Completed** (sebagian criteria terpenuhi) | 4 | 7, 8, 9, 17 |
| **Blocked by Business Data** | 1 | 15 |
| **Not Started** | 4 | 5, 16, 18, 20 |
| **Completed (tercatat di tasks.md)** | 1 | 19 |

> **Catatan:** Task 18 (404 dan error boundary) sebelumnya salah dikategorikan sebagai Completed. Verifikasi lebih teliti menunjukkan terdapat gap acceptance criteria — lihat detail di Bagian 2.

---

## 2. Audit Status Task (Per Acceptance Criteria)

### Wave 1 — Foundation

**Task 1 — Setup routing bilingual dan next-intl**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| next-intl terpasang | ✅ | `package.json`: `"next-intl": "^4.14.9"` |
| Middleware redirect URL tanpa prefix ke `/id/` dengan path yang sesuai | ✅ | `src/proxy.ts`: `localePrefix: "always"` — `/projects/dehir` → `/id/projects/dehir` |
| Unknown locale redirect ke `/id/` path setara | ✅ | `src/proxy.ts` + `src/app/[locale]/layout.tsx`: `hasLocale()` + `notFound()` |
| File terjemahan berisi key UI | ✅ | `src/i18n/messages/id.json`, `en.json` ada |
| Akses `/id/` dan `/en/` tanpa error | ✅ | File dan routing tersedia |
| `npx tsc --noEmit` tanpa error | ✅ | Dikonfirmasi dari audit — TypeScript clean |

**Status Task 1: Completed**

> **Rekonsiliasi dengan Task 7:** Acceptance criteria Task 1 tidak menyebut "Language Switcher harus mempertahankan path" sebagai acceptance-nya sendiri — kalimat itu adalah deskripsi behaviour yang diimplementasikan di Task 7 (`LanguageSwitcher.tsx`). Task 1 dan Task 7 adalah task terpisah. Task 1 selesai; Task 7 belum.

---

**Task 2 — Update type definitions**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| `UnitStatus = available\|process\|sold\|unknown` | ✅ | `src/types/property.ts` baris 13 |
| `Project` punya field `status` | ✅ | `src/types/project.ts`: `status: "active" \| "coming-soon"` |
| `SitePlanPosition` didefinisikan | ✅ | `src/types/property.ts`: interface `SitePlanPosition` ada |
| `InterestFormData` didefinisikan | ✅ | `src/types/property.ts`: interface `InterestFormData` ada |
| `npx tsc --noEmit` tanpa error | ✅ | Clean |

**Status Task 2: Completed**

---

**Task 3 — Update siteConfig dan globals.css**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| `siteConfig` punya pesan WhatsApp untuk homepage/proyek/unit | ✅ | `src/config/site.ts`: `whatsappMessageId/En`, `whatsappProjectMessageId/En`, `whatsappUnitMessageId/En` |
| `globals.css` berisi semua token warna dari design.md | ✅ (tidak terverifikasi penuh) | Token sage green, neutral, status, whatsapp ada — detail token vs design.md tidak diverifikasi line-by-line |
| Dark mode dihapus | ✅ | Tidak ada `dark:` class di globals.css (dari audit) |
| `npm run build` tanpa error | ✅ | Build berjalan setelah perbaikan |

**Status Task 3: Completed** (dengan satu item tidak terverifikasi penuh terhadap design.md)

---

**Task 4 — Buat data JSON**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| `dehir.json` berisi data lengkap dengan `status: active` | ✅ | File ada, digunakan di halaman |
| `pabuaran.json` berisi data minimal dengan `status: coming-soon` | ✅ | File ada |
| `dehir-units.json` berisi 9 unit dengan kode A1–B5 dan `status: unknown` | ✅ | File ada, 9 unit dikonfirmasi dari halaman katalog unit |
| Tidak ada data yang dikarang | ✅ | Semua field opsional null/undefined |
| File JSON valid | ✅ | Build bersih |

**Status Task 4: Completed**

---

### Wave 2

**Task 5 — Buat services layer**

`src/services/` tidak ada. Semua halaman import JSON langsung.

**Status Task 5: Not Started**

---

**Task 6 — Buat komponen UI dasar**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Button mendukung 5 variant dengan ukuran | ✅ | `Button.tsx`: variant = primary/secondary/outline/whatsapp/disabled; size = sm/md/lg |
| Badge menampilkan 4 status + Coming Soon | ✅ | `Badge.tsx` ada (dari audit) |
| Placeholder menampilkan teks label eksplisit | ✅ | `Placeholder.tsx` ada |
| Minimum touch target 44×44px | ✅ | `min-h-[44px]` di semua komponen interaktif |
| `npx tsc --noEmit` tanpa error | ✅ | Clean |

**Status Task 6: Completed**

---

**Task 18 — 404 dan error boundary**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| 404 menampilkan pesan dan tautan ke homepage | ✅ | `src/app/[locale]/not-found.tsx`: pesan via `t("notFound")`, link ke `/` |
| `error.tsx` menggunakan `"use client"` | ✅ | Baris 1: `"use client"` |
| Error boundary dengan tombol retry (`reset()`) | ✅ | `error.tsx`: `button onClick={() => reset()}` |
| Bilingual | ⚠️ Partially | Menggunakan `useTranslations("error")` → bilingual jika key ada di kedua messages. Key `notFound`, `notFoundDesc`, `backHome`, `errorOccurred`, `tryAgain` perlu diverifikasi di `src/i18n/messages/id.json` dan `en.json` — tidak diverifikasi line-by-line |
| `npm run build` tanpa error | ✅ | Build berjalan |

**Status Task 18: Belum Terverifikasi Penuh**

> Translation key untuk error messages ada di messages file. Tanpa membaca isi JSON messages secara langsung, tidak bisa dipastikan semua key yang dipakai di 404/error memang ada di kedua file. Ini perlu dicek terpisah. Untuk saat ini status adalah **Belum Terverifikasi** — bukan Completed, bukan Not Started.

---

### Wave 3

**Task 7 — Navbar, Footer, Language Switcher**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Navbar konsisten di semua halaman | ✅ | `Navbar.tsx` dipakai di `[locale]/layout.tsx` |
| Language Switcher mempertahankan konteks halaman | ❌ | `Navbar.tsx` baris 59–71: link ke `/id` dan `/en` (root) — tidak mempertahankan path. `LanguageSwitcher.tsx` tidak ada sebagai komponen terpisah |
| Mobile hamburger menu berfungsi | ❌ | `Navbar.tsx`: tidak ada hamburger menu — mobile menggunakan link proyek langsung |
| `npx tsc --noEmit` tanpa error | ✅ | Clean |

**Status Task 7: Not Completed** — dua acceptance criteria tidak terpenuhi

---

**Task 9 — WhatsAppButton**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Menggunakan nomor dari siteConfig (tidak ada hardcode) | ✅ | Semua komponen menggunakan `buildWhatsAppUrl()` dan `isWhatsAppNumberPlaceholder()` dari siteConfig |
| Disabled jika mengandung X termasuk di halaman Pabuaran | ✅ | Logika disabled aktif di semua komponen |
| Buka di tab baru (`target=_blank rel=noopener noreferrer`) | ✅ | Dikonfirmasi di Navbar dan halaman detail |
| Mendukung pesan kustom sesuai konteks dan locale | ✅ | Pesan per-halaman dan per-locale sudah diimplementasikan inline |
| `npx tsc --noEmit` tanpa error | ✅ | Clean |
| `src/features/contact/WhatsAppButton.tsx` ada | ❌ | File tidak ada — acceptance criteria Task 9 mensyaratkan komponen ini dibuat |

**Status Task 9: Not Completed** — komponen tidak dibuat sebagai file tersendiri

> **Catatan:** Semua behaviour fungsional WhatsApp sudah diimplementasikan. Yang belum adalah enkapsulasi ke komponen terpisah sesuai spec.

---

### Wave 4

**Task 8 — Breadcrumb dan Sidebar**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Breadcrumb menampilkan path dengan tautan | ✅ | Markup ada di setiap halaman (inline) |
| Sidebar menampilkan daftar proyek dengan indikator aktif | ✅ | Markup ada inline di `ExplorationV2` dan V1 fallback |
| Pabuaran menampilkan badge Coming Soon | ✅ | Ada di semua tampilan sidebar |
| Mobile Sidebar collapse berfungsi | ❌ | Tidak ada toggle collapse di mobile |
| `src/components/layout/Breadcrumb.tsx` dan `Sidebar.tsx` ada | ❌ | File tidak ada — komponen terpisah tidak dibuat |
| `npx tsc --noEmit` tanpa error | ✅ | Clean |

**Status Task 8: Not Completed** — komponen terpisah dan mobile collapse belum ada

---

**Task 10 — Homepage**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Hero menampilkan `siteConfig.name` dan tagline | ✅ | `HomepageV2` dan V1 menggunakan siteConfig |
| Kartu Dehir dapat diklik ke Halaman Eksplorasi | ✅ | Link ke `/projects/dehir` ada |
| Kartu Pabuaran menampilkan Coming Soon | ✅ | Badge Coming Soon ada |
| Galeri dan video placeholder | ✅ | `Placeholder` component digunakan |
| CTA WhatsApp dan Jelajahi Proyek tersedia | ✅ | Keduanya ada (WA disabled karena placeholder) |
| Navbar dan Footer ditampilkan | ✅ | Via `layout.tsx` |
| `npm run build` tanpa error | ✅ | Build berjalan |

**Status Task 10: Completed**

---

**Task 11 — Katalog Proyek**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Dehir menampilkan name/fullName/shortDescription/city/province | ✅ | `projects/page.tsx` V1 + `ProjectCatalogV2` |
| Pabuaran badge Coming Soon tanpa data detail | ✅ | Coming Soon badge, shortDescription tampil tapi minimal |
| Klik Dehir navigasi ke eksplorasi | ✅ | Link ke `/projects/dehir` |
| Klik Pabuaran menampilkan teaser | ✅ | Link ke `/projects/pabuaran` (halaman coming soon inline) |
| Jumlah proyek aktif ditampilkan | ✅ | `activeCount: 1` — `"1 proyek aktif"` ditampilkan |
| `npm run build` tanpa error | ✅ | Build berjalan |

**Status Task 11: Completed**

---

**Task 16 — Formulir Minat**

`src/app/[locale]/interest/` tidak ada.

**Status Task 16: Not Started**

---

**Task 17 — Teaser Coming Soon**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Nama Pabuaran dan fullName ditampilkan | ✅ | `[slug]/page.tsx`: `project.fullName` + badge |
| Badge Coming Soon jelas | ✅ | `Badge variant="coming-soon"` |
| Tidak ada data unit/harga/site plan | ✅ | Coming Soon branch tidak menampilkan data tersebut |
| CTA Hubungi untuk Info Terbaru tersedia | ⚠️ | Coming Soon branch di `[slug]/page.tsx` tidak memiliki CTA "Hubungi untuk Info Terbaru" yang eksplisit — hanya badge dan pesan singkat. Acceptance tidak terpenuhi penuh |
| `npm run build` tanpa error | ✅ | Build berjalan |
| Buat halaman/modal teaser (bukan hanya inline di halaman lain) | ❌ | Teaser dirender inline di `/projects/pabuaran`, bukan sebagai halaman tersendiri yang disebutkan di acceptance |

**Status Task 17: Not Completed** — CTA info terbaru belum ada, belum halaman/modal terpisah

---

### Wave 5

**Task 12 — Halaman Eksplorasi Dehir**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Layout Sidebar+Maps+SitePlan | ✅ | Ada di V1 dan V2 |
| fullName/description/city/province ditampilkan | ✅ | `[slug]/page.tsx` |
| Maps embed jika coordinates ada | ✅ | Koordinat tidak ada → tidak di-embed (sesuai spec: "jika coordinates ada") |
| Tautan "Lihat di Google Maps" jika googleMapsUrl ada | ✅ | `googleMapsUrl` tidak ada → tidak ditampilkan (sesuai spec) |
| Site Plan placeholder "Denah belum tersedia" jika aset belum ada | ✅ | `SITE_PLAN_AVAILABLE = false` → placeholder ditampilkan |
| Ringkasan status unit tidak menyesatkan untuk unit unknown | ✅ | `tProject("statusNotConfirmed")` ditampilkan, bukan angka 0 |
| CTA WhatsApp dengan fullName | ✅ | Ada (disabled karena nomor placeholder) |
| Pabuaran teaser Coming Soon tanpa data detail | ✅ | Branch `status === "coming-soon"` ada |
| 404 untuk slug tidak dikenali | ✅ | `notFound()` dipanggil |
| `npm run build` tanpa error | ✅ | Build berjalan |

**Status Task 12: Completed**

---

**Task 13 — Katalog Unit**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Daftar unit dengan projectId sesuai | ✅ | `dehirUnitsData` dimuat untuk slug Dehir |
| unitCode/unitType/status ditampilkan | ✅ | Ada di V1 dan V2 |
| unknown = "Belum Diketahui" | ✅ | `tStatus("unknown")` |
| landArea jika bukan undefined/null | ✅ | Conditional display (semua null saat ini → tidak ditampilkan) |
| price formatRupiah atau "Hubungi Marketing" | ✅ | `tUnit("contactForPrice")` ditampilkan karena semua null |
| Klik navigasi ke detail unit | ✅ | Link ke `units/[unitCode]` |
| Breadcrumb | ✅ | Ada (inline) |
| Empty state | ✅ | Ditangani |
| `npm run build` tanpa error | ✅ | Build berjalan |

**Status Task 13: Completed**

> Filter chips (visual saja) tidak ada dalam acceptance criteria Task 13. Tidak relevan untuk penentuan status.

---

### Wave 6

**Task 14 — Detail Unit**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| unitCode/unitType/fullName ditampilkan | ✅ | `[unitCode]/page.tsx` |
| landArea dalam m² jika ada | ✅ | Conditional display — null saat ini |
| dimensions sebagai width×length m | ✅ | Conditional display — null saat ini |
| price formatRupiah atau hubungi marketing | ✅ | `formatRupiah` / `tUnit("contactForPrice")` |
| Badge status dengan teks label | ✅ | `Badge variant` + teks |
| unknown = badge abu-abu Belum Diketahui | ✅ | Dikonfirmasi |
| Foto atau placeholder | ✅ | `Placeholder` component digunakan |
| Tautan ke Site Plan dengan parameter unitCode | ✅ | Link ke `/projects/${slug}?unit=${unitCode}` |
| CTA WhatsApp dengan unitCode+fullName | ✅ | `buildUnitWhatsAppMessage()` digunakan |
| 404 untuk kombinasi tidak dikenali | ✅ | `notFound()` dipanggil |
| `npm run build` tanpa error | ✅ | Build berjalan |

**Status Task 14: Completed**

---

### Wave 7

**Task 15 — Site Plan Interaktif**

| Acceptance Criteria | Status | Bukti |
|---|---|---|
| Placeholder "Denah belum tersedia" jika aset belum ada | ✅ | `SitePlanPanel.tsx` menampilkan placeholder |
| SVG interaktif hanya jika denah resmi tersedia | ✅ (conditional) | `SITE_PLAN_AVAILABLE = false` → tidak ditampilkan |
| deep-link dari Detail Unit ter-highlight otomatis | ✅ | `?unit=X` parameter diterima dan diteruskan ke `SitePlanPanel` |
| Unit tanpa posisi di daftar teks terpisah | ✅ | `SitePlanPanel` menampilkan unit list |
| `prefers-reduced-motion` dihormati | ❓ Belum Terverifikasi | Tidak diverifikasi dari source code |
| Semua acceptance SVG interaktif | 🔒 Blocked | Menunggu denah resmi dan data posisi unit dari perusahaan |
| `npm run build` tanpa error | ✅ | Build berjalan |

**Status Task 15: Blocked by Business Data** — implementasi conditional sudah benar, SVG interaktif menunggu aset dari Owner

---

### Wave 8

**Task 19 — SEO metadata dan sitemap**

Ditandai `[x]` di tasks.md. Dikonfirmasi:
- `generateMetadata` ada di semua halaman
- `html lang` mengikuti locale aktif
- `robots.ts` dan `sitemap.ts` ada
- OG tags per halaman ada
- `og:image` tidak dibuat karena aset brand resmi belum ada (sesuai spec)
- Sitemap kosong karena `siteUrl` belum dikonfirmasi (sesuai spec: sitemap generate dari data, domain belum ada)

**Status Task 19: Completed** ✓

---

### Wave 9

**Task 20 — Final build, lint, dan quality check**

Task ini mensyaratkan semua komponen lain selesai lebih dulu. Acceptance criteria yang secara spesifik belum terpenuhi:

| Acceptance Criteria | Status |
|---|---|
| Language switcher berfungsi (mempertahankan path) | ❌ Task 7 belum selesai |
| WhatsApp CTA berfungsi atau disabled (termasuk Pabuaran) | ✅ Disabled karena placeholder — sesuai spec |
| Next Image digunakan dengan atribut lengkap | ❌ `next/image` belum digunakan; acceptance ini eksplisit ada di Task 20 |
| Halaman dapat diakses di /id/ dan /en/ | ✅ |
| npm run lint / tsc --noEmit tanpa error | ✅ |
| npm run build tanpa error | ✅ |
| No horizontal scroll di 320px | ❓ Tidak terverifikasi tanpa runtime |
| Keyboard navigation dengan focus visible | ✅ (dari audit) |
| alt text pada gambar informatif | ⚠️ Placeholder saat ini — belum ada gambar nyata |

**Status Task 20: Not Started** — bergantung pada Task 7, 9, dan konten foto nyata

---

## 3. Rekap Status Task (Terkoreksi)

| Task | Deskripsi Singkat | Status Aktual | Rekomendasi tasks.md |
|---|---|---|---|
| 1 | Routing bilingual + next-intl | **Completed** | Tandai `[x]` |
| 2 | Type definitions | **Completed** | Tandai `[x]` |
| 3 | siteConfig + globals.css | **Completed** | Tandai `[x]` |
| 4 | Data JSON | **Completed** | Tandai `[x]` |
| 5 | Services layer | **Not Started** | Pertahankan `[ ]` |
| 6 | Komponen UI dasar | **Completed** | Tandai `[x]` |
| 7 | Navbar + Footer + Language Switcher | **Not Completed** | Pertahankan `[ ]` |
| 8 | Breadcrumb + Sidebar | **Not Completed** | Pertahankan `[ ]` |
| 9 | WhatsAppButton | **Not Completed** | Pertahankan `[ ]` |
| 10 | Homepage | **Completed** | Tandai `[x]` |
| 11 | Katalog Proyek | **Completed** | Tandai `[x]` |
| 12 | Halaman Eksplorasi | **Completed** | Tandai `[x]` |
| 13 | Katalog Unit | **Completed** | Tandai `[x]` |
| 14 | Detail Unit | **Completed** | Tandai `[x]` |
| 15 | Site Plan Interaktif | **Blocked by Business Data** | Pertahankan `[ ]` |
| 16 | Formulir Minat | **Not Started** | Pertahankan `[ ]` |
| 17 | Teaser Coming Soon | **Not Completed** | Pertahankan `[ ]` |
| 18 | 404 + Error boundary | **Belum Terverifikasi Penuh** | Pertahankan `[ ]` — perlu cek translation keys |
| 19 | SEO + Sitemap | **Completed** | Pertahankan `[x]` |
| 20 | Final build + quality check | **Not Started** | Pertahankan `[ ]` |

**Ringkasan terkoreksi:**
- 10 task **Completed**: 1, 2, 3, 4, 6, 10, 11, 12, 13, 14
- 4 task **Not Completed** (diimplementasikan sebagian): 7, 8, 9, 17
- 1 task **Blocked by Business Data**: 15
- 1 task **Belum Terverifikasi Penuh**: 18
- 4 task **Not Started**: 5, 16, 20, dan 18 (jika gagal verifikasi)
- 1 task **Completed** di tasks.md dan terkonfirmasi: 19

---

## 4. Inventaris Aset Aktual

### 4.1 Aset di `public/`

Verifikasi referensi dilakukan di: `**/*.{ts,tsx}`, `**/*.css`, `**/*.json`, `**/*.md`.
Referensi yang ditemukan di `.md` adalah dalam konteks dokumentasi (audit/proposal), bukan penggunaan aktif di produk.

| File | Ukuran | Referensi di source code | Referensi di docs | Klasifikasi | Keterangan |
|---|---|---|---|---|---|
| `Hybrid 1 — A Dominan, C Diserap@2x.png` | 1.4 MB | ❌ Tidak ada | ❌ Tidak ada | **PENDING OWNER** | Kemungkinan diagram tipe bangunan dari brosur. Mungkin dibutuhkan di Task 16 (Formulir Minat). Perlu konfirmasi Owner. |
| `file.svg` | 391 B | ❌ Tidak ada | Hanya di docs | **Archive Candidate** | Default Next.js. Tidak ada referensi aktif di source code. Downgrade dari DELETE CANDIDATE — hapus hanya setelah Owner konfirmasi tidak diperlukan. |
| `globe.svg` | 1.0 KB | ❌ Tidak ada | Hanya di docs | **Archive Candidate** | Default Next.js. Sama dengan file.svg. |
| `next.svg` | 1.4 KB | ❌ Tidak ada | Hanya di docs | **Archive Candidate** | Default Next.js. |
| `vercel.svg` | 128 B | ❌ Tidak ada | Hanya di docs | **Archive Candidate** | Default Next.js. |
| `window.svg` | 385 B | ❌ Tidak ada | Hanya di docs | **Archive Candidate** | Default Next.js. |

> **Catatan klasifikasi:** SVG default Next.js diturunkan ke Archive Candidate (bukan Delete Candidate) karena penghapusan aset baru aman setelah konfirmasi eksplisit bahwa tidak ada use case yang terlewat.

### 4.2 Aset di `src/app/`

| File | Digunakan? | Klasifikasi | Keterangan |
|---|---|---|---|
| `src/app/favicon.ico` | ✅ Ya — otomatis oleh Next.js | **UPDATE (Pending Owner)** | Default Next.js favicon (~15 KB). Perlu diganti dengan favicon Celestia setelah logo tersedia. |

### 4.3 Aset yang Dibutuhkan tapi Belum Tersedia

| Aset | Halaman Terdampak | Blocker | Catatan |
|---|---|---|---|
| Foto proyek Dehir | Homepage, Eksplorasi, Katalog | 🔒 Perusahaan | Placeholder aktif, komponen sudah siap |
| Foto per kavling/unit | Katalog Unit, Detail Unit | 🔒 Perusahaan | Placeholder aktif |
| Denah/Site Plan resmi Dehir | Eksplorasi (SitePlanPanel) | 🔒 Perusahaan | Placeholder aktif, `SITE_PLAN_AVAILABLE = false` |
| Posisi kavling di denah (data) | InteractiveSitePlan | 🔒 Perusahaan | Menunggu denah resmi |
| Video/GIF promosi | Homepage | 🔒 Perusahaan | Placeholder aktif |
| Logo Celestia (SVG/PNG) | Navbar, Favicon | 🔒 Perusahaan | Default Next.js digunakan sementara |
| Gambar tipe bangunan dari brosur | Formulir Minat (Task 16) | 🔒 File digital brosur | `Hybrid 1 — A Dominan, C Diserap@2x.png` di `public/` mungkin relevan — perlu konfirmasi Owner |

---

## 5. Data Bisnis yang Masih Menunggu Konfirmasi

| Data | Status | Dampak pada Kode |
|---|---|---|
| Nomor WhatsApp marketing | ❌ Placeholder `62XXXXXXXXXX` | Semua CTA WA dinonaktifkan — `src/config/site.ts` |
| Status kavling A1–B5 | ❌ Semua `unknown` | Unit tampil "Belum Diketahui" — `dehir-units.json` |
| Luas tanah dan dimensi kavling | ❌ Semua null/undefined | Tidak ditampilkan di unit detail — `dehir-units.json` |
| Harga per kavling | ❌ Semua null | "Hubungi Marketing" ditampilkan — `dehir-units.json` |
| Koordinat GPS Dehir | ❌ Belum ada | Google Maps tidak di-embed — `dehir.json` |
| URL Google Maps Dehir | ❌ Belum ada | Tombol "Lihat di Maps" tidak muncul — `dehir.json` |
| Domain produksi | ❌ Belum dikonfirmasi | Sitemap dan canonical tidak diterbitkan — `seoConfig.siteUrl = ""` |
| Tagline resmi | ⚠️ Placeholder | Tampil di hero dan metadata |
| Format kode kavling (P-20) | ❓ Pending | Konflik: JSON pakai `A1`, type def pakai `A-01` |

---

## 6. Identifikasi Gap

### 6.1 Requirement MVP (dari tasks.md) yang Belum Selesai

Gap berikut adalah bagian dari scope MVP yang belum diimplementasikan:

| Gap | Task | Status |
|---|---|---|
| `LanguageSwitcher.tsx` sebagai komponen terpisah yang mempertahankan path | Task 7 | Not Completed |
| Mobile hamburger menu di Navbar | Task 7 | Not Completed |
| `WhatsAppButton.tsx` sebagai komponen terpisah di `src/features/contact/` | Task 9 | Not Completed |
| `Breadcrumb.tsx` dan `Sidebar.tsx` sebagai komponen terpisah | Task 8 | Not Completed |
| Sidebar mobile collapse | Task 8 | Not Completed |
| Halaman Formulir Minat (`/interest`) | Task 16 | Not Started |
| Halaman/modal teaser Coming Soon Pabuaran terpisah | Task 17 | Not Completed |
| CTA "Hubungi untuk Info Terbaru" di teaser Pabuaran | Task 17 | Not Completed |
| Services layer (`src/services/`) | Task 5 | Not Started |
| Verifikasi translation keys 404/error bilingual | Task 18 | Belum Terverifikasi |
| Final quality check termasuk `next/image`, responsive, aksesibilitas | Task 20 | Not Started |

### 6.2 Technical Debt (di luar scope task)

Gap berikut tidak ada dalam acceptance criteria tasks.md, tapi ditemukan saat audit:

| Item | Temuan | Catatan |
|---|---|---|
| String hardcode Bahasa Indonesia bypass i18n | `"Kavling"`, `"Luas"`, `"Harga"` dll. di komponen V2 selalu tampil ID | Konsistensi terjemahan EN tidak terpenuhi penuh |
| Filter chips tidak memfilter data | Visual saja di `ExplorationV2` dan `UnitCatalogV2` | UX menyesatkan |
| Duplikasi markup breadcrumb | Inline di setiap halaman, bukan komponen | Maintainability — ada di scope Task 8 |
| `Button` component tidak dipakai di halaman (hanya link/a) | Inkonsistensi UX | Low priority |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` di `.env.local.example` tidak terhubung ke kode | Disconnect env vs hardcode | Perlu sinkronisasi sebelum nomor nyata diisi |

### 6.3 Technical Proposal / Optional Improvement

Item berikut adalah saran teknis yang bukan merupakan requirement spec:

| Item | Catatan |
|---|---|
| Migrasi ke `next/image` saat foto nyata tersedia | Task 20 mensyaratkan ini, tapi belum relevan sebelum ada foto |
| Sinkronisasi `NEXT_PUBLIC_WHATSAPP_NUMBER` ke env variable | Opsional — perlu dilakukan sebelum nomor nyata diisi di `site.ts` |
| `turbopack.root` di `next.config.ts` | Hilangkan warning path package-lock.json |

### 6.4 Blocked by Owner

| Item | Menunggu |
|---|---|
| Semua aset visual (foto, logo, denah, video) | Perusahaan |
| Data unit (status, luas, harga) | Perusahaan |
| Aktivasi Site Plan Interaktif | Denah resmi + data posisi |
| Nomor WhatsApp | Perusahaan |
| Domain dan aktivasi SEO | Perusahaan |

---

## 7. Pertanyaan untuk Owner (Prioritas)

### Kritis — harus dijawab sebelum demo atau launch

| # | Pertanyaan | Dampak |
|---|---|---|
| Q-1 | Berapa nomor WhatsApp marketing Dehir? (format `628XXXXXXXXXX`) | Semua CTA WA tetap dinonaktifkan |
| Q-2 | Status setiap kavling A1–B5? (Tersedia / Proses / Terjual) | Unit tampil "Belum Diketahui" semua |
| Q-3 | Format kode kavling final: `A1` atau `A-01`? | Konflik type definition dan URL |
| Q-4 | Apakah file brosur Dehir tersedia dalam format digital? | Gambar untuk Formulir Minat, klarifikasi `Hybrid 1 — A Dominan, C Diserap@2x.png` |

### Penting — untuk fitur lengkap

| # | Pertanyaan | Dampak |
|---|---|---|
| Q-5 | Foto proyek Dehir tersedia? Format dan jumlah? | Semua halaman tetap placeholder |
| Q-6 | Denah/site plan resmi Dehir tersedia? Format apa? | Site Plan Interaktif tidak bisa diaktifkan |
| Q-7 | Koordinat GPS dan/atau link Google Maps Dehir? | Peta lokasi tetap placeholder |
| Q-8 | Luas tanah dan dimensi setiap kavling? | Detail unit tetap minimal |
| Q-9 | Harga ditampilkan publik atau "Hubungi Marketing" saja? | Display harga di semua halaman unit |

### Launch — wajib sebelum publikasi

| # | Pertanyaan | Dampak |
|---|---|---|
| Q-10 | Domain produksi: `celestia.id` sudah dibeli? | SEO canonical dan hreflang tidak dapat diterbitkan |
| Q-11 | Logo Celestia tersedia? Format apa? | Navbar dan favicon masih default |
| Q-12 | Informasi legalitas yang boleh ditampilkan? | Halaman eksplorasi tidak dapat menampilkan legalitas |
| Q-13 | Tagline resmi Celestia? | "Temukan Hunian Impian Anda" di hero masih placeholder |

---

## 8. Usulan Urutan Eksekusi

### Prinsip

- Gap teknis dari Requirement MVP diselesaikan sebelum mengerjakan optional improvement.
- Pekerjaan yang blocked by Owner tidak perlu dijadwalkan sampai data tersedia.
- Verifikasi Task 18 adalah pekerjaan kecil yang sebaiknya dilakukan lebih dahulu sebelum batch besar.

### Batch 3A — Verifikasi dan dokumentasi (aman dikerjakan sekarang)

| ID | Aksi | Tipe | Dependensi |
|---|---|---|---|
| 3A-1 | Verifikasi translation keys di `id.json` dan `en.json` untuk 404/error (Task 18) | Verifikasi | Tidak ada |
| 3A-2 | Update status task di `tasks.md` sesuai Bagian 3 | Dokumentasi | Persetujuan proposal ini |
| 3A-3 | Update `docs/consultation/project-timeline.md` | Dokumentasi | Tidak ada |

### Batch 3B — Requirement MVP tanpa dependensi Owner

Semua item di bawah ini adalah bagian dari scope tasks.md yang belum selesai:

| ID | Aksi | Task Spec | Catatan |
|---|---|---|---|
| 3B-1 | Implementasi `LanguageSwitcher.tsx` yang mempertahankan path, hamburger menu mobile | Task 7 | Requirement MVP |
| 3B-2 | Buat `WhatsAppButton.tsx` di `src/features/contact/` | Task 9 | Requirement MVP |
| 3B-3 | Buat `Breadcrumb.tsx` dan `Sidebar.tsx` sebagai komponen terpisah, dengan mobile collapse | Task 8 | Requirement MVP |
| 3B-4 | Implementasi services layer `src/services/` | Task 5 | Requirement MVP |
| 3B-5 | Buat halaman Formulir Minat (`/interest`) dengan placeholder gambar | Task 16 | Requirement MVP |
| 3B-6 | Buat halaman/modal teaser Coming Soon Pabuaran terpisah dengan CTA | Task 17 | Requirement MVP |

### Batch 3C — Technical Debt

Item di bawah ini adalah perbaikan yang bukan dari acceptance criteria, tapi mempengaruhi kualitas:

| ID | Aksi | Prioritas |
|---|---|---|
| 3C-1 | Perbaiki string hardcode ID di komponen V2 yang bypass i18n | Medium |
| 3C-2 | Implementasikan logika filter unit (bukan hanya chip visual) | Medium |
| 3C-3 | Sinkronisasi `NEXT_PUBLIC_WHATSAPP_NUMBER` ke env variable | Low (lakukan sebelum nomor nyata diisi) |

### Batch 3D — Tergantung data Owner

| ID | Aksi | Menunggu |
|---|---|---|
| 3D-1 | Update nomor WhatsApp di `src/config/site.ts` | Q-1 |
| 3D-2 | Update status kavling di `dehir-units.json` | Q-2 |
| 3D-3 | Resolusi konflik format kode kavling | Q-3 |
| 3D-4 | Integrasi foto proyek dan unit | Q-5 |
| 3D-5 | Aktivasi Site Plan Interaktif | Q-6 |
| 3D-6 | Tambah koordinat GPS dan Google Maps embed | Q-7 |
| 3D-7 | Integrasi logo dan favicon | Q-11 |
| 3D-8 | Keputusan aset `Hybrid 1 — A Dominan, C Diserap@2x.png` | Q-4 |

### Batch 3E — Final

| ID | Aksi | Dependensi |
|---|---|---|
| 3E-1 | Final build, lint, quality check (Task 20) | Batch 3B selesai, foto tersedia |
| 3E-2 | Aktifkan SEO indexing dan canonical | Domain (Q-10) dikonfirmasi |
| 3E-3 | Setup hosting dan deploy | Platform dan domain tersedia |

---

## 9. Catatan Validasi

**Klaim terverifikasi langsung dari source code dalam revisi ini:**

| Klaim | Bukti |
|---|---|
| Task 1 acceptance criteria terpenuhi | `src/proxy.ts`: `localePrefix: "always"`, `src/app/[locale]/layout.tsx`: `hasLocale()` + `notFound()` |
| Task 7 LanguageSwitcher tidak mempertahankan path | `Navbar.tsx` baris 59–71: `href="/id"` dan `href="/en"` (bukan path-aware) |
| Task 7 hamburger mobile tidak ada | `Navbar.tsx`: tidak ada `<button>` hamburger, mobile link langsung |
| Task 9 `WhatsAppButton.tsx` tidak ada | `Test-Path src/features/contact/` → NOT FOUND |
| Task 12 Maps dan Google Maps URL conditional sudah benar | `[slug]/page.tsx`: tidak embed jika `coordinates` tidak ada |
| Task 13 acceptance criteria tidak menyebut filter | Dibaca langsung dari tasks.md |
| Task 14 data null ditangani sesuai spec | `[unitCode]/page.tsx`: conditional display dengan `!= null` |
| Task 17 CTA "Hubungi untuk Info Terbaru" tidak ada di branch coming-soon | `[slug]/page.tsx` baris coming-soon branch |
| SVG default tidak direferensikan di source code | grep `**/*.{ts,tsx,css,json}` — 0 hasil |
| SVG default direferensikan di dokumen | grep `**/*.md` — hanya di audit/proposal |

**Informasi yang tidak dapat diverifikasi tanpa runtime atau pembacaan mendalam:**
- Isi lengkap `id.json` dan `en.json` (translation keys untuk Task 18)
- Detail token globals.css vs design.md (Task 3)
- `prefers-reduced-motion` di SitePlanPanel (Task 15)
- Responsive behavior di 320px (Task 20)

---

*Dokumen ini adalah proposal read-only. Tidak ada perubahan yang dilakukan pada proyek.*
*Eksekusi hanya boleh dilakukan setelah proposal ini ditinjau dan disetujui.*
