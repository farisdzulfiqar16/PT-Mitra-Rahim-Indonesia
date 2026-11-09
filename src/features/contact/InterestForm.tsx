"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CircleDollarSign,
  ClipboardCheck,
  Car,
  Home,
  Ruler,
  HelpCircle,
  Building2,
  Clock,
  Sparkles,
  Map,
  Info,
  Check,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import {
  buildWhatsAppUrl,
  isWhatsAppNumberPlaceholder,
} from "@/config/site";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { cn } from "@/lib/utils";
import type { InterestFormData } from "@/types";

export interface InterestFormLabels {
  title: string;
  subtitle: string;
  projectSectionTitle: string;
  projectSelectLabel: string;
  projectDehir: string;
  projectPabuaran: string;
  projectGeneral: string;
  consultationCategoryTitle: string;
  consultationCategorySubtitle: string;
  catPrice: string;
  catAvailability: string;
  catSurvey: string;
  catBuilding: string;
  catDesign: string;
  catOther: string;
  preferencesTitle: string;
  propertyTypeLabel: string;
  kavlingOnly: string;
  kavlingBuilding: string;
  propertyUndecided: string;
  kavlingCodeLabel: string;
  kavlingCodePlaceholder: string;
  kavlingCodeNote: string;
  buildingTypeLabel: string;
  type1Lantai: string;
  type1LantaiPromo: string;
  undecided: string;
  clientDetailsTitle: string;
  name: string;
  namePlaceholder: string;
  notes: string;
  notesPlaceholder: string;
  submitViaWhatsApp: string;
  directWhatsApp: string;
  clientNotice: string;
  waDisabled: string;
}

export interface InterestFormProps {
  locale: string;
  labels: InterestFormLabels;
  availableUnitCodes?: string[];
}

interface InterestFormContentProps extends InterestFormProps {
  paramProject: string;
  paramUnit: string;
}

const DEFAULT_KAVLING_CODES = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "B5"];

interface CategoryOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

/**
 * Komponen form utama yang di-key ulang secara otomatis saat query parameters berubah.
 */
