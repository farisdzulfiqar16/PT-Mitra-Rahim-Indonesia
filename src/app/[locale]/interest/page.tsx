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
 * Halaman Formulir Minat — Khusus untuk Proyek Celestia Dehir (Jatiluhur).
 *
 * Memenuhi spesifikasi Task 16:
 * - Mengumpulkan preferensi awal calon pembeli (kavling saja vs kavling+bangunan).
 * - Tidak ada proses booking atau pembayaran di tahap ini.
 * - Mengirimkan data minat langsung via WhatsApp tanpa penyimpanan backend.
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

  // Ambil kode kavling resmi Dehir dari service layer
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
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              {tForm("title")}
            </h1>
            <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-0.5 text-xs font-semibold text-primary-800">
              Jatiluhur
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl leading-relaxed">
            Sampaikan preferensi kavling dan tipe bangunan yang Anda minati. Tim pemasaran kami akan menindaklanjuti untuk konfirmasi detail dan konsultasi lebih lanjut.
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
            propertyTypeRequired: tForm("propertyTypeRequired"),
            kavlingOnly: tForm("kavlingOnly"),
            kavlingBuilding: tForm("kavlingBuilding"),
            kavlingCode: tForm("kavlingCode"),
            kavlingCodeNote: tForm("kavlingCodeNote"),
            buildingType: tForm("buildingType"),
            type1Lantai: tForm("type1Lantai"),
            type1LantaiPromo: tForm("type1LantaiPromo"),
            undecided: tForm("undecided"),
            additionalQuestions: tForm("additionalQuestions"),
            name: tForm("name"),
            usagePurpose: tForm("usagePurpose"),
            usageResidential: tForm("usageResidential"),
            usageOffice: tForm("usageOffice"),
            usageOther: tForm("usageOther"),
            modificationRequest: tForm("modificationRequest"),
            notes: tForm("notes"),
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
