# Struktur Project Celestia

## Struktur Folder Saat Ini

```
celestia-web/
├── docs/                      ← Dokumentasi developer (kamu sedang membacanya)
├── public/                    ← File statis: gambar, ikon, font lokal
│   └── *.svg                  ← Ikon default dari create-next-app (akan diganti)
├── src/
│   ├── app/                   ← Routing Next.js App Router
│   │   ├── globals.css        ← CSS global + import Tailwind
│   │   ├── layout.tsx         ← Root layout (HTML wrapper, metadata default)
│   │   └── page.tsx           ← Halaman "/" (homepage placeholder)
│   │
│   ├── config/                ← Konfigurasi global aplikasi
│   │   └── site.ts            ← Nama, URL, kontak, locale
│   │
│   ├── lib/                   ← Utility functions yang digunakan banyak tempat
│   │   └── utils.ts           ← cn(), formatRupiah(), formatArea()
│   │
│   └── types/                 ← TypeScript interfaces dan types
│       ├── index.ts           ← Barrel export semua types
│       ├── project.ts         ← Project, ProjectId, ProjectLocation
│       └── property.ts        ← PropertyUnit, UnitStatus
│
├── .env.local.example         ← Template environment variables
├── .gitignore                 ← File yang diabaikan Git
├── eslint.config.mjs          ← Konfigurasi ESLint
├── next.config.ts             ← Konfigurasi Next.js
├── package.json               ← Dependencies dan npm scripts
└── tsconfig.json              ← Konfigurasi TypeScript (strict mode aktif)
```

## Folder yang Akan Dibuat pada Feature Spec Berikutnya

```
src/
├── app/
│   └── [locale]/              ← Routing bilingual (i18n)
│       ├── layout.tsx
│       ├── page.tsx           ← Homepage Celestia
│       ├── projects/
│       │   └── [slug]/
│       │       └── page.tsx   ← Halaman detail proyek
│       └── properties/
│           └── [unitCode]/
│               └── page.tsx   ← Halaman detail unit
│
├── components/
│   ├── ui/                    ← Komponen UI dasar (Button, Card, Badge)
│   ├── layout/                ← Navbar, Footer
│   └── shared/                ← Komponen yang digunakan di banyak fitur
│
├── features/
│   ├── projects/              ← ProjectCard, ProjectList, ProjectHero
│   ├── properties/            ← PropertyCatalog, UnitCard, UnitDetail
│   ├── site-plan/             ← InteractiveSitePlan, ZoomableMap
│   └── contact/               ← WhatsAppButton, ContactCTA
│
├── services/
│   ├── projects.ts            ← getAllProjects(), getProjectBySlug()
│   └── properties.ts          ← getUnitsByProject(), getUnitByCode()
│
├── data/                      ← File JSON data properti (dikonfirmasi perusahaan)
│   ├── projects/
│   │   ├── dehir.json
│   │   └── pabuaran.json
│   └── properties/
│       ├── dehir-units.json
│       └── pabuaran-units.json
│
└── i18n/                      ← File terjemahan
    ├── id.json                ← Bahasa Indonesia
    └── en.json                ← English
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
