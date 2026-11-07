"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SitePlanPanel } from "@/features/site-plan/SitePlanPanel";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
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

  return (
    <div className="flex flex-col">
      {/* Page header — cream */}
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
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            {project.fullName}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            📍 {project.location.city}, {project.location.province}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Jelajahi properti label + interactive filter */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Eksplorasi Kavling
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-neutral-900">
              {project.name} · {project.fullName}
            </h2>
            <span className="text-xs text-neutral-400 font-medium">
              Menampilkan {filteredUnits.length} dari {units.length} unit
            </span>
          </div>

          {/* Filter chips interaktif */}
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
        </div>

        {/* 2-column: Unit Grid kiri (65%) + Sidebar kanan (35%) */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Kiri: Grid unit cards */}
          <div className="flex-1">
            {filteredUnits.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center text-sm text-neutral-500">
                Tidak ada unit dengan status terpilih.
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
            {/* Peta lokasi */}
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
              <div className="border-b border-neutral-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-neutral-900">
                  📍 Lokasi · {project.location.city}
                </h3>
                <p className="text-xs text-neutral-400">{project.location.province}</p>
              </div>
              <Placeholder
                type="map"
                label="Peta lokasi"
                description={`${project.location.city}, ${project.location.province}`}
                className="aspect-video border-0 rounded-none"
              />
            </div>

            {/* Site Plan panel ringkas */}
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
        <div className="my-3 grid grid-cols-3 gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-center">
          <div>
            <p className="text-[10px] text-neutral-400">Luas</p>
            <p className="text-xs font-semibold text-neutral-700">
              {unit.landArea != null ? `${unit.landArea} m²` : "—"}
            </p>
          </div>
          <div className="border-x border-neutral-200">
            <p className="text-[10px] text-neutral-400">Harga</p>
            <p className="text-xs font-semibold text-neutral-700">{labels.contactForPrice}</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-400">Status</p>
            <p className="text-xs font-semibold text-neutral-700">{statusLabel}</p>
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
