/**
 * Konfigurasi global website Celestia.
 *
 * File ini menjadi satu sumber kebenaran (single source of truth) untuk
 * metadata, URL, dan pengaturan kontak.
 *
 * TODO (konfirmasi ke perusahaan):
 *   - Nomor WhatsApp yang benar
 *   - URL domain produksi
 *   - Nama resmi perusahaan dan tagline
 */

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
     * TODO: konfirmasi nomor WhatsApp resmi ke perusahaan.
     */
    whatsappNumber: "62XXXXXXXXXX",

    /**
     * Pesan default yang dikirim ketika pengunjung klik tombol WhatsApp.
     * Tersedia dalam dua bahasa.
     */
    whatsappMessageId: "Halo, saya ingin mengetahui lebih lanjut tentang proyek Celestia.",
    whatsappMessageEn: "Hello, I would like to know more about the Celestia project.",
  },
} as const;

/** Helper: buat URL WhatsApp dari nomor dan pesan */
export function buildWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodedMessage}`;
}
