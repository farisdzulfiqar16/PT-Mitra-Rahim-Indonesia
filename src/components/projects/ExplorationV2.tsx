"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ClipboardList,
  Phone,
  Info,
  GraduationCap,
  Building2,
  Hospital,
  Film,
  ShoppingBasket,
  UtensilsCrossed,
  Route,
  BedDouble,
  Bath,
  Armchair,
  ChefHat,
  Trees,
  Car,
  Navigation,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { SmartImage } from "@/components/ui/SmartImage";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SitePlanPanel } from "@/features/site-plan/SitePlanPanel";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { buildGoogleMapsUrl, formatProjectAddress } from "@/config/site";
import { cn } from "@/lib/utils";
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
    projectAddressLabel?: string;
    buildingTypesSectionTitle?: string;
    buildingTypesSectionSubtitle?: string;
    buildingTypesDisclaimer?: string;
    floorPlanInPreparation?: string;
    floorPlanInPreparationDesc?: string;
    singleStoreyTag?: string;
    specBedrooms?: string;
    specBathrooms?: string;
    specLivingRoom?: string;
    specKitchen?: string;
    specFrontGarden?: string;
    specBackGarden?: string;
    specCarport?: string;
    specBuildingArea?: string;
    facilitiesSectionTitle?: string;
    facilitiesSectionSubtitle?: string;
    facilitiesDisclaimer?: string;
    facilityDistanceEstimate?: string;
    brochureContactTitle?: string;
    brochureContactNotice?: string;
    kavlingMeasurementDisclaimer?: string;
    dimensionsLabel?: string;
    landAreaLabel?: string;
    unitKavlingTitle?: string;
    unitKavlingSubtitle?: string;
    viewAllUnits?: string;
    buildingOptionsNotice?: string;
    temporaryContactBadge?: string;
    viewOnGoogleMaps?: string;
  };
}

/** Helper icon untuk fasilitas umum menggunakan Lucide Icons */
function getFacilityIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("smp") || n.includes("smk") || n.includes("sdit") || n.includes("sekolah")) return GraduationCap;
  if (n.includes("masjid")) return Building2;
  if (n.includes("puskesmas") || n.includes("klinik") || n.includes("sehat")) return Hospital;
  if (n.includes("cinema") || n.includes("mall")) return Film;
  if (n.includes("alfamart") || n.includes("superindo") || n.includes("mart") || n.includes("pasar")) return ShoppingBasket;
  if (n.includes("kuliner") || n.includes("makan") || n.includes("parpostel")) return UtensilsCrossed;
  if (n.includes("tol")) return Route;
  return MapPin;
}