function InterestFormContent({
  locale,
  labels,
  availableUnitCodes = DEFAULT_KAVLING_CODES,
  paramProject,
  paramUnit,
}: InterestFormContentProps) {
  // Menentukan default projectId dari query URL jika ada
  const initialProjectId =
    paramProject === "dehir"
      ? "dehir"
      : paramProject === "pabuaran"
      ? "pabuaran"
      : paramProject
      ? "general"
      : "dehir";

  const initialUnit = availableUnitCodes.includes(paramUnit) ? paramUnit : "";

  const [formData, setFormData] = useState<InterestFormData>({
    projectId: initialProjectId,
    consultationCategories: ["price"],
    propertyType: "kavling-only",
    kavlingCode: initialUnit,
    buildingType: "undecided",
    name: "",
    notes: "",
  });

  const isWaPlaceholder = isWhatsAppNumberPlaceholder();
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  const consultationCategories: CategoryOption[] = [
    { id: "price", label: labels.catPrice, icon: CircleDollarSign },
    { id: "availability", label: labels.catAvailability, icon: ClipboardCheck },
    { id: "survey", label: labels.catSurvey, icon: Car },
    { id: "building", label: labels.catBuilding, icon: Home },
    { id: "design", label: labels.catDesign, icon: Ruler },
    { id: "other", label: labels.catOther, icon: HelpCircle },
  ];

  const toggleCategory = (id: string) => {
    setFormData((prev) => {
      const current = prev.consultationCategories || [];
      const exists = current.includes(id);
      const updated = exists
        ? current.filter((item) => item !== id)
        : [...current, id];
      return {
        ...prev,
        consultationCategories: updated.length > 0 ? updated : [id],
      };
    });
  };

  const compileWhatsAppMessage = (): string => {
    let projectText = labels.projectGeneral;
    if (formData.projectId === "dehir") {
      projectText = labels.projectDehir;
    } else if (formData.projectId === "pabuaran") {
      projectText = labels.projectPabuaran;
    }

    const selectedCategoriesText = (formData.consultationCategories || [])
      .map((catId) => {
        const found = consultationCategories.find((c) => c.id === catId);
        return found ? found.label : catId;
      })
      .join(", ") || "Konsultasi Umum";

    let propTypeText = labels.propertyUndecided;
    if (formData.propertyType === "kavling-only") {
      propTypeText = labels.kavlingOnly;
    } else if (formData.propertyType === "kavling-building") {
      propTypeText = labels.kavlingBuilding;
    }

    let buildingText = "-";
    if (formData.propertyType === "kavling-building") {
      if (formData.buildingType === "type-1") {
        buildingText = "Type 1 Lantai (LB 46 m², 3KT)";
      } else if (formData.buildingType === "type-1-promo") {
        buildingText = "Type 1 Lantai Promo (LB 30 m², 2KT)";
      } else {
        buildingText = labels.undecided;
      }
    }

    const kavlingText =
      formData.projectId === "dehir" && formData.kavlingCode
        ? `${formData.kavlingCode} (Preferensi Awal)`
        : "-";

    // Sanitasi & batasi panjang teks untuk mencegah URL overflow pada WhatsApp handoff
    const nameText = formData.name?.trim() ? formData.name.trim().slice(0, 100) : "-";
    const notesText = formData.notes?.trim() ? formData.notes.trim().slice(0, 1000) : "-";

    return (
      `Halo Tim Marketing Celestia (PT Mitra Rahim Indonesia),\n\n` +
      `Saya ingin menyampaikan minat dan pertanyaan konsultasi properti:\n\n` +
      `• Proyek: ${projectText}\n` +
      `• Topik Konsultasi: ${selectedCategoriesText}\n` +
      `• Minat Jenis: ${propTypeText}\n` +
      `• Referensi Kavling: ${kavlingText}\n` +
      `• Tipe Bangunan: ${buildingText}\n` +
      `• Nama: ${nameText}\n` +
      `• Catatan / Pertanyaan: ${notesText}\n\n` +
      `Mohon informasi lebih lanjut. Terima kasih.`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWaPlaceholder) return;
    const message = compileWhatsAppMessage();
    const url = buildWhatsAppUrl(message);
    setSubmittedUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in-up">
      {/* 1. Pilihan Proyek Properti */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 block">
            {labels.projectSectionTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Tentukan proyek yang ingin Anda tanyakan atau pilih konsultasi umum.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Celestia Dehir */}
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, projectId: "dehir" }))}
            className={cn(
              "flex flex-col text-left rounded-xl p-4 border-2 transition-all min-h-[44px] cursor-pointer",
              formData.projectId === "dehir"
                ? "border-primary-700 bg-primary-50/50 shadow-xs ring-1 ring-primary-700"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            )}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="rounded-lg bg-emerald-100/80 p-2 text-emerald-800">
                <Building2 className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                Proyek Aktif
              </span>
            </div>
            <span className="font-bold text-neutral-900 text-sm mt-1">
              {labels.projectDehir}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1">
              Jatiluhur, Jawa Barat • Kavling & Rumah Siap Huni
            </span>
          </button>

          {/* Celestia Jatiranggon / Pabuaran */}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                projectId: "pabuaran",
                kavlingCode: "",
              }))
            }
            className={cn(
              "flex flex-col text-left rounded-xl p-4 border-2 transition-all min-h-[44px] cursor-pointer",
              formData.projectId === "pabuaran"
                ? "border-primary-700 bg-primary-50/50 shadow-xs ring-1 ring-primary-700"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            )}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="rounded-lg bg-neutral-100 p-2 text-neutral-600">
                <Clock className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              </div>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-700">
                Coming Soon
              </span>
            </div>
            <span className="font-bold text-neutral-900 text-sm mt-1">
              {labels.projectPabuaran}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1">
              Jatiranggon • Tahap Persiapan Kawasan
            </span>
          </button>

          {/* Konsultasi Umum */}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                projectId: "general",
                kavlingCode: "",
              }))
            }
            className={cn(
              "flex flex-col text-left rounded-xl p-4 border-2 transition-all min-h-[44px] cursor-pointer",
              formData.projectId === "general"
                ? "border-primary-700 bg-primary-50/50 shadow-xs ring-1 ring-primary-700"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            )}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="rounded-lg bg-primary-100/80 p-2 text-primary-800">
                <Sparkles className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              </div>
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-800">
                Fleksibel
              </span>
            </div>
            <span className="font-bold text-neutral-900 text-sm mt-1">
              {labels.projectGeneral}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1">
              Diskusi umum mengenai lokasi, anggaran, atau rencana pengembangan
            </span>
          </button>
        </div>
      </section>

      {/* 2. Topik Kebutuhan Konsultasi (Multi-Select Pills) */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 block">
            {labels.consultationCategoryTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {labels.consultationCategorySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {consultationCategories.map((cat) => {
            const isSelected = (formData.consultationCategories || []).includes(cat.id);
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs font-medium transition-all min-h-[44px] cursor-pointer",
                  isSelected
                    ? "border-primary-600 bg-primary-50 text-primary-900 font-semibold shadow-xs ring-1 ring-primary-500"
                    : "border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100/70"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    isSelected
                      ? "border-primary-300 bg-primary-100/80 text-primary-800"
                      : "border-neutral-200 bg-white text-neutral-600"
                  )}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4 stroke-[1.75]" />
                </span>
                <span className="flex-1">{cat.label}</span>
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                    isSelected
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-neutral-300 bg-white"
                  )}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" aria-hidden="true" />}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Preferensi Properti (Opsional) */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-neutral-900 block">
            {labels.preferencesTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Bantu kami memahami preferensi fisik yang mungkin Anda pertimbangkan (opsional).
          </p>
        </div>

        {/* Minat Jenis Properti */}
        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-2">
            {labels.propertyTypeLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, propertyType: "kavling-only" }))}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border p-3 text-left text-xs transition-all cursor-pointer min-h-[44px]",
                formData.propertyType === "kavling-only"
                  ? "border-primary-600 bg-primary-50 text-primary-900 font-bold ring-1 ring-primary-500"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
              )}
            >
              <Map className="w-4 h-4 shrink-0 text-primary-700 stroke-[2]" aria-hidden="true" />
              <span>{labels.kavlingOnly}</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, propertyType: "kavling-building" }))}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border p-3 text-left text-xs transition-all cursor-pointer min-h-[44px]",
                formData.propertyType === "kavling-building"
                  ? "border-primary-600 bg-primary-50 text-primary-900 font-bold ring-1 ring-primary-500"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
              )}
            >
              <Home className="w-4 h-4 shrink-0 text-primary-700 stroke-[2]" aria-hidden="true" />
              <span>{labels.kavlingBuilding}</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, propertyType: "undecided" }))}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border p-3 text-left text-xs transition-all cursor-pointer min-h-[44px]",
                formData.propertyType === "undecided"
                  ? "border-primary-600 bg-primary-50 text-primary-900 font-bold ring-1 ring-primary-500"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
              )}
            >
              <HelpCircle className="w-4 h-4 shrink-0 text-primary-700 stroke-[2]" aria-hidden="true" />
              <span>{labels.propertyUndecided}</span>
            </button>
          </div>
        </div>

        {/* Pilihan Kode Kavling (Hanya relevan jika Dehir dipilih atau konsultasi umum) */}
        {formData.projectId === "dehir" ? (
          <div>
            <label htmlFor="kavlingCode" className="text-xs font-semibold text-neutral-700 block mb-1">
              {labels.kavlingCodeLabel}
            </label>
            <div className="max-w-xs">
              <select
                id="kavlingCode"
                value={formData.kavlingCode || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, kavlingCode: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]"
              >
                <option value="">{labels.kavlingCodePlaceholder}</option>
                {availableUnitCodes.map((code) => (
                  <option key={code} value={code}>
                    Kavling {code}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 leading-relaxed">
              <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
              <span>{labels.kavlingCodeNote}</span>
            </p>
          </div>
        ) : formData.projectId === "pabuaran" ? (
          <div className="flex items-start gap-2 rounded-lg bg-neutral-50 border border-neutral-200 p-3 text-xs text-neutral-600">
            <Info className="w-4 h-4 shrink-0 text-neutral-500 mt-0.5" aria-hidden="true" />
            <span>
              {locale === "en"
                ? "Plot data for Celestia Jatiranggon (Pabuaran) is currently in the master plan preparation phase and has not been published yet."
                : "Data kavling untuk proyek Celestia Jatiranggon (Pabuaran) sedang dalam tahap persiapan master plan dan belum dipublikasikan."}
            </span>
          </div>
        ) : null}

        {/* Visual Cards Tipe Bangunan jika memilih Kavling + Bangunan */}
        {formData.propertyType === "kavling-building" && (
          <div className="space-y-3 pt-2 border-t border-neutral-200/80 animate-fade-in">
            <label className="text-xs font-semibold text-neutral-700 block">
              {labels.buildingTypeLabel}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Type 1 Lantai */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, buildingType: "type-1" }))}
                className={cn(
                  "flex flex-col text-left rounded-xl border p-4 transition-all cursor-pointer",
                  formData.buildingType === "type-1"
                    ? "border-primary-600 bg-primary-50/50 shadow-xs ring-1 ring-primary-500"
                    : "border-neutral-200 bg-neutral-50/40 hover:border-neutral-300"
                )}
              >
                <span className="font-bold text-xs text-neutral-900">
                  {labels.type1Lantai}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1">
                  {locale === "en"
                    ? "Building Area: 46 m² • 3 Beds, 1 Bath, Carport"
                    : "Luas Bangunan: 46 m² • 3KT, 1KM, Carport"}
                </span>
              </button>

              {/* Type 1 Lantai Promo */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, buildingType: "type-1-promo" }))}
                className={cn(
                  "flex flex-col text-left rounded-xl border p-4 transition-all cursor-pointer",
                  formData.buildingType === "type-1-promo"
                    ? "border-primary-600 bg-primary-50/50 shadow-xs ring-1 ring-primary-500"
                    : "border-neutral-200 bg-neutral-50/40 hover:border-neutral-300"
                )}
              >
                <span className="font-bold text-xs text-neutral-900">
                  {labels.type1LantaiPromo}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1">
                  {locale === "en"
                    ? "Building Area: 30 m² • 2 Beds, 1 Bath, Multifunction Room"
                    : "Luas Bangunan: 30 m² • 2KT, 1KM, Ruang Multifungsi"}
                </span>
              </button>

              {/* Undecided / Custom */}
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, buildingType: "undecided" }))}
                className={cn(
                  "flex flex-col text-left rounded-xl border p-4 transition-all cursor-pointer",
                  formData.buildingType === "undecided"
                    ? "border-primary-600 bg-primary-50/50 shadow-xs ring-1 ring-primary-500"
                    : "border-neutral-200 bg-neutral-50/40 hover:border-neutral-300"
                )}
              >
                <span className="font-bold text-xs text-neutral-900">
                  {labels.undecided}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1">
                  {locale === "en"
                    ? "Architectural layout customization consultation with an architect"
                    : "Konsultasi penyesuaian denah arsitektur dengan arsitek"}
                </span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. Detail Pertanyaan & Catatan Bebas */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 block">
            {labels.clientDetailsTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {locale === "en"
              ? "Share your questions, estimated site visit schedule, or any custom notes."
              : "Sampaikan pertanyaan, estimasi waktu survei lokasi, atau catatan bebas Anda."}
          </p>
        </div>

        <div className="max-w-md">
          <label htmlFor="name" className="text-xs font-semibold text-neutral-700 block mb-1">
            {labels.name}
          </label>
          <input
            type="text"
            id="name"
            maxLength={100}
            value={formData.name || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder={labels.namePlaceholder}
            className="w-full rounded-lg border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]"
          />
        </div>

        <div>
          <label htmlFor="notes" className="text-xs font-semibold text-neutral-700 block mb-1">
            {labels.notes}
          </label>
          <textarea
            id="notes"
            rows={4}
            maxLength={1000}
            value={formData.notes || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder={labels.notesPlaceholder}
            className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </div>
      </section>

      {/* 5. Submit CTA & Direct WhatsApp Button */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 sm:p-7 space-y-4">
        <p className="text-xs text-neutral-500 leading-relaxed">
          {labels.clientNotice}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          {isWaPlaceholder ? (
            <button
              type="button"
              disabled
              title={labels.waDisabled}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-200 px-7 py-3.5 text-sm font-semibold text-neutral-400 cursor-not-allowed min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4 shrink-0 stroke-[2.25]" aria-hidden="true" />
              <span>{labels.submitViaWhatsApp}</span>
            </button>
          ) : (
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-whatsapp-hover transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 shrink-0 stroke-[2.25]" aria-hidden="true" />
              <span>{labels.submitViaWhatsApp}</span>
            </button>
          )}

          <WhatsAppButton
            locale={locale as "id" | "en"}
            context="homepage"
            variant="outline"
            disabledMessage={labels.waDisabled}
            className="w-full sm:w-auto min-h-[44px]"
          >
            {labels.directWhatsApp}
          </WhatsAppButton>
        </div>

        {/* Fallback akses WhatsApp jika popup blocker aktif */}
        {submittedUrl && (
          <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-xs text-primary-950 animate-fade-in space-y-1.5">
            <p className="font-semibold text-primary-900">
              {locale === "en" ? "Opening WhatsApp..." : "Membuka WhatsApp..."}
            </p>
            <p className="text-primary-800 leading-relaxed">
              {locale === "en"
                ? "If WhatsApp did not launch automatically, click the link below to open it directly:"
                : "Jika WhatsApp tidak terbuka secara otomatis, klik tautan di bawah ini untuk membukanya secara manual:"}
            </p>
            <a
              href={submittedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-whatsapp-text underline hover:text-emerald-900 pt-1"
            >
              <span>{locale === "en" ? "Open WhatsApp Manually" : "Buka WhatsApp Secara Manual"}</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2]" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </form>
  );
}

function SuspendedInterestForm(props: InterestFormProps) {
  const searchParams = useSearchParams();
  const paramProject = searchParams.get("project")?.toLowerCase() || "";
  const paramUnit = searchParams.get("unit")?.toUpperCase() || "";
  const paramKey = `${paramProject}-${paramUnit}`;

  return (
    <InterestFormContent
      key={paramKey}
      paramProject={paramProject}
      paramUnit={paramUnit}
      {...props}
    />
  );
}

/**
 * InterestForm dengan boundary Suspense aman untuk Static Site Generation (SSG).
 */
export function InterestForm(props: InterestFormProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
          Memuat formulir minat & konsultasi...
        </div>
      }
    >
      <SuspendedInterestForm {...props} />
    </Suspense>
  );
}
