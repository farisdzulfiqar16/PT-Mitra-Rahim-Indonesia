/**
 * Detail Unit — menampilkan informasi lengkap satu unit.
 */

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { isWhatsAppNumberPlaceholder } from "@/config/site";
import dehirData from "@/data/projects/dehir.json";
import pabuaranData from "@/data/projects/pabuaran.json";
import dehirUnitsData from "@/data/properties/dehir-units.json";
import type { Project, PropertyUnit, UnitStatus } from "@/types";

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

  const allProjects = [dehirData, pabuaranData] as Project[];
  const project = allProjects.find((p) => p.slug === slug);

  if (!project || project.status !== "active") {
    notFound();
  }

  const units = dehirUnitsData as PropertyUnit[];
  const unit = units.find((u) => u.unitCode === unitCode && u.projectId === project.id);

  if (!unit) {
    notFound();
  }

  const waDisabled = isWhatsAppNumberPlaceholder();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-400" aria-label="Breadcrumb">
        <Link href={`/${locale}`} className="hover:text-primary-700">{tNav("home")}</Link>
        <span className="mx-2">›</span>
        <Link href={`/${locale}/projects`} className="hover:text-primary-700">{tNav("projects")}</Link>
        <span className="mx-2">›</span>
        <Link href={`/${locale}/projects/${project.slug}`} className="hover:text-primary-700">{project.name}</Link>
        <span className="mx-2">›</span>
        <Link href={`/${locale}/projects/${project.slug}/units`} className="hover:text-primary-700">{tUnit("code")}s</Link>
        <span className="mx-2">›</span>
        <span className="text-neutral-600">{unit.unitCode}</span>
      </nav>

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
              {unit.status === "unknown" ? tStatus("unknown")
                : unit.status === "available" ? tStatus("available")
                : unit.status === "process" ? tStatus("process")
                : tStatus("sold")}
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
              <dd className="text-sm font-medium text-primary-700">{tUnit("contactForPrice")}</dd>
            </div>
          </dl>

          {/* CTA */}
          <div className="flex flex-col gap-3 pt-2">
            {waDisabled ? (
              <div
                className="flex items-center justify-center rounded-lg bg-neutral-100 px-6 py-3 text-sm font-medium text-neutral-400 min-h-[44px]"
                aria-disabled="true"
                title={tWa("disabled")}
              >
                {tWa("disabled")}
              </div>
            ) : (
              <a
                href={`https://wa.me/62XXXXXXXXXX`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-6 py-3 text-sm font-medium text-white hover:bg-whatsapp-hover transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2"
              >
                💬 {tCta("contactWhatsApp")}
              </a>
            )}
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="flex items-center justify-center rounded-lg border border-primary-300 bg-primary-50 px-6 py-3 text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors min-h-[44px]"
            >
              {tUnit("viewOnSitePlan")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
