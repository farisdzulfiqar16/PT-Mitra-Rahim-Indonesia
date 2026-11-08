"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn, MapPin, X } from "lucide-react";
import { Placeholder } from "@/components/ui/Placeholder";
import type { PropertyUnit } from "@/types";

export interface InteractiveSitePlanProps {
  /** Daftar unit yang akan ditampilkan di Site Plan */
  units: PropertyUnit[];
  /** Kode unit yang di-highlight via deep-link (dari parameter ?unit=) */
  highlightedUnitCode?: string;
  /** Teks label untuk aksesibilitas */
  ariaLabel: string;
  /** Path file denah resmi (SVG atau PNG/WebP resolusi tinggi) */
  sitePlanUrl?: string;
  /** Slug proyek */
  projectSlug?: string;
}

/**
 * InteractiveSitePlan — Komponen penampil denah kawasan & kavling resmi.
 *
 * Memenuhi spesifikasi Wave 4:
 * 1. Skalabilitas tampilan: dapat memuat denah berformat SVG maupun gambar resolusi tinggi.
 * 2. Responsif di desktop dan mobile dengan kontainer rasio terkontrol.
 * 3. Fitur zoom/tampilan penuh yang mudah digunakan pengunjung.
 * 4. Fallback aman jika aset denah belum siap atau gagal dimuat.
 * 5. Menjaga integritas data: TIDAK mengarang koordinat poligon sebelum data resmi diserahkan Owner.
 */
export function InteractiveSitePlan({
  units,
  highlightedUnitCode,
  ariaLabel,
  sitePlanUrl,
  projectSlug = "dehir",
}: InteractiveSitePlanProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Jika URL denah tidak diberikan atau terjadi error saat load aset, gunakan fallback
  if (!sitePlanUrl || loadError) {
    return (
      <Placeholder
        type="site-plan"
        label={ariaLabel}
        description={`Denah resmi kawasan ${projectSlug.toUpperCase()} sedang dalam verifikasi arsitek.`}
        className="aspect-[16/10] w-full"
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Container Penampil Denah */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-xs">
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={sitePlanUrl}
            alt={ariaLabel}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            onError={() => setLoadError(true)}
            className="object-contain p-2"
          />
        </div>

        {/* Toolbar kontrol denah */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs hover:bg-white backdrop-blur-xs min-h-[32px] cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5 stroke-[2]" aria-hidden="true" />
            <span>Perbesar Denah</span>
          </button>
        </div>
      </div>

      {/* Indikator Unit Terpilih jika ada deep-link ?unit= */}
      {highlightedUnitCode && (
        <div className="flex items-center gap-2 rounded-lg bg-primary-50 border border-primary-200 px-3.5 py-2 text-xs text-primary-800">
          <MapPin className="w-4 h-4 shrink-0 text-primary-700 stroke-[2]" aria-hidden="true" />
          <span>
            Kavling terpilih dari navigasi: <strong>{highlightedUnitCode}</strong> (dari total {units.length} unit)
          </span>
        </div>
      )}

      {/* Modal Zoom Denah Resolusi Penuh */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-h-[95vh] max-w-5xl w-full overflow-hidden rounded-2xl bg-white shadow-2xl p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-2">
              <h3 className="text-sm font-bold text-neutral-900">{ariaLabel}</h3>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 min-h-[32px]"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                <span>Tutup</span>
              </button>
            </div>
            <div className="relative aspect-[16/10] w-full flex-1 overflow-auto">
              <Image
                src={sitePlanUrl}
                alt={ariaLabel}
                fill
                sizes="95vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
