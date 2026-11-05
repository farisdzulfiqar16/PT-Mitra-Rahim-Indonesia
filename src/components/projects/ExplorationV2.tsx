/**
 * ExplorationV2 — Layout baru halaman eksplorasi proyek.
 *
 * Mengikuti desain referensi:
 * - Header cream dengan nama proyek + breadcrumb
 * - Filter/tab bar (Semua, Tersedia, Proses, Terjual, Reservasi)
 * - Grid unit card dengan info lengkap + CTA WhatsApp + Detail button
 * - Sidebar kanan: peta placeholder + info ringkas
 *
 * Sistem (data, notFound, SEO) tidak berubah.
 * Undo: ubah uiConfig.uiVariant = "v1" di src/config/site.ts
 */

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { SitePlanPanel } from "@/features/site-plan/SitePlanPanel";
import {
  buildWhatsAppUrl,
  buildProjectWhatsAppMessage,
  isWhatsAppNumberPlaceholder,
} from "@/config/site";
import type { Project, PropertyUnit, UnitStatus } from "@/types";

interface ExplorationV2Props {
  locale: string;
  project: Project;
  units: PropertyUnit[];
  highlightedUnitCode?: string;
  sitePlanAvailable: boolean;
  labels: {
    home: string;
    projects: string;
    available: string;
    process: string;
    sold: string;
    unknown: string;
    comingSoon: string;
    viewDetail: string;
    viewUnits: string;
    viewSitePlan: string;
    sitePlanPlaceholder: string;
    sitePlanPlaceholderDesc: string;
    unitListTitle: string;
    unitNotOnPlanNote: string;
    unitSummary: string;
    statusNotConfirmed: string;
    contactWhatsApp: string;
    waDisabled: string;
    filterAll: string;
    contactForPrice: string;
  };
}

export function ExplorationV2({
  locale,
  project,
  units,
  highlightedUnitCode,
  sitePlanAvailable,
  labels,
}: ExplorationV2Props) {
  const waDisabled = isWhatsAppNumberPlaceholder();
  const waUrl = waDisabled
    ? undefined
    : buildWhatsAppUrl(buildProjectWhatsAppMessage(project.fullName, locale as "id" | "en"));

  return (
    <div className="flex flex-col">
      {/* Page header — cream */}
      <div className="bg-[#F5F2EC] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-neutral-500" aria-label="Breadcrumb">
            <Link href={`/${locale}`} className="hover:text-primary-700 transition-colors">{labels.home}</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/${locale}/projects`} className="hover:text-primary-700 transition-colors">{labels.projects}</Link>
            <span aria-hidden="true">›</span>
            <span className="text-neutral-700 font-medium">{project.name}</span>
          </nav>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{project.fullName}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            📍 {project.location.city}, {project.location.province}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Jelajahi properti label + filter */}
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Jelajahi properti
          </p>
          <h2 className="mb-4 text-xl font-bold text-neutral-900">
            {project.name} · {project.fullName}
          </h2>

          {/* Filter chips — visual only, sistem filter bisa dikembangkan nanti */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-primary-700 px-4 py-1.5 text-xs font-semibold text-white">
              {labels.filterAll}
            </span>
            {[labels.available, labels.process, labels.sold, labels.unknown].map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-600 hover:border-primary-300 cursor-pointer transition-colors"
              >
                {label}
              </span>
            ))}
          </div>

          <p className="mt-2 text-xs text-neutral-400">
            {units.length} unit · {labels.statusNotConfirmed}
          </p>
        </div>

        {/* Two-column layout: unit grid + sidebar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Unit grid */}
          <div className="flex-1">
            {units.length === 0 ? (
              <p className="py-8 text-center text-sm text-neutral-400">—</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {units.map((unit) => (
                  <UnitCard
                    key={unit.unitCode}
                    unit={unit}
                    locale={locale}
                    projectSlug={project.slug}
                    labels={labels}
                    waDisabled={waDisabled}
                    waUrl={waUrl}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar kanan */}
          <aside className="w-full shrink-0 lg:w-72 xl:w-80 space-y-4">
            {/* Peta */}
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
              <div className="border-b border-neutral-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-neutral-700">📍 Lokasi</h3>
              </div>
              <Placeholder
                type="map"
                label="Peta lokasi"
                description={`${project.location.city}, ${project.location.province}`}
                className="aspect-video border-0 rounded-none"
              />
            </div>

            {/* Site Plan panel ringkas */}
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
              <SitePlanPanel
                isAvailable={sitePlanAvailable}
                units={units}
                highlightedUnitCode={highlightedUnitCode}
                title={labels.viewSitePlan}
                placeholderLabel={labels.sitePlanPlaceholder}
                placeholderDesc={labels.sitePlanPlaceholderDesc}
                unitListTitle={labels.unitListTitle}
                unitNotOnPlanNote={labels.unitNotOnPlanNote}
                locale={locale}
                projectSlug={project.slug}
                statusLabels={{
                  available: labels.available,
                  process: labels.process,
                  sold: labels.sold,
                  unknown: labels.unknown,
                }}
                viewDetailLabel={labels.viewDetail}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

/** Sub-komponen card unit di grid eksplorasi */
function UnitCard({
  unit,
  locale,
  projectSlug,
  labels,
  waDisabled,
  waUrl,
}: {
  unit: PropertyUnit;
  locale: string;
  projectSlug: string;
  labels: ExplorationV2Props["labels"];
  waDisabled: boolean;
  waUrl: string | undefined;
}) {
  const statusLabel =
    unit.status === "available" ? labels.available
    : unit.status === "process" ? labels.process
    : unit.status === "sold" ? labels.sold
    : labels.unknown;

  return (
    <article className="flex flex-col rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-primary-200 transition-shadow">
      {/* Image placeholder */}
      <Placeholder
        type="image"
        label={unit.unitCode}
        className="aspect-video border-0 border-b border-neutral-100 rounded-none"
      />
      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400">Kavling</p>
            <h3 className="text-base font-bold text-neutral-900">{unit.unitCode}</h3>
          </div>
          <Badge variant={unit.status as UnitStatus}>{statusLabel}</Badge>
        </div>

        {/* Specs row */}
        <div className="my-3 grid grid-cols-3 gap-2 rounded-lg bg-neutral-50 px-3 py-2">
          <div className="text-center">
            <p className="text-[10px] text-neutral-400">Luas</p>
            <p className="text-xs font-semibold text-neutral-700">
              {unit.landArea != null ? `${unit.landArea} m²` : "—"}
            </p>
          </div>
          <div className="text-center border-x border-neutral-200">
            <p className="text-[10px] text-neutral-400">Harga</p>
            <p className="text-xs font-semibold text-neutral-700">{labels.contactForPrice}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-neutral-400">Status</p>
            <p className="text-xs font-semibold text-neutral-700">{statusLabel}</p>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-auto flex gap-2">
          <Link
            href={`/${locale}/projects/${projectSlug}/units/${unit.unitCode}`}
            className="flex flex-1 items-center justify-center rounded-md border border-primary-300 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          >
            {labels.viewDetail}
          </Link>
          {waDisabled ? (
            <span
              className="flex items-center justify-center rounded-md bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-400 min-h-[36px] cursor-not-allowed"
              aria-disabled="true"
              title={labels.waDisabled}
            >
              WA
            </span>
          ) : (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-md bg-whatsapp px-3 py-2 text-xs font-semibold text-white hover:bg-whatsapp-hover transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp"
              aria-label={`${labels.contactWhatsApp} — ${unit.unitCode}`}
            >
              WA
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
