# Celestia — Project Cleanup & Documentation Alignment Proposal (Stage 1)

**Tanggal:** November 2026  
**Jenis dokumen:** Proposal read-only — belum ada perubahan yang dilakukan  
**Prinsip:** Understand first, propose second, execute only after approval

---

## 1. Executive Summary

Proyek Celestia memiliki dokumentasi yang **cukup lengkap untuk fase awal**, namun sudah mulai diverge dari implementasi aktual setelah Wave 8 dan redesign UI V2. Beberapa dokumen core sudah usang, ada satu file yang menyebabkan build rusak, dan belum ada changelog, testing checklist, atau asset inventory yang terstruktur.

**Prioritas cleanup terpenting:**
1. **Build rusak** — `units/page.tsx` memiliki karakter `-` ilegal di baris 1 (working tree uncommitted, harus di-commit/revert sebelum cleanup)
2. **README.md** sangat ketinggalan — masih menyebut semua fitur sebagai "Planned"
3. **PROJECT-STRUCTURE.md** menggambarkan struktur yang sudah tidak akurat (folder dan file yang belum ada disebut seolah sudah ada)
4. **DEVELOPMENT-GUIDE.md** berisi panduan yang bertentangan dengan praktik saat ini (menyebutkan `src/services/` padahal belum ada)
5. **docs/celestia-existing-implementation-audit.md** merupakan referensi terpenting dan harus dipertahankan

**Yang tidak perlu diubah:** Semua spec Kiro (requirements, design, tasks), laporan audit, catatan konsultasi, dan `AGENTS.md`.

---

## 2. Git Status & Working Tree Condition

### Status saat audit dilakukan

```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/app/[locale]/projects/[slug]/units/page.tsx

Untracked files:
  docs/celestia-existing-implementation-audit.md
```

### Analisis kondisi working tree

| Item | Kondisi | Implikasi untuk cleanup |
|---|---|---|
| `units/page.tsx` | **Modified, unstaged** | File ini adalah penyebab **build rusak**. Diff menunjukkan ada penambahan `−−−−−−−−−−−−−−` di baris 1 yang belum di-commit. Cleanup TIDAK boleh dilakukan sebelum file ini di-commit atau di-revert. |
| `docs/celestia-existing-implementation-audit.md` | **Untracked** | File baru yang dibuat saat audit. Perlu di-commit sebelum cleanup dimulai agar tidak hilang. |

### ⚠️ Tindakan wajib SEBELUM cleanup

1. Putuskan apakah `units/page.tsx` akan di-commit (meski build rusak) atau di-revert ke versi sebelumnya
2. Commit `celestia-existing-implementation-audit.md` agar tidak kehilangan laporan audit
3. Konfirmasi kondisi clean working tree sebelum memulai cleanup apapun

---

## 3. Documentation Inventory

### Ringkasan: Semua file Markdown relevan proyek

Total file Markdown yang diidentifikasi: **14 file** (tidak termasuk node_modules dan .git)

---

### 3.1 Dokumentasi Root

| # | File | Isi Utama | Status Aktual | Rekomendasi |
|---|---|---|---|---|
| R-1 | `README.md` | Gambaran proyek, tujuan, fitur MVP, stack teknologi | **Sangat usang** — semua fitur ditandai "Planned" padahal sebagian besar sudah implemented. Development status masih "Upcoming". Tidak ada instruksi instalasi/run. | **UPDATE** |
| R-2 | `AGENTS.md` | Instruksi untuk AI coding assistant tentang Next.js 16 | Dihasilkan otomatis oleh `next dev`. Bukan dokumentasi manusia. | **KEEP as-is** — jangan diubah |

---

### 3.2 Dokumentasi Developer (`docs/`)

