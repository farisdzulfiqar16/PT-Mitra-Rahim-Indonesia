# Design Document — Celestia MVP

## Overview

Dokumen ini menerjemahkan Requirements Document Celestia MVP menjadi rancangan UI/UX yang dapat dievaluasi sebelum implementasi. Mencakup design foundation (color palette, typography, spacing, komponen dasar), UX architecture (sitemap, user flow, layout per halaman), dan daftar deliverables mockup.

**Status proyek:**
- Dehir (Celestia Jatiluhur) — proyek aktif, eksplorasi penuh
- Pabuaran (Celestia Jatiranggon) — Coming Soon, hanya teaser

**Arah visual:** Modern Residential + Property Explorer — sage green, rounded cards, clean, mobile-first.

---

## Architecture

### Arsitektur Aplikasi

Website Celestia menggunakan Next.js 16 App Router dengan Server Components sebagai default. Arsitektur feature-based: kode diorganisir berdasarkan fitur bisnis (`projects`, `properties`, `site-plan`, `contact`), bukan jenis file. Data access layer via `src/services/` memisahkan komponen UI dari sumber data JSON statis.

```
File JSON / Data Statis
        ↓
  src/services/        (data access layer)
        ↓
  src/features/        (business logic & UI)
        ↓
  src/app/[locale]/     (routing & pages)
        ↓
  Browser (Server Components dirender di server)
```

### Routing

```
/[locale]/
├── /                        ← Homepage
├── /projects                ← Katalog Proyek
├── /projects/[slug]          ← Halaman Eksplorasi
│   └── /units                ← Katalog Unit
│       └── /[unitCode]      ← Detail Unit
├── /interest                ← Formulir Minat Dehir
├── /contact                 ← Halaman kontak
└── /404                     ← Halaman tidak ditemukan
```

Locale prefix wajib: `/id/...` (default) dan `/en/...`. Library i18n direkomendasikan: `next-intl`.

### Keputusan Teknis

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Library i18n | `next-intl` | Integrasi App Router, locale routing |
| Google Maps | iframe embed | Tidak butuh API key berbayar untuk MVP |
| Site Plan interaktif | SVG dengan event handler | Ringan, tidak perlu library tambahan |
| Dark mode | Tidak untuk MVP | Fokus light mode untuk konsistensi |
| Animasi | Tailwind CSS transitions | Cukup untuk highlight, hover, transisi sederhana |

---

## 1. Project Inspection

### 1.1 Kondisi Project Saat Ini

**Stack teknologi yang sudah terpasang:**
- Next.js 16.4.4 (App Router, Server Components sebagai default)
- React 19.3.0
- TypeScript 5.x strict mode (`tsconfig.json` — `strict: true`)
- Tailwind CSS v4 (konfigurasi via CSS `@theme inline` di `globals.css`, tidak ada `tailwind.config.js`)
- ESLint 9
- npm

**Kode yang sudah ada:**
- `src/types/project.ts` — `Project`, `ProjectId`, `ProjectLocation`
- `src/types/property.ts` — `PropertyUnit`, `UnitStatus` (catatan: `"reserved"` perlu diselaraskan ke `"process"`)
- `src/types/index.ts` — barrel export
- `src/config/site.ts` — `siteConfig` dengan `name`, `company`, `tagline`, `url`, `defaultLocale`, `supportedLocales`, `contact.whatsappNumber`, `whatsappMessageId/En`, `buildWhatsAppUrl()`
- `src/lib/utils.ts` — `cn()`, `formatRupiah()`, `formatArea()`
- `src/app/layout.tsx`, `src/app/page.tsx` — placeholder dari create-next-app
- `src/app/globals.css` — import Tailwind, CSS variables dasar, `prefers-color-scheme: dark`

**Yang belum ada (perlu dibuat saat implementasi):**
- Folder `src/app/[locale]/` — routing bilingual
- Folder `src/components/` — UI components, layout components
- Folder `src/features/` — feature-based modules
- Folder `src/services/` — data access layer
- Folder `src/data/` — JSON data files
- Folder `src/i18n/` — translation files

### 1.2 Batasan Teknis yang Mempengaruhi Desain

| Batasan | Dampak pada Desain |
|---|---|
| Tailwind CSS v4 (CSS-based config) | Color palette dan spacing didefinisikan via `@theme inline` di `globals.css`, bukan `tailwind.config.js` |
| Server Components sebagai default | Komponen interaktif (formulir, site plan, language switcher) perlu `"use client"` |
| Tidak ada backend | Formulir minat 100% client-side; data dari JSON statis |
| TypeScript strict | Semua komponen harus typed; tidak boleh `any` tanpa alasan |
| Mobile-first (320px minimum) | Layout dimulai dari mobile, diperluas ke desktop |
| `prefers-reduced-motion: reduce` | Animasi harus dihormati dan dinonaktifkan jika diminta |
| WCAG 2.1 Level AA | Kontras warna, keyboard navigation, alt text, semantic HTML |
| Zod terpasang tapi opsional | Bisa digunakan untuk validasi data JSON, bukan keharusan |

