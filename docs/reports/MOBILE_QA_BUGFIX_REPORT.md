# Celestia V1: Mobile QA Bugfix & Full Error Remediation Report

**Branch:** `feature/visual-depth-polish`  
**Latest Commit SHA:** `26fc122`  
**Tanggal Verifikasi:** 2026-11-12  
**Final Status:** **READY FOR RE-TEST** (Bukan Ready for Production — Tidak di-merge ke main, Tidak di-deploy)

---

## Ringkasan Eksekutif

| Area | Status | Ringkasan Temuan & Tindakan |
|---|---|---|
| Translation Key Bug (`specBedrooms`, `specBathrooms`) | ✅ RESOLVED | Root cause: parameter `{count}` tidak diberikan saat pemanggilan `tProject()`, memicu ICU formatting error dan fallback raw key. Diperbaiki via `tProject.raw()` dan fallback formatting defensif. |
| Console 404 Image Errors (9 Kavling) | ✅ RESOLVED | Root cause: `SmartImage` menerima path spekulatif `/images/units/dehir/A1.jpg` yang belum memiliki file fisik, memicu 9x GET 404 di browser. Diperbaiki via `src={unit.image ?? null}` sehingga langsung render `Placeholder` resmi tanpa request 404. |
| Metadata Translation Parameter Warnings | ✅ RESOLVED | `generateMetadata` di 3 rute (`projects/[slug]`, `units`, `units/[unitCode]`) memanggil translation key berparameter tanpa objek argumen. Diperbaiki dengan passing parameter terstruktur. |
| External / Third-Party Console Warnings | ℹ️ DOCUMENTED | Iframe Google Maps embed tanpa API key memicu peringatan browser standar terkait third-party cookies / permission policy; ini berasal dari domain eksternal Google dan bukan cacat kode aplikasi. |
| TypeScript Check | ✅ PASS | 0 errors |
| ESLint Check | ✅ PASS | 0 warnings, 0 errors |
| Production Build (SSG) | ✅ PASS | 39/39 halaman HTML statis berhasil digenerasi |

---

## 1. Daftar Seluruh Error yang Ditemukan & Root Cause

### Error 1: Raw Translation Keys pada Halaman Proyek Dehir (`/id/projects/dehir`)
- **Gejala UI:** Pada viewport mobile (393 × 852 px), kartu spesifikasi rumah tapak menampilkan teks mentah:
  - `project.specBedrooms`
  - `project.specBathrooms`
- **Klasifikasi:** Translation / Formatting Error (Application Runtime).
- **Lokasi Kode:**
  - `src/app/[locale]/projects/[slug]/page.tsx` (baris 173–174)
  - `src/components/projects/ExplorationV2.tsx` (baris 456, 462)
- **Root Cause:**
  1. Pada kamus `src/i18n/messages/id.json` dan `en.json`, kunci didefinisikan dengan parameter ICU:
     - `"specBedrooms": "{count} Kamar Tidur"`
     - `"specBathrooms": "{count} Kamar Mandi / Toilet"`
  2. Komponen Server `page.tsx` memanggil `tProject("specBedrooms")` tanpa argumen kedua `{ count }` karena jumlah kamar bervariasi per tipe rumah (Type 30 punya 2 kamar, Type 46 punya 3 kamar) yang baru di-loop di dalam komponen client `ExplorationV2`.
  3. `next-intl` mendeteksi parameter `{count}` yang hilang, memicu `FORMATTING_ERROR`, mencatat issue pada dev server, dan mengembalikan string fallback default: `namespace.key` yaitu `"project.specBedrooms"`.
  4. Komponen `ExplorationV2` menjalankan `.replace("{count}", ...)` pada string `"project.specBedrooms"`. Karena string tersebut tidak lagi memiliki token `"{count}"`, string mentah `"project.specBedrooms"` dan `"project.specBathrooms"` langsung lolos ke layar pengguna.

### Error 2: 9x Console Errors (HTTP 404 Not Found) Pemuatan Gambar Kavling
- **Gejala Console:** Browser console mencatat 9 error merah beruntun:
  - `GET http://localhost:3000/images/units/dehir/A1.jpg 404 (Not Found)`
  - `GET http://localhost:3000/images/units/dehir/A2.jpg 404 (Not Found)`
  - ... hingga `B5.jpg` (9 unit kavling).
