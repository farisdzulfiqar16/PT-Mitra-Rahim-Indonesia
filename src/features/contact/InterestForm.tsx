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
  AlertCircle,
} from "lucide-react";
import {
  buildWhatsAppUrl,
  isWhatsAppNumberPlaceholder,
} from "@/config/site";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { cn } from "@/lib/utils";
import type { InterestFormData } from "@/types";

// ─── Max topic selections (P0-04) ────────────────────────────────────────────
const MAX_TOPICS = 3;

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
  // P0 additions
  nameRequired: string;
  nameTooLong: string;
  topicLimitReached: string;
  topicRequiredForDehir: string;
  pabuaranLocked: string;
  generalConsultationNote: string;
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
 * Derive initial projectId from query parameters.
 *
 * Rules (P0-01, P0-02):
 * - No param → "general" (never default to "dehir")
 * - param=dehir → "dehir"
 * - param=pabuaran → "general" (Pabuaran is locked; silently reject)
 * - Any other → "general"
 */
function deriveInitialProjectId(paramProject: string): string {
  if (paramProject === "dehir") return "dehir";
  // P0-02: reject pabuaran via URL — fall back to general
  return "general";
}

/**
 * State reset helpers for P0-07.
 */
function resetToDehirDefaults(
  prev: InterestFormData,
  initialUnit: string,
): InterestFormData {
  return {
    ...prev,
    projectId: "dehir",
    // Restore a sensible default topic set, don't carry stale general state
    consultationCategories: ["price"],
    propertyType: "kavling-only",
    kavlingCode: initialUnit,
    buildingType: "undecided",
  };
}

function resetToGeneralDefaults(prev: InterestFormData): InterestFormData {
  return {
    ...prev,
    projectId: "general",
    // P0-03 / P0-07: clear all project-specific fields
    consultationCategories: [],
    propertyType: "undecided",
    kavlingCode: "",
    buildingType: "undecided",
  };
}

/**
 * Compose WhatsApp message according to consultation type.
 * P0-05: separate templates for Dehir, General, and Pabuaran is blocked.
 */
function buildMessage(
  formData: InterestFormData,
  labels: InterestFormLabels,
  consultationCategories: CategoryOption[],
  locale: string,
): string {
  const isEn = locale === "en";
  const nameText = formData.name?.trim().slice(0, 100) || (isEn ? "-" : "-");
  const notesText = formData.notes?.trim().slice(0, 1000) || (isEn ? "-" : "-");

  // ── Dehir template ────────────────────────────────────────────────────────
  if (formData.projectId === "dehir") {
    const topicsText =
      (formData.consultationCategories || [])
        .map((id) => consultationCategories.find((c) => c.id === id)?.label ?? id)
        .join(", ") || (isEn ? "General Inquiry" : "Konsultasi Umum");

    let propTypeText: string;
    if (formData.propertyType === "kavling-only") {
      propTypeText = labels.kavlingOnly;
    } else if (formData.propertyType === "kavling-building") {
      propTypeText = labels.kavlingBuilding;
    } else {
      propTypeText = labels.propertyUndecided;
    }

    let buildingText = "-";
    if (formData.propertyType === "kavling-building") {
      if (formData.buildingType === "type-1") {
        buildingText = isEn
          ? "Type 1 Floor (46 m², 3BR)"
          : "Type 1 Lantai (LB 46 m², 3KT)";
      } else if (formData.buildingType === "type-1-promo") {
        buildingText = isEn
          ? "Type 1 Floor Promo (30 m², 2BR)"
          : "Type 1 Lantai Promo (LB 30 m², 2KT)";
      } else {
        buildingText = labels.undecided;
      }
    }

    const kavlingText = formData.kavlingCode
      ? `${formData.kavlingCode} (${isEn ? "Initial Preference" : "Preferensi Awal"})`
      : "-";

    if (isEn) {
      return (
        `Hello Celestia Marketing Team (PT Mitra Rahim Indonesia),\n\n` +
        `I would like to submit a property consultation inquiry:\n\n` +
        `• Project: ${labels.projectDehir}\n` +
        `• Consultation Topics: ${topicsText}\n` +
        `• Property Interest: ${propTypeText}\n` +
        `• Plot Reference: ${kavlingText}\n` +
        `• Building Type: ${buildingText}\n` +
        `• Name: ${nameText}\n` +
        `• Notes / Questions: ${notesText}\n\n` +
        `Please provide further information. Thank you.`
      );
    }

    return (
      `Halo Tim Marketing Celestia (PT Mitra Rahim Indonesia),\n\n` +
      `Saya ingin menyampaikan minat dan pertanyaan konsultasi properti:\n\n` +
      `• Proyek: ${labels.projectDehir}\n` +
      `• Topik Konsultasi: ${topicsText}\n` +
      `• Minat Jenis: ${propTypeText}\n` +
      `• Referensi Kavling: ${kavlingText}\n` +
      `• Tipe Bangunan: ${buildingText}\n` +
      `• Nama: ${nameText}\n` +
      `• Catatan / Pertanyaan: ${notesText}\n\n` +
      `Mohon informasi lebih lanjut. Terima kasih.`
    );
  }

  // ── General consultation template (P0-05-B) ───────────────────────────────
  // No kavling code, building type, or property preferences
  if (isEn) {
    return (
      `Hello Celestia Marketing Team (PT Mitra Rahim Indonesia),\n\n` +
      `I would like to have a general property consultation:\n\n` +
      `• Consultation Type: General Consultation\n` +
      `• Name: ${nameText}\n` +
      `• Questions / Notes: ${notesText}\n\n` +
      `Please provide further information. Thank you.`
    );
  }

  return (
    `Halo Tim Marketing Celestia (PT Mitra Rahim Indonesia),\n\n` +
    `Saya ingin melakukan konsultasi properti secara umum:\n\n` +
    `• Jenis Konsultasi: Konsultasi Umum\n` +
    `• Nama: ${nameText}\n` +
    `• Pertanyaan / Catatan: ${notesText}\n\n` +
    `Mohon informasi lebih lanjut. Terima kasih.`
  );
}

