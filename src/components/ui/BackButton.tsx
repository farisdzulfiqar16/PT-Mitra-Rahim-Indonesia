"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BackButtonProps {
  /** URL tujuan fallback jika riwayat browser tidak tersedia */
  fallbackHref: string;
  /** Label teks tombol */
  label?: string;
  /** Kelas CSS tambahan */
  className?: string;
}

/**
 * BackButton — Tombol navigasi kembali pintar untuk Celestia.
 *
 * Mengutamakan navigasi history browser (`router.back()`) jika pengunjung
 * datang dari halaman sebelumnya di situs ini. Jika pengunjung mengakses
 * halaman secara langsung (misal deep-link), secara otomatis menggunakan
 * `fallbackHref`.
 */
export function BackButton({ fallbackHref, label = "Kembali", className }: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    // Jika ada history browser di sesi ini, gunakan router.back()
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
    // Jika tidak (dibuka langsung), biarkan tautan Link href berjalan ke fallbackHref
  };

  return (
    <Link
      href={fallbackHref}
      onClick={handleBack}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-neutral-200/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 hover:text-primary-700 hover:border-neutral-300 transition-colors min-h-[36px] sm:min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        className
      )}
    >
      <ArrowLeft className="h-3.5 w-3.5 stroke-[2.25] text-neutral-500 group-hover:text-primary-700" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
