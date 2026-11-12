# Implementation Plan: Celestia V1 Launch

## Overview

Dokumen ini berisi daftar tugas terstruktur untuk peluncuran Celestia V1 (PT Mitra Rahim Indonesia).
Rencana ini telah disesuaikan berdasarkan laporan `KIRO_QUICKPLAN_REVIEW.md` dan mencakup seluruh lima workstream (WS-01 s/d WS-05) dengan prioritas terukur:
- **P0**: Launch Blockers (Build Integrity & Consultation Flow)
- **P1**: High-Priority Launch Readiness (Security Audit, Content Validation, Static Export & Deployment Artifacts)
- **P2**: Quality of Life & Documentation Polish (i18n completeness, responsive audit, docs currency)

Total: 11 tugas (Task 0 sampai Task 10).

---

## Tasks

### Phase 0: Pre-flight Verification (P0 — Wajib Pertama)

- [ ] 0. Pre-flight build baseline verification: Konfirmasi kondisi aktual working tree dan compiler sebelum memulai perubahan kode atau konfigurasi. Jalankan `npx tsc --noEmit` (0 error), `npm run lint` (0 error), dan `npm run build` (39 halaman static export di `/out/`). Konfirmasi branch aktif adalah `poc-static-export` via `git branch --show-current`. Periksa `git status` untuk memastikan tidak ada perubahan file yang tidak diharapkan. **Acceptance:** TypeScript lulus 0 error, linter lulus 0 error, build menghasilkan `/out/` bersih, branch terverifikasi, baseline tercatat.

### Phase 1: Launch Blockers (P0 — WS-01)

- [ ] 1. Build Integrity & ECMAScript module parsing: Periksa file `src/app/[locale]/projects/[slug]/units/page.tsx` untuk memastikan tidak ada karakter leading dash (`---`) sebelum statement import pertama yang dapat mengganggu parser Turbopack/Next.js. **Acceptance:** File `units/page.tsx` valid ECMAScript module, `npx tsc --noEmit` lulus, build statis tidak gagal pada parsing halaman units.

- [ ] 2. Consultation Flow verification (`/[locale]/interest`): Verifikasi halaman Formulir Minat dan Konsultasi di `src/app/[locale]/interest/page.tsx` dan `src/features/contact/InterestForm.tsx`. Pastikan form menggunakan native HTML elements (`<input>`, `<select>`, `<textarea>`) dengan styling Tailwind CSS (jangan memaksa integrasi komponen dead code `Input.tsx`, `Select.tsx`, `Button.tsx`). Verifikasi sanitasi input (nama maks 100 karakter, catatan maks 1.000 karakter), URL encoding WhatsApp (`buildWhatsAppUrl`), penguncian proyek Pabuaran (notice disabled, tombol submit nonaktif), dan bilingual text rendering. **Acceptance:** Validasi form berfungsi di `/id/interest` dan `/en/interest`, pesan WhatsApp ter-generate benar tanpa backend/database storage, Pabuaran terkunci aman, zero dependensi UI baru.

- [ ] 3. Navbar Navigation Integrity: Verifikasi seluruh tautan pada `Navbar.tsx` dan `NavbarMobileMenu.tsx`. Pastikan tautan "Formulir Minat / Interest Form" mengarah ke `/[locale]/interest`, tautan "Hubungi / Contact" mengarah ke `/[locale]/contact`, dan tombol WhatsApp CTA Navbar aktif membuka pesan resmi homepage ke nomor canonical `6282299237825`. **Acceptance:** Tidak ada navigasi 404 dari Navbar, WhatsApp CTA membuka `wa.me` dengan benar di tab baru.

### Phase 2: Security & Content Validation (P1 — WS-02 & WS-03)

