/**
 * Type untuk data unit properti dan kavling.
 *
 * PENTING: Harga, status, dan dimensi unit adalah data nyata yang harus
 * dikonfirmasi oleh perusahaan sebelum ditampilkan di website.
 * Jangan mengisi nilai ini dari asumsi.
 */

import type { ProjectId } from "./project";

/** Status ketersediaan unit */
export type UnitStatus = "available" | "process" | "sold" | "unknown";

/** Representasi satu unit properti atau kavling */
export interface PropertyUnit {
  /** Kode unik unit, misal: "A1", "B5" */
  unitCode: string;

  /** ID proyek yang memiliki unit ini */
  projectId: ProjectId;

  /** Tipe unit, misal: "kavling", "rumah" */
  unitType: string;

  /** Luas tanah dalam m² */
  landArea?: number;

  /** Lebar × panjang kavling dalam meter */
  dimensions?: {
    width: number;
    length: number;
  };

  /**
   * Harga unit dalam Rupiah.
   * null = belum dikonfirmasi, jangan ditampilkan ke publik.
   */
  price?: number | null;

  /**
   * Status ketersediaan unit.
   * "unknown" = data belum dikonfirmasi.
   */
  status: UnitStatus;
}

/**
 * Posisi unit pada site plan (SVG).
 * Nilai relatif terhadap viewBox SVG (0-100).
 */
export interface SitePlanPosition {
  /** Kode unit yang posisinya didefinisikan */
  unitCode: string;
  /** Posisi X relatif (0-100) */
  x: number;
  /** Posisi Y relatif (0-100) */
  y: number;
  /** Lebar relatif (opsional) */
  width?: number;
  /** Tinggi relatif (opsional) */
  height?: number;
}

/**
 * Data formulir minat properti Dehir.
 * Hanya digunakan di sisi client — tidak disimpan ke server.
 */
export interface InterestFormData {
  /** Nama pengisi (opsional) */
  name?: string;
  /** Pilihan utama: kavling saja atau kavling + bangunan (wajib) */
  propertyType: "kavling-only" | "kavling-building";
  /** Kode kavling dari brosur: A1-A4, B1-B5 (opsional) */
  kavlingCode?: string;
  /** Tipe bangunan: type-1, type-1-promo, atau undecided (opsional) */
  buildingType?: "type-1" | "type-1-promo" | "undecided";
  /** Tujuan penggunaan bangunan (opsional) */
  usagePurpose?: "residential" | "office" | "other";
  /** Permintaan modifikasi desain (opsional) */
  modificationRequest?: string;
  /** Catatan atau kebutuhan khusus (opsional) */
  notes?: string;
}
