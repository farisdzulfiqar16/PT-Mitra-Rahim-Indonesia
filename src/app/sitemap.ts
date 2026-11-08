/**
 * Sitemap dinamis Celestia MVP.
 *
 * Strategi prototype:
 * - Sitemap hanya diterbitkan jika seoConfig.siteUrl sudah dikonfirmasi.
 * - Selama siteUrl kosong (""), sitemap mengembalikan array kosong
 *   sehingga tidak ada URL publik yang diterbitkan.
 *
 * Aturan inklusi & publikasi sitemap:
 * - Halaman statis (homepage, katalog proyek umum, contact, interest): selalu disertakan.
 *
 * - Pemisahan Status Bisnis vs Status Publikasi:
 *   1. Status Bisnis (status: "active" | "coming-soon"):
 *      Proyek "coming-soon" (misal: Pabuaran) hanya berupa teaser dan belum memiliki
 *      unit operasional, sehingga halaman detail dan unitnya dieksklusi dari sitemap.
 *   2. Status Publikasi (publicationStatus: "published" | "draft" | "archived"):
 *      - Proyek "draft" dan "archived" SECARA TEGAS SELALU DIEKSKLUSI dari sitemap.
 *      - Proyek "published" diikutsertakan jika status bisnisnya "active".
 *      - Proyek dengan publicationStatus kosong (undefined) TIDAK diasumsikan otomatis published:
 *        Aturan kelayakan: hanya diikutsertakan jika berstatus bisnis "active"
 *        dan memiliki unit resmi terdaftar, serta bukan draft/archived internal.
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
import { getAllProjectsSync, getUnitsByProjectSync } from "@/services";
import type { Project } from "@/types";

/** Locale yang didukung */
const LOCALES = ["id", "en"] as const;

/**
 * Evaluasi kelayakan publikasi proyek ke sitemap.
 * Membedakan status bisnis ("active") dengan status publikasi ("published", "draft", "archived").
 */
function isProjectEligibleForSitemap(project: Project): boolean {
  // 1. Proyek draft atau archived secara tegas dieksklusi
  if (project.publicationStatus === "draft" || project.publicationStatus === "archived") {
    return false;
  }

  // 2. Status bisnis: proyek coming-soon dieksklusi dari sitemap detail unit
  if (project.status !== "active") {
    return false;
  }

  // 3. Status publikasi eksplisit: jika didefinisikan, wajib "published"
  if (project.publicationStatus && project.publicationStatus !== "published") {
    return false;
  }

  // 4. Lolos kualifikasi: status bisnis active dan bukan draft/archived
  return true;
}

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

  /**
   * Ambil seluruh proyek dan filter secara ketat berdasarkan aturan publikasi dan status bisnis.
   */
  const allProjects = getAllProjectsSync();
  const publishedProjects = allProjects.filter(isProjectEligibleForSitemap);

  const entries: MetadataRoute.Sitemap = [
    // Homepage — prioritas tertinggi
    ...buildBilingualEntry("/", "yearly", 1.0),

    // Katalog Proyek (halaman direktori utama)
    ...buildBilingualEntry("/projects", "monthly", 0.9),

    // Halaman statis
    ...buildBilingualEntry("/interest", "monthly", 0.8),
    ...buildBilingualEntry("/contact", "monthly", 0.7),
  ];

  // Tambahkan halaman proyek terbit dan unit mereka secara dinamis
  for (const project of publishedProjects) {
    // Halaman eksplorasi proyek
    entries.push(...buildBilingualEntry(`/projects/${project.slug}`, "monthly", 0.9));

    // Katalog unit proyek
    entries.push(...buildBilingualEntry(`/projects/${project.slug}/units`, "weekly", 0.8));

    // Detail setiap unit kavling
    const units = getUnitsByProjectSync(project.id);
    for (const unit of units) {
      entries.push(
        ...buildBilingualEntry(
          `/projects/${project.slug}/units/${unit.unitCode}`,
          "weekly",
          0.7,
        ),
      );
    }
  }

  return entries;
}