| # | File | Isi Utama | Status Aktual | Rekomendasi |
|---|---|---|---|---|
| D-1 | `docs/ARCHITECTURE.md` | Stack teknologi, prinsip arsitektur, alur data, batasan MVP | **Partially usang** — struktur arsitektur masih relevan, tapi beberapa bagian sudah tidak akurat: (1) menyebut i18n sebagai "dijadwalkan pada Feature Spec berikutnya" padahal sudah implemented; (2) alur data mencantumkan `src/services/` yang belum ada | **UPDATE** |
| D-2 | `docs/TECH-DECISIONS.md` | Keputusan teknis yang sudah diambil dan masih terbuka | **Partially usang** — Next.js, TypeScript, Tailwind, Data JSON sudah akurat. Tapi: (1) i18n masih tercatat sebagai "Masih Terbuka" padahal sudah diputuskan (`next-intl`); (2) Site Plan masih "Masih Terbuka". Turbopack yang "Ditolak" ternyata digunakan di build (lihat `next.config.ts`) | **UPDATE** |
| D-3 | `docs/PROJECT-STRUCTURE.md` | Struktur folder proyek, konvensi penamaan, import alias | **Usang signifikan** — struktur yang digambarkan adalah struktur awal proyek (sebelum Wave 1). Banyak folder dan file yang sudah ada sekarang tidak dicantumkan. Bagian "Folder yang Akan Dibuat" sudah sebagian terwujud. | **UPDATE** |
| D-4 | `docs/DEVELOPMENT-GUIDE.md` | Cara menjalankan proyek, perintah, server vs client component, cara mengakses data | **Partially usang** — panduan menjalankan proyek masih akurat. Tapi bagian "Cara Mengakses Data" berisi instruksi menggunakan `src/services/` yang belum diimplementasikan. Bisa menyesatkan developer baru. | **UPDATE** |
| D-5 | `docs/celestia-existing-implementation-audit.md` | Laporan audit lengkap implementasi aktual Wave 1–8 + UI V2 | **Terbaru dan akurat** — dibuat saat audit ini, mencakup semua temuan penting termasuk build error, hardcode strings, dan gap implementasi. Belum di-commit ke Git. | **KEEP + COMMIT segera** |

---

### 3.3 Dokumentasi Konsultasi (`docs/consultation/`)

| # | File | Isi Utama | Status Aktual | Rekomendasi |
|---|---|---|---|---|
| C-1 | `docs/consultation/consultation-notes.md` | Template notulensi konsultasi dengan perusahaan | **Masih relevan** — berisi daftar pertanyaan yang perlu dijawab perusahaan. Semua field masih kosong (belum ada sesi konsultasi formal yang didokumentasikan). Merupakan sumber referensi pending items bisnis. | **KEEP** |
| C-2 | `docs/consultation/company-information-checklist.md` | Checklist informasi perusahaan yang dibutuhkan | **Masih relevan** — mendetailkan semua item yang belum dikonfirmasi (nomor WA, status kavling, domain, foto, dll). Menjadi referensi blocker bisnis. | **KEEP** |
| C-3 | `docs/consultation/project-timeline.md` | Estimasi timeline dan Gantt chart proyek | **Partially usang** — status awal sudah tidak akurat (banyak yang masih "⏳ Belum dikerjakan" padahal sudah selesai). Tapi bagian risiko dan ketergantungan aset masih relevan. | **UPDATE** |

---

### 3.4 Dokumentasi Spec Kiro (`.kiro/specs/celestia-mvp/`)

| # | File | Isi Utama | Status Aktual | Rekomendasi |
|---|---|---|---|---|
| K-1 | `.kiro/specs/celestia-mvp/requirements.md` | Requirements dokumen lengkap (9 requirements + non-functional) | **Relevan sebagai referensi** — merupakan dokumen requirements resmi yang digunakan sebagai acuan implementasi. Isinya masih akurat untuk scope yang direncanakan meski beberapa item belum implemented. | **KEEP as-is** |
| K-2 | `.kiro/specs/celestia-mvp/design.md` | Dokumen desain teknis | Tidak dibaca detail dalam audit ini (file tidak dibuka) | **KEEP as-is** — belum terverifikasi isinya |
| K-3 | `.kiro/specs/celestia-mvp/tasks.md` | Daftar task Wave 1–20 dengan dependency graph | **Referensi berharga** — berisi status task yang digunakan sebagai tracking implementasi. Beberapa status sudah tidak akurat (Task 13 seharusnya broken bukan selesai). | **KEEP as-is** — jangan ubah tracking tanpa review |
| K-4 | `.kiro/specs/celestia-mvp/.config.kiro` | Metadata spec (specId, workflowType) | File konfigurasi sistem Kiro | **KEEP as-is** — jangan diubah |

---

### 3.5 Ringkasan Rekomendasi per File

