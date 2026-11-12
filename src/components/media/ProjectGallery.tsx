"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Images, X } from "lucide-react";
import { Placeholder } from "@/components/ui/Placeholder";
import { cn } from "@/lib/utils";

export interface GalleryImageItem {
  id?: string;
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectGalleryProps {
  /** Daftar gambar resmi (jika sudah tersedia) */
  images?: GalleryImageItem[];
  /** Judul seksi galeri */
  title?: string;
  /** Label fallback saat gambar kosong */
  emptyLabel?: string;
  /** Deskripsi fallback saat gambar kosong */
  emptyDescription?: string;
  /** Locale aktif (id | en) */
  locale?: string;
  /** Class CSS kustom */
  className?: string;
}

/**
 * ProjectGallery — Komponen galeri foto proyek Celestia.
 *
 * Memenuhi spesifikasi Wave 4:
 * 1. Mendukung banyak gambar secara dinamis.
 * 2. Responsif pada layar desktop (grid 4 kolom) dan mobile (grid 2 kolom).
 * 3. Memiliki fallback graceful saat aset belum tersedia tanpa menampilkan gambar fiktif.
 * 4. Interaktif: klik foto untuk melihat tampilan penuh (lightbox preview) dengan dukungan tombol Escape.
 */
export function ProjectGallery({
  images = [],
  title,
  emptyLabel,
  emptyDescription,
  locale = "id",
  className,
}: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImageItem | null>(null);

  // Tutup lightbox saat tombol Escape ditekan
  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  const fallbackLabel =
    emptyLabel || (locale === "en" ? "Site Documentation" : "Dokumentasi Lapangan");
  const fallbackDesc =
    emptyDescription ||
    (locale === "en"
      ? "Official project photo documentation is being prepared by the media team."
      : "Dokumentasi foto resmi proyek sedang dipersiapkan oleh tim media.");

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <Images className="h-5 w-5 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
          <span>{title}</span>
        </h3>
      )}

      {/* Kondisi 1: Aset gambar belum tersedia → Tampilkan placeholder grid terstruktur */}
      {images.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-2xs"
            >
              <Placeholder
                type="image"
                label={`${fallbackLabel} ${idx}`}
                description={idx === 1 ? fallbackDesc : undefined}
                className="aspect-[4/3] rounded-none border-0"
              />
            </div>
          ))}
        </div>
      ) : (
        /* Kondisi 2: Aset gambar resmi tersedia */
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((item, index) => (
            <button
              key={item.id || item.src || index}
              type="button"
              onClick={() => setSelectedImage(item)}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer shadow-xs shadow-[0_1px_3px_0_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.7)] transition-all duration-300 hover:shadow-md hover:border-primary-300/80 hover:-translate-y-0.5"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-neutral-900/0 transition-colors group-hover:bg-neutral-900/20" />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/85 via-neutral-900/40 to-transparent p-3 text-left">
                  <p className="text-[11px] font-medium text-white truncate">{item.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal Sederhana */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between bg-neutral-950/95 px-5 py-3.5 text-white border-t border-neutral-800/80">
              <p className="text-sm font-medium">{selectedImage.caption || selectedImage.alt}</p>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                aria-label={locale === "en" ? "Close image preview" : "Tutup preview gambar"}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-800/90 border border-neutral-700/80 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 hover:border-neutral-600 hover:text-white transition-all min-h-[44px] min-w-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 active:scale-95"
              >
                <X className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                <span>{locale === "en" ? "Close" : "Tutup"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
