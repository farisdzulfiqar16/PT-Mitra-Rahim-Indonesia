"use client";

import { useState } from "react";
import Image from "next/image";
import { Placeholder, type PlaceholderProps } from "@/components/ui/Placeholder";
import { cn } from "@/lib/utils";

export interface SmartImageProps {
  /** Sumber gambar (path lokal public atau remote URL terkonfigurasi) */
  src?: string | null;
  /** Deskripsi alternatif gambar untuk aksesibilitas dan SEO */
  alt: string;
  /** Rasio aspek kontainer gambar */
  aspectRatio?: "16/9" | "4/3" | "1/1" | "16/10" | "auto";
  /** Tipe ikon placeholder jika gambar belum tersedia / gagal dimuat */
  placeholderType?: PlaceholderProps["type"];
  /** Label teks pada placeholder */
  placeholderLabel?: string;
  /** Deskripsi detail pada placeholder */
  placeholderDescription?: string;
  /** Apakah gambar memiliki prioritas pemuatan tinggi (LCP / Hero) */
  priority?: boolean;
  /** Aturan ukuran responsif untuk srcset browser */
  sizes?: string;
  /** Class CSS kustom untuk kontainer pembungkus */
  className?: string;
  /** Class CSS kustom langsung untuk elemen <Image> */
  imageClassName?: string;
}

const aspectClasses = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "16/10": "aspect-[16/10]",
  auto: "",
};

/**
 * SmartImage — Komponen media cerdas berbasis Next.js Image dengan graceful fallback.
 *
 * Keunggulan teknis:
 * 1. Otomatis menggunakan optimasi `next/image` (WebP/AVIF, lazy loading, srcset).
 * 2. Jika `src` belum disediakan, otomatis menampilkan `Placeholder` yang rapi tanpa error.
 * 3. Jika pemuatan file gambar gagal (404/corrupt), otomatis beralih ke `Placeholder` tanpa layout shift.
 * 4. Mendukung rasio aspek tetap untuk mencegah Cumulative Layout Shift (CLS).
 */
export function SmartImage({
  src,
  alt,
  aspectRatio = "16/9",
  placeholderType = "image",
  placeholderLabel,
  placeholderDescription,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className,
  imageClassName,
}: SmartImageProps) {
  const [hasError, setHasError] = useState(false);

  // Jika tidak ada sumber gambar atau terjadi error saat memuat, gunakan Placeholder
  if (!src || hasError) {
    return (
      <Placeholder
        type={placeholderType}
        label={placeholderLabel || alt}
        description={placeholderDescription}
        className={cn(aspectRatio !== "auto" && aspectClasses[aspectRatio], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-neutral-100",
        aspectRatio !== "auto" && aspectClasses[aspectRatio],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        onError={() => setHasError(true)}
        className={cn(
          "object-cover object-center transition-all duration-300",
          imageClassName
        )}
      />
    </div>
  );
}
