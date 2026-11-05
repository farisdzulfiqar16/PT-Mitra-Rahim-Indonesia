/**
 * UnitCatalogV2 — Layout baru katalog unit.
 *
 * Mengikuti desain referensi:
 * - Header cream dengan breadcrumb
 * - Grid card unit dengan gambar, specs (luas, harga, status), dua CTA
 * - Filter chips visual (Semua, Tersedia, Proses, Terjual)
 *
 * Sistem tidak berubah. Undo: uiConfig.uiVariant = "v1"
 */

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import {
  buildWhatsAppUrl,
  buildUnitWhatsAppMessage,
  isWhatsAppNumberPlaceholder,
} from "@/config/site";
import type { Project, PropertyUnit, UnitStatus } from "@/types";

interface UnitCatalogV2Props {
  locale: string;
  project: Project;
  units: PropertyUnit[];
  labels: {
    home: string;
    projects: string;
    available: string;
    process: string;
    sold: string;
    unknown: string;
    noUnits: string;
    viewDetail: string;
    contactForPrice: string;
    contactWhatsApp: string;
    waDisabled: string;
    filterAll: string;
  };
}

export function UnitCatalogV2({ locale, project, units, labels }: UnitCatalogV2Props) {
  const waDisabled = isWhatsAppNumberPlaceholder();

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
            <Link href={`/${locale}/projects/${project.slug}`} className="hover:text-primary-700 transition-colors">{project.name}</Link>
            <span aria-hidden="true">›</span>
            <span className="text-neutral-700 font-medium">Unit</span>
          </nav>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{project.fullName}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            📍 {project.location.city}, {project.location.province}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter + count */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-primary-700 px-4 py-1.5 text-xs font-semibold text-white">
              {labels.filterAll}
            </span>
            {[labels.available, labels.process, labels.sold, labels.unknown].map((label) => (
              <span
                key={label}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-medium text-neutral-600 cursor-pointer hover:border-primary-300 transition-colors"
              >
                {label}
              </span>
            ))}
          </div>
          <p className="text-xs text-neutral-400 shrink-0">{units.length} unit</p>
        </div>

        {/* Grid */}
        {units.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-400">{labels.noUnits}</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((unit) => {
              const statusLabel =
                unit.status === "available" ? labels.available
                : unit.status === "process" ? labels.process
                : unit.status === "sold" ? labels.sold
                : labels.unknown;

              const waUrl = waDisabled
                ? undefined
                : buildWhatsAppUrl(
                    buildUnitWhatsAppMessage(unit.unitCode, project.fullName, locale as "id" | "en")
                  );

              return (
                <article
                  key={unit.unitCode}
                  className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-primary-200 transition-shadow"
                >
                  {/* Image */}
                  <Placeholder
                    type="image"
                    label={unit.unitCode}
                    className="aspect-video border-0 border-b border-neutral-100 rounded-none"
                  />

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4">
                    {/* Title row */}
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-neutral-400">Kavling</p>
                        <h2 className="text-base font-bold text-neutral-900">{unit.unitCode}</h2>
                      </div>
                      <Badge variant={unit.status as UnitStatus}>{statusLabel}</Badge>
                    </div>

                    {/* Specs */}
                    <div className="my-3 grid grid-cols-3 divide-x divide-neutral-200 rounded-lg bg-neutral-50 text-center">
                      <div className="px-2 py-2">
                        <p className="text-[10px] text-neutral-400">Luas</p>
                        <p className="text-xs font-semibold text-neutral-700">
                          {unit.landArea != null ? `${unit.landArea} m²` : "—"}
                        </p>
                      </div>
                      <div className="px-2 py-2">
                        <p className="text-[10px] text-neutral-400">Harga</p>
                        <p className="text-xs font-semibold text-neutral-700">{labels.contactForPrice}</p>
                      </div>
                      <div className="px-2 py-2">
                        <p className="text-[10px] text-neutral-400">Status</p>
                        <p className="text-xs font-semibold text-neutral-700">{statusLabel}</p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto flex gap-2">
                      <Link
                        href={`/${locale}/projects/${project.slug}/units/${unit.unitCode}`}
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}