function ExplorationV2Content({
  locale,
  project,
  units,
  highlightedUnitCode,
  sitePlanAvailable,
  labels,
}: ExplorationV2Props) {
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

  // Alamat lengkap terformat resmi dan tautan Google Maps
  const fullAddressDisplay = formatProjectAddress(project.location);
  const mapsUrl = buildGoogleMapsUrl(project.location);

  return (
    <div className="flex flex-col">
      {/* ── Page Header — Cream ────────────────────────────────────────────── */}
      <div className="bg-[#F5F2EC] px-4 py-8 sm:px-6 lg:px-8 border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl animate-fade-in-up">
          <Breadcrumb
            items={[
              { label: labels.home, href: `/${locale}` },
              { label: labels.projects, href: `/${locale}/projects` },
              { label: project.name },
            ]}
            className="mb-3"
          />

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-md bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-800">
                  {project.name}
                </span>
                {project.propertyTypes?.map((pt) => (
                  <span
                    key={pt}
                    className="rounded-md bg-white/80 border border-neutral-200 px-2 py-0.5 text-xs text-neutral-600 font-medium"
                  >
                    {pt}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                {project.fullName}
              </h1>
              {project.marketingTagline && (
                <p className="mt-1 text-sm font-medium text-neutral-700 italic">
                  &ldquo;{project.marketingTagline}&rdquo;
                </p>
              )}
              <div className="mt-2 text-xs sm:text-sm text-neutral-600 flex flex-wrap items-center gap-x-3 gap-y-1.5 max-w-3xl leading-relaxed">
                <span className="flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75] mt-0.5" aria-hidden="true" />
                  <span>{fullAddressDisplay}</span>
                </span>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-800 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded text-xs shrink-0"
                  >
                    <Navigation className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
                    <span>{labels.viewOnGoogleMaps || (locale === "en" ? "View on Google Maps" : "Lihat Lokasi di Google Maps")}</span>
                    <ExternalLink className="h-3 w-3 stroke-[2] opacity-75" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick action button to Unit Catalog */}
            <div className="shrink-0">
              <Link
                href={`/${locale}/projects/${project.slug}/units`}
                className="inline-flex items-center gap-1.5 justify-center rounded-lg border border-primary-600 bg-primary-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-800 transition-colors shadow-xs"
              >
                <ClipboardList className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                <span>{labels.viewUnits}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content Container ────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">

        {/* ── Banner Kontak Brosur Pemasaran ───────────────────────────────── */}
        {project.brochureCandidateContact && (
          <div className="rounded-xl border border-primary-200/90 bg-primary-50/70 p-4 sm:p-5 text-neutral-800 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-800 shadow-2xs">
                  <Phone className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-sm font-bold text-neutral-900">
                      {labels.brochureContactTitle || "Informasi Kontak Pemasaran (Brosur)"}
                    </h2>
                    <span className="rounded bg-primary-200/80 px-2 py-0.5 text-[10px] font-semibold text-primary-900">
                      {labels.temporaryContactBadge || "Kontak Pemasaran (Brosur)"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                    {labels.brochureContactNotice}
                  </p>
                </div>
              </div>

              {/* Teks Nomor & Tombol WhatsApp Aktif */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
                <span className="inline-block font-mono text-base font-bold text-neutral-900 bg-white border border-neutral-300 px-3.5 py-2 rounded-lg select-all tracking-wider shadow-2xs">
                  {project.brochureCandidateContact}
                </span>
                <WhatsAppButton
                  locale={locale as "id" | "en"}
                  context="project"
                  projectFullName={project.fullName}
                  variant="primary"
                  className="rounded-lg shadow-xs min-h-[42px] px-4 py-2 text-xs"
                >
                  {labels.contactWhatsApp}
                </WhatsAppButton>
              </div>
            </div>
          </div>
        )}

        {/* ── Bagian 1: Eksplorasi Kavling & Site Plan ────────────────────── */}
        <section aria-labelledby="kavling-section-title">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              {labels.unitKavlingTitle || "Eksplorasi Kavling"}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
              <h2 id="kavling-section-title" className="text-xl font-bold text-neutral-900">
                {labels.unitKavlingSubtitle || `${project.name} · Daftar Kavling Resmi`}
              </h2>
              <span className="text-xs text-neutral-400 font-medium">
                {locale === "en"
                  ? `Showing ${filteredUnits.length} of ${units.length} units`
                  : `Menampilkan ${filteredUnits.length} dari ${units.length} unit`}
              </span>
            </div>
          </div>

          {/* Filter chips interaktif */}
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter status unit">
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

          {/* Catatan Transparansi Pengukuran Kavling */}
          <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50/90 p-3.5 text-xs text-neutral-600 leading-relaxed flex items-start gap-2.5">
            <Info className="h-4 w-4 text-neutral-500 shrink-0 stroke-[1.75] mt-0.5" aria-hidden="true" />
            <p>
              {labels.kavlingMeasurementDisclaimer ||
                "Catatan Ukuran Kavling: Luas tanah dan dimensi (lebar × panjang) bersumber dari brosur pemasaran awal. Dimensi merepresentasikan perkiraan lebar muka dan panjang rata-rata, bukan hasil pengukuran geometris persegi panjang yang presisi. Status ketersediaan seluruh unit saat ini belum dikonfirmasi resmi oleh pengembang."}
            </p>
          </div>

          {/* Layout 2-kolom: Grid Kavling (Kiri) + Sidebar Peta/SitePlan (Kanan) */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Kiri: Grid unit cards */}
            <div className="flex-1">
              {filteredUnits.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center text-sm text-neutral-500">
                  {locale === "en"
                    ? "No units match the selected status filter."
                    : "Tidak ada unit dengan status terpilih."}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredUnits.map((unit) => (
                    <UnitCard
                      key={unit.unitCode}
                      unit={unit}
                      locale={locale}
                      project={project}
                      labels={labels}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Kanan: Sidebar peta + ringkasan */}
            <aside className="w-full lg:w-80 shrink-0 space-y-5">
              {/* Peta lokasi & Alamat Resmi */}
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
                <div className="border-b border-neutral-100 px-4 py-3 bg-neutral-50/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                    <span>{labels.projectAddressLabel || "Alamat Resmi Proyek"}</span>
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-neutral-900 leading-relaxed">
                    {fullAddressDisplay}
                  </p>
                </div>
                <Placeholder
                  type="map"
                  label={locale === "en" ? "Location Map" : "Peta Lokasi"}
                  description={fullAddressDisplay}
                  className="aspect-video border-0 rounded-none"
                />
                {mapsUrl && (
                  <div className="p-3 bg-white border-t border-neutral-100">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary-800 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[40px]"
                    >
                      <Navigation className="h-4 w-4 stroke-[2]" aria-hidden="true" />
                      <span>{labels.viewOnGoogleMaps || (locale === "en" ? "View Location on Google Maps" : "Lihat Lokasi di Google Maps")}</span>
                      <ExternalLink className="h-3.5 w-3.5 stroke-[2] opacity-80" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>

              {/* Site Plan panel */}
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs p-4">
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
        </section>

        {/* ── Bagian 2: Pilihan Tipe Bangunan (Type 30 & Type 46) ─────────── */}
        {project.buildingTypes && project.buildingTypes.length > 0 && (
          <section aria-labelledby="building-types-title" className="pt-6 border-t border-neutral-200">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Spesifikasi Bangunan
              </p>
              <h2 id="building-types-title" className="text-xl font-bold text-neutral-900">
                {labels.buildingTypesSectionTitle || "Pilihan Tipe Rumah"}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600">
                {labels.buildingTypesSectionSubtitle ||
                  "Pilihan rumah tapak satu lantai berdasarkan materi brosur pemasaran resmi Dehir:"}
              </p>
            </div>

            {/* Grid Komparasi Tipe Bangunan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.buildingTypes.map((bType) => {
                const isType46 = bType.id === "type-46" || bType.buildingArea === 46;
                return (
                  <div
                    key={bType.id}
                    className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs hover:border-primary-300 transition-all duration-200"
                  >
                    {/* Header Card Tipe */}
                    <div className="flex items-start justify-between gap-3 pb-4 border-b border-neutral-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-full bg-primary-100 px-3 py-0.5 text-xs font-bold text-primary-800">
                            {bType.name}
                          </span>
                          <span className="text-xs text-neutral-500 font-medium">
                            {labels.singleStoreyTag || "Rumah Tapak 1 Lantai"}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">
                          {bType.name} · {labels.specBuildingArea || "Luas Bangunan"} {bType.buildingArea} m²
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-200">
                          LB {bType.buildingArea} m²
                        </span>
                      </div>
                    </div>

                    {/* Deskripsi Tipe */}
                    {bType.description && (
                      <p className="py-3 text-xs text-neutral-600 leading-relaxed">
                        {bType.description}
                      </p>
                    )}

                    {/* Daftar Spesifikasi Utama dengan Lucide Icons */}
                    <div className="my-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 rounded-lg bg-neutral-50 p-2.5 text-neutral-700">
                        <BedDouble className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                        <span className="font-medium">
                          {(labels.specBedrooms || "{count} Kamar Tidur").replace("{count}", String(bType.bedrooms))}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-neutral-50 p-2.5 text-neutral-700">
                        <Bath className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                        <span className="font-medium">
                          {(labels.specBathrooms || "{count} Kamar Mandi / Toilet").replace("{count}", String(bType.toilets))}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-neutral-50 p-2.5 text-neutral-700">
                        <Armchair className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                        <span className="font-medium">{labels.specLivingRoom || "Ruang Tamu"}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-neutral-50 p-2.5 text-neutral-700">
                        <ChefHat className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                        <span className="font-medium">{labels.specKitchen || "Dapur"}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-neutral-50 p-2.5 text-neutral-700">
                        <Trees className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                        <span className="font-medium">
                          {isType46
                            ? (labels.specBackGarden || "Taman Depan & Belakang")
                            : (labels.specFrontGarden || "Taman Depan")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-neutral-50 p-2.5 text-neutral-700">
                        <Car className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                        <span className="font-medium">{labels.specCarport || "Carport"}</span>
                      </div>
                    </div>

                    {/* Denah placeholder — transparansi tanpa gambar fiktif */}
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <Placeholder
                        type="image"
                        label={labels.floorPlanInPreparation || "Denah Resmi Sedang Dipersiapkan"}
                        description={
                          labels.floorPlanInPreparationDesc ||
                          "Denah arsitektur resmi sedang dipersiapkan oleh perusahaan. Hubungi marketing untuk konsultasi tata ruang."
                        }
                        className="aspect-16/9 rounded-xl border border-neutral-200 bg-neutral-50/70"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer Spesifikasi Bangunan */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 italic">
              <Info className="h-3.5 w-3.5 text-neutral-400 shrink-0 stroke-[1.75]" aria-hidden="true" />
              <span>
                {labels.buildingTypesDisclaimer ||
                  "Spesifikasi tipe bangunan bersumber dari materi promosi brosur pemasaran awal. Gambar denah arsitektur resmi sedang dipersiapkan dan akan diterbitkan setelah verifikasi final pengembang."}
              </span>
            </div>
          </section>
        )}

        {/* ── Bagian 3: Fasilitas Sekitar Kawasan (11 Fasilitas) ──────────── */}
        {project.nearbyFacilities && project.nearbyFacilities.length > 0 && (
          <section aria-labelledby="facilities-title" className="pt-6 border-t border-neutral-200">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Akses & Lingkungan
              </p>
              <h2 id="facilities-title" className="text-xl font-bold text-neutral-900">
                {labels.facilitiesSectionTitle || "Fasilitas Sekitar Kawasan"}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-600">
                {labels.facilitiesSectionSubtitle ||
                  "Lokasi proyek memiliki akses dekat ke berbagai fasilitas umum di kawasan Jatiluhur dan Jatiasih:"}
              </p>
            </div>

            {/* Grid 11 Fasilitas dengan Lucide Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {project.nearbyFacilities.map((fac) => {
                const FacIcon = getFacilityIcon(fac.name);
                return (
                  <div
                    key={fac.name}
                    className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3.5 shadow-2xs hover:border-neutral-300 transition-colors"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-primary-700 shadow-2xs">
                      <FacIcon className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate" title={fac.name}>
                        {fac.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="rounded bg-primary-50 px-2 py-0.5 text-[11px] font-bold text-primary-700 border border-primary-200">
                          {fac.approximateDistance}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {labels.facilityDistanceEstimate || "Perkiraan dari brosur"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer Fasilitas */}
            <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-center flex items-center justify-center gap-2">
              <Info className="h-4 w-4 text-neutral-500 shrink-0 stroke-[1.75]" aria-hidden="true" />
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {labels.facilitiesDisclaimer ||
                  "Seluruh jarak yang tercantum di atas merupakan estimasi perkiraan dari brosur pemasaran, bukan hasil pengukuran lapangan presisi atau penentuan rute resmi."}
              </p>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

/** Sub-komponen card unit di grid eksplorasi */
function UnitCard({
  unit,
  locale,
  project,
  labels,
}: {
  unit: PropertyUnit;
  locale: string;
  project: Project;
  labels: ExplorationV2Props["labels"];
}) {
  const statusLabel =
    unit.status === "available" ? labels.available
    : unit.status === "process" ? labels.process
    : unit.status === "sold" ? labels.sold
    : labels.unknown;

  return (
    <article className="flex flex-col rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden hover:shadow-md hover:border-primary-300 transition-all duration-200 hover:-translate-y-0.5">
      {/* Smart Media Image with Automatic Fallback */}
      <SmartImage
        src={`/images/units/${project.slug}/${unit.unitCode}.jpg`}
        alt={`Kavling ${unit.unitCode} - ${project.fullName}`}
        aspectRatio="16/9"
        placeholderType="image"
        placeholderLabel={`Kavling ${unit.unitCode}`}
        className="border-0 border-b border-neutral-100 rounded-none"
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

        {/* Specs grid — 4 attributes */}
        <div className="my-3 grid grid-cols-2 gap-2 rounded-lg bg-neutral-50 p-2.5 text-center text-xs border border-neutral-100">
          <div>
            <p className="text-[10px] text-neutral-400">
              {labels.landAreaLabel || (locale === "en" ? "Land Area" : "Luas")}
            </p>
            <p className="text-xs font-semibold text-neutral-800">
              {unit.landArea != null ? `${unit.landArea} m²` : "—"}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-400">
              {labels.dimensionsLabel || (locale === "en" ? "Dimensions" : "Dimensi")}
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

        {/* CTA row */}
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
}

function ExplorationV2WithSearchParams(props: ExplorationV2Props) {
  const searchParams = useSearchParams();
  const rawUnitFromUrl = searchParams.get("unit")?.trim() || undefined;
  // Validasi parameter: hanya terima kode unit yang benar-benar ada di data unit proyek
  const isValidUnit = rawUnitFromUrl && Array.isArray(props.units)
    ? props.units.some((u) => u.unitCode && u.unitCode.toLowerCase() === rawUnitFromUrl.toLowerCase())
    : false;
  const unitFromUrl = rawUnitFromUrl && isValidUnit ? rawUnitFromUrl.toUpperCase() : undefined;
  const activeHighlightedUnitCode = props.highlightedUnitCode || unitFromUrl;
  return <ExplorationV2Content {...props} highlightedUnitCode={activeHighlightedUnitCode} />;
}

export function ExplorationV2(props: ExplorationV2Props) {
  return (
    <Suspense fallback={<ExplorationV2Content {...props} />}>
      <ExplorationV2WithSearchParams {...props} />
    </Suspense>
  );
}
