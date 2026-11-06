# Arsitektur Project Celestia

## Gambaran Umum

Celestia adalah **Property Exploration & Marketing Website** untuk PT Mitra Rahim Indonesia.
Website ini dibangun dengan Next.js App Router, TypeScript, dan Tailwind CSS.

Website **bukan** platform transaksi, booking, atau CRM. Fokusnya adalah:
- Menampilkan informasi proyek properti
- Memungkinkan pengunjung menjelajahi unit dan kavling
- Mengarahkan calon pembeli ke WhatsApp untuk konsultasi

---

## Stack Teknologi

| Teknologi         | Versi  | Alasan                                              |
|-------------------|--------|-----------------------------------------------------|
| Next.js           | 16.x   | App Router, SSR/SSG, optimasi gambar bawaan         |
| React             | 19.x   | UI framework                                        |
| TypeScript        | 5.x    | Type safety, mencegah bug runtime                   |
| Tailwind CSS      | 4.x    | Styling utility-first, konsisten dan cepat          |
| ESLint            | 9.x    | Kualitas kode                                       |

---

## Prinsip Arsitektur

### 1. Server Components sebagai Default

Semua komponen adalah **Server Components** kecuali membutuhkan:
- Event handler browser (`onClick`, `onChange`, dll.)
- React hooks (`useState`, `useEffect`, dll.)
- API browser (`localStorage`, `window`, dll.)

Tambahkan `"use client"` hanya jika memang diperlukan.

### 2. Feature-Based Architecture

Kode diorganisir berdasarkan fitur bisnis, bukan berdasarkan jenis file.

**Sudah diimplementasikan:**
```
src/features/
  site-plan/    ← Denah interaktif (SitePlanPanel, InteractiveSitePlan)
```

**Direncanakan (belum ada):**
```
src/features/
  projects/     ← ProjectCard, ProjectList, ProjectHero (planned)
  properties/   ← PropertyCatalog, UnitCard, UnitDetail (planned)
  contact/      ← WhatsAppButton, ContactCTA (planned)
```

Komponen halaman saat ini berada di `src/components/` (homepage, projects, ui, layout)
sambil menunggu migrasi ke struktur feature-based.

### 3. Data Access Layer (Direncanakan)

Rencana arsitektur: komponen UI tidak boleh membaca file data secara langsung.
Gunakan services di `src/services/` sebagai perantara.

```
src/services/
  projects.ts   ← getProject(), getAllProjects()     (planned)
  properties.ts ← getUnit(), getUnitsByProject()     (planned)
```

**Status aktual:** `src/services/` belum diimplementasikan. Semua halaman saat ini
mengimpor data JSON secara langsung dari `src/data/`. Services layer adalah arsitektur
target yang memungkinkan migrasi ke API tanpa mengubah komponen UI.

### 4. Type Safety

Semua data properti didefinisikan dengan TypeScript interface di `src/types/`.
Tidak ada `any` tanpa alasan yang sangat kuat dan komentar jelas.

---

## Alur Data (MVP — Kondisi Aktual)

```
File JSON di src/data/
        ↓
  src/app/[locale]/    (halaman mengimpor JSON langsung)
        ↓
  Browser (Server Components dirender di server)
```

Data statis dipilih untuk MVP karena:
- Tidak membutuhkan backend
- Mudah diubah dan dikelola
- Dapat diganti dengan API di masa depan tanpa mengubah komponen UI

**Arsitektur yang direncanakan** (belum diimplementasikan):
```
File JSON / API
        ↓
  src/services/        (data access layer — planned)
        ↓
  src/features/        (business logic — partially planned)
        ↓
  src/app/[locale]/    (routing & pages)
        ↓
  Browser
```

---

## Bilingual (i18n)

Website mendukung **Bahasa Indonesia** (default) dan **English**.

Implementasi menggunakan `next-intl` (`^4.14.9`) dan sudah berjalan aktif:
- Routing berbasis locale: `/id/...` dan `/en/...`
- Middleware di `src/proxy.ts` menangani deteksi dan redirect locale
- Konfigurasi di `src/i18n/config.ts` dan `src/i18n/request.ts`
- File terjemahan di `src/i18n/messages/id.json` dan `src/i18n/messages/en.json`
- Semua halaman berada di bawah `src/app/[locale]/`
- Slug URL tidak diterjemahkan — slug tetap sama di semua locale

---

## UI Variant (Feature Flag)

Proyek menggunakan feature flag `uiConfig.uiVariant` di `src/config/site.ts`
untuk beralih antara dua versi tampilan:

- `"v1"` — layout awal: centered hero, card grid
- `"v2"` — layout baru: left-aligned hero, dotted background, navbar dengan WhatsApp CTA

**Kondisi aktual:** `uiVariant: "v2"` aktif. Komponen V2 berada di `src/components/`.

Untuk rollback: ganti `"v2"` → `"v1"` di `src/config/site.ts`. Tidak ada perubahan
komponen atau routing yang diperlukan.

---

## Batasan MVP

- Tidak ada backend atau database
- Tidak ada online payment
- Tidak ada booking atau reservasi
- Tidak ada login pengguna
- Status unit tidak diperbarui real-time
- Data properti menggunakan file statis yang dikonfirmasi perusahaan
