import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { siteConfig, buildAlternates } from "@/config/site";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { WhatsAppButton } from "@/features/contact/WhatsAppButton";
import { Card } from "@/components/ui/Card";

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
 * Halaman Hubungi Kami — Saluran Komunikasi & Informasi Perusahaan.
 *
 * Memisahkan fungsi kontak umum dari formulir minat:
 * - Halaman ini fokus pada informasi resmi pengembang, jam layanan, saluran WhatsApp marketing, dan FAQ.
 * - Untuk calon pembeli yang ingin memilih preferensi kavling/bangunan, disediakan tautan ke Formulir Minat.
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
          <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Direct Contact & Marketing Action (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Marketing Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-5 transition-all hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  💬
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    {t("marketingTitle")}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {t("serviceHoursValue")}
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
                  className="rounded-lg shadow-sm"
                >
                  {t("chatWhatsApp")}
                </WhatsAppButton>
              </div>
            </div>

            {/* Interest Form Referral Card */}
            <div className="rounded-2xl border border-primary-200 bg-primary-50/60 p-6 sm:p-7 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">📝</span>
                <div>
                  <h3 className="text-base font-semibold text-primary-900">
                    {t("interestFormNotice")}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-primary-800 leading-relaxed">
                    Gunakan Formulir Minat jika Anda ingin mengajukan kode kavling preferensi atau konsultasi tipe bangunan spesifik.
                  </p>
                  <Link
                    href={`/${locale}/interest`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
                  >
                    {t("interestFormCta")}
                    <span aria-hidden="true">→</span>
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
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">
                    {t("faq2Question")}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {t("faq2Answer")}
                  </p>
                </Card>
                <Card className="p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1.5">
                    {t("faq3Question")}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {t("faq3Answer")}
                  </p>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column: Company Credentials & Developer Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-7 space-y-5">
              <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wider text-xs">
                {t("companyInfoTitle")}
              </h2>

              <dl className="space-y-4 divide-y divide-neutral-200 text-sm">
                <div className="pt-3 first:pt-0">
                  <dt className="text-xs text-neutral-400 font-medium">Perusahaan Pengembang</dt>
                  <dd className="mt-1 font-semibold text-neutral-900">{t("companyName")}</dd>
                </div>

                <div className="pt-3">
                  <dt className="text-xs text-neutral-400 font-medium">{t("officeLocation")}</dt>
                  <dd className="mt-1 font-semibold text-neutral-900">{t("officeLocationValue")}</dd>
                </div>

                <div className="pt-3">
                  <dt className="text-xs text-neutral-400 font-medium">{t("serviceHours")}</dt>
                  <dd className="mt-1 font-semibold text-neutral-900">{t("serviceHoursValue")}</dd>
                </div>

                <div className="pt-3">
                  <dt className="text-xs text-neutral-400 font-medium">Saluran Layanan</dt>
                  <dd className="mt-1 text-xs text-neutral-600 leading-relaxed">
                    Komunikasi online dilakukan melalui WhatsApp resmi perusahaan untuk memastikan pencatatan pertanyaan yang transparan.
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
