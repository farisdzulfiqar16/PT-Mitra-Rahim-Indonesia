/**
 * Halaman Eksplorasi Proyek — Sidebar + Maps + Site Plan dalam satu halaman.
 */

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import dehirData from "@/data/projects/dehir.json";
import pabuaranData from "@/data/projects/pabuaran.json";
import dehirUnitsData from "@/data/properties/dehir-units.json";
import type { Project, PropertyUnit } from "@/types";

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

  // Cari proyek berdasarkan slug
  const allProjects = [dehirData, pabuaranData] as Project[];
  const project = allProjects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Pabuaran — Coming Soon teaser
  if (project.status === "coming-soon") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">{project.fullName}</h1>
        <Badge variant="coming-soon">{tComingSoon("title")}</Badge>
        <p className="max-w-md text-sm text-neutral-500">{tComingSoon("message")}</p>
      </div>
    );
  }

  // Dehir — full exploration page
  const units = dehirUnitsData as PropertyUnit[];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-400" aria-label="Breadcrumb">
        <Link href={`/${locale}`} className="hover:text-primary-700">{tNav("home")}</Link>
        <span className="mx-2">›</span>
        <Link href={`/${locale}/projects`} className="hover:text-primary-700">{tNav("projects")}</Link>
        <span className="mx-2">›</span>
        <span className="text-neutral-600">{project.name}</span>
      </nav>

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
        <aside className="w-full shrink-0 lg:w-64">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {tNav("projects")}
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/projects/dehir`}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${project.slug === "dehir" ? "bg-primary-100 text-primary-700" : "text-neutral-600 hover:bg-neutral-100"}`}
                >
                  Dehir
                  <Badge variant="available">{tStatus("available")}</Badge>
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/projects/pabuaran`}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${project.slug === "pabuaran" ? "bg-primary-100 text-primary-700" : "text-neutral-600 hover:bg-neutral-100"}`}
                >
                  Pabuaran
                  <Badge variant="coming-soon">{tStatus("comingSoon")}</Badge>
                </Link>
              </li>
            </ul>

            <div className="mt-4 border-t border-neutral-200 pt-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {tNav("interest")}
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={`/${locale}/projects/dehir/units`}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                  >
                    {tCta("viewUnits")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </aside>

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

          {/* Site Plan placeholder */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-neutral-900">📐 {tProject("viewSitePlan")}</h2>
            <Placeholder
              type="site-plan"
              label={tEmpty("sitePlanPlaceholder")}
              description={tEmpty("sitePlanPlaceholderDesc")}
            />
            <div className="mt-3">
              <Link
                href={`/${locale}/projects/dehir/units`}
                className="inline-flex items-center justify-center rounded-md border border-primary-300 bg-primary-50 px-6 py-3 text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors min-h-[44px]"
              >
                {tCta("viewUnits")}
              </Link>
            </div>
          </section>

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
