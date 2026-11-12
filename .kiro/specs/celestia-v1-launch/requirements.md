# Requirements Document

## Introduction

Celestia V1 Launch covers the final work required to bring the Celestia property promotion website to a reviewable, deployable state for PT Mitra Rahim Indonesia. The website is a fully static Next.js export with bilingual (Indonesian/English) support via next-intl, targeting prospective property buyers for the Dehir project (Jatiluhur, Bekasi).

Five workstreams are in scope:

- **WS-01** — Consultation Flow & Conversion: build the `/interest` page (WhatsApp-redirect form, bilingual, Dehir-locked).
- **WS-02** — Security & Data Protection: audit working-tree and HEAD-committed files for sensitive data exposure; verify `.gitignore` correctness; leave Git history untouched.
- **WS-03** — Business Content & Functional Validation: verify project statuses, unit data consistency, site plan placeholder accuracy, and photo/video placeholder integrity.
- **WS-04** — Production Readiness & Deployment: clean `npm run build` (static export), author Apache `.htaccess`, produce staging/deployment checklist; SEO activation gated on domain confirmation.
- **WS-05** — UI/UX & Documentation Polish: fix hardcoded i18n strings in V2 components, responsive audit, language-switcher path-preservation, extract shared UI components, update README and docs.

Hard constraints throughout:
- Do NOT deploy to production or change DNS.
- Do NOT delete or overwrite the old website.
- Do NOT activate the Pabuaran project (status must remain `coming-soon`).
- Do NOT change the verified WhatsApp number (`6282299237825`) without a proven technical reason.
- Do NOT publish unconfirmed business data (prices, unit availability, coordinates, official site plans).
- Prioritize P0/P1 launch blockers over P2 polish.

---

## Glossary

- **Interest Form**: The client-side form at `/[locale]/interest` that collects visitor name, project/unit interest, and a free-text message, then opens `wa.me` with a pre-filled message. No data is stored server-side.
- **WhatsApp Redirect**: The mechanism of opening `https://wa.me/{number}?text={encodedMessage}` in a new browser tab. Implemented client-side only.
- **WA Number**: The verified WhatsApp marketing number stored in `siteConfig.contact.whatsappNumber` (`6282299237825`). Do not change unless a proven replacement is confirmed.
- **Static Export**: The Next.js build output mode (`output: "export"`) producing a fully static HTML/CSS/JS file tree in `/out/`.
- **Locale Routing**: next-intl prefix routing: all pages live under `/id/...` (Bahasa Indonesia default) and `/en/...` (English). Requests without a prefix redirect to `/id/`.
- **Dehir**: The active property project (`status: "active"`, `slug: "dehir"`). The only project open for active consultation via the Interest Form.
- **Pabuaran**: The coming-soon project (`status: "coming-soon"`, `slug: "pabuaran"`). Must remain locked — no active consultation, no unit data.
- **Hardcoded i18n String**: A UI string written directly in a component file instead of being read from `src/i18n/messages/id.json` or `en.json` via `useTranslations()`. These strings display only in one language regardless of active locale.
- **Working Tree**: All files currently on disk in the repository, including untracked and unstaged changes. Excludes Git history.
- **HEAD-committed Files**: Files that have been committed to the current branch. Distinct from working-tree-only or gitignored files.
- **htaccess**: An Apache server configuration file (`.htaccess`) placed in the static export root to control redirects, custom error pages, and cache headers.
- **Deployment Checklist**: A Markdown document listing every manual step required to move the static export to a staging or production server.
- **P0**: Critical launch blocker that prevents site build, causes fatal runtime exceptions, or breaks core conversion funnels (e.g., Build Integrity in `units/page.tsx` or broken `/interest` Consultation Flow and WhatsApp redirect).
- **P1**: High-priority launch readiness requirement that must be validated prior to launch (Security & data protection audit, business content invariants verification, static export artifacts & deployment documentation).
- **P2**: Quality-of-life polish and documentation maintenance that does not block launch (e.g., i18n hardcoded strings, responsive refinements, README/docs currency).
- **UI V2**: The active UI variant controlled by `uiConfig.uiVariant = "v2"` in `src/config/site.ts`. All new work targets V2.
- **siteConfig**: The global configuration object exported from `src/config/site.ts`, containing the WhatsApp number, SEO settings, and site metadata.
- **Native Form Controls**: Accessible native HTML form elements (`<input>`, `<select>`, `<textarea>`) styled with Tailwind CSS, as currently implemented in `InterestForm.tsx` (the unused primitives `Input.tsx`, `Select.tsx`, `Button.tsx` in `src/components/ui/` are dead code with zero consumers and are not used).

