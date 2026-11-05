/**
 * HomepageV2 — layout baru menyerupai desain referensi.
 *
 * Perbedaan utama dari V1:
 * - Hero left-aligned dengan background pola dots/checkerboard di kanan
 * - Dua CTA button: "Jelajahi Proyek" (primary) + "Tanya Marketing" (wa)
 * - Section "Pilih proyek" dengan card horizontal + gambar placeholder besar
 * - Typography lebih besar dan bold untuk headline
 *
 * Untuk rollback ke V1: ubah uiConfig.uiVariant = "v1" di src/config/site.ts
 */

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import {
  buildWhatsAppUrl,
  isWhatsAppNumberPlaceholder,
  siteConfig,
} from "@/config/site";
import type { Project } from "@/types";

interface HomepageV2Props {
  locale: string;
  dehir: Project;
  pabuaran: Project;
  t: {
    heroHeadline: string;
    heroSub: string;
    ctaExplore: string;
    ctaWhatsApp: string;
    ctaWhatsAppDisabled: string;
    pickProject: string;
    projectActive: string;
    projectComingSoon: string;
    viewDetail: string;
    viewInfo: string;
    galleryTitle: string;
    videoTitle: string;
  };
}

/**
 * Pola checkerboard / dots untuk area kanan hero — SVG inline, zero-dependency.
 * Menyerupai elemen dekoratif di desain referensi.
 */
function HeroPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.07]"
      aria-hidden="true"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' x='0' y='0' fill='%2344705A'/%3E%3Crect width='4' height='4' x='8' y='8' fill='%2344705A'/%3E%3Crect width='4' height='4' x='16' y='0' fill='%2344705A'/%3E%3Crect width='4' height='4' x='0' y='16' fill='%2344705A'/%3E%3Crect width='4' height='4' x='16' y='16' fill='%2344705A'/%3E%3C/svg%3E\")",
        backgroundSize: "20px 20px",
      }}
    />
  );
}

export function HomepageV2({ locale, dehir, pabuaran, t }: HomepageV2Props) {
  const waDisabled = isWhatsAppNumberPlaceholder();
  const waUrl = waDisabled
    ? undefined
    : buildWhatsAppUrl(
        locale === "en"
          ? siteConfig.contact.whatsappMessageEn
          : siteConfig.contact.whatsappMessageId
      );

  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F5F2EC] min-h-[72vh] flex items-center">
        <HeroPattern />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Left: copy */}
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary-600">
                {siteConfig.name} — {siteConfig.company}
              </p>
              <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl lg:text-[3.25rem]">
                {t.heroHeadline}
              </h1>
              <p className="mt-4 text-base text-neutral-600 sm:text-lg leading-relaxed">
                {t.heroSub}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={`/${locale}/projects`}
                  className="inline-flex items-center justify-center rounded-md bg-primary-700 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
                >
                  {t.ctaExplore}
                </Link>

                {waDisabled ? (
                  <span
                    className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-7 py-3 text-sm font-semibold text-neutral-400 min-h-[44px] cursor-not-allowed"
                    aria-disabled="true"
                    title={t.ctaWhatsAppDisabled}
                  >
                    {t.ctaWhatsApp}
                  </span>
                ) : (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-whatsapp px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-whatsapp-hover transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2"
                  >
                    <span aria-hidden="true">💬</span>
                    {t.ctaWhatsApp}
                  </a>
                )}
              </div>
            </div>

            {/* Right: main image placeholder */}
            <div className="relative">
              <Placeholder
                type="image"
                label={t.galleryTitle}
                className="w-full aspect-[4/3] rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pilih proyek ─────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-xl font-bold text-neutral-900">
          {t.pickProject}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Dehir — active */}
          <article className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md hover:border-primary-300">
            <Placeholder
              type="image"
              label={dehir.fullName}
              className="w-full aspect-[16/9] border-0 border-b border-neutral-100 rounded-none"
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900">{dehir.name}</h3>
                <span className="text-xs text-neutral-400">/ {dehir.fullName}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-500 leading-relaxed flex-1">
                {dehir.shortDescription}
              </p>
              <div className="mt-4">
                <Link
                  href={`/${locale}/projects/dehir`}
                  className="inline-flex items-center justify-center rounded-md border border-primary-300 bg-primary-50 px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  {t.viewDetail}
                </Link>
              </div>
            </div>
          </article>

          {/* Pabuaran — coming soon */}
          <article className="relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 opacity-80">
            <Placeholder
              type="general"
              label={t.projectComingSoon}
              className="w-full aspect-[16/9] border-0 border-b border-neutral-100 rounded-none"
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-1 flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-700">{pabuaran.name}</h3>
                <span className="text-xs text-neutral-400">/ {pabuaran.fullName}</span>
                <Badge variant="coming-soon">{t.projectComingSoon}</Badge>
              </div>
              <p className="mt-1 text-sm text-neutral-400 leading-relaxed flex-1">
                {pabuaran.shortDescription}
              </p>
              <div className="mt-4">
                <Link
                  href={`/${locale}/projects/pabuaran`}
                  className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
                >
                  {t.viewInfo}
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── Galeri ───────────────────────────────────────────────────── */}
      <section className="bg-neutral-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-xl font-bold text-neutral-900">{t.galleryTitle}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Placeholder type="image" label={t.galleryTitle} className="aspect-square rounded-lg" />
            <Placeholder type="image" label={t.galleryTitle} className="aspect-square rounded-lg" />
            <Placeholder type="image" label={t.galleryTitle} className="aspect-square rounded-lg" />
            <Placeholder type="image" label={t.galleryTitle} className="aspect-square rounded-lg" />
          </div>
        </div>
      </section>

      {/* ── Video ────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-neutral-900">{t.videoTitle}</h2>
        <Placeholder type="video" label={t.videoTitle} className="aspect-video rounded-xl" />
      </section>
    </div>
  );
}