- [ ] 4. WS-02 Security & Data Protection Audit: Lakukan audit menyeluruh terhadap working tree dan HEAD commit. 
  - Lakukan inspeksi eksplisit terhadap `src/data/internal/dehir-historical-pricing.json` dan dokumentasikan bahwa file ini **sudah tercommit di HEAD commit**.
  - Catat secara eksplisit dalam laporan bahwa penambahan rule ke `.gitignore` hanya mencegah tracking file baru yang belum tercommit, dan **tidak otomatis menghapus tracking file yang sudah ada di Git history**.
  - Terapkan guardrail ketat: **JANGAN melakukan rewrite Git history** (no rebase, no `git filter-branch`, no BFG) dan **JANGAN menghapus data historis** tanpa persetujuan tertulis Owner/Manajemen.
  - Verifikasi bahwa `HistoricalBrochurePricing` dan file internal tidak diimpor atau di-bundle oleh komponen halaman publik (`git grep "dehir-historical-pricing"` menghasilkan 0 hasil di `src/app/`, `src/components/`, `src/features/`).
  - Verifikasi bahwa `src/data/properties/dehir-units.json` bersih dari angka harga (`price: null`).
  - Tambahkan `src/data/internal/` ke `.gitignore` untuk mencegah penambahan file baru secara tidak sengaja.
  - Terbitkan laporan resmi di `docs/SECURITY-AUDIT.md`.
  **Acceptance:** Dokumen `docs/SECURITY-AUDIT.md` lengkap, status tracking file internal terdokumentasi akurat, `.gitignore` diperbarui, Git history tetap utuh.

- [ ] 5. WS-03 Business Content & Asset Integrity: Verifikasi konsistensi data bisnis pada file JSON dan komponen UI:
  - Konfirmasi status Pabuaran tetap `coming-soon` di `src/data/projects/pabuaran.json`.
  - Konfirmasi seluruh 9 unit kavling Dehir berstatus `unknown` dan `price: null` di `src/data/properties/dehir-units.json`, menampilkan label `contactForPrice` ("Hubungi Marketing").
  - Pertahankan integrasi 7 foto kurasi lapangan Dehir di `public/images/projects/dehir/` dan `src/data/media/dehir-gallery.ts` (hasil Task P2).
  - Pastikan seksi video tetap menggunakan `<Placeholder type="video">`.
  - Pastikan denah kawasan tetap menggunakan `<SitePlanPanel>` dengan UI placeholder sampai arsitek menyerahkan SVG resmi.
  **Acceptance:** Tidak ada klaim fiktif, foto Dehir kurasi P2 dipertahankan, video dan denah tetap placeholder transparan.

### Phase 3: Production Readiness & Deployment Artifacts (P1 — WS-04)

- [ ] 6. WS-04 Static Export, `.htaccess`, & Deployment Checklist:
  - Jalankan `npm run build` untuk menghasilkan direktori `/out/` yang lengkap dan mandiri.
  - Siapkan file `/out/.htaccess` dengan konfigurasi Apache untuk hosting Rumahweb:
    - Redirect root `/` ke `/id/` (`RewriteRule ^/?$ /id/ [R=302,L]`).
    - Cache-Control headers (1 tahun untuk static assets, `no-cache` untuk `.html`).
    - Security headers baseline (`nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`).
    - **Pending Verification Rule:** Tandai konfigurasi `RewriteRule ^(id|en)/(.*)$` dan `ErrorDocument 404` sebagai *pending verification* berdasarkan struktur output `/out/` aktual (misal: keberadaan `/out/404.html` vs `/out/id/404/index.html`) serta perilaku modul Apache Rumahweb.
  - Susun `docs/DEPLOYMENT-CHECKLIST.md` yang mencakup pre-deployment check, upload guide, server prerequisite verification (`mod_rewrite`, `mod_headers`), smoke test manual, dan panduan aktivasi SEO pasca-konfirmasi domain.
  **Acceptance:** File `.htaccess` dan `docs/DEPLOYMENT-CHECKLIST.md` tersedia, catatan pending verification tercantum jelas, tidak ada aksi upload atau perubahan DNS.

