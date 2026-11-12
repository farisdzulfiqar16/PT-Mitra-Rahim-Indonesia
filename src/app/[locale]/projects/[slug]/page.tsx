/**
 * Halaman Eksplorasi Proyek — Sidebar + Maps + Site Plan dalam satu halaman.
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MapPin, Images, Navigation, ExternalLink } from "lucide-react";
import { siteConfig, uiConfig, buildAlternates, buildGoogleMapsUrl, formatProjectAddress } from "@/config/site";
import { Card } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Sidebar } from "@/components/layout/Sidebar";
import { SitePlanPanel } from "@/features/site-plan/SitePlanPanel";
import { ProjectGallery } from "@/components/media/ProjectGallery";
import { ExplorationV2 } from "@/components/projects/ExplorationV2";
import { getProjectGalleryImages } from "@/data/media/dehir-gallery";
import { ComingSoonTeaser } from "@/components/projects/ComingSoonTeaser";
import {
  getAllProjectsSync,
  getProjectBySlugSync,
  getProjectBySlug,
  getUnitsByProject,
} from "@/services";

/**
 * Apakah denah resmi Dehir sudah tersedia dan dikonfirmasi perusahaan.
 * Ubah menjadi true hanya setelah:
 *   1. Aset SVG denah resmi ada di public/site-plan/dehir.svg
 *   2. Data posisi unit dikonfirmasi di src/data/properties/dehir-site-plan.json
 */
const SITE_PLAN_AVAILABLE = false;

/** OG locale mapping */
const OG_LOCALE: Record<string, string> = {
  id: "id_ID",
  en: "en_US",
};