### 1.3 Keputusan Teknis untuk Design Phase

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Library i18n | `next-intl` | Integrasi terbaik dengan App Router, dukungan locale routing, komunitas kuat |
| Google Maps | iframe embed (evaluasi pertama) | Tidak butuh API key berbayar untuk MVP; embed sederhana cukup untuk menampilkan lokasi |
| Site Plan interaktif | SVG dengan event handler (jika aset tersedia) | Ringan, tidak perlu library tambahan, kompatibel dengan Server→Client component pattern |
| Dark mode | Tidak untuk MVP | `globals.css` punya `prefers-color-scheme: dark` bawaan Next.js, tapi MVP fokus light mode untuk konsistensi visual |
| `UnitStatus` type | `"reserved"` → `"process"` | Sesuaikan dengan BR-08; lakukan saat implementasi |
| Animasi | Tailwind CSS transitions (bukan library eksternal) | Cukup untuk highlight, hover, transisi sederhana |

---

## 2. Design Foundation

### 2.1 Color Palette

Skema warna berbasis sage green untuk arah modern residential. Semua nilai telah diperiksa untuk kontras WCAG 2.1 Level AA terhadap background putih (`#FFFFFF`).

#### Primary (Sage Green)

| Token | Hex | Penggunaan | Kontras vs Putih |
|---|---|---|---|
| `--color-primary-50` | `#F0F7F4` | Background halus, hover state | — |
| `--color-primary-100` | `#DCEBE4` | Background cards, badge tersedia | — |
| `--color-primary-300` | `#A3C9B5` | Border, accent ringan | — |
| `--color-primary-500` | `#6B9E84` | Primary button, accent | 3.1:1 (large text) |
| `--color-primary-600` | `#558B6E` | Primary button hover | 4.0:1 |
| `--color-primary-700` | `#44705A` | Primary button active, heading accent | 5.2:1 ✓ |
| `--color-primary-900` | `#2D4A3B` | Text on primary bg | 9.8:1 ✓ |

#### Neutral

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-neutral-50` | `#FAFAFA` | Page background |
| `--color-neutral-100` | `#F5F5F5` | Card background, section bg |
| `--color-neutral-200` | `#E5E5E5` | Border, divider |
| `--color-neutral-400` | `#A3A3A3` | Placeholder text |
| `--color-neutral-600` | `#525252` | Secondary text |
| `--color-neutral-800` | `#262626` | Primary text |
| `--color-neutral-900` | `#171717` | Heading text |

#### Status Unit

| Token | Hex | Status | Kontras vs Putih |
|---|---|---|---|
| `--color-status-available` | `#44705A` | Tersedia (sage green primary-700) | 5.2:1 ✓ |
| `--color-status-process` | `#B45309` | Proses (amber) | 4.6:1 ✓ |
| `--color-status-sold` | `#991B1B` | Terjual (merah) | 6.5:1 ✓ |
| `--color-status-unknown` | `#737373` | Belum Diketahui (neutral-500) | 4.8:1 ✓ |

#### Accent

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-accent-warm` | `#F5F0E8` | Background section hangat, Coming Soon badge bg |
| `--color-accent-warm-text` | `#92400E` | Coming Soon badge text |

#### WhatsApp CTA

| Token | Hex | Penggunaan |
|---|---|---|
| `--color-whatsapp` | `#25D366` | WhatsApp button bg |
| `--color-whatsapp-hover` | `#1FB855` | WhatsApp button hover |
| `--color-whatsapp-text` | `#FFFFFF` | WhatsApp button text |

#### Implementasi di globals.css

```css
@theme inline {
  /* Primary - Sage Green */
  --color-primary-50: #F0F7F4;
  --color-primary-100: #DCEBE4;
  --color-primary-300: #A3C9B5;
  --color-primary-500: #6B9E84;
  --color-primary-600: #558B6E;
  --color-primary-700: #44705A;
  --color-primary-900: #2D4A3B;

  /* Neutral */
  --color-neutral-50: #FAFAFA;
  --color-neutral-100: #F5F5F5;
  --color-neutral-200: #E5E5E5;
  --color-neutral-400: #A3A3A3;
  --color-neutral-600: #525252;
  --color-neutral-800: ##262626;
  --color-neutral-900: #171717;

  /* Status */
  --color-status-available: #44705A;
  --color-status-process: #B45309;
  --color-status-sold: #991B1B;
  --color-status-unknown: #737373;

  /* Accent */
  --color-accent-warm: #F5F0E8;
  --color-accent-warm-text: #92400E;

  /* WhatsApp */
  --color-whatsapp: #25D366;
  --color-whatsapp-hover: #1FB855;
  --color-whatsapp-text: #FFFFFF;

  /* Font */
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
}
```

### 2.2 Typography

**Font Family:** Geist Sans (bawaan Next.js) atau system-ui fallback. Tidak menambahkan font eksternal untuk MVP.

| Token | Ukuran | Line Height | Weight | Penggunaan |
|---|---|---|---|---|
| `text-xs` | 12px | 1.5 (18px) | 400 | Label kecil, badge, caption |
| `text-sm` | 14px | 1.5 (21px) | 400 | Body text mobile, secondary info |
| `text-base` | 16px | 1.6 (25.6px) | 400 | Body text desktop |
| `text-lg` | 18px | 1.6 (28.8px) | 500 | Card title mobile |
| `text-xl` | 20px | 1.5 (30px) | 600 | Card title desktop, section heading mobile |
| `text-2xl` | 24px | 1.4 (33.6px) | 600 | Section heading desktop |
| `text-3xl` | 30px | 1.3 (39px) | 700 | Hero heading mobile |
| `text-4xl` | 36px | 1.25 (45px) | 700 | Hero heading desktop |
| `text-5xl` | 48px | 1.2 (57.6px) | 700 | Hero heading large desktop |

