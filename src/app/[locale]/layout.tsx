import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import { siteConfig, seoConfig } from "@/config/site";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { locales } from "@/i18n/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/**
 * Font utama: Geist Sans dari Google Fonts.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/** Generate static params untuk locale yang didukung */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Metadata default untuk semua halaman */
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  /**
   * metadataBase: hanya ditetapkan jika siteUrl sudah dikonfirmasi.
   * Jika kosong, Next.js tidak mengeluarkan URL absolut untuk canonical/og:url.
   */
  ...(seoConfig.siteUrl
    ? { metadataBase: new URL(seoConfig.siteUrl) }
    : {}),
  /**
   * Robots: noindex, nofollow selama prototype.
   * Aktifkan indexing hanya setelah domain dan konten dikonfirmasi perusahaan.
   */
  robots: seoConfig.indexingEnabled
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

/**
 * Root Layout untuk locale routing.
 * Setiap halaman di bawah /[locale]/ mewarisi layout ini.
 */
/**
 * Structured data JSON-LD — Organization + WebSite.
 *
 * Hanya menggunakan data yang sudah diketahui dan aman:
 * - Nama perusahaan: PT Mitra Rahim Indonesia.
 * - Nama website: Celestia.
 * - url dan sameAs: dikosongkan sampai domain resmi dikonfirmasi.
 *
 * Data yang TIDAK dimasukkan karena belum dikonfirmasi:
 * - Alamat kantor (address), nomor telepon, logo URL, URL media sosial.
 */
function buildStructuredData(): string {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.company,
    brand: { "@type": "Brand", name: siteConfig.name },
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.tagline,
    inLanguage: ["id", "en"],
    ...(seoConfig.siteUrl ? { url: seoConfig.siteUrl } : {}),
  };
  // Hardening: escape karakter '<' sebagai '\u003c' untuk mencegah potensi script-breakout XSS
  return JSON.stringify([orgSchema, websiteSchema]).replace(/</g, "\\u003c");
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validasi locale — 404 jika tidak dikenali
  if (!hasLocale(locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        {/* Structured data JSON-LD — Organization + WebSite schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildStructuredData() }} />
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
