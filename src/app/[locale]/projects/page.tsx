/**
 * Katalog Proyek — menampilkan daftar semua proyek.
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

  const allProjects = await getAllProjects();
  const activeProjects = await getActiveProjects();
  const dehir = allProjects.find((p) => p.id === "dehir") || allProjects[0];
  const pabuaran = allProjects.find((p) => p.id === "pabuaran") || allProjects[1];

  const activeCount = activeProjects.length;

  // ── V2 ─────────────────────────────────────────────────────────────────
  if (uiConfig.uiVariant === "v2") {
    return (
      <ProjectCatalogV2
        locale={locale}
        dehir={dehir}
        pabuaran={pabuaran}
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
        {/* Dehir */}
        <Card as="article" href={`/${locale}/projects/dehir`} interactive className="flex flex-col">
          <Placeholder type="image" label={tStatus("available")} className="rounded-t-lg border-0 border-b border-neutral-200" />
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">{dehir.name}</h2>
              <Badge variant="available">{tStatus("available")}</Badge>
            </div>
            <p className="text-sm font-medium text-primary-700">{dehir.fullName}</p>
            <p className="mt-2 text-sm text-neutral-600">{dehir.shortDescription}</p>
            <p className="mt-2 text-xs text-neutral-400">{dehir.location.city}, {dehir.location.province}</p>
          </div>
        </Card>

        {/* Pabuaran — Coming Soon */}
        <Card as="article" interactive className="flex flex-col opacity-90">
          <Placeholder type="general" label={tStatus("comingSoon")} className="rounded-t-lg border-0 border-b border-neutral-200" />
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">{pabuaran.name}</h2>
              <Badge variant="coming-soon">{tStatus("comingSoon")}</Badge>
            </div>
            <p className="text-sm font-medium text-neutral-500">{pabuaran.fullName}</p>
            <p className="mt-2 text-sm text-neutral-500">{pabuaran.shortDescription}</p>
            <p className="mt-2 text-xs text-neutral-400">{pabuaran.location.city}, {pabuaran.location.province}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
