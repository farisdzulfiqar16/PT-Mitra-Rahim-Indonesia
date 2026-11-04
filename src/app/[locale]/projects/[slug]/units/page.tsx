/**
 * Katalog Unit — menampilkan daftar unit dalam proyek terpilih.
 */

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import dehirData from "@/data/projects/dehir.json";
import pabuaranData from "@/data/projects/pabuaran.json";
import dehirUnitsData from "@/data/properties/dehir-units.json";
import type { Project, PropertyUnit, UnitStatus } from "@/types";

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

  const allProjects = [dehirData, pabuaranData] as Project[];
  const project = allProjects.find((p) => p.slug === slug);

  if (!project || project.status !== "active") {
    notFound();
  }

  const units = dehirUnitsData as PropertyUnit[];

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
        <span className="text-neutral-600">{tUnit("code")}s</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">{project.fullName}</h1>
        <p className="mt-1 text-sm text-neutral-500">{project.location.city}, {project.location.province}</p>
      </div>

      {/* Unit grid */}
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
                {/* Price: unknown for all units at this stage */}
                <p className="mt-2 text-sm font-medium text-primary-700">{tUnit("contactForPrice")}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
