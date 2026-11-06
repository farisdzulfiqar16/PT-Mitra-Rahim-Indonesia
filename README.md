# Celestia — Property Exploration & Marketing Website

Website pemasaran properti untuk PT Mitra Rahim Indonesia. Calon pembeli dapat menjelajahi proyek properti, melihat informasi unit dan kavling, serta menghubungi tim marketing melalui WhatsApp.

> **Project Status:** Prototype aktif — belum di-deploy ke domain publik
> **Repository Visibility:** Private
> **Project Type:** Real-world Internship Project

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev
```

Buka browser di **http://localhost:3000** — akan diarahkan otomatis ke `/id/`.

Untuk pemeriksaan kualitas kode sebelum commit:

```bash
npm run lint          # ESLint
npx tsc --noEmit      # TypeScript check
npm run build         # Production build
```

Lihat [`docs/DEVELOPMENT-GUIDE.md`](docs/DEVELOPMENT-GUIDE.md) untuk panduan lengkap.

---

## Gambaran Proyek

Celestia adalah **Property Exploration & Marketing Website**, bukan platform transaksi atau marketplace properti. Pengunjung dapat:

1. Menemukan proyek properti yang ditawarkan
2. Menjelajahi lokasi dan informasi unit/kavling
3. Melihat detail unit yang tersedia
4. Menghubungi tim marketing melalui WhatsApp

Website **tidak** menangani booking, pembayaran, login pengguna, atau operasi backend apapun.

---

## Status Fitur MVP

| Fitur | Status | Catatan |
|---|---|---|
| Homepage (landing page promosi) | ✅ Implemented | Layout V1 & V2, data masih placeholder |
| Katalog Proyek | ✅ Implemented | Dehir (aktif) + Pabuaran (coming soon) |
| Halaman Eksplorasi Proyek | ✅ Implemented | Dengan daftar unit, sidebar, peta placeholder |
| Katalog Unit | ✅ Implemented | 9 unit Dehir, semua status `unknown` saat ini |
| Detail Unit | ✅ Implemented | Data minimal, foto masih placeholder |
| Site Plan Interaktif | ⏳ Pending | Menunggu denah resmi dari perusahaan |
| Formulir Minat | ❌ Not Implemented | Halaman `/interest` belum dibuat |
| WhatsApp Integration | ⚠️ Partially Working | Logika tersedia; CTA dinonaktifkan karena nomor WA belum dikonfirmasi |
| Bilingual (ID/EN) | ✅ Implemented | Routing `/id/` dan `/en/` aktif via `next-intl` |
| Halaman 404 & Error Boundary | ✅ Implemented | Bilingual |
| SEO Metadata & Sitemap | ✅ Implemented | Noindex/nofollow aktif selama prototype |

### Hal yang masih menunggu konfirmasi perusahaan

- Nomor WhatsApp marketing (saat ini placeholder — CTA dinonaktifkan otomatis)
- Status, luas, dimensi, dan harga setiap kavling
- Foto proyek dan unit
- Denah/site plan resmi Dehir
- Domain produksi (SEO canonical/hreflang belum aktif)
- Logo Celestia resmi

---

## Technology Stack

| Teknologi | Versi | Keterangan |
|---|---|---|
| Next.js | 16.4.4 | App Router, Turbopack (build & dev) |
| React | 19.3.0 | Server Components sebagai default |
| TypeScript | ~5.x | Strict mode aktif |
| Tailwind CSS | ~4.x | Konfigurasi via `@theme inline` di `globals.css` |
| next-intl | ~4.x | Routing bilingual dan terjemahan |

Tidak ada database, backend, atau state management library. Data properti disimpan sebagai file JSON statis di `src/data/`.

---

## Struktur Proyek (ringkas)

```
src/
├── app/[locale]/           ← Routing bilingual (id/en)
│   ├── page.tsx            ← Homepage
│   ├── projects/           ← Katalog proyek & eksplorasi
│   │   └── [slug]/units/   ← Katalog & detail unit
│   ├── error.tsx           ← Error boundary
│   └── not-found.tsx       ← Halaman 404
├── components/
│   ├── ui/                 ← Komponen dasar (Badge, Button, Card, dll.)
│   ├── layout/             ← Navbar, Footer
│   ├── homepage/           ← HomepageV2
│   └── projects/           ← V2 layout components
├── features/site-plan/     ← SitePlanPanel (placeholder aktif)
├── config/site.ts          ← siteConfig, seoConfig, uiConfig
├── data/                   ← File JSON data proyek dan unit
├── i18n/messages/          ← Terjemahan ID & EN
└── types/                  ← TypeScript interfaces
```

---

## UI Variant (Feature Flag)

Tampilan website dikontrol oleh `uiConfig.uiVariant` di `src/config/site.ts`:

```typescript
// src/config/site.ts
export const uiConfig = {
  uiVariant: "v2" as "v1" | "v2",
};
```

- **`"v2"`** (default aktif) — Layout baru mengikuti mockup referensi
- **`"v1"`** — Layout awal sebagai fallback

Untuk rollback ke V1: ubah `uiVariant: "v1"`. Tidak perlu mengubah file lain.

---

## Prototype & Indexing

Website dalam mode prototype. Indexing search engine **dinonaktifkan secara eksplisit**:

- `robots.txt` → `Allow: /` (crawler dapat membaca halaman)
- Setiap halaman → `<meta name="robots" content="noindex, nofollow">`
- Sitemap → kosong (tidak ada URL publik)

Untuk mengaktifkan indexing setelah domain dan konten dikonfirmasi perusahaan, ubah `seoConfig` di `src/config/site.ts`. **Jangan aktifkan hanya karena build berhasil atau `NODE_ENV === "production"`.**

---

## Out of Scope (MVP)

- Online booking atau reservasi unit
- Pembayaran online
- Login atau akun pengguna
- Dashboard admin
- CRM atau manajemen lead
- Backend, database, atau API eksternal
- Update data unit secara real-time

---

## Project Notes

Repository ini dikelola sebagai bagian dari proyek internship nyata. Informasi proyek, aset visual, dan data properti akan diperbarui setelah dikonfirmasi perusahaan.

Materi proyek dan informasi perusahaan harus ditangani sesuai ketentuan kerahasiaan organisasi.

---

**Celestia Development**  
Property Exploration & Marketing Website — PT Mitra Rahim Indonesia
