# Project Timeline & Gantt Chart — Celestia MVP

**Dokumen untuk:** Konsultasi PT Mitra Rahim Indonesia  
**Dibuat:** November 2026  
**Status:** Estimasi awal — dapat berubah berdasarkan hasil konsultasi

---

## Catatan Penting

- **Durasi pengerjaan teknis** = waktu aktual developer mengerjakan kode
- **Waktu tunggu** = menunggu persetujuan, data, atau aset dari perusahaan
- Estimasi durasi dihitung berdasarkan kondisi ideal (tanpa blocker)
- Tanggal aktual bergantung pada kapan data/aset dari perusahaan tersedia
- **Jangan interpretasikan dokumen ini sebagai komitmen tanggal selesai**

---

## Status Saat Ini (Per 5 November 2026)

| Komponen | Status |
|---|---|
| Foundation (i18n, types, config, error handling) | ✅ Selesai |
| Design tokens dan komponen UI dasar | ✅ Selesai |
| Data JSON Dehir dan Pabuaran | ✅ Selesai (data minimal, menunggu konfirmasi) |
| Homepage | ✅ Prototype selesai |
| Katalog Proyek | ✅ Prototype selesai |
| Halaman Eksplorasi Dehir | ✅ Prototype selesai |
| Katalog Unit | ✅ Prototype selesai |
| Detail Unit | ✅ Prototype selesai |
| Navbar + Footer bilingual | ✅ Selesai |
| 404 dan Error Handling | ✅ Selesai |
| Service layer (Task 5) | ⏳ Belum dikerjakan |
| WhatsApp CTA (aktif) | 🔒 Menunggu nomor dari perusahaan |
| Site Plan Interaktif | 🔒 Menunggu denah resmi dari perusahaan |
| Formulir Minat | ⏳ Belum dikerjakan |
| SEO dan Sitemap | ⏳ Belum dikerjakan |
| Foto dan aset visual | 🔒 Menunggu dari perusahaan |
| Data unit terkonfirmasi (harga, luas, status) | 🔒 Menunggu dari perusahaan |

---

## Tahapan Pekerjaan

### Tahap 0 — Selesai ✅ (Wave 1–4)
**Durasi:** ~3–4 hari kerja teknis  
**Hasil:** Prototype dapat dijalankan dan didemonstrasikan

- Foundation: routing bilingual, type definitions, design tokens
- Komponen UI dasar (Button, Card, Badge, Input, Placeholder)
- Halaman utama: Homepage, Katalog, Eksplorasi, Katalog Unit, Detail Unit
- Navbar, Footer, Error Handling

---

### Tahap 1 — Data Konfirmasi Perusahaan 🔒
**Durasi teknis:** ~1–2 hari (setelah data diterima)  
**Ketergantungan:** Data dari PT Mitra Rahim Indonesia

| Pekerjaan | Menunggu apa | Estimasi teknis setelah data ada |
|---|---|---|
| Update status kavling | Status per kavling (P-08) | 2–4 jam |
| Tambah luas dan dimensi unit | Data luas (P-07) | 2–4 jam |
| Tambah koordinat peta | Koordinat GPS (P-05 area) | 1–2 jam |
| Update harga (atau sembunyikan) | Keputusan bisnis (P-07) | 2 jam |
| Konfirmasi format kode unit | Keputusan format (P-20) | 1–2 jam |
| Input nomor WhatsApp | Nomor dari brosur (P-01) | 30 menit |

**Total estimasi teknis Tahap 1:** ½ – 1 hari kerja

---

### Tahap 2 — Fitur Lanjutan ⏳
**Durasi teknis:** ~4–6 hari kerja  
**Ketergantungan:** Sebagian menunggu data dari perusahaan

| Fitur | Estimasi Teknis | Ketergantungan |
|---|---|---|
| Service layer (abstraksi data) | 1 hari | Tidak ada |
| Formulir Minat lengkap | 1–2 hari | Tidak ada |
| Site Plan Interaktif | 2–3 hari | 🔒 Denah resmi + posisi unit (P-06) |
| WhatsApp CTA aktif | 30 menit | 🔒 Nomor WhatsApp (P-01) |

