# Design Document — Celestia V1 Launch

## Overview

This document describes the technical design for all five workstreams of the Celestia V1 Launch.
The site is a fully static Next.js (App Router, `output: "export"`) website with bilingual routing
via next-intl, targeting Apache shared-hosting deployment. All implementation targets the V2 UI
variant and TypeScript strict mode.

---

## Architecture

### 1.1 Static Export Architecture

```
Browser Request
    │
    ▼
Apache (.htaccess)
    │  RewriteRule  / → /id/
    │  ErrorDocument 404  /404.html
    │  Cache-Control headers for static assets
    ▼
/out/  (npm run build output)
    ├── id/
    │   ├── index.html          ← Homepage (locale id)
    │   ├── interest/index.html ← Interest Form (locale id)
    │   ├── contact/index.html  ← Contact Page (locale id)
    │   └── projects/
    │       ├── index.html
    │       └── dehir/
    │           ├── index.html
    │           └── units/
    │               ├── index.html
    │               └── [A1–B5]/index.html
    └── en/
        └── (mirror of id/ in English)
```

### 1.2 Data Flow (MVP Static)

```
src/data/
  projects/dehir.json        ← Project metadata
  projects/pabuaran.json
  properties/dehir-units.json ← 9 kavling units (all price: null, status: "unknown")
        │
        ▼
  src/services/              ← Data access layer (getAllProjects, getUnitsByProject)
        │
        ▼
  src/app/[locale]/          ← Server Components (page.tsx files)
        │
        ▼
  src/components/ / src/features/   ← UI Components
        │
        ▼
  Static HTML in /out/       ← Served by Apache
```

### 1.3 i18n Routing

- Middleware (`src/proxy.ts`, via `next-intl/middleware`) intercepts all requests.
- Locales: `["id", "en"]`, default `"id"`, prefix `"always"`.
- URL without locale prefix → redirect to `/id/[path]`.
- Unknown locale → redirect to `/id/[path]`.

---

## 2. WS-01: Consultation Flow & Conversion (P0 Launch Blocker)

### 2.1 Interest Form Page

**Route:** `src/app/[locale]/interest/page.tsx` — **already implemented** in the codebase.

The page renders `<InterestForm>` from `src/features/contact/InterestForm.tsx`, which is a
Client Component (`"use client"`) with full bilingual support. The page Server Component calls
`setRequestLocale(locale)` and passes translated labels via props.

**Current state:** Implemented and functional. The design below documents the architecture for
verification and identifies the gap areas that tasks must address.

#### 2.1.1 InterestForm Component Architecture

```
src/app/[locale]/interest/page.tsx   (Server Component)
    │  Fetches translations via getTranslations("form")
    │  Fetches unit codes via getUnitsByProject("dehir")
    │  Passes InterestFormLabels + locale + availableUnitCodes as props
    ▼
src/features/contact/InterestForm.tsx  ("use client")
    │
    ├── InterestFormContent          ← Core form logic, re-keyed on param changes
    │   ├── formData: InterestFormData   (useState)
    │   ├── errors: { name?, topics? }   (useState)
    │   ├── topicLimitHit: boolean        (useState)
    │   │
    │   ├── selectDehir() / selectGeneral()     ← project switch handlers
    │   ├── toggleCategory(id)                  ← max-3 topic selection
    │   ├── validate()                          ← name required, topic required for Dehir
    │   └── handleSubmit(e)                     ← validation → buildMessage() → window.open()
    │
    └── Wrapped in <Suspense> (useSearchParams requirement for static export)
```

#### 2.1.2 WhatsApp URL Construction

```typescript
// Pure function chain — no side effects
buildMessage(formData, labels, categories, locale)
    → string (pre-filled WhatsApp message)
    
buildWhatsAppUrl(message)   // from src/config/site.ts
    → `https://wa.me/6282299237825?text=${encodeURIComponent(message)}`
    
