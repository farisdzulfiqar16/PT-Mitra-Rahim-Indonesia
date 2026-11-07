# Celestia — Architecture Documentation Review Proposal (Stage 2C)

**Tanggal:** November 2026
**Jenis:** Proposal read-only — belum ada perubahan yang dilakukan
**Cakupan:** `docs/ARCHITECTURE.md`, `docs/TECH-DECISIONS.md`, `docs/PROJECT-STRUCTURE.md`
**Referensi utama:** `docs/celestia-existing-implementation-audit.md`, source code aktual

---

## 1. Ringkasan Kondisi Setiap Dokumen

### ARCHITECTURE.md — **Partially Usang**

Fondasi dokumen masih benar: prinsip Server Components, type safety, batasan MVP (no backend, no payment, no login). Namun terdapat dua bagian yang sudah tidak akurat:

1. **Bagian "Bilingual (i18n)"** menyebutkan bahwa i18n *"dijadwalkan pada Feature Spec berikutnya"* dan *"Kandidat library: next-intl (evaluasi lebih lanjut diperlukan)"*. Kenyataannya, `next-intl` sudah diimplementasikan penuh — routing `/id/` dan `/en/` aktif, middleware ada di `src/proxy.ts`, dan konfigurasi ada di `src/i18n/`.

2. **Bagian "Alur Data" dan "Feature-Based Architecture"** menggambarkan alur data melalui `src/services/` dan menyebut `src/features/projects/`, `src/features/properties/`, `src/features/contact/` sebagai folder yang ada. Kenyataannya, `src/services/` belum diimplementasikan sama sekali — semua halaman mengimpor JSON langsung. Dan `src/features/` hanya berisi `site-plan/`, bukan folder fitur lain yang disebut.

Selain itu, UI Variant V1/V2 dan `uiConfig.uiVariant` tidak disebutkan sama sekali di dokumen ini.

---

### TECH-DECISIONS.md — **Dua Keputusan Tidak Akurat**

Sebagian besar isi dokumen akurat dan bernilai historis. Dua item perlu koreksi:

1. **Turbopack** tercatat sebagai *"Ditolak — `--no-turbopack` dipilih untuk stabilitas"*. Kenyataannya, `next.config.ts` mengaktifkan Turbopack secara eksplisit melalui blok `turbopack.rules` untuk Tailwind CSS v4. Build dan dev server keduanya menggunakan Turbopack. Keputusan ini sudah berubah dari yang tercatat.

2. **Implementasi i18n** masih tercatat sebagai *"Keputusan yang Masih Terbuka"* dengan pertanyaan belum terjawab. Kenyataannya, `next-intl` sudah dipilih, dipasang (`package.json`: `"next-intl": "^4.14.9"`), dan digunakan aktif. Keputusan ini sudah selesai.

Keputusan lain (Next.js App Router, TypeScript strict, Tailwind v4, Data JSON, Backend ditolak) tetap akurat dan tidak perlu diubah.

---

### PROJECT-STRUCTURE.md — **Usang Signifikan**

Dokumen ini menggambarkan struktur awal proyek sebelum implementasi Wave 1–8 dimulai. Struktur aktual jauh lebih berkembang.

**Yang tercantum seolah ada tapi belum/tidak ada:**
- `src/app/layout.tsx` dan `src/app/page.tsx` di root — sudah dipindah ke `src/app/[locale]/`
- `src/features/projects/`, `src/features/properties/`, `src/features/contact/` — tidak ada
- `src/services/projects.ts`, `src/services/properties.ts` — tidak ada
- `src/i18n/id.json`, `src/i18n/en.json` — ada tapi di `src/i18n/messages/id.json` dan `en.json`

**Yang sudah ada tapi tidak tercantum sama sekali:**
- `src/app/[locale]/` — routing bilingual lengkap (layout, page, error, not-found, projects/[slug]/units/[unitCode])
- `src/components/homepage/`, `src/components/projects/` — komponen V2
- `src/features/site-plan/` — `SitePlanPanel.tsx`, `InteractiveSitePlan.tsx`
- `src/i18n/config.ts`, `src/i18n/request.ts`, `src/i18n/messages/`
- `src/proxy.ts` — middleware next-intl
- `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/not-found.tsx`
- `public/Hybrid 1 — A Dominan, C Diserap@2x.png`

Bagian *"Folder yang Akan Dibuat"* menggambarkan rencana yang sebagian sudah terwujud (dengan perbedaan lokasi) dan sebagian belum ada. Judul dan isi bagian ini sudah tidak akurat lagi.

---

## 2. Daftar Perubahan per Dokumen

### ARCHITECTURE.md

