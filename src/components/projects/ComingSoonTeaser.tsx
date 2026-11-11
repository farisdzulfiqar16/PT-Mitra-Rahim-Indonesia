import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { ProjectLocationMap } from "@/components/projects/ProjectLocationMap";
import { Building, MapPin, Info } from "lucide-react";
import type { Project } from "@/types";

export interface ComingSoonTeaserProps {
  locale: string;
  project: Project;
  labels: {
    home: string;
    projects: string;
    comingSoon: string;
    message: string;
    cta: string;
    waDisabled: string;
  };
}

/**
 * ComingSoonTeaser — Komponen halaman teaser untuk proyek yang belum diluncurkan (Coming Soon).
 *
 * Memenuhi acceptance criteria Task 17:
 * - Menampilkan nama dan fullName proyek (Pabuaran / Celestia Jatiranggon).
 * - Menampilkan badge Coming Soon yang jelas.
 * - Tidak menampilkan data unit, harga, luas, atau site plan prematur.
 * - Menyediakan CTA "Hubungi untuk Info Terbaru" (terhubung dengan WhatsAppButton).
 */
export function ComingSoonTeaser({
  locale,
  project,
  labels,
}: ComingSoonTeaserProps) {
  const customMessage =
    locale === "en"
      ? `Hello, I would like to get the latest info regarding the ${project.fullName} project.`
      : `Halo, saya ingin mendapatkan info terbaru mengenai proyek ${project.fullName}.`;

  return (
    <div className="flex flex-col">
      {/* Header — cream */}
      <div className="bg-[#F5F2EC] px-4 py-8 sm:px-6 lg:px-8 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb
            items={[
              { label: labels.home, href: `/${locale}` },
              { label: labels.projects, href: `/${locale}/projects` },
              { label: project.name },
            ]}
            className="mb-4"
          />
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              {project.fullName}
            </h1>
            <Badge variant="coming-soon">{labels.comingSoon}</Badge>
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            {project.location.city}, {project.location.province}
          </p>
        </div>
      </div>

      {/* Main Teaser Body */}
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-12 space-y-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-sm w-full space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 shadow-2xs border border-amber-200/60">
            <Building className="h-8 w-8 stroke-[1.75]" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
              {project.fullName} — {labels.comingSoon}
            </h2>
            <p className="mx-auto max-w-lg text-sm text-neutral-600 sm:text-base leading-relaxed">
              {labels.message}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <WhatsAppButton
              locale={locale as "id" | "en"}
              context="custom"
              customMessage={customMessage}
              disabledMessage={labels.waDisabled}
              variant="primary"
            >
              {labels.cta}
            </WhatsAppButton>
          </div>
        </div>

        {/* Visual Location Preview Card — Branded Placeholder (tanpa pin fiktif) */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-700 stroke-[2]" aria-hidden="true" />
              <span>
                {locale === "en" ? "Project Location Area" : "Kawasan Lokasi Proyek"}
              </span>
            </h3>
            <span className="text-xs text-neutral-500 font-medium">
              {project.location.city}, {project.location.province}
            </span>
          </div>

          <ProjectLocationMap
            projectName={project.fullName}
            formattedAddress={`${project.location.city}, ${project.location.province}, ${project.location.country || "Indonesia"}`}
            hasVerifiedStreetAddress={Boolean(project.location?.streetAddress)}
            locale={locale}
            aspectRatio="video"
          />

          <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-3.5 text-xs text-neutral-600 leading-relaxed flex items-start gap-2.5">
            <Info className="h-4 w-4 text-neutral-500 shrink-0 stroke-[1.75] mt-0.5" aria-hidden="true" />
            <p>
              {locale === "en"
                ? "Celestia Jatiranggon is currently in the master plan and licensing preparation phase. Exact plot layout, site coordinates, and interactive satellite mapping will be officially published once municipal authorizations are finalized."
                : "Celestia Jatiranggon saat ini berada dalam tahap penyusunan master plan dan perizinan kawasan. Tata letak kavling, titik koordinat presisi, serta peta satelit interaktif resmi akan dipublikasikan setelah seluruh penetapan pengembang selesai."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