| Rekomendasi | File | Alasan |
|---|---|---|
| **UPDATE** | `README.md` | Sangat usang, menyebut semua fitur "Planned" |
| **UPDATE** | `docs/ARCHITECTURE.md` | i18n sudah implemented, services layer belum ada |
| **UPDATE** | `docs/TECH-DECISIONS.md` | i18n sudah diputuskan, Turbopack ternyata digunakan |
| **UPDATE** | `docs/PROJECT-STRUCTURE.md` | Menggambarkan struktur awal yang tidak akurat lagi |
| **UPDATE** | `docs/DEVELOPMENT-GUIDE.md` | Panduan services layer menyesatkan (belum diimplementasi) |
| **UPDATE** | `docs/consultation/project-timeline.md` | Status Tahap 0 sudah sangat berbeda |
| **KEEP + COMMIT** | `docs/celestia-existing-implementation-audit.md` | File terpenting saat ini, belum di-commit |
| **KEEP as-is** | `AGENTS.md` | Generated by Next.js, jangan diubah |
| **KEEP as-is** | `docs/consultation/consultation-notes.md` | Template konsultasi masih valid |
| **KEEP as-is** | `docs/consultation/company-information-checklist.md` | Referensi blocker bisnis |
| **KEEP as-is** | `.kiro/specs/celestia-mvp/requirements.md` | Dokumen requirements resmi |
| **KEEP as-is** | `.kiro/specs/celestia-mvp/design.md` | Tidak diverifikasi, asumsikan keep |
| **KEEP as-is** | `.kiro/specs/celestia-mvp/tasks.md` | Task tracking, jangan ubah tanpa review |
| **KEEP as-is** | `.kiro/specs/celestia-mvp/.config.kiro` | Konfigurasi sistem |

---

## 4. Documentation Consistency Findings

### 4.1 Informasi yang Bertentangan Antar Dokumen

| Topik | Dokumen A (klaim) | Dokumen B (klaim) | Status Aktual | Perlu Diselesaikan |
|---|---|---|---|---|
| Status i18n | `ARCHITECTURE.md`: "implementasi i18n dijadwalkan pada Feature Spec berikutnya" | `TECH-DECISIONS.md`: "keputusan masih terbuka" | **Implemented** — `next-intl` sudah terpasang dan berjalan | Ya — update kedua dokumen |
| Turbopack | `TECH-DECISIONS.md`: "Ditolak — `--no-turbopack` dipilih untuk stabilitas" | `next.config.ts` + build output: Turbopack aktif | **Turbopack digunakan** di build dan dev server | Ya — update TECH-DECISIONS |
| Services layer | `DEVELOPMENT-GUIDE.md`: "Gunakan `src/services/`" | Source code: tidak ada folder `src/services/` | **Belum ada** — semua halaman import JSON langsung | Ya — update DEVELOPMENT-GUIDE |
| Struktur proyek | `PROJECT-STRUCTURE.md`: menggambarkan struktur awal tanpa komponen V2 | Source code: ada `src/components/homepage/`, `src/components/projects/`, `src/features/`, `src/i18n/` | **Jauh lebih berkembang** dari yang digambarkan | Ya — update PROJECT-STRUCTURE |
| Status fitur | `README.md`: semua "Planned" | Audit: sebagian besar sudah implemented | **Implemented** sebagian besar | Ya — update README |

### 4.2 Klasifikasi Status Implementasi vs Dokumentasi

| Fitur | Status di Dokumentasi | Status Aktual | Klasifikasi |
|---|---|---|---|
| Homepage | Planned (README) | ✅ Implemented V1 + V2 | Partially Documented |
| Katalog Proyek | Planned | ✅ Implemented | Partially Documented |
| Eksplorasi Proyek | Planned | ✅ Implemented | Partially Documented |
| Katalog Unit | Planned | ⚠️ Implemented tapi build rusak | Partially Documented |
| Detail Unit | Planned | ✅ Implemented | Partially Documented |
| Site Plan Interaktif | Planned | ❌ Stub (return null) | Partially Documented |
| Formulir Minat | Planned | ❌ Not Implemented | Documented as planned |
| WhatsApp Integration | Planned | ⚠️ Disabled (placeholder) | Partially Documented |
| Bilingual Interface | Planned | ✅ Implemented | Not Updated in README |
| Routing bilingual (next-intl) | "Dijadwalkan" | ✅ Implemented | Inaccurate in ARCHITECTURE |
| Services layer | Wajib (ARCHITECTURE, GUIDE) | ❌ Not Implemented | Inaccurate in GUIDE |
| UI V2 (Redesign) | Tidak ada di dokumentasi | ✅ Implemented | Not Documented anywhere |
| Feature flag `uiConfig.uiVariant` | Tidak ada di dokumentasi | ✅ Implemented | Not Documented anywhere |
| SEO/Sitemap/Robots | Tidak disebutkan di README | ✅ Implemented | Not Documented |