**Minimum font size:** 14px pada mobile (320px) sesuai Req 9-C1.

### 2.3 Spacing System

Skala 4px base, konsisten dengan Tailwind CSS default.

| Token | Nilai | Penggunaan |
|---|---|---|
| `space-1` | 4px | Gap kecil antar elemen inline |
| `space-2` | 8px | Padding dalam badge, gap antar field |
| `space-3` | 12px | Padding card mobile, gap antar list item |
| `space-4` | 16px | Padding card desktop, gap antar section |
| `space-6` | 24px | Padding section, gap antar card |
| `space-8` | 32px | Padding halaman mobile, gap antar section besar |
| `space-12` | 48px | Padding halaman desktop |
| `space-16` | 64px | Hero section padding, section spacing besar |
| `space-20` | 80px | Hero section padding desktop |

### 2.4 Border Radius

| Token | Nilai | Penggunaan |
|---|---|---|
| `rounded-sm` | 6px | Badge, input |
| `rounded-md` | 8px | Button, small card |
| `rounded-lg` | 12px | Card, panel |
| `rounded-xl` | 16px | Large card, hero section |
| `rounded-2xl` | 24px | Modal, hero container |
| `rounded-full` | 9999px | Badge pill, language switcher, avatar |

### 2.5 Elevation / Shadow

| Token | Shadow | Penggunaan |
|---|---|---|
| `shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | Card default |
| `shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Card hover, dropdown |
| `shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modal, tooltip, site plan panel |
| `shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Floating panel, overlay |

### 2.6 Komponen Dasar

#### Button

| Variant | Background | Text | Border | Penggunaan |
|---|---|---|---|---|
| Primary | `--color-primary-700` | `#FFFFFF` | none | CTA utama: "Jelajahi Proyek", "Lihat Detail" |
| Secondary | `--color-primary-50` | `--color-primary-700` | `1px solid --color-primary-300` | CTA sekunder: "Lihat di Maps" |
| Outline | transparent | `--color-neutral-800` | `1px solid --color-neutral-200` | Navigasi, batal |
| WhatsApp | `--color-whatsapp` | `#FFFFFF` | none | CTA WhatsApp |
| Disabled | `--color-neutral-100` | `--color-neutral-400` | none | WhatsApp nomor belum konfirmasi |

**Ukuran:**
- `sm`: padding 8px 16px, font 14px, radius `rounded-md`
- `md`: padding 12px 24px, font 16px, radius `rounded-md`
- `lg`: padding 16px 32px, font 18px, radius `rounded-lg`

**Minimum touch target:** 44×44px pada mobile (Req 9-C4).

#### Card

```
┌─────────────────────────────┐
│  [Image/Placeholder Area]    │  ← aspect-ratio 16:9 atau 4:3
│                             │
├─────────────────────────────┤
│  Card Title          Badge  │  ← text-lg font-600, badge di kanan
│  Short description text     │  ← text-sm text-neutral-600
│  Location • City            │  ← text-xs text-neutral-400
└─────────────────────────────┘
```

- Background: `#FFFFFF`
- Border: `1px solid --color-neutral-200`
- Border radius: `rounded-lg` (12px)
- Shadow: `shadow-sm` → `shadow-md` on hover
- Padding: `space-4` mobile, `space-6` desktop
- Hover: border color → `--color-primary-300`, cursor pointer

#### Badge (Status Unit)

| Status | Background | Text | Label ID | Label EN |
|---|---|---|---|---|
| available | `--color-primary-100` | `--color-primary-700` | Tersedia | Available |
| process | `#FEF3C7` | `--color-status-process` | Proses | In Process |
| sold | `#FEE2E2` | `--color-status-sold` | Terjual | Sold |
| unknown | `--color-neutral-100` | `--color-status-unknown` | Belum Diketahui | Unknown |

Format: `rounded-full`, padding `4px 12px`, font `text-xs font-500`.

#### Badge (Coming Soon)

- Background: `--color-accent-warm`
- Text: `--color-accent-warm-text`
- Format: sama dengan status badge

#### Input

- Background: `#FFFFFF`
- Border: `1px solid --color-neutral-200` → `--color-primary-500` on focus
- Border radius: `rounded-md`
- Padding: `12px 16px`
- Font: `text-base`
- Label: `text-sm font-500 text-neutral-800`, margin-bottom `space-2`
- Placeholder: `text-neutral-400`
- Focus ring: `2px ring --color-primary-300` (kontras 3:1 untuk keyboard focus indicator)

#### Visual Selection Card (Tipe Bangunan)

```
┌─────────────────────────────┐
│  [Gambar Denah/Placeholder]  │  ← aspect-ratio 4:3
│                             │
├─────────────────────────────┤
│  Type 1 Lantai               │  ← text-lg font-600
│  LB 46 • 3 Kamar Tidur       │  ← text-sm text-neutral-600
│                             │
│  ○ (radio indicator)        │
└─────────────────────────────┘
```

- Border: `2px solid --color-neutral-200` → `--color-primary-500` saat dipilih
- Border radius: `rounded-lg`
- Shadow: `shadow-sm`
- Selected state: border `--color-primary-600`, bg `--color-primary-50`

### 2.7 Responsive Breakpoints

Mobile-first. Semua layout dimulai dari mobile dan diperluas.

| Breakpoint | Min Width | Target Device |
|---|---|---|
| `sm` | 640px | Large phone, small tablet (landscape) |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small desktop, large tablet landscape |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