/**
 * Core form component.
 * Re-keyed from parent when query params change so state resets cleanly.
 */
function InterestFormContent({
  locale,
  labels,
  availableUnitCodes = DEFAULT_KAVLING_CODES,
  paramProject,
  paramUnit,
}: InterestFormContentProps) {
  const initialProjectId = deriveInitialProjectId(paramProject);
  const initialUnit =
    initialProjectId === "dehir" && availableUnitCodes.includes(paramUnit)
      ? paramUnit
      : "";

  const [formData, setFormData] = useState<InterestFormData>({
    projectId: initialProjectId,
    // P0-01: no default category when starting as general
    consultationCategories: initialProjectId === "dehir" ? ["price"] : [],
    propertyType: "kavling-only",
    kavlingCode: initialUnit,
    buildingType: "undecided",
    name: "",
    notes: "",
  });

  // Validation error state (P0-06)
  const [errors, setErrors] = useState<{
    name?: string;
    topics?: string;
  }>({});

  // Toast/inline feedback for topic limit (P0-04)
  const [topicLimitHit, setTopicLimitHit] = useState(false);

  const isWaPlaceholder = isWhatsAppNumberPlaceholder();
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const isEn = locale === "en";

  const consultationCategories: CategoryOption[] = [
    { id: "price", label: labels.catPrice, icon: CircleDollarSign },
    { id: "availability", label: labels.catAvailability, icon: ClipboardCheck },
    { id: "survey", label: labels.catSurvey, icon: Car },
    { id: "building", label: labels.catBuilding, icon: Home },
    { id: "design", label: labels.catDesign, icon: Ruler },
    { id: "other", label: labels.catOther, icon: HelpCircle },
  ];

  // ── P0-04: Toggle category with hard max-3 guard ─────────────────────────
  const toggleCategory = (id: string) => {
    setTopicLimitHit(false);
    setErrors((prev) => ({ ...prev, topics: undefined }));

    setFormData((prev) => {
      const current = prev.consultationCategories ?? [];
      const exists = current.includes(id);

      if (exists) {
        // Always allow deselect — but never drop to empty (we guard at submit)
        return { ...prev, consultationCategories: current.filter((item) => item !== id) };
      }

      // Reject if already at limit
      if (current.length >= MAX_TOPICS) {
        setTopicLimitHit(true);
        return prev; // no change
      }

      return { ...prev, consultationCategories: [...current, id] };
    });
  };

  // ── P0-07: Project switch handlers ───────────────────────────────────────
  const selectDehir = () => {
    setErrors({});
    setTopicLimitHit(false);
    setFormData((prev) => resetToDehirDefaults(prev, initialUnit));
  };

  const selectGeneral = () => {
    setErrors({});
    setTopicLimitHit(false);
    setFormData((prev) => resetToGeneralDefaults(prev));
  };

  // ── P0-06: Validate before submit ────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: { name?: string; topics?: string } = {};

    const trimmedName = formData.name?.trim() ?? "";
    if (!trimmedName) {
      newErrors.name = labels.nameRequired;
    } else if (trimmedName.length > 100) {
      newErrors.name = labels.nameTooLong;
    }

    if (formData.projectId === "dehir" && (formData.consultationCategories ?? []).length === 0) {
      newErrors.topics = labels.topicRequiredForDehir;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWaPlaceholder) return;
    if (!validate()) return;

    const message = buildMessage(formData, labels, consultationCategories, locale);
    const url = buildWhatsAppUrl(message);
    setSubmittedUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const isDehir = formData.projectId === "dehir";
  const isGeneral = formData.projectId === "general";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8 animate-fade-in-up">
      {/* ── 1. Pilihan Proyek Properti ─────────────────────────────────────── */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs shadow-[0_2px_8px_-1px_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.95)] space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 block">
            {labels.projectSectionTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isEn
              ? "Choose the project you want to inquire about, or select general consultation."
              : "Tentukan proyek yang ingin Anda tanyakan atau pilih konsultasi umum."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Celestia Dehir — Active */}
          <button
            type="button"
            onClick={selectDehir}
            aria-pressed={isDehir}
            className={cn(
              "flex flex-col text-left rounded-xl p-4 border-2 transition-all min-h-[44px] cursor-pointer",
              isDehir
                ? "border-primary-700 bg-primary-50/70 shadow-xs ring-2 ring-primary-700/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]"
                : "border-neutral-200/90 bg-white hover:border-primary-300 hover:shadow-2xs"
            )}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="rounded-lg bg-emerald-100/80 p-2 text-emerald-800">
                <Building2 className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                {isEn ? "Active Project" : "Proyek Aktif"}
              </span>
            </div>
            <span className="font-bold text-neutral-900 text-sm mt-1">
              {labels.projectDehir}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1">
              {isEn
                ? "Jatiluhur, West Java • Plots & Houses"
                : "Jatiluhur, Jawa Barat • Kavling & Rumah Siap Huni"}
            </span>
          </button>

          {/* Celestia Jatiranggon / Pabuaran — LOCKED (P0-02) */}
          <div
            aria-disabled="true"
            title={labels.pabuaranLocked}
            className={cn(
              "flex flex-col text-left rounded-xl p-4 border-2 transition-all min-h-[44px]",
              "border-neutral-200 bg-neutral-50/80 opacity-60 cursor-not-allowed select-none"
            )}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="rounded-lg bg-neutral-100 p-2 text-neutral-500">
                <Clock className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              </div>
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                Coming Soon
              </span>
            </div>
            <span className="font-bold text-neutral-500 text-sm mt-1">
              {labels.projectPabuaran}
            </span>
            <span className="text-[11px] text-neutral-400 mt-1">
              {isEn ? "Master Plan Preparation — Not Yet Open" : "Persiapan Master Plan — Belum Dibuka"}
            </span>
          </div>

          {/* Konsultasi Umum */}
          <button
            type="button"
            onClick={selectGeneral}
            aria-pressed={isGeneral}
            className={cn(
              "flex flex-col text-left rounded-xl p-4 border-2 transition-all min-h-[44px] cursor-pointer",
              isGeneral
                ? "border-primary-700 bg-primary-50/70 shadow-xs ring-2 ring-primary-700/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]"
                : "border-neutral-200/90 bg-white hover:border-primary-300 hover:shadow-2xs"
            )}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <div className="rounded-lg bg-primary-100/80 p-2 text-primary-800">
                <Sparkles className="w-5 h-5 stroke-[2]" aria-hidden="true" />
              </div>
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-800">
                {isEn ? "Flexible" : "Fleksibel"}
              </span>
            </div>
            <span className="font-bold text-neutral-900 text-sm mt-1">
              {labels.projectGeneral}
            </span>
            <span className="text-[11px] text-neutral-500 mt-1">
              {isEn
                ? "General discussion on location, budget, or development plans"
                : "Diskusi umum mengenai lokasi, anggaran, atau rencana pengembangan"}
            </span>
          </button>
        </div>

        {/* P0-02: Pabuaran locked notice when user arrives with ?project=pabuaran */}
        {paramProject === "pabuaran" && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
            <span>{labels.pabuaranLocked}</span>
          </div>
        )}
      </section>

      {/* ── 2. Topik Konsultasi (hanya untuk Dehir) — P0-03 ─────────────────── */}
      {isDehir && (
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs shadow-[0_2px_8px_-1px_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.95)] space-y-4">
          <div>
            <h2 className="text-base font-bold text-neutral-900 block">
              {labels.consultationCategoryTitle}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isEn
                ? `${labels.consultationCategorySubtitle} (max. ${MAX_TOPICS})`
                : `${labels.consultationCategorySubtitle} (maks. ${MAX_TOPICS} topik)`}
            </p>
          </div>

          {/* P0-04: Topic limit feedback */}
          {topicLimitHit && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
              <span>{labels.topicLimitReached}</span>
            </div>
          )}

          {errors.topics && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
              <span>{errors.topics}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {consultationCategories.map((cat) => {
              const isSelected = (formData.consultationCategories ?? []).includes(cat.id);
              const currentCount = (formData.consultationCategories ?? []).length;
              // P0-04: visually indicate disabled state when at limit and not selected
              const isAtLimit = !isSelected && currentCount >= MAX_TOPICS;
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  aria-pressed={isSelected}
                  aria-disabled={isAtLimit}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border p-3 text-left text-xs font-medium transition-all duration-200 min-h-[44px]",
                    isSelected
                      ? "border-primary-600 bg-primary-50/80 text-primary-900 font-semibold shadow-xs ring-1 ring-primary-500/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] cursor-pointer"
                      : isAtLimit
                      ? "border-neutral-200/80 bg-neutral-50/40 text-neutral-400 cursor-not-allowed opacity-60"
                      : "border-neutral-200/90 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50/80 shadow-2xs cursor-pointer"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
                      isSelected
                        ? "border-primary-300 bg-primary-100/90 text-primary-800"
                        : "border-neutral-200 bg-neutral-50 text-neutral-500"
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
                    aria-hidden="true"
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 3. Preferensi Properti (hanya untuk Dehir) — P0-03 ──────────────── */}
      {isDehir && (
        <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs shadow-[0_2px_8px_-1px_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.95)] space-y-6">
          <div>
            <h2 className="text-base font-bold text-neutral-900 block">
              {labels.preferencesTitle}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {isEn
                ? "Help us understand the physical preferences you may be considering (optional)."
                : "Bantu kami memahami preferensi fisik yang mungkin Anda pertimbangkan (opsional)."}
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
                aria-pressed={formData.propertyType === "kavling-only"}
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
                aria-pressed={formData.propertyType === "kavling-building"}
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
                aria-pressed={formData.propertyType === "undecided"}
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

          {/* Kode Kavling — only for Dehir */}
          <div>
            <label htmlFor="kavlingCode" className="text-xs font-semibold text-neutral-700 block mb-1">
              {labels.kavlingCodeLabel}
            </label>
            <div className="max-w-xs">
              <select
                id="kavlingCode"
                value={formData.kavlingCode ?? ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, kavlingCode: e.target.value }))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]"
              >
                <option value="">{labels.kavlingCodePlaceholder}</option>
                {availableUnitCodes.map((code) => (
                  <option key={code} value={code}>
                    {isEn ? `Plot ${code}` : `Kavling ${code}`}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 leading-relaxed">
              <Info className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" aria-hidden="true" />
              <span>{labels.kavlingCodeNote}</span>
            </p>
          </div>

          {/* Tipe Bangunan — only when kavling-building selected */}
          {formData.propertyType === "kavling-building" && (
            <div className="space-y-3 pt-2 border-t border-neutral-200/80 animate-fade-in">
              <label className="text-xs font-semibold text-neutral-700 block">
                {labels.buildingTypeLabel}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, buildingType: "type-1" }))}
                  aria-pressed={formData.buildingType === "type-1"}
                  className={cn(
                    "flex flex-col text-left rounded-xl border p-4 transition-all cursor-pointer",
                    formData.buildingType === "type-1"
                      ? "border-primary-600 bg-primary-50/50 shadow-xs ring-1 ring-primary-500"
                      : "border-neutral-200 bg-neutral-50/40 hover:border-neutral-300"
                  )}
                >
                  <span className="font-bold text-xs text-neutral-900">{labels.type1Lantai}</span>
                  <span className="text-[11px] text-neutral-500 mt-1">
                    {isEn ? "Building Area: 46 m² • 3 Beds, 1 Bath, Carport" : "Luas Bangunan: 46 m² • 3KT, 1KM, Carport"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, buildingType: "type-1-promo" }))}
                  aria-pressed={formData.buildingType === "type-1-promo"}
                  className={cn(
                    "flex flex-col text-left rounded-xl border p-4 transition-all cursor-pointer",
                    formData.buildingType === "type-1-promo"
                      ? "border-primary-600 bg-primary-50/50 shadow-xs ring-1 ring-primary-500"
                      : "border-neutral-200 bg-neutral-50/40 hover:border-neutral-300"
                  )}
                >
                  <span className="font-bold text-xs text-neutral-900">{labels.type1LantaiPromo}</span>
                  <span className="text-[11px] text-neutral-500 mt-1">
                    {isEn ? "Building Area: 30 m² • 2 Beds, 1 Bath, Multifunction Room" : "Luas Bangunan: 30 m² • 2KT, 1KM, Ruang Multifungsi"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, buildingType: "undecided" }))}
                  aria-pressed={formData.buildingType === "undecided"}
                  className={cn(
                    "flex flex-col text-left rounded-xl border p-4 transition-all cursor-pointer",
                    formData.buildingType === "undecided"
                      ? "border-primary-600 bg-primary-50/50 shadow-xs ring-1 ring-primary-500"
                      : "border-neutral-200 bg-neutral-50/40 hover:border-neutral-300"
                  )}
                >
                  <span className="font-bold text-xs text-neutral-900">{labels.undecided}</span>
                  <span className="text-[11px] text-neutral-500 mt-1">
                    {isEn ? "Architectural layout customization consultation" : "Konsultasi penyesuaian denah arsitektur dengan arsitek"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── P0-03: General consultation notice (no property prefs shown) ─── */}
      {isGeneral && (
        <section className="rounded-2xl border border-neutral-200 bg-primary-50/40 p-6 sm:p-7 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary-100/80 p-2 text-primary-800 shrink-0">
              <Sparkles className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {isEn ? "General Consultation" : "Konsultasi Umum"}
              </p>
              <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                {labels.generalConsultationNote}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Detail & Identitas (P0-06) ───────────────────────────────────── */}
      <section className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-xs shadow-[0_2px_8px_-1px_rgba(28,41,34,0.04),inset_0_1px_0_0_rgba(255,255,255,0.95)] space-y-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 block">
            {labels.clientDetailsTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {isEn
              ? "Share your questions, estimated site visit schedule, or any custom notes."
              : "Sampaikan pertanyaan, estimasi waktu survei lokasi, atau catatan bebas Anda."}
          </p>
        </div>

        {/* Name — required (P0-06) */}
        <div className="max-w-md">
          <label htmlFor="name" className="text-xs font-semibold text-neutral-700 block mb-1">
            {labels.name} <span className="text-red-600 ml-0.5" aria-label={isEn ? "required" : "wajib diisi"}>*</span>
          </label>
          <input
            type="text"
            id="name"
            required
            maxLength={100}
            value={formData.name ?? ""}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder={labels.namePlaceholder}
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            className={cn(
              "w-full rounded-lg border px-3.5 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]",
              errors.name ? "border-red-400 bg-red-50/40" : "border-neutral-300"
            )}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-700">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Notes — optional, max 1000 */}
        <div>
          <label htmlFor="notes" className="text-xs font-semibold text-neutral-700 block mb-1">
            {labels.notes}
          </label>
          <textarea
            id="notes"
            rows={4}
            maxLength={1000}
            value={formData.notes ?? ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder={labels.notesPlaceholder}
            className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
          <p className="mt-1 text-[11px] text-neutral-400 text-right">
            {(formData.notes ?? "").length}/1000
          </p>
        </div>
      </section>

      {/* ── 5. Submit CTA ────────────────────────────────────────────────────── */}
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

        {/* Fallback link if popup blocked */}
        {submittedUrl && (
          <div className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-xs text-primary-950 animate-fade-in space-y-1.5">
            <p className="font-semibold text-primary-900">
              {isEn ? "Opening WhatsApp..." : "Membuka WhatsApp..."}
            </p>
            <p className="text-primary-800 leading-relaxed">
              {isEn
                ? "If WhatsApp did not launch automatically, click the link below:"
                : "Jika WhatsApp tidak terbuka secara otomatis, klik tautan di bawah ini:"}
            </p>
            <a
              href={submittedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-whatsapp-text underline hover:text-emerald-900 pt-1"
            >
              <span>{isEn ? "Open WhatsApp Manually" : "Buka WhatsApp Secara Manual"}</span>
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
  const paramProject = searchParams.get("project")?.toLowerCase() ?? "";
  const paramUnit = searchParams.get("unit")?.toUpperCase() ?? "";
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
 * InterestForm — boundary Suspense aman untuk SSG/Static Export.
 */
export function InterestForm(props: InterestFormProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
          {props.locale === "en" ? "Loading consultation form..." : "Memuat formulir minat & konsultasi..."}
        </div>
      }
    >
      <SuspendedInterestForm {...props} />
    </Suspense>
  );
}