### 4.3 Informasi yang Tercampur (Confirmed vs Pending vs Proposed)

**Di `consultation-notes.md` dan `company-information-checklist.md`:**
- Dokumen sudah memisahkan dengan baik mana yang ✅ terkonfirmasi vs ❓ belum
- Semua field konsultasi masih kosong — **belum ada sesi konsultasi formal yang tercatat**

**Di `project-timeline.md`:**
- Estimasi Tahap 0 "Selesai" — **Confirmed & Implemented**
- Tahap 1 (Data konfirmasi) — **Pending Business Confirmation** (belum ada jawaban)
- Tahap 2–5 — campuran status lama yang tidak akurat lagi

**Di `requirements.md`:**
- Pemisahan antara "Prinsip Data" (konfirmasi diperlukan) vs "Acceptance Criteria" (implementasi) sudah cukup jelas
- Catatan P-20 (format kode kavling) masih **Pending** — harus dipertahankan apa adanya

---

## 5. Asset & Business Data Inventory

### 5.1 Aset Digital yang Sudah Ada

| Aset | Lokasi | Digunakan di Kode? | Status |
|---|---|---|---|
| `Hybrid 1 — A Dominan, C Diserap@2x.png` | `public/` | ❌ Tidak | **Available but Unused** — File 1.4MB di public/, tidak diimpor di manapun |
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | `public/` | ❌ Tidak | **Available but Unused** — Default Next.js, belum diganti |
| `favicon.ico` | `src/app/` | ✅ Ya (otomatis) | **Available & Used** — Default Next.js |

### 5.2 Aset yang Dibutuhkan tapi Belum Tersedia

| Aset | Digunakan di | Status | Kebutuhan Konfirmasi |
|---|---|---|---|
| Foto proyek Dehir (eksterior/kawasan) | Homepage, Eksplorasi, Katalog | **Missing / Pending** | 🔒 Dari perusahaan |
| Foto per unit/kavling | Katalog Unit, Detail Unit | **Missing / Pending** | 🔒 Dari perusahaan |
| Denah/Site Plan resmi Dehir | Eksplorasi (SitePlan Panel) | **Missing / Pending** | 🔒 Dari perusahaan |
| Posisi kavling di denah (koordinat) | InteractiveSitePlan | **Missing / Pending** | 🔒 Dari perusahaan |
| Video promosi Dehir | Homepage | **Missing / Pending** | 🔒 Dari perusahaan |
| Logo Celestia (SVG/PNG) | Navbar, favicon | **Missing / Pending** | 🔒 Dari perusahaan |
| Gambar tipe bangunan dari brosur | Formulir Minat (belum ada) | **Missing / Pending** | 🔒 Dari perusahaan |
| Favicon resmi Celestia | Browser tab | **Placeholder** — masih default Next.js | 🔒 Dari perusahaan |

### 5.3 Data Bisnis

| Data | Status | Nilai Saat Ini | Konfirmasi Diperlukan |
|---|---|---|---|
| Nomor WhatsApp | **Placeholder** | `62XXXXXXXXXX` | 🔒 Blokir semua CTA WA |
| Status kavling A1–B5 | **Placeholder** | Semua `unknown` | 🔒 Perlu konfirmasi per kavling |
| Luas tanah per kavling | **Missing** | Tidak ada | 🔒 Data dari perusahaan |
| Harga per kavling | **Missing** | `null` semua | 🔒 + keputusan apakah ditampilkan publik |
| Koordinat GPS Dehir | **Missing** | Tidak ada | 🔒 Untuk Google Maps embed |
| URL Google Maps Dehir | **Missing** | Tidak ada | 🔒 Untuk tombol "Lihat di Maps" |
| Domain produksi | **Missing** | `celestia.id` (asumsi, belum konfirmasi) | 🔒 Untuk SEO canonical/hreflang |
| Tagline resmi | **Placeholder** | "Temukan Hunian Impian Anda" | 🔒 Konfirmasi perusahaan |
| Format kode kavling (A1 vs A-01) | **Pending** | Kode brosur: A1 (tanpa hubung) | 🔒 Open question P-20 |

