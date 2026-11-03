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

```
src/features/
  projects/     ← Semua kode terkait daftar dan detail proyek
  properties/   ← Semua kode terkait katalog dan detail unit
  site-plan/    ← Semua kode terkait denah interaktif
  contact/      ← Semua kode terkait CTA dan kontak WhatsApp
```

### 3. Data Access Layer

Komponen UI tidak boleh membaca file data secara langsung.
Gunakan services di `src/services/` sebagai perantara.

```
src/services/
  projects.ts   ← getProject(), getAllProjects()
  properties.ts ← getUnit(), getUnitsByProject()
```

### 4. Type Safety

Semua data properti didefinisikan dengan TypeScript interface di `src/types/`.
Tidak ada `any` tanpa alasan yang sangat kuat dan komentar jelas.

---

## Alur Data (MVP)

```
File JSON / Data Statis
        ↓
  src/services/        (data access layer)
        ↓
  src/features/        (business logic)
        ↓
  src/app/             (routing & pages)
        ↓
  Browser (Server Components dirender di server)
```

Data statis dipilih untuk MVP karena:
- Tidak membutuhkan backend
- Mudah diubah dan dikelola
- Dapat diganti dengan API di masa depan tanpa mengubah komponen UI

---

## Bilingual (i18n)

Website mendukung **Bahasa Indonesia** (default) dan **English**.

Implementasi i18n dijadwalkan pada Feature Spec berikutnya.
Kandidat library: `next-intl` (evaluasi lebih lanjut diperlukan).

Pertimbangan:
- URL berbasis locale: `/id/...` dan `/en/...`
- Semua teks UI di-hardcode ke translation keys, bukan string langsung
- Konten properti (nama, deskripsi) juga harus tersedia dalam dua bahasa

---

## Batasan MVP

- Tidak ada backend atau database
- Tidak ada online payment
- Tidak ada booking atau reservasi
- Tidak ada login pengguna
- Status unit tidak diperbarui real-time
- Data properti menggunakan file statis yang dikonfirmasi perusahaan
