/**
 * UnitDetailV2 — Layout baru detail unit.
 *
 * Mengikuti desain referensi:
 * - Header cream dengan breadcrumb
 * - Layout dua kolom: gambar besar kiri + info + CTA kanan
 * - Info panel dengan border subtle, rows untuk setiap spesifikasi
 * - Primary CTA: "Hubungi WhatsApp" (full width, disabled safe guard)
 * - Secondary CTA: "Lihat di Site Plan" (outlined)
 * - Tertiary CTA: "Formulir Minat & Konsultasi" dengan query param
 * - Transparansi ukuran kavling dan opsi tipe rumah dari brosur
 * - Kontak pemasaran sementara dari brosur (teks murni, non-link)
 * - Ikon antarmuka profesional berbasis Lucide Icons
 */

import Link from "next/link";
import {
  MapPin,
  House,
  Ruler,
  Info,
  Phone,
  Map,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { SmartImage } from "@/components/ui/SmartImage";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { formatRupiah } from "@/lib/utils";
import type { Project, PropertyUnit, UnitStatus } from "@/types";

interface UnitDetailV2Props {
  locale: string;
  project: Project;
  unit: PropertyUnit;
  waDisabled?: boolean;
  waUrl?: string | undefined;
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
    buildingArea?: string;
    dimensions: string;
    buildingType?: string;
    bedrooms?: string;
    bathrooms?: string;
    carport?: string;
    price: string;
    status: string;
    contactForPrice: string;
    photoPlaceholder: string;
    viewOnSitePlan: string;
    contactWhatsApp: string;
    interestForm?: string;
    waDisabled: string;
    unconfirmedNotice?: string;
    yes?: string;
    no?: string;
    backToUnits?: string;
    kavlingMeasurementDisclaimer?: string;
    buildingOptionsNotice?: string;
    brochureContactTitle?: string;
    brochureContactNotice?: string;
    temporaryContactBadge?: string;
  };
}