window.open(url, "_blank", "noopener,noreferrer")
```

The message template differs by project context:
- **Dehir:** Includes project, consultation topics, property type, kavling code, building type, name, notes.
- **General:** Includes consultation type (general), name, notes only.
- **Pabuaran:** Blocked — submit button disabled, locked notice displayed.

#### 2.1.3 Form Validation Rules

| Field | Rule | Error Key |
|---|---|---|
| `name` | Required; trimmed length > 0 | `form.nameRequired` |
| `name` | Trimmed length ≤ 100 chars | `form.nameTooLong` |
| `consultationCategories` | Min 1 required when `projectId === "dehir"` | `form.topicRequiredForDehir` |
| Topic selection | Max 3 topics simultaneously | `form.topicLimitReached` (inline alert) |

#### 2.1.4 Dehir-Lock for Pabuaran

The Pabuaran project card in the form is rendered as a non-interactive `<div aria-disabled="true">`.
When `?project=pabuaran` arrives via URL, `deriveInitialProjectId()` silently maps it to `"general"`,
and an inline amber notice is shown. The submit button is never activated for Pabuaran context.

#### 2.1.5 Metadata

```typescript
// src/app/[locale]/interest/page.tsx
export async function generateMetadata({ params }) {
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("interestTitle"),        // "Formulir Minat & Konsultasi — Celestia"
    description: t("interestDescription"),
    alternates: buildAlternates("/interest", locale) ?? undefined,
    openGraph: { ... },
  };
}
```

Both `meta.interestTitle` and `meta.interestDescription` keys exist in both `id.json` and `en.json`.

### 2.2 Navbar Link Integrity

The Navbar already renders four links: `/${locale}`, `/${locale}/projects`,
`/${locale}/interest`, `/${locale}/contact`. The interest page exists; the contact page
must also be verified to exist at `src/app/[locale]/contact/page.tsx`.

The Navbar WhatsApp CTA uses `<WhatsAppButton locale={locale} context="homepage">`, which calls
`buildWhatsAppUrl(siteConfig.contact.whatsappMessageId/En)` — single source of truth satisfied.

---

## 3. WS-02: Security Audit (P1)

### 3.1 Audit Scope and Process

The audit covers two primary surfaces:
1. **Working tree** — all files currently on disk (tracked + untracked + ignored).
2. **HEAD-committed files** — files in the most recent commit on the current branch (`poc-static-export`).

**Critical Safety Boundary:**
Git history is explicitly out of scope; no rebasing, `git filter-branch`, or BFG history rewrites.
No data files shall be deleted without explicit Owner/Management approval.

### 3.2 Sensitive Data Categories

| Category | Detection Pattern | Expected Result | Action / Note |
|---|---|---|---|
| Raw pricing figures | Numeric values in `dehir-units.json` price fields | All `null` | Verified: all units have `price: null` |
| Historical pricing in HEAD | `src/data/internal/dehir-historical-pricing.json` | File is TRACKED in HEAD | Must be audited; confirm not bundled in client/server code |
| Historical pricing fields rendered | `historicalPricing` values in page output | Not rendered | Verified: only in internal types/data, not imported in UI |
| WhatsApp number candidates | Strings matching `628\d{9,}` or `08\d{9,}` outside `site.ts` | Only in `site.ts` and `dehir.json` | Verified canonical number: `6282299237825` |
| API keys / secrets | `NEXT_PUBLIC_*` values, private tokens | None in repository | Verified: no hardcoded secrets |
| `.env` file contents | `.env.local`, `.env*.local` in repo | Gitignored | Verified: `.env*` covered in root `.gitignore` |
| Untracked internal directories | `src/data/internal/` | Needs `.gitignore` rule | Add `src/data/internal/` to `.gitignore` to prevent future commits |

### 3.3 Git Tracking vs .gitignore Nuance (Critical Architectural Context)

Adding a directory or pattern (e.g., `src/data/internal/`) to `.gitignore` **only instructs Git to ignore untracked files**.
It **does NOT** retroactively untrack, delete, or hide files that have already been committed in Git history (such as `dehir-historical-pricing.json` in HEAD).

**Operational Directive:**
- The Security Audit shall explicitly inspect `src/data/internal/dehir-historical-pricing.json`.
- The Developer SHALL NOT rewrite Git history or delete `dehir-historical-pricing.json` without explicit authorization.
- The Developer SHALL verify that `dehir-historical-pricing.json` is never imported into any application bundle (`git grep "dehir-historical-pricing"` returns 0 results in `src/app/`, `src/components/`, `src/features/`, `src/services/`).
- The Developer SHALL add `src/data/internal/` to `.gitignore` to prevent future accidental file additions.
- The Security Report shall document the presence of this file in HEAD for Management review before any public repository sharing.

### 3.4 HistoricalBrochurePricing Safety Contract

The `HistoricalBrochurePricing` interface exists in `src/types/property.ts` as an internal reference type.
No page component reads or renders the `historicalPricing` field. The safety contract:

```typescript
// UnitDetailV2.tsx — renders price row:
unit.price != null ? formatRupiah(unit.price) : labels.contactForPrice
// unit.historicalPricing is never accessed in any component
```

Verification: grep for `historicalPricing` in `src/app/` and `src/components/` — only allowed in `src/types/property.ts` and `src/data/internal/`.

### 3.5 .gitignore Required Entries

```gitignore
# Environment variables — must be present
.env*.local
.env.local

# Editor/OS artifacts — verify present
.DS_Store
*.local

# Internal source photos & internal data — not for public export
/src/img/
src/data/internal/
```

### 3.6 Findings Report Structure

The audit produces `docs/SECURITY-AUDIT.md` with sections:
- Audit Date, Branch, and Commit Hash
- Surfaces Inspected (Working tree, HEAD, `.gitignore`)
- Findings per category: Pass / Risk / Fail (including `src/data/internal/` assessment)
- Remediation Actions Taken (e.g., `.gitignore` updates)
- Items Requiring Owner / Management Decision

---

## 4. WS-03: Business Content Validation

### 4.1 Project Status Invariants

| Project | `status` field | Allowed to change? |
|---|---|---|
| `dehir` | `"active"` | No (do not set to coming-soon) |
| `pabuaran` | `"coming-soon"` | **No** (must remain coming-soon for V1) |

The constraint is enforced at the data level in `src/data/projects/pabuaran.json`.

### 4.2 Unit Data Consistency

All 9 Dehir units (A1–A4, B1–B5) in `dehir-units.json`:

```json
{
  "unitCode": "A1",
  "projectId": "dehir",
  "unitType": "kavling",
  "landArea": 86,
  "dimensions": { "width": 6, "length": 14 },
  "price": null,
  "status": "unknown"
}
```

Invariants:
- `price` must be `null` for all units
- `status` must be `"unknown"` for all units
- `historicalPricing` must be absent (not present in JSON)
- `landArea` × no rounding — displayed as raw integer (e.g., `86 m²`)
- `dimensions.width × dimensions.length` displayed verbatim (e.g., `6 × 14 m`)

### 4.3 Unit Price Display Logic

```typescript
// UnitDetailV2.tsx — price row in specs table
<dd>
  {unit.price != null ? formatRupiah(unit.price) : labels.contactForPrice}