/** Generate static params untuk semua kombinasi locale × slug */
export function generateStaticParams() {
  const allProjects = getAllProjectsSync();
  const slugs = allProjects.map((p) => p.slug);
  const locales = ["id", "en"];
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  const project = getProjectBySlugSync(slug);
  if (!project) return {};

  const t = await getTranslations({ locale, namespace: "meta" });
  const ogLocale = OG_LOCALE[locale] ?? "id_ID";

  const title = t("explorationTitle", {
    projectName: project.fullName,
  });
  const description = t("explorationDescription", {
    projectName: project.fullName,
    city: project.location.city,
    province: project.location.province,
  });

  const alternates = buildAlternates(`/projects/${slug}`, locale);

  return {
    title,
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

export default async function ExplorationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("nav");
  const tProject = await getTranslations("project");
  const tEmpty = await getTranslations("empty");
  const tCta = await getTranslations("cta");
  const tComingSoon = await getTranslations("comingSoon");
  const tStatus = await getTranslations("status");
  const tSitePlan = await getTranslations("sitePlan");

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Pabuaran — Coming Soon teaser (Task 17)
  if (project.status === "coming-soon") {
    return (
      <ComingSoonTeaser
        locale={locale}
        project={project}
        labels={{
          home: tNav("home"),
          projects: tNav("projects"),
          comingSoon: tComingSoon("title"),
          message: tComingSoon("message"),
          cta: tComingSoon("cta"),
          waDisabled: (await getTranslations("whatsapp"))("disabled"),
        }}
      />
    );
  }

  // Dehir — full exploration page
  const units = await getUnitsByProject(project.id);
  const galleryImages = getProjectGalleryImages(project.slug, locale);
  const tHome = await getTranslations("homepage");

  // ── V2 ─────────────────────────────────────────────────────────────────
  if (uiConfig.uiVariant === "v2") {
    return (
      <ExplorationV2
        locale={locale}
        project={project}
        units={units}
        sitePlanAvailable={SITE_PLAN_AVAILABLE}
        galleryImages={galleryImages}
        labels={{
          home: tNav("home"),
          projects: tNav("projects"),
          available: tStatus("available"),
          process: tStatus("process"),
          sold: tStatus("sold"),
          unknown: tStatus("unknown"),
          comingSoon: tStatus("comingSoon"),
          viewDetail: tCta("viewDetail"),
          viewUnits: tCta("viewUnits"),
          viewSitePlan: tProject("viewSitePlan"),
          sitePlanPlaceholder: tEmpty("sitePlanPlaceholder"),
          sitePlanPlaceholderDesc: tEmpty("sitePlanPlaceholderDesc"),
          unitListTitle: tSitePlan("unitListTitle"),
          unitNotOnPlanNote: tSitePlan("unitNotOnPlanNote"),
          unitSummary: tProject("unitSummary"),
          statusNotConfirmed: tProject("statusNotConfirmed"),
          contactWhatsApp: tCta("contactWhatsApp"),
          waDisabled: (await getTranslations("whatsapp"))("disabled"),
          filterAll: locale === "en" ? "All" : "Semua",
          contactForPrice: (await getTranslations("unit"))("contactForPrice"),
          projectAddressLabel: tProject("projectAddressLabel"),
          buildingTypesSectionTitle: tProject("buildingTypesSectionTitle"),
          buildingTypesSectionSubtitle: tProject("buildingTypesSectionSubtitle"),
          buildingTypesDisclaimer: tProject("buildingTypesDisclaimer"),
          floorPlanInPreparation: tProject("floorPlanInPreparation"),
          floorPlanInPreparationDesc: tProject("floorPlanInPreparationDesc"),
          singleStoreyTag: tProject("singleStoreyTag"),
          specBedrooms: (tProject.raw("specBedrooms") as string) || (locale === "en" ? "{count} Bedrooms" : "{count} Kamar Tidur"),
          specBathrooms: (tProject.raw("specBathrooms") as string) || (locale === "en" ? "{count} Bathroom / Toilet" : "{count} Kamar Mandi / Toilet"),
          specLivingRoom: tProject("specLivingRoom"),
          specKitchen: tProject("specKitchen"),
          specFrontGarden: tProject("specFrontGarden"),
          specBackGarden: tProject("specBackGarden"),
          specCarport: tProject("specCarport"),
          specBuildingArea: tProject("specBuildingArea"),
          facilitiesSectionTitle: tProject("facilitiesSectionTitle"),
          facilitiesSectionSubtitle: tProject("facilitiesSectionSubtitle"),
          facilitiesDisclaimer: tProject("facilitiesDisclaimer"),
          facilityDistanceEstimate: tProject("facilityDistanceEstimate"),
          brochureContactTitle: tProject("brochureContactTitle"),
          brochureContactNotice: tProject("brochureContactNotice"),
          kavlingMeasurementDisclaimer: tProject("kavlingMeasurementDisclaimer"),
          dimensionsLabel: tProject("dimensionsLabel"),
          landAreaLabel: tProject("landAreaLabel"),
          unitKavlingTitle: tProject("unitKavlingTitle"),
          unitKavlingSubtitle: tProject("unitKavlingSubtitle"),
          viewAllUnits: tProject("viewAllUnits"),
          buildingOptionsNotice: tProject("buildingOptionsNotice"),
          temporaryContactBadge: tProject("temporaryContactBadge"),
          viewOnGoogleMaps: tProject("viewOnGoogleMaps"),
          galleryTitle: tHome("galleryTitle"),
        }}
      />
    );
  }

  // ── V1 fallback ─────────────────────────────────────────────────────────
  const mapsUrl = buildGoogleMapsUrl(project.location);
  const fullAddress = formatProjectAddress(project.location);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: tNav("home"), href: `/${locale}` },
          { label: tNav("projects"), href: `/${locale}/projects` },
          { label: project.name },
        ]}
        className="mb-6"
      />

      {/* Project header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">{project.fullName}</h1>
        <p className="mt-1 text-sm text-neutral-500">{project.location.city}, {project.location.province}</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-neutral-600">{project.description}</p>
      </div>

      {/* Main layout: sidebar + content */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <Sidebar
          currentSlug={project.slug}
          locale={locale}
          labels={{
            projectsTitle: tNav("projects"),
            contextualTitle: tNav("interest"),
            viewUnits: tCta("viewUnits"),
            viewSitePlan: tProject("viewSitePlan"),
            interestForm: tCta("interestForm"),
            available: tStatus("available"),
            comingSoon: tStatus("comingSoon"),
          }}
        />

        {/* Content: Maps + Site Plan + Gallery */}
        <div className="flex-1 space-y-6">
          {/* Google Maps placeholder */}
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-neutral-900">
              <MapPin className="h-5 w-5 text-primary-700 stroke-[2]" aria-hidden="true" />
              <span>{project.location.city}</span>
            </h2>
            <Placeholder
              type="map"
              label={tEmpty("sitePlanPlaceholder")}
              description={fullAddress || `${project.location.city}, ${project.location.province}`}
              className="aspect-video"
            />
            {mapsUrl && (
              <div className="mt-3">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-primary-600 bg-primary-700 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-800 transition-colors shadow-xs"
                >
                  <Navigation className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
                  <span>{tProject("viewOnGoogleMaps")}</span>
                  <ExternalLink className="h-3 w-3 stroke-[2] opacity-80" aria-hidden="true" />
                </a>
              </div>
            )}
          </section>

          {/* Site Plan — via SitePlanPanel */}
          <SitePlanPanel
            isAvailable={SITE_PLAN_AVAILABLE}
            units={units}
            highlightedUnitCode={undefined}
            title={tProject("viewSitePlan")}
            placeholderLabel={tEmpty("sitePlanPlaceholder")}
            placeholderDesc={tEmpty("sitePlanPlaceholderDesc")}
            unitListTitle={tSitePlan("unitListTitle")}
            unitNotOnPlanNote={tSitePlan("unitNotOnPlanNote")}
            locale={locale}
            projectSlug={project.slug}
            statusLabels={{
              available: tStatus("available"),
              process: tStatus("process"),
              sold: tStatus("sold"),
              unknown: tStatus("unknown"),
            }}
            viewDetailLabel={tCta("viewDetail")}
          />

          {/* Gallery — sumber yang sama dengan homepage */}
          <section>
            {galleryImages.length > 0 ? (
              <ProjectGallery
                title={tHome("galleryTitle")}
                images={galleryImages}
                locale={locale}
              />
            ) : (
              <>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                  <Images className="h-5 w-5 text-primary-700 stroke-[2]" aria-hidden="true" />
                  <span>{tHome("galleryTitle")}</span>
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  <Placeholder type="image" label="Foto" className="aspect-square" />
                  <Placeholder type="image" label="Foto" className="aspect-square" />
                  <Placeholder type="image" label="Foto" className="aspect-square" />
                  <Placeholder type="image" label="Foto" className="aspect-square" />
                </div>
              </>
            )}
          </section>

          {/* Unit Summary */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">{tProject("unitSummary")}</h2>
            <div className="flex flex-wrap gap-3">
              <Card className="flex-1 p-4">
                <p className="text-xs text-neutral-400">{tProject("statusNotConfirmed")}</p>
                <p className="mt-1 text-lg font-bold text-neutral-600">{units.length} unit</p>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
