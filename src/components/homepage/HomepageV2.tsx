/**
 * HomepageV2 — Tampilan Portal Promosi Properti Celestia.
 *
 * Disusun dengan alur portal properti yang terarah:
 * 1. Hero: Pengenalan Celestia sebagai portal promosi properti resmi PT Mitra Rahim Indonesia.
 * 2. Proyek yang Dipasarkan: Kartu proyek unggulan (Dehir aktif, Pabuaran persiapan).
 * 3. Keunggulan Properti: Transparansi data, kepastian legalitas bertahap, dan konsultasi langsung.
 * 4. Eksplorasi Properti: Edukasi bahwa site plan dan unit catalog dapat diakses di detail proyek.
 * 5. Dokumentasi & Galeri: Media visual dan video proyek.
 * 6. CTA Penutup: Jalur navigasi ke katalog proyek atau konsultasi langsung.
 *
 * Micro-interactions:
 * - Hover lift halus pada kartu properti (-translate-y-1, shadow-lg).
 * - Zoom halus pada gambar galeri saat hover.
 * - Transisi tombol interaktif dengan active state feedback.
 * - Sesuai aturan aksesibilitas dan prefers-reduced-motion.
 */

import Link from "next/link";
import {
  Check,
  MapPin,
  Search,
  Handshake,
  Compass,
  ClipboardList,
  Video,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { ProjectCardVisual } from "@/components/projects/ProjectCardVisual";
import { ProjectGallery } from "@/components/media/ProjectGallery";
import { ProjectVideoPlayer } from "@/components/media/ProjectVideoPlayer";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { siteConfig } from "@/config/site";
import type { ProjectGalleryImage } from "@/data/media/dehir-gallery";
import type { Project } from "@/types";

interface HomepageV2Props {
  locale: string;
  dehir: Project;
  pabuaran: Project;
  galleryImages?: ProjectGalleryImage[];
  t: {
    portalBadge: string;
    heroHeadline: string;
    heroSub: string;
    ctaExplore: string;
    ctaWhatsApp: string;
    ctaWhatsAppDisabled: string;
    projectsTitle: string;
    projectsSubtitle: string;
    projectActive: string;
    projectComingSoon: string;
    viewDetail: string;
    viewInfo: string;
    featuresTitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    explorationTitle: string;
    explorationDesc: string;
    galleryTitle: string;
    videoTitle: string;
    readyToExplore: string;
    ctaExploreAll: string;
    trustBadge1: string;
    trustBadge2: string;
    trustBadge3: string;
    dehirSubtitle: string;
    pabuaranSubtitle: string;
    featuresSubtitle: string;
    explorationBadge: string;
    ctaExploreDehir: string;
    ctaViewUnits: string;
    sitePlanCardLabel: string;
    sitePlanCardDesc: string;
    closingCtaDesc: string;
  };
}

/**
 * Pola dots subtle untuk aksen visual hero tanpa dependensi gambar berat.
 */
function HeroPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.06] pointer-events-none"
      aria-hidden="true"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='2' fill='%2344705A'/%3E%3C/svg%3E\")",
        backgroundSize: "24px 24px",
      }}
    />
  );
}

