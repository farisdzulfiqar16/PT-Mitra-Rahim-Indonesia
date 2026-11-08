"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Map, ClipboardList, FolderKanban, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface SidebarProjectItem {
  slug: string;
  name: string;
  status: "active" | "coming-soon";
}

export interface SidebarLabels {
  projectsTitle?: string;
  contextualTitle?: string;
  viewUnits?: string;
  viewSitePlan?: string;
  interestForm?: string;
  available?: string;
  comingSoon?: string;
  mobileToggle?: string;
}

export interface SidebarProps {
  /** Slug proyek yang sedang aktif/dilihat */
  currentSlug?: string;
  /** Locale aktif (id | en) */
  locale: string;
  /** Daftar proyek (default: Dehir & Pabuaran) */
  projects?: SidebarProjectItem[];
  /** Label terjemahan */
  labels?: SidebarLabels;
  /** Class CSS tambahan */
  className?: string;
}

const DEFAULT_PROJECTS: SidebarProjectItem[] = [
  { slug: "dehir", name: "Dehir", status: "active" },
  { slug: "pabuaran", name: "Pabuaran", status: "coming-soon" },
];

/**
 * Sidebar — Komponen navigasi samping untuk proyek properti Celestia.
 *
 * Memenuhi acceptance criteria Task 8 & Batch 1:
 * - Menampilkan daftar proyek dengan indikator proyek yang aktif.
 * - Menampilkan badge "Coming Soon" untuk Pabuaran dan "Tersedia" untuk proyek aktif.
 * - Menyediakan navigasi kontekstual (Katalog Unit, Site Plan, Formulir Minat & Konsultasi).
 * - Meneruskan parameter proyek ke Formulir Minat & Konsultasi secara otomatis.
 * - Mendukung mobile collapse toggle (accordion di layar kecil).
 */
export function Sidebar({
  currentSlug = "dehir",
  locale,
  projects = DEFAULT_PROJECTS,
  labels = {},
  className,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const projectsTitle = labels.projectsTitle || (locale === "en" ? "Projects" : "Daftar Proyek");
  const contextualTitle = labels.contextualTitle || (locale === "en" ? "Explore" : "Eksplorasi");
  const viewUnits = labels.viewUnits || (locale === "en" ? "Unit Catalog" : "Lihat Katalog Unit");
  const viewSitePlan = labels.viewSitePlan || (locale === "en" ? "Site Plan" : "Lihat Site Plan");
  const interestForm = labels.interestForm || (locale === "en" ? "Interest & Consultation" : "Formulir Minat & Konsultasi");
  const availableLabel = labels.available || (locale === "en" ? "Active" : "Tersedia");
  const comingSoonLabel = labels.comingSoon || "Coming Soon";
  const mobileToggleText = labels.mobileToggle || (locale === "en" ? "Project Menu" : "Menu Proyek & Navigasi");

  const content = (
    <div className="space-y-5">
      {/* Daftar Proyek */}
      <div>
        <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {projectsTitle}
        </h2>
        <ul className="space-y-1.5" role="list">
          {projects.map((proj) => {
            const isActive = currentSlug === proj.slug;
            return (
              <li key={proj.slug}>
                <Link
                  href={`/${locale}/projects/${proj.slug}`}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                    isActive
                      ? "bg-primary-100 text-primary-800 font-semibold"
                      : "text-neutral-700 hover:bg-neutral-100"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span>{proj.name}</span>
                  {proj.status === "coming-soon" ? (
                    <Badge variant="coming-soon">{comingSoonLabel}</Badge>
                  ) : (
                    <Badge variant="available">{availableLabel}</Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Navigasi Kontekstual — hanya relevan untuk proyek aktif (Dehir) */}
      {currentSlug === "dehir" && (
        <div className="border-t border-neutral-200 pt-4">
          <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            {contextualTitle}
          </h2>
          <ul className="space-y-1.5" role="list">
            <li>
              <Link
                href={`/${locale}/projects/dehir/units`}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-primary-700 transition-colors min-h-[44px]"
              >
                <Building2 className="h-4 w-4 mr-2 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                <span>{viewUnits}</span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/projects/dehir`}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-primary-700 transition-colors min-h-[44px]"
              >
                <Map className="h-4 w-4 mr-2 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                <span>{viewSitePlan}</span>
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/interest?project=${currentSlug}`}
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-primary-700 transition-colors min-h-[44px]"
              >
                <ClipboardList className="h-4 w-4 mr-2 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
                <span>{interestForm}</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <aside
      aria-label="Sidebar Navigasi Proyek"
      className={cn("w-full shrink-0 lg:w-64", className)}
    >
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-sidebar-content"
          className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors min-h-[44px]"
        >
          <span className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75]" aria-hidden="true" />
            <span>{mobileToggleText}</span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-neutral-500 transition-transform duration-200 shrink-0 stroke-[2]",
              isMobileOpen ? "rotate-180" : ""
            )}
            aria-hidden="true"
          />
        </button>

        {isMobileOpen && (
          <div
            id="mobile-sidebar-content"
            className="mt-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
          >
            {content}
          </div>
        )}
      </div>

      {/* Desktop Permanent Display */}
      <div className="hidden lg:block rounded-xl border border-neutral-200 bg-neutral-50/80 p-5 shadow-xs">
        {content}
      </div>
    </aside>
  );
}