| Bagian | Rekomendasi | Alasan & Bukti |
|---|---|---|
| Bagian "Bilingual (i18n)" | **UPDATE** | Ganti konten dari "dijadwalkan, kandidat next-intl" menjadi "sudah diimplementasikan dengan next-intl". Bukti: `src/i18n/`, `src/proxy.ts`, `package.json` dependency `next-intl ^4.14.9` |
| Alur data (diagram `src/services/ → src/features/ → src/app/`) | **UPDATE** | `src/services/` belum ada — alur sekarang langsung `Data JSON → src/app/`. Perlu ditambahkan catatan bahwa services layer adalah arsitektur yang *direncanakan*, belum implemented. Bukti: tidak ada folder `src/services/`, semua halaman import JSON langsung |
| Bagian "Feature-Based Architecture" — daftar folder `src/features/` | **UPDATE** | Hanya `site-plan/` yang ada. `projects/`, `properties/`, `contact/` belum ada. Tambahkan catatan status planned vs implemented |
| Prinsip 1–4 (Server Components, Type Safety, Feature Architecture, Data Access Layer) | **KEEP** | Prinsip-prinsip ini masih valid sebagai panduan desain |
| Stack Teknologi (tabel) | **KEEP** | Versi dan alasan masih akurat |
| Batasan MVP | **KEEP** | Masih akurat dan relevan |
| UI Variant V1/V2 dan `uiConfig` | **TAMBAHKAN** | Feature flag sudah implemented (`uiConfig.uiVariant` di `src/config/site.ts`) tapi tidak disebutkan di ARCHITECTURE sama sekali. Ini informasi penting untuk developer baru |

---

### TECH-DECISIONS.md

| Keputusan | Rekomendasi | Alasan & Bukti |
|---|---|---|
| **Turbopack** (bagian "Ditolak") | **UPDATE** | Pindahkan dari "Ditolak" ke "Sudah Diambil" atau tambahkan catatan revisi. `next.config.ts` memiliki blok `turbopack: { rules: { "*.css": ... } }` yang aktif, dan `@tailwindcss/turbopack` ada sebagai devDependency |
| **Implementasi i18n** (bagian "Masih Terbuka") | **UPDATE** | Pindahkan ke "Sudah Diambil". `next-intl` dipilih dan sudah aktif. Pertanyaan yang sebelumnya "perlu diputuskan" sudah terjawab: URL prefix `/id/` dan `/en/`, file terjemahan di `src/i18n/messages/`, slug tidak diterjemahkan |
| Next.js 16 App Router | **KEEP** | Masih akurat |
| TypeScript Strict Mode | **KEEP** | Masih akurat |
| Tailwind CSS v4 | **KEEP** | Masih akurat. Catatan tentang "tidak ada tailwind.config.js" sudah benar |
| Data Statis (JSON) | **KEEP** | Masih akurat, termasuk catatan rencana migrasi ke services layer |
| Google Maps vs Alternatif | **KEEP** | Masih terbuka — belum ada keputusan karena API key belum ada |
| Interactive Site Plan | **KEEP** | Masih terbuka — menunggu denah resmi. Catatan: `InteractiveSitePlan.tsx` sudah ada sebagai stub |
| Backend / Database | **KEEP** | Ditolak, masih berlaku |
| Three.js, Anime.js, Framer Motion | **KEEP** | Ditolak, masih berlaku |

**Catatan penting untuk Turbopack:** Revisi keputusan Turbopack bukan berarti keputusan awal salah — keputusan awal valid pada konteksnya. Yang perlu didokumentasikan adalah *kapan dan mengapa keputusan berubah* (kemungkinan karena kebutuhan Tailwind CSS v4 yang membutuhkan loader Turbopack). Jangan hapus keputusan lama, cukup tambahkan catatan revisi.

---

### PROJECT-STRUCTURE.md

| Bagian | Rekomendasi | Alasan & Bukti |
|---|---|---|
| Bagian "Struktur Folder Saat Ini" | **UPDATE PENUH** | Menggambarkan struktur sebelum Wave 1 — sudah tidak mencerminkan kondisi aktual. Bukti: `list_directory src/` menunjukkan struktur yang sangat berbeda |
| Bagian "Folder yang Akan Dibuat" | **UPDATE** | Sebagian sudah terwujud (dengan perbedaan nama/lokasi), sebagian belum ada. Perlu dipisahkan mana yang sudah ada vs masih planned |
| Konvensi Penamaan (tabel) | **KEEP** | Masih berlaku dan relevan |
| Import Alias (`@/`) | **KEEP** | Masih berlaku dan benar |

**Catatan untuk UPDATE PROJECT-STRUCTURE:** Sebaiknya tidak menyalin seluruh file tree secara verbose. Cukup gambarkan level pertama hingga kedua dari `src/` dengan penjelasan singkat tiap folder. Detail lebih dalam ada di `docs/DEVELOPMENT-GUIDE.md`. Hindari mendokumentasikan file individual yang mungkin berubah.

---

## 3. Konflik Antar Dokumen

