import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { siteConfig, uiConfig } from "@/config/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NavbarMobileMenu } from "./NavbarMobileMenu";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";

/**
 * Navbar utama — konsisten di semua halaman.
 * Server Component, menggunakan next-intl untuk terjemahan.
 *
 * Struktur Navigasi Global (Portal Promosi Properti):
 * - Beranda (/)
 * - Proyek (/projects) — katalog seluruh proyek properti
 * - Formulir Minat (/interest) — pengajuan preferensi minat kavling & bangunan
 * - Hubungi (/contact) — informasi kontak perusahaan & saluran komunikasi resmi
 *
 * Catatan Arsitektur:
 * Dehir dan Site Plan sengaja diakses melalui halaman detail Proyek,
 * bukan sebagai navigasi global, agar hierarki portal properti tetap rapi dan terukur.
 */
export async function Navbar() {
  const t = await getTranslations("nav");
  const tWa = await getTranslations("whatsapp");
  const locale = await getLocale();
  const isV2 = uiConfig.uiVariant === "v2";

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/projects`, label: t("projects") },
    { href: `/${locale}/interest`, label: t("interest") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  if (isV2) {
    return (
      <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md transition-all">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Brand Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 text-white font-black text-sm group-hover:bg-primary-600 transition-colors shadow-xs">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-neutral-900 group-hover:text-primary-700 transition-colors">
                {siteConfig.name}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium -mt-1 tracking-wider uppercase">
                Property Portal
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-neutral-600 hover:text-primary-700 transition-colors relative py-1 hover:-translate-y-0.5 duration-150"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions: Language switcher + WA button + Mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Desktop Language switcher */}
            <div className="hidden md:flex">
              <LanguageSwitcher currentLocale={locale} size="sm" />
            </div>

            {/* Desktop WhatsApp CTA */}
            <div className="hidden md:inline-flex">
              <WhatsAppButton
                locale={locale as "id" | "en"}
                context="homepage"
                variant="compact"
                disabledMessage={tWa("disabled")}
                className="shadow-xs hover:shadow transition-shadow"
              >
                WhatsApp
              </WhatsAppButton>
            </div>

            {/* Mobile Hamburger Menu */}
            <NavbarMobileMenu
              locale={locale}
              navLinks={navLinks}
              waDisabledMessage={tWa("disabled")}
            />
          </div>
        </nav>
      </header>
    );
  }

  // V1 Fallback
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-700">{siteConfig.name}</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-neutral-600 hover:text-primary-700 transition-colors"
            >
              {label}
            </Link>
          ))}
          <LanguageSwitcher currentLocale={locale} size="sm" />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <NavbarMobileMenu
            locale={locale}
            navLinks={navLinks}
            waDisabledMessage={tWa("disabled")}
          />
        </div>
      </nav>
    </header>
  );
}