---

## Requirements

### Requirement 0 — Pre-flight Build Verification (P0 — Must Execute First)

**User Story:** As a developer, I want to confirm the current state of the codebase before starting any workstream, so that I work from a known-good baseline and do not mask pre-existing failures.

#### Acceptance Criteria

1. BEFORE beginning any workstream task, THE Developer SHALL run `npx tsc --noEmit` and confirm zero TypeScript errors.
2. BEFORE beginning any workstream task, THE Developer SHALL run `npm run lint` and confirm zero lint errors.
3. BEFORE beginning any workstream task, THE Developer SHALL run `npm run build` and confirm a clean static export is produced in `/out/`.
4. THE Developer SHALL confirm the active branch is `poc-static-export` via `git branch --show-current`.
5. THE Developer SHALL confirm `git status` shows no unexpected unstaged changes before beginning.
6. IF any pre-flight check fails, THE Developer SHALL document the failure and fix it before proceeding — no workstream task SHALL be started against a broken build.

---

### Requirement 1 — Build Integrity (P0)

**User Story:** As a developer, I want the project to produce a clean `npm run build` output so that the static export is ready for deployment.

#### Acceptance Criteria

1. WHEN `npm run build` is executed, THE Build System SHALL complete without errors and produce a valid static export in the `/out/` directory.
2. WHEN `npx tsc --noEmit` is executed, THE TypeScript Compiler SHALL report zero type errors.
3. WHEN `npm run lint` is executed, THE ESLint Runner SHALL report zero lint errors.
4. THE Build System SHALL produce output mode `export` as defined in `next.config.ts`, generating static HTML files for all locale-prefixed routes.
5. IF the file `src/app/[locale]/projects/[slug]/units/page.tsx` contains leading dash characters before the first import statement, THEN THE Developer SHALL remove those characters so that Turbopack can parse the file as a valid ECMAScript module.

---

### Requirement 2 — Interest Form Page (P0 — WS-01 Launch Blocker)

**User Story:** As a prospective buyer, I want to submit my name, project interest, and a message via a simple form that opens WhatsApp, so that I can reach the marketing team without the website storing any of my data.

#### Acceptance Criteria

