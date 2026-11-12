/**
 * ProjectCatalogV2 — Katalog proyek dinamis mengikuti desain referensi.
 *
 * Menggunakan sumber data dinamis:
 * - Menghilangkan deklarasi proyek hardcoded di komponen UI.
 * - Menerima array `projects: Project[]` sehingga penambahan proyek baru di masa
 *   depan cukup dilakukan melalui data tanpa mengubah komponen UI.
 * - Mempertahankan visual, styling, responsive layout, dan dukungan bahasa (ID & EN).
 *
 * Undo: ubah uiConfig.uiVariant = "v1" di src/config/site.ts
 */

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProjectCardVisual } from "@/components/projects/ProjectCardVisual";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

export interface ProjectCatalogV2Labels {
  home: string;
  projects: string;
  available: string;
  comingSoon: string;
  viewDetail: string;
  viewInfo: string;
  activeCount: string;
  emptyProjects?: string;
}

export interface ProjectCatalogV2Props {
  locale: string;
  projects: Project[];
  labels: ProjectCatalogV2Labels;
}

export function ProjectCatalogV2({ locale, projects, labels }: ProjectCatalogV2Props) {
  return (
    <div className="flex flex-col">
      {/* Page header — cream background sesuai desain */}
      <div className="bg-gradient-to-b from-[#F7F4EE] via-[#F5F2EA] to-[#EEEAE1] px-4 py-9 sm:px-6 lg:px-8 border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl animate-fade-in-up">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: labels.home, href: `/${locale}` },
              { label: labels.projects },
            ]}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl tracking-tight">{labels.projects}</h1>
          <p className="mt-1 text-sm text-neutral-500">{labels.activeCount}</p>
        </div>
      </div>

      {/* Project list — Render dinamis berdasarkan data */}
      <div className="bg-[#FAF8F5] min-h-[60vh] py-10 sm:py-12 border-b border-neutral-200/70">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200/80 bg-white p-8 text-center text-sm text-neutral-500 shadow-xs">
              {labels.emptyProjects || (locale === "en" ? "No projects available to display." : "Belum ada proyek yang dapat ditampilkan.")}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {projects.map((project) => {
                const isActive = project.status === "active";

                return (
                  <article
                    key={project.id || project.slug}
                    className={cn(
                      "overflow-hidden rounded-2xl border transition-all duration-300",
                      isActive
                        ? "group border-neutral-200/80 bg-white shadow-xs hover:shadow-lg hover:border-primary-300/90 hover:-translate-y-1 shadow-[0_2px_8px_-1px_rgba(28,41,34,0.05),0_1px_3px_0_rgba(28,41,34,0.03),inset_0_1px_0_0_rgba(255,255,255,0.95)]"
                        : "border-neutral-200/80 bg-white/90 shadow-2xs hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5 shadow-[0_1px_4px_0_rgba(28,41,34,0.03),inset_0_1px_0_0_rgba(255,255,255,0.9)] opacity-90"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Image / Thumbnail with Smart Visual */}
                      <div className="sm:w-80 shrink-0">
                        <ProjectCardVisual
                          project={project}
                          locale={locale}
                          aspectRatio="auto"
                          className="h-52 w-full sm:h-full rounded-none border-0 border-b border-neutral-100 sm:border-b-0 sm:border-r"
                        />
                      </div>

                    {/* Info Column */}
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <h2
                            className={cn(
                              "text-lg font-bold",
                              isActive ? "text-neutral-900" : "text-neutral-700"
                            )}
                          >
                            {project.name}
                          </h2>
                          <span className="text-sm text-neutral-400">/</span>
                          <span
                            className={cn(
                              "text-sm",
                              isActive ? "text-neutral-500" : "text-neutral-400"
                            )}
                          >
                            {project.fullName}
                          </span>
                          <Badge variant={isActive ? "available" : "coming-soon"}>
                            {isActive ? labels.available : labels.comingSoon}
                          </Badge>
                        </div>

                        <p
                          className={cn(
                            "text-sm leading-relaxed",
                            isActive ? "text-neutral-600" : "text-neutral-400"
                          )}
                        >
                          {project.shortDescription}
                        </p>

                        <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
                          <MapPin className="h-3.5 w-3.5 shrink-0 stroke-[1.75]" aria-hidden="true" />
                          <span>{project.location.city}, {project.location.province}</span>
                        </p>
                      </div>

                      {/* Action Button — slug dinamis */}
                      <div className="mt-4">
                        <Link
                          href={`/${locale}/projects/${project.slug}`}
                          className={cn(
                            "inline-flex w-full sm:w-auto items-center justify-center rounded-md border px-5 py-2.5 text-sm font-semibold transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2",
                            isActive
                              ? "border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 focus-visible:ring-primary-300"
                              : "border-neutral-300 bg-white text-neutral-500 hover:bg-neutral-100 focus-visible:ring-neutral-200"
                          )}
                        >
                          {isActive ? labels.viewDetail : labels.viewInfo}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
