"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export interface LanguageSwitcherProps {
  /** Locale aktif saat ini (id atau en) */
  currentLocale: string;
  /** Class CSS tambahan */
  className?: string;
  /** Ukuran tombol: sm untuk navbar / header, md untuk menu / drawer */
  size?: "sm" | "md";
}

function LanguageSwitcherInner({
  currentLocale,
  className,
  size = "sm",
}: LanguageSwitcherProps) {
  const pathname = usePathname() || `/${currentLocale}`;
  const searchParams = useSearchParams();

  // Helper untuk membuat href target locale dengan mempertahankan path dan query
  const getTargetHref = (targetLocale: string): string => {
    const segments = pathname.split("/").filter(Boolean);

    let targetPath = "";
    if (segments.length > 0 && (segments[0] === "id" || segments[0] === "en")) {
      segments[0] = targetLocale;
      targetPath = `/${segments.join("/")}`;
    } else {
      targetPath = `/${targetLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    }

    const query = searchParams?.toString();
    return query ? `${targetPath}?${query}` : targetPath;
  };

  const idHref = getTargetHref("id");
  const enHref = getTargetHref("en");

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs min-h-[30px]",
    md: "px-4 py-2 text-sm min-h-[40px]",
  };

  return (
    <div
      role="group"
      aria-label="Pilih Bahasa / Language Selection"
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-neutral-200 bg-neutral-50/60 p-0.5",
        className
      )}
    >
      <Link
        href={idHref}
        aria-current={currentLocale === "id" ? "true" : undefined}
        aria-label="Beralih ke Bahasa Indonesia"
        className={cn(
          "rounded-full font-semibold transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          sizeClasses[size],
          currentLocale === "id"
            ? "bg-primary-700 text-white shadow-xs"
            : "text-neutral-500 hover:text-primary-700 hover:bg-neutral-100"
        )}
      >
        ID
      </Link>
      <Link
        href={enHref}
        aria-current={currentLocale === "en" ? "true" : undefined}
        aria-label="Switch to English"
        className={cn(
          "rounded-full font-semibold transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          sizeClasses[size],
          currentLocale === "en"
            ? "bg-primary-700 text-white shadow-xs"
            : "text-neutral-500 hover:text-primary-700 hover:bg-neutral-100"
        )}
      >
        EN
      </Link>
    </div>
  );
}

/**
 * LanguageSwitcher — Toggle bahasa ID ↔ EN.
 *
 * Memenuhi acceptance criteria Task 7:
 * - Mempertahankan seluruh segmen path (misal: /id/projects/dehir/units/A1 → /en/projects/dehir/units/A1).
 * - Mempertahankan query parameter (misal: ?unit=A1).
 * - Dibungkus Suspense agar memenuhi standar SSG prerendering Next.js App Router.
 */
export function LanguageSwitcher(props: LanguageSwitcherProps) {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs min-h-[30px]",
    md: "px-4 py-2 text-sm min-h-[40px]",
  };

  return (
    <Suspense
      fallback={
        <div
          role="group"
          aria-label="Pilih Bahasa / Language Selection"
          className={cn(
            "flex items-center gap-0.5 rounded-full border border-neutral-200 bg-neutral-50/60 p-0.5",
            props.className
          )}
        >
          <span
            className={cn(
              "rounded-full font-semibold flex items-center justify-center",
              sizeClasses[props.size ?? "sm"],
              props.currentLocale === "id"
                ? "bg-primary-700 text-white shadow-xs"
                : "text-neutral-500"
            )}
          >
            ID
          </span>
          <span
            className={cn(
              "rounded-full font-semibold flex items-center justify-center",
              sizeClasses[props.size ?? "sm"],
              props.currentLocale === "en"
                ? "bg-primary-700 text-white shadow-xs"
                : "text-neutral-500"
            )}
          >
            EN
          </span>
        </div>
      }
    >
      <LanguageSwitcherInner {...props} />
    </Suspense>
  );
}
