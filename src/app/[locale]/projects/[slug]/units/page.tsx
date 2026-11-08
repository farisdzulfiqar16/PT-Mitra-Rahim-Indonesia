/**
 * Katalog Unit — menampilkan daftar unit dalam proyek terpilih.
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { siteConfig, uiConfig, buildAlternates } from "@/config/site";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { UnitCatalogV2 } from "@/components/projects/UnitCatalogV2";
import {
  getAllProjectsSync,
  getProjectBySlug,
  getProjectBySlugSync,
  getUnitsByProject,
} from "@/services";
import type { UnitStatus } from "@/types";

/** OG locale mapping */
const OG_LOCALE: Record<string, string> = {
  id: "id_ID",
  en: "en_US",
};

/** Generate static params untuk semua kombinasi locale × slug proyek */
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

  const title = t("unitCatalogTitle")
    .replace("{projectName}", project.fullName);
  const description = t("unitCatalogDescription")
    .replace("{projectName}", project.fullName)
    .replace("{city}", project.location.city);

  const alternates = buildAlternates(`/projects/${slug}/units`, locale);

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

export default async function UnitCatalogPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("nav");
  const tUnit = await getTranslations("unit");
  const tStatus = await getTranslations("status");
  const tEmpty = await getTranslations("empty");
  const tCta = await getTranslations("cta");
  const tWa = await getTranslations("whatsapp");
  const tProject = await getTranslations("project");

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const units = await getUnitsByProject(project.id);

  // ── V2 ─────────────────────────────────────────────────────────────────
  if (uiConfig.uiVariant === "v2") {
    return (
      <UnitCatalogV2
        locale={locale}
        project={project}
        units={units}
        labels={{
          home: tNav("home"),
          projects: tNav("projects"),
          available: tStatus("available"),
          process: tStatus("process"),
          sold: tStatus("sold"),
          unknown: tStatus("unknown"),
          noUnits: tEmpty("noUnits"),
          projectUnitsPreparation: tEmpty("projectUnitsPreparation"),
          viewDetail: tCta("viewDetail"),
          contactForPrice: tUnit("contactForPrice"),
          contactWhatsApp: tCta("contactWhatsApp"),
          waDisabled: tWa("disabled"),
          filterAll: locale === "en" ? "All" : "Semua",
          kavlingMeasurementDisclaimer: tProject("kavlingMeasurementDisclaimer"),
          brochureContactTitle: tProject("brochureContactTitle"),
          brochureContactNotice: tProject("brochureContactNotice"),
          temporaryContactBadge: tProject("temporaryContactBadge"),
          projectAddressLabel: tProject("projectAddressLabel"),
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
          { label: project.name, href: `/${locale}/projects/${project.slug}` },
          { label: "Unit" },
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">{project.fullName}</h1>
        <p className="mt-1 text-sm text-neutral-500">{project.location.city}, {project.location.province}</p>
      </div>

      {units.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-400">{tEmpty("noUnits")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <Card
              key={unit.unitCode}
              as="article"
              href={`/${locale}/projects/${project.slug}/units/${unit.unitCode}`}
              interactive
              className="flex flex-col"
            >
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-900">{unit.unitCode}</h2>
                  <Badge variant={unit.status as UnitStatus}>
                    {tStatus(unit.status === "unknown" ? "unknown"
                      : unit.status === "available" ? "available"
                      : unit.status === "process" ? "process"
                      : "sold")}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500">{unit.unitType}</p>
                <p className="mt-2 text-sm font-medium text-primary-700">{tUnit("contactForPrice")}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