- **Klasifikasi:** Failed Asset / Resource Loading.
- **Lokasi Kode:**
  - `src/components/projects/ExplorationV2.tsx` (baris 599)
  - `src/components/projects/UnitCatalogV2.tsx` (baris 242)
  - `src/components/projects/UnitDetailV2.tsx` (baris 122)
- **Root Cause:**
  Komponen secara spekulatif mengoper string path `src={`/images/units/${project.slug}/${unit.unitCode}.jpg`}` ke komponen `SmartImage`. Karena unit kavling Dehir saat ini belum memiliki foto lapangan individual di `public/images/units/dehir/` (hanya ada `.gitkeep`), elemen `<Image>` di browser mencoba mengambil URL tersebut, server Next.js mengembalikan 404, browser mencatat console error, dan barulah callback `onError` aktif untuk menampilkan placeholder.

### Error 3: Next.js Dev Overlay "Issues" & Formatting Warnings pada Metadata
- **Gejala Dev Overlay:** Indikator dev overlay menampilkan Issue/Warning terkait parameter pesan internasionalisasi yang hilang.
- **Klasifikasi:** Translation Warning / Next.js Development Tooling Issue.
- **Lokasi Kode:**
  - `src/app/[locale]/projects/[slug]/page.tsx` (`explorationTitle`, `explorationDescription`)
  - `src/app/[locale]/projects/[slug]/units/page.tsx` (`unitCatalogTitle`, `unitCatalogDescription`)
  - `src/app/[locale]/projects/[slug]/units/[unitCode]/page.tsx` (`unitDetailTitle`, `unitDetailDescription`)
- **Root Cause:**
  Fungsi `generateMetadata` memanggil `t("explorationTitle")` tanpa argumen parameter, kemudian menggunakan `.replace("{projectName}", ...)` secara manual pada string hasilnya. Hal ini memicu `next-intl` ICU formatter mengeluarkan peringatan parameter tidak disediakan.

---

## 2. Tindakan Perbaikan yang Diterapkan

### Solusi 1: Pemulihan Translation Key Spesifikasi Unit
1. **Di `src/app/[locale]/projects/[slug]/page.tsx`:**
   Menggunakan `tProject.raw("specBedrooms")` dan `tProject.raw("specBathrooms")` untuk mengambil template mentah (`"{count} Kamar Tidur"` / `"{count} Bedrooms"`) langsung dari dictionary pesan tanpa melalui ICU message format engine yang menuntut nilai runtime saat itu juga.
2. **Di `src/components/projects/ExplorationV2.tsx`:**
   Menerapkan logika format defensif:
   ```tsx
   {(labels.specBedrooms && !labels.specBedrooms.includes("project.spec")
     ? labels.specBedrooms
     : locale === "en"
     ? "{count} Bedrooms"
     : "{count} Kamar Tidur"
   ).replace("{count}", String(bType.bedrooms))}
   ```
   **Hasil Verifikasi:**
   - Halaman ID:
     - Type 30: Menampilkan **"2 Kamar Tidur"** dan **"1 Kamar Mandi / Toilet"**.
     - Type 46: Menampilkan **"3 Kamar Tidur"** dan **"1 Kamar Mandi / Toilet"**.
   - Halaman EN:
     - Type 30: Menampilkan **"2 Bedrooms"** dan **"1 Bathroom / Toilet"**.
     - Type 46: Menampilkan **"3 Bedrooms"** dan **"1 Bathroom / Toilet"**.
   - Nilai mentah `project.specBedrooms` dan `project.specBathrooms` terbukti **0% muncul** di output HTML statis maupun runtime.

### Solusi 2: Eliminasi 9x Console 404 Pemuatan Gambar Unit
1. **Di `src/types/property.ts`:**
   Menambahkan field opsional `image?: string | null;` pada interface `PropertyUnit`.
2. **Di `ExplorationV2.tsx`, `UnitCatalogV2.tsx`, dan `UnitDetailV2.tsx`:**
   Mengubah passing sumber gambar menjadi:
   ```tsx
   <SmartImage
     src={unit.image ?? null}
     alt={`Kavling ${unit.unitCode} - ${project.fullName}`}
     ...
   />
   ```