</dd>
// labels.contactForPrice = t("unit.contactForPrice")
// id.json: "Hubungi Marketing"
// en.json: "Contact Marketing"
```

This covers Requirement 5.3 — no price displayed when `price: null`.

### 4.4 Placeholder Components vs. Curated Assets for Content

| Content Type | Component Used | Status / Source |
|---|---|---|
| Photo gallery | `<ProjectGallery>` | **Active**: 7 curated documentation photos in `public/images/projects/dehir/` via `src/data/media/dehir-gallery.ts` (integrated in Task P2) |
| Site plan | `<SitePlanPanel>` with fallback | **Placeholder**: Official SVG pending architect verification |
| Floor plans | `<Placeholder>` inside building type cards | **Placeholder**: No verified CAD/floor plans available |
| Video section | `<Placeholder type="video">` | **Placeholder**: No video asset available |

**Asset Preservation Rule:**
The 7 curated photos in `public/images/projects/dehir/` (integrated in Task P2) shall be preserved and continue to be rendered in the Dehir gallery. The video section shall remain a placeholder. No additional photos or real video embeds shall be introduced without explicit Owner confirmation.

---

## 5. WS-04: Static Export and Apache Configuration (P1 — Pending Server Verification)

### 5.1 Build Verification & Task 0 Pre-flight

Before starting any workstream tasks, a pre-flight build check (Task 0) must establish a known-good baseline:
```bash
# Task 0: Pre-flight baseline verification
git branch --show-current   # Must confirm active branch
git status --short          # Must verify working tree state
npx tsc --noEmit            # 0 errors required
npm run lint                # 0 errors required
npm run build               # Must produce clean /out/ directory
```

Known P0 issue: `src/app/[locale]/projects/[slug]/units/page.tsx` may contain leading dash
characters before the first import statement. These must be removed before Turbopack can parse
the file as a valid ECMAScript module. After removal, all build commands must pass cleanly.

### 5.2 .htaccess Design (Pending Server & Build Output Verification)

Target location: `/out/.htaccess` (served from Apache DocumentRoot pointing to `/out/` on Rumahweb).

> [!IMPORTANT]
> **Pending Verification on Rumahweb Environment:**
> 1. **404 Page Target:** Next.js static export with `next-intl` generates localized 404 pages (e.g. `/out/id/404/index.html` or `/out/404.html`). The exact path used in `ErrorDocument 404` must be verified against the actual `/out/` build output.
> 2. **RewriteRule Concatenation:** `RewriteRule ^(id|en)/(.*)$ /$1/$2/index.html [L]` must be verified on Rumahweb Apache to ensure it does not append duplicate `index.html` when a clean file or trailing slash already exists.

```apache
# ── Celestia V1 — Apache Configuration ──────────────────────────────────
# Static export from Next.js (output: "export")
# Note: Rules marked PENDING VERIFICATION must be tested post-build on Rumahweb.

Options -Indexes
RewriteEngine On

# 1. Redirect site root to default locale (id)
RewriteRule ^/?$ /id/ [R=302,L]

# 2. Locale-prefix rewrite for clean static file serving (PENDING VERIFICATION)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(id|en)/(.+[^/])$ /$1/$2/index.html [L]

# ── Cache-Control Headers ────────────────────────────────────────────────

# Long-lived cache for versioned static assets (JS, CSS, fonts, images)
<FilesMatch "\.(js|css|woff2|woff|ttf)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

<FilesMatch "\.(png|jpg|jpeg|webp|svg|ico|gif)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

# No-cache for HTML files (always revalidate to pick up new deploys)
<FilesMatch "\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>

# ── Custom Error Pages (PENDING POST-BUILD PATH VERIFICATION) ────────────
# Verify actual output: if /out/404.html exists use /404.html, otherwise /id/404/index.html
ErrorDocument 404 /404.html

# ── Security Headers (baseline) ─────────────────────────────────────────
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
```

**Prerequisite:** Apache `mod_rewrite` and `mod_headers` must be enabled on the Rumahweb server.
The deployment checklist includes a step to verify this with the hosting provider.

### 5.3 Deployment Checklist Structure

The checklist is produced as `docs/DEPLOYMENT-CHECKLIST.md`:

```markdown
# Deployment Checklist — Celestia V1

