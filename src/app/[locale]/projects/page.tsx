/**
 * Katalog Proyek — menampilkan daftar semua proyek secara dinamis.
 */

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates, uiConfig } from "@/config/site";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProjectCatalogV2 } from "@/components/projects/ProjectCatalogV2";
import { getAllProjects, getActiveProjects } from "@/services";

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

  const title = t("projectsTitle");
  const description = t("projectsDescription");
  const alternates = buildAlternates("/projects", locale);
  const ogLocale = OG_LOCALE[locale] ?? "id_ID";

  return {
    title,
    description,
    alternates: alternates ?? undefined,
    openGraph: {
      title,
      description,
      type: "website",
      locale: ogLocale,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tNav = await getTranslations("nav");
  const tStatus = await getTranslations("status");
  const tCta = await getTranslations("cta");

  // Ambil data proyek secara dinamis melalui service layer
  const allProjects = await getAllProjects();
  const activeProjects = await getActiveProjects();
  const activeCount = activeProjects.length;

  // ── V2 ─────────────────────────────────────────────────────────────────
  if (uiConfig.uiVariant === "v2") {
    return (
      <ProjectCatalogV2
        locale={locale}
        projects={allProjects}
        labels={{
          home: tNav("home"),
          projects: tNav("projects"),
          available: tStatus("available"),
          comingSoon: tStatus("comingSoon"),
          viewDetail: tCta("viewDetail"),
          viewInfo: tCta("getInfo"),
          activeCount: `${activeCount} ${locale === "en" ? "active project" : "proyek aktif"}`,
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
          { label: tNav("projects") },
        ]}
        className="mb-6"
      />

      <h1 className="mb-2 text-2xl font-bold text-neutral-900">{tNav("projects")}</h1>
      <p className="mb-6 text-sm text-neutral-500">{activeCount} proyek aktif</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allProjects.map((project) => {
          const isActive = project.status === "active";
          return (
            <Card
              key={project.id || project.slug}
              as="article"
              href={`/${locale}/projects/${project.slug}`}
              interactive
              className={`flex flex-col ${isActive ? "" : "opacity-90"}`}
            >
              <Placeholder
                type={isActive ? "image" : "general"}
                label={isActive ? tStatus("available") : tStatus("comingSoon")}
                className="rounded-t-lg border-0 border-b border-neutral-200"
              />
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-900">{project.name}</h2>
                  <Badge variant={isActive ? "available" : "coming-soon"}>
                    {isActive ? tStatus("available") : tStatus("comingSoon")}
                  </Badge>
                </div>
                <p className={`text-sm font-medium ${isActive ? "text-primary-700" : "text-neutral-500"}`}>
                  {project.fullName}
                </p>
                <p className={`mt-2 text-sm ${isActive ? "text-neutral-600" : "text-neutral-500"}`}>
                  {project.shortDescription}
                </p>
                <p className="mt-2 text-xs text-neutral-400">
                  {project.location.city}, {project.location.province}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
