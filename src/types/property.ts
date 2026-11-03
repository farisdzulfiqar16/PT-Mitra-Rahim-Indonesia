/**
 * Type untuk data unit properti dan kavling.
 *
 * PENTING: Harga, status, dan dimensi unit adalah data nyata yang harus
 * dikonfirmasi oleh perusahaan sebelum ditampilkan di website.
 * Jangan mengisi nilai ini dari asumsi.
 */

import type { ProjectId } from "./project";

/** Status ketersediaan unit */
export type UnitStatus = "available" | "sold" | "reserved" | "unknown";

/** Representasi satu unit properti atau kavling */
export interface PropertyUnit {
  /** Kode unik unit, misal: "A-01", "B-12" */
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
