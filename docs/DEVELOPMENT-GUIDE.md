# Panduan Pengembangan Celestia

## Prasyarat

- Node.js ≥ 18
- npm ≥ 10
- Git

---

## Instalasi dan Menjalankan Project

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka browser di **http://localhost:3000** — akan diarahkan otomatis ke `/id/` oleh middleware i18n.

---

## Perintah yang Tersedia

```bash
npm run dev       # Development server dengan hot reload (Turbopack)
npm run build     # Production build
npm run start     # Jalankan production build secara lokal
npm run lint      # Periksa kode dengan ESLint
```

---

## Environment Variables

Salin `.env.local.example` menjadi `.env.local` dan isi nilainya:

```bash
cp .env.local.example .env.local
```

| Variable | Keterangan | Status |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Nomor WA marketing (format: `628XXXXXXXXXX`) | ⚠️ Tidak dibaca oleh kode — nomor WA di-hardcode di `src/config/site.ts`. Variable ini ada di template tetapi belum terhubung. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | API key Google Maps (opsional) | ❌ Belum digunakan |

> **Catatan penting:** Saat ini nomor WhatsApp dibaca dari `siteConfig.contact.whatsappNumber` di `src/config/site.ts`, **bukan** dari environment variable. Jika nomor nyata sudah diterima dari perusahaan, update nilai tersebut di `site.ts`. Sinkronisasi ke env variable adalah pekerjaan yang belum dilakukan.

Jangan commit `.env.local` — sudah ada di `.gitignore`.

---

## Pemeriksaan Kualitas Kode

Jalankan ketiga perintah berikut sebelum setiap commit:

```bash
# 1. TypeScript — pastikan tidak ada error type
npx tsc --noEmit

# 2. ESLint — periksa masalah kode
npm run lint

# 3. Production build — pastikan bisa di-build
npm run build
```

Jangan menonaktifkan atau mem-bypass ESLint dan TypeScript. Error yang muncul adalah pertanda masalah nyata.

---

## Struktur Folder Aktual

```
src/
├── app/
│   ├── globals.css               ← CSS global + Tailwind v4 @theme inline
│   ├── favicon.ico               ← Default Next.js (belum diganti)
│   ├── not-found.tsx             ← Root-level 404
│   ├── robots.ts                 ← robots.txt (noindex selama prototype)
│   ├── sitemap.ts                ← Sitemap (kosong selama domain belum dikonfirmasi)
│   └── [locale]/
│       ├── layout.tsx            ← Root layout + Navbar + Footer
│       ├── page.tsx              ← Homepage (V1 & V2)
│       ├── not-found.tsx         ← Locale-level 404 (bilingual)
│       ├── error.tsx             ← Error boundary ("use client")
│       └── projects/
│           ├── page.tsx          ← Katalog Proyek (V1 & V2)
│           └── [slug]/
│               ├── page.tsx      ← Eksplorasi Proyek (V1 & V2)
│               └── units/
│                   ├── page.tsx  ← Katalog Unit (V1 & V2)
│                   └── [unitCode]/
│                       └── page.tsx ← Detail Unit (V1 & V2)
├── components/
│   ├── ui/                       ← Badge, Button, Card, Input, Select, Placeholder
│   ├── layout/                   ← Navbar.tsx, Footer.tsx
│   ├── homepage/                 ← HomepageV2.tsx
│   └── projects/                 ← ExplorationV2, ProjectCatalogV2, UnitCatalogV2, UnitDetailV2
├── features/
│   └── site-plan/                ← SitePlanPanel.tsx, InteractiveSitePlan.tsx (stub)
├── config/
│   └── site.ts                   ← siteConfig, seoConfig, uiConfig + helper functions
├── data/
│   ├── projects/dehir.json       ← Data proyek Dehir
│   ├── projects/pabuaran.json    ← Data proyek Pabuaran
│   └── properties/dehir-units.json ← 9 unit kavling (semua status unknown)
├── i18n/
│   ├── config.ts
│   ├── request.ts
│   └── messages/
│       ├── id.json               ← Terjemahan Bahasa Indonesia
│       └── en.json               ← Terjemahan English
├── lib/utils.ts                  ← cn(), formatRupiah(), formatArea()
├── types/                        ← TypeScript interfaces (Project, PropertyUnit, dll.)
└── proxy.ts                      ← next-intl middleware (i18n routing)
```

---

## Cara Mengakses Data Properti

### Status aktual

> ⚠️ **Perhatian:** `src/services/` belum diimplementasikan. Saat ini semua halaman mengimpor file JSON secara langsung.

Contoh pola yang **saat ini digunakan** di kode:

```typescript
// Pola aktual yang digunakan di seluruh halaman
import dehirData from "@/data/projects/dehir.json";
import pabuaranData from "@/data/projects/pabuaran.json";
import dehirUnitsData from "@/data/properties/dehir-units.json";
```

### Rencana ke depan

Services layer (`src/services/`) direncanakan sebagai abstraksi antara halaman dan data. Setelah diimplementasikan, pola yang diinginkan adalah:

```typescript
// Pola yang diinginkan setelah src/services/ tersedia
import { getProjectBySlug } from "@/services/projects";
import { getUnitsByProject } from "@/services/properties";

const project = await getProjectBySlug("dehir");
const units = await getUnitsByProject("dehir");
```

