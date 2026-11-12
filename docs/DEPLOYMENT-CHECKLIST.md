# Celestia V1 — Deployment, Staging, Backup & Rollback Checklist
**Target Hosting:** Rumahweb (Apache Shared Hosting / cPanel)  
**Output Architecture:** Next.js Static Export (`output: "export"`)  
**Locale Strategy:** next-intl prefix routing (`/id` default, `/en`)  
**Security Status:** Pre-Launch Mode (`indexingEnabled: false`, noindex/nofollow)

---

## 1. Pre-Deployment Verification (Local Environment)

Semua langkah ini WAJIB berstatus **PASS** di lingkungan lokal sebelum file diunggah ke server:

- [ ] **1.1 Branch Check:** Pastikan berada pada branch rilis yang disetujui (misal: `fix/consultation-flow-p0` atau `main`).
  ```bash
  git branch --show-current
  ```
- [ ] **1.2 Clean Working Tree:** Pastikan tidak ada file sementara, secret, atau perubahan uncommitted yang tidak sengaja.
  ```bash
  git status --short
  ```
- [ ] **1.3 TypeScript Compilation:** Wajib 0 error.
  ```bash
  npx tsc --noEmit
  ```
- [ ] **1.4 ESLint:** Wajib 0 error dan 0 warning kritis.
  ```bash
  npm run lint
  ```
- [ ] **1.5 Static Export Build:** Menghasilkan 39 halaman statis tanpa kegagalan.
  ```bash
  npm run build
  ```
- [ ] **1.6 Output Integrity:**
  - [ ] Direktori `/out/` terbentuk dengan subdirektori `/out/id/`, `/out/en/`, `/out/images/`, `/out/_next/`.
  - [ ] File `/out/index.html` tersedia (root meta-refresh ke `/id`).
  - [ ] File `/out/404.html` tersedia (custom 404 standalone).
  - [ ] File `/out/.htaccess` tersedia (dari `public/.htaccess`).
  - [ ] TIDAK ADA file `.env*` atau `src/data/internal/` di dalam `/out/`.
- [ ] **1.7 WhatsApp Configuration:**
  - [ ] Nomor WhatsApp terverifikasi: `6282299237825` di `src/config/site.ts`.
  - [ ] `isWhatsAppNumberPlaceholder()` mengembalikan `false`.
- [ ] **1.8 SEO Safety Guard:**
  - [ ] `seoConfig.indexingEnabled` bernilai `false` (mencegah indexing sebelum launching resmi).
  - [ ] `seoConfig.siteUrl` bernilai `""` (canonical tidak terbit).

---

## 2. Backup & Archive Procedure (Sebelum Upload)

Sebelum mengunggah versi baru ke DocumentRoot hosting Rumahweb (`public_html`):

- [ ] **2.1 Backup Existing DocumentRoot:**
  - Masuk ke cPanel Rumahweb > File Manager.
  - Kompres seluruh isi `public_html` saat ini menjadi arsip zip: `backup_public_html_YYYYMMDD_HHMM.zip`.
  - Unduh file zip backup tersebut ke penyimpanan lokal yang aman.
- [ ] **2.2 Backup Database & DNS (jika ada):**
  - Pastikan backup snapshot cPanel lengkap tersimpan.
  - Catat seluruh DNS records yang aktif.

---

## 3. Staging / Pre-Production Review

Sebelum domain utama diarahkan ke publik:

- [ ] **3.1 Upload ke Subdomain Staging (Sangat Disarankan):**
  - Buat subdomain uji di cPanel (misal: `staging.celestia.id` atau `preview.mitrarahim.com`).
  - Unggah seluruh isi folder `/out/` (bukan folder `out`-nya, melainkan isinya) ke DocumentRoot staging.
  - Pastikan file `.htaccess` terunggah (aktifkan "Show Hidden Files" di cPanel File Manager).
- [ ] **3.2 Permission Check:**
  - Direktori: `755`
  - File biasa & `.html`: `644`
  - File `.htaccess`: `644`
- [ ] **3.3 Module Server Check:**
  - Konfirmasi ke support Rumahweb atau cPanel bahwa modul Apache `mod_rewrite` dan `mod_headers` aktif.

---

## 4. Production Deployment Steps

Lakukan langkah ini hanya setelah staging disetujui:

- [ ] **4.1 Bersihkan DocumentRoot Target:**
  - Hapus file build lama di `public_html` (KECUALI file backup zip).
- [ ] **4.2 Upload File Build:**
  - Unggah file zip dari isi direktori `/out/` lokal ke `public_html`.
  - Ekstrak file zip langsung di dalam `public_html`.
  - Hapus file zip setelah ekstraksi berhasil.