---

## 6. Recommended Documentation Structure

### 6.1 Evaluasi Kecukupan Dokumentasi yang Ada

| Kebutuhan | File yang Ada | Kecukupan | Gap |
|---|---|---|---|
| **README** — gambaran & cara menjalankan | `README.md` | ⚠️ Tidak mencukupi | Tidak ada instruksi instalasi/run, status sangat usang |
| **Requirements** — kebutuhan bisnis | `requirements.md` (Kiro) + `company-information-checklist.md` | ✅ Cukup | — |
| **Architecture** — struktur teknis | `ARCHITECTURE.md` + `TECH-DECISIONS.md` | ⚠️ Partially usang | Perlu update, bukan file baru |
| **Roadmap/Backlog** | `tasks.md` (Kiro) + `project-timeline.md` | ✅ Ada | Timeline usang tapi roadmap ada |
| **Changelog** | — | ❌ Tidak ada | Bisa ditambahkan, tapi tidak kritis saat ini |
| **Asset Inventory** | `company-information-checklist.md` (sebagian) | ⚠️ Partial | Sudah mencakup aset digital, bisa diperkuat |
| **Testing Checklist** | — | ❌ Tidak ada | Bermanfaat tapi bukan prioritas Stage 1 |
| **Audit** | `celestia-existing-implementation-audit.md` | ✅ Lengkap | Perlu di-commit |

### 6.2 Rekomendasi Struktur Dokumentasi

**Prinsip:** Gunakan yang sudah ada, perbarui yang usang, hindari duplikasi. Tidak perlu membuat file baru kecuali ada gap kritis.

**Usulan struktur akhir yang dipertahankan:**
```
docs/
├── ARCHITECTURE.md              → UPDATE (akurasikan dengan implementasi)
├── DEVELOPMENT-GUIDE.md         → UPDATE (hapus/perbaiki bagian services layer)
├── PROJECT-STRUCTURE.md         → UPDATE (gambarkan struktur aktual)
├── TECH-DECISIONS.md            → UPDATE (tandai i18n resolved, perbaiki Turbopack)
├── celestia-existing-implementation-audit.md  → KEEP + COMMIT
└── consultation/
    ├── company-information-checklist.md  → KEEP
    ├── consultation-notes.md             → KEEP
    └── project-timeline.md               → UPDATE (update status tahap 0)

README.md (root)                 → UPDATE (status, instruksi run, stack aktual)
AGENTS.md (root)                 → KEEP as-is
```

**File yang TIDAK perlu dibuat saat ini:**
- Changelog — proyek masih prototype, belum ada release
- Testing Checklist — berguna tapi bukan blocker
- Separate Asset Inventory — sudah tercakup di `company-information-checklist.md`

---

## 7. Development & Handover Readiness

### 7.1 Informasi yang Sudah Terdokumentasi

| Informasi | Lokasi | Akurasi |
|---|---|---|
| Tech stack (framework, bahasa, styling) | `README.md`, `ARCHITECTURE.md` | ✅ Akurat |
| Cara install & run | `DEVELOPMENT-GUIDE.md` | ✅ Akurat (`npm install`, `npm run dev`) |
| Perintah build, lint, typecheck | `DEVELOPMENT-GUIDE.md` | ✅ Akurat |
| Versi teknologi utama | `package.json` | ✅ (Next.js 16.4.4, React 19.3.0, dll.) |
| Environment variables yang diperlukan | `.env.local.example` | ⚠️ Ada tapi tidak sinkron dengan kode |
| Struktur data proyek | `requirements.md`, `company-information-checklist.md` | ✅ Cukup lengkap |
| Keputusan arsitektur penting | `TECH-DECISIONS.md` | ⚠️ Partially outdated |
| Batasan dan fitur yang belum selesai | `celestia-existing-implementation-audit.md` | ✅ Lengkap dan akurat |

### 7.2 Gap yang Perlu Diisi untuk Handover