1. THE Website SHALL provide a page at the route `/[locale]/interest` (accessible as `/id/interest` and `/en/interest`) that renders the Interest Form.
2. THE Interest Form SHALL collect exactly three user inputs: visitor name (text, required), unit interest selection (select, required for Dehir), and a free-text message/notes field (textarea, optional).
3. WHEN a visitor submits the Interest Form, THE Interest Form SHALL open `https://wa.me/6282299237825?text={encodedMessage}` in a new browser tab, where `{encodedMessage}` is a URL-encoded pre-filled message composed from the form values.
4. THE Interest Form SHALL NOT transmit any form data to a server, database, or third-party analytics endpoint — all processing is client-side only.
5. THE Interest Form SHALL NOT introduce new external UI component library dependencies. The existing implementation uses native HTML elements (`<input>`, `<select>`, `<textarea>`) styled with Tailwind CSS — this approach is correct and SHALL be preserved. The `Input.tsx`, `Select.tsx`, and `Button.tsx` files in `src/components/ui/` have zero consumers in the codebase and SHALL NOT be forced into the form implementation, as doing so would cause regressions in a form that is already functional. *(Correction applied: original requirement was inaccurate — see KIRO_QUICKPLAN_REVIEW.md CRIT-02)*
6. WHEN the active locale is `id`, THE Interest Form SHALL render all labels, placeholders, and button text using translation keys from `src/i18n/messages/id.json`.
7. WHEN the active locale is `en`, THE Interest Form SHALL render all labels, placeholders, and button text using translation keys from `src/i18n/messages/en.json`.
8. WHEN the Pabuaran project is selected in the project selector, THE Interest Form SHALL display a locked notice (translated) indicating that Pabuaran is not yet open for active consultation, and SHALL disable the WhatsApp submit button.
9. WHEN the visitor name field is left empty and the visitor activates the submit action, THE Interest Form SHALL display an inline validation message (translated) and SHALL NOT open the WhatsApp URL.
10. THE Interest Form page SHALL include bilingual `<title>` and `<meta name="description">` metadata using the existing `form.interestTitle` and `form.interestDescription` translation keys.
11. THE Interest Form SHALL be accessible: all interactive controls SHALL have associated `<label>` elements, and the submit button SHALL meet the existing 44px minimum touch-target height defined in the Button component.

---

### Requirement 3 — Navbar Navigation Integrity (P0 — WS-01 Launch Blocker)

**User Story:** As a visitor, I want all Navbar links to lead to functioning pages so that I never encounter a 404 when navigating from the top menu.

#### Acceptance Criteria

1. WHEN a visitor clicks the "Formulir Minat / Interest Form" Navbar link, THE Navbar SHALL navigate to `/[locale]/interest`, which SHALL return a valid page (HTTP 200 for static export equivalents).
2. WHEN a visitor clicks the "Hubungi / Contact" Navbar link, THE Navbar SHALL navigate to `/[locale]/contact`, which SHALL return a valid page.
3. THE Navbar WhatsApp CTA button SHALL be enabled and SHALL open `https://wa.me/6282299237825?text={encodedMessage}` in a new browser tab, using the homepage-context message defined in `siteConfig.contact.whatsappMessageId` (locale `id`) or `whatsappMessageEn` (locale `en`).

---

### Requirement 4 — Security & Data Protection Audit (P1 — WS-02)

**User Story:** As the project coordinator, I want an audit of the working tree and HEAD-committed files confirming no sensitive data (pricing history, secrets, or unconfirmed business data) is exposed in the repository, so that the site can be shared publicly without risk.

#### Acceptance Criteria

1. THE Security Audit SHALL inspect all files in the working tree (tracked and untracked) and all files in the HEAD commit for the presence of: raw pricing figures, WhatsApp number candidates beyond the verified number, API keys, .env file contents, and paths to files outside .gitignore.
2. THE Security Audit SHALL explicitly inspect src/data/internal/dehir-historical-pricing.json and document that this file is ALREADY TRACKED in the HEAD commit containing historical marketing brochure pricing figures.
3. THE Security Audit findings report SHALL document that adding src/data/internal/ to .gitignore prevents future untracked files from being added, but DOES NOT automatically stop tracking or remove files already committed to Git history.
4. THE Security Audit and Developer SHALL NOT rewrite Git history (no rebase, no git filter-branch, no BFG) and SHALL NOT delete historical data files without explicit Owner and Management authorization.
5. THE Security Audit SHALL verify that HistoricalBrochurePricing data (defined in src/types/property.ts) is NOT imported or rendered in any public-facing page or component — it exists in the type definition only as an internal reference type.
6. THE Security Audit SHALL verify that src/data/properties/dehir-units.json does not contain any populated price or historicalPricing field values that would expose unconfirmed pricing to the public.
7. WHEN a sensitive file or directory (such as src/data/internal/) is identified that should not receive future accidental additions, THE Developer SHALL add an appropriate rule to .gitignore while maintaining the immutability of committed history.
8. THE Security Audit SHALL produce a written findings report (docs/SECURITY-AUDIT.md) documenting: files inspected, findings (pass/risk/fail per category), and remediation recommendations for management review.

