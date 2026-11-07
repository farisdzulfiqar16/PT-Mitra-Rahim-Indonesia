"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

/**
 * NavbarMobileMenu — Hamburger menu interaktif untuk tampilan mobile.
 *
 * Memenuhi acceptance criteria Task 7:
 * - Hamburger button dengan touch target minimum 44×44px.
 * - Aksesibel dengan state aria-expanded dan keyboard support (Escape to close).
 * - Menampilkan daftar tautan navigasi lengkap, Language Switcher, dan tombol WhatsApp.
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
        aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
        className="inline-flex items-center justify-center rounded-lg p-2.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px] min-w-[44px]"
      >
        <span className="sr-only">{isOpen ? "Tutup menu" : "Buka menu"}</span>
        {isOpen ? (
          /* Icon X */
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Icon Hamburger */
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu Mobile */}
      {isOpen && (
        <div
          id="mobile-navigation-menu"
          className="absolute left-0 right-0 top-full border-b border-neutral-200 bg-white/98 px-4 py-5 shadow-lg backdrop-blur sm:px-6 animate-in slide-in-from-top-2 duration-150"
        >
          <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={handleClose}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2.5 text-base font-medium transition-colors min-h-[44px]",
                    isActive
                      ? "bg-primary-50 text-primary-700 font-semibold"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-primary-700"
                  )}
                >
                  {label}
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