| Gap | Severity | Rekomendasi |
|---|---|---|
| README tidak menunjukkan cara menjalankan proyek secara cepat | High | Tambahkan Quick Start section ke README |
| README tidak mencantumkan status implementasi aktual | High | Update status tabel fitur di README |
| Tidak ada dokumentasi tentang UI V2 dan feature flag `uiConfig` | Medium | Tambahkan ke README atau ARCHITECTURE |
| Tidak ada dokumentasi tentang cara berpindah V1 ↔ V2 | Medium | Tambahkan catatan di README atau TECH-DECISIONS |
| `.env.local.example` mendefinisikan `NEXT_PUBLIC_WHATSAPP_NUMBER` yang tidak dibaca kode | Medium | Perbaiki atau beri catatan di file tersebut |
| Tidak ada informasi hosting yang sudah diputuskan | Low | Belum bisa didokumentasikan, menunggu keputusan perusahaan |
| `PROJECT-STRUCTURE.md` tidak mencantumkan komponen V2 | Medium | Update setelah struktur stabil |

---

## 8. Proposed Cleanup Actions

Diurutkan berdasarkan prioritas. **Belum boleh dilakukan sekarang** — ini adalah proposal.

### Tahap A: Pra-cleanup (harus dilakukan sebelum cleanup apapun)

| ID | Aksi | Prioritas | Alasan |
|---|---|---|---|
| A-1 | **Commit atau revert `units/page.tsx`** yang memiliki karakter ilegal di baris 1 | 🔴 Critical | Build rusak. Working tree tidak bersih. Cleanup tidak boleh dimulai sebelum ini. |
| A-2 | **Commit `celestia-existing-implementation-audit.md`** | 🔴 Critical | File laporan audit belum di-commit. Bisa hilang jika ada operasi Git. |

### Tahap B: Update dokumentasi yang usang

| ID | File | Aksi | Prioritas | Detail |
|---|---|---|---|---|
| B-1 | `README.md` | **UPDATE** | 🔴 High | (1) Update tabel fitur dari "Planned" ke status aktual. (2) Tambahkan Quick Start. (3) Update Development Status. (4) Tambahkan catatan tentang UI V2 dan feature flag. |
| B-2 | `docs/ARCHITECTURE.md` | **UPDATE** | 🟡 Medium | (1) Ubah status i18n dari "dijadwalkan" menjadi "sudah implemented dengan next-intl". (2) Update alur data — services layer belum ada. (3) Tambahkan catatan tentang uiConfig. |
| B-3 | `docs/TECH-DECISIONS.md` | **UPDATE** | 🟡 Medium | (1) Pindahkan "Implementasi i18n" dari "Masih Terbuka" ke "Sudah Diambil". (2) Update Turbopack — ternyata digunakan. (3) Tandai Site Plan masih pending. |
| B-4 | `docs/PROJECT-STRUCTURE.md` | **UPDATE** | 🟡 Medium | Ganti struktur folder dengan struktur aktual yang sudah ada (termasuk `src/components/homepage/`, `src/components/projects/`, `src/features/site-plan/`, `src/i18n/`, dll.) |
| B-5 | `docs/DEVELOPMENT-GUIDE.md` | **UPDATE** | 🟡 Medium | Tambahkan catatan bahwa `src/services/` belum ada — contoh kode di bagian "Mengakses Data" masih menggunakan pola yang belum diimplementasikan. Jangan menghapus panduan — cukup tambahkan catatan status. |
| B-6 | `docs/consultation/project-timeline.md` | **UPDATE** | 🟢 Low | Update kolom Status di tabel "Status Saat Ini" untuk mencerminkan Wave 1–8 yang sudah selesai. |

### Tahap C: Cleanup aset tidak terpakai

| ID | File | Aksi | Prioritas | Detail |
|---|---|---|---|---|
| C-1 | `public/Hybrid 1 — A Dominan, C Diserap@2x.png` | **Putuskan: Arsipkan atau Integrasikan** | 🟡 Medium | File 1.4MB tidak digunakan di kode. Jika ini adalah gambar dari brosur yang akan digunakan, integrasikan ke komponen. Jika tidak, arsipkan atau hapus. Konfirmasi dengan pemilik proyek. |
| C-2 | `public/*.svg` (file.svg, globe.svg, next.svg, vercel.svg, window.svg) | **Arsipkan atau hapus** | 🟢 Low | Default Next.js, tidak digunakan. Bisa dihapus kapanpun tanpa dampak ke kode. |

### Tahap D: Tambahan opsional (tidak kritis)