| Topik | ARCHITECTURE.md | TECH-DECISIONS.md | PROJECT-STRUCTURE.md | Status Aktual |
|---|---|---|---|---|
| Status i18n | "Dijadwalkan, kandidat next-intl" | "Masih Terbuka — perlu evaluasi" | Disebutkan di bagian "Akan Dibuat" | **Sudah implemented** — `src/i18n/` + `next-intl` aktif |
| Turbopack | Tidak disebutkan | "Ditolak" | Tidak disebutkan | **Digunakan aktif** — `next.config.ts` + `@tailwindcss/turbopack` |
| `src/services/` | Wajib ada, bagian dari alur data | Tidak disebutkan | Disebutkan di bagian "Akan Dibuat" | **Belum ada** — semua halaman import JSON langsung |
| `src/features/` subfolders | `projects/`, `properties/`, `site-plan/`, `contact/` disebut ada | Tidak disebutkan | Disebutkan di bagian "Akan Dibuat" | **Hanya `site-plan/` yang ada** |
| `src/i18n/` lokasi file | Tidak disebutkan detail | Tidak disebutkan | `src/i18n/id.json`, `en.json` (salah lokasi) | **Aktual:** `src/i18n/messages/id.json` dan `en.json` |
| UI Variant / `uiConfig` | Tidak disebutkan | Tidak disebutkan | Tidak disebutkan | **Implemented** — feature flag aktif di `src/config/site.ts` |

Dari tabel di atas, terdapat **dua konflik utama** yang berulang di semua tiga dokumen:
1. Status i18n — semua tiga dokumen belum memperbarui fakta bahwa ini sudah selesai
2. `src/services/` — dua dokumen menggambarkannya seolah sudah ada, padahal belum

---

## 4. Informasi yang Harus Tetap Berstatus Planned/Pending

Berikut item yang secara teknis *belum diimplementasikan* dan harus tetap digambarkan sebagai rencana, bukan fakta:

| Item | Lokasi Relevan | Catatan |
|---|---|---|
| `src/services/` (data access layer) | ARCHITECTURE.md, PROJECT-STRUCTURE.md | Direncanakan tapi belum ada. Tetap dokumentasikan sebagai arsitektur target, bukan kondisi aktual |
| `src/features/contact/WhatsAppButton` | ARCHITECTURE.md | Disebutkan sebagai bagian feature-based architecture, belum diimplementasikan |
| Interactive Site Plan (SVG interaktif) | TECH-DECISIONS.md | Keputusan teknologi masih terbuka, menunggu denah resmi |
| Google Maps integration | TECH-DECISIONS.md | Keputusan masih terbuka, belum ada API key |
| `src/features/projects/`, `src/features/properties/` | PROJECT-STRUCTURE.md | Belum ada, jangan gambarkan seolah sudah ada |
| `pabuaran-units.json` | PROJECT-STRUCTURE.md | Disebutkan di bagian "Akan Dibuat" — belum ada di `src/data/properties/` |

---

## 5. Urutan Revisi yang Disarankan

Revisi sebaiknya dilakukan berurutan untuk menghindari inkonsistensi baru:

**1. TECH-DECISIONS.md** — Prioritas pertama karena paling faktual dan paling mudah diverifikasi. Koreksi dua fakta yang salah (Turbopack, i18n) tanpa mengubah narasi dan nilai historis dokumen. Risiko inkonsistensi rendah.

**2. ARCHITECTURE.md** — Setelah TECH-DECISIONS selesai, update ARCHITECTURE agar konsisten: ubah status i18n, perbaiki alur data (hapus `src/services/` dari diagram aktual, pindahkan ke "planned"), tambahkan catatan tentang `uiConfig`. Gunakan keputusan yang sudah dikonfirmasi di TECH-DECISIONS sebagai referensi.

**3. PROJECT-STRUCTURE.md** — Terakhir karena paling banyak berubah dan paling berisiko memerlukan update ulang. Sebaiknya ditunda hingga services layer (Task 5) diimplementasikan agar tidak perlu update dua kali. Jika dilakukan sekarang, pastikan gambaran struktur hanya mencantumkan yang sudah ada, dan pisahkan dengan jelas mana yang masih planned.

---

## 6. Catatan Tambahan

### Hal yang tidak perlu diubah di ketiga dokumen

- Keputusan teknologi yang ditolak (Backend, Three.js, dll.) — tetap valid secara historis
- Prinsip arsitektur dasar di ARCHITECTURE.md — masih relevan meski sebagian belum diimplementasikan
- Batasan MVP (no login, no payment, no booking) — masih akurat
- Konvensi penamaan dan import alias di PROJECT-STRUCTURE.md — masih berlaku

### Keterkaitan dengan dokumen lain

- `docs/DEVELOPMENT-GUIDE.md` sudah diperbarui di Stage 2B dan mencerminkan kondisi aktual dengan baik (termasuk catatan bahwa `src/services/` belum ada). Ketiga dokumen target sebaiknya konsisten dengan apa yang sudah tertulis di DEVELOPMENT-GUIDE.
- `docs/celestia-existing-implementation-audit.md` adalah referensi paling akurat dan terlengkap. Semua klaim dalam proposal ini dapat diverifikasi silang ke dokumen tersebut.

---

*Dokumen ini adalah proposal read-only. Tidak ada perubahan yang dilakukan pada file proyek manapun.*
*Revisi pada tiga dokumen target hanya boleh dilakukan setelah proposal ini ditinjau dan disetujui.*