---

### Requirement 5 — Project Status & Unit Data Consistency (P1 — WS-03)

**User Story:** As the project coordinator, I want to confirm that project statuses, unit data fields, and content placeholders are accurate and consistent, so that the site presents no misleading information to visitors.

#### Acceptance Criteria

1. THE Website SHALL display the Pabuaran project with `status: "coming-soon"` — THE Developer SHALL NOT change this status to `"active"` or any other value.
2. THE Website SHALL display all nine Dehir kavling units (A1–A4, B1–B5) with `status: "unknown"` and `price: null` as long as the Owner has not confirmed availability and pricing.
3. WHEN a unit has `price: null`, THE Unit Detail Page SHALL display the "Hubungi Marketing / Contact Marketing" label instead of a price figure, using the existing `unit.contactForPrice` translation key.
4. THE Unit Data Consistency Check SHALL verify that `dehir-units.json` land area and dimension values match the values used in any visible UI display (no silent truncation or rounding that changes the displayed figure).
5. THE Website SHALL display site plan sections using the existing placeholder components and copy — THE Developer SHALL NOT substitute real site plan coordinates or SVG data that have not been confirmed by the Owner.
6. THE Website SHALL display the project photo gallery using the 7 curated documentation photos in `public/images/projects/dehir/` and `src/data/media/dehir-gallery.ts` (as successfully integrated in Task P2). The video section SHALL continue to use placeholder components (`<Placeholder type="video">`). No additional unconfirmed photos or real video embeds SHALL be added without explicit Owner confirmation.

---

### Requirement 6 — Bilingual String Completeness (P1/P2 — WS-05)

**User Story:** As an English-speaking visitor, I want all visible UI text to appear in English when the locale is set to `en`, so that the site is genuinely bilingual.

#### Acceptance Criteria

1. THE Website SHALL render all visible text strings through the `useTranslations()` hook from next-intl, using keys from `src/i18n/messages/id.json` (locale `id`) and `src/i18n/messages/en.json` (locale `en`).
2. WHEN the active locale is en, THE V2 Components (ExplorationV2, UnitCatalogV2, UnitDetailV2) SHALL NOT display hardcoded Indonesian strings or un-translated labels, including:
   - Section headers & subtitles: "Eksplorasi Kavling" (unitKavlingTitle), ${project.name} · Daftar Kavling Resmi (unitKavlingSubtitle), "Spesifikasi Bangunan", "Akses & Lingkungan".
   - Unit cards & detail labels: "Kavling" (unitCardKavling), Kavling () in UnitDetailV2, `Menampilkan  dari  unit` (showingCount).
   - Table headers & specs: "Luas Tanah" (landAreaLabel), "Dimensi" / "Dimensi (L×P)" (dimensionsLabel), "Harga" (priceLabel), "Status" (statusLabel).
   - Navigation & links: "Info Proyek & Denah" (ackToProjectOverview), "Katalog Unit" (catalogTitle).
   - Kavling measurement disclaimer: "Catatan Ukuran Kavling: Luas tanah dan dimensi (lebar × panjang) merupakan perkiraan berdasarkan data pemasaran awal..." across ExplorationV2, UnitCatalogV2, and UnitDetailV2.
   - Empty/filter states: "Tidak ada unit dengan status terpilih." (
oFilterMatch).
3. THE i18n Messages Files SHALL contain matching keys for every string added or changed during this launch — both `id.json` and `en.json` SHALL be updated together.
4. WHERE a translation key already exists in the message files (such as `form.*`, `unit.*`, `project.*`), THE Developer SHALL reuse that existing key rather than introducing duplicate keys.

