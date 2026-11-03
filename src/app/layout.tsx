import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

/**
 * Font utama: Geist Sans dari Google Fonts.
 * Geist Mono tidak digunakan di halaman marketing, hanya jika dibutuhkan nanti.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Metadata default untuk semua halaman.
 * Setiap halaman dapat meng-override ini menggunakan `export const metadata`
 * atau fungsi `generateMetadata()`.
 */
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    // Format: "Nama Halaman | Celestia"
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  // TODO: tambahkan openGraph dan twitter setelah domain tersedia
};

/**
 * Root Layout — dibungkus di semua halaman.
 *
 * Catatan:
 * - `lang="id"` karena Bahasa Indonesia adalah default.
 * - Implementasi bilingual (i18n) akan menggantikan layout ini di iterasi berikutnya.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
