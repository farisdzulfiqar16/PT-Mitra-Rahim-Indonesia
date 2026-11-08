import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig, buildAlternates } from "@/config/site";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { InterestForm } from "@/features/contact/InterestForm";
import { getUnitsByProject } from "@/services";

const OG_LOCALE: Record<string, string> = {
  id: "id_ID",
  en: "en_US",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const ogLocale = OG_LOCALE[locale] ?? "id_ID";

  const title = t("interestTitle");
  const description = t("interestDescription");
  const alternates = buildAlternates("/interest", locale);

  return {
    title,
    description,
    alternates: alternates ?? undefined,
    openGraph: {
      title,
      description,
      type: "website",
      locale: ogLocale,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/**
 * Halaman Formulir Minat & Konsultasi — Portal Properti Celestia.
 *
 * Memenuhi spesifikasi Batch 1:
 * - Tidak terikat permanen pada proyek tunggal (mendukung Dehir, Pabuaran, dan Umum).
 * - Menerima parameter URL (?project=...&unit=...) secara otomatis.
 * - Pemilihan kategori topik konsultasi (harga, ketersediaan, survei, dsb).
 * - Kode kavling opsional dengan disclaimer transparan (bukan booking/reservasi).
 * - Pengiriman melalui WhatsApp resmi tanpa backend/database.
 */
export default async function InterestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tForm = await getTranslations("form");
  const tNav = await getTranslations("nav");
  const tWa = await getTranslations("whatsapp");

  // Ambil kode kavling resmi Dehir dari service layer untuk opsi referensi
  const dehirUnits = await getUnitsByProject("dehir");
  const availableUnitCodes = dehirUnits.map((u) => u.unitCode);

  return (
    <div className="flex flex-col">
      {/* Header — Cream background */}
      <div className="bg-[#F5F2EC] px-4 py-8 sm:px-6 lg:px-8 border-b border-neutral-200/80">
        <div className="mx-auto max-w-4xl animate-fade-in-up">
          <Breadcrumb
            items={[
              { label: tNav("home"), href: `/${locale}` },
              { label: tForm("title") },
            ]}
            className="mb-3"
          />
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            {tForm("title")}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
            {tForm("subtitle")}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <InterestForm
          locale={locale}
          availableUnitCodes={availableUnitCodes}
          labels={{
            title: tForm("title"),
            subtitle: tForm("subtitle"),
            projectSectionTitle: tForm("projectSectionTitle"),
            projectSelectLabel: tForm("projectSelectLabel"),
            projectDehir: tForm("projectDehir"),
            projectPabuaran: tForm("projectPabuaran"),
            projectGeneral: tForm("projectGeneral"),
            consultationCategoryTitle: tForm("consultationCategoryTitle"),
            consultationCategorySubtitle: tForm("consultationCategorySubtitle"),
            catPrice: tForm("catPrice"),
            catAvailability: tForm("catAvailability"),
            catSurvey: tForm("catSurvey"),
            catBuilding: tForm("catBuilding"),
            catDesign: tForm("catDesign"),
            catOther: tForm("catOther"),
            preferencesTitle: tForm("preferencesTitle"),
            propertyTypeLabel: tForm("propertyTypeLabel"),
            kavlingOnly: tForm("kavlingOnly"),
            kavlingBuilding: tForm("kavlingBuilding"),
            propertyUndecided: tForm("propertyUndecided"),
            kavlingCodeLabel: tForm("kavlingCodeLabel"),
            kavlingCodePlaceholder: tForm("kavlingCodePlaceholder"),
            kavlingCodeNote: tForm("kavlingCodeNote"),
            buildingTypeLabel: tForm("buildingTypeLabel"),
            type1Lantai: tForm("type1Lantai"),
            type1LantaiPromo: tForm("type1LantaiPromo"),
            undecided: tForm("undecided"),
            clientDetailsTitle: tForm("clientDetailsTitle"),
            name: tForm("name"),
            namePlaceholder: tForm("namePlaceholder"),
            notes: tForm("notes"),
            notesPlaceholder: tForm("notesPlaceholder"),
            submitViaWhatsApp: tForm("submitViaWhatsApp"),
            directWhatsApp: tForm("directWhatsApp"),
            clientNotice: tForm("clientNotice"),
            waDisabled: tWa("disabled"),
          }}
        />
      </div>
    </div>
  );
}