export function HomepageV2({ locale, dehir, pabuaran, galleryImages = [], t }: HomepageV2Props) {
  return (
    <div className="flex flex-col">
      {/* ── 1. Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F4EE] via-[#F5F2EA] to-[#EEEAE1] min-h-[76vh] flex items-center border-b border-neutral-200/80">
        <HeroPattern />
        <div className="ambient-glow-hero absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-center">
            {/* Left Column: Portal Overview Copy (7 cols) */}
            <div className="lg:col-span-7 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100/90 border border-primary-200/90 px-3.5 py-1 text-xs font-semibold text-primary-800 mb-4 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse" />
                {t.portalBadge} · {siteConfig.company}
              </div>

              <h1 className="text-3xl font-extrabold leading-tight text-neutral-900 sm:text-4xl lg:text-5xl tracking-tight">
                {t.heroHeadline}
              </h1>

              <p className="mt-5 text-sm sm:text-base text-neutral-600 sm:leading-relaxed max-w-2xl">
                {t.heroSub}
              </p>

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Link
                  href={`/${locale}/projects`}
                  className="inline-flex items-center justify-center rounded-lg bg-primary-700 px-7 py-3.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-600 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 border border-primary-800/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
                >
                  {t.ctaExplore}
                </Link>

                <WhatsAppButton
                  locale={locale as "id" | "en"}
                  context="homepage"
                  variant="outline"
                  disabledMessage={t.ctaWhatsAppDisabled}
                  className="rounded-lg px-7 py-3.5 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 min-h-[44px] bg-white/80 backdrop-blur-xs"
                >
                  {t.ctaWhatsApp}
                </WhatsAppButton>
              </div>

              {/* Portal Quick Trust Badges */}
              <div className="mt-8 pt-6 border-t border-neutral-300/60 flex flex-wrap items-center gap-6 text-xs text-neutral-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary-700 stroke-[2.5]" aria-hidden="true" />
                  <span>{t.trustBadge1}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary-700 stroke-[2.5]" aria-hidden="true" />
                  <span>{t.trustBadge2}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-primary-700 stroke-[2.5]" aria-hidden="true" />
                  <span>{t.trustBadge3}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase (5 cols) */}
            <div className="lg:col-span-5 animate-fade-in delay-100">
              <div className="relative group overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-2.5 shadow-md shadow-[0_4px_24px_-2px_rgba(28,41,34,0.08),inset_0_1px_0_0_rgba(255,255,255,0.95)] transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                <ProjectCardVisual
                  project={dehir}
                  aspectRatio="4/3"
                  priority
                  locale={locale}
                  className="w-full rounded-xl"
                />
                <div className="p-4 bg-white rounded-b-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-neutral-900">{dehir.fullName}</p>
                    <p className="text-[11px] text-neutral-400">{dehir.location.city}, {dehir.location.province}</p>
                  </div>
                  <Badge variant="available">{t.projectActive}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Proyek yang Dipasarkan ───────────────────────────────────── */}
      <section className="bg-[#FAF8F5] border-b border-neutral-200/70 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                {t.projectsTitle}
              </h2>
              <p className="mt-2 text-sm text-neutral-500 max-w-xl">
                {t.projectsSubtitle}
              </p>
            </div>
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
            >
              <span>{t.ctaExploreAll}</span>
              <ArrowRight className="h-4 w-4 stroke-[2]" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Card Proyek 1: Dehir (Aktif) */}
            <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-300 hover:shadow-lg hover:border-primary-300/90 hover:-translate-y-1 shadow-[0_2px_8px_-1px_rgba(28,41,34,0.05),0_1px_3px_0_rgba(28,41,34,0.03),inset_0_1px_0_0_rgba(255,255,255,0.95)]">
              <div className="overflow-hidden bg-neutral-100">
                <ProjectCardVisual
                  project={dehir}
                  aspectRatio="16/9"
                  locale={locale}
                  className="aspect-video w-full border-0 border-b border-neutral-100 rounded-none"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary-700 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0 stroke-[1.75]" aria-hidden="true" />
                    <span>{dehir.location.city}, {dehir.location.province}</span>
                  </span>
                  <Badge variant="available">{t.projectActive}</Badge>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                  {dehir.fullName}
                </h3>

                <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed line-clamp-3">
                  {dehir.description}
                </p>

                <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-medium">
                    {t.dehirSubtitle}
                  </span>
                  <Link
                    href={`/${locale}/projects/dehir`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors min-h-[36px]"
                  >
                    <span>{t.viewDetail}</span>
                    <ArrowRight className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Card Proyek 2: Pabuaran (Coming Soon) */}
            <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/95 shadow-2xs transition-all duration-300 hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5 shadow-[0_1px_4px_0_rgba(28,41,34,0.03),inset_0_1px_0_0_rgba(255,255,255,0.9)]">
              <div className="overflow-hidden bg-neutral-100">
                <ProjectCardVisual
                  project={pabuaran}
                  aspectRatio="16/9"
                  locale={locale}
                  className="aspect-video w-full border-0 border-b border-neutral-100 rounded-none"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0 stroke-[1.75]" aria-hidden="true" />
                    <span>{pabuaran.location.city}, {pabuaran.location.province}</span>
                  </span>
                  <Badge variant="coming-soon">{t.projectComingSoon}</Badge>
                </div>

                <h3 className="text-xl font-bold text-neutral-900">
                  {pabuaran.fullName}
                </h3>

                <p className="mt-2.5 text-sm text-neutral-500 leading-relaxed line-clamp-3">
                  {pabuaran.description}
                </p>

                <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-medium">
                    {t.pabuaranSubtitle}
                  </span>
                  <Link
                    href={`/${locale}/projects/pabuaran`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors min-h-[36px]"
                  >
                    <span>{t.viewInfo}</span>
                    <ArrowRight className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── 3. Nilai & Keunggulan Layanan Celestia ─────────────────────── */}
      <section className="bg-[#F2F7F4] py-18 sm:py-20 border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {t.featuresTitle}
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              {t.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="bg-white border border-neutral-200/75 p-7 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary-300/60 hover:-translate-y-1 shadow-[0_2px_8px_-1px_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.95)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100/90 text-primary-700 border border-primary-200/70 shadow-2xs">
                <Search className="h-6 w-6 stroke-[1.75]" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                {t.feature1Title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>

            <div className="bg-white border border-neutral-200/75 p-7 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary-300/60 hover:-translate-y-1 shadow-[0_2px_8px_-1px_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.95)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100/90 text-primary-700 border border-primary-200/70 shadow-2xs">
                <MapPin className="h-6 w-6 stroke-[1.75]" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                {t.feature2Title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>

            <div className="bg-white border border-neutral-200/75 p-7 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary-300/60 hover:-translate-y-1 shadow-[0_2px_8px_-1px_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.95)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100/90 text-primary-700 border border-primary-200/70 shadow-2xs">
                <Handshake className="h-6 w-6 stroke-[1.75]" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                {t.feature3Title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Fitur Eksplorasi Properti & Site Plan Showcase ─────────── */}
      <section className="bg-white py-18 sm:py-20 border-b border-neutral-200/70">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-primary-200/80 bg-gradient-to-br from-primary-50/70 via-white to-primary-50/40 p-8 sm:p-12 shadow-sm shadow-[0_4px_24px_-4px_rgba(28,41,34,0.05),inset_0_1px_0_0_rgba(255,255,255,0.95)]">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-700">
                  {t.explorationBadge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                  {t.explorationTitle}
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {t.explorationDesc}
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/projects/dehir`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-primary-600 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xs min-h-[44px] border border-primary-800/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
                  >
                    <Compass className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                    <span>{t.ctaExploreDehir}</span>
                  </Link>
                  <Link
                    href={`/${locale}/projects/dehir/units`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300/90 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all min-h-[44px] shadow-2xs"
                  >
                    <ClipboardList className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                    <span>{t.ctaViewUnits}</span>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-sm shadow-[0_2px_10px_0_rgba(28,41,34,0.05)]">
                  <Placeholder
                    type="map"
                    label={t.sitePlanCardLabel}
                    description={t.sitePlanCardDesc}
                    className="aspect-[16/10] w-full rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Dokumentasi & Galeri ───────────────────────────────────── */}
      <section className="bg-[#FAF8F5] py-18 sm:py-20 border-b border-neutral-200/70">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Galeri Visual Resmi */}
            <ProjectGallery
              title={t.galleryTitle}
              locale={locale}
              images={galleryImages}
            />

            {/* Video Dokumentasi Resmi */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Video className="h-5 w-5 text-primary-700 stroke-[1.75]" aria-hidden="true" />
                <span>{t.videoTitle}</span>
              </h3>
              <ProjectVideoPlayer
                title={t.videoTitle}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA Penutup ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C3326] via-[#223E2F] to-[#172B20] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-primary-950">
        <div className="ambient-glow-dark absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.readyToExplore}
          </h2>
          <p className="text-sm sm:text-base text-primary-100 max-w-xl mx-auto leading-relaxed">
            {t.closingCtaDesc}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href={`/${locale}/projects`}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-primary-900 shadow-xs hover:bg-neutral-50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all min-h-[44px] border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9)]"
            >
              {t.ctaExploreAll}
            </Link>
            <WhatsAppButton
              locale={locale as "id" | "en"}
              context="homepage"
              variant="primary"
              disabledMessage={t.ctaWhatsAppDisabled}
              className="w-full sm:w-auto min-h-[44px]"
            >
              {t.ctaWhatsApp}
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </div>
  );
}
