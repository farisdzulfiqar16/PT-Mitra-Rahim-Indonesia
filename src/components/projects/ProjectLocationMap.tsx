"use client";

import { useState } from "react";
import { MapPin, Navigation, ExternalLink, ShieldCheck, Map as MapIcon, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectLocationMapProps {
  /** Nama lengkap proyek (contoh: Celestia Jatiluhur) */
  projectName: string;
  /** Alamat lengkap terformat untuk query / tampilan */
  formattedAddress: string;
  /** URL Google Maps eksternal jika tersedia */
  mapsUrl?: string;
  /** Apakah alamat memiliki detail jalan yang terverifikasi (cth: Dehir punya streetAddress) */
  hasVerifiedStreetAddress: boolean;
  /** Locale aktif ("id" | "en") */
  locale?: string;
  /** Judul atau label aksesibilitas */
  title?: string;
  /** Label tombol Google Maps */
  viewOnMapsLabel?: string;
  /** Aspect ratio kontainer map */
  aspectRatio?: "video" | "4/3" | "square" | "auto";
  /** Class styling tambahan */
  className?: string;
}

/**
 * ProjectLocationMap — Komponen visual peta lokasi proyek Celestia V1.
 *
 * Mengikuti spesifikasi Task P2.2:
 * 1. Proyek dengan alamat terverifikasi (Celestia Jatiluhur / Dehir):
 *    - Menggunakan Google Maps visual preview melalui iframe embed resmi (tanpa biaya / tanpa API key berbayar).
 *    - Lazy-loaded (`loading="lazy"`), responsive aspect ratio, dan penanda pin lokasi terverifikasi.
 *    - Dilengkapi tombol tautan langsung ke aplikasi Google Maps.
 * 2. Proyek dalam tahap persiapan (Celestia Jatiranggon / Pabuaran):
 *    - Menggunakan visual placeholder bermerek dengan konteks wilayah (Kawasan Jatiranggon, Kota Bekasi).
 *    - Tidak mengarang koordinat fiktif atau pin lokasi palsu.
 *    - Menjelaskan status persiapan master plan secara jujur dan profesional.
 */
export function ProjectLocationMap({
  projectName,
  formattedAddress,
  mapsUrl,
  hasVerifiedStreetAddress,
  locale = "id",
  title,
  viewOnMapsLabel,
  aspectRatio = "video",
  className,
}: ProjectLocationMapProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const isEn = locale === "en";

  const defaultTitle = title || (isEn ? `Location Map — ${projectName}` : `Peta Lokasi — ${projectName}`);
  const defaultCtaLabel =
    viewOnMapsLabel || (isEn ? "Open in Google Maps" : "Buka di Google Maps");

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "4/3"
      ? "aspect-[4/3]"
      : aspectRatio === "square"
      ? "aspect-square"
      : "min-h-[220px]";

  // ── Kasus 1: Alamat terverifikasi (Dehir / Celestia Jatiluhur) ─────────────
  if (hasVerifiedStreetAddress) {
    const embedQuery = encodeURIComponent(formattedAddress);
    const embedUrl = `https://maps.google.com/maps?q=${embedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    return (
      <div className={cn("overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs shadow-[0_2px_8px_-1px_rgba(28,41,34,0.05),inset_0_1px_0_0_rgba(255,255,255,0.9)]", className)}>
        {/* Visual Map Frame */}
        <div className={cn("relative w-full bg-neutral-100 overflow-hidden", aspectClass)}>
          {/* Loading placeholder skeleton */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-400 animate-pulse">
              <MapIcon className="h-6 w-6 stroke-[1.75]" aria-hidden="true" />
              <span className="text-xs font-medium">
                {isEn ? "Loading interactive map..." : "Memuat peta interaktif..."}
              </span>
            </div>
          )}

          {/* Official Google Maps Embed Iframe */}
          <iframe
            src={embedUrl}
            title={defaultTitle}
            aria-label={defaultTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIframeLoaded(true)}
            className={cn(
              "h-full w-full border-0 transition-opacity duration-300",
              iframeLoaded ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Verified Location Badge Overlay */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-neutral-800 shadow-xs backdrop-blur-md border border-neutral-200/90 shadow-[0_1px_4px_0_rgba(28,41,34,0.06)]">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-700 stroke-[2]" aria-hidden="true" />
            <span>{isEn ? "Verified Project Location" : "Lokasi Proyek Terverifikasi"}</span>
          </div>
        </div>

        {/* CTA Bar */}
        {mapsUrl && (
          <div className="p-3 bg-white border-t border-neutral-100">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-600 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[42px] border border-primary-800/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
            >
              <Navigation className="h-4 w-4 stroke-[2]" aria-hidden="true" />
              <span>{defaultCtaLabel}</span>
              <ExternalLink className="h-3.5 w-3.5 stroke-[2] opacity-80" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    );
  }

  // ── Kasus 2: Alamat dalam persiapan / tingkat kawasan (Jatiranggon / Pabuaran) ─
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs shadow-[0_2px_8px_-1px_rgba(28,41,34,0.05),inset_0_1px_0_0_rgba(255,255,255,0.9)]", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1C2C24] via-[#16231D] to-[#101A15] p-6 text-center text-white select-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
          aspectClass
        )}
      >
        {/* Background Grid Pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-15"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern id="loc-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                className="text-amber-200"
              />
              <circle cx="16" cy="16" r="1" className="fill-amber-300/40" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#loc-grid)" />
        </svg>

        {/* Central visual indicator */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-2 max-w-xs px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/30">
            <Compass className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
          </div>

          <p className="text-sm font-bold text-white tracking-tight">
            {projectName}
          </p>

          <p className="flex items-center justify-center gap-1 text-xs text-amber-200/90 font-medium">
            <MapPin className="h-3 w-3 shrink-0 stroke-[2]" aria-hidden="true" />
            <span>{formattedAddress}</span>
          </p>

          <p className="text-[11px] text-neutral-400 leading-snug pt-1">
            {isEn
              ? "Official coordinates and interactive map will be published after master plan confirmation."
              : "Titik koordinat dan peta interaktif resmi akan dipublikasikan setelah konfirmasi master plan."}
          </p>
        </div>
      </div>

      <div className="p-3 bg-neutral-50/60 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span className="font-medium text-[11px]">
          {isEn ? "Status: Planning Phase" : "Status: Tahap Perencanaan Kawasan"}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
          {isEn ? "Master Plan in Prep" : "Master Plan Persiapan"}
        </span>
      </div>
    </div>
  );
}
