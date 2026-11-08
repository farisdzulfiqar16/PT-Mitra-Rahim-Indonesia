import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  MessageCircle,
  Users,
  ClipboardList,
  ArrowRight,
  MapPin,
  Navigation,
  ExternalLink,
} from "lucide-react";
import {
  siteConfig,
  buildAlternates,
  formatProjectAddress,
  buildGoogleMapsUrl,
} from "@/config/site";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { Card } from "@/components/ui/Card";
import { getProjectBySlug } from "@/services";

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

  const title = t("contactTitle");
  const description = t("contactDescription");
  const alternates = buildAlternates("/contact", locale);

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
 * Halaman Hubungi Kami — Saluran Komunikasi Resmi & Informasi Perusahaan.
 *
 * Memenuhi spesifikasi Batch 1:
 * - Jam operasional ringkas: Senin–Jumat resmi (08.30–17.00 WIB).
 * - Sabtu (08.30–12.00 WIB) & Minggu/Libur (Tutup) ditandai transparan sebagai usulan sementara.
 * - Informasi pertemuan dengan Owner PT Mitra Rahim Indonesia melalui kontak resmi brosur.
 * - Pemisahan tegas antara Alamat Kantor Perusahaan (pending) vs Lokasi Kawasan Proyek.
 * - FAQ dengan penandaan butuh ketetapan manajemen pada topik yang relevan.
 */
