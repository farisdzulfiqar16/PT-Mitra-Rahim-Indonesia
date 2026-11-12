"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, ClipboardList, Info, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SmartImage } from "@/components/ui/SmartImage";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { cn } from "@/lib/utils";
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
    projectUnitsPreparation?: string;
    viewDetail: string;
    contactForPrice: string;
    contactWhatsApp: string;
    waDisabled: string;
    filterAll: string;
    kavlingMeasurementDisclaimer?: string;
    brochureContactTitle?: string;
    brochureContactNotice?: string;
    temporaryContactBadge?: string;
    projectAddressLabel?: string;
  };
}

export function UnitCatalogV2({ locale, project, units, labels }: UnitCatalogV2Props) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filterOptions = [
    { id: "all", label: labels.filterAll },
    { id: "available", label: labels.available },
    { id: "process", label: labels.process },
    { id: "sold", label: labels.sold },
    { id: "unknown", label: labels.unknown },
  ];

  const filteredUnits = units.filter((unit) => {
    if (activeFilter === "all") return true;
    return unit.status === activeFilter;
  });

  const isComingSoon = project.status === "coming-soon";

  // Alamat resmi proyek terformat
  const fullAddressDisplay = [
    project.location.streetAddress,
    project.location.subDistrict,
    project.location.district,
    project.location.city,
    project.location.province,
    project.location.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col">
      {/* Page Header — cream */}
      <div className="bg-gradient-to-b from-[#F7F4EE] via-[#F5F2EA] to-[#EEEAE1] px-4 py-9 sm:px-6 lg:px-8 border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl animate-fade-in-up">
          <Breadcrumb
            items={[
              { label: labels.home, href: `/${locale}` },
              { label: labels.projects, href: `/${locale}/projects` },
              { label: project.name, href: `/${locale}/projects/${project.slug}` },
              { label: locale === "en" ? "Units" : "Unit" },
            ]}
            className="mb-3"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                {locale === "en"
                  ? `Unit Catalog — ${project.fullName}`
                  : `Katalog Unit — ${project.fullName}`}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 flex items-start gap-1.5">
                <MapPin className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75] mt-0.5" aria-hidden="true" />
                <span>{fullAddressDisplay}</span>
              </p>
            </div>
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800 transition-colors self-start sm:self-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
              <span>{locale === "en" ? "Project Overview & Map" : "Info Proyek & Denah"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

        {/* Banner Kontak Brosur Sementara (Teks Murni, Non-Link) */}
        {project.brochureCandidateContact && (
          <div className="rounded-xl border border-amber-200/90 bg-amber-50/70 p-4 text-neutral-800 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800 shadow-2xs">
                  <Phone className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      {labels.brochureContactTitle || "Informasi Kontak Pemasaran"}
                    </h2>
                    <span className="rounded bg-amber-200/80 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                      {labels.temporaryContactBadge || "Informasi Sementara"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                    {labels.brochureContactNotice ||
                      "Nomor ini merupakan kontak marketing Celestia Dehir. Silakan hubungi langsung melalui saluran yang tersedia."}
                  </p>
                </div>
              </div>

              {/* Teks Nomor — STRICTLY PLAIN TEXT */}
              <div className="shrink-0 sm:text-right">
                <span className="inline-block font-mono text-base font-bold text-neutral-900 bg-white border border-neutral-300 px-3.5 py-1.5 rounded-lg select-all tracking-wider shadow-2xs">
                  {project.brochureCandidateContact}
                </span>
              </div>
            </div>
          </div>
        )}

        {units.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700 shadow-2xs border border-amber-200/60">
              <ClipboardList className="h-7 w-7 stroke-[1.75]" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900 sm:text-xl">
              {isComingSoon
                ? (locale === "en" ? "Unit Data in Preparation" : "Data Unit Sedang Dipersiapkan")
                : labels.noUnits}
            </h2>
            <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              {isComingSoon
                ? (labels.projectUnitsPreparation || (locale === "en"
                    ? "The unit list for this project is currently in preparation and has not been opened to the public."
                    : "Daftar unit untuk proyek ini sedang dalam tahap persiapan dan belum dibuka untuk umum."))
                : labels.noUnits}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/projects/${project.slug}`}
                className="inline-flex items-center gap-1.5 justify-center rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
                <span>{locale === "en" ? "Back to Project Overview" : "Kembali ke Info Proyek"}</span>
              </Link>
              <Link
                href={`/${locale}/interest?project=${project.slug}`}
                className="inline-flex items-center gap-1.5 justify-center rounded-lg border border-primary-600 bg-primary-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-800 transition-colors shadow-xs"
              >
                <ClipboardList className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                <span>{locale === "en" ? "Consult About This Project" : "Konsultasi Info Proyek"}</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Interactive Filter + count */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter status unit">
                {filterOptions.map((opt) => {
                  const isActive = activeFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setActiveFilter(opt.id)}
                      aria-pressed={isActive}
                      className={cn(
                        "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                        isActive
                          ? "bg-primary-700 text-white font-semibold shadow-xs"
                          : "border border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:text-primary-700"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-neutral-400 shrink-0">
                {locale === "en"
                  ? `Showing ${filteredUnits.length} of ${units.length} units`
                  : `Menampilkan ${filteredUnits.length} dari ${units.length} unit`}
              </p>
            </div>

            {/* Catatan Transparansi Ukuran Kavling */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50/90 p-3.5 text-xs text-neutral-600 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-neutral-500 shrink-0 stroke-[1.75] mt-0.5" aria-hidden="true" />
              <p className="leading-relaxed">
                {labels.kavlingMeasurementDisclaimer ||
                  "Catatan Ukuran Kavling: Luas tanah dan dimensi (lebar × panjang) bersumber dari brosur pemasaran awal. Dimensi merepresentasikan perkiraan lebar muka dan panjang rata-rata, bukan hasil pengukuran geometris persegi panjang yang presisi. Status ketersediaan seluruh unit saat ini belum dikonfirmasi resmi oleh pengembang."}
              </p>
            </div>

            {/* Grid */}
            {filteredUnits.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center text-sm text-neutral-400">
                {locale === "en"
                  ? "No units match the selected status filter."
                  : "Tidak ada unit dengan status terpilih."}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUnits.map((unit) => {
                  const statusLabel =
                    unit.status === "available" ? labels.available
                    : unit.status === "process" ? labels.process
                    : unit.status === "sold" ? labels.sold
                    : labels.unknown;

                  return (
                    <article
                      key={unit.unitCode}
                      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs hover:shadow-lg hover:border-primary-300/80 transition-all duration-300 hover:-translate-y-1 shadow-[0_2px_8px_-1px_rgba(28,41,34,0.05),0_1px_3px_0_rgba(28,41,34,0.03),inset_0_1px_0_0_rgba(255,255,255,0.95)]"
                    >
                      {/* Smart Image with Fallback */}
                      <SmartImage
                        src={unit.image ?? null}
                        alt={`Kavling ${unit.unitCode} - ${project.fullName}`}
                        aspectRatio="16/9"
                        placeholderType="image"
                        placeholderLabel={`Kavling ${unit.unitCode}`}
                        className="border-0 border-b border-neutral-100 rounded-none"
                      />

                      {/* Body */}
                      <div className="flex flex-1 flex-col p-4">
                        {/* Title row */}
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-neutral-400">
                              {unit.unitType ? unit.unitType.charAt(0).toUpperCase() + unit.unitType.slice(1) : "Unit"}
                            </p>
                            <h2 className="text-base font-bold text-neutral-900">{unit.unitCode}</h2>
                          </div>
                          <Badge variant={unit.status as UnitStatus}>{statusLabel}</Badge>
                        </div>

                        {/* Specs grid — 4 attributes */}
                        <div className="my-3 grid grid-cols-2 gap-2 rounded-lg bg-neutral-50 p-2.5 text-center text-xs border border-neutral-100">
                          <div>
                            <p className="text-[10px] text-neutral-400">
                              {locale === "en" ? "Land Area" : "Luas Tanah"}
                            </p>
                            <p className="text-xs font-semibold text-neutral-800">
                              {unit.landArea != null ? `${unit.landArea} m²` : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-neutral-400">
                              {locale === "en" ? "Dimensions" : "Dimensi (L×P)"}
                            </p>
                            <p className="text-xs font-semibold text-neutral-800">
                              {unit.dimensions != null
                                ? `${unit.dimensions.width} × ${unit.dimensions.length} m`
                                : "—"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-neutral-400">
                              {locale === "en" ? "Price" : "Harga"}
                            </p>
                            <p className="text-xs font-semibold text-neutral-800">{labels.contactForPrice}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-neutral-400">
                              {locale === "en" ? "Status" : "Status"}
                            </p>
                            <p className="text-xs font-semibold text-neutral-800">{statusLabel}</p>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-auto flex gap-2 pt-1">
                          <Link
                            href={`/${locale}/projects/${project.slug}/units/${unit.unitCode}`}
                            className="flex flex-1 items-center justify-center rounded-md border border-primary-300 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                          >
                            {labels.viewDetail}
                          </Link>
                          <WhatsAppButton
                            locale={locale as "id" | "en"}
                            context="unit"
                            projectFullName={project.fullName}
                            unitCode={unit.unitCode}
                            variant="compact"
                            disabledMessage={labels.waDisabled}
                            ariaLabel={`${labels.contactWhatsApp} — ${unit.unitCode}`}
                            showIcon={false}
                          >
                            WA
                          </WhatsAppButton>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