## Pre-Deployment Verification
- [ ] Confirm seoConfig.indexingEnabled = false in src/config/site.ts
- [ ] Confirm siteConfig.contact.whatsappNumber = "6282299237825" in src/config/site.ts
- [ ] Run npx tsc --noEmit → 0 errors
- [ ] Run npm run lint → 0 errors
- [ ] Confirm .env.local is NOT committed (check git status)

## Build
- [ ] Run: npm run build
- [ ] Verify /out/ directory was created and contains id/ and en/ subdirectories
- [ ] Verify /out/ does NOT contain any .env* files

## File Upload
- [ ] Upload all contents of /out/ to the server DocumentRoot (not the /out/ folder itself)
- [ ] Upload .htaccess to the server DocumentRoot root

## Server Configuration
- [ ] Confirm Apache mod_rewrite is enabled on server
- [ ] Confirm Apache mod_headers is enabled on server
- [ ] Place .htaccess in DocumentRoot root
- [ ] Verify .htaccess file permissions (644)

## Post-Deployment Smoke Tests
- [ ] Open https://[domain]/ → redirects to https://[domain]/id/
- [ ] Open https://[domain]/id/ → Homepage renders
- [ ] Open https://[domain]/en/ → Homepage renders in English
- [ ] Open https://[domain]/id/interest → Interest Form renders
- [ ] Open https://[domain]/id/contact → Contact Page renders
- [ ] Open https://[domain]/id/projects/dehir → Exploration page renders
- [ ] Click WhatsApp CTA → Opens wa.me in new tab
- [ ] Open https://[domain]/nonexistent → Custom 404 page shown

## SEO Activation (Do After Domain Confirmed by Owner)
- [ ] Set seoConfig.siteUrl = "https://[confirmed-domain]" in src/config/site.ts
- [ ] Set seoConfig.indexingEnabled = true in src/config/site.ts
- [ ] Run npm run build again
- [ ] Re-upload /out/ to server
- [ ] Verify https://[domain]/sitemap.xml returns a non-empty sitemap
- [ ] Verify https://[domain]/robots.txt returns Allow: /
```

### 5.4 SEO Infrastructure (Ready-to-Activate)

The SEO helpers in `src/config/site.ts` are already correctly implemented:
- `buildAlternates(path, locale)` → returns `undefined` when `seoConfig.siteUrl === ""`
- `buildPageUrl(path, locale)` → returns `""` when `seoConfig.siteUrl === ""`
- `sitemap.ts` → returns `[]` when `seoConfig.siteUrl === ""`
- `robots.ts` → returns `Disallow: /` intent (meta robots noindex) when `indexingEnabled === false`

No code changes needed for SEO infrastructure; only configuration changes in `src/config/site.ts`
are required at activation time.

---

## 6. WS-05: i18n Fixes, Language Switcher, Responsive Audit, Docs (P2)

### 6.1 Hardcoded i18n Strings — Comprehensive Inventory

Audit of V2 components (`ExplorationV2.tsx`, `UnitCatalogV2.tsx`, `UnitDetailV2.tsx`) reveals the following hardcoded strings and un-translated labels that bypass `useTranslations()`:

#### UnitCatalogV2.tsx

| Location | Hardcoded String | Replacement Key | Context / Resolution |
|---|---|---|---|
| Specs grid header | `"Luas Tanah"` | `unit.landArea` | Translate based on active locale |
| Specs grid header | `"Dimensi (L×P)"` | `unit.dimensions` | Translate based on active locale |
| Specs grid header | `"Harga"` | `unit.price` | Translate based on active locale |
| Specs grid header | `"Status"` | `unit.status` | Translate based on active locale |
| Breadcrumb label | `locale === "en" ? "Units" : "Unit"` | Pass as label prop | Thread from page wrapper |
| H1 header | `` `Katalog Unit — ${project.fullName}` `` | `unit.catalogTitle` | Compose via translated key |
| Back link | `"Info Proyek & Denah"` | `unit.backToProjectOverview` | Add to id.json & en.json |
| Unit alt & label | `` `Kavling ${unit.unitCode}` `` | `unit.kavlingLabel` | Parameterized label key |
| Filter count | `` `Menampilkan ${x} dari ${y} unit` `` | `unit.showingCount` | Add ICU `{count}` and `{total}` |
| Measurement disclaimer | `"Catatan Ukuran Kavling: Luas tanah dan dimensi..."` | `project.kavlingMeasurementDisclaimer` | Shared key in id/en.json |

#### ExplorationV2.tsx

| Location | Hardcoded String | Replacement Key | Context / Resolution |
|---|---|---|---|
| Section title | `labels.unitKavlingTitle || "Eksplorasi Kavling"` | `labels.unitKavlingTitle` | Add translation key in page wrapper |
| Section subtitle | `labels.unitKavlingSubtitle || `${project.name} · Daftar Kavling Resmi`` | `labels.unitKavlingSubtitle` | Add translation key in page wrapper |
| Section filter count | `` `Menampilkan ${x} dari ${y} unit` `` | `unit.showingCount` | Reuse showingCount key |
| Measurement disclaimer | `"Catatan Ukuran Kavling: Luas tanah dan dimensi..."` | `project.kavlingMeasurementDisclaimer` | Shared key in id/en.json |
| UnitCard label | `<p className="text-xs text-neutral-400">Kavling</p>` | `unit.kavlingLabel` | Thread kavling label to UnitCard |
| UnitCard specs | `"Dimensi"` / `"Harga"` / `"Luas"` | `unit.dimensions` / `unit.price` / `unit.landArea` | Thread translated labels |
| Eyebrow tags | `"Spesifikasi Bangunan"` / `"Akses & Lingkungan"` | `project.buildingSpecs` / `project.accessEnv` | Add translation keys |
| Empty filter state | `"Tidak ada unit dengan status terpilih."` | `unit.noFilterMatch` | Add to id.json & en.json |

#### UnitDetailV2.tsx

| Location | Hardcoded String | Replacement Key | Context / Resolution |
|---|---|---|---|
| H1 label | `Kavling (${unit.unitCode})` | `unit.kavlingDetailTitle` | Parameterized key |
| Measurement disclaimer | `"Catatan Ukuran Kavling: Luas tanah dan dimensi..."` | `project.kavlingMeasurementDisclaimer` | Shared key in id/en.json |
| Building options title | `locale === "en" ? "House Building Options" : "Pilihan Desain Rumah"` | `unit.buildingOptionsTitle` | Add to id.json & en.json |
| Building options notice | Hardcoded string fallback | `unit.buildingOptionsNotice` | Verified present in id/en.json line 93 |

### 6.2 i18n Fix Strategy

All fixes follow the established pattern:

**Step 1 — Add keys to both message files simultaneously:**

```json
// src/i18n/messages/id.json additions
{
  "unit": {
    "kavlingLabel": "Kavling",
    "showingCount": "Menampilkan {count} dari {total} unit",
    "backToProjectOverview": "Info Proyek & Denah",
    "buildingOptionsTitle": "Pilihan Desain Rumah",
    "catalogTitle": "Katalog Unit",
    "noFilterMatch": "Tidak ada unit dengan status terpilih."
  },
  "project": {
    "unitKavlingTitle": "Eksplorasi Kavling",
    "unitKavlingSubtitle": "{projectName} · Daftar Kavling Resmi",
    "kavlingMeasurementDisclaimer": "Catatan Ukuran Kavling: Luas tanah dan dimensi (lebar × panjang) merupakan perkiraan berdasarkan data pemasaran awal. Dimensi merepresentasikan perkiraan lebar muka dan panjang rata-rata. Status ketersediaan seluruh unit saat ini belum dikonfirmasi resmi oleh pengembang."
  }
}

