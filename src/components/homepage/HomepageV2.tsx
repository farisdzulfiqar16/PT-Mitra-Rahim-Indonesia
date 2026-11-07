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
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { Card } from "@/components/ui/Card";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { siteConfig } from "@/config/site";
import type { Project } from "@/types";

interface HomepageV2Props {
  locale: string;
  dehir: Project;
  pabuaran: Project;
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

export function HomepageV2({ locale, dehir, pabuaran, t }: HomepageV2Props) {
  return (
    <div className="flex flex-col">
      {/* ── 1. Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F5F2EC] min-h-[76vh] flex items-center border-b border-neutral-200/80">
        <HeroPattern />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-center">
            {/* Left Column: Portal Overview Copy (7 cols) */}
            <div className="lg:col-span-7 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100/80 border border-primary-200/80 px-3.5 py-1 text-xs font-semibold text-primary-800 mb-4 shadow-2xs">
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
                  className="inline-flex items-center justify-center rounded-lg bg-primary-700 px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 active:scale-[0.99]"
                >
                  {t.ctaExplore}
                </Link>

                <WhatsAppButton
                  locale={locale as "id" | "en"}
                  context="homepage"
                  variant="outline"
                  disabledMessage={t.ctaWhatsAppDisabled}
                  className="rounded-lg px-7 py-3.5 shadow-2xs hover:-translate-y-0.5 transition-all duration-200 min-h-[44px]"
                >
                  {t.ctaWhatsApp}
                </WhatsAppButton>
              </div>

              {/* Portal Quick Trust Badges */}
              <div className="mt-8 pt-6 border-t border-neutral-300/60 flex flex-wrap items-center gap-6 text-xs text-neutral-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-primary-700 font-bold">✓</span>
                  <span>Informasi Kavling Transparan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-primary-700 font-bold">✓</span>
                  <span>Eksplorasi Denah & Site Plan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-primary-700 font-bold">✓</span>
                  <span>Konsultasi Bebas Biaya</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase (5 cols) */}
            <div className="lg:col-span-5 animate-fade-in delay-100">
              <div className="relative group overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-2 shadow-lg transition-transform duration-300 hover:shadow-xl">
                <Placeholder
                  type="image"
                  label="Celestia Dehir — Jatiluhur"
                  className="w-full aspect-[4/3] rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
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
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800 transition-colors"
          >
            {t.ctaExploreAll} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Card Proyek 1: Dehir (Aktif) */}
          <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs transition-all duration-300 hover:shadow-lg hover:border-primary-300 hover:-translate-y-1">
            <div className="overflow-hidden bg-neutral-100">
              <Placeholder
                type="image"
                label={dehir.name}
                className="aspect-video w-full border-0 border-b border-neutral-100 rounded-none transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-700">
                  📍 {dehir.location.city}, {dehir.location.province}
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
                  Kavling Siap Bangun & Hunian
                </span>
                <Link
                  href={`/${locale}/projects/dehir`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors min-h-[36px]"
                >
                  {t.viewDetail}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>

          {/* Card Proyek 2: Pabuaran (Coming Soon) */}
          <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 shadow-xs transition-all duration-300 hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5">
            <div className="overflow-hidden bg-neutral-100">
              <Placeholder
                type="general"
                label={pabuaran.name}
                className="aspect-video w-full border-0 border-b border-neutral-100 rounded-none transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  📍 {pabuaran.location.city}, {pabuaran.location.province}
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
                  Tahap Persiapan
                </span>
                <Link
                  href={`/${locale}/projects/pabuaran`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors min-h-[36px]"
                >
                  {t.viewInfo}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── 3. Nilai & Keunggulan Layanan Celestia ─────────────────────── */}
      <section className="bg-neutral-50/90 py-16 border-y border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {t.featuresTitle}
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Komitmen kami dalam menghadirkan informasi properti yang andal, jelas, dan transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card className="p-7 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 text-2xl">
                🔎
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                {t.feature1Title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {t.feature1Desc}
              </p>
            </Card>

            <Card className="p-7 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 text-2xl">
                📍
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                {t.feature2Title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {t.feature2Desc}
              </p>
            </Card>

            <Card className="p-7 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 text-2xl">
                🤝
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                {t.feature3Title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {t.feature3Desc}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── 4. Fitur Eksplorasi Properti & Site Plan Showcase ─────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary-200/80 bg-gradient-to-br from-primary-50/70 to-white p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700">
                Eksplorasi Mendalam
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
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-primary-600 transition-colors shadow-xs"
                >
                  🗺️ Buka Eksplorasi Proyek Dehir
                </Link>
                <Link
                  href={`/${locale}/projects/dehir/units`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  📋 Lihat Daftar Unit Kavling
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <Placeholder
                  type="map"
                  label="Site Plan & Tata Letak Kavling"
                  description="Tersedia di dalam halaman eksplorasi proyek Dehir"
                  className="aspect-[16/10] w-full rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Dokumentasi & Galeri ───────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Galeri Visual */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">
              🖼️ {t.galleryTitle}
            </h3>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <Placeholder type="image" label="Foto Lokasi 1" className="aspect-[4/3] transition-transform duration-300 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <Placeholder type="image" label="Foto Lokasi 2" className="aspect-[4/3] transition-transform duration-300 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <Placeholder type="image" label="Foto Akses Kawasan" className="aspect-[4/3] transition-transform duration-300 hover:scale-105" />
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-200">
                <Placeholder type="image" label="Foto Masterplan" className="aspect-[4/3] transition-transform duration-300 hover:scale-105" />
              </div>
            </div>
          </div>

          {/* Video Dokumentasi */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">
              🎬 {t.videoTitle}
            </h3>
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-xs">
              <Placeholder
                type="video"
                label={t.videoTitle}
                className="w-full aspect-[16/10] rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. CTA Penutup ────────────────────────────────────────────── */}
      <section className="bg-primary-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-t border-primary-950">
        <div className="mx-auto max-w-4xl text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.readyToExplore}
          </h2>
          <p className="text-sm sm:text-base text-primary-100 max-w-xl mx-auto leading-relaxed">
            Dapatkan informasi lengkap kavling dan rencanakan kunjungan lokasi bersama tim marketing resmi kami.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href={`/${locale}/projects`}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-primary-900 hover:bg-neutral-100 transition-colors shadow-sm min-h-[44px]"
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
