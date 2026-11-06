# Struktur Project Celestia

## Struktur Folder Saat Ini

```
celestia-web/
├── docs/                      ← Dokumentasi developer (kamu sedang membacanya)
├── public/                    ← File statis: gambar, ikon
│   └── *.svg                  ← Ikon bawaan create-next-app
│   └── Hybrid 1 — *.png       ← Aset gambar proyek
├── src/
│   ├── app/                   ← Routing Next.js App Router
│   │   ├── [locale]/          ← Routing bilingual (/id/... dan /en/...)
│   │   │   ├── layout.tsx     ← Root layout dengan locale provider
│   │   │   ├── page.tsx       ← Homepage (/id/ dan /en/)
│   │   │   ├── error.tsx      ← Error boundary per-locale
│   │   │   ├── not-found.tsx  ← 404 per-locale
│   │   │   └── projects/
│   │   │       ├── page.tsx           ← Daftar semua proyek
│   │   │       └── [slug]/
│   │   │           ├── page.tsx       ← Detail proyek
│   │   │           └── units/
│   │   │               ├── page.tsx           ← Katalog unit proyek
│   │   │               └── [unitCode]/
│   │   │                   └── page.tsx       ← Detail unit
│   │   ├── globals.css        ← CSS global + import Tailwind
│   │   ├── not-found.tsx      ← 404 global (sebelum locale terdeteksi)
│   │   ├── robots.ts          ← robots.txt dinamis
│   │   └── sitemap.ts         ← sitemap.xml dinamis
│   │
│   ├── components/            ← Komponen UI (sementara, sebelum migrasi ke features/)
│   │   ├── homepage/          ← HomepageV2.tsx
│   │   ├── layout/            ← Navbar.tsx, Footer.tsx
│   │   ├── projects/          ← ExplorationV2, ProjectCatalogV2, UnitCatalogV2, UnitDetailV2
│   │   └── ui/                ← Badge, Button, Card, Input, Placeholder, Select
│   │
│   ├── config/                ← Konfigurasi global aplikasi
│   │   └── site.ts            ← siteConfig, uiConfig, seoConfig, WhatsApp helpers
│   │
│   ├── data/                  ← File JSON data properti
│   │   ├── projects/
│   │   │   ├── dehir.json
│   │   │   └── pabuaran.json
│   │   └── properties/
│   │       └── dehir-units.json
│   │
│   ├── features/              ← Feature modules (sebagian belum diimplementasikan)
│   │   └── site-plan/         ← SitePlanPanel.tsx, InteractiveSitePlan.tsx
│   │
│   ├── i18n/                  ← Konfigurasi dan file terjemahan next-intl
│   │   ├── config.ts          ← Daftar locale yang didukung
│   │   ├── request.ts         ← Request-scoped i18n config (untuk App Router)
│   │   └── messages/
│   │       ├── id.json        ← Terjemahan Bahasa Indonesia
│   │       └── en.json        ← Terjemahan English
│   │
│   ├── lib/                   ← Utility functions
│   │   └── utils.ts           ← cn(), formatRupiah(), formatArea()
│   │
│   ├── types/                 ← TypeScript interfaces dan types
│   │   ├── index.ts           ← Barrel export semua types
│   │   ├── project.ts         ← Project, ProjectId, ProjectLocation
│   │   └── property.ts        ← PropertyUnit, UnitStatus
│   │
│   └── proxy.ts               ← Middleware next-intl untuk locale routing
│
├── .env.local.example         ← Template environment variables
├── .gitignore
├── eslint.config.mjs          ← Konfigurasi ESLint
├── next.config.ts             ← Konfigurasi Next.js (Turbopack + next-intl plugin)
├── package.json               ← Dependencies dan npm scripts
└── tsconfig.json              ← Konfigurasi TypeScript (strict mode aktif)
```

## Folder yang Belum Diimplementasikan (Planned)

Berikut folder yang ada dalam rencana arsitektur tapi belum dibuat:

```
src/
├── features/
│   ├── projects/    ← ProjectCard, ProjectList, ProjectHero (planned)
│   ├── properties/  ← PropertyCatalog, UnitCard, UnitDetail (planned)
│   └── contact/     ← WhatsAppButton, ContactCTA (planned)
│
├── services/
│   ├── projects.ts  ← getAllProjects(), getProjectBySlug() (planned)
│   └── properties.ts ← getUnitsByProject(), getUnitByCode() (planned)
│
└── data/
    └── properties/
        └── pabuaran-units.json  ← Data unit Pabuaran (belum tersedia)
```

## Konvensi Penamaan

| Item            | Konvensi          | Contoh                    |
|-----------------|-------------------|---------------------------|
| File komponen   | PascalCase        | `PropertyCard.tsx`        |
| File utility    | camelCase         | `formatRupiah.ts`         |
| File data       | kebab-case        | `dehir-units.json`        |
| Folder fitur    | kebab-case        | `site-plan/`              |
| Variabel        | camelCase         | `unitStatus`              |
| Type/Interface  | PascalCase        | `PropertyUnit`            |
| Constants       | UPPER_SNAKE_CASE  | `MAX_UNITS_PER_PAGE`      |

## Import Alias

Gunakan alias `@/` untuk semua import dari `src/`:

```typescript
// ✅ Benar
import { cn } from "@/lib/utils"
import type { Project } from "@/types"
import { siteConfig } from "@/config/site"

// ❌ Hindari path relatif panjang
import { cn } from "../../../lib/utils"
```