export function UnitDetailV2({ locale, project, unit, labels }: UnitDetailV2Props) {
  const statusLabel =
    unit.status === "available" ? labels.available
    : unit.status === "process" ? labels.process
    : unit.status === "sold" ? labels.sold
    : labels.unknown;

  const interestFormText =
    labels.interestForm || (locale === "en" ? "Interest & Consultation Form" : "Formulir Minat & Konsultasi");

  return (
    <div className="flex flex-col">
      {/* Page header — cream */}
      <div className="bg-gradient-to-b from-[#F7F4EE] via-[#F5F2EA] to-[#EEEAE1] px-4 py-9 sm:px-6 lg:px-8 border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb
            items={[
              { label: labels.home, href: `/${locale}` },
              { label: labels.projects, href: `/${locale}/projects` },
              { label: project.name, href: `/${locale}/projects/${project.slug}` },
              { label: labels.units, href: `/${locale}/projects/${project.slug}/units` },
              { label: unit.unitCode },
            ]}
            className="mb-3"
          />
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-800">
              {project.fullName}
            </span>
            <span className="text-xs text-neutral-500 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
              <span>{project.location.city}, {project.location.province}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left: image with smart fallback */}
          <div className="space-y-4">
            <SmartImage
              src={unit.image ?? null}
              alt={`Foto Unit ${unit.unitCode} - ${project.fullName}`}
              aspectRatio="4/3"
              placeholderType="image"
              placeholderLabel={labels.photoPlaceholder}
              placeholderDescription={`${unit.unitCode} · ${project.fullName}`}
              priority
              className="w-full rounded-2xl border border-neutral-200/90 shadow-md shadow-[0_4px_20px_-2px_rgba(28,41,34,0.06),inset_0_1px_0_0_rgba(255,255,255,0.95)]"
            />
            {/* Thumbnail row placeholder */}
            <div className="grid grid-cols-3 gap-2">
              <Placeholder type="image" label="" className="aspect-square rounded-xl opacity-60" />
              <Placeholder type="image" label="" className="aspect-square rounded-xl opacity-60" />
              <Placeholder type="image" label="" className="aspect-square rounded-xl opacity-40" />
            </div>

            {/* Opsi Tipe Bangunan untuk Kavling Ini */}
            <div className="rounded-2xl border border-primary-200/80 bg-gradient-to-br from-primary-50/80 to-white p-5 text-xs text-neutral-700 shadow-xs shadow-[0_2px_8px_-1px_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.95)]">
              <div className="flex items-center gap-2 mb-1.5">
                <House className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                <h3 className="font-bold text-neutral-900">
                  {locale === "en" ? "House Building Options" : "Pilihan Desain Rumah"}
                </h3>
              </div>
              <p className="leading-relaxed text-neutral-600">
                {labels.buildingOptionsNotice ||
                  "Tersedia opsi pembangunan rumah Type 30 (LB 30 m², 2 KT) dan Type 46 (LB 46 m², 3 KT) untuk kavling ini."}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded bg-white border border-primary-200 px-2 py-1 text-[11px] font-semibold text-primary-800">
                  Type 30 (30 m², 2 KT)
                </span>
                <span className="rounded bg-white border border-primary-200 px-2 py-1 text-[11px] font-semibold text-primary-800">
                  Type 46 (46 m², 3 KT)
                </span>
              </div>
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
            <dl className="divide-y divide-neutral-100 overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs shadow-[0_2px_8px_-1px_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.95)]">
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-sm text-neutral-500">{labels.code}</dt>
                <dd className="text-sm font-semibold text-neutral-900">{unit.unitCode}</dd>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <dt className="text-sm text-neutral-500">{labels.type}</dt>
                <dd className="text-sm font-semibold text-neutral-900">
                  {unit.unitType ? unit.unitType.charAt(0).toUpperCase() + unit.unitType.slice(1) : "Unit"}
                </dd>
              </div>
              {unit.landArea != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-neutral-500">{labels.landArea}</dt>
                  <dd className="text-sm font-bold text-neutral-900">{unit.landArea} m²</dd>
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
              {unit.buildingArea != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-neutral-500">
                    {labels.buildingArea || (locale === "en" ? "Building Area" : "Luas Bangunan")}
                  </dt>
                  <dd className="text-sm font-semibold text-neutral-900">{unit.buildingArea} m²</dd>
                </div>
              )}
              {unit.buildingType != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-neutral-500">
                    {labels.buildingType || (locale === "en" ? "Building Type" : "Tipe Bangunan")}
                  </dt>
                  <dd className="text-sm font-semibold text-neutral-900">{unit.buildingType}</dd>
                </div>
              )}
              {unit.bedrooms != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-neutral-500">
                    {labels.bedrooms || (locale === "en" ? "Bedrooms" : "Kamar Tidur")}
                  </dt>
                  <dd className="text-sm font-semibold text-neutral-900">{unit.bedrooms}</dd>
                </div>
              )}
              {unit.bathrooms != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-neutral-500">
                    {labels.bathrooms || (locale === "en" ? "Bathrooms" : "Kamar Mandi")}
                  </dt>
                  <dd className="text-sm font-semibold text-neutral-900">{unit.bathrooms}</dd>
                </div>
              )}
              {unit.carport != null && (
                <div className="flex items-center justify-between px-4 py-3">
                  <dt className="text-sm text-neutral-500">{labels.carport || "Carport"}</dt>
                  <dd className="text-sm font-semibold text-neutral-900">
                    {unit.carport
                      ? (labels.yes || (locale === "en" ? "Available" : "Ada"))
                      : (labels.no || (locale === "en" ? "None" : "Tidak Ada"))}
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

            {/* Catatan Transparansi Ukuran Kavling */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/90 p-3.5 text-xs text-neutral-600 flex items-start gap-2.5">
              <Ruler className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75] mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                {labels.kavlingMeasurementDisclaimer ||
                  "Catatan Ukuran Kavling: Luas tanah dan dimensi (lebar × panjang) bersumber dari brosur pemasaran awal. Dimensi merepresentasikan perkiraan lebar muka dan panjang rata-rata, bukan hasil pengukuran geometris persegi panjang yang presisi."}
              </p>
            </div>

            {/* Kotak Transparansi Status Unknown */}
            {unit.status === "unknown" && (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3.5 text-xs text-neutral-600 flex items-start gap-2.5">
                <Info className="h-4 w-4 text-neutral-500 shrink-0 stroke-[1.75] mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">
                  {labels.unconfirmedNotice ||
                    (locale === "en"
                      ? "The availability status of this unit has not been officially confirmed by the developer. Please contact marketing for the latest status verification."
                      : "Status ketersediaan unit ini belum terkonfirmasi resmi oleh pengembang. Silakan hubungi marketing untuk verifikasi ketersediaan terkini.")}
                </p>
              </div>
            )}

            {/* Banner Kontak Pemasaran Brosur */}
            {project.brochureCandidateContact && (
              <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-3.5 text-xs text-neutral-700">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-primary-800 shrink-0 stroke-[1.75]" aria-hidden="true" />
                    <span className="font-bold text-neutral-900">
                      {labels.brochureContactTitle || "Informasi Kontak Pemasaran"}
                    </span>
                  </div>
                  <span className="rounded bg-primary-200/70 px-2 py-0.5 text-[10px] font-semibold text-primary-900">
                    {labels.temporaryContactBadge || "Kontak Pemasaran"}
                  </span>
                </div>
                <div className="my-1.5">
                  <span className="inline-block font-mono text-sm font-bold text-neutral-900 bg-white border border-neutral-300 px-3 py-1 rounded select-all tracking-wider shadow-2xs">
                    {project.brochureCandidateContact}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-normal">
                  {labels.brochureContactNotice ||
                    "Nomor ini merupakan kontak marketing Celestia Dehir. Silakan hubungi langsung melalui tombol WhatsApp."}
                </p>
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <WhatsAppButton
                locale={locale as "id" | "en"}
                context="unit"
                projectFullName={project.fullName}
                unitCode={unit.unitCode}
                variant="primary"
                fullWidth
                disabledMessage={labels.waDisabled}
                className="rounded-xl min-h-[48px] text-sm"
              >
                {labels.contactWhatsApp}
              </WhatsAppButton>

              <Link
                href={`/${locale}/projects/${project.slug}?unit=${unit.unitCode}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300"
              >
                <Map className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                <span>{labels.viewOnSitePlan}</span>
              </Link>

              <Link
                href={`/${locale}/interest?project=${project.slug}&unit=${unit.unitCode}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-primary-200 bg-primary-50/70 px-6 py-3 text-sm font-semibold text-primary-800 hover:bg-primary-100 transition-colors min-h-[44px]"
              >
                <ClipboardList className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                <span>{interestFormText}</span>
              </Link>

              <Link
                href={`/${locale}/projects/${project.slug}/units`}
                className="mt-2 inline-flex items-center justify-center gap-1.5 text-center text-xs font-medium text-neutral-500 hover:text-primary-700 transition-colors py-1"
              >
                <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
                <span>{labels.backToUnits || (locale === "en" ? "Back to Unit List" : "Kembali ke Daftar Unit")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
