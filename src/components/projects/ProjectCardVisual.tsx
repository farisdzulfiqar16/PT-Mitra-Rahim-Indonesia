"use client";

import { MapPin, Compass, Sparkles } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export interface ProjectCardVisualProps {
  project: Pick<Project, "slug" | "name" | "fullName" | "status"> & {
    location?: {
      city?: string;
      province?: string;
    };
  };
  aspectRatio?: "16/9" | "4/3" | "auto";
  priority?: boolean;
  className?: string;
  locale?: string;
}

/**
 * ProjectCardVisual — Menampilkan representasi visual proyek Celestia.
 *
 * Logika visual:
 * 1. Proyek dengan aset foto nyata (Dehir / Celestia Jatiluhur):
 *    - Menampilkan foto utama hasil kurasi dokumentasi lapangan (`/images/projects/dehir/gallery/060_IMG_0354.jpg`).
 *    - Dilengkapi SmartImage fallback jika aset gagal dimuat.
 * 2. Proyek dalam tahap persiapan (Pabuaran / Celestia Jatiranggon):
 *    - Menampilkan visual placeholder bermerek dengan background grid arsitektur,
 *      ikon penanda lokasi, identitas proyek, dan badge tahap persiapan master plan.
 *    - Menghindari frame kosong, broken image, maupun pin fiktif.
 */
export function ProjectCardVisual({
  project,
  aspectRatio = "16/9",
  priority = false,
  className,
  locale = "id",
}: ProjectCardVisualProps) {
  const isDehir = project.slug === "dehir";
  const isEn = locale === "en";

  // Celestia Jatiluhur (Dehir) — Menggunakan foto kurasi lapangan aktual
  if (isDehir) {
    return (
      <div className={cn("relative overflow-hidden bg-neutral-100 ring-1 ring-inset ring-black/5", className)}>
        <SmartImage
          src="/images/projects/dehir/gallery/060_IMG_0354.jpg"
          alt={
            isEn
              ? `Site photo of ${project.fullName}`
              : `Dokumentasi lahan proyek ${project.fullName}`
          }
          aspectRatio={aspectRatio}
          priority={priority}
          className="w-full h-full"
          imageClassName="transition-transform duration-700 ease-out group-hover:scale-104"
          placeholderLabel={project.fullName}
          placeholderDescription={
            isEn ? "Field documentation photo" : "Dokumentasi foto lapangan"
          }
        />
        <div className="absolute bottom-3 left-3 rounded-md bg-neutral-900/80 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md border border-white/15 shadow-sm shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
          {isEn ? "Actual Site Photo" : "Dokumentasi Lapangan"}
        </div>
      </div>
    );
  }

  // Celestia Jatiranggon (Pabuaran) atau proyek persiapan lainnya
  const aspectClass =
    aspectRatio === "4/3"
      ? "aspect-[4/3]"
      : aspectRatio === "16/9"
      ? "aspect-video"
      : "min-h-[190px]";

  const locationText = project.location?.city
    ? `${project.location.city}, ${project.location.province || "Jawa Barat"}`
    : "Bekasi, Jawa Barat";

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden border border-neutral-200/80 bg-gradient-to-br from-[#1C2C24] via-[#16231D] to-[#101A15] p-6 text-center text-white select-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]",
        aspectClass,
        className
      )}
      role="img"
      aria-label={`${project.fullName} — ${
        isEn ? "Master Plan Preparation Phase" : "Tahap Persiapan Master Plan"
      }`}
    >
      {/* Background Architectural Grid Pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-15"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id="arch-grid" width="32" height="32" patternUnits="userSpaceOnUse">
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
        <rect width="100%" height="100%" fill="url(#arch-grid)" />
      </svg>

      {/* Decorative radial lighting */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-primary-500/15 blur-2xl" />

      {/* Subtle Celestia brand watermark */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-amber-300/80 uppercase">
        <Sparkles className="h-3 w-3 text-amber-400" aria-hidden="true" />
        <span>CELESTIA</span>
      </div>

      {/* Center Branded Visual Badge */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-2.5 max-w-xs px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/30 shadow-inner backdrop-blur-xs transition-transform duration-500 group-hover:scale-110">
          <Compass className="h-6 w-6 stroke-[1.75]" aria-hidden="true" />
        </div>

        <div>
          <p className="text-base font-bold tracking-tight text-white sm:text-lg">
            {project.fullName}
          </p>
          <p className="mt-0.5 flex items-center justify-center gap-1 text-xs font-medium text-amber-200/90">
            <MapPin className="h-3 w-3 shrink-0 stroke-[2]" aria-hidden="true" />
            <span>{locationText}</span>
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-[11px] font-semibold text-amber-200 backdrop-blur-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>
            {isEn ? "Master Plan in Preparation" : "Tahap Persiapan Master Plan"}
          </span>
        </div>
      </div>
    </div>
  );
}
