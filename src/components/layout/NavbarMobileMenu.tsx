"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, House, Building2, ClipboardList, MessageCircle } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { cn } from "@/lib/utils";

export interface NavLinkItem {
  href: string;
  label: string;
}

export interface NavbarMobileMenuProps {
  locale: string;
  navLinks: NavLinkItem[];
  waDisabledMessage: string;
}

function getNavIcon(href: string) {
  if (href.endsWith("/projects")) return Building2;
  if (href.endsWith("/interest")) return ClipboardList;
  if (href.endsWith("/contact")) return MessageCircle;
  return House;
}

/**
 * NavbarMobileMenu — Hamburger menu interaktif untuk tampilan mobile.
 *
 * Memenuhi acceptance criteria:
 * - Hamburger & Close icons menggunakan Lucide Icons.
 * - Touch target minimum 44×44px.
 * - Aksesibel dengan state aria-expanded dan keyboard support (Escape to close).
 * - Menampilkan daftar tautan navigasi lengkap dengan ikon, Language Switcher, dan tombol WhatsApp.
 */
export function NavbarMobileMenu({
  locale,
  navLinks,
  waDisabledMessage,
}: NavbarMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Pola resmi React untuk mereset state saat rute berpindah tanpa cascading effect renders
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Tutup menu saat tombol Escape ditekan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  return (
    <div className="flex items-center md:hidden">
      {/* Hamburger Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-menu"
        aria-label={
          isOpen
            ? locale === "en"
              ? "Close navigation menu"
              : "Tutup menu navigasi"
            : locale === "en"
            ? "Open navigation menu"
            : "Buka menu navigasi"
        }
        className="inline-flex items-center justify-center rounded-lg p-2.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px] min-w-[44px]"
      >
        <span className="sr-only">
          {isOpen
            ? locale === "en"
              ? "Close menu"
              : "Tutup menu"
            : locale === "en"
            ? "Open menu"
            : "Buka menu"}
        </span>
        {isOpen ? (
          <X className="h-6 w-6 stroke-[2]" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6 stroke-[2]" aria-hidden="true" />
        )}
      </button>

      {/* Dropdown Menu Mobile */}
      {isOpen && (
        <div
          id="mobile-navigation-menu"
          className="absolute left-0 right-0 top-full border-b border-neutral-200 bg-white/98 px-4 py-5 shadow-lg backdrop-blur sm:px-6 animate-in slide-in-from-top-2 duration-150"
        >
          <nav className="flex flex-col space-y-1.5" aria-label="Mobile Navigation">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              const Icon = getNavIcon(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={handleClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors min-h-[44px]",
                    isActive
                      ? "bg-primary-50 text-primary-800 font-semibold shadow-2xs"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-primary-700"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 stroke-[1.75]",
                      isActive ? "text-primary-700" : "text-neutral-400"
                    )}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                {locale === "en" ? "Language" : "Bahasa"}
              </span>
              <LanguageSwitcher currentLocale={locale} size="sm" />
            </div>

            <div className="pt-2">
              <WhatsAppButton
                locale={locale as "id" | "en"}
                context="homepage"
                variant="primary"
                fullWidth
                disabledMessage={waDisabledMessage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