// src/i18n/messages/en.json additions (matching keys, English translations)
{
  "unit": {
    "kavlingLabel": "Plot",
    "showingCount": "Showing {count} of {total} units",
    "backToProjectOverview": "Project Overview & Map",
    "buildingOptionsTitle": "House Building Options",
    "catalogTitle": "Unit Catalog",
    "noFilterMatch": "No units match the selected status filter."
  },
  "project": {
    "unitKavlingTitle": "Plot Exploration",
    "unitKavlingSubtitle": "{projectName} · Official Plot Directory",
    "kavlingMeasurementDisclaimer": "Plot Measurement Note: Land area and dimensions (width × length) are estimates based on preliminary marketing materials. Dimensions represent estimated front width and average length. Plot availability status is currently unconfirmed by the developer."
  }
}
```

**Step 2 — Thread labels prop through Server Component page wrappers:**
V2 components receive a `labels` prop object from their Server Component page wrappers (`[slug]/page.tsx`, `units/page.tsx`, `[unitCode]/page.tsx`). The page wrapper calls `getTranslations()` and passes the resolved strings.

### 6.3 Language Switcher

**Status: Already implemented** in `src/components/layout/LanguageSwitcher.tsx`.

The component:
- Is a Client Component (`"use client"`) with `<Suspense>` wrapper for static export compatibility.
- Uses `usePathname()` to read the current path.
- Replaces the first path segment (locale prefix) with the target locale.
- Preserves all subsequent path segments including `[slug]` and `[unitCode]`.
- Preserves query parameters via `useSearchParams()`.

**Verification task:** Confirm the component is imported in `Navbar.tsx` ✓ and
`NavbarMobileMenu.tsx` (verify).

Path preservation logic:
```typescript
// getTargetHref("en") on path "/id/projects/dehir/units/A1"
// → splits to ["id", "projects", "dehir", "units", "A1"]
// → replaces segments[0]: ["en", "projects", "dehir", "units", "A1"]
// → returns "/en/projects/dehir/units/A1"
```

### 6.4 Responsive Audit Checklist

Viewports to test: `320px`, `375px`, `768px`, `1024px`, `1440px`.

| Page | Critical checks |
|---|---|
| `/[locale]/interest` | No horizontal overflow; all 3 form sections stack cleanly; project cards wrap at ≤480px |
| `/[locale]/projects/dehir` | 2-col unit grid collapses to 1-col at 640px; sidebar stacks below on mobile |
| `/[locale]/projects/dehir/units` | 3-col grid → 2-col → 1-col at breakpoints |
| `/[locale]/projects/dehir/units/[code]` | 2-col detail layout stacks to 1-col at 1024px |
| Navbar | Mobile hamburger visible at `md:` breakpoint; desktop links visible from `md:` |

### 6.5 Documentation Updates

Files to update after V1 implementation:

| File | Change Required |
|---|---|
| `docs/PROJECT-STRUCTURE.md` | Add `src/features/contact/InterestForm.tsx`, `src/features/contact/WhatsAppButton.tsx`, new `src/data/media/` directory, `src/services/index.ts` |
| `docs/DEVELOPMENT-GUIDE.md` | Update "Halaman Baru" section to reflect interest and contact pages as implemented; note `proxy.ts` naming for middleware |
| `README.md` | Update implemented feature checklist; mark Interest Form, Contact Page, Bilingual Routing, Language Switcher as "Implemented"; mark Services Layer as "Implemented" |
| `docs/SECURITY-AUDIT.md` | New file — security audit findings report |
| `docs/DEPLOYMENT-CHECKLIST.md` | New file — deployment checklist |

The following historical documents must NOT be deleted or modified:
`docs/consultation/`, `docs/proposals/celestia-batch-3-proposal.md`, `docs/proposals/celestia-cleanup-proposal.md`,
`docs/reports/celestia-existing-implementation-audit.md`, `docs/proposals/celestia-architecture-docs-proposal.md`.

---

## Error Handling

### 7.1 Build-Time Errors

| Error Type | Location | Handling |
|---|---|---|
| TypeScript type error | Any `.ts`/`.tsx` file | Fix type error; do not use `// @ts-ignore` |
| Missing translation key | `useTranslations()` call | Add key to both `id.json` and `en.json` simultaneously |
| Leading dash parse error | `units/page.tsx` | Remove leading dash characters before first import |
| Missing static param | `generateStaticParams()` | Ensure all dynamic routes export `generateStaticParams` |

