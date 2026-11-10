"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BackToTopProps {
  /** Jarak scroll vertikal (px) sebelum tombol muncul */
  threshold?: number;
  /** Label aksesibilitas */
  label?: string;
  /** Kelas CSS tambahan */
  className?: string;
}

/**
 * BackToTop — Tombol kembali ke atas yang muncul saat pengunjung menggulir halaman panjang.
 *
 * Fitur:
 * - Muncul otomatis hanya ketika scrollY > threshold (default 400px).
 * - Smooth scroll ke atas halaman.
 * - Ukuran touch-target 44x44px nyaman untuk mobile dan desktop.
 * - Tidak menghalangi konten penting dan disembunyikan saat mode cetak (print:hidden).
 */
export function BackToTop({
  threshold = 400,
  label = "Kembali ke atas",
  className,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      className={cn(
        "fixed bottom-6 right-6 z-30 flex items-center justify-center rounded-full bg-neutral-900/85 text-white p-3 shadow-lg hover:bg-primary-700 transition-all duration-200 min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-95 animate-fade-in print:hidden backdrop-blur-xs cursor-pointer",
        className
      )}
    >
      <ArrowUp className="h-5 w-5 stroke-[2.25]" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}