Services layer memudahkan penggantian sumber data dari JSON ke API di masa depan tanpa mengubah komponen UI. Implementasinya adalah pekerjaan yang masih pending (Task 5).

### Cara mengubah data

Data properti disimpan sebagai file JSON di `src/data/`. Untuk memperbarui data:

1. Edit file JSON yang sesuai secara langsung
2. Jalankan `npm run build` untuk memastikan tidak ada error TypeScript
3. Commit perubahan

Tidak ada mekanisme sync otomatis — perubahan data dilakukan manual.

---

## Bilingual (i18n)

Website mendukung dua locale: **Bahasa Indonesia** (`id`, default) dan **English** (`en`).

- URL pattern: `/id/...` dan `/en/...`
- URL tanpa prefix (`/projects/dehir`) → redirect otomatis ke `/id/projects/dehir`
- Locale tidak dikenal → redirect ke path setara dengan prefix `/id/`

Terjemahan disimpan di:
- `src/i18n/messages/id.json` — Bahasa Indonesia
- `src/i18n/messages/en.json` — English

Untuk menambah key terjemahan baru, tambahkan ke **kedua** file dengan makna yang setara.

---

## UI Variant (Feature Flag)

Tampilan dikontrol oleh `uiConfig.uiVariant` di `src/config/site.ts`:

```typescript
export const uiConfig = {
  uiVariant: "v2" as "v1" | "v2",
};
```

| Nilai | Tampilan |
|---|---|
| `"v2"` (default) | Layout baru mengikuti mockup referensi |
| `"v1"` | Layout awal sebagai fallback |

Ganti nilai `uiVariant` dan simpan — hot reload langsung menampilkan perubahan.

---

## Server Components vs Client Components

Semua komponen adalah Server Components secara default. Tambahkan `"use client"` hanya jika komponen:

- Menggunakan `useState` atau `useEffect`
- Memiliki event handler (`onClick`, `onChange`)
- Menggunakan API browser (`window`, `document`, `localStorage`)

```typescript
// Server Component (default) — tidak ada "use client"
export default async function ProjectPage() {
  // fetch data langsung di server
  return <div>...</div>;
}
```

```typescript
"use client"; // ← hanya jika benar-benar dibutuhkan

import { useState } from "react";

export function FilterButton() {
  const [active, setActive] = useState(false);
  return <button onClick={() => setActive(!active)}>Filter</button>;
}
```

---

## Menambah Halaman Baru

Semua halaman harus ditempatkan di dalam `src/app/[locale]/` agar mendukung routing bilingual:

```
src/app/[locale]/nama-halaman/page.tsx
```

Halaman ini akan tersedia di `/id/nama-halaman` dan `/en/nama-halaman`.

Contoh minimal:

```typescript
// src/app/[locale]/tentang/page.tsx
import { setRequestLocale } from "next-intl/server";

export default async function TentangPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <h1>Tentang Celestia</h1>
    </main>
  );
}
```

---

## Penanganan Error

### Halaman Error Custom

- `src/app/[locale]/error.tsx` — error boundary untuk semua halaman di bawah locale
- `src/app/not-found.tsx` — root-level 404

Error boundary **wajib menggunakan** `"use client"` karena Next.js membutuhkan Client Component untuk menangkap error dan menyediakan fungsi `reset()`.

### Jangan Sembunyikan Error

```typescript
// ❌ Jangan sembunyikan error
try {
  const data = await fetchData();
} catch (e) {
  // diabaikan
}

// ✅ Log atau re-throw agar error boundary dapat menangkap
try {
  const data = await fetchData();
} catch (error) {
  console.error("Gagal memuat data:", error);
  throw error;
}
```

---

## Prototype & Indexing

Website dalam mode prototype. **Jangan aktifkan indexing** sebelum domain dan konten dikonfirmasi perusahaan.

Konfigurasi ada di `src/config/site.ts`:

```typescript
export const seoConfig = {
  indexingEnabled: false,   // false = noindex/nofollow di semua halaman
  siteUrl: "",              // kosong = canonical & hreflang tidak diterbitkan
};
```

Untuk aktivasi production:
1. Konfirmasi domain resmi ke perusahaan
2. Set `siteUrl` ke domain resmi
3. Set `indexingEnabled: true`

**Jangan aktifkan berdasarkan `NODE_ENV === "production"` saja** — deployment production belum tentu berarti perusahaan sudah menyetujui publikasi.

---

## Tips untuk Developer Baru

1. **Baca `src/config/site.ts`** — konfigurasi utama: nomor WA, SEO, UI variant
2. **Mulai dari `src/app/[locale]/`** — di situ routing dimulai
3. **Baca `src/types/`** — pahami struktur data sebelum menulis kode
4. **Gunakan `@/` untuk import** — bukan path relatif panjang
5. **Jangan ubah `tsconfig.json`** — sudah dikonfigurasi dengan benar
6. **Jalankan `npx tsc --noEmit` sebelum commit** — cegah error TypeScript masuk ke repo
7. **Lihat `docs/celestia-existing-implementation-audit.md`** — laporan kondisi aktual proyek secara lengkap