**Strategi:**
- Mobile (< 640px): single column, sidebar jadi bottom sheet atau collapsible
- Tablet (640px–1024px): 2 kolom, sidebar bisa visible
- Desktop (≥ 1024px): sidebar kiri + peta kanan + site plan bawah

### 2.8 Accessibility dan Reduced Motion

**Fokus keyboard:**
- `outline: 2px solid --color-primary-500` dengan `outline-offset: 2px`
- Kontras minimum 3:1 terhadap background (Req 10-C3)

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Status tidak hanya warna:**
- Setiap badge status memiliki teks label (Req 6-C4, Req 10-C6)
- Site plan: setiap unit memiliki label teks `unitCode` dan status, bukan hanya warna

---

## 3. UX Architecture

### 3.1 Sitemap

```
/[locale]/
├── /                        ← Homepage (Req 1)
├── /projects                ← Katalog Proyek (Req 2)
├── /projects/[slug]          ← Halaman Eksplorasi (Req 3)
│   └── /units                ← Katalog Unit (Req 4)
│       └── /[unitCode]      ← Detail Unit (Req 5)
├── /projects/[slug]/site-plan ← Site Plan full view (jika diperlukan)
├── /interest                ← Formulir Minat Dehir (Req 13)
├── /contact                 ← Halaman kontak (CTA WhatsApp)
└── /404                     ← Halaman tidak ditemukan

Locale: /id/... (default) dan /en/...
```

### 3.2 User Flow Utama

```
[Homepage]
    │
    ├─ klik kartu Dehir ──→ [Halaman Eksplorasi Dehir]
    │                           │
    │                           ├─ Sidebar: pilih proyek lain
    │                           ├─ Peta: lihat lokasi
    │                           ├─ Site Plan: klik kavling
    │                           │       │
    │                           │       ├─ Panel info unit muncul
    │                           │       │       │
    │                           │       │       ├─ klik "Lihat Detail" → [Detail Unit]
    │                           │       │       │       │
    │                           │       │       │       ├─ CTA WhatsApp langsung
    │                           │       │       │       └─ klik "Hubungi via Formulir" → [Formulir Minat]
    │                           │       │       │               │
    │                           │       │       │               └─ submit → WhatsApp terisi otomatis
    │                           │       │       │
    │                           │       │       └─ CTA WhatsApp dari panel
    │                           │       │
    │                           │       └─ unit tanpa posisi → daftar teks di bawah site plan
    │                           │
    │                           └─ CTA WhatsApp (umum, proyek)
    │
    ├─ klik kartu Pabuaran ──→ [Teaser Coming Soon]
    │
    └─ CTA WhatsApp ──→ WhatsApp (tab baru)
```

### 3.3 Struktur Navigasi

