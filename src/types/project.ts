/**
 * Type untuk data proyek properti Celestia.
 *
 * Proyek yang didukung:
 *   - "dehir"    → Celestia Jatiluhur (proyek utama)
 *   - "pabuaran" → Celestia Jatiranggon (proyek kedua)
 */

/**
 * ID unik setiap proyek properti.
 * Mendukung autocompletion untuk proyek terdaftar ("dehir", "pabuaran")
 * sekaligus fleksibel menerima ID proyek baru di masa depan.
 */
export type ProjectId = "dehir" | "pabuaran" | (string & {});

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

  /** Status kondisi bisnis proyek: aktif atau coming soon */
  status: "active" | "coming-soon";

  /** Lokasi geografis proyek */
  location: ProjectLocation;

  /**
   * Status pengelolaan publikasi website (opsional, persiapan masa depan).
   * - "published": ditampilkan di portal publik (default saat ini)
   * - "draft": draft internal yang belum ditampilkan ke publik
   * - "archived": arsip proyek yang sudah tidak dipromosikan
   *
   * Catatan: Aturan bisnis publikasi belum diputuskan Owner, sehingga saat ini
   * seluruh proyek yang tersedia di data diperlakukan sebagai terbit (published).
   */
  publicationStatus?: "published" | "draft" | "archived";

  /** Jenis properti yang ditawarkan pada proyek */
  propertyTypes?: string[];

  /** Tagline pemasaran dari brosur resmi */
  marketingTagline?: string;

  /** Spesifikasi tipe bangunan yang tersedia pada proyek */
  buildingTypes?: BuildingTypeSpec[];

  /** Daftar fasilitas umum dan sarana di sekitar proyek */
  nearbyFacilities?: NearbyFacility[];

  /** Nomor WhatsApp kandidat dari brosur (belum dikonfirmasi Owner) */
  brochureCandidateContact?: string;
}

/** Spesifikasi teknis tipe bangunan dari brosur */
export interface BuildingTypeSpec {
  id: string;
  name: string;
  description?: string;
  floors: number;
  buildingArea: number;
  bedrooms: number;
  toilets: number;
  livingRoom: boolean;
  kitchen: boolean;
  frontGarden: boolean;
  backGarden?: boolean;
  carport: boolean;
}

/** Informasi fasilitas umum di sekitar kawasan proyek */
export interface NearbyFacility {
  name: string;
  approximateDistance: string;
  sourceNote?: string;
}

/** Informasi lokasi proyek */
export interface ProjectLocation {
  /**
   * Nama kota atau kabupaten tempat proyek berada.
   * Contoh: "Jatiluhur", "Jatiranggon"
   */
  city: string;

  /**
   * Nama provinsi tempat proyek berada.
   * Contoh: "Jawa Barat"
   */
  province: string;

  /**
   * Negara tempat proyek berada.
   * Opsional — diisi jika relevan untuk penampilan atau filter.
   * Contoh: "Indonesia"
   */
  country?: string;

  /**
   * Kecamatan tempat proyek berada.
   * Opsional — diisi setelah konfirmasi perusahaan.
   */
  district?: string;

  /**
   * Desa atau kelurahan tempat proyek berada.
   * Opsional — diisi setelah konfirmasi perusahaan.
   */
  subDistrict?: string;

  /**
   * Alamat jalan atau nama kawasan.
   * Opsional — diisi setelah konfirmasi perusahaan.
   * Contoh: "Jl. Raya Jatiluhur No. 1"
   */
  streetAddress?: string;

  /**
   * Kode pos lokasi proyek.
   * Opsional — diisi setelah konfirmasi perusahaan.
   * Contoh: "17425"
   */
  postalCode?: string;

  /**
   * Landmark atau petunjuk arah terverifikasi.
   * Opsional — HANYA diisi data yang sudah dikonfirmasi Owner.
   * Jangan mengisi dari asumsi.
   */
  landmark?: string;

  /**
   * Koordinat GPS untuk embed Google Maps.
   * Opsional — WAJIB dikonfirmasi Owner sebelum diisi.
   * Jangan mengisi dari perkiraan atau pencarian internet.
   */
  coordinates?: {
    lat: number;
    lng: number;
  };

  /**
   * URL Google Maps untuk tombol "Lihat di Maps".
   * Opsional — diisi setelah URL dikonfirmasi Owner.
   */
  googleMapsUrl?: string;
}
