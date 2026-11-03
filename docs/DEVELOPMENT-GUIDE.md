# Panduan Pengembangan Celestia

## Prasyarat

- Node.js ≥ 18 (tersedia di mesin ini)
- npm ≥ 10
- Git

## Menjalankan Project

```bash
# Masuk ke folder project
cd celestia-web

# Install dependencies (sudah dilakukan saat setup)
npm install

# Jalankan development server
npm run dev
```

Buka browser di: `http://localhost:3000`

## Perintah yang Tersedia

```bash
npm run dev       # Development server dengan hot reload
npm run build     # Production build
npm run start     # Jalankan production build secara lokal
npm run lint      # Periksa kode dengan ESLint
```

## Pemeriksaan Kualitas Kode

Sebelum membuat commit atau merge, jalankan:

```bash
# 1. ESLint — periksa masalah kode
npm run lint

# 2. TypeScript check — pastikan tidak ada error type
npx tsc --noEmit

# 3. Production build — pastikan bisa di-build
npm run build
```

Jangan menonaktifkan ESLint atau TypeScript untuk menghindari error.
Perbaiki error yang muncul — itu pertanda ada masalah nyata.

---

## Cara Menambah Halaman Baru

### 1. Halaman Sederhana

Buat file baru di `src/app/`:

```
src/app/tentang/page.tsx
```

Ini otomatis membuat route `/tentang`.

```typescript
// src/app/tentang/page.tsx
export default function TentangPage() {
  return (
    <main>
      <h1>Tentang Celestia</h1>
    </main>
  );
}
```

### 2. Halaman dengan Data Dinamis

Untuk halaman seperti `/projects/dehir`:

```
src/app/projects/[slug]/page.tsx
```

```typescript
// src/app/projects/[slug]/page.tsx
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  // ambil data berdasarkan slug
  return <div>{slug}</div>;
}
```

---

## Server Components vs Client Components

### Kapan Gunakan Server Component (default)

Gunakan Server Component untuk:
- Halaman yang menampilkan data
- Komponen yang tidak butuh interaktivitas
- Layout dan wrappers

```typescript
// Server Component — tidak ada "use client"
export default async function ProjectList() {
  const projects = await getAllProjects(); // data fetching di server
  return <div>{/* render projects */}</div>;
}
```

### Kapan Gunakan Client Component

Tambahkan `"use client"` hanya jika komponen:
- Menggunakan `useState` atau `useEffect`
- Memiliki event handler (`onClick`, `onChange`)
- Menggunakan API browser (`window`, `document`)

```typescript
"use client"; // ← wajib ada di baris pertama

import { useState } from "react";

export function LanguageSwitcher() {
  const [locale, setLocale] = useState("id");
  return <button onClick={() => setLocale("en")}>{locale}</button>;
}
```

**Aturan praktis:** Buat komponen sebesar mungkin sebagai Server Component.
Pindahkan ke Client Component hanya bagian yang benar-benar butuh interaktivitas.

---

## Cara Mengakses dan Mengubah Data Properti

### Struktur Data (Rencana)

Data properti disimpan sebagai file JSON di `src/data/`:

```
src/data/
  projects/
    dehir.json        ← Data proyek Dehir
    pabuaran.json     ← Data proyek Pabuaran
  properties/
    dehir-units.json  ← Daftar unit/kavling Dehir
```

### Mengakses Data melalui Services

**Jangan** import file JSON langsung di komponen. Gunakan fungsi dari `src/services/`:

```typescript
// ✅ Benar — gunakan service layer
import { getProjectBySlug } from "@/services/projects";

const project = await getProjectBySlug("dehir");
```

```typescript
// ❌ Hindari — import JSON langsung di komponen
import dehirData from "@/data/projects/dehir.json";
```

Service layer memudahkan penggantian sumber data dari JSON ke API di masa depan.

---

## Cara Menangani Error

### Halaman Error Custom

Buat `error.tsx` di dalam folder route untuk menangani error runtime:

```
src/app/error.tsx        ← Error global
src/app/projects/error.tsx ← Error khusus halaman projects
```

### Not Found

Buat `not-found.tsx` untuk halaman 404 custom:

```
src/app/not-found.tsx
```

### Jangan Sembunyikan Error

```typescript
// ❌ Jangan sembunyikan error seperti ini
try {
  const data = await fetchData();
} catch (e) {
  // diabaikan
}

// ✅ Log error atau re-throw agar bisa ditangkap
try {
  const data = await fetchData();
} catch (error) {
  console.error("Gagal memuat data:", error);
  throw error; // biarkan error boundary menangani
}
```

---

## Tips untuk Developer Baru

1. **Mulai dari `src/app/`** — di situ routing dimulai.
2. **Baca `src/types/`** — pahami struktur data sebelum menulis kode baru.
3. **Gunakan `@/` untuk import** — bukan path relatif panjang.
4. **Jangan ubah `tsconfig.json`** — sudah dikonfigurasi dengan benar.
5. **Jalankan `npx tsc --noEmit` sebelum commit** — pastikan tidak ada error TypeScript.