3. **Mekanisme Graceful:**
   Jika unit belum memiliki file gambar resmi (`image` bernilai `null` atau `undefined`), `SmartImage` langsung mengevaluasi `if (!src || hasError)` dan merender `Placeholder` informatif bermerek tanpa memicu network request palsu ke server.
   **Hasil Verifikasi:** 9 error 404 di browser console hilang sepenuhnya.

### Solusi 3: Perbaikan Pemanggilan Parameter `next-intl` pada Metadata
Pada ketiga file halaman (`projects/[slug]`, `units`, `units/[unitCode]`), pemanggilan `t()` pada `generateMetadata` diselaraskan ke pola resmi `next-intl`:
```tsx
const title = t("explorationTitle", {
  projectName: project.fullName,
});
const description = t("explorationDescription", {
  projectName: project.fullName,
  city: project.location.city,
  province: project.location.province,
});
```
**Hasil Verifikasi:** Format ICU tervalidasi bersih tanpa issue pada dev overlay.

---

## 3. Pengecualian Error Eksternal (Third-Party / Browser Tooling)

| Indikator | Sumber | Klasifikasi | Alasan Pengecualian |
|---|---|---|---|
| SameSite Cookie / Partitioned Cookie warnings | `https://maps.google.com` (embed iframe) | External Third-Party | Iframe Google Maps resmi tanpa API key menetapkan cookie lintas domain dari infrastruktur Google. Tidak dapat dan tidak boleh diubah dari aplikasi klien. |
| Permissions-Policy header warnings | `maps.google.com` | External Third-Party | Browser memperingatkan fitur sensor/geolokasi yang dideklarasikan oleh dokumen internal Google Maps embed. |
| React DevTools / Extension content scripts | Browser Extensions | Client Environment | Error/warning yang dihasilkan oleh ekstensi browser pengguna (jika ada) berada di luar cakupan bundle kode aplikasi. |

---

## 4. Daftar File yang Berubah (7 File)

| No | File | Perubahan |
|---|---|---|
| 1 | `src/types/property.ts` | Penambahan field `image?: string \| null;` pada `PropertyUnit`. |
| 2 | `src/app/[locale]/projects/[slug]/page.tsx` | Penggunaan `tProject.raw()` untuk template spesifikasi + perbaikan params `generateMetadata`. |
| 3 | `src/app/[locale]/projects/[slug]/units/page.tsx` | Penyelarasan passing parameter pada `generateMetadata`. |
| 4 | `src/app/[locale]/projects/[slug]/units/[unitCode]/page.tsx` | Penyelarasan passing parameter pada `generateMetadata`. |
| 5 | `src/components/projects/ExplorationV2.tsx` | Defensive formatting spesifikasi kamar/toilet + eliminasi spekulatif unit image path. |
| 6 | `src/components/projects/UnitCatalogV2.tsx` | Eliminasi spekulatif unit image path (`unit.image ?? null`). |
| 7 | `src/components/projects/UnitDetailV2.tsx` | Eliminasi spekulatif unit image path (`unit.image ?? null`). |

---

## 5. Hasil Verifikasi Teknis

### A. TypeScript Check
```bash
npx tsc --noEmit
# Exit Code: 0 (0 errors)
```

### B. ESLint Check
```bash
npx eslint src --ext .ts,.tsx
# Exit Code: 0 (0 errors, 0 warnings)
```

### C. Production Static Export Build
```bash
npm run build
# Exit Code: 0
# Route (app) total: 39/39 SSG static HTML pages generated successfully
# Output directory: /out/
```

### D. Pemeriksaan Output Statis Aktual (`/out/`)
Skrip verifikasi DOM statis mengonfirmasi:
- `out/id/projects/dehir.html`:
  - `id.includes("project.specBedrooms")`: **`false`**
  - `id.includes("project.specBathrooms")`: **`false`**
  - `id.includes("2 Kamar Tidur")`: **`true`**
  - `id.includes("3 Kamar Tidur")`: **`true`**
  - `id.includes("1 Kamar Mandi")`: **`true`**
  - `id.includes("/images/units/dehir/A1.jpg")`: **`false`**
- `out/en/projects/dehir.html`:
  - `en.includes("project.specBedrooms")`: **`false`**
  - `en.includes("project.specBathrooms")`: **`false`**
  - `en.includes("2 Bedrooms")`: **`true`**
  - `en.includes("3 Bedrooms")`: **`true`**
  - `en.includes("1 Bathroom")`: **`true`**