#### Navbar (konsisten di semua halaman)

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo Celestia]   Beranda   Proyek   Hubungi    [ID ▼] [WA] │
└──────────────────────────────────────────────────────────────┘
```

- Logo di kiri, link ke homepage
- Menu: Beranda (/), Proyek (/projects), Hubungi (/contact)
- Language Switcher di kanan (dropdown atau toggle ID/EN)
- WhatsApp CTA button di kanan (icon + text)
- Mobile: hamburger menu, sidebar drawer, language switcher tetap visible

#### Sidebar (Halaman Eksplorasi)

```
┌──────────────────┐
│ DAFTAR PROYEK     │
│                   │
│ ● Dehir           │  ← aktif (highlighted)
│   Jatiluhur       │
│                   │
│ ○ Pabuaran        │  ← Coming Soon badge
│   Coming Soon     │
│                   │
├──────────────────┤
│ NAVIGASI          │
│                   │
│ ▸ Katalog Unit    │  ← link ke /projects/dehir/units
│ ▸ Formulir Minat │  ← link ke /interest
│ ▸ Hubungi        │  ← CTA WhatsApp
└──────────────────┘
```

- Lebar: 240px–280px (desktop), collapsible di mobile
- Mobile: sidebar jadi bottom sheet atau toggle button di atas konten

### 3.4 Layout Homepage

```
┌──────────────────────────────────────────────────────────────┐
│                      NAVBAR                                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                    HERO SECTION                               │
│            "Celestia"                                         │
│            "Temukan Hunian Impian Anda"                      │
│            [Jelajahi Proyek]  [Hubungi WhatsApp]             │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                    KARTU PROYEK                               │
│  ┌─────────────┐  ┌─────────────┐                            │
│  │ Dehir       │  │ Pabuaran    │                            │
│  │ Aktif       │  │ Coming Soon │                            │
│  │ Jatiluhur   │  │             │                            │
│  └─────────────┘  └─────────────┘                            │
├──────────────────────────────────────────────────────────────┤
│                    KEUNGGULAN PROYEK                         │
│  [Placeholder: Info keunggulan Dehir — belum tersedia]       │
├──────────────────────────────────────────────────────────────┤
│                    GALERI FOTO                                │
│  [Placeholder: Galeri foto Dehir — belum tersedia]           │
├──────────────────────────────────────────────────────────────┤
│                    VIDEO / GIF                                │
│  [Placeholder: Video promosi — belum tersedia]               │
├──────────────────────────────────────────────────────────────┤
│                    CTA BAWAH                                  │
│         "Siap menjelajahi?"  [Jelajahi Proyek]               │
├──────────────────────────────────────────────────────────────┤
│                      FOOTER                                   │
└──────────────────────────────────────────────────────────────┘
```

**Mobile:** Semua section stack vertical, single column. Hero text lebih kecil (text-3xl). Kartu proyek stack vertikal.

### 3.5 Layout Halaman Eksplorasi

```
┌──────────────────────────────────────────────────────────────┐
│                      NAVBAR                                   │
├──────────────┬───────────────────────────────────────────────┤
│              │                                                │
│   SIDEBAR    │           GOOGLE MAPS                          │
│              │           (lokasi proyek)                       │
│  ● Dehir     │                                                │
│    Jatiluhur │                                                │
│              │           [Lihat di Google Maps →]              │
│  ○ Pabuaran  │                                                │
│    Coming    ├───────────────────────────────────────────────┤
│    Soon     │                                                │
│              │           SITE PLAN                            │
│  ─────────  │           (denah kavling)                       │
│              │                                                │
│  ▸ Katalog   │    ┌─────┬─────┬─────┐                        │
│  ▸ Formulir │    │ A1  │ A2  │ A3  │  ← unit dapat diklik    │
│  ▸ Hubungi  │    ├─────┼─────┼─────┤                        │
│              │    │ B1  │ B2  │ B3  │                        │
│              │    └─────┴─────┴─────┘                        │
│              │                                                │
│              │    [Panel info unit ketika diklik]              │
│              │    Kode: A1  Status: Tersedia                 │
│              │    [Lihat Detail] [Hubungi WhatsApp]           │
│              │                                                │
├──────────────┴───────────────────────────────────────────────┤
│  INFO PROYEK: Celestia Jatiluhur • Jatiluhur, Jawa Barat      │
│  Ringkasan: Tersedia 5 • Proses 2 • Terjual 3               │
│  [CTA WhatsApp]                                               │
├──────────────────────────────────────────────────────────────┤
│                      FOOTER                                   │
└──────────────────────────────────────────────────────────────┘
```

**Mobile:** Sidebar collapse jadi toggle button di atas. Peta dan site plan stack vertikal, full width.

**Placeholder Site Plan:**
```
┌──────────────────────────────────────────────┐
│                                              │
│           📐 Denah belum tersedia             │
│                                              │
│    Denah resmi proyek sedang dipersiapkan    │
│    oleh perusahaan.                          │
│                                              │
│    Sementara itu, Anda dapat melihat         │
│    daftar unit di bawah ini.                 │
│                                              │
│         [Lihat Daftar Unit →]                │
│                                              │
└──────────────────────────────────────────────┘
```

### 3.6 Layout Katalog Unit

```
┌──────────────────────────────────────────────────────────────┐
│                      NAVBAR                                   │
├──────────────────────────────────────────────────────────────┤
│  Beranda › Proyek › Dehir › Katalog Unit                     │
│                                                               │
│  Celestia Jatiluhur • Jatiluhur, Jawa Barat                  │
│                                                               │
│  [Filter: Semua ▼]  (jika ≥ 10 unit dan status bervariasi)   │
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ A1       │ │ A2       │ │ B1       │                     │
│  │ Kavling  │ │ Kavling  │ │ Kavling  │                     │
│  │ Tersedia │ │ Terjual  │ │ Proses   │                     │
│  │ 120 m²   │ │ Hubungi  │ │ Hubungi  │                     │
│  │ Rp ...   │ │ Marketing│ │ Marketing│                     │
│  └──────────┘ └──────────┘ └──────────┘                     │
│                                                               │
│  ┌──────────┐ ┌──────────┐ ...                                │
│  │ B2       │ │ B3       │                                   │
│  └──────────┘ └──────────┘                                   │
├──────────────────────────────────────────────────────────────┤
│                      FOOTER                                   │
└──────────────────────────────────────────────────────────────┘
```

### 3.7 Layout Detail Unit

```
┌──────────────────────────────────────────────────────────────┐
│                      NAVBAR                                   │
├──────────────────────────────────────────────────────────────┤
│  Beranda › Proyek › Dehir › Unit A1                          │
│                                                               │
│  ┌────────────────────┐  ┌────────────────────────┐          │
│  │                    │  │ Kode Unit: A1           │          │
│  │  [Foto /           │  │ Tipe: Kavling          │          │
│  │   Placeholder]     │  │ Proyek: Celestia        │          │
│  │                    │  │         Jatiluhur       │          │
│  └────────────────────┘  │                         │          │
│                          │ Status: [Tersedia]     │          │
│                          │ Luas: 120 m²            │          │
│                          │ Dimensi: 8 × 15 m       │          │
│                          │ Harga: Rp 150.000.000  │          │
│                          │                         │          │
│                          │ [Lihat di Site Plan →]  │          │
│                          │ [Hubungi WhatsApp]      │          │
│                          └────────────────────────┘          │
├──────────────────────────────────────────────────────────────┤
│                      FOOTER                                   │
└──────────────────────────────────────────────────────────────┘
```

### 3.8 Layout Formulir Minat

```
┌──────────────────────────────────────────────────────────────┐
│                      NAVBAR                                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│              FORMULIR MINAT — CELESTIA DEHIR                  │
│                                                               │
│  Pilih jenis properti *                                       │
│  ○ Kavling saja                                              │
│  ○ Kavling + Bangunan                                        │
│                                                               │
│  ── JIKA "Kavling saja" DIPILIH ──                           │
│  Kode kavling (opsional)                                      │
│  [A1 ▼]                                                      │
│  Catatan: pemilihan kavling adalah preferensi awal,          │
│  bukan reservasi atau jaminan ketersediaan                   │
│                                                               │
│  ── JIKA "Kavling + Bangunan" DIPILIH ──                     │
│  Pilih tipe bangunan                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │
│  │ Type 1   │ │ Type 1   │ │ Belum    │                     │
│  │ Lantai   │ │ Promo    │ │ menentu  │                     │
│  │ LB 46    │ │ LB 30    │ │ kan      │                     │
│  │ 3 KT     │ │ 2 KT     │ │          │                     │
│  └──────────┘ └──────────┘ └──────────┘                     │
│                                                               │
│  ── PERTANYAAN TAMBAHAN (OPSIONAL) ──                         │
│  Nama                                                         │
│  [________________]                                           │
│                                                               │
│  Tujuan penggunaan                                            │
│  [Rumah tinggal / Office / Lainnya ▼]                       │
│                                                               │
│  Kebutuhan modifikasi desain?                                 │
│  [________________]                                           │
│                                                               │
│  Catatan khusus                                               │
│  [________________]                                           │
│                                                               │
│  [Kirim via WhatsApp]    [Hubungi Langsung]                  │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                      FOOTER                                   │
└──────────────────────────────────────────────────────────────┘
```

### 3.9 Layout Teaser Coming Soon

```
┌──────────────────────────────────────────────────────────────┐
│                      NAVBAR                                   │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│              Celestia Pabuaran                                │
│              Celestia Jatiranggon                             │
│                                                               │
│              [COMING SOON]                                   │
│                                                               │
│         Proyek ini sedang dalam persiapan.                    │
│         Informasi lengkap akan segera hadir.                 │
│                                                               │
│         [Hubungi untuk Info Terbaru]                         │
│                                                               │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                      FOOTER                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Design Deliverables