- [ ] **4.3 Verifikasi Keberadaan File Kunci:**
  - [ ] `public_html/.htaccess`
  - [ ] `public_html/index.html`
  - [ ] `public_html/id.html`
  - [ ] `public_html/en.html`
  - [ ] `public_html/404.html`
  - [ ] `public_html/robots.txt`
  - [ ] `public_html/sitemap.xml`
  - [ ] `public_html/images/projects/dehir/` (7 foto kurasi)

---

## 5. Post-Deployment Smoke Test (Verifikasi Fungsional)

Buka browser dan uji URL berikut secara langsung:

| No | Target URL / Aksi | Hasil yang Diharapkan | Status |
|---|---|---|---|
| 1 | `https://[domain]/` | Redirect 302 otomatis ke `https://[domain]/id` | [ ] |
| 2 | `https://[domain]/id` | Beranda Bahasa Indonesia tampil sempurna | [ ] |
| 3 | `https://[domain]/en` | Beranda Bahasa Inggris tampil sempurna | [ ] |
| 4 | `https://[domain]/id/projects` | Katalog proyek tampil (Dehir aktif, Pabuaran Coming Soon) | [ ] |
| 5 | `https://[domain]/id/projects/dehir` | Halaman eksplorasi Dehir: 7 foto galeri tampil, Google Maps embed berfungsi | [ ] |
| 6 | `https://[domain]/id/projects/pabuaran` | Teaser Coming Soon Pabuaran: tidak ada harga fiktif, WhatsApp info terbaru tersedia | [ ] |
| 7 | `https://[domain]/id/interest` | Formulir Minat terbuka: Dehir terpilih, Pabuaran disabled, validasi nama wajib | [ ] |
| 8 | Submit Formulir Minat | Membuka `wa.me/6282299237825` dengan pesan terformat rapi di tab baru | [ ] |
| 9 | `https://[domain]/id/contact` | Halaman Kontak: jam kerja resmi, informasi pertemuan, alamat Dehir terformat | [ ] |
| 10 | `https://[domain]/halaman-acak-404` | Menampilkan custom 404 page bertuliskan "Halaman tidak ditemukan" | [ ] |
| 11 | Language Switcher | Berpindah bahasa `/id` <-> `/en` dengan mempertahankan path halaman aktif | [ ] |
| 12 | Inspector / Network | Header caching: aset statis `max-age=31536000`, HTML `no-cache`, security headers ada | [ ] |

---

## 6. Rollback Checklist (Prosedur Darurat)

Jika terjadi masalah fatal saat rilis (misal: halaman tidak bisa diakses, redirect loop, error 500):

- [ ] **6.1 Eksekusi Rollback Cepat:**
  - Masuk ke cPanel Rumahweb > File Manager.
  - Hapus seluruh isi `public_html`.
  - Ekstrak file backup `backup_public_html_YYYYMMDD_HHMM.zip` yang dibuat pada Langkah 2.
- [ ] **6.2 Verifikasi Rollback:**
  - Buka website dan pastikan versi sebelumnya telah kembali online.
- [ ] **6.3 Analisis Masalah:**
  - Periksa file `error_log` di `public_html` untuk melihat penyebab kegagalan Apache (misal: sintaks `.htaccess` yang tidak didukung).
  - Lakukan perbaikan di lingkungan lokal terlebih dahulu sebelum mencoba deployment ulang.

---

## 7. Post-Launch SEO Activation (HANYA Setelah Domain Disetujui Owner)

Saat Owner telah menetapkan domain final (misal: `https://celestia.id`) dan menyetujui publikasi ke mesin pencari:

- [ ] **7.1 Update Konfigurasi di `src/config/site.ts`:**
  ```typescript
  export const seoConfig = {
    indexingEnabled: true,
    siteUrl: "https://celestia.id", // Ganti dengan domain resmi terkonfirmasi
  } as const;
  ```
- [ ] **7.2 Build Ulang:**
  ```bash
  npm run build
  ```
- [ ] **7.3 Upload Ulang ke Hosting:**
  - Unggah hasil `/out/` yang baru ke `public_html`.
- [ ] **7.4 Verifikasi SEO Publik:**
  - Buka `https://[domain]/robots.txt` → harus menampilkan `Allow: /` dan tautan Sitemap.
  - Buka `https://[domain]/sitemap.xml` → sitemap terisi seluruh 39 URL dengan prefix domain resmi.
  - Periksa source code halaman utama → meta tag robots berubah menjadi indexable, dan link canonical/hreflang aktif.
