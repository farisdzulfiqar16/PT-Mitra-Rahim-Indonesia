"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
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
    viewDetail: string;
    contactForPrice: string;
    contactWhatsApp: string;
    waDisabled: string;
    filterAll: string;
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

  return (
    <div className="flex flex-col">
      {/* Page header — cream */}
      <div className="bg-[#F5F2EC] px-4 py-8 sm:px-6 lg:px-8 border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl animate-fade-in-up">
          <Breadcrumb
            items={[
              { label: labels.home, href: `/${locale}` },
              { label: labels.projects, href: `/${locale}/projects` },
              { label: project.name, href: `/${locale}/projects/${project.slug}` },
              { label: "Unit" },
            ]}
            className="mb-3"
          />
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{project.fullName}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            📍 {project.location.city}, {project.location.province}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Interactive Filter + count */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            Menampilkan {filteredUnits.length} dari {units.length} unit
          </p>
        </div>

        {/* Grid */}
        {filteredUnits.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center text-sm text-neutral-400">
            {labels.noUnits}
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
                  className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs hover:shadow-md hover:border-primary-200 transition-all duration-200 hover:-translate-y-0.5"
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
      </div>
    </div>
  );
}
