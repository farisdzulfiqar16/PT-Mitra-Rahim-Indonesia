"use client";

import { useState } from "react";
import {
  buildWhatsAppUrl,
  isWhatsAppNumberPlaceholder,
} from "@/config/site";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { cn } from "@/lib/utils";
import type { InterestFormData } from "@/types";

export interface InterestFormLabels {
  title: string;
  propertyTypeRequired: string;
  kavlingOnly: string;
  kavlingBuilding: string;
  kavlingCode: string;
  kavlingCodeNote: string;
  buildingType: string;
  type1Lantai: string;
  type1LantaiPromo: string;
  undecided: string;
  additionalQuestions: string;
  name: string;
  usagePurpose: string;
  usageResidential: string;
  usageOffice: string;
  usageOther: string;
  modificationRequest: string;
  notes: string;
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

const DEFAULT_KAVLING_CODES = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "B5"];

/**
 * InterestForm — Formulir Minat Calon Pembeli Celestia Dehir.
 *
 * Memenuhi spesifikasi Task 16:
 * - Pilihan utama wajib: Kavling saja vs Kavling + Bangunan.
 * - Kode kavling opsional (A1–A4, B1–B5) dengan disclaimer preferensi bukan reservasi.
 * - 3 visual card tipe bangunan (Type 1 Lantai LB 46, Promo LB 30, Konsultasi/Belum Menentukan).
 * - Pertanyaan opsional (nama, tujuan penggunaan, modifikasi desain, catatan).
 * - Tombol kirim menyusun pesan WhatsApp dengan format terstruktur.
 * - Tanpa penyimpanan database/backend (aman, client-side only).
 */
