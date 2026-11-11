/**
 * Homepage Celestia — Portal Promosi Properti.
 *
 * Layout dikontrol oleh uiConfig.uiVariant di src/config/site.ts:
 *   "v1" → layout awal
 *   "v2" → layout portal properti modern dengan micro-interactions & alur terarah
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { siteConfig, uiConfig, buildAlternates } from "@/config/site";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectCardVisual } from "@/components/projects/ProjectCardVisual";
import { HomepageV2 } from "@/components/homepage/HomepageV2";
import { getProjectGalleryImages } from "@/data/media/dehir-gallery";
import { getAllProjects } from "@/services";

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

  const allProjects = await getAllProjects();
  const dehir = allProjects.find((p) => p.id === "dehir") || allProjects[0];
  const pabuaran = allProjects.find((p) => p.id === "pabuaran") || allProjects[1];

  // ── V2 Layout (Portal Properti Modern) ───────────────────────────────────
  if (uiConfig.uiVariant === "v2") {
    return (
      <HomepageV2
        locale={locale}
        dehir={dehir}
        pabuaran={pabuaran}
        galleryImages={getProjectGalleryImages("dehir", locale)}
        t={{
          portalBadge: t("portalBadge"),
          heroHeadline: t("portalHeadline"),
          heroSub: t("portalSub"),
          ctaExplore: tCta("exploreProjects"),
          ctaWhatsApp: locale === "en" ? "Consult via WhatsApp" : "Tanya Marketing",
          ctaWhatsAppDisabled: tWa("disabled"),
          projectsTitle: t("projectsTitle"),
          projectsSubtitle: t("projectsSubtitle"),
          projectActive: tStatus("available"),
          projectComingSoon: tStatus("comingSoon"),
          viewDetail: tCta("viewDetail"),
          viewInfo: tCta("getInfo"),
          featuresTitle: t("featuresTitle"),
          feature1Title: t("feature1Title"),
          feature1Desc: t("feature1Desc"),
          feature2Title: t("feature2Title"),
          feature2Desc: t("feature2Desc"),
          feature3Title: t("feature3Title"),
          feature3Desc: t("feature3Desc"),
          explorationTitle: t("explorationSectionTitle"),
          explorationDesc: t("explorationSectionDesc"),
          galleryTitle: t("galleryTitle"),
          videoTitle: t("videoTitle"),
          readyToExplore: t("readyToExplore"),
          ctaExploreAll: t("ctaExploreAll"),
          trustBadge1: t("trustBadge1"),
          trustBadge2: t("trustBadge2"),
          trustBadge3: t("trustBadge3"),
          dehirSubtitle: t("dehirSubtitle"),
          pabuaranSubtitle: t("pabuaranSubtitle"),
          featuresSubtitle: t("featuresSubtitle"),
          explorationBadge: t("explorationBadge"),
          ctaExploreDehir: t("ctaExploreDehir"),
          ctaViewUnits: t("ctaViewUnits"),
          sitePlanCardLabel: t("sitePlanCardLabel"),
          sitePlanCardDesc: t("sitePlanCardDesc"),
          closingCtaDesc: t("closingCtaDesc"),
        }}
      />
    );
  }

  // ── V1 Layout (Fallback) ────────────────────────────────────────────────
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
          <Card as="article" href={`/${locale}/projects/dehir`} interactive className="flex flex-col overflow-hidden">
            <ProjectCardVisual
              project={dehir}
              aspectRatio="16/9"
              locale={locale}
              className="rounded-t-lg border-0 border-b border-neutral-200"
            />
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
          <Card as="article" href={`/${locale}/projects/pabuaran`} interactive className="flex flex-col overflow-hidden opacity-90">
            <ProjectCardVisual
              project={pabuaran}
              aspectRatio="16/9"
              locale={locale}
              className="rounded-t-lg border-0 border-b border-neutral-200"
            />
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">{pabuaran.name}</h3>
                <Badge variant="coming-soon">{tStatus("comingSoon")}</Badge>
              </div>
              <p className="text-sm text-neutral-600">{pabuaran.fullName}</p>
              <p className="mt-2 text-sm text-neutral-400">{pabuaran.location.city}, {pabuaran.location.province}</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