### 4.1 Daftar Mockup Berdasarkan Prioritas

| Prioritas | Mockup | Perangkat | Status |
|---|---|---|---|
| 1 | Homepage — Mobile | 320px–640px | Perlu dibuat |
| 1 | Homepage — Desktop | ≥1024px | Perlu dibuat |
| 1 | Halaman Eksplorasi — Desktop | ≥1024px | Perlu dibuat |
| 1 | Halaman Eksplorasi — Mobile | 320px–640px | Perlu dibuat |
| 2 | Detail Unit — Mobile | 320px–640px | Perlu dibuat |
| 2 | Detail Unit — Desktop | ≥1024px | Perlu dibuat |
| 2 | Formulir Minat — Mobile | 320px–640px | Perlu dibuat |
| 2 | Formulir Minat — Desktop | ≥1024px | Perlu dibuat |
| 3 | Katalog Unit — Mobile | 320px–640px | Perlu dibuat |
| 3 | Katalog Unit — Desktop | ≥1024px | Perlu dibuat |
| 3 | Katalog Proyek — Mobile | 320px–640px | Perlu dibuat |
| 3 | Katalog Proyek — Desktop | ≥1024px | Perlu dibuat |
| 4 | Teaser Coming Soon | Universal | Perlu dibuat |
| 4 | Halaman 404 | Universal | Perlu dibuat |
| 4 | Navbar — Mobile (hamburger) | 320px–640px | Perlu dibuat |

### 4.2 Daftar Komponen UI yang Perlu Dibuat

| Komponen | Lokasi | Tipe | Catatan |
|---|---|---|---|
| Button | `src/components/ui/Button.tsx` | Server | Varian: primary, secondary, outline, whatsapp, disabled |
| Card | `src/components/ui/Card.tsx` | Server | Wrapper untuk project card, unit card |
| Badge | `src/components/ui/Badge.tsx` | Server | Status unit + Coming Soon |
| Input | `src/components/ui/Input.tsx` | Server | Text input dengan label |
| Select | `src/components/ui/Select.tsx` | Server | Dropdown untuk kode kavling, tujuan |
| RadioGroup | `src/components/ui/RadioGroup.tsx` | Client | Pilihan jenis properti |
| VisualSelectCard | `src/components/ui/VisualSelectCard.tsx` | Client | Card untuk tipe bangunan |
| Navbar | `src/components/layout/Navbar.tsx` | Server | Navigasi utama |
| Footer | `src/components/layout/Footer.tsx` | Server | Footer konsisten |
| LanguageSwitcher | `src/components/layout/LanguageSwitcher.tsx` | Client | Toggle ID/EN |
| Sidebar | `src/components/layout/Sidebar.tsx` | Server | Daftar proyek + navigasi kontekstual |
| ProjectCard | `src/features/projects/ProjectCard.tsx` | Server | Kartu proyek untuk katalog & homepage |
| UnitCard | `src/features/properties/UnitCard.tsx` | Server | Kartu unit untuk katalog |
| WhatsAppButton | `src/features/contact/WhatsAppButton.tsx` | Server | CTA WhatsApp dengan disabled state |
| SitePlanPanel | `src/features/site-plan/SitePlanPanel.tsx` | Client | Panel info unit di site plan |
| InterestForm | `src/features/contact/InterestForm.tsx` | Client | Formulir minat Dehir |
| Placeholder | `src/components/ui/Placeholder.tsx` | Server | UI placeholder untuk aset belum tersedia |
| Breadcrumb | `src/components/layout/Breadcrumb.tsx` | Server | Navigasi breadcrumb |

### 4.3 Risiko UX dan Teknis

