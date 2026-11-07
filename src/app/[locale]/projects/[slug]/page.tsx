/**
 * Halaman Eksplorasi Proyek — Sidebar + Maps + Site Plan dalam satu halaman.
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { siteConfig, uiConfig, buildAlternates } from "@/config/site";
import { Card } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Sidebar } from "@/components/layout/Sidebar";
import { SitePlanPanel } from "@/features/site-plan/SitePlanPanel";
import { ExplorationV2 } from "@/components/projects/ExplorationV2";
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

  const title = t("explorationTitle")
    .replace("{projectName}", project.fullName);
  const description = t("explorationDescription")
    .replace("{projectName}", project.fullName)
    .replace("{city}", project.location.city)
    .replace("{province}", project.location.province);

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
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ unit?: string }>;
}) {
  const { locale, slug } = await params;
  const { unit: highlightedUnitCode } = await searchParams;
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

  // ── V2 ─────────────────────────────────────────────────────────────────
  if (uiConfig.uiVariant === "v2") {
    return (
      <ExplorationV2
        locale={locale}
        project={project}
        units={units}
        highlightedUnitCode={highlightedUnitCode}
        sitePlanAvailable={SITE_PLAN_AVAILABLE}
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
        }}
      />
    );
  }

  // ── V1 fallback ─────────────────────────────────────────────────────────
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
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">📍 {project.location.city}</h2>
            <Placeholder
              type="map"
              label={tEmpty("sitePlanPlaceholder")}
              description={`${project.location.city}, ${project.location.province}`}
              className="aspect-video"
            />
          </section>

          {/* Site Plan — via SitePlanPanel */}
          <SitePlanPanel
            isAvailable={SITE_PLAN_AVAILABLE}
            units={units}
            highlightedUnitCode={highlightedUnitCode}
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

          {/* Gallery */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">🖼️ {tNav("projects")} — Gallery</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              <Placeholder type="image" label="Foto" className="aspect-square" />
              <Placeholder type="image" label="Foto" className="aspect-square" />
              <Placeholder type="image" label="Foto" className="aspect-square" />
              <Placeholder type="image" label="Foto" className="aspect-square" />
            </div>
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