### 7.2 Runtime Error Boundaries

- `src/app/[locale]/error.tsx` — catches all runtime errors under the locale layout.
- `src/app/not-found.tsx` — root-level 404 (before locale detection).
- `src/app/[locale]/not-found.tsx` — locale-aware 404 (bilingual).

Error boundary is a Client Component (`"use client"`) as required by Next.js App Router.

### 7.3 Form Validation Error Display

```
User submits form with empty name
    ↓
validate() sets errors.name = labels.nameRequired
    ↓
Input renders:
  <p role="alert" id="name-error">{errors.name}</p>
Input has: aria-describedby="name-error" aria-invalid="true"
    ↓
WhatsApp URL is NOT opened
```

### 7.4 WhatsApp Placeholder Guard

```typescript
if (isWhatsAppNumberPlaceholder()) {
  // Render <span aria-disabled="true"> instead of <a href="...">
  // CTA buttons show "WhatsApp belum aktif" / "WhatsApp not yet active"
  return; // handleSubmit returns early
}
```

### 7.5 Static Export Edge Cases

| Scenario | Handling |
|---|---|
| `useSearchParams()` in Client Component | Wrapped in `<Suspense>` to avoid static prerender bail |
| `usePathname()` in LanguageSwitcher | Wrapped in `<Suspense>` with static fallback |
| Dynamic route without `generateStaticParams` | Build fails — all dynamic routes must export `generateStaticParams` |

---

## Components and Interfaces

### 8.1 Key Component Interfaces

```typescript
// src/features/contact/InterestForm.tsx
export interface InterestFormLabels {
  title: string; subtitle: string; projectSectionTitle: string;
  projectSelectLabel: string; projectDehir: string; projectPabuaran: string;
  projectGeneral: string; consultationCategoryTitle: string;
  consultationCategorySubtitle: string; catPrice: string; catAvailability: string;
  catSurvey: string; catBuilding: string; catDesign: string; catOther: string;
  preferencesTitle: string; propertyTypeLabel: string; kavlingOnly: string;
  kavlingBuilding: string; propertyUndecided: string; kavlingCodeLabel: string;
  kavlingCodePlaceholder: string; kavlingCodeNote: string; buildingTypeLabel: string;
  type1Lantai: string; type1LantaiPromo: string; undecided: string;
  clientDetailsTitle: string; name: string; namePlaceholder: string;
  notes: string; notesPlaceholder: string; submitViaWhatsApp: string;
  directWhatsApp: string; clientNotice: string; waDisabled: string;
  nameRequired: string; nameTooLong: string; topicLimitReached: string;
  topicRequiredForDehir: string; pabuaranLocked: string; generalConsultationNote: string;
}

export interface InterestFormProps {
  locale: string;
  labels: InterestFormLabels;
  availableUnitCodes?: string[];  // Defaults to ["A1","A2","A3","A4","B1","B2","B3","B4","B5"]
}
```

### 8.2 siteConfig Helper Functions

```typescript
// All WhatsApp URL construction must go through these helpers:
buildWhatsAppUrl(message: string): string
buildProjectWhatsAppMessage(projectFullName: string, locale: "id" | "en"): string
buildUnitWhatsAppMessage(unitCode: string, projectFullName: string, locale: "id" | "en"): string
isWhatsAppNumberPlaceholder(): boolean  // Returns true if number contains "X"
buildAlternates(path: string, currentLocale: string): Metadata["alternates"] | undefined
buildGoogleMapsUrl(location?: ProjectLocation): string | undefined
```

