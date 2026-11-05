import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { siteConfig, uiConfig, buildWhatsAppUrl, isWhatsAppNumberPlaceholder } from "@/config/site";

/**
 * Navbar utama — konsisten di semua halaman.
 * Server Component, menggunakan next-intl untuk terjemahan.
 *
 * Tampilan dikontrol oleh uiConfig.uiVariant di src/config/site.ts:
 *   "v1" → navbar minimal tanpa CTA
 *   "v2" → navbar dengan nav links lebih lengkap + WhatsApp CTA button
 *
 * Untuk rollback: ubah uiConfig.uiVariant = "v1"
 */
export async function Navbar() {
  const t = await getTranslations("nav");
  const tWa = await getTranslations("whatsapp");
  const locale = await getLocale();
  const isV2 = uiConfig.uiVariant === "v2";

  const waDisabled = isWhatsAppNumberPlaceholder();
  const waMessage = locale === "en"
    ? siteConfig.contact.whatsappMessageEn
    : siteConfig.contact.whatsappMessageId;
  const waUrl = waDisabled ? undefined : buildWhatsAppUrl(waMessage);

  if (isV2) {
    return (
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <span className="text-base font-bold tracking-tight text-primary-700">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-5 md:flex">
            {[
              { href: `/${locale}`, label: t("home") },
              { href: `/${locale}/projects`, label: t("projects") },
              { href: `/${locale}/projects/dehir`, label: "Dehir" },
              { href: `/${locale}/projects/dehir/units`, label: "Site Plan" },
              { href: `/${locale}/interest`, label: t("interest") },
              { href: `/${locale}/contact`, label: t("contact") },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-neutral-600 hover:text-primary-700 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: lang switcher + WA button */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-0.5 rounded-full border border-neutral-200 px-1">
              <Link
                href={`/id`}
                className={`rounded-full px-3 py-1 text-xs font-medium min-h-[30px] flex items-center transition-colors ${locale === "id" ? "bg-primary-700 text-white" : "text-neutral-500 hover:text-primary-700"}`}
              >
                ID
              </Link>
              <Link
                href={`/en`}
                className={`rounded-full px-3 py-1 text-xs font-medium min-h-[30px] flex items-center transition-colors ${locale === "en" ? "bg-primary-700 text-white" : "text-neutral-500 hover:text-primary-700"}`}
              >
                EN
              </Link>
            </div>

            {/* WhatsApp CTA */}
            {waDisabled ? (
              <span
                className="hidden md:inline-flex items-center justify-center gap-1.5 rounded-md bg-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-400 cursor-not-allowed min-h-[36px]"
                aria-disabled="true"
                title={tWa("disabled")}
              >
                WhatsApp
              </span>
            ) : (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center justify-center gap-1.5 rounded-md bg-whatsapp px-4 py-2 text-xs font-semibold text-white hover:bg-whatsapp-hover transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-1"
              >
                <span aria-hidden="true">💬</span>
                WhatsApp
              </a>
            )}

            {/* Mobile: projects shortcut */}
            <Link
              href={`/${locale}/projects`}
              className="text-sm font-medium text-neutral-600 hover:text-primary-700 md:hidden"
            >
              {t("projects")}
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  // V1 — layout awal
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

          {/* Language Switcher */}
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
