"use client";

import { Placeholder } from "@/components/ui/Placeholder";
import { cn } from "@/lib/utils";

export interface ProjectVideoPlayerProps {
  /** URL Video resmi (YouTube embed atau URL MP4 terverifikasi) */
  videoUrl?: string | null;
  /** Judul video */
  title: string;
  /** Label fallback saat video belum tersedia */
  emptyLabel?: string;
  /** Deskripsi fallback saat video belum tersedia */
  emptyDescription?: string;
  /** Locale aktif (id | en) */
  locale?: string;
  /** Class CSS kustom */
  className?: string;
}

/**
 * ProjectVideoPlayer — Komponen pemutar video dokumentasi proyek Celestia.
 *
 * Memenuhi spesifikasi Wave 4:
 * 1. Mendukung video YouTube embed dan video direct stream (MP4/WebM).
 * 2. Memiliki fallback graceful yang informatif ketika video belum tersedia,
 *    tanpa menggunakan video dummy atau tautan fiktif.
 * 3. Menjaga rasio aspek video 16:9 yang responsif di seluruh ukuran layar.
 */
export function ProjectVideoPlayer({
  videoUrl,
  title,
  emptyLabel,
  emptyDescription,
  locale = "id",
  className,
}: ProjectVideoPlayerProps) {
  const fallbackLabel = emptyLabel || title || (locale === "en" ? "Project Video" : "Video Proyek");
  const fallbackDesc =
    emptyDescription ||
    (locale === "en"
      ? "Official video documentation is currently in production by PT Mitra Rahim Indonesia."
      : "Video dokumentasi resmi proyek sedang dalam tahap produksi oleh PT Mitra Rahim Indonesia.");

  // Kondisi 1: Video belum tersedia → Placeholder informatif
  if (!videoUrl) {
    return (
      <div className={cn("overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xs", className)}>
        <Placeholder
          type="video"
          label={fallbackLabel}
          description={fallbackDesc}
          className="w-full aspect-[16/10] rounded-xl"
        />
      </div>
    );
  }

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-neutral-200 bg-black p-1 shadow-sm", className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        {isYouTube ? (
          <iframe
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <video
            controls
            preload="metadata"
            className="h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
            <track kind="captions" />
            {locale === "en"
              ? "Your browser does not support the video tag."
              : "Browser Anda tidak mendukung pemutaran video."}
          </video>
        )}
      </div>
    </div>
  );
}