#### Risiko UX

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Site Plan tidak tersedia saat launch | Pengunjung tidak dapat memilih kavling secara visual | Tampilkan UI placeholder jelas + daftar unit teks sebagai fallback |
| Formulir terlalu panjang di mobile | Calon pembeli enggan mengisi | Hanya 1 field wajib; sisanya opsional; CTA langsung tersedia |
| Peta tidak muncul (tidak ada koordinat) | Pengunjung tidak melihat lokasi | Fallback ke teks kota/provinsi |
| Data unit belum lengkap | Banyak placeholder di detail unit | Label jelas "Hubungi Marketing"; tidak menampilkan angka palsu |

#### Risiko Teknis

| Risiko | Dampak | Mitigasi |
|---|---|---|
| `next-intl` kompleksitas setup | Waktu development lebih lama | Evaluasi dokumentasi terbaru; mulai dari setup sederhana |
| Google Maps embed tanpa API key | Fitur terbatas (tidak bisa custom marker) | Cukup untuk MVP; upgrade ke API key di versi berikutnya |
| SVG site plan manual | Maintenance sulit jika denah berubah | Desain data format yang fleksibel; site plan diganti via file data |
| `UnitStatus` type mismatch | Bug runtime jika tidak diselaraskan | Update `property.ts` di awal implementasi |
| Formulir client-side complexity | Bundle size meningkat | Komponen formulir di-code-split; hanya load di halaman formulir |

### 4.4 Keputusan yang Masih Membutuhkan Persetujuan

| # | Keputusan | Kategori | Status |
|---|---|---|---|
| D-01 | Gunakan `next-intl` untuk i18n | Teknis | Direkomendasikan, menunggu persetujuan |
| D-02 | Google Maps via iframe embed (bukan API) | Teknis | Direkomendasikan, menunggu persetujuan |
| D-03 | Site Plan via SVG dengan event handler | Teknis | Direkomendasikan, menunggu persetujuan |
| D-04 | Dark mode tidak untuk MVP | Desain | Direkomendasikan, menunggu persetujuan |
| D-05 | Skema warna status: green/amber/red/gray | Desain | Direkomendasikan, menunggu persetujuan |
| D-06 | Sidebar collapse jadi toggle di mobile | Desain | Direkomendasikan, menunggu persetujuan |
| D-07 | Visual selection cards tipe bangunan menggunakan gambar brosur yang di-crop | Desain | Menunggu ketersediaan aset (P-17) |
| D-08 | `UnitStatus` type: `reserved` → `process` | Teknis | Sudah disepakati di requirements, eksekusi saat implementasi |

---

## Components and Interfaces

### Komponen UI Dasar

| Komponen | Interface | Tipe | Props Utama |
|---|---|---|---|
| `Button` | `ButtonProps` | Server | `variant`: primary\|secondary\|outline\|whatsapp\|disabled; `size`: sm\|md\|lg |
| `Card` | `CardProps` | Server | `as`: div\|article\|a; `href?`: string |
| `Badge` | `BadgeProps` | Server | `status`: available\|process\|sold\|unknown\|coming-soon |
| `Input` | `InputProps` | Server | `label`: string; `required?`: boolean; `name`: string |
| `Select` | `SelectProps` | Server | `label`: string; `options`: {value, label}[] |
| `RadioGroup` | `RadioGroupProps` | Client | `name`: string; `options`: {value, label}[]; `value?`: string; `onChange`: (v) => void |
| `VisualSelectCard` | `VisualSelectCardProps` | Client | `image?`: string; `title`: string; `specs`: string; `selected`: boolean; `onSelect`: () => void |
| `Placeholder` | `PlaceholderProps` | Server | `type`: image\|map\|site-plan\|video; `label`: string |
| `Breadcrumb` | `BreadcrumbProps` | Server | `items`: {label, href}[] |

### Komponen Layout

| Komponen | Tipe | Props Utama |
|---|---|---|
| `Navbar` | Server | `locale`: string; `activePath?`: string |
| `Footer` | Server | `locale`: string |
| `Sidebar` | Server | `projects`: Project[]; `activeProjectId?`: ProjectId; `navLinks`: NavLink[] |
| `LanguageSwitcher` | Client | `currentLocale`: string; `pathname`: string |

### Komponen Fitur

| Komponen | Tipe | Props Utama |
|---|---|---|
| `ProjectCard` | Server | `project`: Project; `comingSoon?`: boolean |
| `UnitCard` | Server | `unit`: PropertyUnit; `projectSlug`: string |
| `WhatsAppButton` | Server | `message`: string; `disabled?`: boolean; `variant?`: button\|icon |
| `SitePlanPanel` | Client | `unit`: PropertyUnit; `onClose`: () => void |
| `InterestForm` | Client | `locale`: string |

---

## Data Models

#### Project (sudah ada, perlu ditambahkan `status`)

```typescript
interface Project {
  id: ProjectId;
  name: string;
  fullName: string;
  shortDescription: string;
  description: string;
  slug: string;
  location: ProjectLocation;
  status: "active" | "coming-soon";  // ← tambahan untuk MVP
}
```

#### PropertyUnit (sudah ada, `UnitStatus` perlu diselaraskan)

```typescript
type UnitStatus = "available" | "process" | "sold" | "unknown";
// Catatan: "reserved" di type definition saat ini perlu diganti ke "process"
```

#### Site Plan Position (baru — untuk posisi unit di denah)

```typescript
interface SitePlanPosition {
  unitCode: string;
  x: number;       // posisi relatif pada SVG (0-100)
  y: number;       // posisi relatif pada SVG (0-100)
  width?: number;  // lebar relatif (opsional)
  height?: number; // tinggi relatif (opsional)
}
```