---

### Tahap 3 — Integrasi Aset Visual 🔒
**Durasi teknis:** 1–2 hari  
**Ketergantungan:** Aset dari perusahaan

| Pekerjaan | Menunggu apa | Estimasi teknis |
|---|---|---|
| Upload dan integrasi foto proyek | Foto Dehir (P-04) | 2–4 jam |
| Upload foto unit | Foto unit (P-05) | 2–4 jam |
| Integrasi video/GIF promo | Video (P-18) | 2 jam |
| Logo Celestia | Logo dari perusahaan | 1 jam |

---

### Tahap 4 — SEO, Sitemap, dan Polish ⏳
**Durasi teknis:** 2–3 hari  
**Ketergantungan:** Domain produksi dan metadata dari perusahaan

| Pekerjaan | Estimasi Teknis | Ketergantungan |
|---|---|---|
| Metadata dan OG tags per halaman | 1 hari | ❓ Domain (P-03) |
| Sitemap XML bilingual | 4 jam | — |
| Optimasi gambar (Next Image) | 4 jam | Aset tersedia |
| Responsive dan aksesibilitas final | 4 jam | — |
| Cross-browser testing | 4 jam | — |

---

### Tahap 5 — Deploy dan Launch 🔒
**Durasi teknis:** ½ – 1 hari  
**Ketergantungan:** Domain, hosting, dan persetujuan akhir

| Pekerjaan | Estimasi Teknis | Ketergantungan |
|---|---|---|
| Setup hosting (Vercel/Netlify) | 2–4 jam | ❓ Pilihan platform (P, 7.1) |
| Konfigurasi domain | 2–4 jam | 🔒 Domain tersedia |
| Environment variables produksi | 1 jam | — |
| Final review dan go-live | 2–4 jam | 🔒 Persetujuan final |

---

## Ringkasan Estimasi Teknis Total

| Tahap | Estimasi Teknis | Status |
|---|---|---|
| Tahap 0 (selesai) | ~3–4 hari | ✅ |
| Tahap 1 (data konfirmasi) | ½–1 hari | Menunggu data |
| Tahap 2 (fitur lanjutan) | 4–6 hari | Bisa dimulai |
| Tahap 3 (aset visual) | 1–2 hari | Menunggu aset |
| Tahap 4 (SEO & polish) | 2–3 hari | Bisa dimulai Tahap 4a |
| Tahap 5 (deploy) | ½–1 hari | Menunggu domain |
| **Total teknis tersisa** | **~8–13 hari kerja** | — |

> **Catatan:** "Hari kerja teknis" ≠ hari kalender. Waktu total aktual bergantung pada kecepatan perusahaan menyediakan data dan aset.

---

## Diagram Alur (Gantt Sederhana)

```
                       NOV 2026         DES 2026         JAN 2027
                   ─────────────    ─────────────    ─────────────
Prototype (W1-4)   ████ SELESAI
Konsultasi (W5)         ↑ HARI INI
                        │
Tahap 1 (data)          └──── [TUNGGU PERUSAHAAN] ────
Tahap 2 (fitur)                    ████ 4-6 hari ████
Tahap 3 (aset)                          [TUNGGU ASET] ──
Tahap 4 (SEO)                                  ████ 2-3 hari
Tahap 5 (deploy)                                        ███ 1 hari
                                                            ↑ LAUNCH
```

---

## Risiko Utama

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Denah resmi tidak tersedia | Site Plan Interaktif tidak bisa diaktifkan | Tampilkan placeholder; fitur bisa ditambahkan post-launch |
| Data unit tidak lengkap | Halaman unit tampil minim informasi | Tampilkan "Hubungi Marketing" sebagai fallback |
| Domain belum tersedia saat launch | Deploy tertunda | Bisa deploy ke subdomain sementara untuk demo |
| Perubahan scope besar setelah prototype | Estimasi berubah signifikan | Dokumentasikan scope change dan re-estimate |
| Perubahan format kode kavling | Perlu update data dan URL | Konfirmasi P-20 sesegera mungkin |
