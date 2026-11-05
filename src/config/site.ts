/**
 * Konfigurasi global website Celestia.
 *
 * File ini menjadi satu sumber kebenaran (single source of truth) untuk
 * metadata, URL, dan pengaturan kontak.
 *
 * TODO (konfirmasi ke perusahaan):
 *   - Nomor WhatsApp yang benar (saat ini dari brosur Dehir)
 *   - URL domain produksi
 *   - Nama resmi perusahaan dan tagline
 */

/**
 * Strategi prototype SEO:
 *
 * - INDEXING_ENABLED = false  → robots: noindex, nofollow. Tidak ada indexing publik.
 * - siteUrl = ""              → canonical dan hreflang tidak diterbitkan.
 *
 * Untuk aktivasi production:
 *   1. Konfirmasi domain resmi ke perusahaan
 *   2. Set INDEXING_ENABLED = true
 *   3. Set siteUrl ke domain resmi yang terkonfirmasi
 *
 * PENTING: Jangan aktifkan indexing hanya karena build berhasil atau NODE_ENV === "production".
 * Deployment production belum tentu berarti perusahaan sudah menyetujui publikasi.
 */
export const seoConfig = {
  /**
   * Aktifkan indexing publik hanya setelah domain dan konten dikonfirmasi perusahaan.
   * Selama prototype, tetap false.
   */
  indexingEnabled: false as boolean,

  /**
   * Base URL untuk canonical dan hreflang.
   * Kosongkan ("") jika domain resmi belum dikonfirmasi.
   * JANGAN isi dengan domain asumsi (misal: "https://celestia.id") sebelum dikonfirmasi.
   */
  siteUrl: "" as string,
} as const;

/**
 * Feature flags UI — untuk mudah undo/redo tampilan.
 *
 * uiVariant:
 *   "v1" → layout awal (centered hero, card grid)
 *   "v2" → layout baru (left-aligned hero, dotted bg, navbar dengan WhatsApp CTA)
 *
 * Untuk rollback: ganti "v2" → "v1". Untuk rollforward: ganti "v1" → "v2".
 */
export const uiConfig = {
  uiVariant: "v2" as "v1" | "v2",
} as const;

export const siteConfig = {
  /** Nama website yang ditampilkan di browser tab dan metadata */
  name: "Celestia",

  /** Nama perusahaan pemilik */
  company: "PT Mitra Rahim Indonesia",

  /**
   * Tagline singkat untuk hero section dan SEO.
   * TODO: konfirmasi tagline resmi dari perusahaan.
   */
  tagline: "Temukan Hunian Impian Anda",

  /** URL produksi — ganti setelah domain tersedia */
  url: "https://celestia.id",

  /** Bahasa default website */
  defaultLocale: "id" as const,

  /** Daftar bahasa yang didukung */
  supportedLocales: ["id", "en"] as const,

  contact: {
    /**
     * Nomor WhatsApp untuk tombol CTA.
     * Format: kode negara tanpa + diikuti nomor (misal: "628123456789")
     * TODO: konfirmasi nomor WhatsApp resmi ke perusahaan dari brosur Dehir.
     * Saat ini masih placeholder — jika mengandung karakter X, CTA dinonaktifkan.
     */
    whatsappNumber: "62XXXXXXXXXX",

    /** Pesan WhatsApp untuk homepage — locale id */
    whatsappMessageId: "Halo, saya ingin mengetahui lebih lanjut tentang proyek Celestia.",
    /** Pesan WhatsApp untuk homepage — locale en */
    whatsappMessageEn: "Hello, I would like to know more about the Celestia project.",

    /** Pesan WhatsApp untuk halaman proyek — locale id */
    whatsappProjectMessageId: "Halo, saya tertarik dengan proyek {project}. Saya ingin mendapatkan informasi lebih lanjut.",
    /** Pesan WhatsApp untuk halaman proyek — locale en */
    whatsappProjectMessageEn: "Hello, I am interested in the {project} project. I would like to get more information.",

    /** Pesan WhatsApp untuk halaman detail unit — locale id */
    whatsappUnitMessageId: "Halo, saya tertarik dengan unit {unitCode} di proyek {project}. Saya ingin mendapatkan informasi lebih lanjut.",
    /** Pesan WhatsApp untuk halaman detail unit — locale en */
    whatsappUnitMessageEn: "Hello, I am interested in unit {unitCode} of the {project} project. I would like to get more information.",
  },
} as const;

/**
 * Helper: buat URL WhatsApp dari nomor dan pesan.
 * Menggunakan nomor dari siteConfig.
 */
export function buildWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Helper: cek apakah nomor WhatsApp masih placeholder (belum dikonfirmasi).
 * Placeholder terdeteksi jika nomor mengandung karakter X.
 */
export function isWhatsAppNumberPlaceholder(): boolean {
  return siteConfig.contact.whatsappNumber.includes("X");
}

/**
 * Helper: bangun pesan WhatsApp untuk konteks proyek.
 * {project} diganti dengan nama proyek yang diberikan.
 */
export function buildProjectWhatsAppMessage(projectFullName: string, locale: "id" | "en"): string {
  const template = locale === "id"
    ? siteConfig.contact.whatsappProjectMessageId
    : siteConfig.contact.whatsappProjectMessageEn;
  return template.replace("{project}", projectFullName);
}

/**
 * Helper: bangun pesan WhatsApp untuk konteks unit.
 * {unitCode} dan {project} diganti dengan nilai yang diberikan.
 */
export function buildUnitWhatsAppMessage(unitCode: string, projectFullName: string, locale: "id" | "en"): string {
  const template = locale === "id"
    ? siteConfig.contact.whatsappUnitMessageId
    : siteConfig.contact.whatsappUnitMessageEn;
  return template
    .replace("{unitCode}", unitCode)
    .replace("{project}", projectFullName);
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bangun URL halaman untuk canonical dan hreflang.
 * Mengembalikan string kosong jika siteUrl belum dikonfirmasi,
 * sehingga canonical tidak diterbitkan.
 *
 * @param path - Path tanpa locale prefix, misal "/projects/dehir"
 * @param locale - Kode locale, misal "id" atau "en"
 */
export function buildPageUrl(path: string, locale: string): string {
  if (!seoConfig.siteUrl) return "";
  const base = seoConfig.siteUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${locale}${cleanPath}`;
}

/**
 * Bangun objek alternates (canonical + hreflang) untuk satu halaman.
 * Mengembalikan undefined jika siteUrl belum dikonfirmasi,
 * sehingga tag tidak diterbitkan.
 *
 * @param path - Path tanpa locale prefix, misal "/projects/dehir"
 * @param currentLocale - Locale aktif
 */
export function buildAlternates(
  path: string,
  currentLocale: string,
): import("next").Metadata["alternates"] | undefined {
  if (!seoConfig.siteUrl) return undefined;

  const idUrl = buildPageUrl(path, "id");
  const enUrl = buildPageUrl(path, "en");
  const canonicalUrl = currentLocale === "en" ? enUrl : idUrl;

  return {
    canonical: canonicalUrl,
    languages: {
      id: idUrl,
      en: enUrl,
      "x-default": idUrl,
    },
  };
}
