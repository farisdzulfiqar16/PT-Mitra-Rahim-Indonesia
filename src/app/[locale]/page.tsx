/**
 * Homepage Celestia — landing page pemasaran.
 *
 * Layout dikontrol oleh uiConfig.uiVariant di src/config/site.ts:
 *   "v1" → layout awal (centered hero, card grid)
 *   "v2" → layout baru (left-aligned hero, dotted bg, nav with WA CTA)
 *
 * Untuk undo ke V1: ubah uiConfig.uiVariant = "v1"
 * Untuk redo ke V2: ubah uiConfig.uiVariant = "v2"
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { siteConfig, uiConfig, buildAlternates } from "@/config/site";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { HomepageV2 } from "@/components/homepage/HomepageV2";
import dehirData from "@/data/projects/dehir.json";
import pabuaranData from "@/data/projects/pabuaran.json";
import type { Project } from "@/types";

/** OG locale mapping: Next.js menggunakan format en_US / id_ID */
const OG_LOCALE: Record<string, string> = {
  id: "id_ID",
  en: "en_US",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const title = t("homepageTitle");
  const description = t("homepageDescription");
  const alternates = buildAlternates("/", locale);
  const ogLocale = OG_LOCALE[locale] ?? "id_ID";

  return {
    title: { absolute: title },
    description,
    alternates: alternates ?? undefined,
    openGraph: {
      title,
      description,
      type: "website",
      locale: ogLocale,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("homepage");
  const tCta = await getTranslations("cta");
  const tStatus = await getTranslations("status");
  const tWa = await getTranslations("whatsapp");

  const dehir = dehirData as Project;
  const pabuaran = pabuaranData as Project;

  // ── V2 Layout ──────────────────────────────────────────────────────────
  if (uiConfig.uiVariant === "v2") {
    return (
      <HomepageV2
        locale={locale}
        dehir={dehir}
        pabuaran={pabuaran}
        t={{
          heroHeadline: locale === "en"
            ? "Houses and plots from Celestia, complete with unit information."
            : "Rumah dan kavling dari Celestia, lengkap dengan informasi unitnya.",
          heroSub: locale === "en"
            ? "Find your ideal property. All information is transparent — from location, plot details, to WhatsApp contact."
            : "Temukan properti idealmu. Semua informasi transparan — dari lokasi, detail kavling, hingga kontak WhatsApp.",
          ctaExplore: tCta("exploreProjects"),
          ctaWhatsApp: locale === "en" ? "Tanya Marketing" : "Tanya Marketing",
          ctaWhatsAppDisabled: tWa("disabled"),
          pickProject: locale === "en" ? "Pick a project" : "Pilih proyek",
          projectActive: tStatus("available"),
          projectComingSoon: tStatus("comingSoon"),
          viewDetail: tCta("viewDetail"),
          viewInfo: tCta("getInfo"),
          galleryTitle: t("galleryTitle"),
          videoTitle: t("videoTitle"),
        }}
      />
    );
  }

  // ── V1 Layout (fallback) ───────────────────────────────────────────────
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gradient-to-b from-primary-50 to-white px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-primary-900 sm:text-4xl lg:text-5xl">
          {t("heroTitle")}
        </h1>
        <p className="max-w-lg text-base text-neutral-600 sm:text-lg">
          {t("heroTagline")}
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/${locale}/projects`}
            className="inline-flex items-center justify-center rounded-lg bg-primary-700 px-8 py-3 text-base font-medium text-white hover:bg-primary-600 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
          >
            {tCta("exploreProjects")}
          </Link>
          <Link
            href={`/${locale}/projects/dehir`}
            className="inline-flex items-center justify-center rounded-lg border border-primary-300 bg-primary-50 px-8 py-3 text-base font-medium text-primary-700 hover:bg-primary-100 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
          >
            {tCta("viewDetail")} — Dehir
          </Link>
        </div>
      </section>

      {/* Project Cards */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t("projectsTitle")}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Dehir — Active */}
          <Card as="article" href={`/${locale}/projects/dehir`} interactive className="flex flex-col">
            <Placeholder type="image" label={t("galleryTitle")} className="rounded-t-lg border-0 border-b border-neutral-200" />
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">{dehir.name}</h3>
                <Badge variant="available">{tStatus("available")}</Badge>
              </div>
              <p className="text-sm text-neutral-600">{dehir.fullName}</p>
              <p className="mt-2 text-sm text-neutral-400">{dehir.location.city}, {dehir.location.province}</p>
            </div>
          </Card>

          {/* Pabuaran — Coming Soon */}
          <Card as="article" interactive className="flex flex-col opacity-90">
            <Placeholder type="general" label={tStatus("comingSoon")} className="rounded-t-lg border-0 border-b border-neutral-200" />
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">{pabuaran.name}</h3>
                <Badge variant="coming-soon">{tStatus("comingSoon")}</Badge>
              </div>
              <p className="text-sm text-neutral-600">{pabuaran.fullName}</p>
              <p className="mt-2 text-sm text-neutral-400">{pabuaran.location.city}, {pabuaran.location.province}</p>
            </div>
          </Card>

          {/* Empty card for grid balance */}
          <Card as="div" className="hidden flex-col sm:flex">
            <Placeholder type="image" label={t("galleryTitle")} className="rounded-t-lg border-0 border-b border-neutral-200 opacity-50" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-neutral-400">—</h3>
              <p className="text-sm text-neutral-300">{tStatus("comingSoon")}</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t("featuresTitle")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <span className="text-2xl" aria-hidden="true">📍</span>
              </div>
              <h3 className="text-base font-semibold text-neutral-900">{t("featuresTitle")}</h3>
              <p className="mt-1 text-sm text-neutral-500">
                {siteConfig.name} — {siteConfig.tagline}
              </p>
            </Card>
            <Card className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <span className="text-2xl" aria-hidden="true">🏠</span>
              </div>
              <h3 className="text-base font-semibold text-neutral-900">Dehir</h3>
              <p className="mt-1 text-sm text-neutral-500">{dehir.shortDescription}</p>
            </Card>
            <Card className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                <span className="text-2xl" aria-hidden="true">🏗️</span>
              </div>
              <h3 className="text-base font-semibold text-neutral-900">Pabuaran</h3>
              <p className="mt-1 text-sm text-neutral-500">{tStatus("comingSoon")}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t("galleryTitle")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Placeholder type="image" label={t("galleryTitle")} className="aspect-video" />
          <Placeholder type="image" label={t("galleryTitle")} className="aspect-video" />
          <Placeholder type="image" label={t("galleryTitle")} className="aspect-video" />
          <Placeholder type="image" label={t("galleryTitle")} className="aspect-video" />
        </div>
      </section>

      {/* Video Section */}
      <section className="bg-neutral-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">{t("videoTitle")}</h2>
          <Placeholder type="video" label={t("videoTitle")} className="aspect-video" />
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-primary-700 px-4 py-12 text-center text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold">{t("readyToExplore")}</h2>
          <Link
            href={`/${locale}/projects`}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-medium text-primary-700 hover:bg-neutral-50 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
          >
            {tCta("exploreProjects")}
          </Link>
        </div>
      </section>
    </div>
  );
}
