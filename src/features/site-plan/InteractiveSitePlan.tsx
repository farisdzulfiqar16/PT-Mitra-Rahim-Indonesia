"use client";

/**
 * InteractiveSitePlan — Komponen SVG interaktif Site Plan.
 *
 * STATUS: Belum aktif — menunggu data denah resmi dari perusahaan.
 *
 * Komponen ini dipersiapkan untuk menampilkan denah kavling Dehir secara interaktif
 * berbasis SVG ketika aset dan data posisi unit resmi tersedia serta dikonfirmasi.
 *
 * ATURAN PENGEMBANGAN:
 *   - Jangan menambahkan koordinat atau bentuk SVG berdasarkan asumsi.
 *   - Jangan membuat denah ilustratif yang menyerupai denah resmi.
 *   - Implementasi SVG hanya boleh dilakukan setelah:
 *       1. Aset denah resmi dari perusahaan tersedia.
 *       2. Data posisi setiap unit (SitePlanPosition) telah dikonfirmasi.
 *   - Komponen ini saat ini tidak merender apapun — dikontrol oleh SitePlanPanel.
 *
 * CARA MENGAKTIFKAN (ketika data tersedia):
 *   1. Tambahkan data posisi unit ke src/data/properties/dehir-site-plan.json
 *      menggunakan tipe SitePlanPosition dari src/types/property.ts.
 *   2. Tambahkan aset SVG denah resmi ke public/site-plan/dehir.svg.
 *   3. Ubah prop `isAvailable` pada SitePlanPanel menjadi true.
 *   4. Implementasikan logika SVG interaktif di komponen ini.
 */

import type { PropertyUnit } from "@/types";

export interface InteractiveSitePlanProps {
  /** Daftar unit yang akan ditampilkan di Site Plan */
  units: PropertyUnit[];
  /** Kode unit yang di-highlight via deep-link (dari parameter ?unit=) */
  highlightedUnitCode?: string;
  /** Teks label untuk aksesibilitas */
  ariaLabel: string;
}

/**
 * Komponen ini adalah stub yang belum diimplementasikan.
 * Akan diaktifkan ketika denah resmi dan posisi unit tersedia.
 *
 * Saat ini tidak merender apapun — SitePlanPanel menampilkan placeholder.
 */
export function InteractiveSitePlan({
  // props diterima tapi belum dipakai — siap untuk implementasi mendatang
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  units: _units,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  highlightedUnitCode: _highlightedUnitCode,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ariaLabel: _ariaLabel,
}: InteractiveSitePlanProps) {
  // Implementasi SVG interaktif ditunda sampai denah resmi tersedia.
  // Lihat komentar di atas untuk panduan pengembangan.
  return null;
}