export function InterestForm({
  locale,
  labels,
  availableUnitCodes = DEFAULT_KAVLING_CODES,
}: InterestFormProps) {
  const [formData, setFormData] = useState<InterestFormData>({
    propertyType: "kavling-only",
    kavlingCode: "",
    buildingType: "undecided",
    name: "",
    usagePurpose: "residential",
    modificationRequest: "",
    notes: "",
  });

  const isWaPlaceholder = isWhatsAppNumberPlaceholder();

  const handlePropertyTypeChange = (type: "kavling-only" | "kavling-building") => {
    setFormData((prev) => ({
      ...prev,
      propertyType: type,
    }));
  };

  const handleBuildingTypeChange = (type: "type-1" | "type-1-promo" | "undecided") => {
    setFormData((prev) => ({
      ...prev,
      buildingType: type,
    }));
  };

  const compileWhatsAppMessage = (): string => {
    const propTypeLabel =
      formData.propertyType === "kavling-only"
        ? labels.kavlingOnly
        : labels.kavlingBuilding;

    let buildingLabel = "-";
    if (formData.propertyType === "kavling-building") {
      if (formData.buildingType === "type-1") {
        buildingLabel = "Type 1 Lantai (LB 46 m², 3KT)";
      } else if (formData.buildingType === "type-1-promo") {
        buildingLabel = "Type 1 Lantai Promo (LB 30 m², 2KT)";
      } else {
        buildingLabel = labels.undecided;
      }
    }

    let usageLabel = "-";
    if (formData.usagePurpose === "residential") usageLabel = labels.usageResidential;
    else if (formData.usagePurpose === "office") usageLabel = labels.usageOffice;
    else if (formData.usagePurpose === "other") usageLabel = labels.usageOther;

    const kavling = formData.kavlingCode ? `${formData.kavlingCode} (Preferensi Awal)` : "-";
    const name = formData.name?.trim() ? formData.name.trim() : "-";
    const modif = formData.modificationRequest?.trim() ? formData.modificationRequest.trim() : "-";
    const notes = formData.notes?.trim() ? formData.notes.trim() : "-";

    return (
      `Halo Tim Marketing Celestia (PT Mitra Rahim Indonesia),\n\n` +
      `Saya ingin menyampaikan preferensi minat properti untuk proyek Celestia Dehir (Jatiluhur):\n\n` +
      `• Nama: ${name}\n` +
      `• Jenis Pilihan: ${propTypeLabel}\n` +
      `• Preferensi Kavling: ${kavling}\n` +
      `• Tipe Bangunan: ${buildingLabel}\n` +
      `• Tujuan Penggunaan: ${usageLabel}\n` +
      `• Kebutuhan Modifikasi: ${modif}\n` +
      `• Catatan Khusus: ${notes}\n\n` +
      `Mohon informasi lebih lanjut mengenai ketersediaan dan tahap konsultasi berikutnya. Terima kasih.`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWaPlaceholder) return;
    const message = compileWhatsAppMessage();
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Pilihan Utama Wajib */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-4">
          <label className="text-base font-bold text-neutral-900 block">
            {labels.propertyTypeRequired}
          </label>
          <p className="text-xs text-neutral-500 mt-0.5">
            Tentukan apakah Anda berminat membeli kavling tanah saja atau beserta rencana pembangunan rumah.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Opsi Kavling Saja */}
          <button
            type="button"
            onClick={() => handlePropertyTypeChange("kavling-only")}
            className={cn(
              "flex flex-col text-left rounded-xl p-5 border-2 transition-all min-h-[44px] cursor-pointer",
              formData.propertyType === "kavling-only"
                ? "border-primary-700 bg-primary-50/50 shadow-xs ring-1 ring-primary-700"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            )}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-2xl" aria-hidden="true">🌱</span>
              <span
                className={cn(
                  "h-4 w-4 rounded-full border flex items-center justify-center",
                  formData.propertyType === "kavling-only"
                    ? "border-primary-700 bg-primary-700"
                    : "border-neutral-300"
                )}
              >
                {formData.propertyType === "kavling-only" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <span className="font-bold text-neutral-900 text-base">
              {labels.kavlingOnly}
            </span>
            <span className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Kavling siap bangun di kawasan Dehir dengan kepemilikan tanah mandiri.
            </span>
          </button>

          {/* Opsi Kavling + Bangunan */}
          <button
            type="button"
            onClick={() => handlePropertyTypeChange("kavling-building")}
            className={cn(
              "flex flex-col text-left rounded-xl p-5 border-2 transition-all min-h-[44px] cursor-pointer",
              formData.propertyType === "kavling-building"
                ? "border-primary-700 bg-primary-50/50 shadow-xs ring-1 ring-primary-700"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            )}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-2xl" aria-hidden="true">🏡</span>
              <span
                className={cn(
                  "h-4 w-4 rounded-full border flex items-center justify-center",
                  formData.propertyType === "kavling-building"
                    ? "border-primary-700 bg-primary-700"
                    : "border-neutral-300"
                )}
              >
                {formData.propertyType === "kavling-building" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>
            <span className="font-bold text-neutral-900 text-base">
              {labels.kavlingBuilding}
            </span>
            <span className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Paket kavling tanah terintegrasi dengan rencana pembangunan rumah sesuai tipe pilihan.
            </span>
          </button>
        </div>
      </section>

      {/* 2. Visual Cards Tipe Bangunan (Kondisional jika Kavling+Bangunan) */}
      {formData.propertyType === "kavling-building" && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs animate-fade-in">
          <div className="mb-4">
            <label className="text-base font-bold text-neutral-900 block">
              {labels.buildingType}
            </label>
            <p className="text-xs text-neutral-500 mt-0.5">
              Pilih tipe desain rumah yang paling sesuai dengan kebutuhan ruang keluarga Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card Tipe 1 Lantai Standar */}
            <button
              type="button"
              onClick={() => handleBuildingTypeChange("type-1")}
              className={cn(
                "flex flex-col text-left rounded-xl border-2 p-5 transition-all text-neutral-900 cursor-pointer",
                formData.buildingType === "type-1"
                  ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                  : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300"
              )}
            >
              <div className="flex h-24 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400 mb-3 border border-neutral-200 text-xs font-medium">
                📐 Denah Type 1 (LB 46)
              </div>
              <div className="font-bold text-sm text-neutral-900">
                {labels.type1Lantai}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Luas Bangunan: <strong>46 m²</strong>
              </p>
              <ul className="mt-3 text-[11px] text-neutral-600 space-y-1">
                <li>• 3 Kamar Tidur</li>
                <li>• 1 Kamar Mandi</li>
                <li>• Ruang Tamu & Dapur</li>
                <li>• Carport Mobil</li>
              </ul>
            </button>

            {/* Card Tipe 1 Lantai Promo */}
            <button
              type="button"
              onClick={() => handleBuildingTypeChange("type-1-promo")}
              className={cn(
                "flex flex-col text-left rounded-xl border-2 p-5 transition-all text-neutral-900 cursor-pointer",
                formData.buildingType === "type-1-promo"
                  ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                  : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300"
              )}
            >
              <div className="flex h-24 items-center justify-center rounded-lg bg-emerald-50/80 text-primary-700 mb-3 border border-emerald-200 text-xs font-medium">
                🏷️ Promo Type 1 (LB 30)
              </div>
              <div className="font-bold text-sm text-neutral-900">
                {labels.type1LantaiPromo}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Luas Bangunan: <strong>30 m²</strong>
              </p>
              <ul className="mt-3 text-[11px] text-neutral-600 space-y-1">
                <li>• 2 Kamar Tidur</li>
                <li>• 1 Kamar Mandi</li>
                <li>• Ruang Multifungsi</li>
                <li>• Carport Mobil</li>
              </ul>
            </button>

            {/* Card Konsultasi / Belum Menentukan */}
            <button
              type="button"
              onClick={() => handleBuildingTypeChange("undecided")}
              className={cn(
                "flex flex-col text-left rounded-xl border-2 p-5 transition-all text-neutral-900 cursor-pointer",
                formData.buildingType === "undecided"
                  ? "border-primary-700 bg-primary-50/40 shadow-xs ring-1 ring-primary-700"
                  : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300"
              )}
            >
              <div className="flex h-24 items-center justify-center rounded-lg bg-amber-50/80 text-amber-800 mb-3 border border-amber-200 text-xs font-medium">
                💬 Konsultasi Arsitek
              </div>
              <div className="font-bold text-sm text-neutral-900">
                {labels.undecided}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Fleksibel & Kustom
              </p>
              <p className="mt-3 text-[11px] text-neutral-600 leading-relaxed">
                Ingin mendiskusikan denah ruangan khusus, kebutuhan bertahap, atau luas bangunan alternatif bersama tim kami.
              </p>
            </button>
          </div>
        </section>
      )}

      {/* 3. Pilihan Kode Kavling Opsional */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="mb-3">
          <label htmlFor="kavlingCode" className="text-base font-bold text-neutral-900 block">
            {labels.kavlingCode}
          </label>
          <p className="text-xs text-neutral-500 mt-0.5">
            Pilih kode kavling brosur Dehir yang menjadi preferensi Anda (opsional).
          </p>
        </div>

        <div className="max-w-xs">
          <select
            id="kavlingCode"
            value={formData.kavlingCode}
            onChange={(e) => setFormData((prev) => ({ ...prev, kavlingCode: e.target.value }))}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm font-medium text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]"
          >
            <option value="">-- Belum ada preferensi kavling --</option>
            {availableUnitCodes.map((code) => (
              <option key={code} value={code}>
                Kavling {code}
              </option>
            ))}
          </select>
        </div>

        {/* Disclaimer Wajib */}
        <div className="mt-3.5 rounded-lg bg-amber-50/70 border border-amber-200/80 p-3.5 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
          <span aria-hidden="true" className="shrink-0 text-sm">ℹ️</span>
          <span>{labels.kavlingCodeNote}</span>
        </div>
      </section>

      {/* 4. Pertanyaan Tambahan (Opsional) */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-neutral-900">
          {labels.additionalQuestions}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="text-xs font-semibold text-neutral-700 block mb-1">
              {labels.name}
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Nama Anda (opsional)"
              className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]"
            />
          </div>

          <div>
            <label htmlFor="usagePurpose" className="text-xs font-semibold text-neutral-700 block mb-1">
              {labels.usagePurpose}
            </label>
            <select
              id="usagePurpose"
              value={formData.usagePurpose}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  usagePurpose: e.target.value as InterestFormData["usagePurpose"],
                }))
              }
              className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]"
            >
              <option value="residential">{labels.usageResidential}</option>
              <option value="office">{labels.usageOffice}</option>
              <option value="other">{labels.usageOther}</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="modificationRequest" className="text-xs font-semibold text-neutral-700 block mb-1">
            {labels.modificationRequest}
          </label>
          <input
            type="text"
            id="modificationRequest"
            value={formData.modificationRequest}
            onChange={(e) => setFormData((prev) => ({ ...prev, modificationRequest: e.target.value }))}
            placeholder="Misal: penambahan kamar tidur, perluasan dapur, dll."
            className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 min-h-[44px]"
          />
        </div>

        <div>
          <label htmlFor="notes" className="text-xs font-semibold text-neutral-700 block mb-1">
            {labels.notes}
          </label>
          <textarea
            id="notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Tuliskan pertanyaan atau informasi lain yang ingin didiskusikan..."
            className="w-full rounded-lg border border-neutral-300 px-3.5 py-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </div>
      </section>

      {/* 5. Submit CTA & Direct WA */}
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
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-neutral-200 px-7 py-3.5 text-sm font-semibold text-neutral-400 cursor-not-allowed min-h-[44px]"
            >
              💬 {labels.submitViaWhatsApp}
            </button>
          ) : (
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-whatsapp px-7 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-whatsapp-hover transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2 active:scale-[0.99]"
            >
              <span aria-hidden="true">💬</span>
              {labels.submitViaWhatsApp}
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
      </div>
    </form>
  );
}
