/**
 * Detail Unit — menampilkan informasi lengkap satu unit.
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { siteConfig, uiConfig, buildAlternates } from "@/config/site";
import { formatRupiah } from "@/lib/utils";
import { UnitDetailV2 } from "@/components/projects/UnitDetailV2";
import {
  getAllProjectsSync,
  getProjectBySlug,
  getProjectBySlugSync,
  getUnitByCode,
  getUnitsByProjectSync,
} from "@/services";
import type { UnitStatus } from "@/types";

/** OG locale mapping */
const OG_LOCALE: Record<string, string> = {
  id: "id_ID",
  en: "en_US",
};

/** Generate static params untuk seluruh kombinasi locale × slug × unitCode */
export function generateStaticParams() {
  const allProjects = getAllProjectsSync();
  const locales = ["id", "en"];
  return locales.flatMap((locale) =>
    allProjects.flatMap((project) => {
      const units = getUnitsByProjectSync(project.id);
      return units.map((u) => ({
        locale,
        slug: project.slug,
        unitCode: u.unitCode,
      }));
    })
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; unitCode: string }>;
}): Promise<Metadata> {
  const { locale, slug, unitCode } = await params;

  const project = getProjectBySlugSync(slug);
  if (!project || project.status !== "active") return {};

  const unit = await getUnitByCode(project.id, unitCode);
  if (!unit) return {};

  const t = await getTranslations({ locale, namespace: "meta" });
  const ogLocale = OG_LOCALE[locale] ?? "id_ID";

  const title = t("unitDetailTitle")
    .replace("{unitCode}", unit.unitCode)
    .replace("{projectName}", project.fullName);
  const description = t("unitDetailDescription")
    .replace("{unitCode}", unit.unitCode)
    .replace("{projectName}", project.fullName)
    .replace("{city}", project.location.city);

  const alternates = buildAlternates(`/projects/${slug}/units/${unitCode}`, locale);

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

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; unitCode: string }>;
}) {
  const { locale, slug, unitCode } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("nav");
  const tUnit = await getTranslations("unit");
  const tStatus = await getTranslations("status");
  const tCta = await getTranslations("cta");
  const tWa = await getTranslations("whatsapp");
  const tProject = await getTranslations("project");

  const project = await getProjectBySlug(slug);

  if (!project || project.status !== "active") {
    notFound();
  }

  const unit = await getUnitByCode(project.id, unitCode);

  if (!unit) {
    notFound();
  }

  // ── V2 ─────────────────────────────────────────────────────────────────
  if (uiConfig.uiVariant === "v2") {
    return (
      <UnitDetailV2
        locale={locale}
        project={project}
        unit={unit}
        labels={{
          home: tNav("home"),
          projects: tNav("projects"),
          units: locale === "en" ? "Units" : "Unit",
          available: tStatus("available"),
          process: tStatus("process"),
          sold: tStatus("sold"),
          unknown: tStatus("unknown"),
          code: tUnit("code"),
          type: tUnit("type"),
          projectLabel: tUnit("project"),
          landArea: tUnit("landArea"),
          buildingArea: tUnit("buildingArea"),
          dimensions: tUnit("dimensions"),
          buildingType: tUnit("buildingType"),
          bedrooms: tUnit("bedrooms"),
          bathrooms: tUnit("bathrooms"),
          carport: tUnit("carport"),
          yes: tUnit("yes"),
          no: tUnit("no"),
          price: tUnit("price"),
          status: tUnit("status"),
          contactForPrice: tUnit("contactForPrice"),
          photoPlaceholder: tUnit("photoPlaceholder"),
          viewOnSitePlan: tUnit("viewOnSitePlan"),
          contactWhatsApp: tCta("contactWhatsApp"),
          interestForm: tCta("interestForm"),
          waDisabled: tWa("disabled"),
          unconfirmedNotice: tUnit("unconfirmedNotice"),
          backToUnits: locale === "en" ? "Back to Unit List" : "Kembali ke Daftar Unit",
          kavlingMeasurementDisclaimer: tProject("kavlingMeasurementDisclaimer"),
          buildingOptionsNotice: tProject("buildingOptionsNotice"),
          brochureContactTitle: tProject("brochureContactTitle"),
          brochureContactNotice: tProject("brochureContactNotice"),
          temporaryContactBadge: tProject("temporaryContactBadge"),
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
          { label: `${tUnit("code")}s`, href: `/${locale}/projects/${project.slug}/units` },
          { label: unit.unitCode },
        ]}
        className="mb-6"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Photo/Placeholder */}
        <div>
          <Placeholder
            type="image"
            label={tUnit("photoPlaceholder")}
            className="aspect-video w-full"
          />
        </div>

        {/* Unit Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">{unit.unitCode}</h1>
              <p className="mt-1 text-sm text-neutral-500">{project.fullName}</p>
            </div>
            <Badge variant={unit.status as UnitStatus}>
              {tStatus(unit.status === "unknown" ? "unknown"
                : unit.status === "available" ? "available"
                : unit.status === "process" ? "process"
                : "sold")}
            </Badge>
          </div>

          {/* Info table */}
          <dl className="divide-y divide-neutral-100 rounded-lg border border-neutral-200">
            <div className="flex justify-between px-4 py-3">
              <dt className="text-sm text-neutral-500">{tUnit("code")}</dt>
              <dd className="text-sm font-medium text-neutral-900">{unit.unitCode}</dd>
            </div>
            <div className="flex justify-between px-4 py-3">
              <dt className="text-sm text-neutral-500">{tUnit("type")}</dt>
              <dd className="text-sm font-medium text-neutral-900">{unit.unitType}</dd>
            </div>
            <div className="flex justify-between px-4 py-3">
              <dt className="text-sm text-neutral-500">{tUnit("project")}</dt>
              <dd className="text-sm font-medium text-neutral-900">{project.fullName}</dd>
            </div>
            {unit.landArea != null && (
              <div className="flex justify-between px-4 py-3">
                <dt className="text-sm text-neutral-500">{tUnit("landArea")}</dt>
                <dd className="text-sm font-medium text-neutral-900">{unit.landArea} m²</dd>
              </div>
            )}
            {unit.dimensions != null && (
              <div className="flex justify-between px-4 py-3">
                <dt className="text-sm text-neutral-500">{tUnit("dimensions")}</dt>
                <dd className="text-sm font-medium text-neutral-900">
                  {unit.dimensions.width} × {unit.dimensions.length} m
                </dd>
              </div>
            )}
            <div className="flex justify-between px-4 py-3">
              <dt className="text-sm text-neutral-500">{tUnit("price")}</dt>
              <dd className="text-sm font-medium text-primary-700">
                {unit.price != null ? formatRupiah(unit.price) : tUnit("contactForPrice")}
              </dd>
            </div>
          </dl>

          {/* CTA */}
          <div className="flex flex-col gap-3 pt-2">
            <WhatsAppButton
              locale={locale as "id" | "en"}
              context="unit"
              projectFullName={project.fullName}
              unitCode={unit.unitCode}
              variant="primary"
              disabledMessage={tWa("disabled")}
            >
              {tCta("contactWhatsApp")}
            </WhatsAppButton>

            <Link
              href={`/${locale}/projects/${project.slug}?unit=${unit.unitCode}`}
              className="flex items-center justify-center rounded-lg border border-primary-300 bg-primary-50 px-6 py-3 text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors min-h-[44px]"
            >
              {tUnit("viewOnSitePlan")}
            </Link>

            <Link
              href={`/${locale}/interest?project=${project.slug}&unit=${unit.unitCode}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors min-h-[44px]"
            >
              <ClipboardList className="w-4 h-4 stroke-[2]" aria-hidden="true" />
              <span>{tCta("interestForm")}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
