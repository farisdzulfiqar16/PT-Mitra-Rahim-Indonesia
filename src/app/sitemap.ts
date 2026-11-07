/**
 * Sitemap dinamis Celestia MVP.
 *
 * Strategi prototype:
 * - Sitemap hanya diterbitkan jika seoConfig.siteUrl sudah dikonfirmasi.
 * - Selama siteUrl kosong (""), sitemap mengembalikan array kosong
 *   sehingga tidak ada URL publik yang diterbitkan.
 * - Pabuaran (coming-soon) tidak dimasukkan ke sitemap.
 *
 * Untuk aktivasi production:
 *   1. Konfirmasi domain resmi ke perusahaan
 *   2. Set seoConfig.siteUrl di src/config/site.ts
 *   3. Set seoConfig.indexingEnabled = true
 *
 * PENTING: Jangan mengisi siteUrl dengan domain asumsi sebelum dikonfirmasi.
 */

import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/site";
import { getActiveProjectsSync, getUnitsByProjectSync } from "@/services";

/** Locale yang didukung */
const LOCALES = ["id", "en"] as const;

/**
 * Bangun URL absolut dari path dan locale.
 * Menggunakan seoConfig.siteUrl sebagai base.
 */
function buildUrl(path: string, locale: string): string {
  const base = seoConfig.siteUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${locale}${cleanPath}`;
}

/**
 * Bangun entri sitemap bilingual untuk satu path.
 * Setiap path menghasilkan dua URL (id + en) dengan alternates hreflang.
 */
function buildBilingualEntry(
  path: string,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  priority = 0.8,
): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: buildUrl(path, locale),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: {
        id: buildUrl(path, "id"),
        en: buildUrl(path, "en"),
      },
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * Jika siteUrl belum dikonfirmasi, kembalikan array kosong.
   * Sitemap tidak akan menerbitkan URL publik selama prototype.
   */
  if (!seoConfig.siteUrl) {
    return [];
  }

  const activeProjects = getActiveProjectsSync();
  const dehir = activeProjects.find((p) => p.id === "dehir") || activeProjects[0];
  const dehirSlug = dehir ? dehir.slug : "dehir";
  const units = getUnitsByProjectSync("dehir");
  const unitCodes = units.map((u) => u.unitCode);

  return [
    // Homepage — prioritas tertinggi
    ...buildBilingualEntry("/", "yearly", 1.0),

    // Katalog Proyek
    ...buildBilingualEntry("/projects", "monthly", 0.9),

    // Halaman Eksplorasi Dehir (proyek aktif)
    ...buildBilingualEntry(`/projects/${dehirSlug}`, "monthly", 0.9),

    // Katalog Unit Dehir
    ...buildBilingualEntry(`/projects/${dehirSlug}/units`, "weekly", 0.8),

    // Detail setiap unit Dehir
    ...unitCodes.flatMap((unitCode) =>
      buildBilingualEntry(`/projects/${dehirSlug}/units/${unitCode}`, "weekly", 0.7)
    ),

    // Formulir Minat Dehir
    ...buildBilingualEntry("/interest", "monthly", 0.8),

    // Kontak Perusahaan
    ...buildBilingualEntry("/contact", "monthly", 0.7),
  ];
}
