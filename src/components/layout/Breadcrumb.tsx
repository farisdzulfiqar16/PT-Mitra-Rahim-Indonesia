import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb — Komponen navigasi hierarkis Celestia.
 *
 * Memenuhi acceptance criteria Task 8:
 * - Menampilkan path navigasi lengkap dengan tautan aktif.
 * - Aksesibel dengan semantic HTML (<nav aria-label="Breadcrumb"> dan <ol>).
 * - Menandai elemen aktif dengan aria-current="page".
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-xs sm:text-sm text-neutral-500", className)}
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {item.href && !isLast ? (
                <>
                  <Link
                    href={item.href}
                    className="hover:text-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded"
                  >
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="text-neutral-400 select-none">
                    ›
                  </span>
                </>
              ) : (
                <span
                  aria-current="page"
                  className="font-medium text-neutral-800 truncate max-w-[200px] sm:max-w-none"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
