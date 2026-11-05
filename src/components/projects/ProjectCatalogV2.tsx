/**
 * ProjectCatalogV2 — Layout baru katalog proyek mengikuti desain referensi.
 *
 * Style: card horizontal dengan gambar kiri + info kanan, divider clean,
 * warna background cream (#F5F2EC) untuk header area.
 *
 * Undo: ubah uiConfig.uiVariant = "v1" di src/config/site.ts
 */

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import type { Project } from "@/types";

interface ProjectCatalogV2Props {
  locale: string;
  dehir: Project;
  pabuaran: Project;
  labels: {
    home: string;
    projects: string;
    available: string;
    comingSoon: string;
    viewDetail: string;
    viewInfo: string;
    activeCount: string;
  };
}

export function ProjectCatalogV2({ locale, dehir, pabuaran, labels }: ProjectCatalogV2Props) {
  return (
    <div className="flex flex-col">
      {/* Page header — cream background seperti di mockup */}
      <div className="bg-[#F5F2EC] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-neutral-500" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-primary-700 transition-colors">
              {labels.home}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-neutral-700 font-medium">{labels.projects}</span>
          </nav>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{labels.projects}</h1>
          <p className="mt-1 text-sm text-neutral-500">{labels.activeCount}</p>
        </div>
      </div>

      {/* Project list */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5">
          {/* Dehir — active */}
          <article className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md hover:border-primary-200">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="sm:w-72 shrink-0">
                <Placeholder
                  type="image"
                  label={dehir.fullName}
                  className="h-48 w-full sm:h-full rounded-none border-0 border-b border-neutral-100 sm:border-b-0 sm:border-r"
                />
              </div>
              {/* Info */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-900">{dehir.name}</h2>
                    <span className="text-sm text-neutral-400">/</span>
                    <span className="text-sm text-neutral-500">{dehir.fullName}</span>
                    <Badge variant="available">{labels.available}</Badge>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{dehir.shortDescription}</p>
                  <p className="mt-2 text-xs text-neutral-400">
                    📍 {dehir.location.city}, {dehir.location.province}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/${locale}/projects/dehir`}
                    className="inline-flex items-center justify-center rounded-md border border-primary-300 bg-primary-50 px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                  >
                    {labels.viewDetail}
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Pabuaran — coming soon */}
          <article className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 opacity-80">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="sm:w-72 shrink-0">
                <Placeholder
                  type="general"
                  label={labels.comingSoon}
                  className="h-48 w-full sm:h-full rounded-none border-0 border-b border-neutral-100 sm:border-b-0 sm:border-r"
                />
              </div>
              {/* Info */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-700">{pabuaran.name}</h2>
                    <span className="text-sm text-neutral-400">/</span>
                    <span className="text-sm text-neutral-400">{pabuaran.fullName}</span>
                    <Badge variant="coming-soon">{labels.comingSoon}</Badge>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">{pabuaran.shortDescription}</p>
                  <p className="mt-2 text-xs text-neutral-400">
                    📍 {pabuaran.location.city}, {pabuaran.location.province}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/${locale}/projects/pabuaran`}
                    className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200"
                  >
                    {labels.viewInfo}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