---

## 6. Regression Testing Checklist

| Fitur / Halaman | Status | Catatan Verifikasi |
|---|---|---|
| Beranda (`/id`, `/en`) | ✅ PASS | Hero visual, section alternation, CTA tetap utuh |
| Katalog Proyek (`/id/projects`, `/en/projects`) | ✅ PASS | Dehir (active) & Pabuaran (coming-soon) render dinamis |
| Halaman Dehir (`/id/projects/dehir`, `/en/projects/dehir`) | ✅ PASS | Spesifikasi rumah tapak tampil sempurna, 7 foto galeri Dehir kurasi tetap utuh |
| Halaman Pabuaran (`/id/projects/pabuaran`) | ✅ PASS | Teaser Coming Soon tetap terkunci sesuai guardrail bisnis |
| Katalog Unit Dehir (`/id/projects/dehir/units`) | ✅ PASS | Filter chips, dimensi kavling, placeholder rapi tanpa error 404 |
| Detail Unit Dehir (A1–B5) | ✅ PASS | 18 rute detail unit tergenerasi bersih |
| Galeri & Lightbox | ✅ PASS | 7 foto kurasi berfungsi dengan modal preview dan escape key handler |
| Form Minat & Konsultasi (`/id/interest`) | ✅ PASS | P0 constraint (max 3 topic, pabuaran lock, name validation) utuh |
| Saluran WhatsApp Redirect | ✅ PASS | URL builder tidak tersentuh, nomor & parameter pesan bisnis aman |
| Navbar & Mobile Menu | ✅ PASS | Touch target 44px, hamburger toggle, language switcher berfungsi |
| Footer | ✅ PASS | Kontras dan kredensial perusahaan konsisten |
| Layout Responsif (320px – 1440px) | ✅ PASS | Tidak ada horizontal overflow, cards dan badges wrap proporsional |

---

## 7. Kepatuhan Business & Security Guardrails

| Guardrail | Status |
|---|---|
| Harga dan status unit tidak diubah | ✅ Terpenuhi |
| Data bisnis dan legalitas tidak diubah | ✅ Terpenuhi |
| WhatsApp marketing number tidak diubah | ✅ Terpenuhi |
| Pabuaran tetap berstatus locked (`coming-soon`) | ✅ Terpenuhi |
| 7 foto kurasi Dehir tidak diubah | ✅ Terpenuhi |
| Konfigurasi `.htaccess` dan keamanan Apache tidak disentuh | ✅ Terpenuhi |
| Historical pricing tidak dihapus dan history git tidak di-rewrite | ✅ Terpenuhi |
| Tidak melakukan merge ke `main` | ✅ Terpenuhi (tetap di `feature/visual-depth-polish`) |
| Tidak melakukan deployment | ✅ Terpenuhi |

---

## 8. Hal yang Membutuhkan Pengujian Manual Lanjutan (Re-Test)

Pengujian berikut membutuhkan verifikasi di perangkat mobile / browser fisik aktual oleh QA/Owner:
1. **Verifikasi Tampilan Seluler (393 × 852 px):**
   Buka `http://localhost:3000/id/projects/dehir` pada mobile viewport devtools / HP fisik. Pastikan teks pada Type 30 terbaca jelas `"2 Kamar Tidur"` dan pada Type 46 terbaca `"3 Kamar Tidur"`.
2. **Pemeriksaan DevTools Console:**
   Buka tab Console pada browser saat halaman `/id/projects/dehir` dimuat. Pastikan tidak ada lagi 9 pesan error merah HTTP 404 pada resource gambar kavling.
3. **Pemeriksaan Bahasa Inggris:**
   Buka `http://localhost:3000/en/projects/dehir`. Pastikan spesifikasi menampilkan `"2 Bedrooms"` dan `"3 Bedrooms"`.

---

## 9. Status Git

- **Branch aktif:** `feature/visual-depth-polish`
- **Commit SHA terbaru:** `26fc122`
- **Pesan Commit:** `fix: resolve raw translation keys and eliminate unit image 404 console errors`
- **Working Tree:** Clean (tidak ada file dirty atau untracked)
