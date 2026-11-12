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
   * "unknown" = data belum dikonfirmasi — JANGAN diasumsikan "available".
   */
  status: UnitStatus;

  // ─── Spesifikasi Bangunan (Opsional) ─────────────────────────────────────
  // Semua field di bawah ini WAJIB dikonfirmasi Owner sebelum diisi.
  // Jangan mengisi dari asumsi atau perkiraan.

  /**
   * Luas bangunan dalam m².
   * Opsional — diisi setelah dikonfirmasi perusahaan.
   */
  buildingArea?: number;

  /**
   * Jumlah kamar tidur.
   * Opsional — diisi setelah dikonfirmasi perusahaan.
   */
  bedrooms?: number;

  /**
   * Jumlah kamar mandi.
   * Opsional — diisi setelah dikonfirmasi perusahaan.
   */
  bathrooms?: number;

  /**
   * Tersedia carport atau tidak.
   * Opsional — diisi setelah dikonfirmasi perusahaan.
   */
  carport?: boolean;

  /**
   * Tipe bangunan.
   * Opsional — diisi setelah dikonfirmasi perusahaan.
   * Contoh: "Type 1 Lantai", "Type 2 Lantai"
   */
  buildingType?: string;

  /**
   * Catatan internal untuk unit ini.
   * Opsional — tidak ditampilkan ke publik.
   * Contoh: "Unit sudut, perlu verifikasi luas tanah"
   */
  notes?: string;

  /**
   * Path gambar resmi unit (jika sudah tersedia).
   * null / undefined = gambar belum tersedia, gunakan placeholder.
   */
  image?: string | null;

  /**
   * Referensi harga historis dari brosur pemasaran awal.
   * Bersifat internal / referensi historis, tidak ditampilkan sebagai harga jual aktif.
   */
  historicalPricing?: HistoricalBrochurePricing;
}

/**
 * Referensi harga historis dari brosur cetak awal proyek.
 *
 * PENTING: Data ini bersifat historis/internal untuk referensi marketing.
 * JANGAN ditampilkan sebagai harga jual aktif di portal publik
 * sebelum ada konfirmasi dan persetujuan resmi dari Owner.
 */
export interface HistoricalBrochurePricing {
  kavlingOnly: number;
  packageType46: number;
  kprType46Monthly: number;
  packageType30: number;
  kprType30Monthly: number;
  source: string;
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
 * Data formulir minat dan konsultasi properti Celestia.
 * Hanya digunakan di sisi client — tidak disimpan ke server.
 */
export interface InterestFormData {
  /** Proyek yang dipilih: "dehir", "pabuaran", atau "general" (opsional) */
  projectId?: string;
  /** Kategori topik kebutuhan konsultasi yang dipilih */
  consultationCategories?: string[];
  /** Nama pengisi (opsional) */
  name?: string;
  /** Pilihan jenis properti (opsional) */
  propertyType?: "kavling-only" | "kavling-building" | "undecided";
  /** Kode kavling dari brosur: A1-A4, B1-B5 (opsional) */
  kavlingCode?: string;
  /** Tipe bangunan: type-1, type-1-promo, atau undecided (opsional) */
  buildingType?: "type-1" | "type-1-promo" | "undecided";
  /** Tujuan penggunaan bangunan (opsional) */
  usagePurpose?: "residential" | "office" | "other";
  /** Permintaan modifikasi desain (opsional) */
  modificationRequest?: string;
  /** Catatan atau pertanyaan bebas (opsional) */
  notes?: string;
}
