/**
 * Robots.txt Celestia MVP — perlindungan prototype.
 *
 * Strategi:
 * - Selama prototype (seoConfig.indexingEnabled = false):
 *     - Semua crawler diblokir: Disallow: /
 *     - Tidak ada sitemap yang direferensikan
 * - Saat production diaktifkan (seoConfig.indexingEnabled = true dan siteUrl dikonfirmasi):
 *     - Allow: /
 *     - Sitemap direferensikan
 *
 * PENTING:
 * - robots.txt bukan mekanisme kerahasiaan — hanya konvensi.
 * - Jangan aktifkan indexing hanya karena build berhasil atau NODE_ENV === "production".
 * - Perubahan dari prototype ke production membutuhkan perubahan EKSPLISIT di seoConfig.
 */

import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Prototype — izinkan crawler membaca halaman agar meta robots noindex terbaca,
  // tapi tidak menyertakan sitemap dan tidak mengaktifkan indexing.
  // robots.txt bukan mekanisme kerahasiaan; perlindungan utama adalah meta robots noindex.
  if (!seoConfig.indexingEnabled || !seoConfig.siteUrl) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
      // Tidak menyertakan sitemap selama prototype agar URL tidak terpublikasi
    };
  }

  // Production — aktifkan indexing setelah konfirmasi perusahaan
  const sitemapUrl = `${seoConfig.siteUrl.replace(/\/$/, "")}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: sitemapUrl,
  };
}