## Data Models

```typescript
// src/types/property.ts — InterestFormData (client-side only, never serialized to server)
export interface InterestFormData {
  projectId?: string;                // "dehir" | "pabuaran" | "general"
  consultationCategories?: string[]; // Max 3; required for Dehir
  name?: string;                     // Required for submit; max 100 chars
  propertyType?: "kavling-only" | "kavling-building" | "undecided";
  kavlingCode?: string;              // "A1"–"B5" or "" (optional)
  buildingType?: "type-1" | "type-1-promo" | "undecided";
  notes?: string;                    // Max 1000 chars; optional
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a
system — essentially, a formal statement about what the system should do. Properties serve as the
bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Property Reflection Notes:** Properties 2.3 and 2.6/2.7 were merged since WhatsApp URL
construction subsumes locale-specific rendering validation. Properties 5.1 and 5.2 were merged
into one universal data invariant. Properties 10.1–10.4 were consolidated into one SEO
configuration property. Properties 7.1 and 7.2 were merged into one path-preservation property.
Properties 4.3 and 4.4 were merged into the data safety invariant.

---

### Property 1: WhatsApp URL Construction Round-Trip

*For any* valid `InterestFormData` where `name` is non-empty and `projectId` is `"dehir"` or
`"general"`, calling `buildMessage(formData, labels, categories, locale)` followed by
`buildWhatsAppUrl(message)` must produce a URL that (a) starts with
`https://wa.me/6282299237825?text=`, and (b) when the `text` parameter is decoded via
`decodeURIComponent`, contains the submitted name value.

**Validates: Requirements 2.3, 11.1, 11.2**

---

### Property 2: Empty-Name Submission Produces No WhatsApp URL

*For any* form state where `name` is blank (empty string or whitespace-only string of any length),
calling `validate()` must return `false` and `handleSubmit` must not invoke `window.open` with any
`wa.me` URL.

**Validates: Requirements 2.9**

---

### Property 3: Bilingual Form Rendering — All Labels Present

*For any* locale value in `["id", "en"]`, rendering `<InterestForm>` with labels loaded from the
corresponding messages file must result in a form where every visible text element (title, section
headers, button text, placeholder text) is non-empty and matches a value from the respective
messages file, with no hardcoded Indonesian strings appearing when `locale === "en"`.

**Validates: Requirements 2.6, 2.7, 6.1, 6.2**

---

### Property 4: i18n Key Parity Between Locales

*For any* key path that exists in `src/i18n/messages/id.json`, the same key path must also exist
in `src/i18n/messages/en.json` with a non-null, non-empty string value, and vice versa. No key
may be present in one locale file but absent from the other.

**Validates: Requirements 6.3**

---

### Property 5: Dehir Unit Data Safety Invariant

*For any* unit object in `src/data/properties/dehir-units.json`, the `price` field must be `null`,
the `status` field must be `"unknown"`, and the `historicalPricing` field must be absent (not
present as a key in the object). Additionally, rendering any unit's detail page must not produce
HTML containing any numeric value derived from `HistoricalBrochurePricing` fields.

**Validates: Requirements 4.3, 4.4, 5.2**

---

### Property 6: Pabuaran Status Immutability

*For any* read of `src/data/projects/pabuaran.json`, the `status` field must equal `"coming-soon"`.
No code path triggered during a normal site build may change this value to `"active"`.

**Validates: Requirements 5.1**

---

### Property 7: Null-Price Unit Displays contactForPrice Label

*For any* `PropertyUnit` where `price` is `null`, rendering the unit detail page (via
`UnitDetailV2`) must display the value of `labels.contactForPrice` (i.e., the
`unit.contactForPrice` translation key) in the price row, and must not display any numeric price
figure or the string `"null"`.

**Validates: Requirements 5.3**

---

### Property 8: Language Switcher Path Preservation

*For any* current pathname of the form `/[locale]/[...path]` (e.g.,
`/id/projects/dehir/units/A1`), calling `getTargetHref(targetLocale)` inside `LanguageSwitcher`
must produce a path where (a) only the first path segment (locale prefix) changes to
`targetLocale`, and (b) all subsequent segments (`projects`, `dehir`, `units`, `A1`) are preserved
verbatim and in their original order.

**Validates: Requirements 7.1, 7.2**

---

### Property 9: SEO Infrastructure Configuration Property

*For any* state where `seoConfig.indexingEnabled === false` or `seoConfig.siteUrl === ""`:
(a) `buildAlternates()` must return `undefined`; (b) `sitemap()` must return an empty array `[]`;
(c) the page metadata `robots` field must resolve to `{ index: false, follow: false }`.

Conversely, *for any* state where `seoConfig.indexingEnabled === true` AND
`seoConfig.siteUrl` is a non-empty string, `buildAlternates(path, locale)` must return an object
containing a `canonical` URL and a `languages` object with keys `"id"`, `"en"`, and `"x-default"`,
each containing an absolute URL prefixed with `seoConfig.siteUrl`.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4**