#### Interest Form Data (baru — client-side only)

```typescript
interface InterestFormData {
  name?: string;
  propertyType: "kavling-only" | "kavling-building";  // wajib
  kavlingCode?: string;         // A1-B5, opsional
  buildingType?: string;        // "type-1" | "type-1-promo" | "undecided"
  usagePurpose?: string;        // "residential" | "office" | "other"
  modificationRequest?: string;
  notes?: string;
}
```

---

## Correctness Properties

### Property 1: Status Coming Soon Konsisten

THE system SHALL menampilkan status Coming Soon untuk Pabuaran di setiap halaman yang menampilkan daftar proyek, tanpa menampilkan data detail yang belum dikonfirmasi.

**Validates: Requirement 1.3, Requirement 1.7, Requirement 2.3, Requirement 2.5, Requirement 3.13, BR-09**

### Property 2: Placeholder Tertanda Jelas

THE system SHALL menampilkan placeholder bertanda jelas untuk setiap aset (foto, video, denah) yang belum tersedia, tanpa menampilkan konten fiktif yang dapat dikira sebagai informasi resmi.

**Validates: Requirement 1.2, Requirement 1.4, Requirement 1.5, Requirement 3.7, Requirement 3.11, Requirement 5.9, Requirement 6.8, Requirement 13.6, BR-05**

### Property 3: WhatsApp CTA Aman

THE system SHALL mencegah navigasi WhatsApp jika nomor di `siteConfig` masih placeholder (mengandung karakter `X`), dengan menonaktifkan tombol secara visual dan fungsional.

**Validates: Requirement 7.8, BR-01**

### Property 4: Locale Konsisten

THE system SHALL mempertahankan prefix locale (`/id/` atau `/en/`) pada semua URL internal, dan mengarahkan URL tanpa prefix ke locale default.

**Validates: Requirement 8.2, Requirement 8.10, Requirement 12.3**

### Property 5: Status Unit Tidak Hanya Warna

THE system SHALL menampilkan badge status unit dengan teks label yang dapat dibaca, bukan hanya perbedaan warna, untuk memenuhi WCAG 2.1 AA.

**Validates: Requirement 6.4, Requirement 10.6, BR-08**

### Property 6: Pesan WhatsApp Terformat

THE system SHALL menyusun pesan WhatsApp dari Formulir Minat dengan field tidak terisi sebagai tanda `-`, bukan dihilangkan dari pesan.

**Validates: Requirement 7.5, Requirement 13.9, Requirement 13.10**

### Property 7: Reduced Motion

THE system SHALL menonaktifkan animasi dan transisi jika `prefers-reduced-motion: reduce` terdeteksi pada browser pengunjung.

**Validates: Requirement 6.10, Requirement 10.5**

---

## Error Handling

| Skenario | Perilaku |
|---|---|
| Slug proyek tidak dikenali | HTTP 404 + halaman 404 dengan tautan ke homepage |
| UnitCode tidak dikenali dalam proyek | HTTP 404 + halaman 404 dengan tautan ke homepage |
| Locale tidak dikenali | HTTP redirect ke URL setara dengan prefix `/id/` |
| Koordinat lokasi tidak tersedia | Tampilkan teks kota dan provinsi; tidak menampilkan peta rusak |
| Nomor WhatsApp placeholder | CTA WhatsApp disabled; klik tidak melakukan navigasi |
| Data JSON tidak dapat dibaca | Error boundary menampilkan pesan "Data sedang dipersiapkan" |
| Aset gambar tidak ditemukan | Placeholder dengan teks label eksplisit |

---

## Testing Strategy

### Pengujian Visual / Mockup

1. Evaluasi mockup Homepage dan Halaman Eksplorasi (prioritas 1) sebelum lanjut ke mockup lain
2. Verifikasi kontras warna menggunakan tools automated (axe, Lighthouse) dan manual review
3. Verifikasi tampilan pada minimum 320px lebar layar

### Pengujian Fungsional

1. Formulir Minat: semua kombinasi pilihan (kavling saja, kavling + bangunan, tipe bangunan) menghasilkan pesan WhatsApp yang benar
2. Language Switcher: beralih bahasa mempertahankan konteks halaman
3. WhatsApp CTA: pesan yang disusun sesuai konteks halaman (homepage, proyek, unit, formulir)
4. Site Plan: klik unit menampilkan panel info; deep-link dari detail unit men-trigger highlight

### Pengujian Aksesibilitas

1. Navigasi keyboard: semua elemen interaktif dapat diakses via Tab
2. Screen reader: badge status memiliki teks label; alt text pada gambar
3. Reduced motion: animasi dinonaktifkan saat preferensi terdeteksi

### Pengujian Performa

1. Server Components: halaman utama dapat dirender tanpa JavaScript browser
2. Build: `npm run build` berhasil tanpa error
3. TypeScript: `npx tsc --noEmit` tanpa error

---

## 5. Catatan

- Seluruh desain di atas adalah rancangan. Tidak ada kode yang diubah atau dibuat.
- Mockup prioritas 1 (Homepage dan Halaman Eksplorasi) perlu dievaluasi terlebih dahulu sebelum melanjutkan ke mockup prioritas 2–4.
- Aset visual (foto, video, denah, gambar brosur) menggunakan placeholder sampai perusahaan mengonfirmasi ketersediaan.
- Color palette dan komponen dasar dapat diiterasi setelah evaluasi mockup.
