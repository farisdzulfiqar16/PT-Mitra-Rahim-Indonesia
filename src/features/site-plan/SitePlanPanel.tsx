/**
 * SitePlanPanel — Container utama Site Plan pada halaman eksplorasi.
 *
 * Menangani dua kondisi:
 *   1. Denah resmi belum tersedia → tampilkan placeholder + daftar unit teks.
 *   2. Denah resmi tersedia → tampilkan InteractiveSitePlan (belum aktif).
 *
 * Komponen ini adalah Server Component.
 */

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Placeholder } from "@/components/ui/Placeholder";
import { InteractiveSitePlan } from "./InteractiveSitePlan";
import type { PropertyUnit, UnitStatus } from "@/types";

export interface SitePlanPanelProps {
  /**
   * Apakah denah resmi dan data posisi unit sudah tersedia serta dikonfirmasi.
   * Ubah menjadi true hanya setelah aset dan data posisi dikonfirmasi perusahaan.
   */
  isAvailable: boolean;

  /** Daftar unit yang dapat ditemukan pengunjung */
  units: PropertyUnit[];

  /** Kode unit yang di-highlight via deep-link (dari parameter ?unit=) */
  highlightedUnitCode?: string;

  /** Teks judul seksi Site Plan */
  title: string;

  /** Teks label placeholder jika denah belum tersedia */
  placeholderLabel: string;

  /** Teks deskripsi placeholder */
  placeholderDesc: string;

  /** Teks header daftar unit */
  unitListTitle: string;

  /** Teks keterangan deep-link unit yang dipilih (belum bisa ditampilkan di denah) */
  unitNotOnPlanNote?: string;

  /** Locale aktif untuk membangun URL */
  locale: string;

  /** Slug proyek untuk membangun URL */
  projectSlug: string;

  /** Label terjemahan status unit */
  statusLabels: {
    available: string;
    process: string;
    sold: string;
    unknown: string;
  };

  /** Label teks "Lihat Detail" untuk link unit */
  viewDetailLabel: string;
}

export function SitePlanPanel({
  isAvailable,
  units,
  highlightedUnitCode,
  title,
  placeholderLabel,
  placeholderDesc,
  unitListTitle,
  unitNotOnPlanNote,
  locale,
  projectSlug,
  statusLabels,
  viewDetailLabel,
}: SitePlanPanelProps) {
  return (
    <section aria-label={title}>
      <h2 className="mb-3 text-lg font-semibold text-neutral-900">📐 {title}</h2>

      {/* Kondisi 1: Denah resmi belum tersedia */}
      {!isAvailable && (
        <Placeholder
          type="site-plan"
          label={placeholderLabel}
          description={placeholderDesc}
          className="mb-4"
        />
      )}

      {/* Kondisi 2: Denah resmi tersedia — InteractiveSitePlan */}
      {isAvailable && (
        <InteractiveSitePlan
          units={units}
          highlightedUnitCode={highlightedUnitCode}
          ariaLabel={title}
        />
      )}

      {/*
        Informasi kontekstual deep-link:
        Jika pengunjung datang dari halaman Detail Unit via ?unit=,
        tapi denah belum tersedia, tampilkan keterangan unit yang dipilih.
      */}
      {highlightedUnitCode && !isAvailable && unitNotOnPlanNote && (
        <p className="mb-4 rounded-md bg-primary-50 px-4 py-3 text-sm text-primary-700 border border-primary-200">
          {unitNotOnPlanNote}
        </p>
      )}

      {/*
        Daftar unit — selalu ditampilkan agar semua unit dapat ditemukan
        baik ketika denah tersedia maupun tidak.
        Unit tanpa posisi di Site Plan tetap dapat diakses melalui daftar ini.
      */}
      <div className="mt-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">{unitListTitle}</h3>

        {units.length === 0 ? (
          <p className="text-sm text-neutral-400">—</p>
        ) : (
          <ul
            className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={unitListTitle}
          >
            {units.map((unit) => {
              const isHighlighted = unit.unitCode === highlightedUnitCode;
              return (
                <li key={unit.unitCode}>
                  <Link
                    href={`/${locale}/projects/${projectSlug}/units/${unit.unitCode}`}
                    className={[
                      "flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors min-h-[44px]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
                      isHighlighted
                        ? "border-primary-400 bg-primary-50 text-primary-700 font-semibold"
                        : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50",
                    ].join(" ")}
                    aria-current={isHighlighted ? "true" : undefined}
                  >
                    <span className="font-medium">{unit.unitCode}</span>
                    <Badge variant={unit.status as UnitStatus}>
                      {unit.status === "available"
                        ? statusLabels.available
                        : unit.status === "process"
                          ? statusLabels.process
                          : unit.status === "sold"
                            ? statusLabels.sold
                            : statusLabels.unknown}
                    </Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        {/* Keterangan bahwa semua unit ditampilkan di daftar ini */}
        {isAvailable && (
          <p className="mt-2 text-xs text-neutral-400">
            {viewDetailLabel}
          </p>
        )}
      </div>
    </section>
  );
}
