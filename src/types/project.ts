/**
 * Type untuk data proyek properti Celestia.
 *
 * Proyek yang didukung:
 *   - "dehir"    → Celestia Jatiluhur (proyek utama)
 *   - "pabuaran" → Celestia Jatiranggon (proyek kedua)
 */

/** ID unik setiap proyek properti */
export type ProjectId = "dehir" | "pabuaran";

/** Representasi satu proyek properti */
export interface Project {
  id: ProjectId;

  /** Nama resmi proyek (nama teknis, misal: "Dehir") */
  name: string;

  /** Nama lengkap proyek termasuk lokasi, misal: "Celestia Jatiluhur" */
  fullName: string;

  /** Deskripsi singkat untuk tampilan kartu/preview */
  shortDescription: string;

  /** Deskripsi lengkap untuk halaman detail */
  description: string;

  /** Slug untuk URL, misal: "dehir" → /projects/dehir */
  slug: string;

  /** Status proyek: aktif atau coming soon */
  status: "active" | "coming-soon";

  /** Lokasi geografis proyek */
  location: ProjectLocation;
}

/** Informasi lokasi proyek */
export interface ProjectLocation {
  /** Nama kota/kabupaten */
  city: string;

  /** Nama provinsi */
  province: string;

  /** Koordinat untuk Google Maps embed */
  coordinates?: {
    lat: number;
    lng: number;
  };

  /** URL Google Maps untuk tombol "Lihat di Maps" */
  googleMapsUrl?: string;
}
