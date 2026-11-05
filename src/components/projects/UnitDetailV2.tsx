/**
 * UnitDetailV2 — Layout baru detail unit.
 *
 * Mengikuti desain referensi:
 * - Header cream dengan breadcrumb
 * - Layout dua kolom: gambar besar kiri + info + CTA kanan
 * - Info panel dengan border subtle, rows untuk setiap spesifikasi
 * - Primary CTA: "Ajukan Minat via WhatsApp" (full width, green)
 * - Secondary CTA: "Lihat di Site Plan" (outlined)
 *
 * Sistem tidak berubah. Undo: uiConfig.uiVariant = "v1"
 */

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { formatRupiah } from "@/lib/utils";
import type { Project, PropertyUnit, UnitStatus } from "@/types";

interface UnitDetailV2Props {
  locale: string;
  project: Project;
  unit: PropertyUnit;
  waDisabled: boolean;
  waUrl: string | undefined;
  labels: {
    home: string;
    projects: string;
    units: string;
    available: string;
    process: string;
    sold: string;
    unknown: string;
    code: string;
    type: string;
    projectLabel: string;
    landArea: string;
    dimensions: string;
    price: string;
    status: string;
    contactForPrice: string;
    photoPlaceholder: string;
    viewOnSitePlan: string;
    contactWhatsApp: string;
    waDisabled: string;
  };
}

export function UnitDetailV2({ locale, project, unit, waDisabled, waUrl, labels }: UnitDetailV2Props) {
  const statusLabel =
    unit.status === "available" ? labels.available
    : unit.status === "process" ? labels.process
    : unit.status === "sold" ? labels.sold
    : labels.unknown;

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
            <Link href={`/${locale}/projects/${project.slug}/units`} className="hover:text-primary-700 transition-colors">{labels.units}</Link>
            <span aria-hidden="true">›</span>
            <span className="text-neutral-700 font-medium">{unit.unitCode}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left: image */}
          <div className="space-y-3">
            <Placeholder
              type="image"
              label={labels.photoPlaceholder}
              className="w-full aspect-[4/3] rounded-xl"
            />
            {/* Thumbnail row */}
            <div className="grid grid-cols-3 gap-2">
              <Placeholder type="image" label="" className="aspect-square rounded-lg opacity-60" />
              <Placeholder type="image" label="" className="aspect-square rounded-lg opacity-60" />
              <Placeholder type="image" label="" className="aspect-square rounded-lg opacity-40" />
            </div>
          </div>

          {/* Right: info + CTA */}
          <div className="flex flex-col gap-5">
            {/* Title + badge */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-neutral-400 mb-1">{project.fullName}</p>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    Kavling ({unit.unitCode})
                  </h1>
                </div>
                <Badge variant={unit.status as UnitStatus}>{statusLabel}</Badge>
              </div>
            </div>

            {/* Specs table */}
            <dl className="divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-sm text-neutral-500">{labels.code}</dt>
                <dd className="text-sm font-semibold text-neutral-900">{unit.unitCode}</dd>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-sm text-neutral-500">{labels.type}</dt>
                <dd className="text-sm font-semibold text-neutral-900">{unit.unitType}</dd>
              </div>
              {unit.landArea != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-neutral-500">{labels.landArea}</dt>
                  <dd className="text-sm font-semibold text-neutral-900">{unit.landArea} m²</dd>
                </div>
              )}
              {unit.dimensions != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-neutral-500">{labels.dimensions}</dt>
                  <dd className="text-sm font-semibold text-neutral-900">
                    {unit.dimensions.width} × {unit.dimensions.length} m
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-sm text-neutral-500">{labels.price}</dt>
                <dd className="text-sm font-semibold text-primary-700">
                  {unit.price != null ? formatRupiah(unit.price) : labels.contactForPrice}
                </dd>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-sm text-neutral-500">{labels.status}</dt>
                <dd>
                  <Badge variant={unit.status as UnitStatus}>{statusLabel}</Badge>
                </dd>
              </div>
            </dl>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              {waDisabled ? (
                <div
                  className="flex items-center justify-center gap-2 rounded-xl bg-neutral-200 px-6 py-3.5 text-sm font-semibold text-neutral-400 min-h-[48px] cursor-not-allowed"
                  aria-disabled="true"
                  title={labels.waDisabled}
                >
                  💬 {labels.contactWhatsApp}
                </div>
              ) : (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white shadow hover:bg-whatsapp-hover transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2"
                >
                  💬 {labels.contactWhatsApp}
                </a>
              )}

              <Link
                href={`/${locale}/projects/${project.slug}?unit=${unit.unitCode}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
              >
                📐 {labels.viewOnSitePlan}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