export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contactPage");
  const tNav = await getTranslations("nav");
  const tWa = await getTranslations("whatsapp");

  const dehirProject = await getProjectBySlug("dehir");
  const dehirAddress = dehirProject ? formatProjectAddress(dehirProject.location) : "";
  const dehirMapsUrl = dehirProject ? buildGoogleMapsUrl(dehirProject.location) : undefined;

  return (
    <div className="flex flex-col">
      {/* Page Header — Cream background */}
      <div className="bg-[#F5F2EC] px-4 py-8 sm:px-6 lg:px-8 border-b border-neutral-200/80">
        <div className="mx-auto max-w-7xl animate-fade-in-up">
          <Breadcrumb
            items={[
              { label: tNav("home"), href: `/${locale}` },
              { label: t("title") },
            ]}
            className="mb-3"
          />
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-neutral-600 max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Direct Contact, Owner Meeting & FAQs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Marketing Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-5 transition-all hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <MessageCircle className="h-6 w-6 stroke-[2]" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    {t("marketingTitle")}
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">
                    {t("serviceHoursWeekdays")}
                  </p>
                </div>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed">
                {t("marketingDesc")}
              </p>

              <div className="pt-2">
                <WhatsAppButton
                  locale={locale as "id" | "en"}
                  context="homepage"
                  variant="primary"
                  disabledMessage={tWa("disabled")}
                  className="rounded-lg shadow-sm min-h-[44px]"
                >
                  {t("chatWhatsApp")}
                </WhatsAppButton>
              </div>
            </div>

            {/* Owner Meeting Information Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 shadow-xs space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                  <Users className="h-5 w-5 stroke-[2]" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-neutral-900">
                    {t("ownerMeetingTitle")}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {t("ownerMeetingDesc")}
                  </p>
                  <p className="text-[11px] text-neutral-500 italic">
                    {locale === "en"
                      ? "* Meeting schedules are arranged in advance based on mutual agreement and management availability."
                      : "* Jadwal pertemuan diatur lebih awal sesuai kesepakatan dan ketersediaan waktu manajemen."}
                  </p>
                </div>
              </div>
            </div>

            {/* Interest Form Referral Card */}
            <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-6 sm:p-7 space-y-3">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                  <ClipboardList className="h-5 w-5 stroke-[2]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-primary-900">
                    {t("interestFormNotice")}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-primary-800 leading-relaxed">
                    {locale === "en"
                      ? "Submit your plot preferences, housing type, or detailed site survey schedule through our structured consultation form."
                      : "Sampaikan preferensi kavling, tipe hunian, atau jadwal survei lokasi secara rinci melalui formulir konsultasi terstruktur kami."}
                  </p>
                  <Link
                    href={`/${locale}/interest`}
                    className="mt-3.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors min-h-[44px]"
                  >
                    <span>{t("interestFormCta")}</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="pt-4 space-y-4">
              <h2 className="text-lg font-bold text-neutral-900">
                {t("faqTitle")}
              </h2>
              <div className="space-y-3">
                <Card className="p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">
                    {t("faq1Question")}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {t("faq1Answer")}
                  </p>
                </Card>

                <Card className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {t("faq2Question")}
                    </h3>
                    <span className="shrink-0 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                      {t("faqPendingBadge")}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {t("faq2Answer")}
                  </p>
                </Card>

                <Card className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {t("faq3Question")}
                    </h3>
                    <span className="shrink-0 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                      {t("faqPendingBadge")}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {t("faq3Answer")}
                  </p>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column: Company Credentials, Hours & Location Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-7 space-y-5">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                {t("companyInfoTitle")}
              </h2>

              <dl className="space-y-4 divide-y divide-neutral-200 text-sm">
                {/* Perusahaan Pengembang */}
                <div className="pt-3 first:pt-0">
                  <dt className="text-xs text-neutral-500 font-medium">{t("companyLabel")}</dt>
                  <dd className="mt-1 font-semibold text-neutral-900">{t("companyName")}</dd>
                </div>

                {/* Alamat Kantor Perusahaan — Ditandai Pending */}
                <div className="pt-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-neutral-500 font-medium">{t("officeAddressLabel")}</dt>
                    <span className="rounded bg-neutral-200/80 px-1.5 py-0.5 text-[10px] font-medium text-neutral-700">
                      {t("pendingBadge")}
                    </span>
                  </div>
                  <dd className="mt-1 font-semibold text-neutral-800">
                    {t("officeAddressValue")}
                  </dd>
                  <p className="mt-1 text-[11px] text-neutral-500 leading-normal">
                    {t("officeAddressNote")}
                  </p>
                </div>

                {/* Lokasi Kawasan Proyek — Dipisahkan dengan tegas */}
                <div className="pt-3">
                  <dt className="text-xs text-neutral-500 font-medium">{t("projectLocationLabel")}</dt>
                  <dd className="mt-1 font-semibold text-neutral-900 flex items-start gap-1.5">
                    <MapPin className="h-4 w-4 text-primary-700 shrink-0 stroke-[1.75] mt-0.5" aria-hidden="true" />
                    <span>{dehirAddress || t("projectLocationValue")}</span>
                  </dd>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {t("projectLocationDisclaimer")}
                  </p>
                  {dehirMapsUrl && (
                    <div className="mt-2.5">
                      <a
                        href={dehirMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                      >
                        <Navigation className="h-3.5 w-3.5 stroke-[2]" aria-hidden="true" />
                        <span>{locale === "en" ? "View Location on Google Maps" : "Lihat Lokasi di Google Maps"}</span>
                        <ExternalLink className="h-3 w-3 stroke-[2] opacity-75" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Rincian Jam Operasional Pelayanan */}
                <div className="pt-4 space-y-3">
                  <dt className="text-xs text-neutral-500 font-medium">
                    {t("serviceHoursTitle")}
                  </dt>
                  <dd className="space-y-2">
                    {/* Senin - Jumat */}
                    <div className="flex items-center justify-between rounded-lg bg-white border border-neutral-200/80 p-2.5 text-xs">
                      <div>
                        <span className="font-semibold text-neutral-900 block">
                          {t("mondayFriday")}
                        </span>
                        <span className="text-neutral-600 text-[11px]">08.30 – 17.00 WIB</span>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                        {t("statusOfficial")}
                      </span>
                    </div>

                    {/* Sabtu */}
                    <div className="flex items-center justify-between rounded-lg bg-white border border-neutral-200/80 p-2.5 text-xs">
                      <div>
                        <span className="font-semibold text-neutral-800 block">
                          {t("saturday")}
                        </span>
                        <span className="text-neutral-600 text-[11px]">08.30 – 12.00 WIB</span>
                      </div>
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                        {t("proposalBadge")}
                      </span>
                    </div>

                    {/* Minggu & Hari Libur Nasional */}
                    <div className="flex items-center justify-between rounded-lg bg-white border border-neutral-200/80 p-2.5 text-xs">
                      <div>
                        <span className="font-semibold text-neutral-800 block">
                          {t("sundayHolidays")}
                        </span>
                        <span className="text-neutral-500 text-[11px]">{t("closed")}</span>
                      </div>
                      <span className="rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                        {t("proposalBadge")}
                      </span>
                    </div>

                    {/* Catatan usulan operasional */}
                    <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-3 text-[11px] text-amber-900 leading-relaxed">
                      {t("serviceHoursNotice")}
                    </div>
                  </dd>
                </div>

                {/* Saluran Layanan */}
                <div className="pt-3">
                  <dt className="text-xs text-neutral-500 font-medium">{t("channelTitle")}</dt>
                  <dd className="mt-1 text-xs text-neutral-600 leading-relaxed">
                    {t("channelDesc")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