---

### Requirement 7 — Language Switcher Path Preservation (P2 — WS-05)

**User Story:** As a visitor browsing a project detail page, I want clicking the language switcher to keep me on the same page in the new locale, so that I don't lose my context.

#### Acceptance Criteria

1. WHEN a visitor activates the language switcher on any page under `/[locale]/projects/[slug]` or `/[locale]/projects/[slug]/units/[unitCode]`, THE Language Switcher SHALL navigate to the equivalent path in the target locale (e.g., `/id/projects/dehir` ↔ `/en/projects/dehir`) rather than the locale root.
2. THE Language Switcher SHALL preserve the full URL path (including slug and unit code segments) when switching locales.
3. THE Language Switcher SHALL be implemented as a reusable component (extracted to `src/components/layout/LanguageSwitcher.tsx`) and used consistently across all layout files.

---

### Requirement 8 — Static Export & Apache Configuration (P1 — WS-04 — Pending Server Verification)

**User Story:** As the project coordinator, I want a clean static export and an .htaccess file so that the site can be deployed to an Apache shared-hosting server (Rumahweb).

#### Acceptance Criteria

1. WHEN 
pm run build succeeds, THE Static Export SHALL produce a file tree in /out/ that is self-contained and can be served from an Apache web server root without a Node.js runtime.
2. THE .htaccess File SHALL redirect requests for the site root (/) to /id/ to enforce the default locale.
3. THE .htaccess File SHALL specify custom error handling via ErrorDocument 404, but the exact target path (e.g., /out/404.html vs locale-specific /out/id/404/index.html) SHALL be marked as PENDING VERIFICATION against the actual build output structure generated by 
ext-intl static export.
4. THE .htaccess File SHALL include cache-control headers that set a long max-age (at least 1 year) for static assets matching the patterns *.js, *.css, *.woff2, and *.png/*.jpg/*.webp, and set 
o-cache for *.html files.
5. THE .htaccess File rewrite rules (including RewriteRule ^(id|en)/(.*)$) SHALL be marked as PENDING VERIFICATION in the actual Rumahweb Apache environment to prevent duplicate index.html/index.html concatenation and handle trailing versus non-trailing slashes cleanly.
6. THE .htaccess File SHALL be placed in the root of the /out/ directory or documented in the deployment checklist as the target location on the server.
7. WHERE mod_rewrite is required for locale redirect rules, THE .htaccess File SHALL include RewriteEngine On and the appropriate RewriteRule directives, with instructions in the deployment checklist to confirm mod_rewrite and mod_headers activation on the Rumahweb hosting panel.

---

### Requirement 9 — Deployment Checklist (P1 — WS-04)

**User Story:** As the project coordinator, I want a step-by-step deployment checklist so that I (or any team member) can deploy the static export to staging without missing a critical step.

#### Acceptance Criteria

1. THE Deployment Checklist SHALL be written as a Markdown file and SHALL cover, in order: pre-deployment verification steps, build command, file upload instructions (without executing the upload), server configuration steps (`.htaccess` placement), post-deployment smoke test steps, and SEO activation steps.
2. THE Deployment Checklist SHALL include a step to confirm that `seoConfig.indexingEnabled` is set to `false` in `src/config/site.ts` before any public deployment unless the domain has been officially confirmed by the Owner.
3. THE Deployment Checklist SHALL include a step to verify the WhatsApp number in `siteConfig.contact.whatsappNumber` before deployment.
4. THE Deployment Checklist SHALL include a step confirming that `.env.local` and any files matching `.env*` are NOT included in the `/out/` export (the static export contains only public assets).
5. THE Deployment Checklist SHALL include a SEO activation section that lists the exact fields to update in `src/config/site.ts` (`siteUrl`, `indexingEnabled`) when the domain is confirmed, and notes that a rebuild and re-deploy is required after those changes.

---

### Requirement 10 — SEO Readiness (P2 — WS-04)

**User Story:** As the project coordinator, I want the SEO infrastructure to be ready to activate with minimal changes once the domain is confirmed, so that the site can be indexed quickly after launch.

#### Acceptance Criteria

1. WHILE `seoConfig.indexingEnabled` is `false`, THE Website SHALL include `<meta name="robots" content="noindex, nofollow">` on every page and SHALL NOT publish canonical or hreflang link tags.
2. WHEN `seoConfig.indexingEnabled` is set to `true` and `seoConfig.siteUrl` is set to a confirmed domain, THE Website SHALL publish canonical and hreflang link tags on every page using the `buildAlternates()` helper from `src/config/site.ts`.
3. THE `sitemap.ts` Generator SHALL produce a non-empty sitemap only after `seoConfig.siteUrl` is set to a non-empty string.
4. THE `robots.ts` Generator SHALL produce `Disallow: /` when `seoConfig.indexingEnabled` is `false`, and SHALL produce `Allow: /` with the sitemap URL when `indexingEnabled` is `true`.

---

### Requirement 11 — WhatsApp Number Management (P1)

**User Story:** As the project coordinator, I want the WhatsApp number to be sourced from a single, documented location so that it can be updated accurately when the Owner confirms the final number.

#### Acceptance Criteria

1. THE Website SHALL read the WhatsApp number from `siteConfig.contact.whatsappNumber` in `src/config/site.ts` for all CTA buttons, the Interest Form redirect, and the Navbar WhatsApp button.
2. WHEN a component needs to construct a WhatsApp URL, THE Component SHALL use the `buildWhatsAppUrl()` helper from `src/config/site.ts` rather than constructing the URL inline.
3. THE Developer SHALL NOT introduce a second location where the WhatsApp number is hardcoded — the number in `siteConfig.contact.whatsappNumber` is the single source of truth.
4. IF the WhatsApp number contains the character `X` (placeholder detection via `isWhatsAppNumberPlaceholder()`), THEN THE Website SHALL display all WhatsApp CTA buttons in a disabled state with the `whatsapp.disabled` translation label.

---

### Requirement 12 — Responsive & Accessibility Baseline (P2 — WS-05)

**User Story:** As a mobile visitor, I want the Interest Form and all pages to be usable on small screens, so that I can interact with the site from my phone.

#### Acceptance Criteria

1. THE Interest Form Page SHALL be usable at viewport widths from 320px to 1440px without horizontal overflow or truncated interactive controls.
2. THE Interest Form Page SHALL meet the minimum touch target size of 44×44 CSS pixels for all interactive elements, consistent with the existing Button component definition.
3. THE Website SHALL maintain the existing responsive layout of all V2 pages (Homepage, Project Catalog, Exploration, Unit Catalog, Unit Detail, Contact) with no regressions introduced during this launch wave.
4. WHEN keyboard focus moves to any interactive element on the Interest Form Page, THE Interactive Element SHALL display a visible focus ring consistent with the existing `focus:ring-2 focus:ring-primary-300` pattern used in the Input, Select, and Button components.

---

### Requirement 13 — Documentation Currency (P2 — WS-05)

**User Story:** As a future developer taking over this project, I want the README and architecture docs to reflect what actually exists in the codebase, so that I can onboard quickly without being misled by stale information.

#### Acceptance Criteria

1. THE README SHALL accurately describe the current state of implemented features, distinguishing between "Implemented", "Partially Implemented", and "Pending" items.
2. THE README SHALL include accurate setup instructions (install, dev, build, lint commands) that match the scripts in `package.json`.
3. WHEN a new page, component, or significant configuration change is introduced during this launch, THE Developer SHALL update `docs/PROJECT-STRUCTURE.md` and `docs/DEVELOPMENT-GUIDE.md` to reflect the change.
4. THE Developer SHALL NOT delete or overwrite existing audit reports, consultation notes, or historical proposal documents in `docs/`.