---

### Property 10: WhatsApp Placeholder Disables All CTA Buttons

*For any* `WhatsAppButton` component rendered when `siteConfig.contact.whatsappNumber` contains
the character `"X"` (i.e., `isWhatsAppNumberPlaceholder()` returns `true`), the component must
render as a `<span>` element with `aria-disabled="true"` rather than an `<a>` element, and must
not produce a valid `href` attribute pointing to any `wa.me` URL.

**Validates: Requirements 11.4**

---

### Property 11: .htaccess Locale Redirect

*For any* valid `.htaccess` file produced for Celestia deployment, parsing it must find:
(a) a `RewriteEngine On` directive; (b) a `RewriteRule` that maps the site root path (`^/?$`)
to `/id/` with a redirect flag; (c) `FilesMatch` blocks for `*.js`, `*.css`, `*.woff2`,
`*.png`, `*.jpg`, `*.webp` with `max-age` ≥ `31536000`; and (d) a `FilesMatch` block for
`*.html` with `no-cache` cache control.

**Validates: Requirements 8.2, 8.4, 8.6**

---

## Testing Strategy

### Unit Tests (Example-Based)

Focus on specific, deterministic behaviors:

- **Interest Form validation:** Test that `validate()` returns `false` for empty name, name > 100 chars, and Dehir with no topics selected. Test that it returns `true` for valid inputs.
- **WhatsApp URL construction:** Test `buildWhatsAppUrl("Hello")` produces `https://wa.me/6282299237825?text=Hello`. Test `buildProjectWhatsAppMessage("Celestia Dehir", "id")` produces the expected template string with the project name substituted.
- **`isWhatsAppNumberPlaceholder()`:** Returns `true` when number contains `"X"`, `false` for the real number `"6282299237825"`.
- **`buildAlternates()`:** Returns `undefined` when `siteUrl = ""`. Returns object with correct locale URLs when `siteUrl` is set.
- **`buildGoogleMapsUrl()`:** Returns `undefined` when no `streetAddress` or `coordinates`. Returns correct search URL from address. Returns coordinates URL when `coordinates` present. Returns `googleMapsUrl` directly when set.
- **`sitemap()`:** Returns `[]` when `siteUrl = ""`. Returns entries for `/id/` and `/en/` root when `siteUrl` is set.
- **`robots()`:** Returns `allow: "/"` rule without `sitemap` key when `indexingEnabled = false`. Returns with `sitemap` key when `indexingEnabled = true` and `siteUrl` set.

### Property-Based Tests

Focus on universal invariants across generated inputs:

- **Property 1 (WhatsApp URL construction):** Use a generator for `InterestFormData` with valid non-empty names and projectId in `["dehir", "general"]`. Assert URL prefix and decoded content invariants.
- **Property 2 (Empty-name guard):** Generate whitespace strings of arbitrary length. Assert `validate()` returns `false` and `submittedUrl` remains `null`.
- **Property 4 (i18n key parity):** Enumerate all leaf key paths in `id.json` and assert each exists in `en.json` with a non-empty string value, and vice versa.
- **Property 5 (Unit data safety):** Enumerate all units in `dehir-units.json`. Assert `price === null`, `status === "unknown"`, `historicalPricing` absent.
- **Property 8 (Language switcher path preservation):** Generate random path strings of the form `/id/[a-z]+(/[a-z0-9]+)*`. Assert `getTargetHref("en")` produces the same path with only the locale segment changed.
- **Property 9 (SEO configuration):** Test with `siteUrl = ""` and `siteUrl = "https://example.com"` × `indexingEnabled = true/false`. Assert invariants for `buildAlternates`, `sitemap`, robots metadata.
- **Property 10 (WA placeholder disables buttons):** Generate `whatsappNumber` strings containing `"X"`. Assert `WhatsAppButton` renders `<span aria-disabled="true">` not `<a>`.
- **Property 11 (.htaccess locale redirect):** Parse the `.htaccess` text as a string. Assert presence of `RewriteEngine On`, locale redirect rule for `/`, and cache-control directives for each required file pattern.

### Smoke Tests / Manual Verification

One-time checks run before deployment:

- `npm run build` completes without errors → `/out/` directory created.
- `npx tsc --noEmit` → 0 errors.
- `npm run lint` → 0 errors.
- `/out/id/interest/index.html` exists after build.
- `/out/en/interest/index.html` exists after build.
- `/out/id/contact/index.html` exists after build.
- Grep `src/app/ src/components/ src/features/` for `historicalPricing` → only in `src/types/property.ts`.
- Grep `src/` (excluding `site.ts`) for string literal `6282299237825` → 0 results.
- Grep `src/app/ src/components/` for `wa.me` → 0 results (all usage goes through `buildWhatsAppUrl`).
- `.env.local` not tracked by git (`git status` shows untracked or gitignored).
- Security audit findings report (`docs/SECURITY-AUDIT.md`) exists and covers all categories.
- Deployment checklist (`docs/DEPLOYMENT-CHECKLIST.md`) exists and covers all required sections.
