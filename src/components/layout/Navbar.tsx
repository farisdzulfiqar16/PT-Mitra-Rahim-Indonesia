import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { siteConfig } from "@/config/site";

/**
 * Navbar utama — konsisten di semua halaman.
 * Server Component, menggunakan next-intl untuk terjemahan.
 */
export async function Navbar() {
  const t = await getTranslations("nav");
  const locale = await getLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-700">{siteConfig.name}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href={`/${locale}`} className="text-sm font-medium text-neutral-600 hover:text-primary-700 transition-colors">
            {t("home")}
          </Link>
          <Link href={`/${locale}/projects`} className="text-sm font-medium text-neutral-600 hover:text-primary-700 transition-colors">
            {t("projects")}
          </Link>
          <Link href={`/${locale}/contact`} className="text-sm font-medium text-neutral-600 hover:text-primary-700 transition-colors">
            {t("contact")}
          </Link>

          {/* Language Switcher — simple toggle ke locale lain */}
          <div className="flex items-center gap-1 rounded-full border border-neutral-200 px-1">
            <Link
              href={`/id`}
              className={`rounded-full px-3 py-1 text-xs font-medium min-h-[32px] flex items-center ${locale === "id" ? "bg-primary-700 text-white" : "text-neutral-600 hover:text-primary-700"}`}
            >
              ID
            </Link>
            <Link
              href={`/en`}
              className={`rounded-full px-3 py-1 text-xs font-medium min-h-[32px] flex items-center ${locale === "en" ? "bg-primary-700 text-white" : "text-neutral-600 hover:text-primary-700"}`}
            >
              EN
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href={`/${locale}/projects`} className="text-sm font-medium text-neutral-600 hover:text-primary-700">
            {t("projects")}
          </Link>
          <div className="flex items-center gap-1 rounded-full border border-neutral-200 px-1">
            <Link
              href={`/id`}
              className={`rounded-full px-2 py-1 text-xs font-medium ${locale === "id" ? "bg-primary-700 text-white" : "text-neutral-600"}`}
            >
              ID
            </Link>
            <Link
              href={`/en`}
              className={`rounded-full px-2 py-1 text-xs font-medium ${locale === "en" ? "bg-primary-700 text-white" : "text-neutral-600"}`}
            >
              EN
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