| ID | Aksi | Prioritas | Detail |
|---|---|---|---|
| D-1 | Tambahkan komentar ke `.env.local.example` | 🟢 Low | Jelaskan bahwa `NEXT_PUBLIC_WHATSAPP_NUMBER` saat ini tidak dibaca kode (hardcode di `site.ts`). Tambahkan instruksi sinkronisasi. |
| D-2 | Tambahkan konfigurasi ke `.vscode/settings.json` | 🟢 Low | Kosong saat ini. Bisa ditambahkan formatOnSave, ruler, tab settings untuk konsistensi. |
| D-3 | Update `tasks.md` status Task 13 | 🟢 Low | Task 13 seharusnya "broken" bukan "selesai" karena build error. Perlu keputusan apakah di-update atau biarkan sebagai tracking historis. |

---

## 9. Risks & Dependencies

| Risiko | Severity | Mitigasi |
|---|---|---|
| Cleanup dilakukan sebelum `units/page.tsx` diselesaikan | 🔴 High | Pastikan build error diperbaiki dan di-commit sebelum cleanup apapun |
| `celestia-existing-implementation-audit.md` belum di-commit dan hilang karena operasi Git | 🔴 High | Commit file ini segera (Aksi A-2) |
| Update `PROJECT-STRUCTURE.md` yang terlalu awal kemudian perlu diubah lagi saat services layer ditambahkan | 🟡 Medium | Sebaiknya update setelah services layer (Task 5) selesai |
| Update `README.md` menggunakan asumsi yang tidak dikonfirmasi | 🟡 Medium | Hanya update berdasarkan fakta yang terverifikasi di kode |
| Menghapus `public/*.svg` sebelum konfirmasi tidak ada yang menggunakannya | 🟢 Low | Verifikasi grep tidak ada import di kode (sudah diverifikasi di audit — tidak ada) |

---

## 10. Recommended Execution Order

Jika proposal ini disetujui, berikut urutan yang disarankan:

```
[SEGERA, sebelum cleanup]
1. (A-1) Selesaikan units/page.tsx — revert atau perbaiki build error, commit
2. (A-2) Commit celestia-existing-implementation-audit.md

[Batch 1 — High priority updates]
3. (B-1) Update README.md — Quick Start + status aktual
4. (B-5) Update DEVELOPMENT-GUIDE.md — tambahkan catatan services layer

[Batch 2 — Architecture documentation]
5. (B-2) Update ARCHITECTURE.md — akurasikan dengan implementasi
6. (B-3) Update TECH-DECISIONS.md — resolve i18n, Turbopack
7. (B-4) Update PROJECT-STRUCTURE.md — gambarkan struktur aktual
    * Sebaiknya setelah services layer (Task 5) diimplementasikan

[Batch 3 — Minor updates & cleanup]
8. (B-6) Update project-timeline.md — status Wave
9. (C-1) Putuskan nasib file brosur di public/
10. (C-2) Hapus SVG default Next.js dari public/
11. (D-1) Update .env.local.example — tambahkan komentar sinkronisasi
12. (D-2) Isi .vscode/settings.json — konfigurasi editor
```

---

## Lampiran: Area yang Diperiksa dalam Audit ini

### Berhasil diperiksa
- ✅ Git status dan kondisi working tree
- ✅ Semua file Markdown di root dan `docs/`
- ✅ Semua file Markdown di `.kiro/specs/celestia-mvp/`
- ✅ Isi konten `README.md`, semua `docs/*.md`, semua `docs/consultation/*.md`
- ✅ Isi `requirements.md` (sebagian besar)
- ✅ Source code yang relevan untuk verifikasi konsistensi
- ✅ `package.json`, `next.config.ts`, `.gitignore`, `.env.local.example`, `tsconfig.json`
- ✅ Semua file di `public/` dan `src/`
- ✅ `node_modules/` (listing saja, tidak dibaca isi)
- ✅ `.next/` (listing saja, artifacts build)

### Tidak dapat diverifikasi tanpa runtime
- ❓ Perilaku runtime UI V2 di browser
- ❓ Konsistensi terjemahan ID/EN secara menyeluruh (hanya spot check)
- ❓ `design.md` di Kiro specs — tidak dibaca isinya dalam audit ini

---

*Dokumen ini adalah proposal read-only. Tidak ada perubahan yang dilakukan pada proyek.*  
*Eksekusi cleanup hanya boleh dilakukan setelah proposal ini ditinjau dan disetujui.*