### Phase 4: UI/UX & Documentation Polish (P2 — WS-05)

- [ ] 7. WS-05 i18n Completeness & Hardcoded Strings Elimination: Ganti seluruh string hardcoded pada komponen V2 (`ExplorationV2.tsx`, `UnitCatalogV2.tsx`, `UnitDetailV2.tsx`) dengan translation keys yang terdaftar di `src/i18n/messages/id.json` dan `en.json`:
  - `unitKavlingTitle` ("Eksplorasi Kavling" / "Plot Exploration")
  - `unitKavlingSubtitle` ("{projectName} · Daftar Kavling Resmi" / "{projectName} · Official Plot Directory")
  - `kavlingMeasurementDisclaimer` (Catatan transparansi ukuran kavling pada 3 komponen)
  - `dimensionsLabel`, `priceLabel`, `landAreaLabel`, `statusLabel`
  - `unitCardKavling` ("Kavling" / "Plot")
  - `showingCount` ("Menampilkan {count} dari {total} unit" / "Showing {count} of {total} units")
  - `backToProjectOverview`, `catalogTitle`, `buildingOptionsTitle`, `noFilterMatch`
  **Acceptance:** Zero hardcoded Indonesian strings pada tampilan locale `en`, key parity 100% antara `id.json` dan `en.json`.

- [ ] 8. WS-05 Responsive & Accessibility Baseline: Lakukan audit visual dan interaksi pada breakpoint 320px, 375px, 768px, 1024px, dan 1440px. Pastikan tidak ada horizontal scrollbar, touch target minimum 44×44px, dan focus ring aksesibel (`focus:ring-2 focus:ring-primary-300`). **Acceptance:** Layout responsif di semua breakpoint, navigasi keyboard berfungsi dengan indikator visual jelas.

- [ ] 9. WS-05 Documentation Currency: Perbarui dokumentasi repositori agar mencerminkan kondisi V1 aktual:
  - `README.md`: Update checklist fitur terimplementasi (Interest Form, Contact Page, Services Layer, Bilingual Routing, Curated Gallery).
  - `docs/PROJECT-STRUCTURE.md` & `docs/DEVELOPMENT-GUIDE.md`: Tambahkan struktur baru (`src/features/contact/`, `src/data/media/`, `proxy.ts`).
  - Pertahankan seluruh dokumen historis dan audit proposal yang sudah ada.
  **Acceptance:** Dokumentasi sinkron dengan codebase aktual, file historis utuh.

### Phase 5: Final Verification

- [ ] 10. Final Build & Quality Gate: Jalankan rangkaian pengujian akhir:
  - `npx tsc --noEmit` → 0 error
  - `npm run lint` → 0 error
  - `npm run build` → 39 halaman statis ter-generate di `/out/`
  - Smoke test navigasi bilingual lokal
  **Acceptance:** Seluruh quality gate terpenuhi, website siap untuk tahap staging review.

---

## Task Dependencies & Execution Waves

```json
{
  "waves": [
    {
      "wave": 0,
      "tasks": [0],
      "description": "Pre-flight verification baseline"
    },
    {
      "wave": 1,
      "tasks": [1, 2, 3],
      "description": "P0 Launch Blockers: Build Integrity & Consultation Flow"
    },
    {
      "wave": 2,
      "tasks": [4, 5],
      "description": "P1 Security Audit & Business Content Validation"
    },
    {
      "wave": 3,
      "tasks": [6],
      "description": "P1 Production Readiness: .htaccess & Deployment Checklist"
    },
    {
      "wave": 4,
      "tasks": [7, 8, 9],
      "description": "P2 Polish: i18n completeness, responsive audit, documentation"
    },
    {
      "wave": 5,
      "tasks": [10],
      "description": "Final Build & Quality Gate"
    }
  ]
}
```
